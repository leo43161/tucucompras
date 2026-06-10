// src/lib/schema.ts
// Builders de datos estructurados (schema.org / JSON-LD).
// Solo usan campos reales de la API: no se inventan reseñas, ratings, stock ni horarios.
// JSON.stringify descarta las claves `undefined`, así que se pueden setear sin ensuciar la salida.
import { buildImgUrl } from '@/lib/config'
import { SITE_URL, buildEmpresaPath, buildProductPath, formatPrice, normalizePhoneAR } from '@/lib/utils'
import type { EmpresaAPI, ProductoAPI } from '@/lib/redux/api/types'

/** @id estables para enlazar nodos entre distintos scripts de una misma página. */
export const ORG_ID = `${SITE_URL}/#organization`
export const WEBSITE_ID = `${SITE_URL}/#website`

const ORG_PHONE = '+5493816527629'
const LOGO_URL = `${SITE_URL}/android-chrome-512x512.png`

/** Precio efectivo de un producto (oferta válida o precio normal). 0 = a consultar. */
export function offerPrice(p: Pick<ProductoAPI, 'precio' | 'precio_oferta' | 'es_oferta'>): number {
  const precio = Number(p.precio) || 0
  const oferta = Number(p.precio_oferta) || 0
  return !!p.es_oferta && oferta > 0 && oferta < precio ? oferta : precio
}

/** Fecha (YYYY-MM-DD) a ~1 año vista, recomendada por Google para `Offer.priceValidUntil`. */
function priceValidUntil(): string {
  const d = new Date()
  d.setFullYear(d.getFullYear() + 1)
  return d.toISOString().slice(0, 10)
}

function postalAddress(direccion: string) {
  return {
    '@type': 'PostalAddress',
    streetAddress: direccion,
    addressLocality: 'San Miguel de Tucumán',
    addressRegion: 'Tucumán',
    addressCountry: 'AR',
  }
}

export function empresaSchemaId(empresa: Pick<EmpresaAPI, 'id' | 'nombre'>): string {
  return `${SITE_URL}${buildEmpresaPath(empresa.id, empresa.nombre)}#store`
}

export function productSchemaId(product: Pick<ProductoAPI, 'id' | 'nombre'>): string {
  return `${SITE_URL}${buildProductPath(product.id, product.nombre)}#product`
}

/** Referencia liviana a la tienda vendedora dentro de un `Offer`. */
function sellerRef(empresa: EmpresaAPI) {
  return {
    '@type': 'Store',
    '@id': empresaSchemaId(empresa),
    name: empresa.nombre,
    url: empresa.sitio_web || `${SITE_URL}${buildEmpresaPath(empresa.id, empresa.nombre)}`,
    telephone: empresa.whatsapp_contacto ? `+${normalizePhoneAR(empresa.whatsapp_contacto)}` : undefined,
    image: buildImgUrl(empresa.logo_url) ?? undefined,
    address: empresa.direccion ? postalAddress(empresa.direccion) : undefined,
  }
}

/**
 * Nodo `Product`. Si `withContext` es true se incluye `@context` (uso como script raíz);
 * sin él sirve como item anidado dentro de un ItemList/OfferCatalog.
 * Omite `offers` cuando el precio es 0 (producto "a consultar"): emitir price 0 es engañoso.
 */
export function buildProductLd(product: ProductoAPI, opts: { withContext?: boolean } = {}) {
  const path = buildProductPath(product.id, product.nombre)
  const url = `${SITE_URL}${path}`
  const img = buildImgUrl(product.imagen_principal_url)
  const price = offerPrice(product)
  const empresa = product.empresa

  return {
    ...(opts.withContext ? { '@context': 'https://schema.org' } : {}),
    '@type': 'Product',
    '@id': productSchemaId(product),
    name: product.nombre,
    url,
    description:
      product.descripcion?.trim() ||
      `${product.nombre} disponible en ${empresa?.nombre ?? 'TucuCompras'}, Tucumán. Consultá y comprá directo por WhatsApp.`,
    sku: String(product.id),
    image: img ? [img] : undefined,
    category: product.categoria?.nombre || undefined,
    keywords: product.sub_categorias?.length
      ? product.sub_categorias.map((s) => s.nombre).join(', ')
      : undefined,
    brand: empresa?.nombre ? { '@type': 'Brand', name: empresa.nombre } : undefined,
    offers:
      price > 0
        ? {
            '@type': 'Offer',
            url,
            priceCurrency: 'ARS',
            price,
            priceValidUntil: priceValidUntil(),
            availability: 'https://schema.org/InStock',
            itemCondition: 'https://schema.org/NewCondition',
            areaServed: 'Tucumán, Argentina',
            seller: empresa ? sellerRef(empresa) : undefined,
          }
        : undefined,
  }
}

