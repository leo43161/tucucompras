'use client'
 
import Image from 'next/image'
import { MessageCircle } from 'lucide-react'
import { formatPrice, getDiscountedPrice } from '@/lib/utils'
import { buildWhatsAppURL } from '@/lib/utils'
import { useStore } from '@/lib/store'
import { WA_NUMBER } from '@/lib/data'
import type { Product } from '@/types'
 
interface Props {
  product: Product
  view: 'list' | 'grid'
}
 
// ── Sub-componentes internos ────────────────────────────────────────────────
 
function PriceBlock({
  price,
  discPrice,
  sale,
}: {
  price: number
  discPrice: number
  sale: boolean
}) {
  if (sale) {
    return (
      <div className="flex flex-col">
        <span className="text-xs text-[--text-muted] line-through leading-none">
          {formatPrice(price)}
        </span>
        <span className="text-lg font-bold text-[--accent-red] leading-tight">
          {formatPrice(discPrice)}
        </span>
      </div>
    )
  }
  return (
    <span className="text-lg font-bold text-[--text-primary]">{formatPrice(price)}</span>
  )
}
 
function ConsultButton({
  productName,
  compact = false,
}: {
  productName: string
  compact?: boolean
}) {
  return (
    <a
      href={buildWhatsAppURL(WA_NUMBER, productName)}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(e) => e.stopPropagation()}
      className={`flex items-center gap-1.5 bg-[#25D366] hover:bg-[#1ebe5d] text-white font-semibold rounded-full transition-colors ${
        compact ? 'text-[11px] px-3 py-1.5' : 'text-[13px] px-4 py-2'
      }`}
    >
      <MessageCircle size={compact ? 13 : 15} />
      Consultar
    </a>
  )
}
 
export function ProductCard({ product, view }: Props) {
  const openModal = useStore((s) => s.openModal)
  const discPrice = getDiscountedPrice(product.price)

  if (view === 'list') {
    return (
      <article
        onClick={() => openModal(product.id)}
        className="flex gap-4 bg-white rounded-[14px] border border-[--border] p-4 cursor-pointer hover:shadow-md transition-shadow"
      >
        {/* imagen */}
        <div className="relative w-[120px] h-[120px] rounded-[10px] overflow-hidden shrink-0">
          <Image src={product.img} alt={product.name} fill className="object-cover" />
          {product.sale && (
            <span className="absolute top-2 left-2 bg-[--accent-red] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
              15% OFF
            </span>
          )}
        </div>
        {/* info */}
        <div className="flex flex-col flex-1 justify-between">
          <div>
            <p className="text-[11px] font-semibold text-[--tucu-blue] uppercase tracking-wide">{product.brand}</p>
            <h3 className="text-[15px] font-semibold text-[--text-primary] mt-1 line-clamp-2">{product.name}</h3>
            <p className="text-[13px] text-[--text-secondary] mt-1 line-clamp-2">{product.desc}</p>
          </div>
          <div className="flex items-center justify-between mt-3">
            <PriceBlock price={product.price} discPrice={discPrice} sale={product.sale} />
            <ConsultButton productName={product.name} />
          </div>
        </div>
      </article>
    )
  }

  // vista grid...
}