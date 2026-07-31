// ════════════════════════════════════════════════════════════
// HeroCarousel v4 — i18n + DB-backed banners
// ════════════════════════════════════════════════════════════
// 3 banner tipi: simdi (gece + havai fişek), teklif (üçgen),
// avrupa (mavi + harita). Metinler DB'den + i18n fallback'le gelir.
// Server'dan banners prop'u alır.
// ════════════════════════════════════════════════════════════
'use client';

import { gorselSrc } from '@/lib/gorsel';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import {
  IconChevronLeft, IconChevronRight, IconPhone, IconArrowRight,
} from '@tabler/icons-react';
import { useWhatsapp } from '@/context/WhatsAppContext';
import { Link } from '@/lib/i18n/navigation';

// (BannerTeklif ve BannerAvrupa kaldırıldı — Hero artık 4 slide: yasam, yatak, nakliye, kargo)

// ─── BANNER: YAŞAM ALANI ───────────────────────────────────
// Sıcak aile/oturma odası görseli — koltuk koleksiyonuna yönlendirir.
function BannerYasam({ banner, t }) {
  const { genelDestekLinki } = useWhatsapp();
  const bgImage = gorselSrc(banner?.bg_image_url) || '/marka/hero-koltuk.jpg'; // v55: koltuk takımı görseli (DB görseli varsa üstüne biner)
  const baslik = {
    tr: { title: 'Koltuk Takımı Modellerimiz', titleEm: 'Avantajlı Fiyatlarla', body: 'Modern, köşe ve klasik koltuk takımlarında geniş seçenek — konfor ve şıklık bir arada.', cta: 'Koleksiyonu Keşfet' },
    en: { title: 'Our Sofa Sets', titleEm: 'at Great Prices', body: 'A wide range of modern, corner and classic sofa sets — comfort and style together.', cta: 'Explore the Collection' },
    de: { title: 'Unsere Sofa-Garnituren', titleEm: 'zu Top-Preisen', body: 'Große Auswahl an modernen, Eck- und klassischen Sofagarnituren — Komfort und Stil vereint.', cta: 'Kollektion entdecken' },
  };
  const L = baslik[t.locale] || baslik.tr;
  const vurgu = { tr: 'Ödeme kolaylığı · Tüm Türkiye’ye teslimat', en: 'Easy payment · Delivery across Türkiye', de: 'Einfache Zahlung · Lieferung in der ganzen Türkei' };
  const iletisim = { tr: 'İletişim Hattı', en: 'Contact Line', de: 'Kontakt' };
  const V = vurgu[t.locale] || vurgu.tr;
  const I = iletisim[t.locale] || iletisim.tr;

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* v52 Möbel: yazı-odaklı hero — siyah zemin + sarı ışıma. DB görseli varsa üstüne biner. */}
      <div className="absolute inset-0 bg-brand-navy" aria-hidden="true">
        <div className="absolute -right-24 -top-24 w-80 h-80 md:w-[28rem] md:h-[28rem] rounded-full bg-brand-gold/20 blur-3xl" />
        <div className="absolute -left-20 -bottom-24 w-64 h-64 md:w-80 md:h-80 rounded-full bg-brand-gold/10 blur-3xl" />
        <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-brand-gold to-transparent opacity-70" />
      </div>
      {bgImage && (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={bgImage} alt="" className="absolute inset-0 w-full h-full object-cover object-center" loading="eager" fetchPriority="high" decoding="async" />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(90deg, rgba(20,18,15,0.72) 0%, rgba(20,18,15,0.36) 45%, rgba(20,18,15,0.04) 80%)' }} aria-hidden="true" />
        </>
      )}

      {/* Yazı bloğu — solda, öne çıkan beyaz metin */}
      <div className="relative z-10 h-full flex items-center">
        <div className="container mx-auto px-6 md:px-10 flex items-center justify-between gap-4">
          <div className="max-w-lg text-center md:text-left">
            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-semibold text-white mb-3 md:mb-5 leading-tight drop-shadow-lg">
              {L.title} <span className="italic text-brand-gold font-bold">{L.titleEm}</span>
            </h1>
            <p className="hidden sm:block text-sm md:text-lg text-white/90 mb-5 md:mb-6 max-w-md mx-auto md:mx-0 leading-relaxed drop-shadow">
              {L.body}
            </p>
            <p className="text-xs sm:text-sm md:text-base font-sans font-bold text-brand-gold mb-3 tracking-wide drop-shadow-md uppercase">
              {V}
            </p>
            <Link
              href="/kategori/koltuk-takimi"
              className="inline-flex items-center gap-2 px-6 md:px-8 py-3 md:py-4 bg-brand-teal hover:bg-brand-teal2 text-white rounded-full text-sm md:text-base font-semibold shadow-lg hover:scale-105 transition-all duration-300"
            >
              {L.cta}
              <IconArrowRight size={18} />
            </Link>
          </div>

          {/* Sağda WhatsApp İletişim Hattı */}
          <a
            href={genelDestekLinki(t.locale)}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden lg:inline-flex shrink-0 items-center gap-2 px-5 py-3 bg-[#25D366] hover:bg-[#1fb855] text-white rounded-full text-sm font-semibold shadow-lg hover:scale-105 transition-all duration-300"
          >
            <IconPhone size={18} />
            {I}
          </a>
        </div>
      </div>
    </div>
  );
}

