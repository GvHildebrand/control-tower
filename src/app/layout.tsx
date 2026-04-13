import type { Metadata } from 'next'
import { DM_Serif_Display, Space_Grotesk, Inter } from 'next/font/google'
import './globals.css'
import { VoiceWidgetWrapper } from '@/components/voice-widget-wrapper'

const dmSerif = DM_Serif_Display({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-dm-serif',
  display: 'swap',
})

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Solomon',
  description: 'Strategic project command center.',
  icons: { icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><polygon points='50,8 92,75 8,75' fill='none' stroke='%230F2D52' stroke-width='6'/><circle cx='50' cy='52' r='12' fill='%230E7490'/></svg>" },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${dmSerif.variable} ${spaceGrotesk.variable} ${inter.variable}`}>
      <body>
        {children}
        <VoiceWidgetWrapper />
      </body>
    </html>
  )
}