/**
 * Nodo `Store` para la página de empresa. Enriquecido con datos reales:
 * priceRange calculado de su catálogo, CUIT (taxID), sitio web (sameAs) y OfferCatalog.
 */
export function buildStoreLd(empresa: EmpresaAPI, products: ProductoAPI[] = []) {
  const path = buildEmpresaPath(empresa.id, empresa.nombre)
  const url = `${SITE_URL}${path}`
  const prices = products.map(offerPrice).filter((n) => n > 0)
  const priceRange = prices.length
    ? `${formatPrice(Math.min(...prices))} - ${formatPrice(Math.max(...prices))}`
    : undefined

  return {
    '@context': 'https://schema.org',
    '@type': 'Store',
    '@id': empresaSchemaId(empresa),
    name: empresa.nombre,
    url: empresa.sitio_web || url,
    mainEntityOfPage: url,
    image: buildImgUrl(empresa.banner_url) ?? buildImgUrl(empresa.logo_url) ?? undefined,
    logo: buildImgUrl(empresa.logo_url) ?? undefined,
    telephone: empresa.whatsapp_contacto ? `+${normalizePhoneAR(empresa.whatsapp_contacto)}` : undefined,
    description: `Catálogo de ${empresa.nombre} en Tucumán.${
      products.length ? ` ${products.length} productos disponibles.` : ''
    } Consultá y comprá directo por WhatsApp.`,
    address: empresa.direccion ? postalAddress(empresa.direccion) : undefined,
    geo:
      empresa.latitud && empresa.longitud
        ? { '@type': 'GeoCoordinates', latitude: empresa.latitud, longitude: empresa.longitud }
        : undefined,
    areaServed: { '@type': 'AdministrativeArea', name: 'Tucumán, Argentina' },
    currenciesAccepted: 'ARS',
    priceRange,
    taxID: empresa.cuit || undefined,
    sameAs: empresa.sitio_web ? [empresa.sitio_web] : undefined,
    parentOrganization: { '@id': ORG_ID },
    hasOfferCatalog: products.length
      ? {
          '@type': 'OfferCatalog',
          name: `Productos de ${empresa.nombre}`,
          itemListElement: products.slice(0, 50).map((p) => {
            const price = offerPrice(p)
            return {
              '@type': 'Offer',
              ...(price > 0 ? { price, priceCurrency: 'ARS' } : {}),
              itemOffered: {
                '@type': 'Product',
                '@id': productSchemaId(p),
                name: p.nombre,
                url: `${SITE_URL}${buildProductPath(p.id, p.nombre)}`,
                image: buildImgUrl(p.imagen_principal_url) ?? undefined,
              },
            }
          }),
        }
      : undefined,
  }
}

export function buildBreadcrumbLd(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      item: it.url,
    })),
  }
}

/** Organization + WebSite del sitio, en un `@graph`. Se inyecta una vez en el layout raíz. */
export function siteGraphLd() {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': ORG_ID,
        name: 'TucuCompras',
        url: SITE_URL,
        logo: LOGO_URL,
        image: LOGO_URL,
        description:
          'Catálogo de productos de empresas y tiendas locales de Tucumán, Argentina. Consultá y comprá directo por WhatsApp.',
        areaServed: { '@type': 'AdministrativeArea', name: 'Tucumán, Argentina' },
        contactPoint: {
          '@type': 'ContactPoint',
          contactType: 'customer service',
          telephone: ORG_PHONE,
          availableLanguage: ['es'],
        },
      },
      {
        '@type': 'WebSite',
        '@id': WEBSITE_ID,
        url: SITE_URL,
        name: 'TucuCompras',
        inLanguage: 'es-AR',
        description: 'Catálogo local de Tucumán.',
        publisher: { '@id': ORG_ID },
      },
    ],
  }
}

/** Pequeño helper para serializar e inyectar de forma consistente. */
export function ldScript(data: unknown): string {
  return JSON.stringify(data)
}
