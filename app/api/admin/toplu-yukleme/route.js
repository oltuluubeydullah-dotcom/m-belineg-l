// ════════════════════════════════════════════════════════════
// POST /api/admin/toplu-yukleme — ZIP'ten toplu ürün ekleme
// ════════════════════════════════════════════════════════════
// Akış: Client ZIP'i Storage'a (mobel-arsiv) yükler → bu route path alır,
// arşivi indirir, çözer ve Kategori/Ürün/resim.jpg yapısını işler.
//
// CHUNK'LAMA (504 önleme): Arşiv büyükse tek istekte bitmez. İstek gövdesinde
// `offset` gelir; route SADECE offset..offset+CHUNK arası ürünleri işler,
// `sonrakiOffset` ve `done` döner. Client bitene kadar döngüyle çağırır.
// Ürün listesi STABİL sıralanır (kategori→ürün adı) → offset chunk'lama
// deterministik, her ürün tam bir kez işlenir. Ayrıca mevcut slug atlanır
// (idempotent — yarıda kesilip tekrar başlansa bile çift ürün oluşmaz).
//
// Görseller R2 aktifse R2'ye, değilse Supabase Storage'a (mobel-medya) gider.
// Sadece allowlist admin erişebilir. Service role RLS'i bypass eder. by ubivo
// ════════════════════════════════════════════════════════════

import { NextResponse } from 'next/server';
import JSZip from 'jszip';
import { createClient } from '@/lib/supabase/server';
import { getServiceClient } from '@/lib/supabase/service';
import { isAdminUser } from '@/lib/auth/admin';
import { r2Aktif, r2Yukle } from '@/lib/r2';
import { slugify } from '@/lib/slugify';

export const runtime = 'nodejs';
export const maxDuration = 60;

const ARSIV_BUCKET = 'mobel-arsiv';
const MEDYA_BUCKET = 'mobel-medya';
const CHUNK = 5; // her çağrıda işlenecek ürün sayısı (görsel yüklemesi yavaş)
const RESIM_UZANTI = /\.(jpe?g|png|webp)$/i;

function uzantiCoz(ad) {
  const m = ad.match(/\.([a-z0-9]+)$/i);
  return m ? m[1].toLowerCase() : 'jpg';
}
function contentTypeCoz(uz) {
  return uz === 'png' ? 'image/png' : uz === 'webp' ? 'image/webp' : 'image/jpeg';
}

