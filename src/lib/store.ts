import { create } from 'zustand'
// Asegúrate de actualizar '@/types' para que FilterState incluya 'sortBy: string'
import type { ViewMode, FilterState } from '@/types'

interface StoreState {
  // Vista
  viewMode: ViewMode
  setViewMode: (mode: ViewMode) => void

  // Modal
  selectedProductId: number | null
  openModal: (id: number) => void
  closeModal: () => void

  // Filtros
  filters: FilterState
  toggleCategory: (cat: string) => void
  setOnlyOffers: (v: boolean) => void
  setPriceRange: (range: [number, number]) => void
  setSortBy: (sort: string) => void  // Agregado para el select de ordenamiento
  resetFilters: () => void           // Agregado para el Empty State
}

// Extraemos el estado inicial a una constante. 
// Esto es vital para poder resetear los filtros limpiamente sin repetir código.
const INITIAL_FILTERS: FilterState = {
  categories: [],
  priceRange: [0, 999999], // Sincronizado con el máximo de FilterSidebar
  onlyOffers: false,
  sortBy: 'relevance',     // Valor por defecto del select
}

export const useStore = create<StoreState>((set) => ({
  // Vista (Cambiado a 'grid' por defecto, convierte mejor en mobile/desktop inicial)
  viewMode: 'grid', 
  setViewMode: (mode) => set({ viewMode: mode }),

  // Modal
  selectedProductId: null,
  openModal: (id) => set({ selectedProductId: id }),
  closeModal: () => set({ selectedProductId: null }),

  // Filtros
  filters: INITIAL_FILTERS,
  
  toggleCategory: (cat) =>
    set((s) => ({
      filters: {
        ...s.filters,
        categories: s.filters.categories.includes(cat)
          ? s.filters.categories.filter((c) => c !== cat)
          : [...s.filters.categories, cat],
      },
    })),
    
  setOnlyOffers: (v) =>
    set((s) => ({ filters: { ...s.filters, onlyOffers: v } })),
    
  setPriceRange: (range) =>
    set((s) => ({ filters: { ...s.filters, priceRange: range } })),
    
  setSortBy: (sort) =>
    set((s) => ({ filters: { ...s.filters, sortBy: sort } })),
    
  // Devuelve los filtros a su estado de fábrica en 1 clic
  resetFilters: () => 
    set(() => ({ filters: INITIAL_FILTERS })),
}))