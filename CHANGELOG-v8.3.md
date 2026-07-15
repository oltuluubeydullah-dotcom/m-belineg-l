# CHANGELOG v8.3 — inobilya İlhamlı Anasayfa + Mobile Audit
**Tarih:** 20 Mayıs 2026
**Önceki sürüm:** v8.2

## 🎯 Bu Sürümdeki Değişiklikler

### 1. Header Yenileme (components/public/Header.jsx)
- **Logo büyütüldü:** `h-10 md:h-14` → `h-12 md:h-20`
- **Masaüstüne arama kutusu eklendi:** Logo'nun solunda, inobilya tarzı pill-shaped search
- **Mobil arama:** Sepet ikonunun yanına search butonu eklendi, dokununca üst drawer açılıyor
- **Hesap ikonu (masaüstü):** Sepetin yanına eklendi, iletişim sayfasına yönlendiriyor
- **Tap target:** Hamburger ve sepet butonlarına `p-3` (48px) garantilendi

### 2. Anasayfa Tam Yeniden Düzen (app/(public)/page.jsx)
inobilya'dan ilham alınmış 7 katmanlı yerleşim:
1. HeroCarousel (mevcut, 3 banner)
2. **CategoryShowcase** ⭐ YENI — 8 kategori 2-satır INCELE'li grid
3. **TrustBadges** ⭐ YENI — 4 ikon güven şeridi (Avrupa Teslimat, Garanti, Kurulum, WhatsApp)
4. Karışık modeller grid (mevcut, "Sizin İçin Seçtiğimiz" başlığı)
5. **DugunPaketleriSection** ⭐ YENI — özel düğün vitrini
6. **SeoTanitim** ⭐ YENI — sarı zemin SEO paragrafı
7. Hakkımızda dark stats (mevcut)

### 3. Footer'a Mobilyum AVM Badge (components/public/Footer.jsx)
- inobilya'da Ertuğrul Gazi badge'in olduğu konuma **Mobilyum AVM logosu** eklendi
- "Bizleri Burada Bulabilirsiniz" başlığıyla Google Maps linkine bağlandı
- Logo dosyası: `public/marka/mobilyum-avm.jpeg`

### 4. Mobile Audit — Tüm Kritik Bug'lar Düzeltildi 📱

| # | Sorun | Etkilenen Dosya | Fix |
|---|---|---|---|
| 1 | iOS focus zoom (form input < 16px) | `components/ui/Input.jsx` | `text-base` eklendi (Input, Textarea, Select) |
| 2 | Sepet adet butonları ~26px (Apple min 44px) | `app/(public)/sepet/SepetClient.jsx` | `min-w-[44px] min-h-[44px]` + ikon büyütüldü |
| 3 | Hero carousel mobilde 480px (viewport %70'i) | `components/public/HeroCarousel.jsx` | Mobilde 380px'e düşürüldü |
| 4 | Sepet "Kaldır" butonu çok minik | `app/(public)/sepet/SepetClient.jsx` | `px-3 py-2 text-sm` + bg hover |
| 5 | Telefon input'ta inputMode eksik | `app/(public)/sepet/onayla/CheckoutFormu.jsx` | `inputMode="tel"` eklendi |
| 6 | Ürün detay adet butonları sınırda (~40px) | `app/(public)/urun/[slug]/UrunDetay.jsx` | `min-w-[44px] min-h-[44px]` + ikon 18px |

## 📂 Yeni Dosyalar
- `components/public/CategoryShowcase.jsx`
- `components/public/TrustBadges.jsx`
- `components/public/DugunPaketleriSection.jsx`
- `components/public/SeoTanitim.jsx`
- `public/marka/mobilyum-avm.jpeg`

## 🔧 Güncellenmiş Dosyalar
- `components/public/Header.jsx` (logo+arama)
- `components/public/Footer.jsx` (Mobilyum badge)
- `components/public/HeroCarousel.jsx` (mobil yükseklik)
- `components/ui/Input.jsx` (text-base)
- `app/(public)/page.jsx` (tam refactor)
- `app/(public)/sepet/SepetClient.jsx` (tap targets)
- `app/(public)/sepet/onayla/CheckoutFormu.jsx` (inputMode)
- `app/(public)/urun/[slug]/UrunDetay.jsx` (tap targets)

## 🚀 Deploy

```bash
# GitHub'a yükle, Vercel otomatik deploy yapacak
# Yeni dosya yok unutmadan: public/marka/mobilyum-avm.jpeg
```

## ✅ Test Listesi (Ubeyt)
- [ ] Masaüstünde header'a bak — logo büyük mü, sol arama kutusu çalışıyor mu?
- [ ] Mobilde header'a bak — sağdaki search ikonuna tıkla, arama drawer açılıyor mu?
- [ ] Anasayfa scroll — kategori grid (INCELE pill'leri), trust badges, düğün paketleri sırayla geliyor mu?
- [ ] Footer'a in — Mobilyum AVM logosu görünüyor mu, tıklayınca Google Maps açıyor mu?
- [ ] Mobilde sepete ürün ekle — adet artır/azalt rahat tıklanabiliyor mu?
- [ ] Telefon input'una tıkla — numeric keyboard açılıyor mu (Android)?
- [ ] Checkout formu — iPhone'da focus'ta zoom yapıyor mu (yapmaması lazım)?

---

**by ubivo** | Möbel İnegöl v8.3
