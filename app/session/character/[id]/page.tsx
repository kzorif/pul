"use client"

import { useParams, useRouter } from "next/navigation"
import { CharacterSession } from "@/components/character/CharacterSession"
import { useProgressStore } from "@/store/progressStore"

export default function CharacterSessionPage() {
  const params = useParams()
  const router = useRouter()
  const { updateStreak, characterProgress } = useProgressStore()

  const characterId = Number(params.id)
  const progress = characterProgress[characterId]
  const isReview =
    Boolean(progress?.statesCompleted.length === 6) &&
    new Date(progress?.sm2.nextReviewDate ?? 0) <= new Date()

  const handleComplete = () => {
    updateStreak()
    router.push("/home?completed=character")
  }

  return (
    <main className="min-h-dvh flex flex-col">
      <div className="flex-1 flex flex-col justify-center py-6">
        <CharacterSession
          characterId={characterId}
          isReview={isReview}
          onComplete={handleComplete}
        />
      </div>
    </main>
  )
}
