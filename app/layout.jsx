// ════════════════════════════════════════════════════════════
// Möbel İnegöl - Kök Layout
// Next.js App Router'da TEK gerçek root layout burasıdır.
// html/body sadece burada bulunmalı; alt layout'lar html/body üretmemeli.
// ════════════════════════════════════════════════════════════

// ─── Self-hosted font (build-safe, ağ bağımsız) ───
// Poppins → tüm site (başlık + gövde + ürün sayfaları) tek font, geometrik sans
import '@fontsource/poppins/300.css';
import '@fontsource/poppins/400.css';
import '@fontsource/poppins/500.css';
import '@fontsource/poppins/600.css';
import '@fontsource/poppins/700.css';
import '@fontsource/poppins/400-italic.css';
import '@fontsource/poppins/600-italic.css';
import '@/app/globals.css';
import { headers } from 'next/headers';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
const LANG_MAP = { tr: 'tr', en: 'en', de: 'de' };

export const metadata = {
  title: {
    default: 'Möbel İnegöl — Evinize Değer Katar',
    template: '%s | Möbel İnegöl',
  },
  description:
    'Kaliteli mobilya modelleri, yurtiçi ve yurtdışı teslimat imkânı. ' +
    'Yatak odası, koltuk takımı, yemek odası ve daha fazlası.',
  keywords: [
    'mobel mobilya', 'mobilya', 'yatak odası', 'koltuk takımı',
    'yemek odası', 'köşe koltuk', 'mobilya türkiye',
    'yurtdışı mobilya', 'avrupa mobilya teslimat',
  ],
  authors: [{ name: 'by ubivo' }],
  metadataBase: new URL(SITE_URL),
  openGraph: {
    type: 'website',
    locale: 'tr_TR',
    siteName: 'Möbel İnegöl',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Möbel İnegöl — Evinize Değer Katar' }],
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
    other: [
      { rel: 'android-chrome', url: '/android-chrome-192x192.png', sizes: '192x192' },
      { rel: 'android-chrome', url: '/android-chrome-512x512.png', sizes: '512x512' },
    ],
  },
  robots: { index: true, follow: true },
  // v37: Deploy doğrulama — canlı sitede sağ tık > Kaynağı Görüntüle ile
  // "mobel-version" aranır. v36'nın canlıya geçip geçmediği belirsizliği
  // bir daha yaşanmasın diye eklendi.
  other: {
    'mobel-version': 'v51',
    'mobel-build': process.env.NEXT_PUBLIC_BUILD_ID || 'unknown',
  },
};

export const viewport = {
  themeColor: '#1A1A1A',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }) {
  // next-intl middleware her isteğe x-next-intl-locale header'ı ekler.
  // Root layout'ta html/body olmalı (App Router kuralı) ama lang'ı da
  // locale'a göre dinamik vermek için header'dan okuyoruz.
  const headersList = headers();
  const locale = headersList.get('x-next-intl-locale') || 'tr';
  const lang = LANG_MAP[locale] || 'tr';

  return (
    <html lang={lang} suppressHydrationWarning>
      <head>
        {/* v51 PERF: görsel host'larına erken bağlantı — ilk görselde ~150-300ms kazanç */}
        {process.env.NEXT_PUBLIC_R2_PUBLIC_URL && (
          <>
            <link rel="preconnect" href={process.env.NEXT_PUBLIC_R2_PUBLIC_URL} crossOrigin="anonymous" />
            <link rel="dns-prefetch" href={process.env.NEXT_PUBLIC_R2_PUBLIC_URL} />
          </>
        )}
        {process.env.NEXT_PUBLIC_SUPABASE_URL && (
          <link rel="preconnect" href={process.env.NEXT_PUBLIC_SUPABASE_URL} crossOrigin="anonymous" />
        )}
      </head>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
