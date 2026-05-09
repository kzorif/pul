"use client"

import { useState } from "react"

const missingAudio = new Set<string>()

function audioCandidates(filename: string): string[] {
  if (!filename) return []
  if (filename.startsWith("/")) return [filename]
  if (filename.includes("/")) return [`/assets/audio/${filename}`]

  return [
    `/assets/audio/${filename}`,
    `/assets/audio/characters/${filename}`,
    `/assets/audio/anchors/${filename}`,
    `/assets/audio/words/${filename}`,
    `/assets/audio/sentences/${filename}`,
  ]
}

function canUseAudio() {
  return typeof window !== "undefined" && typeof Audio !== "undefined"
}

async function findAudioPath(filename: string): Promise<string | null> {
  for (const path of audioCandidates(filename)) {
    if (missingAudio.has(path)) continue
    try {
      const response = await fetch(path, { method: "HEAD", cache: "force-cache" })
      if (response.ok) return path
      missingAudio.add(path)
    } catch {
      missingAudio.add(path)
    }
  }

  return null
}

export async function playAudio(filename: string): Promise<void> {
  if (!canUseAudio() || !filename) return Promise.resolve()

  const path = await findAudioPath(filename)
  if (!path) return Promise.resolve()

  try {
    const audio = new Audio(path)
    await audio.play()
  } catch (error) {
    console.warn("Audio failed silently:", error)
  }
}

export function useAudio(filename: string) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const play = async () => {
    if (isPlaying) return
    setIsLoading(true)
    try {
      await playAudio(filename)
      setIsPlaying(true)
    } finally {
      setIsLoading(false)
      setTimeout(() => setIsPlaying(false), 1000)
    }
  }

  return {
    play,
    isPlaying,
    isLoading,
  }
}
