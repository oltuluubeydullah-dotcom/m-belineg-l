// ════════════════════════════════════════════════════════════
// Möbel İnegöl — R2 Görsel Servis Worker'ı
// ════════════════════════════════════════════════════════════
// AMAÇ: r2.dev hız limitini (flicker sebebi) ortadan kaldırmak.
//   Worker, R2 bucket'ındaki görselleri workers.dev üzerinden
//   sınırsız + edge-cache'li servis eder.
//
// KURULUM (müşterinin Cloudflare hesabında):
//   1) Workers & Pages → Create → Worker → ad: mobel-gorsel → Deploy
//   2) Edit code → bu dosyayı yapıştır → Deploy
//   3) Settings → Bindings → Add → R2 bucket
//        Variable name: BUCKET   |   Bucket: <Möbel İnegöl bucket'ı>
//   4) URL: mobel-gorsel.<subdomain>.workers.dev
//   5) Vercel env: NEXT_PUBLIC_R2_PUBLIC_URL = https://<o URL> → Redeploy
//
// by ubivo
// ════════════════════════════════════════════════════════════

export default {
  async fetch(request, env, ctx) {
    if (request.method !== 'GET' && request.method !== 'HEAD') {
      return new Response('Method Not Allowed', { status: 405 });
    }

    const url = new URL(request.url);
    const key = decodeURIComponent(url.pathname.slice(1)); // baştaki "/" at
    if (!key) return new Response('Not found', { status: 404 });

    // Edge cache — aynı görsel tekrar istenince R2'ye gitmeden döner
    const cache = caches.default;
    const cached = await cache.match(request);
    if (cached) return cached;

    const object = await env.BUCKET.get(key);
    if (!object || !object.body) {
      return new Response('Not found', { status: 404 });
    }

    const headers = new Headers();
    object.writeHttpMetadata(headers);
    headers.set('etag', object.httpEtag);
    // 1 gün edge cache — hızlı, ama görsel güncellenirse (resize/değişim)
    // 1 gün içinde kendini yeniler (immutable DEĞİL).
    headers.set('Cache-Control', 'public, max-age=86400');
    headers.set('Access-Control-Allow-Origin', '*');

    const response = new Response(object.body, { headers });
    ctx.waitUntil(cache.put(request, response.clone()));
    return response;
  },
};
