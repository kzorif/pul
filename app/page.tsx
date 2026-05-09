"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useProgressStore } from "@/store/progressStore"

export default function RootPage() {
  const router = useRouter()
  const onboardingComplete = useProgressStore((s) => s.onboardingComplete)

  useEffect(() => {
    if (onboardingComplete) {
      router.replace("/home")
    } else {
      router.replace("/onboarding")
    }
  }, [onboardingComplete, router])

  return (
    <main className="min-h-dvh flex items-center justify-center">
      <span className="urdu text-gold animate-pulse" style={{ fontSize: "48px" }}>پل</span>
    </main>
  )
}
