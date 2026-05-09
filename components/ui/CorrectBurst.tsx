"use client"

import { motion } from "framer-motion"

const OFFSETS = [
  [-28, -18],
  [24, -24],
  [-34, 8],
  [32, 12],
  [-16, 30],
  [18, 28],
]

export function CorrectBurst() {
  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
      {OFFSETS.map(([x, y], index) => (
        <motion.span
          key={index}
          initial={{ opacity: 1, x: 0, y: 0, scale: 1 }}
          animate={{ opacity: 0, x, y, scale: 0.2 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-1.5 h-1.5 rounded-full bg-gold"
        />
      ))}
    </div>
  )
}
