"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Character } from "@/data/characters"
import { AudioButton } from "@/components/ui/AudioButton"
import { CharacterDisplay } from "@/components/ui/CharacterDisplay"
import { IPABadge } from "@/components/ui/IPABadge"

interface EncounterStateProps {
  character: Character
  onComplete: () => void
}

export function EncounterState({ character, onComplete }: EncounterStateProps) {
  const [canTap, setCanTap] = useState(false)
  const [showHint, setShowHint] = useState(false)

  useEffect(() => {
    const t1 = setTimeout(() => setShowHint(true), 1500)
    const t2 = setTimeout(() => setCanTap(true), 1500)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [])

  return (
    <div
      className="flex flex-col items-center justify-between px-5 cursor-pointer select-none"
      style={{ minHeight: "72vh", paddingTop: "10vh", paddingBottom: "6vh" }}
      onClick={() => canTap && onComplete()}
    >
      {/* Character block — centred in the top portion */}
      <motion.div
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="flex flex-col items-center gap-5"
      >
        <CharacterDisplay character={character.urdu} size="lg" />

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-2xl text-gold font-mono tracking-wide"
        >
          {character.roman}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <IPABadge roman={character.roman} ipa={character.ipa} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.65 }}
        >
          <AudioButton filename={character.audioFile} size="md" autoPlay />
        </motion.div>
      </motion.div>

      {/* Tap hint — pinned to bottom */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: showHint ? 0.45 : 0 }}
        transition={{ duration: 0.4 }}
        className="text-text-muted text-sm"
      >
        Tap anywhere to continue
      </motion.p>
    </div>
  )
}
