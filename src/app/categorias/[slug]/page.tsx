import type { Metadata } from 'next'
import { CategoryDetailClient } from '@/components/categories/CategoryDetailClient'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { API_BASE_URL } from '@/lib/config'
import { buildProductLd, buildBreadcrumbLd, WEBSITE_ID, ldScript } from '@/lib/schema'
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

  const nombre = cat?.nombre ?? slug
  const categoryUrl = `${SITE_URL}/categorias/${slug}`

  const breadcrumbLd = buildBreadcrumbLd([
    { name: 'Inicio', url: SITE_URL },
    { name: nombre, url: categoryUrl },
  ])

  const collectionLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `${categoryUrl}#webpage`,
    url: categoryUrl,
    name: `${nombre} en Tucumán`,
    description: `Productos de ${nombre} en empresas y tiendas locales de Tucumán. Consultá y comprá directo por WhatsApp.`,
    isPartOf: { '@id': WEBSITE_ID },
    inLanguage: 'es-AR',
    ...(initialProducts.length > 0
      ? {
          mainEntity: {
            '@type': 'ItemList',
            name: nombre,
            numberOfItems: initialProducts.length,
            itemListElement: initialProducts.slice(0, 20).map((p, i) => ({
              '@type': 'ListItem',
              position: i + 1,
              item: buildProductLd(p),
            })),
          },
        }
      : {}),
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: ldScript(breadcrumbLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: ldScript(collectionLd) }} />
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
