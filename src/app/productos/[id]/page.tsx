import type { Metadata } from 'next'
import Link from 'next/link'
import { ProductRedirect } from '@/components/products/ProductRedirect'
import { API_BASE_URL } from '@/lib/config'
import { buildProductPath } from '@/lib/utils'
import type { ProductoAPI, ProductosFrontResponse } from '@/lib/redux/api/types'

const SITE_URL = 'https://tucucompras.com.ar'

interface RouteParams { id: string }

async function fetchAllProducts(): Promise<ProductoAPI[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/obtenerProductosFront?limite=10000&offset=0`, { cache: 'no-store' })
    if (!res.ok) return []
    const data: ProductosFrontResponse = await res.json()
    return data?.data ?? []
  } catch {
    return []
  }
}

export async function generateStaticParams(): Promise<RouteParams[]> {
  const products = await fetchAllProducts()
  return products.map((p) => ({ id: String(p.id) }))
}

export async function generateMetadata({ params }: { params: Promise<RouteParams> }): Promise<Metadata> {
  const { id: idStr } = await params
  const id = Number(idStr)
  const products = await fetchAllProducts()
  const product = products.find((p) => p.id === id)
  if (!product) {
    return {
      title: 'Producto no encontrado | TucuCompras',
      robots: { index: false, follow: false },
    }
  }
  const canonicalPath = buildProductPath(product.id, product.nombre)
  const canonicalUrl = `${SITE_URL}${canonicalPath}`
  return {
    title: `${product.nombre} | TucuCompras`,
    // canonical apunta a la URL definitiva con slug
    alternates: { canonical: canonicalUrl },
    // No queremos que Google indexe la URL corta — sólo la canónica
    robots: { index: false, follow: true },
  }
}

export default async function ProductRedirectPage({ params }: { params: Promise<RouteParams> }) {
  const { id: idStr } = await params
  const id = Number(idStr)
  const products = await fetchAllProducts()
  const product = products.find((p) => p.id === id)

  if (!product) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold">Producto no encontrado</h1>
        <p className="text-sm text-muted-foreground mt-2">Puede que ya no esté disponible.</p>
        <Link href="/" className="inline-block text-sm text-primary mt-6 hover:underline">
          Volver al inicio
        </Link>
      </div>
    )
  }

  const canonicalPath = buildProductPath(product.id, product.nombre)
  const canonicalUrl = `${SITE_URL}${canonicalPath}`

  return (
    <>
      {/* Meta refresh: redirect inmediato sin JS (Googlebot lo trata como 301 cuando delay=0) */}
      <meta httpEquiv="refresh" content={`0; url=${canonicalPath}`} />
      <link rel="canonical" href={canonicalUrl} />

      {/* Fallback con JS por si el navegador ignora el meta refresh */}
      <ProductRedirect to={canonicalPath} />

      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <h1 className="text-xl font-semibold">Redireccionando…</h1>
        <p className="text-sm text-muted-foreground mt-2">
          Si no sos redirigido automáticamente,{' '}
          <Link href={canonicalPath} className="text-primary hover:underline">
            hacé clic acá para ver “{product.nombre}”
          </Link>
          .
        </p>
      </div>
    </>
  )
}
