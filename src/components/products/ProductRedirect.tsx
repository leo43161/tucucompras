'use client'
import { useEffect } from 'react'

export function ProductRedirect({ to }: { to: string }) {
  useEffect(() => {
    if (typeof window === 'undefined') return
    // Replace para no agregar entrada al historial
    window.location.replace(to)
  }, [to])
  return null
}
