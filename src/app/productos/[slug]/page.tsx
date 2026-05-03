import type { Metadata } from 'next'
import { ProductDetailClient } from '@/components/products/ProductDetailClient'
import { API_BASE_URL, buildImgUrl } from '@/lib/config'
import type { ProductoAPI, ProductosFrontResponse } from '@/lib/redux/api/types'

const SITE_URL = 'https://tucucompras.com.ar'

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

export async function generateStaticParams() {
  const products = await fetchAllProducts()
  return products.map((p) => ({ slug: String(p.id) }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const products = await fetchAllProducts()
  const product = products.find((p) => String(p.id) === slug)
  if (!product) return { title: 'Producto no encontrado | TucuCompras' }
  const img = buildImgUrl(product.imagen_principal_url)
  const desc = product.descripcion?.slice(0, 160) ?? `${product.nombre} disponible en ${product.empresa?.nombre ?? 'TucuCompras'}. Consultá por WhatsApp.`
  return {
    title: `${product.nombre} | TucuCompras`,
    description: desc,
    alternates: { canonical: `${SITE_URL}/productos/${product.id}` },
    openGraph: {
      title: product.nombre,
      description: desc,
      url: `${SITE_URL}/productos/${product.id}`,
      images: img ? [{ url: img, width: 1200, height: 1200, alt: product.nombre }] : [],
      locale: 'es_AR',
      type: 'website',
      siteName: 'TucuCompras',
    },
    twitter: {
      card: 'summary_large_image',
      title: product.nombre,
      description: desc,
      images: img ? [img] : [],
    },
    keywords: [
      product.nombre,
      product.empresa?.nombre ?? '',
      product.categoria?.nombre ?? '',
      ...(product.sub_categorias ?? []).map((s) => s.nombre),
      'comprar en Tucumán',
      'TucuCompras',
    ].filter(Boolean) as string[],
  }
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const id = Number(slug)
  const products = await fetchAllProducts()
  const product = products.find((p) => p.id === id) ?? null
  const imgAbs = product ? buildImgUrl(product.imagen_principal_url) : null

  const finalPrice = product
    ? (product.es_oferta && product.precio_oferta ? Number(product.precio_oferta) : Number(product.precio))
    : 0

  const productLd = product && {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.nombre,
    description: product.descripcion ?? '',
    image: imgAbs ? [imgAbs] : [],
    sku: String(product.id),
    brand: { '@type': 'Brand', name: product.empresa?.nombre ?? 'TucuCompras' },
    category: product.categoria?.nombre,
    offers: {
      '@type': 'Offer',
      url: `${SITE_URL}/productos/${product.id}`,
      priceCurrency: 'ARS',
      price: finalPrice,
      availability: 'https://schema.org/InStock',
      itemCondition: 'https://schema.org/NewCondition',
      seller: {
        '@type': 'Organization',
        name: product.empresa?.nombre ?? 'TucuCompras',
        ...(product.empresa?.sitio_web ? { url: product.empresa.sitio_web } : {}),
      },
    },
  }

  const breadcrumbLd = product && {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Inicio', item: SITE_URL },
      ...(product.categoria?.slug
        ? [{ '@type': 'ListItem', position: 2, name: product.categoria.nombre, item: `${SITE_URL}/categorias/${product.categoria.slug}` }]
        : []),
      { '@type': 'ListItem', position: product.categoria?.slug ? 3 : 2, name: product.nombre, item: `${SITE_URL}/productos/${product.id}` },
    ],
  }

  return (
    <>
      {productLd && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productLd) }} />
      )}
      {breadcrumbLd && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      )}
      <ProductDetailClient id={id} initialData={product} />
    </>
  )
}
