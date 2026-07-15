// ════════════════════════════════════════════════════════════
// Resim Yükleme Helper'ı — v12.0 PROGRESS PASS
// ════════════════════════════════════════════════════════════
// v12.0 EKLENDİ:
//   • onProgress callback — her dosya tamamlandığında tetiklenir
//   • onStart callback — yükleme başlamadan önce tetiklenir (preview için)
//   • WebP convert opsiyonu (runtime support detect) — ~25% küçültür
//   • Mobile quality 0.78 (gözle aynı, ekstra %5 küçülme)
// v11.8 ayarları korundu:
//   • Mobil tespit: MAX_BOYUT 1600, PARALEL_KUYRUK 6, RESIZE_SKIP 800KB
//   • createImageBitmap GPU-accel decode+resize
//   • HEIC → JPEG (heic2any lazy import)
//   • Magic byte tip tespiti
// ════════════════════════════════════════════════════════════

const BUCKET = 'mobel-medya';
const MOBIL =
  typeof window !== 'undefined' &&
  (/Mobi|Android|iPhone|iPad/i.test(navigator.userAgent) || window.innerWidth < 768);
const MAX_BOYUT = MOBIL ? 1600 : 1920;
const KALITE = MOBIL ? 0.82 : 0.85;
const MAX_BYTE = 50 * 1024 * 1024;
const RESIZE_SKIP_BYTE = MOBIL ? 600 * 1024 : 900 * 1024;
const PARALEL_KUYRUK = MOBIL ? 2 : 5;   // v39: masaüstü 3→5 (yükleme hızlandı; mobil 2 kalır, bellek koruması)

// ─── WebP support detect (cache) ────────────────────────────
let _webpSupport = null;
async function webpDestekleniyor() {
  if (_webpSupport !== null) return _webpSupport;
  try {
    const canvas = document.createElement('canvas');
    canvas.width = 1; canvas.height = 1;
    const blob = await new Promise((resolve) =>
      canvas.toBlob(resolve, 'image/webp', 0.5)
    );
    _webpSupport = !!(blob && blob.type === 'image/webp' && blob.size > 0);
  } catch {
    _webpSupport = false;
  }
  return _webpSupport;
}

// ─── Magic byte tabanlı tip tespiti ─────────────────────────
async function gercekTipTespit(dosya) {
  try {
    const buf = await dosya.slice(0, 16).arrayBuffer();
    const b = new Uint8Array(buf);
    if (b[0] === 0xFF && b[1] === 0xD8 && b[2] === 0xFF) return 'image/jpeg';
    if (b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4E && b[3] === 0x47) return 'image/png';
    if (b[0] === 0x47 && b[1] === 0x49 && b[2] === 0x46 && b[3] === 0x38) return 'image/gif';
    if (b[0] === 0x42 && b[1] === 0x4D) return 'image/bmp';
    if (b[0] === 0x52 && b[1] === 0x49 && b[2] === 0x46 && b[3] === 0x46 &&
        b[8] === 0x57 && b[9] === 0x45 && b[10] === 0x42 && b[11] === 0x50) return 'image/webp';
    if (b[4] === 0x66 && b[5] === 0x74 && b[6] === 0x79 && b[7] === 0x70) {
      const brand = String.fromCharCode(b[8], b[9], b[10], b[11]);
      if (brand === 'avif' || brand === 'avis') return 'image/avif';
      if (['heic', 'heix', 'mif1', 'msf1', 'heif', 'hevc', 'hevx'].includes(brand)) return 'image/heic';
    }
  } catch {}
  return dosya.type || 'application/octet-stream';
}

// ─── HEIC → JPEG ────────────────────────────────────────────
async function heicToJpeg(dosya) {
  const mod = await import('heic2any');
  const heic2any = mod.default || mod;
  const sonuc = await heic2any({ blob: dosya, toType: 'image/jpeg', quality: 0.85 });
  return Array.isArray(sonuc) ? sonuc[0] : sonuc;
}

// ─── Hedef boyut ────────────────────────────────────────────
function hedefBoyut(w, h) {
  if (w <= MAX_BOYUT && h <= MAX_BOYUT) return { w, h, kucult: false };
  if (w > h) return { w: MAX_BOYUT, h: Math.round((h * MAX_BOYUT) / w), kucult: true };
  return { w: Math.round((w * MAX_BOYUT) / h), h: MAX_BOYUT, kucult: true };
}

