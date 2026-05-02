import { configureStore } from '@reduxjs/toolkit'
import { tucucomprasApi } from './api/productsApi'
import uiReducer from './slices/uiSlice'

export const store = configureStore({
  reducer: {
    [tucucomprasApi.reducerPath]: tucucomprasApi.reducer,
    ui: uiReducer,
  },
  middleware: (gDM) => gDM().concat(tucucomprasApi.middleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch