import type { Metadata, Viewport } from 'next'
import { Outfit, DM_Sans } from 'next/font/google'
import { GoogleAnalytics } from '@next/third-parties/google'
import { ReduxProvider } from '@/providers/ReduxProvider'
import { ThemeProvider } from '@/providers/ThemeProvider'
import { GA_ID } from '@/lib/config'
import './globals.css'

const SITE_URL = 'https://tucucompras.com.ar'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: 'TucuCompras — Catálogo local de Tucumán', template: '%s | TucuCompras' },
  description: 'Catálogo de productos de empresas de Tucumán. Consultá directo por WhatsApp.',
  applicationName: 'TucuCompras',
  keywords: ['Tucumán', 'compras', 'marketplace', 'catálogo', 'WhatsApp'],
  manifest: '/manifest.webmanifest',
  alternates: { canonical: SITE_URL },
  openGraph: {
    type: 'website', locale: 'es_AR', url: SITE_URL, siteName: 'TucuCompras',
    title: 'TucuCompras', description: 'Catálogo local de Tucumán',
    images: [{ url: '/og.jpg', width: 1200, height: 630 }],
  },
  twitter: { card: 'summary_large_image', title: 'TucuCompras', description: 'Catálogo local de Tucumán' },
  robots: { index: true, follow: true },
  icons: { icon: '/favicon.ico', apple: '/apple-touch-icon.png' },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#020617' },
  ],
  width: 'device-width', initialScale: 1,
}

const outfit = Outfit({ subsets: ['latin'], weight: ['400','600','700','800'], variable: '--font-outfit' })
const dmSans = DM_Sans({ subsets: ['latin'], weight: ['400','500','600'], variable: '--font-dm-sans' })

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${outfit.variable} ${dmSans.variable}`} suppressHydrationWarning>
      <body className="font-dm-sans bg-background text-foreground min-h-screen antialiased">
        <ThemeProvider>
          <ReduxProvider>{children}</ReduxProvider>
        </ThemeProvider>
        {GA_ID && <GoogleAnalytics gaId={GA_ID} />}
      </body>
    </html>
  )
}