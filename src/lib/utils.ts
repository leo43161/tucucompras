// src/lib/utils.ts
export const WHATSAPP_CONTACTO = '5493815550000'

export function formatPrice(amount: number): string {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 0,
  }).format(amount)
}

export function normalizePhoneAR(phone: string): string {
  const digits = (phone ?? '').replace(/\D/g, '')
  if (!digits) return ''
  if (digits.startsWith('549')) return digits
  if (digits.startsWith('54')) return `549${digits.slice(2)}`
  if (digits.startsWith('9')) return `54${digits}`
  if (digits.startsWith('0')) return `549${digits.replace(/^0+/, '')}`
  return `549${digits}`
}

export function buildWhatsAppURL(phone: string, productName: string): string {
  const msg = encodeURIComponent(`Hola! Quiero consultar por: *${productName}*`)
  return `https://wa.me/${normalizePhoneAR(phone)}?text=${msg}`
}
