# Möbel İnegöl v10.0 — Deploy Rehberi (Profesyonel Sürüm)

> Bu dosya: v10.0 deploy adımları + tüm env değişkenleri + sorun giderme.

---

## 🚀 v10.0 Deploy Adımları

### 1. GitHub'a Yükle
1. `paket-v10.zip` extract et
2. Mevcut repo'ya **tüm dosyaları üzerine yaz** (overwrite)
3. ⚠ **Yapısal değişiklik var:** `app/(public)/` → `app/[locale]/(public)/`. Eski klasörlerin silinmesine emin ol.
4. Commit + push

### 2. Vercel Env Variables

**ZORUNLU (zaten ekli olmalı):**
```
NEXT_PUBLIC_SUPABASE_URL          = https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY     = eyJxxx...
SUPABASE_SERVICE_ROLE_KEY         = eyJxxx... (NEXT_PUBLIC_ değil!)
NEXT_PUBLIC_SITE_URL              = https://mobelinegol.com
```

**OPSİYONEL (yoksa özellikleri yüklenmez):**
```
NEXT_PUBLIC_GA_ID                 = G-XXXXXXXXXX
NEXT_PUBLIC_SENTRY_DSN            = https://xxx@xxx.ingest.sentry.io/xxx
UPSTASH_REDIS_REST_URL            = https://xxx.upstash.io
UPSTASH_REDIS_REST_TOKEN          = AXxxx...
```

### 3. Supabase SQL Migrations — **MUTLAKA çalıştır**

Supabase Dashboard → SQL Editor → şu sırayla:

```sql
-- 1) Eğer henüz çalıştırılmadıysa (v9.0):
sql/03-full-text-search.sql

-- 2) YENİ — v10.0 i18n + CMS tabloları:
sql/04-i18n-and-cms.sql
```

`sql/04` çalıştırılmazsa hero bannerlar ve statik sayfalar boş kalır.

### 4. Vercel Otomatik Build
Push'tan sonra Vercel build başlar. ~3 dk.
- `npm install` next-intl 3.17.2 + @upstash/redis 1.31.5 indirir
- App dir restructure'ı algılar
- 3 dilli sayfa rendering testi yapar

### 5. Test Checklist

#### Public Site
- [ ] Anasayfa açılıyor (TR varsayılan)
- [ ] Sağ üstte 🌐 TR dropdown
- [ ] EN'e geç → URL `/en` olur, içerik İngilizce
- [ ] DE'ye geç → URL `/de` olur, içerik Almanca
- [ ] Hero carousel 3 banner — metinler dile göre değişir
- [ ] Footer linkler doğru locale'da yönlendiriyor
- [ ] Mobil menü açılıyor, dil değiştirici çalışıyor
- [ ] Cookie consent banner çıkıyor (TR/EN/DE)

#### Admin Panel (Türkçe)
- [ ] `/admin/kilavuz` → 16 bölüm + sıkça sorulanlar
- [ ] `/admin/hero-banner` → 3 banner kartı
- [ ] `/admin/sayfalar` → 6 sayfa (Hakkımızda, KVKK vs)
- [ ] `/admin/whatsapp-sablonlari` → 3 mesaj şablonu
- [ ] Ürün ekle → fiyat 25000 yaz → canlı "25.000 ₺" önizleme
- [ ] Ürün kaydet → EN sayfasına git → ürün otomatik İngilizce mi?

---

## 📦 Toplu Yükleme Nasıl Çalışır?

### Beklenen ZIP Yapısı
```
ÜRÜNLER.zip
├── Koltuk Takımı/
│   ├── Beyaz Lüks Koltuk/
│   │   ├── 1.jpg
│   │   ├── 2.jpg
│   │   └── 3.jpg
│   └── Modern Köşe/
│       └── 1.jpg
└── Yatak Odası/
    └── ...
```

### Kurallar
- ✓ `.jpg`, `.jpeg`, `.png`, `.webp` formatları
- ✓ macOS `__MACOSX/` ve `.DS_Store` otomatik atlanır
- ✓ Kategori varsa kullanılır, yoksa otomatik oluşturulur
- ✓ Aynı slug'lı ürün zaten varsa **atlanır** (silinmez)
- ✓ Resimler sayısal sırayla yüklenir (1.jpg, 2.jpg, ...)
- ✓ Yüklenen ürünler için EN/DE çevirileri **otomatik sözlükten** üretilir

---

## 🔒 Güvenlik (v9.0+)

### Aktif
- ✓ HTTPS Strict-Transport-Security (HSTS) 2 yıl
- ✓ X-Frame-Options: DENY
- ✓ X-Content-Type-Options: nosniff
- ✓ Permissions-Policy (kamera/mikro/konum kapalı + interest-cohort)
- ✓ Referrer-Policy: strict-origin-when-cross-origin
- ✓ API route'lara no-cache
- ✓ Service Worker scope korunaklı
- ✓ Admin middleware (login zorunlu)
- ✓ Service role key sadece server-side
- ✓ Rate limit (Upstash veya in-memory fallback)
- ✓ RLS policies tüm CMS tablolarında

### Eklenebilir (opsiyonel)
- CSP header (gradual rollout gerek)
- WAF (Vercel Pro)

---

## 🔧 Sorun Giderme

### "Build sırasında 'Cannot find module @/lib/i18n/request' hatası"
→ `npm install` çalıştırılmamış. Vercel'de Deployment Settings → Build & Output → "Override" → `npm install --legacy-peer-deps && next build` deneyebilirsin.

### "Hero banner boş gösteriyor"
→ `sql/04-i18n-and-cms.sql` çalıştırılmadı. Supabase SQL Editor'da tekrar dene.

### "Dil değiştirince ürün adı TR kalıyor"
→ Otomatik sözlükte o kelime yoksa fallback TR. Admin'den ürünü düzenle → çoklu dil bölümünden manuel doldur.

### "/en/koltuk-takimi 404 dönüyor"
→ App dir restructure tam aktarılmamış. GitHub'da `app/[locale]/(public)/kategori/...` klasörü var mı kontrol et.

### "Cookie consent banner kaybolmuyor"
→ `localStorage.removeItem('kani-cookie-consent')` → yenile.

### "Toplu yükleme 5 dakika sonra timeout"
→ Vercel Hobby 10s, Pro 5min limit. ZIP'i parçala (10-20 ürün × 5 yükleme).

### "Service Role config eksik"
→ `SUPABASE_SERVICE_ROLE_KEY` env var eksik veya `NEXT_PUBLIC_` ile başlıyor (yanlış).

---

## 📋 İçerik Yönetimi (Müşteriye)

M�şteri admin paneline girince `/admin/kilavuz` adresinde detaylı rehber bulur:
- Ürün nasıl eklenir (tek tek + toplu)
- Fiyat nasıl yazılır (sadece sayı, ₺ otomatik)
- Kategori, Hero banner, Sayfa içerikleri, WhatsApp şablonları nasıl düzenlenir
- Çoklu dil sistemi
- Görsel kuralları
- SEO ipuçları
- 7 sıkça sorulan sorun + çözümü
- Güvenlik

M�şteri site teslim edildikten sonra **kod bilmeden tüm içeriği değiştirebilir**.

---

**by ubivo** | Möbel İnegöl v10.0 — 21 Mayıs 2026
