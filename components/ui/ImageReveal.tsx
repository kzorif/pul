"use client"

import Image from "next/image"
import { useState } from "react"
import { motion } from "framer-motion"

interface ImageRevealProps {
  imagePath: string | null
  alt: string
  fallbackChar?: string
  compact?: boolean
}

export function ImageReveal({
  imagePath,
  alt,
  fallbackChar,
  compact = false,
}: ImageRevealProps) {
  const [loaded, setLoaded] = useState(false)
  const [failed, setFailed] = useState(false)
  const shouldShowImage = Boolean(imagePath) && !failed
  const maxWidth = compact ? 160 : 240

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="relative rounded-xl flex items-center justify-center w-full overflow-hidden"
      style={{
        background: "oklch(72% 0.12 75 / 10%)",
        border: "1px solid oklch(72% 0.12 75 / 20%)",
        maxWidth,
        aspectRatio: compact ? "16 / 10" : "1 / 1",
      }}
      aria-label={alt}
    >
      {shouldShowImage && (
        <Image
          src={imagePath!}
          alt={alt}
          fill
          sizes={`${maxWidth}px`}
          className="object-cover"
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
        />
      )}

      {shouldShowImage && !loaded && (
        <div
          className="absolute inset-0 animate-pulse"
          style={{ background: "linear-gradient(90deg, transparent, oklch(72% 0.12 75 / 14%), transparent)" }}
        />
      )}

      {!shouldShowImage && fallbackChar && (
        <span className="urdu text-4xl text-gold/70">{fallbackChar}</span>
      )}
      {!shouldShowImage && !fallbackChar && (
        <span className="text-gold/45 text-xs font-mono uppercase tracking-widest">
          image
        </span>
      )}
    </motion.div>
  )
}
