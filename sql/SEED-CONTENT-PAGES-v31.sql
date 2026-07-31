-- ════════════════════════════════════════════════════════════
-- Möbel İnegöl — Müşteri Hizmetleri İÇERİK SEED'i (v31)
-- ════════════════════════════════════════════════════════════
-- content_pages tablosunu DOLU/kapsamlı içerikle günceller.
-- Mevcut sayfaları GÜNCELLER, eksik olanı (sss) OLUŞTURUR.
-- İdempotent — tekrar çalıştırılabilir (ON CONFLICT DO UPDATE).
-- TR öncelikli (admin panelden EN/DE eklenebilir).
--
-- ⚠️ HUKUKİ NOT: Garanti/İade, Gizlilik, KVKK, Mesafeli Satış
-- sayfaları HUKUKİ belgelerdir. İçerik işletme adı + açık adres (Wobilimo AVM)
-- ile dolduruldu. Resmi vergi dairesi/no ve MERSİS no eklemek isterseniz ilgili
-- bölümlere (Veri Sorumlusu / Satıcı) ekleyebilir ve bir hukukçuya onaylatabilirsiniz.
-- ════════════════════════════════════════════════════════════

INSERT INTO public.content_pages (slug, title, content, is_published) VALUES

-- ─────────────────────────────────────────────────────────────
('hakkimizda', 'Hakkımızda', $md$
## Köklü Geleneğin Modern Yüzü

Möbel İnegöl, **Türkiye'nin mobilya başkenti İnegöl'ün** köklü ustalık kültüründen doğdu. Yıllardır süregelen aile birikimimizi modern tasarım anlayışıyla harmanlayarak, evinizin her köşesine değer katacak mobilyalar üretiyoruz.


## Neye İnanıyoruz

Her üretim adımında üç temel ilkeye bağlı kalıyoruz:

- **Kalite** — Malzemeden işçiliğe, kaliteden asla ödün vermeyiz. Ürünlerimiz uzun yıllar kullanılacak şekilde, sağlam ve özenli üretilir.
- **Estetik** — Modern, klasik ve avangard tarzları ustalıkla buluşturan, evinize karakter katan tasarımlar.
- **Güven** — Sipariş öncesinden teslimata, teslimattan sonrasına kadar şeffaf ve dürüst bir iletişim.

## Nasıl Çalışıyoruz

Mağazamızdaki tüm modelleri web sitemizden inceleyebilir, beğendiğiniz ürünleri sepetinize ekleyip **WhatsApp üzerinden** bizimle hızlıca iletişime geçebilirsiniz. Size en uygun fiyat, teslimat ve kurulum seçeneklerini birlikte planlıyoruz.

## Nereye Ulaşıyoruz

Türkiye'nin **tüm illerine** teslimat ve **kurulum imkanı**, Avrupa'daki gurbetçi ailelerimize ise **tüm ülkelere kapı teslim** hizmeti sunuyoruz.

---

📍 Wobilimo AVM, 2. Kat No.122, İnegöl / Bursa
📞 +90 536 040 01 08
📧 mobelinegol16@gmail.com
$md$, true),

-- ─────────────────────────────────────────────────────────────
('teslimat-kurulum', 'Teslimat ve Kurulum', $md$
## Teslimat ve Kurulum

Möbel İnegöl olarak ürünlerinizi özenle paketleyip güvenle adresinize ulaştırıyoruz.

### Türkiye İçi
- **Tüm illere teslimat** yapıyoruz.
- Talebinize göre **kurulum imkanı** sunuyoruz; ürününüz uzman ekiplerce kurulabilir.

### Avrupa
- **Tüm Avrupa ülkelerine** gönderim yapıyoruz.
- Avrupa teslimatları **kapı teslim** olarak gerçekleştirilir.

### Süreç Nasıl İşler?
1. Beğendiğiniz ürünleri sepete ekleyip WhatsApp'tan bize iletirsiniz.
2. Adresinize göre teslimat ve kurulum seçeneklerini, tahmini süreyi ve koşulları birlikte netleştiririz.
3. Üretim/hazırlık tamamlandığında ürününüz yola çıkar ve size bilgi verilir.

> Teslimat süresi; ürünün özel üretim olup olmamasına, adrese ve yoğunluğa göre değişebilir. Siparişiniz için tahmini süre WhatsApp üzerinden net olarak paylaşılır.

### İletişim
Teslimat ve kurulumla ilgili tüm sorularınız için:
📞 +90 536 040 01 08 · 📧 mobelinegol16@gmail.com
$md$, true),

