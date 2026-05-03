'use client'
import Link from 'next/link'
import { ArrowLeft, Tag } from 'lucide-react'
import { useGetProductosQuery } from '@/lib/redux/api/productsApi'
import { ProductCard } from '@/components/products/ProductCard'
import type { ProductoAPI } from '@/lib/redux/api/types'

interface Props {
  slug: string
  categoryId: number | null
  categoryName: string
  initialProducts?: ProductoAPI[]
}

export function CategoryDetailClient({ categoryId, categoryName, initialProducts = [] }: Props) {
  const { data, isLoading, isError } = useGetProductosQuery(
    { categoria_id: categoryId ?? undefined, limite: 48, offset: 0 },
    { skip: categoryId == null }
  )
  const products = data?.data ?? initialProducts

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary mb-4">
        <ArrowLeft size={16} /> Volver
      </Link>

      <header className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
          <Tag size={18} />
        </div>
        <div>
          <h1 className="font-outfit text-2xl sm:text-3xl font-bold leading-tight">{categoryName}</h1>
          <p className="text-xs text-muted-foreground">
            {isLoading && products.length === 0
              ? 'Cargando…'
              : `${products.length} producto${products.length === 1 ? '' : 's'}`}
          </p>
        </div>
      </header>

      {isLoading && products.length === 0 ? (
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-muted/50 border border-border rounded-2xl animate-pulse aspect-[3/4]" />
          ))}
        </div>
      ) : isError && products.length === 0 ? (
        <Empty title="Error al cargar productos" sub="Intentá recargar la página" />
      ) : products.length === 0 ? (
        <Empty title="Sin productos en esta categoría" sub="Pronto vamos a sumar más." />
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {products.map((p) => <ProductCard key={p.id} product={p} view="grid" />)}
        </div>
      )}
    </div>
  )
}

function Empty({ title, sub }: { title: string; sub: string }) {
  return (
    <div className="text-center py-20 text-muted-foreground">
      <p className="text-lg font-medium text-foreground">{title}</p>
      <p className="text-sm mt-1">{sub}</p>
    </div>
  )
}
