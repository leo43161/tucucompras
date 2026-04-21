import type { Metadata } from "next";
import { Outfit, DM_Sans } from "next/font/google";
import { ReduxProvider } from '@/providers/ReduxProvider'
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL('https://tucucompras.com.ar'),
  title: {
    default: 'TucuCompras — El marketplace de Tucumán',
    template: '%s | TucuCompras',
  },
  description:
    'Comprá y consultá productos de empresas locales de Tucumán. Moda, tecnología, deporte y más. Directo al WhatsApp del vendedor.',
  keywords: ['compras Tucumán', 'marketplace Tucumán', 'productos Tucumán', 'tiendas San Miguel de Tucumán'],
  openGraph: {
    locale: 'es_AR',
    siteName: 'TucuCompras',
  },
}

const outfit = Outfit({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-outfit',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-dm-sans',
})

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${outfit.variable} ${dmSans.variable}`}>
      <body className="font-dm-sans bg-[--bg] text-[--text-primary] min-h-screen">
        <ReduxProvider>{children}</ReduxProvider>
      </body>
    </html>
  )
}
