// ════════════════════════════════════════════════════════════
// PWA Manifest — manifest.webmanifest
// ════════════════════════════════════════════════════════════
// Telefonda "Ana ekrana ekle" desteği için.
// Next.js'in built-in manifest fonksiyonu.
// ════════════════════════════════════════════════════════════

export default function manifest() {
  return {
    name: 'Möbel İnegöl — İnegöl Mobilyası',
    short_name: 'Möbel İnegöl',
    description: 'İnegöl mobilyası kalitesinde koltuk takımı, yatak odası, yemek odası ve daha fazlası. Tüm Türkiye ve Avrupa\'ya teslimat.',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    orientation: 'portrait',
    background_color: '#FAF8F3',
    theme_color: '#1A1A1A',
    lang: 'tr-TR',
    icons: [
      { src: '/favicon-192x192.png',         sizes: '192x192', type: 'image/png' },
      { src: '/favicon-512x512.png',         sizes: '512x512', type: 'image/png' },
      { src: '/android-chrome-192x192.png',  sizes: '192x192', type: 'image/png', purpose: 'any maskable' },
      { src: '/android-chrome-512x512.png',  sizes: '512x512', type: 'image/png', purpose: 'any maskable' },
      { src: '/apple-touch-icon.png',        sizes: '180x180', type: 'image/png' },
    ],
    categories: ['shopping', 'lifestyle', 'business'],
  };
}
