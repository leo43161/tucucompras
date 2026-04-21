// src/lib/redux/api/types.ts
// Tipos que reflejan exactamente tu schema SQL

export interface EmpresaAPI {
  id: number
  nombre: string
  cuit: string | null
  whatsapp_contacto: string
  sitio_web: string | null
  logo_url: string | null
  banner_url: string | null
  direccion: string | null
  latitud: number | null
  longitud: number | null
  visible: boolean
  activo: boolean
  fecha_creacion: string
}

export interface CategoriaAPI {
  id: number
  nombre: string
  slug: string
  visible: boolean
  activo: boolean
}

export interface SubCategoriaAPI {
  id: number
  categoria_id: number
  nombre: string
  slug: string
  visible: boolean
  activo: boolean
}

export interface ProductoAPI {
  id: number
  empresa_id: number
  categoria_id: number
  nombre: string
  descripcion: string | null
  precio: number
  precio_oferta: number | null
  es_oferta: boolean
  imagen_principal_url: string | null
  visible: boolean
  activo: boolean
  fecha_creacion: string
  // Joins opcionales que el backend puede incluir
  empresa?: EmpresaAPI
  categoria?: CategoriaAPI
  slug?: string // El backend debería generarlo desde nombre
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  per_page: number
  total_pages: number
}

export interface GetProductosParams {
  page?: number
  per_page?: number
  categoria_id?: number
  empresa_id?: number
  es_oferta?: boolean
  precio_min?: number
  precio_max?: number
  search?: string
  visible?: boolean
}