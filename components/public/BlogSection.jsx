// ════════════════════════════════════════════════════════════
// Anasayfa Blog Bölümü — son 3 yazı
// ════════════════════════════════════════════════════════════
// Server component. Veriyi page.jsx çekip prop olarak verir.
// ════════════════════════════════════════════════════════════

import { gorselSrc } from '@/lib/gorsel';
import { IconArrowRight } from '@tabler/icons-react';
import { Link } from '@/lib/i18n/navigation';

export default function BlogSection({ yazilar = [], locale = 'tr' }) {
  if (!yazilar || yazilar.length === 0) return null;

  const basliklar = {
    tr: { kicker: 'BLOG', title: 'Güncel', titleEm: 'Yazılarımız', text: 'Mobilya bakımı, dekorasyon önerileri ve sektör güncellemeleri.', all: 'Tüm Yazılar' },
    en: { kicker: 'BLOG', title: 'Latest', titleEm: 'Articles', text: 'Furniture care, decoration tips and industry updates.', all: 'All Articles' },
    de: { kicker: 'BLOG', title: 'Aktuelle', titleEm: 'Artikel', text: 'Möbelpflege, Dekorationstipps und Branchen-Updates.', all: 'Alle Artikel' },
  };
  const L = basliklar[locale] || basliklar.tr;

  return (
    <section className="container mx-auto py-12 md:py-16">
      <div className="text-center mb-8 md:mb-12">
        <p className="text-brand-accent font-medium tracking-widest uppercase text-xs sm:text-sm mb-2">
          {L.kicker}
        </p>
        <h2 className="font-display text-3xl md:text-5xl font-light tracking-tight">
          {L.title} <span className="italic text-brand-gold">{L.titleEm}</span>
        </h2>
        <p className="text-brand-ink/60 mt-3 max-w-2xl mx-auto text-sm md:text-base">
          {L.text}
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {yazilar.slice(0, 3).map((y) => (
          <Link
            key={y.id}
            href={`/blog/${y.slug}`}
            className="group bg-white rounded-2xl shadow-card border border-brand-dark/5 overflow-hidden hover:shadow-card-h transition-shadow"
          >
            <div className="aspect-[16/9] overflow-hidden">
              {y.cover_image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={gorselSrc(y.cover_image)}
                  alt={y.title}
                  loading="lazy"
                  decoding="async"
                  width="640"
                  height="360"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="relative w-full h-full flex items-center justify-center p-5 text-center overflow-hidden"
                     style={{ background: 'linear-gradient(135deg, #FEC401 0%, #1A1A1A 100%)' }}>
                  <span className="absolute -right-4 -top-4 font-display text-[7rem] leading-none text-white/10 select-none">G</span>
                  <h4 className="relative font-display text-lg md:text-xl font-semibold text-white leading-snug line-clamp-3 drop-shadow">
                    {y.title}
                  </h4>
                </div>
              )}
            </div>
            <div className="p-5">
              <h3 className="font-display text-lg font-semibold text-brand-dark mb-2 line-clamp-2 group-hover:text-brand-teal transition-colors">
                {y.title}
              </h3>
              {y.excerpt && (
                <p className="text-sm text-brand-ink/60 line-clamp-2">{y.excerpt}</p>
              )}
            </div>
          </Link>
        ))}
      </div>

      <div className="text-center mt-8">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 px-6 py-3 border border-brand-teal text-brand-teal rounded-full font-medium hover:bg-brand-teal hover:text-white transition-colors"
        >
          {L.all}
          <IconArrowRight size={18} />
        </Link>
      </div>
    </section>
  );
}
