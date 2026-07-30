import { setRequestLocale, getTranslations } from 'next-intl/server';
import { IconSearch, IconBrandWhatsapp, IconHome } from '@tabler/icons-react';
import { Link } from '@/lib/i18n/navigation';
import ProductCard from '@/components/public/ProductCard';
import PageHero from '@/components/public/PageHero';
import { createPublicClient } from '@/lib/supabase/public';
import { genelDestekLinki } from '@/lib/whatsapp';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params: { locale } }) {
  const t = await getTranslations({ locale, namespace: 'Search' });
  return { title: t('title_default') };
}

export default async function AramaSayfasi({ params: { locale }, searchParams }) {
  setRequestLocale(locale);
  const t = await getTranslations('Search');
  const q = (searchParams?.q || '').trim();
  const supabase = createPublicClient();

  let sonuclar = [];
  let toplamSayi = 0;

  if (q && q.length >= 2) {
    // tsvector dene
    const tsQuery = q.toLocaleLowerCase('tr')
      .replace(/[ığşöçü]/g, (c) => ({ı:'i',ğ:'g',ş:'s',ö:'o',ç:'c',ü:'u'}[c]))
      .replace(/[^a-z0-9\s]/g, ' ').trim().split(/\s+/).filter(Boolean).join(' & ');

    let tsBasarili = false;
    if (tsQuery) {
      try {
        const { data, count, error } = await supabase
          .from('products')
          .select('*, categories!category_id(name, slug, translations)', { count: 'exact' })
          .eq('is_active', true)
          .textSearch('search_vector', tsQuery, { config: 'simple' })
          .order('is_featured', { ascending: false })
          .order('created_at', { ascending: false })
          .limit(48);
        if (!error) {
          sonuclar = data || [];
          toplamSayi = count || 0;
          tsBasarili = true;
        }
      } catch (_) {}
    }

    if (!tsBasarili) {
      const safe = q.replace(/[%_]/g, '');
      // v12.7: product_code de aramaya dahil
      const { data, count } = await supabase
        .from('products')
        .select('*, categories!category_id(name, slug, translations)', { count: 'exact' })
        .eq('is_active', true)
        .or(`name.ilike.%${safe}%,description.ilike.%${safe}%,product_code.ilike.%${safe}%`)
        .order('is_featured', { ascending: false })
        .order('created_at', { ascending: false })
        .limit(48);
      sonuclar = data || [];
      toplamSayi = count || 0;
    }
  }

  return (
    <>
      <PageHero
        baslik={q ? t('title_with_query', { q }) : t('title_default')}
        altyazi={q && q.length >= 2 ? t('results_count', { count: toplamSayi }) : t('instruction')}
      />
      <section className="container mx-auto py-10 md:py-14">
        <form action={locale === 'tr' ? '/arama' : `/${locale}/arama`} method="GET" className="max-w-2xl mx-auto mb-10">
          <div className="flex items-center bg-white border border-brand-dark/15 rounded-full focus-within:border-brand-teal focus-within:ring-1 focus-within:ring-brand-teal/30">
            <input type="search" name="q" defaultValue={q}
              placeholder={t('placeholder')} aria-label={t('placeholder')}
              className="flex-1 bg-transparent px-5 py-3 text-base outline-none placeholder:text-brand-ink/40" />
            <button type="submit" className="p-3 mr-1 rounded-full text-brand-ink/60 hover:text-brand-teal transition-colors" aria-label={t('title_default')}>
              <IconSearch size={20} />
            </button>
          </div>
        </form>

        {!q || q.length < 2 ? (
          <div className="text-center py-12 text-brand-ink/60">
            <p className="text-sm">{t('min_chars')}</p>
          </div>
        ) : sonuclar.length === 0 ? (
          <div className="text-center py-16 md:py-24 bg-gradient-to-br from-brand-cream to-white rounded-3xl border border-brand-dark/5">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-brand-dark/5 flex items-center justify-center">
              <IconSearch size={36} className="text-brand-ink/40" />
            </div>
            <p className="font-display text-2xl md:text-3xl font-semibold text-brand-dark mb-3">{t('empty_title')}</p>
            <p className="text-brand-ink/60 max-w-xl mx-auto px-4 mb-7">{t('empty_text', { q })}</p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link href="/" className="btn-primary">
                <IconHome size={18} />
                {t('go_home')}
              </Link>
              <a href={genelDestekLinki(locale)} target="_blank" rel="noopener noreferrer"
                 className="inline-flex items-center gap-2 px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-full font-semibold transition-colors">
                <IconBrandWhatsapp size={18} />
                {t('ask_whatsapp')}
              </a>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {sonuclar.map((u) => <ProductCard key={u.id} urun={u} locale={locale} />)}
          </div>
        )}
      </section>
    </>
  );
}
