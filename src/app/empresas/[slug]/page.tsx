import type { Metadata } from 'next'
import { CompanyDetailClient } from '@/components/companies/CompanyDetailClient'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { API_BASE_URL, buildImgUrl } from '@/lib/config'
import type { ProductoAPI, ProductosFrontResponse, EmpresaAPI } from '@/lib/redux/api/types'

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

function uniqueEmpresas(products: ProductoAPI[]): EmpresaAPI[] {
  const map = new Map<number, EmpresaAPI>()
  for (const p of products) {
    if (p.empresa?.id && !map.has(p.empresa.id)) map.set(p.empresa.id, p.empresa)
  }
  return [...map.values()]
}

export async function generateStaticParams() {
  const products = await fetchAllProducts()
  return uniqueEmpresas(products).map((e) => ({ slug: String(e.id) }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const id = Number(slug)
  const products = await fetchAllProducts()
  const empresa = uniqueEmpresas(products).find((e) => e.id === id)
  if (!empresa) return { title: 'Tienda no encontrada | TucuCompras' }
  const banner = buildImgUrl(empresa.banner_url)
  const logo = buildImgUrl(empresa.logo_url)
  const desc = `Productos disponibles en ${empresa.nombre}. Catálogo local de Tucumán — consultá directo por WhatsApp.`
  return {
    title: `${empresa.nombre} | TucuCompras`,
    description: desc,
    alternates: { canonical: `${SITE_URL}/empresas/${empresa.id}` },
    openGraph: {
      title: empresa.nombre,
      description: desc,
      url: `${SITE_URL}/empresas/${empresa.id}`,
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

export default async function EmpresaPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const id = Number(slug)
  const products = await fetchAllProducts()
  const empresa = uniqueEmpresas(products).find((e) => e.id === id) ?? null
  const empresaProducts = products.filter((p) => p.empresa?.id === id)

  const localBizLd = empresa && {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${SITE_URL}/empresas/${empresa.id}`,
    name: empresa.nombre,
    url: empresa.sitio_web ?? `${SITE_URL}/empresas/${empresa.id}`,
    image: buildImgUrl(empresa.banner_url) ?? buildImgUrl(empresa.logo_url) ?? undefined,
    logo: buildImgUrl(empresa.logo_url) ?? undefined,
    telephone: empresa.whatsapp_contacto ?? undefined,
    ...(empresa.direccion
      ? { address: { '@type': 'PostalAddress', streetAddress: empresa.direccion, addressRegion: 'Tucumán', addressCountry: 'AR' } }
      : {}),
    ...(empresa.latitud && empresa.longitud
      ? { geo: { '@type': 'GeoCoordinates', latitude: empresa.latitud, longitude: empresa.longitud } }
      : {}),
    areaServed: 'Tucumán, Argentina',
  }

  const breadcrumbLd = empresa && {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Inicio', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: empresa.nombre, item: `${SITE_URL}/empresas/${empresa.id}` },
    ],
  }

  return (
    <>
      {localBizLd && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBizLd) }} />
      )}
      {breadcrumbLd && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      )}
      <Navbar />
      <CompanyDetailClient empresaId={id} initialEmpresa={empresa} initialProducts={empresaProducts} />
      <Footer />
    </>
  )
}
