import type { Metadata } from 'next'
import { CategoryDetailClient } from '@/components/categories/CategoryDetailClient'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { API_BASE_URL } from '@/lib/config'
import type { CategoriaAPI } from '@/lib/redux/api/types'

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

export async function generateStaticParams() {
  const cats = await fetchCategorias()
  return cats.filter((c) => !!c.slug).map((c) => ({ slug: c.slug! }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const cats = await fetchCategorias()
  const cat = cats.find((c) => c.slug === slug)
  const nombre = cat?.nombre ?? slug
  return {
    title: `${nombre} | TucuCompras`,
    description: `Productos de ${nombre} en empresas de Tucumán. Comprá local, consultá por WhatsApp.`,
    keywords: [nombre, `${nombre} Tucumán`, 'comprar en Tucumán'],
  }
}

export default async function CategoriaPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const cats = await fetchCategorias()
  const cat = cats.find((c) => c.slug === slug) ?? null

  return (
    <>
      <Navbar />
      <CategoryDetailClient slug={slug} categoryId={cat?.id ?? null} categoryName={cat?.nombre ?? slug} />
      <Footer />
    </>
  )
}
