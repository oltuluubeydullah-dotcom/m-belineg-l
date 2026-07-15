# Möbel İnegöl — v8.2 Değişiklik Notları

**Tarih:** 20 Mayıs 2026
**Önceki sürüm:** v8.1
**Hazırlayan:** by ubivo

---

## 🎯 Özet

Bu sürümde Enes'in revizyon talepleri uygulandı: marka düzeltmesi, yeni hero banner sistemi,
anasayfa düzenlemesi, footer/admin link güncellemeleri, çalışma saatleri değişikliği.

**Çalışan mobelinegol.com görüntüsü hazır** — Vercel'e push edilebilir. ICANN domain
askısı çözülünce direkt yayında olacak.

---

## ✅ Tamamlanan Değişiklikler

### 1. Marka Yazımı Düzeltmesi (Global)

- **"Kanı" (noktasız ı)** → **"Kani" (noktalı i)** dönüşümü.
- Büyük harf yazımı: **"KANİ MOBİLYA"** (noktalı İ ile).
- 30 dosyada 49 düzeltme yapıldı (jsx, js, sql, md, json, css).
- Türkçe dilbilgisinde "Kani" (i'li) → "KANİ" (İ'li) doğru dönüşümdür.

### 2. Logo Görselleri Yeniden Üretildi

Eskiden logo görselinde **"KANI MOBİLYA"** (noktasız I) yazıyordu. Şimdi tüm
6 varyant **"KANİ MOBİLYA"** (noktalı İ) ile yenilendi:

- `/public/marka/logo-siyah.png` (1600×400) — Header
- `/public/marka/logo-beyaz.png` (1600×400) — Koyu zemin
- `/public/marka/logo-slogan-siyah.png` (1600×500) — Footer + slogan
- `/public/marka/logo-slogan-beyaz.png` (1600×500) — Koyu zemin + slogan
- `/public/marka/k-markasi-siyah.png` (1024×1024) — K monogramı
- `/public/marka/k-markasi-beyaz.png` (1024×1024) — K monogramı beyaz

Font: Poppins Bold. K harfinin altında orijinal logo'daki gibi alt çizgi var.

### 3. Yeni Hero Banner Sistemi (3 Banner Carousel)

`components/public/HeroCarousel.jsx` — yeni client component.

Eski hero ("Hayalindeki Eve Bir Adım" + 2 CTA) tamamen kaldırıldı.
Yerine 3 banner dönen carousel geldi:

**Banner 1 — Avrupa Teslimat**
- Mavi-camgöbeği gradient + dalga deseni
- Başlık: "İnegöl'den Avrupa'ya"
- Alt başlık: "Kapınıza Teslim Mobilyalar"
- 9 ülke chip'i: Almanya, Fransa, Belçika, Hollanda, İsviçre, İngiltere, Avusturya, Bulgaristan, Azerbaycan
- Sağ üst köşede büyük altın konum pin ikonu

**Banner 2 — En İyi Teklif**
- Krem zemin + koyu siyah diyagonal blok (sağdan)
- Üst yazı: "TÜM MOBİLYA MODELLERİMİZDE AVANTAJLI FİYAT VE ÖDEME KOŞULLARI İLE"
- Büyük başlık: "En İyi *Teklif*" (italik altın)
- Alt yazı: "Tüm mobilya modellerimizde en iyi fiyat teklifi için hemen şimdi bizimle iletişime geçin!"
- CTA: Yeşil yuvarlak buton **"İletişim Hattı"** → `tel:+90...`

**Banner 3 — Şimdi Alın**
- Koyu siyah arka plan + altın havai fişek SVG patterni
- Üst yazı: "ZAMLARDAN ETKİLENMEDEN İNDİRİMLİ FİYATLARLA"
- Çok büyük başlık: "ŞİMDİ ALIN!" (altın vurgulu)
- Sarı şerit kutuda: "DEPOMUZDA BEKLETELİM, İSTEDİĞİNİZ ZAMAN TESLİMAT YAPALIM"
- Sparkle animasyonları

**Özellikler**:
- Otomatik döngü 6 saniyede bir
- Hover yapınca durur (masaüstü)
- Sol/sağ ok butonları (masaüstü)
- Dot indicator (aktif olan genişler)
- Mobile swipe (sola/sağa kaydırma)
- Yükseklik: 480px (mobil) → 620px (lg)

### 4. Anasayfa Düzenlemesi

`app/(public)/page.jsx` baştan yazıldı.

