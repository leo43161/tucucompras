// src/components/products/ProductDetailClient.tsx
'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { MessageCircle, Heart, Share2, ArrowLeft, MapPin, ExternalLink } from 'lucide-react'
import { useGetProductoPorSlugQuery, useGetProductosQuery } from '@/lib/redux/api/productsApi'
import { buildWhatsAppURL, formatPrice } from '@/lib/utils'
import type { ProductoAPI } from '@/lib/redux/api/types'

// ── Tipos ───────────────────────────────────────────────────────────────────

interface Props {
  slug: string
  initialData: ProductoAPI
}

// ── Lógica compartida ───────────────────────────────────────────────────────

function getDiscountInfo(product: ProductoAPI) {
  const finalPrice = product.es_oferta && product.precio_oferta ? product.precio_oferta : product.precio
  const hasDiscount = product.es_oferta && finalPrice < product.precio
  const savings = product.precio - finalPrice
  const percentage = hasDiscount ? Math.round((savings / product.precio) * 100) : 0
  
  return { finalPrice, hasDiscount, savings, percentage }
}

// ── Sub-componentes internos ────────────────────────────────────────────────

function Breadcrumb({ product }: { product: ProductoAPI }) {
  return (
    <nav aria-label="Ruta de navegación" className="flex items-center gap-1.5 text-xs text-muted-foreground">
      <Link href="/" className="hover:text-primary transition-colors">
        Inicio
      </Link>
      <span className="text-muted/50">›</span>
      {product.categoria && (
        <>
          <Link
            href={`/categorias/${product.categoria.slug}`}
            className="hover:text-primary transition-colors"
          >
            {product.categoria.nombre}
          </Link>
          <span className="text-muted/50">›</span>
        </>
      )}
      <span className="text-foreground truncate max-w-[200px] font-medium">
        {product.nombre}
      </span>
    </nav>
  )
}

function PriceSection({ product }: { product: ProductoAPI }) {
  const { finalPrice, hasDiscount, savings } = getDiscountInfo(product)

  return (
    <div className="flex items-baseline gap-3 flex-wrap">
      <span
        className={`text-[28px] font-bold leading-none ${
          hasDiscount ? 'text-destructive' : 'text-foreground'
        }`}
      >
        {formatPrice(finalPrice)}
      </span>

      {hasDiscount && (
        <>
          <span className="text-base text-muted-foreground line-through">
            {formatPrice(product.precio)}
          </span>
          <span className="text-xs font-semibold bg-destructive/10 text-destructive px-2 py-0.5 rounded-full">
            Ahorrás {formatPrice(savings)}
          </span>
        </>
      )}
    </div>
  )
}

