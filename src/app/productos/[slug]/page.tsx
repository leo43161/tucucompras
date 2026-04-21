// src/app/productos/[slug]/page.tsx
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ProductDetailClient } from '@/components/products/ProductDetailClient'
import { API_BASE_URL } from '@/lib/config'
import type { Product } from '@/types'

// Con output: 'export', esto corre en BUILD TIME
// Next.js genera una carpeta /out/productos/[slug]/index.html por cada producto
export async function generateStaticParams() {
  try {
    const res = await fetch(`${API_BASE_URL}/productos?fields=slug`)
    const data = await res.json()
    return data.map((p: { slug: string }) => ({ slug: p.slug }))
  } catch {
    // Si el API no está disponible en build, retornamos vacío
    // Los productos se pueden cargar client-side como fallback
    return []
  }
}

// Metadata dinámica por producto — fundamental para SEO
export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}): Promise<Metadata> {
  try {
    const res = await fetch(`${API_BASE_URL}/productos/${params.slug}`)
    const product: Product = await res.json()

    return {
      title: `${product.nombre} | TucuCompras`,
      description: product.descripcion,
      openGraph: {
        title: product.nombre,
        description: product.descripcion || '',
        images: product.imagen_principal_url ? [{ url: product.imagen_principal_url }] : [],
        locale: 'es_AR',
        type: 'website',
      },
      // Keywords locales — clave para búsquedas en Tucumán
      keywords: [
        product.nombre,
        product.empresa?.nombre || '',
        'comprar en Tucumán',
        'productos Tucumán',
        `${product.categoria} Tucumán`,
      ],
    }
  } catch {
    return { title: 'Producto | TucuCompras' }
  }
}

export default async function ProductPage({
  params,
}: {
  params: { slug: string }
}) {
  let product: Product | null = null

  try {
    const res = await fetch(`${API_BASE_URL}/productos/${params.slug}`)
    if (!res.ok) notFound()
    product = await res.json()
  } catch {
    // Con static export no hay notFound() en runtime, pero sí en build
  }

  if (!product) notFound()

  // JSON-LD — le dice a Google exactamente qué es este producto
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    nombre: product.nombre,
    description: product.descripcion,
    image: product.imagen_principal_url,
    brand: { '@type': 'Brand', nombre: product.empresa?.nombre || 'TucuCompras' },
    offers: {
      '@type': 'Offer',
      priceCurrency: 'ARS',
      price: product.precio_oferta
        ? Math.round(product.precio_oferta * 0.85)
        : product.precio,
      availability: 'https://schema.org/InStock',
      seller: { '@type': 'Organization', nombre: 'TucuCompras' },
    },
  }

  return (
    <>
      {/* JSON-LD inyectado en el HTML estático — Google lo lee */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* El resto puede ser client component con RTK Query */}
      <ProductDetailClient slug={params.slug} initialData={product} />
    </>
  )
}