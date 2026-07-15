# Möbel İnegöl — v35 (Tam Bug Taraması + Performans + Temizlik)

Agent ekip tam taraması: bug avı, performans, ölü kod temizliği.
v34 (kategori ikon şeridi + Google yorumları) üzerine eklendi.
**Bu sürüm EK SQL gerektirmez** — sadece kod düzeltmesi.

---

## 🔴 KRİTİK FIX — Panel→Site Aktarımı (revalidate)
**Sorun:** Sadece ÜRÜN yönetimi site cache'ini temizliyordu. Kategori, blog,
hero-banner, ayarlar (telefon/WhatsApp/adres) ve yorumlar değiştirildiğinde
site ISR yüzünden **5 dakika eski kalıyordu**. `kategoriRevalidatePaths` ve
`blogRevalidatePaths` tanımlıydı ama hiç çağrılmıyordu.

**Çözüm:** Tüm yönetimlere revalidate bağlandı — değişiklik artık anında yansıyor:
- Kategori: ekle/güncelle/sil/sıralama/aktiflik
- Blog: ekle/güncelle/sil/yayınla-kaldır
- Hero banner: kaydet → tüm site
- Ayarlar: kaydet → tüm site (header/footer dahil)
- Yorumlar: gizle/doğrula/sil → anasayfa
- `lib/revalidate.js`'e `tumSiteRevalidatePaths()` eklendi.

## 🟠 PERFORMANS — Ürün Arttıkça Ağırlaşma Önlendi
1. **`/urunler` artık sayfalı** — eskiden TÜM ürünleri tek seferde çekip
   DOM'a basıyordu. Şimdi 24'erli sayfalama (kategori sayfasıyla aynı pattern).
   Ürün sayısı 1000'e çıksa da sayfa yükü sabit kalır.
2. **Hafif liste sorgusu** — liste/kart sorgularından ağır `description` ve
   `variants` (jsonb) kolonları çıkarıldı. Yeni sabit: `URUN_LISTE_SELECT`
   (`lib/supabase/queries.js`). Anasayfa, kategori ve /urunler kullanıyor.
   Egress ve sayfa boyutu düştü. (Ürün DETAY sayfası tüm kolonları çekmeye devam eder.)

> Not: `categories/is_active/is_featured/slug` index'leri zaten mevcut —
> bu ölçek için yeterli, ek index eklenmedi (gereksiz write yükü olmasın).

## 🟢 KOD KALİTESİ
- **ESLint: 0 uyarı** (önceden ~80). 6 kullanılmayan import/değişken silindi,
  `UrunDetay`'da `parts` `useMemo`'ya alındı (gereksiz render önlendi),
  Türkçe metinlerde gürültü yapan `no-unescaped-entities` kuralı kapatıldı.
- **Ölü kod:** kullanılmayan `getBannerText` fonksiyonu silindi (HeroCarousel).
  depcheck temiz — gerçek kullanılmayan paket yok.
- **Silent failure (Agent 54):** ürün/kategori otomatik çeviri catch'leri artık
  `console.warn` ile loglanıyor (admin çeviri sorununu görebilir). Fonksiyon
  davranışı aynı — çeviri başarısızsa kayıt yine yapılır.

## ✅ Doğrulama
- `npm run lint` → 0 uyarı
- `npm run build` → tüm sayfalar derlendi, hata yok

---

## ⚠️ DEPLOY ADIMLARI (sırayla)

### 1. Önce bekleyen SQL'ler (v32 + v34 — henüz çalıştırılmadıysa!)
Supabase SQL editöründe sırayla:
- `sql/15-mobel-category-cover-product.sql`  (v32 — kapak ürünü kolonu)
- `sql/16-mobel-site-reviews.sql`             (v34 — Google yorumları tablosu)

İkisi de idempotent (tekrar çalıştırmak güvenli). **Çalıştırılmazsa anasayfa hata verir.**

### 2. v35 için ek SQL YOK
Bu sürüm sadece kod. Yeni tablo/kolon gerektirmez.

### 3. Lokalde son kontrol
```
npm install
npm run build      # hatasız geçmeli
npm run start      # aşağıdaki test listesini gez
```

### 4. Sorun yoksa push + deploy

---

## TEST CHECKLIST
- [ ] `npm run build` hatasız
- [ ] Admin > Ayarlar'da telefon değiştir → kaydet → siteyi yenile, **anında** değişti mi?
- [ ] Admin > Kategoriler'de kategori adı değiştir → site anında güncellendi mi?
- [ ] Admin > Blog yeni yazı yayınla → /blog'da anında göründü mü?
- [ ] Admin > Yorumlar'da yorum gizle → anasayfa carousel'den anında kalktı mı?
- [ ] `/urunler` sayfasında alt kısımda sayfa numaraları çıkıyor mu (24'ten fazla ürün varsa)?
- [ ] Sayfa 2'ye geç → ürünler değişiyor, dil korunuyor mu?
- [ ] Ürün ekle/düzenle hâlâ sorunsuz mu (otomatik çeviri dahil)?

## SONRAKİ SÜRÜM ADAYI (v36)
- **Admin ürün listesi sayfalama:** Admin paneli hâlâ tüm ürünleri tek seferde
  yüklüyor (tek kullanıcı olduğu için düşük öncelik). 500+ üründe panel
  yavaşlarsa server-side sayfalama + arama eklenebilir.

by ubivo
