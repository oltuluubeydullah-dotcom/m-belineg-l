// ════════════════════════════════════════════════════════════
// Kategori Sayfası — /kategori/[slug]
// ════════════════════════════════════════════════════════════
// Server component: SEO için tüm veriyi server'da çek.
// Sıralama URL parametresi olarak gelir (?sirala=fiyat-artan vs).
// ════════════════════════════════════════════════════════════

export const revalidate = 300; // ISR: 300s

import { notFound } from 'next/navigation';
import { Link } from '@/lib/i18n/navigation';
import { IconArrowLeft } from '@tabler/icons-react';
import ProductCard from '@/components/public/ProductCard';
import KategoriClient from './KategoriClient';
import { createPublicClient } from '@/lib/supabase/public';
import { URUN_LISTE_SELECT } from '@/lib/supabase/queries';
import { URUN_SAYFA_BOYUTU, ROTALAR } from '@/lib/constants';

// Kategori adını locale'e göre çevir
function kategoriAdiniAl(kategori, locale) {
  if (!kategori) return '';
  if (locale === 'tr') return kategori.name;
  return kategori.translations?.[locale]?.name || kategori.name;
}

function kategoriAciklamasiniAl(kategori, locale) {
  if (!kategori) return '';
  if (locale === 'tr') return kategori.description || '';
  return kategori.translations?.[locale]?.description || kategori.description || '';
}  // 1 dk cache

// ─── METADATA ────────────────────────────────────────────────
export async function generateMetadata({ params }) {
  const supabase = createPublicClient();
  const { locale, slug } = params;
  const { data: kategori } = await supabase
    .from('categories')
    .select('name, description, translations')
    .eq('slug', slug)
    .maybeSingle();

  if (!kategori) return { title: 'Kategori Bulunamadı' };

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://mobelinegol.com';
  const ad = kategoriAdiniAl(kategori, locale || 'tr');
  const aciklama = kategoriAciklamasiniAl(kategori, locale || 'tr') ||
    `${ad} modellerini Möbel İnegöl kalitesi ile keşfedin.`;
  const OG_LOCALES = { tr: 'tr_TR', en: 'en_US', de: 'de_DE' };

  return {
    title: ad,
    description: aciklama,
    alternates: {
      canonical: locale === 'tr' ? `${siteUrl}/kategori/${slug}` : `${siteUrl}/${locale}/kategori/${slug}`,
      languages: {
        tr: `${siteUrl}/kategori/${slug}`,
        en: `${siteUrl}/en/kategori/${slug}`,
        de: `${siteUrl}/de/kategori/${slug}`,
      },
    },
    openGraph: {
      title: ad,
      description: aciklama,
      locale: OG_LOCALES[locale] || 'tr_TR',
    },
  };
}

// ─── STATİK PATH ÜRETİMİ (build için cookie-less client) ──
// Build sırasında HTTP request scope yok, cookies() patlar.
// Bu yüzden burada cookie kullanmayan basit anon client açıyoruz.
export async function generateStaticParams() {
  const supabase = createPublicClient();
  const { data } = await supabase
    .from('categories')
    .select('slug')
    .eq('is_active', true);
  return (data || []).map((k) => ({ slug: k.slug }));
}

