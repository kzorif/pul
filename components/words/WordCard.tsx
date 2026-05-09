import { Word } from "@/data/words"

interface WordCardProps {
  word: Word
}

export function WordCard({ word }: WordCardProps) {
  return (
    <div
      className="flex flex-col items-center gap-2 rounded-2xl px-4 py-5"
      style={{
        background: "oklch(16% 0.02 60)",
        border: "1px solid oklch(95% 0.01 75 / 8%)",
      }}
    >
      <span className="urdu text-text-primary" style={{ fontSize: "48px" }}>
        {word.urdu}
      </span>
      <span className="font-mono text-gold text-sm">{word.roman}</span>
    </div>
  )
}
