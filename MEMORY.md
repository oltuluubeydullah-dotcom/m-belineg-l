# MEMORY.md — Ubivo Works Kullanıcı Bağlamı

> **Bu dosya yeni oturum açılışında sessizce okunur.**
> Ubeyt'in geçmiş projeleri, tercihler ve aktif iş durumu burada.
> Yapay zeka modeli değiştiğinde veya uzun konuşmalar sıkıştırıldığında bağlam kaybını önler.

---

## 👤 KULLANICI: Ubeyt

- **Rol:** Solo girişimci, "by ubivo" markası altında yazılım/sistem hizmetleri sunuyor
- **Geçmiş:** Mobilya sektörü (İnegöl ekosistemi), geliştirici değil ama mantığı kavrıyor
- **Çalışma stili:** Mobil ağırlıklı, paralel iş yapar (Claude bir şeyi yaparken kendisi başka iş halleder)
- **İletişim:** Türkçe, sıcak, kısa cümleler, mobile-friendly cevap bekler

### Tarz ve Tercih

- ✅ Türkçe cevap, İngilizce teknik terimler yanına Türkçe açıklamayla
- ✅ Marka adı: **"by ubivo"** (asla "Oltulu Yazılım" değil)
- ✅ Tek ZIP'lik teslimat, kısa dosya adı (paket1, paket2, …, paket-total, patch-v8.1)
- ✅ ZIP içinde README hazır
- ✅ İltifatlara kısa argo cevap: "eyvallah abim", "baştacısın krallım", "sağ ol kanka"
- ✅ Prompt belirsizse 4 bileşenli genişletme: Rol + Bağlam + Kısıtlar + Çıktı
- ✅ Yazılım için sadece izinli lisanslar: MIT/Apache/BSD/ISC/CC0 (AGPL/GPL yasak)
- ✅ ByUbivoWorks v3.2 sistemi: göreve göre ilgili ajanları aktive et
- ✅ Skill aktivasyonu kısa belirtilir, sonra iş yapılır

### Kaçınılacaklar

- ❌ Wall-of-text sorular (mobilde okunmaz)
- ❌ Uzun preamble ("Tabii ki, size yardımcı olmaktan memnuniyet…")
- ❌ Bullet listesinin başında uzun açıklama
- ❌ "Sen ne tercih edersin?" gibi sorular tek seferde değil, **ask_user_input_v0** tool'u ile butonlu
- ❌ Ödeme entegrasyonu hiç önerme (WhatsApp commerce modeli kullanıyor)
- ❌ Vercel hata mesajına "muhtemelen şu olabilir" — gerçek sebebi söyle, fix yap

---

## 🏢 AKTİF PROJE: KANİ MOBİLYA (Müşteri Sitesi)

> ⚠️ **MARKA YAZIMI:** "**Möbel İnegöl**" (noktalı `i`) — Büyük: "**KANİ MOBİLYA**" (noktalı İ).
> ESKİDEN "Möbel İnegöl" (noktasız ı) idi, **20 May 2026'da düzeltildi**. Asla "Kani" yazma.

