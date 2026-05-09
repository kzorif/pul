# پل — Pul

> A web app that teaches you to read Urdu script — from zero to reading classical poetry, one character at a time.

Urdu is spoken by 70+ million people but the script stops most learners before they read a single word. Existing apps either skip the script entirely or dump the alphabet with no structure. Pul bridges that gap using spaced repetition, real audio, and six distinct learning states per character.

No account. No backend. Everything lives in your browser.

---

## What you learn

You start with 18 core Urdu characters and work through five levels:

```
Level 1 — Characters   Learn to recognise each letter by sound and shape
Level 2 — Words        Read 25 poetry words in Urdu script
Level 3 — Sentences    Lines from Allama Iqbal's Bachon ki Dua (with audio)
Level 4 — Prose        Cold reading from Premchand's Idgah (no audio)
Level 5 — Production   Write Urdu from English prompts using a phonetic keyboard
```

---

## How a character is taught

Every character goes through 6 states before it's considered learned:

| # | State | What happens |
|---|---|---|
| 1 | **Encounter** | See the character large, hear it pronounced, read the IPA |
| 2 | **Echo** | Pick it from three visually similar options by sound |
| 3 | **Morph** | Recognise it in all four positional forms (isolated, initial, medial, final) |
| 4 | **Extraction** | Spot it inside a real Urdu word |
| 5 | **Emotion** | A cinematic anchor word links the sound to a lasting memory |
| 6 | **Speed** | Tap it in a timed stream to build automatic recognition |

After all six states, the character enters spaced repetition. The app schedules when to review it using SM-2 — you only see it again when you're about to forget it.

---

## Daily sessions

Each day the app builds a review queue from your SM-2 schedule — characters due for review, words you haven't seen in a while, sentences at your current level. One session covers everything. Miss a day and the queue grows; come back and it catches you up.

---

## Content

- **18 characters** — ا ب پ ت س ر ن م ک گ ل ہ و ی ے د ج ح
- **25 words** — drawn from classical Urdu poetry: دعا، محبت، نور، خواب، سفر and more
- **Anchor words** — each character is anchored to a poetry word: آرزو (longing), راز (secret), یاد (memory)
- **Sentences** — lines from Allama Iqbal's *Bachon ki Dua* and Premchand's *Idgah*

---

## Tech

| | |
|---|---|
| Framework | Next.js 14 App Router |
| Styling | Tailwind CSS + OKLCH color tokens |
| Animation | Framer Motion |
| State | Zustand persisted to localStorage |
| Font | Noto Nastaliq Urdu |
| Audio | Azure Neural TTS + ElevenLabs |
| Images | fal.ai Flux (AI-generated calligraphy art) |
| PWA | Installable, works offline after first load |

---

## Run it

```bash
bun install
bun run dev
```

Open `http://localhost:3000` — designed for mobile, use iPhone view in DevTools.

---

## Try the demo

Go to **Settings → Developer tools** to jump to any level instantly without completing the full progression.
