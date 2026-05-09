"use client"

import { useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { useProgressStore } from "@/store/progressStore"
import { CHARACTERS } from "@/data/characters"
import { WORDS } from "@/data/words"
import { SENTENCES } from "@/data/sentences"
import { PRODUCTION_PROMPTS } from "@/data/productionPrompts"
import { Lock } from "lucide-react"
import { ProgressRing } from "@/components/ui/ProgressRing"

const LEVELS = [
  { label: "Characters", sublabel: "Haroof" },
  { label: "Words", sublabel: "Alfaaz" },
  { label: "Sentences", sublabel: "Jumlay" },
  { label: "Prose", sublabel: "Nasr" },
  { label: "Production", sublabel: "Tahrir" },
]

export default function ProgressPage() {
  const router = useRouter()
  const {
    characterProgress,
    wordProgress,
    sentenceProgress,
    productionProgress,
    currentLevel,
    streak,
    longestStreak,
    exportProgress,
    importProgress,
  } = useProgressStore()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [selectedCharacterId, setSelectedCharacterId] = useState<number | null>(null)

  const handleExport = () => {
    const json = exportProgress()
    const blob = new Blob([json], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "pul-progress.json"
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleImportClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const confirmed = window.confirm(
      "Import will replace your current progress. Continue?",
    )
    if (!confirmed) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      const text = ev.target?.result as string
      importProgress(text)
    }
    reader.readAsText(file)
  }

  const getCharProgress = (id: number) => {
    const p = characterProgress[id]
    return p ? Math.round((p.statesCompleted.length / 6) * 100) : 0
  }

  const totalMastered = CHARACTERS.filter((c) => getCharProgress(c.id) === 100).length
  const wordsLearned = Object.keys(wordProgress).length
  const sentencesSeen = Object.keys(sentenceProgress).length
  const productionAttempts = Object.values(productionProgress).reduce(
    (sum, item) => sum + item.attempts,
    0,
  )
  const activityByDate = [
    ...Object.values(characterProgress).map((item) => item.lastSeen),
    ...Object.values(wordProgress).map((item) => item.lastSeen),
    ...Object.values(sentenceProgress).map((item) => item.lastSeen),
    ...Object.values(productionProgress).map((item) => item.lastSeen),
  ].reduce<Record<string, number>>((acc, iso) => {
    const key = new Date(iso).toDateString()
    acc[key] = (acc[key] ?? 0) + 1
    return acc
  }, {})
  const heatmapDays = Array.from({ length: 28 }, (_, index) => {
    const date = new Date()
    date.setDate(date.getDate() - (27 - index))
    const key = date.toDateString()
    return { key, count: activityByDate[key] ?? 0, label: date.getDate() }
  })

  return (
    <div className="min-h-dvh flex flex-col max-w-md mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-4">
        <button onClick={() => router.back()} className="text-text-muted text-sm min-h-[44px] pr-4">
          ← Back
        </button>
        <h1 className="text-text-primary font-medium">Progress</h1>
      </div>

      <div className="flex-1 overflow-y-auto px-5 pb-10 flex flex-col gap-8">
        {/* Streak summary */}
        <div className="flex gap-4">
          <div className="flex-1 rounded-2xl px-4 py-4 text-center" style={{ background: "oklch(16% 0.02 60)" }}>
            <p className="text-gold text-3xl font-mono">{streak}</p>
            <p className="text-text-muted text-xs mt-1">current streak</p>
          </div>
          <div className="flex-1 rounded-2xl px-4 py-4 text-center" style={{ background: "oklch(16% 0.02 60)" }}>
            <p className="text-teal text-3xl font-mono">{longestStreak}</p>
            <p className="text-text-muted text-xs mt-1">longest streak</p>
          </div>
          <div className="flex-1 rounded-2xl px-4 py-4 text-center" style={{ background: "oklch(16% 0.02 60)" }}>
            <p className="text-purple text-3xl font-mono">{totalMastered}/18</p>
            <p className="text-text-muted text-xs mt-1">mastered</p>
          </div>
        </div>

        {/* Reading summary */}
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-2xl px-4 py-4 text-center" style={{ background: "oklch(16% 0.02 60)" }}>
            <p className="text-gold text-2xl font-mono">{wordsLearned}</p>
            <p className="text-text-muted text-xs mt-1">words</p>
          </div>
          <div className="rounded-2xl px-4 py-4 text-center" style={{ background: "oklch(16% 0.02 60)" }}>
            <p className="text-teal text-2xl font-mono">{sentencesSeen}</p>
            <p className="text-text-muted text-xs mt-1">sentences</p>
          </div>
          <div className="rounded-2xl px-4 py-4 text-center" style={{ background: "oklch(16% 0.02 60)" }}>
            <p className="text-purple text-2xl font-mono">{productionAttempts}</p>
            <p className="text-text-muted text-xs mt-1">writes</p>
          </div>
        </div>

        {/* Character mastery grid */}
        <div>
          <h2 className="text-text-muted text-xs uppercase tracking-wider mb-3">
            <span className="urdu text-text-primary" style={{ fontSize: "16px" }}>حروف</span>
            {" "}— Character Mastery
          </h2>
          <div className="grid grid-cols-3 gap-3">
            {CHARACTERS.map((char) => {
              const progress = getCharProgress(char.id)
              const p = characterProgress[char.id]

              return (
                <button
                  key={char.id}
                  onClick={() => setSelectedCharacterId(char.id)}
                  aria-label={`View progress for ${char.roman}`}
                  className="flex flex-col items-center justify-center rounded-2xl py-4 gap-1 min-h-[128px]"
                  style={{
                    background: "oklch(16% 0.02 60)",
                    border: progress === 100
                      ? "1px solid oklch(72% 0.12 75 / 70%)"
                      : progress > 0
                      ? "1px solid oklch(72% 0.12 75 / 25%)"
                      : "1px solid oklch(95% 0.01 75 / 8%)",
                  }}
                >
                  <ProgressRing progress={progress} size={34} strokeWidth={2} />
                  <span className="urdu text-text-primary" style={{ fontSize: "28px" }}>
                    {char.urdu}
                  </span>
                  <span className="font-mono text-text-muted" style={{ fontSize: "10px" }}>
                    {char.roman}
                  </span>
                  <span
                    className="font-mono"
                    style={{
                      fontSize: "10px",
                      color: progress === 100
                        ? "oklch(72% 0.12 75)"
                        : "oklch(95% 0.01 75 / 35%)",
                    }}
                  >
                    {progress}%{p ? ` ×${p.sm2.repetitions}` : ""}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {selectedCharacterId && (
          <div
            className="fixed inset-0 z-20 flex items-end justify-center px-4 pb-4"
            style={{ background: "oklch(0% 0 0 / 55%)" }}
            onClick={() => setSelectedCharacterId(null)}
          >
            {(() => {
              const char = CHARACTERS.find((c) => c.id === selectedCharacterId)
              const progress = characterProgress[selectedCharacterId]
              if (!char) return null
              return (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="w-full max-w-md rounded-2xl px-5 py-5"
                  style={{
                    background: "oklch(16% 0.02 60)",
                    border: "1px solid oklch(72% 0.12 75 / 30%)",
                  }}
                  onClick={(event) => event.stopPropagation()}
                >
                  <div className="flex items-center justify-between">
                    <span className="urdu text-gold" style={{ fontSize: "56px" }}>
                      {char.urdu}
                    </span>
                    <button
                      onClick={() => setSelectedCharacterId(null)}
                      className="px-3 py-2 text-text-muted min-h-[44px]"
                    >
                      Close
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <p className="text-text-muted">Sound: <span className="text-gold font-mono">{char.roman}</span></p>
                    <p className="text-text-muted">Reviews: <span className="text-teal font-mono">{progress?.sm2.repetitions ?? 0}</span></p>
                    <p className="text-text-muted">Mastery: <span className="text-gold font-mono">{progress ? Math.round((progress.statesCompleted.length / 6) * 100) : 0}%</span></p>
                    <p className="text-text-muted">Next: <span className="text-text-primary font-mono">{progress ? new Date(progress.sm2.nextReviewDate).toLocaleDateString() : "new"}</span></p>
                  </div>
                  <p className="mt-4 text-text-muted">
                    Anchor:{" "}
                    <span className="urdu text-text-primary" style={{ fontSize: "24px" }}>
                      {char.anchor.urdu}
                    </span>{" "}
                    · {char.anchor.english}
                  </p>
                </motion.div>
              )
            })()}
          </div>
        )}

        {/* Level ladder */}
        <div>
          <h2 className="text-text-muted text-xs uppercase tracking-wider mb-3">Levels</h2>
          <div className="flex flex-col gap-3">
            {LEVELS.map((level, i) => {
              const levelNum = (i + 1) as 1 | 2 | 3 | 4 | 5
              const isCurrent = levelNum === currentLevel
              const isCompleted = levelNum < currentLevel
              const isLocked = levelNum > currentLevel

              const fillPct = isCompleted
                ? 100
                : isCurrent && levelNum === 1
                ? Math.round((totalMastered / 18) * 100)
                : isCurrent && levelNum === 2
                ? Math.round((wordsLearned / 25) * 100)
                : 0

              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: isLocked ? 0.4 : 1, x: 0 }}
                  transition={{ delay: i * 0.07 }}
                  className="flex flex-col gap-2 px-5 py-4 rounded-2xl"
                  style={{
                    background: isCurrent ? "oklch(72% 0.12 75 / 8%)" : "oklch(16% 0.02 60)",
                    border: isCurrent
                      ? "1px solid oklch(72% 0.12 75 / 40%)"
                      : "1px solid oklch(95% 0.01 75 / 8%)",
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span
                        className="font-medium"
                        style={{ color: isCurrent ? "oklch(72% 0.12 75)" : "oklch(95% 0.01 75 / 80%)" }}
                      >
                        {level.label}
                      </span>
                      <span className="text-text-muted text-xs ml-2">{level.sublabel}</span>
                    </div>
                    {isLocked && <Lock size={14} style={{ color: "oklch(95% 0.01 75 / 30%)" }} />}
                    {isCompleted && <span style={{ color: "oklch(68% 0.08 175)" }}>✓</span>}
                    {isCurrent && (
                      <span className="text-xs font-mono" style={{ color: "oklch(72% 0.12 75 / 60%)" }}>
                        {fillPct}%
                      </span>
                    )}
                  </div>
                  {isCurrent && (
                    <div className="h-1 rounded-full" style={{ background: "oklch(95% 0.01 75 / 10%)" }}>
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${fillPct}%`,
                          background: "oklch(72% 0.12 75)",
                        }}
                      />
                    </div>
                  )}
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* Words learned */}
        <div>
          <h2 className="text-text-muted text-xs uppercase tracking-wider mb-3">
            <span className="urdu text-text-primary" style={{ fontSize: "16px" }}>الفاظ</span>
            {" "}— Words Learned
          </h2>
          <div className="flex flex-col gap-2 max-h-64 overflow-y-auto pr-1">
            {WORDS.filter((word) => wordProgress[word.id]).length > 0 ? (
              WORDS.filter((word) => wordProgress[word.id]).map((word) => {
                const progress = wordProgress[word.id]
                return (
                  <div
                    key={word.id}
                    className="flex items-center justify-between rounded-xl px-4 py-3"
                    style={{ background: "oklch(16% 0.02 60)" }}
                  >
                    <div>
                      <span className="urdu text-text-primary block" style={{ fontSize: "24px" }}>
                        {word.urdu}
                      </span>
                      <span className="text-text-muted text-xs">{word.english}</span>
                    </div>
                    <div className="text-right">
                      <p className="font-mono text-gold text-sm">{progress.bestAccuracy}%</p>
                      <p className="text-text-muted text-xs">{progress.timesTyped}x</p>
                    </div>
                  </div>
                )
              })
            ) : (
              <p className="text-text-muted text-sm">No words completed yet.</p>
            )}
          </div>
        </div>

        {/* Sentence and production progress */}
        <div>
          <h2 className="text-text-muted text-xs uppercase tracking-wider mb-3">Later Levels</h2>
          <div className="flex flex-col gap-3">
            <div className="rounded-2xl px-4 py-4" style={{ background: "oklch(16% 0.02 60)" }}>
              <div className="flex justify-between items-center">
                <span className="text-text-primary">Sentence reading</span>
                <span className="font-mono text-gold">{sentencesSeen}/{SENTENCES.length}</span>
              </div>
              <div className="mt-3 h-1 rounded-full" style={{ background: "oklch(95% 0.01 75 / 10%)" }}>
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${Math.round((sentencesSeen / SENTENCES.length) * 100)}%`,
                    background: "oklch(72% 0.12 75)",
                  }}
                />
              </div>
            </div>
            <div className="rounded-2xl px-4 py-4" style={{ background: "oklch(16% 0.02 60)" }}>
              <div className="flex justify-between items-center">
                <span className="text-text-primary">Urdu writing</span>
                <span className="font-mono text-teal">
                  {Object.keys(productionProgress).length}/{PRODUCTION_PROMPTS.length}
                </span>
              </div>
              <div className="mt-3 h-1 rounded-full" style={{ background: "oklch(95% 0.01 75 / 10%)" }}>
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${Math.round((Object.keys(productionProgress).length / PRODUCTION_PROMPTS.length) * 100)}%`,
                    background: "oklch(68% 0.08 175)",
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Activity heatmap */}
        <div>
          <h2 className="text-text-muted text-xs uppercase tracking-wider mb-3">Activity</h2>
          <div className="grid grid-cols-7 gap-1" aria-label="Daily activity heatmap">
            {heatmapDays.map((day) => (
              <div
                key={day.key}
                title={`${day.key}: ${day.count} activities`}
                aria-label={`${day.key}: ${day.count} activities`}
                className="aspect-square rounded"
                style={{
                  background:
                    day.count === 0
                      ? "oklch(95% 0.01 75 / 8%)"
                      : day.count < 2
                        ? "oklch(72% 0.12 75 / 25%)"
                        : day.count < 5
                          ? "oklch(72% 0.12 75 / 50%)"
                          : "oklch(72% 0.12 75 / 80%)",
                }}
              />
            ))}
          </div>
        </div>

        {/* Export / Import */}
        <div>
          <h2 className="text-text-muted text-xs uppercase tracking-wider mb-3">Data</h2>
          <div className="flex flex-col gap-3">
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={handleExport}
              className="w-full py-4 rounded-2xl border text-text-primary font-medium min-h-[44px]"
              style={{ border: "1px solid oklch(72% 0.12 75 / 30%)", background: "oklch(16% 0.02 60)" }}
            >
              Export progress
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={handleImportClick}
              className="w-full py-4 rounded-2xl border text-text-muted font-medium min-h-[44px]"
              style={{ border: "1px solid oklch(95% 0.01 75 / 10%)", background: "oklch(16% 0.02 60)" }}
            >
              Import progress
            </motion.button>
            <p className="text-text-muted text-xs text-center">
              Import will replace your current progress
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
