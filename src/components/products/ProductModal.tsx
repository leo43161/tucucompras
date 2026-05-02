// src/components/products/ProductModal.tsx
'use client'

import { useEffect } from 'react'
import { useAppSelector, useAppDispatch } from '@/lib/redux/hooks'
import { closeModal } from '@/lib/redux/slices/uiSlice'
import { useGetProductosQuery } from '@/lib/redux/api/productsApi'
import { ProductDetailClient } from './ProductDetailClient'
import { X, Loader2 } from 'lucide-react'

export function ProductModal() {
  const dispatch = useAppDispatch()
  const selectedId = useAppSelector((s) => s.ui.selectedProductId)

  // No hay endpoint público /productos/{id}: leemos el item desde el cache del listado.
  const { product, isLoading } = useGetProductosQuery(
    { limite: 60, offset: 0 },
    {
      skip: selectedId === null,
      selectFromResult: ({ data, isLoading }) => ({
        product: data?.data.find((p) => p.id === selectedId),
        isLoading,
      }),
    }
  )

  // 1. Manejo de Accesibilidad y UX (Tecla ESC y Bloqueo de Scroll)
  useEffect(() => {
    if (!selectedId) return

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') dispatch(closeModal())
    }

    window.addEventListener('keydown', handleEsc)
    // Bloquea el scroll de la página de fondo cuando el modal se abre
    document.body.style.overflow = 'hidden' 

    return () => {
      window.removeEventListener('keydown', handleEsc)
      // Restaura el scroll al cerrar
      document.body.style.overflow = 'unset' 
    }
  }, [selectedId, dispatch])

  if (!selectedId) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      // Agregado backdrop-blur para dar más profundidad y foco al modal
      className="fixed inset-0 z-200 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 transition-all"
      onClick={() => dispatch(closeModal())}
    >
      <div
        className="bg-background rounded-t-2xl sm:rounded-2xl w-full sm:max-w-5xl max-h-[90dvh] flex flex-col shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header del modal - shrink-0 evita que el header colapse si hay mucho contenido */}
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

        {/* Contenedor scrolleable aislado */}
        <div className="overflow-y-auto w-full">
          {/* 2. Estado de Carga explícito */}
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-32 text-muted-foreground">
              <Loader2 className="w-8 h-8 animate-spin mb-4 text-primary" />
              <p className="text-sm font-medium">Cargando detalles...</p>
            </div>
          ) : product ? (
            <ProductDetailClient
              slug={String(product.id)}
              initialData={product}
            />
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
              <p>No se pudo cargar la información del producto.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}