# 🧠 MÖBEL İNEGÖL v52 — MEMORY (by ubivo)

> **Tarih:** 2026-06-12 | **Taban:** Galerin v51 full altyapı (production-proven)
> **Durum:** ✅ Build temiz (`npm run build` yeşil) — kurulum bekliyor

## MÜŞTERİ
- **Firma:** Möbel İnegöl | **Slogan:** Evinize Değer Katar
- **Instagram:** @mobelinegol | **WhatsApp:** +90 536 040 01 08 → `905360400108`
- **Adres:** İnegöl / Bursa (net sokak adresi müşteriden gelince env'e eklenecek)
- **Domain:** mobelinegol.com | **İş modeli:** WhatsApp Commerce
- **Hedef:** Avrupa Türk diasporası | **Dil:** TR + EN + DE
- **Tema:** SARI #E8B84B · SİYAH #1A1A1A · BEYAZ/KREM

## v52'DE YAPILANLAR (Galerin v51 → Möbel dönüşümü)
1. **Full rebrand:** 153 dosyada isim/tel/IG/domain/storage-key değişimi — sıfır Galerin izi
2. **Tema:** Tailwind + globals.css + admin panel + manifest sarı/siyaha çevrildi (class adları korundu)
3. **Logo seti:** Möbel logoları + favicon + og-image birebir taşındı (md5 doğrulandı)
4. **KALDIRILANLAR:** Üst kategori şeritleri (KategoriSeritleri) · Orta kategori kartları (CategoryShowcase + CategoryCard) · Üst Avrupa duyuru şeridi (AnnouncementBar — admin ayarı dahil) · Düğün Paketleri (bölüm + kategori + SEO metni + seed + çeviriler) · Google Yorumlar (GoogleReviews) · Trendyol (footer + bölüm + constants + schema.org)
5. **Hero:** 4 slide yazı-odaklı — siyah zemin + sarı ışıma; admin görsel yüklerse otomatik foto moduna döner
6. **TrustBadges:** 4 rozet sarı/siyah SVG'ye boyandı
7. **SeoTanitim:** Galerin fotoğrafları yerine sarı/siyah marka ikonları (garanti/nakliye/avrupa/whatsapp)
8. **Instagram mockup:** CSS-çizimi @mobelinegol profili (gerçek ekran görüntüsü gelince Image ile değişir)
9. **Seed düzeltme:** Galerin'in telefonu/adresi/sloganı temizlendi, duyuru barı pasif

## ALTYAPI (Galerin v51'den hazır geldi)
- **Admin panel:** ürünler/kategoriler/blog/hero/talepler/pazarlama/toplu yükleme/whatsapp şablonları
- **R2 görsel depolama:** `lib/r2.js` — custom domain destekli (`NEXT_PUBLIC_R2_PUBLIC_URL`), R2 yoksa Supabase Storage fallback
- **Supabase keepalive:** edge function → free tier uyumaz
- **SEO/GEO/AEO:** sitemap + robots + llms.txt + schema.org + 3 dil
- **Reklam/Ajans:** `/api/feed/urunler.xml` ürün feed'i + pixel/tracking (PixelScripts, track-event/view)

## KURULUM SIRASI
1. GitHub repo aç → kodu pushla
2. Supabase proje aç → `sql/KURULUM-SIRASI.md`'deki sırayla SQL'leri çalıştır
3. Cloudflare R2: bucket `mobel-medya` + custom domain (örn. cdn.mobelinegol.com) → env'e yaz
4. Vercel: repo bağla + `.env.example`'daki değişkenleri doldur
5. Net sokak adresi gelince: `NEXT_PUBLIC_BUSINESS_STREET` env'i doldur

## AÇIK NOKTALAR
- [ ] Möbel'in gerçek Instagram ekran görüntüsü (mockup yerine)
- [ ] Net mağaza adresi + Google Maps linki
- [ ] R2 custom domain DNS kurulumu
- [ ] Hero'ya ileride gerçek ürün görselleri (admin panelden)

**by ubivo** | byubivo.com