// ─── BANNER: YATAK ODASI ───────────────────────────────────
// Şık yatak odası görseli — yatak odası koleksiyonuna yönlendirir.
function BannerYatak({ banner, t }) {
  const { genelDestekLinki } = useWhatsapp();
  const bgImage = gorselSrc(banner?.bg_image_url) || '/marka/hero-yatak.jpg'; // v55: yatak odası görseli (DB görseli varsa üstüne biner)
  const baslik = {
    tr: { title: 'Yatak Odası Takımlarımız', titleEm: 'Avantajlı Fiyatlarla', body: 'Şık tasarım ve üstün konforu buluşturan yatak odası takımlarımızı keşfedin.', cta: 'Koleksiyonu Keşfet' },
    en: { title: 'Our Bedroom Sets', titleEm: 'at Great Prices', body: 'Discover bedroom sets that unite elegant design with superior comfort.', cta: 'Explore the Collection' },
    de: { title: 'Unsere Schlafzimmer', titleEm: 'zu Top-Preisen', body: 'Entdecken Sie Schlafzimmer-Sets aus elegantem Design und höchstem Komfort.', cta: 'Kollektion entdecken' },
  };
  const L = baslik[t.locale] || baslik.tr;
  const vurgu = { tr: 'Ödeme kolaylığı · Tüm Türkiye’ye teslimat', en: 'Easy payment · Delivery across Türkiye', de: 'Einfache Zahlung · Lieferung in der ganzen Türkei' };
  const iletisim = { tr: 'İletişim Hattı', en: 'Contact Line', de: 'Kontakt' };
  const V = vurgu[t.locale] || vurgu.tr;
  const I = iletisim[t.locale] || iletisim.tr;

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* v52 Möbel: yazı-odaklı hero — siyah zemin + sarı ışıma. DB görseli varsa üstüne biner. */}
      <div className="absolute inset-0 bg-brand-navy" aria-hidden="true">
        <div className="absolute -right-24 -top-24 w-80 h-80 md:w-[28rem] md:h-[28rem] rounded-full bg-brand-gold/20 blur-3xl" />
        <div className="absolute -left-20 -bottom-24 w-64 h-64 md:w-80 md:h-80 rounded-full bg-brand-gold/10 blur-3xl" />
        <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-brand-gold to-transparent opacity-70" />
      </div>
      {bgImage && (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={bgImage} alt="" className="absolute inset-0 w-full h-full object-cover object-center" loading="eager" fetchPriority="high" decoding="async" />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(90deg, rgba(20,18,15,0.72) 0%, rgba(20,18,15,0.36) 45%, rgba(20,18,15,0.04) 80%)' }} aria-hidden="true" />
        </>
      )}

      {/* Yazı bloğu — solda, öne çıkan beyaz metin */}
      <div className="relative z-10 h-full flex items-center">
        <div className="container mx-auto px-6 md:px-10 flex items-center justify-between gap-4">
          <div className="max-w-lg text-center md:text-left">
            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-semibold text-white mb-3 md:mb-5 leading-tight drop-shadow-lg">
              {L.title} <span className="italic text-brand-gold font-bold">{L.titleEm}</span>
            </h1>
            <p className="hidden sm:block text-sm md:text-lg text-white/90 mb-5 md:mb-6 max-w-md mx-auto md:mx-0 leading-relaxed drop-shadow">
              {L.body}
            </p>
            <p className="text-xs sm:text-sm md:text-base font-sans font-bold text-brand-gold mb-3 tracking-wide drop-shadow-md uppercase">
              {V}
            </p>
            <Link
              href="/kategori/yatak-odasi"
              className="inline-flex items-center gap-2 px-6 md:px-8 py-3 md:py-4 bg-brand-teal hover:bg-brand-teal2 text-white rounded-full text-sm md:text-base font-semibold shadow-lg hover:scale-105 transition-all duration-300"
            >
              {L.cta}
              <IconArrowRight size={18} />
            </Link>
          </div>

          {/* Sağda WhatsApp İletişim Hattı */}
          <a
            href={genelDestekLinki(t.locale)}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden lg:inline-flex shrink-0 items-center gap-2 px-5 py-3 bg-[#25D366] hover:bg-[#1fb855] text-white rounded-full text-sm font-semibold shadow-lg hover:scale-105 transition-all duration-300"
          >
            <IconPhone size={18} />
            {I}
          </a>
        </div>
      </div>
    </div>
  );
}

