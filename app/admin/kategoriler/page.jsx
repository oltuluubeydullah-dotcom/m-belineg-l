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

  // Her kategorideki ürün sayısı.
  // PERF (Ajan #05): eskiden TÜM ürünlerin category_id'si çekilip JS'te
  // sayılıyordu (katalog büyüdükçe yavaşlar). Artık kategori başına
  // head:true count — satır taşınmaz, hepsi paralel.
  const sayim = {};
  const kats = kategoriler || [];
  const sayimlar = await Promise.all(
    kats.map((k) =>
      supabase.from('products').select('id', { count: 'exact', head: true }).eq('category_id', k.id)
        .then((r) => ({ id: k.id, count: r.count || 0 }))
        .catch(() => ({ id: k.id, count: 0 }))
    )
  );
  sayimlar.forEach(({ id, count }) => { sayim[id] = count; });

  return (
    <KategorilerYonetim
      ilkKategoriler={kategoriler || []}
      urunSayilari={sayim}
    />
  );
}
