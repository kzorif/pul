"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { AudioButton } from "@/components/ui/AudioButton"
import { IPABadge } from "@/components/ui/IPABadge"
import { ImageReveal } from "@/components/ui/ImageReveal"
import { TypingInput } from "@/components/words/TypingInput"
import { CHARACTERS } from "@/data/characters"
import { WORDS } from "@/data/words"
import { useProgressStore } from "@/store/progressStore"

interface SingleWordReviewProps {
  wordId: string
  onComplete: () => void
}

export function SingleWordReview({ wordId, onComplete }: SingleWordReviewProps) {
  const word = WORDS.find((item) => item.id === wordId)
  const markWordTyped = useProgressStore((state) => state.markWordTyped)
  const [revealed, setRevealed] = useState(false)
  const [accuracy, setAccuracy] = useState(0)

  if (!word) {
    return (
      <div className="px-5 max-w-md mx-auto w-full flex flex-col items-center gap-5">
        <p className="text-text-muted">Word not found.</p>
        <button
          onClick={onComplete}
          className="px-8 py-3 rounded-xl bg-gold text-background font-medium min-h-[44px]"
        >
          Continue
        </button>
      </div>
    )
  }

  return (
    <div className="px-5 max-w-md mx-auto w-full flex flex-col items-center gap-6">
      <AnimatePresence mode="wait">
        {!revealed ? (
          <motion.div
            key="type"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="w-full flex flex-col items-center gap-7"
          >
            <span className="urdu text-text-primary text-center" style={{ fontSize: "64px" }}>
              {word.urdu}
            </span>
            <AudioButton filename={word.audioFile} size="md" autoPlay />
            <TypingInput
              target={word.roman}
              onComplete={(nextAccuracy) => {
                setAccuracy(nextAccuracy)
                markWordTyped(word.id, nextAccuracy)
                setRevealed(true)
              }}
            />
          </motion.div>
        ) : (
          <motion.div
            key="reveal"
            initial={{ opacity: 0, rotateX: -45 }}
            animate={{ opacity: 1, rotateX: 0 }}
            exit={{ opacity: 0 }}
            className="w-full flex flex-col items-center gap-4"
          >
            <span className="urdu text-gold" style={{ fontSize: "56px" }}>
              {word.urdu}
            </span>
            <p className="text-text-primary text-2xl text-center">{word.english}</p>
            <IPABadge roman={word.roman} ipa={word.ipa} />
            <ImageReveal
              imagePath={`/assets/images/words/${word.imageFile}`}
              alt={word.english}
              compact
            />
            <div className="flex flex-wrap gap-2 justify-center" style={{ flexDirection: "row-reverse" }}>
              {word.characterIds.map((cid) => {
                const character = CHARACTERS.find((item) => item.id === cid)
                if (!character) return null
                return (
                  <div
                    key={cid}
                    className="px-2 py-1 rounded-lg text-center"
                    style={{
                      background: "oklch(72% 0.12 75 / 10%)",
                      border: "1px solid oklch(72% 0.12 75 / 20%)",
                    }}
                  >
                    <span className="urdu text-gold block" style={{ fontSize: "24px" }}>
                      {character.urdu}
                    </span>
                    <span className="text-xs text-text-muted font-mono">{character.roman}</span>
                  </div>
                )
              })}
            </div>
            <p className="font-mono text-teal">{accuracy}% accuracy</p>
            <button
              onClick={onComplete}
              className="w-full py-3 rounded-xl bg-gold text-background font-medium min-h-[44px]"
            >
              Continue
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
