// ════════════════════════════════════════════════════════════
// kvkk — CMS'ten içerik (admin düzenler)
// ════════════════════════════════════════════════════════════
export const revalidate = 3600; // ISR: 3600s

import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import PageHero from '@/components/public/PageHero';
import { getContentPage, markdownToHtml } from '@/lib/cms';

export async function generateMetadata({ params: { locale } }) {
  const sayfa = await getContentPage('kvkk', locale);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://mobelinegol.com';
  const canonicalPath = locale === 'tr' ? '/kvkk' : `/${locale}/kvkk`;
  return {
    title: sayfa?.meta_title || sayfa?.title || 'kvkk',
    description: sayfa?.meta_desc,
    alternates: {
      canonical: `${siteUrl}${canonicalPath}`,
      languages: {
        tr: `${siteUrl}/kvkk`,
        en: `${siteUrl}/en/kvkk`,
        de: `${siteUrl}/de/kvkk`,
      },
    },
  };
}

export default async function Sayfa({ params: { locale } }) {
  setRequestLocale(locale);
  const sayfa = await getContentPage('kvkk', locale);
  if (!sayfa) return notFound();

  const html = markdownToHtml(sayfa.content);

  return (
    <>
      <PageHero baslik={sayfa.title} />
      <section className="container mx-auto py-10 md:py-16">
        <article
          className="prose max-w-3xl mx-auto text-brand-ink leading-relaxed
                     prose-headings:font-display prose-headings:text-brand-dark
                     prose-a:text-brand-gold"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </section>
    </>
  );
}
