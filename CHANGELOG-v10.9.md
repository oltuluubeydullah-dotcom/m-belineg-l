# Möbel İnegöl v10.9 — Görsel Yükleme Genişletme + Audit (2026-05-21)

## 1. Görsel yükleme limitleri genişletildi ✓
**Önce:** 10 MB/dosya, max 10 görsel/ürün, sınırlı format
**Sonra:** **50 MB/dosya, 20 görsel/ürün**, geniş format desteği

### Değişiklikler
- **`lib/imageUpload.js`** — `MAX_BYTE`: 10 MB → **50 MB**
- **`components/ui/MultiImageUploader.jsx`** — `maksimum`: 10 → **20**
- **`components/ui/ImageUploader.jsx`** — UI metni güncellendi
- **`sql/07-medya-bucket-genisletme.sql`** — `kani-medya` bucket: 10 MB → 50 MB + tüm yaygın resim formatları (JPG, PNG, WebP, AVIF, GIF, HEIC, HEIF, BMP, TIFF, SVG)

## 2. Kategori şeridi fontu (gerçek inobilya match) ✓
Önceki sürümlerde önce `font-semibold` (çok kalın), sonra `font-light` (çok ince) denedik.
inobilya referansına en yakın orta yol: **`font-medium`** + sıkılaştırılmış tracking (`tracking-[0.08em]`).

## 3. Toplu yükleme limit netleşti (5 GB yanıltıcıydı) ✓
**Önce:** "5 GB'a kadar" yazıyordu ama Supabase Free plan **50 MB cap** uyguluyor — yanıltıcıydı.
**Sonra:** Frontend doğrudan 50 MB kontrolü yapıyor + UI'da "Maksimum 50 MB (Supabase Free plan)" yazıyor.
Pro'ya yükseltilirse 50 GB olabilir.

## Limitlerle ilgili gerçekler (kabullen)
| Konu | Free Plan | Pro Plan ($25/ay) |
|------|-----------|-------------------|
| Tek dosya yükleme | **50 MB** | 50 GB |
| Toplam storage | 1 GB | 100 GB |
| Vercel fonksiyon timeout | 60 sn | 300 sn |
| Vercel API body limit | 4.5 MB → bypass'lıyoruz | aynı |

**1 GB tek dosya = Pro plan gerekiyor.** Ubeyt için Free plan'da pratik akış:
- Ürün başına 20 görsel × ortalama 2 MB = 40 MB/ürün → tek seferde yüklenir ✓
- Toplu yükleme: 50 MB'lık ZIP'lere böl → tek seferde ~20-30 ürün

## 4. Admin ↔ Site bağlantı audit'i
Tüm public sayfalar `dynamic = 'force-dynamic'` — admin'den yapılan kaydedişler **anlık** görünür:
- ✓ Ürünler → kategori sayfası, anasayfa, ürün detay
- ✓ Kategoriler → header, kategori sayfaları
- ✓ Hero Banner → anasayfa
- ✓ Ayarlar (duyuru) → AnnouncementBar
- ✓ Blog → /blog
- ✓ Sayfa İçerikleri → hakkımızda, kvkk, gizlilik vs.
- ✓ Yorumlar → ürün detay

**Bilinen kısıt:**
- **WhatsApp Şablonları** admin sayfası var ama UI hâlâ hardcoded mesajlar kullanıyor (lib/whatsapp.js). Bunu DB'den okumak için ayrı refactor lazım — v10.10'da yapacağız. Şimdilik admin'de düzenlersen sitede değişmez.

## Yapılacak (push'tan sonra)
1. ZIP'i indir, üzerine yaz, push
2. Vercel build bekle
3. **Supabase SQL Editor** → `sql/07-medya-bucket-genisletme.sql` içeriğini çalıştır
4. Admin → Ürünler → bir ürünü düzenle → 20 görsel ekleyebileceksin, 50 MB'lık dosyalar geçer
5. Görsel formatı: HEIC/HEIF dahil her yaygın format desteklenir (iPhone fotoğrafları sorunsuz)

— by ubivo
