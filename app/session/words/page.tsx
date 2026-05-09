"use client"

import { WordSession } from "@/components/words/WordSession"
import { LevelGate } from "@/components/ui/LevelGate"

export default function WordsSessionPage() {
  return (
    <LevelGate level={2}>
      <main className="min-h-dvh flex flex-col">
        <div className="flex-1 flex flex-col justify-center py-6">
          <WordSession />
        </div>
      </main>
    </LevelGate>
  )
}
