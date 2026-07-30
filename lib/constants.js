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
  email:     process.env.NEXT_PUBLIC_BUSINESS_EMAIL    || 'mobelinegol16@gmail.com',
  adres:     process.env.NEXT_PUBLIC_BUSINESS_ADDRESS  || 'Wobilimo AVM, 2. Kat No.122, İnegöl / Bursa',
  adresTam:  process.env.NEXT_PUBLIC_BUSINESS_ADDRESS_FULL || 'Wobilimo AVM, 2. Kat No.122, İnegöl / Bursa',
  // Telefon / WhatsApp — tek numara
  tel:       process.env.NEXT_PUBLIC_BUSINESS_PHONE    || '05360400118',
  tel2:      process.env.NEXT_PUBLIC_BUSINESS_PHONE2   || '',
  // WhatsApp — ülke kodu dahil, + olmadan
  whatsapp:  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER   || '905360400118',
  instagram: process.env.NEXT_PUBLIC_INSTAGRAM_HANDLE  || 'mobelinegol',
  facebook:  process.env.NEXT_PUBLIC_FACEBOOK_URL      || 'https://www.facebook.com/102441879046107/',
  // Google Maps — koordinat konumu (kesin pin sahiplikçe doğrulanmalı)
  mapLat:    process.env.NEXT_PUBLIC_MAP_LAT           || '40.07660',
  mapLng:    process.env.NEXT_PUBLIC_MAP_LNG           || '29.51540',
  mapQuery:  process.env.NEXT_PUBLIC_MAP_QUERY         || 'Möbel İnegöl Wobilimo AVM İnegöl',
  mapShort:  '',
};

export const SOSYAL_MEDYA = {
  instagram: `https://www.instagram.com/mobelinegol?igsh=OWh3YWZqM2RyNTVt`,
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
