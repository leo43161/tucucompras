import type { Metadata } from 'next'
import Link from 'next/link'
import { ProductRedirect } from '@/components/products/ProductRedirect'
import { fetchAllEmpresas, fetchEmpresaById } from '@/lib/empresas-fetch'
import { buildEmpresaPath } from '@/lib/utils'

const SITE_URL = 'https://tucucompras.com.ar'

interface RouteParams { id: string }

export async function generateStaticParams(): Promise<RouteParams[]> {
  const empresas = await fetchAllEmpresas()
  return empresas.map((e) => ({ id: String(e.id) }))
}

export async function generateMetadata({ params }: { params: Promise<RouteParams> }): Promise<Metadata> {
  const { id: idStr } = await params
  const id = Number(idStr)
  const empresa = await fetchEmpresaById(id)
  if (!empresa) {
    return {
      title: 'Tienda no encontrada | TucuCompras',
      robots: { index: false, follow: false },
    }
  }
  const canonicalPath = buildEmpresaPath(empresa.id, empresa.nombre)
  const canonicalUrl = `${SITE_URL}${canonicalPath}`
  return {
    title: `${empresa.nombre} | TucuCompras`,
    alternates: { canonical: canonicalUrl },
    robots: { index: false, follow: true },
  }
}

export default async function EmpresaRedirectPage({ params }: { params: Promise<RouteParams> }) {
  const { id: idStr } = await params
  const id = Number(idStr)
  const empresa = await fetchEmpresaById(id)

  if (!empresa) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold">Tienda no encontrada</h1>
        <p className="text-sm text-muted-foreground mt-2">Puede que ya no esté disponible.</p>
        <Link href="/" className="inline-block text-sm text-primary mt-6 hover:underline">
          Volver al inicio
        </Link>
      </div>
    )
  }

  const canonicalPath = buildEmpresaPath(empresa.id, empresa.nombre)
  const canonicalUrl = `${SITE_URL}${canonicalPath}`

  return (
    <>
      <meta httpEquiv="refresh" content={`0; url=${canonicalPath}`} />
      <link rel="canonical" href={canonicalUrl} />
      <ProductRedirect to={canonicalPath} />
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <h1 className="text-xl font-semibold">Redireccionando…</h1>
        <p className="text-sm text-muted-foreground mt-2">
          Si no sos redirigido automáticamente,{' '}
          <Link href={canonicalPath} className="text-primary hover:underline">
            hacé clic acá para ver “{empresa.nombre}”
          </Link>
          .
        </p>
      </div>
    </>
  )
}
