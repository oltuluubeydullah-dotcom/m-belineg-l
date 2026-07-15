// ════════════════════════════════════════════════════════════
// CMS Helper — content_pages tablosundan içerik çek
// ════════════════════════════════════════════════════════════

import { createPublicClient } from '@/lib/supabase/public';

/**
 * Slug'a göre içerik sayfasını dön, locale uygulanır.
 * @returns {Promise<{title:string, content:string, meta_title?:string, meta_desc?:string}|null>}
 */
export async function getContentPage(slug, locale = 'tr') {
  try {
    const supabase = createPublicClient();
    const { data } = await supabase
      .from('content_pages')
      .select('title, content, translations, meta_title, meta_desc')
      .eq('slug', slug)
      .eq('is_published', true)
      .maybeSingle();

    if (!data) return null;

    // Locale uygulaması
    let title = data.title;
    let content = data.content;
    let metaTitle = data.meta_title;
    let metaDesc = data.meta_desc;

    if (locale !== 'tr' && data.translations?.[locale]) {
      title = data.translations[locale].title || title;
      content = data.translations[locale].content || content;
      metaTitle = data.translations[locale].meta_title || metaTitle;
      metaDesc = data.translations[locale].meta_desc || metaDesc;
    }

    return { title, content, meta_title: metaTitle, meta_desc: metaDesc };
  } catch (_) {
    return null;
  }
}

/**
 * HTML özel karakterlerini escape et — stored XSS koruması.
 * Admin içeriğindeki ham <script> vb. zararsız metne döner.
 */
function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Link href güvenliği — sadece güvenli şemalara izin ver.
 * javascript:, data:, vbscript: gibi vektörleri '#' ile etkisizleştirir.
 */
function guvenliUrl(url) {
  const u = String(url || '').trim();
  if (/^(https?:|mailto:|tel:|\/|#)/i.test(u)) return u;
  return '#';
}

/**
 * Çok basit Markdown → HTML (GÜVENLİ).
 * v13.0: Önce TÜM girdi escape edilir → admin içeriğine gömülü ham HTML
 * (örn. <script>) artık çalışmaz. Markdown etiketlerini biz üretiriz.
 * Bağımlılık eklemeden temel desteği sağlar:
 * - # Başlık → <h1>   - **kalın** → <strong>   - *italik* → <em>
 * - [link](url) → <a> (şema kontrollü)  - - list → <ul>  - boş satır → paragraf
 */
export function markdownToHtml(md) {
  if (!md) return '';
  // 1) ÖNCE escape — ham HTML enjeksiyonunu öldür
  let html = escapeHtml(md);
  // Headings
  html = html.replace(/^### (.*?)$/gm, '<h3>$1</h3>');
  html = html.replace(/^## (.*?)$/gm, '<h2>$1</h2>');
  html = html.replace(/^# (.*?)$/gm, '<h1>$1</h1>');
  // Bold + italic
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/(?<!\*)\*([^\*]+)\*(?!\*)/g, '<em>$1</em>');
  // Links — href şema kontrolünden geçer
  html = html.replace(/\[([^\]]+)\]\(([^\)]+)\)/g, (m, metin, url) =>
    `<a href="${guvenliUrl(url)}" class="text-brand-gold hover:underline">${metin}</a>`);
  // Lists
  html = html.replace(/^- (.+)$/gm, '<li>$1</li>');
  html = html.replace(/(<li>.*?<\/li>(\n)?)+/g, (m) => `<ul class="list-disc pl-5 my-3">${m.replace(/\n/g, '')}</ul>`);
  // Paragraphs (split on double newlines)
  html = html.split(/\n\n+/).map((blk) => {
    blk = blk.trim();
    if (!blk) return '';
    if (blk.startsWith('<h') || blk.startsWith('<ul') || blk.startsWith('<ol')) return blk;
    return `<p>${blk.replace(/\n/g, '<br/>')}</p>`;
  }).join('\n');
  return html;
}
