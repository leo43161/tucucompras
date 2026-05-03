'use client'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks'
import { setViewMode } from '@/lib/redux/slices/uiSlice'
import { useGetProductosQuery } from '@/lib/redux/api/productsApi'
import { ProductCard } from './ProductCard'
import { LayoutGrid, LayoutList, Loader2 } from 'lucide-react'
import type { Product } from '@/types'

const PAGE_SIZE = 24

export function ProductsView() {
  const dispatch = useAppDispatch()
  const viewMode = useAppSelector((s) => s.ui.viewMode)
  const filters = useAppSelector((s) => s.ui.filters)

  const orden = filters.sortBy === 'price-asc' ? 'ASC' : filters.sortBy === 'price-desc' ? 'DESC' : ''

  const [offset, setOffset] = useState(0)
  const [items, setItems] = useState<Product[]>([])

  const { data, isLoading, isFetching, isError } = useGetProductosQuery({
    categoria_id: filters.categoryId ?? undefined,
    search: filters.search || undefined,
    orden_precio: orden as 'ASC' | 'DESC' | '',
    limite: PAGE_SIZE,
    offset,
  })

  // Resetear acumulado cuando cambian filtros del servidor
  useEffect(() => {
    setOffset(0)
    setItems([])
  }, [filters.categoryId, filters.search, orden])

  // Acumular resultados cuando llegan
  useEffect(() => {
    if (!data) return
    if (data.offset === 0) {
      setItems(data.data)
    } else {
      setItems((prev) => {
        const seen = new Set(prev.map((p) => p.id))
        return [...prev, ...data.data.filter((p) => !seen.has(p.id))]
      })
    }
  }, [data])

  // Filtros 100% client-side (precio + ofertas) — el SP no los soporta
  const visible = useMemo(() => {
    return items.filter((p) => {
      const finalPrice = p.es_oferta && p.precio_oferta ? p.precio_oferta : p.precio
      if (finalPrice < filters.priceRange[0] || finalPrice > filters.priceRange[1]) return false
      if (filters.onlyOffers && !p.es_oferta) return false
      return true
    })
  }, [items, filters.priceRange, filters.onlyOffers])

  const total = data?.total ?? 0
  const hasMore = items.length < total
  const sentinelRef = useRef<HTMLDivElement>(null)

  // Auto-fetch siguiente página al ver el sentinel
  useEffect(() => {
    if (!hasMore || isFetching) return
    const el = sentinelRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      (entries) => { if (entries[0].isIntersecting) setOffset((o) => o + PAGE_SIZE) },
      { rootMargin: '400px 0px' }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [hasMore, isFetching])

  // Si los filtros client-side dejan poca cosa visible y aún hay páginas, traer más
  useEffect(() => {
    if (!data || isFetching) return
    if (hasMore && visible.length < 8) setOffset((o) => o + PAGE_SIZE)
  }, [visible.length, hasMore, data, isFetching])

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">{visible.length}</span>
          {total > 0 && <span className="opacity-60"> / {total}</span>} productos
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

      {isLoading && items.length === 0 ? (
        <div className={viewMode === 'grid' ? 'grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4' : 'flex flex-col gap-3'}>
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className={`bg-muted/50 border border-border rounded-2xl animate-pulse ${viewMode === 'grid' ? 'aspect-[3/4]' : 'h-28'}`} />
          ))}
        </div>
      ) : isError && items.length === 0 ? (
        <Empty title="Error al cargar productos" sub="Intentá recargar la página" />
      ) : visible.length === 0 ? (
        <Empty title="Sin resultados" sub="Probá cambiando los filtros o la búsqueda" />
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {visible.map((p) => <ProductCard key={p.id} product={p} view="grid" />)}
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {visible.map((p) => <ProductCard key={p.id} product={p} view="list" />)}
        </div>
      )}

      {/* Sentinel de scroll infinito + indicador */}
      {hasMore && (
        <div ref={sentinelRef} className="flex items-center justify-center py-10 text-muted-foreground">
          {isFetching ? (
            <span className="inline-flex items-center gap-2 text-sm">
              <Loader2 size={16} className="animate-spin" /> Cargando más productos…
            </span>
          ) : (
            <span className="text-xs opacity-60">Desplazá para ver más</span>
          )}
        </div>
      )}
      {!hasMore && items.length > 0 && (
        <p className="text-center text-xs text-muted-foreground py-8 opacity-70">
          Llegaste al final ✦
        </p>
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
