"use client"

import { useRouter } from "next/navigation"
import { SENTENCES } from "@/data/sentences"
import { useProgressStore } from "@/store/progressStore"

interface LevelGateProps {
  level: 2 | 3 | 4 | 5
  children: React.ReactNode
}

function getRequirement(level: 2 | 3 | 4 | 5) {
  switch (level) {
    case 2:
      return "Complete 12 characters to unlock words."
    case 3:
      return "Complete 18 words to unlock sentences."
    case 4:
      return "Complete 15 Level 3 sentences to unlock cold reading."
    case 5:
      return "Complete 15 Level 4 readings to unlock writing."
  }
}

export function LevelGate({ level, children }: LevelGateProps) {
  const router = useRouter()
  const { characterProgress, wordProgress, sentenceProgress, currentLevel } = useProgressStore()

  const masteredCharacters = Object.values(characterProgress).filter(
    (progress) => progress.statesCompleted.length >= 6,
  ).length
  const completedWords = Object.keys(wordProgress).length
  const completedLevel3 = Object.keys(sentenceProgress).filter((id) => {
    const sentence = SENTENCES.find((item) => item.id === id)
    return sentence?.level === 3
  }).length
  const completedLevel4 = Object.keys(sentenceProgress).filter((id) => {
    const sentence = SENTENCES.find((item) => item.id === id)
    return sentence?.level === 4
  }).length

  const unlocked =
    currentLevel >= level ||
    (level === 2 && masteredCharacters >= 12) ||
    (level === 3 && completedWords >= 18) ||
    (level === 4 && completedLevel3 >= 15) ||
    (level === 5 && completedLevel4 >= 15)

  if (unlocked) return <>{children}</>

  return (
    <main className="min-h-dvh max-w-md mx-auto flex flex-col items-center justify-center px-5 text-center gap-5">
      <p className="text-gold font-mono uppercase tracking-widest text-xs">Level {level} locked</p>
      <h1 className="text-text-primary text-2xl font-medium">{getRequirement(level)}</h1>
      <p className="text-text-muted text-sm">
        Pul keeps the sequence tight so new shapes become automatic before the next layer opens.
      </p>
      <button
        onClick={() => router.push("/home")}
        className="px-8 py-3 rounded-xl bg-gold text-background font-medium min-h-[44px]"
      >
        Back to home
      </button>
    </main>
  )
}
