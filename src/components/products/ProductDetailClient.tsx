'use client'
import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, ExternalLink, Heart, MapPin, MessageCircle, Share2 } from 'lucide-react'
import { useRegistrarLeadMutation } from '@/lib/redux/api/productsApi'
import { buildWhatsAppURL, formatPrice } from '@/lib/utils'
import { buildImgUrl } from '@/lib/config'
import type { ProductoAPI } from '@/lib/redux/api/types'

interface Props { slug: string; initialData: ProductoAPI }

export function ProductDetailClient({ initialData }: Props) {
  const [fav, setFav] = useState(false)
  const [registrarLead] = useRegistrarLeadMutation()
  const product = initialData

  if (!product) return null

  const finalPrice = product.es_oferta && product.precio_oferta ? product.precio_oferta : product.precio
  const hasDiscount = product.es_oferta && finalPrice < product.precio
  const discount = hasDiscount ? Math.round(((product.precio - finalPrice) / product.precio) * 100) : 0
  const img = buildImgUrl(product.imagen_principal_url) ?? 'https://placehold.co/600x600/eee/aaa?text=Sin+imagen'
  const wa = buildWhatsAppURL(product.empresa?.whatsapp_contacto ?? '', product.nombre)

  const handleWA = () => registrarLead({ producto_id: product.id, tipo_lead: 'whatsapp' })
  const handleSitio = () => registrarLead({ producto_id: product.id, tipo_lead: 'sitio_web' })

  const handleShare = async () => {
    const url = window.location.href
    if (navigator.share) { try { await navigator.share({ title: product.nombre, url }) } catch {} }
    else await navigator.clipboard.writeText(url)
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
      <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary mb-6">
        <ArrowLeft size={16} /> Volver
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Imagen única — galería deshabilitada (sólo guardamos imagen_principal_url) */}
        <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-muted">
          {discount > 0 && (
            <span className="absolute top-3 left-3 z-10 bg-destructive text-white text-xs font-bold px-2.5 py-1 rounded-full">
              -{discount}%
            </span>
          )}
          <Image src={img} alt={product.nombre} fill className="object-cover" priority sizes="(max-width: 768px) 100vw, 50vw" />
        </div>
        {/*
        // GALERÍA DE THUMBNAILS — comentada hasta tener tabla producto_imagenes.
        <div className="grid grid-cols-4 gap-2 mt-3">{thumbs.map(...)}</div>
        */}

        <div className="flex flex-col gap-5">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-bold text-primary uppercase tracking-wider">
              {product.empresa?.nombre ?? 'Tienda local'}
            </p>
            {product.categoria && (
              <Link
                href={`/categorias/${product.categoria.slug}`}
                className="text-[11px] font-medium text-muted-foreground bg-muted border border-border px-3 py-1 rounded-full hover:text-foreground"
              >
                {product.categoria.nombre}
              </Link>
            )}
          </div>

          <h1 className="font-outfit text-2xl sm:text-3xl font-bold leading-tight">{product.nombre}</h1>

          <div className="flex items-baseline gap-3 flex-wrap">
            <span className={`text-3xl font-bold ${hasDiscount ? 'text-destructive' : 'text-foreground'}`}>
              {formatPrice(finalPrice)}
            </span>
            {hasDiscount && (
              <span className="text-base text-muted-foreground line-through">{formatPrice(product.precio)}</span>
            )}
          </div>

          {product.descripcion && (
            <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">{product.descripcion}</p>
          )}

          {product.empresa && (
            <div className="flex items-center gap-3 bg-muted/40 border border-border rounded-xl p-3">
              <div className="w-10 h-10 rounded-full bg-background border border-border flex items-center justify-center font-bold text-primary shrink-0 overflow-hidden">
                {product.empresa.logo_url
                  ? <Image src={buildImgUrl(product.empresa.logo_url)!} alt={product.empresa.nombre} width={40} height={40} />
                  : product.empresa.nombre.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">{product.empresa.nombre}</p>
                {product.empresa.direccion && (
                  <p className="text-xs text-muted-foreground flex items-center gap-1 truncate">
                    <MapPin size={10} /> {product.empresa.direccion}
                  </p>
                )}
              </div>
              <Link href={`/empresas/${product.empresa.id}`} className="text-xs text-primary font-medium hover:underline shrink-0">
                Ver tienda ›
              </Link>
            </div>
          )}

          <div className="flex gap-3">
            <a
              href={wa}
              onClick={handleWA}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1ebe5d] text-white font-semibold rounded-xl py-3.5 text-sm"
            >
              <MessageCircle size={18} /> Consultar por WhatsApp
            </a>
            <button
              onClick={() => setFav((v) => !v)}
              aria-label="Favorito"
              className={`w-12 h-12 rounded-xl border flex items-center justify-center transition-colors ${
                fav ? 'bg-destructive/10 border-destructive/30 text-destructive' : 'bg-background border-border text-muted-foreground hover:text-destructive'
              }`}
            >
              <Heart size={18} fill={fav ? 'currentColor' : 'none'} />
            </button>
            <button
              onClick={handleShare}
              aria-label="Compartir"
              className="w-12 h-12 rounded-xl bg-background border border-border flex items-center justify-center text-muted-foreground hover:text-primary"
            >
              <Share2 size={18} />
            </button>
          </div>

          {product.empresa?.sitio_web && (
            <a
              href={product.empresa.sitio_web}
              onClick={handleSitio}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center self-start gap-1.5 text-xs font-medium text-muted-foreground hover:text-primary"
            >
              <ExternalLink size={12} /> Ver sitio web
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
