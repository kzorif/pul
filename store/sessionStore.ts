"use client"

import { create } from "zustand"

interface SessionStore {
  activeCharacterId: number | null
  activeWordIds: string[]
  setActiveCharacter: (id: number | null) => void
  setActiveWords: (ids: string[]) => void
  resetSession: () => void
}

export const useSessionStore = create<SessionStore>((set) => ({
  activeCharacterId: null,
  activeWordIds: [],
  setActiveCharacter: (id) => set({ activeCharacterId: id }),
  setActiveWords: (ids) => set({ activeWordIds: ids }),
  resetSession: () => set({ activeCharacterId: null, activeWordIds: [] }),
}))
