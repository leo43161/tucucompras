'use client'

import { useEffect, useRef, useState } from 'react'
import {
  Rocket,
  Megaphone,
  Globe,
  TrendingUp,
  ChevronRight,
  X,
  Sparkles,
  MessageCircle,
} from 'lucide-react'
import { WHATSAPP_CONTACTO } from '@/lib/utils'

const TUCUCOMPRAS_WA = WHATSAPP_CONTACTO

function buildAgencyWA(message: string): string {
  return `https://wa.me/${TUCUCOMPRAS_WA}?text=${encodeURIComponent(message)}`
}

type FlyerKind = 'hero' | 'marketing' | 'web'

interface FlyerCopy {
  kind: FlyerKind
  eyebrow: string
  headline: string
  sub: string
  cta: string
  waMessage: string
  bullets: string[]
}

const FLYERS: Record<FlyerKind, FlyerCopy> = {
  hero: {
    kind: 'hero',
    eyebrow: 'Ventas digitales · Nivel nacional',
    headline: 'No te quedes solo con clientes de Tucumán',
    sub: 'Expandí tu negocio fuera de la provincia. Impulsamos tus ventas digitales en toda Argentina — no es solo marketing, es venta real.',
    cta: 'Quiero vender en todo el país',
    waMessage:
      'Hola! Vi en TucuCompras lo de expandir las ventas digitales fuera de Tucumán y quiero saber cómo trabajan con alcance nacional.',
    bullets: ['Alcance nacional', 'Más allá de Tucumán', 'Ventas reales'],
  },
  marketing: {
    kind: 'marketing',
    eyebrow: 'Especialistas en ventas digitales',
    headline: 'Campañas Publicitarias',
    sub: 'Nos especializamos en una sola cosa: que tu negocio venda más online. Estrategia y publicidad pensadas para vender — sobre todo fuera de Tucumán.',
    cta: 'Quiero mas ventas',
    waMessage:
      'Hola! Vi en TucuCompras que se especializan en ventas digitales (no en redes ni en hacer webs). Quiero conversar sobre cómo aumentar las ventas de mi negocio.',
    bullets: ['Ventas reales', 'Estrategia, no posteos', 'Foco nacional'],
  },
  web: {
    kind: 'web',
    eyebrow: 'Digitalización + Expansión',
    headline: 'Digitalizamos tu negocio y abrimos tu clientela al mundo',
    sub: 'Pensado para vender en toda Argentina, no solo en tu provincia. Estrategia de expansión digital con foco 100% en venta.',
    cta: 'Quiero digitalizarme',
    waMessage:
      'Hola! Vi en TucuCompras lo de digitalización + expansión nacional. Quiero saber cómo digitalizan negocios para vender fuera de Tucumán.',
    bullets: ['Toda Argentina', 'Ventas digitales', 'Estrategia 360°'],
  },
}

/* ============================================================
 * IN-GRID FLYER CARD (rota entre los 3 mensajes)
 * ============================================================ */
interface ServiceFlyerCardProps {
  index: number
  view: 'grid' | 'list'
}

export function ServiceFlyerCard({ index, view }: ServiceFlyerCardProps) {
  const order: FlyerKind[] = ['hero', 'marketing', 'web']
  const kind = order[index % order.length]
  const copy = FLYERS[kind]

  if (view === 'list') return <ListFlyer copy={copy} />
  return <GridFlyer copy={copy} />
}

/* ============================================================
 * TOP BANNER — horizontal, arriba de los productos. Aleatorio.
 * Paleta tenue pero visible (suave, no satura).
 * ============================================================ */
const FLYER_ORDER: FlyerKind[] = ['hero', 'marketing', 'web']

