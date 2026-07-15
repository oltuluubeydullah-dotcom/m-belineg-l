# Möbel İnegöl — Teslim Öncesi Kontrol Listesi

> Bu liste, Enes'e siteyi teslim etmeden önce **Ubeyt'in** kontrol etmesi
> gereken maddeleri içerir. Hepsini ✅ yapana kadar teslim etme.

---

## 🔐 Hesap ve Erişim

- [ ] Supabase hesabı `info@mobelinegol.com` ile açıldı
- [ ] Supabase'de admin kullanıcı (info@mobelinegol.com) oluşturuldu, giriş test edildi
- [ ] **v11.6: Supabase Auth → Sign Ups → DISABLED** (kritik güvenlik)
- [ ] **v11.6: `ADMIN_EMAILS` env Vercel'de set edildi**
- [ ] **v11.6: `sql/HOTFIX-ADMIN-EMAIL-v11.6.sql` çalıştırıldı**
- [ ] **v11.6: Allowlist dışı email ile giriş test edildi → "Yetkili değil" mesajı**
- [ ] Vercel hesabı ile site deploy edildi
- [ ] Vercel'de tüm env değişkenleri girildi (9+ tane, ADMIN_EMAILS dahil)
- [ ] GitHub repo private olarak ayarlandı (kod sahipliği)

## 🛢️ Veritabanı

- [ ] `sql/01-schema.sql` çalıştırıldı, 4 tablo oluştu
- [ ] `sql/02-blog.sql` çalıştırıldı, blog_posts tablosu oluştu
- [ ] 9 kategori otomatik seed edildi (kontrol: Table Editor → categories → 9 satır)
- [ ] Settings tablosunda 1 satır var (gerçek bilgilerle)
- [ ] Storage'da `kani-medya` bucket public olarak oluştu
- [ ] RLS aktif (Authentication → Policies → her tabloda görmeli)

## 🌐 Domain ve DNS