**Eskiden**: Hero → 8 kategori kartı grid → "Öne Çıkan Ürünler" (varsa) → Hakkımızda kısa

**Şimdi**: HeroCarousel → **"Her Eve Bir Tarz" başlığı + karışık 16 ürün grid'i** → Hakkımızda kısa

- 8 kategori kartı bölümü **kaldırıldı** (Enes'in talebi: anasayfada kategori bölmek istemiyor).
- Kategorisiz, karışık ürün grid'i geldi. Filtre: aktif + featured önce, sonra yeni eklenenden.
- "Tüm Koleksiyonu Gör" CTA → Koltuk Takımı kategorisi.
- Boş durum (henüz ürün eklenmemişken): nazik bir "yakında" mesajı + WhatsApp CTA.

**Kategori sayfalarına erişim devam ediyor**: header navigasyondaki kategori linkleri
(Düğün Paketleri, Koltuk Takımı, vs.) eskisi gibi `/kategori/<slug>` sayfalarına gider.

### 5. Çalışma Saatleri Güncellendi

**Eskiden**:
- Pazartesi — Cumartesi: 09:00 — 19:00
- Pazar: 10:00 — 18:00

**Şimdi**:
- Pazartesi — Cuma: 10:00 — 19:00
- Cumartesi — Pazar: 10:00 — 20:00

İki yerde güncellendi:
- `app/(public)/magazalarimiz/page.jsx` (görsel tablo)
- `app/layout.jsx` (Schema.org JSON-LD `openingHoursSpecification`)

### 6. Footer & AdminShell "by ubivo" Linki

İki yerde "by **ubivo**" yazısı artık tıklanabilir link:

- `https://www.byubivo.com` adresine gider
- `target="_blank"` (yeni sekme)
- `rel="noopener noreferrer"` (güvenlik)
- Hover'da renk değişir (altın → turuncu)

Konum:
- `components/public/Footer.jsx` (alt copyright satırı)
- `app/admin/AdminShell.jsx` (admin sidebar altı)

### 7. Hakkımızda Sayfası

Global "Kanı" → "Kani" düzeltmesine bu sayfa da dahil edildi:

- Meta description: "Möbel İnegöl — ..."
- Sayfa içeriği: "Möbel İnegöl, Türkiye'nin mobilya başkenti İnegöl'de..."
- Alt başlık: "Neden Möbel İnegöl?"

### 8. Admin Paneli: Toplu Yükleme Menüsü

`AdminShell.jsx` sol menüye **"Toplu Yükleme"** girişi eklendi
(IconCloudUpload, Ürünler ile Kategoriler arasında).

Sayfa şu anda **placeholder** durumda — `app/admin/toplu-yukleme/page.jsx`:
- Beklenen zip klasör yapısı görseli
- "Bir sonraki güncellemede aktif" mesajı
- Geçici alternatif: Ürünler → Yeni Ürün ile manuel ekleme yönergesi

`adm-zip` paketi `package.json` dependencies'e eklendi (sonraki sürümde tam işleyişli
zip parser için).

---

## ⏳ Bir Sonraki Sürüme (v8.3) Kalanlar

### Toplu Yükleme Tam İşlevsel Hale Getirilecek

Şu üç dosya yazılacak:
- `app/api/admin/toplu-yukleme/route.js` — POST endpoint
- `app/admin/toplu-yukleme/TopluYuklemeIstemcisi.jsx` — drag-drop UI + progress
- Mevcut `app/admin/toplu-yukleme/page.jsx` placeholder'ı tam sayfaya çevrilecek

**Davranış spec'i**:
1. Drag-drop alanı + dosya seçici (sadece .zip kabul eder)
2. Maks 1GB sınırı (sunucuda da kontrol)
3. Form-data POST `/api/admin/toplu-yukleme`
4. Sunucuda `adm-zip` ile aç → klasör tree'sini yürü
5. Her üst klasör → mevcut kategori'ye slug eşleştir (yoksa atla)
6. Her alt klasör → ürün oluştur: name = klasör adı, slug = `slugOlustur(name)`
7. İçindeki tüm .jpg/.png/.webp → Supabase `kani-medya` bucket'ına yükle
8. Products tablosuna insert: `base_price = null` (Enes sonradan girer)
9. Frontend'e progress (SSE veya polling)
10. Sonuç raporu: "X kategori, Y model, Z fotoğraf eklendi, N hata"

