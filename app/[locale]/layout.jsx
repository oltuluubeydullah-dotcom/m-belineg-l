// ════════════════════════════════════════════════════════════
// [locale] Layout — html/body + i18n + Providers
// K-01 FIX: html lang attribute locale'a göre dinamik.
// Y-03 FIX: openGraph.locale locale'a göre override.
// Y-05 FIX: Schema.org tüm değerler env/constants'tan.
// ════════════════════════════════════════════════════════════

import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { locales } from '@/lib/i18n/config';
import { ISLETME } from '@/lib/constants';
import Providers from '@/app/providers';
import Analytics from '@/components/public/Analytics';
import VercelAnalytics from '@/components/public/VercelAnalytics';
import SentryInit from '@/components/public/SentryInit';
import ServiceWorkerRegister from '@/components/public/ServiceWorkerRegister';
import PageTracker from '@/components/public/PageTracker';
import PixelScripts from '@/components/public/PixelScripts';
import { createPublicClient } from '@/lib/supabase/public';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
const OG_LOCALES = { tr: 'tr_TR', en: 'en_US', de: 'de_DE' };

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params: { locale } }) {
  return {
    openGraph: {
      locale: OG_LOCALES[locale] || 'tr_TR',
    },
    alternates: {
      canonical: locale === 'tr' ? SITE_URL : `${SITE_URL}/${locale}`,
      languages: {
        tr: SITE_URL,
        en: `${SITE_URL}/en`,
        de: `${SITE_URL}/de`,
      },
    },
  };
}

export default async function LocaleLayout({ children, params: { locale } }) {
  if (!locales.includes(locale)) notFound();

  setRequestLocale(locale);

  const messages = await getMessages();

  // v51: Pazarlama pixel ID'leri (admin panelden). Hata = pixel yok, site çalışır.
  let tracking = null;
  try {
    const sb = createPublicClient();
    const { data } = await sb.from('settings').select('tracking').limit(1).maybeSingle();
    tracking = data?.tracking || null;
  } catch (_) { /* placeholder env / kolon henüz yok — sessiz geç */ }

  const _telDigits = (ISLETME.tel || '').replace(/\D/g, '').replace(/^0/, '').replace(/^90/, '');
  const telE164 = _telDigits ? `+90${_telDigits}` : undefined;

  const orgSchema = {
    '@context': 'https://schema.org',
    '@type': 'FurnitureStore',
    '@id': SITE_URL,
    name: ISLETME.ad,
    image: `${SITE_URL}/marka/mobel-logo.png`,
    logo:  `${SITE_URL}/marka/mobel-logo.png`,
    url: SITE_URL,
    description: 'İnegöl (Bursa) merkezli mobilya mağazası. Koltuk takımı, yatak odası, yemek odası ve daha fazlası. Tüm Türkiye ve Avrupa ülkelerine nakliye + kurulum.',
    slogan: ISLETME.slogan || 'Evinize Değer Katar',
    priceRange: '₺₺',
    currenciesAccepted: 'TRY, EUR',
    address: {
      '@type': 'PostalAddress',
      streetAddress:   process.env.NEXT_PUBLIC_BUSINESS_STREET  || '',
      addressLocality: process.env.NEXT_PUBLIC_BUSINESS_CITY   || 'İnegöl',
      addressRegion:   process.env.NEXT_PUBLIC_BUSINESS_REGION || 'Bursa',
      postalCode:      process.env.NEXT_PUBLIC_BUSINESS_ZIP    || '16400',
      addressCountry:  'TR',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude:  ISLETME.mapLat || '40.07660',
      longitude: ISLETME.mapLng || '29.51540',
    },
    hasMap: ISLETME.mapShort || undefined,
    telephone: telE164,
    email: ISLETME.email || undefined,
    knowsLanguage: ['tr', 'en', 'de'],
    // GEO: AI/yerel aramada "Avrupa'ya teslimat" eşleşmesi için hizmet bölgesi
    areaServed: [
      { '@type': 'Country', name: 'Türkiye' },
      { '@type': 'Country', name: 'Almanya' },
      { '@type': 'Country', name: 'Fransa' },
      { '@type': 'Country', name: 'Belçika' },
      { '@type': 'Country', name: 'Hollanda' },
      { '@type': 'Country', name: 'İsviçre' },
      { '@type': 'Country', name: 'İngiltere' },
      { '@type': 'Country', name: 'Avusturya' },
      { '@type': 'Country', name: 'Bulgaristan' },
    ],
    sameAs: [
      ISLETME.instagram ? `https://instagram.com/${ISLETME.instagram}` : null,
      ISLETME.facebook  || null,
    ].filter(Boolean),
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday','Tuesday','Wednesday','Thursday','Friday'],
        opens: '09:00', closes: '19:00',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Saturday','Sunday'],
        opens: '10:00', closes: '20:00',
      },
    ],
  };

  return (
    <>
      <Providers>
        <NextIntlClientProvider locale={locale} messages={messages}>
          {children}
        </NextIntlClientProvider>
      </Providers>
      <Analytics />
      <PixelScripts tracking={tracking} />
      <PageTracker />
      <VercelAnalytics />
      <SentryInit />
      <ServiceWorkerRegister />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema).replace(/</g, '\\u003c') }}
      />
      {/* v43 AEO: WebSite + SearchAction — Google sitelinks arama kutusu + AI motorlarına site yapısı */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            '@id': `${SITE_URL}#website`,
            url: SITE_URL,
            name: ISLETME.ad,
            inLanguage: ['tr', 'en', 'de'],
            publisher: { '@id': SITE_URL },
            potentialAction: {
              '@type': 'SearchAction',
              target: { '@type': 'EntryPoint', urlTemplate: `${SITE_URL}/urunler?q={search_term_string}` },
              'query-input': 'required name=search_term_string',
            },
          }).replace(/</g, '\\u003c'),
        }}
      />
    </>
  );
}
