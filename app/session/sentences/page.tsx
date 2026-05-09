import { SentenceSession } from "@/components/sentences/SentenceSession"
import { LevelGate } from "@/components/ui/LevelGate"

interface SentencesPageProps {
  searchParams?: {
    level?: string
  }
}

export default function SentencesPage({ searchParams }: SentencesPageProps) {
  const level = searchParams?.level === "4" ? 4 : 3

  return (
    <LevelGate level={level}>
      <SentenceSession level={level} />
    </LevelGate>
  )
}
