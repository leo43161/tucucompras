import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { API_BASE_URL } from '@/lib/config'
import type {
  ProductoAPI, CategoriaAPI, SubCategoriaAPI,
  ProductosFrontResponse, GetProductosFrontParams,
  LeadPayload, ClickPayload,
} from './types'

// Mapea 1:1 a Api.php: obtenerProductosFront, listar_categorias, listar_sub_categorias.
// Leads/Clicks => endpoints públicos pendientes en backend (ver bloque SQL/PHP abajo).
export const tucucomprasApi = createApi({
  reducerPath: 'tucucomprasApi',
  baseQuery: fetchBaseQuery({ baseUrl: API_BASE_URL }),
  tagTypes: ['Producto', 'Categoria', 'SubCategoria'],
  endpoints: (b) => ({
    getProductos: b.query<ProductosFrontResponse, GetProductosFrontParams>({
      query: (params) => ({ url: '/obtenerProductosFront', params }),
      providesTags: ['Producto'],
    }),
    getCategorias: b.query<CategoriaAPI[], void>({
      query: () => '/listar_categorias',
      transformResponse: (r: { status: number; data: CategoriaAPI[] }) => r.data ?? [],
      providesTags: ['Categoria'],
    }),
    getSubCategorias: b.query<SubCategoriaAPI[], number | void>({
      query: (categoria_id) => ({
        url: '/listar_sub_categorias',
        params: categoria_id ? { categoria_id } : undefined,
      }),
      transformResponse: (r: { status: number; data: SubCategoriaAPI[] }) => r.data ?? [],
      providesTags: ['SubCategoria'],
    }),
    registrarLead: b.mutation<{ status: number }, LeadPayload>({
      query: (body) => ({ url: '/registrar_lead', method: 'POST', body }),
    }),
    registrarClick: b.mutation<{ status: number }, ClickPayload>({
      query: (body) => ({ url: '/registrar_click', method: 'POST', body }),
    }),
  }),
})

export const {
  useGetProductosQuery, useGetCategoriasQuery, useGetSubCategoriasQuery,
  useRegistrarLeadMutation, useRegistrarClickMutation,
} = tucucomprasApi

// Helper: el detalle se resuelve filtrando el listado actual por id (no hay /productos/:id público).
export const findProductoById = (list: ProductoAPI[] | undefined, id: number): ProductoAPI | undefined =>
  list?.find((p) => p.id === id)