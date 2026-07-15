// ════════════════════════════════════════════════════════════
// POST /api/reviews — Yeni yorum gönder (misafir)
// ════════════════════════════════════════════════════════════
// Email doğrulama YOK. Rate limit + admin moderation ile korunur.
// ════════════════════════════════════════════════════════════

import { NextResponse } from 'next/server';
import { getServiceClient } from '@/lib/supabase/service';
import { checkRateLimit, getClientIP } from '@/lib/rate-limit';
import { kufurIceriyorMu } from '@/lib/profanity';

export const runtime = 'nodejs';

export async function POST(request) {
  // 1) Rate limit — 1 IP / 5 dakikada 1 yorum
  const ip = getClientIP(request);
  const rl = await checkRateLimit(ip, 'review', 1, 300);
  if (!rl.ok) {
    return NextResponse.json(
      { ok: false, error: 'rate_limit', retryAfter: rl.retryAfter },
      { status: 429 }
    );
  }

  // 2) Body parse
  let body;
  try { body = await request.json(); } catch (_) {
    return NextResponse.json({ ok: false, error: 'invalid_body' }, { status: 400 });
  }

  const { product_id, name, rating, text, locale = 'tr' } = body;

  // 3) Validation
  if (!product_id || typeof product_id !== 'string') {
    return NextResponse.json({ ok: false, error: 'product_id_required' }, { status: 400 });
  }
  if (!name || typeof name !== 'string' || name.trim().length < 2 || name.length > 60) {
    return NextResponse.json({ ok: false, error: 'name_invalid' }, { status: 400 });
  }
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return NextResponse.json({ ok: false, error: 'rating_invalid' }, { status: 400 });
  }
  if (!text || typeof text !== 'string' || text.trim().length < 5 || text.length > 1000) {
    return NextResponse.json({ ok: false, error: 'text_invalid' }, { status: 400 });
  }

  // 4) Küfür filtresi
  if (kufurIceriyorMu(name) || kufurIceriyorMu(text)) {
    return NextResponse.json({ ok: false, error: 'profanity' }, { status: 400 });
  }

  // 5) v11.6 GÜVENLİK: Ürün var mı kontrol et — spam reviews engeli
  const svc = getServiceClient();
  if (!svc) {
    return NextResponse.json({ ok: false, error: 'service_unavailable' }, { status: 503 });
  }
  const { data: urun, error: urunHata } = await svc
    .from('products')
    .select('id')
    .eq('id', product_id)
    .eq('is_active', true)
    .maybeSingle();
  if (urunHata || !urun) {
    return NextResponse.json({ ok: false, error: 'product_not_found' }, { status: 404 });
  }

  // 6) Ekle
  const { error } = await svc.from('reviews').insert({
    product_id,
    name: name.trim().slice(0, 60),
    rating,
    text: text.trim().slice(0, 1000),
    locale: ['tr', 'en', 'de'].includes(locale) ? locale : 'tr',
  });

  if (error) {
    console.error('[api/reviews] DB insert error:', error.message);
    return NextResponse.json({ ok: false, error: 'db_error' }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
