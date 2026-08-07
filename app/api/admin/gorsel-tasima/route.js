// ════════════════════════════════════════════════════════════
// POST /api/admin/gorsel-tasima — Supabase Storage → Cloudflare R2
// ════════════════════════════════════════════════════════════
// TEK SEFERLİK TAŞIMA. DB'deki tüm Supabase Storage görsel URL'lerini
// bulur, R2'ye kopyalar (aynı klasör/dosya anahtarıyla), DB'deki URL'i
// yeni cdn.mobelinegol.com adresiyle günceller.
//
// • SADECE admin (allowlist) çağırabilir.
// • Parça parça çalışır — client `bitti:true` gelene kadar döngüyle çağırır.
//   (Serverless timeout yok.)
// • İDEMPOTENT — taşınanlar DB'de artık Supabase URL'i taşımadığı için
//   sonraki turda listede yer almaz. Baştan basılırsa kaldığı yerden devam.
// • Kısmi/kalıcı hatalar `atla` listesiyle client'tan geri gelir (sonsuz
//   döngü yok).
//
// Kaynak kolonlar: products.images[] · categories.image_url ·
// blog_posts.image_url + cover_image · hero_banners.bg_image_url
// by ubivo
// ════════════════════════════════════════════════════════════

import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { isAdminUser } from '@/lib/auth/admin';
import { getServiceClient } from '@/lib/supabase/service';
import { r2Aktif, r2Yukle } from '@/lib/r2';

export const runtime = 'nodejs';
export const maxDuration = 60;

const BUCKET_ISARET = '/mobel-medya/';
const SCALAR_CHUNK = 6;   // tur başına düz-kolon görsel sayısı

// Supabase Storage (mobel-medya) URL'i mi?
function supabaseStorageMi(u) {
  return typeof u === 'string' && u.includes('/storage/v1/object/') && u.includes(BUCKET_ISARET);
}

// URL'den R2 anahtarını çıkar (klasör yapısını korur): .../mobel-medya/urunler/x.webp → urunler/x.webp
function anahtarCikar(u) {
  const i = u.indexOf(BUCKET_ISARET);
  if (i === -1) return null;
  let key = u.slice(i + BUCKET_ISARET.length);
  const q = key.indexOf('?');
  if (q !== -1) key = key.slice(0, q);
  try { key = decodeURIComponent(key); } catch { /* zaten çözülü */ }
  return key || null;
}

function tipTahmin(key) {
  const ext = (key.split('.').pop() || '').toLowerCase();
  if (ext === 'png') return 'image/png';
  if (ext === 'webp') return 'image/webp';
  if (ext === 'gif') return 'image/gif';
  if (ext === 'avif') return 'image/avif';
  return 'image/jpeg';
}

// Bir Supabase URL'ini R2'ye kopyala → yeni public URL döner
async function tekTasi(url) {
  const key = anahtarCikar(url);
  if (!key) throw new Error('anahtar çıkarılamadı');
  const resp = await fetch(url);
  if (!resp.ok) throw new Error(`indirme ${resp.status}`);
  const ct = resp.headers.get('content-type') || tipTahmin(key);
  const buffer = Buffer.from(await resp.arrayBuffer());
  return await r2Yukle(buffer, key, ct);
}

// Tüm tablolardan taşınacak birimleri topla (arrays önce → tur başına 1 satır).
async function birimleriTopla(db) {
  const birimler = [];

  // products.images[] — satır başına bir birim (dizi atomik güncellenir)
  const { data: urunler, error: uErr } = await db
    .from('products').select('id, images');
  if (uErr) throw new Error('products okunamadı: ' + uErr.message);
  for (const r of urunler || []) {
    const imgs = Array.isArray(r.images) ? r.images : [];
    if (imgs.some(supabaseStorageMi)) {
      birimler.push({ tur: 'arr', tablo: 'products', kolon: 'images', id: r.id, images: imgs });
    }
  }

  // Düz kolonlar
  const duzKaynaklar = [
    { tablo: 'categories',  kolonlar: ['image_url'] },
    { tablo: 'blog_posts',  kolonlar: ['image_url', 'cover_image'] },
    { tablo: 'hero_banners', kolonlar: ['bg_image_url'] },
  ];
  for (const { tablo, kolonlar } of duzKaynaklar) {
    const { data, error } = await db.from(tablo).select(['id', ...kolonlar].join(', '));
    if (error) continue; // kolon/tablo yoksa sessiz geç
    for (const r of data || []) {
      for (const kolon of kolonlar) {
        if (supabaseStorageMi(r[kolon])) {
          birimler.push({ tur: 'scalar', tablo, kolon, id: r.id, url: r[kolon] });
        }
      }
    }
  }

  // Diziler önce (tur başına tek satır işlensin → timeout güvenli)
  birimler.sort((a, b) => (a.tur === 'arr' ? -1 : 1) - (b.tur === 'arr' ? -1 : 1));
  return birimler;
}

