// ════════════════════════════════════════════════════════════
// Blog Tekil Yazı — /blog/[slug]
// ════════════════════════════════════════════════════════════

export const revalidate = 300; // ISR: 300s

import { gorselSrc } from '@/lib/gorsel';
import { notFound } from 'next/navigation';
import { Link } from '@/lib/i18n/navigation';
import { IconCalendar, IconArrowLeft } from '@tabler/icons-react';
import PageHero from '@/components/public/PageHero';
import Prose from '@/components/public/Prose';
import { createPublicClient } from '@/lib/supabase/public';
import { formatTarih } from '@/lib/utils';
import { ROTALAR } from '@/lib/constants';

export async function generateMetadata({ params }) {
  const supabase = createPublicClient();
  const { locale, slug } = params;
  const { data: yazi } = await supabase
    .from('blog_posts')
    .select('title, excerpt, image_url, cover_image')
    .eq('slug', slug)
    .eq('is_published', true)
    .maybeSingle();

  if (!yazi) return { title: 'Yazı Bulunamadı' };

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://mobelinegol.com';
  const OG_LOCALES = { tr: 'tr_TR', en: 'en_US', de: 'de_DE' };

  return {
    title: yazi.title,
    description: yazi.excerpt || `${yazi.title} - Möbel İnegöl Blog`,
    alternates: {
      canonical: locale === 'tr' ? `${siteUrl}/blog/${slug}` : `${siteUrl}/${locale}/blog/${slug}`,
      languages: {
        tr: `${siteUrl}/blog/${slug}`,
        en: `${siteUrl}/en/blog/${slug}`,
        de: `${siteUrl}/de/blog/${slug}`,
      },
    },
    openGraph: {
      title: yazi.title,
      description: yazi.excerpt || '',
      images: (yazi.cover_image || yazi.image_url) ? [{ url: yazi.cover_image || yazi.image_url }] : [],
      type: 'article',
      locale: OG_LOCALES[locale] || 'tr_TR',
    },
  };
}

export default async function BlogYaziSayfasi({ params }) {
  const supabase = createPublicClient();

  const { data: yazi } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', params.slug)
    .eq('is_published', true)
    .maybeSingle();

  if (!yazi) notFound();

  // v43 AEO: Article schema — Google + AI cevap motorları için yapısal blog verisi
  const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://mobelinegol.com';
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: yazi.title,
    description: yazi.excerpt || undefined,
    image: yazi.cover_image || yazi.image_url || `${SITE}/marka/mobel-logo.png`,
    datePublished: yazi.published_at || undefined,
    dateModified: yazi.updated_at || yazi.published_at || undefined,
    inLanguage: 'tr',
    author: { '@type': 'Organization', name: 'Möbel İnegöl', url: SITE },
    publisher: {
      '@type': 'Organization',
      name: 'Möbel İnegöl',
      logo: { '@type': 'ImageObject', url: `${SITE}/marka/mobel-logo.png` },
    },
    mainEntityOfPage: `${SITE}/blog/${yazi.slug}`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema).replace(/</g, '\\u003c') }}
      />
      <PageHero
        baslik={yazi.title}
        altBaslik={yazi.excerpt}
        breadcrumb={[
          { ad: 'Blog', href: ROTALAR.blog },
          { ad: yazi.title.length > 30 ? yazi.title.slice(0, 30) + '…' : yazi.title },
        ]}
      />

      {(yazi.cover_image || yazi.image_url) && (
        <div className="container mx-auto -mt-4 mb-8">
          <div className="aspect-[21/9] rounded-2xl overflow-hidden bg-brand-dark/5 max-w-4xl mx-auto shadow-card-h">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={gorselSrc(yazi.cover_image || yazi.image_url)}
              alt={yazi.title}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      )}

      <section className="container mx-auto py-8 md:py-12">
        {yazi.published_at && (
          <div className="max-w-3xl mx-auto mb-8 flex items-center gap-1 text-sm text-brand-ink/60">
            <IconCalendar size={16} />
            {formatTarih(yazi.published_at)}
          </div>
        )}

        <Prose>
          {yazi.content.split('\n\n').map((par, i) => {
            if (par.startsWith('## ')) {
              return <h2 key={i}>{par.replace(/^## /, '')}</h2>;
            }
            if (par.startsWith('### ')) {
              return <h3 key={i}>{par.replace(/^### /, '')}</h3>;
            }
            if (!par.trim()) return null;
            return <p key={i}>{par}</p>;
          })}
        </Prose>

        <div className="max-w-3xl mx-auto mt-12 pt-8 border-t border-brand-dark/10">
          <Link
            href={ROTALAR.blog}
            className="inline-flex items-center gap-1 text-sm text-brand-gold hover:opacity-80"
          >
            <IconArrowLeft size={16} />
            Tüm yazılara dön
          </Link>
        </div>
      </section>
    </>
  );
}
