// ════════════════════════════════════════════════════════════
// KategoriShowcase — Hero'nun hemen altı (v56 · premium kategori tile)
// ════════════════════════════════════════════════════════════
// Her kart: görsel (kapak > otomatik ilk ürün) + isim + gold ok footer.
// Görsel yoksa nötr placeholder gösterilir — SVG çizim YOK.
// ════════════════════════════════════════════════════════════

import Image from 'next/image';
import { IconPhoto, IconArrowRight } from '@tabler/icons-react';
import { Link } from '@/lib/i18n/navigation';
import { getLocalizedName } from '@/lib/i18n/auto-translate';
import { gorselSrc } from '@/lib/gorsel';

export default function KategoriShowcase({ kategoriler = [], locale, kicker, title, titleEm, inspect }) {
  const liste = (kategoriler || []).filter((k) => k && k.slug);
  if (!liste.length) return null;

  return (
    <section className="container mx-auto py-8 md:py-14">
      <div className="text-center mb-8 md:mb-12">
        <p className="text-brand-accent font-medium tracking-widest uppercase text-xs sm:text-sm mb-2">
          {kicker}
        </p>
        <h2 className="font-display text-3xl md:text-5xl font-semibold tracking-tight">
          {title} <span className="italic text-brand-gold">{titleEm}</span>
        </h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
        {liste.map((k) => {
          const ad = getLocalizedName(k, locale);
          return (
            <Link
              key={k.slug}
              href={`/kategori/${k.slug}`}
              aria-label={ad}
              className="group block"
            >
              <div className="relative rounded-3xl bg-white border border-brand-gold/20 shadow-card overflow-hidden transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-card-h group-hover:border-brand-gold/60">
                {/* Görsel alanı */}
                <div className="relative aspect-[4/3] bg-gradient-to-br from-brand-cream/50 via-white to-white overflow-hidden">
                  {k.gorsel ? (
                    <Image
                      src={gorselSrc(k.gorsel)}
                      alt={ad}
                      fill
                      sizes="(max-width: 768px) 50vw, 33vw"
                      className="object-contain p-4 md:p-6 transition-transform duration-500 ease-out group-hover:scale-[1.07]"
                    />
                  ) : (
                    // Görsel yoksa nötr placeholder (çizim yok) — ürün/kapak eklenince otomatik dolar
                    <div className="absolute inset-0 flex items-center justify-center text-brand-gold/30">
                      <IconPhoto size={44} strokeWidth={1.4} />
                    </div>
                  )}
                  {/* Üstte hafif gold ışıma — premium his */}
                  <div className="pointer-events-none absolute -top-8 -right-8 w-28 h-28 rounded-full bg-brand-gold/10 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>

                {/* Footer — isim + ok */}
                <div className="flex items-center justify-between gap-2 px-4 py-3.5 border-t border-brand-gold/15 bg-gradient-to-b from-white to-brand-cream/30">
                  <div className="min-w-0">
                    <p className="font-semibold text-sm md:text-base uppercase tracking-wide text-brand-dark leading-tight truncate group-hover:text-brand-teal2 transition-colors">
                      {ad}
                    </p>
                    <p className="text-[11px] md:text-xs text-brand-muted group-hover:text-brand-gold transition-colors">
                      {inspect}
                    </p>
                  </div>
                  <span className="shrink-0 w-9 h-9 rounded-full bg-brand-gold/15 text-brand-gold flex items-center justify-center transition-all duration-300 group-hover:bg-brand-gold group-hover:text-white group-hover:translate-x-0.5">
                    <IconArrowRight size={17} />
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
