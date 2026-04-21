'use client'

import { useState } from 'react'
import { Search, ShoppingCart, Heart, User, Menu, X } from 'lucide-react'

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
      className="relative w-10 h-10 rounded-full flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
    >
      {children}
      {badge != null && badge > 0 && (
        <span className="absolute top-1 right-1 bg-primary text-primary-foreground rounded-full w-4 h-4 text-[10px] font-bold flex items-center justify-center">
          {badge}
        </span>
      )}
    </button>
  )
}

// ── Componente principal ────────────────────────────────────────────────────

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-background border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Fila principal */}
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo */}
          <a href="/" className="font-outfit text-[22px] font-extrabold tracking-tight whitespace-nowrap no-underline shrink-0">
            <span className="text-primary">Tucu</span>
            <span className="text-foreground">Compras</span>
          </a>

          {/* Barra de búsqueda (Desktop) */}
          <form 
            className="hidden md:flex flex-1 max-w-2xl items-center gap-2 bg-muted/50 border-2 border-border rounded-full px-4 focus-within:border-primary focus-within:bg-background transition-all"
            onSubmit={(e) => {
              e.preventDefault();
            }}
          >
            <Search size={16} className="text-muted-foreground shrink-0" />
            <input
              type="text"
              placeholder="Buscar productos en Tucumán..."
              className="flex-1 bg-transparent py-2 text-sm outline-none text-foreground placeholder:text-muted-foreground"
            />
            <button 
              type="submit"
              className="bg-primary text-primary-foreground rounded-full px-4 py-1.5 text-xs font-semibold hover:opacity-90 transition-opacity my-1"
            >
              Buscar
            </button>
          </form>

          {/* Iconos y CTAs (Desktop) */}
          <div className="hidden md:flex items-center gap-1 shrink-0">
            <button
              aria-label="Sumate como vendedor"
              className="bg-gradient-to-r from-primary to-accent text-primary-foreground rounded-full px-5 py-2 text-sm font-semibold hover:opacity-90 transition-opacity mr-2 shadow-sm"
            >
              Vender aquí
            </button>
            <NavIconBtn label="Favoritos"><Heart size={20} /></NavIconBtn>
            <NavIconBtn label="Mi cuenta"><User size={20} /></NavIconBtn>
            <NavIconBtn label="Carrito" badge={3}><ShoppingCart size={20} /></NavIconBtn>
          </div>

          {/* Controles Mobile */}
          <div className="flex md:hidden items-center gap-2">
            <NavIconBtn label="Carrito" badge={3}><ShoppingCart size={20} /></NavIconBtn>
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-muted-foreground hover:bg-muted rounded-full transition-colors"
              aria-label="Menú principal"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Barra de búsqueda (Mobile) */}
        <div className="md:hidden pb-3">
          <form 
            className="flex items-center gap-2 bg-muted/50 border-2 border-border rounded-full px-4 focus-within:border-primary focus-within:bg-background transition-all"
            onSubmit={(e) => e.preventDefault()}
          >
            <Search size={16} className="text-muted-foreground shrink-0" />
            <input
              type="text"
              placeholder="Buscar productos..."
              className="flex-1 bg-transparent py-2 text-base outline-none text-foreground placeholder:text-muted-foreground"
            />
          </form>
        </div>
      </div>

      {/* Menú Desplegable (Mobile) */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-background px-4 py-4 space-y-4">
          <button className="w-full bg-primary text-primary-foreground rounded-full px-4 py-3 text-sm font-semibold flex justify-center shadow-sm">
            Vender aquí / Contacto
          </button>
          <div className="flex justify-around pt-2 border-t border-border">
            <div className="flex flex-col items-center gap-1 text-muted-foreground">
              <NavIconBtn label="Favoritos"><Heart size={20} /></NavIconBtn>
              <span className="text-xs">Favoritos</span>
            </div>
            <div className="flex flex-col items-center gap-1 text-muted-foreground">
              <NavIconBtn label="Mi cuenta"><User size={20} /></NavIconBtn>
              <span className="text-xs">Perfil</span>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}