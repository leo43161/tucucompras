import type { MetadataRoute } from 'next'
import { API_BASE_URL } from '@/lib/config'
import type { CategoriaAPI, ProductosFrontResponse } from '@/lib/redux/api/types'

const BASE_URL = 'https://tucucompras.com.ar'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [productos, categorias] = await Promise.all([
    fetch(`${API_BASE_URL}/obtenerProductosFront?limite=10000&offset=0`)
      .then(async (r) => (r.ok ? ((await r.json()) as ProductosFrontResponse).data ?? [] : []))
      .catch(() => [] as ProductosFrontResponse['data']),
    fetch(`${API_BASE_URL}/listar_categorias`)
      .then((r) => r.ok ? r.json() : { data: [] })
      .then((j) => (j?.data ?? []) as CategoriaAPI[])
      .catch(() => [] as CategoriaAPI[]),
  ])

  const productUrls: MetadataRoute.Sitemap = productos.map((p) => ({
    url: `${BASE_URL}/productos/${p.id}`,
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  const categoryUrls: MetadataRoute.Sitemap = categorias
    .filter((c) => !!c.slug)
    .map((c) => ({
      url: `${BASE_URL}/categorias/${c.slug}`,
      changeFrequency: 'daily',
      priority: 0.7,
    }))

  const empresaIds = new Set<number>()
  for (const p of productos) if (p.empresa?.id) empresaIds.add(p.empresa.id)
  const empresaUrls: MetadataRoute.Sitemap = [...empresaIds].map((id) => ({
    url: `${BASE_URL}/empresas/${id}`,
    changeFrequency: 'weekly',
    priority: 0.6,
  }))

  return [
    { url: BASE_URL, changeFrequency: 'daily', priority: 1.0 },
    ...categoryUrls,
    ...empresaUrls,
    ...productUrls,
  ]
}