### Kontekst
- **Müşteri:** Enes (Ubeyt'in yakın çevresinden, gelin/damat veya akraba)
- **Deadline:** Temmuz 2026 düğün (~6 hafta runway)
- **Domain:** `mobelinegol.com` (CANLI — DNS bağlandı, 20 May)
- **Hosting:** Vercel (Hostinger DNS → Vercel)
- **GitHub:** github.com/eneskani200016/kani-mobilya (Enes hesabı)
- **Deploy:** Vercel otomatik (push on main)
- **Root Directory ayarı:** `kani-mobilya` (Vercel'de manuel ayarlandı — repo'nun içinde kani-mobilya alt klasörü olduğu için)

### İş Modeli
**WhatsApp Commerce** (e-ticaret DEĞİL):
- Müşteri site'de ürünleri tarar
- Sepete ekler, formu doldurur (KART İSTENMEZ)
- "Sipariş Ver" → WhatsApp linki açılır, sepet otomatik mesaja yapışmış halde
- Firma müşteriye WhatsApp'tan döner
- Offline pazarlık, anlaşma, havale/EFT/kapıda nakit ödeme

**Bu yüzden YOKTUR:**
- iyzico/PayTR/Stripe entegrasyonu
- E-fatura/E-arşiv sistemi
- Kargo API'si
- Müşteri hesabı/üyelik (sadece admin var)
- Stok yönetimi (sadece aktif/pasif)

### Stack (KESİN)

| Katman | Teknoloji | Sebep |
|--------|-----------|-------|
| Frontend | **Next.js 14 (App Router)** + JS (TS değil) | Modern, SEO dostu, basit |
| Styling | **Tailwind 3** | Hızlı, brand sistemine uygun |
| Backend | **Supabase** (Frankfurt) | Auth + DB + Storage tek noktada |
| Hosting | **Vercel** | Otomatik deploy, edge, CDN |
| Font | **Poppins** (display + body) | Logo wordmark fontu |

### Brand Renkleri (KESİN)

```
brand-gold:   #C8A45C   (vurgu, butonlar, link hover)
brand-dark:   #0F1B2D   (header dark variant, top bar)
brand-cream:  #FAF7F2   (sayfa bg, header bg)
brand-ink:    #1A1A1A   (gövde metin, footer yazı)
brand-accent: #E07A2A   (turuncu, "İndirimde" badge, duyuru vurgu)
brand-sale:   #C73E3A   (kırmızı, indirimli fiyat)
```

### Logo Sistemi (FİNAL — v8.1)

Logo paketi: 20 Mayıs'ta entegre edildi.
- **Spec:** "K + alt çizgi + KANİ MOBİLYA wordmark", slogan: "Hayalindeki Eve Bir Adım"
- **Renkler:** Siyah #181614, Beyaz, Gold #C8A45C
- **Font:** Poppins Bold

Dosya konumları (`public/marka/`):
- `logo-siyah.png` — Header (krem zemin) + Login + magazalarimiz
- `logo-slogan-siyah.png` — Footer (beyaz zemin)  ← v8.1'de değişti, eskiden beyaz logo+dark zemindi
- `logo-slogan-beyaz.png` — Stokta var, ileride lazım olursa
- `k-markasi-beyaz.png` — Admin sidebar
- `og-image.png` — 1200×630, sosyal medya önizleme

⚠️ **LOGO PNG'LERİN İÇİNDEKİ YAZI:** Şu an PNG'lerde "KANI" mı "KANİ" mi yazıyor net değil, Ubeyt görsel kontrol etmeli. PNG'de "KANI" yazıyorsa Figma/Photoshop'tan yeniden export gerekir.

### 9 Kategori (KESİN)

1. Düğün Paketleri (önce gelir, çünkü hedef kitle)
2. Koltuk Takımı
3. Köşe Koltuk
4. Yatak Odası
5. Yemek Odası
6. TV Ünitesi
7. Bebek & Genç Odası
8. Masa Sandalye Set
9. Sehpa & Aksesuar

**Slug mapping:**
- `dugun-paketleri`
- `koltuk-takimi`
- `kose-koltuk`
- `yatak-odasi`
- `yemek-odasi`
- `tv-unitesi`
- `bebek-genc-odasi`
- `masa-sandalye-set`
- `sehpa-aksesuar`

### İletişim Bilgileri (KESİN — koda gömülü)

```
WhatsApp:   +90 534 306 65 92   (gönderim formatı: 905360400108)
Email:      info@mobelinegol.com
Instagram:  @mobelinegol
Adres kısa: Mobilyum AVM, İnegöl / Bursa
Adres tam:  Mobilyum AVM B etap Kat: 2 No: 25 Yeniceköy Mah. Mobilya Cd. N.36, İnegöl
```

### Admin Giriş

```
URL:     https://mobelinegol.com/giris
Email:   info@mobelinegol.com
Şifre:   Eneskani.166
```

**KOD İÇİNDE HARDCODE YOK** — Supabase Auth'da elle oluşturulur (Ubeyt panel'den yaptı).

### Vercel Env Variables (KESİN — eklenmiş durumda)

