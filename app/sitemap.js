// ════════════════════════════════════════════════════════════
// sitemap.xml — Multi-language (TR/EN/DE) otomatik üretim
// ════════════════════════════════════════════════════════════
import { createPublicClient } from '@/lib/supabase/public';

const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://mobelinegol.com';
const LOCALES = ['tr', 'en', 'de'];


export default async function sitemap() {
  const supabase = createPublicClient();

  const statikYollar = [
    { path: '/',                  priority: 1.0, freq: 'daily'   },
    { path: '/hakkimizda',        priority: 0.7, freq: 'monthly' },
    { path: '/iletisim',          priority: 0.7, freq: 'monthly' },
    { path: '/magazalarimiz',     priority: 0.7, freq: 'monthly' },
    { path: '/teslimat-kurulum',  priority: 0.6, freq: 'monthly' },
    { path: '/sss',               priority: 0.7, freq: 'monthly' },
    { path: '/garanti-iade',      priority: 0.6, freq: 'yearly'  },
    { path: '/gizlilik',          priority: 0.4, freq: 'yearly'  },
    { path: '/kvkk',              priority: 0.4, freq: 'yearly'  },
    { path: '/satis-sozlesmesi',  priority: 0.4, freq: 'yearly'  },
    { path: '/blog',              priority: 0.7, freq: 'weekly'  },
  ];

  const statik = [];
  for (const s of statikYollar) {
    for (const l of LOCALES) {
      const u = l === 'tr' ? `${SITE}${s.path === '/' ? '' : s.path}` : `${SITE}/${l}${s.path === '/' ? '' : s.path}`;
      statik.push({
        url: u || SITE,
        lastModified: new Date(),
        changeFrequency: s.freq,
        priority: s.priority,
        alternates: {
          languages: {
            tr: `${SITE}${s.path === '/' ? '' : s.path}`,
            en: `${SITE}/en${s.path === '/' ? '' : s.path}`,
            de: `${SITE}/de${s.path === '/' ? '' : s.path}`,
          },
        },
      });
    }
  }

  const katSayfalari = [];
  try {
    const { data } = await supabase.from('categories').select('slug, updated_at').eq('is_active', true);
    (data || []).forEach((k) => {
      LOCALES.forEach((l) => {
        const u = l === 'tr' ? `${SITE}/kategori/${k.slug}` : `${SITE}/${l}/kategori/${k.slug}`;
        katSayfalari.push({
          url: u,
          lastModified: k.updated_at ? new Date(k.updated_at) : new Date(),
          changeFrequency: 'weekly',
          priority: 0.8,
          alternates: {
            languages: {
              tr: `${SITE}/kategori/${k.slug}`,
              en: `${SITE}/en/kategori/${k.slug}`,
              de: `${SITE}/de/kategori/${k.slug}`,
            },
          },
        });
      });
    });
  } catch (_) {}

  const urunSayfalari = [];
  try {
    const { data } = await supabase.from('products').select('slug, updated_at').eq('is_active', true);
    (data || []).forEach((u) => {
      LOCALES.forEach((l) => {
        const url = l === 'tr' ? `${SITE}/urun/${u.slug}` : `${SITE}/${l}/urun/${u.slug}`;
        urunSayfalari.push({
          url,
          lastModified: u.updated_at ? new Date(u.updated_at) : new Date(),
          changeFrequency: 'weekly',
          priority: 0.9,
          alternates: {
            languages: {
              tr: `${SITE}/urun/${u.slug}`,
              en: `${SITE}/en/urun/${u.slug}`,
              de: `${SITE}/de/urun/${u.slug}`,
            },
          },
        });
      });
    });
  } catch (_) {}

  const blogSayfalari = [];
  try {
    const { data } = await supabase.from('blog_posts').select('slug, updated_at').eq('is_published', true);
    (data || []).forEach((b) => {
      LOCALES.forEach((l) => {
        const url = l === 'tr' ? `${SITE}/blog/${b.slug}` : `${SITE}/${l}/blog/${b.slug}`;
        blogSayfalari.push({
          url,
          lastModified: b.updated_at ? new Date(b.updated_at) : new Date(),
          changeFrequency: 'monthly',
          priority: 0.6,
          alternates: {
            languages: {
              tr: `${SITE}/blog/${b.slug}`,
              en: `${SITE}/en/blog/${b.slug}`,
              de: `${SITE}/de/blog/${b.slug}`,
            },
          },
        });
      });
    });
  } catch (_) {}

  return [...statik, ...katSayfalari, ...urunSayfalari, ...blogSayfalari];
}
