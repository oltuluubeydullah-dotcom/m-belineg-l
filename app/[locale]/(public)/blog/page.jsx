// ════════════════════════════════════════════════════════════
// Blog Listesi — /blog
// ════════════════════════════════════════════════════════════

export const revalidate = 300; // ISR: 300s

import { gorselSrc } from '@/lib/gorsel';
import { Link } from '@/lib/i18n/navigation';
import { IconCalendar, IconArrowRight, IconPencil } from '@tabler/icons-react';
import PageHero from '@/components/public/PageHero';
import { createPublicClient } from '@/lib/supabase/public';
import { formatTarih } from '@/lib/utils';
import { ROTALAR } from '@/lib/constants';

export const metadata = {
  title: 'Blog',
  description: 'Möbel İnegöl blog — mobilya bakım rehberleri, dekorasyon önerileri, sektörden haberler.',
};

export default async function BlogSayfasi() {
  const supabase = createPublicClient();
  let yazilar = [];

  try {
    const { data } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('is_published', true)
      .order('published_at', { ascending: false, nullsFirst: false })
      .limit(50);
    yazilar = data || [];
  } catch (e) {
    // Tablo henüz yoksa boş liste
  }

  return (
    <>
      <PageHero
        baslik="Blog"
        altBaslik="Mobilya bakım rehberleri, dekorasyon önerileri ve sektör güncellemeleri"
        breadcrumb={[{ ad: 'Blog' }]}
      />

      <section className="container mx-auto py-12 md:py-16">
        {yazilar.length === 0 ? (
          <div className="text-center py-20 max-w-md mx-auto">
            <div className="w-20 h-20 mx-auto rounded-full bg-brand-dark/5 flex items-center justify-center mb-6">
              <IconPencil size={32} className="text-brand-ink/40" />
            </div>
            <h2 className="font-display text-2xl font-semibold text-brand-dark mb-2">
              Yakında Burada
            </h2>
            <p className="text-brand-ink/60 mb-6">
              İlk blog yazılarımızı hazırlıyoruz. Mobilya seçimi, dekorasyon ve
              bakım üzerine güzel içerikler yolda.
            </p>
            <Link href={ROTALAR.anasayfa} className="btn-primary inline-flex">
              Anasayfaya Dön
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {yazilar.map((y) => (
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
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="relative w-full h-full flex items-center justify-center p-5 text-center overflow-hidden"
                         style={{ background: 'linear-gradient(135deg, #FEC401 0%, #1A1A1A 100%)' }}>
                      <span className="absolute -right-4 -top-4 font-display text-[7rem] leading-none text-white/10 select-none">G</span>
                      <h3 className="relative font-display text-lg md:text-xl font-semibold text-white leading-snug line-clamp-3 drop-shadow">
                        {y.title}
                      </h3>
                    </div>
                  )}
                </div>
                <div className="p-5">
                  {y.published_at && (
                    <p className="text-xs text-brand-ink/50 mb-2 flex items-center gap-1">
                      <IconCalendar size={12} />
                      {formatTarih(y.published_at)}
                    </p>
                  )}
                  <h3 className="font-display text-xl font-semibold text-brand-dark group-hover:text-brand-teal transition-colors line-clamp-2 mb-2">
                    {y.title}
                  </h3>
                  {y.excerpt && (
                    <p className="text-sm text-brand-ink/70 line-clamp-3 mb-4">
                      {y.excerpt}
                    </p>
                  )}
                  <span className="inline-flex items-center gap-1 text-sm font-medium text-brand-gold group-hover:gap-2 transition-all">
                    Devamını oku
                    <IconArrowRight size={14} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
