'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { useStore } from '@/lib/store'

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
    <div className="border-b border-[--border-light]">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-5 py-3 select-none"
      >
        <span className="text-[13px] font-bold text-base uppercase tracking-wide">
          {title}
        </span>
        <ChevronDown
          size={14}
          className={`text-text-secondary transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && <div className="px-5 pb-3">{children}</div>}
    </div>
  )
}

function FilterItem({
  label,
  count,
  checked,
  onChange,
}: {
  label: string
  count?: number
  checked: boolean
  onChange: () => void
}) {
  return (
    <label className="flex items-center justify-between py-1.5 cursor-pointer group">
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className="accent-primary w-3.5 h-3.5 cursor-pointer"
        />
        <span className="text-[13px] text-text-secondary group-hover:text-[--text-primary] transition-colors">
          {label}
        </span>
      </div>
      {count != null && (
        <span className="text-[11px] text-text-secondary bg-[--bg] px-1.5 py-0.5 rounded-full">
          {count}
        </span>
      )}
    </label>
  )
}

// ── Componente principal ────────────────────────────────────────────────────

const CATEGORIES = [
  { label: 'Hombre', count: 3 },
  { label: 'Mujer', count: 2 },
  { label: 'Unisex', count: 1 },
  { label: 'Niños', count: 1 },
  { label: 'Deporte', count: 1 },
]

const PRICE_RANGES = [
  { label: 'Hasta $10.000', min: 0, max: 10000 },
  { label: '$10.000 – $15.000', min: 10000, max: 15000 },
  { label: '$15.000 – $20.000', min: 15000, max: 20000 },
  { label: 'Más de $20.000', min: 20000, max: 999999 },
]

export function FilterSidebar() {
  const { filters, toggleCategory, setOnlyOffers, setPriceRange } = useStore()

  return (
    <aside className="w-60 min-w-60 bg-white border-r border-[--border] py-5 min-h-[calc(100vh-110px)]">

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

      <FilterSection title="Precio" defaultOpen={false}>
        {PRICE_RANGES.map(({ label, min, max }) => (
          <FilterItem
            key={label}
            label={label}
            checked={filters.priceRange[0] === min && filters.priceRange[1] === max}
            onChange={() => setPriceRange([min, max])}
          />
        ))}
        <button
          onClick={() => setPriceRange([0, 999999])}
          className="mt-2 text-[12px] text-[--tucu-blue] hover:underline"
        >
          Ver todos
        </button>
      </FilterSection>

      <FilterSection title="Ofertas" defaultOpen={false}>
        <FilterItem
          label="Solo con descuento"
          checked={filters.onlyOffers}
          onChange={() => setOnlyOffers(!filters.onlyOffers)}
        />
      </FilterSection>

    </aside>
  )
}