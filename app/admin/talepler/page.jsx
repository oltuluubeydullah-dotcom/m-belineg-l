// ════════════════════════════════════════════════════════════
// Admin / Talepler — Server Component (sunucu tarafı sayfalama + arama)
// ════════════════════════════════════════════════════════════
// Eskiden select('*').limit(200) → 200'den fazla talepte sessiz veri kaybı
// ve arama yalnızca yüklenen 200 satırda çalışıyordu. Artık:
//   • range() ile sayfalama + exact count (tüm kayıtlar üzerinden doğru sayım)
//   • arama (ad/telefon/adres) SUNUCUDA (ilike) → tüm veritabanında arar
// ════════════════════════════════════════════════════════════

export const dynamic = 'force-dynamic';

import { createClient } from '@/lib/supabase/server';
import TaleplerListe from './TaleplerListe';

export const metadata = {
  title: 'Müşteri Talepleri',
};

const SAYFA_BOYUTU = 50;

export default async function TaleplerSayfasi({ searchParams }) {
  const supabase = createClient();

  const sayfa = Math.max(1, parseInt(searchParams?.sayfa, 10) || 1);
  const arama = (searchParams?.q || '').trim();
  // PostgREST or() filtresini bozan karakterleri temizle (virgül/parantez/joker).
  const aramaTemiz = arama.replace(/[,()*%\\]/g, ' ').trim();

  const from = (sayfa - 1) * SAYFA_BOYUTU;
  const to = from + SAYFA_BOYUTU - 1;

  let query = supabase
    .from('inquiries')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false });

  if (aramaTemiz) {
    const kalip = `*${aramaTemiz}*`;
    query = query.or(
      `customer_name.ilike.${kalip},customer_phone.ilike.${kalip},customer_address.ilike.${kalip}`,
    );
  }

  const { data: talepler, count } = await query.range(from, to);

  return (
    <TaleplerListe
      ilkTalepler={talepler || []}
      toplam={count || 0}
      sayfa={sayfa}
      sayfaBoyutu={SAYFA_BOYUTU}
      arama={arama}
    />
  );
}
