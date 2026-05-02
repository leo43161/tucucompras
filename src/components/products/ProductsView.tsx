'use client'
import { useMemo } from 'react'
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks'
import { setViewMode } from '@/lib/redux/slices/uiSlice'
import { useGetProductosQuery } from '@/lib/redux/api/productsApi'
import { ProductCard } from './ProductCard'
import { LayoutGrid, LayoutList } from 'lucide-react'
import type { Product } from '@/types'

export function ProductsView() {
  const dispatch = useAppDispatch()
  const viewMode = useAppSelector((s) => s.ui.viewMode)
  const filters = useAppSelector((s) => s.ui.filters)

  const orden = filters.sortBy === 'price-asc' ? 'ASC' : filters.sortBy === 'price-desc' ? 'DESC' : ''

  const { data, isLoading, isError, isFetching } = useGetProductosQuery({
    categoria_id: filters.categoryId ?? undefined,
    search: filters.search || undefined,
    orden_precio: orden as 'ASC' | 'DESC' | '',
    limite: 48,
    offset: 0,
  })

  const products: Product[] = useMemo(() => {
    const items = data?.data ?? []
    return items.filter((p) => {
      const finalPrice = p.es_oferta && p.precio_oferta ? p.precio_oferta : p.precio
      if (finalPrice < filters.priceRange[0] || finalPrice > filters.priceRange[1]) return false
      if (filters.onlyOffers && !p.es_oferta) return false
      return true
    })
  }, [data, filters.priceRange, filters.onlyOffers])

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">{products.length}</span> productos
          {isFetching && <span className="ml-2 text-xs opacity-60">actualizando…</span>}
        </p>
        <div className="flex items-center gap-1 bg-muted/60 border border-border rounded-full p-1">
          <ViewBtn active={viewMode === 'grid'} onClick={() => dispatch(setViewMode('grid'))} label="Grilla">
            <LayoutGrid size={14} />
          </ViewBtn>
          <ViewBtn active={viewMode === 'list'} onClick={() => dispatch(setViewMode('list'))} label="Lista">
            <LayoutList size={14} />
          </ViewBtn>
        </div>
      </div>

      {isLoading ? (
        <div className={viewMode === 'grid' ? 'grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4' : 'flex flex-col gap-3'}>
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className={`bg-muted/50 border border-border rounded-2xl animate-pulse ${viewMode === 'grid' ? 'aspect-[3/4]' : 'h-28'}`} />
          ))}
        </div>
      ) : isError ? (
        <Empty title="Error al cargar productos" sub="Intentá recargar la página" />
      ) : products.length === 0 ? (
        <Empty title="Sin resultados" sub="Probá cambiando los filtros o la búsqueda" />
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {products.map((p) => <ProductCard key={p.id} product={p} view="grid" />)}
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {products.map((p) => <ProductCard key={p.id} product={p} view="list" />)}
        </div>
      )}
    </div>
  )
}

function ViewBtn({ active, onClick, label, children }: { active: boolean; onClick: () => void; label: string; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      aria-pressed={active}
      className={`px-2.5 py-1.5 rounded-full transition-colors ${active ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
    >
      {children}
    </button>
  )
}

function Empty({ title, sub }: { title: string; sub: string }) {
  return (
    <div className="text-center py-20 text-muted-foreground">
      <p className="text-lg font-medium text-foreground">{title}</p>
      <p className="text-sm mt-1">{sub}</p>
    </div>
  )
}
