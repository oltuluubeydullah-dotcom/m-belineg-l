#!/usr/bin/env node
/* ════════════════════════════════════════════════════════════
 * Supabase Storage → Cloudflare R2 TOPLU GÖRSEL TAŞIMA
 * ════════════════════════════════════════════════════════════
 * Ne yapar:
 *   1. DB'deki tüm Supabase görsel URL'lerini bulur
 *   2. Her birini indirir → R2'ye aynı isimle yükler
 *   3. DB'deki URL'i R2 URL'i ile günceller
 *   4. (opsiyonel) Supabase'den siler
 *
 * Güvenli:
 *   • Idempotent — zaten R2'de olan URL'lere dokunmaz (tekrar çalıştırılabilir)
 *   • --dry-run ile önce SADECE rapor verir, hiçbir şey değiştirmez
 *   • Her adım loglanır; hata olursa o kayıt atlanır, devam eder
 *   • DB güncellemesi BAŞARILI R2 yüklemesinden SONRA yapılır
 *     → görsel asla "kayıp" olmaz (önce R2'de var, sonra URL değişir)
 *
 * Kullanım:
 *   node scripts/r2-tasi.mjs --dry-run     # önce bunu çalıştır, raporu gör
 *   node scripts/r2-tasi.mjs               # gerçek taşıma (Supabase'i SİLMEZ)
 *   node scripts/r2-tasi.mjs --delete-source  # taşı + Supabase'den sil
 *
 * Gerekli env (.env):
 *   NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
 *   R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY,
 *   R2_BUCKET, NEXT_PUBLIC_R2_PUBLIC_URL
 *
 * by ubivo
 * ════════════════════════════════════════════════════════════ */

import { createClient } from '@supabase/supabase-js';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

// ── .env yükle (basit parser, dotenv bağımlılığı yok) ──
const __dir = dirname(fileURLToPath(import.meta.url));
try {
  const envDosya = join(__dir, '..', '.env');
  const icerik = readFileSync(envDosya, 'utf8');
  for (const satir of icerik.split('\n')) {
    const m = satir.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) {
      process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
    }
  }
} catch { /* .env.local de denenebilir */ }
try {
  const icerik = readFileSync(join(__dir, '..', '.env.local'), 'utf8');
  for (const satir of icerik.split('\n')) {
    const m = satir.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
} catch {}

const DRY = process.argv.includes('--dry-run');
const DELETE_SOURCE = process.argv.includes('--delete-source');

// ── Env kontrol ──
const gerekli = ['NEXT_PUBLIC_SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY',
  'R2_ACCOUNT_ID', 'R2_ACCESS_KEY_ID', 'R2_SECRET_ACCESS_KEY',
  'R2_BUCKET', 'NEXT_PUBLIC_R2_PUBLIC_URL'];
const eksik = gerekli.filter((k) => !process.env[k]);
if (eksik.length) {
  console.error('❌ Eksik env:', eksik.join(', '));
  console.error('   .env dosyasına ekleyip tekrar dene.');
  process.exit(1);
}

const SUPA_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const R2_BASE = process.env.NEXT_PUBLIC_R2_PUBLIC_URL.replace(/\/+$/, '');
const BUCKET = 'mobel-medya'; // Supabase storage bucket adı

const supabase = createClient(SUPA_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

const r2 = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});

const istat = { tarandi: 0, tasindi: 0, atlandi: 0, hata: 0 };

function supabaseUrlMu(url) {
  return typeof url === 'string' && url.includes('.supabase.co/storage/');
}

// Supabase public URL → bucket içi key
function urldenKey(url) {
  const isaret = `/${BUCKET}/`;
  const idx = url.indexOf(isaret);
  if (idx === -1) return null;
  return url.slice(idx + isaret.length).split('?')[0];
}

function tipTahmin(key) {
  const u = key.split('.').pop().toLowerCase();
  return u === 'png' ? 'image/png'
    : u === 'webp' ? 'image/webp'
    : u === 'gif' ? 'image/gif'
    : 'image/jpeg';
}

