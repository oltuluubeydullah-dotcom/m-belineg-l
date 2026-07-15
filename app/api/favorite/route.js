// ════════════════════════════════════════════════════════════
// API Route: /api/favorite
// K-05 FIX: Rate limit + UUID validation + request-scoped client
// POST: favori ekle/çıkar (toggle)
// GET:  bu session'ın favorilerini getir
// ════════════════════════════════════════════════════════════

import { createClient } from '@supabase/supabase-js';
import { checkRateLimit, getClientIP } from '@/lib/rate-limit';

export const runtime = 'nodejs';

// UUID v4 format kontrolü
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
function isUUID(s) {
  return typeof s === 'string' && UUID_RE.test(s);
}

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
}

export async function POST(request) {
  // 1) Rate limit — 1 IP'den dakikada 20 toggle
  const ip = getClientIP(request);
  const rl = await checkRateLimit(ip, 'favorite', 20, 60);
  if (!rl.ok) {
    return Response.json({ ok: false, error: 'rate_limit' }, { status: 429 });
  }

  // 2) Body parse
  let body;
  try { body = await request.json(); } catch (_) {
    return Response.json({ ok: false, error: 'invalid_body' }, { status: 400 });
  }

  const { productId, sessionId } = body || {};

  // 3) UUID format validation
  if (!isUUID(productId)) {
    return Response.json({ ok: false, error: 'invalid_product_id' }, { status: 400 });
  }
  if (!sessionId || typeof sessionId !== 'string' || sessionId.length < 8 || sessionId.length > 128) {
    return Response.json({ ok: false, error: 'invalid_session_id' }, { status: 400 });
  }

  try {
    const supabase = getSupabase();

    const { data: existing } = await supabase
      .from('product_favorites')
      .select('id')
      .eq('product_id', productId)
      .eq('session_id', sessionId)
      .maybeSingle();

    if (existing) {
      await supabase.from('product_favorites').delete()
        .eq('product_id', productId).eq('session_id', sessionId);
      return Response.json({ ok: true, action: 'removed' });
    } else {
      await supabase.from('product_favorites').insert({ product_id: productId, session_id: sessionId });
      return Response.json({ ok: true, action: 'added' });
    }
  } catch (err) {
    console.error('[api/favorite]', err);
    return Response.json({ ok: false, error: 'server_error' }, { status: 500 });
  }
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get('sessionId');

  if (!sessionId || typeof sessionId !== 'string' || sessionId.length < 8 || sessionId.length > 128) {
    return Response.json({ favorites: [] });
  }

  try {
    const supabase = getSupabase();
    const { data } = await supabase
      .from('product_favorites')
      .select('product_id')
      .eq('session_id', sessionId)
      .limit(200); // Max 200 favori per session

    return Response.json({ favorites: (data || []).map(r => r.product_id) });
  } catch (err) {
    console.error('[api/favorite GET]', err);
    return Response.json({ favorites: [] });
  }
}
