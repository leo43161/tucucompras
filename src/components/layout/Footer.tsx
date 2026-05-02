import { MessageCircle } from 'lucide-react'
import { WHATSAPP_CONTACTO } from '@/lib/utils'

export function Footer() {
  const waUrl = `https://wa.me/${WHATSAPP_CONTACTO}`

  return (
    <footer className="border-t border-border bg-card mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col items-center gap-4 text-center">
        <p className="font-outfit text-xl font-bold text-foreground">
          <span className="text-primary">Tucu</span>Compras
        </p>
        <p className="text-sm text-muted-foreground max-w-xs">
          ¿Querés sumar tu empresa o tenés alguna consulta?
        </p>
        <a
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Contacto institucional por WhatsApp"
          className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#1ebe5d] text-white font-semibold rounded-full px-5 py-2.5 text-sm transition-colors shadow-sm"
        >
          <MessageCircle size={16} />
          Hablanos por WhatsApp
        </a>
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} TucuCompras — Marketplace de Tucumán
        </p>
      </div>
    </footer>
  )
}
