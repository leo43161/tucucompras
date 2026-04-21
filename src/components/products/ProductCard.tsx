// src/components/products/ProductCard.tsx
'use client'

import Image from 'next/image'
import { MessageCircle } from 'lucide-react'
import { formatPrice, buildWhatsAppURL } from '@/lib/utils'
import { useAppDispatch } from '@/lib/redux/hooks'
import { openModal } from '@/lib/redux/slices/uiSlice'
import type { Product } from '@/types'

interface Props {
  product: Product
  view: 'list' | 'grid'
}

function PriceBlock({
  price,
  discPrice,
  sale,
  isGrid = false,
}: {
  price: number
  discPrice: number
  sale: boolean
  isGrid?: boolean
}) {
  if (sale) {
    return (
      <div className="flex flex-col">
        <span className="text-xs text-muted-foreground line-through leading-none">
          {formatPrice(price)}
        </span>
        <span className={`font-bold text-destructive leading-tight ${isGrid ? 'text-base' : 'text-lg'}`}>
          {formatPrice(discPrice)}
        </span>
      </div>
    )
  }
  return (
    <span className={`font-bold text-foreground ${isGrid ? 'text-base' : 'text-lg'}`}>
      {formatPrice(price)}
    </span>
  )
}

function ConsultButton({
  productName,
  whatsapp,
  compact = false,
}: {
  productName: string
  whatsapp: string
  compact?: boolean
}) {
  return (
    <a
      href={buildWhatsAppURL(whatsapp, productName)}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(e) => e.stopPropagation()}
      className={`flex items-center justify-center gap-1.5 bg-[#25D366] hover:bg-[#1ebe5d] text-white font-semibold rounded-full transition-colors ${
        compact ? 'text-[11px] px-3 py-1.5 w-full mt-2' : 'text-[13px] px-4 py-2'
      }`}
      aria-label={`Consultar por ${productName} en WhatsApp`}
    >
      <MessageCircle size={compact ? 13 : 15} />
      {compact ? 'Consultar' : 'Consultar por WA'}
    </a>
  )
}

export function ProductCard({ product, view }: Props) {
  const dispatch = useAppDispatch()
  
  // Lógica de precios segura
  const finalPrice = product.es_oferta && product.precio_oferta ? product.precio_oferta : product.precio
  const whatsapp = product.empresa?.whatsapp_contacto ?? '5493815550000'
  
  // Cálculo real del porcentaje de descuento
  const hasRealDiscount = product.es_oferta && finalPrice < product.precio
  const discountPercentage = hasRealDiscount 
    ? Math.round(((product.precio - finalPrice) / product.precio) * 100) 
    : 0

  const handleCardClick = () => {
    console.log('Click en tarjeta de producto:', product.id)
    dispatch(openModal(product.id))}

  if (view === 'list') {
    return (
      <article
        role="button"
        tabIndex={0}
        onClick={handleCardClick}
        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && handleCardClick()}
        className="group flex gap-4 bg-card rounded-2xl border border-border p-4 cursor-pointer hover:shadow-md hover:border-primary/40 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        {/* Imagen */}
        <div className="relative w-[100px] h-[100px] sm:w-[120px] sm:h-[120px] rounded-xl overflow-hidden shrink-0 bg-muted">
          <Image
            src={product.imagen_principal_url ?? 'https://placehold.co/120x120'}
            alt={`Imagen de ${product.nombre}`}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {hasRealDiscount && discountPercentage > 0 && (
            <span className="absolute top-2 left-2 bg-destructive text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
              {discountPercentage}% OFF
            </span>
          )}
        </div>

        {/* Info */}
        <div className="flex flex-col flex-1 justify-between py-0.5">
          <div>
            <p className="text-[10px] sm:text-[11px] font-bold text-primary uppercase tracking-wider">
              {product.empresa?.nombre ?? 'Tienda local'}
            </p>
            <h3 className="text-sm sm:text-base font-semibold text-foreground mt-0.5 line-clamp-2 leading-snug">
              {product.nombre}
            </h3>
            <p className="text-xs text-muted-foreground mt-1 line-clamp-2 hidden sm:-webkit-box">
              {product.descripcion}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mt-2 gap-2 sm:gap-0">
            <PriceBlock
              price={product.precio}
              discPrice={finalPrice}
              sale={hasRealDiscount}
            />
            <div className="self-start sm:self-end">
              <ConsultButton productName={product.nombre} whatsapp={whatsapp} />
            </div>
          </div>
        </div>
      </article>
    )
  }

  // Vista grid
  return (
    <article
      role="button"
      tabIndex={0}
      onClick={handleCardClick}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && handleCardClick()}
      className="group flex flex-col bg-card rounded-2xl border border-border p-3 cursor-pointer hover:shadow-md hover:border-primary/40 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary h-full"
    >
      {/* Imagen */}
      <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-muted mb-3">
        <Image
          src={product.imagen_principal_url ?? 'https://placehold.co/200x200'}
          alt={`Imagen de ${product.nombre}`}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />
        {hasRealDiscount && discountPercentage > 0 && (
          <span className="absolute top-2 left-2 bg-destructive text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm z-10">
            {discountPercentage}% OFF
          </span>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-col flex-1">
        <p className="text-[10px] font-bold text-primary uppercase tracking-wider truncate">
          {product.empresa?.nombre ?? 'Tienda'}
        </p>
        <h3 className="text-[13px] sm:text-sm font-semibold text-foreground mt-1 line-clamp-2 leading-tight mb-2 flex-1">
          {product.nombre}
        </h3>
        
        <div className="mt-auto flex flex-col gap-1.5">
          <PriceBlock
            price={product.precio}
            discPrice={finalPrice}
            sale={hasRealDiscount}
            isGrid
          />
          <ConsultButton productName={product.nombre} whatsapp={whatsapp} compact />
        </div>
      </div>
    </article>
  )
}