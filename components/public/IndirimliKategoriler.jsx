import { gorselSrc } from '@/lib/gorsel';
import { Link } from '@/lib/i18n/navigation';
import { getLocalizedName } from '@/lib/i18n/auto-translate';

// ════════════════════════════════════════════════════════════
// Möbel İnegöl — İndirimli Kategori Bölümü
// Nakit/Taksit (TrustBadges) bölümünün hemen ÜSTÜ.
// Büyük görsel kart: kapak = kategorinin ürün görseli (admin seçebilir),
// üstüne "KATEGORİ ADI / %X'e VARAN İNDİRİM / Koleksiyonu İncele".
// Kart komple kategori sayfasına link. Görsel yoksa kart gizlenir.
// ════════════════════════════════════════════════════════════

function IndirimKarti({ k, locale }) {
  const ad = getLocalizedName(k, locale);
  return (
    <Link
      href={`/kategori/${k.slug}`}
      className="group relative block overflow-hidden rounded-3xl aspect-[16/10] md:aspect-[21/9] shadow-card"
      aria-label={`${ad} — %${k.discount_percent}'e varan indirim`}
    >
      {/* Kapak görseli */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={gorselSrc(k.gorsel)}
        alt={ad}
        loading="lazy"
        decoding="async"
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
      />
      {/* Karartma — yazılar okunsun */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/25 to-black/35" />

      {/* İçerik — ortalı */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
        <p className="font-display text-white/95 tracking-wide text-base sm:text-xl md:text-2xl uppercase drop-shadow">
          {ad}
        </p>
        <p className="font-display text-white font-semibold leading-none mt-1 md:mt-2 drop-shadow-lg">
          <span className="align-top text-2xl sm:text-3xl md:text-5xl">%</span>
          <span className="text-5xl sm:text-6xl md:text-8xl">{k.discount_percent}</span>
          <span className="mx-1 align-middle text-[10px] sm:text-xs md:text-sm tracking-widest">'E VARAN</span>
          <span className="text-3xl sm:text-4xl md:text-6xl"> İNDİRİM</span>
        </p>
        <span className="mt-3 md:mt-5 inline-flex items-center rounded-full bg-white/15 backdrop-blur-sm border border-white/30 px-4 py-1.5 text-xs md:text-sm font-medium text-white group-hover:bg-white/25 transition-colors">
          Koleksiyonu İncele
        </span>
      </div>
    </Link>
  );
}

export default function IndirimliKategoriler({ kategoriler = [], locale }) {
  const gosterilecek = kategoriler.filter((k) => k.gorsel && k.discount_percent > 0);
  if (!gosterilecek.length) return null;

  return (
    <section className="container mx-auto py-8 md:py-12" aria-label="İndirimli Kategoriler">
      <div className="text-center mb-7 md:mb-10">
        <p className="text-brand-accent font-medium tracking-widest uppercase text-xs sm:text-sm mb-2">
          Fırsatlar
        </p>
        <h2 className="font-display text-2xl md:text-4xl font-light tracking-tight text-brand-dark">
          İndirimli <span className="italic text-brand-gold">Kategoriler</span>
        </h2>
      </div>

      <div className="grid sm:grid-cols-2 gap-4 md:gap-6">
        {gosterilecek.map((k) => (
          <IndirimKarti key={k.slug} k={k} locale={locale} />
        ))}
      </div>
    </section>
  );
}
