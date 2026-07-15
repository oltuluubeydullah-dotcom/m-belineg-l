# Möbel İnegöl v10.7 — RAR Desteği (2026-05-21)

## Toplu yükleme artık .rar dosyalarını da kabul ediyor ✓

**Önce:** Sadece .zip seçilebiliyordu, file picker .rar dosyalarını göstermiyordu.

**Sonra:** Hem **.zip** hem **.rar** seçilebilir.

### Değişiklikler

**`app/admin/toplu-yukleme/page.jsx`**
- File picker accept: `.zip` → `.zip,.rar` + MIME tipleri
- UI metni: "ZIP dosyasını seçin" → "Arşiv dosyasını seçin"
- Validation: hem .zip hem .rar geçer

**`app/api/admin/toplu-yukleme/route.js`**
- `node-unrar-js` paketi eklendi (pure JS WASM RAR parser, Vercel uyumlu)
- Yeni `rarParse()` fonksiyonu — RAR arşivini aynı `[{kategoriAd, urunAd, resimler}]` çıktısına çevirir
- Yeni `arsivParse()` — uzantıya göre ZIP veya RAR'a yönlendirir
- POST handler her iki format için aynı şekilde çalışır

**`package.json`**
- `"node-unrar-js": "2.0.2"` eklendi

## Notlar
- RAR5 ve RAR4 desteği var (modern WinRAR çıktıları çalışır)
- Şifreli RAR'lar desteklenmez (Solid Compression OK)
- Yapı aynı: **Kategori/Ürün/1.jpg** klasörleri
- Vercel Hobby'de 60sn timeout — büyük ZIP/RAR'ları parçalara böl (50-80 ürün)

— by ubivo
