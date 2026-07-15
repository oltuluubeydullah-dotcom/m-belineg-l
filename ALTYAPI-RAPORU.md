# Möbel İnegöl — Güvenlik & Altyapı Raporu (v43)
*Tam sistem taraması + 1-2 yıl ücretsiz altyapı projeksiyonu — by ubivo*

## 1) GÜVENLİK TARAMASI — SONUÇ: SAĞLAM ✅
Tarandı ve doğrulandı:
| Alan | Durum |
|---|---|
| HTTP güvenlik başlıkları (HSTS, X-Frame DENY, nosniff, Referrer, Permissions) | ✅ Tam |
| CSP (img-src: self + Supabase + R2, script/style kısıtlı) | ✅ Tam |
| Admin route koruması (middleware + Supabase auth) | ✅ |
| Upload API (sadece admin, 401/403) | ✅ |
| API rate limit (login, reviews, favorite, track) | ✅ |
| Supabase keepalive cron (+CRON_SECRET) | ✅ |
| .env git'e girmiyor (.gitignore) | ✅ |

### Yapılması gerekenler (senin tarafında)
1. **Supabase service_role token reset** — taşıma sırasında PowerShell
   ekranında göründü. Supabase → Settings → API → service_role → Reset.
   Sonra Vercel'de SUPABASE_SERVICE_ROLE_KEY env'ini yenisiyle güncelle.
   (Acil değil ama yapılmalı.)
2. **Next.js sürümü (14.2.35):** bilinen 1 yüksek DoS açığı var; yaması
   major sürümde (15/16). Bu kontrollü bir yükseltme sprinti ister —
   ayrı bir oturumda planlayalım, şimdilik risk düşük (Vercel WAF önünde).

## 2) HIZ — YAPILAN + ÖNERİLEN
**Yapıldı (v43):**
- Vercel görsel optimizasyonu kapatıldı → 402 limit sorunu bitti, görseller
  doğrudan R2'den (çıkış ücretsiz, Vercel bandwidth'ine yazılmıyor)
- Dolgu görselleri deterministik → tarayıcı cache'i tam çalışıyor
- lazy + async decoding + boyut ipuçları → ilk yükleme hafifledi
- Yeni görseller WebP (20-73KB)
**Yükleme hızı zaten optimize:** admin yüklemede client-side sıkıştırma +
paralel kuyruk (5) + R2'de 1 yıl cache başlığı.

**Tek büyük öneri — Custom Domain (ZAMANI GELİNCE):**
Şu an görseller `pub-xxx.r2.dev` üzerinden geliyor. Bu adres Cloudflare
tarafından **hız sınırlıdır ve production için önerilmez**. Domain
Cloudflare'e taşınırsa (ücretsiz plan yeterli) `cdn.mobelinegol.com`
bağlanır → tam CDN cache + sınırsız hız. DNS taşıma gerektirdiği için
ayrı bir oturumda, adım adım yaparız. Mevcut haliyle de site çalışır;
trafik büyüdükçe bu adım önem kazanır.

## 3) SEO / GEO / AEO — İNEGÖL 1 NUMARA PLANI
**Mevcut (güçlü):** FurnitureStore schema (İnegöl koordinatlı — yerel arama
için kritik), FAQPage, Product, BreadcrumbList, hreflang (TR/EN/DE),
sitemap, robots'ta AI botlarına açık izin, llms.txt (ChatGPT/Claude/
Perplexity kaynak gösterebilsin diye).
**v43'te eklendi:** WebSite+SearchAction, Article (blog).
**Senin tarafında (kod dışı, en etkili işler):**
1. **Google Business Profile** — İnegöl'de 1 numaranın gerçek anahtarı
   burası: profili eksiksiz doldur, haftada 1 fotoğraf, her yoruma yanıt.
2. **Search Console** — sitemap gönder, "İnegöl mobilya" sorgu raporunu izle.
3. **Yorum motoru** — memnun müşteriden Google yorumu iste (QR kart bas,
   teslimatta ver). Yorum sayısı yerel sıralamanın 1 numaralı sinyali.
4. Blog'a ayda 1-2 yazı (admin panelden) — "İnegöl mobilya" geçen yerel
   konular: "İnegöl'den Avrupa'ya mobilya nasıl gönderilir" gibi.

## 4) 1-2 YIL ÜCRETSİZ ALTYAPI PROJEKSİYONU
| Servis | Limit | Tahmini kullanım | Risk |
|---|---|---|---|
| **R2 depolama** | 10 GB ücretsiz | 1537 görsel ≈ 2-3 GB; 1000 ürün × 20 foto hedefinde ≈ 5-6 GB | 🟢 Yok. Aşılsa bile GB başı ~0,5 TL/ay |
| **R2 çıkış (egress)** | SINIRSIZ ücretsiz | — | 🟢 Yok |
| **Supabase DB** | 500 MB | Görseller dışarıda; metin verisi yıllarca < 100 MB | 🟢 Yok |
| **Supabase pause** | 7 gün inaktivite | Keepalive cron + canlı trafik | 🟢 Çözülü |
| **Vercel bandwidth** | 100 GB/ay | Görseller R2'den → Vercel sadece HTML/JS taşıyor | 🟢 Rahat |
| **Vercel görsel optimizasyonu** | sınırlı | v43'te kapatıldı | 🟢 Bitti |
| **r2.dev hız sınırı** | var | orta trafikte hissedilmez | 🟡 Trafik büyüyünce custom domain |
| **Vercel Hobby "ticari kullanım"** | kural gereği kişisel | Möbel İnegöl ticari site | 🟡 Aşağıda |

**Dürüst uyarı (🟡):** Vercel Hobby planı resmi kurallarda "ticari olmayan
kişisel kullanım" içindir. Pratikte küçük ticari siteler yıllarca sorunsuz
çalışıyor ve Vercel önce e-posta ile uyarır (aniden kapatmaz). 1-2 yıl
içinde trafik ciddi büyürse iki yol var: Vercel Pro (~$20/ay) **veya**
tamamen ücretsiz kalmak için Cloudflare Pages'e taşınma (ticari kullanım
serbest). İkisi de bugünden aksiyon gerektirmiyor — sadece bilinçli ol.

**Özet:** Bu altyapı mevcut ölçekte 1-2 yıl **sıfır TL** ile sürdürülebilir.
İzlenecek iki eşik: trafik patlaması (→ custom domain) ve Vercel'den
gelebilecek kullanım e-postası (→ Pro ya da Pages kararı).

by ubivo · v43