export function ServiceFlyerTopBanner() {
  // Random pick client-side para evitar mismatch de hidratación (Math.random
  // en el server da otro valor que en el cliente).
  const [kind, setKind] = useState<FlyerKind | null>(null)
  useEffect(() => {
    setKind(FLYER_ORDER[Math.floor(Math.random() * FLYER_ORDER.length)])
  }, [])

  if (!kind) return <div className="h-[112px] sm:h-[96px]" aria-hidden /> // placeholder estable

  const copy = FLYERS[kind]
  const palette = softPaletteFor(kind)
  const Icon = iconFor(kind)

  return (
    <article
      className={`relative mb-5 rounded-2xl overflow-hidden border ${palette.border} ${palette.bg} shadow-sm`}
      aria-label={`Publicidad — ${copy.eyebrow}`}
    >
      {/* Acento lateral que da personalidad sin saturar */}
      <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${palette.accent}`} aria-hidden />

      <div className="relative flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 p-3.5 sm:p-4 pl-5 sm:pl-6">
        {/* Icon badge */}
        <div className={`shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-xl ${palette.iconBg} ${palette.iconBorder} border flex items-center justify-center`}>
          <Icon size={26} className={palette.iconColor} strokeWidth={1.9} />
        </div>

        {/* Copy */}
        <div className="flex-1 min-w-0">
          <span className={`inline-flex items-center gap-1 ${palette.chipBg} ${palette.chipText} text-[10px] font-bold uppercase tracking-[0.16em] rounded-full px-2 py-0.5 mb-1`}>
            <Sparkles size={10} />
            Publicidad · {copy.eyebrow}
          </span>
          <h3 className="font-outfit font-bold text-foreground leading-tight text-base sm:text-lg tracking-tight">
            {copy.headline}
          </h3>
          <p className="font-outfit text-muted-foreground text-xs sm:text-[13px] mt-0.5 leading-snug line-clamp-2 max-w-[70ch]">
            {copy.sub}
          </p>
        </div>

        {/* CTA */}
        <a
          href={buildAgencyWA(copy.waMessage)}
          target="_blank"
          rel="noopener noreferrer"
          className={`shrink-0 inline-flex items-center justify-center gap-1.5 ${palette.ctaBg} text-white font-bold rounded-lg text-xs sm:text-sm py-2 sm:py-2.5 px-3.5 sm:px-4 shadow-sm hover:shadow-md transition-all active:scale-[0.97] hover:-translate-y-0.5 self-start sm:self-auto`}
        >
          <MessageCircle size={14} strokeWidth={2.6} />
          <span>{copy.cta}</span>
          <ChevronRight size={14} strokeWidth={2.8} />
        </a>
      </div>
    </article>
  )
}

/* ----------- GRID VARIANT — banner que ocupa 2 columnas ----------- */
function GridFlyer({ copy }: { copy: FlyerCopy }) {
  const palette = paletteFor(copy.kind)
  const Icon = iconFor(copy.kind)

  return (
    <article
      className={`relative col-span-2 lg:col-span-2 xl:col-span-2 rounded-3xl overflow-hidden border ${palette.border} ${palette.bg} shadow-lg ${palette.shadow} group`}
      aria-label={`Publicidad — ${copy.eyebrow}`}
    >
      {/* Glow blobs decorativos */}
      <div className={`absolute -top-16 -right-16 w-64 h-64 rounded-full blur-3xl opacity-30 ${palette.blob1} pointer-events-none`} />
      <div className={`absolute -bottom-20 -left-12 w-72 h-72 rounded-full blur-3xl opacity-25 ${palette.blob2} pointer-events-none`} />

      {/* Patrón de puntos sutil */}
      <div
        className="absolute inset-0 opacity-[0.07] pointer-events-none mix-blend-overlay"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,1) 1px, transparent 1px)',
          backgroundSize: '18px 18px',
        }}
      />

      <div className="relative h-full flex flex-col sm:flex-row gap-4 sm:gap-6 p-5 sm:p-7">
        {/* IZQ — copy + CTA */}
        <div className="flex-1 flex flex-col justify-between min-w-0">
          {/* Eyebrow */}
          <div className="flex items-center gap-2 mb-3">
            <span className="inline-flex items-center gap-1.5 bg-white/15 backdrop-blur-md border border-white/20 text-white text-[10px] font-black uppercase tracking-[0.18em] rounded-full px-2.5 py-1">
              <Sparkles size={11} />
              Publicidad
            </span>
            <span className="text-white/80 text-[10px] font-extrabold uppercase tracking-[0.16em]">
              {copy.eyebrow}
            </span>
          </div>

          {/* Headline + sub */}
          <div className="flex-1">
            <h3 className="font-outfit font-black text-white leading-[1.05] text-2xl sm:text-3xl lg:text-[28px] tracking-tight drop-shadow-sm">
              {copy.headline}
            </h3>
            <p className="font-outfit text-white/85 text-sm sm:text-base mt-2.5 leading-relaxed max-w-[42ch]">
              {copy.sub}
            </p>
          </div>

          {/* Bullets */}
          <ul className="flex flex-wrap gap-1.5 mt-4">
            {copy.bullets.map((b) => (
              <li
                key={b}
                className="inline-flex items-center gap-1 bg-white/15 backdrop-blur-md border border-white/20 text-white text-[10px] font-bold uppercase tracking-wider rounded-full px-2.5 py-1"
              >
                <span className="w-1 h-1 rounded-full bg-white/90" />
                {b}
              </li>
            ))}
          </ul>

          {/* CTA */}
          <div className="mt-5 flex items-center gap-3 flex-wrap">
            <a
              href={buildAgencyWA(copy.waMessage)}
              target="_blank"
              rel="noopener noreferrer"
              className={`shine-on-hover relative overflow-hidden inline-flex items-center justify-center gap-2 bg-white ${palette.ctaText} font-black rounded-xl text-sm py-2.5 px-5 shadow-lg shadow-black/20 hover:shadow-xl transition-all active:scale-[0.97] hover:-translate-y-0.5`}
            >
              <MessageCircle size={16} strokeWidth={2.8} />
              {copy.cta}
              <ChevronRight size={16} strokeWidth={3} className="-mr-1" />
            </a>
            <span className="text-white/80 text-xs font-semibold">
              Respondemos en minutos
            </span>
          </div>
        </div>

        {/* DER — visual icon */}
        <div className="hidden sm:flex shrink-0 items-center justify-center">
          <div className="relative">
            <div className="absolute inset-0 rounded-3xl bg-white/10 blur-2xl scale-110" />
            <div className="relative w-32 h-32 lg:w-36 lg:h-36 rounded-3xl bg-white/15 backdrop-blur-md border border-white/25 flex items-center justify-center rotate-[-6deg] group-hover:rotate-0 transition-transform duration-500">
              <Icon
                size={64}
                className="text-white drop-shadow-lg"
                strokeWidth={1.6}
              />
              <div className="absolute -top-2 -right-2 w-9 h-9 rounded-2xl bg-white text-slate-900 flex items-center justify-center shadow-lg rotate-12 group-hover:rotate-0 transition-transform duration-500">
                <TrendingUp size={18} strokeWidth={2.8} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer bar — sello agencia */}
      <div className="relative bg-black/25 backdrop-blur-sm border-t border-white/15 px-5 sm:px-7 py-2 flex items-center justify-between">
        <span className="text-[10px] font-extrabold text-white/95 uppercase tracking-[0.18em] inline-flex items-center gap-1.5">
          <Rocket size={11} />
          By el equipo de TucuCompras
        </span>
        <span className="text-[10px] font-bold text-white/70 uppercase tracking-wider hidden sm:block">
          Ventas digitales · Expansión nacional
        </span>
      </div>
    </article>
  )
}

/* ----------- LIST VARIANT — banner horizontal angosto ----------- */
function ListFlyer({ copy }: { copy: FlyerCopy }) {
  const palette = paletteFor(copy.kind)
  const Icon = iconFor(copy.kind)

  return (
    <article
      className={`relative rounded-2xl overflow-hidden border ${palette.border} ${palette.bg} shadow-md ${palette.shadow} group`}
      aria-label={`Publicidad — ${copy.eyebrow}`}
    >
      <div className={`absolute -top-12 -right-10 w-48 h-48 rounded-full blur-3xl opacity-30 ${palette.blob1} pointer-events-none`} />

      <div className="relative flex items-center gap-4 p-3 sm:p-4">
        {/* Icon */}
        <div className="shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white/15 backdrop-blur-md border border-white/25 flex items-center justify-center">
          <Icon size={32} className="text-white" strokeWidth={1.8} />
        </div>

        {/* Copy */}
        <div className="flex-1 min-w-0">
          <span className="inline-flex items-center gap-1 bg-white/15 backdrop-blur-md border border-white/20 text-white text-[9px] font-black uppercase tracking-[0.16em] rounded-full px-2 py-0.5 mb-1">
            <Sparkles size={9} />
            Publicidad · {copy.eyebrow}
          </span>
          <h3 className="font-outfit font-black text-white leading-tight text-base sm:text-lg line-clamp-1">
            {copy.headline}
          </h3>
          <p className="hidden sm:block font-outfit text-white/85 text-xs mt-0.5 line-clamp-1">
            {copy.sub}
          </p>
        </div>

        {/* CTA */}
        <a
          href={buildAgencyWA(copy.waMessage)}
          target="_blank"
          rel="noopener noreferrer"
          className={`shrink-0 inline-flex items-center justify-center gap-1.5 bg-white ${palette.ctaText} font-black rounded-full text-xs py-2 px-3 sm:px-4 shadow-md hover:shadow-lg transition-all active:scale-[0.97]`}
        >
          <MessageCircle size={14} strokeWidth={2.8} />
          <span className="hidden sm:inline">{copy.cta}</span>
          <ChevronRight size={14} strokeWidth={3} />
        </a>
      </div>
    </article>
  )
}

/* ============================================================
 * SLIDE-IN PILL (bottom-right) — link directo a WhatsApp
 * ============================================================ */
// Key versionada — bumpear el sufijo invalida dismissals previos
const STORAGE_KEY = 'tc.servicesFlyer.dismissedUntil.v2'
const DISMISS_HOURS = 6

export function ServiceFlyerSlide() {
  const [mounted, setMounted] = useState(false)
  const [visible, setVisible] = useState(false)
  const triggeredRef = useRef(false)

  useEffect(() => {
    setMounted(true)

    // Respect previous dismiss (clave versionada — old keys ya no afectan)
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw && Number(raw) > Date.now()) return
      // Limpiamos llaves antiguas para no acumular basura en localStorage
      localStorage.removeItem('tc.servicesFlyer.dismissedUntil')
    } catch {}

    const trigger = () => {
      if (triggeredRef.current) return
      triggeredRef.current = true
      setVisible(true)
    }

    // Aparece a los 2.5s o si hay scroll moderado, lo que ocurra primero
    const onScroll = () => {
      if (window.scrollY > 350) trigger()
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    const t = setTimeout(trigger, 2500)

    return () => {
      window.removeEventListener('scroll', onScroll)
      clearTimeout(t)
    }
  }, [])

  const handleDismiss = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setVisible(false)
    try {
      localStorage.setItem(STORAGE_KEY, String(Date.now() + DISMISS_HOURS * 3600 * 1000))
    } catch {}
  }

  if (!mounted || !visible) return null

  const palette = paletteFor('hero')
  const waHref = buildAgencyWA(
    'Hola! Vi en TucuCompras lo de expandir las ventas digitales fuera de Tucumán y quiero saber cómo trabajan con alcance nacional.',
  )

  return (
    <div className="fixed z-[60] bottom-4 right-4 sm:bottom-5 sm:right-5 max-w-[calc(100vw-2rem)] pointer-events-none">
      <div className="pointer-events-auto relative animate-flyer-in">
        {/* Botón X dismiss flotante (chiquito, arriba a la derecha de la pill) */}
        <button
          type="button"
          onClick={handleDismiss}
          aria-label="Cerrar"
          className="absolute -top-2 -right-2 z-10 w-6 h-6 rounded-full bg-background border border-border text-muted-foreground hover:text-foreground hover:bg-muted flex items-center justify-center shadow-md transition-colors"
        >
          <X size={12} strokeWidth={2.6} />
        </button>

        {/* PILL — link directo a WhatsApp */}
        <a
          href={waHref}
          target="_blank"
          rel="noopener noreferrer"
          className={`group flex items-center gap-2.5 ${palette.bg} border ${palette.border} text-white rounded-full pl-2 pr-4 py-2 shadow-2xl ${palette.shadow} hover:scale-[1.03] hover:-translate-y-0.5 transition-all duration-300`}
          aria-label="Consultar por WhatsApp para impulsar ventas digitales"
        >
          <span className="relative flex items-center justify-center w-9 h-9 rounded-full bg-white/15 backdrop-blur border border-white/25">
            <MessageCircle size={16} strokeWidth={2.4} />
            <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-white/30 animate-pulse" />
          </span>
          <span className="text-left leading-tight">
            <span className="block text-[9px] font-black uppercase tracking-[0.18em] text-white/85">
              ¿Solo vendés en Tucumán?
            </span>
            <span className="block text-sm font-black">
              Expandí a todo el país
            </span>
          </span>
          <ChevronRight
            size={18}
            strokeWidth={3}
            className="opacity-80 group-hover:translate-x-0.5 transition-transform"
          />
        </a>
      </div>
    </div>
  )
}

/* ============================================================
 * Helpers — paleta + iconos por variante
 * ============================================================ */
function paletteFor(kind: FlyerKind) {
  switch (kind) {
    case 'hero':
      return {
        bg: 'bg-linear-to-br from-violet-600 via-fuchsia-600 to-orange-500',
        border: 'border-white/15',
        shadow: 'shadow-fuchsia-600/30',
        blob1: 'bg-fuchsia-400',
        blob2: 'bg-violet-500',
        ctaText: 'text-fuchsia-700 hover:text-fuchsia-800',
      }
    case 'marketing':
      return {
        bg: 'bg-linear-to-br from-rose-600 via-orange-500 to-amber-500',
        border: 'border-white/15',
        shadow: 'shadow-orange-500/30',
        blob1: 'bg-amber-300',
        blob2: 'bg-rose-500',
        ctaText: 'text-rose-700 hover:text-rose-800',
      }
    case 'web':
      return {
        bg: 'bg-linear-to-br from-sky-600 via-cyan-500 to-emerald-500',
        border: 'border-white/15',
        shadow: 'shadow-cyan-500/30',
        blob1: 'bg-cyan-300',
        blob2: 'bg-sky-500',
        ctaText: 'text-sky-700 hover:text-sky-800',
      }
  }
}

function iconFor(kind: FlyerKind) {
  switch (kind) {
    case 'hero':
      return Rocket
    case 'marketing':
      return Megaphone
    case 'web':
      return Globe
  }
}

/* Paleta SOFT — tonos discretos pensados para banner top (claro y oscuro).
 * Mantiene la identidad cromática de cada flyer pero a baja saturación. */
function softPaletteFor(kind: FlyerKind) {
  switch (kind) {
    case 'hero':
      return {
        bg: 'bg-linear-to-r from-violet-500/10 via-fuchsia-500/8 to-orange-500/10 dark:from-violet-500/15 dark:via-fuchsia-500/10 dark:to-orange-500/15',
        border: 'border-violet-500/25 dark:border-violet-400/20',
        accent: 'bg-linear-to-b from-violet-500 to-fuchsia-500',
        iconBg: 'bg-violet-500/15 dark:bg-violet-400/15',
        iconBorder: 'border-violet-500/30 dark:border-violet-400/25',
        iconColor: 'text-violet-700 dark:text-violet-300',
        chipBg: 'bg-violet-500/15 dark:bg-violet-400/15',
        chipText: 'text-violet-800 dark:text-violet-200',
        ctaBg: 'bg-violet-600 hover:bg-violet-700 dark:bg-violet-500 dark:hover:bg-violet-400',
      }
    case 'marketing':
      return {
        bg: 'bg-linear-to-r from-rose-500/10 via-orange-500/8 to-amber-500/10 dark:from-rose-500/15 dark:via-orange-500/10 dark:to-amber-500/15',
        border: 'border-rose-500/25 dark:border-rose-400/20',
        accent: 'bg-linear-to-b from-rose-500 to-orange-500',
        iconBg: 'bg-rose-500/15 dark:bg-rose-400/15',
        iconBorder: 'border-rose-500/30 dark:border-rose-400/25',
        iconColor: 'text-rose-700 dark:text-rose-300',
        chipBg: 'bg-rose-500/15 dark:bg-rose-400/15',
        chipText: 'text-rose-800 dark:text-rose-200',
        ctaBg: 'bg-rose-600 hover:bg-rose-700 dark:bg-rose-500 dark:hover:bg-rose-400',
      }
    case 'web':
      return {
        bg: 'bg-linear-to-r from-sky-500/10 via-cyan-500/8 to-emerald-500/10 dark:from-sky-500/15 dark:via-cyan-500/10 dark:to-emerald-500/15',
        border: 'border-sky-500/25 dark:border-sky-400/20',
        accent: 'bg-linear-to-b from-sky-500 to-cyan-500',
        iconBg: 'bg-sky-500/15 dark:bg-sky-400/15',
        iconBorder: 'border-sky-500/30 dark:border-sky-400/25',
        iconColor: 'text-sky-700 dark:text-sky-300',
        chipBg: 'bg-sky-500/15 dark:bg-sky-400/15',
        chipText: 'text-sky-800 dark:text-sky-200',
        ctaBg: 'bg-sky-600 hover:bg-sky-700 dark:bg-sky-500 dark:hover:bg-sky-400',
      }
  }
}
