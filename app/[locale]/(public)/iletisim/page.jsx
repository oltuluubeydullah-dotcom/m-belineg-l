// ════════════════════════════════════════════════════════════
// İletişim — /iletisim
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

export const metadata = {
  title: 'İletişim',
  description: 'Möbel İnegöl İletişim — İnegöl / Bursa. WhatsApp, telefon ve yol tarifi.',
};

const TAM_ADRES = "İnegöl / Bursa";
const MAPS_SORGU = encodeURIComponent("Möbel İnegöl İnegöl Bursa");

export default async function IletisimSayfasi({ params: { locale } }) {
  const whatsappSablonlari = await whatsappSablonlariniGetir();
  return (
    <>
      <PageHero
        baslik="İletişim"
        altBaslik="Sorularınız için bize ulaşın — WhatsApp, telefon veya mağazamızı ziyaret edin."
        breadcrumb={[{ ad: 'İletişim' }]}
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
                    WhatsApp (önerilen)
                  </p>
                  <p className="font-display text-xl font-semibold text-brand-dark group-hover:text-green-600 transition-colors">
                    +90 536 040 01 08
                  </p>
                  <p className="text-sm text-brand-ink/60 mt-1">
                    Tıkla, anında mesaj at
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
                    Telefon
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
                    E-posta
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
                    Mağaza Adresimiz
                  </p>
                  <p className="font-display text-xl font-semibold text-brand-dark">
                    Möbel İnegöl
                  </p>
                </div>
              </div>
              <p className="text-brand-ink/80 leading-relaxed pl-16">
                {TAM_ADRES}
              </p>
              <a
                href="https://maps.app.goo.gl/JrjRkJyCePG6CBvA6?g_st=ic"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-sm text-brand-gold hover:opacity-80 mt-3 pl-16"
              >
                Google Haritalar'da Aç →
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
                    Çalışma Saatleri
                  </p>
                  <p className="font-display text-xl font-semibold text-brand-dark">
                    Mağaza
                  </p>
                </div>
              </div>
              <div className="space-y-1 text-sm pl-16">
                <div className="flex justify-between">
                  <span className="text-brand-ink/70">Pazartesi - Cumartesi</span>
                  <span className="font-medium text-brand-dark">09:00 - 19:30</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-brand-ink/70">Pazar</span>
                  <span className="font-medium text-brand-dark">10:00 - 18:00</span>
                </div>
                <p className="text-xs text-brand-ink/50 mt-3">
                  💬 WhatsApp ise 7/24 açık — mesajınıza en kısa sürede dönüş yaparız.
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
              📍 Yol Tarifi
            </h2>
            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${MAPS_SORGU}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-brand-gold hover:opacity-80 font-medium"
            >
              Yol Tarifi Al →
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
            title="Möbel İnegöl Konumu"
          />
        </div>
      </section>
    </>
  );
}
