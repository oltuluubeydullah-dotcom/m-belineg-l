// ════════════════════════════════════════════════════════════
// İletişim — /iletisim (TR/EN/DE)
// ════════════════════════════════════════════════════════════

export const revalidate = 3600; // ISR: 3600s

import {
  IconBrandWhatsapp, IconBrandInstagram, IconPhone, IconMail,
  IconMapPin, IconClock,
} from '@tabler/icons-react';
import PageHero from '@/components/public/PageHero';
import { ISLETME, SOSYAL_MEDYA } from '@/lib/constants';
import { genelDestekLinki } from '@/lib/whatsapp';
import { whatsappSablonlariniGetir } from '@/lib/whatsapp-server';

const MAPS_SORGU = encodeURIComponent('Möbel İnegöl Wobilimo AVM İnegöl');

const CEVIRI = {
  tr: {
    baslik: 'İletişim',
    altBaslik: 'Sorularınız için bize ulaşın — WhatsApp, telefon veya mağazamızı ziyaret edin.',
    waLabel: 'WhatsApp (önerilen)', waAlt: 'Tıkla, anında mesaj at',
    tel: 'Telefon', eposta: 'E-posta',
    adresLabel: 'Mağaza Adresimiz', mapsAc: "Google Haritalar'da Aç →",
    saatLabel: 'Çalışma Saatleri', magaza: 'Mağaza',
    hafta: 'Pazartesi - Cumartesi', pazar: 'Pazar',
    wa724: '💬 WhatsApp ise 7/24 açık — mesajınıza en kısa sürede dönüş yaparız.',
    yol: '📍 Yol Tarifi', yolAl: 'Yol Tarifi Al →', haritaTitle: 'Möbel İnegöl Konumu',
    metaDesc: 'Möbel İnegöl İletişim — Wobilimo AVM, İnegöl / Bursa. WhatsApp, telefon ve yol tarifi.',
  },
  en: {
    baslik: 'Contact',
    altBaslik: 'Get in touch — reach us on WhatsApp, by phone, or visit our store.',
    waLabel: 'WhatsApp (recommended)', waAlt: 'Tap to message us instantly',
    tel: 'Phone', eposta: 'Email',
    adresLabel: 'Our Store Address', mapsAc: 'Open in Google Maps →',
    saatLabel: 'Opening Hours', magaza: 'Store',
    hafta: 'Monday - Saturday', pazar: 'Sunday',
    wa724: '💬 WhatsApp is open 24/7 — we reply as soon as possible.',
    yol: '📍 Directions', yolAl: 'Get Directions →', haritaTitle: 'Möbel İnegöl Location',
    metaDesc: 'Contact Möbel İnegöl — Wobilimo AVM, İnegöl / Bursa. WhatsApp, phone and directions.',
  },
  de: {
    baslik: 'Kontakt',
    altBaslik: 'Kontaktieren Sie uns — über WhatsApp, telefonisch oder besuchen Sie unser Geschäft.',
    waLabel: 'WhatsApp (empfohlen)', waAlt: 'Tippen und sofort schreiben',
    tel: 'Telefon', eposta: 'E-Mail',
    adresLabel: 'Unsere Geschäftsadresse', mapsAc: 'In Google Maps öffnen →',
    saatLabel: 'Öffnungszeiten', magaza: 'Geschäft',
    hafta: 'Montag - Samstag', pazar: 'Sonntag',
    wa724: '💬 WhatsApp ist rund um die Uhr erreichbar — wir antworten schnellstmöglich.',
    yol: '📍 Wegbeschreibung', yolAl: 'Route berechnen →', haritaTitle: 'Möbel İnegöl Standort',
    metaDesc: 'Kontakt Möbel İnegöl — Wobilimo AVM, İnegöl / Bursa. WhatsApp, Telefon und Wegbeschreibung.',
  },
};

export async function generateMetadata({ params: { locale } }) {
  const L = CEVIRI[locale] || CEVIRI.tr;
  return { title: L.baslik, description: L.metaDesc };
}

