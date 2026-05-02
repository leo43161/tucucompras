'use client'
import { useEffect, useState } from 'react'
import { Search, Menu, X } from 'lucide-react'
import { ThemeToggle } from './ThemeToggle'
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks'
import { setSearch } from '@/lib/redux/slices/uiSlice'

export function Navbar() {
  const [open, setOpen] = useState(false)
  const dispatch = useAppDispatch()
  const search = useAppSelector((s) => s.ui.filters.search)
  const [value, setValue] = useState(search)

  useEffect(() => {
    const t = setTimeout(() => { dispatch(setSearch(value.trim())) }, 350)
    return () => clearTimeout(t)
  }, [value, dispatch])

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          <a href="/" className="font-outfit text-xl font-extrabold tracking-tight shrink-0">
            <span className="text-primary">Tucu</span><span className="text-foreground">Compras</span>
          </a>

          <form
            className="hidden md:flex flex-1 max-w-xl items-center gap-2 bg-muted/60 border border-border rounded-full px-4 focus-within:border-primary transition-colors"
            onSubmit={(e) => e.preventDefault()}
          >
            <Search size={16} className="text-muted-foreground" />
            <input
              type="search"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Buscar productos…"
              className="flex-1 bg-transparent py-2 text-sm outline-none placeholder:text-muted-foreground"
            />
          </form>

          <div className="flex items-center gap-1 shrink-0">
            <ThemeToggle />
            <button
              onClick={() => setOpen((v) => !v)}
              className="md:hidden w-10 h-10 rounded-full flex items-center justify-center text-muted-foreground hover:bg-muted"
              aria-label="Menú"
            >
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {open && (
          <form
            className="md:hidden pb-3 flex items-center gap-2 bg-muted/60 border border-border rounded-full px-4"
            onSubmit={(e) => e.preventDefault()}
          >
            <Search size={16} className="text-muted-foreground" />
            <input
              type="search"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Buscar…"
              className="flex-1 bg-transparent py-2 text-sm outline-none"
            />
          </form>
        )}
      </div>
    </header>
  )
}