function CompanyCard({ product }: { product: ProductoAPI }) {
  const empresa = product.empresa
  if (!empresa) return null

  return (
    <div className="flex items-center gap-3 bg-muted/30 rounded-[10px] p-3 border border-border">
      {/* Logo o inicial */}
      <div className="w-10 h-10 rounded-full bg-background border border-border flex items-center justify-center shrink-0 overflow-hidden">
        {empresa.logo_url ? (
          <Image
            src={empresa.logo_url}
            alt={empresa.nombre}
            width={40}
            height={40}
            className="object-cover"
          />
        ) : (
          <span className="text-base font-bold text-primary">
            {empresa.nombre.charAt(0)}
          </span>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-foreground truncate">
          {empresa.nombre}
        </p>
        {empresa.direccion && (
          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5 truncate">
            <MapPin size={10} className="shrink-0" />
            {empresa.direccion}
          </p>
        )}
      </div>

      <Link
        href={`/empresas/${empresa.id}`}
        className="text-xs text-primary font-medium hover:underline whitespace-nowrap shrink-0"
      >
        Ver tienda ›
      </Link>
    </div>
  )
}

function OfferBadge({ percentage }: { percentage: number }) {
  if (percentage <= 0) return null
  return (
    <span className="absolute top-3 left-3 bg-destructive text-white text-[11px] font-bold px-2.5 py-1 rounded-full z-10 shadow-sm">
      {percentage}% OFF
    </span>
  )
}

function ImageGallery({
  mainImage,
  productName,
  discountPercentage,
}: {
  mainImage: string | null
  productName: string
  discountPercentage: number
}) {
  const images = mainImage ? [mainImage, mainImage, mainImage, mainImage] : []
  const [selected, setSelected] = useState(0)
  const placeholder = 'https://placehold.co/600x600/f0f4f8/94a3b8?text=Sin+imagen'

  return (
    <div className="flex flex-col gap-3">
      {/* Imagen principal */}
      <div className="relative w-full aspect-square rounded-[14px] overflow-hidden bg-muted">
        <OfferBadge percentage={discountPercentage} />
        <Image
          src={images[selected] ?? placeholder}
          alt={productName}
          fill
          className="object-cover"
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-2">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setSelected(i)}
              className={`relative aspect-square rounded-[10px] overflow-hidden border-2 transition-colors ${
                selected === i
                  ? 'border-primary'
                  : 'border-transparent hover:border-border'
              }`}
            >
              <Image
                src={img}
                alt={`${productName} vista ${i + 1}`}
                fill
                className="object-cover"
                sizes="80px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function RelatedProducts({
  empresaId,
  currentProductId,
}: {
  empresaId: number
  currentProductId: number
}) {
  const { data, isLoading } = useGetProductosQuery({
    empresa_id: empresaId,
    per_page: 5, // Pedimos 5 para asegurar que queden 4 después de filtrar el actual
  })

  const related = data?.data.filter((p) => p.id !== currentProductId).slice(0, 4) ?? []

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="aspect-[3/4] rounded-[10px] bg-muted/60 animate-pulse border border-border"
          />
        ))}
      </div>
    )
  }

  if (related.length === 0) return null

  return (
    <div className="mt-10">
      <h2 className="text-sm font-semibold text-muted-foreground mb-4 uppercase tracking-wider">
        Más de esta tienda
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {related.map((p) => {
          const { finalPrice, hasDiscount, percentage } = getDiscountInfo(p)

          return (
            <Link
              key={p.id}
              href={`/productos/${p.slug}`}
              className="group flex flex-col bg-card rounded-[12px] border border-border p-2.5 hover:shadow-md hover:border-primary/40 transition-all"
            >
              <div className="relative w-full aspect-square rounded-[8px] overflow-hidden bg-muted mb-2">
                <Image
                  src={p.imagen_principal_url ?? 'https://placehold.co/200x200'}
                  alt={p.nombre}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="150px"
                />
                {hasDiscount && percentage > 0 && (
                  <span className="absolute top-1.5 left-1.5 bg-destructive text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full shadow-sm">
                    {percentage}% OFF
                  </span>
                )}
              </div>
              <p className="text-[12px] font-medium text-foreground line-clamp-2 leading-snug mb-1 flex-1">
                {p.nombre}
              </p>
              <p className={`text-[13px] font-bold mt-auto ${hasDiscount ? 'text-destructive' : 'text-foreground'}`}>
                {formatPrice(finalPrice)}
              </p>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

function ProductDetailSkeleton() {
  return (
    <div className="max-w-[1100px] mx-auto px-4 py-6 animate-pulse">
      <div className="h-4 w-48 bg-muted rounded mb-6" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
        <div className="aspect-square rounded-[14px] bg-muted/60 border border-border" />
        <div className="flex flex-col gap-5">
          <div className="flex justify-between">
            <div className="h-4 w-24 bg-muted rounded" />
            <div className="h-6 w-20 bg-muted rounded-full" />
          </div>
          <div className="h-8 w-3/4 bg-muted rounded" />
          <div className="h-10 w-40 bg-muted rounded" />
          <div className="border-t border-border my-2" />
          <div className="space-y-2">
            <div className="h-4 w-full bg-muted rounded" />
            <div className="h-4 w-full bg-muted rounded" />
            <div className="h-4 w-2/3 bg-muted rounded" />
          </div>
          <div className="h-16 w-full bg-muted/60 rounded-[10px] mt-2" />
          <div className="h-12 w-full bg-muted rounded-[12px] mt-4" />
        </div>
      </div>
    </div>
  )
}

// ── Componente principal ────────────────────────────────────────────────────

export function ProductDetailClient({ slug, initialData }: Props) {
  const [isFavorite, setIsFavorite] = useState(false)

  const { data: product = initialData, isLoading } = useGetProductoPorSlugQuery(slug, {
    skip: false,
  })

  if (isLoading && !initialData) {
    return <ProductDetailSkeleton />
  }

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center text-muted-foreground">
        <p className="text-xl font-semibold text-foreground">Producto no encontrado</p>
        <p className="text-sm mt-2 max-w-sm">El producto que buscas ya no existe o fue eliminado por el vendedor.</p>
        <Link
          href="/"
          className="mt-6 inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-full text-sm font-medium hover:opacity-90 transition-opacity"
        >
          <ArrowLeft size={16} />
          Volver al inicio
        </Link>
      </div>
    )
  }

  const whatsappURL = buildWhatsAppURL(
    product.empresa?.whatsapp_contacto ?? '',
    product.nombre
  )

  const handleShare = async () => {
    const url = window.location.href
    if (navigator.share) {
      try {
        await navigator.share({ title: product.nombre, url })
      } catch (err) {
        console.log('Error compartiendo', err)
      }
    } else {
      await navigator.clipboard.writeText(url)
    }
  }

  const { percentage: discountPercentage } = getDiscountInfo(product)

  return (
    <div className="max-w-[1100px] mx-auto px-4 sm:px-6 py-6">

      {/* Navegación de vuelta */}
      <div className="flex items-center justify-between mb-6">
        <Link
          href="/"
          className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
        >
          <ArrowLeft size={16} />
          Volver
        </Link>
        <Breadcrumb product={product} />
      </div>

      {/* Layout principal */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">

        {/* Columna izquierda — imágenes */}
        <ImageGallery
          mainImage={product.imagen_principal_url}
          productName={product.nombre}
          discountPercentage={discountPercentage}
        />

        {/* Columna derecha — info del producto */}
        <div className="flex flex-col gap-6">

          {/* Marca y categoría */}
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-bold text-primary uppercase tracking-wider">
              {product.empresa?.nombre ?? 'Tienda local'}
            </p>
            {product.categoria && (
              <Link
                href={`/categorias/${product.categoria.slug}`}
                className="text-[11px] font-medium text-muted-foreground bg-muted border border-border px-3 py-1 rounded-full hover:border-primary/50 hover:text-foreground transition-all"
              >
                {product.categoria.nombre}
              </Link>
            )}
          </div>

          {/* Nombre */}
          <h1 className="font-outfit text-2xl sm:text-3xl font-bold text-foreground leading-tight">
            {product.nombre}
          </h1>

          {/* Precio */}
          <PriceSection product={product} />

          <div className="border-t border-border" />

          {/* Descripción */}
          {product.descripcion && (
            <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
              {product.descripcion}
            </p>
          )}

          {/* Tarjeta de empresa */}
          <CompanyCard product={product} />

          {/* CTAs */}
          <div className="flex gap-3 mt-2">
            {/* WhatsApp */}
            <a
              href={whatsappURL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1ebe5d] text-white font-semibold rounded-xl py-3.5 text-sm transition-all shadow-sm"
            >
              <MessageCircle size={18} />
              Consultar por WhatsApp
            </a>

            {/* Favorito */}
            <button
              onClick={() => setIsFavorite((v) => !v)}
              aria-label={isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
              className={`w-[50px] h-[50px] shrink-0 rounded-xl border flex items-center justify-center transition-all ${
                isFavorite
                  ? 'bg-destructive/10 border-destructive/30 text-destructive'
                  : 'bg-background border-border text-muted-foreground hover:text-destructive hover:border-destructive/30'
              }`}
            >
              <Heart size={20} fill={isFavorite ? 'currentColor' : 'none'} className={isFavorite ? "scale-110 transition-transform" : ""} />
            </button>

            {/* Compartir */}
            <button
              onClick={handleShare}
              aria-label="Compartir producto"
              className="w-[50px] h-[50px] shrink-0 rounded-xl bg-background border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/50 transition-all"
            >
              <Share2 size={20} />
            </button>
          </div>

          {/* Sitio web */}
          {product.empresa?.sitio_web && (
            <a
              href={product.empresa.sitio_web}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center self-start gap-1.5 text-xs font-medium text-muted-foreground hover:text-primary transition-colors mt-1"
            >
              <ExternalLink size={12} />
              Ver sitio web oficial
            </a>
          )}

        </div>
      </div>

      {/* Productos relacionados */}
      {product.empresa_id && (
        <RelatedProducts
          empresaId={product.empresa_id}
          currentProductId={product.id}
        />
      )}

    </div>
  )
}