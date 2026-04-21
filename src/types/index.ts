import type { ProductoAPI, EmpresaAPI, CategoriaAPI } from '@/lib/redux/api/types'
export interface FilterState {
  categories: string[]
  priceRange: [number, number]
  onlyOffers: boolean
  sortBy: string
}

export type ViewMode = 'list' | 'grid'
export type Product = ProductoAPI
export type Empresa = EmpresaAPI
export type Categoria = CategoriaAPI