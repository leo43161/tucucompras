'use client'

import { useGetCategoriasQuery } from '@/lib/redux/api/productsApi'
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks'
import { setCategory, setOnlyOffers } from '@/lib/redux/slices/uiSlice'

export function SectionTabs() {
  const dispatch = useAppDispatch()
  const { data: cats = [] } = useGetCategoriasQuery()
  const categoryId = useAppSelector((s) => s.ui.filters.categoryId)
  const onlyOffers = useAppSelector((s) => s.ui.filters.onlyOffers)

  const handleAll = () => { dispatch(setCategory(null)); dispatch(setOnlyOffers(false)) }
  const handleCat = (id: number) => { dispatch(setOnlyOffers(false)); dispatch(setCategory(id)) }
  const handleOffers = () => { dispatch(setCategory(null)); dispatch(setOnlyOffers(true)) }

  const isAll = categoryId === null && !onlyOffers

  return (
    <nav className="bg-background border-b border-border w-full sticky top-16 z-40">
      <div className="max-w-7xl mx-auto relative">
        <div
          role="tablist"
          aria-label="Categorías de productos"
          className="flex overflow-x-auto px-4 sm:px-6 lg:px-8 gap-2
                     [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]
                     snap-x snap-mandatory"
        >
          <Tab active={isAll} onClick={handleAll}>Todo</Tab>
          {cats.map((c) => (
            <Tab key={c.id} active={categoryId === c.id && !onlyOffers} onClick={() => handleCat(c.id)}>
              {c.nombre}
            </Tab>
          ))}
          <Tab active={onlyOffers} onClick={handleOffers}>Ofertas</Tab>
        </div>
        <div className="absolute top-0 right-0 bottom-0 w-8 bg-linear-to-l from-background to-transparent pointer-events-none md:hidden" />
      </div>
    </nav>
  )
}

function Tab({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={`snap-start shrink-0 px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1 ${
        active
          ? 'text-primary border-primary'
          : 'text-muted-foreground border-transparent hover:text-foreground hover:border-border/50'
      }`}
    >
      {children}
    </button>
  )
}
