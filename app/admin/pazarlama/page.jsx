// ════════════════════════════════════════════════════════════
// Admin / Pazarlama — Server Component (v51)
// ════════════════════════════════════════════════════════════
// Pixel ID yönetimi + katalog feed + kampanya raporu.
// ════════════════════════════════════════════════════════════

export const dynamic = 'force-dynamic';

import { createClient } from '@/lib/supabase/server';
import { getServiceClient } from '@/lib/supabase/service';
import PazarlamaPaneli from './PazarlamaPaneli';

export const metadata = {
  title: 'Pazarlama',
};

export default async function PazarlamaSayfasi() {
  const supabase = createClient();

  // Ayarlar (tracking jsonb)
  const { data: ayarlar } = await supabase
    .from('settings')
    .select('id, tracking')
    .limit(1)
    .maybeSingle();

  // Kampanya raporu (son 30 gün).
  // FIX (v58 · Ajan #16/#07): pazarlama_kampanya_ozeti view'ı authenticated
  // rolünden REVOKE edilmiş (sql/19). Admin (authenticated) ile SELECT hep
  // permission-denied dönüyor → panel "veri yok" gösteriyordu. Service-role
  // ile server-side oku (admin layout auth zaten üstte doğruluyor).
  let kampanyalar = [];
  try {
    const service = getServiceClient() || supabase;
    const { data, error } = await service
      .from('pazarlama_kampanya_ozeti')
      .select('*')
      .order('whatsapp_tiklama', { ascending: false })
      .limit(50);
    if (!error && data) kampanyalar = data;
    else if (error) console.error('[pazarlama] kampanya özeti okunamadı:', error.message);
  } catch (e) { console.error('[pazarlama] kampanya özeti hatası:', e?.message); }

  return (
    <PazarlamaPaneli
      ayarlarId={ayarlar?.id || null}
      ilkTracking={ayarlar?.tracking || {}}
      kampanyalar={kampanyalar}
    />
  );
}
