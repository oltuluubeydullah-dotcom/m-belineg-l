# Möbel İnegöl v10.8 — 5 GB Toplu Yükleme + Kategori Fontu Revert (2026-05-21)

## 1. Kategori şeridi geri eski haline + ince zarif yazı ✓
**Sorun:** v10.6'da siyah bar + kalın yazı uyumsuzdu.
**Çözüm (`Header.jsx`):**
- Siyah zemin kaldırıldı → krem/beyaz (border-top'lu)
- Font weight: `font-semibold` → `font-light` (300)
- Tracking: `tracking-wide` → `tracking-[0.12em]` (daha hava)
- Boyut: `text-sm` → `text-[13px]` (zarif, ince)
- Mobil menü de aynı şekilde inceltildi

## 2. 5 GB'a kadar .zip / .rar toplu yükleme ✓
**Sorun:** "Bağlantı hatası: Unexpected token 'R'..." Vercel'in 4.5 MB body limit'i request'i kesiyordu, plain text 413 dönüyordu, JSON parse patlıyordu.

**Çözüm:** Mimari değişti — artık dosya **doğrudan Supabase Storage'a** yüklenir, API sadece path alır.

### Akış (yeni)
1. Tarayıcı → arşiv dosyasını seçer
2. Tarayıcı → `kani-arsiv` bucket'ına direkt yükler (Supabase JS SDK)
3. Tarayıcı → `/api/admin/toplu-yukleme` POST `{ path, filename }` JSON gönderir
4. API → Storage'dan indirir, parse eder, ürünleri ekler
5. API → temp arşivi storage'dan siler

### Yeni dosyalar
- **`sql/06-arsiv-bucket.sql`** — Yeni private bucket (5 GB limit, .zip/.rar MIME), admin write policy
- **`app/admin/toplu-yukleme/page.jsx`** — 2-aşamalı yükleme UI (Storage'a yükle → API'yi tetikle), aşama metni gösterir
- **`app/api/admin/toplu-yukleme/route.js`** — FormData yerine JSON body alır, Storage'dan indirir, işlem sonrası siler

### Pratik limitler
- **Yükleme limiti:** 5 GB ✓
- **İşleme limiti:** Vercel fonksiyonu 60sn + ~1 GB RAM
- **Tavsiye:** Tek seferde 300-500 MB / 100-200 ürün civarı. Daha büyük arşivleri parçalara böl.

## Önce Supabase'de SQL çalıştır
Bu sürüm için Supabase Dashboard → SQL Editor:
```sql
-- sql/06-arsiv-bucket.sql dosyasının içeriğini yapıştır → Run
```
Bu adım atlanırsa toplu yükleme "Arşiv bucket kurulu değil" hatası verir.

— by ubivo
