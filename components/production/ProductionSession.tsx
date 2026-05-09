"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { UrduKeyboard } from "@/components/keyboard/UrduKeyboard"
import { AudioButton } from "@/components/ui/AudioButton"
import { CorrectBurst } from "@/components/ui/CorrectBurst"
import { PRODUCTION_PROMPTS } from "@/data/productionPrompts"
import { useProgressStore } from "@/store/progressStore"
import { compareUrdu, ComparisonResult } from "@/utils/urduComparison"
import { track } from "@/utils/analytics"

type Phase = "type" | "result"

export function ProductionSession() {
  const router = useRouter()
  const { markProductionAttempt, updateStreak } = useProgressStore()
  const [index, setIndex] = useState(0)
  const [input, setInput] = useState("")
  const [phase, setPhase] = useState<Phase>("type")
  const [result, setResult] = useState<ComparisonResult | null>(null)
  const [accuracies, setAccuracies] = useState<number[]>([])

  const prompt = PRODUCTION_PROMPTS[index]

  useEffect(() => {
    track("session_started", { level: "5" })
  }, [])

  const submit = () => {
    if (!input.trim()) return
    const comparison = compareUrdu(input, prompt.urdu)
    setResult(comparison)
    setAccuracies((items) => [...items, comparison.accuracy])
    markProductionAttempt(prompt.id, comparison.accuracy)
    track("production_attempt", { correct: String(comparison.correct) })
    setPhase("result")
  }

  const next = () => {
    if (index + 1 >= PRODUCTION_PROMPTS.length) {
      updateStreak()
      track("session_complete", { level: "5", items: String(PRODUCTION_PROMPTS.length) })
      track("level_completed", { level: "5" })
      router.push("/home?completed=production")
      return
    }
    setIndex((value) => value + 1)
    setInput("")
    setResult(null)
    setPhase("type")
  }

  const avg = accuracies.length
    ? Math.round(accuracies.reduce((sum, value) => sum + value, 0) / accuracies.length)
    : 0

  return (
    <main className="min-h-dvh max-w-md mx-auto flex flex-col">
      <div className="px-5 pt-5">
        <div className="flex justify-between text-xs text-text-muted">
          <span className="font-mono">{index + 1}/{PRODUCTION_PROMPTS.length}</span>
          <span>Level 5 · Writing</span>
        </div>
        <div className="mt-2 h-1 rounded-full" style={{ background: "oklch(95% 0.01 75 / 10%)" }}>
          <div
            className="h-full rounded-full transition-all"
            style={{
              width: `${(index / PRODUCTION_PROMPTS.length) * 100}%`,
              background: "oklch(72% 0.12 75)",
            }}
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        {phase === "type" && (
          <motion.div
            key={`type-${prompt.id}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex-1 flex flex-col justify-center px-5 gap-7"
          >
            <div className="text-center">
              <p className="text-text-primary text-3xl">{prompt.english}</p>
              <p className="text-text-muted text-xs mt-2">from {prompt.source}</p>
            </div>

            <div
              className="min-h-[112px] rounded-2xl px-4 py-4 flex items-center justify-center"
              style={{
                background: "oklch(16% 0.02 60)",
                border: "1px solid oklch(72% 0.12 75 / 20%)",
              }}
            >
              <span className="urdu text-gold text-center" style={{ fontSize: "38px" }}>
                {input || " "}
              </span>
            </div>

            {input.trim() && (
              <button
                onClick={submit}
                className="w-full py-3 rounded-xl bg-gold text-background font-medium min-h-[44px]"
              >
                Submit
              </button>
            )}
          </motion.div>
        )}

        {phase === "result" && result && (
          <motion.div
            key={`result-${prompt.id}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="relative flex-1 flex flex-col justify-center px-5 gap-5 text-center"
          >
            {result.correct && <CorrectBurst />}
            <p className="text-text-primary text-2xl">
              {result.correct ? "Correct" : "Close"}
            </p>
            <p className="font-mono text-teal text-4xl">{result.accuracy}%</p>
            <div>
              <p className="text-text-muted text-xs mb-1">your answer</p>
              <p className="urdu text-text-muted" style={{ fontSize: "34px" }}>
                {input}
              </p>
            </div>
            <div>
              <p className="text-text-muted text-xs mb-1">correct answer</p>
              <p className="urdu text-gold" style={{ fontSize: "40px" }}>
                {prompt.urdu}
              </p>
            </div>
            {prompt.audioFile && <AudioButton filename={prompt.audioFile} size="md" autoPlay />}
            <button
              onClick={next}
              className="w-full py-3 rounded-xl bg-gold text-background font-medium min-h-[44px]"
            >
              {index + 1 >= PRODUCTION_PROMPTS.length ? `Finish · ${avg}% avg` : "Next →"}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {phase === "type" && (
        <UrduKeyboard
          onChar={(char) => setInput((value) => value + char)}
          onBackspace={() => setInput((value) => value.slice(0, -1))}
          onSpace={() => setInput((value) => `${value} `)}
        />
      )}
    </main>
  )
}
