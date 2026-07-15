# ⚡ Upstash Redis Kurulumu (5 dakika)

> Production'da rate limit + cache için ücretsiz Redis. Vercel ile native uyumlu.
> Set edilmezse `lib/rate-limit.js` in-memory fallback'a düşer (instance başına
> izole, distributed attack'ı durdurmaz).

---

## 1) Hesap Aç

1. https://console.upstash.com → "Sign Up with GitHub" (5 sn)
2. Free tier: **10,000 commands/day**, **256MB RAM** — Möbel İnegöl için yıllarca yeter

## 2) Redis Database Oluştur

1. Dashboard → **Create Database**
2. Name: `kani-mobilya-prod`
3. Region: **Frankfurt** (Vercel Frankfurt ile aynı = düşük latency)
4. Type: **Regional** (Free tier global'i desteklemiyor zaten)
5. Eviction: **allkeys-lru** (default OK)
6. **Create**

## 3) Credentials Al

Database detay sayfası → **REST API** sekmesi:

```
UPSTASH_REDIS_REST_URL=https://xxx-xxx-12345.upstash.io
UPSTASH_REDIS_REST_TOKEN=AXxxx...
```

Bunları kopyala.

## 4) Vercel'e Env Ekle

Vercel Dashboard → kani-mobilya projesi → Settings → Environment Variables:

| Key | Value | Env |
|---|---|---|
| `UPSTASH_REDIS_REST_URL` | (kopyaladığın URL) | Production + Preview |
| `UPSTASH_REDIS_REST_TOKEN` | (kopyaladığın token) | Production + Preview |

**Production'a redeploy** (otomatik tetiklenir). `@upstash/redis` paketi zaten
`package.json`'da mevcut.

## 5) Test

Production'da bir form 6 kere arka arkaya gönder → 5. denemede 429 dönmeli.

Eski (in-memory) ile fark:
- **Önce:** Vercel'in birden fazla function instance'ı varsa attack farklı
  instance'lara dağılır, rate limit etkisiz olur.
- **Sonra:** Tüm instance'lar tek Redis'i okur → IP başına sabit limit.

## 6) Maliyet İzleme

Upstash Dashboard → Database → "Usage". Aylık 10K request'i geçtikçe
dashboard'da uyarı verir. Tipik Möbel İnegöl trafiği:

- ~5K page view / ay → ~100 rate limit hit / ay
- ~1K form submit / ay → ~3K Redis call / ay

İlk yıl ücretsiz tier'da rahat kalır.

## 7) Sentry ile Birlikte

Sentry de production'da set edilirse:
```
NEXT_PUBLIC_SENTRY_DSN=https://xxx@xxx.ingest.sentry.io/xxx
```

`components/public/SentryInit.jsx` otomatik aktif. Aylık 5K event Free tier'da.

---

## Bonus — Upstash Cache

Rate limit dışında, sık değişmeyen DB query'lerini de Redis'e cache'leyebilirsin.
Örnek: `getCachedCategories()` 60 sn cache, DB load azalır.

```javascript
// lib/cache.js (örnek, henüz implemente DEĞİL)
import { Redis } from '@upstash/redis';
const redis = Redis.fromEnv();

export async function cached(key, ttlSec, fetcher) {
  const hit = await redis.get(key);
  if (hit) return hit;
  const fresh = await fetcher();
  await redis.set(key, fresh, { ex: ttlSec });
  return fresh;
}
```

---

**by ubivo — v11.6**
