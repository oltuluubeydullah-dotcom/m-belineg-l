// K-06 FIX: t.raw() çıktısı sanitizeHtml() ile temizleniyor
// v52: Möbel — görseller yerine sarı/siyah marka ikonları
import { useTranslations, useLocale } from 'next-intl';
import { sanitizeHtml } from '@/lib/sanitize';

export default function SeoTanitim() {
  const t = useTranslations('SeoTanitim');
  const tStats = useTranslations('Stats');
  const locale = useLocale();
  const yil = new Date().getFullYear();

  // v52 Möbel: fotoğraflar yerine sarı/siyah marka ikonları (eski tema görselleri kaldırıldı)
  const stats = [
    { v: tStats('warranty_value'),    l: tStats('warranty'),    icon: 'garanti'  },
    { v: tStats('delivery_81_value'), l: tStats('delivery_81'), icon: 'nakliye'  },
    { v: tStats('europe_value'),      l: tStats('europe'),      icon: 'avrupa'   },
    { v: tStats('247_value'),         l: tStats('247'),         icon: 'whatsapp' },
  ];

  // Sarı daire + siyah çizim — Möbel rozet dili
  const IKONLAR = {
    garanti: (
      <svg viewBox="0 0 64 64" fill="none" className="w-20 h-20 md:w-24 md:h-24">
        <circle cx="32" cy="32" r="30" fill="#FEC401" />
        <path d="M32 14l13 5v11c0 9.5-5.5 15.5-13 19-7.5-3.5-13-9.5-13-19V19l13-5z" fill="#1A1A1A" />
        <path d="M25.5 32.5l4.5 4.5 9-9" stroke="#FEC401" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    nakliye: (
      <svg viewBox="0 0 64 64" fill="none" className="w-20 h-20 md:w-24 md:h-24">
        <circle cx="32" cy="32" r="30" fill="#1A1A1A" />
        <rect x="12" y="24" width="26" height="16" rx="2" fill="#FEC401" />
        <path d="M38 28h8l6 7v5h-14V28z" fill="#FEC401" />
        <circle cx="21" cy="43" r="4" fill="#1A1A1A" stroke="#FAF8F3" strokeWidth="2.5" />
        <circle cx="44" cy="43" r="4" fill="#1A1A1A" stroke="#FAF8F3" strokeWidth="2.5" />
      </svg>
    ),
    avrupa: (
      <svg viewBox="0 0 64 64" fill="none" className="w-20 h-20 md:w-24 md:h-24">
        <circle cx="32" cy="32" r="30" fill="#FEC401" />
        <circle cx="32" cy="32" r="17" fill="none" stroke="#1A1A1A" strokeWidth="3" />
        <path d="M15 32h34M32 15c5 5.5 5 28.5 0 34M32 15c-5 5.5-5 28.5 0 34" stroke="#1A1A1A" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      </svg>
    ),
    whatsapp: (
      <svg viewBox="0 0 64 64" fill="none" className="w-20 h-20 md:w-24 md:h-24">
        <circle cx="32" cy="32" r="30" fill="#1A1A1A" />
        <path d="M32 17c-8.3 0-15 6.5-15 14.5 0 2.8.85 5.4 2.3 7.6L17 47l8.2-2.1a15.6 15.6 0 006.8 1.5c8.3 0 15-6.4 15-14.4S40.3 17 32 17z" fill="#FEC401" />
        <path d="M27 26.5c.4-1 .9-1 1.3-1h1.1c.35 0 .8.1 1.1.9l1.2 3c.1.3.2.6 0 .95l-.7 1.1c-.2.3-.4.65-.15 1.1.95 1.6 2.4 2.9 4.1 3.7.45.2.8.1 1.05-.2l1-1.1c.3-.35.65-.4 1-.25l3 1.45c.5.25.65.6.6 1-.2 1.6-1.7 2.85-3.3 2.85-4.95 0-11.3-4.6-12.3-10.6-.2-1.2.3-2.3 1-2.9z" fill="#1A1A1A" />
      </svg>
    ),
  };

  return (
    <section className="bg-gradient-to-b from-brand-teallt via-white to-brand-cream border-y border-brand-teal/15 py-14 md:py-20">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-10 md:mb-14">
          <h2 className="font-display text-2xl md:text-3xl font-medium text-brand-dark mb-5 md:mb-6">
            {t('title', { year: yil })}
          </h2>
          <div className="space-y-4 text-sm md:text-base text-brand-ink/80 leading-relaxed max-w-3xl mx-auto">
            <p dangerouslySetInnerHTML={{ __html: sanitizeHtml(t.raw('p1')) }} />
            <p dangerouslySetInnerHTML={{ __html: sanitizeHtml(t.raw('p2')) }} />
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {stats.map((s) => (
            <div
              key={s.l}
              className="group bg-white rounded-3xl border border-brand-teal/15 overflow-hidden shadow-card hover:shadow-card-h hover:-translate-y-1 transition-all duration-300"
            >
              {/* İkon alanı — sarı/siyah marka rozeti (v52) */}
              <div className="relative aspect-square bg-gradient-to-br from-brand-teallt/60 to-white flex items-center justify-center overflow-hidden">
                <div className="group-hover:scale-110 transition-transform duration-500">
                  {IKONLAR[s.icon]}
                </div>
              </div>
              {/* Değer + etiket */}
              <div className="px-3 py-4 md:py-5 text-center border-t border-brand-teal/10 bg-gradient-to-b from-white to-brand-teallt/30">
                <p className="font-display text-2xl md:text-3xl text-brand-dark font-semibold leading-none">{s.v}</p>
                <p className="text-xs md:text-sm text-brand-ink/60 mt-1.5">{s.l}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ── Uzun form SEO metni — İnegöl mobilya yerel arama (v44, sadece TR) ── */}
        {locale === 'tr' && (
          <div className="mt-14 md:mt-20 pt-12 md:pt-16 border-t border-brand-teal/15">
            <div
              className="seo-longform max-w-3xl mx-auto text-sm md:text-[15px] text-brand-ink/75 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: sanitizeHtml(t.raw('longform_html')) }}
            />
          </div>
        )}
      </div>
    </section>
  );
}
