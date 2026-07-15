# Möbel İnegöl v10.6 — Admin↔Site Bağlantısı + UI Cila (2026-05-21)

## 4 ana fix

### 1. Duyuru/ayarlar kaydet → site ANINDA güncelleniyor ✓
**Sorun:** Admin'den kaydedince site 60sn cache'liyordu, değişiklik geç görünüyordu.
**Dosya:** `app/[locale]/(public)/layout.jsx`
**Çözüm:** `revalidate = 60` kaldırıldı → `dynamic = 'force-dynamic'`.
Admin'in kaydettiği duyuru/kategori/banner anında public sayfalarda görünür.

### 2. Toplu yükleme artık çalışıyor ✓
**Sorun:** Spinner sonsuz dönüp duruyordu.
**Sebep:** `maxDuration = 300` (5dk) ayarlanmıştı ama Vercel **Hobby** planı max 60sn'ye izin verir → fonksiyon timeout'a düşüyordu.
**Dosya:** `app/api/admin/toplu-yukleme/route.js`
**Çözüm:** `maxDuration = 60`. Büyük ZIP'leri parçalara böl (50-80 ürün/batch öneririz).

> ⚠️ Sadece `.zip` desteklenir, `.rar` DEĞİL. WinRAR'da "ZIP'e ekle" seç.

### 3. Site kategori şeridi — inobilya tarzı siyah bar ✓
**Dosya:** `components/public/Header.jsx`
**Çözüm:** Eski krem zemin / koyu yazı → **siyah zemin / krem yazı**.
Yazı semibold, uppercase, tracking-wide. Hover'da altın renge geçer.
Full-width siyah bar, container içinde kategoriler ortalı.

### 4. Admin sidebar daha temiz + daha geniş ✓
**Dosya:** `app/admin/AdminShell.jsx`
**Çözümler:**
- Genişlik: 256px → **288px (w-72)**
- Renk tonu: keskin siyah → yumuşak grafit `#1F1D1A`
- Item padding: `py-3` → `py-2` (tüm menü tek bakışta görünür)
- Icon: 20px → 18px (daha sade)
- Font: 14px → 13.5px (denge)
- Grup ayraçları (`sonEk: true` olan item'lerin üstüne ince border)
- Hover efekti basitleştirildi (`bg-white/5`)
- Logo padding daraltıldı, "Yönetim" alt yazı küçültüldü

## Performans notları
- Admin paneli hız: Sayfalar `force-dynamic`. Her navigasyon Supabase auth check'i + sayfa datası çekiyor. Frankfurt → Türkiye latency ~30-50ms normal.
- Public site: layout force-dynamic ama Vercel CDN brand asset'leri cache'liyor → ana yavaşlık sadece DB sorgularında.
- Daha hızlı istersen Supabase region'unu **Frankfurt → Istanbul** değiştirmek mümkün (ama proje yeniden açmak gerekir).

## Audit özet — çalışan/çalışmayan bağlantılar
| Admin sayfası        | Site'de görünüyor mu? | Kaydet sonrası anında? |
|----------------------|----------------------|------------------------|
| Ürünler              | ✓ kategori sayfaları, anasayfa | ✓ (v10.6) |
| Kategoriler          | ✓ header nav         | ✓ (v10.6) |
| Hero Bannerlar       | ✓ anasayfa hero      | ✓ (v10.6) |
| Ayarlar (duyuru)     | ✓ AnnouncementBar    | ✓ (v10.6) |
| Blog                 | ✓ /blog              | ✓ (v10.6) |
| Sayfa İçerikleri     | ✓ hakkımızda, KVKK vb.| ✓ (v10.6) |
| Talepler             | (yalnızca admin görür)| n/a |
| Yorumlar             | ✓ ürün detay         | ✓ (v10.6) |
| WhatsApp Şablonları  | UI hazır, frontend bağlantısı v10.7'de |
| Toplu Yükleme        | ✓ (v10.6) |  ✓ |

— by ubivo
