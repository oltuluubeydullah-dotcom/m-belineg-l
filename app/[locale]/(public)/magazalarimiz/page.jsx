// ════════════════════════════════════════════════════════════
// Möbel İnegöl — Mağazalarımız Sayfası
// Haritaya tıklandığında Google Maps'te konuma gider
// ════════════════════════════════════════════════════════════

import { setRequestLocale } from 'next-intl/server';
import { IconMapPin, IconMail, IconClock, IconBrandWhatsapp } from '@tabler/icons-react';
import { ISLETME, SOSYAL_MEDYA } from '@/lib/constants';
import { genelDestekLinki } from '@/lib/whatsapp';

export const revalidate = 3600; // ISR: 3600s

export async function generateMetadata({ params: { locale } }) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://mobelinegol.com';
  const canonicalPath = locale === 'tr' ? '/magazalarimiz' : `/${locale}/magazalarimiz`;
  return {
    title: `Mağazamız | Möbel İnegöl`,
    description: `Möbel İnegöl mağaza adresi, çalışma saatleri ve iletişim bilgileri.`,
    alternates: {
      canonical: `${siteUrl}${canonicalPath}`,
      languages: {
        tr: `${siteUrl}/magazalarimiz`,
        en: `${siteUrl}/en/magazalarimiz`,
        de: `${siteUrl}/de/magazalarimiz`,
      },
    },
  };
}

// Google Maps deep link — place ID varsa daha güvenilir
function googleMapsUrl() {
  // Direkt kısa link — en doğru yönlendirme
  return 'https://maps.app.goo.gl/NEF3Afbmk8NQApkk9';
}

// Apple Maps (iOS'ta öncelikli açılır)
function appleMapsUrl() {
  return 'https://maps.apple.com/?ll=40.07660,29.51540&q=Möbel İnegöl+Mobilya';
}

export default async function MagazalarimizSayfasi({ params: { locale } }) {
  setRequestLocale(locale);
  const mapsUrl  = googleMapsUrl();
  const appleUrl = appleMapsUrl();

  return (
    <main className="container mx-auto px-4 py-12 md:py-20 max-w-4xl">
      <h1 className="font-display text-3xl md:text-5xl font-light text-brand-dark mb-2 tracking-tight">
        Mağaza<span className="italic text-brand-gold"> Adresimiz</span>
      </h1>
      <p className="text-brand-ink/60 mb-10">Bizi ziyaret edin, ürünlerimizi yakından inceleyin.</p>

      <div className="grid md:grid-cols-2 gap-6">

        {/* Harita kartı — tıklayınca konuma gider */}
        <a
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="group block bg-white rounded-3xl border border-brand-dark/8 shadow-card hover:shadow-card-h overflow-hidden transition-all"
          aria-label="Google Maps'te aç"
        >
          {/* Harita placeholder — Google Maps embed veya statik görsel */}
          <div className="h-56 bg-gradient-to-br from-brand-cream to-[#e8e0d4] flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-10"
              style={{
                backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'40\' height=\'40\' viewBox=\'0 0 40 40\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%23000\' fill-opacity=\'1\'%3E%3Ccircle cx=\'20\' cy=\'20\' r=\'1\'/%3E%3C/g%3E%3C/svg%3E")',
              }}
            />
            <div className="text-center z-10">
              <div className="w-16 h-16 rounded-full bg-red-500 flex items-center justify-center mx-auto mb-3 shadow-lg group-hover:scale-110 transition-transform">
                <IconMapPin size={32} className="text-white" />
              </div>
              <p className="font-semibold text-brand-dark text-sm">Haritada Görüntüle</p>
              <p className="text-xs text-brand-ink/50 mt-1">Google Maps'te açmak için tıklayın</p>
            </div>
          </div>

          <div className="p-5">
            <div className="flex items-start gap-3">
              <IconMapPin size={18} className="text-brand-gold mt-0.5 shrink-0" />
              <div>
                <p className="font-medium text-brand-dark text-sm">{ISLETME.adresTam}</p>
                <p className="text-xs text-brand-ink/50 mt-1">Yol tarifi almak için tıklayın →</p>
              </div>
            </div>
          </div>
        </a>

        {/* İletişim bilgileri */}
        <div className="space-y-4">
          {/* Çalışma saatleri */}
          <div className="bg-white rounded-2xl p-5 border border-brand-dark/8 shadow-card">
            <div className="flex items-center gap-2 mb-3">
              <IconClock size={18} className="text-brand-gold" />
              <h2 className="font-semibold text-brand-dark">Çalışma Saatleri</h2>
            </div>
            <div className="space-y-1.5 text-sm text-brand-ink/70">
              <div className="flex justify-between">
                <span>Pazartesi — Cuma</span>
                <span className="font-medium">09:00 – 19:00</span>
              </div>
              <div className="flex justify-between">
                <span>Cumartesi</span>
                <span className="font-medium">09:00 – 19:00</span>
              </div>
              <div className="flex justify-between">
                <span>Pazar</span>
                <span className="font-medium">10:00 – 18:00</span>
              </div>
            </div>
          </div>

          {/* İletişim */}
          <div className="bg-white rounded-2xl p-5 border border-brand-dark/8 shadow-card">
            <h2 className="font-semibold text-brand-dark mb-3">İletişim</h2>
            <div className="space-y-3">
              <a href={SOSYAL_MEDYA.whatsapp} target="_blank" rel="noopener noreferrer"
                 className="flex items-center gap-3 text-sm text-brand-ink/70 hover:text-green-600 transition-colors">
                <IconBrandWhatsapp size={18} className="text-green-500" />
                <span>WhatsApp: +{ISLETME.whatsapp}</span>
              </a>
              <a href={SOSYAL_MEDYA.email}
                 className="flex items-center gap-3 text-sm text-brand-ink/70 hover:text-brand-teal transition-colors">
                <IconMail size={18} className="text-brand-gold" />
                <span>{ISLETME.email}</span>
              </a>
            </div>
          </div>

          {/* WhatsApp CTA */}
          <a
            href={genelDestekLinki()}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-3.5 bg-green-500 hover:bg-green-600 text-white rounded-2xl font-semibold transition-colors"
          >
            <IconBrandWhatsapp size={20} />
            WhatsApp'tan Ulaşın
          </a>

          {/* Apple Maps butonu (mobil iOS için) */}
          <a
            href={appleUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-3 border border-brand-dark/20 text-brand-dark rounded-2xl text-sm hover:bg-brand-cream transition-colors"
          >
            <IconMapPin size={16} />
            Apple Maps'te Aç
          </a>
        </div>
      </div>
    </main>
  );
}
