'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useGetCategoriasQuery } from '@/lib/redux/api/productsApi'
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks'
import { setCategory, setOnlyOffers } from '@/lib/redux/slices/uiSlice'

export function SectionTabs() {
  const dispatch = useAppDispatch()
  const { data: cats = [] } = useGetCategoriasQuery()
  const categoryId = useAppSelector((s) => s.ui.filters.categoryId)
  const onlyOffers = useAppSelector((s) => s.ui.filters.onlyOffers)

  const scrollerRef = useRef<HTMLDivElement>(null)
  const [canLeft, setCanLeft] = useState(false)
  const [canRight, setCanRight] = useState(false)

  const updateButtons = useCallback(() => {
    const el = scrollerRef.current
    if (!el) return
    setCanLeft(el.scrollLeft > 4)
    setCanRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4)
  }, [])

  useEffect(() => {
    updateButtons()
    const el = scrollerRef.current
    el?.addEventListener('scroll', updateButtons, { passive: true })
    window.addEventListener('resize', updateButtons)
    return () => {
      el?.removeEventListener('scroll', updateButtons)
      window.removeEventListener('resize', updateButtons)
    }
  }, [updateButtons, cats.length])

  const scroll = (dir: -1 | 1) => {
    const el = scrollerRef.current
    if (!el) return
    el.scrollBy({ left: dir * Math.max(240, el.clientWidth * 0.6), behavior: 'smooth' })
  }

  const handleAll = () => { dispatch(setCategory(null)); dispatch(setOnlyOffers(false)) }
  const handleCat = (id: number) => { dispatch(setOnlyOffers(false)); dispatch(setCategory(id)) }
  const handleOffers = () => { dispatch(setCategory(null)); dispatch(setOnlyOffers(true)) }

  const isAll = categoryId === null && !onlyOffers

  return (
    <nav className="bg-background border-b border-border w-full sticky top-16 z-40">
      <div className="max-w-7xl mx-auto relative group">
        {/* Botón scroll izq (solo desktop, cuando hace falta) */}
        <button
          type="button"
          onClick={() => scroll(-1)}
          aria-label="Categorías anteriores"
          className={`hidden md:flex absolute left-1 top-1/2 -translate-y-1/2 z-10 w-8 h-8 items-center justify-center rounded-full bg-background border border-border text-muted-foreground hover:text-primary hover:border-primary shadow-sm transition-all ${
            canLeft ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
        >
          <ChevronLeft size={16} />
        </button>

        <div
          ref={scrollerRef}
          role="tablist"
          aria-label="Categorías de productos"
          className="scroll-tabs flex overflow-x-auto px-4 md:px-4 gap-2 snap-x snap-mandatory mx-10"
        >
          <Tab active={isAll} onClick={handleAll}>Todo</Tab>
          {cats.map((c) => (
            <Tab key={c.id} active={categoryId === c.id && !onlyOffers} onClick={() => handleCat(c.id)}>
              {c.nombre}
              {!!c.total_productos && (
                <span className="ml-1.5 text-[10px] font-bold opacity-60 tabular-nums">
                  {c.total_productos}
                </span>
              )}
            </Tab>
          ))}
          <Tab active={onlyOffers} onClick={handleOffers}>Ofertas</Tab>
        </div>

        {/* Botón scroll der (solo desktop) */}
        <button
          type="button"
          onClick={() => scroll(1)}
          aria-label="Más categorías"
          className={`hidden md:flex absolute right-1 top-1/2 -translate-y-1/2 z-10 w-8 h-8 items-center justify-center rounded-full bg-background border border-border text-muted-foreground hover:text-primary hover:border-primary shadow-sm transition-all ${
            canRight ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
        >
          <ChevronRight size={16} />
        </button>

        {/* Fades laterales (mobile) */}
        <div className={`md:hidden absolute top-0 left-0 bottom-0 w-6 bg-linear-to-r from-background to-transparent pointer-events-none transition-opacity ${canLeft ? 'opacity-100' : 'opacity-0'}`} />
        <div className={`md:hidden absolute top-0 right-0 bottom-0 w-6 bg-linear-to-l from-background to-transparent pointer-events-none transition-opacity ${canRight ? 'opacity-100' : 'opacity-0'}`} />
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
