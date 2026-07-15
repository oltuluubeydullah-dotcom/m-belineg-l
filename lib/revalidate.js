// ════════════════════════════════════════════════════════════
// Revalidate Helper — ISR cache temizleme
// ════════════════════════════════════════════════════════════
// Admin CRUD sonrası ilgili sayfaların ISR cache'ini temizler.
// Fire-and-forget — hata olursa sessizce devam et.
// ════════════════════════════════════════════════════════════

/**
 * Belirtilen yolların ISR cache'ini temizle.
 * @param {string[]} paths - Temizlenecek URL yolları
 */
export async function revalidatePaths(paths) {
  try {
    await fetch('/api/admin/revalidate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ paths }),
    });
  } catch (_) {
    // Cache temizleme hatası kritik değil — sessizce geç
  }
}

/** Ürün güncelleme/ekleme sonrası temizlenecek yollar */
export function urunRevalidatePaths(slug, categorySlug) {
  const paths = ['/', '/tr', '/en', '/de'];
  if (slug) {
    paths.push(`/urun/${slug}`, `/en/urun/${slug}`, `/de/urun/${slug}`);
  }
  if (categorySlug) {
    paths.push(`/kategori/${categorySlug}`, `/en/kategori/${categorySlug}`, `/de/kategori/${categorySlug}`);
  }
  return paths;
}

/** Kategori güncelleme sonrası temizlenecek yollar */
export function kategoriRevalidatePaths(slug) {
  return [
    '/', '/tr', '/en', '/de',
    ...(slug ? [`/kategori/${slug}`, `/en/kategori/${slug}`, `/de/kategori/${slug}`] : []),
  ];
}

/** Blog güncelleme sonrası temizlenecek yollar */
export function blogRevalidatePaths(slug) {
  return [
    '/blog', '/en/blog', '/de/blog',
    ...(slug ? [`/blog/${slug}`, `/en/blog/${slug}`, `/de/blog/${slug}`] : []),
  ];
}

/**
 * Tüm site (ana sayfa + 3 dil). Ayarlar (telefon/WhatsApp/adres),
 * hero banner, yorumlar gibi her sayfada görünen veriler için.
 * revalidate API'si '/' için 'layout' da temizlediğinden header/footer dahil yenilenir.
 */
export function tumSiteRevalidatePaths() {
  return ['/', '/tr', '/en', '/de'];
}
