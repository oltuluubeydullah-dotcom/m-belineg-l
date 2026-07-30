'use client';

import { useTranslations } from 'next-intl';
import { genelDestekLinki } from '@/lib/whatsapp';

// Nakit indirim (%) ve Taksit (kart) rozetleri SVG; Garanti + WhatsApp rozetleri görsel.
const NakitIcon = (
  <svg viewBox="0 0 64 64" fill="none" className="w-full h-full">
    <circle cx="32" cy="32" r="32" fill="#FEC401" />
    <circle cx="32" cy="32" r="28" fill="#D9A400" />
    <text x="32" y="42" textAnchor="middle" fontSize="28" fontWeight="bold" fill="white" fontFamily="Arial">%</text>
  </svg>
);

const TaksitIcon = (
  <svg viewBox="0 0 64 64" fill="none" className="w-full h-full">
    <circle cx="32" cy="32" r="32" fill="#1A1A1A" />
    <rect x="12" y="20" width="40" height="26" rx="4" fill="white" opacity="0.95" />
    <rect x="12" y="28" width="40" height="7" fill="#1A1A1A" />
    <rect x="16" y="38" width="10" height="4" rx="1" fill="#FEC401" />
    <rect x="28" y="38" width="6" height="4" rx="1" fill="#D9A400" />
  </svg>
);

export default function TrustBadges() {
  const t = useTranslations('Trust');

  const BADGES = [
    { key: 'garanti',  type: 'img', src: '/marka/trust-garanti.png' },
    { key: 'whatsapp', type: 'img', src: '/marka/trust-whatsapp.png', href: genelDestekLinki() },
    { key: 'nakit',    type: 'svg', icon: NakitIcon },
    { key: 'taksit',   type: 'svg', icon: TaksitIcon },
  ];

  return (
    <section
      className="w-full py-10 md:py-14"
      style={{ background: 'linear-gradient(135deg, #FEC401 0%, #D9A400 100%)' }}
    >
      <div className="container mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10">
          {BADGES.map((b) => {
            const label = t(b.key);
            const inner = (
              <>
                <div
                  className="relative mb-4 rounded-full transition-transform group-hover:scale-105 bg-white/95 shadow-md flex items-center justify-center overflow-hidden w-20 h-20 md:w-24 md:h-24"
                  style={{ boxShadow: '0 0 0 3px rgba(255,255,255,0.35)' }}
                >
                  {b.type === 'img' ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={b.src}
                      alt={label}
                      className="w-full h-full object-contain p-1.5"
                      loading="lazy"
                      decoding="async"
                    />
                  ) : (
                    <div className="w-full h-full">{b.icon}</div>
                  )}
                </div>
                <p className="text-sm md:text-base font-semibold text-white leading-snug px-2 drop-shadow-sm">
                  {label}
                </p>
              </>
            );

            return b.href ? (
              <a
                key={b.key}
                href={b.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center text-center group"
                aria-label={label}
              >
                {inner}
              </a>
            ) : (
              <div key={b.key} className="flex flex-col items-center text-center group">
                {inner}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
