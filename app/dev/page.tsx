"use client"

import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { useProgressStore } from "@/store/progressStore"
import { CHARACTERS } from "@/data/characters"
import { WORDS } from "@/data/words"
import { SENTENCES } from "@/data/sentences"

export default function DevPage() {
  const router = useRouter()
  const {
    devUnlockAll,
    devResetAll,
    devSetLevel,
    onboardingComplete,
    streak,
    currentLevel,
    charactersUnlocked,
  } = useProgressStore()

  return (
    <div className="min-h-dvh px-4 py-6 max-w-md mx-auto flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-gold font-mono text-lg">DEV MODE</h1>
          <p className="text-text-muted text-xs">
            onboarding: {onboardingComplete ? "✓" : "✗"} · level: {currentLevel} · unlocked: {charactersUnlocked}/18 · streak: {streak}
          </p>
        </div>
        <button
          onClick={() => router.push("/home")}
          className="text-text-muted text-sm min-h-[44px] px-3"
        >
          ← Home
        </button>
      </div>

      {/* Jump to level */}
      <div className="flex flex-col gap-2">
        <p className="text-text-muted text-xs uppercase tracking-wider">Jump to level</p>
        <div className="grid grid-cols-5 gap-2">
          {([1, 2, 3, 4, 5] as const).map((lvl) => (
            <motion.button
              key={lvl}
              whileTap={{ scale: 0.95 }}
              onClick={() => { devSetLevel(lvl); router.push("/home") }}
              className="py-3 rounded-xl text-sm font-mono font-medium min-h-[44px]"
              style={{
                background: currentLevel === lvl ? "oklch(72% 0.12 75 / 15%)" : "oklch(16% 0.02 60)",
                border: currentLevel === lvl
                  ? "1px solid oklch(72% 0.12 75 / 60%)"
                  : "1px solid oklch(95% 0.01 75 / 12%)",
                color: currentLevel === lvl ? "oklch(72% 0.12 75)" : "oklch(95% 0.01 75 / 60%)",
              }}
            >
              L{lvl}
            </motion.button>
          ))}
        </div>
        <p className="text-text-muted text-[10px]">
          L1=Characters · L2=Words · L3=Sentences · L4=Prose · L5=Production
        </p>
      </div>

      {/* Quick actions */}
      <div className="flex flex-col gap-2">
        <p className="text-text-muted text-xs uppercase tracking-wider">Quick actions</p>
        <div className="grid grid-cols-2 gap-2">
          <DevButton
            label="Unlock everything"
            sublabel="all chars + words, level 5"
            color="gold"
            onClick={() => { devUnlockAll(); router.push("/home") }}
          />
          <DevButton
            label="Reset everything"
            sublabel="back to fresh start"
            color="red"
            onClick={() => { devResetAll(); router.push("/onboarding") }}
          />
          <DevButton
            label="Skip onboarding"
            sublabel="go straight to home"
            color="teal"
            onClick={() => {
              useProgressStore.getState().completeOnboarding("neither")
              router.push("/home")
            }}
          />
          <DevButton
            label="Daily session"
            sublabel="today's review queue"
            color="purple"
            onClick={() => router.push("/session/daily")}
          />
        </div>
      </div>

      {/* Session links */}
      <div className="flex flex-col gap-2">
        <p className="text-text-muted text-xs uppercase tracking-wider">Sessions</p>
        <div className="grid grid-cols-2 gap-2">
          {[
            { label: "Words (L2)", sub: "10-word session", path: "/session/words", color: "oklch(68% 0.08 175 / 40%)" },
            { label: "Sentences L3", sub: "with audio scaffold", path: "/session/sentences?level=3", color: "oklch(65% 0.08 290 / 40%)" },
            { label: "Sentences L4", sub: "cold reading", path: "/session/sentences?level=4", color: "oklch(65% 0.08 290 / 40%)" },
            { label: "Production (L5)", sub: "write in Urdu", path: "/session/production", color: "oklch(72% 0.12 75 / 40%)" },
          ].map((item) => (
            <motion.button
              key={item.path}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push(item.path)}
              className="flex flex-col items-start px-4 py-3 rounded-xl text-left min-h-[44px]"
              style={{ background: "oklch(16% 0.02 60)", border: `1px solid ${item.color}` }}
            >
              <span className="text-sm font-medium text-text-primary">{item.label}</span>
              <span className="text-xs mt-0.5 text-text-muted">{item.sub}</span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Pages */}
      <div className="flex flex-col gap-2">
        <p className="text-text-muted text-xs uppercase tracking-wider">Pages</p>
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: "Home", path: "/home" },
            { label: "Progress", path: "/progress" },
            { label: "Settings", path: "/settings" },
            { label: "Onboarding", path: "/onboarding" },
          ].map((p) => (
            <motion.button
              key={p.path}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push(p.path)}
              className="py-3 rounded-xl text-sm font-medium min-h-[44px]"
              style={{
                background: "oklch(16% 0.02 60)",
                border: "1px solid oklch(95% 0.01 75 / 12%)",
                color: "oklch(95% 0.01 75 / 70%)",
              }}
            >
              {p.label}
            </motion.button>
          ))}
        </div>
      </div>

      {/* All 18 character sessions */}
      <div className="flex flex-col gap-2">
        <p className="text-text-muted text-xs uppercase tracking-wider">
          Character sessions — tap any (all 18 unlocked)
        </p>
        <div className="grid grid-cols-6 gap-2">
          {CHARACTERS.map((char) => (
            <motion.button
              key={char.id}
              whileTap={{ scale: 0.9 }}
              onClick={() => router.push(`/session/character/${char.id}`)}
              className="aspect-square rounded-xl flex flex-col items-center justify-center gap-0.5 min-h-[44px]"
              style={{
                background: "oklch(16% 0.02 60)",
                border: "1px solid oklch(72% 0.12 75 / 20%)",
              }}
            >
              <span className="urdu text-gold" style={{ fontSize: "24px" }}>
                {char.urdu}
              </span>
              <span className="text-text-muted font-mono" style={{ fontSize: "9px" }}>
                {char.roman}
              </span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* All 25 words */}
      <div className="flex flex-col gap-2">
        <p className="text-text-muted text-xs uppercase tracking-wider">
          All 25 words
        </p>
        <div className="flex flex-wrap gap-2">
          {WORDS.map((word) => (
            <motion.button
              key={word.id}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push("/session/words")}
              className="px-3 py-2 rounded-lg text-sm min-h-[44px] flex items-center gap-2"
              style={{
                background: "oklch(16% 0.02 60)",
                border: "1px solid oklch(95% 0.01 75 / 12%)",
              }}
            >
              <span className="urdu text-gold" style={{ fontSize: "20px" }}>{word.urdu}</span>
              <span className="text-text-muted text-xs font-mono">{word.roman}</span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Sentences */}
      <div className="flex flex-col gap-2">
        <p className="text-text-muted text-xs uppercase tracking-wider">
          Sentences ({SENTENCES.length} total)
        </p>
        <div className="flex flex-col gap-1">
          {SENTENCES.slice(0, 5).map((s) => (
            <motion.button
              key={s.id}
              whileTap={{ scale: 0.98 }}
              onClick={() => router.push(`/session/sentences?level=${s.level}`)}
              className="px-3 py-2 rounded-lg text-left min-h-[44px] flex items-center justify-between gap-3"
              style={{
                background: "oklch(16% 0.02 60)",
                border: "1px solid oklch(95% 0.01 75 / 10%)",
              }}
            >
              <span className="urdu text-text-primary text-right flex-1" style={{ fontSize: "18px" }}>
                {s.urdu}
              </span>
              <span className="text-text-muted text-[10px] font-mono shrink-0">L{s.level}</span>
            </motion.button>
          ))}
          {SENTENCES.length > 5 && (
            <p className="text-text-muted text-xs px-1">+ {SENTENCES.length - 5} more sentences in data</p>
          )}
        </div>
      </div>
    </div>
  )
}

function DevButton({
  label,
  sublabel,
  color,
  onClick,
}: {
  label: string
  sublabel: string
  color: "gold" | "red" | "teal" | "purple"
  onClick: () => void
}) {
  const borderColor =
    color === "gold" ? "oklch(72% 0.12 75 / 40%)"
    : color === "red" ? "oklch(60% 0.2 25 / 40%)"
    : color === "teal" ? "oklch(68% 0.08 175 / 40%)"
    : "oklch(65% 0.08 290 / 40%)"

  const textColor =
    color === "gold" ? "oklch(72% 0.12 75)"
    : color === "red" ? "oklch(65% 0.2 25)"
    : color === "teal" ? "oklch(68% 0.08 175)"
    : "oklch(65% 0.08 290)"

  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="flex flex-col items-start px-4 py-3 rounded-xl text-left min-h-[44px]"
      style={{ background: "oklch(16% 0.02 60)", border: `1px solid ${borderColor}` }}
    >
      <span className="text-sm font-medium" style={{ color: textColor }}>
        {label}
      </span>
      <span className="text-xs mt-0.5" style={{ color: "oklch(95% 0.01 75 / 35%)" }}>
        {sublabel}
      </span>
    </motion.button>
  )
}
