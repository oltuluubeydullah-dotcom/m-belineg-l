// ════════════════════════════════════════════════════════════
// API Route: /api/track-event
// Etkileşim olaylarını kaydeder (sepete ekleme, ürün tıklama vs.)
// page_views gibi: rate limit + bot filtresi + KVKK ip_hash.
// ════════════════════════════════════════════════════════════

import { createClient } from '@supabase/supabase-js';
import { checkRateLimit, getClientIP } from '@/lib/rate-limit';

export const runtime = 'nodejs';

const GECERLI_TIPLER = ['sepete_ekleme', 'urun_tiklama', 'whatsapp_tiklama'];

async function hashIp(ip) {
  if (!ip) return null;
  // GÜVENLİK/KVKK (v30): IP_SALT yoksa hash ATLA — sabit/tahmin edilebilir
  // tuz ('mobel2026') hash'lenmiş IP'yi geri-eşlenebilir kılardı.
  const salt = process.env.IP_SALT;
  if (!salt) return null;
  const encoder = new TextEncoder();
  const data = encoder.encode(ip + salt);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');
}

export async function POST(request) {
  try {
    // 1) Rate limit — 1 IP'den dakikada 60 olay
    const ip = getClientIP(request);
    const rl = await checkRateLimit(ip, 'track-event', 60, 60);
    if (!rl.ok) return Response.json({ ok: true, skipped: 'rate_limit' });

    // 2) Body
    let body;
    try { body = await request.json(); } catch (_) {
      return Response.json({ ok: false }, { status: 400 });
    }
    const { event_type, product_id, path, locale, utm_source, utm_medium, utm_campaign } = body || {};
    if (!GECERLI_TIPLER.includes(event_type)) {
      return Response.json({ ok: false, error: 'invalid_event' }, { status: 400 });
    }

    // 3) Bot filtresi
    const ua = request.headers.get('user-agent') || '';
    if (/bot|crawler|spider|googlebot|bingbot|slurp|duckduck|prerender|headless/i.test(ua)) {
      return Response.json({ ok: true, skipped: 'bot' });
    }

    // 4) KVKK ip_hash
    const ipHash = await hashIp(ip);

    // 5) Insert
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    // product_id geçerli UUID değilse null bırak (FK güvenliği)
    const uuidRe = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    const pid = typeof product_id === 'string' && uuidRe.test(product_id) ? product_id : null;

    // v51: UTM güvenli kısaltma (string + uzunluk limiti, injection riski yok)
    const utmTemiz = (v, max) => (typeof v === 'string' && v.trim() ? v.trim().slice(0, max) : null);

    await supabase.from('site_events').insert({
      event_type,
      product_id: pid,
      path: path ? String(path).substring(0, 500) : null,
      ip_hash: ipHash,
      locale: ['tr', 'en', 'de'].includes(locale) ? locale : 'tr',
      utm_source: utmTemiz(utm_source, 80),
      utm_medium: utmTemiz(utm_medium, 80),
      utm_campaign: utmTemiz(utm_campaign, 120),
    });

    return Response.json({ ok: true });
  } catch (err) {
    console.error('[track-event]', err);
    return Response.json({ ok: false }, { status: 500 });
  }
}
