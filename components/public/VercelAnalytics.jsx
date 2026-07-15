// ════════════════════════════════════════════════════════════
// VercelAnalytics — Trafik + Web Vitals izleme (opsiyonel)
// ════════════════════════════════════════════════════════════
// NEXT_PUBLIC_VERCEL_ANALYTICS=true ise yüklenir.
// Vercel Dashboard'da otomatik görünür, ek kod gerekmez.
//
// İKİ ŞEY EKLER:
//   1) Page view tracking (Vercel Analytics)
//   2) Web Vitals (Core Web Vitals: LCP, FID, CLS)
//
// PAKET BAĞIMSIZ:
//   @vercel/analytics paketi kurulu DEĞİLSE bile crash yapmaz.
//   Production'da kurmak için: npm i @vercel/analytics @vercel/speed-insights
// ════════════════════════════════════════════════════════════

'use client';

import { useEffect } from 'react';

export default function VercelAnalytics() {
  useEffect(() => {
    if (process.env.NEXT_PUBLIC_VERCEL_ANALYTICS !== 'true') return;
    if (process.env.NODE_ENV !== 'production') return;

    // Dinamik import — paket yoksa sessizce skip
    // Webpack'in static analyzer'ı gözünden kaçırmak için string concat:
    const pkgA = '@vercel' + '/analytics';
    const pkgS = '@vercel' + '/speed-insights';

    (async () => {
      try {
        const mod = await import(/* webpackIgnore: true */ pkgA).catch(() => null);
        if (mod?.inject) mod.inject();
      } catch (_) { /* skip */ }

      try {
        const mod = await import(/* webpackIgnore: true */ pkgS).catch(() => null);
        if (mod?.injectSpeedInsights) mod.injectSpeedInsights();
      } catch (_) { /* skip */ }
    })();
  }, []);

  return null;
}
