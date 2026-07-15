# Möbel İnegöl v10.10 — Yükleme Sistemini Derin Onarım (2026-05-21)

## Sorun
- "Görsel yüklenemedi" — tek görsel bile yüklenemiyor
- "object exceeded the maximum allowed size" — toplu yüklemede
- Hata mesajları çok generic — gerçek sebep gizli kalıyor

## Çözüm

### 1) `lib/imageUpload.js` — BAŞTAN YAZILDI (255 satır)
**Yapılan iş:**
- **Magic byte ile gerçek tip tespiti** (uzantıya güvenmiyor) — JPG/PNG/WebP/GIF/BMP/AVIF/HEIC tespit edilir
- **HEIC/HEIF (iPhone) → otomatik JPEG dönüşümü** (`heic2any` lazy import)
- **Canvas resize fallback** — başarısız olursa orijinali yükler, sessizce ölmez
- **Hata mesajları Türkçeleştirildi** — "bucket not found", "exceeded size", "RLS" gibi Supabase hataları doğal Türkçe metne çevrildi
- **Boyut ön kontrolü** — 50 MB üstü daha gönderilmeden reddedilir
- Yeni `bucketTest()` fonksiyonu — diagnostik için 1x1 JPEG yükle/sil testi

### 2) `MultiImageUploader.jsx` & `ImageUploader.jsx`
- **Her bir hata DOSYA ADI + GERÇEK SEBEP** ile gösterilir (ilk 5'i toast olarak, fazlası özet)
- "3 görsel yüklenemedi" gibi anlamsız mesajlar bitti

### 3) `sql/UPGRADE-v10.10.sql` — TEK DOSYALIK KONSOLIDE
Önceki sürümlerde 06 ve 07'yi atlamış olsan da bu tek dosya hepsini halleder:
- `kani-medya` bucket: 50 MB, tüm yaygın MIME (HEIC dahil), public read + admin write
- `kani-arsiv` bucket: 50 MB, ZIP/RAR MIME, private + admin write
- En sonda doğrulama SELECT'i ile her şeyi listeler
- **Idempotent** — defalarca çalıştırılabilir

### 4) `/admin/sistem-testi` — YENİ TANI SAYFASI
Sidebar'da "Sistem Testi" butonu. Tıklayınca:
- Admin oturum kontrolü
- Medya bucket yazma testi (1x1 JPEG upload + delete)
- Arşiv bucket yazma testi (mini ZIP upload + delete)
- Her satır: ✓ veya ✗ + spesifik hata + çözüm önerisi

**Hata aldığında ilk yapılacak iş:** Sistem Testi → çalıştır → hangi bucket sorunlu görürsün → ona göre aksiyon al.

## Yapacaklarınız (kritik sıra)
1. ZIP'i indir, üzerine yaz, push
2. Vercel build bitsin
3. **Supabase Dashboard → SQL Editor → New Query** → `sql/UPGRADE-v10.10.sql` içeriğini yapıştır → Run
4. Sonunda SELECT sonucunda 2 satır görmelisin (medya + arşiv, ikisinde de mime_sayisi >= 5)
5. Admin → Sistem Testi → "Testi Başlat" → 3 yeşil tik bekliyoruz
6. Admin → Ürünler → Bir ürünü düzenle → görsel ekle → **iPhone HEIC bile çalışmalı**

## Bilinen kısıtlar (Free plan)
- Tek dosya max: 50 MB (5 GB için Supabase Pro $25/ay)
- Vercel fonksiyon timeout: 60 sn
- Pratikte: ürün başı 20 görsel × 2-3 MB = 50 MB altı, sorunsuz

— by ubivo
