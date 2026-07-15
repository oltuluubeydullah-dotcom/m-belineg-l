// ════════════════════════════════════════════════════════════
// API Route: /api/track-view
// K-04 FIX: Rate limiting eklendi (30 req/dk per IP)
// ════════════════════════════════════════════════════════════

import { createClient } from '@supabase/supabase-js';
import { checkRateLimit, getClientIP } from '@/lib/rate-limit';

export const runtime = 'nodejs';

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
    // 1) Rate limit — 1 IP'den dakikada 30 view max
    const ip = getClientIP(request);
    const rl = await checkRateLimit(ip, 'track-view', 30, 60);
    if (!rl.ok) {
      // Sessiz 200 dön — kullanıcıya hata gösterme
      return Response.json({ ok: true, skipped: 'rate_limit' });
    }

    // 2) Body parse
    let body;
    try { body = await request.json(); } catch (_) {
      return Response.json({ ok: false }, { status: 400 });
    }
    const { path, referrer, locale, utm_source, utm_medium, utm_campaign } = body;
    if (!path || typeof path !== 'string') {
      return Response.json({ ok: false }, { status: 400 });
    }

    // 3) Bot/crawler filtresi
    const ua = request.headers.get('user-agent') || '';
    if (/bot|crawler|spider|googlebot|bingbot|slurp|duckduck|prerender|headless/i.test(ua)) {
      return Response.json({ ok: true, skipped: 'bot' });
    }

    // 4) IP hash (KVKK uyumlu)
    const ipHash = await hashIp(ip);

    // 5) Insert
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    // v51: UTM güvenli kısaltma
    const utmTemiz = (v, max) => (typeof v === 'string' && v.trim() ? v.trim().slice(0, max) : null);

    await supabase.from('page_views').insert({
      path: path.substring(0, 500),
      referrer: referrer ? String(referrer).substring(0, 500) : null,
      user_agent: ua.substring(0, 300),
      ip_hash: ipHash,
      locale: ['tr', 'en', 'de'].includes(locale) ? locale : 'tr',
      utm_source: utmTemiz(utm_source, 80),
      utm_medium: utmTemiz(utm_medium, 80),
      utm_campaign: utmTemiz(utm_campaign, 120),
    });

    return Response.json({ ok: true });
  } catch (err) {
    console.error('[track-view]', err);
    return Response.json({ ok: false }, { status: 500 });
  }
}
