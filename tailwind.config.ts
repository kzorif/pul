import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "oklch(12% 0.02 60)",
        gold: "oklch(72% 0.12 75)",
        teal: "oklch(68% 0.08 175)",
        purple: "oklch(65% 0.08 290)",
        "text-primary": "oklch(95% 0.01 75)",
        "text-muted": "oklch(95% 0.01 75 / 62%)",
        // shadcn tokens mapped to pul theme
        border: "oklch(95% 0.01 75 / 10%)",
        input: "oklch(95% 0.01 75 / 15%)",
        ring: "oklch(72% 0.12 75)",
        foreground: "oklch(95% 0.01 75)",
        primary: {
          DEFAULT: "oklch(72% 0.12 75)",
          foreground: "oklch(12% 0.02 60)",
        },
        secondary: {
          DEFAULT: "oklch(20% 0.02 60)",
          foreground: "oklch(95% 0.01 75)",
        },
        muted: {
          DEFAULT: "oklch(18% 0.02 60)",
          foreground: "oklch(95% 0.01 75 / 50%)",
        },
        accent: {
          DEFAULT: "oklch(20% 0.02 60)",
          foreground: "oklch(95% 0.01 75)",
        },
        destructive: {
          DEFAULT: "oklch(60% 0.2 25)",
          foreground: "oklch(95% 0.01 75)",
        },
        card: {
          DEFAULT: "oklch(16% 0.02 60)",
          foreground: "oklch(95% 0.01 75)",
        },
        popover: {
          DEFAULT: "oklch(16% 0.02 60)",
          foreground: "oklch(95% 0.01 75)",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        urdu: ["var(--font-noto-nastaliq)", "serif"],
      },
    },
  },
  plugins: [],
};
export default config;
