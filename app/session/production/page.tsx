import { ProductionSession } from "@/components/production/ProductionSession"
import { LevelGate } from "@/components/ui/LevelGate"

export default function ProductionPage() {
  return (
    <LevelGate level={5}>
      <ProductionSession />
    </LevelGate>
  )
}
