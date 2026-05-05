import Link from 'next/link'
import Image from 'next/image'
import { buildImgUrl } from '@/lib/config'
import { buildProductPath, formatPrice } from '@/lib/utils'
import type { ProductoAPI } from '@/lib/redux/api/types'

interface Props {
  title: string
  products: ProductoAPI[]
  emptyHint?: string
}

export function RelatedProducts({ title, products, emptyHint }: Props) {
  if (!products.length) {
    return emptyHint ? (
      <section className="mt-12 max-w-5xl mx-auto px-4 sm:px-6">
        <h2 className="font-outfit text-xl font-bold mb-4">{title}</h2>
        <p className="text-sm text-muted-foreground">{emptyHint}</p>
      </section>
    ) : null
  }

  return (
    <section className="mt-12 max-w-5xl mx-auto px-4 sm:px-6">
      <h2 className="font-outfit text-xl sm:text-2xl font-bold mb-4">{title}</h2>
      <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map((p) => {
          const precio = Number(p.precio) || 0
          const precioOferta = Number(p.precio_oferta) || 0
          const hasOffer = !!p.es_oferta && precioOferta > 0 && precioOferta < precio
          const finalPrice = hasOffer ? precioOferta : precio
          const img = buildImgUrl(p.imagen_principal_url) ?? 'https://placehold.co/600x600/e5e7eb/9ca3af?text=Sin+imagen'
          return (
            <li key={p.id}>
              <Link
                href={buildProductPath(p.id, p.nombre)}
                className="group flex flex-col bg-card border border-border rounded-2xl overflow-hidden hover:border-primary/60 hover:shadow-md transition-all"
              >
                <div className="relative w-full aspect-square bg-muted">
                  <Image
                    src={img}
                    alt={`${p.nombre} — ${p.empresa?.nombre ?? 'Tienda local'} en Tucumán`}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 640px) 50vw, 25vw"
                  />
                </div>
                <div className="p-3 flex flex-col gap-1">
                  <p className="text-[10px] font-bold text-primary uppercase tracking-wider truncate">
                    {p.empresa?.nombre ?? 'Tienda local'}
                  </p>
                  <h3 className="text-sm font-semibold line-clamp-2 leading-tight">{p.nombre}</h3>
                  {finalPrice > 0 ? (
                    <p className={`text-sm font-extrabold mt-1 ${hasOffer ? 'text-rose-600' : 'text-foreground'}`}>
                      {formatPrice(finalPrice)}
                    </p>
                  ) : (
                    <p className="text-xs text-muted-foreground italic mt-1">Precio a consultar</p>
                  )}
                </div>
              </Link>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
