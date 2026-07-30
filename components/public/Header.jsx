// ════════════════════════════════════════════════════════════
// Header v4 — v11.5 mobil yeniden yapılandırma
// • Sticky + scroll'da yarı saydam (backdrop-blur)
// • Mobil grid: [auto | 1fr | auto] — logo taşmaz
// • Mobil menü: sol slide-in sidebar + body scroll lock + backdrop
// • Arama drawer'ı açıkken de body kilitli
// ════════════════════════════════════════════════════════════
'use client';

import { reklamEvent } from '@/lib/pazarlama';

import Image from 'next/image';
import { useState, useEffect, useCallback } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Link, useRouter, usePathname } from '@/lib/i18n/navigation';
import {
  IconMenu2, IconX, IconShoppingCart, IconSearch, IconPhone,
} from '@tabler/icons-react';
import { ISLETME, KATEGORILER as KAT_FALLBACK } from '@/lib/constants';
import { useCart } from '@/context/CartContext';
import LanguageSwitcher from './LanguageSwitcher';
import { autoTranslate } from '@/lib/i18n/auto-translate';

export default function Header({ kategoriler }) {
  const [menuAcik, setMenuAcik] = useState(false);
  const [aramaAcik, setAramaAcik] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { toplamAdet } = useCart();
  const t = useTranslations('Header');
  const tNav = useTranslations('Nav');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  // Anasayfada görselli kategori şeridi var → masaüstü metin nav'ı gizle (çift olmasın)
  const anasayfa = pathname === '/';

  // v12.4: Link üzerine gelince hedef sayfayı arka planda prefetch et
  const hoverPrefetch = useCallback((href) => {
    try { router.prefetch(href); } catch (_) { /* no-op */ }
  }, [router]);

  const KATEGORILER = kategoriler?.length ? kategoriler : KAT_FALLBACK;

  // Kategori adını locale'a göre seç
  const katAd = (kat) => {
    if (locale === 'tr') return kat.name;
    if (kat.translations?.[locale]?.name) return kat.translations[locale].name;
    return autoTranslate(kat.name, locale);
  };

  // ─── Body scroll lock — menü veya arama drawer açıkken arka sayfa kaymasın ─────
  useEffect(() => {
    if (menuAcik || aramaAcik) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = prev; };
    }
  }, [menuAcik, aramaAcik]);

  // ─── Scroll dinleyici — sticky header'da blur + transparan zemin ──────────────
  useEffect(() => {
    const handle = () => setScrolled(window.scrollY > 8);
    handle();
    window.addEventListener('scroll', handle, { passive: true });
    return () => window.removeEventListener('scroll', handle);
  }, []);

  return (
    <>
      <header
        className={`sticky top-0 z-40 border-b transition-colors duration-200 ${
          scrolled
            ? 'bg-brand-cream/80 backdrop-blur-md border-brand-dark/10 shadow-card'
            : 'bg-brand-cream border-brand-dark/10'
        }`}
      >
        <div className="container mx-auto">
          {/* ─── MOBİL ÜST BAR: [arama + telefon | LOGO orta | sepet + menü] ─── */}
          <div className="md:hidden grid grid-cols-3 items-center px-3 py-2.5">
            {/* Sol: arama + telefon (iletişim) */}
            <div className="flex items-center gap-0.5 justify-self-start">
              <button
                type="button"
                onClick={() => setAramaAcik(!aramaAcik)}
                className="p-2 inline-flex items-center justify-center text-brand-ink hover:text-brand-teal transition-colors"
                aria-label={t('search_button')}
              >
                {aramaAcik ? <IconX size={22} /> : <IconSearch size={22} />}
              </button>
              <a
                href="tel:+905360400108"
                className="p-2 inline-flex items-center justify-center text-brand-ink hover:text-brand-teal transition-colors"
                aria-label={t('call_label')}
              >
                <IconPhone size={22} />
              </a>
            </div>

            {/* Orta: Logo */}
            <Link href="/" aria-label={ISLETME.ad} className="justify-self-center flex items-center">
              <Image
                src="/marka/mobel-logo.png"
                alt={ISLETME.ad}
                width={361}
                height={120}
                priority
                className="h-16 w-auto object-contain"
                sizes="240px"
              />
            </Link>

            {/* Sağ: sepet + menü */}
            <div className="flex items-center gap-0.5 justify-self-end">
              <Link
                href="/sepet"
                className="p-2 text-brand-ink hover:text-brand-teal transition-colors relative inline-flex items-center justify-center"
                aria-label={t('cart_label')}
              >
                <IconShoppingCart size={23} stroke={1.8} />
                {toplamAdet > 0 && (
                  <span className="absolute top-0 right-0 bg-brand-gold text-brand-dark text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center animate-fade-in">
                    {toplamAdet > 99 ? '99+' : toplamAdet}
                  </span>
                )}
              </Link>
              <button
                type="button"
                onClick={() => setMenuAcik(!menuAcik)}
                className="p-2 inline-flex items-center justify-center text-brand-ink hover:text-brand-teal transition-colors"
                aria-label={t('menu_label')}
                aria-expanded={menuAcik}
              >
                <IconMenu2 size={26} />
              </button>
            </div>
          </div>

          {/* ─── MASAÜSTÜ ÜST BAR: [logo sol | arama orta | dil + sepet sağ] ─── */}
          <div className="hidden md:flex items-center gap-6 px-4 py-4">
            <Link href="/" className="flex items-center min-w-0 flex-shrink-0 pl-2" aria-label={ISLETME.ad}>
              <Image
                src="/marka/mobel-logo.png"
                alt={ISLETME.ad}
                width={361}
                height={120}
                priority
                className="h-28 w-auto object-contain"
                sizes="520px"
              />
            </Link>

            <form
              action={locale === 'tr' ? '/arama' : `/${locale}/arama`}
              method="GET"
              onSubmit={(e) => { const q = e.currentTarget.q?.value; if (q) reklamEvent('Search', { search_string: q }); }}
              className="flex items-center w-full max-w-md ml-auto mr-4 lg:mr-8 bg-white border border-brand-dark/15 rounded-full
                         focus-within:border-brand-teal focus-within:ring-1 focus-within:ring-brand-teal/30 transition-colors"
            >
              <input
                type="search"
                name="q"
                placeholder={t('search_placeholder')}
                aria-label={t('search_label')}
                className="flex-1 bg-transparent px-5 py-2.5 text-base outline-none placeholder:text-brand-ink/40"
              />
              <button
                type="submit"
                className="p-2.5 mr-1 rounded-full text-brand-ink/60 hover:text-brand-teal transition-colors"
                aria-label={t('search_button')}
              >
                <IconSearch size={20} />
              </button>
            </form>

            <div className="flex items-center gap-2 flex-shrink-0">
              <LanguageSwitcher />
              <Link
                href="/sepet"
                className="p-2 text-brand-ink hover:text-brand-teal transition-colors relative inline-flex items-center justify-center"
                aria-label={t('cart_label')}
              >
                <IconShoppingCart size={24} stroke={1.8} />
                {toplamAdet > 0 && (
                  <span className="absolute top-0 right-0 bg-brand-gold text-brand-dark text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center animate-fade-in">
                    {toplamAdet > 99 ? '99+' : toplamAdet}
                  </span>
                )}
              </Link>
            </div>
          </div>

          {/* ─── MOBİL ARAMA DRAWER ─────────────────────────────── */}
          {aramaAcik && (
            <div className="md:hidden pb-3 animate-fade-in">
              <form
                action={locale === 'tr' ? '/arama' : `/${locale}/arama`}
                method="GET"
              onSubmit={(e) => { const q = e.currentTarget.q?.value; if (q) reklamEvent('Search', { search_string: q }); }}
                className="flex items-center w-full bg-white border border-brand-dark/15 rounded-full
                           focus-within:border-brand-teal focus-within:ring-1 focus-within:ring-brand-teal/30"
              >
                <input
                  type="search"
                  name="q"
                  placeholder={t('search_placeholder')}
                  aria-label={t('search_label')}
                  autoFocus
                  className="flex-1 bg-transparent px-5 py-3 text-base outline-none placeholder:text-brand-ink/40"
                />
                <button
                  type="submit"
                  className="p-3 mr-1 text-brand-ink/60 hover:text-brand-teal"
                  aria-label={t('search_button')}
                >
                  <IconSearch size={22} />
                </button>
              </form>
            </div>
          )}
        </div>

        {/* ─── ALT: Kategori nav (masaüstü) — uzun EN/DE etiketleri için flex-wrap (taşma/kırpılma yok) ───── */}
        <nav className={`${anasayfa ? 'hidden' : 'hidden md:flex'} flex-wrap items-center justify-center gap-x-5 lg:gap-x-7 gap-y-2 py-3 px-4 border-t border-brand-dark/5`}>
          {KATEGORILER.map((kat) => (
            <Link
              key={kat.slug}
              href={`/kategori/${kat.slug}`}
              onMouseEnter={() => hoverPrefetch(`/kategori/${kat.slug}`)}
              onFocus={() => hoverPrefetch(`/kategori/${kat.slug}`)}
              prefetch={true}
              className="text-[13px] font-sans font-semibold tracking-[0.08em] uppercase text-brand-ink hover:text-brand-teal transition-colors whitespace-nowrap"
            >
              {katAd(kat)}
            </Link>
          ))}
        </nav>
      </header>

      {/* ═══ MOBİL SIDEBAR (header dışında — fixed overlay) ═══════════════════ */}
      {menuAcik && (
        <>
          {/* Backdrop */}
          <button
            type="button"
            aria-label={t('menu_close')}
            onClick={() => setMenuAcik(false)}
            className="md:hidden fixed inset-0 z-50 bg-brand-navy/40 backdrop-blur-sm animate-fade-in"
          />

          {/* Sol slide-in panel */}
          <aside
            className="md:hidden fixed top-0 left-0 bottom-0 z-[51] w-80 max-w-[85vw]
                       bg-brand-cream shadow-2xl overflow-y-auto overscroll-contain
                       animate-slide-in-left flex flex-col"
            role="dialog"
            aria-modal="true"
            aria-label={t('menu_label')}
          >
            {/* Sidebar başlık (logo) + kapat butonu */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-brand-dark/10">
              <Link href="/" onClick={() => setMenuAcik(false)} aria-label={ISLETME.ad} className="flex items-center min-w-0">
                <Image
                  src="/marka/mobel-logo.png"
                  alt={ISLETME.ad}
                  width={361}
                  height={120}
                  className="h-11 w-auto object-contain"
                  sizes="200px"
                />
              </Link>
              <button
                type="button"
                onClick={() => setMenuAcik(false)}
                aria-label={t('menu_close')}
                className="p-2 -mr-1 text-brand-ink hover:text-brand-teal transition-colors"
              >
                <IconX size={24} />
              </button>
            </div>

            {/* Kategori linkleri — mobilde HER SAYFADA görünür (anasayfa dahil) */}
            <nav className="flex-1 py-3">
              <p className="px-5 pb-1.5 text-[11px] font-semibold uppercase tracking-widest text-brand-gold">
                {tNav('categories')}
              </p>
              {KATEGORILER.map((kat) => (
                <Link
                  key={kat.slug}
                  href={`/kategori/${kat.slug}`}
                  onClick={() => setMenuAcik(false)}
                  className="block py-3 px-5 text-sm font-medium tracking-[0.08em] uppercase text-brand-ink hover:bg-brand-dark/5 hover:text-brand-teal border-b border-brand-dark/5 last:border-0 transition-colors"
                >
                  {katAd(kat)}
                </Link>
              ))}

              {/* Yardımcı linkler */}
              <div className="border-t border-brand-dark/10 mt-3 pt-3">
                <Link href="/magazalarimiz" onClick={() => setMenuAcik(false)} className="block py-3 px-5 text-sm font-semibold text-brand-teal hover:bg-brand-dark/5">
                  {tNav('stores')}
                </Link>
                <Link href="/hakkimizda" onClick={() => setMenuAcik(false)} className="block py-3 px-5 text-sm text-brand-ink hover:bg-brand-dark/5">
                  {tNav('about')}
                </Link>
                <Link href="/blog" onClick={() => setMenuAcik(false)} className="block py-3 px-5 text-sm text-brand-ink hover:bg-brand-dark/5">
                  {tNav('blog')}
                </Link>
                <Link href="/iletisim" onClick={() => setMenuAcik(false)} className="block py-3 px-5 text-sm text-brand-ink hover:bg-brand-dark/5">
                  {tNav('contact')}
                </Link>
              </div>

              {/* Dil seçici */}
              <div className="border-t border-brand-dark/10 mt-3 pt-4 px-5">
                <LanguageSwitcher />
              </div>
            </nav>
          </aside>
        </>
      )}
    </>
  );
}
