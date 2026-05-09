"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { useProgressStore } from "@/store/progressStore"
import { track } from "@/utils/analytics"

type Screen = 1 | 2 | 3 | 4

const LANGUAGES = [
  { id: "urdu-spoken", label: "Urdu (spoken)", desc: "I speak Urdu but can't read the script" },
  { id: "hindi", label: "Hindi", desc: "I know Devanagari / Hindi" },
  { id: "neither", label: "Neither", desc: "Starting from scratch" },
]

export default function OnboardingPage() {
  const router = useRouter()
  const { completeOnboarding } = useProgressStore()
  const [screen, setScreen] = useState<Screen>(1)
  const [selected, setSelected] = useState<Set<string>>(new Set())

  const next = () => setScreen((s) => (s + 1) as Screen)

  const finish = () => {
    const lang = Array.from(selected)[0] ?? "neither"
    completeOnboarding(lang)
    track("onboarding_complete", { background: lang })
    router.replace("/session/character/1")
  }

  return (
    <main className="min-h-dvh flex flex-col items-center justify-center px-6 py-12">
      <AnimatePresence mode="wait">
        {screen === 1 && (
          <Screen1 key="s1" onNext={next} />
        )}
        {screen === 2 && (
          <Screen2
            key="s2"
            selected={selected}
            onToggle={(id) =>
              setSelected((prev) => {
                const next = new Set(prev)
                next.has(id) ? next.delete(id) : next.add(id)
                return next
              })
            }
            onNext={next}
          />
        )}
        {screen === 3 && (
          <Screen3 key="s3" onNext={next} />
        )}
        {screen === 4 && (
          <Screen4 key="s4" onFinish={finish} />
        )}
      </AnimatePresence>
    </main>
  )
}

function Screen1({ onNext }: { onNext: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex flex-col items-center gap-8 text-center max-w-sm w-full"
    >
      <motion.span
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, type: "spring" }}
        className="urdu text-gold"
        style={{ fontSize: "96px" }}
      >
        پل
      </motion.span>
      <div>
        <p className="text-gold text-xl font-mono tracking-widest">Pul · bridge</p>
        <p className="text-text-muted text-sm mt-2">
          Learn to read Urdu, one character at a time
        </p>
      </div>
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={onNext}
        className="w-full py-4 rounded-2xl bg-gold text-background font-medium text-lg min-h-[44px]"
      >
        Begin
      </motion.button>
    </motion.div>
  )
}

function Screen2({
  selected,
  onToggle,
  onNext,
}: {
  selected: Set<string>
  onToggle: (id: string) => void
  onNext: () => void
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      className="flex flex-col gap-6 max-w-sm w-full"
    >
      <h2 className="text-text-primary text-xl font-medium text-center">
        Do you speak any of these?
      </h2>
      <div className="flex flex-col gap-3">
        {LANGUAGES.map((lang) => (
          <motion.button
            key={lang.id}
            whileTap={{ scale: 0.97 }}
            onClick={() => onToggle(lang.id)}
            className="flex flex-col items-start px-5 py-4 rounded-2xl border transition-colors text-left min-h-[44px]"
            style={{
              border: selected.has(lang.id)
                ? "1px solid oklch(72% 0.12 75)"
                : "1px solid oklch(95% 0.01 75 / 15%)",
              background: selected.has(lang.id)
                ? "oklch(72% 0.12 75 / 10%)"
                : "oklch(16% 0.02 60)",
            }}
          >
            <span className="text-text-primary font-medium">{lang.label}</span>
            <span className="text-text-muted text-sm mt-0.5">{lang.desc}</span>
          </motion.button>
        ))}
      </div>
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={onNext}
        className="w-full py-4 rounded-2xl bg-gold text-background font-medium text-lg min-h-[44px]"
      >
        Continue
      </motion.button>
    </motion.div>
  )
}

const STEPS = [
  { char: "ب", label: "See a character" },
  { char: "b", label: "Learn its sound", mono: true },
  { char: "بچوں کی دعا", label: "Read poetry", urdu: true },
]

function Screen3({ onNext }: { onNext: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      className="flex flex-col gap-8 max-w-sm w-full"
    >
      <h2 className="text-text-primary text-xl font-medium text-center">How it works</h2>
      <div className="flex flex-col gap-4">
        {STEPS.map((step, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 * i }}
            className="flex items-center gap-4 px-4 py-4 rounded-2xl"
            style={{ background: "oklch(16% 0.02 60)" }}
          >
            <span className="text-text-muted font-mono text-sm w-4">{i + 1}</span>
            <span
              className={step.urdu ? "urdu text-text-primary" : step.mono ? "font-mono text-gold text-2xl" : "urdu text-gold text-4xl"}
              style={step.urdu ? { fontSize: "22px" } : {}}
            >
              {step.char}
            </span>
            <span className="text-text-muted text-sm ml-auto">{step.label}</span>
          </motion.div>
        ))}
      </div>
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={onNext}
        className="w-full py-4 rounded-2xl bg-gold text-background font-medium text-lg min-h-[44px]"
      >
        Got it
      </motion.button>
    </motion.div>
  )
}

function Screen4({ onFinish }: { onFinish: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      className="flex flex-col items-center gap-8 max-w-sm w-full text-center"
    >
      <p className="text-text-muted text-sm">Your first character:</p>
      <motion.span
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 200 }}
        className="urdu text-gold"
        style={{ fontSize: "120px" }}
      >
        ا
      </motion.span>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-gold font-mono text-xl"
      >
        a / aa
      </motion.p>
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        whileTap={{ scale: 0.95 }}
        onClick={onFinish}
        className="w-full py-4 rounded-2xl bg-gold text-background font-medium text-lg min-h-[44px]"
      >
        Let&apos;s begin
      </motion.button>
    </motion.div>
  )
}
