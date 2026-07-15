// ════════════════════════════════════════════════════════════
// POST /api/auth/login — Server-side login + rate limit
// ════════════════════════════════════════════════════════════
// NEDEN: Client-side Supabase signIn brute force'a açık.
// Supabase kendi rate limit'i var ama IP bazlı ekstra koruma ekliyoruz.
// ════════════════════════════════════════════════════════════

import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { checkRateLimit, getClientIP } from '@/lib/rate-limit';
import { isAdminEmail } from '@/lib/auth/admin';

export const runtime = 'nodejs';

export async function POST(request) {
  const ip = getClientIP(request);

  // 5 dakikada 5 deneme — brute force koruması
  const rl = await checkRateLimit(ip, 'login', 5, 300);
  if (!rl.ok) {
    return NextResponse.json(
      { ok: false, error: 'too_many_attempts', retryAfter: rl.retryAfter },
      { status: 429 }
    );
  }

  let body;
  try { body = await request.json(); } catch (_) {
    return NextResponse.json({ ok: false, error: 'invalid_body' }, { status: 400 });
  }

  const { email, password } = body || {};

  // Temel validasyon
  if (!email || typeof email !== 'string' || !email.includes('@')) {
    return NextResponse.json({ ok: false, error: 'invalid_email' }, { status: 400 });
  }
  if (!password || typeof password !== 'string' || password.length < 6) {
    return NextResponse.json({ ok: false, error: 'invalid_password' }, { status: 400 });
  }

  // Allowlist ön kontrolü — allowlist'te değilse Supabase'e bile gitme
  // (timing attack'ı önlemek için küçük gecikme ekle)
  if (!isAdminEmail(email)) {
    await new Promise(r => setTimeout(r, 300)); // timing normalization
    return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 403 });
  }

  // Supabase Auth — server-side, SSR client cookie'leri response'a yazar.
  // MOBİL FIX: Eskiden token JSON ile dönüp cookie'yi client setSession yazıyordu;
  // iOS Safari'de cookie flush'ı window.location yönlendirmesine yetişmeyince
  // middleware taze cookie'yi göremiyor → /giris'e geri atıyordu (mobilde giriş yok).
  // Artık signInWithPassword başarılı olunca session cookie'leri Set-Cookie ile
  // SERVER'da yazılır → navigation timing'inden bağımsız, mobilde de çalışır.
  const cookieJar = [];
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() { return request.cookies.getAll(); },
        setAll(cookiesToSet) { cookieJar.push(...cookiesToSet); },
      },
    }
  );

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error || !data.session) {
    // Başarısız deneme — rate limit sayacı zaten artırdı
    return NextResponse.json(
      { ok: false, error: 'invalid_credentials' },
      { status: 401 }
    );
  }

  // TUTARLILIK: Middleware admin kontrolü email_confirmed_at zorunlu tutuyor.
  // Onaysız email ile "başarılı" görünüp /admin'de geri atılmasını önlemek için
  // aynı kontrolü burada da yapıp net mesaj veriyoruz.
  if (data.user && !data.user.email_confirmed_at) {
    try { await supabase.auth.signOut(); } catch (_) {}
    return NextResponse.json(
      { ok: false, error: 'email_not_confirmed' },
      { status: 403 }
    );
  }

  // Başarılı — session cookie'lerini response'a Set-Cookie ile ekle (server-side yazım)
  // + token'ı da dön (client setSession'ı in-memory state için best-effort günceller).
  const out = NextResponse.json({
    ok: true,
    access_token: data.session.access_token,
    refresh_token: data.session.refresh_token,
    expires_at: data.session.expires_at,
  });
  cookieJar.forEach(({ name, value, options }) => out.cookies.set(name, value, options));
  return out;
}
