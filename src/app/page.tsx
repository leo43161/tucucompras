import { Navbar } from '@/components/layout/Navbar'
import { SectionTabs } from '@/components/layout/SectionTabs'
import { FilterSidebar } from '@/components/layout/FilterSidebar'
import { ProductsView } from '@/components/products/ProductsView'
import { ProductModal } from '@/components/products/ProductModal'
import { Footer } from '@/components/layout/Footer'
import Head from 'next/head'

export default function HomePage() {
  return (
    <>
      <Navbar />
      <Head>
        <link rel="icon" href="/ico/favicon-32x32.png" />
      </Head>
      <SectionTabs />
      <div className="max-w-7xl mx-auto flex">
        <FilterSidebar />
        <main className="flex-1 p-4 sm:p-6">
          <ProductsView />
        </main>
      </div>
      <Footer />
      <ProductModal />
    </>
  )
}
