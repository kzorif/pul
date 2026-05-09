export const haptics = {
  light: () => navigator.vibrate?.(10),
  correct: () => navigator.vibrate?.([10, 50, 10]),
  incorrect: () => navigator.vibrate?.([50, 30, 50]),
}
