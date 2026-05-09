"use client"

import { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Character } from "@/data/characters"
import { WORDS } from "@/data/words"
import { CorrectBurst } from "@/components/ui/CorrectBurst"
import { haptics } from "@/utils/haptics"

interface ExtractionStateProps {
  character: Character
  onComplete: () => void
}

export function ExtractionState({ character, onComplete }: ExtractionStateProps) {
  const [correct, setCorrect] = useState(0)
  const [input, setInput] = useState("")
  const [flash, setFlash] = useState<"correct" | "incorrect" | null>(null)
  const [showMeaning, setShowMeaning] = useState(false)
  const [roundIndex, setRoundIndex] = useState(0)

  const wordsWithChar = useMemo(
    () => {
      const matches = WORDS.filter(
        (w) => w.characterIds.includes(character.id) && w.urdu.includes(character.urdu),
      )
      if (matches.length > 0) return matches
      return [
        {
          id: `anchor-${character.id}`,
          urdu: character.anchor.urdu,
          roman: character.anchor.roman,
          ipa: character.anchor.ipa,
          english: character.anchor.english,
          emoji: character.anchor.emoji,
          sourcePoem: "anchor",
          characterIds: [character.id],
          audioFile: character.anchorAudioFile,
          imageFile: character.anchorImageFile,
          difficulty: 1 as const,
        },
      ]
    },
    [character.id, character.urdu],
  )
  const wordsWithout = useMemo(
    () => WORDS.filter((w) => !w.urdu.includes(character.urdu)),
    [character.urdu],
  )

  const rounds = useMemo(() => {
    const normal = wordsWithChar.slice(0, 3).map((w) => ({ word: w, decoy: false }))
    const decoyWord = wordsWithout[Math.floor(Math.random() * wordsWithout.length)]
    if (decoyWord) normal.push({ word: decoyWord, decoy: true })
    return normal
  }, [wordsWithChar, wordsWithout])

  const currentRound = rounds[roundIndex]

  const advance = () => {
    if (roundIndex + 1 >= rounds.length || correct >= 3) {
      onComplete()
    } else {
      setRoundIndex((i) => i + 1)
      setInput("")
      setFlash(null)
      setShowMeaning(false)
    }
  }

  const handleInput = (value: string) => {
    setInput(value)
    if (value.trim().toLowerCase() === character.roman.toLowerCase()) {
      setFlash("correct")
      setShowMeaning(true)
      haptics.correct()
      setTimeout(() => {
        setCorrect((c) => c + 1)
        advance()
      }, 1000)
    }
  }

  const handleDecoyAnswer = (answer: boolean) => {
    const isCorrect = answer === false
    setFlash(isCorrect ? "correct" : "incorrect")
    if (isCorrect) haptics.correct()
    else haptics.incorrect()
    setTimeout(advance, 800)
  }

  if (!currentRound) return null

  return (
    <div className="flex flex-col gap-6 px-5 pt-4 pb-8">
      <p className="text-text-muted text-sm text-center">Find the letter</p>

      {/* Word display — rendered as a single string to preserve Nastaliq ligatures,
          with the target character called out below */}
      <div
        className="relative w-full rounded-2xl flex flex-col items-center justify-center gap-2 py-5 px-4"
        style={{ background: "oklch(16% 0.02 60)", minHeight: "160px" }}
      >
        {flash === "correct" && <CorrectBurst />}
        <span className="urdu text-text-primary text-center" style={{ fontSize: "48px" }}>
          {currentRound.word.urdu}
        </span>

        <div className="flex items-center gap-3">
          <span className="font-mono text-gold text-sm">{currentRound.word.roman}</span>
          <span className="font-mono text-text-muted text-xs">{currentRound.word.ipa}</span>
        </div>

        {/* Target character callout (non-decoy rounds only) */}
        {!currentRound.decoy && (
          <div className="flex items-center gap-2 mt-1">
            <span className="text-text-muted text-xs">find →</span>
            <span
              className="urdu text-gold px-2 rounded-lg"
              style={{
                fontSize: "28px",
                background: "oklch(72% 0.12 75 / 12%)",
                border: "1px solid oklch(72% 0.12 75 / 30%)",
              }}
            >
              {character.urdu}
            </span>
          </div>
        )}
      </div>

      {/* Input area */}
      {!currentRound.decoy && (
        <div className="flex flex-col items-center gap-3 w-full">
          <label className="text-text-muted text-sm">
            What sound does{" "}
            <span className="urdu text-gold" style={{ fontSize: "20px" }}>{character.urdu}</span>
            {" "}make?
          </label>
          <input
            type="text"
            value={input}
            onChange={(e) => handleInput(e.target.value)}
            placeholder={`e.g. ${character.roman}`}
            autoFocus
            className="w-full bg-transparent border border-gold/30 rounded-xl px-4 py-3 text-text-primary focus:outline-none focus:border-gold text-center font-mono text-xl min-h-[52px]"
            style={{
              borderColor:
                flash === "correct"
                  ? "oklch(65% 0.15 145)"
                  : flash === "incorrect"
                  ? "oklch(60% 0.2 25)"
                  : undefined,
            }}
          />
          <AnimatePresence>
            {showMeaning && (
              <motion.p
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-teal text-sm"
              >
                {currentRound.word.english}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Decoy: yes/no question */}
      {currentRound.decoy && (
        <div className="flex flex-col items-center gap-4 w-full">
          <p className="text-text-primary text-center text-sm">
            Does this word contain{" "}
            <span className="urdu text-gold" style={{ fontSize: "22px" }}>{character.urdu}</span>
            {" "}(<span className="font-mono text-gold">{character.roman}</span>)?
          </p>
          <div className="flex gap-3 w-full">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => handleDecoyAnswer(true)}
              className="flex-1 py-4 rounded-2xl text-text-primary font-medium min-h-[52px]"
              style={{ border: "1px solid oklch(95% 0.01 75 / 20%)", background: "oklch(16% 0.02 60)" }}
            >
              Yes
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => handleDecoyAnswer(false)}
              className="flex-1 py-4 rounded-2xl text-teal font-medium min-h-[52px]"
              style={{ border: "1px solid oklch(68% 0.08 175 / 40%)", background: "oklch(16% 0.02 60)" }}
            >
              No
            </motion.button>
          </div>
        </div>
      )}
    </div>
  )
}
