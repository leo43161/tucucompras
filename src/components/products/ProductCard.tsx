'use client'
import { useState } from 'react'
import Image from 'next/image'
import { MessageCircle, Heart, Flame, Store } from 'lucide-react'
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
  const [fav, setFav] = useState(false)

  const precio = Number(product.precio) || 0
  const precioOferta = Number(product.precio_oferta) || 0
  const hasOffer = !!product.es_oferta && precioOferta > 0 && precioOferta < precio
  const finalPrice = hasOffer ? precioOferta : precio
  const discount = hasOffer ? Math.round(((precio - finalPrice) / precio) * 100) : 0
  const showPrice = finalPrice > 0
  const wa = product.empresa?.whatsapp_contacto ?? ''
  const img = buildImgUrl(product.imagen_principal_url) ?? 'https://placehold.co/600x600/e5e7eb/9ca3af?text=Sin+imagen'

  const handleOpen = () => {
    registrarClick({ producto_id: product.id })
    dispatch(openModal(product.id))
  }
  const handleWA = (e: React.MouseEvent) => {
    e.stopPropagation()
    registrarLead({ producto_id: product.id, tipo_lead: 'whatsapp' })
  }
  const toggleFav = (e: React.MouseEvent) => { e.stopPropagation(); setFav((v) => !v) }

  const isGrid = view === 'grid'

  if (!isGrid) {
    return (
      <article
        role="button"
        tabIndex={0}
        onClick={handleOpen}
        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && handleOpen()}
        className="group relative flex gap-4 p-3 sm:p-4 bg-card border border-border rounded-2xl cursor-pointer hover:border-primary/60 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        <div className="relative shrink-0 w-28 h-28 sm:w-32 sm:h-32 rounded-xl overflow-hidden bg-muted">
          <Image
            src={img}
            alt={product.nombre}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
            sizes="140px"
          />
          {discount > 0 && (
            <span className="absolute top-1.5 left-1.5 inline-flex items-center gap-0.5 bg-gradient-to-r from-rose-500 to-red-600 text-white text-[10px] font-black px-1.5 py-0.5 rounded-md shadow">
              -{discount}%
            </span>
          )}
        </div>

        <div className="flex flex-col flex-1 min-w-0 justify-between gap-2">
          <div className="min-w-0">
            <p className="font-outfit text-[10px] font-bold text-primary uppercase tracking-[0.12em] truncate inline-flex items-center gap-1">
              <Store size={10} /> {product.empresa?.nombre ?? 'Tienda local'}
            </p>
            <h3 className="font-outfit font-semibold text-foreground line-clamp-2 leading-tight text-sm sm:text-base mt-1">
              {product.nombre}
            </h3>
          </div>

          <div className="flex items-end justify-between gap-3 flex-wrap">
            {showPrice ? (
              <div className="flex flex-col">
                {hasOffer && (
                  <span className="text-[11px] text-muted-foreground line-through leading-none">{formatPrice(precio)}</span>
                )}
                <span className={`font-outfit font-extrabold tracking-tight leading-none mt-0.5 ${hasOffer ? 'text-rose-600 dark:text-rose-400 text-xl' : 'text-foreground text-lg'}`}>
                  {formatPrice(finalPrice)}
                </span>
              </div>
            ) : (
              <span className="text-xs font-semibold text-muted-foreground italic">Precio a consultar</span>
            )}
            <a
              href={buildWhatsAppURL(wa, product.nombre)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleWA}
              className="inline-flex items-center justify-center gap-1.5 bg-gradient-to-br from-[#25D366] to-[#128C7E] hover:from-[#1ebe5d] hover:to-[#0f6f64] text-white font-bold rounded-full text-xs py-2 px-4 shadow-md shadow-emerald-500/20 hover:shadow-lg transition-all"
            >
              <MessageCircle size={14} />
              Consultar
            </a>
          </div>
        </div>
      </article>
    )
  }

  // GRID VARIANT — premium
  return (
    <article
      role="button"
      tabIndex={0}
      onClick={handleOpen}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && handleOpen()}
      className="group relative flex flex-col bg-card border border-border rounded-3xl cursor-pointer hover:border-primary/60 hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary overflow-hidden"
    >
      {/* IMAGEN */}
      <div className="relative w-full aspect-square overflow-hidden bg-gradient-to-br from-muted via-muted/60 to-muted">
        <Image
          src={img}
          alt={product.nombre}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />

        {/* Gradient overlay sutil al hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Badge de descuento */}
        {discount > 0 && (
          <div className="shine-on-hover absolute top-3 left-3 inline-flex items-center gap-1 bg-gradient-to-r from-rose-500 via-red-500 to-orange-500 text-white text-xs font-black uppercase px-2.5 py-1 rounded-full shadow-lg shadow-rose-500/40 ring-1 ring-white/20">
            <Flame size={12} className="drop-shadow" />
            -{discount}%
          </div>
        )}

        {/* Botón favorito */}
        <button
          type="button"
          onClick={toggleFav}
          aria-label={fav ? 'Quitar de favoritos' : 'Agregar a favoritos'}
          aria-pressed={fav}
          className={`absolute top-3 right-3 w-9 h-9 rounded-full backdrop-blur-md border flex items-center justify-center transition-all ${
            fav
              ? 'bg-rose-500/90 border-rose-300/60 text-white scale-105'
              : 'bg-background/70 border-white/30 text-foreground/70 hover:bg-background hover:text-rose-500 hover:scale-110'
          }`}
        >
          <Heart size={16} fill={fav ? 'currentColor' : 'none'} strokeWidth={2.5} />
        </button>

        {/* Badge "Sin precio" */}
        {!showPrice && (
          <span className="absolute bottom-3 left-3 bg-background/95 backdrop-blur text-foreground text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full border border-border shadow-sm">
            Consultar precio
          </span>
        )}

        {/* Empresa pill (aparece en hover) */}
        <div className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 bg-background/90 backdrop-blur-md border border-border rounded-full px-2.5 py-1 max-w-[60%] opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
          <Store size={11} className="text-primary shrink-0" />
          <span className="text-[10px] font-semibold text-foreground truncate">
            {product.empresa?.nombre ?? 'Tienda local'}
          </span>
        </div>
      </div>

      {/* BODY */}
      <div className="flex flex-col flex-1 p-4 gap-2.5">
        {/* Categoría / empresa header */}
        <div className="flex items-center justify-between gap-2">
          <p className="font-outfit text-[10px] font-extrabold text-primary uppercase tracking-[0.14em] truncate">
            {product.categoria?.nombre ?? product.empresa?.nombre ?? 'Tienda local'}
          </p>
          {hasOffer && (
            <span className="font-outfit text-[10px] font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider shrink-0">
              ¡Oferta!
            </span>
          )}
        </div>

        {/* Título */}
        <h3 className="font-outfit font-semibold text-foreground line-clamp-2 leading-tight text-base sm:text-[17px] min-h-[2.6rem]">
          {product.nombre}
        </h3>

        {/* Sub-categorías como tags */}
        {!!product.sub_categorias?.length && (
          <div className="flex flex-wrap gap-1">
            {product.sub_categorias.slice(0, 2).map((s) => (
              <span
                key={s.id}
                className="text-[10px] font-medium bg-muted/70 text-muted-foreground border border-border/60 rounded-full px-2 py-0.5"
              >
                {s.nombre}
              </span>
            ))}
          </div>
        )}

        <div className="mt-auto pt-2 flex flex-col gap-2.5">
          {/* PRECIO */}
          {showPrice ? (
            <div className="flex items-end justify-between gap-2 flex-wrap">
              <div className="flex flex-col leading-none">
                {hasOffer && (
                  <span className="text-xs text-muted-foreground line-through">{formatPrice(precio)}</span>
                )}
                <span
                  className={`font-outfit font-black tracking-tight mt-0.5 ${
                    hasOffer
                      ? 'text-2xl bg-gradient-to-r from-rose-600 to-orange-500 bg-clip-text text-transparent'
                      : 'text-2xl text-foreground'
                  }`}
                >
                  {formatPrice(finalPrice)}
                </span>
              </div>
              {hasOffer && discount > 0 && (
                <span className="text-[10px] font-black uppercase bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/30 rounded-md px-2 py-1">
                  Ahorrás {formatPrice(precio - finalPrice)}
                </span>
              )}
            </div>
          ) : (
            <p className="font-outfit text-base font-bold text-muted-foreground italic">
              Precio a consultar
            </p>
          )}

          {/* CTA WhatsApp */}
          <a
            href={buildWhatsAppURL(wa, product.nombre)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleWA}
            className="relative overflow-hidden inline-flex items-center justify-center gap-2 bg-gradient-to-br from-[#25D366] via-[#1ebe5d] to-[#128C7E] hover:from-[#1ebe5d] hover:to-[#0f6f64] text-white font-bold rounded-xl text-sm py-2.5 px-3 shadow-md shadow-emerald-500/25 hover:shadow-lg hover:shadow-emerald-500/40 transition-all active:scale-[0.98]"
          >
            <MessageCircle size={16} strokeWidth={2.5} />
            Consultar por WhatsApp
          </a>
        </div>
      </div>
    </article>
  )
}
