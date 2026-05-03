'use client'
import { useEffect } from 'react'
import { useAppSelector, useAppDispatch } from '@/lib/redux/hooks'
import { closeModal } from '@/lib/redux/slices/uiSlice'
import { ProductDetailClient } from './ProductDetailClient'
import { X } from 'lucide-react'

export function ProductModal() {
  const dispatch = useAppDispatch()
  const product = useAppSelector((s) => s.ui.selectedProduct)

  useEffect(() => {
    if (!product) return
    const handleEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') dispatch(closeModal()) }
    window.addEventListener('keydown', handleEsc)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', handleEsc)
      document.body.style.overflow = 'unset'
    }
  }, [product, dispatch])

  if (!product) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={() => dispatch(closeModal())}
    >
      <div
        className="bg-background rounded-t-2xl sm:rounded-2xl w-full sm:max-w-5xl max-h-[90dvh] flex flex-col shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 z-10 flex items-center justify-between bg-background px-4 py-3 border-b border-border shrink-0 sm:rounded-t-2xl">
          <h2 id="modal-title" className="text-sm font-semibold text-foreground">
            Detalle del producto
          </h2>
          <button
            onClick={() => dispatch(closeModal())}
            aria-label="Cerrar modal"
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-muted text-muted-foreground transition-colors"
          >
            <X size={18} />
          </button>
        </div>
        <div className="overflow-y-auto w-full">
          <ProductDetailClient id={product.id} initialData={product} />
        </div>
      </div>
    </div>
  )
}
