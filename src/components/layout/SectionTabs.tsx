'use client'

import { useState } from 'react'

const SECTIONS = ['Todo', 'Hombre', 'Mujer', 'Niños', 'Deporte', 'Hogar', 'Electrónica', 'Ofertas']

export function SectionTabs() {
  // TODO: En producción, reemplazar este estado por la lectura de la URL (ej: useSearchParams en Next.js)
  const [active, setActive] = useState('Todo')

  return (
    <nav className="bg-background border-b border-border w-full sticky top-16 z-40">
      <div className="max-w-7xl mx-auto relative">
        
        {/* Contenedor scrolleable con snap para mobile */}
        <div 
          role="tablist"
          aria-label="Categorías de productos"
          className="flex overflow-x-auto px-4 sm:px-6 lg:px-8 gap-2 
                     [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] 
                     snap-x snap-mandatory"
        >
          {SECTIONS.map((s) => (
            <button
              key={s}
              role="tab"
              aria-selected={active === s}
              onClick={() => setActive(s)}
              className={`
                snap-start shrink-0 px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1
                ${active === s
                  ? 'text-primary border-primary'
                  : 'text-muted-foreground border-transparent hover:text-foreground hover:border-border/50'
                }
              `}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Sombras difuminadas en los bordes para indicar que hay scroll (visible solo en pantallas chicas) */}
        <div className="absolute top-0 right-0 bottom-0 w-8 bg-linear-to-l from-background to-transparent pointer-events-none md:hidden" />
      </div>
    </nav>
  )
}