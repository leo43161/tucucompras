import { Navbar } from '@/components/layout/Navbar'
import { SectionTabs } from '@/components/layout/SectionTabs'
import { FilterSidebar } from '@/components/layout/FilterSidebar'
import { ProductsView } from '@/components/products/ProductsView'
import { ProductModal } from '@/components/products/ProductModal'

export default function HomePage() {
  return (
    <>
      <Navbar />
      <SectionTabs />
      <div className="max-w-[1280px] mx-auto flex">
        <FilterSidebar />
        <main className="flex-1 p-6">
          <ProductsView />
        </main>
      </div>
      <ProductModal />
    </>
  )
}