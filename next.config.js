/** @type {import('next').NextConfig} */
const createNextIntlPlugin = require('next-intl/plugin');
const withNextIntl = createNextIntlPlugin('./lib/i18n/request.js');

const nextConfig = {
  reactStrictMode: true,

  // v11.6: Service Worker cache versioning
  // Vercel git commit SHA'sını env'e geç → her deploy'da SW cache yenilenir
  env: {
    NEXT_PUBLIC_BUILD_ID:
      process.env.VERCEL_GIT_COMMIT_SHA
      || process.env.NEXT_PUBLIC_BUILD_ID
      || `local-${Date.now()}`,
  },

  images: {
    // v43 KRİTİK: Vercel Hobby görsel optimizasyon limiti (kaynak görsel sayısı)
    // R2 taşımasıyla 1537 görselin tamamı "yeni kaynak" sayıldı → limit doldu →
    // yeni görseller 402 dönüyor ("bir yüklenip bir yüklenmeme"nin kök nedeni).
    // Görseller zaten yüklemede WebP'ye sıkıştırılıyor + R2 çıkışı ücretsiz →
    // optimizasyonu kapatıp doğrudan R2'den servis etmek hem limiti hem riski sıfırlar.
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
      // v41: Cloudflare R2 public bucket (r2.dev) + özel CDN domaini
      { protocol: 'https', hostname: '*.r2.dev' },
      { protocol: 'https', hostname: '*.r2.cloudflarestorage.com' },
      // v56: R2 custom domain (production görsel CDN'i)
      { protocol: 'https', hostname: 'cdn.mobelinegol.com' },
    ],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 31536000,
  },

  trailingSlash: false,
  productionBrowserSourceMaps: false,
  poweredByHeader: false,
  compress: true,

  async headers() {
    // v11.6 GÜVENLİK: Content-Security-Policy eklendi
    // - default-src: sadece kendi origin
    // - script-src: self + GA + Sentry CDN + inline (Next.js bootstrap için unsafe-inline gerekli)
    // - img-src: self + data + Supabase storage + WhatsApp
    // - connect-src: self + Supabase + GA + Sentry + Upstash
    const supabaseHost = (process.env.NEXT_PUBLIC_SUPABASE_URL || '')
      .replace(/^https?:\/\//, '')
      .replace(/\/.*$/, '') || '*.supabase.co';

    // v41: R2 public host (CSP img-src için). Ayarlanmamışsa r2.dev wildcard.
    const r2Host = (process.env.NEXT_PUBLIC_R2_PUBLIC_URL || '')
      .replace(/^https?:\/\//, '')
      .replace(/\/.*$/, '') || '*.r2.dev';

    const csp = [
      "default-src 'self'",
      "base-uri 'self'",
      "form-action 'self' https://wa.me https://api.whatsapp.com",
      "frame-ancestors 'none'",
      // v11.7 FIX: Harita + video embed'leri için frame-src
      "frame-src 'self' https://www.google.com https://maps.google.com https://www.youtube.com https://www.youtube-nocookie.com https://wa.me",
      "object-src 'none'",
      // v12.3 GÜVENLİK: 'unsafe-eval' sadece development'ta açık.
      // Production'da kaldırıldı → eval-based attack vektörü engellendi.
      `script-src 'self' 'unsafe-inline'${process.env.NODE_ENV === 'production' ? '' : " 'unsafe-eval'"} https://www.googletagmanager.com https://browser.sentry-cdn.com https://connect.facebook.net https://analytics.tiktok.com`,
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' data: https://fonts.gstatic.com",
      `img-src 'self' data: blob: https://${supabaseHost} https://${r2Host} https://*.r2.dev https://www.google-analytics.com https://www.facebook.com https://analytics.tiktok.com https://www.googletagmanager.com`,
      `connect-src 'self' https://${supabaseHost} wss://${supabaseHost} https://www.google-analytics.com https://*.ingest.sentry.io https://*.upstash.io https://connect.facebook.net https://www.facebook.com https://analytics.tiktok.com https://www.googletagmanager.com https://google.com/pagead https://www.google.com`,
      "media-src 'self'",
      "worker-src 'self' blob:",
      "manifest-src 'self'",
      "upgrade-insecure-requests",
    ].join('; ');

    return [
      {
        source: '/:path*',
        headers: [
          { key: 'Content-Security-Policy', value: csp },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()' },
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
        ],
      },
      {
        source: '/:path*\\.(svg|jpg|jpeg|png|webp|avif|ico|woff2)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      {
        source: '/api/:path*',
        headers: [
          { key: 'Cache-Control', value: 'no-store, must-revalidate' },
        ],
      },
      {
        source: '/sw.js',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=0, must-revalidate' },
          { key: 'Service-Worker-Allowed', value: '/' },
        ],
      },
    ];
  },
};

module.exports = withNextIntl(nextConfig);
