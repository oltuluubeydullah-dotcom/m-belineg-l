# Möbel İnegöl — v36 (ACİL HOTFIX)

v35 deploy sonrası canlıda çıkan 2 kritik sorunu düzeltir. **Ek SQL YOK — direkt push.**

## 🔴 Düzeltme 1: Ürünler boş / görseller görünmüyor
**Sebep:** v35'te ürün sorgusunu performans için `select('*')`'tan açık kolon
listesine çevirmiştim. Açık liste, canlı veritabanında bulunmayan bir kolona
denk gelince Supabase sorguyu reddetti → ürünler komple boş döndü → görseller de
gitti (kategori kapakları da ürün görseli olduğu için onlar da kayboldu).
Build dummy env ile geçtiği için sorun ancak canlıda ortaya çıktı.

**Çözüm:** `URUN_LISTE_SELECT` sabiti güvenli `*`'a döndürüldü. `*` yalnızca var
olan kolonları çeker, eksik kolon hatası vermez. Tek merkezi sabit olduğu için
anasayfa + kategori + /urunler + queries.js hepsi aynı anda düzeldi.

> Not: Performans optimizasyonu (description/variants hariç tutma) şimdilik geri
> alındı. Site stabil olduktan sonra, canlı DB şeması doğrulanıp gerçekten var
> olan kolonlarla yeniden, güvenli şekilde uygulanabilir. Acelesi yok.

## 🟠 Düzeltme 2: Google yorumları şeridi kaymıyor
**Sebep:** Kayan şerit animasyonu `GoogleReviews` içinde inline `<style>` ile
tanımlıydı — App Router'da bu her zaman güvenilir render olmuyor. Ayrıca süre
`yorum sayısı × 5` idi; çok yorumda animasyon aşırı yavaşlayıp durağan görünüyordu.

**Çözüm:**
- Keyframes + `.mobel-marquee` kuralı `app/globals.css`'e taşındı (garantili render).
- Süre 25–60 sn arası sınırlandı → çok yorumda bile hareket görünür kalır.
- (Bu bölüm v34'te eklenmişti ama canlıda ilk kez yayınlandığı için sorun şimdi görüldü.)

## ✅ Doğrulama
- `npm run build` → Compiled successfully, 78/78 sayfa, hata yok

## DEPLOY
1. Ek SQL **yok**.
2. Direkt push → Vercel otomatik deploy.
3. Kontrol: ürünler + görseller geri geldi mi · yorumlar şeridi kayıyor mu.

by ubivo
