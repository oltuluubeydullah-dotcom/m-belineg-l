// ════════════════════════════════════════════════════════════
// Slug Helper — Türkçe karakterleri URL-uyumlu hale getirir
// ════════════════════════════════════════════════════════════
// "Yatak Odası" → "yatak-odasi"
// "Köşe Koltuk #1" → "kose-koltuk-1"
// Hem kategori hem ürün isimlerinde kullanılır.
// ════════════════════════════════════════════════════════════

const TR_MAP = {
  ı: 'i', İ: 'i', ş: 's', Ş: 's',
  ğ: 'g', Ğ: 'g', ü: 'u', Ü: 'u',
  ö: 'o', Ö: 'o', ç: 'c', Ç: 'c',
};

/**
 * Türkçe metni URL-uyumlu slug'a çevir.
 * @param {string} text
 * @returns {string}
 */
export function slugify(text) {
  if (!text) return '';
  return String(text)
    .split('')
    .map((ch) => TR_MAP[ch] ?? ch)
    .join('')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // diacritics
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

/**
 * Slug uniq mı kontrol et, değilse sonuna -2, -3 ekle.
 * @param {string} base - başlangıç slug
 * @param {Set<string>} mevcut - mevcut slug'lar
 * @returns {string}
 */
export function uniqueSlug(base, mevcut) {
  if (!mevcut.has(base)) return base;
  let i = 2;
  while (mevcut.has(`${base}-${i}`)) i++;
  return `${base}-${i}`;
}
