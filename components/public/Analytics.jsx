// ════════════════════════════════════════════════════════════
// Analytics — Google Analytics 4 (consent-mode)
// ════════════════════════════════════════════════════════════
// Sadece NEXT_PUBLIC_GA_ID set edilmişse yüklenir.
// Çerez izni gelmeden 'denied' modda başlar (Consent Mode v2).
// CookieConsent kabul edilince granted'e geçer.
// ════════════════════════════════════════════════════════════

'use client';

import Script from 'next/script';

export default function Analytics() {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;
  if (!gaId) return null;

  return (
    <>
      {/* GA4 base script */}
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
      />
      <Script
        id="ga-consent-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            window.gtag = gtag;
            // Consent Mode v2 — başlangıçta denied
            gtag('consent', 'default', {
              ad_storage: 'denied',
              analytics_storage: 'denied',
              ad_user_data: 'denied',
              ad_personalization: 'denied',
              wait_for_update: 500,
            });
            // Eğer kullanıcı daha önce kabul ettiyse — restore
            try {
              if (localStorage.getItem('mobel-cookie-consent') === 'all') {
                gtag('consent', 'update', {
                  ad_storage: 'granted',
                  analytics_storage: 'granted',
                });
              }
            } catch(e) {}
            gtag('js', new Date());
            gtag('config', '${gaId}', { anonymize_ip: true });
          `,
        }}
      />
    </>
  );
}
