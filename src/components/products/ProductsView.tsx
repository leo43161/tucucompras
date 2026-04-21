// src/components/products/ProductsView.tsx — actualizado
'use client'

import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks'
import { setViewMode } from '@/lib/redux/slices/uiSlice'
import { useGetProductosQuery } from '@/lib/redux/api/productsApi'
import { ProductCard } from './ProductCard'
import { LayoutList, LayoutGrid } from 'lucide-react'

export function ProductsView() {
  const dispatch = useAppDispatch()
  const viewMode = useAppSelector((s) => s.ui.viewMode)
  const filters = useAppSelector((s) => s.ui.filters)

  // RTK Query — los filtros se aplican en el backend (cuando esté listo)
  // Por ahora los datos mock se filtran dentro del queryFn
  const { data, isLoading, isError } = useGetProductosQuery({
    es_oferta: filters.onlyOffers || undefined,
    precio_min: filters.priceRange[0],
    precio_max: filters.priceRange[1] === 999999 ? undefined : filters.priceRange[1],
  })

  if (isLoading) {
    return (
      <div className="flex flex-col gap-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-[140px] bg-white rounded-[14px] border border-[--border] animate-pulse" />
        ))}
      </div>
    )
  }

  if (isError) {
    return (
      <div className="text-center py-20 text-[--text-muted]">
        <p className="text-lg font-medium">Error al cargar productos</p>
        <p className="text-sm mt-1">Intentá recargar la página</p>
      </div>
    )
  }

  const products = data?.data ?? []

  return (
    <div>
      {/* Toolbar */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-[--text-secondary]">
          <span className="font-semibold text-[--text-primary]">{data?.total ?? 0}</span> productos
        </p>
        <div className="flex items-center gap-1 bg-[--bg] border border-[--border] rounded-lg p-1">
          <ViewBtn
            active={viewMode === 'list'}
            onClick={() => dispatch(setViewMode('list'))}
            label="Vista lista"
          >
            <LayoutList size={16} />
          </ViewBtn>
          <ViewBtn
            active={viewMode === 'grid'}
            onClick={() => dispatch(setViewMode('grid'))}
            label="Vista grilla"
          >
            <LayoutGrid size={16} />
          </ViewBtn>
        </div>
      </div>

      {/* Products */}
      {viewMode === 'list' ? (
        <div className="flex flex-col gap-3">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} view="list" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} view="grid" />
          ))}
        </div>
      )}

      {products.length === 0 && (
        <div className="text-center py-20 text-[--text-muted]">
          <p className="text-lg font-medium">Sin resultados</p>
          <p className="text-sm mt-1">Probá cambiando los filtros</p>
        </div>
      )}
    </div>
  )
}

function ViewBtn({
  active,
  onClick,
  label,
  children,
}: {
  active: boolean
  onClick: () => void
  label: string
  children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      aria-pressed={active}
      role="radio"
      className={`p-1.5 rounded transition-all duration-200 ${
        active
          ? 'bg-primary text-foreground shadow-sm'
          : 'text-muted-foreground hover:text-foreground hover:bg-muted'
      }`}
    >
      {children}
    </button>
  )
}