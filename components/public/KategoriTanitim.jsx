// ════════════════════════════════════════════════════════════
// KategoriTanitim — Kategoriye özel tanıtım bölümü (v55)
// ════════════════════════════════════════════════════════════
// Tam-genişlik oda görseli + üst-başlık + büyük başlık + açıklama
// paragrafı + "Ürünleri Keşfet" butonu → ilgili kategori sayfasına link.
// Yeniden kullanılabilir: yemek odası, yatak odası vb. için ayrı ayrı.
// reverse=true → görsel sağda (bölümler dönüşümlü dizilebilsin).
// ════════════════════════════════════════════════════════════
import Image from 'next/image';
import { IconArrowRight } from '@tabler/icons-react';
import { Link } from '@/lib/i18n/navigation';

export default function KategoriTanitim({ image, kicker, title, body, cta, href, reverse = false }) {
  if (!image || !href) return null;

  return (
    <section className="container mx-auto py-10 md:py-16">
      <div className="grid md:grid-cols-2 gap-6 md:gap-10 lg:gap-14 items-center">
        {/* Görsel */}
        <div className={`relative aspect-[4/3] md:aspect-[5/4] rounded-3xl overflow-hidden shadow-card ${reverse ? 'md:order-2' : ''}`}>
          <Image
            src={image}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
          />
        </div>

        {/* Metin */}
        <div className={`text-center md:text-left px-1 md:px-2 ${reverse ? 'md:order-1' : ''}`}>
          <p className="text-brand-accent font-semibold tracking-widest uppercase text-xs sm:text-sm mb-3">
            {kicker}
          </p>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-semibold text-brand-dark mb-4 md:mb-6 leading-tight">
            {title}
          </h2>
          <p className="text-brand-ink/70 text-sm md:text-base leading-relaxed mb-6 md:mb-8 max-w-xl mx-auto md:mx-0">
            {body}
          </p>
          <Link
            href={href}
            className="inline-flex items-center gap-2 px-7 py-3.5 bg-brand-gold hover:bg-brand-teal2 text-brand-dark rounded-full text-sm md:text-base font-semibold shadow-lg hover:scale-105 transition-all duration-300"
          >
            {cta}
            <IconArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
}
