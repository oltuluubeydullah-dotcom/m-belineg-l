// ════════════════════════════════════════════════════════════
// Möbel İnegöl — Anasayfa
// ════════════════════════════════════════════════════════════
export const revalidate = 300; // ISR: 5 dk (DB yenileme yükünü azaltır)

import { getTranslations, setRequestLocale } from 'next-intl/server';
import { IconBrandWhatsapp } from '@tabler/icons-react';
import HeroCarousel from '@/components/public/HeroCarousel';
import SeoTanitim from '@/components/public/SeoTanitim';
import TrustBadges from '@/components/public/TrustBadges';
import IndirimliKategoriler from '@/components/public/IndirimliKategoriler';
import KategoriShowcase from '@/components/public/KategoriShowcase';
import KategoriTanitim from '@/components/public/KategoriTanitim';
import InstagramYurtdisiSection from '@/components/public/InstagramYurtdisiSection';
import BlogSection from '@/components/public/BlogSection';
import FeaturedProductsInfiniteScroll from '@/components/public/FeaturedProductsInfiniteScroll';
import { createPublicClient } from '@/lib/supabase/public';
import { URUN_LISTE_SELECT } from '@/lib/supabase/queries';
import { KATEGORILER } from '@/lib/constants';
import { kategoriSirala } from '@/lib/kategoriGorsel';
import { gorselSrc } from '@/lib/gorsel';
import { genelDestekLinki } from '@/lib/whatsapp';
import { whatsappSablonlariniGetir } from '@/lib/whatsapp-server';

// ─── SEO: ana sayfa hedef-kelime metadata (İnegöl Mobilya + Avrupa'ya Teslimat) ───
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://mobelinegol.com';
const ANA_META = {
  tr: {
    title: 'İnegöl Mobilya — Koltuk, Köşe Koltuk, Yatak Odası | Avrupa\'ya Teslimat',
    description: 'İnegöl mobilyası: koltuk takımı, odaya özel ölçü köşe koltuk, yatak & yemek odası. Tüm Türkiye\'ye ve Avrupa\'ya (Almanya, Hollanda, Belçika, Fransa…) nakliye + kurulum. Möbel İnegöl — Evinize Değer Katar.',
  },
  en: {
    title: 'İnegöl Furniture — Sofas, Corner Sofas, Bedrooms | Delivery to Europe',
    description: 'İnegöl furniture: sofa sets, custom-size corner sofas, bedroom & dining sets. Delivery and professional assembly across Türkiye and to Europe (Germany, Netherlands, Belgium, France…). Möbel İnegöl.',
  },
  de: {
    title: 'İnegöl Möbel — Sofas, Ecksofas, Schlafzimmer | Lieferung nach Europa',
    description: 'İnegöl Möbel: Sofagarnituren, Ecksofas nach Maß, Schlaf- & Esszimmer. Lieferung und professionelle Montage in der Türkei und nach Europa (Deutschland, Niederlande, Belgien, Frankreich…). Möbel İnegöl.',
  },
};

export async function generateMetadata({ params: { locale } }) {
  const M = ANA_META[locale] || ANA_META.tr;
  const url = locale === 'tr' ? SITE_URL : `${SITE_URL}/${locale}`;
  return {
    title: { absolute: M.title },
    description: M.description,
    alternates: {
      canonical: url,
      languages: {
        tr: SITE_URL, en: `${SITE_URL}/en`, de: `${SITE_URL}/de`, 'x-default': SITE_URL,
      },
    },
    openGraph: { title: M.title, description: M.description, url, type: 'website' },
  };
}

/**
 * Kategori kapak görseli — admin seçimi öncelikli.
 * cover_product_id seçiliyse o ürünün ilk görseli; değilse otomatik (ilk ürün).
 * @param {Array} kategoriler slug + cover_product_id içeren kategori objeleri
 * @returns {Map<string, string>} slug → imageUrl
 */
