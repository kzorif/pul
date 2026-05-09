"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import { SM2, SM2Card } from "@/utils/spaceRepetition"
import { WORDS } from "@/data/words"
import { SENTENCES } from "@/data/sentences"

export interface CharacterProgress {
  characterId: number
  statesCompleted: number[] // indices 0-5 of the 6 states
  sm2: SM2Card
  lastSeen: string // ISO date
}

export interface WordProgress {
  wordId: string
  timesTyped: number
  bestAccuracy: number
  sm2: SM2Card
  lastSeen: string
}

export interface SentenceProgress {
  sentenceId: string
  timesTyped: number
  bestAccuracy: number
  sm2: SM2Card
  lastSeen: string
}

export interface ProductionProgress {
  promptId: string
  attempts: number
  bestAccuracy: number
  lastSeen: string
}

interface ProgressStore {
  // Onboarding
  onboardingComplete: boolean
  languageBackground: "urdu-spoken" | "hindi" | "neither" | null

  // Level gates
  currentLevel: 1 | 2 | 3 | 4 | 5
  charactersUnlocked: number
  showIPA: boolean
  sovExplainerShown: boolean
  sovExplainerShownLevel3: boolean
  sovExplainerShownLevel4: boolean
  lastUnlockedLevel: 1 | 2 | 3 | 4 | 5 | null
  lastStreakMilestone: number | null

  // Progress maps
  characterProgress: Record<number, CharacterProgress>
  wordProgress: Record<string, WordProgress>
  sentenceProgress: Record<string, SentenceProgress>
  productionProgress: Record<string, ProductionProgress>

  // Streak
  streak: number
  longestStreak: number
  lastSessionDate: string | null

  // Actions
  completeOnboarding: (language: string) => void
  markCharacterStateComplete: (charId: number, stateIndex: number) => void
  markCharacterCorrect: (charId: number) => void
  markCharacterIncorrect: (charId: number) => void
  markWordTyped: (wordId: string, accuracy: number) => void
  markSentenceTyped: (sentenceId: string, accuracy: number) => void
  markProductionAttempt: (promptId: string, accuracy: number) => void
  updateStreak: () => void
  toggleIPA: () => void
  dismissSOVExplainer: (level?: 3 | 4) => void
  clearLevelUnlock: () => void
  clearStreakMilestone: () => void
  getCharactersDueForReview: () => number[]
  getWordsDueForReview: () => string[]
  getSentencesDueForReview: () => string[]
  buildDailySession: () => Array<{ type: "character" | "word" | "sentence"; id: number | string; isReview?: boolean }>
  exportProgress: () => string
  importProgress: (json: string) => void
  // Dev mode
  devUnlockAll: () => void
  devResetAll: () => void
  devSetLevel: (level: 1 | 2 | 3 | 4 | 5) => void
}

