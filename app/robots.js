// ════════════════════════════════════════════════════════════
// robots.txt — Otomatik üretim
// GEO: AI arama motoru crawler'larına AÇIKÇA izin verilir
// (ChatGPT, Claude, Perplexity, Gemini, Bing). Böylece sitenin
// içeriği AI cevaplarında kaynak gösterilebilir.
// ════════════════════════════════════════════════════════════

const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://mobelinegol.com';

const ENGELLI = ['/admin/', '/giris', '/sepet/', '/api/'];

// AI / cevap motoru botları — içerik üretiminde kaynak alınması için izinli
const AI_BOTLARI = [
  'GPTBot',          // OpenAI / ChatGPT egitim+arama
  'OAI-SearchBot',   // ChatGPT Search
  'ChatGPT-User',    // ChatGPT canli tarama
  'ClaudeBot',       // Anthropic / Claude
  'Claude-Web',
  'PerplexityBot',   // Perplexity
  'Perplexity-User',
  'Google-Extended', // Gemini / AI Overviews
  'Applebot-Extended',
  'CCBot',           // Common Crawl
  'Bingbot',         // ChatGPT Search Bing index kullanir
];

export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ENGELLI,
      },
      {
        userAgent: AI_BOTLARI,
        allow: '/',
        disallow: ENGELLI,
      },
    ],
    sitemap: `${SITE}/sitemap.xml`,
    host: SITE,
  };
}