async function kategoriGorselleriniTopluGetir(supabase, kategoriler) {
  if (!kategoriler?.length) return new Map();
  const sluglar = kategoriler.map((k) => k.slug);

  // 1) Admin'in elle seçtiği kapak ürünlerinin görselleri
  const kapakIdleri = kategoriler.map((k) => k.cover_product_id).filter(Boolean);
  const kapakGorselMap = new Map(); // productId → image
  if (kapakIdleri.length) {
    const { data: kapakData } = await supabase
      .from('products')
      .select('id, images')
      .in('id', kapakIdleri);
    for (const p of (kapakData || [])) {
      if (p.images?.[0]) kapakGorselMap.set(p.id, p.images[0]);
    }
  }

  // 2) Otomatik fallback: her kategorinin ilk ürün görseli (tek sorgu, N+1 önleme)
  const { data } = await supabase
    .from('products')
    .select('images, categories!category_id!inner(slug)')
    .eq('is_active', true)
    .in('categories.slug', sluglar)
    .order('is_featured', { ascending: false })
    .order('created_at', { ascending: false });

  const otoMap = new Map(); // slug → image
  for (const u of (data || [])) {
    const slug = u.categories?.slug;
    if (slug && !otoMap.has(slug) && u.images?.[0]) {
      otoMap.set(slug, u.images[0]);
    }
  }

  // 3) Birleştir: admin kapak fotoğrafı (image_url) > kapak ürünü > otomatik
  const gorselMap = new Map();
  for (const k of kategoriler) {
    const kapak = k.cover_product_id ? kapakGorselMap.get(k.cover_product_id) : null;
    gorselMap.set(k.slug, k.image_url || kapak || otoMap.get(k.slug) || null);
  }
  return gorselMap;
}

