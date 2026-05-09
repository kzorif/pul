"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { CharacterSession } from "@/components/character/CharacterSession"
import { SentenceSession } from "@/components/sentences/SentenceSession"
import { SingleWordReview } from "@/components/words/SingleWordReview"
import { useProgressStore } from "@/store/progressStore"
import { track } from "@/utils/analytics"

type DailyItem = { type: "character" | "word" | "sentence"; id: number | string; isReview?: boolean }

export default function DailySessionPage() {
  const router = useRouter()
  const buildDailySession = useProgressStore((state) => state.buildDailySession)
  const updateStreak = useProgressStore((state) => state.updateStreak)
  const queue = useMemo<DailyItem[]>(() => buildDailySession(), [buildDailySession])
  const [index, setIndex] = useState(0)

  const item = queue[index]

  useEffect(() => {
    track("session_started", { level: "daily", items: String(queue.length) })
  }, [queue.length])
  const completeItem = () => {
    if (index + 1 >= queue.length) {
      updateStreak()
      track("session_complete", { level: "daily", items: String(queue.length) })
      router.push("/home?completed=daily")
    } else {
      setIndex((value) => value + 1)
    }
  }

  if (!item) {
    return (
      <main className="min-h-dvh flex flex-col items-center justify-center px-5 gap-5">
        <h1 className="text-text-primary text-2xl font-medium">All caught up</h1>
        <p className="text-text-muted text-center">No reviews are due right now.</p>
        <button
          onClick={() => router.push("/home")}
          className="px-8 py-3 rounded-xl bg-gold text-background font-medium min-h-[44px]"
        >
          Back to home
        </button>
      </main>
    )
  }

  return (
    <main className="min-h-dvh flex flex-col">
      <div className="px-5 pt-5 max-w-md mx-auto w-full">
        <div className="flex justify-between text-xs text-text-muted">
          <span className="font-mono">{index + 1}/{queue.length}</span>
          <span>~{Math.max(1, Math.ceil(queue.length * 0.5))} min</span>
        </div>
        <div className="mt-2 h-1 rounded-full" style={{ background: "oklch(95% 0.01 75 / 10%)" }}>
          <div
            className="h-full rounded-full transition-all"
            style={{
              width: `${(index / queue.length) * 100}%`,
              background: "oklch(72% 0.12 75)",
            }}
          />
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-center py-6">
        {item.type === "character" && (
          <CharacterSession
            key={`character-${item.id}`}
            characterId={Number(item.id)}
            isReview={item.isReview ?? false}
            onComplete={completeItem}
          />
        )}
        {item.type === "sentence" && (
          <SentenceSession
            key={`sentence-${item.id}`}
            sentenceIds={[String(item.id)]}
            onComplete={completeItem}
          />
        )}
        {item.type === "word" && (
          <SingleWordReview
            key={`word-${item.id}`}
            wordId={String(item.id)}
            onComplete={completeItem}
          />
        )}
      </div>
    </main>
  )
}
