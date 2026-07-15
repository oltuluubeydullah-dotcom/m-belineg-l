// ════════════════════════════════════════════════════════════
// Möbel İnegöl - Sabitler
// ════════════════════════════════════════════════════════════

export const KATEGORILER = [
  { name: 'Koltuk Takımı',       slug: 'koltuk-takimi'     },
  { name: 'Köşe Koltuk',         slug: 'kose-koltuk'       },
  { name: 'Yatak Odası',         slug: 'yatak-odasi'       },
  { name: 'Yemek Odası',         slug: 'yemek-odasi'       },
  { name: 'TV Ünitesi',          slug: 'tv-unitesi'        },
  { name: 'Bebek & Genç Odası',  slug: 'bebek-genc-odasi'  },
  { name: 'Masa Sandalye Set',   slug: 'masa-sandalye-set' },
  { name: 'Sehpa & Aksesuar',    slug: 'sehpa-aksesuar'    },
];

export const ISLETME = {
  ad:        process.env.NEXT_PUBLIC_BUSINESS_NAME     || 'Möbel İnegöl',
  slogan:    process.env.NEXT_PUBLIC_BUSINESS_TAGLINE  || 'Evinize Değer Katar',
  email:     process.env.NEXT_PUBLIC_BUSINESS_EMAIL    || 'info@mobelinegol.com',
  adres:     process.env.NEXT_PUBLIC_BUSINESS_ADDRESS  || 'İnegöl / Bursa',
  adresTam:  process.env.NEXT_PUBLIC_BUSINESS_ADDRESS_FULL || 'İnegöl / Bursa',
  // Telefon (çağrı için) — v42: iki numara
  tel:       process.env.NEXT_PUBLIC_BUSINESS_PHONE    || '05313477468',
  tel2:      process.env.NEXT_PUBLIC_BUSINESS_PHONE2   || '05343066592',
  // WhatsApp — ülke kodu dahil, + olmadan
  whatsapp:  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER   || '905360400108',
  instagram: process.env.NEXT_PUBLIC_INSTAGRAM_HANDLE  || 'mobelinegol',
  facebook:  process.env.NEXT_PUBLIC_FACEBOOK_URL      || '', // Möbel'in Facebook'u yok — env'den verilirse görünür
  // Google Maps — koordinat bazlı deep link
  // Kaynak: https://maps.app.goo.gl/NEF3Afbmk8NQApkk9
  mapLat:    process.env.NEXT_PUBLIC_MAP_LAT           || '40.07660',
  mapLng:    process.env.NEXT_PUBLIC_MAP_LNG           || '29.51540',
  mapQuery:  process.env.NEXT_PUBLIC_MAP_QUERY         || 'Möbel İnegöl+Mobilya+İnegöl',
  mapShort:  'https://maps.app.goo.gl/NEF3Afbmk8NQApkk9',
};

export const SOSYAL_MEDYA = {
  instagram: `https://www.instagram.com/mobelinegol?igsh=MW44cDZmbGs4aWdvOQ==`,
  whatsapp:  `https://wa.me/${ISLETME.whatsapp}`,
  facebook:  ISLETME.facebook,
  email:     `mailto:${ISLETME.email}`,
  tel:       `tel:+${ISLETME.whatsapp}`,
};

export const DUYURU_BARI = {
  metin: 'TÜM TÜRKİYE VE AVRUPA ÜLKELERİNE TESLİMAT',
  vurgu: 'TESLİMAT',
};

export const ROTALAR = {
  anasayfa:      '/',
  kategori:      (slug) => `/kategori/${slug}`,
  urun:          (slug) => `/urun/${slug}`,
  sepet:         '/sepet',
  checkout:      '/sepet/onayla',
  hakkimizda:    '/hakkimizda',
  iletisim:      '/iletisim',
  blog:          '/blog',
  magazalarimiz: '/magazalarimiz',
};

// Fotoğraf upload limitleri
export const FOTOGRAF = {
  maksimum:       25,
  maxBoyutMB:     50,
  kaliteMasaustu: 0.90,
  kaliteMobil:    0.85,
  maxPiksel:      2400,
};

// Sayfalama
export const URUN_SAYFA_BOYUTU = 24;

// localStorage anahtar isimleri
export const STORAGE_ANAHTARLARI = {
  sepet:    'mobel_sepet',
  favoriler: 'mobel_favoriler',
  dil:      'mobel_dil',
};
