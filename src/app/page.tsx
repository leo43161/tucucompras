import { Navbar } from '@/components/layout/Navbar'
import { SectionTabs } from '@/components/layout/SectionTabs'
import { FilterSidebar } from '@/components/layout/FilterSidebar'
import { ProductsView } from '@/components/products/ProductsView'
import { Footer } from '@/components/layout/Footer'
import { ServiceFlyerSlide } from '@/components/marketing/ServiceFlyer'
import Head from 'next/head'

export default function HomePage() {
  return (
    <>
      <Navbar />
      <Head>
        <link rel="icon" href="/ico/favicon.ico" />
      </Head>
      <SectionTabs />
      <div className="max-w-7xl mx-auto flex">
        <FilterSidebar />
        <main className="flex-1 p-4 sm:p-6">
          <ProductsView />
        </main>
      </div>
      <Footer />
      <ServiceFlyerSlide />
    </>
  )
}
