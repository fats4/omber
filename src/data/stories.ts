import type { FlatCoord } from '../game/world/flatCoords';

export interface StoryQuest {
  id: string;
  productId: string;
  productName: string;
  packageLabel: string;
  npcName: string;
  npcRole: string;
  position: FlatCoord;
  pickupLine: string;
  greetLine: string;
  thankLine: string;
  lore: {
    headline: string;
    paragraphs: string[];
    productLink: string;
  };
}

export const FARMHOUSE_POSITION: FlatCoord = { x: -6, z: -4 };
export const PLAYER_START: FlatCoord = { x: -1.5, z: 1.5 };

export const storyQuests: StoryQuest[] = [
  {
    id: 'shadow-denim',
    productId: '1',
    productName: 'Shadow Denim — Indigo',
    packageLabel: 'Benih Indigo',
    npcName: 'Kai',
    npcRole: 'Tailor di sudut kota',
    position: { x: 11, z: -9 },
    pickupLine: 'Benih indigo deep — kain denim RENAOMBER butuh waktu tumbuh di tanah lembap.',
    greetLine: 'Akhirnya datang juga. Gue nungguin panen ini dari minggu lalu.',
    thankLine: 'Pas banget. Warnanya harus deep indigo — bukan biru biasa.',
    lore: {
      headline: 'Bayangan Pertama',
      paragraphs: [
        'Shadow Denim lahir dari ritual jalan pulang larut malam — saat lampu jalan jadi satu-satunya sumber cahaya dan siluet jadi bahasa.',
        'Kain 14oz dipilih karena harus punya berat di badan: tidak cuma tampil, tapi terasa. Wash indigo deep sengaja dibiarkan gelap supaya setiap lipatan punya depth sendiri.',
        'Setiap unit dicatat nomor produksinya. Bukan gimmick — itu bukti batch kecil, bukan fast fashion.',
      ],
      productLink: '#shop',
    },
  },
  {
    id: 'vortex-cap',
    productId: '3',
    productName: 'Vortex Dad Cap — Forest',
    packageLabel: 'Benih Spiral',
    npcName: 'Mira',
    npcRole: 'Collector & skater',
    position: { x: -11, z: 10 },
    pickupLine: 'Benih spiral hijau hutan — katanya kalau disiram saat senja, daunnya berputar cantik.',
    greetLine: 'Wih, panen Vortex-nya! Gue dengar spiral-nya tumbuh manual?',
    thankLine: 'Forest green-nya brutal. Pas sama vibe komunitas kita.',
    lore: {
      headline: 'Spiral Komunitas',
      paragraphs: [
        'Vortex spiral bukan dekorasi acak — itu metafora komunitas RENAOMBER: orbit yang sama, arah beda, tapi tetap satu pusat.',
        'Setiap dad cap dibordir di workshop kecil. Satu jarum, satu putaran — makanya tiap spiral sedikit unik.',
        'Warna Forest jadi penanda: kamu lihat topi itu di jalan, kamu tahu orang itu “dari orbit yang sama”.',
      ],
      productLink: '#shop',
    },
  },
  {
    id: 'blind-box',
    productId: '9',
    productName: 'Blind Box Collectible',
    packageLabel: 'Benih Mystery',
    npcName: 'Rio',
    npcRole: 'Archivist kolektor',
    position: { x: 13, z: 7 },
    pickupLine: 'Benih misterius — bungkusnya kecil, tapi hasil panennya selalu beda-beda.',
    greetLine: 'Blind Box edisi satu… Gue kumpulin semua variant, tapi ceritanya yang gue cari.',
    thankLine: 'Edisi pertama memang legenda. Sold out, tapi memorinya masih muter.',
    lore: {
      headline: 'Fragmen Memory',
      paragraphs: [
        'Blind Box edisi pertama dirancang bukan cuma figur — tiap variant bawa “memory fragment”: potongan lore tentang karakter RENAOMBER universe.',
        'Yang beli blind box sebenarnya ikut archaelogy drop: buka, temukan, kumpulkan cerita.',
        'Sold out bukan akhir — itu chapter satu. Collector yang sempat pegang figur ini jadi keeper awal mythos brand.',
      ],
      productLink: '#shop',
    },
  },
  {
    id: 'domination-bag',
    productId: '12',
    productName: 'Domination Blind Bag',
    packageLabel: 'Benih Arc',
    npcName: 'Sasha',
    npcRole: 'Curator drop berikutnya',
    position: { x: -9, z: -12 },
    pickupLine: 'Benih arc ungu — pre-order tanaman, teaser musim berikutnya.',
    greetLine: 'Domination series… Jadi ini awal arc baru?',
    thankLine: 'Oke. Gue siap nunggu Q2. Asal ceritanya sekuat visualnya.',
    lore: {
      headline: 'Arc Domination',
      paragraphs: [
        'Domination Blind Bag bukan sekadar seri kedua — ini pivot narrative: dari “memory fragments” ke konflik orbit, siapa yang define scene.',
        'Pre-order sengaja dibuka early supaya community ikut nulis bab berikutnya lewat tebakan, fan art, dan diskusi di Discord.',
        'Shipping Q2 — tapi ceritanya sudah mulai sekarang. Yang pre-order masuk ke daftar keeper drop berikutnya.',
      ],
      productLink: '#shop',
    },
  },
];

export const gameIntro = {
  title: 'RENAOMBER Ranch',
  lines: [
    'Selamat datang di ladang kecilmu — nuansa Harvest Moon: Back to Nature.',
    'Cangkul, tanam, siram setiap hari, panen, lalu antar hasil ke warga kota.',
    '1–4 ganti alat · WASD jalan · E pakai alat · Tidur malam di rumah.',
  ],
};

export const gameEpilogue = {
  title: 'Musim Panen Selesai',
  lines: [
    'Empat musim panen, empat cerita warga RENAOMBER.',
    'Ladang kecil ini baru permulaan — setiap drop brand menambah bab baru.',
    'Siap lihat produknya langsung?',
  ],
};

/** @deprecated use FARMHOUSE_POSITION */
export const HQ_POSITION = FARMHOUSE_POSITION;
