// ════════════════════════════════════════════════════════════
// gorselSrc — Görsel URL normalizer (v44)
// ════════════════════════════════════════════════════════════
// AMAÇ: DB'de kayıtlı eski r2.dev URL'lerini, render anında canlı
//   CDN domainine (NEXT_PUBLIC_R2_PUBLIC_URL) çevirir.
//   → R2 custom domain'e geçiş TEK env değişimi olur, DB elleme yok,
//     tek bir görsel bile bozulmaz.
//
// DAVRANIŞ:
//   • env yoksa → URL olduğu gibi döner (hiçbir şey değişmez)
//   • Supabase / diğer URL'ler → DOKUNULMAZ (sadece R2 hostları çevrilir)
//   • zaten doğru base'deyse → dokunulmaz
//
// GÜVENLİ: aws-sdk import etmez → client component'lerde de kullanılabilir.
// by ubivo
// ════════════════════════════════════════════════════════════

const R2_BASE = (process.env.NEXT_PUBLIC_R2_PUBLIC_URL || '').replace(/\/+$/, '');

// R2 public host'ları: pub-xxx.r2.dev  ·  <account>.r2.cloudflarestorage.com
const R2_HOST_RE = /^https?:\/\/[^/]*\.r2\.(?:dev|cloudflarestorage\.com)(\/[^\s]*)?$/i;

/**
 * @param {string} url  DB'den gelen görsel URL'i
 * @returns {string}    Canlı CDN domainine normalize edilmiş URL
 */
export function gorselSrc(url) {
  if (!url || typeof url !== 'string') return url;
  if (!R2_BASE) return url;                 // env ayarlı değil → değişiklik yok
  if (url.startsWith(R2_BASE)) return url;  // zaten doğru domain

  const m = url.match(R2_HOST_RE);
  if (!m) return url;                       // R2 değil (Supabase vb.) → dokunma

  const path = m[1] || '';                  // host'tan sonraki yol
  return `${R2_BASE}${path}`;
}
