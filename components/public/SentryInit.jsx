// ════════════════════════════════════════════════════════════
// SentryInit — Frontend hata izleme (opsiyonel)
// ════════════════════════════════════════════════════════════
// Sadece NEXT_PUBLIC_SENTRY_DSN set edilmişse yüklenir.
// Production'da hatalı kullanım dışı bug'ları otomatik raporlar.
// Bağımsız küçük kurulum — @sentry/nextjs paketi yoksa da çalışır.
// ════════════════════════════════════════════════════════════

'use client';

import { useEffect } from 'react';

export default function SentryInit() {
  useEffect(() => {
    const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;
    if (!dsn) return; // Sentry kurulu değilse hiçbir şey yapma

    // Sadece production'da yükle (dev'de bug yapışmasın)
    if (process.env.NODE_ENV !== 'production') return;

    // Sentry script'ini dinamik olarak yükle
    const s = document.createElement('script');
    s.src = 'https://browser.sentry-cdn.com/7.119.0/bundle.tracing.min.js';
    s.crossOrigin = 'anonymous';
    s.async = true;
    s.onload = () => {
      if (window.Sentry) {
        window.Sentry.init({
          dsn,
          tracesSampleRate: 0.1,
          environment: process.env.NODE_ENV,
          beforeSend(event) {
            // Bilinen "harmless" hataları atla
            const msg = event.exception?.values?.[0]?.value || '';
            if (msg.includes('ResizeObserver loop')) return null;
            if (msg.includes('Non-Error promise rejection')) return null;
            return event;
          },
        });
      }
    };
    document.head.appendChild(s);
  }, []);

  return null;
}