-- ─────────────────────────────────────────────────────────────
('sss', 'Sık Sorulan Sorular', $md$
## Sık Sorulan Sorular

### Nasıl sipariş verebilirim?
Beğendiğiniz ürünleri sepetinize ekleyip **WhatsApp'tan onayla** adımıyla bize ulaştırırsınız. Ekibimiz fiyat, ödeme, teslimat ve kurulum detaylarını sizinle birlikte netleştirir. Sitemizde doğrudan online ödeme yoktur; süreç WhatsApp üzerinden, kişiye özel ilerler.

### Ürün fiyatlarını neden her üründe göremiyorum?
Bazı ürünlerde "Fiyat için sorun" ibaresi yer alır. Bu ürünler için güncel ve size özel fiyatı WhatsApp üzerinden hızlıca paylaşıyoruz.

### Ödeme nasıl yapılıyor? Kapora alıyor musunuz?
Özel üretim ürünlerde sipariş, alınan **kapora** ile başlatılır. Ödeme detayları siparişiniz onaylanırken sizinle netleştirilir.

### Teslimat ne kadar sürer?
Süre; ürünün stoktan mı yoksa özel üretim mi olduğuna, teslimat adresine ve yoğunluğa göre değişir. Siparişinizde tahmini süre size net olarak bildirilir.

### Türkiye dışına gönderim yapıyor musunuz?
Evet. **Avrupa'nın tüm ülkelerine kapı teslim** gönderim yapıyoruz. Türkiye içinde ise teslimata ek olarak **kurulum imkanı** sunuyoruz.

### Kurulum hizmeti var mı?
Türkiye içinde, talebe göre kurulum imkanı sağlıyoruz. Detayları sipariş sırasında planlıyoruz.

### Ürünlerde garanti var mı?
Evet, ürünlerimiz **2 yıl garantilidir**. Bariz kullanıcı hatasından kaynaklanan durumlar dışındaki üretim ve malzeme kaynaklı sorunlar garanti kapsamındadır.

### Sipariş iptali ve iade mümkün mü?
Üretime girmiş ve özel üretim ürünlerde sipariş **iptal edilemez, iade veya değişim yapılamaz** ve verilen **kapora iade edilmez**. Detaylar için "Garanti ve İade" sayfamızı inceleyin.

### Üründe bir sorun çıkarsa ne oluyor?
Sorun **firma kaynaklı bir üretim hatasıysa ücretsiz değişim** yapılabilir. Kullanıcı hatasından kaynaklanan durumlarda ise onarım/değişim ek ücrete tabidir.

### Size nasıl ulaşırım?
📞 +90 536 040 01 08 · 📧 mobelinegol16@gmail.com
$md$, true),

-- ─────────────────────────────────────────────────────────────
('garanti-iade', 'Garanti ve İade', $md$
## Garanti ve İade Koşulları

### Garanti
- Ürünlerimiz **2 (iki) yıl** garanti kapsamındadır.
- Garanti; **üretim ve malzeme kaynaklı** kusurları kapsar.
- **Bariz kullanıcı hatası** (yanlış kullanım, darbe, hatalı taşıma/kurulum, bakımsızlık, sıvı teması vb.) sonucu oluşan hasarlar garanti kapsamı **dışındadır**.

### Üretim Hatası Durumunda
Üründe **firma kaynaklı bir üretim hatası** tespit edilirse, ürün **ücretsiz olarak değiştirilebilir** veya onarılır. Lütfen sorunu fark ettiğinizde fotoğraflarıyla birlikte bizimle iletişime geçin.

### Kullanıcı Hatası Durumunda
Kullanıcı hatasından kaynaklanan arıza/hasarlarda onarım veya değişim **ek ücrete** tabidir. Maliyet, işlem öncesi size bildirilir.

### Sipariş İptali, Cayma ve İade
- **Üretime girmiş üründen cayılamaz.**
- **Özel üretim ürünler iptal edilemez, iade edilemez, değiştirilemez.**
- Sipariş için alınan **kapora iade edilmez.**

> **Yasal dayanak:** Mesafeli Sözleşmeler Yönetmeliği uyarınca, tüketicinin istekleri veya kişisel ihtiyaçları doğrultusunda hazırlanan (kişiye özel / özel üretim) mallarda cayma hakkı bulunmamaktadır. Ürünlerimiz büyük ölçüde siparişe özel üretildiğinden bu kapsamdadır.

### İletişim
Garanti ve iade talepleriniz için:
📞 +90 536 040 01 08 · 📧 mobelinegol16@gmail.com

---
**Möbel İnegöl** — Wobilimo AVM, 2. Kat No.122, İnegöl / Bursa
$md$, true),

