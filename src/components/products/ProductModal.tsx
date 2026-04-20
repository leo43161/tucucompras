'use client'
import { useStore } from '@/lib/store'
import { products, WA_NUMBER } from '@/lib/data'
import { buildWhatsAppURL } from '@/lib/utils'
import { X } from 'lucide-react'

export function ProductModal() {
  const { selectedProductId, closeModal } = useStore()
  const product = products.find((p) => p.id === selectedProductId)

  if (!product) return null

  return (
    <div
      className="fixed inset-0 z-[200] bg-black/50 flex items-center justify-center p-4"
      onClick={closeModal}
    >
      <div
        className="bg-white rounded-2xl max-w-md w-full p-6 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={closeModal} className="absolute top-4 right-4 text-[--text-muted] hover:text-[--text-primary]">
          <X size={20} />
        </button>
        {/* contenido del modal... */}
        <a
          href={buildWhatsAppURL(WA_NUMBER, product.name)}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 flex items-center justify-center gap-2 bg-[#25D366] text-white rounded-xl py-3 font-semibold"
        >
          Consultar por WhatsApp
        </a>
      </div>
    </div>
  )
}