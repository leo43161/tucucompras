'use client'

import { useStore } from '@/lib/store'
import { products } from '@/lib/data'
import { ProductCard } from './ProductCard'
import { LayoutList, LayoutGrid } from 'lucide-react'

export function ProductsView() {
  const { viewMode, setViewMode, filters } = useStore()

  const filtered = products.filter((p) => {
    if (filters.categories.length > 0 && !filters.categories.includes(p.category)) return false
    if (filters.onlyOffers && !p.sale) return false
    if (p.price < filters.priceRange[0] || p.price > filters.priceRange[1]) return false
    return true
  })

  return (
    <div>
      {/* Toolbar */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-[--text-secondary]">
          <span className="font-semibold text-[--text-primary]">{filtered.length}</span> productos
        </p>
        <div className="flex items-center gap-1 bg-[--bg] border border-[--border] rounded-lg p-1">
          <ViewBtn
            active={viewMode === 'list'}
            onClick={() => setViewMode('list')}
            label="Vista lista"
          >
            <LayoutList size={16} />
          </ViewBtn>
          <ViewBtn
            active={viewMode === 'grid'}
            onClick={() => setViewMode('grid')}
            label="Vista grilla"
          >
            <LayoutGrid size={16} />
          </ViewBtn>
        </div>
      </div>

      {/* Products */}
      {viewMode === 'list' ? (
        <div className="flex flex-col gap-3">
          {filtered.map((p) => (
            <ProductCard key={p.id} product={p} view="list" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((p) => (
            <ProductCard key={p.id} product={p} view="grid" />
          ))}
        </div>
      )}

      {filtered.length === 0 && (
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
      className={`p-1.5 rounded-md transition-colors ${
        active
          ? 'bg-white text-[--tucu-blue] shadow-sm'
          : 'text-[--text-muted] hover:text-[--text-secondary]'
      }`}
    >
      {children}
    </button>
  )
}