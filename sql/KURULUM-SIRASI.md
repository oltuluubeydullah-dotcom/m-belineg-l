# Möbel İnegöl — SQL Kurulum Rehberi

> **Hedef:** Supabase SQL Editor'da bu dosyaları **sırayla** çalıştırmak.
> Her adımı çalıştırdıktan sonra hata yoksa bir sonrakine geç.
> Tüm dosyalar **idempotent**'tir — bir hata alırsan aynı dosyayı tekrar çalıştırabilirsin.

---

## Ön Koşullar

1. [supabase.com](https://supabase.com) → yeni proje oluştur (Frankfurt veya Almanya bölgesi önerilir)
2. **Project Settings → API** → şu değerleri not al:
   - `Project URL` → `.env.local`'da `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public key` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role key` → `SUPABASE_SERVICE_ROLE_KEY` (**gizli tut!**)

---

## SQL Kurulum Sırası

### ⚠️ Adım 0 — Admin E-posta Listesi (ÖN KOŞUL)
**Dosya:** `00-ADMIN-EMAILS-SETUP.sql` (bilgi) — gerçek tanım `06-security-rls.sql`'deki `is_admin_email()` fonksiyonunda.
- Admin e-postaları, `is_admin_email()` fonksiyonunun içindeki `ARRAY[...]` listesinde tanımlı.
  (Supabase'de `ALTER DATABASE SET` yasak olduğu için GUC kullanılMAZ.)
- Bu listeyi gerçek admin e-postasıyla güncelle.
- ⚠️ Vercel'deki `ADMIN_EMAILS` env değişkeniyle **BİREBİR AYNI** olmalı (biri Postgres RLS, diğeri JS middleware içindir).

### Adım 1 — Ana Schema (Temel Tablolar)
**Dosya:** `01-schema.sql`
- `products`, `categories`, `inquiries`, `settings`, `hero_banners` tabloları
- Trigger'lar, indeksler, temel constraint'ler
- Admin kullanıcı davet prosedürü

### Adım 2 — Blog Schema
**Dosya:** `02-blog.sql`
- `blog_posts` tablosu
- Blog indeksleri

### Adım 3 — Tam Metin Arama
**Dosya:** `03-full-text-search.sql`
- Türkçe full-text search konfigürasyonu
- `search_vector` kolonu ve trigger
- `search_products()` RPC fonksiyonu

### Adım 4 — Çok Dil & CMS
**Dosya:** `04-i18n-and-cms.sql`
- `translations` JSONB kolonları (products, categories, blog_posts)
- `content_pages` tablosu (Hakkımızda, KVKK, Gizlilik vs.)
- `hero_banners` çeviri desteği
- İlk içerik seed'leri (Hakkımızda sayfası, hero banner'ları)

### Adım 5 — Yorumlar & Analitik
**Dosya:** `05-reviews-and-analytics.sql`
- `reviews` tablosu
- `view_count` kolonu (products)
- `increment_view_count()` RPC fonksiyonu

### Adım 6 — Güvenlik & RLS ⚠️ KRİTİK
**Dosya:** `06-security-rls.sql`
- `is_admin_email()` fonksiyonu — admin doğrulama
- Tüm tablolarda Row Level Security (RLS) politikaları
- Inquiries/reviews güvenlik kapatma (anon bypass engeli)
- **Bu adımı atlamak güvenlik açığına yol açar!**

### Adım 7 — Medya Storage
**Dosya:** `07-medya-bucket-genisletme.sql`
- `mobel-medya` bucket yapılandırması
- Storage RLS politikaları

### Adım 8 — Ürün Detayları
**Dosya:** `08-urun-detaylari.sql`
- Ürün varyant sistemi (`product_variants`)
- Parça/modül desteği

### Adım 9 — Ürün Kodu Sistemi
**Dosya:** `09-product-code-v11.9.sql`
- Otomatik ürün kodu üreteci
- `generate_product_code()` fonksiyonu

### Adım 10 — Gelişmiş Arama
**Dosya:** `10-search-product-code-v12.7.sql`
- Ürün kodu ile arama desteği
- Filtreleme optimizasyonları

### Adım 11 — Analitik & Favoriler & Keep-Alive
**Dosya:** `11-mobel-analytics-favorites.sql`
- `page_views` tablosu (ziyaretçi takibi)
- `product_favorites` tablosu (favori sistemi)
- `admin_stats` view (dashboard istatistikleri)
- `keepalive_ping()` — Supabase free tier uyku koruması
- `increment_blog_view()` fonksiyonu
- Blog kategori kolonu

### Adım 12 — Blog İçerik Seed
**Dosya:** `12-mobel-blog-seed.sql`
- 4 hazır blog yazısı (TR, mobilya odaklı, SEO güçlü)
  - Dekorasyon & Tasarım
  - Satın Alma Rehberi
  - Bakım & Onarım
  - Yaşam Tarzları / Ev Kurma

### Adım 13 — Kategori Çevirileri
**Dosya:** `13-mobel-category-translations.sql`
- 9 kategori için İngilizce ve Almanca çeviriler
- **Önce kategoriler DB'de var olmalı** (Admin panelden veya 01-schema seed ile)

### Adım 14 — Ayarlar Seed
**Dosya:** `14-mobel-settings-seed.sql`
- İlk admin ayarları (iletişim, sosyal medya, duyuru)
- WhatsApp, email, adres bilgileri

---

## Storage Bucket Kurulumu

1. Supabase Dashboard → **Storage** → **New Bucket**
2. İsim: `mobel-medya`
3. Public: ✅ **Açık** (ürün görselleri herkese açık olmalı)
4. File size limit: `50MB`

---

## Admin Kullanıcı Oluşturma

1. Supabase Dashboard → **Authentication** → **Users** → **Invite User**
2. Email: `info@mobelinegol.com`
3. Davet mailinden şifre belirle
4. Vercel'de `ADMIN_EMAILS=info@mobelinegol.com` env değişkeni set et

---

## Vercel Environment Variables

`.env.example` dosyasındaki tüm değerleri Vercel Dashboard → **Settings** → **Environment Variables**'a ekle.

Kritik olanlar:
```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
NEXT_PUBLIC_SITE_URL=https://mobelinegol.com
NEXT_PUBLIC_WHATSAPP_NUMBER=905360400108
ADMIN_EMAILS=info@mobelinegol.com
CRON_SECRET=guclu-rastgele-sifre-buraya
```

---

## Kontrol Listesi

- [ ] **Admin listesi ayarlandı** — is_admin_email() ARRAY'i = Vercel ADMIN_EMAILS (gerçek admin e-postası)
- [ ] 01-14 SQL'ler sırayla çalıştırıldı, hata yok
- [ ] Vercel `ADMIN_EMAILS` = is_admin_email() fonksiyon listesi (BİREBİR AYNI)
- [ ] **Upstash Redis bağlandı** (`UPSTASH_REDIS_REST_URL` + `TOKEN`) — rate-limit için ŞART
- [ ] `mobel-medya` bucket oluşturuldu, public
- [ ] Admin kullanıcı oluşturuldu, giriş test edildi
- [ ] Vercel env değişkenleri eklendi
- [ ] `mobelinegol.com` domain Vercel'e eklendi
- [ ] `/giris` → `/admin` giriş çalışıyor
- [ ] Bir test ürünü eklendi, sitede görünüyor
- [ ] WhatsApp sepet akışı test edildi
- [ ] Mobil görünüm kontrol edildi

---

*Möbel İnegöl — by ubivo*
