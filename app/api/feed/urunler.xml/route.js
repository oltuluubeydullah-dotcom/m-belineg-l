// ════════════════════════════════════════════════════════════
// Ürün Katalog Feed — /api/feed/urunler.xml (v51)
// ════════════════════════════════════════════════════════════
// Google Merchant RSS 2.0 formatı. Meta (Facebook/Instagram) ve
// TikTok katalogları da bu formatı doğrudan kabul eder → TEK feed.
// Reklam ajansı bu URL'i platform kataloğuna yapıştırır:
//   https://mobelinegol.com/api/feed/urunler.xml
// 1 saat cache (revalidate) — DB'yi yormaz, ürünler güncel kalır.
// ════════════════════════════════════════════════════════════

import { createClient } from '@supabase/supabase-js';

export const revalidate = 3600; // 1 saat

const SITE = (process.env.NEXT_PUBLIC_SITE_URL || 'https://mobelinegol.com').replace(/\/$/, '');

function xmlKacir(str) {
  return String(str || '')
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&apos;')
    // Kontrol karakterleri XML'i bozar
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, '');
}

function duzMetin(html) {
  return String(html || '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

export async function GET() {
  let urunler = [];
  try {
    const sb = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      { auth: { persistSession: false, autoRefreshToken: false } }
    );
    const { data, error } = await sb
      .from('products')
      .select('id, name, slug, description, images, base_price, sale_price, is_on_sale, is_active, categories!category_id(name)')
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(2000);
    if (error) throw error;
    urunler = data || [];
  } catch (err) {
    console.warn('[feed] ürünler çekilemedi:', err?.message);
    // Boş ama geçerli feed dön — platformlar hata yerine boş katalog görür
  }

  const items = urunler
    .filter((u) => u.name && u.slug && u.images?.[0]) // görselsiz ürün katalogda reddedilir
    .map((u) => {
      const fiyat = u.is_on_sale && u.sale_price ? u.sale_price : u.base_price;
      const link = `${SITE}/urun/${u.slug}`;
      const aciklama = duzMetin(u.description).slice(0, 4900) || u.name;
      return `  <item>
    <g:id>${xmlKacir(u.id)}</g:id>
    <g:title>${xmlKacir(String(u.name).slice(0, 150))}</g:title>
    <g:description>${xmlKacir(aciklama)}</g:description>
    <g:link>${xmlKacir(link)}</g:link>
    <g:image_link>${xmlKacir(u.images[0])}</g:image_link>${
      (u.images || []).slice(1, 6).map((g) => `\n    <g:additional_image_link>${xmlKacir(g)}</g:additional_image_link>`).join('')
    }
    <g:availability>in_stock</g:availability>
    <g:condition>new</g:condition>
    <g:brand>Möbel İnegöl</g:brand>${
      fiyat ? `\n    <g:price>${Number(fiyat).toFixed(2)} TRY</g:price>` : ''
    }${
      u.is_on_sale && u.sale_price && u.base_price ? `\n    <g:sale_price>${Number(u.sale_price).toFixed(2)} TRY</g:sale_price>` : ''
    }${
      u.categories?.name ? `\n    <g:product_type>${xmlKacir(u.categories.name)}</g:product_type>` : ''
    }
    <g:identifier_exists>false</g:identifier_exists>
  </item>`;
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
<channel>
  <title>Möbel İnegöl — Ürün Kataloğu</title>
  <link>${SITE}</link>
  <description>İnegöl mobilya — reklam platformları için ürün feed'i (by ubivo)</description>
${items}
</channel>
</rss>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=600',
    },
  });
}
