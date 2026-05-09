"use client"

import { motion } from "framer-motion"

interface SOVExplainerProps {
  onDismiss: () => void
}

const WORDS = [
  { urdu: "حامد", label: "Subject" },
  { urdu: "نے", label: "marker" },
  { urdu: "روٹی", label: "Object" },
  { urdu: "کھائی", label: "Verb last" },
]

export function SOVExplainer({ onDismiss }: SOVExplainerProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center px-4 pb-4"
      style={{ background: "oklch(0% 0 0 / 60%)" }}
    >
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md rounded-2xl px-5 py-5"
        style={{
          background: "oklch(16% 0.02 60)",
          border: "1px solid oklch(72% 0.12 75 / 35%)",
        }}
      >
        <h2 className="text-text-primary text-xl font-medium">
          Urdu puts the verb at the end
        </h2>

        <div className="mt-5 flex flex-row-reverse justify-center gap-3">
          {WORDS.map((word, index) => (
            <motion.div
              key={word.urdu}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.12 }}
              className="flex flex-col items-center gap-1"
            >
              <span className="urdu text-gold" style={{ fontSize: "28px" }}>
                {word.urdu}
              </span>
              <span className="text-text-muted text-[10px] font-mono uppercase">
                {word.label}
              </span>
            </motion.div>
          ))}
        </div>

        <div className="my-5 h-px" style={{ background: "oklch(95% 0.01 75 / 10%)" }} />

        <div className="space-y-2 text-sm">
          <p className="text-text-muted">
            In English: <span className="text-text-primary">Hamid ate bread</span>
          </p>
          <p className="text-text-muted">
            In Urdu: <span className="text-text-primary">Hamid bread ate</span>
          </p>
          <p className="text-text-muted pt-2">
            You&apos;ll feel this pattern naturally. Don&apos;t worry about memorizing it.
          </p>
        </div>

        <button
          onClick={onDismiss}
          className="mt-5 w-full py-3 rounded-xl bg-gold text-background font-medium min-h-[44px]"
        >
          Got it
        </button>
      </motion.div>
    </div>
  )
}
