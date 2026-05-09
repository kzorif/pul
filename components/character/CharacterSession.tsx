"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { CHARACTERS } from "@/data/characters"
import { useProgressStore } from "@/store/progressStore"
import { AudioButton } from "@/components/ui/AudioButton"
import { CharacterDisplay } from "@/components/ui/CharacterDisplay"
import { EncounterState } from "./EncounterState"
import { EchoState } from "./EchoState"
import { MorphState } from "./MorphState"
import { ExtractionState } from "./ExtractionState"
import { EmotionState } from "./EmotionState"
import { SpeedState } from "./SpeedState"
import { track } from "@/utils/analytics"

interface CharacterSessionProps {
  characterId: number
  isReview?: boolean
  onComplete: () => void
}

const ALL_STATES = [
  EncounterState,
  EchoState,
  MorphState,
  ExtractionState,
  EmotionState,
  SpeedState,
]
const REVIEW_STATES = [1, 3, 5]

export function CharacterSession({
  characterId,
  isReview = false,
  onComplete,
}: CharacterSessionProps) {
  const character = CHARACTERS.find((c) => c.id === characterId)
  const { markCharacterStateComplete, markCharacterCorrect, markCharacterIncorrect } = useProgressStore()

  const stateIndices = isReview ? REVIEW_STATES : [0, 1, 2, 3, 4, 5]
  const [step, setStep] = useState(0)
  const [completed, setCompleted] = useState(false)

  useEffect(() => {
    track("session_started", {
      level: "1",
      mode: isReview ? "review" : "new",
    })
  }, [characterId, isReview])

  if (!character) return null

  const currentStateIndex = stateIndices[step]
  const CurrentState = ALL_STATES[currentStateIndex]

  const handleStateComplete = (sessionCorrect?: boolean) => {
    markCharacterStateComplete(character.id, currentStateIndex)
    if (currentStateIndex === 5) {
      if (sessionCorrect === false) markCharacterIncorrect(character.id)
      else markCharacterCorrect(character.id)
    }
    if (step + 1 >= stateIndices.length) {
      track("character_mastered", { character: character.roman })
      track("session_complete", {
        level: "1",
        items: String(stateIndices.length),
      })
      setCompleted(true)
    } else {
      setStep((s) => s + 1)
    }
  }

  if (completed) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center gap-6 py-12 px-5"
      >
        <CharacterDisplay character={character.urdu} size="xl" />

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-center"
        >
          <p className="text-text-primary text-xl">
            You&apos;ve learned{" "}
            <span className="text-gold font-mono">{character.roman}</span>!
          </p>
          <p className="text-text-muted text-sm mt-2">
            It lives in{" "}
            <span className="urdu text-text-primary" style={{ fontSize: "20px" }}>
              {character.anchor.urdu}
            </span>{" "}
            — {character.anchor.english}
          </p>
        </motion.div>

        <AudioButton filename={character.anchorAudioFile} size="md" />

        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          whileTap={{ scale: 0.95 }}
          onClick={onComplete}
          className="mt-2 px-10 py-3 rounded-2xl bg-gold text-background font-medium text-lg min-h-[44px]"
        >
          Continue
        </motion.button>
      </motion.div>
    )
  }

  return (
    // No horizontal padding here — each state owns its own px
    <div className="flex flex-col w-full max-w-md mx-auto">
      {/* Progress dots */}
      <div className="flex gap-2 justify-center py-4 px-5">
        {stateIndices.map((_, i) => (
          <div
            key={i}
            className="rounded-full transition-all duration-300"
            style={{
              width: i === step ? "20px" : "8px",
              height: "8px",
              background:
                i < step
                  ? "oklch(72% 0.12 75)"
                  : i === step
                  ? "oklch(72% 0.12 75)"
                  : "oklch(95% 0.01 75 / 15%)",
            }}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.2 }}
        >
          <CurrentState character={character} onComplete={handleStateComplete} />
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
