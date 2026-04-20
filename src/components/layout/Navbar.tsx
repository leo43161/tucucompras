'use client'

import { Search, ShoppingCart, Heart, User } from 'lucide-react'
import { useStore } from '@/lib/store'

// ── Sub-componente interno ──────────────────────────────────────────────────

function NavIconBtn({
  badge,
  children,
  label,
}: {
  badge?: number
  children: React.ReactNode
  label: string
}) {
  return (
    <button
      aria-label={label}
      className="relative w-[38px] h-[38px] rounded-full flex items-center justify-center text-[--text-secondary] hover:bg-[--border-light] transition-colors"
    >
      {children}
      {badge != null && badge > 0 && (
        <span className="absolute top-1 right-1 bg-[--tucu-blue] text-white rounded-full w-4 h-4 text-[9px] font-bold flex items-center justify-center">
          {badge}
        </span>
      )}
    </button>
  )
}

// ── Componente principal ────────────────────────────────────────────────────

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-[--border] shadow-[0_2px_12px_rgba(0,102,204,0.08)]">
      <div className="max-w-7xl mx-auto flex items-center gap-4 px-5 py-3 justify-between">

        {/* Logo */}
        <a href="/" className="font-outfit text-[22px] font-extrabold tracking-tight whitespace-nowrap no-underline">
          <span className="text-accent">Tucu</span>
          <span className="text-primary">Compras</span>
        </a>

        {/* Barra de búsqueda */}
        <div className="flex-1 max-w-150 flex items-center gap-2 bg-[--bg] border-2 border-[--border] rounded-full px-4 focus-within:border-[--tucu-sky] focus-within:shadow-[0_0_0_3px_rgba(0,170,255,0.12)] transition-all">
          <Search size={16} className="text-[--text-muted] shrink-0" />
          <input
            type="text"
            placeholder="Buscar productos en Tucumán..."
            className="flex-1 bg-transparent py-2.5 text-sm outline-none text-[--text-primary] placeholder:text-[--text-muted] font-dm-sans"
          />
          <button className="bg-linear-to-r from-[--tucu-blue] to-[--tucu-sky] text-white rounded-full px-4 py-1.5 text-xs font-semibold hover:opacity-90 transition-opacity">
            Buscar
          </button>
        </div>

        {/* Iconos */}
        <div className="flex gap-1">
          <NavIconBtn label="Favoritos">
            <Heart size={20} />
          </NavIconBtn>
          <NavIconBtn label="Carrito" badge={3}>
            <ShoppingCart size={20} />
          </NavIconBtn>
          <NavIconBtn label="Mi cuenta">
            <User size={20} />
          </NavIconBtn>
        </div>

      </div>
    </header>
  )
}