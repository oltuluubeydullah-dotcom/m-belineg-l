# Möbel İnegöl — v50

SQL yok — direkt push. (v49'un üstüne)

## ✅ 1) Kategori şeridi TEK SATIR (v49 dahil)
Kartlar büyüyünce 2 kategori alt satıra düşüyordu → düzeltildi. flex-nowrap +
w-max/mx-auto: sığarsa ortalı tek sıra, sığmazsa yatay kayar. Asla alt satıra
düşmez, sayfa taşmaz.

## ✅ 2) Mobil çekmecede gereksiz kategori tekrarı kaldırıldı
Anasayfada kategoriler zaten görselli şeritte. Mobil hamburger çekmecesinde:
- **Anasayfa:** kategoriler GİZLİ (sadece Mağazalarımız/Hakkımızda/Blog/İletişim)
  → tekrar yok, sade.
- **İç sayfalar:** kategoriler GÖRÜNÜR → mobil kategori navigasyonu korunur
  (ürün/kategori sayfasında menüden kategoriye geçilebilir).
- Masaüstü metin nav'da yaptığımızla tutarlı (anasayfada gizli).

## ✅ 3) Google yorumları her açılışta KARIŞIK
Yorumlar artık sabit DB sırasıyla değil, **her sayfa açılışında rastgele**
sıralanır (Fisher-Yates). Hep aynı isim başta kalmaz, sürekli değişir.
- Hydration güvenli: ilk render sunucu sırası, mount sonrası karışır (uyarı yok).

## Doğrulama
- `npm run build` ✓ Compiled successfully · BUILD_ID üretildi

## Deploy sonrası test
- [ ] Masaüstü: şerit tek satır
- [ ] Mobil anasayfa: hamburger'de kategori YOK, alt linkler var
- [ ] Mobil iç sayfa: hamburger'de kategoriler VAR
- [ ] Google yorumları: sayfayı birkaç kez yenile → sıra/baştaki isim değişiyor