export default async function AnaSayfa({ params: { locale } }) {
  setRequestLocale(locale);
  const t = await getTranslations('Home');
  const tKat = await getTranslations('KategoriTanitim');
  const whatsappSablonlari = await whatsappSablonlariniGetir();
  const supabase = createPublicClient();

  // PERFORMANCE FIX: Sıralı await → paralel Promise.all (4 sorgu aynı anda)
  const [bannersRes, urunlerRes, kategorilerRes, blogRes] = await Promise.all([
    supabase
      .from('hero_banners')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true }),
    supabase
      .from('products')
      .select(URUN_LISTE_SELECT)
      .eq('is_active', true)
      .eq('is_featured', true)
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: false })
      .limit(12),
    supabase
      .from('categories')
      .select('name, slug, translations, image_url, cover_product_id, discount_percent, discount_cover_product_id')
      .eq('is_active', true)
      .order('sort_order', { ascending: true }),
    supabase
      .from('blog_posts')
      .select('id, title, slug, cover_image, excerpt, published_at')
      .eq('is_published', true)
      .order('published_at', { ascending: false, nullsFirst: false })
      .limit(3),
  ]);

  const banners       = bannersRes.data || [];
  let   urunler       = urunlerRes.data || [];
  const blogYazilari   = blogRes.data || [];
  const dbKategoriler  = kategorilerRes.data;

  // v43: Dolgu görselleri DETERMİNİSTİK — slug hash'ine göre seçilir.
  // Önceki (index bazlı) seçim her ISR yenilemesinde farklı görsel atıyordu
  // → tarayıcı cache'i işe yaramıyor, görseller "bir gelip bir gelmiyor"du.
  const urunGorselHavuzu = (urunler || [])
    .map((u) => u.images?.[0])
    .filter(Boolean);
  const slugHash = (s) => {
    let h = 0;
    for (let i = 0; i < (s || '').length; i += 1) h = (h * 31 + s.charCodeAt(i)) >>> 0;
    return h;
  };
  const blogYazilariKapakli = blogYazilari.map((y) => ({
    ...y,
    cover_image: y.cover_image
      || (urunGorselHavuzu.length
        ? urunGorselHavuzu[slugHash(y.slug) % urunGorselHavuzu.length]
        : null),
  }));

  // v37 (Agent 54 — Silent Failure Hunter): sorgu hataları artık sessiz kalmaz.
  // Vercel function log'larında "[anasayfa] ..." satırı görünür → boş bölümlerin
  // sebebi anında teşhis edilir (v35'teki "ürünler sessizce boş döndü" krizi tekrarlanmasın).
  const sorguHatalari = {
    hero: bannersRes.error, urunler: urunlerRes.error,
    kategoriler: kategorilerRes.error, blog: blogRes.error,
  };
  for (const [alan, hata] of Object.entries(sorguHatalari)) {
    if (hata) console.error(`[anasayfa] ${alan} sorgusu hata verdi:`, hata.message || hata);
  }

  // Fallback: hiç öne çıkan ürün işaretlenmemişse bölüm boş kalmasın → en yeni ürünler
  if (urunler.length === 0) {
    const { data: yeniData } = await supabase
      .from('products')
      .select('*, categories!category_id(name, slug, translations)')
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(12);
    urunler = yeniData || [];
  }

  // KART SIRASI (firma talebi v31): Sehpa & Aksesuar showcase'te GÖSTERİLMEZ,
  // Sadece DB'de mevcut olanlar dizilir (dayanıklı).
  const KART_SIRASI = [
    'yatak-odasi', 'koltuk-takimi', 'kose-koltuk',
    'yemek-odasi', 'tv-unitesi', 'masa-sandalye-set', 'bebek-genc-odasi',
  ];
  const katKaynak = (dbKategoriler && dbKategoriler.length > 0) ? dbKategoriler : KATEGORILER;
  const katHarita = new Map(katKaynak.map((k) => [k.slug, k]));
  // v46: kartlar artık DB'den (sort_order sırasıyla) gelir → müşterinin admin'de
  // yaptığı yeniden adlandırma / yeni kategori / sıralama ANINDA yansır.
  // (Eski sabit KART_SIRASI 'masa-sandalye-set' slug'ını arıyordu; müşteri o
  // kategoriyi 'Giyinme Odası' yapınca slug 'giyinme-odasi' oldu → eşleşmiyor,
  // Giyinme + Sehpa kartlardan düşüyordu.) DB boşsa eski liste fallback.
  const sergilenecekHam = (dbKategoriler && dbKategoriler.length > 0)
    ? dbKategoriler
    : KART_SIRASI.map((slug) => katHarita.get(slug)).filter(Boolean);
  // v48: sabit sıraya diz (Giyinme → Yemek ile TV arasında; yeni kategoriler sona)
  const sergilenecek = kategoriSirala(sergilenecekHam);

  // PERFORMANCE: tek sorgu ile tüm görselleri çek (N+1 önleme) — admin kapağı öncelikli
  const gorselMap = await kategoriGorselleriniTopluGetir(supabase, sergilenecek);
  const kategoriGorselleri = sergilenecek.map((kat) => ({
    ...kat,
    gorsel: gorselMap.get(kat.slug) || null,
  }));

  // Kategori tanıtım bölümleri için kapak görseli (statik oda görseli > kategori kapağı)
  const katKapak = (slug, statik) => {
    if (statik) return statik;
    const g = gorselMap.get(slug);
    return g ? gorselSrc(g) : null;
  };

  // ─── İndirimli Kategori bölümü (Nakit/Taksit üstü) ───
  // 4 sabit kategori; kapak = admin'in discount_cover_product_id seçimi,
  // yoksa kategorinin otomatik ürün görseli (showcase ile aynı mantık).
  const INDIRIM_SLUGLARI = ['koltuk-takimi', 'yatak-odasi', 'yemek-odasi', 'kose-koltuk'];
  const indirimKaynak = INDIRIM_SLUGLARI
    .map((slug) => (dbKategoriler || []).find((d) => d.slug === slug))
    .filter((k) => k && k.discount_percent > 0);
  // Kapak: admin seçimi (discount_cover_product_id) öncelikli → cover_product_id'ye eşle
  const indirimGorselGirdi = indirimKaynak.map((k) => ({
    ...k,
    cover_product_id: k.discount_cover_product_id || k.cover_product_id || null,
  }));
  const indirimGorselMap = await kategoriGorselleriniTopluGetir(supabase, indirimGorselGirdi);
  const indirimliKategoriler = indirimKaynak.map((k) => ({
    ...k,
    // v43: dolgu deterministik (slug hash) → görsel her render'da aynı kalır, cache çalışır
    gorsel: indirimGorselMap.get(k.slug)
      || (urunGorselHavuzu.length ? urunGorselHavuzu[slugHash(k.slug) % urunGorselHavuzu.length] : null),
  }));

  return (
    <>
      {/* SSR h1 — hero afiş slaytı görsel olduğu için sayfa başında görünür başlık
          yoktu (SEO + ekran okuyucu · Agent #03). sr-only: görünmez ama okunur. */}
      <h1 className="sr-only">
        {locale === 'en'
          ? 'Möbel İnegöl — İnegöl Furniture · Sofas, Bedroom Sets, Corner Sofas · Delivery across Türkiye and Europe'
          : locale === 'de'
            ? 'Möbel İnegöl — İnegöl Möbel · Sofas, Schlafzimmer, Ecksofas · Lieferung in die Türkei und nach Europa'
            : 'Möbel İnegöl — İnegöl Mobilyası · Koltuk Takımı, Yatak Odası, Köşe Koltuk · Tüm Türkiye ve Avrupa\'ya Teslimat'}
      </h1>
      <div className="container mx-auto pt-4 md:pt-6">
        <HeroCarousel banners={banners} />
      </div>

      {/* Kategori kartları — hero'nun hemen altı (özel çizim illüstrasyonlar) */}
      <KategoriShowcase
        kategoriler={kategoriGorselleri}
        locale={locale}
        kicker={t('categories_kicker')}
        title={t('categories_title')}
        titleEm={t('categories_title_em')}
        inspect={t('category_inspect')}
      />

      {/* Kategoriye özel tanıtım bölümleri — dönüşümlü (image left/right) */}
      <KategoriTanitim
        image={katKapak('yatak-odasi', '/marka/hero-yatak.jpg')}
        kicker={tKat('yatak_kicker')}
        title={tKat('yatak_title')}
        body={tKat('yatak_body')}
        cta={tKat('yatak_cta')}
        href="/kategori/yatak-odasi"
      />
      <KategoriTanitim
        image={katKapak('koltuk-takimi', '/marka/hero-koltuk.jpg')}
        kicker={tKat('koltuk_kicker')}
        title={tKat('koltuk_title')}
        body={tKat('koltuk_body')}
        cta={tKat('koltuk_cta')}
        href="/kategori/koltuk-takimi"
        reverse
      />
      <KategoriTanitim
        image={katKapak('kose-koltuk')}
        kicker={tKat('kose_kicker')}
        title={tKat('kose_title')}
        body={tKat('kose_body')}
        cta={tKat('kose_cta')}
        href="/kategori/kose-koltuk"
      />
      <KategoriTanitim
        image={katKapak('yemek-odasi')}
        kicker={tKat('yemek_kicker')}
        title={tKat('yemek_title')}
        body={tKat('yemek_body')}
        cta={tKat('yemek_cta')}
        href="/kategori/yemek-odasi"
        reverse
      />

      {/* Ürün seçkisi */}
      <section className="container mx-auto py-6 md:py-10">
        <div className="text-center mb-8 md:mb-12">
          <p className="text-brand-accent font-medium tracking-widest uppercase text-xs sm:text-sm mb-2">
            {t('selected_kicker')}
          </p>
          <h2 className="font-display text-3xl md:text-5xl font-semibold tracking-tight">
            {t('selected_title')} <span className="italic text-brand-gold">{t('selected_title_em')}</span>
          </h2>
          <p className="text-brand-ink/60 mt-3 max-w-2xl mx-auto text-sm md:text-base">
            {t('selected_text')}
          </p>
        </div>

        {urunler.length > 0 ? (
          <FeaturedProductsInfiniteScroll initialProducts={urunler} locale={locale} />
        ) : (
          <div className="text-center py-16 md:py-24 bg-gradient-to-br from-brand-cream to-white rounded-3xl border border-brand-dark/5">
            <p className="font-display text-2xl md:text-3xl font-semibold text-brand-dark mb-3">
              {t('empty_title')} <span className="italic text-brand-gold">{t('empty_title_em')}</span>
            </p>
            <p className="text-brand-ink/60 max-w-xl mx-auto px-4 mb-7">{t('empty_text')}</p>
            <a href={genelDestekLinki(locale, whatsappSablonlari)} target="_blank" rel="noopener noreferrer"
               className="inline-flex items-center gap-2 px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-full font-semibold transition-colors">
              <IconBrandWhatsapp size={20} />
              {t('whatsapp_write')}
            </a>
          </div>
        )}
      </section>

      {/* İndirimli Kategoriler — Nakit/Taksit bölümünün HEMEN ÜSTÜ */}
      <IndirimliKategoriler kategoriler={indirimliKategoriler} locale={locale} />

      {/* 4 rozet — Nakit İndirim, Taksit, Servis, İletişim */}
      <TrustBadges />

      {/* Instagram + Yurtdışı Teslimat — fotoğraftaki gibi */}
      <InstagramYurtdisiSection />

      {/* Blog — Instagram'ın hemen altında */}
      <BlogSection yazilar={blogYazilariKapakli} locale={locale} />

      <SeoTanitim />
    </>
  );
}
