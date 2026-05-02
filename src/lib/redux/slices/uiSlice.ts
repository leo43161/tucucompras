// src/lib/redux/slices/uiSlice.ts
import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { ViewMode, FilterState } from '@/types'

interface UIState {
  viewMode: ViewMode
  selectedProductId: number | null
  filters: FilterState
}

const initialState: UIState = {
  viewMode: 'grid',
  selectedProductId: null,
  filters: {
    categoryId: null,
    search: '',
    priceRange: [0, 999999],
    onlyOffers: false,
    sortBy: 'relevance',
  },
}

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setViewMode: (s, a: PayloadAction<ViewMode>) => { s.viewMode = a.payload },
    openModal: (s, a: PayloadAction<number>) => { s.selectedProductId = a.payload },
    closeModal: (s) => { s.selectedProductId = null },
    setCategory: (s, a: PayloadAction<number | null>) => { s.filters.categoryId = a.payload },
    setSearch: (s, a: PayloadAction<string>) => { s.filters.search = a.payload },
    setOnlyOffers: (s, a: PayloadAction<boolean>) => { s.filters.onlyOffers = a.payload },
    setPriceRange: (s, a: PayloadAction<[number, number]>) => { s.filters.priceRange = a.payload },
    setSortBy: (s, a: PayloadAction<string>) => { s.filters.sortBy = a.payload },
    resetFilters: (s) => { s.filters = initialState.filters },
  },
})

export const {
  setViewMode, openModal, closeModal,
  setCategory, setSearch, setOnlyOffers, setPriceRange, setSortBy, resetFilters,
} = uiSlice.actions
export default uiSlice.reducer
