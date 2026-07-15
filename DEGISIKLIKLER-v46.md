# Möbel İnegöl — v46 (hotfix)

SQL yok — direkt push. (v45'in üstüne)

## 🐛 Düzeltilen: Giyinme Odası + Sehpa kartlarda görünmüyordu

**Sebep:** Anasayfa kartları (kategori showcase grid + yeni mobil şerit) sabit bir
liste olan `KART_SIRASI`'ndan besleniyordu. Bu liste eski `masa-sandalye-set`
slug'ını arıyordu. Müşteri o kategoriyi **"Giyinme Odası"** olarak yeniden
adlandırınca slug `giyinme-odasi`'ye döndü → sabit liste eşleşmedi → kart düştü.
Sehpa & Aksesuar ise eski bir kuralla showcase'ten kasten hariç bırakılmıştı.
(Üst metin menüsü DB'den geldiği için 9 gösteriyordu; kartlar sabit listeden
geldiği için 7.)

**Çözüm:** Kartlar artık **doğrudan DB'den** (sort_order sırasıyla) geliyor.
- ✅ 9 kategori de görünür (Giyinme Odası + Sehpa & Aksesuar dahil)
- ✅ Müşterinin admin'de yaptığı **yeniden adlandırma / yeni kategori / sıralama
  anında yansır** (bir daha kod değişikliği gerekmez)
- ✅ Sıra üst menüyle aynı (Düğün → Koltuk → Köşe → Yatak → ...)
- DB boşsa eski sabit liste fallback olarak durur

Bu hem **showcase grid**'i hem **mobil kategori şeridi**ni düzeltir (ikisi de aynı
kaynaktan beslenir).

## Not — Giyinme'nin fotoğrafı
Kategori artık göründüğü için, müşterinin eklediği kapak/ürün görseli de showcase
kartında çıkar. (Mobil şerit zaten kendi illüstrasyonunu kullanır → giyinme.webp.)

## Doğrulama
- `npm run build` ✓ Compiled successfully · BUILD_ID üretildi

## Deploy sonrası test
- [ ] Showcase grid'de 9 kategori (Giyinme + Sehpa dahil)
- [ ] Mobil şeritte 9 kategori, Giyinme + Sehpa illüstrasyonlu
- [ ] Giyinme kartına tıkla → doğru sayfa
- [ ] Giyinme kapak fotoğrafı showcase'te görünüyor mu (müşteri eklediyse)
