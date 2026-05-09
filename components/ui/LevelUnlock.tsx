"use client"

import { useEffect } from "react"
import { motion } from "framer-motion"
import { AudioButton } from "@/components/ui/AudioButton"

const LEVELS: Record<number, { urdu: string; english: string; description: string; audio: string }> = {
  1: { urdu: "حروف", english: "Characters", description: "Meet the shapes and sounds.", audio: "level_1.mp3" },
  2: { urdu: "الفاظ", english: "Words", description: "You know the characters. Now read whole words.", audio: "level_2.mp3" },
  3: { urdu: "جملے", english: "Sentences", description: "Start feeling Urdu word order in motion.", audio: "level_3.mp3" },
  4: { urdu: "نثر", english: "Prose", description: "Read without scaffolding.", audio: "level_4.mp3" },
  5: { urdu: "تحریر", english: "Writing", description: "Produce Urdu script yourself.", audio: "level_5.mp3" },
}

interface LevelUnlockProps {
  level: 1 | 2 | 3 | 4 | 5
  onDismiss: () => void
}

export function LevelUnlock({ level, onDismiss }: LevelUnlockProps) {
  const data = LEVELS[level]

  useEffect(() => {
    const timeout = setTimeout(onDismiss, 3000)
    return () => clearTimeout(timeout)
  }, [onDismiss])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onDismiss}
      className="fixed inset-0 z-50 flex items-center justify-center px-5"
      style={{
        background:
          "radial-gradient(circle at center, oklch(72% 0.12 75 / 22%), oklch(12% 0.02 60) 58%)",
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 220, damping: 22 }}
        className="text-center"
      >
        <p className="text-gold font-mono uppercase tracking-widest text-sm">Level {level}</p>
        <div className="flex justify-center mt-3">
          {[...data.urdu].map((char, index) => (
            <motion.span
              key={`${char}-${index}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + index * 0.12 }}
              className="urdu text-gold"
              style={{ fontSize: "72px" }}
            >
              {char}
            </motion.span>
          ))}
        </div>
        <h2 className="text-text-primary text-2xl font-medium mt-2">{data.english}</h2>
        <p className="text-text-muted mt-2 max-w-xs">{data.description}</p>
        <div className="mt-5 flex justify-center">
          <AudioButton filename={data.audio} size="sm" autoPlay />
        </div>
      </motion.div>
    </motion.div>
  )
}
