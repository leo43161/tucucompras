import type { Product } from '@/types'

export const DISCOUNT = 0.15
export const WA_NUMBER = '5493816000000'

export const products: Product[] = [
    {
        id: 1,
        brand: 'UrbanStyle Tucumán',
        name: 'Remera Polo Manga Corta Slim Fit Transpirable',
        desc: 'Material 100% algodón premium, ideal para el calor tucumano. Disponible en talle S al XXL.',
        price: 7500,
        sale: true,
        img: 'https://placehold.co/400x400/0a2a4a/00aaff?text=Polo+Shirt',
        category: 'Hombre'
    },
    {
        id: 2,
        brand: 'BlancoPuro',
        name: 'Remera Blanca Cropped Cuello Redondo Heavyweight',
        desc: 'Corte oversize, tela pesada 220g. Perfecta para streetwear. Lavado a máquina.',
        price: 12900,
        sale: false,
        img: 'https://placehold.co/400x400/f0f8ff/0066cc?text=White+Tee',
        category: 'Mujer'
    },
    {
        id: 3,
        brand: 'AzulMarino Co.',
        name: 'Remera Oversized Drop Shoulder Estampada 100% Algodón',
        desc: 'Diseño de temporada con estampado en serigrafía. Corte boxy moderno.',
        price: 15200,
        sale: true,
        img: 'https://placehold.co/400x400/001a33/00aaff?text=Oversized',
        category: 'Hombre'
    },
    {
        id: 4,
        brand: 'Unisex Basics',
        name: 'Remera Manga Larga Cuello Redondo Jersey Unisex',
        desc: 'Tela 230g, corte relajado, costuras reforzadas. Colores neutros disponibles.',
        price: 9800,
        sale: false,
        img: 'https://placehold.co/400x400/1a1a2e/4da6ff?text=Long+Sleeve',
        category: 'Unisex'
    },
    {
        id: 5,
        brand: 'TucuKids',
        name: 'Remera Niños Estampado Divertido Algodón Suave',
        desc: 'Especial para niños de 4 a 12 años. Tela antialérgica y suave al tacto.',
        price: 5500,
        sale: true,
        img: 'https://placehold.co/400x400/003366/80ccff?text=Kids+Tee',
        category: 'Niños'
    },
    {
        id: 6,
        brand: 'SportTucu',
        name: 'Remera Deportiva Quick Dry Cuello V Transpirable',
        desc: 'Tecnología de absorción de humedad, ideal para entrenamiento intenso.',
        price: 11300,
        sale: false,
        img: 'https://placehold.co/400x400/002244/55aaff?text=Sport+Tee',
        category: 'Deporte'
    },
    {
        id: 7,
        brand: 'Premium Select',
        name: 'Remera Algodón Orgánico 100% Sustentable',
        desc: 'Certificada GOTS, producción sustentable. Ideal para piel sensible.',
        price: 18600,
        sale: true,
        img: 'https://placehold.co/400x400/0d1f3c/33bbff?text=Organic',
        category: 'Mujer'
    },
    {
        id: 8,
        brand: 'NordStreet',
        name: 'Remera Custom Logo Heavyweight Streetwear Oversize',
        desc: 'Confección local, tela 340GSM ultra gruesa. Logo bordado. Edición limitada.',
        price: 22000,
        sale: false,
        img: 'https://placehold.co/400x400/050e1a/0088dd?text=Streetwear',
        category: 'Hombre'
    }
];
