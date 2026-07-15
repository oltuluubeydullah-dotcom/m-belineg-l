// ════════════════════════════════════════════════════════════
// Admin / Kategoriler — Server Component
// ════════════════════════════════════════════════════════════

export const dynamic = 'force-dynamic';

import { createClient } from '@/lib/supabase/server';
import KategorilerYonetim from './KategorilerYonetim';

export const metadata = {
  title: 'Kategori Yönetimi',
};

export default async function KategorilerSayfasi() {
  const supabase = createClient();

  // Tüm kategorileri çek (admin görür, aktif/pasif fark etmez)
  const { data: kategoriler } = await supabase
    .from('categories')
    .select('*')
    .order('sort_order', { ascending: true });

  // Her kategorideki ürün sayısı
  const { data: urunSayilari } = await supabase
    .from('products')
    .select('category_id', { count: 'exact' });

  // Map oluştur: { kategori_id: count }
  const sayim = {};
  (urunSayilari || []).forEach((u) => {
    sayim[u.category_id] = (sayim[u.category_id] || 0) + 1;
  });

  return (
    <KategorilerYonetim
      ilkKategoriler={kategoriler || []}
      urunSayilari={sayim}
    />
  );
}
