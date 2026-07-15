# Möbel İnegöl — v39

⚠️ **1 SQL gerekli:** Deploy ÖNCESİ Supabase'te `sql/17-mobel-indirimli-kategori.sql`
çalıştır (idempotent — tekrar güvenli). Çalıştırmadan deploy edilirse anasayfa
"discount_percent kolonu yok" hatası verir.

## 🆕 İndirimli Kategoriler bölümü (anasayfa)
- Konum: **Nakit/Taksit (TrustBadges) bölümünün hemen ÜSTÜ**
- Fotoğraftaki tasarım birebir: büyük görsel kart + kategori adı +
  "%X'E VARAN İNDİRİM" + "Koleksiyonu İncele" rozeti
- 4 kategori: **Koltuk Takımı (%30) / Yatak Odası (%25) / Yemek Odası (%20) /
  Köşe Koltuk (%30)** — varsayılan oranlar SQL'de; admin değiştirebilir
- Karta tıklayınca → ilgili kategori sayfası (`/kategori/koltuk-takimi` vb.)
- **Kapak görseli:** kategori kartlarındaki mantığın aynısı — admin bir ürün
  seçerse onun fotoğrafı, seçmezse otomatik (kategorinin ilk ürün görseli)
- **Admin paneli:** Kategoriler > [kategori] düzenle → "İndirimli Kategori
  Bölümü" kutusundan oran + kapak ürünü seçilir. Oran 0 = o kart gizlenir.
- Görseli/oranı olmayan kategori otomatik gizlenir (dayanıklı)

## 🔄 Google Yorumları yeniden yazıldı (PC + mobil)
Eski CSS marquee kaldırıldı; gerçek scroll + JS geldi:
- ✅ **PC'de otomatik kayıyor** (eskiden akmıyordu — asıl şikayet)
- ✅ **Sağ/sol ok butonları** → tıklayınca kaydırır
- ✅ **Elle/parmakla kaydırılabilir;** dokunurken otomatik durur, bırakınca
  devam eder → kullanıcı durdurup okuyabilir (mobil şikayeti çözüldü)
- ✅ Sona gelince başa sarar (kesintisiz döngü)
- `prefers-reduced-motion` açıksa otomatik kayma kapanır (erişilebilirlik)

## ⚡ Performans
- **Ürün görseli yükleme hızlandı:** masaüstü paralel kuyruk 3 → 5
  (mobil 2 kalır — bellek koruması). Toplu fotoğraf yüklemede belirgin hız.
- Yüklenen görsel **cache 1 saat → 1 yıl** → tarayıcı/CDN tekrar indirmez,
  sayfa görselleri anında gelir.
- Admin ürün listesi (v37'den): ilk 100 + Daha Fazla + sunucu araması — korundu.

## 🛡️ Güvenlik taraması (Agent 07)
- CMS içeriği (`markdownToHtml`) önce escape ediliyor → stored XSS kapalı ✅
- JSON-LD schema'lar `<` kaçışlı (script injection kapalı) ✅
- `.env` zip'te yok, `service_role` server-only, hardcoded secret yok ✅
- CSP / güvenlik header'ları korundu ✅
- **Not (v40 adayı):** `npm audit` Next.js 14.2.35'te 1 yüksek (DoS) açık
  gösteriyor; yama yalnızca major sürümde (15/16). Major atlama Tailwind/
  next-intl uyum testi gerektirdiğinden R2 geçişi sonrası kontrollü yapılacak.
  Mevcut risk: self-hosted image optimizer DoS — Vercel platformunda etkisi
  sınırlı, acil değil.

## ✅ Doğrulama
- ESLint: 0 uyarı · `npm run build`: Compiled successfully (78 sayfa)

## DEPLOY SIRASI
1. Supabase'te **`sql/17`** çalıştır (önce!)
2. Push → Vercel otomatik deploy
3. Kaynağı görüntüle → `mobel-version: v39`

## DEPLOY SONRASI TEST
- [ ] Anasayfa: Nakit/Taksit ÜSTÜNDE 4 indirim kartı çıkıyor mu
- [ ] Kart görselleri geldi mi (kategori ürün fotoğrafları)
- [ ] Karta tıklayınca kategori sayfasına gidiyor mu
- [ ] PC'de Google yorumları otomatik kayıyor mu
- [ ] Yorumlarda sağ/sol ok çalışıyor mu, fareyle tutunca duruyor mu
- [ ] Mobilde yorumlar parmakla kaydırılıyor mu (durdurup okuma)
- [ ] Admin > Kategoriler > düzenle → indirim oranı + kapak ürünü kaydoluyor mu
- [ ] Admin'den oran değişince anasayfa anında güncelleniyor mu
- [ ] Çoklu fotoğraf yükleme daha hızlı mı

## v40 ADAYI
- Cloudflare R2 hibrit görsel depolama (bu zip sonrası — sıradaki iş)
- Next.js major yükseltme + audit temizliği (R2 sonrası kontrollü)

by ubivo
