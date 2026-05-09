import { Lock } from "lucide-react"

interface LevelBadgeProps {
  label: string
  sublabel: string
  current?: boolean
  completed?: boolean
  locked?: boolean
}

export function LevelBadge({ label, sublabel, current, completed, locked }: LevelBadgeProps) {
  return (
    <div
      className="flex flex-col items-center gap-1 px-4 py-3 rounded-2xl shrink-0 min-w-[90px]"
      style={{
        background: current ? "oklch(72% 0.12 75 / 15%)" : "oklch(16% 0.02 60)",
        border: current
          ? "1px solid oklch(72% 0.12 75 / 60%)"
          : "1px solid oklch(95% 0.01 75 / 8%)",
        opacity: locked ? 0.4 : 1,
      }}
    >
      <span
        className="text-sm font-medium"
        style={{ color: current ? "oklch(72% 0.12 75)" : "oklch(95% 0.01 75 / 70%)" }}
      >
        {label}
      </span>
      <span className="text-xs" style={{ color: "oklch(95% 0.01 75 / 40%)" }}>
        {sublabel}
      </span>
      {locked && <Lock size={10} style={{ color: "oklch(95% 0.01 75 / 30%)" }} />}
      {completed && <span style={{ color: "oklch(68% 0.08 175)" }}>✓</span>}
    </div>
  )
}
