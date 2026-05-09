"use client"

import { useEffect, useMemo, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"
import { AudioButton } from "@/components/ui/AudioButton"
import { IPABadge } from "@/components/ui/IPABadge"
import { SOVExplainer } from "@/components/ui/SOVExplainer"
import { TypingInput } from "@/components/words/TypingInput"
import { SENTENCES, Sentence } from "@/data/sentences"
import { useProgressStore } from "@/store/progressStore"
import { track } from "@/utils/analytics"

interface SentenceSessionProps {
  level?: 3 | 4
  sentenceIds?: string[]
  onComplete?: () => void
}

type Phase = "read" | "type" | "reveal"

function sourceLabel(sentence: Sentence) {
  if (sentence.source === "bachon-ki-dua") return "Bachon ki Dua — Allama Iqbal"
  if (sentence.source === "premchand") return "Premchand"
  return "Ismail Merathi"
}

export function SentenceSession({ level = 3, sentenceIds, onComplete }: SentenceSessionProps) {
  const router = useRouter()
  const {
    sentenceProgress,
    markSentenceTyped,
    updateStreak,
    sovExplainerShownLevel3,
    sovExplainerShownLevel4,
    dismissSOVExplainer,
  } = useProgressStore()
  const [index, setIndex] = useState(0)
  const [phase, setPhase] = useState<Phase>("read")
  const [replays, setReplays] = useState(0)
  const [accuracy, setAccuracy] = useState(0)
  const [results, setResults] = useState<number[]>([])
  const [done, setDone] = useState(false)

  const sentences = useMemo(() => {
    const base = sentenceIds
      ? sentenceIds
          .map((id) => SENTENCES.find((sentence) => sentence.id === id))
          .filter(Boolean) as Sentence[]
      : SENTENCES.filter((sentence) => sentence.level === level)
          .sort((a, b) => a.difficulty - b.difficulty)
          .slice(0, 5)
    return base
  }, [level, sentenceIds])

  useEffect(() => {
    track("session_started", { level: String(level) })
  }, [level])

  const sentence = sentences[index]
  const isColdReading = sentence?.level === 4
  const shouldShowSOVExplainer =
    level === 3 ? !sovExplainerShownLevel3 : level === 4 ? !sovExplainerShownLevel4 : false

  const handleTyped = (nextAccuracy: number) => {
    if (!sentence) return
    setAccuracy(nextAccuracy)
    setResults((existing) => [...existing, nextAccuracy])
    markSentenceTyped(sentence.id, nextAccuracy)
    setPhase("reveal")
  }

  const advance = () => {
    if (index + 1 >= sentences.length) {
      updateStreak()
      track("session_complete", { level: String(level), items: String(sentences.length) })
      track("level_completed", { level: String(level) })
      setDone(true)
      onComplete?.()
    } else {
      setIndex((value) => value + 1)
      setPhase("read")
      setReplays(0)
      setAccuracy(0)
    }
  }

  if (!sentence || done) {
    const avg = results.length
      ? Math.round(results.reduce((sum, result) => sum + result, 0) / results.length)
      : 0

    return (
      <div className="min-h-dvh flex flex-col items-center justify-center px-5 gap-6">
        <h1 className="text-text-primary text-2xl font-medium">
          {avg >= 80 ? "Sentences are opening up" : "Keep reading"}
        </h1>
        <div className="flex gap-8 text-center">
          <div>
            <p className="text-gold text-3xl font-mono">{results.length}</p>
            <p className="text-text-muted text-xs">sentences</p>
          </div>
          <div>
            <p className="text-teal text-3xl font-mono">{avg}%</p>
            <p className="text-text-muted text-xs">accuracy</p>
          </div>
        </div>
        <button
          onClick={() => router.push("/home")}
          className="px-8 py-3 rounded-xl bg-gold text-background font-medium min-h-[44px]"
        >
          Back to home
        </button>
      </div>
    )
  }

  return (
    <div
      className="min-h-dvh flex flex-col max-w-md mx-auto px-5 py-5"
      style={{ background: isColdReading ? "oklch(10% 0.015 60)" : undefined }}
    >
      {shouldShowSOVExplainer && (
        <SOVExplainer onDismiss={() => dismissSOVExplainer(level)} />
      )}

      <div className="flex items-center justify-between text-xs text-text-muted">
        <span className="font-mono">{index + 1}/{sentences.length}</span>
        {isColdReading && (
          <span className="px-2 py-1 rounded-full border border-gold/25 text-gold">
            Cold reading — no audio
          </span>
        )}
      </div>

      <div className="mt-3 h-1 rounded-full" style={{ background: "oklch(95% 0.01 75 / 10%)" }}>
        <div
          className="h-full rounded-full transition-all"
          style={{
            width: `${(index / sentences.length) * 100}%`,
            background: "oklch(72% 0.12 75)",
          }}
        />
      </div>

      <AnimatePresence mode="wait">
        {phase === "read" && (
          <motion.div
            key={`read-${sentence.id}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex-1 flex flex-col items-center justify-center gap-5"
          >
            <p className="text-text-muted text-xs">{sourceLabel(sentence)}</p>
            <span className="urdu text-text-primary text-center" style={{ fontSize: "40px" }}>
              {sentence.urdu}
            </span>
            {!isColdReading && sentence.audioFile && (
              <div className="flex flex-col items-center gap-2">
                <AudioButton
                  filename={sentence.audioFile}
                  size="md"
                  autoPlay={replays === 0}
                />
                <button
                  onClick={() => setReplays((value) => Math.min(3, value + 1))}
                  disabled={replays >= 3}
                  className="text-text-muted text-xs min-h-[44px] px-3 disabled:opacity-40"
                >
                  replay {replays}/3
                </button>
              </div>
            )}
            <button
              onClick={() => setPhase("type")}
              className="px-8 py-3 rounded-xl bg-gold text-background font-medium min-h-[44px]"
            >
              Type what you heard
            </button>
          </motion.div>
        )}

        {phase === "type" && (
          <motion.div
            key={`type-${sentence.id}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex-1 flex flex-col items-center justify-center gap-8"
          >
            <span className="urdu text-text-primary text-center" style={{ fontSize: "34px" }}>
              {sentence.urdu}
            </span>
            <TypingInput
              target={sentence.roman}
              granularity="word"
              onComplete={handleTyped}
            />
          </motion.div>
        )}

        {phase === "reveal" && (
          <motion.div
            key={`reveal-${sentence.id}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex-1 flex flex-col items-center justify-center gap-5 text-center"
          >
            <span className="urdu text-gold" style={{ fontSize: "36px" }}>
              {sentence.urdu}
            </span>
            <p className="text-text-primary text-xl">{sentence.english}</p>
            <IPABadge roman={sentence.roman} ipa={sentence.ipa} />
            <p className="font-mono text-teal text-3xl">{accuracy}%</p>
            {accuracy < 70 && (
              <button
                onClick={() => setPhase("type")}
                className="px-6 py-3 rounded-xl border border-gold/35 text-gold min-h-[44px]"
              >
                Try again
              </button>
            )}
            <button
              onClick={advance}
              className="px-8 py-3 rounded-xl bg-gold text-background font-medium min-h-[44px]"
            >
              Next →
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
