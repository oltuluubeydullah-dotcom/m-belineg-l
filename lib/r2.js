// ════════════════════════════════════════════════════════════
// Cloudflare R2 — Server-side istemci (S3 uyumlu)
// ════════════════════════════════════════════════════════════
// SADECE server-side (API route) çağrılır. Secret'lar .env'de,
// tarayıcıya ASLA expose edilmez (Agent 07 kırmızı çizgi).
// Env eksikse null döner → çağıran Supabase fallback'ine düşer.
// AWS SDK Apache-2.0 (lisans temiz). by ubivo
// ════════════════════════════════════════════════════════════

import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';

let _client = null;

/** R2 yapılandırılmış mı? (5 env de dolu mu) */
export function r2Aktif() {
  return Boolean(
    process.env.R2_ACCOUNT_ID &&
    process.env.R2_ACCESS_KEY_ID &&
    process.env.R2_SECRET_ACCESS_KEY &&
    process.env.R2_BUCKET &&
    process.env.NEXT_PUBLIC_R2_PUBLIC_URL
  );
}

function getR2Client() {
  if (_client) return _client;
  if (!r2Aktif()) return null;

  _client = new S3Client({
    region: 'auto',
    endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: process.env.R2_ACCESS_KEY_ID,
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
    },
  });
  return _client;
}

/** Public URL'i (sondaki / temizlenir) */
export function r2PublicBase() {
  return (process.env.NEXT_PUBLIC_R2_PUBLIC_URL || '').replace(/\/+$/, '');
}

/**
 * Buffer'ı R2'ye yükler → public URL döner.
 * @param {Buffer|Uint8Array} buffer
 * @param {string} key  bucket içi yol (örn. 'urunler/171234-ab12.webp')
 * @param {string} contentType
 * @returns {Promise<string>} public URL
 */
export async function r2Yukle(buffer, key, contentType) {
  const client = getR2Client();
  if (!client) throw new Error('R2 yapılandırılmamış');

  await client.send(new PutObjectCommand({
    Bucket: process.env.R2_BUCKET,
    Key: key,
    Body: buffer,
    ContentType: contentType,
    // v51 PERF: dosya adları unique (timestamp+hash) → 1 yıl immutable cache.
    // Tarayıcı + Cloudflare CDN (custom domain'de) tekrar indirmez.
    CacheControl: 'public, max-age=31536000, immutable',
    CacheControl: 'public, max-age=31536000, immutable', // 1 yıl — değişmez dosya
  }));

  return `${r2PublicBase()}/${key}`;
}

/**
 * R2 public URL'inden objeyi siler. URL R2'ye ait değilse sessizce geçer.
 * @param {string} url
 */
export async function r2Sil(url) {
  if (!url) return;
  const base = r2PublicBase();
  if (!base || !url.startsWith(base)) return; // R2 dışı (eski Supabase) → dokunma
  const client = getR2Client();
  if (!client) return;

  const key = url.slice(base.length + 1); // base + '/'
  if (!key) return;

  try {
    await client.send(new DeleteObjectCommand({
      Bucket: process.env.R2_BUCKET,
      Key: key,
    }));
  } catch (e) {
    console.warn('[r2] silme başarısız:', e?.message);
  }
}
