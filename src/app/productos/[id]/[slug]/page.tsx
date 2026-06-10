import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronRight, MapPin } from 'lucide-react'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { ProductActions } from '@/components/products/ProductActions'
import { RelatedProducts } from '@/components/products/RelatedProducts'
import { buildImgUrl } from '@/lib/config'
import { fetchAllProducts } from '@/lib/products-fetch'
import { buildEmpresaPath, buildProductPath, buildProductSlug, buildWhatsAppURL, formatPrice } from '@/lib/utils'
import { buildProductLd, buildBreadcrumbLd, ldScript } from '@/lib/schema'

const SITE_URL = 'https://tucucompras.com.ar'

interface RouteParams { id: string; slug: string }

export async function generateStaticParams(): Promise<RouteParams[]> {
  const products = await fetchAllProducts()
  return products
    .map((p) => ({ id: String(p.id), slug: buildProductSlug(p.nombre) }))
    .filter((r) => !!r.slug)
}

export async function generateMetadata({ params }: { params: Promise<RouteParams> }): Promise<Metadata> {
  const { id: idStr } = await params
  const id = Number(idStr)
  const products = await fetchAllProducts()
  const product = products.find((p) => p.id === id)
  if (!product) return { title: 'Producto no encontrado | TucuCompras' }
  const img = buildImgUrl(product.imagen_principal_url)
  const canonicalPath = buildProductPath(product.id, product.nombre)
  const desc = product.descripcion?.slice(0, 160)
    ?? `${product.nombre} disponible en ${product.empresa?.nombre ?? 'TucuCompras'}, Tucumán. Consultá por WhatsApp.`
  return {
    title: `${product.nombre} | TucuCompras`,
    description: desc,
    alternates: { canonical: `${SITE_URL}${canonicalPath}` },
    openGraph: {
      title: product.nombre,
      description: desc,
      url: `${SITE_URL}${canonicalPath}`,
      images: img ? [{ url: img, width: 1200, height: 1200, alt: product.nombre }] : [],
      locale: 'es_AR',
      type: 'website',
      siteName: 'TucuCompras',
    },
    twitter: {
      card: 'summary_large_image',
      title: product.nombre,
      description: desc,
      images: img ? [img] : [],
    },
    keywords: [
      product.nombre,
      `${product.nombre} Tucumán`,
      product.empresa?.nombre ?? '',
      product.categoria?.nombre ?? '',
      `${product.categoria?.nombre ?? ''} Tucumán`,
      ...(product.sub_categorias ?? []).map((s) => s.nombre),
      'comprar en Tucumán',
      'TucuCompras',
    ].filter(Boolean) as string[],
  }
}