-- ─────────────────────────────────────────────────────────────
('gizlilik', 'Gizlilik ve Çerez Politikası', $md$
## Gizlilik ve Çerez Politikası

Möbel İnegöl olarak gizliliğinize önem veriyoruz. Bu politika, sitemizi kullanırken hangi verilerin işlendiğini ve nasıl korunduğunu açıklar.

### Hangi Verileri İşliyoruz?
- **Sipariş/iletişim verileri:** Sepet onayı sırasında ilettiğiniz ad-soyad, telefon ve adres bilgileri.
- **Kullanım verileri:** Sitenin daha iyi çalışması için anonim/özetlenmiş ziyaret istatistikleri (sayfa görüntüleme, tıklama gibi).

### Verileri Hangi Amaçla İşliyoruz?
- Talebinizi değerlendirmek, sizinle WhatsApp üzerinden iletişime geçmek ve siparişinizi yönetmek,
- Teslimat ve kurulumu planlamak,
- Site deneyimini ve hizmet kalitemizi iyileştirmek.

### Çerezler
Sitemizde, temel işlevsellik ve ziyaret istatistikleri için sınırlı çerez/benzeri teknolojiler kullanılabilir. Tarayıcı ayarlarınızdan çerezleri yönetebilir veya engelleyebilirsiniz; bu durumda bazı işlevler etkilenebilir.

### Verilerin Aktarımı ve Saklanması
Verileriniz yalnızca hizmetin gerektirdiği ölçüde, gizlilik yükümlülüğü altındaki altyapı sağlayıcılarımız (ör. barındırma ve mesajlaşma hizmetleri) ile işlenir; pazarlama amacıyla üçüncü kişilere satılmaz.

### Haklarınız
6698 sayılı KVKK kapsamındaki haklarınız için "KVKK Aydınlatma Metni" sayfamızı inceleyebilir, talebinizi aşağıdaki kanallardan iletebilirsiniz.

📞 +90 536 040 01 08 · 📧 mobelinegol16@gmail.com

---
**Veri Sorumlusu:** Möbel İnegöl — Wobilimo AVM, 2. Kat No.122, İnegöl / Bursa
$md$, true),

