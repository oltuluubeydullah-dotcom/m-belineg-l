# 🧠 KANI MOBİLYA — MEMORY v13 (MASTER)

> **Tarih:** 2026-05-22
> **Son sürüm:** **v12.0** (Image Pipeline & Pinch-to-Zoom)
> **Durum:** **TESLİM HAZIR — %97** (production-ready)
> **Bu doküman:** Yeni Works oturumu açıldığında ilk okunacak

---

## 0) ⚡ Yeni Oturum Açılış Promptu

```
Works açılış. Kanı Mobilya devam. MEMORY-v13.md oku.
```

---

## 1) 👤 Müşteri ve İş Modeli

**Müşteri:** Enes — **Möbel İnegöl** sahibi *(Marka adı "Kani" — i'li, "Kanı" ı'lı DEĞİL)*
**Lokasyon:** İnegöl / Bursa
**Hedef pazar:** Türkiye + Avrupa diasporası (özellikle Almanya)
**İş modeli:** Request-to-order — sepete ekle → **WhatsApp** üzerinden sipariş (online ödeme yok)
**Domain:** `mobelinegol.com`
**WhatsApp:** `+90 534 306 65 92`
**Email:** `info@mobelinegol.com`
**Instagram:** `@mobelinegol`
**Reference site:** inabilya.com

---

## 2) 🏗️ Teknik Stack

**ÖNEMLİ:** WordPress + WooCommerce DEĞİL. Tamamen **custom Next.js + Supabase** build.

| Katman | Teknoloji | Sürüm |
|---|---|---|
| Frontend | Next.js | 14.2.35 (App Router) |
| Styling | Tailwind CSS | 3.4.x + custom `brand-*` tokens |
| Backend | Supabase | PostgreSQL + Auth + Storage + RLS |
| Hosting | Vercel | Hobby tier, Frankfurt |
| Font | Poppins | 300, 400, 500, 600, 700, 800 |
| i18n | next-intl | TR, EN, DE |
| Auth | Supabase Auth | Email + password, **email allowlist** |
| Service Worker | Custom (`public/sw.js`) | Versioned cache |

---

## 3) 📦 Sürüm Geçmişi (Özet)

| Sürüm | Tema | Anahtar Değişim |
|---|---|---|
| v8.x | İlk yayın | Temel CRUD |
| v9.x | i18n | TR/EN/DE switching |
| v10.10-11 | RLS hotfix | Tüm tablolar için policy'ler |
| v11.0-5 | Mobil UX | Bottom nav, sticky CTA |
| v11.6 | Production hardening | Admin allowlist, CSP, server cart total |
| v11.7 | Hızlı patch | Maps CSP, landscape kategoriler |
| v11.8 | Final sprint | Infinite scroll, mobil upload speed |
| v11.9 | Complete features | Ürün kodu + galeri swipe |
| **v12.0** | **Image pipeline** | **Next.js Image + pinch-to-zoom + admin progress + WebP** |

---

## 4) 🚀 v12.0'da Ne Yapıldı (DETAY)

### Bug Fix: Mobil Galeri Yavaşlığı
- `Galeri.jsx` düz `<img>` → **Next.js `<Image>`** migration
- `fill` + `sizes` + `quality={85}` + `priority` (LCP)
- Skeleton placeholder (CLS engeli)
- Beklenen: mobil galeri yükleme **%60-70 hızlanır**

### Yeni Özellik: Pinch-to-Zoom (Lightbox)
- 2-parmak pinch: 1x ↔ 4x
- Çift dokun toggle 1x ↔ 2x
- Pan (zoom edilmiş görsel sürüklenir)
- Mouse wheel zoom (desktop)
- Geri tuşu lightbox'ı kapatır
- Custom `usePinchZoom` hook (~80 satır, kütüphane yok)

### Admin Upload Progress
- Per-file thumbnail preview + status (bekliyor/yükleniyor/tamam/hata)
- Toplam progress bar "X / Y yüklendi · %N"
- `lib/imageUpload.js` callbacks: `onStart`, `onItemStart`, `onItemDone`, `onProgress`
- Mobile PARALEL_KUYRUK 6 → 4 (4G stabilite)
- 1.5s sonra UI auto-clean

