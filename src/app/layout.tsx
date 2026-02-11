import type { Metadata } from 'next'
import { Newsreader, DM_Sans, IBM_Plex_Mono } from 'next/font/google'
import { LocaleProvider } from '@/i18n/provider'
import './globals.css'

const newsreader = Newsreader({
  variable: '--font-display',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
})

const dmSans = DM_Sans({
  variable: '--font-body',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
})

const ibmPlexMono = IBM_Plex_Mono({
  variable: '--font-mono',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
})

export const metadata: Metadata = {
  title: 'K-Beauty Commerce Radar',
  description: 'Cross-platform K-Beauty ranking intelligence across Korea, US, and UAE',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        className={`${newsreader.variable} ${dmSans.variable} ${ibmPlexMono.variable} antialiased`}
      >
        <LocaleProvider>{children}</LocaleProvider>
      </body>
    </html>
  )
}
