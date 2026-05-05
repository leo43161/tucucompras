import { cache } from 'react'
import { API_BASE_URL } from '@/lib/config'
import type { ProductoAPI, ProductosFrontResponse } from '@/lib/redux/api/types'

export const fetchAllProducts = cache(async (): Promise<ProductoAPI[]> => {
  try {
    const res = await fetch(`${API_BASE_URL}/obtenerProductosFront?limite=10000&offset=0`, {
      cache: 'force-cache',
    })
    if (!res.ok) return []
    const data: ProductosFrontResponse = await res.json()
    return data?.data ?? []
  } catch {
    return []
  }
})
