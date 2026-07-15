// ════════════════════════════════════════════════════════════
// Tüm Ürünler — /urunler
// ════════════════════════════════════════════════════════════
// Tüm aktif ürünleri karışık (kategori farketmeksizin) listeler.
// "Tüm Koleksiyonu Gör" butonu buraya yönlendirir.
// ════════════════════════════════════════════════════════════

export const revalidate = 300; // ISR: 5 dk

import { setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import PageHero from '@/components/public/PageHero';
import ProductCard from '@/components/public/ProductCard';
import { createPublicClient } from '@/lib/supabase/public';
import { URUN_SAYFA_BOYUTU } from '@/lib/constants';
import { URUN_LISTE_SELECT } from '@/lib/supabase/queries';

export async function generateMetadata({ params: { locale } }) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://mobelinegol.com';
  const canonicalPath = locale === 'tr' ? '/urunler' : `/${locale}/urunler`;
  const baslik = locale === 'en' ? 'All Products' : locale === 'de' ? 'Alle Produkte' : 'Tüm Ürünler';
  return {
    title: baslik,
    description: locale === 'en'
      ? 'Explore all Möbel İnegöl products: sofas, bedrooms, dining rooms and more.'
      : locale === 'de'
      ? 'Entdecken Sie alle Produkte von Möbel İnegöl: Sofas, Schlafzimmer, Esszimmer und mehr.'
      : 'Möbel İnegöl tüm ürünleri: koltuk takımları, yatak odaları, yemek odaları ve daha fazlası.',
    alternates: {
      canonical: `${siteUrl}${canonicalPath}`,
      languages: {
        tr: `${siteUrl}/urunler`,
        en: `${siteUrl}/en/urunler`,
        de: `${siteUrl}/de/urunler`,
      },
    },
  };
}

export default async function TumUrunlerSayfasi({ params: { locale }, searchParams }) {
  setRequestLocale(locale);

  const sayfa = Math.max(1, parseInt(searchParams?.sayfa || '1', 10));
  const baslangic = (sayfa - 1) * URUN_SAYFA_BOYUTU;
  const bitis = baslangic + URUN_SAYFA_BOYUTU - 1;

  const supabase = createPublicClient();
  // Sayfalı çek + toplam sayı (paralel). Ürün sayısı arttıkça sayfa yükü sabit kalır.
  const [urunlerRes, sayimRes] = await Promise.all([
    supabase
      .from('products')
      .select(URUN_LISTE_SELECT)
      .eq('is_active', true)
      .order('is_featured', { ascending: false })
      .order('created_at', { ascending: false })
      .range(baslangic, bitis),
    supabase
      .from('products')
      .select('id', { count: 'exact', head: true })
      .eq('is_active', true),
  ]);

  const liste = urunlerRes.data || [];
  const toplam = sayimRes.count || 0;
  const sonSayfa = Math.max(1, Math.ceil(toplam / URUN_SAYFA_BOYUTU));

  const baslik = locale === 'en' ? 'All Products' : locale === 'de' ? 'Alle Produkte' : 'Tüm Ürünler';
  const altBaslik = locale === 'en'
    ? 'Browse our entire collection'
    : locale === 'de'
    ? 'Durchstöbern Sie unsere gesamte Kollektion'
    : 'Tüm koleksiyonumuzu keşfedin';

  return (
    <>
      <PageHero baslik={baslik} altBaslik={altBaslik} breadcrumb={[{ ad: baslik }]} />

      <section className="container mx-auto py-10 md:py-14">
        {liste.length === 0 ? (
          <p className="text-center text-brand-ink/60 py-20">
            {locale === 'en' ? 'No products yet.' : locale === 'de' ? 'Noch keine Produkte.' : 'Henüz ürün bulunmuyor.'}
          </p>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {liste.map((urun) => (
                <ProductCard key={urun.id} urun={urun} locale={locale} />
              ))}
            </div>

            {sonSayfa > 1 && (
              <nav className="flex flex-wrap items-center justify-center gap-2 mt-10" aria-label="Sayfalama">
                {sayfa > 1 && (
                  <Link
                    href={`?sayfa=${sayfa - 1}`}
                    className="px-4 py-2 rounded-lg border border-brand-ink/15 hover:bg-brand-ink/5 transition-colors"
                  >
                    {locale === 'en' ? 'Previous' : locale === 'de' ? 'Zurück' : 'Önceki'}
                  </Link>
                )}
                {Array.from({ length: sonSayfa }, (_, i) => i + 1).map((s) => (
                  <Link
                    key={s}
                    href={`?sayfa=${s}`}
                    aria-current={s === sayfa ? 'page' : undefined}
                    className={
                      s === sayfa
                        ? 'px-4 py-2 rounded-lg bg-brand-teal text-white font-semibold shadow-card'
                        : 'px-4 py-2 rounded-lg border border-brand-ink/15 hover:bg-brand-ink/5 transition-colors'
                    }
                  >
                    {s}
                  </Link>
                ))}
                {sayfa < sonSayfa && (
                  <Link
                    href={`?sayfa=${sayfa + 1}`}
                    className="px-4 py-2 rounded-lg border border-brand-ink/15 hover:bg-brand-ink/5 transition-colors"
                  >
                    {locale === 'en' ? 'Next' : locale === 'de' ? 'Weiter' : 'Sonraki'}
                  </Link>
                )}
              </nav>
            )}
          </>
        )}
      </section>
    </>
  );
}
