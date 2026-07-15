# Möbel İnegöl — v48

SQL yok — direkt push. (v47'nin üstüne)

## ✅ 1) Şerit etiketleri BÜYÜK HARF
Görselli kategori şeridindeki isimler artık tümü büyük harf — **Türkçe doğru**
(i→İ, ı→I): GİYİNME ODASI, TV ÜNİTESİ, BEBEK & GENÇ ODASI. (CSS değil, locale-aware
`toLocaleUpperCase('tr-TR')` → "İ" doğru çıkar.)

## ✅ 2) Giyinme Odası sıraya alındı
Şeritte sıra: Düğün → Koltuk → Köşe → Yatak → **Yemek → GİYİNME → TV** → Bebek&Genç
→ Sehpa. (Artık sonda kalmıyor.) Sıralama tek kaynaktan (`lib/kategoriGorsel.js`);
yeni kategori eklenirse sona düşer, bozulmaz.

## ✅ 3) Showcase grid'de Sehpa YOK (8 kart)
Aşağıdaki büyük kategori kartları (showcase) artık **8 kategori** → 4+4 hizası
bozulmaz. **Şeritte ise 9 (Sehpa dahil) kalır.** Şerit ve grid ayrı listelerden
beslenir.

## ✅ 4) Giyinme Odası tıklanınca kategoriye gider
Link DB slug'ından (`/kategori/{slug}`) üretiliyor → doğru kategoriye yönlenir.

## ✅ 5) Kapak fotoğrafı bug'ı düzeldi (önemli)
**Sorun:** Müşteri admin'de kategoriye kapak fotoğrafı ekliyordu (`image_url`),
ama anasayfa sorgusu bu kolonu HİÇ çekmiyordu → yansımıyordu.
**Çözüm:** `image_url` sorguya eklendi + kapak önceliği:
`admin kapak fotoğrafı (image_url) > seçili kapak ürünü > otomatik ilk ürün`.
**Admin paneline DOKUNULMADI** → admin'de bug riski yok. Artık müşteri kapak
fotoğrafı ekleyince showcase kartında anında görünür.

## ✅ 6) Kartlar büyütüldü + altın oran + taşma kontrolü
- Şerit kartları büyütüldü (mobil 110px → masaüstü 140px), daha belirgin/şık.
- Görsel iç boşluğu altın orana yakın ayarlandı.
- **Taşma:** global `overflow-x:hidden; max-width:100%` korunuyor; şerit kendi
  içinde yatay kayar (sayfa taşmaz). Masaüstünde ortalı sarar (yatay taşma yok).
  Mobil + masaüstü kontrol edildi.

## Doğrulama
- `npm run build` ✓ Compiled successfully · BUILD_ID üretildi

## Deploy sonrası test
- [ ] Şerit: 9 kategori, büyük harf, Giyinme Yemek↔TV arası, kartlar büyük
- [ ] Showcase grid: 8 kart (Sehpa yok), hiza düzgün
- [ ] Giyinme'ye tıkla → kategori açılıyor
- [ ] Admin'den bir kategoriye kapak foto ekle → showcase kartında çıkıyor
- [ ] Mobil + masaüstü: yatay taşma yok
