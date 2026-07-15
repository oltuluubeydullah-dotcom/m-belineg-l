// ════════════════════════════════════════════════════════════
// PageTracker — Her sayfa değişiminde /api/track-view çağırır
// ════════════════════════════════════════════════════════════
'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { utmYakala, utmGetir } from '@/lib/pazarlama';

export default function PageTracker() {
  const pathname = usePathname();
  const lastTracked = useRef('');

  useEffect(() => {
    if (!pathname || pathname === lastTracked.current) return;
    lastTracked.current = pathname;

    // Admin ve giriş sayfalarını takip etme
    if (pathname.includes('/admin') || pathname.includes('/giris')) return;

    // Locale'i pathname'den çıkar (/en/... veya /de/... veya /...)
    const localeMatch = pathname.match(/^\/(en|de)\//);
    const locale = localeMatch ? localeMatch[1] : 'tr';

    // v51: reklam linkindeki utm_* parametrelerini yakala (ilk dokunuş)
    utmYakala();
    const utm = utmGetir();

    const referrer = typeof document !== 'undefined' ? document.referrer : '';

    fetch('/api/track-view', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path: pathname, referrer, locale, ...utm }),
    }).catch(() => {});
  }, [pathname]);

  return null;
}