-- ─────────────────────────────────────────────────────────────
('kvkk', 'KVKK Aydınlatma Metni', $md$
## KVKK Aydınlatma Metni

İşbu metin, 6698 sayılı **Kişisel Verilerin Korunması Kanunu ("KVKK")** kapsamında, veri sorumlusu sıfatıyla Möbel İnegöl tarafından hazırlanmıştır.

### Veri Sorumlusu
**Möbel İnegöl**
Adres: Wobilimo AVM, 2. Kat No.122, İnegöl / Bursa
İletişim: +90 536 040 01 08 · mobelinegol16@gmail.com

### İşlenen Kişisel Veriler
Ad-soyad, telefon, teslimat adresi ve sipariş/talep içeriği; ayrıca siteyi kullanımınıza dair özet istatistiksel veriler.

### İşleme Amaçları
- Talep ve siparişlerinizin alınması, değerlendirilmesi ve yürütülmesi,
- Teslimat, kurulum ve satış sonrası süreçlerin yönetimi,
- Sizinle iletişim kurulması ve hizmet kalitesinin iyileştirilmesi.

### Hukuki Sebep
Kişisel verileriniz; bir sözleşmenin kurulması/ifası için gerekli olması, meşru menfaat ve açık rızanız gibi KVKK m.5'te düzenlenen hukuki sebeplere dayanılarak işlenir.

### Aktarım
Verileriniz, yalnızca hizmetin gerektirdiği ölçüde ve gizlilik yükümlülüğü altında altyapı/hizmet sağlayıcılarımızla paylaşılabilir; yurt dışına aktarım söz konusu olduğunda KVKK hükümlerine uyulur.

### Saklama Süresi
Kişisel verileriniz, işleme amacının gerektirdiği ve ilgili mevzuatın öngördüğü süre boyunca saklanır; sürenin sonunda silinir, yok edilir veya anonim hale getirilir.

### İlgili Kişi Olarak Haklarınız (KVKK m.11)
Kişisel verilerinizin işlenip işlenmediğini öğrenme, bilgi talep etme, düzeltilmesini/silinmesini isteme ve kanunda sayılan diğer haklarınızı kullanmak için bizimle iletişime geçebilirsiniz.

📞 +90 536 040 01 08 · 📧 mobelinegol16@gmail.com

---
**Möbel İnegöl** — Wobilimo AVM, 2. Kat No.122, İnegöl / Bursa
$md$, true),

-- ─────────────────────────────────────────────────────────────
('satis-sozlesmesi', 'Mesafeli Satış Sözleşmesi', $md$
## Mesafeli Satış Sözleşmesi

### 1. Taraflar
**Satıcı:** Möbel İnegöl
Adres: Wobilimo AVM, 2. Kat No.122, İnegöl / Bursa
İletişim: +90 536 040 01 08 · mobelinegol16@gmail.com

**Alıcı:** Sipariş/talep formunda ve WhatsApp iletişiminde bilgilerini paylaşan tüketici.

### 2. Konu
İşbu sözleşme, Alıcı'nın Möbel İnegöl'dan sipariş ettiği ürün(ler)in satışı ve teslimine ilişkin tarafların hak ve yükümlülüklerini düzenler.

### 3. Ürün, Bedel ve Ödeme
Ürün özellikleri ve bedeli, sipariş sırasında WhatsApp üzerinden Alıcı'ya bildirilir ve teyit edilir. Özel üretim ürünlerde sipariş, alınan **kapora** ile başlatılır.

### 4. Teslimat
Teslimat, Türkiye genelinde (kurulum imkanıyla) ve Avrupa ülkelerine kapı teslim olarak yapılır. Tahmini teslim süresi siparişe göre Alıcı'ya bildirilir.

### 5. Cayma Hakkı ve İstisnalar
Mesafeli Sözleşmeler Yönetmeliği uyarınca, **tüketicinin istekleri veya kişisel ihtiyaçları doğrultusunda hazırlanan (özel üretim/kişiye özel) mallarda cayma hakkı bulunmamaktadır.** Buna bağlı olarak:
- Üretime girmiş üründen cayılamaz,
- Özel üretim ürünler iptal/iade/değişime konu edilemez,
- Verilen kapora iade edilmez.

### 6. Garanti ve Ayıplı Ürün
Ürünler 2 yıl garantilidir. Firma kaynaklı üretim hatalarında ücretsiz değişim/onarım yapılır; bariz kullanıcı hatası kaynaklı durumlar kapsam dışıdır ve ek ücrete tabidir. (Bkz. "Garanti ve İade")

### 7. Uyuşmazlık
Taraflar, işbu sözleşmeden doğabilecek uyuşmazlıklarda ilgili mevzuat ve yetkili Tüketici Hakem Heyetleri ile Tüketici Mahkemelerinin yetkili olduğunu kabul eder.

---
**Satıcı:** Möbel İnegöl — Wobilimo AVM, 2. Kat No.122, İnegöl / Bursa
$md$, true)

ON CONFLICT (slug) DO UPDATE
  SET title = EXCLUDED.title,
      content = EXCLUDED.content,
      is_published = true,
      updated_at = now();
