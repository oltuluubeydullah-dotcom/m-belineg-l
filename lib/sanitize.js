// ════════════════════════════════════════════════════════════
// HTML Sanitizer — SSR-safe, sıfır bağımlılık
// ════════════════════════════════════════════════════════════
// DOMPurify browser-only çalışır, biz custom whitelist kullanıyoruz.
// Sadece izin verilen tag ve attribute'lara izin verir.
// Kötü niyetli script, onerror, javascript: gibi vektörleri siler.
// ════════════════════════════════════════════════════════════

const ALLOWED_TAGS = new Set([
  'b', 'strong', 'i', 'em', 'u', 'br', 'span', 'p',
  'a', 'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'h4',
]);

const ALLOWED_ATTRS = {
  a: ['href', 'class', 'target', 'rel'],
  span: ['class'],
  p: ['class'],
  li: ['class'],
};

const SAFE_URL_RE = /^(https?:|mailto:|tel:|\/|#)/i;

/**
 * Minimal HTML sanitizer — SSR ve CSR'de güvenli çalışır.
 * Tag whitelist + attribute whitelist + URL şema kontrolü.
 * @param {string} html - Sanitize edilecek HTML string
 * @returns {string} Temizlenmiş HTML
 */
export function sanitizeHtml(html) {
  if (!html || typeof html !== 'string') return '';

  // Tehlikeli pattern'leri direkt sil
  let clean = html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/javascript\s*:/gi, 'blocked:')
    .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')  // onerror, onclick vs.
    .replace(/on\w+\s*=\s*[^\s>]*/gi, '');

  // Tag whitelist — izin verilmeyen tag'leri içerikleriyle birlikte koru
  // sadece tag'i sil, içeriği koru
  clean = clean.replace(/<\/?([a-zA-Z][a-zA-Z0-9]*)\b[^>]*>/g, (match, tag) => {
    const lowerTag = tag.toLowerCase();
    if (!ALLOWED_TAGS.has(lowerTag)) {
      return ''; // izin verilmeyen tag → tamamen sil
    }

    // Closing tag
    if (match.startsWith('</')) return `</${lowerTag}>`;

    // Opening tag — attribute'ları filtrele
    const allowedAttrs = ALLOWED_ATTRS[lowerTag] || [];
    if (allowedAttrs.length === 0) return `<${lowerTag}>`;

    const attrs = [];
    for (const attr of allowedAttrs) {
      const attrRe = new RegExp(`${attr}\\s*=\\s*["']([^"']*)["']`, 'i');
      const m = match.match(attrRe);
      if (m) {
        let val = m[1];
        // href için URL şema kontrolü
        if (attr === 'href' && !SAFE_URL_RE.test(val.trim())) {
          val = '#';
        }
        // target="_blank" için rel="noopener" zorla
        if (attr === 'target' && val === '_blank') {
          attrs.push(`target="_blank"`);
          attrs.push(`rel="noopener noreferrer"`);
          continue;
        }
        attrs.push(`${attr}="${val}"`);
      }
    }

    return attrs.length > 0
      ? `<${lowerTag} ${attrs.join(' ')}>`
      : `<${lowerTag}>`;
  });

  return clean;
}
