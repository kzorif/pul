export interface SM2Card {
  interval: number
  repetitions: number
  easeFactor: number
  nextReviewDate: string // ISO date
}

export const SM2 = {
  newCard: (): SM2Card => ({
    interval: 1,
    repetitions: 0,
    easeFactor: 2.5,
    nextReviewDate: new Date().toISOString(),
  }),

  correct: (card: SM2Card): SM2Card => {
    const repetitions = card.repetitions + 1
    const interval =
      repetitions === 1 ? 1
      : repetitions === 2 ? 6
      : Math.round(card.interval * card.easeFactor)
    const easeFactor = Math.max(1.3, card.easeFactor + 0.1)
    const nextReviewDate = new Date(Date.now() + interval * 86400000).toISOString()
    return { interval, repetitions, easeFactor, nextReviewDate }
  },

  incorrect: (card: SM2Card): SM2Card => ({
    interval: 1,
    repetitions: 0,
    easeFactor: Math.max(1.3, card.easeFactor - 0.2),
    nextReviewDate: new Date().toISOString(),
  }),
}
