"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"

interface ProgressRingProps {
  progress: number // 0–100
  size?: number
  strokeWidth?: number
  color?: string
}

export function ProgressRing({
  progress,
  size = 48,
  strokeWidth = 3,
  color = "oklch(72% 0.12 75)",
}: ProgressRingProps) {
  const [animatedProgress, setAnimatedProgress] = useState(0)
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (animatedProgress / 100) * circumference

  useEffect(() => {
    const raf = requestAnimationFrame(() => setAnimatedProgress(progress))
    return () => cancelAnimationFrame(raf)
  }, [progress])

  return (
    <svg width={size} height={size} className="rotate-[-90deg]">
      {/* Track */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="oklch(95% 0.01 75 / 10%)"
        strokeWidth={strokeWidth}
      />
      {/* Progress */}
      <motion.circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={circumference}
        initial={{ strokeDashoffset: circumference }}
        animate={{ strokeDashoffset: offset }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      />
    </svg>
  )
}
