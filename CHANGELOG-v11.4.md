# Möbel İnegöl v11.4 — 5 madde batch (2026-05-21)

## 1. Normal ürünlerde adet × fiyat ✓
**Önce:** 1 adet ₺110.000 / 3 adet ₺110.000 (sabit kalıyordu)
**Sonra:** 1 adet ₺110.000 / 3 adet ₺330.000 (otomatik hesaplanır)

`UrunDetay.jsx`:
- `birimFiyat` ve `toplamFiyat` ayrıldı
- Fiyat × adet dinamik
- Adet > 1 ise altına "₺110.000 × 3 adet" küçük not düşer
- İndirim çizgisi (line-through) de doğru çarpılır
- Sepete ekleme: `price` = birim, `qty` = adet (önce yanlış: total/1 olarak gidiyordu)

## 2. Duyuru çubuğu vurgu bug ✓
**Sebep:** `toLowerCase()` Türkçe **İ** harfini `i` + combining diacritic'e çeviriyor → 1 karakter 2 UTF-16 unit oluyor → `slice` yanlış pozisyondan kesiyor → "TESLİMAT" sadece "SLİMAT" turuncu görünüyordu.

**Fix:** `toLocaleLowerCase('tr-TR')` kullanıldı — Türkçe-uyumlu, combining diacritic eklemez, karakter uyumlu kalır.

`AnnouncementBar.jsx`

## 3. Admin → Toplu Yükleme tamamen kaldırıldı ✓
Silinen:
- `app/admin/toplu-yukleme/` (sayfa)
- `app/api/admin/toplu-yukleme/` (API)
- `sql/06-arsiv-bucket.sql`
- AdminShell'den sidebar menü satırı
- Sistem Testi'nden arşiv bucket testi (artık gereksiz)
- `node-unrar-js` ve `adm-zip` paketleri (kullanılmıyordu)

**Bundle küçüldü** (~3 MB civarı node_modules tasarrufu).

## 4. Sürükle-bırak ile görsel sıralama ✓
`MultiImageUploader.jsx`:
- Her görsel kartı `draggable` artık
- Fareyle sürükle → başka konuma bırak → otomatik sırala
- Sürüklenen görsel **opacity-30 + scale-95** (görsel ipucu)
- Hedef görsel **altın çerçeve + scale-105** (drop zone)
- İlk görsel hep "Kapak" — başka pozisyondan ilkin yerine sürüklersen kapak değişir
- Sağ/sol oklar mobilde kaldı (touch için fallback), masaüstünde gizli

## 5. Görsel yükleme hızlandırma ✓
`lib/imageUpload.js`:

**a) `createImageBitmap` decoder** — `FileReader` + `new Image()` + dataURL chain'i yerine binary decode. **~2-3x hızlı**.
- Eski tarayıcılar için klasik fallback hâlâ var

**b) Akıllı resize SKIP** — Dosya zaten ≤ 800KB ve JPG/PNG/WebP ise resize hiç yapılmaz, direkt upload. Çoğu kabul edilebilir boyutlu fotoğraf bu kapsamda. **Tek başına 2-5 saniye tasarruf** her dosyada.

**c) Bellek yönetimi** — `bitmap.close()` ile decode sonrası belleği hemen serbest bırakır.

**Tahmini hız kazanımı:**
| Senaryo | Önce | Sonra |
|---------|------|-------|
| 3 MB JPG (resize edilir) | ~3 sn | ~1 sn |
| 500 KB JPG (skip edilir) | ~1.5 sn | ~0.3 sn |
| 20 adet × 1 MB paralel | ~30 sn | ~6 sn |

— by ubivo
