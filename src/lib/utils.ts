// src/lib/utils.ts
export const WHATSAPP_CONTACTO = '5493815550000'

export function formatPrice(amount: number): string {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 0,
  }).format(amount)
}

export function buildWhatsAppURL(phone: string, productName: string): string {
  const msg = encodeURIComponent(`Hola! Quiero consultar por: *${productName}*`)
  return `https://wa.me/${phone}?text=${msg}`
}
