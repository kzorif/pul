"use client"

import { useEffect } from "react"
import { motion } from "framer-motion"

const MESSAGES: Record<number, string> = {
  3: "Three days — the characters are starting to stick",
  7: "One week — you've read Iqbal in Urdu",
  14: "Two weeks — حروف are becoming second nature",
  30: "Thirty days — you're reading Urdu",
}

interface StreakToastProps {
  days: number
  onDismiss: () => void
}

export function StreakToast({ days, onDismiss }: StreakToastProps) {
  useEffect(() => {
    const timeout = setTimeout(onDismiss, 3600)
    return () => clearTimeout(timeout)
  }, [onDismiss])

  return (
    <motion.div
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      className="fixed top-4 left-4 right-4 z-50 max-w-md mx-auto rounded-2xl px-4 py-3"
      style={{
        background: "oklch(16% 0.02 60)",
        border: "1px solid oklch(72% 0.12 75 / 35%)",
      }}
    >
      <p className="text-gold font-mono text-xs">{days} day streak</p>
      <p className="text-text-primary text-sm mt-1">{MESSAGES[days] ?? "Streak milestone"}</p>
    </motion.div>
  )
}
