import { Navbar } from '@/components/layout/Navbar'
import { SectionTabs } from '@/components/layout/SectionTabs'
import { FilterSidebar } from '@/components/layout/FilterSidebar'
import { ProductsView } from '@/components/products/ProductsView'
import { Footer } from '@/components/layout/Footer'
import { ServiceFlyerSlide, ServiceFlyerTopBanner } from '@/components/marketing/ServiceFlyer'
import { ORG_ID, WEBSITE_ID, ldScript } from '@/lib/schema'
import { SITE_URL } from '@/lib/utils'
import Head from 'next/head'

const homeLd = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  '@id': `${SITE_URL}/#webpage`,
  url: SITE_URL,
  name: 'TucuCompras — Catálogo local de Tucumán',
  description:
    'Catálogo de productos de empresas y tiendas locales de Tucumán. Consultá y comprá directo por WhatsApp.',
  isPartOf: { '@id': WEBSITE_ID },
  about: { '@id': ORG_ID },
  inLanguage: 'es-AR',
}

export default function HomePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: ldScript(homeLd) }} />
      <Navbar />
      <Head>
        <link rel="icon" href="/ico/favicon.ico" />
      </Head>
      <SectionTabs />
      <div className="max-w-7xl mx-auto flex">
        <FilterSidebar />
        <main className="flex-1 p-4 sm:p-6">
          <ServiceFlyerTopBanner />
          <ProductsView />
        </main>
      </div>
      <Footer />
      <ServiceFlyerSlide />
    </>
  )
}
