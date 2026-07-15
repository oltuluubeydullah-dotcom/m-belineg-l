# Möbel İnegöl v11.0 — PRODUCTION READY (2026-05-21)

## Müşteri teslimat sprintinin son versiyonu

### 1) Ürün başına 10 → **20 görsel** ✓
`UrunFormu.jsx` — `maksimum={20}`

### 2) Görsele tıkla → **tam ekran lightbox** ✓
`Galeri.jsx` baştan yazıldı:
- Ana görsele tıkla → siyah arka plan + tam boy görsel
- Modal'da sol/sağ ok tuşları gezinti, ESC kapatır
- Modal'da alt thumbnail strip — diğer görsellere atla
- Body scroll modal açıkken kilitli

### 3) Görsel kalitesi YÜKSEK ✓
`imageUpload.js`:
- Max boyut 1920 → **2400 px** (uzun kenar)
- JPEG kalite 0.85 → **0.92** (keskin)
- Bandwidth artar ama kalite gözle görülür şekilde yukarı

### 4) **inobilya tarzı ürün detay sayfası** + parça fiyatlandırma ✓
**Yeni DB kolonu:** `products.details JSONB`
```json
{
  "parts": [{"ad": "Üçlü Koltuk", "fiyat": 44550, "varsayilan": true}],
  "dimensions": [{"ad": "Üçlü", "genislik": "250 cm", "yukseklik": "85 cm", "derinlik": "103 cm"}],
  "bullets": ["İnegöl'de üretilmektedir", "2 adet üçlü koltuk", ...]
}
```

**Admin UrunFormu** yeni bölümler:
- **Parça Fiyatları** editörü — ekle/sil, ad+fiyat+varsayılan
- **Ölçü Tablosu** editörü — ad+genişlik+yükseklik+derinlik
- **Açıklama Maddeleri** editörü — bullet metinleri

**Yeni UrunDetay.jsx** (`/urun/[slug]`):
- Parts varsa **interaktif parça seçici** — kullanıcı tıkla, fiyat dinamik toplanır
- "X parça seçildi" göstergesi
- WhatsApp mesajı seçili parçaları otomatik içerir
- Sepete eklerken seçim takım adına ek olarak gider
- Aşağıda 3 **accordion**: Ürün Açıklamaları (bullets + ölçü tablosu), Teslimat ve Kurulum, Ödeme ve İletişim

### 5) Ana sayfada yeni ürün **anlık görünür** ✓
- Yeni endpoint: `/api/admin/revalidate` (admin auth korumalı, manuel cache temizleme)
- `UrunlerYonetim` kaydet → otomatik `revalidatePath('/')` çağırır → site cache temizlenir
- Müşteri sayfayı refresh edince yeni ürünü görür (force-dynamic + manuel invalidate = çift güvence)

### 6) Admin **Kılavuz** müşteri için temizlendi ✓
- `NEXT_PUBLIC_GA_ID`, "Supabase", "Vercel" gibi teknik servis isimleri kaldırıldı
- "Sistem yöneticisi (ubivo) ile iletişime geç" tarzı yumuşak yönlendirme
- Sistem Testi sayfasındaki SQL yönlendirmeleri yumuşatıldı

### 7) Genel bug taraması ✓
- Tüm public sayfalar `force-dynamic` — anlık yansıma garanti
- imageUpload robust: HEIC dönüşümü, magic byte tespiti, resize fallback
- RLS policy'leri hotfix ile sağlamlaştırıldı
- Build temiz, hiçbir warning yok

---

## Yapılacaklar (push'tan SONRA)
1. ZIP'i indir, üzerine yaz, push
2. Vercel build bekle
3. **Supabase Dashboard → SQL Editor** → `sql/08-urun-detaylari.sql` içeriği → Run
4. Admin → Ürünler → bir ürünü düzenle → **alt kısımda Parça Fiyatları + Ölçü + Madde bölümleri görmen lazım**
5. Bir ürüne parça/ölçü ekle → kaydet
6. Site'de ürün detay sayfasını aç — inobilya tarzı görüntü göreceksin
7. Görsele tıkla — lightbox açılmalı, ok tuşları çalışmalı

## Müşteri için yapılacaklar (teslimat sonrası)
- Tüm SQL upgrade'ler çalıştırılmış: ✓ (07, 08, RLS hotfix)
- Storage bucket'lar kurulmuş: ✓
- Admin oturumu: ✓
- Müşteri sadece admin'i kullanıyor; **Sistem Testi** ona güvence sayfası — kırmızı görürse ubivo ara

— by ubivo
