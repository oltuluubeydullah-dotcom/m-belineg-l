// ════════════════════════════════════════════════════════════
// Content Security Policy Helper
// ════════════════════════════════════════════════════════════
// next.config.js'teki statik CSP'nin yanı sıra,
// middleware'den çağrılarak per-request nonce üretilebilir.
// Şu an nonce kullanılmıyor ama altyapı hazır.
// ════════════════════════════════════════════════════════════

/**
 * Güvenli random nonce üret (base64, 16 byte)
 * Edge runtime'da crypto.getRandomValues kullanılabilir.
 */
export function generateNonce() {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return Buffer.from(array).toString('base64');
}

/**
 * Open redirect validator — sadece site içi yönlendirmelere izin ver.
 * next parametresi veya redirect URL'leri için kullan.
 */
export function isSafeRedirect(url) {
  if (!url || typeof url !== 'string') return false;
  // Sadece relative path'e izin ver
  if (url.startsWith('/') && !url.startsWith('//')) return true;
  return false;
}
