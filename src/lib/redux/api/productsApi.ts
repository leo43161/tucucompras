// src/lib/redux/api/productsApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { API_BASE_URL } from '@/lib/config'
import {
  mockProductos,
  mockEmpresas,
  mockCategorias,
} from '../mockHandlers'
import type {
  ProductoAPI,
  EmpresaAPI,
  CategoriaAPI,
  PaginatedResponse,
  GetProductosParams,
} from './types'

// ── Utilidad para simular latencia del backend en desarrollo ────────────────
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

// ── Flag para alternar entre mock y API real ────────────────────────────────
// Cuando el backend esté listo: cambiar a false
const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK !== 'false'

export const tucucomprasApi = createApi({
  reducerPath: 'tucucomprasApi',
  baseQuery: fetchBaseQuery({ baseUrl: API_BASE_URL }),
  tagTypes: ['Producto', 'Empresa', 'Categoria'],

  endpoints: (builder) => ({

    // ── PRODUCTOS ───────────────────────────────────────────────────────────

    getProductos: builder.query<PaginatedResponse<ProductoAPI>, GetProductosParams>({
      queryFn: async (params) => {
        if (USE_MOCK) {
          await sleep(300) // Simula latencia de red
          let results = [...mockProductos]

          // Aplicar filtros igual que lo haría el backend
          if (params.categoria_id) {
            results = results.filter((p) => p.categoria_id === params.categoria_id)
          }
          if (params.empresa_id) {
            results = results.filter((p) => p.empresa_id === params.empresa_id)
          }
          if (params.es_oferta !== undefined) {
            results = results.filter((p) => p.es_oferta === params.es_oferta)
          }
          if (params.precio_min !== undefined) {
            results = results.filter((p) => p.precio >= params.precio_min!)
          }
          if (params.precio_max !== undefined) {
            results = results.filter((p) => p.precio <= params.precio_max!)
          }
          if (params.search) {
            const q = params.search.toLowerCase()
            results = results.filter(
              (p) =>
                p.nombre.toLowerCase().includes(q) ||
                p.descripcion?.toLowerCase().includes(q)
            )
          }

          const page = params.page ?? 1
          const perPage = params.per_page ?? 20
          const start = (page - 1) * perPage
          const paginated = results.slice(start, start + perPage)

          return {
            data: {
              data: paginated,
              total: results.length,
              page,
              per_page: perPage,
              total_pages: Math.ceil(results.length / perPage),
            },
          }
        }

        // Modo API real — RTK Query maneja el fetch automáticamente
        // Este bloque nunca se alcanza con USE_MOCK=true
        return { error: { status: 'CUSTOM_ERROR', error: 'Use real baseQuery' } }
      },
      // Cuando USE_MOCK=false, usar el endpoint REST normal:
      // query: (params) => ({ url: '/productos', params }),
      providesTags: ['Producto'],
    }),

    getProductoPorSlug: builder.query<ProductoAPI, string>({
      queryFn: async (slug) => {
        if (USE_MOCK) {
          await sleep(200)
          const product = mockProductos.find((p) => p.slug === slug)
          if (!product) {
            return { error: { status: 404, data: 'Producto no encontrado'} }
          }
          return { data: product }
        }
        return { error: { status: 'CUSTOM_ERROR', data: 'Use real baseQuery' } }
      },
      // query: (slug) => `/productos/${slug}`,
      providesTags: (_result, _error, slug) => [{ type: 'Producto', id: slug }],
    }),

    getProductoPorId: builder.query<ProductoAPI, number>({
      queryFn: async (id) => {
        if (USE_MOCK) {
          await sleep(150)
          const product = mockProductos.find((p) => p.id === id)
          if (!product) {
            return { error: { status: 404, data: 'Producto no encontrado' } }
          }
          return { data: product }
        }
        return { error: { status: 'CUSTOM_ERROR', error: 'Use real baseQuery' } }
      },
      providesTags: (_result, _error, id) => [{ type: 'Producto', id }],
    }),

    // ── EMPRESAS ────────────────────────────────────────────────────────────

    getEmpresas: builder.query<EmpresaAPI[], void>({
      queryFn: async () => {
        if (USE_MOCK) {
          await sleep(200)
          return { data: mockEmpresas.filter((e) => e.activo && e.visible) }
        }
        return { error: { status: 'CUSTOM_ERROR', error: 'Use real baseQuery' } }
      },
      providesTags: ['Empresa'],
    }),

    getEmpresaPorId: builder.query<EmpresaAPI, number>({
      queryFn: async (id) => {
        if (USE_MOCK) {
          await sleep(150)
          const empresa = mockEmpresas.find((e) => e.id === id)
          if (!empresa) {
            return { error: { status: 404, data: 'Empresa no encontrada' } }
          }
          return { data: empresa }
        }
        return { error: { status: 'CUSTOM_ERROR', error: 'Use real baseQuery' } }
      },
      providesTags: (_result, _error, id) => [{ type: 'Empresa', id }],
    }),

    // ── CATEGORÍAS ──────────────────────────────────────────────────────────

    getCategorias: builder.query<CategoriaAPI[], void>({
      queryFn: async () => {
        if (USE_MOCK) {
          await sleep(150)
          return { data: mockCategorias.filter((c) => c.activo && c.visible) }
        }
        return { error: { status: 'CUSTOM_ERROR', error: 'Use real baseQuery' } }
      },
      providesTags: ['Categoria'],
    }),

  }),
})

// Hooks auto-generados por RTK Query — usarlos en los componentes
export const {
  useGetProductosQuery,
  useGetProductoPorSlugQuery,
  useGetProductoPorIdQuery,
  useGetEmpresasQuery,
  useGetEmpresaPorIdQuery,
  useGetCategoriasQuery,
} = tucucomprasApi