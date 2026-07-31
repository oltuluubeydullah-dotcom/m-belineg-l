// ════════════════════════════════════════════════════════════
// WhatsApp Şablonları — Server-side fetch (cache'li)
// ════════════════════════════════════════════════════════════
// Server bileşenler bu fonksiyonu çağırır; React cache() sayesinde
// aynı istek içinde birden çok çağrı olsa da DB'ye TEK sorgu gider.
// createPublicClient cookie'siz/anon olduğu için static generation'da
// güvenlidir (build-time prerender'da patlamaz). Hata olursa varsayılan
// şablonlar döner — site asla WhatsApp linkleri olmadan kalmaz.
// ════════════════════════════════════════════════════════════

import { cache } from 'react';
import { createPublicClient } from '@/lib/supabase/public';
import { sablonlariNormalize } from '@/lib/whatsapp';

export const whatsappSablonlariniGetir = cache(async () => {
  try {
    const supabase = createPublicClient();
    const { data } = await supabase
      .from('whatsapp_templates')
      .select('key, template_tr, template_en, template_de');
    return sablonlariNormalize(data);
  } catch {
    // DB erişilemedi (ör. env yok / ağ) → profesyonel varsayılanlar
    return sablonlariNormalize(null);
  }
});
