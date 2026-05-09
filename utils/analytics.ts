export function track(event: string, props?: Record<string, string>) {
  if (typeof window === "undefined") return

  const plausible = (window as Window & {
    plausible?: (event: string, options?: { props?: Record<string, string> }) => void
  }).plausible

  plausible?.(event, { props })
}
