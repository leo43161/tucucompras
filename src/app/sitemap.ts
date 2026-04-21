// src/app/sitemap.ts
// NOTA: Con output:'export' este archivo genera /out/sitemap.xml en build
import { API_BASE_URL } from '@/lib/config'

export default async function sitemap() {
  const baseUrl = 'https://tucucompras.com.ar'

  try {
    const [productos, categorias, empresas] = await Promise.all([
      fetch(`${API_BASE_URL}/productos?fields=slug,fecha_creacion`).then((r) =>
        r.json()
      ),
      fetch(`${API_BASE_URL}/categorias?fields=slug`).then((r) => r.json()),
      fetch(`${API_BASE_URL}/empresas?fields=id`).then((r) => r.json()),
    ])

    const productUrls = productos.map((p: { slug: string; fecha_creacion: string }) => ({
      url: `${baseUrl}/productos/${p.slug}`,
      lastModified: new Date(p.fecha_creacion),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }))

    const categoryUrls = categorias.map((c: { slug: string }) => ({
      url: `${baseUrl}/categorias/${c.slug}`,
      changeFrequency: 'daily' as const,
      priority: 0.7,
    }))

    return [
      { url: baseUrl, changeFrequency: 'daily' as const, priority: 1.0 },
      ...categoryUrls,
      ...productUrls,
    ]
  } catch {
    return [{ url: baseUrl, priority: 1.0 }]
  }
}