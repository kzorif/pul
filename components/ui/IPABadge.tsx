"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useProgressStore } from "@/store/progressStore"

interface IPABadgeProps {
  roman: string
  ipa: string
}

export function IPABadge({ roman, ipa }: IPABadgeProps) {
  const showIPA = useProgressStore((state) => state.showIPA)
  const toggleIPA = useProgressStore((state) => state.toggleIPA)

  return (
    <button
      onClick={toggleIPA}
      aria-label={showIPA ? "Show roman pronunciation" : "Show IPA pronunciation"}
      className="relative inline-flex items-center gap-1 px-3 py-1 rounded-full border border-gold/40 text-sm cursor-pointer select-none min-h-[44px]"
      style={{ perspective: 600 }}
    >
      <AnimatePresence mode="wait">
        {showIPA ? (
          <motion.span
            key="ipa"
            initial={{ rotateX: -90, opacity: 0 }}
            animate={{ rotateX: 0, opacity: 1 }}
            exit={{ rotateX: 90, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="font-mono text-gold tracking-wide"
          >
            {ipa}
          </motion.span>
        ) : (
          <motion.span
            key="roman"
            initial={{ rotateX: -90, opacity: 0 }}
            animate={{ rotateX: 0, opacity: 1 }}
            exit={{ rotateX: 90, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="text-text-primary"
          >
            {roman}
          </motion.span>
        )}
      </AnimatePresence>
      <motion.span
        animate={{ opacity: showIPA ? 1 : 0 }}
        className="text-xs text-gold/60 font-mono"
      >
        IPA
      </motion.span>
    </button>
  )
}
