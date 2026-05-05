'use client'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, ExternalLink, MapPin, MessageCircle, Store } from 'lucide-react'
import { useGetProductosQuery } from '@/lib/redux/api/productsApi'
import { ProductCard } from '@/components/products/ProductCard'
import { buildImgUrl } from '@/lib/config'
import { buildWhatsAppURL } from '@/lib/utils'
import type { EmpresaAPI, ProductoAPI } from '@/lib/redux/api/types'

interface Props {
  empresaId: number
  initialEmpresa: EmpresaAPI | null
  initialProducts?: ProductoAPI[]
}

export function CompanyDetailClient({ empresaId, initialEmpresa, initialProducts = [] }: Props) {
  const { data, isLoading, isError } = useGetProductosQuery(
    { limite: 10000, offset: 0 },
    { skip: initialProducts.length > 0 }
  )
  const all = data?.data ?? []
  const fetched = all.filter((p) => p.empresa?.id === empresaId)
  const products = fetched.length > 0 ? fetched : initialProducts
  const empresa = initialEmpresa ?? products[0]?.empresa ?? null

  if (isLoading && !empresa && initialProducts.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="h-40 rounded-2xl bg-muted animate-pulse mb-6" />
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-muted/50 border border-border rounded-2xl animate-pulse aspect-[3/4]" />
          ))}
        </div>
      </div>
    )
  }

  if (!empresa) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-20 text-center">
        <p className="text-lg font-semibold">Empresa no encontrada</p>
        <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-primary mt-6 hover:underline">
          <ArrowLeft size={16} /> Volver al inicio
        </Link>
      </div>
    )
  }

  const banner = buildImgUrl(empresa.banner_url)
  const logo = buildImgUrl(empresa.logo_url)
  const wa = buildWhatsAppURL(empresa.whatsapp_contacto ?? '', `productos de ${empresa.nombre}`)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary mb-4">
        <ArrowLeft size={16} /> Volver
      </Link>

      <section className="relative rounded-2xl border border-border bg-card mb-8">
        <div className="relative w-full h-32 sm:h-44 lg:h-52 rounded-t-2xl overflow-hidden bg-gradient-to-br from-primary/40 via-primary/15 to-muted">
          {banner && (
            <Image src={banner} alt="" fill className="object-cover" priority sizes="100vw" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-card via-card/40 to-transparent" />
        </div>

        <div className="px-4 sm:px-6 pb-5 sm:pb-6 -mt-12 sm:-mt-14 flex flex-col sm:flex-row sm:items-end gap-4">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-background border border-border shadow-lg flex items-center justify-center overflow-hidden shrink-0">
            {logo ? (
              <Image src={logo} alt={empresa.nombre} width={112} height={112} className="object-cover w-full h-full" />
            ) : (
              <Store size={40} className="text-primary" />
            )}
          </div>

          <div className="flex-1 min-w-0 sm:pb-1">
            <h1 className="font-outfit text-2xl sm:text-3xl font-bold leading-tight truncate">{empresa.nombre}</h1>
            {empresa.direccion && (
              <p className="text-xs sm:text-sm text-muted-foreground flex items-center gap-1 mt-1.5">
                <MapPin size={13} className="shrink-0" />
                <span className="truncate">{empresa.direccion}</span>
              </p>
            )}
          </div>

          <div className="flex flex-wrap gap-2 sm:shrink-0 sm:pb-1">
            {empresa.whatsapp_contacto && (
              <a
                href={wa}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 bg-[#25D366] hover:bg-[#1ebe5d] text-white font-semibold rounded-full text-xs sm:text-sm px-4 py-2 transition-colors"
              >
                <MessageCircle size={14} /> WhatsApp
              </a>
            )}
            {empresa.sitio_web && (
              <a
                href={empresa.sitio_web}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 bg-muted hover:bg-muted/70 border border-border text-foreground rounded-full text-xs sm:text-sm px-4 py-2 transition-colors"
              >
                <ExternalLink size={14} /> Sitio web
              </a>
            )}
          </div>
        </div>
      </section>

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg sm:text-xl font-bold">Productos</h2>
        <span className="text-xs sm:text-sm text-muted-foreground">
          {products.length} producto{products.length === 1 ? '' : 's'}
        </span>
      </div>

      {isError && products.length === 0 ? (
        <Empty title="Error al cargar productos" sub="Intentá recargar la página" />
      ) : products.length === 0 ? (
        <Empty title="Esta tienda aún no publicó productos" sub="Volvé pronto." />
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {products.map((p) => <ProductCard key={p.id} product={p} view="grid" />)}
        </div>
      )}
    </div>
  )
}

function Empty({ title, sub }: { title: string; sub: string }) {
  return (
    <div className="text-center py-20 text-muted-foreground">
      <p className="text-lg font-medium text-foreground">{title}</p>
      <p className="text-sm mt-1">{sub}</p>
    </div>
  )
}
