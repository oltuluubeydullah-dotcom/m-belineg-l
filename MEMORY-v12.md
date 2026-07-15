# 🧠 KANI MOBİLYA — MEMORY v12 (MASTER)

> **Tarih:** 2026-05-22
> **Son sürüm:** v11.9 (Complete Feature Set)
> **Durum:** TÜM ÖZELLİKLER TAMAMLANDI — teslime hazır
> **Bu doküman:** Yeni Works oturumu açıldığında ilk okunacak

---

## 0) ⚡ Yeni Oturum Açılış Promptu

```
Works açılış. Kanı Mobilya devam. MEMORY-v12.md oku.
```

Works şunu yapar:
1. Bu dosyayı okur
2. Mevcut durumu özetler
3. Pair-mode'a geçer
4. Tappable button ile devam yönü sorar

---

## 1) 👤 Müşteri ve İş Modeli

**Müşteri:** Enes — **Möbel İnegöl** sahibi *(Marka adı "Kani" — i'li, "Kanı" ı'lı DEĞİL)*
**Lokasyon:** İnegöl / Bursa (Türkiye'nin mobilya başkenti)
**Hedef pazar:** Türkiye geneli + Avrupa diasporası (özellikle Almanya)
**İş modeli:** Request-to-order — müşteri sepete ekler, **WhatsApp** üzerinden sipariş tamamlanır (online ödeme yok)
**Domain:** `mobelinegol.com`
**Marka tonu:** Köklü gelenek + modern tasarım, sade ve asil
**WhatsApp:** `+90 534 306 65 92`
**Email:** `info@mobelinegol.com`
**Instagram:** `@mobelinegol`

**Reference site:** inabilya.com (kategori nav, infinite scroll pattern)

---

## 2) 🏗️ Teknik Stack

**ÖNEMLİ:** WordPress + WooCommerce DEĞİL. Tamamen **custom Next.js + Supabase** build.

| Katman | Teknoloji | Sürüm |
|---|---|---|
| Frontend | Next.js | 14.2.35 (App Router) |
| Styling | Tailwind CSS | 3.4.x + custom `brand-*` tokens |
| Backend | Supabase | PostgreSQL + Auth + Storage + RLS |
| Hosting | Vercel | Hobby tier, Frankfurt region |
| Font | Poppins | weights: 300, 400, 500, 600, 700, 800 |
| i18n | next-intl | TR (primary), EN, DE |
| Auth | Supabase Auth | Email + password, **email allowlist** |
| Analytics | GA4 + Vercel Analytics (opt) + Sentry (opt) | |
| Rate limit | In-memory fallback + Upstash Redis (opt) | |
| Service Worker | Custom (`public/sw.js`) | Versioned cache |

---

## 3) 📦 Sürüm Geçmişi (Özet)

| Sürüm | Tema | Anahtar Değişim |
|---|---|---|
| v8.x | İlk yayın | Temel CRUD, kategoriler, ürünler |
| v9.x | Çok dilli | TR/EN/DE switching |
| v10.10-11 | RLS hotfix | Tüm tablolar için policy'ler |
| v11.0-5 | Mobil UX | Bottom nav, sticky CTA, image pipeline |
| **v11.6** | **Production hardening** | Admin email allowlist, CSP, server cart total, Sentry/Backup/Test docs |
| **v11.7** | **Hızlı patch** | CSP frame-src (maps), landscape categories, Hakkımızda content |
| **v11.8** | **Final sprint** | Infinite scroll, mobil upload speed, Kanı→Kani, admin defense-in-depth |
| **v11.9** | **Complete feature set** | Ürün kodu (product_code) + galeri parmak swipe |

---

## 4) 🔐 Güvenlik Postürü (v11.9)

### Admin Email Allowlist
- **3 katman:**
  1. `middleware.js` — request öncesi
  2. `app/admin/layout.jsx` — server component (v11.8 eklendi)
  3. Supabase RLS — `is_admin_email()` fonksiyonu JWT'den email okur
- **Env:** `ADMIN_EMAILS=info@mobelinegol.com` (Vercel'de set edilmiş olmalı)
- **Supabase Auth:** Signups DISABLED (2. savunma hattı)

### Diğer Güvenlik
- Cart price tampering → `/api/inquiries` server-side recompute
- Reviews → product_id existence check
- CSP header → frame-src Google Maps + YouTube whitelist
- HSTS + X-Frame-Options + Permissions-Policy

---

## 5) 📊 Bu Sprint'te Ne Yapıldı (v11.6 → v11.8 detaylı)

### v11.6 (Production Hardening — 17 madde)
- **P0:** Admin allowlist, RLS hotfix, deploy fix
- **P1:** CSP, reviews FK, server cart total, i18n parity, KVKK notu
- **P2:** Sentry doc, Backup guide, SW versioning, WA single source
- **P3:** Performance doc, Vercel Analytics, Upstash, Testing

### v11.7 (Hızlı Patch — 3 fix)
- CSP `frame-src` eklendi → Google Maps iframe açılır
- Kategori kartları landscape (`aspect-[4/3]`)
- Hakkımızda CMS metni profesyonel copy ile değiştirildi (placeholder kaldırıldı)
- HOTFIX-ADMIN-EMAIL-v11.7-CORRECTED.sql (`is_hidden` kolon fix + production policy isimleri)

### v11.8 (Final Sprint — bu sürüm)
- **Infinite scroll** anasayfada (max 3 sayfa = 36 ürün, sonra "Tüm Koleksiyonu Gör")
- **Anasayfa padding** azaltıldı (kategori → ürün arası boşluk daraldı)
- **Mobil image upload** optimize: 1600px, paralel 6, resize skip 800KB
- **Admin layout** isAdminUser check (defense-in-depth)
- **"Kanı"→"Kani"** Hakkımızda SQL'inde düzeltildi
- **"Yaklaşık Toplam"→"Toplam"** 3 dilde

---

## 6) 📋 TODO — Sonraki Sprint

### v11.9'da TAMAMLANDI ✅
- ✅ **Ürün Kodu (product_code) alanı** — DB migration + admin form + kart + detay
- ✅ **Mobilde galeri swipe** — touch gesture hem ana hem lightbox

### v11.6'dan kalan opsiyonel (production'da öneri ama zorunlu değil)
- [ ] Sentry DSN'i Sentry.io'dan al + Vercel env
- [ ] Upstash Redis hesabı aç → rate limit upgrade
- [ ] `npm i @vercel/analytics @vercel/speed-insights` + env
- [ ] Vitest test'lerini implement et (`test/auth/admin.test.js` örnek)
- [ ] Backup cron route (`app/api/cron/backup/route.js` + `vercel.json`)
- [ ] Lighthouse skor ölçümü (hedef 85+)

### v12.0'a aday özellikler (Enes tarafından henüz istenmedi)
- Ürün filtreleme (fiyat aralığı, kategori çoklu, stok durumu)
- Favori liste (LocalStorage)
- Kampanyalar / banner CMS gelişmiş
- Müşteri yorumları için fotoğraf upload
- WhatsApp şablonlarına placeholder ({{ad}}, {{ürün}}) sistemi
- Admin dashboard analytics widget'ları

---

## 7) 🔑 Vercel Environment Variables (Kritik)

```bash
# ZORUNLU
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx
SUPABASE_SERVICE_ROLE_KEY=eyJxxx
NEXT_PUBLIC_SITE_URL=https://mobelinegol.com
ADMIN_EMAILS=info@mobelinegol.com  # ← v11.6 güvenlik

# OPSİYONEL (production'da öneri)
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NEXT_PUBLIC_SENTRY_DSN=https://xxx@xxx.ingest.sentry.io/xxx
UPSTASH_REDIS_REST_URL=https://xxx.upstash.io
UPSTASH_REDIS_REST_TOKEN=AXxxx
NEXT_PUBLIC_VERCEL_ANALYTICS=true
CRON_SECRET=$(openssl rand -hex 32)
```

---

## 8) 📁 Klasör Yapısı

```
/proje-kökü
├── app/
│   ├── [locale]/                 # i18n root
│   │   ├── (public)/             # public routes (anasayfa, kategoriler, ürün, sepet, vb.)
│   │   └── giris/                # admin login
│   ├── admin/                    # /admin (allowlist'le korunuyor)
│   │   ├── AdminShell.jsx
│   │   ├── ayarlar/
│   │   ├── blog/
│   │   ├── hero-banner/
│   │   ├── kategoriler/
│   │   ├── kilavuz/             # in-app kullanım kılavuzu
│   │   ├── sayfalar/            # content_pages CMS
│   │   ├── sistem-testi/        # debug page
│   │   ├── talepler/            # inquiries panel
│   │   ├── urunler/
│   │   ├── whatsapp-sablonlari/
│   │   ├── yorumlar/            # reviews moderation
│   │   ├── layout.jsx
│   │   └── page.jsx
│   ├── api/
│   │   ├── admin/revalidate/    # admin-only revalidate
│   │   ├── inquiries/           # v11.6 — server-side cart total
│   │   ├── products/featured/   # v11.8 — infinite scroll
│   │   └── reviews/             # public review submission
│   ├── layout.jsx               # root layout (no locale)
│   ├── sitemap.js
│   └── robots.js
├── components/
│   ├── public/                  # public site components
│   │   ├── Header.jsx
│   │   ├── HeroCarousel.jsx
│   │   ├── CategoryShowcase.jsx
│   │   ├── FeaturedProductsInfiniteScroll.jsx  # v11.8
│   │   ├── ProductCard.jsx
│   │   ├── DugunPaketleriSection.jsx
│   │   ├── SentryInit.jsx
│   │   ├── VercelAnalytics.jsx
│   │   ├── Analytics.jsx        # GA4
│   │   ├── CookieConsent.jsx
│   │   └── ServiceWorkerRegister.jsx
│   └── ui/                      # reusable UI primitives
├── context/                     # React contexts
│   ├── AuthContext.jsx
│   ├── CartContext.jsx
│   └── ToastContext.jsx
├── lib/
│   ├── auth/admin.js            # v11.6 — allowlist helper
│   ├── supabase/                # client/server/middleware
│   ├── i18n/                    # next-intl config + navigation
│   ├── imageUpload.js           # mobile-tuned (v11.8)
│   ├── whatsapp.js
│   ├── constants.js
│   ├── cms.js
│   ├── profanity.js
│   └── rate-limit.js
├── messages/                    # i18n
│   ├── tr.json
│   ├── en.json
│   └── de.json
├── sql/                         # migrations + hotfixes
│   ├── 01-schema.sql            # base schema
│   ├── 02-blog.sql
│   ├── 02-blog-schema.sql
│   ├── 03-full-text-search.sql
│   ├── 04-i18n-and-cms.sql
│   ├── 05-reviews-and-analytics.sql
│   ├── 07-medya-bucket-genisletme.sql
│   ├── 08-urun-detaylari.sql
│   ├── UPGRADE-v10.10.sql
│   ├── HOTFIX-RLS-v10.11.sql                 # v11.6 restore (DEPRECATED, use v11.7 below)
│   ├── HOTFIX-ADMIN-EMAIL-v11.6.sql          # DEPRECATED (use v11.7)
│   ├── HOTFIX-ADMIN-EMAIL-v11.7-CORRECTED.sql # v11.7 — bunu kullan
│   └── HAKKIMIZDA-CONTENT-v11.7.sql          # v11.8'de Kani fix yapıldı
├── docs/
│   ├── BACKUP-GUIDE.md
│   ├── UPSTASH-SETUP.md
│   ├── PERFORMANCE.md
│   ├── TESTING.md
│   └── DELIVERY-AUDIT-v11.6.md
├── test/
│   ├── setup.js
│   └── auth/admin.test.js       # v11.6 — 15+ test
├── public/                      # static assets
│   ├── sw.js                    # versioned service worker
│   ├── manifest.json
│   ├── favicon.ico
│   ├── og-image.png
│   └── hero/                    # hero banners
├── CHANGELOG-v8.2.md
├── CHANGELOG-v11.6.md
├── CHANGELOG-v11.8.md
├── README.md
├── MEMORY-v12.md                # ← BU DOSYA
├── TESLIM-KONTROL-LISTESI.md
├── next.config.js
├── package.json
├── tailwind.config.js
└── vitest.config.js
```

---

## 9) 🚨 Bilinen Tuzaklar (Lessons Learned)

1. **SQL hotfix yazarken kolon adlarını production'dan birebir doğrula**
   - v11.6'da `is_approved` yazdım, prod `is_hidden`'mış → patladı
   - v11.7'de düzeltildi

2. **Production'da policy isimleri farklı format olabilir**
   - Bazı policy'ler snake_case (`products_write_admin`)
   - Bazıları boşluklu ("Admin manage reviews")
   - DROP'larda BOTH isimleri belirt

3. **Türkçe lowercase tuzağı**
   - `'İSTANBUL'.toLowerCase()` → `'i̇stanbul'` (i + combining dot, 9 karakter!)
   - `toLocaleLowerCase('tr-TR')` kullan

4. **CSP'de `frame-src` unutma**
   - `default-src 'self'` Google Maps iframe'i bloklar
   - Maps, YouTube, WhatsApp embed'leri için whitelist gerekir

5. **Marka adı = "Kani" (i'li), "Kanı" (ı'lı) DEĞİL**
   - Tüm yeni içerikte "Möbel İnegöl" yaz
   - Memory'lerde "Kanı" yazılı olabilir, ignore et

6. **v11.6 ZIP'inde hata yapmıştım**
   - `HOTFIX-RLS-v10.11.sql`'i memory'den yazdım, `is_approved` yanlıştı
   - `HOTFIX-ADMIN-EMAIL-v11.6.sql` sadece snake_case policy isimlerini drop ediyordu
   - **DOĞRU OLAN:** `sql/HOTFIX-ADMIN-EMAIL-v11.7-CORRECTED.sql`

7. **Force-dynamic her sayfada perf cost'u**
   - Admin sayfalarında zorunlu (cookies)
   - Public sayfalarda mecbur olmadıkça kullanma
   - ISR (revalidate: 60) çoğu sayfa için daha iyi

8. **Image upload mobil tuning**
   - Desktop ve mobil için ayrı parametreler
   - userAgent + innerWidth tespiti
   - 1920→1600px mobilde upload süresini ~30% azaltıyor

---

## 10) 🤝 Works v3.2 Çalışma Şekli

- **Pair mode:** Ubeyt screenshot → Claude step-by-step direktif → exec → repeat
- **Tek mesaj = tek major task** (ufak işler hariç)
- **Sorularda tappable button** (`ask_user_input_v0`)
- **Casual Türkçe + argo iltifatlara argo yanıt** ("eyvallah", "krallım", "aslan", "cansın")
- **45 ajan kadrosu** (Agent 06 Debug, 12 Content, 19 Legal, 26 Brand, vb.)
- **Faz 0-1-2-3-4-5 döngüsü** yeni projelerde

### Production deploy = 4-onay gate
- Agent 07 (QA)
- Agent 15 (DevOps)
- Agent 19 (Legal)
- Agent 20 (Security)

---

## 11) 📞 İletişim ve Devir

- **Brand assets:** Kanı Mobilya'ya ait (logo, içerik, müşteri data)
- **Source code:** `by ubivo` — Ubeyt'in IP'si, Enes lisanslı kullanır
- **Hosting hesapları:** Enes'in mail'iyle açılmış olmalı (vendor lock-in yok)
- **Bug fix garantisi:** 6 ay (haftada 2-3 saat hızlı dönüş)

---

**by ubivo — Master Memory v12 — 2026-05-22 — Kanı Mobilya v11.8**
