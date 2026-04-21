'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
// import { useStore } from '@/lib/store'

// ── Sub-componentes internos ────────────────────────────────────────────────

function FilterSection({
  title,
  children,
  defaultOpen = true,
}: {
  title: string
  children: React.ReactNode
  defaultOpen?: boolean
}) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <div className="border-b border-border">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="w-full flex items-center justify-between py-4 select-none outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm"
      >
        <span className="text-sm font-bold text-foreground uppercase tracking-wider">
          {title}
        </span>
        <ChevronDown
          size={16}
          className={`text-muted-foreground transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Se usa grid para animar la altura fluidamente si quisieras agregarlo luego, por ahora condicional simple */}
      {open && <div className="pb-4 space-y-1">{children}</div>}
    </div>
  )
}

function FilterItem({
  label,
  count,
  checked,
  onChange,
  type = 'checkbox',
  name,
}: {
  label: string
  count?: number
  checked: boolean
  onChange: () => void
  type?: 'checkbox' | 'radio'
  name?: string
}) {
  return (
    <label className="flex items-center justify-between py-1.5 cursor-pointer group">
      <div className="flex items-center gap-2.5">
        <input
          type={type}
          name={name}
          checked={checked}
          onChange={onChange}
          className="w-4 h-4 text-primary bg-background border-border focus:ring-primary focus:ring-2 focus:ring-offset-1 cursor-pointer transition-all"
        />
        <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
          {label}
        </span>
      </div>
      {count != null && (
        <span className="text-[11px] font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
          {count}
        </span>
      )}
    </label>
  )
}

// ── Componente principal ────────────────────────────────────────────────────

const CATEGORIES = [
  { label: 'Hombre', count: 32 },
  { label: 'Mujer', count: 28 },
  { label: 'Unisex', count: 14 },
  { label: 'Niños', count: 9 },
  { label: 'Deporte', count: 11 },
]

const PRICE_RANGES = [
  { label: 'Hasta $10.000', min: 0, max: 10000 },
  { label: '$10.000 – $15.000', min: 10000, max: 15000 },
  { label: '$15.000 – $20.000', min: 15000, max: 20000 },
  { label: 'Más de $20.000', min: 20000, max: 999999 },
]

export function FilterSidebar() {
  // Mock del store para evitar errores de compilación
  const filters = { categories: ['Hombre'], priceRange: [0, 999999], onlyOffers: false }
  const toggleCategory = (c: string) => {}
  const setPriceRange = (r: [number, number]) => {}
  const setOnlyOffers = (b: boolean) => {}

  return (
    /* Oculto por defecto en mobile (hidden). 
      Visible a partir de md (md:block).
      En la vista principal de la tienda, deberás crear un botón "Filtrar" visible 
      solo en mobile que abra este mismo componente dentro de un Modal/Sheet.
    */
    <aside className="hidden md:block w-64 shrink-0 bg-background px-6">
      <div className="sticky top-24 space-y-1">
        
        <FilterSection title="Categoría">
          {CATEGORIES.map(({ label, count }) => (
            <FilterItem
              key={label}
              label={label}
              count={count}
              checked={filters.categories.includes(label)}
              onChange={() => toggleCategory(label)}
            />
          ))}
        </FilterSection>

        <FilterSection title="Precio" defaultOpen={true}>
          {PRICE_RANGES.map(({ label, min, max }) => (
            <FilterItem
              key={label}
              type="radio"
              name="price-range"
              label={label}
              checked={filters.priceRange[0] === min && filters.priceRange[1] === max}
              onChange={() => setPriceRange([min, max])}
            />
          ))}
          <button
            onClick={() => setPriceRange([0, 999999])}
            className={`mt-3 text-xs font-semibold hover:underline transition-colors ${
              filters.priceRange[0] === 0 && filters.priceRange[1] === 999999
                ? 'text-foreground'
                : 'text-primary'
            }`}
          >
            Limpiar precio
          </button>
        </FilterSection>

        <FilterSection title="Ofertas" defaultOpen={true}>
          <FilterItem
            label="Solo con descuento"
            checked={filters.onlyOffers}
            onChange={() => setOnlyOffers(!filters.onlyOffers)}
          />
        </FilterSection>

      </div>
    </aside>
  )
}