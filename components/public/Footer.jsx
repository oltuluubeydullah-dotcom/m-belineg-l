// ════════════════════════════════════════════════════════════
// Möbel İnegöl — Footer
// Facebook + Instagram + WhatsApp
// ════════════════════════════════════════════════════════════

import Image from 'next/image';
import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/lib/i18n/navigation';
import {
  IconBrandWhatsapp, IconMail, IconPhone,
  IconBrandInstagram, IconBrandFacebook, IconMapPin,
} from '@tabler/icons-react';
import { ISLETME, SOSYAL_MEDYA } from '@/lib/constants';
import { genelDestekLinki } from '@/lib/whatsapp';

export default function Footer() {
  const t = useTranslations('Footer');
  const tNav = useTranslations('Nav');
  const locale = useLocale();
  const yil = new Date().getFullYear();

  return (
    <footer className="bg-white text-brand-ink mt-16 border-t border-brand-dark/10">
      <div className="bg-brand-gold h-1.5" />

      <div className="container mx-auto py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Sütun 1: Marka */}
          <div>
            <div className="mb-4">
              <Image
                src="/marka/mobel-logo.png"
                alt={ISLETME.ad}
                width={361}
                height={120}
                className="h-20 w-auto object-contain"
                sizes="320px"
              />
            </div>
            <p className="text-sm leading-relaxed text-brand-ink/70 mb-4">
              {locale === 'tr' && 'Kaliteli mobilya, uygun fiyat, kapınıza teslimat.'}
              {locale === 'en' && 'Quality furniture, fair prices, delivered to your door.'}
              {locale === 'de' && 'Qualitätsmöbel, faire Preise, direkt zu Ihnen geliefert.'}
            </p>

            {/* Sosyal Medya İkonları */}
            <div className="flex items-center gap-3 flex-wrap">
              <a
                href={SOSYAL_MEDYA.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-9 h-9 rounded-full flex items-center justify-center text-white transition-transform hover:scale-110"
                style={{ background: 'linear-gradient(135deg, #f09433 0%, #dc2743 50%, #bc1888 100%)' }}
              >
                <IconBrandInstagram size={18} />
              </a>
              {SOSYAL_MEDYA.facebook && (
                <a
                  href={SOSYAL_MEDYA.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="w-9 h-9 rounded-full bg-[#1877F2] flex items-center justify-center text-white transition-transform hover:scale-110"
                >
                  <IconBrandFacebook size={18} />
                </a>
              )}
              <a
                href={genelDestekLinki()}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="w-9 h-9 rounded-full bg-green-500 flex items-center justify-center text-white transition-transform hover:scale-110"
              >
                <IconBrandWhatsapp size={18} />
              </a>
            </div>
          </div>

          {/* Sütun 2: Müşteri Hizmetleri */}
          <div>
            <h4 className="font-semibold text-brand-teal tracking-wider uppercase text-sm mb-4">
              {t('customer_services')}
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/hakkimizda"        prefetch={false} className="hover:text-brand-teal transition-colors">{tNav('about')}</Link></li>
              <li><Link href="/teslimat-kurulum"  prefetch={false} className="hover:text-brand-teal transition-colors">{tNav('delivery')}</Link></li>
              <li><Link href="/sss"               prefetch={false} className="hover:text-brand-teal transition-colors">{tNav('faq')}</Link></li>
              <li><Link href="/garanti-iade"      prefetch={false} className="hover:text-brand-teal transition-colors">{tNav('warranty')}</Link></li>
              <li><Link href="/gizlilik"          prefetch={false} className="hover:text-brand-teal transition-colors">{tNav('privacy')}</Link></li>
              <li><Link href="/satis-sozlesmesi"  prefetch={false} className="hover:text-brand-teal transition-colors">{tNav('terms')}</Link></li>
              <li><Link href="/kvkk"              prefetch={false} className="hover:text-brand-teal transition-colors">{tNav('kvkk')}</Link></li>
              <li><Link href="/blog"              prefetch={false} className="hover:text-brand-teal transition-colors">{tNav('blog')}</Link></li>
            </ul>
          </div>

          {/* Sütun 3: Mağaza Adresi + Harita */}
          <div>
            <h4 className="font-semibold text-brand-teal tracking-wider uppercase text-sm mb-4">
              {t('store_address')}
            </h4>
            <p className="text-sm leading-relaxed text-brand-ink/80 mb-3">
              {ISLETME.adresTam}
            </p>
            <a
              href="https://maps.app.goo.gl/JrjRkJyCePG6CBvA6?g_st=ic"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-gold hover:text-brand-accent transition-colors"
            >
              <IconMapPin size={15} />
              {t('location_link')}
            </a>
          </div>

          {/* Sütun 4: İletişim */}
          <div>
            <h4 className="font-semibold text-brand-teal tracking-wider uppercase text-sm mb-4">
              {t('contact')}
            </h4>
            <div className="space-y-3">
              <a
                href="tel:+905360400108"
                className="flex items-center gap-3 text-sm text-brand-ink/70 hover:text-brand-teal transition-colors"
              >
                <IconPhone size={17} className="text-brand-gold shrink-0" />
                <span>+90 536 040 01 08</span>
              </a>
              <a
                href={genelDestekLinki()}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-sm text-brand-ink/70 hover:text-green-600 transition-colors"
              >
                <IconBrandWhatsapp size={17} className="text-green-500 shrink-0" />
                <span>+90 536 040 01 08</span>
              </a>
              <a
                href="mailto:mobelinegol16@gmail.com"
                className="flex items-center gap-3 text-sm text-brand-ink/70 hover:text-brand-teal transition-colors"
              >
                <IconMail size={17} className="text-brand-gold shrink-0" />
                <span>mobelinegol16@gmail.com</span>
              </a>
            </div>

            <a
              href={genelDestekLinki()}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 bg-green-500 hover:bg-green-600 text-white rounded-full text-sm font-semibold transition-colors"
            >
              <IconBrandWhatsapp size={17} />
              {t('whatsapp_cta')}
            </a>
          </div>

        </div>
      </div>

      {/* Alt çizgi — ortalanmış, güçlü */}
      <div className="border-t border-brand-dark/8 py-5">
        <div className="container mx-auto flex flex-col sm:flex-row items-center justify-center gap-x-3 gap-y-2 text-center">
          <span className="text-xs md:text-sm font-semibold tracking-wide text-brand-ink/70 uppercase">
            © {yil} MÖBEL İNEGÖL — TÜM HAKLARI SAKLIDIR
          </span>
          <span className="hidden sm:inline text-brand-ink/30">|</span>
          <a
            href="https://byubivo.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 opacity-80 hover:opacity-100 transition-opacity"
            aria-label="by ubivo"
          >
            <Image
              src="/marka/byubivo-logo.png"
              alt="by ubivo"
              width={90}
              height={28}
              className="h-5 w-auto object-contain"
            />
          </a>
        </div>
      </div>
    </footer>
  );
}
