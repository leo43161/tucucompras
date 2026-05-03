import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { ViewMode, FilterState } from '@/types'
import type { ProductoAPI } from '@/lib/redux/api/types'

interface UIState {
  viewMode: ViewMode
  selectedProduct: ProductoAPI | null
  filters: FilterState
}

const initialState: UIState = {
  viewMode: 'grid',
  selectedProduct: null,
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
    openModal: (s, a: PayloadAction<ProductoAPI>) => { s.selectedProduct = a.payload },
    closeModal: (s) => { s.selectedProduct = null },
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
