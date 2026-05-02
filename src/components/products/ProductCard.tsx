'use client'
import Image from 'next/image'
import { MessageCircle, Tag } from 'lucide-react'
import { formatPrice, buildWhatsAppURL } from '@/lib/utils'
import { useAppDispatch } from '@/lib/redux/hooks'
import { openModal } from '@/lib/redux/slices/uiSlice'
import { useRegistrarClickMutation, useRegistrarLeadMutation } from '@/lib/redux/api/productsApi'
import { buildImgUrl } from '@/lib/config'
import type { Product } from '@/types'

interface Props { product: Product; view: 'list' | 'grid' }

export function ProductCard({ product, view }: Props) {
  const dispatch = useAppDispatch()
  const [registrarClick] = useRegistrarClickMutation()
  const [registrarLead] = useRegistrarLeadMutation()

  const precio = Number(product.precio) || 0
  const precioOferta = Number(product.precio_oferta) || 0
  const hasOffer = !!product.es_oferta && precioOferta > 0 && precioOferta < precio
  const finalPrice = hasOffer ? precioOferta : precio
  const discount = hasOffer ? Math.round(((precio - finalPrice) / precio) * 100) : 0
  const showPrice = finalPrice > 0
  const wa = product.empresa?.whatsapp_contacto ?? ''
  const img = buildImgUrl(product.imagen_principal_url) ?? 'https://placehold.co/400x400/eee/aaa?text=Sin+imagen'

  const handleOpen = () => {
    registrarClick({ producto_id: product.id })
    dispatch(openModal(product.id))
  }
  const handleWA = (e: React.MouseEvent) => {
    e.stopPropagation()
    registrarLead({ producto_id: product.id, tipo_lead: 'whatsapp' })
  }

  const isGrid = view === 'grid'

  return (
    <article
      role="button"
      tabIndex={0}
      onClick={handleOpen}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && handleOpen()}
      className={`group relative bg-card border border-border rounded-2xl cursor-pointer hover:border-primary/50 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary overflow-hidden ${
        isGrid ? 'flex flex-col' : 'flex gap-4 p-4'
      }`}
    >
      <div className={`relative shrink-0 overflow-hidden bg-muted ${isGrid ? 'w-full aspect-square' : 'w-24 h-24 sm:w-28 sm:h-28 rounded-xl'}`}>
        <Image
          src={img}
          alt={product.nombre}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes={isGrid ? '(max-width: 768px) 50vw, 25vw' : '120px'}
        />
        {discount > 0 && (
          <span className="absolute top-2 left-2 inline-flex items-center gap-1 bg-destructive text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-md">
            <Tag size={10} />
            -{discount}%
          </span>
        )}
        {!showPrice && (
          <span className="absolute bottom-2 left-2 bg-background/90 backdrop-blur text-foreground text-[10px] font-semibold px-2 py-1 rounded-full border border-border">
            Consultar precio
          </span>
        )}
      </div>

      <div className={`flex flex-col flex-1 min-w-0 ${isGrid ? 'p-3' : 'justify-between'}`}>
        <p className="text-[10px] font-semibold text-primary uppercase tracking-wide truncate">
          {product.empresa?.nombre ?? 'Tienda local'}
        </p>
        <h3 className={`font-medium text-foreground line-clamp-2 leading-snug ${isGrid ? 'text-sm mt-1 mb-2 min-h-[2.5rem]' : 'text-sm sm:text-base mt-0.5'}`}>
          {product.nombre}
        </h3>

        <div className={`flex flex-col gap-2 ${isGrid ? 'mt-auto' : 'mt-2'}`}>
          {showPrice ? (
            <div className="flex items-baseline gap-2 flex-wrap">
              <span className={`font-extrabold tracking-tight ${hasOffer ? 'text-destructive' : 'text-foreground'} ${isGrid ? 'text-base sm:text-lg' : 'text-lg'}`}>
                {formatPrice(finalPrice)}
              </span>
              {hasOffer && (
                <span className="text-xs text-muted-foreground line-through">{formatPrice(precio)}</span>
              )}
            </div>
          ) : (
            <span className="text-xs font-medium text-muted-foreground italic">Precio a consultar</span>
          )}
          <a
            href={buildWhatsAppURL(wa, product.nombre)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleWA}
            className="inline-flex items-center justify-center gap-1.5 bg-[#25D366] hover:bg-[#1ebe5d] text-white font-semibold rounded-full text-xs py-2 px-3 shadow-sm hover:shadow transition-all"
          >
            <MessageCircle size={14} />
            Consultar
          </a>
        </div>
      </div>
    </article>
  )
}
