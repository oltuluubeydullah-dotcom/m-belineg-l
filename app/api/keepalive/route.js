// ════════════════════════════════════════════════════════════
// API Route: /api/keepalive
// Vercel Cron tarafından her 3 günde bir çağrılır.
// Supabase free tier'ı uyku moduna girmeden korur.
// ════════════════════════════════════════════════════════════

import { createClient } from '@supabase/supabase-js';

export const runtime = 'edge';

const CRON_SECRET = process.env.CRON_SECRET;

export async function GET(request) {
  // Güvenlik: CRON_SECRET ZORUNLU. Set edilmemişse endpoint kapalı
  // (eski davranış: secret yoksa kontrol atlanıyordu → herkese açıktı).
  if (!CRON_SECRET) {
    console.error('[keepalive] CRON_SECRET tanımlı değil — endpoint devre dışı.');
    return new Response('Service unavailable', { status: 503 });
  }
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 });
  }

  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    const { data, error } = await supabase.rpc('keepalive_ping');
    if (error) throw error;

    // Retention: 90 günden eski analytics satırlarını temizle.
    // Free tier 500MB DB'nin analytics büyümesiyle dolmasını önler.
    const RETENTION_DAYS = 90;
    const kesim = new Date(Date.now() - RETENTION_DAYS * 86400000).toISOString();
    const temizlik = {};
    for (const tablo of ['page_views', 'site_events']) {
      const { error: delErr } = await supabase.from(tablo).delete().lt('created_at', kesim);
      temizlik[tablo] = delErr ? `hata: ${delErr.message}` : 'temizlendi';
    }

    return Response.json({ ok: true, ts: new Date().toISOString(), temizlik, ...data });
  } catch (err) {
    console.error('[keepalive] Hata:', err);
    return Response.json({ ok: false, error: String(err) }, { status: 500 });
  }
}
