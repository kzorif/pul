"use client"

import { motion, useReducedMotion } from "framer-motion"

interface CharacterDisplayProps {
  character: string
  size?: "sm" | "md" | "lg" | "xl"
  animate?: boolean
  className?: string
}

const SIZES = {
  sm: "32px",
  md: "56px",
  lg: "84px",
  xl: "120px",
}

export function CharacterDisplay({
  character,
  size = "lg",
  animate = true,
  className = "text-gold",
}: CharacterDisplayProps) {
  const reduceMotion = useReducedMotion()
  const shouldAnimate = animate && !reduceMotion

  return (
    <motion.span
      className={`urdu inline-block ${className}`}
      initial={shouldAnimate ? { opacity: 0, scale: 0.72, rotate: -2 } : false}
      animate={shouldAnimate ? { opacity: 1, scale: 1, rotate: 0 } : undefined}
      transition={{ duration: 0.6, ease: "easeOut" }}
      style={{
        fontSize: SIZES[size],
        transformOrigin: "top right",
      }}
    >
      {character}
    </motion.span>
  )
}
