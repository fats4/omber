export type ProductStatus = 'available' | 'sale' | 'sold-out' | 'pre-order';

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  status: ProductStatus;
  image: string;
  description: string;
}

export const products: Product[] = [
  {
    id: '1',
    name: 'Shadow Denim — Indigo',
    category: 'Apparel',
    price: 99,
    originalPrice: 180,
    status: 'sale',
    image: 'https://picsum.photos/seed/denim-indigo/800/800',
    description: 'Denim berat 14oz dengan wash indigo deep. Cut relaxed-fit.',
  },
  {
    id: '2',
    name: 'Shadow Denim — Black',
    category: 'Apparel',
    price: 99,
    originalPrice: 180,
    status: 'sale',
    image: 'https://picsum.photos/seed/denim-black/800/800',
    description: 'Denim hitam matte, hardware custom RENAOMBER.',
  },
  {
    id: '3',
    name: 'Vortex Dad Cap — Forest',
    category: 'Headwear',
    price: 25,
    status: 'available',
    image: 'https://picsum.photos/seed/cap-forest/800/800',
    description: 'Topi dad cap dengan embroidery vortex spiral.',
  },
  {
    id: '4',
    name: 'Vortex Dad Cap — Charcoal',
    category: 'Headwear',
    price: 25,
    status: 'available',
    image: 'https://picsum.photos/seed/cap-charcoal/800/800',
    description: 'Warna charcoal dengan strap adjustable.',
  },
  {
    id: '5',
    name: 'Pulse Balm',
    category: 'Accessories',
    price: 42,
    status: 'available',
    image: 'https://picsum.photos/seed/pulse-balm/800/800',
    description: 'Lip balm dengan casing collectible gem-shaped.',
  },
  {
    id: '6',
    name: 'Collab Pullover',
    category: 'Apparel',
    price: 99,
    status: 'sold-out',
    image: 'https://picsum.photos/seed/collab-pullover/800/800',
    description: 'Limited collab fleece pullover — sold out.',
  },
  {
    id: '7',
    name: 'Archive Tee',
    category: 'Apparel',
    price: 55,
    status: 'available',
    image: 'https://picsum.photos/seed/archive-tee/800/800',
    description: 'Heavyweight cotton tee, screen print front & back.',
  },
  {
    id: '8',
    name: 'Chain Pendant',
    category: 'Accessories',
    price: 38,
    originalPrice: 45,
    status: 'sold-out',
    image: 'https://picsum.photos/seed/chain-pendant/800/800',
    description: 'Rantai stainless dengan logo R terukir.',
  },
  {
    id: '9',
    name: 'Blind Box Collectible',
    category: 'Collectibles',
    price: 55,
    status: 'sold-out',
    image: 'https://picsum.photos/seed/blind-box/800/800',
    description: 'Figur blind box edisi pertama — habis terjual.',
  },
  {
    id: '10',
    name: 'Sticker Pack (5)',
    category: 'Accessories',
    price: 15,
    status: 'available',
    image: 'https://picsum.photos/seed/sticker-pack/800/800',
    description: 'Paket 5 sticker vinyl weatherproof.',
  },
  {
    id: '11',
    name: 'Keychain Jelly',
    category: 'Accessories',
    price: 20,
    status: 'available',
    image: 'https://picsum.photos/seed/keychain/800/800',
    description: 'Gantungan kunci resin transparan.',
  },
  {
    id: '12',
    name: 'Domination Blind Bag',
    category: 'Collectibles',
    price: 45,
    status: 'pre-order',
    image: 'https://picsum.photos/seed/blind-bag/800/800',
    description: 'Pre-order blind bag seri Domination — shipping Q2.',
  },
];

export const categories = ['All', 'Apparel', 'Headwear', 'Accessories', 'Collectibles'] as const;
