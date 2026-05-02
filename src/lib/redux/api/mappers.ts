import type { ProductoAPI, GetProductosFrontParams } from './types'
import type { FilterState } from '@/types'

// Traduce el estado UI (filtros del slice) al shape de query de obtenerProductosFront.
export function filtersToQuery(f: FilterState, page = 1, perPage = 12): GetProductosFrontParams {
  const orden = f.sortBy === 'price-asc' ? 'ASC' : f.sortBy === 'price-desc' ? 'DESC' : ''
  return {
    categoria_id: f.categoryId ?? undefined,
    search: f.search || undefined,
    orden_precio: orden,
    limite: perPage,
    offset: (page - 1) * perPage,
  }
}

// Filtro client-side por rango de precio y "solo ofertas" (no soportado por el SP).
export function applyClientFilters(items: ProductoAPI[], f: FilterState): ProductoAPI[] {
  return items.filter((p) => {
    const finalPrice = p.es_oferta && p.precio_oferta ? p.precio_oferta : p.precio
    if (finalPrice < f.priceRange[0] || finalPrice > f.priceRange[1]) return false
    if (f.onlyOffers && !p.es_oferta) return false
    return true
  })
}
