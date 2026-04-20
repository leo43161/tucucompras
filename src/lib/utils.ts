export function formatPrice(amount: number): string {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 0,
  }).format(amount)
}

export function getDiscountedPrice(price: number, discount = 0.15): number {
  return Math.round(price * (1 - discount))
}

export function buildWhatsAppURL(phone: string, productName: string): string {
  const msg = encodeURIComponent(`Hola! Quiero consultar por: *${productName}*`)
  return `https://wa.me/${phone}?text=${msg}`
}