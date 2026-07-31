// ════════════════════════════════════════════════════════════
// Admin / Yorumlar — Server Component (sayfalama + SQL sekme sayımları)
// ════════════════════════════════════════════════════════════
// Eskiden limit(200) + JS'te sekme sayımları → 200'den fazla yorumda
// sessiz veri kaybı ve yanlış sayım. Artık:
//   • sekme sayımları SQL head:true count (tüm kayıtlar üzerinden doğru)
//   • filtreye göre range() ile sayfalama
// ════════════════════════════════════════════════════════════

import { createClient } from '@/lib/supabase/server';
import YorumlarYonetim from './YorumlarYonetim';

export const dynamic = 'force-dynamic';

const SAYFA_BOYUTU = 50;

export default async function YorumlarSayfa({ searchParams }) {
  const supabase = createClient();

  const sayfa = Math.max(1, parseInt(searchParams?.sayfa, 10) || 1);
  const filtre = ['all', 'shown', 'hidden'].includes(searchParams?.filtre)
    ? searchParams.filtre
    : 'all';
  const from = (sayfa - 1) * SAYFA_BOYUTU;
  const to = from + SAYFA_BOYUTU - 1;

  // Sekme sayımları — 2 ucuz head:true count (satır çekmez); shown = all - hidden.
  const [tumuRes, gizliRes] = await Promise.all([
    supabase.from('reviews').select('id', { count: 'exact', head: true }),
    supabase.from('reviews').select('id', { count: 'exact', head: true }).eq('is_hidden', true),
  ]);
  // DB hatasını "0 yorum" gibi gösterme — hata ekranına düş (Agent #54).
  if (tumuRes.error) throw tumuRes.error;
  if (gizliRes.error) throw gizliRes.error;
  const toplamAll = tumuRes.count || 0;
  const toplamHidden = gizliRes.count || 0;
  const toplamShown = Math.max(0, toplamAll - toplamHidden);

  // Filtreye göre sayfa satırları.
  let q = supabase
    .from('reviews')
    .select('*, products(name, slug)')
    .order('created_at', { ascending: false });
  if (filtre === 'shown') q = q.eq('is_hidden', false);
  else if (filtre === 'hidden') q = q.eq('is_hidden', true);
  const { data, error } = await q.range(from, to);
  if (error) throw error;

  const toplamFiltre = filtre === 'hidden' ? toplamHidden : filtre === 'shown' ? toplamShown : toplamAll;

  return (
    <YorumlarYonetim
      baslangic={data || []}
      sayimlar={{ all: toplamAll, shown: toplamShown, hidden: toplamHidden }}
      filtre={filtre}
      sayfa={sayfa}
      sayfaBoyutu={SAYFA_BOYUTU}
      toplam={toplamFiltre}
    />
  );
}