export const useProgressStore = create<ProgressStore>()(
  persist(
    (set, get) => ({
      onboardingComplete: false,
      languageBackground: null,
      currentLevel: 1,
      charactersUnlocked: 3,
      showIPA: false,
      sovExplainerShown: false,
      sovExplainerShownLevel3: false,
      sovExplainerShownLevel4: false,
      lastUnlockedLevel: null,
      lastStreakMilestone: null,
      characterProgress: {},
      wordProgress: {},
      sentenceProgress: {},
      productionProgress: {},
      streak: 0,
      longestStreak: 0,
      lastSessionDate: null,

      completeOnboarding: (language) =>
        set({
          onboardingComplete: true,
          languageBackground: language as "urdu-spoken" | "hindi" | "neither",
          // speakers of Urdu or Hindi already know the sounds — give them a head start
          charactersUnlocked: language === "urdu-spoken" || language === "hindi" ? 6 : 3,
        }),

      markCharacterStateComplete: (charId, stateIndex) =>
        set((state) => {
          const existing = state.characterProgress[charId] ?? {
            characterId: charId,
            statesCompleted: [],
            sm2: SM2.newCard(),
            lastSeen: new Date().toISOString(),
          }
          const statesCompleted = [...new Set([...existing.statesCompleted, stateIndex])]
          const allDone = statesCompleted.length >= 6
          const newUnlocked = allDone
            ? Math.min(18, state.charactersUnlocked + 1)
            : state.charactersUnlocked
          const updatedProgress = {
            ...state.characterProgress,
            [charId]: { ...existing, statesCompleted, lastSeen: new Date().toISOString() },
          }
          const masteredCount = Object.values(updatedProgress).filter(
            (p) => p.statesCompleted.length >= 6,
          ).length
          const newLevel: 1 | 2 | 3 | 4 | 5 = masteredCount >= 18 ? 2 : 1
          const nextLevel = Math.max(state.currentLevel, newLevel) as 1 | 2 | 3 | 4 | 5
          return {
            charactersUnlocked: newUnlocked,
            currentLevel: nextLevel,
            lastUnlockedLevel: nextLevel > state.currentLevel ? nextLevel : state.lastUnlockedLevel,
            characterProgress: updatedProgress,
          }
        }),

      markCharacterCorrect: (charId) =>
        set((state) => {
          const existing = state.characterProgress[charId]
          if (!existing) return state
          return {
            characterProgress: {
              ...state.characterProgress,
              [charId]: { ...existing, sm2: SM2.correct(existing.sm2) },
            },
          }
        }),

      markCharacterIncorrect: (charId) =>
        set((state) => {
          const existing = state.characterProgress[charId]
          if (!existing) return state
          return {
            characterProgress: {
              ...state.characterProgress,
              [charId]: { ...existing, sm2: SM2.incorrect(existing.sm2) },
            },
          }
        }),

      markWordTyped: (wordId, accuracy) =>
        set((state) => {
          const existing = state.wordProgress[wordId] ?? {
            wordId,
            timesTyped: 0,
            bestAccuracy: 0,
            sm2: SM2.newCard(),
            lastSeen: new Date().toISOString(),
          }
          const sm2 = accuracy >= 85 ? SM2.correct(existing.sm2) : SM2.incorrect(existing.sm2)
          const updatedWordProgress = {
            ...state.wordProgress,
            [wordId]: {
              ...existing,
              timesTyped: existing.timesTyped + 1,
              bestAccuracy: Math.max(existing.bestAccuracy, accuracy),
              sm2,
              lastSeen: new Date().toISOString(),
            },
          }
          const nextLevel = Object.keys(updatedWordProgress).length >= 18
            ? Math.max(state.currentLevel, 3)
            : state.currentLevel
          return {
            currentLevel: nextLevel as 1 | 2 | 3 | 4 | 5,
            lastUnlockedLevel: nextLevel > state.currentLevel ? nextLevel as 1 | 2 | 3 | 4 | 5 : state.lastUnlockedLevel,
            wordProgress: {
              ...updatedWordProgress,
            },
          }
        }),

      markSentenceTyped: (sentenceId, accuracy) =>
        set((state) => {
          const existing = state.sentenceProgress[sentenceId] ?? {
            sentenceId,
            timesTyped: 0,
            bestAccuracy: 0,
            sm2: SM2.newCard(),
            lastSeen: new Date().toISOString(),
          }
          const sm2 = accuracy >= 80 ? SM2.correct(existing.sm2) : SM2.incorrect(existing.sm2)
          const updatedSentenceProgress = {
            ...state.sentenceProgress,
            [sentenceId]: {
              ...existing,
              timesTyped: existing.timesTyped + 1,
              bestAccuracy: Math.max(existing.bestAccuracy, accuracy),
              sm2,
              lastSeen: new Date().toISOString(),
            },
          }
          const level3Count = Object.keys(updatedSentenceProgress).filter((id) => {
            const sentence = SENTENCES.find((item) => item.id === id)
            return sentence?.level === 3
          }).length
          const level4Count = Object.keys(updatedSentenceProgress).filter((id) => {
            const sentence = SENTENCES.find((item) => item.id === id)
            return sentence?.level === 4
          }).length
          const nextLevel =
            level4Count >= 15
              ? 5
              : level3Count >= 15
                ? 4
                : Math.max(state.currentLevel, 3)
          return {
            currentLevel: nextLevel as 1 | 2 | 3 | 4 | 5,
            lastUnlockedLevel:
              nextLevel > state.currentLevel ? nextLevel as 1 | 2 | 3 | 4 | 5 : state.lastUnlockedLevel,
            sentenceProgress: updatedSentenceProgress,
          }
        }),

      markProductionAttempt: (promptId, accuracy) =>
        set((state) => {
          const existing = state.productionProgress[promptId] ?? {
            promptId,
            attempts: 0,
            bestAccuracy: 0,
            lastSeen: new Date().toISOString(),
          }
          return {
            currentLevel: Math.max(state.currentLevel, 5) as 1 | 2 | 3 | 4 | 5,
            lastUnlockedLevel: state.currentLevel < 5 ? 5 : state.lastUnlockedLevel,
            productionProgress: {
              ...state.productionProgress,
              [promptId]: {
                ...existing,
                attempts: existing.attempts + 1,
                bestAccuracy: Math.max(existing.bestAccuracy, accuracy),
                lastSeen: new Date().toISOString(),
              },
            },
          }
        }),

      updateStreak: () =>
        set((state) => {
          const today = new Date().toDateString()
          const yesterday = new Date(Date.now() - 86400000).toDateString()
          if (state.lastSessionDate === today) return state
          const newStreak =
            state.lastSessionDate === yesterday ? state.streak + 1 : 1
          const milestone = [3, 7, 14, 30].includes(newStreak) ? newStreak : null
          return {
            streak: newStreak,
            longestStreak: Math.max(newStreak, state.longestStreak),
            lastSessionDate: today,
            lastStreakMilestone: milestone,
          }
        }),

      toggleIPA: () => set((state) => ({ showIPA: !state.showIPA })),

      dismissSOVExplainer: (level) =>
        set((state) => ({
          sovExplainerShown: true,
          sovExplainerShownLevel3:
            level === 3 || (!level && !state.sovExplainerShownLevel4)
              ? true
              : state.sovExplainerShownLevel3,
          sovExplainerShownLevel4:
            level === 4 ? true : state.sovExplainerShownLevel4,
        })),

      clearLevelUnlock: () => set({ lastUnlockedLevel: null }),

      clearStreakMilestone: () => set({ lastStreakMilestone: null }),

      getCharactersDueForReview: () => {
        const { characterProgress } = get()
        const today = new Date()
        return Object.values(characterProgress)
          .filter((p) => {
            if (p.statesCompleted.length < 6) return false
            return new Date(p.sm2.nextReviewDate) <= today
          })
          .map((p) => p.characterId)
      },

      getWordsDueForReview: () => {
        const { wordProgress } = get()
        const today = new Date()
        return Object.values(wordProgress)
          .filter((p) => new Date(p.sm2.nextReviewDate) <= today)
          .map((p) => p.wordId)
      },

      getSentencesDueForReview: () => {
        const { sentenceProgress } = get()
        const today = new Date()
        return Object.values(sentenceProgress)
          .filter((p) => new Date(p.sm2.nextReviewDate) <= today)
          .map((p) => p.sentenceId)
      },

      buildDailySession: () => {
        const {
          getCharactersDueForReview,
          getWordsDueForReview,
          getSentencesDueForReview,
          characterProgress,
          wordProgress,
          currentLevel,
        } = get()

        const reviewChars = getCharactersDueForReview().slice(0, 5)
        const reviewWords = getWordsDueForReview().slice(0, 5)
        const reviewSentences = currentLevel >= 3 ? getSentencesDueForReview().slice(0, 3) : []
        const newChars = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18]
          .filter((id) => !characterProgress[id] || characterProgress[id].statesCompleted.length < 6)
          .slice(0, 1)

        if (currentLevel >= 2) {
          // Level 2+: words lead; pull in unseen words to fill out the session
          const newWords = WORDS
            .filter((w) => !wordProgress[w.id])
            .slice(0, Math.max(0, 8 - reviewWords.length))
          return [
            ...reviewWords.map((id) => ({ type: "word" as const, id, isReview: true })),
            ...newWords.map((w) => ({ type: "word" as const, id: w.id, isReview: false })),
            ...reviewSentences.map((id) => ({ type: "sentence" as const, id, isReview: true })),
            ...reviewChars.map((id) => ({ type: "character" as const, id, isReview: true })),
          ]
        }

        // Level 1: characters lead
        return [
          ...reviewChars.map((id) => ({ type: "character" as const, id, isReview: true })),
          ...reviewWords.map((id) => ({ type: "word" as const, id, isReview: true })),
          ...newChars.map((id) => ({ type: "character" as const, id, isReview: false })),
        ]
      },

      exportProgress: () => {
        const state = get()
        return JSON.stringify(
          {
            version: 1,
            exportedAt: new Date().toISOString(),
            characterProgress: state.characterProgress,
            wordProgress: state.wordProgress,
            sentenceProgress: state.sentenceProgress,
            productionProgress: state.productionProgress,
            streak: state.streak,
            longestStreak: state.longestStreak,
            currentLevel: state.currentLevel,
            showIPA: state.showIPA,
            sovExplainerShown: state.sovExplainerShown,
            sovExplainerShownLevel3: state.sovExplainerShownLevel3,
            sovExplainerShownLevel4: state.sovExplainerShownLevel4,
          },
          null,
          2,
        )
      },

      importProgress: (json) => {
        try {
          const data = JSON.parse(json)
          if (data.version !== 1) throw new Error("Unknown version")
          set({
            characterProgress: data.characterProgress,
            wordProgress: data.wordProgress,
            sentenceProgress: data.sentenceProgress ?? {},
            productionProgress: data.productionProgress ?? {},
            streak: data.streak,
            longestStreak: data.longestStreak,
            currentLevel: data.currentLevel,
            showIPA: data.showIPA ?? false,
            sovExplainerShown: data.sovExplainerShown ?? false,
            sovExplainerShownLevel3:
              data.sovExplainerShownLevel3 ?? data.sovExplainerShown ?? false,
            sovExplainerShownLevel4: data.sovExplainerShownLevel4 ?? false,
          })
        } catch (e) {
          console.error("Import failed:", e)
        }
      },

      devUnlockAll: () => {
        const now = new Date().toISOString()
        const allProgress: Record<number, CharacterProgress> = {}
        for (let id = 1; id <= 18; id++) {
          allProgress[id] = {
            characterId: id,
            statesCompleted: [0, 1, 2, 3, 4, 5],
            sm2: SM2.newCard(),
            lastSeen: now,
          }
        }
        const wordProg: Record<string, WordProgress> = {}
        WORDS.forEach((w) => {
          wordProg[w.id] = { wordId: w.id, timesTyped: 3, bestAccuracy: 90, sm2: SM2.newCard(), lastSeen: now }
        })
        set({
          onboardingComplete: true,
          charactersUnlocked: 18,
          currentLevel: 5,
          showIPA: true,
          characterProgress: allProgress,
          wordProgress: wordProg,
          streak: 5,
          longestStreak: 5,
        })
      },

      devSetLevel: (level) => {
        const now = new Date().toISOString()
        const allProgress: Record<number, CharacterProgress> = {}
        for (let id = 1; id <= 18; id++) {
          allProgress[id] = {
            characterId: id,
            statesCompleted: [0, 1, 2, 3, 4, 5],
            sm2: SM2.newCard(),
            lastSeen: now,
          }
        }
        const wordProg: Record<string, WordProgress> = {}
        if (level >= 2) {
          WORDS.forEach((w) => {
            wordProg[w.id] = { wordId: w.id, timesTyped: 3, bestAccuracy: 90, sm2: SM2.newCard(), lastSeen: now }
          })
        }
        set({
          onboardingComplete: true,
          charactersUnlocked: 18,
          currentLevel: level,
          showIPA: true,
          characterProgress: allProgress,
          wordProgress: wordProg,
          streak: 5,
          longestStreak: 5,
          sovExplainerShownLevel3: level > 3,
          sovExplainerShownLevel4: level > 4,
          sovExplainerShown: level > 3,
        })
      },

      devResetAll: () =>
        set({
          onboardingComplete: false,
          languageBackground: null,
          currentLevel: 1,
          charactersUnlocked: 3,
          characterProgress: {},
          wordProgress: {},
          sentenceProgress: {},
          productionProgress: {},
          streak: 0,
          longestStreak: 0,
          lastSessionDate: null,
          showIPA: false,
          sovExplainerShown: false,
          sovExplainerShownLevel3: false,
          sovExplainerShownLevel4: false,
          lastUnlockedLevel: null,
          lastStreakMilestone: null,
        }),
    }),
    { name: "pul-progress" },
  ),
)