function birimAnahtar(b) {
  return `${b.tablo}:${b.kolon}:${b.id}`;
}

export async function POST(request) {
  // ── Auth: sadece admin ──
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ ok: false, error: 'Yetkisiz' }, { status: 401 });
    if (!isAdminUser(user)) return NextResponse.json({ ok: false, error: 'Yetki yok' }, { status: 403 });
  } catch {
    return NextResponse.json({ ok: false, error: 'Auth hatası' }, { status: 401 });
  }

  if (!r2Aktif()) {
    return NextResponse.json({
      ok: false,
      error: 'R2 yapılandırılmamış. Vercel env (R2_* + NEXT_PUBLIC_R2_PUBLIC_URL) girilip Redeploy yapılmalı.',
    }, { status: 503 });
  }

  const db = getServiceClient();
  if (!db) {
    return NextResponse.json({ ok: false, error: 'Service client yok (SUPABASE_SERVICE_ROLE_KEY eksik)' }, { status: 503 });
  }

  let atla = [];
  try {
    const body = await request.json();
    if (Array.isArray(body?.atla)) atla = body.atla;
  } catch { /* boş gövde OK */ }

  let tumBirimler;
  try {
    tumBirimler = await birimleriTopla(db);
  } catch (e) {
    return NextResponse.json({ ok: false, error: e?.message || 'Tarama hatası' }, { status: 500 });
  }

  const atlaSet = new Set(atla);
  const kalanlar = tumBirimler.filter((b) => !atlaSet.has(birimAnahtar(b)));

  // Toplam kalan görsel sayısı (ilerleme çubuğu için)
  const kalanGorsel = kalanlar.reduce((s, b) =>
    s + (b.tur === 'arr' ? b.images.filter(supabaseStorageMi).length : 1), 0);

  if (kalanlar.length === 0) {
    return NextResponse.json({ ok: true, bitti: true, kalanGorsel: 0, islenen: [] });
  }

  // Bu turda işlenecek batch: ilk birim dizi ise sadece onu; değilse 6 düz kolon.
  let batch;
  if (kalanlar[0].tur === 'arr') batch = [kalanlar[0]];
  else batch = kalanlar.filter((b) => b.tur === 'scalar').slice(0, SCALAR_CHUNK);

  const islenen = [];

  for (const b of batch) {
    if (b.tur === 'arr') {
      const yeni = [...b.images];
      let degisti = false, tasinan = 0;
      const hatalar = [];
      for (let i = 0; i < b.images.length; i++) {
        const u = b.images[i];
        if (!supabaseStorageMi(u)) continue;
        try {
          yeni[i] = await tekTasi(u);
          degisti = true; tasinan++;
        } catch (e) {
          hatalar.push(e?.message || 'hata');
        }
      }
      let durum = 'tasindi';
      if (degisti) {
        const { error } = await db.from('products').update({ images: yeni }).eq('id', b.id);
        if (error) { durum = 'hata'; hatalar.push('DB: ' + error.message); }
      }
      if (hatalar.length) durum = tasinan > 0 ? 'kismi' : 'hata';
      islenen.push({ anahtar: birimAnahtar(b), tablo: b.tablo, tasinan, durum, hata: hatalar[0] || null });
    } else {
      try {
        const yeniUrl = await tekTasi(b.url);
        const { error } = await db.from(b.tablo).update({ [b.kolon]: yeniUrl }).eq('id', b.id);
        if (error) throw new Error('DB: ' + error.message);
        islenen.push({ anahtar: birimAnahtar(b), tablo: b.tablo, tasinan: 1, durum: 'tasindi', hata: null });
      } catch (e) {
        islenen.push({ anahtar: birimAnahtar(b), tablo: b.tablo, tasinan: 0, durum: 'hata', hata: e?.message || 'hata' });
      }
    }
  }

  // Başarısız/kısmi birimleri client `atla`ya eklesin (sonsuz döngü önlenir).
  return NextResponse.json({
    ok: true,
    bitti: false,
    kalanGorsel,
    islenen,
  });
}
