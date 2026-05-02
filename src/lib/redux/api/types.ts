export interface EmpresaAPI {
  id: number; nombre: string; cuit?: string | null
  whatsapp_contacto: string; sitio_web?: string | null
  logo_url?: string | null; banner_url?: string | null
  direccion?: string | null; latitud?: number | null; longitud?: number | null
}
export interface CategoriaAPI { id: number; nombre: string; slug?: string }
export interface SubCategoriaAPI { id: number; categoria_id?: number; nombre: string; slug?: string }
export interface ProductoAPI {
  id: number
  nombre: string
  descripcion: string | null
  precio: number
  precio_oferta: number | null
  es_oferta: boolean
  imagen_principal_url: string | null
  link?: string | null
  empresa: EmpresaAPI
  categoria: CategoriaAPI
  sub_categorias: SubCategoriaAPI[]
}
export interface ProductosFrontResponse {
  success: boolean
  total: number
  limite: number
  offset: number
  data: ProductoAPI[]
}
export interface GetProductosFrontParams {
  categoria_id?: number
  subcategoria_id?: number
  search?: string
  orden_precio?: 'ASC' | 'DESC' | ''
  limite?: number
  offset?: number
}
export type TipoLead = 'whatsapp' | 'sitio_web'
export interface LeadPayload { producto_id: number; tipo_lead: TipoLead }
export interface ClickPayload { producto_id: number }