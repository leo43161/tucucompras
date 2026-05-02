import type { Metadata } from 'next'
import { CompanyDetailClient } from '@/components/companies/CompanyDetailClient'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { API_BASE_URL } from '@/lib/config'
import type { ProductoAPI, ProductosFrontResponse, EmpresaAPI } from '@/lib/redux/api/types'

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

function uniqueEmpresas(products: ProductoAPI[]): EmpresaAPI[] {
  const map = new Map<number, EmpresaAPI>()
  for (const p of products) {
    if (p.empresa?.id && !map.has(p.empresa.id)) map.set(p.empresa.id, p.empresa)
  }
  return [...map.values()]
}

// Sin endpoint público de empresas: derivamos las empresas activas del listado de productos.
// El "slug" es el id de la empresa.
export async function generateStaticParams() {
  const products = await fetchAllProducts()
  return uniqueEmpresas(products).map((e) => ({ slug: String(e.id) }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const id = Number(slug)
  const products = await fetchAllProducts()
  const empresa = uniqueEmpresas(products).find((e) => e.id === id)
  const nombre = empresa?.nombre ?? 'Empresa'
  return {
    title: `${nombre} | TucuCompras`,
    description: `Productos disponibles en ${nombre}. Consultá por WhatsApp directo.`,
    openGraph: empresa?.banner_url ? { images: [{ url: empresa.banner_url }] } : undefined,
  }
}

export default async function EmpresaPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const id = Number(slug)
  const products = await fetchAllProducts()
  const empresa = uniqueEmpresas(products).find((e) => e.id === id) ?? null

  return (
    <>
      <Navbar />
      <CompanyDetailClient empresaId={id} initialEmpresa={empresa} />
      <Footer />
    </>
  )
}
