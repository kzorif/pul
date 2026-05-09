export interface PositionalForm {
  form: "isolated" | "initial" | "medial" | "final"
  urdu: string
  roman: string
}

export interface AnchorWord {
  urdu: string
  roman: string
  ipa: string
  english: string
  emoji: string
}

export interface Character {
  id: number
  urdu: string
  roman: string
  ipa: string
  anchor: AnchorWord
  positionalForms: PositionalForm[]
  audioFile: string
  anchorAudioFile: string
  anchorImageFile: string
  frequency: number
  foils: number[]
}

function forms(urdu: string, roman: string, initial: string, medial: string, final: string): PositionalForm[] {
  return [
    { form: "isolated", urdu, roman },
    { form: "initial", urdu: initial, roman: `${roman}-` },
    { form: "medial", urdu: medial, roman: `-${roman}-` },
    { form: "final", urdu: final, roman: `-${roman}` },
  ]
}

export const CHARACTERS: Character[] = [
  {
    id: 1,
    urdu: "ا",
    roman: "a",
    ipa: "/aː/",
    anchor: { urdu: "آرزو", roman: "ārzū", ipa: "/ɑːɾzuː/", english: "longing", emoji: "" },
    positionalForms: forms("ا", "a", "اَ", "ـا", "ـا"),
    audioFile: "char_a.mp3",
    anchorAudioFile: "anchor_a.mp3",
    anchorImageFile: "img_a.png",
    frequency: 1,
    foils: [14, 15],
  },
  {
    id: 2,
    urdu: "ب",
    roman: "b",
    ipa: "/b/",
    anchor: { urdu: "بزم", roman: "bazm", ipa: "/bəzm/", english: "gathering", emoji: "" },
    positionalForms: forms("ب", "b", "بـ", "ـبـ", "ـب"),
    audioFile: "char_b.mp3",
    anchorAudioFile: "anchor_b.mp3",
    anchorImageFile: "img_b.png",
    frequency: 2,
    foils: [3, 4],
  },
  {
    id: 3,
    urdu: "پ",
    roman: "p",
    ipa: "/p/",
    anchor: { urdu: "پیغام", roman: "paiġām", ipa: "/pɛɪɣaːm/", english: "message", emoji: "" },
    positionalForms: forms("پ", "p", "پـ", "ـپـ", "ـپ"),
    audioFile: "char_p.mp3",
    anchorAudioFile: "anchor_p.mp3",
    anchorImageFile: "img_p.png",
    frequency: 3,
    foils: [2, 4],
  },
  {
    id: 4,
    urdu: "ت",
    roman: "t",
    ipa: "/t̪/",
    anchor: { urdu: "تقدیر", roman: "taqdīr", ipa: "/t̪əqd̪iːɾ/", english: "fate", emoji: "" },
    positionalForms: forms("ت", "t", "تـ", "ـتـ", "ـت"),
    audioFile: "char_t.mp3",
    anchorAudioFile: "anchor_t.mp3",
    anchorImageFile: "img_t.png",
    frequency: 4,
    foils: [2, 3],
  },
  {
    id: 5,
    urdu: "س",
    roman: "s",
    ipa: "/s/",
    anchor: { urdu: "سحر", roman: "sahar", ipa: "/səhər/", english: "dawn", emoji: "" },
    positionalForms: forms("س", "s", "سـ", "ـسـ", "ـس"),
    audioFile: "char_s.mp3",
    anchorAudioFile: "anchor_s.mp3",
    anchorImageFile: "img_s.png",
    frequency: 5,
    foils: [12, 4],
  },
  {
    id: 6,
    urdu: "ر",
    roman: "r",
    ipa: "/ɾ/",
    anchor: { urdu: "راز", roman: "rāz", ipa: "/ɾaːz/", english: "secret", emoji: "" },
    positionalForms: forms("ر", "r", "رـ", "ـر", "ـر"),
    audioFile: "char_r.mp3",
    anchorAudioFile: "anchor_r.mp3",
    anchorImageFile: "img_r.png",
    frequency: 6,
    foils: [13, 16],
  },
  {
    id: 7,
    urdu: "ن",
    roman: "n",
    ipa: "/n/",
    anchor: { urdu: "نوا", roman: "navā", ipa: "/nəʋaː/", english: "melody", emoji: "" },
    positionalForms: forms("ن", "n", "نـ", "ـنـ", "ـن"),
    audioFile: "char_n.mp3",
    anchorAudioFile: "anchor_n.mp3",
    anchorImageFile: "img_n.png",
    frequency: 7,
    foils: [2, 14],
  },
  {
    id: 8,
    urdu: "م",
    roman: "m",
    ipa: "/m/",
    anchor: { urdu: "مہر", roman: "mihr", ipa: "/mɪhɾ/", english: "affection", emoji: "" },
    positionalForms: forms("م", "m", "مـ", "ـمـ", "ـم"),
    audioFile: "char_m.mp3",
    anchorAudioFile: "anchor_m.mp3",
    anchorImageFile: "img_m.png",
    frequency: 8,
    foils: [7, 11],
  },
  {
    id: 9,
    urdu: "ک",
    roman: "k",
    ipa: "/k/",
    anchor: { urdu: "کتاب", roman: "kitāb", ipa: "/kɪt̪aːb/", english: "book", emoji: "" },
    positionalForms: forms("ک", "k", "کـ", "ـکـ", "ـک"),
    audioFile: "char_k.mp3",
    anchorAudioFile: "anchor_k.mp3",
    anchorImageFile: "img_k.png",
    frequency: 9,
    foils: [10, 12],
  },
  {
    id: 10,
    urdu: "گ",
    roman: "g",
    ipa: "/ɡ/",
    anchor: { urdu: "گل", roman: "gul", ipa: "/ɡʊl/", english: "flower", emoji: "" },
    positionalForms: forms("گ", "g", "گـ", "ـگـ", "ـگ"),
    audioFile: "char_g.mp3",
    anchorAudioFile: "anchor_g.mp3",
    anchorImageFile: "img_g.png",
    frequency: 10,
    foils: [9, 12],
  },
  {
    id: 11,
    urdu: "ل",
    roman: "l",
    ipa: "/l/",
    anchor: { urdu: "لمحہ", roman: "lamḥa", ipa: "/ləmɦaː/", english: "moment", emoji: "" },
    positionalForms: forms("ل", "l", "لـ", "ـلـ", "ـل"),
    audioFile: "char_l.mp3",
    anchorAudioFile: "anchor_l.mp3",
    anchorImageFile: "img_l.png",
    frequency: 11,
    foils: [8, 7],
  },
  {
    id: 12,
    urdu: "ہ",
    roman: "h",
    ipa: "/h/",
    anchor: { urdu: "ہوا", roman: "havā", ipa: "/ɦəʋaː/", english: "wind", emoji: "" },
    positionalForms: forms("ہ", "h", "ہـ", "ـہـ", "ـہ"),
    audioFile: "char_h.mp3",
    anchorAudioFile: "anchor_h.mp3",
    anchorImageFile: "img_h.png",
    frequency: 12,
    foils: [9, 10],
  },
  {
    id: 13,
    urdu: "و",
    roman: "w",
    ipa: "/ʋ/",
    anchor: { urdu: "وقت", roman: "vaqt", ipa: "/ʋəqt̪/", english: "time", emoji: "" },
    positionalForms: forms("و", "w", "و", "ـو", "ـو"),
    audioFile: "char_w.mp3",
    anchorAudioFile: "anchor_w.mp3",
    anchorImageFile: "img_w.png",
    frequency: 13,
    foils: [6, 1],
  },
  {
    id: 14,
    urdu: "ی",
    roman: "y",
    ipa: "/j/",
    anchor: { urdu: "یاد", roman: "yād", ipa: "/jaːd̪/", english: "memory", emoji: "" },
    positionalForms: forms("ی", "y", "یـ", "ـیـ", "ـی"),
    audioFile: "char_y.mp3",
    anchorAudioFile: "anchor_y.mp3",
    anchorImageFile: "img_y.png",
    frequency: 14,
    foils: [1, 15],
  },
  {
    id: 15,
    urdu: "ے",
    roman: "e",
    ipa: "/ɛː/",
    anchor: { urdu: "مے", roman: "mai", ipa: "/mɛː/", english: "wine", emoji: "" },
    positionalForms: forms("ے", "e", "ے", "ـے", "ـے"),
    audioFile: "char_e.mp3",
    anchorAudioFile: "anchor_e.mp3",
    anchorImageFile: "img_e.png",
    frequency: 15,
    foils: [14, 1],
  },
  {
    id: 16,
    urdu: "د",
    roman: "d",
    ipa: "/d̪/",
    anchor: { urdu: "دل", roman: "dil", ipa: "/d̪ɪl/", english: "heart", emoji: "" },
    positionalForms: forms("د", "d", "دـ", "ـد", "ـد"),
    audioFile: "char_d.mp3",
    anchorAudioFile: "anchor_d.mp3",
    anchorImageFile: "img_d.png",
    frequency: 16,
    foils: [6, 13],
  },
  {
    id: 17,
    urdu: "ج",
    roman: "j",
    ipa: "/dʒ/",
    anchor: { urdu: "جان", roman: "jān", ipa: "/dʒaːn/", english: "soul", emoji: "" },
    positionalForms: forms("ج", "j", "جـ", "ـجـ", "ـج"),
    audioFile: "char_j.mp3",
    anchorAudioFile: "anchor_j.mp3",
    anchorImageFile: "img_j.png",
    frequency: 17,
    foils: [18, 12],
  },
  {
    id: 18,
    urdu: "ح",
    roman: "h2",
    ipa: "/ħ/",
    anchor: { urdu: "حال", roman: "ḥāl", ipa: "/ħaːl/", english: "state", emoji: "" },
    positionalForms: forms("ح", "h2", "حـ", "ـحـ", "ـح"),
    audioFile: "char_h2.mp3",
    anchorAudioFile: "anchor_h2.mp3",
    anchorImageFile: "img_h2.png",
    frequency: 18,
    foils: [17, 12],
  },
]

export const CHARACTER_ID_BY_URDU = CHARACTERS.reduce<Record<string, number>>((acc, character) => {
  acc[character.urdu] = character.id
  return acc
}, {})

export function getCoreCharacterIdsForText(text: string): number[] {
  return [...new Set([...text].map((char) => CHARACTER_ID_BY_URDU[char]).filter(Boolean))]
}
