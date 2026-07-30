// ════════════════════════════════════════════════════════════
// InstagramYurtdisiSection — Möbel İnegöl (v52)
// ════════════════════════════════════════════════════════════
// Sol: Instagram (telefon mockup) — Trendyol kaldırıldı (v52)
// Sağ: Yurtdışına Teslimat İmkânı — sarı/siyah marka teması
// ════════════════════════════════════════════════════════════

'use client';

import { SOSYAL_MEDYA } from '@/lib/constants';
import { IconArrowRight, IconPlane } from '@tabler/icons-react';

export default function InstagramYurtdisiSection() {
  return (
    <section className="w-full bg-gradient-to-br from-brand-cream to-brand-teallt border-y border-brand-gold/20 py-0 overflow-hidden">
      <div className="container mx-auto">
        <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-brand-gold/20">

          {/* ── SOL: Instagram — telefon mockup ── */}
          <div className="px-6 py-10 md:py-14 md:pr-12">
            <h3 className="font-display text-xl md:text-2xl font-semibold text-brand-dark text-center mb-8">
              BİZİ TAKİP EDİN!
            </h3>

            <div className="flex items-start justify-center">
              <a
                href={SOSYAL_MEDYA.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram sayfamız"
                className="group block w-[48vw] max-w-[200px] shrink-0 transition-transform hover:-translate-y-2 duration-300"
              >
                {/* Telefon çerçevesi — gerçek Instagram profil ekranı */}
                <div className="relative rounded-[2rem] border-[6px] border-brand-dark bg-brand-dark shadow-2xl overflow-hidden">
                  {/* Çentik */}
                  <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-16 h-4 bg-brand-dark rounded-full z-10" />
                  {/* v53: gerçek Instagram profil ekran görüntüsü */}
                  <div className="aspect-[9/19] rounded-[1.6rem] overflow-hidden bg-white">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/marka/instagram-profil.jpg"
                      alt="@mobelinegol Instagram profili — 20 binden fazla takipçi"
                      className="w-full h-full object-cover object-top"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                </div>
                <p className="text-center text-xs md:text-sm font-semibold text-brand-dark mt-3 group-hover:text-brand-gold transition-colors">
                  Instagram
                </p>
              </a>
            </div>
          </div>

          {/* ── SAĞ: Yurtdışı Teslimat ── */}
          <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8 px-6 py-10 md:py-14 md:pl-12">
            <div className="flex-1 text-center md:text-left">
              <h2 className="font-display text-xl sm:text-2xl md:text-3xl font-bold leading-tight mb-3 text-brand-dark">
                YURTDIŞINA<br />TESLİMAT<br /><span className="text-brand-teal2">İMKANI</span>
              </h2>
              <p className="text-sm font-semibold text-brand-dark mb-2">
                Gümrük işleri ve nakliye ile sizi uğraştırmıyoruz.
              </p>
              <p className="text-sm text-brand-ink/65 leading-relaxed mb-5">
                Beğendiğiniz mobilyaları garantili bir şekilde Avrupa&apos;da kapınıza kadar teslim ediyoruz.
                Size sadece mobilyanızı seçmek kalıyor.
              </p>
              <a
                href="/teslimat-kurulum"
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm rounded-full font-semibold text-brand-dark bg-brand-gold hover:bg-brand-teal2 transition-all hover:scale-105 shadow-[0_4px_14px_rgba(232,184,75,0.35)]"
              >
                DETAYLI BİLGİ
                <IconArrowRight size={15} />
              </a>
            </div>

            {/* Dekoratif teslimat ikonları — sarı/siyah */}
            <div className="shrink-0 relative hidden md:block">
              <div className="w-20 h-20 rounded-2xl bg-brand-teallt border border-brand-gold/30 flex items-center justify-center mb-3 shadow-sm">
                <IconPlane size={40} className="text-brand-teal2" style={{ transform: 'rotate(-20deg)' }} />
              </div>
              <div className="w-16 h-16 rounded-2xl bg-brand-dark flex items-center justify-center shadow-sm mx-auto">
                <svg viewBox="0 0 24 24" className="w-9 h-9 text-brand-gold fill-current">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                </svg>
              </div>
              <div className="absolute -right-3 top-1/2 -translate-y-1/2 flex flex-col gap-1.5">
                <div className="w-1 h-8  rounded-full bg-brand-gold/60" />
                <div className="w-1 h-5  rounded-full bg-brand-gold/40" />
                <div className="w-1 h-3  rounded-full bg-brand-gold/20" />
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
