export interface Product {
  id: number
  brand: string
  name: string
  desc: string
  price: number
  sale: boolean
  img: string
  category: 'Hombre' | 'Mujer' | 'Unisex' | 'Niños' | 'Deporte'
}

export interface FilterState {
  categories: string[]
  priceRange: [number, number]
  onlyOffers: boolean
}

export type ViewMode = 'list' | 'grid'