import { cache } from 'react'
import { API_BASE_URL } from '@/lib/config'
import type { EmpresaAPI } from '@/lib/redux/api/types'

interface EmpresasFrontResponse {
  success: boolean
  total: number
  data: EmpresaAPI[]
}

export const fetchAllEmpresas = cache(async (): Promise<EmpresaAPI[]> => {
  try {
    const res = await fetch(`${API_BASE_URL}/obtenerEmpresasFront`, {
      cache: 'force-cache',
    })
    if (!res.ok) return []
    const data: EmpresasFrontResponse = await res.json()
    return data?.data ?? []
  } catch {
    return []
  }
})

export const fetchEmpresaById = cache(async (id: number): Promise<EmpresaAPI | null> => {
  try {
    const res = await fetch(`${API_BASE_URL}/obtenerEmpresaFront?id=${id}`, {
      cache: 'force-cache',
    })
    if (!res.ok) return null
    const data: { success: boolean; data: EmpresaAPI } = await res.json()
    return data?.data ?? null
  } catch {
    return null
  }
})
