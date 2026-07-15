# Möbel İnegöl — v43 (Görsel Kök Neden Fix + AEO + Telefon Mockup)

SQL yok — direkt push edilebilir.

## 🚨 ANA FIX: "Görseller bir yüklenip bir yüklenmiyor" — kök neden bulundu
İki neden birleşmişti:
1. **Vercel Hobby görsel optimizasyon limiti:** R2 taşımasıyla 1537 görselin
   hepsi Vercel'e "yeni kaynak görsel" göründü → aylık limit doldu → yeni
   görseller **402 hatasıyla boş** dönüyordu (cache'lenenler çalışıyordu).
   → Çözüm: `images.unoptimized: true`. Görseller artık doğrudan R2'den
   servis ediliyor (zaten yüklemede WebP sıkıştırması var, R2 çıkışı ücretsiz).
   Limit/402 riski kalıcı olarak sıfırlandı. Bonus: görseller Vercel bant
   genişliğine de yazılmıyor.
2. **Dolgu görselleri her 5 dk'da değişiyordu:** blog + indirim dolgusu index
   bazlıydı, ISR her yenilemede farklı görsel atıyordu → tarayıcı cache'i
   işe yaramıyordu. → Çözüm: slug-hash ile **deterministik** seçim; aynı
   yazı/kategori hep aynı görseli alır, cache tam çalışır.
Ek: blog/indirim img'lerine `loading=lazy` + `decoding=async` + boyut ipucu.

## ✅ CTA istatistik bölümü — 4 kutu eşit + yeni tema
- Gönderdiğin **"2 YIL GARANTİ" rozeti** ve **WhatsApp destek** görseli eklendi
  (WebP'ye küçültüldü: 20KB + 15KB)
- 4 kutu da görselli ve **eşit kare boyutta** → orantısızlık gitti
- Geniş düzen (max-w-6xl), yumuşak gradyan, hover'da kalkma efekti

## ✅ Instagram + Trendyol — telefon mockup
- İki telefon çerçevesi yan yana, tıklayınca ilgili sayfaya gider
- **Trendyol:** gönderdiğin gerçek mağaza ekranı telefonun içinde
  (alt menü barı kırpıldı, 73KB WebP)
- **Instagram:** şık profil kartı (@mobelinegol, 662 gönderi, 10,1B takipçi)
  — ekran görüntüsünü tekrar gönderirsen gerçek ekranla değiştiririm
  (ilk gönderim Trendyol'la aynı dosya adına geldiği için üzerine yazılmıştı)
- Takip eden kişi isimleri İÇERMİYOR (gizlilik)

## ✅ SEO / AEO eklemeleri
- **WebSite + SearchAction** schema (layout) → Google sitelinks arama kutusu
  + AI motorlarına site yapısı
- **Article** schema (blog yazıları) → Google + AI cevap motorları blog
  içeriğini kaynak gösterebilir
- Mevcut güçlü temel korundu: FurnitureStore (GEO), FAQPage, Product,
  BreadcrumbList, AI-bot izinli robots, llms.txt, sitemap

## ✅ Doğrulama
ESLint 0 · build yeşil · sürüm `v43`

## Deploy sonrası test
- [ ] Anasayfa görselleri art arda yenilemede HEP geliyor mu (402 fix)
- [ ] Blog + indirim kapakları her seferinde AYNI görsel mi (deterministik)
- [ ] CTA: 4 eşit kutuda garanti rozeti + TIR + uçak/gemi + WhatsApp görseli
- [ ] Instagram/Trendyol telefon mockup'ları görünüyor, tıklayınca gidiyor
- [ ] Ürün sayfaları normal (unoptimized geçişi sorunsuz)

Detaylı güvenlik + 1-2 yıl altyapı analizi: **ALTYAPI-RAPORU.md**
by ubivo
