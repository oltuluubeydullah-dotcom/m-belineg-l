// ════════════════════════════════════════════════════════════
// Ürün Detay Sayfası v3 — i18n + Yorumlar + AggregateRating Schema
// ════════════════════════════════════════════════════════════

export const revalidate = 300; // ISR: 300s

import { notFound } from 'next/navigation';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { Link } from '@/lib/i18n/navigation';
import ProductCard from '@/components/public/ProductCard';
import UrunDetay from './UrunDetay';
import ReviewList from '@/components/public/ReviewList';
import ReviewForm from '@/components/public/ReviewForm';
import { createPublicClient } from '@/lib/supabase/public';
import { getServiceClient } from '@/lib/supabase/service';
import { getLocalizedName, getLocalizedDesc } from '@/lib/i18n/auto-translate';

export async function generateMetadata({ params: { locale, slug } }) {
  const supabase = createPublicClient();
  const { data: urun } = await supabase
    .from('products')
    .select('name, description, translations, images, base_price, meta_title, meta_description')
    .eq('slug', slug)
    .maybeSingle();

  if (!urun) return { title: 'Ürün Bulunamadı' };

  const ad = getLocalizedName(urun, locale);
  const acklama = getLocalizedDesc(urun, locale);
  // v51 SEO: admin'in girdiği meta alanları öncelikli (sadece TR'de — diğer diller otomatik)
  const metaBaslik = (locale === 'tr' && urun.meta_title?.trim()) ? urun.meta_title.trim() : ad;
  const aciklama = (locale === 'tr' && urun.meta_description?.trim())
    ? urun.meta_description.trim().slice(0, 160)
    : (acklama ? acklama.slice(0, 160) : `${ad} - Möbel İnegöl`);

  return {
    title: metaBaslik,
    description: aciklama,
    alternates: {
      canonical: `/urun/${slug}`,
      languages: {
        tr: `/urun/${slug}`,
        en: `/en/urun/${slug}`,
        de: `/de/urun/${slug}`,
      },
    },
    openGraph: {
      title: ad,
      description: aciklama,
      images: urun.images?.[0] ? [{ url: urun.images[0] }] : [],
      type: 'website',
      locale: locale === 'tr' ? 'tr_TR' : locale === 'de' ? 'de_DE' : 'en_US',
    },
  };
}

