# Möbel İnegöl — Yönetim Paneli Kullanım Kılavuzu

> Bu rehber Enes'in (Möbel İnegöl sahibi) admin paneli kullanırken
> başvurabileceği basit, adım adım Türkçe kılavuzdur.

---

## Giriş Yapma

1. Tarayıcınızdan `mobelinegol.com/giris` adresine gidin
2. E-posta: `info@mobelinegol.com`
3. Şifre: yöneticinizin verdiği şifre
4. **"Giriş Yap"** tuşuna basın

> 💡 **İpucu:** Şifrenizi tarayıcınıza kaydedin, her seferinde girmenize gerek kalmaz.

---

## Ana Sayfa (Panel)

Giriş yaptığınızda karşınıza çıkar. 4 ana bilgi gösterir:
- **Toplam Ürün** — sitenizdeki ürün sayısı
- **Kategoriler** — toplam kategori sayısı (9 sabit)
- **Bu Ay Talep** — son 30 günde gelen müşteri talepleri
- **Site** — public sayfayı yeni sekmede açar

Sol tarafta menü göreceksiniz: **Panel, Ürünler, Kategoriler, Blog, Talepler, Ayarlar**.

---

## Ürün Eklemek

1. Sol menüden **"Ürünler"** tıklayın
2. Sağ üstte **"Yeni Ürün"** mavi tuşa basın
3. Açılan formu doldurun:

   **Zorunlu alanlar:**
   - **Ürün Adı:** örn. "Modern Köşe Koltuk Takımı"
   - **Slug (URL):** otomatik dolar, dokunmayın
   - **Kategori:** açılır menüden seçin (örn. Köşe Koltuk)

   **Önerilen alanlar:**
   - **Açıklama:** Ürünün özelliklerini yazın (kumaş, ölçü, renk seçenekleri vs.)
   - **Fiyat:** TL olarak rakam yazın (örn. `25000`). Boş bırakırsanız "Fiyat için sorun" görünür.
   - **İndirimde:** Kutuyu işaretlerseniz indirimli fiyat alanı açılır

   **Durum:**
   - ✅ **Yayında** — sitede görünür (varsayılan)
   - ✅ **Öne Çıkan** — anasayfada "Öne Çıkanlar" bölümünde gösterilir

4. **Fotoğraflar:** "Görsel Ekle" tuşuna basın, telefonunuzdan/bilgisayardan resim seçin
   - Birden fazla resim ekleyebilirsiniz (max 10)
   - **İlk resim KAPAK olur** (altın çerçeve)
   - Fotoğrafı taşımak için üzerine gelin, sağ/sol oklara basın
   - Yanlış fotoğrafı silmek için X butonuna basın

5. **"Kaydet"** tuşuna basın → ürün eklenir

> 💡 **İpucu:** Profesyonel fotoğraflar çok önemli. Kötü fotoğraf = düşük satış.
> Sade arka planlı, iyi aydınlatılmış fotoğraflar tercih edin.

---

## Ürün Düzenlemek

1. Ürünler sayfasında istediğiniz ürünün yanındaki **kalem (✏️) ikonuna** tıklayın
2. Bilgileri değiştirin
3. **"Güncelle"** tuşu

### Hızlı Toggle'lar (tek tıkla)

Her ürünün yanında 2 ikon var:
- 👁️ **Göz ikonu** — aktif/pasif (siteden geçici olarak kaldırmak için)
- ⭐ **Yıldız ikonu** — öne çıkar (anasayfada göster)

Tek tıkla durumu değiştirebilirsiniz.

---

## Ürün Silmek

1. **🗑️ Çöp kutusu** ikonuna basın
2. Onay sorulur → "Evet, sil"

> ⚠️ Silme işlemi geri alınamaz! Geçici olarak gizlemek için aktif/pasif toggle'ını kullanın.

---

## Kategori Yönetimi

`Kategoriler` sayfasında 9 kategori listelenir:
- **Düğün Paketleri, Koltuk Takımı, Köşe Koltuk, Yatak Odası, Yemek Odası, TV Ünitesi, Bebek & Genç Odası, Masa Sandalye Set, Sehpa & Aksesuar**

### Kategori için yapabilecekleriniz:

- **Düzenle (✏️):** Kapak görseli, açıklama değiştir
- **Yukarı/Aşağı oklar:** Anasayfadaki sıralamayı değiştir
- **Göz ikonu:** Aktif/pasif

### Kapak görseli neden önemli?
Anasayfada kategori kartlarında bu görsel görünür. Her kategoriye temsil eden güzel bir görsel koymanızı öneririz (örn. Yatak Odası → yatak takımının fotoğrafı).

---

## Blog Yazısı Yazmak

