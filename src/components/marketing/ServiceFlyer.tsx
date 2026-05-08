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
  Target,
  BarChart3,
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
 * SLIDE-IN PANEL (bottom-right, dismiss + expand)
 * ============================================================ */
const STORAGE_KEY = 'tc.servicesFlyer.dismissedUntil'
const DISMISS_HOURS = 24

export function ServiceFlyerSlide() {
  const [mounted, setMounted] = useState(false)
  const [visible, setVisible] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const [activeKind, setActiveKind] = useState<FlyerKind>('hero')
  const triggeredRef = useRef(false)

  useEffect(() => {
    setMounted(true)

    // Respect previous dismiss
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw && Number(raw) > Date.now()) return
    } catch {}

    const trigger = () => {
      if (triggeredRef.current) return
      triggeredRef.current = true
      setVisible(true)
    }

    // Aparece cuando el usuario hace scroll moderado, o tras 6s, lo que ocurra primero
    const onScroll = () => {
      if (window.scrollY > 900) trigger()
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    const t = setTimeout(trigger, 6000)

    return () => {
      window.removeEventListener('scroll', onScroll)
      clearTimeout(t)
    }
  }, [])

  const handleDismiss = () => {
    setVisible(false)
    setExpanded(false)
    try {
      localStorage.setItem(STORAGE_KEY, String(Date.now() + DISMISS_HOURS * 3600 * 1000))
    } catch {}
  }

  if (!mounted || !visible) return null

  const copy = FLYERS[activeKind]
  const palette = paletteFor(activeKind)

  return (
    <div className="fixed z-[60] bottom-4 right-4 sm:bottom-5 sm:right-5 max-w-[calc(100vw-2rem)] pointer-events-none">
      {/* COLLAPSED PILL */}
      {!expanded && (
        <button
          type="button"
          onClick={() => setExpanded(true)}
          className={`pointer-events-auto group flex items-center gap-2.5 ${palette.bg} border ${palette.border} text-white rounded-full pl-2 pr-4 py-2 shadow-2xl ${palette.shadow} hover:scale-[1.03] hover:-translate-y-0.5 transition-all duration-300 animate-flyer-in`}
          aria-label="Ver servicios para impulsar ventas"
        >
          <span className="relative flex items-center justify-center w-9 h-9 rounded-full bg-white/15 backdrop-blur border border-white/25">
            <Rocket size={16} strokeWidth={2.4} />
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
        </button>
      )}

      {/* EXPANDED PANEL */}
      {expanded && (
        <div className="pointer-events-auto w-[min(380px,calc(100vw-2rem))] animate-flyer-in">
          <div
            className={`relative rounded-2xl overflow-hidden border ${palette.border} ${palette.bg} shadow-2xl ${palette.shadow}`}
          >
            {/* glow blobs */}
            <div className={`absolute -top-12 -right-10 w-44 h-44 rounded-full blur-3xl opacity-40 ${palette.blob1} pointer-events-none`} />
            <div className={`absolute -bottom-14 -left-10 w-44 h-44 rounded-full blur-3xl opacity-30 ${palette.blob2} pointer-events-none`} />

            {/* close */}
            <button
              type="button"
              onClick={handleDismiss}
              aria-label="Cerrar"
              className="absolute top-2.5 right-2.5 z-10 w-8 h-8 rounded-full bg-black/20 hover:bg-black/40 backdrop-blur-md border border-white/20 text-white flex items-center justify-center transition-colors"
            >
              <X size={15} strokeWidth={2.5} />
            </button>

            {/* HEADER */}
            <div className="relative px-5 pt-5 pb-3">
              <span className="inline-flex items-center gap-1.5 bg-white/15 backdrop-blur-md border border-white/20 text-white text-[10px] font-black uppercase tracking-[0.18em] rounded-full px-2.5 py-1 mb-2.5">
                <Sparkles size={11} />
                {copy.eyebrow}
              </span>
              <h3 className="font-outfit font-black text-white leading-[1.1] text-xl pr-8">
                {copy.headline}
              </h3>
              <p className="font-outfit text-white/85 text-sm mt-2 leading-snug">
                {copy.sub}
              </p>
            </div>

            {/* TAB SELECTOR */}
            <div className="relative px-3">
              <div className="flex gap-1 bg-black/20 border border-white/15 rounded-xl p-1 backdrop-blur-md">
                <ServiceTab
                  active={activeKind === 'hero'}
                  onClick={() => setActiveKind('hero')}
                  icon={<Rocket size={13} />}
                  label="Nacional"
                />
                <ServiceTab
                  active={activeKind === 'marketing'}
                  onClick={() => setActiveKind('marketing')}
                  icon={<Megaphone size={13} />}
                  label="Ventas"
                />
                <ServiceTab
                  active={activeKind === 'web'}
                  onClick={() => setActiveKind('web')}
                  icon={<Globe size={13} />}
                  label="Expansión"
                />
              </div>
            </div>

            {/* BENEFITS */}
            <div className="relative px-5 pt-4 pb-2">
              <ul className="grid grid-cols-3 gap-2">
                {copy.bullets.map((b, i) => {
                  const Ic = [Target, BarChart3, Sparkles][i % 3]
                  return (
                    <li
                      key={b}
                      className="rounded-lg bg-white/10 border border-white/15 backdrop-blur-md p-2 text-center"
                    >
                      <Ic size={14} className="text-white/95 mx-auto mb-1" strokeWidth={2.2} />
                      <span className="block text-[10px] font-bold text-white/95 leading-tight">
                        {b}
                      </span>
                    </li>
                  )
                })}
              </ul>
            </div>

            {/* CTA */}
            <div className="relative px-5 pb-5 pt-3">
              <a
                href={buildAgencyWA(copy.waMessage)}
                target="_blank"
                rel="noopener noreferrer"
                className={`shine-on-hover group/cta relative overflow-hidden flex items-center justify-center gap-2 bg-white ${palette.ctaText} font-black rounded-xl text-sm py-3 px-4 shadow-lg shadow-black/20 hover:shadow-xl transition-all active:scale-[0.98] hover:-translate-y-0.5 w-full`}
              >
                <MessageCircle size={16} strokeWidth={2.8} />
                {copy.cta}
                <ChevronRight size={16} strokeWidth={3} className="group-hover/cta:translate-x-0.5 transition-transform" />
              </a>
              <p className="text-center text-[10px] text-white/70 font-semibold mt-2">
                Te respondemos por WhatsApp · sin compromiso
              </p>
            </div>

            {/* footer */}
            <div className="relative bg-black/25 border-t border-white/15 px-4 py-2 flex items-center justify-between">
              <span className="text-[9px] font-extrabold text-white/95 uppercase tracking-[0.16em] inline-flex items-center gap-1">
                <Rocket size={10} />
                Equipo TucuCompras
              </span>
              <button
                type="button"
                onClick={handleDismiss}
                className="text-[10px] font-bold text-white/70 hover:text-white uppercase tracking-wider transition-colors"
              >
                No, gracias
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function ServiceTab({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean
  onClick: () => void
  icon: React.ReactNode
  label: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex-1 inline-flex items-center justify-center gap-1 rounded-lg py-1.5 text-[11px] font-black uppercase tracking-wider transition-all ${
        active
          ? 'bg-white text-slate-900 shadow-md'
          : 'text-white/80 hover:text-white hover:bg-white/10'
      }`}
    >
      {icon}
      {label}
    </button>
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
