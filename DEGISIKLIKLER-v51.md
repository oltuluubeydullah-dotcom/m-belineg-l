# Möbel İnegöl — v51 · PAZARLAMA MERKEZİ + PERFORMANS

## ⚠️ SQL VAR: önce sql/19-mobel-pazarlama.sql çalıştırılmalı
Supabase SQL Editor'de çalıştır (idempotent — tekrar çalıştırılabilir).
Sonra push. SQL çalışmadan da site bozulmaz ama Pazarlama paneli kaydetmez.

## 🆕 1) Admin → "Pazarlama" sekmesi (yeni)
Reklam ajansı için her şey burada:
- **Meta Pixel** (Instagram+Facebook) · **TikTok Pixel** · **Google Ads**
  (YouTube+Arama) — ID yapıştır → kaydet → anında aktif, deploy gerekmez.
  Format kontrolü var (yanlış ID yapıştırılamaz). Aktif/bağlı değil rozeti.
- **Ürün Kataloğu (XML feed):** /api/feed/urunler.xml — kopyala butonu.
  Google Merchant formatı; Meta + TikTok + Google üçü de kabul eder.
  Dinamik ürün reklamı için ajansa bu link verilir. 1 saat cache.
- **Kampanya Performansı:** UTM etiketli reklamlardan gelen ziyaret /
  sepet / WhatsApp sayıları (son 30 gün) — ajans denetim tablosu.

## 🆕 2) Dönüşüm event köprüsü (KVKK uyumlu)
Tek tıklamayla hem iç analitik hem TÜM aktif pixellere gider:
- Ürün görüntüleme → ViewContent · Sepete ekleme → AddToCart
- WhatsApp tıklama → **Lead** (ürün sayfası + sepet onay + yüzen buton)
- Arama → Search
- Pixeller çerez izni gelmeden veri GÖNDERMEZ (TikTok izinsiz hiç yüklenmez).
- CSP whitelist'ine facebook/tiktok/google domainleri eklendi.

## 🐛 3) Bug fix: iç analitik hiç çalışmıyordu
site_events API'si vardı ama client hiçbir event göndermiyordu →
dashboard'daki sepet/tıklama sayıları hep 0 kalıyordu. v51 ile gerçek
veri akmaya başlar.

## 🆕 4) Dashboard: Dönüşüm Hunisi kartı
Ziyaretçi → Ürün inceleme → Sepet → WhatsApp oranları (son 30 gün).

## 🆕 5) Ürün SEO alanları
Ürün formunda "Google'da Görünüm" (katlanır bölüm): özel meta başlık +
açıklama. Boşsa eskisi gibi otomatik. Karakter sayacı var.

## ⚡ 6) Performans
- **R2 upload'larına 1 yıl immutable cache** (yeni yüklenen görseller
  tarayıcıda/CDN'de kalır — tekrar inmez)
- **preconnect:** R2 + Supabase host'larına erken bağlantı (~150-300ms)
- **Hero görsellerine fetchPriority=high** (LCP iyileşir)
- **Admin liste thumb'ları lazy** (4 modül — panel anında açılır)
- **Dashboard huni sorgusu count-only** (satır çekmez, 3 hafif sayım)
- Service Worker BİLEREK geri getirilmedi (v16 beyaz ekran geçmişi)

## 📌 ASIL GÖRSEL HIZI İÇİN (kod dışı — müşteri aksiyonu)
Görseller pub-xxx.r2.dev üzerinden geliyorsa Cloudflare bunu CDN'lemez
ve HIZ LİMİTLER. Çözüm: Cloudflare panelden R2 bucket'a custom domain
bağla (gorsel.mobelinegol.com) → Vercel'de NEXT_PUBLIC_R2_PUBLIC_URL
güncelle. Kod hazır (v44'ten beri). Rehber: r2-kurulum.pdf.

## Doğrulama
- npm run build ✓ Compiled successfully · BUILD_ID üretildi
- ESLint: 0 uyarı

## Deploy sonrası test
- [ ] sql/19 çalıştı (Supabase: settings.tracking kolonu var mı?)
- [ ] Admin → Pazarlama açılıyor, test ID kaydediliyor, rozet yeşil
- [ ] /api/feed/urunler.xml ürünleri listeliyor
- [ ] Çerez kabul et → F12 Network'te facebook/tiktok istekleri görünüyor
- [ ] Ürün sayfası aç + WhatsApp tıkla → dashboard hunisinde sayı artıyor
- [ ] Ajansa: pixel ID'leri + feed linki + UTM örnek formatı iletilecek
