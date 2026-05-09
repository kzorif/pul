"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Character, CHARACTERS } from "@/data/characters"
import { AudioButton } from "@/components/ui/AudioButton"
import { CorrectBurst } from "@/components/ui/CorrectBurst"
import { haptics } from "@/utils/haptics"

interface EchoStateProps {
  character: Character
  onComplete: () => void
}

const ROUNDS = 3

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5)
}

export function EchoState({ character, onComplete }: EchoStateProps) {
  const [round, setRound] = useState(1)
  const [options, setOptions] = useState<Character[]>([])
  const [result, setResult] = useState<"correct" | "incorrect" | null>(null)
  const [selectedId, setSelectedId] = useState<number | null>(null)

  const buildOptions = useCallback(() => {
    const foilChars = character.foils
      .map((id) => CHARACTERS.find((c) => c.id === id))
      .filter(Boolean) as Character[]
    const foils = foilChars.slice(0, 2)
    if (foils.length < 2) {
      const extras = CHARACTERS.filter(
        (c) => c.id !== character.id && !character.foils.includes(c.id),
      ).slice(0, 2 - foils.length)
      foils.push(...extras)
    }
    setOptions(shuffle([character, ...foils.slice(0, 2)]))
  }, [character])

  useEffect(() => {
    buildOptions()
  }, [buildOptions, round])

  const handleTap = (c: Character) => {
    if (result) return
    const correct = c.id === character.id
    setSelectedId(c.id)
    setResult(correct ? "correct" : "incorrect")

    if (correct) {
      haptics.correct()
      setTimeout(() => {
        if (round >= ROUNDS) {
          onComplete()
        } else {
          setRound((r) => r + 1)
          setResult(null)
          setSelectedId(null)
        }
      }, 600)
    } else {
      haptics.incorrect()
      setTimeout(() => {
        setResult(null)
        setSelectedId(null)
      }, 800)
    }
  }

  return (
    <div className="flex flex-col gap-8 px-5 pt-4 pb-8">
      {/* Top bar */}
      <div className="flex items-center justify-between">
        <AudioButton filename={character.audioFile} size="md" autoPlay />
        <span className="text-text-muted text-sm font-mono">{round}/{ROUNDS}</span>
      </div>

      <p className="text-text-primary text-lg text-center">
        Which character makes this sound?
      </p>

      {/* Character choice cards — equal width, taller hit area */}
      <div className="flex gap-3 w-full">
        {options.map((opt) => {
          const isSelected = selectedId === opt.id
          const isCorrect = isSelected && result === "correct"
          const isWrong = isSelected && result === "incorrect"

          return (
            <motion.button
              key={opt.id}
              onClick={() => handleTap(opt)}
              whileTap={{ scale: 0.93 }}
              animate={
                isCorrect
                  ? { backgroundColor: "oklch(45% 0.14 145)", borderColor: "oklch(65% 0.15 145)" }
                  : isWrong
                  ? { backgroundColor: "oklch(35% 0.14 25)", borderColor: "oklch(60% 0.2 25)" }
                  : { backgroundColor: "oklch(16% 0.02 60)", borderColor: "oklch(95% 0.01 75 / 15%)" }
              }
              className="flex-1 rounded-2xl border flex items-center justify-center"
              style={{ minHeight: "160px", paddingTop: "20px", paddingBottom: "20px" }}
            >
              {isCorrect && <CorrectBurst />}
              <span className="urdu text-text-primary" style={{ fontSize: "48px" }}>
                {opt.urdu}
              </span>
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}
