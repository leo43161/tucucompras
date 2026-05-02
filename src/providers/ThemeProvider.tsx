'use client'
import { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'light' | 'dark'
const ThemeCtx = createContext<{ theme: Theme; toggle: () => void }>({ theme: 'light', toggle: () => {} })

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light')

  useEffect(() => {
    const stored = localStorage.getItem('tc-theme') as Theme | null
    const initial = stored ?? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
    apply(initial)
  }, [])

  const apply = (t: Theme) => {
    setTheme(t)
    document.documentElement.classList.toggle('dark', t === 'dark')
  }

  const toggle = () => {
    const next = theme === 'light' ? 'dark' : 'light'
    localStorage.setItem('tc-theme', next)
    apply(next)
  }

  return <ThemeCtx.Provider value={{ theme, toggle }}>{children}</ThemeCtx.Provider>
}
export const useTheme = () => useContext(ThemeCtx)