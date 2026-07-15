# CHANGELOG v10.1 — Kritik Tamamlama Paketi
**Tarih:** 21 Mayıs 2026 (geç gece)
**Önceki sürüm:** v10.0

> v10.0'da kalan bug + eksik i18n + yorumlar + analitik + admin self-service tamamlandı.

---

## 🐛 Bug Fix
- **WhatsApp şablon DB bağlantısı kuruldu** — `/admin/whatsapp-sablonlari`'ndan girilen mesajlar artık frontend'de kullanılıyor. (v10.0'da CMS sayfası vardı ama lib/whatsapp.js fallback'lere düşüyordu — DÜZELTİLDİ)
- `lib/whatsapp.js` artık `whatsapp_templates` tablosundan okuyor, 60sn in-memory cache, layout'tan `preloadTemplates()` ile ısıtılıyor

## ⭐ Yeni: Müşteri Yorumları Sistemi
- **SQL: `sql/05-reviews-and-analytics.sql`** — `reviews` tablosu (id, product_id, name, rating 1-5, text, is_hidden, is_verified, locale)
- **Misafir form** — hesap açmadan yorum: isim + yıldız + metin
- **Direkt yayın** (admin onayı yok) ama admin gizleyip/silebilir
- **Spam koruması:** 1 IP / 5 dk = 1 yorum, küfür filtresi (`lib/profanity.js`, 60+ TR/EN/DE kelime)
- **Ürün detay sayfasında:**
  - Ortalama yıldız puanı (header'da küçük gösterim + yorum bölümünde özet kart)
  - Yorum listesi (zaman damgalı, doğrulanmış rozeti, "X dk önce" formatı)
  - Yorum yazma formu (yıldız picker, isim, metin, kalan karakter sayacı)
- **Schema markup:** AggregateRating + Review → Google'da **yıldız puanı çıkar** (zengin sonuç)
- **3 dilde** — yorum form ve listesi TR/EN/DE çevrildi

## 📊 Yeni: Site Analitiği
- **Ürün görüntülenme sayacı** — `products.view_count` kolonu, RPC fonksiyon `increment_product_view()` ile her ürün açılışta +1
- **Admin dashboard'da 2 widget:**
  - 🏆 **En Çok Tıklanan 10 Ürün** (görüntülenme sayısıyla sıralı)
  - ⭐ **Son 5 Yorum** + ortalama puan + toplam yorum sayısı

## 🌐 i18n Tam Kapsama
Önceden eksik kalan sayfalar 3 dile çevrildi:
- **Sepet** (SepetClient.jsx) — adet, toplam, kaldır, ara toplam, yaklaşık toplam
- **Checkout** (CheckoutFormu.jsx) — form etiketleri, hata mesajları, KVKK metni, butonlar
- **Teşekkürler sayfası** — başlık + 3 adımlı süreç açıklaması
- **Ürün detay** (UrunDetay.jsx) — "Sepete Ekle", "Açıklama", "Beğenebileceklerin", güven mesajları
- WhatsApp şablonları artık `await siparisMesajiOlustur(...)` async (DB fetch için)

## 🛠 Admin İyileştirmeleri
### Ürünler listesi (UrunlerYonetim.jsx)
- **Toplu işlem (bulk operations):**
  - Checkbox sütunu eklendi (tümünü seç + tek tek)
  - Seçim varken üstte action bar: **Aktif yap / Pasif yap / Öne çıkar / Sil**
  - Onay diyaloğu kalıcı silme için
- Featured toggle (yıldız) zaten vardı, dokunulmadı

### Yeni admin sayfası: `/admin/yorumlar`
- Tüm yorumların listesi
- Filtreler: Tümü / Yayında / Gizli
- Her yorum için **3 işlem:** Doğrulanmış işaretle / Gizle-Yayınla toggle / Sil
- Ürün linki (yeni sekmede açar), tarih, locale, yıldız

### Admin menüsünde **Yorumlar** öğesi eklendi

### Kategori formu
- Çoklu dil collapsible (EN/DE) — opsiyonel, boş = auto-translate

### Kullanım Kılavuzu
- **+2 bölüm:** 11. Müşteri Yorumları + 12. Site Analitiği
- 18 bölüme çıktı, içindekiler güncellendi

## 📂 Yeni Dosyalar
- `sql/05-reviews-and-analytics.sql`
- `lib/profanity.js`
- `app/api/reviews/route.js`
- `components/public/ReviewList.jsx`
- `components/public/ReviewForm.jsx`
- `app/admin/yorumlar/page.jsx`
- `app/admin/yorumlar/YorumlarYonetim.jsx`

## 🔧 Güncellenmiş Dosyalar
- `lib/whatsapp.js` (DB-backed templates)
- `app/[locale]/(public)/layout.jsx` (preloadTemplates çağrısı)
- `app/[locale]/(public)/urun/[slug]/page.jsx` (yorumlar + view counter + AggregateRating schema)
- `app/[locale]/(public)/urun/[slug]/UrunDetay.jsx` (i18n + rating özet)
- `app/[locale]/(public)/sepet/SepetClient.jsx` (i18n)
- `app/[locale]/(public)/sepet/onayla/CheckoutFormu.jsx` (i18n + async whatsapp)
- `app/[locale]/(public)/sepet/tesekkurler/page.jsx` (i18n)
- `app/admin/page.jsx` (analytics widgets)
- `app/admin/AdminShell.jsx` (Yorumlar menü öğesi)
- `app/admin/urunler/UrunlerYonetim.jsx` (bulk operations)
- `app/admin/kategoriler/KategoriFormu.jsx` (i18n alanlar)
- `app/admin/kilavuz/page.jsx` (Yorumlar + Analitik bölümleri)
- `messages/{tr,en,de}.json` (Reviews namespace)

---

## 🚀 Deploy (v10.0 üzerine)

### 1. GitHub Push
v10.1 zip'i overwrite et. Eski `app/(public)` ve `app/giris` klasörleri zaten silinmişti (v10.0).

### 2. Supabase SQL — **2 migration**
```sql
-- v10.0'da çalıştırıldı:
sql/03-full-text-search.sql
sql/04-i18n-and-cms.sql

-- v10.1 YENİ — şimdi çalıştır:
sql/05-reviews-and-analytics.sql
```

### 3. Yeni env var YOK
Mevcut env'ler yeterli. (Resend opsiyonel — şu an yorum sisteminde email gerek yok)

### 4. Test
- [ ] Ürün detay → yıldız formu doldur → yorum yayında mı görünüyor?
- [ ] Admin /admin/yorumlar → yorum görünüyor mu? Sil/gizle/doğrula çalışıyor mu?
- [ ] Admin dashboard → En Çok Tıklanan + Son Yorumlar widget'ları dolu mu?
- [ ] Ürün sayfasını birkaç kez aç → view_count artıyor mu?
- [ ] Admin → Ürünler → 3 ürün seç → toplu aktif/pasif çalışıyor mu?
- [ ] Sepete bir şey ekle → /en/sepet → metinler İngilizce mi?
- [ ] WhatsApp Şablonları admin'den şablon değiştir → ürün detay → WhatsApp tıkla → yeni şablon kullanılıyor mu?

---

## 🎯 v10.1 — Müşteri Teslimine TAM Hazır

- ✅ Performance (image, SW, resource hints)
- ✅ i18n TR/EN/DE — TÜM sayfalar
- ✅ Admin CMS (hero + sayfalar + WA şablonları + kategoriler i18n + ürünler i18n)
- ✅ Müşteri yorumları + spam koruması + admin moderation
- ✅ Site analitiği (görüntülenme + yorum özeti)
- ✅ Bulk operations
- ✅ Featured toggle
- ✅ Detaylı admin kılavuzu (18 bölüm)
- ✅ WhatsApp şablon DB bağlı (bug çözüldü)

---

**by ubivo** | Möbel İnegöl v10.1 — Kusursuz Production
