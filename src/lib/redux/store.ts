// src/lib/redux/store.ts
import { configureStore } from '@reduxjs/toolkit'
import { tucucomprasApi } from './api/productsApi'
import uiReducer from './slices/uiSlice'

export const store = configureStore({
  reducer: {
    // RTK Query maneja su propio slice internamente
    [tucucomprasApi.reducerPath]: tucucomprasApi.reducer,
    // Tu UI state (reemplaza el Zustand para el estado global)
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(tucucomprasApi.middleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch