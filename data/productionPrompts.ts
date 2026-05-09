export interface ProductionPrompt {
  id: string
  english: string
  urdu: string
  source: string
  audioFile: string
}

export const PRODUCTION_PROMPTS: ProductionPrompt[] = [
  // Single words — with audio
  { id: "p01", english: "prayer", urdu: "دعا", source: "Bachon ki Dua", audioFile: "word_w01.mp3" },
  { id: "p02", english: "love", urdu: "محبت", source: "Bachon ki Dua", audioFile: "word_w04.mp3" },
  { id: "p03", english: "light", urdu: "نور", source: "Urdu poetry", audioFile: "word_w08.mp3" },
  // Short phrases — no audio
  { id: "p04", english: "the world", urdu: "دنیا", source: "Bachon ki Dua", audioFile: "word_w14.mp3" },
  { id: "p05", english: "poor and distant", urdu: "غریب", source: "Urdu poetry", audioFile: "word_w16.mp3" },
  { id: "p06", english: "light of knowledge", urdu: "علم کی روشنی", source: "Bachon ki Dua", audioFile: "" },
  // Sentences — using sentence audio
  { id: "p07", english: "a prayer comes to my lips", urdu: "لب پہ آتی ہے دعا", source: "Bachon ki Dua — Allama Iqbal", audioFile: "sentence_s01.mp3" },
  { id: "p08", english: "may my life be like a candle", urdu: "زندگی شمع کی صورت ہو", source: "Bachon ki Dua — Allama Iqbal", audioFile: "sentence_s02.mp3" },
]
