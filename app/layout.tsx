import type React from "react"
import type { Metadata } from "next"
import { Space_Grotesk, DM_Sans } from "next/font/google"
import "./globals.css"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-space-grotesk",
})

const dmSans = DM_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-dm-sans",
})

export const metadata: Metadata = {
  title: "TextAnalyzer - Educational Content Analysis Tool",
  description:
    "Analyze your text for educational insights, readability, and content quality. Get detailed feedback to improve your writing with our advanced AI-powered analysis.",
  keywords: "text analysis, readability, educational content, writing improvement, grammar check",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${dmSans.variable} antialiased`}>
      <body className="font-sans">
        <Navigation />
        <div className="min-h-screen">{children}</div>
        <Footer />
      </body>
    </html>
  )
}
