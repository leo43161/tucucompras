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

      <div className="relative w-full h-40 sm:h-56 rounded-2xl overflow-hidden bg-gradient-to-br from-primary/30 via-primary/10 to-muted border border-border mb-6">
        {banner && (
          <Image src={banner} alt={empresa.nombre} fill className="object-cover" priority sizes="100vw" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/30 to-transparent" />
      </div>

      <header className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-16 sm:-mt-20 mb-8 px-2">
        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-background border border-border shadow-md flex items-center justify-center overflow-hidden shrink-0">
          {logo ? (
            <Image src={logo} alt={empresa.nombre} width={96} height={96} className="object-cover" />
          ) : (
            <Store size={32} className="text-primary" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="font-outfit text-2xl sm:text-3xl font-bold leading-tight">{empresa.nombre}</h1>
          {empresa.direccion && (
            <p className="text-xs sm:text-sm text-muted-foreground flex items-center gap-1 mt-1">
              <MapPin size={12} /> {empresa.direccion}
            </p>
          )}
        </div>
        <div className="flex gap-2 shrink-0">
          {empresa.whatsapp_contacto && (
            <a
              href={wa}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 bg-[#25D366] hover:bg-[#1ebe5d] text-white font-semibold rounded-full text-xs px-4 py-2"
            >
              <MessageCircle size={14} /> WhatsApp
            </a>
          )}
          {empresa.sitio_web && (
            <a
              href={empresa.sitio_web}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 bg-muted hover:bg-muted/70 border border-border text-foreground rounded-full text-xs px-4 py-2"
            >
              <ExternalLink size={14} /> Sitio web
            </a>
          )}
        </div>
      </header>

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold">Productos</h2>
        <span className="text-xs text-muted-foreground">
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
