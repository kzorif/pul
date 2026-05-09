"use client"

import { useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

const SINGLE_MAP: Record<string, string> = {
  q: "ق",
  w: "و",
  e: "ے",
  r: "ر",
  t: "ت",
  y: "ی",
  u: "ا",
  i: "ع",
  o: "و",
  p: "پ",
  a: "ا",
  s: "س",
  d: "د",
  f: "ف",
  g: "گ",
  h: "ہ",
  H: "ح",
  j: "ج",
  k: "ک",
  l: "ل",
  z: "ز",
  T: "ٹ",
  D: "ڈ",
  N: "ں",
  R: "ڑ",
  "'": "ء",
  b: "ب",
  n: "ن",
  m: "م",
}

const SEQUENCE_MAP: Record<string, string> = {
  sh: "ش",
  ch: "چ",
  kh: "خ",
  gh: "غ",
  ai: "ے",
  oo: "و",
}

const ROWS = [
  ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
  ["a", "s", "d", "D", "f", "g", "h", "H", "j", "k", "l"],
  ["sh", "z", "ch", "kh", "gh", "T", "R", "b", "n", "N", "m", "'"],
]

interface UrduKeyboardProps {
  onChar: (urduChar: string) => void
  onBackspace: () => void
  onSpace: () => void
}

export function UrduKeyboard({ onChar, onBackspace, onSpace }: UrduKeyboardProps) {
  const [preview, setPreview] = useState<{ key: string; value: string } | null>(null)
  const pendingRef = useRef<{ key: string; timeout: ReturnType<typeof setTimeout> } | null>(null)
  const longPressRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const longPressedRef = useRef(false)

  const commit = (value: string, key: string) => {
    onChar(value)
    setPreview({ key, value })
    setTimeout(() => setPreview(null), 220)
  }

  const flushPending = () => {
    if (!pendingRef.current) return
    clearTimeout(pendingRef.current.timeout)
    const key = pendingRef.current.key
    pendingRef.current = null
    commit(SINGLE_MAP[key], key)
  }

  const handleKey = (key: string) => {
    if (key.length > 1) {
      flushPending()
      commit(SEQUENCE_MAP[key] ?? key, key)
      return
    }

    const pending = pendingRef.current?.key
    if (pending) {
      const sequence = `${pending}${key}`
      if (SEQUENCE_MAP[sequence]) {
        clearTimeout(pendingRef.current!.timeout)
        pendingRef.current = null
        commit(SEQUENCE_MAP[sequence], sequence)
        return
      }
      flushPending()
    }

    pendingRef.current = {
      key,
      timeout: setTimeout(() => {
        if (pendingRef.current?.key === key) {
          pendingRef.current = null
          commit(SINGLE_MAP[key], key)
        }
      }, 300),
    }
  }

  const startLongPress = (key: string) => {
    if (key !== "h") return
    longPressedRef.current = false
    longPressRef.current = setTimeout(() => {
      flushPending()
      commit("ھ", "h")
      longPressedRef.current = true
      longPressRef.current = null
    }, 450)
  }

  const endLongPress = () => {
    if (!longPressRef.current) return
    clearTimeout(longPressRef.current)
    longPressRef.current = null
  }

  return (
    <div className="w-full max-w-md mx-auto rounded-t-2xl px-2 pt-3 pb-4" style={{ background: "oklch(9% 0.015 60)" }}>
      <div className="flex flex-col gap-2">
        {ROWS.map((row, rowIndex) => (
          <div key={rowIndex} className="flex justify-center gap-1.5">
            {row.map((key) => {
              const urdu = SEQUENCE_MAP[key] ?? SINGLE_MAP[key]
              return (
                <motion.button
                  key={key}
                  whileTap={{ scale: 0.9 }}
                  onPointerDown={() => startLongPress(key)}
                  onPointerUp={endLongPress}
                  onPointerLeave={endLongPress}
                  onClick={() => {
                    if (key === "h" && longPressedRef.current) {
                      longPressedRef.current = false
                      return
                    }
                    endLongPress()
                    handleKey(key)
                  }}
                  aria-label={`${key} outputs ${urdu}`}
                  className="relative flex-1 min-w-0 h-12 rounded-lg border border-gold/15 text-text-primary"
                  style={{ background: "oklch(16% 0.02 60)" }}
                >
                  <span className="block text-xs font-mono text-gold">{key}</span>
                  <span className="urdu block leading-none" style={{ fontSize: "18px" }}>
                    {urdu}
                  </span>
                  <AnimatePresence>
                    {preview?.key === key && (
                      <motion.span
                        initial={{ opacity: 0, y: 0, scale: 0.8 }}
                        animate={{ opacity: 1, y: -34, scale: 1 }}
                        exit={{ opacity: 0, y: -44 }}
                        className="absolute left-1/2 -translate-x-1/2 top-0 urdu text-gold"
                        style={{ fontSize: "28px" }}
                      >
                        {preview.value}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.button>
              )
            })}
          </div>
        ))}
      </div>
      <div className="mt-2 flex gap-2">
        <button
          onClick={() => {
            flushPending()
            onSpace()
          }}
          aria-label="Insert space"
          className="flex-1 h-11 rounded-lg border border-gold/15 text-text-muted"
          style={{ background: "oklch(16% 0.02 60)" }}
        >
          space
        </button>
        <button
          onClick={() => {
            flushPending()
            onBackspace()
          }}
          aria-label="Delete last Urdu character"
          className="w-24 h-11 rounded-lg border border-gold/15 text-gold"
          style={{ background: "oklch(16% 0.02 60)" }}
        >
          delete
        </button>
      </div>
    </div>
  )
}