// ─── Canvas resize (TEK decode — v31 perf) ──────────────────
async function canvasResize(blob, hedefTip = 'image/jpeg') {
  let bitmap;
  try {
    bitmap = await createImageBitmap(blob);   // TEK decode (eskiden probe+resize = 2 decode'du)
  } catch (e) {
    return canvasResizeKlasik(blob, hedefTip);
  }
  const { w: hedefW, h: hedefH, kucult } = hedefBoyut(bitmap.width, bitmap.height);

  // Küçültme gerekmiyor ve tip aynıysa: yeniden encode etme
  if (!kucult && blob.type === hedefTip) {
    bitmap.close?.();
    return { blob, tip: hedefTip };
  }

  const canvas = document.createElement('canvas');
  canvas.width = hedefW;
  canvas.height = hedefH;
  const ctx = canvas.getContext('2d');
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(bitmap, 0, 0, hedefW, hedefH);  // tek bitmap'i ölçekleyerek çiz
  bitmap.close?.();

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (out) => out ? resolve({ blob: out, tip: hedefTip }) : reject(new Error('Canvas toBlob başarısız')),
      hedefTip, KALITE
    );
  });
}

async function canvasResizeKlasik(blob, hedefTip = 'image/jpeg') {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(blob);
    const img = new Image();
    img.onload = () => {
      try {
        const { w: width, h: height } = hedefBoyut(img.width, img.height);
        const canvas = document.createElement('canvas');
        canvas.width = width; canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob(
          (out) => {
            URL.revokeObjectURL(url);
            out ? resolve({ blob: out, tip: hedefTip }) : reject(new Error('Canvas toBlob başarısız'));
          },
          hedefTip, KALITE
        );
      } catch (e) {
        URL.revokeObjectURL(url);
        reject(e);
      }
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Tarayıcı bu dosyayı decode edemedi'));
    };
    img.src = url;
  });
}

function hataTurkcelestir(err) {
  const m = (err?.message || String(err) || '').toLowerCase();
  if (m.includes('bucket') && m.includes('not found'))
    return 'Storage bucket bulunamadı. Supabase\'de sql/UPGRADE-v10.10.sql çalıştırılmamış olabilir.';
  if (m.includes('exceeded') || m.includes('maximum allowed size') || m.includes('payload too large'))
    return 'Dosya boyutu Supabase\'in izin verdiği sınırı aşıyor. SQL upgrade çalıştırıldı mı? (Free plan max 50 MB)';
  if (m.includes('mime') || (m.includes('type') && m.includes('not')))
    return 'Dosya türüne Supabase izin vermiyor. SQL upgrade\'i çalıştırın veya dosyayı JPG\'ye çevirin.';
  if (m.includes('row-level security') || m.includes('rls') || m.includes('permission'))
    return 'Erişim reddedildi (RLS). Admin olarak giriş yaptığınızdan emin olun.';
  if (m.includes('duplicate') || m.includes('already exists'))
    return 'Aynı isimle bir dosya zaten var (nadir — tekrar deneyin).';
  if (m.includes('network') || m.includes('fetch') || m.includes('failed to fetch'))
    return 'Ağ hatası. İnternet bağlantınızı kontrol edin.';
  if (m.includes('decode'))
    return 'Tarayıcı dosyayı decode edemedi. Dosya bozuk olabilir.';
  return err?.message || 'Bilinmeyen hata';
}

// ─── ANA AKIŞ ───────────────────────────────────────────────
/**
 * Tek dosya yükleme.
 * @param {SupabaseClient} supabase
 * @param {File} dosya
 * @param {string} klasor
 * @param {object} opts - { tercihWebP?: boolean }
 */
