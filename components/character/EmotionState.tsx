"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Character } from "@/data/characters"
import { AudioButton } from "@/components/ui/AudioButton"
import { ImageReveal } from "@/components/ui/ImageReveal"

interface EmotionStateProps {
  character: Character
  onComplete: () => void
}

export function EmotionState({ character, onComplete }: EmotionStateProps) {
  const [canContinue, setCanContinue] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setCanContinue(true), 4000)
    return () => clearTimeout(t)
  }, [])

  const anchor = character.anchor

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center gap-5 px-5 pt-6 pb-8"
    >
      {/* Anchor word card */}
      <motion.div
        className="w-full rounded-2xl flex flex-col items-center justify-center gap-3 py-6"
        style={{ background: "oklch(16% 0.02 60)", minHeight: "180px" }}
      >
        <motion.span
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="urdu text-text-primary text-center"
          style={{ fontSize: "60px" }}
        >
          {anchor.urdu}
        </motion.span>

        {/* Roman + IPA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex items-center gap-3"
        >
          <span className="font-mono text-gold text-sm">{anchor.roman}</span>
          <span className="font-mono text-text-muted text-xs">{anchor.ipa}</span>
        </motion.div>

        {/* Character callout */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex items-center gap-2"
        >
          <span className="text-text-muted text-xs">contains</span>
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
          <span className="text-text-muted font-mono text-xs">({character.roman})</span>
        </motion.div>
      </motion.div>

      <AudioButton filename={character.anchorAudioFile} size="md" autoPlay />

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="text-text-primary text-2xl text-center"
      >
        {anchor.english}
      </motion.p>

      <ImageReveal
        imagePath={`/assets/images/anchors/${character.anchorImageFile}`}
        alt={anchor.english}
        compact
      />

      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: canContinue ? 1 : 0 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => canContinue && onComplete()}
        className="w-full py-4 rounded-2xl border border-gold/40 text-gold font-medium min-h-[52px]"
      >
        Continue
      </motion.button>
    </motion.div>
  )
}
