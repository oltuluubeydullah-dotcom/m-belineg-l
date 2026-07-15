# Möbel İnegöl — v49

SQL yok — direkt push. (v48'in üstüne)

## ✅ Kategori şeridi TEK SATIR
v48'de kartlar büyüyünce masaüstünde 2 kategori (Bebek & Genç, Sehpa) alt satıra
kayıyordu. Düzeltildi:
- Kart boyutu hafif küçültüldü (masaüstü 140px → 114px) — yine belirgin, minimal değil
- **flex-nowrap** → asla alt satıra düşmez (tek satır garanti)
- **w-max + mx-auto** → sığarsa ortalı tek sıra, sığmazsa yatay kaydırılabilir
- Sayfa taşması yok (kaydırma kabın içinde)

9 kart ≈ 1154px → standart masaüstünde (≥1280px) tek satır ortalı sığar.
Dar ekranda yatay kayar ama yine TEK satır.

## Doğrulama
- `npm run build` ✓ Compiled successfully · BUILD_ID üretildi

## Deploy sonrası test
- [ ] Masaüstü: 9 kategori TEK satırda (alt satır yok)
- [ ] Mobil: tek satır, yatay kaydırma çalışıyor
- [ ] Yan taşma yok