// Sunucu tarafı görsel yükleme: R2 aktifse R2, değilse Supabase Storage.
async function gorselYukle(service, buffer, uzanti, ctype) {
  const key = `urunler/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${uzanti}`;
  if (r2Aktif()) return r2Yukle(buffer, key, ctype);
  const { error } = await service.storage
    .from(MEDYA_BUCKET)
    .upload(key, buffer, { contentType: ctype, upsert: false });
  if (error) throw error;
  const { data } = service.storage.from(MEDYA_BUCKET).getPublicUrl(key);
  return data.publicUrl;
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

  let body = {};
  try { body = await request.json(); } catch { /* boş OK */ }
  const path = String(body.path || '');
  const filename = String(body.filename || '');
  const offset = Math.max(0, parseInt(body.offset, 10) || 0);

  if (!path) return NextResponse.json({ ok: false, error: 'path yok' }, { status: 400 });
  if (/\.rar$/i.test(filename || path)) {
    return NextResponse.json(
      { ok: false, error: 'RAR desteklenmiyor — lütfen arşivi .zip olarak yükleyin.' },
      { status: 415 },
    );
  }

  const service = getServiceClient();
  if (!service) {
    return NextResponse.json(
      { ok: false, error: 'Servis anahtarı yapılandırılmamış (SUPABASE_SERVICE_ROLE_KEY).' },
      { status: 503 },
    );
  }

  // ── 1) Arşivi Storage'dan indir ──
  let zipBuf;
  try {
    const { data, error } = await service.storage.from(ARSIV_BUCKET).download(path);
    if (error || !data) throw error || new Error('Arşiv bulunamadı');
    zipBuf = Buffer.from(await data.arrayBuffer());
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: 'Arşiv indirilemedi: ' + (e?.message || '') },
      { status: 400 },
    );
  }

  // ── 2) ZIP'i çöz + ürün listesini kur (stabil sıra → deterministik chunk) ──
  let zip;
  try {
    zip = await JSZip.loadAsync(zipBuf);
  } catch {
    return NextResponse.json({ ok: false, error: 'ZIP okunamadı (bozuk dosya?)' }, { status: 400 });
  }

  const urunMap = new Map(); // "kategori/::/urun" → { kategoriAd, urunAd, resimler:[{name, entry}] }
  zip.forEach((relPath, entry) => {
    if (entry.dir) return;
    const temiz = relPath.replace(/\\/g, '/').replace(/^\/+/, '');
    if (temiz.includes('__MACOSX')) return;
    const parcalar = temiz.split('/').filter(Boolean);
    if (parcalar.length < 3) return; // en az Kategori/Ürün/dosya
    const dosyaAd = parcalar[parcalar.length - 1];
    if (dosyaAd.startsWith('.') || dosyaAd === 'Thumbs.db') return;
    if (!RESIM_UZANTI.test(dosyaAd)) return;
    // Son üç parça: Kategori / Ürün / resim (kök klasör varsa yok sayılır)
    const urunAd = parcalar[parcalar.length - 2];
    const kategoriAd = parcalar[parcalar.length - 3];
    const anahtar = `${kategoriAd}/::/${urunAd}`;
    if (!urunMap.has(anahtar)) urunMap.set(anahtar, { kategoriAd, urunAd, resimler: [] });
    urunMap.get(anahtar).resimler.push({ name: dosyaAd, entry });
  });

  const urunListesi = [...urunMap.values()].sort(
    (a, b) =>
      a.kategoriAd.localeCompare(b.kategoriAd, 'tr') ||
      a.urunAd.localeCompare(b.urunAd, 'tr'),
  );
  urunListesi.forEach((u) =>
    u.resimler.sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true })),
  );

  const toplam = urunListesi.length;
  if (toplam === 0) {
    return NextResponse.json(
      { ok: false, error: 'ZIP içinde "Kategori/Ürün/resim.jpg" yapısı bulunamadı.' },
      { status: 400 },
    );
  }

  // ── 3) Bu chunk'ı işle ──
  const dilim = urunListesi.slice(offset, offset + CHUNK);
  const rapor = {
    kategoriler: { eklenen: 0 },
    urunler: { eklenen: 0, atlanan: 0 },
    resimler: { yuklenen: 0 },
    detay: [],
    hatalar: [],
  };

  const katCache = new Map(); // slug → id (bu çağrı içi)
  async function kategoriId(kategoriAd) {
    const slug = slugify(kategoriAd);
    if (katCache.has(slug)) return katCache.get(slug);
    const { data: mevcut } = await service.from('categories').select('id').eq('slug', slug).maybeSingle();
    if (mevcut?.id) { katCache.set(slug, mevcut.id); return mevcut.id; }
    const { data: yeni, error } = await service
      .from('categories')
      .insert([{ name: kategoriAd, slug, is_active: true }])
      .select('id')
      .maybeSingle();
    if (error || !yeni) {
      // Yarış durumu: başka istek oluşturmuş olabilir → tekrar oku
      const { data: tekrar } = await service.from('categories').select('id').eq('slug', slug).maybeSingle();
      if (tekrar?.id) { katCache.set(slug, tekrar.id); return tekrar.id; }
      throw error || new Error('Kategori oluşturulamadı');
    }
    katCache.set(slug, yeni.id);
    rapor.kategoriler.eklenen++;
    rapor.detay.push(`+ Kategori: ${kategoriAd}`);
    return yeni.id;
  }

  for (const u of dilim) {
    try {
      const urunSlug = slugify(u.urunAd);
      const { data: mevcutUrun } = await service.from('products').select('id').eq('slug', urunSlug).maybeSingle();
      if (mevcutUrun?.id) {
        rapor.urunler.atlanan++;
        rapor.detay.push(`= Atlandı (zaten var): ${u.urunAd}`);
        continue;
      }

      const kategori_id = await kategoriId(u.kategoriAd);

      const urls = [];
      for (const r of u.resimler) {
        try {
          const buf = await r.entry.async('nodebuffer');
          const uz = uzantiCoz(r.name);
          const url = await gorselYukle(service, buf, uz, contentTypeCoz(uz));
          urls.push(url);
          rapor.resimler.yuklenen++;
        } catch (ge) {
          rapor.hatalar.push(`${u.urunAd} / ${r.name}: görsel yüklenemedi (${ge?.message || ''})`);
        }
      }

      const { error: urunErr } = await service.from('products').insert([{
        name: u.urunAd,
        slug: urunSlug,
        category_id: kategori_id,
        images: urls,
        is_active: true,
      }]);
      if (urunErr) throw urunErr;
      rapor.urunler.eklenen++;
      rapor.detay.push(`+ Ürün: ${u.urunAd} (${urls.length} görsel)`);
    } catch (e) {
      rapor.hatalar.push(`${u.urunAd}: ${e?.message || 'işlenemedi'}`);
    }
  }

  const sonrakiOffset = offset + dilim.length;
  const done = sonrakiOffset >= toplam;

  // Son chunk: geçici arşivi temizle (yer tutmasın).
  if (done) {
    try { await service.storage.from(ARSIV_BUCKET).remove([path]); } catch { /* best-effort */ }
  }

  return NextResponse.json({ ok: true, done, toplam, sonrakiOffset, ...rapor });
}
