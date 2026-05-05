// src/lib/utils.ts
export const WHATSAPP_CONTACTO = '5493815550000'

export function formatPrice(amount: number): string {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 0,
  }).format(amount)
}

const DEFAULT_AREA_CODE_AR = '381'

export function normalizePhoneAR(phone: string): string {
  let digits = (phone ?? '').replace(/\D/g, '')
  if (!digits) return ''
  if (digits.startsWith('549')) return digits
  if (digits.startsWith('54')) return `549${digits.slice(2)}`
  if (digits.startsWith('0')) digits = digits.replace(/^0+/, '')
  if (digits.startsWith('15')) digits = `${DEFAULT_AREA_CODE_AR}${digits.slice(2)}`
  if (digits.startsWith('9')) return `54${digits}`
  return `549${digits}`
}

export const SITE_URL = 'https://tucucompras.com.ar'

export function buildProductURL(productId: number | string): string {
  return `${SITE_URL}/productos/${productId}`
}

interface WhatsAppProductOptions {
  productName: string
  productId?: number | string
  price?: number
  productUrl?: string
}

export function buildWhatsAppURL(
  phone: string,
  productOrName: string | WhatsAppProductOptions,
): string {
  const opts: WhatsAppProductOptions =
    typeof productOrName === 'string' ? { productName: productOrName } : productOrName

  const url =
    opts.productUrl ?? (opts.productId != null ? buildProductURL(opts.productId) : undefined)

  const lines: string[] = ['Hola! Quiero consultar por:', '', `*${opts.productName}*`]
  if (typeof opts.price === 'number' && opts.price > 0) {
    lines.push(`💲 Precio: ${formatPrice(opts.price)}`)
  }
  if (url) {
    lines.push('', url)
  }
  lines.push('-TucuCompras-')

  const msg = encodeURIComponent(lines.join('\n'))
  return `https://wa.me/${normalizePhoneAR(phone)}?text=${msg}`
}