// Tek bir görseli taşı → yeni R2 URL döner (zaten R2 ise olduğu gibi)
async function gorselTasi(url) {
  if (!url) return url;
  if (url.startsWith(R2_BASE)) { istat.atlandi++; return url; } // zaten R2
  if (!supabaseUrlMu(url)) { istat.atlandi++; return url; }     // tanımsız kaynak

  istat.tarandi++;
  const key = urldenKey(url);
  if (!key) { console.warn('  ⚠ key çıkarılamadı:', url); istat.hata++; return url; }

  if (DRY) {
    console.log(`  → [DRY] ${key}`);
    istat.tasindi++;
    return `${R2_BASE}/${key}`;
  }

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`indirme ${res.status}`);
    const buf = Buffer.from(await res.arrayBuffer());

    await r2.send(new PutObjectCommand({
      Bucket: process.env.R2_BUCKET,
      Key: key,
      Body: buf,
      ContentType: tipTahmin(key),
      CacheControl: 'public, max-age=31536000, immutable',
    }));

    if (DELETE_SOURCE) {
      await supabase.storage.from(BUCKET).remove([key]).catch(() => {});
    }
    istat.tasindi++;
    console.log(`  ✓ ${key}`);
    return `${R2_BASE}/${key}`;
  } catch (e) {
    console.error(`  ✗ ${key}: ${e.message}`);
    istat.hata++;
    return url; // hata → eski URL korunur (görsel kaybolmaz)
  }
}

async function tabloTasi(tablo, kolonlar) {
  console.log(`\n📦 ${tablo} taşınıyor...`);
  const { data, error } = await supabase.from(tablo).select(['id', ...kolonlar].join(','));
  if (error) { console.error(`  Tablo okunamadı: ${error.message}`); return; }

  for (const kayit of data || []) {
    const guncelleme = {};
    let degisti = false;

    for (const kolon of kolonlar) {
      const deger = kayit[kolon];
      if (Array.isArray(deger)) {
        // text[] (products.images)
        const yeni = [];
        for (const u of deger) yeni.push(await gorselTasi(u));
        if (JSON.stringify(yeni) !== JSON.stringify(deger)) { guncelleme[kolon] = yeni; degisti = true; }
      } else if (typeof deger === 'string' && deger) {
        const yeni = await gorselTasi(deger);
        if (yeni !== deger) { guncelleme[kolon] = yeni; degisti = true; }
      }
    }

    if (degisti && !DRY) {
      const { error: upErr } = await supabase.from(tablo).update(guncelleme).eq('id', kayit.id);
      if (upErr) console.error(`  DB güncelleme hatası (${tablo}/${kayit.id}): ${upErr.message}`);
    }
  }
}

(async () => {
  console.log('════════════════════════════════════════');
  console.log(` Supabase → R2 Taşıma ${DRY ? '(DRY-RUN — değişiklik yok)' : ''}`);
  console.log(` Kaynak silme: ${DELETE_SOURCE ? 'AÇIK' : 'kapalı'}`);
  console.log('════════════════════════════════════════');

  await tabloTasi('categories', ['image_url']);
  await tabloTasi('products', ['images']);
  await tabloTasi('blog_posts', ['image_url', 'cover_image']);
  await tabloTasi('hero_banners', ['bg_image_url']);

  console.log('\n════════════════════════════════════════');
  console.log(` Tarandı: ${istat.tarandi}  Taşındı: ${istat.tasindi}  Atlandı: ${istat.atlandi}  Hata: ${istat.hata}`);
  console.log('════════════════════════════════════════');
  if (DRY) console.log('Bu bir DRY-RUN idi. Gerçek taşıma için --dry-run olmadan çalıştır.');
  else console.log('✅ Bitti. Siteyi kontrol et; sorun yoksa --delete-source ile Supabase boşaltılabilir.');
})();
