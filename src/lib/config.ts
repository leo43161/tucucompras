// src/lib/config.ts
// Cambiás esta variable y todo el fetch apunta al backend real
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? 'https://api.tucucompras.com.ar/v1'

// Durante desarrollo con datos mockeados, apunta a un JSON server local o MSW