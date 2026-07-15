// ════════════════════════════════════════════════════════════
// Admin / Pazarlama — Server Component (v51)
// ════════════════════════════════════════════════════════════
// Pixel ID yönetimi + katalog feed + kampanya raporu.
// ════════════════════════════════════════════════════════════

export const dynamic = 'force-dynamic';

import { createClient } from '@/lib/supabase/server';
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

  // Kampanya raporu (son 30 gün) — view yoksa (sql/19 çalışmadıysa) boş geç
  let kampanyalar = [];
  try {
    const { data, error } = await supabase
      .from('pazarlama_kampanya_ozeti')
      .select('*')
      .order('whatsapp_tiklama', { ascending: false })
      .limit(50);
    if (!error && data) kampanyalar = data;
  } catch (_) { /* sql/19 henüz çalışmamış olabilir */ }

  return (
    <PazarlamaPaneli
      ayarlarId={ayarlar?.id || null}
      ilkTracking={ayarlar?.tracking || {}}
      kampanyalar={kampanyalar}
    />
  );
}
