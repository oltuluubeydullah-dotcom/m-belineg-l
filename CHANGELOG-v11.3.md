# Möbel İnegöl v11.3 — Yatay (Manzara) Görseller (2026-05-21)

## Değişiklik
Mobilya ürün fotoğrafları **yatay** çekildiği için `aspect-square` (1:1) ile gösterince üst ve alttan kırpılıyordu. Vesvina'daki gibi **manzara** (4:3) aspect ratio'ya geçtim.

### Dosya: `components/public/ProductCard.jsx`
- `aspect-square` → `aspect-[4/3]`
- Anasayfa, kategori, ilgili ürünler, arama — hepsi otomatik etkilendi (tek component)

### Dosya: `app/[locale]/(public)/urun/[slug]/Galeri.jsx`
- Ana görsel kutusu: `aspect-square` → `aspect-[4/3]`
- Boş state: `aspect-square` → `aspect-[4/3]`
- Thumbnail'lar square kaldı (küçük, OK)

## Görsel etkisi
- Mobilde 2'li grid'de görseller daha geniş, kompozisyon doğru görünür
- Detay sayfasında ürün fotoğrafı tüm dolgusuyla görünür
- Lightbox tam ekran zaten orijinal oran, etkilenmedi

— by ubivo