export default async function ProductPage({ params }: { params: Promise<RouteParams> }) {
  const { id: idStr } = await params
  const id = Number(idStr)
  const products = await fetchAllProducts()
  const product = products.find((p) => p.id === id) ?? null

  if (!product) {
    return (
      <>
        <Navbar />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-20 text-center">
          <h1 className="text-2xl font-bold">Producto no encontrado</h1>
          <p className="text-sm text-muted-foreground mt-2">Puede que ya no esté disponible.</p>
          <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-primary mt-6 hover:underline">
            ← Volver al inicio
          </Link>
        </div>
        <Footer />
      </>
    )
  }

  const imgAbs = buildImgUrl(product.imagen_principal_url)
  const img = imgAbs ?? 'https://placehold.co/600x600/eee/aaa?text=Sin+imagen'
  const precio = Number(product.precio) || 0
  const precioOferta = Number(product.precio_oferta) || 0
  const hasOffer = !!product.es_oferta && precioOferta > 0 && precioOferta < precio
  const finalPrice = hasOffer ? precioOferta : precio
  const discount = hasOffer ? Math.round(((precio - finalPrice) / precio) * 100) : 0
  const showPrice = finalPrice > 0
  const canonicalPath = buildProductPath(product.id, product.nombre)
  const productUrl = `${SITE_URL}${canonicalPath}`
  const wa = buildWhatsAppURL(product.empresa?.whatsapp_contacto ?? '', {
    productName: product.nombre,
    productUrl,
    price: showPrice ? finalPrice : undefined,
  })

  const sameCategory = products.filter(
    (p) => p.id !== product.id && p.categoria?.id === product.categoria?.id,
  )
  const sameCompany = products.filter(
    (p) => p.id !== product.id && p.empresa?.id === product.empresa?.id,
  )
  const relatedByCategory = sameCategory.slice(0, 8)
  const relatedByCompany = sameCompany.slice(0, 4)

  const productLd = buildProductLd(product, { withContext: true })

  const breadcrumbItems = [
    { name: 'Inicio', href: '/', url: SITE_URL },
    ...(product.categoria?.slug
      ? [{ name: product.categoria.nombre, href: `/categorias/${product.categoria.slug}`, url: `${SITE_URL}/categorias/${product.categoria.slug}` }]
      : []),
    { name: product.nombre, href: canonicalPath, url: productUrl },
  ]

  const breadcrumbLd = buildBreadcrumbLd(breadcrumbItems)

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: ldScript(productLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: ldScript(breadcrumbLd) }} />

      <Navbar />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-4">
        <nav aria-label="Breadcrumb" className="flex items-center flex-wrap gap-1 text-xs sm:text-sm text-muted-foreground">
          {breadcrumbItems.map((b, i) => {
            const last = i === breadcrumbItems.length - 1
            return (
              <span key={b.url} className="inline-flex items-center gap-1">
                {i > 0 && <ChevronRight size={12} className="opacity-60" />}
                {last ? (
                  <span className="text-foreground font-medium truncate max-w-[60vw]">{b.name}</span>
                ) : (
                  <Link href={b.href} className="hover:text-primary">{b.name}</Link>
                )}
              </span>
            )
          })}
        </nav>
      </div>

      <article className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-muted">
            {discount > 0 && (
              <span className="absolute top-3 left-3 z-10 bg-destructive text-white text-xs font-bold px-2.5 py-1 rounded-full">
                -{discount}%
              </span>
            )}
            <Image
              src={img}
              alt={`${product.nombre} — ${product.empresa?.nombre ?? 'Tienda local'} en Tucumán`}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>

          <div className="flex flex-col gap-5">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              {product.empresa?.id ? (
                <Link
                  href={buildEmpresaPath(product.empresa.id, product.empresa.nombre)}
                  className="text-[11px] font-bold text-primary uppercase tracking-wider hover:underline"
                >
                  {product.empresa.nombre}
                </Link>
              ) : (
                <p className="text-[11px] font-bold text-primary uppercase tracking-wider">Tienda local</p>
              )}
              {product.categoria?.slug && (
                <Link
                  href={`/categorias/${product.categoria.slug}`}
                  className="text-[11px] font-medium text-muted-foreground bg-muted border border-border px-3 py-1 rounded-full hover:text-foreground"
                >
                  {product.categoria.nombre}
                </Link>
              )}
            </div>

            <h1 className="font-outfit text-2xl sm:text-3xl font-bold leading-tight">{product.nombre}</h1>

            {showPrice ? (
              <div className="flex items-baseline gap-3 flex-wrap">
                <span className={`text-3xl font-bold ${hasOffer ? 'text-destructive' : 'text-foreground'}`}>
                  {formatPrice(finalPrice)}
                </span>
                {hasOffer && (
                  <span className="text-base text-muted-foreground line-through">{formatPrice(precio)}</span>
                )}
              </div>
            ) : (
              <p className="text-sm font-medium text-muted-foreground italic">Precio a consultar</p>
            )}

            {product.descripcion ? (
              <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">{product.descripcion}</p>
            ) : (
              <p className="text-sm text-muted-foreground leading-relaxed">
                {product.nombre} disponible en {product.empresa?.nombre ?? 'esta tienda'}
                {product.categoria?.nombre ? `, dentro de la categoría ${product.categoria.nombre}` : ''}. Consultá disponibilidad y compra directa por WhatsApp con la tienda en Tucumán.
              </p>
            )}

            {!!product.sub_categorias?.length && (
              <div className="flex flex-wrap gap-1.5">
                {product.sub_categorias.map((s) => (
                  <span key={s.id} className="text-[10px] font-medium bg-muted/60 border border-border text-muted-foreground rounded-full px-2 py-0.5">
                    {s.nombre}
                  </span>
                ))}
              </div>
            )}

            {product.empresa && (
              <div className="flex items-center gap-3 bg-muted/40 border border-border rounded-xl p-3">
                <div className="w-10 h-10 rounded-full bg-background border border-border flex items-center justify-center font-bold text-primary shrink-0 overflow-hidden">
                  {product.empresa.logo_url ? (
                    <Image src={buildImgUrl(product.empresa.logo_url)!} alt={product.empresa.nombre} width={40} height={40} />
                  ) : (
                    product.empresa.nombre.charAt(0)
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate">{product.empresa.nombre}</p>
                  {product.empresa.direccion && (
                    <p className="text-xs text-muted-foreground flex items-center gap-1 truncate">
                      <MapPin size={10} /> {product.empresa.direccion}
                    </p>
                  )}
                </div>
                <Link href={buildEmpresaPath(product.empresa.id, product.empresa.nombre)} className="text-xs text-primary font-medium hover:underline shrink-0">
                  Ver tienda ›
                </Link>
              </div>
            )}

            <ProductActions
              productId={product.id}
              productName={product.nombre}
              whatsappUrl={wa}
              shareUrl={productUrl}
              sitioWeb={product.empresa?.sitio_web ?? null}
              productLink={product.link ?? null}
            />
          </div>
        </div>
      </article>

      <RelatedProducts
        title={
          product.categoria?.nombre
            ? `Más en ${product.categoria.nombre}`
            : 'Productos relacionados'
        }
        products={relatedByCategory}
      />

      {product.empresa && (
        <RelatedProducts
          title={`Más productos de ${product.empresa.nombre}`}
          products={relatedByCompany}
        />
      )}

      <Footer />
    </>
  )
}
