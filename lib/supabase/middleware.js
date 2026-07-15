// ════════════════════════════════════════════════════════════
// Supabase Client — Middleware (route koruması için)
// ════════════════════════════════════════════════════════════
// Next.js middleware.js'ten çağrılır, her istekte oturumu yeniler.
// ════════════════════════════════════════════════════════════

import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import { isAdminUser } from '../auth/admin.js';
import { isSafeRedirect } from '../csp.js';

export async function updateSession(request) {
  let response = NextResponse.next({
    request: { headers: request.headers },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        get(name) {
          return request.cookies.get(name)?.value;
        },
        set(name, value, options) {
          request.cookies.set({ name, value, ...options });
          response = NextResponse.next({ request: { headers: request.headers } });
          response.cookies.set({ name, value, ...options });
        },
        remove(name, options) {
          request.cookies.set({ name, value: '', ...options });
          response = NextResponse.next({ request: { headers: request.headers } });
          response.cookies.set({ name, value: '', ...options });
        },
      },
    }
  );

  // Oturum yenile (refresh token rotation)
  const { data: { user } } = await supabase.auth.getUser();

  // /admin/* sayfalarına gizli erişimi engelle
  const path = request.nextUrl.pathname;
  const adminYolu  = path.startsWith('/admin') || path.startsWith('/api/admin');
  const girisYolu  = path === '/giris';

  if (adminYolu && !user) {
    // Giriş yapmamış kullanıcıyı login'e yönlendir
    const url = request.nextUrl.clone();
    url.pathname = '/giris';
    // Open redirect koruması: sadece site içi yolları next parametresi olarak geçir
    if (isSafeRedirect(path)) {
      url.searchParams.set('next', path);
    }
    return NextResponse.redirect(url);
  }

  // v11.6 GÜVENLİK: Giriş yapmış olmak yetmez — email ALLOWLIST'te olmalı.
  // Supabase'de signup açık olursa kötü niyetli aktör 'authenticated'
  // JWT alır ama allowlist'te olmadığı için admin'e giremez.
  if (adminYolu && user && !isAdminUser(user)) {
    // Oturumu sonlandır + giriş sayfasına at
    try { await supabase.auth.signOut(); } catch (_) {}
    const url = request.nextUrl.clone();
    url.pathname = '/giris';
    url.searchParams.set('error', 'unauthorized');
    return NextResponse.redirect(url);
  }

  if (girisYolu && user && isAdminUser(user)) {
    // Yetkili admin zaten giriş yapmışsa /admin'e yönlendir
    const url = request.nextUrl.clone();
    url.pathname = '/admin';
    return NextResponse.redirect(url);
  }

  return response;
}
