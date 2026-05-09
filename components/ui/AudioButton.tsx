"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Volume2 } from "lucide-react"
import { playAudio } from "@/utils/audio"

interface AudioButtonProps {
  filename: string
  size?: "sm" | "md"
  autoPlay?: boolean
}

export function AudioButton({ filename, size = "md", autoPlay = false }: AudioButtonProps) {
  const [isPlaying, setIsPlaying] = useState(false)

  const handlePlay = async () => {
    if (isPlaying) return
    setIsPlaying(true)
    try {
      await playAudio(filename)
    } finally {
      setTimeout(() => setIsPlaying(false), 600)
    }
  }

  useEffect(() => {
    if (autoPlay) void handlePlay()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoPlay, filename])

  const sizeClasses = size === "sm"
    ? "w-9 h-9 min-w-[36px]"
    : "w-12 h-12 min-w-[48px]"

  const iconSize = size === "sm" ? 16 : 20

  return (
    <motion.button
      onClick={handlePlay}
      aria-label={`Play audio ${filename}`}
      whileTap={{ scale: 0.9 }}
      className={`${sizeClasses} rounded-full border border-gold/40 flex items-center justify-center text-gold hover:bg-gold/10 transition-colors`}
    >
      <motion.div
        animate={isPlaying ? { scale: [1, 1.2, 1] } : { scale: 1 }}
        transition={isPlaying ? { repeat: Infinity, duration: 0.6 } : {}}
      >
        <Volume2 size={iconSize} />
      </motion.div>
    </motion.button>
  )
}