- [ ] mobelinegol.com domain'i ICANN onayı verildi (suspended değil)
- [ ] Vercel'de domain bağlandı (mobelinegol.com + www.mobelinegol.com)
- [ ] DNS yayıldı (https://mobelinegol.com çalışıyor)
- [ ] SSL aktif (yeşil kilit görünüyor)
- [ ] HTTP otomatik HTTPS'e yönlendiriliyor

## 📝 İçerik

- [ ] En az **5 ürün** eklendi (her ürün fotoğraflı, fiyatlı, kategoriye atanmış)
- [ ] En az **3 ürün** "öne çıkan" işaretli (anasayfada görünmesi için)
- [ ] **Her kategoriye** en az 1 ürün eklendi (boş kategori yok)
- [ ] **Her kategorinin kapak görseli** yüklendi (anasayfada güzel görünmesi için)
- [ ] En az **1 blog yazısı** yayında (boş blog izlenimi olmasın)
- [ ] Footer'da gerçek adres, telefon, e-posta var (admin → ayarlar)
- [ ] Duyuru şeridi metni doğru ("Tüm Türkiye ve Avrupa'ya...")

## 📞 İletişim Bilgileri

- [ ] WhatsApp numarası doğru: +90 534 306 65 92 (905360400108)
- [ ] E-posta doğru: info@mobelinegol.com
- [ ] Instagram link çalışıyor: instagram.com/mobelinegol
- [ ] Mağaza adresi doğru ve Google Maps'te bulunuyor

## 🧪 Public Test (gerçek kullanıcı gibi)

Tarayıcıyı incognito açıp test et:

- [ ] Anasayfa açılıyor, kategoriler ve öne çıkan ürünler görünüyor
- [ ] Bir kategoriye giriyorum, ürünleri görüyorum
- [ ] Sıralama dropdown çalışıyor (fiyat artan/azalan)
- [ ] Bir ürüne tıklıyorum, detay açılıyor, galeri çalışıyor
- [ ] Sepete ekliyorum, header'da badge artıyor
- [ ] Sepete gidiyorum, kalem görünüyor, miktarı değiştirebiliyorum
- [ ] "Siparişi Onayla" → form açılıyor
- [ ] Formu doldurup gönderiyorum → WhatsApp açılıyor, mesaj hazır
- [ ] Teşekkür sayfası geliyor
- [ ] Admin'de talebim görünüyor

## 🔐 Admin Test

- [ ] /giris → e-posta + şifre ile giriş yapabiliyorum
- [ ] Yanlış şifre denersem "E-posta veya şifre hatalı" mesajı geliyor
- [ ] Giriş yaptıktan sonra /admin'e yönlendiriliyorum
- [ ] Çıkış yapabilyorum, sonra tekrar /admin denersem /giris'e yönlendiriliyorum
- [ ] Mobilde admin paneli çalışıyor (sidebar açılıyor)

## 📱 Mobile Test

iPhone ve Android'de aç:
- [ ] Anasayfa düzgün görünüyor
- [ ] Hamburger menü açılıyor
- [ ] Kategori sayfası grid düzgün
- [ ] Ürün detay galerisi çalışıyor (swipe değil ama oklarla)
- [ ] Sepet sayfası mobile responsive
- [ ] Form input'ları mobile keyboard'ı düzgün açıyor (tel için telefon klavyesi)
- [ ] WhatsApp linki tıklanınca WhatsApp uygulaması açılıyor

## 🎨 Görsel Kontrol

- [ ] Logo doğru görünüyor (Kani altın + Mobilya altın)
- [ ] Renkler doğru (altın #C8A45C, koyu navy #0F1B2D)
- [ ] Fontlar yükleniyor (Fraunces + Manrope)
- [ ] Tüm fotoğraflar yükleniyor (CDN/Supabase Storage)
- [ ] Hiçbir yerde "lorem ipsum" veya placeholder metin kalmadı

## 📊 SEO Kontrol

- [ ] `/sitemap.xml` çalışıyor, tüm sayfalar listeli
- [ ] `/robots.txt` çalışıyor
- [ ] Tarayıcı dev tools → `<head>` → her sayfada title + meta description var
- [ ] Open Graph meta'lar mevcut (WhatsApp'a link yapıştırınca güzel önizleme)
- [ ] LocalBusiness JSON-LD layout'ta (Google için)

## 🚀 Performance

- [ ] Lighthouse skorları (Chrome → Developer Tools → Lighthouse):
  - Performance: > 85
  - Accessibility: > 90
  - Best Practices: > 90
  - SEO: > 95
- [ ] Anasayfa ilk yükleme < 3 sn (4G üzerinde test et)

## 🔒 Güvenlik

- [ ] `/admin/*` adresine giriş yapmadan erişim engelleniyor
- [ ] **v11.6: Allowlist DIŞI email ile giriş yapılırsa /admin'e GİREMİYOR**
- [ ] **v11.6: Sepetteki ürünün fiyatını DevTools'tan 0 yapıp checkout → DB'deki `inquiries.total_estimate` GERÇEK FİYAT (server recompute)**
- [ ] **v11.6: Network tab → Content-Security-Policy header görünüyor**
- [ ] HTTPS aktif, sertifika geçerli
- [ ] `.env.local` ve `KURULUM-CREDENTIALS.md` GitHub'a yüklenmemiş (gitignore'da)
- [ ] Supabase Service Role key kodda yok (sadece anon key)
- [ ] X-Frame-Options ve CSP header'ları aktif

## 📚 Dokümantasyon Teslimi

Enes'e şunları teslim et:
- [ ] `KULLANIM-KILAVUZU.md` (paylaş veya PDF olarak gönder)
- [ ] Admin giriş bilgileri (e-posta + şifre)
- [ ] Site URL'i (mobelinegol.com)
- [ ] WhatsApp grup oluştur veya direkt iletişim → "Sorun olursa yazın"

## 🎯 Teslim Görüşmesi

Enes'e şunları göster (15-20 dakika yeterli):
1. Admin paneline giriş
2. Ürün ekleme (canlı yap)
3. Talep gelirse nasıl göreceği
4. Blog yazısı ekleme
5. Ayarlardan WhatsApp/adres değiştirme

> 💡 "Sorun çıkarsa hemen ara" diyerek müşteriye güven ver.

---

## ✅ Hepsi tamam mı?

Liste 100% tamamlandığında siteyi teslim et. Sonrasında küçük sorunlar/iyileştirmeler için
support açık tut (haftada 1-2 saat hızlı dönüş garantili gibi).

---

**by ubivo — 2026**
