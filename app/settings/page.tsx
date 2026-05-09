"use client"

import { useRouter } from "next/navigation"
import { useProgressStore } from "@/store/progressStore"

export default function SettingsPage() {
  const router = useRouter()
  const showIPA = useProgressStore((state) => state.showIPA)
  const toggleIPA = useProgressStore((state) => state.toggleIPA)

  return (
    <main className="min-h-dvh max-w-md mx-auto px-5 py-5">
      <div className="flex items-center gap-3">
        <button onClick={() => router.back()} className="text-text-muted text-sm min-h-[44px] pr-4">
          ← Back
        </button>
        <h1 className="text-text-primary font-medium">Settings</h1>
      </div>

      <section className="mt-8 flex flex-col gap-3">
        <button
          onClick={toggleIPA}
          className="w-full flex items-center justify-between rounded-2xl px-5 py-4 min-h-[64px]"
          style={{
            background: "oklch(16% 0.02 60)",
            border: "1px solid oklch(95% 0.01 75 / 10%)",
          }}
        >
          <span className="text-text-primary">Show IPA pronunciation</span>
          <span
            className="w-12 h-7 rounded-full p-1 transition-colors"
            style={{ background: showIPA ? "oklch(72% 0.12 75)" : "oklch(95% 0.01 75 / 15%)" }}
          >
            <span
              className="block w-5 h-5 rounded-full transition-transform"
              style={{
                background: showIPA ? "oklch(12% 0.02 60)" : "oklch(95% 0.01 75 / 70%)",
                transform: showIPA ? "translateX(20px)" : "translateX(0)",
              }}
            />
          </span>
        </button>
        <button
          onClick={() => router.push("/dev")}
          className="w-full flex items-center justify-between rounded-2xl px-5 py-4 min-h-[64px]"
          style={{
            background: "oklch(16% 0.02 60)",
            border: "1px solid oklch(95% 0.01 75 / 10%)",
          }}
        >
          <span className="text-text-primary">Developer tools</span>
          <span className="text-text-muted text-xs font-mono">→</span>
        </button>
      </section>
    </main>
  )
}