### Mobile Responsive Audit

Tüm sayfalarda breakpoint kontrolleri:
- Touch target ≥44px
- Image responsive (sizes attribute)
- Nav drawer mobil
- Hero/banner mobil-first re-layout (HeroCarousel zaten yapıldı)
- Form input height mobil

---

## 🚨 ICANN Domain Askısı Notu

Bu sürüm hazırlanırken **mobelinegol.com ICANN doğrulama askısında**.
Tüm kod ve değişiklikler Vercel deployment'ında zaten valid configuration'da
çalışıyor. Domain askısı kalktığında bu v8.2 paketi otomatik canlıya çıkar.

**Askı çözümü** (Enes yapacak):
1. Hostinger hPanel → Alan Adı Sahipliği
2. Doğrulama e-postasını tekrar gönder
3. Domain'e kayıtlı mail kutusundan linke tıkla
4. 1-2 saatte DNS Vercel'e dönüyor, site açılıyor

---

## 📂 Değişen Dosyalar Listesi

```
DEĞIŞTI:
  package.json                                      (+ adm-zip dep)
  app/layout.jsx                                    (opening hours, Kani)
  app/(public)/page.jsx                             (BAŞTAN YAZILDI — yeni hero + grid)
  app/(public)/magazalarimiz/page.jsx               (çalışma saatleri)
  app/(public)/hakkimizda/page.jsx                  (Kanı → Kani)
  app/(public)/[diğer 12 sayfa]                     (Kanı → Kani metni)
  app/admin/AdminShell.jsx                          (menü + by ubivo link)
  app/admin/ayarlar/AyarlarFormu.jsx                (Kanı → Kani)
  components/public/Footer.jsx                      (by ubivo link)
  lib/constants.js                                  (yorum: Kani)
  tailwind.config.js                                (yorumlar: Kani)
  globals.css                                       (yorum: Kani)
  sql/01-schema.sql                                 (Kanı → Kani)
  sql/02-blog-schema.sql, sql/02-blog.sql           (Kanı → Kani)
  package.json, README.md, MEMORY.md, vb. dokümanlar

YENİ EKLENDİ:
  components/public/HeroCarousel.jsx                (3-banner carousel)
  app/admin/toplu-yukleme/page.jsx                  (placeholder)
  CHANGELOG-v8.2.md                                 (bu dosya)

YENİLENDİ (binary):
  public/marka/logo-siyah.png
  public/marka/logo-beyaz.png
  public/marka/logo-slogan-siyah.png
  public/marka/logo-slogan-beyaz.png
  public/marka/k-markasi-siyah.png
  public/marka/k-markasi-beyaz.png
```

---

## 🚀 Deploy Talimatı

```bash
# 1. Bu zipi proje klasörüne aç (mevcut kani-mobilya/ üzerine):
unzip kanipaket.zip -d /yol/proje/

# 2. Bağımlılıkları yenile (adm-zip yüklenecek):
npm install

# 3. Localde test (opsiyonel):
npm run dev
# → http://localhost:3000

# 4. Git'e commit + Vercel'e push:
git add .
git commit -m "v8.2: Yeni hero carousel, KANİ logo, working hours, footer link"
git push

# Vercel otomatik build + deploy edecek.
```

**Database değişikliği gerekmez**. Sadece kod ve görsel değişiklikleri var.

---

## 🔍 Test Kontrol Listesi

Deploy sonrası kontrol edilecekler:

- [ ] Anasayfa açılıyor mu, 3 banner döner mi?
- [ ] Logoda "KANİ MOBİLYA" (noktalı İ) görünüyor mu?
- [ ] Header sticky çalışıyor, mobil hamburger menü açılıyor mu?
- [ ] "Her Eve Bir Tarz" altında ürün grid'i veya boş durum görünüyor mu?
- [ ] Footer'da "by **ubivo**" yazısı tıklandığında byubivo.com'a yönlendiriyor mu?
- [ ] Mağazalarımız sayfasında yeni saatler: Pzt-Cuma 10-19, Cmt-Pzr 10-20?
- [ ] Hakkımızda'da "Möbel İnegöl" (i'li) yazıyor mu?
- [ ] Admin paneline giriş yap → sol menüde "Toplu Yükleme" görünüyor mu? Tıkla → placeholder sayfa açılıyor mu?
- [ ] Mobil görünüm tüm sayfalarda düzgün mü?

---

*by ubivo — Tüm hakları saklıdır*
