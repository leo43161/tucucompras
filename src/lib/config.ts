export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'https://tucucompras.com.ar/v1/api'
export const IMG_BASE_URL = process.env.NEXT_PUBLIC_IMG_URL ?? 'https://tucucompras.com.ar/v1'
export const GA_ID = process.env.NEXT_PUBLIC_GA_ID ?? 'G-0C5K2568MX'
export const buildImgUrl = (file: string | null | undefined) =>
  file ? (file.startsWith('http') ? file : `${IMG_BASE_URL}/${file}`) : null