"use client"

import { motion } from "framer-motion"
import { Lock } from "lucide-react"
import { CHARACTERS } from "@/data/characters"
import { CharacterProgress } from "@/store/progressStore"
import { ProgressRing } from "@/components/ui/ProgressRing"

interface CharacterGridProps {
  characterProgress: Record<number, CharacterProgress>
  charactersUnlocked: number
  onCharacterSelect: (id: number) => void
  onLockedSelect?: () => void
}

export function CharacterGrid({
  characterProgress,
  charactersUnlocked,
  onCharacterSelect,
  onLockedSelect,
}: CharacterGridProps) {
  return (
    <div className="grid grid-cols-3 gap-3">
      {CHARACTERS.map((char) => {
        const progress = characterProgress[char.id]
          ? Math.round((characterProgress[char.id].statesCompleted.length / 6) * 100)
          : 0
        const isLocked = char.id > charactersUnlocked
        const isLearned = progress === 100

        return (
          <motion.button
            key={char.id}
            whileTap={isLocked ? {} : { scale: 0.95 }}
            onClick={() => (isLocked ? onLockedSelect?.() : onCharacterSelect(char.id))}
            className="relative flex flex-col items-center justify-center rounded-2xl py-4 gap-1 min-h-[88px]"
            style={{
              background: "oklch(16% 0.02 60)",
              border: isLearned
                ? "1px solid oklch(72% 0.12 75 / 70%)"
                : progress > 0
                  ? "1px solid oklch(72% 0.12 75 / 25%)"
                  : "1px solid oklch(95% 0.01 75 / 8%)",
              opacity: isLocked ? 0.35 : 1,
              cursor: isLocked ? "not-allowed" : "pointer",
            }}
          >
            <div className="absolute top-2 right-2">
              <ProgressRing progress={progress} size={26} strokeWidth={2} />
            </div>
            <span className="urdu text-text-primary" style={{ fontSize: "32px" }}>
              {char.urdu}
            </span>
            <span className="font-mono text-text-muted" style={{ fontSize: "10px" }}>
              {char.roman}
            </span>
            {isLocked && <Lock size={10} className="absolute bottom-1.5 right-1.5 text-text-muted" />}
          </motion.button>
        )
      })}
    </div>
  )
}
