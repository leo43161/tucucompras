'use client'
import { useState } from 'react'
import { ExternalLink, Heart, MessageCircle, Share2 } from 'lucide-react'
import {
  useRegistrarLeadMutation,
  useRegistrarClickMutation,
} from '@/lib/redux/api/productsApi'

interface Props {
  productId: number
  productName: string
  whatsappUrl: string
  shareUrl: string
  sitioWeb?: string | null
}

export function ProductActions({ productId, productName, whatsappUrl, shareUrl, sitioWeb }: Props) {
  const [fav, setFav] = useState(false)
  const [registrarLead] = useRegistrarLeadMutation()
  const [registrarClick] = useRegistrarClickMutation()

  const handleWA = () => {
    registrarClick({ producto_id: productId })
    registrarLead({ producto_id: productId, tipo_lead: 'whatsapp' })
  }
  const handleSitio = () => registrarLead({ producto_id: productId, tipo_lead: 'sitio_web' })
  const handleShare = async () => {
    try {
      if (typeof navigator !== 'undefined' && navigator.share) {
        await navigator.share({ title: productName, url: shareUrl })
      } else if (typeof navigator !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText(shareUrl)
      }
    } catch {}
  }

  return (
    <>
      <div className="flex gap-3">
        <a
          href={whatsappUrl}
          onClick={handleWA}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1ebe5d] text-white font-semibold rounded-xl py-3.5 text-sm"
        >
          <MessageCircle size={18} /> Consultar por WhatsApp
        </a>
        <button
          type="button"
          onClick={() => setFav((v) => !v)}
          aria-label="Favorito"
          aria-pressed={fav}
          className={`w-12 h-12 rounded-xl border flex items-center justify-center transition-colors ${
            fav ? 'bg-destructive/10 border-destructive/30 text-destructive' : 'bg-background border-border text-muted-foreground hover:text-destructive'
          }`}
        >
          <Heart size={18} fill={fav ? 'currentColor' : 'none'} />
        </button>
        <button
          type="button"
          onClick={handleShare}
          aria-label="Compartir"
          className="w-12 h-12 rounded-xl bg-background border border-border flex items-center justify-center text-muted-foreground hover:text-primary"
        >
          <Share2 size={18} />
        </button>
      </div>

      {sitioWeb && (
        <a
          href={sitioWeb}
          onClick={handleSitio}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center self-start gap-1.5 text-xs font-medium text-muted-foreground hover:text-primary"
        >
          <ExternalLink size={12} /> Ver sitio web
        </a>
      )}
    </>
  )
}
