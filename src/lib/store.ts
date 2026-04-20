import { create } from 'zustand'
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
}

export const useStore = create<StoreState>((set) => ({
  viewMode: 'list',
  setViewMode: (mode) => set({ viewMode: mode }),

  selectedProductId: null,
  openModal: (id) => set({ selectedProductId: id }),
  closeModal: () => set({ selectedProductId: null }),

  filters: {
    categories: [],
    priceRange: [0, 50000],
    onlyOffers: false,
  },
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
}))