// ════════════════════════════════════════════════════════════
// KategoriShowcase — Hero'nun hemen altı (v57 · görsel ön planda + isim overlay)
// ════════════════════════════════════════════════════════════
// Her kart: görsel tam kaplar (kapak > otomatik ilk ürün); kategori ismi
// fotoğrafın ÜSTÜNDE (alt karartma scrim ile okunur). Görsel yoksa placeholder.
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
              <div className="relative aspect-square rounded-3xl overflow-hidden shadow-card border border-brand-gold/20 transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-card-h group-hover:border-brand-gold/60">
                {k.gorsel ? (
                  <Image
                    src={gorselSrc(k.gorsel)}
                    alt={ad}
                    fill
                    sizes="(max-width: 768px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.06]"
                  />
                ) : (
                  // Görsel yoksa nötr placeholder (çizim yok) — ürün/kapak eklenince otomatik dolar
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-brand-cream to-white text-brand-gold/30">
                    <IconPhoto size={44} strokeWidth={1.4} />
                  </div>
                )}

                {/* Alt karartma — isim okunsun */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />

                {/* Kategori ismi — fotoğrafın üstünde */}
                <div className="absolute inset-x-0 bottom-0 p-4 md:p-5">
                  <p className="text-white font-semibold uppercase tracking-wide text-sm md:text-lg leading-tight drop-shadow-md">
                    {ad}
                  </p>
                  <span className="mt-0.5 inline-flex items-center gap-1 text-white/85 text-[11px] md:text-xs group-hover:text-brand-gold transition-colors">
                    {inspect}
                    <IconArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
                  </span>
                </div>

                {/* Alt gold çizgi — hover vurgusu */}
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-brand-gold to-transparent opacity-0 group-hover:opacity-90 transition-opacity duration-300" />
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
