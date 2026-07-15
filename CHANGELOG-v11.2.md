# Möbel İnegöl v11.2 — Duplicate TrustBadges Kaldırıldı (2026-05-21)

## Değişiklik
Anasayfada iki yerde aynı bilgi görünüyordu:
- **Üstte** (CategoryShowcase'ten hemen sonra): `TrustBadges` — Avrupa Teslimat / 2 Yıl Garanti / Profesyonel Kurulum / Anında İletişim (ikonlu)
- **Aşağıda** (SeoTanitim içinde): 2 Yıl / 81 İl / Avrupa / 7/24 (büyük metin kartları)

İkisi aynı şeyi söylüyordu. **Üsttekini kaldırdım**, alttaki kaldı.

Dosya: `app/[locale]/(public)/page.jsx`
- `import TrustBadges` kaldırıldı
- `<TrustBadges />` satırı kaldırıldı

## Mobil uyumluluk taraması ✓
| Bileşen | Durum |
|---------|-------|
| Header | hamburger menü mobilde ✓ |
| CategoryShowcase | 2 sütun mobil, 4 sütun desktop ✓ |
| Ürün detay grid | lg altında stack olur ✓ |
| Parça spinner | ad truncate + buton shrink-0, sığar ✓ |
| Lightbox | responsive padding (p-4 → p-16) ✓ |
| ProductCard | text + padding responsive ✓ |
| Checkout formu | grid-cols-1 mobil, 3 sütun desktop ✓ |

Tüm public sayfalar Tailwind responsive class'larıyla mobile-first kuruldu. **Test:** Chrome DevTools → Mobile view → 375px (iPhone SE) → 768px (iPad) → 1024px+ desktop ile gez.

— by ubivo
