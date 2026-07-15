// ════════════════════════════════════════════════════════════
// LanguageSwitcher — Dil değiştirici dropdown
// ════════════════════════════════════════════════════════════
// Header sağ tarafta. Tıklayınca açılır panel:
//   🇹🇷 Türkçe   🇬🇧 English   🇩🇪 Deutsch
// Mevcut sayfayı korur (aynı path'de farklı locale'a gider).
// ════════════════════════════════════════════════════════════

'use client';

import { useState, useEffect, useRef } from 'react';
import { useLocale } from 'next-intl';
import { useRouter, usePathname } from '@/lib/i18n/navigation';
import { IconWorld, IconCheck } from '@tabler/icons-react';
import { locales, localeMeta } from '@/lib/i18n/config';

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [acik, setAcik] = useState(false);
  const ref = useRef(null);

  // Dış tıklama ile kapan
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setAcik(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const degistir = (yeni) => {
    setAcik(false);
    router.replace(pathname, { locale: yeni });
  };

  const aktif = localeMeta[locale];

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setAcik(!acik)}
        className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-full
                   hover:bg-brand-dark/5 transition-colors"
        aria-label="Dil seçimi"
        aria-haspopup="listbox"
        aria-expanded={acik}
      >
        <IconWorld size={24} stroke={1.8} className="text-brand-ink/70" />
        <span className="text-sm md:text-base font-medium tracking-wider uppercase">
          {aktif?.short || 'TR'}
        </span>
      </button>

      {acik && (
        <div
          role="listbox"
          className="absolute right-0 top-full mt-1 z-50 min-w-[160px]
                     bg-white rounded-xl shadow-card-h border border-brand-dark/5
                     overflow-hidden animate-fade-in"
        >
          {locales.map((l) => {
            const meta = localeMeta[l];
            const seciliMi = l === locale;
            return (
              <button
                key={l}
                type="button"
                onClick={() => degistir(l)}
                role="option"
                aria-selected={seciliMi}
                className={`w-full flex items-center gap-2.5 px-4 py-3 text-sm text-left
                            hover:bg-brand-cream transition-colors
                            ${seciliMi ? 'bg-brand-gold/10 font-medium' : ''}`}
              >
                <span className="text-base" aria-hidden="true">{meta.flag}</span>
                <span className="flex-1">{meta.name}</span>
                {seciliMi && <IconCheck size={16} className="text-brand-gold" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