export default async function UrunSayfasi({ params: { locale, slug } }) {
  setRequestLocale(locale);
  const t = await getTranslations('Product');
  const supabase = createPublicClient();

  // Ürün — önce bunu çek (diğerleri buna bağlı)
  const { data: urun } = await supabase
    .from('products')
    .select('*, categories!category_id(name, slug, translations)')
    .eq('slug', slug)
    .eq('is_active', true)
    .maybeSingle();

  if (!urun) notFound();

  // View counter — fire-and-forget (paralel, await etme)
  try {
    const svc = getServiceClient();
    if (svc) svc.rpc('increment_product_view', { p_id: urun.id }).then(() => {}, () => {});
  } catch (_) {}

  // PERFORMANCE: İlgili ürünler + yorumlar paralel
  const [ilgiliRes, yorumlarRes] = await Promise.all([
    supabase
      .from('products')
      .select('*, categories!category_id(name, slug, translations)')
      .eq('category_id', urun.category_id)
      .eq('is_active', true)
      .neq('id', urun.id)
      .limit(4),
    supabase
      .from('reviews')
      .select('id, name, rating, text, created_at, is_verified')
      .eq('product_id', urun.id)
      .eq('is_hidden', false)
      .order('created_at', { ascending: false }),
  ]);

  const ilgili  = ilgiliRes.data;
  const yorumlar = yorumlarRes.data;

  const reviewSayi = yorumlar?.length || 0;
  const reviewOrt = reviewSayi > 0
    ? Math.round((yorumlar.reduce((s, r) => s + r.rating, 0) / reviewSayi) * 10) / 10
    : null;

  const urunAd = getLocalizedName(urun, locale);
  const urunDesc = getLocalizedDesc(urun, locale);
  const katAd = urun.categories
    ? (locale === 'tr'
        ? urun.categories.name
        : urun.categories.translations?.[locale]?.name || urun.categories.name)
    : null;

  // Schema — Product + AggregateRating
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: urunAd,
    description: urunDesc || '',
    image: urun.images || [],
    sku: urun.slug,
    brand: { '@type': 'Brand', name: 'Möbel İnegöl' },
    offers: urun.base_price ? {
      '@type': 'Offer',
      priceCurrency: 'TRY',
      price: urun.is_on_sale && urun.sale_price ? urun.sale_price : urun.base_price,
      availability: 'https://schema.org/InStock',
      url: `https://mobelinegol.com${locale === 'tr' ? '' : '/' + locale}/urun/${urun.slug}`,
    } : undefined,
    aggregateRating: reviewSayi > 0 ? {
      '@type': 'AggregateRating',
      ratingValue: reviewOrt,
      reviewCount: reviewSayi,
    } : undefined,
    review: (yorumlar || []).slice(0, 5).map((r) => ({
      '@type': 'Review',
      reviewRating: { '@type': 'Rating', ratingValue: r.rating, bestRating: 5 },
      author: { '@type': 'Person', name: r.name },
      reviewBody: r.text,
      datePublished: r.created_at,
    })),
  };

  // BreadcrumbList — Google kırıntı yolu + AEO
  const SITE = 'https://mobelinegol.com';
  const lp = locale === 'tr' ? '' : '/' + locale;
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: locale === 'tr' ? 'Anasayfa' : locale === 'en' ? 'Home' : 'Startseite', item: `${SITE}${lp}` },
      ...(urun.categories && katAd
        ? [{ '@type': 'ListItem', position: 2, name: katAd, item: `${SITE}${lp}/kategori/${urun.categories.slug}` }]
        : []),
      { '@type': 'ListItem', position: urun.categories && katAd ? 3 : 2, name: urunAd, item: `${SITE}${lp}/urun/${urun.slug}` },
    ],
  };

  return (
    <>
      {/* Breadcrumb */}
      <div className="container mx-auto pt-6 pb-2">
        <div className="text-xs text-brand-ink/50 tracking-wider flex items-center gap-2 flex-wrap">
          <Link href="/" className="hover:text-brand-teal">
            {locale === 'tr' ? 'Anasayfa' : locale === 'en' ? 'Home' : 'Startseite'}
          </Link>
          <span>/</span>
          {urun.categories && katAd && (
            <>
              <Link href={`/kategori/${urun.categories.slug}`} className="hover:text-brand-teal">
                {katAd}
              </Link>
              <span>/</span>
            </>
          )}
          <span className="text-brand-ink/80 line-clamp-1">{urunAd}</span>
        </div>
      </div>

      {/* Ürün detay client */}
      <UrunDetay
        urun={urun}
        urunAd={urunAd}
        urunDesc={urunDesc}
        locale={locale}
        reviewOrt={reviewOrt}
        reviewSayi={reviewSayi}
      />

      {/* Schema.org */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, '\\u003c') }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema).replace(/</g, '\\u003c') }}
      />

      {/* Yorum bölümü */}
      <section className="container mx-auto py-8 md:py-12">
        <ReviewList reviews={yorumlar || []} locale={locale} />
        <div className="mt-8">
          <ReviewForm productId={urun.id} />
        </div>
      </section>

      {/* İlgili ürünler */}
      {ilgili && ilgili.length > 0 && (
        <section className="bg-brand-cream py-16 md:py-20 border-t border-brand-dark/5">
          <div className="container mx-auto">
            <h2 className="font-display text-2xl md:text-3xl font-semibold tracking-tight mb-8">
              {t('you_may_like')}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {ilgili.map((u) => <ProductCard key={u.id} urun={u} locale={locale} />)}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
