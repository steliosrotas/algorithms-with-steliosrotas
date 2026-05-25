import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import 'katex/dist/katex.min.css'
import './globals.css'
import { ThemeInitScript } from '@/components/layout/theme-init-script'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Tamagotchi } from '@/components/pet/Tamagotchi'
import { FindBanner } from '@/components/collectibles/FindBanner'
import { AuthProvider } from '@/components/auth/AuthProvider'

const inter = Inter({
  subsets: ['latin', 'latin-ext', 'greek', 'greek-ext'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Algorithms Class Hub',
    template: '%s · Algorithms Class Hub',
  },
  description:
    'Συνεργατικός οδηγός για το μάθημα K17 — Αλγόριθμοι και Πολυπλοκότητα (ΕΚΠΑ, DIT). Φτιαγμένος από συμφοιτητές, βελτιώνεται με σχόλια.',
  applicationName: 'Algorithms Class Hub',
  authors: [{ name: 'Class Hub contributors' }],
  openGraph: {
    title: 'Algorithms Class Hub',
    description:
      'Συνεργατικός οδηγός για Αλγορίθμους και Πολυπλοκότητα — από το μηδέν, με visualizations και σχόλια από συμφοιτητές.',
    type: 'website',
    locale: 'el_GR',
  },
  robots: { index: true, follow: true },
  // Tell auto-dark browser extensions (Dark Reader and friends) to keep
  // their hands off — the site has its own designed light/dark themes and
  // a third-party inversion on top produces broken double-darkened pages.
  // Reported on Discord 2026-05-24. Users who actively prefer Dark Reader
  // can still opt back in per-site from the extension's own UI.
  other: {
    'darkreader-lock': '',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#fcfafa' },
    // Matches the dark theme's --bg (14 12 11 = stone-950 neutral). The
    // previous value (#160c0e) was the older maroon-tinted bg.
    { media: '(prefers-color-scheme: dark)', color: '#0e0c0b' },
  ],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="el" suppressHydrationWarning className={inter.variable}>
      <head>
        <ThemeInitScript />
      </head>
      <body className="font-sans antialiased">
        <a href="#content" className="skip-link">
          Πήδα στο περιεχόμενο
        </a>
        <AuthProvider>
          <Header />
          <main id="content">{children}</main>
          <Footer />
          <Tamagotchi />
          <FindBanner />
        </AuthProvider>
      </body>
    </html>
  )
}
