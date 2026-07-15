// ════════════════════════════════════════════════════════════
// Supabase Edge Function: keepalive
// ════════════════════════════════════════════════════════════
// Supabase free tier 90 gün hareketsizlikte DB'yi kapatır.
// Bu fonksiyon her 3 günde bir çağrılarak DB'yi canlı tutar.
//
// KURULUM:
//   supabase functions deploy keepalive
//   Ardından: Supabase Dashboard → Database → Webhooks
//   veya Vercel Cron: her 3 günde bir bu URL'i çağır
//
// URL: https://<proje>.supabase.co/functions/v1/keepalive
// ════════════════════════════════════════════════════════════

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

Deno.serve(async (_req) => {
  try {
    const { data, error } = await supabase.rpc('keepalive_ping');
    if (error) throw error;
    return new Response(JSON.stringify({ ok: true, ...data }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ ok: false, error: String(err) }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});
