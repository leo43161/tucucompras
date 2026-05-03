import type { Metadata } from 'next'
import { CategoryDetailClient } from '@/components/categories/CategoryDetailClient'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { API_BASE_URL, buildImgUrl } from '@/lib/config'
import type { CategoriaAPI, ProductoAPI, ProductosFrontResponse } from '@/lib/redux/api/types'

const SITE_URL = 'https://tucucompras.com.ar'

async function fetchCategorias(): Promise<CategoriaAPI[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/listar_categorias`, { cache: 'no-store' })
    if (!res.ok) return []
    const json = await res.json()
    return (json?.data ?? []) as CategoriaAPI[]
  } catch {
    return []
  }
}

async function fetchProductsByCategory(catId: number): Promise<ProductoAPI[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/obtenerProductosFront?categoria_id=${catId}&limite=48&offset=0`, { cache: 'no-store' })
    if (!res.ok) return []
    const data: ProductosFrontResponse = await res.json()
    return data?.data ?? []
  } catch {
    return []
  }
}

export async function generateStaticParams() {
  const cats = await fetchCategorias()
  return cats.filter((c) => !!c.slug).map((c) => ({ slug: c.slug! }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const cats = await fetchCategorias()
  const cat = cats.find((c) => c.slug === slug)
  const nombre = cat?.nombre ?? slug
  const desc = `Descubrí productos de ${nombre} en empresas de Tucumán. Comprá local, consultá directo por WhatsApp.`
  return {
    title: `${nombre} en Tucumán | TucuCompras`,
    description: desc,
    alternates: { canonical: `${SITE_URL}/categorias/${slug}` },
    openGraph: {
      title: `${nombre} en Tucumán`,
      description: desc,
      url: `${SITE_URL}/categorias/${slug}`,
      type: 'website',
      locale: 'es_AR',
      siteName: 'TucuCompras',
    },
    twitter: { card: 'summary', title: nombre, description: desc },
    keywords: [nombre, `${nombre} Tucumán`, 'comprar en Tucumán', 'catálogo local', 'TucuCompras'],
  }
}

export default async function CategoriaPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const cats = await fetchCategorias()
  const cat = cats.find((c) => c.slug === slug) ?? null
  const initialProducts: ProductoAPI[] = cat ? await fetchProductsByCategory(cat.id) : []

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Inicio', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: cat?.nombre ?? slug, item: `${SITE_URL}/categorias/${slug}` },
    ],
  }

  const itemListLd = initialProducts.length > 0 && {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: cat?.nombre ?? slug,
    numberOfItems: initialProducts.length,
    itemListElement: initialProducts.slice(0, 20).map((p, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: `${SITE_URL}/productos/${p.id}`,
      name: p.nombre,
      image: buildImgUrl(p.imagen_principal_url),
    })),
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      {itemListLd && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListLd) }} />
      )}
      <Navbar />
      <CategoryDetailClient
        slug={slug}
        categoryId={cat?.id ?? null}
        categoryName={cat?.nombre ?? slug}
        initialProducts={initialProducts}
      />
      <Footer />
    </>
  )
}
