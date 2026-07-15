// ════════════════════════════════════════════════════════════
// Next.js Middleware — i18n locale routing + admin auth
// ════════════════════════════════════════════════════════════
// İki şey yapar:
//  1) i18n locale routing (next-intl middleware)
//  2) Admin route koruması (Supabase auth)
//
// Sıra önemli: önce locale belirlenir, sonra auth kontrol edilir.
// ════════════════════════════════════════════════════════════

import createMiddleware from 'next-intl/middleware';
import { updateSession } from './lib/supabase/middleware.js';
import { locales, defaultLocale, localePrefix } from './lib/i18n/config.js';

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix,
  // SEO için: tarayıcı dili Accept-Language'dan otomatik tespit edilsin
  localeDetection: true,
});

export async function middleware(request) {
  const path = request.nextUrl.pathname;

  // Admin ve API yolları locale-aware değil — direkt auth kontrol
  // NOT: /giris [locale] segmenti içinde olduğu için intl middleware'e bırakıyoruz
  if (path.startsWith('/admin') || path.startsWith('/api')) {
    return await updateSession(request);
  }

  // Diğer (public) yollar + /giris: i18n middleware
  return intlMiddleware(request);
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|llms.txt|sw.js|manifest.webmanifest|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
