import type { Metadata } from 'next'
import { ProductDetailClient } from '@/components/products/ProductDetailClient'
import { API_BASE_URL } from '@/lib/config'
import type { ProductoAPI, ProductosFrontResponse } from '@/lib/redux/api/types'

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

// Con output: 'export', generateStaticParams corre en build time.
// El "slug" es el id del producto (la DB no tiene campo slug en productos).
export async function generateStaticParams() {
  const products = await fetchAllProducts()
  return products.map((p) => ({ slug: String(p.id) }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const products = await fetchAllProducts()
  const product = products.find((p) => String(p.id) === slug)
  if (!product) return { title: 'Producto | TucuCompras' }
  return {
    title: `${product.nombre} | TucuCompras`,
    description: product.descripcion ?? `${product.nombre} en ${product.empresa?.nombre ?? 'TucuCompras'}`,
    openGraph: {
      title: product.nombre,
      description: product.descripcion ?? '',
      images: product.imagen_principal_url ? [{ url: product.imagen_principal_url }] : [],
      locale: 'es_AR',
      type: 'website',
    },
    keywords: [
      product.nombre,
      product.empresa?.nombre ?? '',
      'comprar en Tucumán',
      product.categoria?.nombre ? `${product.categoria.nombre} Tucumán` : '',
    ].filter(Boolean) as string[],
  }
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const id = Number(slug)
  const products = await fetchAllProducts()
  const product = products.find((p) => p.id === id) ?? null

  const jsonLd = product && {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.nombre,
    description: product.descripcion,
    image: product.imagen_principal_url,
    brand: { '@type': 'Brand', name: product.empresa?.nombre ?? 'TucuCompras' },
    offers: {
      '@type': 'Offer',
      priceCurrency: 'ARS',
      price: product.es_oferta && product.precio_oferta ? product.precio_oferta : product.precio,
      availability: 'https://schema.org/InStock',
      seller: { '@type': 'Organization', name: 'TucuCompras' },
    },
  }

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <ProductDetailClient id={id} initialData={product} />
    </>
  )
}
