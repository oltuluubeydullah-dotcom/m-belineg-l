# Möbel İnegöl — v31.3 sonrası eklenenler

Bu paket, v31.3-SON üzerine iki yeni özellik eklenmiş tam sistemdir.

## ⚠️ DEPLOY'DAN ÖNCE: SQL çalıştır
Supabase SQL editöründe:  sql/15-mobel-category-cover-product.sql
(categories tablosuna cover_product_id kolonu ekler. Additive/güvenli.
 Çalıştırılmadan deploy edilirse anasayfa hata verir.)

## Yeni Özellik 1 — Kategori Kapak Ürünü
Admin > Kategoriler > düzenle > "Kapak Ürünü" seçici.
Seçilen ürünün ilk fotoğrafı kategori kapağı olur. Boş = otomatik (eski davranış).

## Yeni Özellik 2 — "Sizin İçin Seçtiklerimiz" Sırası
Admin > Ürünler > düzenle: "Öne çıkan" işaretle + "Sıra No" gir (küçük önce).
Bölüm sadece öne çıkanları senin sıranla gösterir. Hiç işaretlenmezse en yeniye düşer.

## Değişen / yeni dosyalar (5)
- sql/15-mobel-category-cover-product.sql      (YENİ)
- app/admin/kategoriler/KategoriFormu.jsx
- app/admin/urunler/UrunFormu.jsx
- app/[locale]/(public)/page.jsx
- app/api/products/featured/route.js

## Notlar
- Yeni paket/bağımlılık eklenmedi (lisans temiz, copyleft yok).
- Build doğrulandı: next build ✓, 78/78 sayfa.
- node_modules ve .next bu pakete dahil DEĞİL → "npm install" sonra "npm run build".

by ubivo
