export interface ComparisonResult {
  correct: boolean
  accuracy: number
  characterMatches: Array<{ char: string; correct: boolean }>
  missingChars: string[]
  extraChars: string[]
}

const ALEF_VARIANTS = /[أإآ]/g
const DIACRITICS = /[\u064B-\u065F\u0670]/g

function normalize(text: string): string {
  return text
    .replace(ALEF_VARIANTS, "ا")
    .replace(DIACRITICS, "")
    .replace(/\s+/g, " ")
    .trim()
}

export function compareUrdu(userInput: string, target: string): ComparisonResult {
  const normUser = normalize(userInput)
  const normTarget = normalize(target)
  const maxLen = Math.max(normUser.length, normTarget.length)
  let correctCount = 0
  const characterMatches: Array<{ char: string; correct: boolean }> = []

  for (let i = 0; i < maxLen; i++) {
    const userChar = normUser[i] ?? ""
    const targetChar = normTarget[i] ?? ""
    const match = userChar === targetChar
    if (match) correctCount++
    characterMatches.push({ char: targetChar || userChar, correct: match })
  }

  const accuracy = normTarget.length
    ? Math.max(0, Math.min(100, Math.round((correctCount / normTarget.length) * 100)))
    : 0

  return {
    correct: accuracy >= 80,
    accuracy,
    characterMatches,
    missingChars: [...normTarget].filter((char) => !normUser.includes(char)),
    extraChars: [...normUser].filter((char) => !normTarget.includes(char)),
  }
}
