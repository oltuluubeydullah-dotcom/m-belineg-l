// ════════════════════════════════════════════════════════════
// resize-r2.mjs — R2'deki mevcut görselleri toplu küçültür
// ════════════════════════════════════════════════════════════
// AMAÇ: Eski 1537 tam-boyut görseli 1600px'e indirip siteyi
//   uçurmak. URL'ler AYNI kalır (aynı key'e yazar) → DB değişmez,
//   redeploy gerekmez. Yeni upload'lar zaten küçük geliyor.
//
// GÜVENLİK:
//   • Sadece KÜÇÜLTÜR (büyütmez), küçülmüyorsa dokunmaz
//   • Format korunur (webp→webp, jpg→jpg) → uzantı/içerik uyumlu
//   • --dry-run: hiçbir şey yazmaz, sadece ne olacağını gösterir
//   • --backup: orijinali _orijinal/ klasörüne kopyalar (geri dönüş)
//   • --limit=5: önce 5 görselde dene, siteyi kontrol et, sonra tümü
//
// KURULUM + ÇALIŞTIRMA → RESIZE-KURULUM.md
// by ubivo
// ════════════════════════════════════════════════════════════

import {
  S3Client, ListObjectsV2Command, GetObjectCommand,
  PutObjectCommand, CopyObjectCommand,
} from '@aws-sdk/client-s3';
import sharp from 'sharp';

const { R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET } = process.env;

const args = process.argv.slice(2);
const DRY = args.includes('--dry-run');
const BACKUP = args.includes('--backup');
const limArg = args.find((a) => a.startsWith('--limit='));
const LIMIT = limArg ? parseInt(limArg.split('=')[1], 10) : Infinity;

const MAX_W = 1600;        // maksimum genişlik (retina'da bile net)
const QUALITY = 82;        // webp/jpeg kalite (gözle kayıpsız)
const AGIR_ESIK = 400 * 1024; // 400KB altı + 1600px altı = dokunma
const SKIP_PREFIX = '_orijinal/';

if (!R2_ACCOUNT_ID || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY || !R2_BUCKET) {
  console.error('❌ Eksik env. Gerekli: R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET');
  process.exit(1);
}

const s3 = new S3Client({
  region: 'auto',
  endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: { accessKeyId: R2_ACCESS_KEY_ID, secretAccessKey: R2_SECRET_ACCESS_KEY },
});

const IMG_RE = /\.(webp|jpe?g|png)$/i;

async function streamToBuffer(stream) {
  const chunks = [];
  for await (const c of stream) chunks.push(c);
  return Buffer.concat(chunks);
}

async function listAll() {
  let token; const out = [];
  do {
    const r = await s3.send(new ListObjectsV2Command({ Bucket: R2_BUCKET, ContinuationToken: token }));
    (r.Contents || []).forEach((o) => out.push(o));
    token = r.IsTruncated ? r.NextContinuationToken : undefined;
  } while (token);
  return out;
}

let resized = 0, skipped = 0, hata = 0, saved = 0;

const objects = (await listAll()).filter((o) => IMG_RE.test(o.Key) && !o.Key.startsWith(SKIP_PREFIX));
console.log(`Toplam görsel: ${objects.length}${DRY ? '  (DRY RUN — yazma yok)' : ''}\n`);

for (const o of objects) {
  if (resized >= LIMIT) break;
  const key = o.Key;
  try {
    const get = await s3.send(new GetObjectCommand({ Bucket: R2_BUCKET, Key: key }));
    const buf = await streamToBuffer(get.Body);
    const meta = await sharp(buf).metadata();
    const w = meta.width || 0;

    // Zaten küçükse dokunma
    if (w <= MAX_W && buf.length < AGIR_ESIK) { skipped++; continue; }

    const fmt = meta.format === 'jpeg' ? 'jpeg' : meta.format === 'png' ? 'png' : 'webp';
    let pipe = sharp(buf).rotate().resize({ width: Math.min(w, MAX_W), withoutEnlargement: true });
    if (fmt === 'jpeg') pipe = pipe.jpeg({ quality: QUALITY, mozjpeg: true });
    else if (fmt === 'png') pipe = pipe.png({ compressionLevel: 9, palette: true });
    else pipe = pipe.webp({ quality: QUALITY });
    const out = await pipe.toBuffer();

    if (out.length >= buf.length) { skipped++; continue; } // küçülmediyse dokunma

    saved += buf.length - out.length;
    console.log(`${DRY ? '[DRY] ' : ''}${key}  ${(buf.length / 1024).toFixed(0)}KB → ${(out.length / 1024).toFixed(0)}KB`);

    if (!DRY) {
      if (BACKUP) {
        await s3.send(new CopyObjectCommand({
          Bucket: R2_BUCKET, CopySource: `/${R2_BUCKET}/${encodeURIComponent(key)}`, Key: SKIP_PREFIX + key,
        }));
      }
      await s3.send(new PutObjectCommand({
        Bucket: R2_BUCKET, Key: key, Body: out, ContentType: `image/${fmt}`,
      }));
    }
    resized++;
  } catch (e) {
    hata++;
    console.warn(`⚠️  ${key}: ${e.message}`);
  }
}

console.log(`\n✅ Bitti. Küçültülen: ${resized} · Atlanan: ${skipped} · Hata: ${hata} · Kazanç: ${(saved / 1024 / 1024).toFixed(1)} MB`);
if (DRY) console.log("ℹ️  Bu bir DRY RUN idi — hiçbir şey yazılmadı. Gerçek için --dry-run parametresini kaldır.");
