"use client"

import { useEffect, useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"
import { WORDS, Word } from "@/data/words"
import { CHARACTERS } from "@/data/characters"
import { useProgressStore } from "@/store/progressStore"
import { TypingInput } from "./TypingInput"
import { AudioButton } from "@/components/ui/AudioButton"
import { IPABadge } from "@/components/ui/IPABadge"
import { ImageReveal } from "@/components/ui/ImageReveal"
import { track } from "@/utils/analytics"

type Phase = "show" | "type" | "reveal"

interface WordResult {
  wordId: string
  accuracy: number
}

const SESSION_SIZE = 10

export function WordSession() {
  const router = useRouter()
  const { wordProgress, markWordTyped, updateStreak } = useProgressStore()

  useEffect(() => {
    track("session_started", { level: "2" })
  }, [])

  const sessionWords = useMemo((): Word[] => {
    const reviewed = WORDS.filter((w) => {
      const p = wordProgress[w.id]
      if (!p) return false
      return new Date(p.sm2.nextReviewDate) <= new Date()
    }).slice(0, 3)

    const reviewedIds = new Set(reviewed.map((w) => w.id))
    const newWords = WORDS.filter(
      (w) => !wordProgress[w.id] && !reviewedIds.has(w.id),
    ).slice(0, SESSION_SIZE - reviewed.length)

    return [...reviewed, ...newWords].slice(0, SESSION_SIZE)
  }, [wordProgress])

  const [wordIndex, setWordIndex] = useState(0)
  const [phase, setPhase] = useState<Phase>("show")
  const [results, setResults] = useState<WordResult[]>([])
  const [lastAccuracy, setLastAccuracy] = useState(0)
  const [done, setDone] = useState(false)

  const currentWord = sessionWords[wordIndex]

  const handleTypingComplete = (accuracy: number) => {
    setLastAccuracy(accuracy)
    markWordTyped(currentWord.id, accuracy)
    setResults((r) => [...r, { wordId: currentWord.id, accuracy }])
    setPhase("reveal")
  }

  const handleNext = () => {
    if (wordIndex + 1 >= sessionWords.length) {
      updateStreak()
      track("session_complete", { level: "2", items: String(results.length + 1) })
      setDone(true)
    } else {
      setWordIndex((i) => i + 1)
      setPhase("show")
    }
  }

  if (done || sessionWords.length === 0) {
    const avgAccuracy =
      results.length > 0
        ? Math.round(results.reduce((s, r) => s + r.accuracy, 0) / results.length)
        : 0
    const newLearned = results.filter((r, i) => !wordProgress[sessionWords[i]?.id ?? ""])
      .length

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center gap-6 py-10 px-4"
      >
        <p className="text-gold text-4xl">{avgAccuracy >= 85 ? "🌟" : "📚"}</p>
        <h2 className="text-text-primary text-2xl font-medium text-center">
          {avgAccuracy >= 85 ? "Great session!" : "Keep going!"}
        </h2>
        <div className="flex gap-8 text-center">
          <div>
            <p className="text-gold text-3xl font-mono">{results.length}/{SESSION_SIZE}</p>
            <p className="text-text-muted text-xs mt-1">words done</p>
          </div>
          <div>
            <p className="text-teal text-3xl font-mono">{avgAccuracy}%</p>
            <p className="text-text-muted text-xs mt-1">avg accuracy</p>
          </div>
          <div>
            <p className="text-purple text-3xl font-mono">{newLearned}</p>
            <p className="text-text-muted text-xs mt-1">new today</p>
          </div>
        </div>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => router.push("/home")}
          className="mt-4 px-10 py-3 rounded-xl bg-gold text-background font-medium min-h-[44px]"
        >
          Back to home
        </motion.button>
      </motion.div>
    )
  }

  return (
    <div className="flex flex-col items-center gap-6 py-6 px-4 w-full max-w-md mx-auto">
      {/* Progress bar */}
      <div className="w-full h-1 rounded-full" style={{ background: "oklch(95% 0.01 75 / 10%)" }}>
        <div
          className="h-full rounded-full transition-all duration-300"
          style={{
            width: `${(wordIndex / sessionWords.length) * 100}%`,
            background: "oklch(72% 0.12 75)",
          }}
        />
      </div>

      <AnimatePresence mode="wait">
        {phase === "show" && (
          <motion.div
            key={`show-${wordIndex}`}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex flex-col items-center gap-4 w-full"
          >
            <span className="urdu text-text-primary" style={{ fontSize: "64px" }}>
              {currentWord.urdu}
            </span>
            <AudioButton filename={currentWord.audioFile} size="md" autoPlay />
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setPhase("type")}
              className="px-8 py-3 rounded-xl border border-gold/40 text-gold min-h-[44px]"
            >
              Type it →
            </motion.button>
          </motion.div>
        )}

        {phase === "type" && (
          <motion.div
            key={`type-${wordIndex}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center gap-8 w-full"
          >
            <span className="urdu text-text-primary" style={{ fontSize: "64px" }}>
              {currentWord.urdu}
            </span>
            <TypingInput
              target={currentWord.roman}
              onComplete={handleTypingComplete}
            />
          </motion.div>
        )}

        {phase === "reveal" && (
          <motion.div
            key={`reveal-${wordIndex}`}
            initial={{ opacity: 0, rotateX: -90 }}
            animate={{ opacity: 1, rotateX: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col items-center gap-4 w-full"
          >
            <div
              className="w-full rounded-2xl px-5 py-5 flex flex-col items-center gap-3"
              style={{
                background: "oklch(16% 0.02 60)",
                border: "1px solid oklch(72% 0.12 75 / 18%)",
              }}
            >
              <span className="urdu text-gold leading-none" style={{ fontSize: "56px" }}>
                {currentWord.urdu}
              </span>
              <div className="flex flex-col items-center gap-2">
                <p className="text-text-primary text-2xl text-center">
                  {currentWord.english}
                </p>
                <IPABadge roman={currentWord.roman} ipa={currentWord.ipa} />
              </div>
              <ImageReveal
                imagePath={`/assets/images/words/${currentWord.imageFile}`}
                alt={currentWord.english}
                compact
              />
            </div>

            {/* Character breakdown — reversed so chips flow right-to-left, matching the word above */}
            <div className="flex flex-wrap gap-2 justify-center pt-1" style={{ flexDirection: "row-reverse" }}>
              {currentWord.characterIds.map((cid) => {
                const ch = CHARACTERS.find((c) => c.id === cid)
                if (!ch) return null
                return (
                  <div
                    key={cid}
                    className="px-2 py-1 rounded-lg text-center"
                    style={{ background: "oklch(72% 0.12 75 / 10%)", border: "1px solid oklch(72% 0.12 75 / 20%)" }}
                  >
                    <span className="urdu text-gold block" style={{ fontSize: "24px" }}>
                      {ch.urdu}
                    </span>
                    <span className="text-xs text-text-muted font-mono">{ch.roman}</span>
                  </div>
                )
              })}
            </div>

            <p className="text-text-muted text-sm font-mono">
              accuracy: {lastAccuracy}%
            </p>

            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleNext}
              className="px-10 py-3 rounded-xl bg-gold text-background font-medium min-h-[44px]"
            >
              Next →
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