// ─── TAM-TASARIM TESLİMAT AFİŞİ (Avrupa / Türkiye) ─────────
// Yazı + kamyon + bayraklar görsele gömülü tek-parça afiş. HİÇBİR YERİ KIRPILMAZ,
// BULANIK DOLGU YOK: hero kutusunun oranı afişe eşitlendiği için (mobil kare,
// PC 16:9) object-cover afişi tam kenardan kenara doldurur.
//   • PC (md+):  16:9 afiş (srcPc)
//   • Mobil (<md): kare afiş (srcMobil)
// Tüm alan verilen bağlantıya (href) gider.
function AfisTeslimat({ srcPc, srcMobil, alt, href }) {
  return (
    <Link
      href={href}
      className="relative block w-full h-full overflow-hidden bg-[#F8EFD8]"
      aria-label={alt}
    >
      {/* Mobil: kare afiş — tam dolar */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={srcMobil}
        alt={alt}
        className="md:hidden absolute inset-0 w-full h-full object-cover object-center"
        loading="eager"
        fetchPriority="high"
        decoding="async"
      />
      {/* PC: 16:9 afiş — tam dolar */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={srcPc}
        alt={alt}
        className="hidden md:block absolute inset-0 w-full h-full object-cover object-center"
        loading="eager"
        decoding="async"
      />
    </Link>
  );
}

// Avrupa'ya teslimat afişi (1. slide)
function BannerNakliye() {
  return (
    <AfisTeslimat
      srcPc="/marka/hero-avrupa-teslimat.jpg"
      srcMobil="/marka/hero-avrupa-mobil.jpg"
      alt="Tüm Avrupa'ya adresinize teslimat — Almanya, Hollanda, İsviçre, İtalya, İngiltere, Belçika, Fransa, Danimarka"
      href="/teslimat-kurulum"
    />
  );
}

// Türkiye'ye nakliye ve kurulum afişi (4. slide)
function BannerKargo() {
  return (
    <AfisTeslimat
      srcPc="/marka/hero-turkiye-nakliye.jpg"
      srcMobil="/marka/hero-turkiye-mobil.jpg"
      alt="Tüm Türkiye'ye nakliye ve kurulum imkanı — güvenli paketleme, zamanında teslimat, profesyonel taşıma, montaj desteği"
      href="/teslimat-kurulum"
    />
  );
}

const BANNER_TIPLERI = { yasam: BannerYasam, yatak: BannerYatak, nakliye: BannerNakliye, kargo: BannerKargo };

export default function HeroCarousel({ banners = [] }) {
  const tHero = useTranslations('Hero');
  const locale = useLocale();
  const [idx, setIdx] = useState(0);
  const timerRef = useRef(null);

  // DB'den gelen banner'lardan SADECE bilinen kind'ları kabul et.
  // Eski/uyumsuz kayıtlar (simdi, avrupa, teklif gibi) tek-slide bug'ına
  // yol açmasın diye filtrelenir. Geçerli banner yoksa kod fallback'i devreye girer.
  const gecerliBanners = (banners || []).filter((b) => BANNER_TIPLERI[b.kind]);

  // DB'de geçerli banner yoksa fallback: TAM 4 banner.
  const _kaynak = gecerliBanners.length > 0
    ? gecerliBanners
    : [{ kind: 'nakliye' }, { kind: 'yasam' }, { kind: 'yatak' }, { kind: 'kargo' }];

  // SIRA: Avrupa(nakliye) → Koltuk(yasam) → Yatak → Türkiye(kargo).
  // DB'den farklı sırada gelse bile bu öncelik korunur (stabil sıralama).
  const SIRA = { nakliye: 0, yasam: 1, yatak: 2, kargo: 3 };
  const aktifBanners = _kaynak
    .slice()
    .sort((a, b) => (SIRA[a.kind] ?? 99) - (SIRA[b.kind] ?? 99));

  const ileri = useCallback(() => setIdx((p) => (p + 1) % aktifBanners.length), [aktifBanners.length]);
  const geri  = useCallback(() => setIdx((p) => (p - 1 + aktifBanners.length) % aktifBanners.length), [aktifBanners.length]);

  useEffect(() => {
    timerRef.current = setInterval(ileri, 4500);
    return () => clearInterval(timerRef.current);
  }, [ileri]);

  // FIX (Agent #15 B6): elle gezindikten sonra otomatik geçiş DURMASIN —
  // eski interval'i temizle, aksiyonu uygula, timer'ı yeniden başlat.
  const handleManual = (action) => {
    if (timerRef.current) clearInterval(timerRef.current);
    action();
    timerRef.current = setInterval(ileri, 4500);
  };

  const swipeStart = useRef(0);
  const onTouchStart = (e) => { swipeStart.current = e.touches[0].clientX; };
  const onTouchEnd = (e) => {
    const dx = e.changedTouches[0].clientX - swipeStart.current;
    if (Math.abs(dx) > 50) handleManual(dx > 0 ? geri : ileri);
  };

  const aktifBanner = aktifBanners[idx];
  const BannerComponent = BANNER_TIPLERI[aktifBanner.kind] || BannerYasam;

  return (
    <section
      className="relative w-full mx-auto max-w-[1280px] aspect-square md:aspect-video overflow-hidden rounded-2xl md:rounded-3xl shadow-card"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      aria-label="Hero"
    >
      <div key={idx} className="w-full h-full animate-fade-in">
        <BannerComponent banner={aktifBanner.id ? aktifBanner : null} t={{ tHero, locale }} />
      </div>

      <button type="button" onClick={() => handleManual(geri)}
        className="hidden md:flex absolute left-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 items-center justify-center bg-white/20 hover:bg-white/40 backdrop-blur-sm rounded-full text-white transition-colors"
        aria-label={tHero('prev')}>
        <IconChevronLeft size={24} />
      </button>
      <button type="button" onClick={() => handleManual(ileri)}
        className="hidden md:flex absolute right-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 items-center justify-center bg-white/20 hover:bg-white/40 backdrop-blur-sm rounded-full text-white transition-colors"
        aria-label={tHero('next')}>
        <IconChevronRight size={24} />
      </button>

      <div className="absolute bottom-3 md:bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {aktifBanners.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => handleManual(() => setIdx(i))}
            className={`h-2 rounded-full transition-all ${i === idx ? 'w-8 bg-white' : 'w-2 bg-white/50 hover:bg-white/80'}`}
            aria-label={tHero('goto', { n: i + 1 })}
          />
        ))}
      </div>
    </section>
  );
}