1. **"Blog"** menüsünden **"Yeni Yazı"** tıklayın
2. **Başlık** girin (örn. "Modern Yatak Odası Renk Seçimi")
3. **Slug** otomatik dolar
4. **Özet** — 1-2 cümle (Google'da meta description olarak görünür)
5. **İçerik** — Markdown formatında:
   - Paragrafları **boş satır** ile ayırın
   - `## Başlık` ile alt başlık ekleyin
   - `### Başlık` ile küçük başlık ekleyin

   **Örnek:**
   ```
   Yatak odanız, gününüzü kapattığınız ve hayata yeniden başladığınız yer...

   ## Renk Seçiminin Önemi

   Yatak odasında renk seçimi sadece estetik değil, uyku kalitenizi de etkiler.

   ## Sakin Renkler Önerilir
   ```

6. **Kapak görseli** yükleyin
7. **"Yayında"** kutusunu işaretleyin (yoksa taslak kalır)
8. **"Kaydet"**

### Yazıyı taslak yapmak / yayınlamak

Liste sayfasında her yazının yanındaki **göz ikonuna** tıklayarak yayında ↔ taslak yapabilirsiniz.

---

## Müşteri Talepleri

Müşteriler sitenizden sipariş formu doldurduğunda burada görünür.

### Her talepte göreceğiniz:

- Tarih ve saat
- Ad soyad
- Telefon (WhatsApp)
- Adres
- Sepetteki ürünler ve adetleri
- Tahmini toplam
- Müşterinin notu (varsa)

### Müşteriye dönüş yapma

İki yol var:
1. **WhatsApp tuşuna basın** — yeni sekmede WhatsApp açılır
2. **Telefon tuşuna basın** — telefonunuzdan arar

Talep detayını görmek için satıra tıklayın → tüm bilgiler modal'da açılır.

### Arama

Üstte arama kutusu var. Ad, telefon veya adresle arama yapabilirsiniz.

---

## Site Ayarları

**"Ayarlar"** menüsünden site genel ayarlarını değiştirirsiniz:

### İşletme bilgileri
- İşletme adı, slogan
- Adres (footer'da görünür)
- Sabit telefon, e-posta
- WhatsApp numarası (formatta `905360400108`)

### Sosyal medya
- Instagram URL
- Facebook URL
- YouTube URL

### Üst duyuru şeridi
Sitenin en üstündeki koyu çubuktur. Kontrol edebilirsiniz:
- **Tam metin:** "Tüm Türkiye ve Avrupa'ya garantili teslimat"
- **Vurgu kısmı:** Turuncu renkli olacak kısım, örn. "GARANTİLİ TESLİMAT"
- **Aç/kapat:** Şeridi tamamen gizlemek için

Değişiklikleriniz **anında siteye yansır** (yenileme yeterli).

---

## Çıkış

Sol alt köşedeki **"Çıkış Yap"** tuşuna basın.

---

## Sık Sorulan Sorular

### "Ürünü ekledim ama sitede görünmüyor"
Kontrol edin:
- ✅ Yayında işaretli mi?
- ✅ Doğru kategori seçildi mi?
- ✅ Sayfayı yenileyin (Ctrl+R / Cmd+R)

### "Fotoğraf yüklemiyor"
- Dosya 10 MB'tan büyükse yüklenmez
- İnternet bağlantısını kontrol edin
- JPG, PNG, WebP, AVIF formatları kabul edilir

### "Müşteri talebim gelmedi"
- Müşteri formu eksik doldurduysa talep DB'ye yazılamamış olabilir
- Ancak WhatsApp mesajı yine de açılır — WhatsApp'ınızı kontrol edin

### "Şifremi unuttum"
Yöneticinizle iletişime geçin — Supabase Dashboard'dan sıfırlanabilir.

### "Bir sayfayı silebilir miyim?"
Hayır, statik sayfalar (Hakkımızda, KVKK vs.) kod tarafında. Sadece içerik değişiklikleri için yöneticinize yazın.

---

## Mobile (Telefonda)

Tüm bu işlemleri telefonunuzdan da yapabilirsiniz:
- Sol üstte **menü ikonuna** basın → sidebar açılır
- Form ve listeler mobile uyumlu

> 💡 Telefonda fotoğraf yüklerken doğrudan galeri/kameradan seçebilirsiniz.

---

## Acil Durumda

**Site çalışmıyor / hata veriyor:** Yöneticinizi (geliştiriciyi) hemen arayın.

**Müşteri şikayeti:** Önce WhatsApp'tan iletişime geçin, sakin yanıt verin. Çözüm gerekiyorsa yöneticinizle paylaşın.

---

**Site: mobelinegol.com**
**by ubivo — 2026**