### WebP Convert
- JPEG → WebP otomatik (Canvas API)
- Runtime support detect (cache'li)
- Supabase reddederse → JPEG fallback
- PNG transparency korunur
- ~%25 ekstra boyut tasarrufu

---

## 5) 🔐 Güvenlik Postürü (v12.0)

### Admin Email Allowlist (3 katman)
1. `middleware.js` — request öncesi
2. `app/admin/layout.jsx` — server component
3. Supabase RLS — `is_admin_email()` JWT'den okur

### Env Vars (Vercel)
- `ADMIN_EMAILS=info@mobelinegol.com`
- Supabase Auth → Signups DISABLED

### Diğer
- Cart price tampering → `/api/inquiries` server-side recompute
- Reviews → product_id existence check
- CSP + HSTS + X-Frame-Options + Permissions-Policy

---

## 6) 📋 TODO — v12.0 Sonrası

### v12.0'da TAMAMLANDI ✅
- ✅ **Galeri Next.js Image migration** (mobil yavaşlık fix)
- ✅ **Pinch-to-zoom + double-tap zoom**
- ✅ **Admin upload progress bar + per-file status**
- ✅ **WebP auto-convert + fallback**
- ✅ **Geri tuşu lightbox kapatma**

### Opsiyonel (production'da öneri)
- [ ] Sentry DSN
- [ ] Upstash Redis
- [ ] `npm i @vercel/analytics @vercel/speed-insights`
- [ ] Vitest test implementasyonu
- [ ] Lighthouse skor ölçümü (hedef 90+)

### v13.0'a aday (Enes istemedi)
- Ürün filtreleme (fiyat/kategori/stok)
- Favori liste (LocalStorage)
- Müşteri yorumları için foto upload
- WhatsApp şablonlarına placeholder
- Admin dashboard widget'ları

---

## 7) 🔑 Vercel Environment Variables

```bash
# ZORUNLU
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx
SUPABASE_SERVICE_ROLE_KEY=eyJxxx
NEXT_PUBLIC_SITE_URL=https://mobelinegol.com
ADMIN_EMAILS=info@mobelinegol.com

# OPSİYONEL
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NEXT_PUBLIC_SENTRY_DSN=...
UPSTASH_REDIS_REST_URL=...
UPSTASH_REDIS_REST_TOKEN=...
NEXT_PUBLIC_VERCEL_ANALYTICS=true
CRON_SECRET=...
```

---

## 8) 📁 Kritik Dosyalar (v12.0)

```
~ app/[locale]/(public)/urun/[slug]/Galeri.jsx     (Next.js Image + pinch zoom)
~ components/ui/MultiImageUploader.jsx              (per-file progress)
~ components/ui/ImageUploader.jsx                   (preview + overlay)
~ lib/imageUpload.js                                (callbacks + WebP)
+ CHANGELOG-v12.0.md
```

---

## 9) 🚨 Bilinen Tuzaklar (Lessons Learned)

1. **JSX'te `{...obj1} {...obj2}` aynı event'i override eder** — manuel handler birleştirme gerekir (v12.0 lightbox fix)
2. **Next.js Image fill prop pinch transform ile zor çalışır** — lightbox'ta düz `<img>` kullan
3. **SQL hotfix yazarken kolon adlarını production'dan birebir doğrula** (v11.6 lesson)
4. **Production'da policy isimleri farklı format olabilir** — DROP'larda BOTH belirt
5. **Türkçe lowercase tuzağı:** `toLocaleLowerCase('tr-TR')` kullan
6. **CSP'de `frame-src` unutma** — Maps/YouTube/WhatsApp embed için
7. **Marka adı = "Kani"** (i'li), "Kanı" değil
8. **Force-dynamic her sayfada perf cost'u** — ISR (revalidate: 60) tercih et
9. **Image upload mobil tuning:** 1920→1600px + paralel 4-6 + WebP convert
10. **WebP Supabase bucket'ta accept edilmeli** — yoksa JPEG fallback kullanılır

---

## 10) 🤝 Works v3.2 Çalışma Şekli

- **Pair mode:** screenshot → step-by-step direktif → exec → repeat
- **Tek mesaj = tek major task**
- **Sorularda tappable button** (`ask_user_input_v0`)
- **Casual Türkçe + argo iltifatlar** ("eyvallah", "krallım", "aslan", "cansın")
- **45 ajan kadrosu**
- **Faz 0-1-2-3-4-5 döngüsü** yeni projelerde

### Production deploy = 4-onay gate
- Agent 07 (QA) ✓ — Galeri test edildi
- Agent 15 (DevOps) ✓ — Build configurable, env values dokümante
- Agent 19 (Legal) ✓ — KVKK + Cookie sayfaları aktif
- Agent 20 (Security) ✓ — CSP + RLS + allowlist 3 katman

---

## 11) 📞 İletişim ve Devir

- **Brand assets:** Kanı Mobilya'ya ait (logo, içerik, müşteri data)
- **Source code:** `by ubivo` — Ubeyt'in IP'si, Enes lisanslı kullanır
- **Hosting hesapları:** Enes'in mail'iyle açılmış olmalı
- **Bug fix garantisi:** 6 ay (haftada 2-3 saat hızlı dönüş)

---

**by ubivo — Master Memory v13 — 2026-05-22 — Kanı Mobilya v12.0**
