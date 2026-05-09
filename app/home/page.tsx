"use client"

import { useRouter } from "next/navigation"
import { AnimatePresence, motion } from "framer-motion"
import { useProgressStore } from "@/store/progressStore"
import { CHARACTERS } from "@/data/characters"
import { WORDS } from "@/data/words"
import { Flame } from "lucide-react"
import { CharacterGrid } from "@/components/ui/CharacterGrid"
import { LevelBadge } from "@/components/ui/LevelBadge"
import { LevelUnlock } from "@/components/ui/LevelUnlock"
import { StreakToast } from "@/components/ui/StreakToast"
import { track } from "@/utils/analytics"

const LEVELS = [
  { label: "Characters", sublabel: "Haroof" },
  { label: "Words", sublabel: "Alfaaz" },
  { label: "Sentences", sublabel: "Jumlay" },
  { label: "Prose", sublabel: "Nasr" },
  { label: "Production", sublabel: "Tahrir" },
]

export default function HomePage() {
  const router = useRouter()
  const {
    characterProgress,
    streak,
    currentLevel,
    charactersUnlocked,
    buildDailySession,
    lastUnlockedLevel,
    clearLevelUnlock,
    lastStreakMilestone,
    clearStreakMilestone,
  } = useProgressStore()

  const session = buildDailySession()
  const nextItem = session[0]

  const handleStartSession = () => {
    if (!nextItem) return
    router.push("/session/daily")
  }

  return (
    <main className="min-h-dvh flex flex-col max-w-md mx-auto">
      <AnimatePresence>
        {lastUnlockedLevel && (
          <LevelUnlock
            level={lastUnlockedLevel}
            onDismiss={() => {
              track("level_unlocked", { level: String(lastUnlockedLevel) })
              clearLevelUnlock()
            }}
          />
        )}
        {lastStreakMilestone && (
          <StreakToast
            days={lastStreakMilestone}
            onDismiss={() => {
              track("streak_milestone", { days: String(lastStreakMilestone) })
              clearStreakMilestone()
            }}
          />
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4">
        <span className="urdu text-gold" style={{ fontSize: "28px" }}>پل</span>
        <div className="flex items-center gap-2">
          <Flame size={18} style={{ color: "oklch(72% 0.12 75)" }} />
          <motion.span
            key={streak}
            initial={{ scale: 1.3 }}
            animate={{ scale: 1 }}
            className="text-gold font-mono font-medium"
          >
            {streak}
          </motion.span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 pb-24 flex flex-col gap-8">
        {/* Today's card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl p-5 flex flex-col gap-3"
          style={{
            border: "1px solid oklch(72% 0.12 75 / 40%)",
            background: "oklch(72% 0.12 75 / 5%)",
          }}
        >
          {nextItem ? (
            <>
              <p className="text-text-muted text-xs uppercase tracking-wider">Continue learning</p>
              {nextItem.type === "character" && (
                <span className="urdu text-gold" style={{ fontSize: "48px" }}>
                  {CHARACTERS.find((c) => c.id === nextItem.id)?.urdu ?? ""}
                </span>
              )}
              {nextItem.type === "word" && (() => {
                const word = WORDS.find((w) => w.id === nextItem.id)
                return word ? (
                  <div className="flex flex-col gap-1">
                    <span className="urdu text-gold" style={{ fontSize: "40px" }}>{word.urdu}</span>
                    <span className="text-text-muted text-xs font-mono">{word.roman} — {word.english}</span>
                  </div>
                ) : null
              })()}
              {nextItem.type === "sentence" && (
                <span className="text-text-muted text-sm font-mono">Sentence practice</span>
              )}
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={handleStartSession}
                className="self-start px-6 py-3 rounded-xl bg-gold text-background font-medium min-h-[44px]"
              >
                Start session →
              </motion.button>
            </>
          ) : (
            <>
              <p className="text-gold text-lg font-medium">All caught up 🎉</p>
              <p className="text-text-muted text-sm">Come back tomorrow</p>
            </>
          )}
        </motion.div>

        {/* Character grid */}
        <div>
          <h2 className="text-text-muted text-xs uppercase tracking-wider mb-3">
            <span className="urdu text-text-primary" style={{ fontSize: "18px" }}>حروف</span>
            {" "}— Characters
          </h2>
          <CharacterGrid
            characterProgress={characterProgress}
            charactersUnlocked={charactersUnlocked}
            onCharacterSelect={(id) => router.push(`/session/character/${id}`)}
            onLockedSelect={() => window.alert("Complete earlier characters first")}
          />
        </div>

        {/* Level ladder */}
        <div>
          <h2 className="text-text-muted text-xs uppercase tracking-wider mb-3">Level</h2>
          <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
            {LEVELS.map((level, i) => {
              const levelNum = (i + 1) as 1 | 2 | 3 | 4 | 5
              const isCurrent = levelNum === currentLevel
              const isCompleted = levelNum < currentLevel
              const isLocked = levelNum > currentLevel

              return (
                <LevelBadge
                  key={i}
                  label={level.label}
                  sublabel={level.sublabel}
                  current={isCurrent}
                  completed={isCompleted}
                  locked={isLocked}
                />
              )
            })}
          </div>
        </div>
      </div>

      {/* Bottom nav */}
      <nav className="fixed bottom-0 left-0 right-0 flex justify-around items-center py-4 px-4 max-w-md mx-auto inset-x-0"
        style={{ background: "oklch(12% 0.02 60)", borderTop: "1px solid oklch(95% 0.01 75 / 8%)" }}>
        <button
          className="flex flex-col items-center gap-1 px-6 py-2 min-h-[44px]"
          style={{ color: "oklch(72% 0.12 75)" }}
        >
          <span className="text-xs">Home</span>
        </button>
        <button
          onClick={() => router.push("/progress")}
          className="flex flex-col items-center gap-1 px-6 py-2 min-h-[44px]"
          style={{ color: "oklch(95% 0.01 75 / 40%)" }}
        >
          <span className="text-xs">Progress</span>
        </button>
        <button
          onClick={() => router.push("/settings")}
          className="flex flex-col items-center gap-1 px-4 py-2 min-h-[44px] rounded-lg"
          style={{
            color: "oklch(95% 0.01 75 / 40%)",
          }}
        >
          <span className="text-xs">Settings</span>
        </button>
      </nav>
    </main>
  )
}
