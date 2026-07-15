# Möbel İnegöl — v47

SQL yok — direkt push. (v46'nın üstüne)

## ✏️ Düzeltilen: Anasayfada kategori isimleri iki kere yazıyordu

Anasayfada üstte **metin kategori menüsü** (DÜĞÜN PAKETLERİ KOLTUK TAKIMI…) +
hemen altında **görselli kategori şeridi** vardı → isimler çift görünüyordu.

**Çözüm:** Görselli şerit kaldığı için, **masaüstü metin kategori nav'ı yalnızca
anasayfada gizlendi**.
- ✅ Anasayfa: sadece görselli şerit (çift bitti)
- ✅ İç sayfalar (kategori/ürün vb.): metin nav **duruyor** → navigasyon korunur
- ✅ Mobil hamburger menü: değişmedi (kategoriler orada da var)

Teknik: `Header` artık `usePathname()` ile anasayfayı tanıyor; metin nav class'ı
`anasayfa ? 'hidden' : 'hidden md:flex'`.

## Doğrulama
- `npm run build` ✓ Compiled successfully · BUILD_ID üretildi

## Deploy sonrası test
- [ ] Anasayfada üstte SADECE görselli şerit (metin satırı yok)
- [ ] Bir kategori sayfasına gir → üstte metin kategori menüsü hâlâ var
- [ ] Mobilde hamburger menüde kategoriler duruyor
