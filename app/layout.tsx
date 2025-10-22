import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '../styles/globals.css'
import { AppProviders } from './providers'

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  preload: true
})

export const metadata: Metadata = {
  title: 'QuoteFast Dashboard - AI Offertegenerator | Automatiseer je Offerteproces',
  description: 'Automatiseer je offertes met AI. Bespaar uren werk en verhoog je conversie met QuoteFast Dashboard. CRM, facturatie en workflow automatisering in één platform.',
  keywords: 'offertes, AI, automatisering, CRM, facturatie, offertegenerator, business management, SaaS',
  authors: [{ name: 'QuoteFast Team' }],
  creator: 'QuoteFast',
  publisher: 'QuoteFast',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/logo.png', sizes: '32x32' }
    ],
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/manifest.json',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://quotefast-dashboard.vercel.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'QuoteFast Dashboard - AI Offertegenerator',
    description: 'Automatiseer je offertes met AI. Bespaar tijd en verhoog je conversie met QuoteFast Dashboard.',
    url: 'https://quotefast-dashboard.vercel.app',
    siteName: 'QuoteFast Dashboard',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'QuoteFast Dashboard - AI Offertegenerator',
      },
    ],
    locale: 'nl_NL',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'QuoteFast Dashboard - AI Offertegenerator',
    description: 'Automatiseer je offertes met AI. Bespaar tijd en verhoog je conversie.',
    images: ['/og-image.jpg'],
    creator: '@quotefast',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="nl" suppressHydrationWarning>
      <body className={inter.className}>
        <AppProviders>
          {children}
        </AppProviders>
      </body>
    </html>
  )
}