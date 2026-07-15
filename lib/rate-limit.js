// ════════════════════════════════════════════════════════════
// Rate Limiter — Hibrit (Upstash Redis VEYA in-memory)
// ════════════════════════════════════════════════════════════
// Upstash env vars set edilmişse production-grade rate limiting.
// Yoksa in-memory Map ile çalışır (Vercel'de instance başına izole,
// ama yine de basit bot saldırılarını yavaşlatır).
//
// Kullanım:
//   import { checkRateLimit } from '@/lib/rate-limit';
//   const { ok, remaining, retryAfter } = await checkRateLimit(ip, 'login', 5, 60);
//   if (!ok) return new Response('Çok hızlı', { status: 429 });
// ════════════════════════════════════════════════════════════

// ─── In-memory store (fallback) ─────────────────────────────
const memoryStore = new Map(); // key -> [timestamp, ...]

function cleanupMemory() {
  const now = Date.now();
  for (const [key, hits] of memoryStore.entries()) {
    const filtered = hits.filter((t) => now - t < 3600_000); // 1 saatlik
    if (filtered.length === 0) memoryStore.delete(key);
    else memoryStore.set(key, filtered);
  }
}

// Bellek temizliği: her 5 dk'da bir
let cleanupTimer = null;
if (typeof setInterval === 'function' && !cleanupTimer) {
  cleanupTimer = setInterval(cleanupMemory, 300_000);
  // Vercel serverless'ta timer'lar function lifetime ile sınırlı, ama yine de çalışır
}

function memoryRateLimit(key, limit, windowSec) {
  const now = Date.now();
  const windowMs = windowSec * 1000;
  const hits = (memoryStore.get(key) || []).filter((t) => now - t < windowMs);

  if (hits.length >= limit) {
    const oldest = hits[0];
    const retryAfter = Math.ceil((oldest + windowMs - now) / 1000);
    return { ok: false, remaining: 0, retryAfter };
  }

  hits.push(now);
  memoryStore.set(key, hits);
  return { ok: true, remaining: limit - hits.length, retryAfter: 0 };
}

// ─── Upstash (production) — dinamik import, opsiyonel ────────
let upstashRedis = null;
let upstashChecked = false;

async function getUpstash() {
  if (upstashChecked) return upstashRedis;
  upstashChecked = true;

  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;

  try {
    // Dinamik import — paket yoksa hata vermez, null kalır
    const mod = await import('@upstash/redis').catch(() => null);
    if (!mod) return null;
    upstashRedis = new mod.Redis({ url, token });
    return upstashRedis;
  } catch (_) {
    return null;
  }
}

async function upstashRateLimit(key, limit, windowSec) {
  const redis = await getUpstash();
  if (!redis) return null;

  try {
    const fullKey = `rl:${key}`;
    // Sliding window: increment + expire
    const count = await redis.incr(fullKey);
    if (count === 1) {
      await redis.expire(fullKey, windowSec);
    }
    if (count > limit) {
      const ttl = await redis.ttl(fullKey);
      return { ok: false, remaining: 0, retryAfter: ttl > 0 ? ttl : windowSec };
    }
    return { ok: true, remaining: limit - count, retryAfter: 0 };
  } catch (_) {
    return null;
  }
}

// ─── Public API ──────────────────────────────────────────────

/**
 * Rate limit kontrol et.
 * Önce Upstash dener, başarısızsa in-memory'ye düşer.
 *
 * @param {string} identifier - IP veya user ID
 * @param {string} bucket - "login", "toplu-yukleme", "form-submit" gibi etiket
 * @param {number} limit - Pencere içindeki max istek (default: 10)
 * @param {number} windowSec - Pencere süresi (saniye, default: 60)
 * @returns {{ok: boolean, remaining: number, retryAfter: number}}
 */
export async function checkRateLimit(identifier, bucket, limit = 10, windowSec = 60) {
  if (!identifier) identifier = 'unknown';
  const key = `${bucket}:${identifier}`;

  // Önce Upstash
  const upstash = await upstashRateLimit(key, limit, windowSec);
  if (upstash) return upstash;

  // Fallback in-memory
  return memoryRateLimit(key, limit, windowSec);
}

/**
 * Request'ten client IP'sini çıkar.
 * Vercel: x-forwarded-for header
 */
export function getClientIP(request) {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  const realIp = request.headers.get('x-real-ip');
  if (realIp) return realIp;
  return 'unknown';
}
