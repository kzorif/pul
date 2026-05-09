"use client"

import { useState, useRef, useEffect } from "react"
import { haptics } from "@/utils/haptics"

interface TypingInputProps {
  target: string
  onComplete: (accuracy: number, timeMs: number) => void
  onKeyPress?: (correct: boolean) => void
  granularity?: "character" | "word"
}

type CharState = "untyped" | "correct" | "incorrect"

interface CharEntry {
  char: string
  state: CharState
  typedChar?: string
}

export function TypingInput({
  target,
  onComplete,
  onKeyPress,
  granularity = "character",
}: TypingInputProps) {
  const [entries, setEntries] = useState<CharEntry[]>(
    target.split("").map((char) => ({ char, state: "untyped" })),
  )
  const [cursor, setCursor] = useState(0)
  const [correctCount, setCorrectCount] = useState(0)
  const [totalCount, setTotalCount] = useState(0)
  const startTimeRef = useRef<number | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const targetWords = target.split(" ")
  const typedWords = entries
    .map((entry) => entry.typedChar ?? (entry.state === "correct" ? entry.char : ""))
    .join("")
    .split(" ")

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (cursor >= target.length) return

    if (startTimeRef.current === null) {
      startTimeRef.current = Date.now()
    }

    if (e.key === "Backspace") {
      if (cursor === 0) return
      const newEntries = [...entries]
      newEntries[cursor - 1] = { char: target[cursor - 1], state: "untyped" }
      setEntries(newEntries)
      setCursor((c) => c - 1)
      return
    }

    if (e.key.length !== 1) return

    const expected = target[cursor]
    const correct = e.key === expected
    const newEntries = [...entries]
    newEntries[cursor] = {
      char: expected,
      state: correct ? "correct" : "incorrect",
      typedChar: correct ? undefined : e.key,
    }
    setEntries(newEntries)

    const newCorrect = correctCount + (correct ? 1 : 0)
    const newTotal = totalCount + 1
    setCorrectCount(newCorrect)
    setTotalCount(newTotal)

    if (correct) {
      haptics.light()
    } else {
      haptics.incorrect()
    }
    onKeyPress?.(correct)

    const newCursor = cursor + 1
    setCursor(newCursor)

    if (newCursor >= target.length) {
      const timeMs = startTimeRef.current ? Date.now() - startTimeRef.current : 0
      const accuracy = Math.round((newCorrect / newTotal) * 100)
      onComplete(accuracy, timeMs)
    }
  }

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      {granularity === "character" ? (
        <div className="flex items-center gap-0.5 flex-wrap justify-center font-mono text-2xl relative">
          {entries.map((entry, i) => (
            <span
              key={i}
              className="relative"
              style={{
                color:
                  entry.state === "correct"
                    ? "oklch(72% 0.12 75)"
                    : entry.state === "incorrect"
                      ? "oklch(60% 0.2 25)"
                      : "oklch(95% 0.01 75 / 40%)",
              }}
            >
              {entry.state === "incorrect" ? entry.typedChar ?? entry.char : entry.char}
              {i === cursor && (
                <span
                  className="absolute -left-0.5 top-0 bottom-0 w-0.5 animate-pulse"
                  style={{ background: "oklch(72% 0.12 75)" }}
                />
              )}
            </span>
          ))}
          {cursor === target.length && (
            <span
              className="w-0.5 h-6 animate-pulse"
              style={{ background: "oklch(72% 0.12 75)" }}
            />
          )}
        </div>
      ) : (
        <div className="flex items-center gap-2 flex-wrap justify-center font-mono text-xl leading-relaxed">
          {targetWords.map((word, wordIndex) => {
            const typed = typedWords[wordIndex] ?? ""
            const wordStart = targetWords.slice(0, wordIndex).join(" ").length + (wordIndex > 0 ? 1 : 0)
            const wordEnd = wordStart + word.length
            const isCurrent = cursor >= wordStart && cursor <= wordEnd
            const hasWrong = entries.slice(wordStart, wordEnd).some((entry) => entry.state === "incorrect")
            const isComplete = cursor > wordEnd
            return (
              <span
                key={`${word}-${wordIndex}`}
                className="relative rounded-md px-1"
                style={{
                  color: hasWrong
                    ? "oklch(60% 0.2 25)"
                    : isComplete
                      ? "oklch(72% 0.12 75)"
                      : "oklch(95% 0.01 75 / 42%)",
                  background: isCurrent ? "oklch(72% 0.12 75 / 10%)" : "transparent",
                }}
              >
                {typed || word}
              </span>
            )
          })}
        </div>
      )}

      {/* Hidden input */}
      <input
        ref={inputRef}
        type="text"
        onKeyDown={handleKeyDown}
        value=""
        onChange={() => {}}
        className="opacity-0 absolute w-px h-px"
        aria-label="Type the word"
        autoCapitalize="none"
        autoCorrect="off"
        autoComplete="off"
      />
    </div>
  )
}
