# Möbel İnegöl — v45

SQL yok — direkt push edilebilir. (v44'ün üstüne)

## ✅ 1) Header sepet taşması düzeldi (mobil)
- Header üst satıra yatay padding eklendi, logo mobilde hafif küçültüldü,
  sepet ikonu/padding ayarlandı → sepet artık sağ kenardan taşmıyor/kesilmiyor.

## ✅ 2) Kategori şeridi — mobilde de görünür (YENİ)
- Anasayfada hero'nun ÜSTÜNE, yatay kaydırılabilir kategori şeridi eklendi.
- **Mobilde de görünür** (sidebar'a gizlenmedi) — rakipteki gibi ilk bakışta.
- 9 kategori, her biri kendi **flat illüstrasyonuyla** (Canva, beyaz zemin,
  marka teal aksanlı): Düğün Paketleri · Koltuk Takımı · Köşe Koltuk ·
  Yatak Odası · Yemek Odası · TV Ünitesi · Bebek & Genç Odası ·
  Giyinme Odası · Sehpa & Aksesuar.
- Görseller kırpılıp kareye oturtuldu + WebP (her biri ~2-10 KB → siteyi
  yavaşlatmaz). `public/marka/kategoriler/` altında.
- Kategoriler DB'den gelir; illüstrasyon slug/isim anahtar kelimesiyle eşleşir
  (yeni kategori eklenirse keyword'e göre otomatik bağlanır).
- Masaüstünde wrap + ortalı, mobilde yatay snap-scroll.

## Doğrulama
- `npm run build` ✓ Compiled successfully · tip kontrolü geçti · BUILD_ID üretildi

## Deploy sonrası test
- [ ] Mobilde anasayfa üstünde kategori şeridi görünüyor, yatay kayıyor
- [ ] Kartlara tıkla → doğru kategori sayfası açılıyor
- [ ] Header'da sepet ikonu taşmıyor
- [ ] Şerit görselleri net + hızlı yükleniyor
