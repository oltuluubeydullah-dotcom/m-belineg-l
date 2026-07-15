// ════════════════════════════════════════════════════════════
// PixelScripts — Meta + TikTok + Google Ads (v51)
// ════════════════════════════════════════════════════════════
// ID'ler admin panelden (settings.tracking) gelir — deploy gerekmez.
// KVKK / Consent Mode:
//   • Google: Consent Mode v2 (Analytics.jsx kurar) — denied başlar.
//   • Meta:   fbq('consent','revoke') ile başlar, izinle 'grant'.
//   • TikTok: izin gelmeden script hiç YÜKLENMEZ (revoke API'si zayıf).
// CookieConsent 'all' seçilince: window.__mobelConsentGranted() çağrılır.
// ════════════════════════════════════════════════════════════
'use client';

import Script from 'next/script';
import { useEffect, useState } from 'react';

const CONSENT_KEY = 'mobel-cookie-consent';

export default function PixelScripts({ tracking }) {
  const metaId = tracking?.meta_pixel_id?.trim();
  const tiktokId = tracking?.tiktok_pixel_id?.trim();
  const googleAdsId = tracking?.google_ads_id?.trim();

  const [izinli, setIzinli] = useState(false);

  useEffect(() => {
    try { setIzinli(localStorage.getItem(CONSENT_KEY) === 'all'); } catch (_) {}
    // CookieConsent kabul anında tetikler:
    const dinle = () => setIzinli(true);
    window.addEventListener('mobel-consent-granted', dinle);
    return () => window.removeEventListener('mobel-consent-granted', dinle);
  }, []);

  // Meta: izin gelince consent grant
  useEffect(() => {
    if (izinli && typeof window !== 'undefined' && window.fbq) {
      try { window.fbq('consent', 'grant'); } catch (_) {}
    }
  }, [izinli]);

  if (!metaId && !tiktokId && !googleAdsId) return null;

  return (
    <>
      {/* ── Meta Pixel (Instagram + Facebook) ── */}
      {metaId && (
        <Script id="meta-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
            n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
            document,'script','https://connect.facebook.net/en_US/fbevents.js');
            fbq('consent', '${izinliJs()}' === 'true' ? 'grant' : 'revoke');
            fbq('init', '${escapeId(metaId)}');
            fbq('track', 'PageView');
          `}
        </Script>
      )}

      {/* ── TikTok Pixel — sadece izin sonrası yüklenir ── */}
      {tiktokId && izinli && (
        <Script id="tiktok-pixel" strategy="afterInteractive">
          {`
            !function (w, d, t) {
              w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var i="https://analytics.tiktok.com/i18n/pixel/events.js";ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=i,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};var o=document.createElement("script");o.type="text/javascript",o.async=!0,o.src=i+"?sdkid="+e+"&lib="+t;var a=document.getElementsByTagName("script")[0];a.parentNode.insertBefore(o,a)}(window, document, 'ttq');
              ttq.load('${escapeId(tiktokId)}');
              ttq.page();
            }(window, document, 'ttq');
          `}
        </Script>
      )}

      {/* ── Google Ads dönüşüm etiketi (YouTube + Arama + Display) ── */}
      {/* GA4 zaten Analytics.jsx'te; burada sadece Ads config eklenir. */}
      {googleAdsId && (
        <Script id="google-ads-config" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            if (!window.gtag) window.gtag = gtag;
            gtag('config', '${escapeId(googleAdsId)}');
          `}
        </Script>
      )}
      {/* GA4 hiç kurulmadıysa Ads etiketi için base script gerekir */}
      {googleAdsId && (
        <Script
          strategy="afterInteractive"
          src={`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(googleAdsId)}`}
        />
      )}
    </>
  );

  // İlk render'da consent durumu (script string içinde kullanılıyor)
  function izinliJs() { return izinli ? 'true' : 'false'; }
}

// ID'leri script içine gömerken XSS guard — sadece güvenli karakterler
function escapeId(id) {
  return String(id).replace(/[^A-Za-z0-9_\-\/]/g, '');
}
