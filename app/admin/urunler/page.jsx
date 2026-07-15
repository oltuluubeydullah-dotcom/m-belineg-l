// ════════════════════════════════════════════════════════════
// Admin / Ürünler — Server Component
// ════════════════════════════════════════════════════════════
// İlk render için ürünleri ve kategorileri Supabase'ten çeker,
// client component'e initial data olarak verir.
// ════════════════════════════════════════════════════════════

export const dynamic = 'force-dynamic';

import { createClient } from '@/lib/supabase/server';
import UrunlerYonetim from './UrunlerYonetim';

export const metadata = {
  title: 'Ürün Yönetimi',
};

export default async function UrunlerSayfasi() {
  const supabase = createClient();

  // v37 PERFORMANS (Agent 24): Eskiden TÜM ürünler tek seferde çekiliyordu
  // (ağır description/variants/translations dahil) → ürün sayısı arttıkça panel
  // açılışı yavaşlıyordu. Artık ilk 100 + toplam sayı; gerisi client'tan
  // "Daha Fazla Yükle" ile gelir, arama eksik listede sunucudan yapılır.
  // NOT: '*' bilinçli korunuyor (v36 dersi: açık kolon listesi canlı şemada
  // olmayan kolona denk gelirse sorgu komple patlıyor).
  const SAYFA_BOYU = 100;
  const [urunlerRes, kategorilerRes] = await Promise.all([
    supabase
      .from('products')
      .select('*, categories!category_id(name, slug)', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(0, SAYFA_BOYU - 1),
    supabase.from('categories').select('*').order('sort_order', { ascending: true }),
  ]);

  return (
    <UrunlerYonetim
      ilkUrunler={urunlerRes.data || []}
      toplamSayi={urunlerRes.count ?? (urunlerRes.data || []).length}
      sayfaBoyu={SAYFA_BOYU}
      kategoriler={kategorilerRes.data || []}
    />
  );
}
