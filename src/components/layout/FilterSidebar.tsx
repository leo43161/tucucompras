'use client'
import { useGetCategoriasQuery } from '@/lib/redux/api/productsApi'
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks'
import { setOnlyOffers, setPriceRange, setCategory, resetFilters } from '@/lib/redux/slices/uiSlice'

const PRICE_RANGES: { label: string; min: number; max: number }[] = [
  { label: 'Hasta $10.000', min: 0, max: 10000 },
  { label: '$10.000 – $25.000', min: 10000, max: 25000 },
  { label: '$25.000 – $50.000', min: 25000, max: 50000 },
  { label: 'Más de $50.000', min: 50000, max: 999999 },
]

export function FilterSidebar() {
  const dispatch = useAppDispatch()
  const filters = useAppSelector((s) => s.ui.filters)
  const { data: cats = [] } = useGetCategoriasQuery()

  return (
    <aside className="hidden md:block w-60 shrink-0 px-6">
      <div className="sticky top-32 space-y-6 py-6">
        <Section title="Categoría">
          <Check
            type="radio"
            name="cat"
            label="Todas"
            checked={filters.categoryId === null}
            onChange={() => dispatch(setCategory(null))}
          />
          {cats.map((c) => (
            <Check
              key={c.id}
              type="radio"
              name="cat"
              label={c.nombre}
              checked={filters.categoryId === c.id}
              onChange={() => dispatch(setCategory(c.id))}
            />
          ))}
        </Section>

        <Section title="Precio">
          {PRICE_RANGES.map((r) => (
            <Check
              key={r.label}
              type="radio"
              name="price"
              label={r.label}
              checked={filters.priceRange[0] === r.min && filters.priceRange[1] === r.max}
              onChange={() => dispatch(setPriceRange([r.min, r.max]))}
            />
          ))}
        </Section>

        <Section title="Ofertas">
          <Check
            label="Solo con descuento"
            checked={filters.onlyOffers}
            onChange={() => dispatch(setOnlyOffers(!filters.onlyOffers))}
          />
        </Section>

        <button
          onClick={() => dispatch(resetFilters())}
          className="text-xs font-semibold text-primary hover:underline"
        >
          Limpiar filtros
        </button>
      </div>
    </aside>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">{title}</h3>
      <div className="space-y-1.5">{children}</div>
    </div>
  )
}

function Check({
  label, checked, onChange, type = 'checkbox', name,
}: { label: string; checked: boolean; onChange: () => void; type?: 'checkbox' | 'radio'; name?: string }) {
  return (
    <label className="flex items-center gap-2.5 py-1 cursor-pointer text-sm text-muted-foreground hover:text-foreground">
      <input
        type={type}
        name={name}
        checked={checked}
        onChange={onChange}
        className="w-4 h-4 accent-[var(--primary)] cursor-pointer"
      />
      {label}
    </label>
  )
}
