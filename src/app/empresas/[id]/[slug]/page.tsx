import type { Metadata } from 'next'
import { CompanyDetailClient } from '@/components/companies/CompanyDetailClient'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { buildImgUrl } from '@/lib/config'
import { fetchAllProducts } from '@/lib/products-fetch'
import { fetchAllEmpresas, fetchEmpresaById } from '@/lib/empresas-fetch'
import { buildEmpresaPath, buildEmpresaSlug } from '@/lib/utils'
import { buildStoreLd, buildBreadcrumbLd, ldScript } from '@/lib/schema'

const SITE_URL = 'https://tucucompras.com.ar'

interface RouteParams { id: string; slug: string }

export async function generateStaticParams(): Promise<RouteParams[]> {
  const empresas = await fetchAllEmpresas()
  return empresas
    .map((e) => ({ id: String(e.id), slug: buildEmpresaSlug(e.nombre) }))
    .filter((r) => !!r.slug)
}

export async function generateMetadata({ params }: { params: Promise<RouteParams> }): Promise<Metadata> {
  const { id: idStr } = await params
  const id = Number(idStr)
  const empresa = await fetchEmpresaById(id)
  if (!empresa) return { title: 'Tienda no encontrada | TucuCompras' }
  const banner = buildImgUrl(empresa.banner_url)
  const logo = buildImgUrl(empresa.logo_url)
  const canonicalPath = buildEmpresaPath(empresa.id, empresa.nombre)
  const desc = `Productos disponibles en ${empresa.nombre}. Catálogo local de Tucumán — consultá directo por WhatsApp.`
  return {
    title: `${empresa.nombre} | TucuCompras`,
    description: desc,
    alternates: { canonical: `${SITE_URL}${canonicalPath}` },
    openGraph: {
      title: empresa.nombre,
      description: desc,
      url: `${SITE_URL}${canonicalPath}`,
      images: banner ? [{ url: banner, width: 1200, height: 630, alt: empresa.nombre }]
        : logo ? [{ url: logo, alt: empresa.nombre }]
        : [],
      type: 'website',
      locale: 'es_AR',
      siteName: 'TucuCompras',
    },
    twitter: { card: 'summary_large_image', title: empresa.nombre, description: desc },
    keywords: [empresa.nombre, `${empresa.nombre} Tucumán`, 'comprar en Tucumán', 'tiendas locales', 'TucuCompras'],
  }
}

export default async function EmpresaPage({ params }: { params: Promise<RouteParams> }) {
  const { id: idStr } = await params
  const id = Number(idStr)
  const [empresa, products] = await Promise.all([
    fetchEmpresaById(id),
    fetchAllProducts(),
  ])
  const empresaProducts = products.filter((p) => p.empresa?.id === id)

  const canonicalPath = empresa ? buildEmpresaPath(empresa.id, empresa.nombre) : `/empresas/${id}`

  const storeLd = empresa && buildStoreLd(empresa, empresaProducts)

  const breadcrumbLd = empresa && buildBreadcrumbLd([
    { name: 'Inicio', url: SITE_URL },
    { name: empresa.nombre, url: `${SITE_URL}${canonicalPath}` },
  ])

  return (
    <>
      {storeLd && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: ldScript(storeLd) }} />
      )}
      {breadcrumbLd && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: ldScript(breadcrumbLd) }} />
      )}
      <Navbar />
      <CompanyDetailClient empresaId={id} initialEmpresa={empresa} initialProducts={empresaProducts} />
      <Footer />
    </>
  )
}
