"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Character } from "@/data/characters"
import { CorrectBurst } from "@/components/ui/CorrectBurst"
import { haptics } from "@/utils/haptics"

interface MorphStateProps {
  character: Character
  onComplete: () => void
}

export function MorphState({ character, onComplete }: MorphStateProps) {
  const forms = character.positionalForms
  const [formIndex, setFormIndex] = useState(0)
  const [input, setInput] = useState("")
  const [flash, setFlash] = useState<"correct" | null>(null)

  const currentForm = forms[formIndex]

  const handleInput = (value: string) => {
    setInput(value)
    const trimmed = value.trim().toLowerCase()
    if (trimmed === currentForm.roman.replace(/-/g, "").toLowerCase()) {
      setFlash("correct")
      haptics.correct()
      setTimeout(() => {
        setFlash(null)
        setInput("")
        if (formIndex + 1 >= forms.length) {
          onComplete()
        } else {
          setFormIndex((i) => i + 1)
        }
      }, 500)
    }
  }

  return (
    <div className="flex flex-col items-center gap-6 px-5 pt-4 pb-8">
      <p className="text-text-muted text-sm text-center">Same letter, different positions</p>

      {/* Form display card */}
      <div
        className="relative w-full rounded-2xl flex flex-col items-center justify-center gap-2 py-8"
        style={{ background: "oklch(16% 0.02 60)", minHeight: "180px" }}
      >
        {flash === "correct" && <CorrectBurst />}
        <AnimatePresence mode="wait">
          <motion.div
            key={formIndex}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.25 }}
            className="flex flex-col items-center gap-2"
          >
            <motion.span
              className="urdu"
              animate={{
                color: flash === "correct" ? "oklch(65% 0.15 145)" : "oklch(72% 0.12 75)",
              }}
              style={{ fontSize: "80px" }}
            >
              {currentForm.urdu}
            </motion.span>
            <span
              className="font-mono text-xs uppercase tracking-widest px-3 py-1 rounded-full"
              style={{
                color: "oklch(72% 0.12 75 / 70%)",
                background: "oklch(72% 0.12 75 / 10%)",
              }}
            >
              {currentForm.form}
            </span>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Progress dots for form index */}
      <div className="flex gap-2">
        {forms.map((_, i) => (
          <div
            key={i}
            className="rounded-full transition-all duration-300"
            style={{
              width: i === formIndex ? "20px" : "8px",
              height: "8px",
              background:
                i < formIndex
                  ? "oklch(72% 0.12 75)"
                  : i === formIndex
                  ? "oklch(72% 0.12 75)"
                  : "oklch(95% 0.01 75 / 15%)",
            }}
          />
        ))}
      </div>

      {/* Input */}
      <div className="w-full">
        <label className="text-text-muted text-xs block mb-2 text-center">
          Type the sound of this form
        </label>
        <input
          type="text"
          value={input}
          onChange={(e) => handleInput(e.target.value)}
          placeholder={`e.g. ${currentForm.roman.replace(/-/g, "")}`}
          autoFocus
          className="w-full bg-transparent border border-gold/30 rounded-xl px-4 py-3 text-text-primary focus:outline-none focus:border-gold text-center font-mono text-xl min-h-[52px]"
          style={{
            borderColor: flash === "correct" ? "oklch(65% 0.15 145)" : undefined,
          }}
        />
      </div>
    </div>
  )
}