// ─── SAYFA ────────────────────────────────────────────────────
export default async function KategoriSayfasi({ params, searchParams }) {
  const supabase = createPublicClient();
  const sirala = searchParams?.sirala || 'varsayilan';
  const sayfa  = Math.max(1, parseInt(searchParams?.sayfa || '1', 10));

  // Kategori bilgisini çek
  const { data: kategori } = await supabase
    .from('categories')
    .select('*')
    .eq('slug', params.slug)
    .eq('is_active', true)
    .maybeSingle();

  if (!kategori) notFound();

  // Sıralama mapping
  const SIRALAMA_MAP = {
    'varsayilan':    { col: 'sort_order',  ascending: true },
    'en-yeni':       { col: 'created_at',  ascending: false },
    'fiyat-artan':   { col: 'base_price',  ascending: true },
    'fiyat-azalan':  { col: 'base_price',  ascending: false },
  };
  const siralamaConfig = SIRALAMA_MAP[sirala] || SIRALAMA_MAP['varsayilan'];

  // Pagination için aralık
  const baslangic = (sayfa - 1) * URUN_SAYFA_BOYUTU;
  const bitis     = baslangic + URUN_SAYFA_BOYUTU - 1;

  // Ürünleri ve toplam sayıyı paralel çek
  const [urunlerRes, sayimRes] = await Promise.all([
    supabase
      .from('products')
      .select(URUN_LISTE_SELECT)
      .eq('category_id', kategori.id)
      .eq('is_active', true)
      .order(siralamaConfig.col, { ascending: siralamaConfig.ascending, nullsFirst: false })
      .range(baslangic, bitis),
    supabase
      .from('products')
      .select('id', { count: 'exact', head: true })
      .eq('category_id', kategori.id)
      .eq('is_active', true),
  ]);

  const urunler = urunlerRes.data || [];
  const toplam  = sayimRes.count || 0;
  const sonSayfa = Math.max(1, Math.ceil(toplam / URUN_SAYFA_BOYUTU));

  // FIX (Agent #54 #1): sorgu hatasını "ürün yok" gibi göstermeyi ENGELLE.
  // Hata varsa logla + boş-durum yerine "geçici sorun" mesajı göster.
  const sorguHatasi = urunlerRes.error || sayimRes.error;
  if (sorguHatasi) {
    console.error('[kategori] ürün/sayım sorgusu hatası:', sorguHatasi.message || sorguHatasi);
  }

  // BreadcrumbList — Google kırıntı yolu + AEO
  const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://mobelinegol.com';
  const lp = params.locale === 'tr' ? '' : '/' + params.locale;
  const katAdSchema = kategoriAdiniAl(kategori, params.locale || 'tr');
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: params.locale === 'en' ? 'Home' : params.locale === 'de' ? 'Startseite' : 'Anasayfa', item: `${SITE}${lp}` },
      { '@type': 'ListItem', position: 2, name: katAdSchema, item: `${SITE}${lp}/kategori/${params.slug}` },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema).replace(/</g, '\\u003c') }}
      />
      {/* ─── KATEGORİ BAŞLIK ŞERİDİ ──────────────────────── */}
      <div className="section-band">
        <div className="container mx-auto text-center">
          {/* Breadcrumb */}
          <div className="text-xs text-white/70 font-sans font-medium tracking-widest uppercase mb-3 flex items-center justify-center gap-2">
            <Link href={ROTALAR.anasayfa} className="hover:text-white transition-colors">
              Anasayfa
            </Link>
            <span>/</span>
            <span>{kategoriAdiniAl(kategori, params.locale || 'tr')}</span>
          </div>

          <h1 className="font-display text-3xl md:text-5xl font-semibold tracking-tight text-white drop-shadow-md">
            {kategoriAdiniAl(kategori, params.locale || 'tr')}
          </h1>

          {kategoriAciklamasiniAl(kategori, params.locale || 'tr') && (
            <p className="text-white/90 font-sans mt-4 max-w-2xl mx-auto leading-relaxed drop-shadow-sm">
              {kategoriAciklamasiniAl(kategori, params.locale || 'tr')}
            </p>
          )}
        </div>
      </div>

      {/* ─── ARAÇ ÇUBUĞU (sıralama) ─────────────────────── */}
      <KategoriClient
        slug={params.slug}
        seciliSiralama={sirala}
        toplamUrun={toplam}
        sayfa={sayfa}
        sonSayfa={sonSayfa}
      />

      {/* ─── ÜRÜN GRID ──────────────────────────────────── */}
      <section className="container mx-auto pb-16">
        {urunler.length === 0 ? (
          <div className="text-center py-20 border-2 border-dashed border-brand-dark/10 rounded-2xl">
            <p className="font-display text-2xl text-brand-dark/60 mb-2">
              {sorguHatasi ? 'Ürünler şu an yüklenemedi' : 'Bu kategoride henüz ürün yok'}
            </p>
            <p className="text-sm text-brand-ink/50 mb-6">
              {sorguHatasi ? 'Geçici bir sorun oluştu, lütfen birazdan tekrar deneyin.' : 'Yakında bu kategoriyi ürünlerle dolduracağız.'}
            </p>
            <Link href={ROTALAR.anasayfa} className="btn-ghost inline-flex">
              <IconArrowLeft size={18} />
              Anasayfaya Dön
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {urunler.map((urun) => (
                <ProductCard key={urun.id} urun={urun} />
              ))}
            </div>

            {/* Pagination */}
            {sonSayfa > 1 && (
              <div className="mt-12 flex items-center justify-center gap-1 flex-wrap">
                {sayfa > 1 && (
                  <Link
                    href={`${ROTALAR.kategori(params.slug)}?sirala=${sirala}&sayfa=${sayfa - 1}`}
                    className="px-4 py-2 text-sm border border-brand-dark/15 rounded-lg hover:bg-brand-dark/5 transition-colors"
                  >
                    ← Önceki
                  </Link>
                )}
                {Array.from({ length: sonSayfa }, (_, i) => i + 1).map((s) => (
                  <Link
                    key={s}
                    href={`${ROTALAR.kategori(params.slug)}?sirala=${sirala}&sayfa=${s}`}
                    aria-current={s === sayfa ? 'page' : undefined}
                    className={`w-10 h-10 flex items-center justify-center text-sm rounded-lg transition-colors ${
                      s === sayfa
                        ? 'bg-brand-teal text-white font-semibold shadow-card'
                        : 'border border-brand-dark/15 hover:bg-brand-dark/5'
                    }`}
                  >
                    {s}
                  </Link>
                ))}
                {sayfa < sonSayfa && (
                  <Link
                    href={`${ROTALAR.kategori(params.slug)}?sirala=${sirala}&sayfa=${sayfa + 1}`}
                    className="px-4 py-2 text-sm border border-brand-dark/15 rounded-lg hover:bg-brand-dark/5 transition-colors"
                  >
                    Sonraki →
                  </Link>
                )}
              </div>
            )}
          </>
        )}
      </section>
    </>
  );
}