export default async function IletisimSayfasi({ params: { locale } }) {
  const L = CEVIRI[locale] || CEVIRI.tr;
  const whatsappSablonlari = await whatsappSablonlariniGetir();
  return (
    <>
      <PageHero
        baslik={L.baslik}
        altBaslik={L.altBaslik}
        breadcrumb={[{ ad: L.baslik }]}
      />

      <section className="container mx-auto py-12 md:py-16">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* SOL: İletişim Bilgileri */}
          <div className="space-y-4">
            {/* WhatsApp */}
            <a
              href={genelDestekLinki(locale, whatsappSablonlari)}
              target="_blank"
              rel="noopener noreferrer"
              className="block bg-white rounded-2xl shadow-card border border-brand-dark/5 p-6 hover:border-green-500/30 transition-colors group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-green-100 text-green-600 flex items-center justify-center shrink-0">
                  <IconBrandWhatsapp size={24} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-brand-ink/50 uppercase tracking-wider font-medium">
                    {L.waLabel}
                  </p>
                  <p className="font-display text-xl font-semibold text-brand-dark group-hover:text-green-600 transition-colors">
                    +90 536 040 01 08
                  </p>
                  <p className="text-sm text-brand-ink/60 mt-1">
                    {L.waAlt}
                  </p>
                </div>
              </div>
            </a>

            {/* Telefon */}
            <a
              href="tel:+905360400108"
              className="block bg-white rounded-2xl shadow-card border border-brand-dark/5 p-6 hover:border-brand-gold/30 transition-colors group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-brand-gold/10 text-brand-gold flex items-center justify-center shrink-0">
                  <IconPhone size={22} />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-brand-ink/50 uppercase tracking-wider font-medium">
                    {L.tel}
                  </p>
                  <p className="font-display text-xl font-semibold text-brand-dark group-hover:text-brand-teal transition-colors">
                    +90 536 040 01 08
                  </p>
                </div>
              </div>
            </a>

            {/* E-posta */}
            <a
              href={`mailto:${ISLETME.email}`}
              className="block bg-white rounded-2xl shadow-card border border-brand-dark/5 p-6 hover:border-brand-gold/30 transition-colors group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-brand-gold/10 text-brand-gold flex items-center justify-center shrink-0">
                  <IconMail size={22} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-brand-ink/50 uppercase tracking-wider font-medium">
                    {L.eposta}
                  </p>
                  <p className="font-medium text-brand-dark group-hover:text-brand-teal transition-colors break-all">
                    {ISLETME.email}
                  </p>
                </div>
              </div>
            </a>

            {/* Instagram */}
            <a
              href={SOSYAL_MEDYA.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="block bg-white rounded-2xl shadow-card border border-brand-dark/5 p-6 hover:border-pink-500/30 transition-colors group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-white flex items-center justify-center shrink-0">
                  <IconBrandInstagram size={24} />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-brand-ink/50 uppercase tracking-wider font-medium">
                    Instagram
                  </p>
                  <p className="font-display text-xl font-semibold text-brand-dark group-hover:text-pink-500 transition-colors">
                    @{ISLETME.instagram}
                  </p>
                </div>
              </div>
            </a>
          </div>

          {/* SAĞ: Mağaza */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl shadow-card border border-brand-dark/5 p-6">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-brand-gold/10 text-brand-gold flex items-center justify-center shrink-0">
                  <IconMapPin size={22} />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-brand-ink/50 uppercase tracking-wider font-medium">
                    {L.adresLabel}
                  </p>
                  <p className="font-display text-xl font-semibold text-brand-dark">
                    Möbel İnegöl
                  </p>
                </div>
              </div>
              <p className="text-brand-ink/80 leading-relaxed pl-16">
                {ISLETME.adres}
              </p>
              <a
                href="https://maps.app.goo.gl/a58ock1E2WvdHkTL7?g_st=ic"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-sm text-brand-gold hover:opacity-80 mt-3 pl-16"
              >
                {L.mapsAc}
              </a>
            </div>

            {/* Çalışma Saatleri */}
            <div className="bg-white rounded-2xl shadow-card border border-brand-dark/5 p-6">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-brand-gold/10 text-brand-gold flex items-center justify-center shrink-0">
                  <IconClock size={22} />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-brand-ink/50 uppercase tracking-wider font-medium">
                    {L.saatLabel}
                  </p>
                  <p className="font-display text-xl font-semibold text-brand-dark">
                    {L.magaza}
                  </p>
                </div>
              </div>
              <div className="space-y-1 text-sm pl-16">
                <div className="flex justify-between">
                  <span className="text-brand-ink/70">{L.hafta}</span>
                  <span className="font-medium text-brand-dark">09:00 - 19:30</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-brand-ink/70">{L.pazar}</span>
                  <span className="font-medium text-brand-dark">10:00 - 18:00</span>
                </div>
                <p className="text-xs text-brand-ink/50 mt-3">
                  {L.wa724}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── HARİTA ──────────────────────────────────────── */}
      <section className="container mx-auto pb-16">
        <div className="bg-white rounded-2xl shadow-card border border-brand-dark/5 overflow-hidden">
          <div className="px-6 py-4 border-b border-brand-dark/5 flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold text-brand-dark">
              {L.yol}
            </h2>
            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${MAPS_SORGU}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-brand-gold hover:opacity-80 font-medium"
            >
              {L.yolAl}
            </a>
          </div>
          <iframe
            src={`https://maps.google.com/maps?q=${MAPS_SORGU}&output=embed`}
            width="100%"
            height="450"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title={L.haritaTitle}
          />
        </div>
      </section>
    </>
  );
}
