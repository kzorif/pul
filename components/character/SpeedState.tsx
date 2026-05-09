"use client"

import { useState, useEffect, useRef, useCallback, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Character, CHARACTERS } from "@/data/characters"
import { haptics } from "@/utils/haptics"

interface SpeedStateProps {
  character: Character
  onComplete: (correct?: boolean) => void
}

interface StreamChar {
  id: number
  char: string
  isTarget: boolean
  top: number   // % from top
  left: number  // % from left
}

const TIMER_SECONDS = 30
const SPAWN_INTERVAL_MS = 1600

export function SpeedState({ character, onComplete }: SpeedStateProps) {
  const [timeLeft, setTimeLeft] = useState(TIMER_SECONDS)
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [maxStreak, setMaxStreak] = useState(0)
  const [missed, setMissed] = useState(0)
  const [tapFlash, setTapFlash] = useState<"hit" | "miss" | null>(null)
  const [done, setDone] = useState(false)
  const [streamItems, setStreamItems] = useState<StreamChar[]>([])
  const [ready, setReady] = useState(false)
  const counterRef = useRef(0)
  const scoreRef = useRef(0)

  const foilChars = useMemo(
    () =>
      character.foils
        .map((id) => CHARACTERS.find((c) => c.id === id)?.urdu)
        .filter(Boolean) as string[],
    [character.foils],
  )

  const spawnChar = useCallback(() => {
    const isTarget = Math.random() < 0.6
    const char =
      isTarget
        ? character.urdu
        : foilChars.length > 0
        ? foilChars[Math.floor(Math.random() * foilChars.length)]
        : character.urdu
    const id = ++counterRef.current
    const item: StreamChar = {
      id,
      char,
      isTarget,
      top: 15 + Math.random() * 65,
      left: 10 + Math.random() * 75,
    }
    setStreamItems((prev) => [...prev.slice(-10), item])
    // Remove after 2.5s
    setTimeout(() => setStreamItems((prev) => prev.filter((i) => i.id !== id)), 2500)
  }, [character.urdu, foilChars])

  // Countdown before start
  useEffect(() => {
    const t = setTimeout(() => setReady(true), 800)
    return () => clearTimeout(t)
  }, [])

  // Timer — only starts when ready
  useEffect(() => {
    if (!ready) return
    const t = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(t)
          setDone(true)
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(t)
  }, [ready])

  // Spawn loop — starts when ready, spawns immediately then on interval
  useEffect(() => {
    if (!ready || done) return
    spawnChar() // first char appears right away
    const t = setInterval(spawnChar, SPAWN_INTERVAL_MS)
    return () => clearInterval(t)
  }, [ready, done, spawnChar])

  const handleTap = () => {
    if (done || !ready) return
    const hasTarget = streamItems.some((i) => i.isTarget)
    if (hasTarget) {
      const newScore = scoreRef.current + 1
      scoreRef.current = newScore
      setScore(newScore)
      setStreak((s) => {
        const next = s + 1
        setMaxStreak((m) => Math.max(m, next))
        return next
      })
      haptics.light()
      setTapFlash("hit")
      // Remove all target items (you caught them)
      setStreamItems((prev) => prev.filter((i) => !i.isTarget))
    } else {
      setStreak(0)
      setMissed((m) => m + 1)
      haptics.incorrect()
      setTapFlash("miss")
    }
    setTimeout(() => setTapFlash(null), 300)
  }

  const total = score + missed
  const accuracy = total > 0 ? Math.round((score / total) * 100) : 0

  if (done) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center gap-6 py-8 px-4"
      >
        <span className="urdu text-gold" style={{ fontSize: "80px" }}>
          {character.urdu}
        </span>
        <p className="text-text-primary text-xl text-center">
          {accuracy === 100
            ? `Perfect — ${character.roman} is yours`
            : accuracy >= 80
            ? `Great — keep practicing ${character.roman}`
            : `Keep going with ${character.roman}`}
        </p>
        <div className="flex gap-8 text-center">
          <div>
            <p className="text-gold text-3xl font-mono">{accuracy}%</p>
            <p className="text-text-muted text-xs mt-1">accuracy</p>
          </div>
          <div>
            <p className="text-teal text-3xl font-mono">{maxStreak}</p>
            <p className="text-text-muted text-xs mt-1">best streak</p>
          </div>
        </div>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => onComplete(accuracy >= 80)}
          className="px-8 py-3 rounded-xl bg-gold text-background font-medium min-h-[44px]"
        >
          Continue
        </motion.button>
      </motion.div>
    )
  }

  return (
    <div className="flex flex-col gap-3 px-4">
      {/* Header row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-text-muted text-xs">Find</span>
          <span
            className="urdu text-gold px-2 py-0.5 rounded-lg"
            style={{ fontSize: "28px", background: "oklch(72% 0.12 75 / 15%)" }}
          >
            {character.urdu}
          </span>
          <span className="text-text-muted text-xs font-mono">({character.roman})</span>
        </div>
        <span
          className="font-mono text-lg font-medium"
          style={{ color: timeLeft <= 10 ? "oklch(60% 0.2 25)" : "oklch(72% 0.12 75)" }}
        >
          {timeLeft}s
        </span>
      </div>

      {/* Tap arena */}
      <motion.div
        className="relative rounded-2xl overflow-hidden cursor-pointer select-none"
        style={{
          height: "300px",
          background: "oklch(14% 0.02 60)",
          border: "1px solid",
        }}
        animate={{
          borderColor:
            tapFlash === "hit"
              ? "oklch(65% 0.15 145)"
              : tapFlash === "miss"
              ? "oklch(60% 0.2 25)"
              : "oklch(95% 0.01 75 / 12%)",
        }}
        onClick={handleTap}
      >
        {/* Pre-game overlay — show target so user knows what to find */}
        <AnimatePresence>
          {!ready && (
            <motion.div
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex flex-col items-center justify-center gap-3"
            >
              <span className="urdu text-gold" style={{ fontSize: "72px" }}>{character.urdu}</span>
              <p className="text-text-muted text-xs font-mono">find this — get ready…</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating characters */}
        <AnimatePresence>
          {streamItems.map((item) => (
            <motion.span
              key={item.id}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.25 }}
              className="absolute urdu pointer-events-none"
              style={{
                top: `${item.top}%`,
                left: `${item.left}%`,
                fontSize: "48px",
                lineHeight: 1.4,
                color: item.isTarget
                  ? "oklch(95% 0.01 75)"
                  : "oklch(95% 0.01 75 / 35%)",
              }}
            >
              {item.char}
            </motion.span>
          ))}
        </AnimatePresence>

        {/* Tap flash overlay */}
        <AnimatePresence>
          {tapFlash && (
            <motion.div
              key={tapFlash}
              initial={{ opacity: 0.4 }}
              animate={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 rounded-2xl pointer-events-none"
              style={{
                background:
                  tapFlash === "hit"
                    ? "oklch(65% 0.15 145 / 30%)"
                    : "oklch(60% 0.2 25 / 30%)",
              }}
            />
          )}
        </AnimatePresence>

        {/* Bottom instruction */}
        <p className="absolute bottom-3 inset-x-0 text-center text-text-muted text-xs pointer-events-none">
          Tap anywhere when you see{" "}
          <span className="urdu text-gold" style={{ fontSize: "16px" }}>
            {character.urdu}
          </span>
        </p>
      </motion.div>

      {/* Score row */}
      <div className="flex justify-between text-xs font-mono text-text-muted px-1">
        <span>
          <span className="text-teal">{score}</span> hits ·{" "}
          <span style={{ color: "oklch(60% 0.2 25)" }}>{missed}</span> miss
        </span>
        <span>streak {streak}</span>
      </div>
    </div>
  )
}
