// ════════════════════════════════════════════════════════════
// KategoriShowcase — Hero'nun hemen altı
// ════════════════════════════════════════════════════════════
// Her kart: kategori kapak görseli (admin kapak ürünü > otomatik ilk ürün
// görseli). Görsel yoksa nötr placeholder gösterilir — SVG çizim YOK.
// ════════════════════════════════════════════════════════════

import Image from 'next/image';
import { IconPhoto } from '@tabler/icons-react';
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
              className="group flex flex-col items-center"
            >
              <div className="relative w-full aspect-square rounded-[2rem] bg-white border border-brand-gold/25 shadow-card overflow-hidden transition-all duration-300 group-hover:-translate-y-1.5 group-hover:shadow-card-h group-hover:border-brand-gold">
                {k.gorsel ? (
                  // Ürün fotoğrafı — kapak (admin kapak ürünü > otomatik ilk ürün); tam ürün (contain, beyaz zemin)
                  <Image
                    src={gorselSrc(k.gorsel)}
                    alt={ad}
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className="object-contain p-4 md:p-5 transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  // Görsel yoksa nötr placeholder (çizim yok) — ürün/kapak eklenince otomatik dolar
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-brand-cream to-white text-brand-gold/30">
                    <IconPhoto size={44} strokeWidth={1.4} />
                  </div>
                )}
                <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-brand-gold to-transparent opacity-70" />
              </div>
              <p className="mt-3 text-center text-sm md:text-base font-semibold uppercase tracking-wide text-brand-dark leading-snug group-hover:text-brand-teal2 transition-colors">
                {ad}
              </p>
              <span className="mt-0.5 text-[11px] md:text-xs text-brand-muted group-hover:text-brand-gold transition-colors">
                {inspect} →
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
