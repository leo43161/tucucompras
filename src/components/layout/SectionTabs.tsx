'use client'
import { useState } from 'react'

const SECTIONS = ['Todo', 'Hombre', 'Mujer', 'Niños', 'Deporte', 'Hogar', 'Electrónica', 'Ofertas']

export function SectionTabs() {
  const [active, setActive] = useState('Todo')

  return (
    <nav className="bg-white border-b border-[--border]">
      <div className="max-w-[1280px] mx-auto flex overflow-x-auto scrollbar-none px-5">
        {SECTIONS.map((s) => (
          <button
            key={s}
            onClick={() => setActive(s)}
            className={`px-[18px] py-[11px] text-[13px] font-medium whitespace-nowrap border-b-2 transition-colors ${
              active === s
                ? 'text-[--tucu-blue] border-[--tucu-blue] font-semibold'
                : 'text-[--text-secondary] border-transparent hover:text-[--tucu-blue]'
            }`}
          >
            {s}
          </button>
        ))}
      </div>
    </nav>
  )
}