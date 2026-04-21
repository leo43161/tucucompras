// src/lib/redux/slices/uiSlice.ts
// Migración del Zustand store a Redux
import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { ViewMode, FilterState } from '@/types'

interface UIState {
  viewMode: ViewMode
  selectedProductId: number | null
  filters: FilterState
}

const initialState: UIState = {
  viewMode: 'list',
  selectedProductId: null,
  filters: {
    categories: [],
    priceRange: [0, 999999],
    onlyOffers: false,
    sortBy: 'relevance',
  },
}

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setViewMode: (state, action: PayloadAction<ViewMode>) => {
      state.viewMode = action.payload
    },
    openModal: (state, action: PayloadAction<number>) => {
      state.selectedProductId = action.payload
    },
    closeModal: (state) => {
      state.selectedProductId = null
    },
    toggleCategory: (state, action: PayloadAction<string>) => {
      const cat = action.payload
      const idx = state.filters.categories.indexOf(cat)
      if (idx >= 0) {
        state.filters.categories.splice(idx, 1)
      } else {
        state.filters.categories.push(cat)
      }
    },
    setOnlyOffers: (state, action: PayloadAction<boolean>) => {
      state.filters.onlyOffers = action.payload
    },
    setPriceRange: (state, action: PayloadAction<[number, number]>) => {
      state.filters.priceRange = action.payload
    },
  },
})

export const {
  setViewMode,
  openModal,
  closeModal,
  toggleCategory,
  setOnlyOffers,
  setPriceRange,
} = uiSlice.actions

export default uiSlice.reducer