// ════════════════════════════════════════════════════════════
// GET /api/products/featured?page=2&pageSize=12
// ════════════════════════════════════════════════════════════
// Anasayfada "Sizin İçin Seçtiğimiz" bölümü için infinite scroll.
// Maks 3 sayfa = 36 ürün. Sonra "Tüm Koleksiyonu Gör" butonu.
//
// page=1 sayfada zaten SSR'de yüklendi (force-dynamic).
// page=2, page=3 client-side scroll ile gelir.
// page>3 reddedilir — kullanıcı kategori sayfasına yönlendirilsin.
// ════════════════════════════════════════════════════════════

import { NextResponse } from 'next/server';
import { createPublicClient } from '@/lib/supabase/public';

export const runtime = 'nodejs';

const MAX_PAGE = 3;
const PAGE_SIZE = 12;

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const page = Math.min(MAX_PAGE, Math.max(1, parseInt(searchParams.get('page') || '1', 10)));
  const pageSize = Math.min(20, Math.max(1, parseInt(searchParams.get('pageSize') || String(PAGE_SIZE), 10)));

  const supabase = createPublicClient();

  // Öne çıkan (kürasyon) ürün sayısı
  const { count: oneCikanSayi } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true })
    .eq('is_active', true)
    .eq('is_featured', true);

  const kurasyonVar = (oneCikanSayi || 0) > 0;

  // Toplam — son sayfa kontrolü için
  let toplamUrun = oneCikanSayi || 0;
  if (!kurasyonVar) {
    const { count } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true);
    toplamUrun = count || 0;
  }

  // Sayfa verisi: kürasyon varsa öne çıkanları admin sırasıyla, yoksa en yeni
  let q = supabase
    .from('products')
    .select('*, categories!category_id(name, slug, translations)')
    .eq('is_active', true);
  if (kurasyonVar) {
    q = q.eq('is_featured', true)
         .order('sort_order', { ascending: true })
         .order('created_at', { ascending: false });
  } else {
    q = q.order('created_at', { ascending: false });
  }
  const { data: havuzData } = await q.range((page - 1) * pageSize, page * pageSize - 1);

  const urunler = havuzData || [];

  return NextResponse.json({
    ok: true,
    page,
    pageSize,
    items: urunler,
    hasMore: page < MAX_PAGE && urunler.length === pageSize && toplamUrun > page * pageSize,
    maxPage: MAX_PAGE,
    totalCount: toplamUrun,
  });
}