export async function resimYukle(supabase, dosya, klasor = 'diger', opts = {}) {
  if (dosya.size > MAX_BYTE) {
    throw new Error(`Dosya çok büyük (${(dosya.size / 1024 / 1024).toFixed(1)} MB). Maksimum ${MAX_BYTE / 1024 / 1024} MB.`);
  }

  const gercekTip = await gercekTipTespit(dosya);
  let kaynak = dosya;
  let kaynakTip = gercekTip;

  if (gercekTip === 'image/heic') {
    try {
      const jpegBlob = await heicToJpeg(dosya);
      kaynak = jpegBlob;
      kaynakTip = 'image/jpeg';
    } catch (e) {
      throw new Error(`iPhone HEIC dosyası çevrilemedi: ${e.message}. iPhone Ayarlar → Kamera → Formatlar → "En Uyumlu" seçip JPG ile çekebilirsiniz.`);
    }
  }

  // WebP tercih ediliyorsa ve tarayıcı destekliyorsa, JPEG'i WebP'ye çevir
  // PNG transparency'i korur, WebP'ye çevirme
  let hedefTipTercihi = kaynakTip === 'image/png' ? 'image/png' : 'image/jpeg';
  if (opts.tercihWebP && kaynakTip !== 'image/png' && await webpDestekleniyor()) {
    hedefTipTercihi = 'image/webp';
  }

  const skipFormatlari = ['image/jpeg', 'image/png', 'image/webp'];
  let yuklenecek, yuklenecekTip, uzanti;

  // Küçük dosyalar SKIP edilir (zaten optimize)
  // AMA WebP convert isteniyorsa skip etme — JPEG → WebP dönüşümü değerli
  const webpDonusumGerek = opts.tercihWebP && kaynakTip === 'image/jpeg' && hedefTipTercihi === 'image/webp';
  if (!webpDonusumGerek && kaynak.size <= RESIZE_SKIP_BYTE && skipFormatlari.includes(kaynakTip)) {
    yuklenecek = kaynak;
    yuklenecekTip = kaynakTip;
    uzanti = kaynakTip === 'image/png' ? 'png' : (kaynakTip === 'image/webp' ? 'webp' : 'jpg');
  } else {
    try {
      const { blob, tip } = await canvasResize(kaynak, hedefTipTercihi);
      yuklenecek = blob;
      yuklenecekTip = tip;
      uzanti = tip === 'image/png' ? 'png' : (tip === 'image/webp' ? 'webp' : 'jpg');
    } catch (resizeErr) {
      console.warn('[imageUpload] Resize başarısız, orijinal yükleniyor:', resizeErr.message);
      yuklenecek = kaynak;
      yuklenecekTip = kaynakTip;
      const tipMap = {
        'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp',
        'image/gif': 'gif', 'image/avif': 'avif', 'image/bmp': 'bmp',
      };
      uzanti = tipMap[kaynakTip] || 'jpg';
    }
  }

  const dosyaAdi = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${uzanti}`;
  const yol = `${klasor}/${dosyaAdi}`;

  // ── v41: Önce R2 dene (sıkıştırılmış blob server route'tan R2'ye gider) ──
  // R2 yapılandırılmamışsa veya hata olursa → Supabase fallback (aşağıda).
  try {
    const r2Url = await r2yeYukle(yuklenecek, klasor, uzanti, yuklenecekTip);
    if (r2Url) return r2Url;
  } catch (e) {
    console.warn('[imageUpload] R2 başarısız, Supabase fallback:', e?.message);
  }

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(yol, yuklenecek, {
      contentType: yuklenecekTip,
      cacheControl: '31536000',
      upsert: false,
    });

  if (error) {
    // v12.0: WebP reddedilirse → JPEG'le retry
    const msg = (error.message || '').toLowerCase();
    if (yuklenecekTip === 'image/webp' && (msg.includes('mime') || msg.includes('type'))) {
      console.warn('[imageUpload] WebP reddedildi, JPEG ile retry');
      try {
        const { blob, tip } = await canvasResize(kaynak, 'image/jpeg');
        // Retry'da da önce R2 dene
        try {
          const r2Url = await r2yeYukle(blob, klasor, 'jpg', tip);
          if (r2Url) return r2Url;
        } catch { /* Supabase'e düş */ }
        const jpgYol = `${klasor}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.jpg`;
        const retry = await supabase.storage.from(BUCKET).upload(jpgYol, blob, {
          contentType: tip, cacheControl: '31536000', upsert: false,
        });
        if (retry.error) throw new Error(hataTurkcelestir(retry.error));
        const { data: rd } = supabase.storage.from(BUCKET).getPublicUrl(jpgYol);
        return rd.publicUrl;
      } catch (e) {
        throw new Error(hataTurkcelestir(e));
      }
    }
    throw new Error(hataTurkcelestir(error));
  }

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(yol);
  return data.publicUrl;
}

/**
 * Sıkıştırılmış blob'u /api/upload üzerinden R2'ye yükler.
 * R2 yoksa (503 fallback) veya hata olursa null döner → çağıran Supabase'e düşer.
 * @returns {Promise<string|null>} R2 public URL veya null
 */
async function r2yeYukle(blob, klasor, uzanti, contentType) {
  const form = new FormData();
  const tip = contentType || blob.type || 'image/webp';
  form.append('file', new Blob([blob], { type: tip }), `f.${uzanti}`);
  form.append('folder', klasor);
  form.append('ext', uzanti);

  const res = await fetch('/api/upload', { method: 'POST', body: form });
  if (res.status === 503) return null;            // R2 yapılandırılmamış → fallback
  const json = await res.json().catch(() => ({}));
  if (!res.ok || !json.ok) {
    if (json.fallback) return null;               // bilinen fallback durumu
    throw new Error(json.error || 'R2 yükleme hatası');
  }
  return json.url;
}

/**
 * Çoklu dosya yükleme — progress callback destekli.
 * @param {SupabaseClient} supabase
 * @param {File[]} dosyalar
 * @param {string} klasor
 * @param {object} opts - {
 *   tercihWebP?: boolean,
 *   onStart?: (toplam: number) => void,
 *   onItemStart?: (index: number, file: File) => void,
 *   onItemDone?: (index: number, sonuc: {ok, url?, sebep?}) => void,
 *   onProgress?: (bitti: number, toplam: number) => void,
 * }
 */
export async function birdenCokResimYukle(supabase, dosyalar, klasor = 'diger', opts = {}) {
  const liste = Array.from(dosyalar);
  const sonuclar = new Array(liste.length);
  const toplam = liste.length;
  let bitti = 0;

  opts.onStart?.(toplam);

  let sonraki = 0;
  async function isci() {
    while (true) {
      const i = sonraki++;
      if (i >= liste.length) return;
      opts.onItemStart?.(i, liste[i]);
      try {
        const url = await resimYukle(supabase, liste[i], klasor, {
          tercihWebP: opts.tercihWebP,
        });
        sonuclar[i] = { ok: true, url };
        opts.onItemDone?.(i, { ok: true, url });
      } catch (e) {
        const sonuc = {
          ok: false,
          dosya: liste[i]?.name || `dosya-${i + 1}`,
          sebep: e?.message || 'Bilinmeyen hata',
        };
        sonuclar[i] = sonuc;
        opts.onItemDone?.(i, sonuc);
      }
      bitti++;
      opts.onProgress?.(bitti, toplam);
    }
  }

  await Promise.all(
    Array.from({ length: Math.min(PARALEL_KUYRUK, liste.length) }, isci)
  );

  const basarili = [];
  const hatali = [];
  sonuclar.forEach((s) => {
    if (s?.ok) basarili.push(s.url);
    else if (s) hatali.push({ dosya: s.dosya, sebep: s.sebep });
  });

  return { basarili, hatali };
}

/**
 * URL'den dosyayı siler. R2 URL'i ise /api/upload (DELETE) üzerinden,
 * Supabase URL'i ise doğrudan Storage'tan. v41: hibrit silme.
 */
export async function resimSil(supabase, url) {
  if (!url) return;

  // R2 public URL'i mi? (NEXT_PUBLIC_R2_PUBLIC_URL ile başlıyorsa)
  const r2Base = (process.env.NEXT_PUBLIC_R2_PUBLIC_URL || '').replace(/\/+$/, '');
  if (r2Base && url.startsWith(r2Base)) {
    try {
      await fetch('/api/upload', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });
    } catch (e) {
      console.warn('[imageUpload] R2 silme isteği başarısız:', e?.message);
    }
    return;
  }

  // Supabase Storage URL'i
  const isaret = `/${BUCKET}/`;
  const idx = url.indexOf(isaret);
  if (idx === -1) return;
  const path = url.slice(idx + isaret.length);
  const { error } = await supabase.storage.from(BUCKET).remove([path]);
  if (error) console.warn('[imageUpload] Silme başarısız:', error.message);
}

export async function bucketTest(supabase) {
  try {
    const testBlob = new Blob([new Uint8Array([0xFF, 0xD8, 0xFF, 0xE0, 0x00, 0x10, 0x4A, 0x46, 0x49, 0x46])], { type: 'image/jpeg' });
    const testYol = `_test/test-${Date.now()}.jpg`;
    const { error: upErr } = await supabase.storage.from(BUCKET).upload(testYol, testBlob, { contentType: 'image/jpeg' });
    if (upErr) return { ok: false, hata: hataTurkcelestir(upErr) };
    await supabase.storage.from(BUCKET).remove([testYol]);
    return { ok: true };
  } catch (e) {
    return { ok: false, hata: hataTurkcelestir(e) };
  }
}
