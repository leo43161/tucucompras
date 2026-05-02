import { Navbar } from '@/components/layout/Navbar'
import { SectionTabs } from '@/components/layout/SectionTabs'
import { FilterSidebar } from '@/components/layout/FilterSidebar'
import { ProductsView } from '@/components/products/ProductsView'
import { ProductModal } from '@/components/products/ProductModal'
import { Footer } from '@/components/layout/Footer'

export default function HomePage() {
  return (
    <>
      <Navbar />
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
