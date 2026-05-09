import type { Metadata, Viewport } from "next"
import localFont from "next/font/local"
import { Noto_Nastaliq_Urdu } from "next/font/google"
import Script from "next/script"
import { UrduAttributeHydrator } from "@/components/ui/UrduAttributeHydrator"
import "./globals.css"

const geist = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist",
  weight: "100 900",
})
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
})
const notoNastaliq = Noto_Nastaliq_Urdu({
  subsets: ["arabic"],
  weight: ["400", "700"],
  variable: "--font-noto-nastaliq",
  display: "swap",
})

export const metadata: Metadata = {
  title: "پل — Pul",
  description: "Learn to read Urdu, one character at a time.",
  manifest: "/manifest.json",
}

export const viewport: Viewport = {
  themeColor: "#c8a96e",
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${geist.variable} ${geistMono.variable} ${notoNastaliq.variable}`}
    >
      <body className="antialiased" style={{ fontFamily: "var(--font-geist), sans-serif" }}>
        <UrduAttributeHydrator />
        {children}
        <Script
          defer
          data-domain="pul.academy"
          src="https://plausible.io/js/script.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  )
}
