'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/lib/i18n/navigation';
import { IconShieldCheck } from '@tabler/icons-react';

const STORAGE_KEY = 'mobel-cookie-consent';

export default function CookieConsent() {
  const t = useTranslations('CookieConsent');
  const [goster, setGoster] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(STORAGE_KEY)) setGoster(true);
    } catch (_) {}
  }, []);

  const kaydet = (deger) => {
    try {
      localStorage.setItem(STORAGE_KEY, deger);
      if (deger === 'all' && typeof window !== 'undefined') {
        if (window.gtag) {
          window.gtag('consent', 'update', {
            ad_storage: 'granted',
            analytics_storage: 'granted',
          });
        }
        // v51: Meta/TikTok pixellerine izin sinyali (PixelScripts dinler)
        window.dispatchEvent(new Event('mobel-consent-granted'));
      }
    } catch (_) {}
    setGoster(false);
  };

  if (!goster) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-3 md:p-4 animate-slide-up">
      <div className="max-w-4xl mx-auto bg-brand-navy text-white rounded-2xl shadow-2xl
                      p-4 md:p-6 flex flex-col md:flex-row items-start md:items-center gap-4 border border-brand-gold/20">
        <div className="flex items-start gap-3 flex-1">
          <div className="w-10 h-10 rounded-full bg-brand-gold/15 text-brand-gold flex items-center justify-center shrink-0">
            <IconShieldCheck size={20} />
          </div>
          <div className="text-sm leading-relaxed">
            <p className="font-semibold text-white mb-1">
              {t('title')}
            </p>
            <p className="text-white/70 text-xs md:text-sm">
              {t('text')}{' '}
              <Link href="/gizlilik" className="text-brand-gold underline hover:text-brand-accent">
                {t('policy_link')}
              </Link>.
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          <button
            type="button"
            onClick={() => kaydet('essential')}
            className="px-4 py-2 text-xs md:text-sm rounded-full border border-brand-cream/30
                       text-white/80 hover:border-brand-cream hover:text-white transition-colors"
          >
            {t('essential')}
          </button>
          <button
            type="button"
            onClick={() => kaydet('all')}
            className="px-4 py-2 text-xs md:text-sm rounded-full bg-brand-gold text-brand-dark
                       font-semibold hover:opacity-90 transition-opacity"
          >
            {t('accept')}
          </button>
        </div>
      </div>
    </div>
  );
}