| Name | Value |
|------|-------|
| NEXT_PUBLIC_SUPABASE_URL | Ubeyt'in Supabase projesinin URL'i |
| NEXT_PUBLIC_SUPABASE_ANON_KEY | Anon key |
| NEXT_PUBLIC_SITE_URL | https://mobelinegol.com |
| NEXT_PUBLIC_WHATSAPP_NUMBER | 905360400108 |
| NEXT_PUBLIC_BUSINESS_NAME | **Möbel İnegöl** ⚠️ (v8.1'de güncellendi, "Kani" değil) |
| NEXT_PUBLIC_BUSINESS_TAGLINE | Hayalindeki Eve Bir Adım |
| NEXT_PUBLIC_BUSINESS_EMAIL | info@mobelinegol.com |
| NEXT_PUBLIC_BUSINESS_ADDRESS | Mobilyum AVM, İnegöl / Bursa |
| NEXT_PUBLIC_INSTAGRAM_HANDLE | mobelinegol |

### DNS (Hostinger — TAMAMLANDI 20 May)

```
A record:    @ → 216.198.79.1   (Vercel'in yeni IP'si)
CNAME (www): 221e38ef0889aab4.vercel-dns-017.com
A record:    ftp → 82.198.228.19  (dokunulmadı)
```

---

## 🎯 SPRINT DURUMU — KANİ MOBİLYA

### ✅ Tamamlanan Sprintler

| # | Sprint | İçerik |
|---|--------|--------|
| 1 | İskelet | Next.js + brand sistem + UI primitives (Button, Input, Modal, ConfirmDialog) |
| 2 | Supabase + Auth | DB şeması, Auth middleware, RLS policy'leri, login sayfası |
| 3 | Kategori + Foto | CRUD ürün/kategori, ImageUploader (1600px resize), Settings |
| 4 | Public + Sepet | Anasayfa, kategori sayfası, ürün detay, sepet (localStorage) |
| 5 | Checkout + WhatsApp | Müşteri formu, WhatsApp deep link, inquiries tablosu, talep paneli |
| 6 | Statik + Blog + SEO | 7 yasal sayfa, blog sistemi, sitemap.xml, robots.txt, schema.org |
| 7 | Hardening | Global error boundary, OG image, prod-ready cleanup |
| 8 | Logo Entegrasyonu | Tüm logolar entegre, favicon set, OG image kompozisyonu |
| **8.1** | **UI Polish (patch)** | Marka "Kani"→"Kani", logo ortalı, beyaz footer, magazalarimiz sayfası, top bar linkler |

### 🚨 ÇÖZÜLEN BUG'LAR (20 May Deploy Maratonu)

1. **Middleware path bug** — `@/lib/...` çözmüyordu, relative path'e geçildi
2. **GitHub Desktop hesap karışıklığı** — Enes hesabıyla giriş, git identity de değiştirildi
3. **Email privacy push protection** — Geçici unchecked yapıldı push edildi
4. **Vercel commit author block** — Enes identity ile commit yapılıp çözüldü
5. **Repo iç içe klasör** — Vercel Root Directory → `kani-mobilya` ayarlandı
6. **Next.js cookies() build error** — `generateStaticParams` cookie-less client'a çevrildi

### 🏁 Final Sürüm

**Dosya:** `kani-mobilya-final.zip` (20 Mayıs 2026, v8.1)
**İçerik:** 8 Sprint + 8.1 UI patch + tüm bug fix'leri
**Dosya sayısı:** ~145
**Boyut:** ~415 KB

### 📋 Sıradaki Aşama — ÜRÜN VERİ GİRİŞİ

**Ubeyt yeni oturumda ürünleri ZIP olarak atacak.**

Görev:
1. ZIP içeriğini incele (fotoğraflar + isim/fiyat/açıklama var mı?)
2. **Kategorilere göre yerleştir** (9 kategori — yukarıdaki slug'ları kullan)
3. Import yöntemine karar ver:
   - **Seçenek A:** Supabase Storage'a fotoları yükle + `products` tablosuna INSERT SQL üret
   - **Seçenek B:** Admin panele tek tek manuel giriş için kategorize edilmiş manifest hazırla
   - **Seçenek C:** CSV/Excel formatında çıkar, admin panele import butonu yazılsın

Sor önce: "ZIP'i gördüm, X kategoride Y ürün var. Hangi yolu istersin: A (otomatik SQL), B (manuel rehber), C (import butonu)?"

**Products tablosu şeması (lib/supabase için referans):**
- id (UUID, otomatik)
- category_id (UUID, FK to categories)
- name (string)
- slug (string, unique)
- description (text, optional)
- base_price (decimal, optional)
- discount_price (decimal, optional)
- images (jsonb, array of URLs)
- is_active (boolean, default true)
- is_featured (boolean, default false)
- sort_order (integer)
- created_at, updated_at (timestamps)

---

## 🛠️ DİĞER GEÇMİŞ PROJELER

### Ubivo Works v3.2
- 48 ajandan oluşan meta-orkestratör sistem (45 → 48'e çıktı)
- Project knowledge: `UBIVO_WORKS.md`, `ubivoskillkutuphanesi.pdf`, `WORKS_DESIGN_ARSENAL.pdf`
- Bu sistem her oturumda aktif

---

## 📐 ÇALIŞMA PROTOKOLÜ

### Yeni Proje Akışı
- Faz 0: Memory check (bu dosya)
- Faz 1: Discovery (ask_user_input_v0 ile butonlu sorular)
- Faz 2-6: İş döngüsü (kod yazmadan önce 6 fazlı plan)

### Deploy Onayı (Production Gate)
4 ajan onayı: 07 (Solution) + 15 (Solo) + 19 (Trust) + 20 (Vision)

### Genel Davranış
- İç akıl yürütme: İngilizce
- Kullanıcıya teslim: Türkçe
- Yeni proje mi devam mı? Oturum başında sor
- Sorularda **ask_user_input_v0** kullan (mobil için butonlu)
- "Works kuruldu krallım. Yeni proje mi, devam mı?" şeklinde selam

---

## 🔄 GÜNCELLEMELER

- **2026-05-20 (saat 12:30):** Sprint 1-8 tamamlandı, logo paketi entegre, middleware bug çözüldü, paket-total teslim
- **2026-05-20 (saat 16:00-17:00):** Deploy maratonu — GitHub Desktop hesap geçişi, Vercel commit block, root directory, cookies() fix → site canlı mobelinegol.com
- **2026-05-20 (saat 17:30):** v8.1 UI patch — "Kani"→"Kani", logo ortalı, beyaz footer, MAĞAZALARIMIZ + linkler, magazalarimiz sayfası
- **2026-05-20 (saat 18:00):** Final tam sistem ZIP teslim, sıradaki: ürün veri girişi
- **2026-05-20 (saat 18:40):** v8.3 inobilya ilhamlı redesign + mobile audit fix'leri. Header'a arama eklendi, logo büyütüldü (h-12 md:h-20), anasayfaya 4 yeni section (CategoryShowcase, TrustBadges, DugunPaketleri, SeoTanitim), footer'a Mobilyum AVM badge eklendi. 6 mobile bug fix (iOS zoom, tap targets, hero height, inputMode).
- **2026-05-20 (saat 19:30):** v8.4 logo K-baseline fix + Mobilyum adres altına taşındı + dark Hakkımızda section silinip 4 stat SeoTanitim'e entegre + HeroCarousel komple yenilendi (havai fişek + üçgen + Avrupa haritası SVG, mobilde 80px kısaldı).
- **2026-05-20 (saat 20:00):** v9.0 Production Hardening — 8 paket. (1) Toplu Yükleme tam aktif (ZIP parser API + UI), (2) Gerçek arama route /arama, (3) Sentry + GA4 + KVKK çerez banner'ı, (4) Security headers (HSTS + perf), (5) PWA manifest, (6) .env.example + DEPLOY.md güncel.
- **2026-05-20 (saat 21:00):** v9.1 — v9.0'da ertelenen 3 madde de tamamlandı. (1) Header kategorileri dinamik (DB'den ISR ile 60sn), (2) Arama tsvector + GIN index (sql/03 migration), (3) Rate limiting (Upstash Redis + in-memory fallback, bulk upload'a uygulandı).

---

**Son güncelleme:** 20 Mayıs 2026 — v8.1 final
**Yeni oturumun ilk işi:** Bu MEMORY'yi sessizce oku, sonra "Works kuruldu krallım. Yeni proje mi, devam mı?" diye selamla. Ubeyt ürün ZIP atacak — kategorize et + Supabase için hazırla.
