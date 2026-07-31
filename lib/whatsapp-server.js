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
    const { data, error } = await supabase
      .from('whatsapp_templates')
      .select('key, template_tr, template_en, template_de');
    // Hata olursa sessizce varsayılana düşme AMA iz bırak (admin canlıda kendi
    // şablonunu göremezse nedenini logdan anlayabilsin — Agent #54).
    if (error) console.error('[whatsapp] şablon fetch hatası, varsayılana düşüldü:', error.message);
    return sablonlariNormalize(data);
  } catch (e) {
    console.error('[whatsapp] şablon fetch istisnası, varsayılana düşüldü:', e?.message);
    return sablonlariNormalize(null);
  }
});
