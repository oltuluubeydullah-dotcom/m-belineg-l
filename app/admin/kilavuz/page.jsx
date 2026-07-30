// ════════════════════════════════════════════════════════════
// Admin Kullanım Kılavuzu — Detaylı Türkçe rehber
// ════════════════════════════════════════════════════════════

export const dynamic = 'force-dynamic';

import {
  IconBook, IconPackage, IconCategory, IconCloudUpload,
  IconArticle, IconMessageCircle, IconPhoto, IconFileText,
  IconBrandWhatsapp, IconSettings, IconShieldCheck,
  IconAlertTriangle, IconCheck, IconInfoCircle, IconCurrencyLira,
  IconLanguage, IconSearch, IconBolt,
  IconStarFilled, IconTrendingUp,
} from '@tabler/icons-react';

export const metadata = {
  title: 'Kullanım Kılavuzu | Admin',
  robots: { index: false, follow: false },
};

export default function KilavuzSayfasi() {
  return (
    <>
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 rounded-2xl bg-brand-gold/15 text-brand-gold flex items-center justify-center">
            <IconBook size={24} />
          </div>
          <div>
            <h1 className="font-display text-3xl md:text-4xl font-semibold text-brand-dark">
              Kullanım Kılavuzu
            </h1>
            <p className="text-brand-ink/60">Adım adım: siteyi yönetmek için bilmeniz gereken her şey.</p>
          </div>
        </div>
      </div>

      {/* İçindekiler */}
      <nav className="bg-brand-cream rounded-2xl p-5 md:p-6 mb-8 border border-brand-gold/20">
        <h2 className="font-semibold text-sm uppercase tracking-wider text-brand-gold mb-3">İçindekiler</h2>
        <ul className="grid sm:grid-cols-2 gap-1.5 text-sm">
          <li><a href="#baslarken" className="text-brand-dark hover:text-brand-gold">1. Başlarken</a></li>
          <li><a href="#urunler" className="text-brand-dark hover:text-brand-gold">2. Ürün Yönetimi</a></li>
          <li><a href="#fiyat-yazma" className="text-brand-dark hover:text-brand-gold">3. ⭐ Fiyat Yazma Kuralları</a></li>
          <li><a href="#toplu-yukleme" className="text-brand-dark hover:text-brand-gold">4. Toplu Yükleme (ZIP)</a></li>
          <li><a href="#kategoriler" className="text-brand-dark hover:text-brand-gold">5. Kategoriler</a></li>
          <li><a href="#dil" className="text-brand-dark hover:text-brand-gold">6. Çoklu Dil İçerik</a></li>
          <li><a href="#sayfalar" className="text-brand-dark hover:text-brand-gold">7. Sayfa İçerikleri (Hakkımızda vs)</a></li>
          <li><a href="#hero" className="text-brand-dark hover:text-brand-gold">8. Hero Bannerlar</a></li>
          <li><a href="#whatsapp" className="text-brand-dark hover:text-brand-gold">9. WhatsApp Şablonları</a></li>
          <li><a href="#talepler" className="text-brand-dark hover:text-brand-gold">10. Müşteri Talepleri</a></li>
          <li><a href="#yorumlar" className="text-brand-dark hover:text-brand-gold">11. ⭐ Müşteri Yorumları</a></li>
          <li><a href="#analitik" className="text-brand-dark hover:text-brand-gold">12. 📊 Site Analitiği</a></li>
          <li><a href="#blog" className="text-brand-dark hover:text-brand-gold">13. Blog Yazıları</a></li>
          <li><a href="#ayarlar" className="text-brand-dark hover:text-brand-gold">14. Genel Ayarlar</a></li>
          <li><a href="#gorseller" className="text-brand-dark hover:text-brand-gold">15. Görsel Yükleme Kuralları</a></li>
          <li><a href="#seo" className="text-brand-dark hover:text-brand-gold">16. SEO İpuçları</a></li>
          <li><a href="#sorun" className="text-brand-dark hover:text-brand-gold">17. Sorun Giderme</a></li>
          <li><a href="#guvenlik" className="text-brand-dark hover:text-brand-gold">18. Güvenlik</a></li>
        </ul>
      </nav>

      <article className="prose max-w-none space-y-12">

        {/* ─── 1. BAŞLARKEN ─── */}
        <Section id="baslarken" icon={<IconBolt />} title="1. Başlarken">
          <Para>
            Hoş geldiniz! Bu panel sayesinde web sitenizdeki <strong>her şeyi</strong> tek başınıza yönetebilirsiniz —
            ürünleri, fiyatları, sayfa metinlerini, hero bannerlarını ve daha fazlasını. Kod bilmenize gerek yok.
          </Para>
          <Para>
            Panel hep <strong>mobelinegol.com/giris</strong> adresinden açılır. E-postanız ve şifrenizle girersiniz.
            Sol kenarda menü, sağda içerik. Mobilde menü üst sol köşedeki ☰ simgesinden açılır.
          </Para>
          <Box tip="ip-ucu">
            <strong>Tarayıcı:</strong> Chrome veya Safari kullanmanızı öneriyoruz. Internet Explorer çalışmaz.
          </Box>
          <Para><strong>Hızlı tur:</strong></Para>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li><strong>Panel</strong> — özet rakamlar (ürün sayısı, talep sayısı)</li>
            <li><strong>Ürünler</strong> — tek tek ürün ekle/sil/düzenle</li>
            <li><strong>Toplu Yükleme</strong> — yüzlerce ürünü tek ZIP ile yükle</li>
            <li><strong>Kategoriler</strong> — Koltuk Takımı, Yatak Odası gibi grupları yönet</li>
            <li><strong>Hero Bannerlar</strong> — anasayfa üstündeki büyük dönen pankartlar</li>
            <li><strong>Sayfa İçerikleri</strong> — Hakkımızda, KVKK gibi sayfaları düzenle</li>
            <li><strong>WhatsApp Şablonları</strong> — müşterinin tıkladığında açılan otomatik mesaj</li>
            <li><strong>Talepler</strong> — sepetten gelen sipariş talepleri</li>
            <li><strong>Ayarlar</strong> — telefon, adres, duyuru bandı</li>
          </ul>
        </Section>

        {/* ─── 2. ÜRÜNLER ─── */}
        <Section id="urunler" icon={<IconPackage />} title="2. Ürün Yönetimi">
          <Para>Yeni ürün eklemek için: <strong>Ürünler</strong> menüsü → <strong>Yeni Ürün</strong> butonu.</Para>
          <Para><strong>Doldurulması gereken alanlar:</strong></Para>
          <ul className="list-disc pl-5 space-y-1.5 text-sm">
            <li><strong>Ürün adı</strong> — Örn: "Modern Köşe Koltuk Takımı"</li>
            <li><strong>URL kısa adı (slug)</strong> — Otomatik oluşur, dokunmaya gerek yok</li>
            <li><strong>Kategori</strong> — Listeden seç (yoksa önce Kategoriler'den ekle)</li>
            <li><strong>Açıklama</strong> — Müşteriye gösterilecek metin (opsiyonel)</li>
            <li><strong>Fiyat</strong> — Aşağıdaki "Fiyat Yazma Kuralları" bölümüne bak ⭐</li>
            <li><strong>Görseller</strong> — En az 1 tane, en fazla 10. İlk yüklediğin "ana görsel"</li>
            <li><strong>Aktif</strong> — Açıkken sitede görünür, kapalıyken görünmez</li>
            <li><strong>Öne Çıkan</strong> — Anasayfada öncelikli gösterilir</li>
          </ul>
          <Box uyari="dikkat">
            <strong>Aktif</strong> kapatılan ürünler sadece sitede görünmez —<em> silinmiş değildir</em>.
            Tamamen silmek için sağdaki <strong>Sil</strong> butonunu kullanın. Silmek kalıcıdır.
          </Box>
        </Section>

        {/* ─── 3. FİYAT ───  */}
        <Section id="fiyat-yazma" icon={<IconCurrencyLira />} title="3. ⭐ Fiyat Yazma Kuralları">
          <Box tip="onemli">
            <strong>EN SIK SORULAN KONU.</strong> Doğru yazım: sadece rakam. ₺ sembolü otomatik eklenir.
          </Box>
          <div className="bg-white border border-brand-dark/10 rounded-xl p-5 my-4">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-brand-dark/5">
                  <th className="text-left py-2 px-3">Yazdığın</th>
                  <th className="text-left py-2 px-3">Görünen</th>
                  <th className="text-left py-2 px-3">Doğru mu?</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-brand-dark/5">
                  <td className="py-2 px-3 font-mono">50000</td>
                  <td className="py-2 px-3 font-mono">50.000 ₺</td>
                  <td className="py-2 px-3 text-green-600">✓ Doğru</td>
                </tr>
                <tr className="border-b border-brand-dark/5">
                  <td className="py-2 px-3 font-mono">125000</td>
                  <td className="py-2 px-3 font-mono">125.000 ₺</td>
                  <td className="py-2 px-3 text-green-600">✓ Doğru</td>
                </tr>
                <tr className="border-b border-brand-dark/5">
                  <td className="py-2 px-3 font-mono">7500</td>
                  <td className="py-2 px-3 font-mono">7.500 ₺</td>
                  <td className="py-2 px-3 text-green-600">✓ Doğru</td>
                </tr>
                <tr className="border-b border-brand-dark/5">
                  <td className="py-2 px-3 font-mono">50.000</td>
                  <td className="py-2 px-3 text-red-600">HATA</td>
                  <td className="py-2 px-3 text-red-600">✗ Nokta YAZMA</td>
                </tr>
                <tr className="border-b border-brand-dark/5">
                  <td className="py-2 px-3 font-mono">50,000</td>
                  <td className="py-2 px-3 text-red-600">HATA</td>
                  <td className="py-2 px-3 text-red-600">✗ Virgül YAZMA</td>
                </tr>
                <tr className="border-b border-brand-dark/5">
                  <td className="py-2 px-3 font-mono">50000 TL</td>
                  <td className="py-2 px-3 text-red-600">HATA</td>
                  <td className="py-2 px-3 text-red-600">✗ TL/₺ YAZMA</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-mono">(boş)</td>
                  <td className="py-2 px-3 text-brand-ink/60">"Fiyat için sorun"</td>
                  <td className="py-2 px-3 text-brand-gold">⚠ Fiyat gizli, müşteri WhatsApp'tan sorar</td>
                </tr>
              </tbody>
            </table>
          </div>
          <Para><strong>İndirim göstermek istiyorsanız:</strong></Para>
          <ol className="list-decimal pl-5 space-y-1 text-sm">
            <li>Normal fiyatı <strong>Fiyat</strong> alanına yazın (örn: 60000)</li>
            <li>"İndirimde" kutucuğunu işaretleyin</li>
            <li><strong>İndirimli Fiyat</strong> alanına düşük fiyatı yazın (örn: 45000)</li>
            <li>Sitede: <span className="line-through">60.000 ₺</span> <strong>45.000 ₺</strong> + kırmızı "İndirim" etiketi gözükür</li>
          </ol>
          <Box uyari="dikkat">
            İndirimli fiyat normal fiyattan büyük olamaz — sistem hata verir.
          </Box>
        </Section>

        {/* ─── 4. TOPLU YÜKLEME ─── */}
        <Section id="toplu-yukleme" icon={<IconCloudUpload />} title="4. Toplu Yükleme (ZIP)">
          <Para>
            Yüzlerce ürünü tek seferde yüklemek için. ZIP klasör yapısı çok önemli — birebir takip edin.
          </Para>
          <pre className="bg-brand-dark text-brand-cream rounded-lg p-4 text-xs overflow-x-auto">
{`ÜRÜNLER.zip
├── Koltuk Takımı/                  ← KATEGORİ
│   ├── Beyaz Lüks Koltuk/          ← ÜRÜN
│   │   ├── 1.jpg                   ← ana görsel
│   │   ├── 2.jpg
│   │   └── 3.jpg
│   └── Modern Köşe/
│       └── 1.jpg
└── Yatak Odası/
    └── Ferah Yatak Odası/
        ├── 1.jpg
        └── 2.jpg`}
          </pre>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>Klasör adı = Kategori (yoksa otomatik oluşturulur)</li>
            <li>Alt klasör = Ürün</li>
            <li>İçindeki resimler ürünün görselleri olur</li>
            <li>Resimleri 1.jpg, 2.jpg, 3.jpg olarak adlandırın — sıra korunur</li>
            <li>Aynı isimli ürün varsa atlanır (silinmez, eski hali korunur)</li>
            <li>Fiyatlar boş yüklenir — sonra <strong>Ürünler</strong> sayfasından tek tek düzenleyin</li>
          </ul>
          <Box uyari="dikkat">
            <strong>macOS kullanıcıları:</strong> ZIP'i sağ tık → "Sıkıştır" ile yapın. Terminal'den yapmayın
            (gizli .DS_Store dosyaları sorun çıkarır, gerçi sistem atlıyor ama yine de temiz olsun).
          </Box>
          <Box tip="ip-ucu">
            Yükleme sonrası rapor gösterilir: kaç yeni kategori, kaç ürün, kaç görsel yüklendi.
            Hata olduysa altta detaylı liste gözükür.
          </Box>
        </Section>

        {/* ─── 5. KATEGORİLER ─── */}
        <Section id="kategoriler" icon={<IconCategory />} title="5. Kategoriler">
          <Para>
            Header'da çıkan menü öğeleri buradan gelir. Yeni kategori eklediğinizde <strong>~60 saniye sonra</strong> sitede görünür.
            (Cache yenilenmesi için bu süreyi bekleyin.)
          </Para>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li><strong>Ad:</strong> Müşteriye gösterilecek ad (örn: "Koltuk Takımı")</li>
            <li><strong>Slug:</strong> URL'de görünür (örn: "koltuk-takimi") — otomatik oluşur</li>
            <li><strong>Sıralama:</strong> 0'dan başla, düşük sayı önce gösterilir</li>
            <li><strong>Aktif:</strong> Kapalıysa menüde görünmez (ürünler silinmez)</li>
          </ul>
        </Section>

        {/* ─── 6. DİL ─── */}
        <Section id="dil" icon={<IconLanguage />} title="6. Çoklu Dil İçerik (TR / EN / DE)">
          <Para>
            Site 3 dilde: Türkçe (varsayılan), İngilizce (mobelinegol.com/<strong>en</strong>/...), Almanca (.../<strong>de</strong>/...).
          </Para>
          <Para><strong>Statik UI metinleri</strong> (butonlar, menüler, hata mesajları) zaten 3 dilde çevrilidir, dokunmanıza gerek yok.</Para>
          <Para><strong>Dinamik içerik</strong> (ürün adı, açıklama):</Para>
          <ul className="list-disc pl-5 space-y-1.5 text-sm">
            <li><strong>Türkçe</strong> ana dilidir, mutlaka doldurun</li>
            <li>İngilizce ve Almanca <em>boş bırakırsanız</em>: sistem yaklaşık 200 mobilya terimini içeren bir sözlükle otomatik çevirir.
                Örnek: "Köşe Koltuk" → "Corner Sofa" / "Ecksofa"</li>
            <li>Otomatik çeviri %75-85 doğru. Tam istediğiniz şekilde olsun istiyorsanız <strong>elle düzeltebilirsiniz</strong>:
                Hero Bannerlar, Sayfa İçerikleri, WhatsApp Şablonları sayfalarında dil sekmelerinden gir</li>
          </ul>
          <Box tip="ip-ucu">
            Müşteri sağ üst köşedeki dil seçicisiyle (🌐 TR/EN/DE) istediği dile geçebilir. Tarayıcısı Almanca ise otomatik DE açılır.
          </Box>
        </Section>

        {/* ─── 7. SAYFALAR CMS ─── */}
        <Section id="sayfalar" icon={<IconFileText />} title="7. Sayfa İçerikleri">
          <Para>
            <strong>Sayfa İçerikleri</strong> menüsünden Hakkımızda, KVKK, Gizlilik, Garanti, Teslimat-Kurulum,
            Satış Sözleşmesi metinlerini düzenleyebilirsiniz. Hukuki metinler için bir avukata danışın.
          </Para>
          <Para><strong>Markdown</strong> yazım kuralları:</Para>
          <pre className="bg-brand-cream rounded-lg p-3 text-xs">
{`# Büyük Başlık
## Alt Başlık

**kalın yazı**
*italik yazı*

- madde 1
- madde 2

[Bağlantı metni](https://mobelinegol.com)`}
          </pre>
        </Section>

        {/* ─── 8. HERO ─── */}
        <Section id="hero" icon={<IconPhoto />} title="8. Hero Bannerlar">
          <Para>
            Anasayfa üstündeki büyük dönen pankartlar. <strong>Hero Bannerlar</strong> menüsünden düzenlersiniz.
            Şu an <strong>4 slide</strong> var ve her biri 3 dilde (TR/EN/DE) çalışır:
          </Para>
          <ul className="list-disc pl-5 space-y-1.5 text-sm">
            <li><strong>Yaşam Alanı</strong> — koltuk koleksiyonuna yönlendirir (\u201cEvinizin kalbi\u201d).</li>
            <li><strong>Yatak Odası</strong> — yatak odası koleksiyonu (\u201cHuzurlu uykular\u201d).</li>
            <li><strong>Nakliye + Kurulum</strong> — kamyon görseli solda, \u201cTüm Türkiye\u2019ye Nakliye + Kurulum\u201d metni sağda. Metin artık görsele gömülü değil; mobilde de düzgün sığar ve 3 dilde otomatik çevrilir.</li>
            <li><strong>Avrupa Teslimat</strong> — \u201cİnegöl\u2019den Avrupa\u2019ya kapınıza teslim\u201d, ülke listesiyle.</li>
          </ul>
          <Para>
            Her banner için metinleri (başlık, vurgulu kelime, açıklama, buton) düzenleyebilirsiniz; tasarım ve
            görsel düzeni sabittir. Görsel değiştirmek isterseniz ubivo\u2019ya iletin (mobil uyumu korunmalı).
          </Para>
        </Section>

        {/* ─── 9. WHATSAPP ─── */}
        <Section id="whatsapp" icon={<IconBrandWhatsapp />} title="9. WhatsApp Mesaj Şablonları">
          <Para>
            Müşteri "WhatsApp'tan Sor" / "İletişim Hattı" gibi butonlara tıkladığında otomatik açılan mesaj.
            Tonu nasıl olsun ona göre ayarlayın — resmi mi, samimi mi, vs.
          </Para>
          <Para>
            <strong>&#123;urun&#125;</strong> yer tutucusu (sadece <em>Ürün Hakkında Soru</em> şablonunda): müşterinin baktığı ürünün adı buraya gelir.
          </Para>
          <Para>3 şablon var, hepsini 3 dilde doldurabilirsin (DE/EN boş bırakırsan TR kullanılır).</Para>
        </Section>

        {/* ─── 10. TALEPLER ─── */}
        <Section id="talepler" icon={<IconMessageCircle />} title="10. Müşteri Talepleri">
          <Para>
            Müşteri sepetinden "Siparişi Onayla" diyince:
          </Para>
          <ol className="list-decimal pl-5 space-y-1 text-sm">
            <li>Talep <strong>otomatik WhatsApp'a açılır</strong> — müşteri gönderir</li>
            <li>Aynı anda sistemde bir <strong>talep kaydı</strong> oluşur</li>
            <li>Talepler menüsünden tüm talepleri görebilirsin (müşteri adı, telefon, sepet)</li>
          </ol>
        </Section>

        {/* ─── 11. YORUMLAR ─── */}
        <Section id="yorumlar" icon={<IconStarFilled />} title="11. ⭐ Müşteri Yorumları">
          <Para>
            Yorum sistemi <strong>dönüşümü %20-30 arttırır</strong>. Müşteri ürün sayfasında "Yorum Yaz" diyebilir,
            isim + 1-5 yıldız + yorum girer. <strong>Hesap açmasına gerek yok</strong>.
          </Para>
          <Para><strong>Akış:</strong></Para>
          <ol className="list-decimal pl-5 space-y-1 text-sm">
            <li>Müşteri ürün sayfasında forma isim, yıldız, yorum yazar</li>
            <li>Yorum <strong>direkt yayınlanır</strong> (admin onayı YOK, otomatik)</li>
            <li>Sen <strong>Yorumlar</strong> menüsünden tümünü görür, beğenmediklerini <strong>silersin veya gizlersin</strong></li>
            <li>WhatsApp'tan sipariş verdiğini bildiğin müşteriye <strong>"Doğrulanmış Müşteri"</strong> rozeti verebilirsin</li>
          </ol>
          <Box uyari="dikkat">
            Spam koruması var: aynı IP'den 5 dakikada 1 yorum, küfür filtresi otomatik engelliyor.
            Yine de istenmeyen yorumları silmek senin görevin.
          </Box>
          <Para><strong>Bonus SEO kazancı:</strong> Yorumlar Google aramada <strong>yıldız puanı</strong> ile gözükür
          (Product/AggregateRating schema markup). Yıldızlar tıklama oranını ciddi arttırır.</Para>
        </Section>

        {/* ─── 12. ANALİTİK ─── */}
        <Section id="analitik" icon={<IconTrendingUp />} title="12. 📊 Site Analitiği">
          <Para>
            Panel (admin anasayfa) üstünde <strong>8 özet kartı</strong> ve altında grafikler var. Rakamların ne anlama
            geldiğini bilmek önemli:
          </Para>
          <ul className="list-disc pl-5 space-y-1.5 text-sm">
            <li><strong>Tekil Ziyaretçi (30g):</strong> Son 30 günde siteye giren <em>farklı kişi</em> sayısı (IP bazlı tekilleştirilir). Gerçek kişi sayısına en yakın rakam budur.</li>
            <li><strong>Bugün Tekil:</strong> Bugün giren farklı kişi sayısı.</li>
            <li><strong>Görüntülenme (grafik):</strong> Açılan toplam sayfa sayısı. Bir kişi 5 sayfa gezerse 5 görüntülenme olur — bu yüzden görüntülenme, tekil ziyaretçiden her zaman yüksektir. İkisini karıştırmayın.</li>
            <li><strong>Sepete Ekleme (30g):</strong> Müşterilerin son 30 günde kaç kez ürünü sepete eklediği — gerçek satın alma niyeti göstergesi.</li>
            <li><strong>Bu Ay Sipariş:</strong> WhatsApp\u2019a düşen sipariş/talep sayısı (Talepler sayfasıyla aynı).</li>
            <li><strong>En Çok Tıklanan Ürünler:</strong> Her ürün sayfası açılışında sayaç artar; hangi ürünlere ilgi olduğunu gösterir.</li>
            <li><strong>En Çok Favorilenen</strong> ve <strong>Son Yorumlar</strong> widget\u2019ları da buradadır.</li>
          </ul>
          <Box uyari="dikkat">
            <strong>Önemli:</strong> Tekil ziyaretçi ve sepete ekleme verisinin görünmesi için Supabase\u2019de
            <strong> sql/15-analytics-events.sql</strong> dosyasının bir kez çalıştırılmış olması gerekir.
            Çalıştırılmadıysa bu kartlar 0 görünür (site çalışmaya devam eder, sorun olmaz).
          </Box>
          <Box tip="ip-ucu">
            <strong>İleri seviye:</strong> Google Analytics 4 ve Vercel Analytics da bağlı. Trafik kaynağı, davranış
            akışı gibi detaylar için ubivo ile iletişime geçin.
          </Box>
        </Section>

        {/* ─── 13. BLOG ─── */}
        <Section id="blog" icon={<IconArticle />} title="13. Blog Yazıları">
          <Para>
            SEO için altın madeni. "İnegöl mobilyası nasıl seçilir", "Koltuk takımı bakımı" gibi
            müşterinin aradığı konularda yazıp Google'da yukarı çıkarsınız.
          </Para>
          <Para>
            <strong>Blog</strong> menüsü → <strong>Yeni Yazı</strong> → başlık, içerik, kapak görseli, yayın tarihi.
            Yayınla'ya basana kadar taslak halinde kalır.
          </Para>
        </Section>

        {/* ─── 12. AYARLAR ─── */}
        <Section id="ayarlar" icon={<IconSettings />} title="14. Genel Ayarlar">
          <Para>
            <strong>Ayarlar</strong> menüsünden:
          </Para>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>WhatsApp telefon numarası (90 ile başlamalı, başında + olmadan)</li>
            <li>İşletme telefonu, e-posta, adres</li>
            <li>Üst duyuru bandı metni ("Tüm Türkiye'ye TESLİMAT") — açıp kapatabilirsin</li>
            <li>Sosyal medya linkleri</li>
          </ul>
        </Section>

        {/* ─── 13. GÖRSELLER ─── */}
        <Section id="gorseller" icon={<IconPhoto />} title="15. Görsel Yükleme Kuralları">
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li><strong>Format:</strong> JPG, PNG, WebP. (HEIC iPhone formatı çalışmaz, önce dönüştür)</li>
            <li><strong>Boyut:</strong> Max 10 MB her dosya. Sistem otomatik 1600px'e küçültür</li>
            <li><strong>Çözünürlük:</strong> En az 800x800 öner, kare oran ideal</li>
            <li><strong>Sayı:</strong> Ürün başına en az 1, en fazla 10</li>
            <li><strong>Sıra:</strong> İlk yüklediğin ana görsel olur, listeden sürükleyerek değiştirebilirsin</li>
          </ul>
          <Box tip="ip-ucu">
            Profesyonel görseller dönüşümü <strong>3 katına çıkarır</strong>. İyi ışıkta, sade arkaplanda çek.
          </Box>
        </Section>

        {/* ─── 14. SEO ─── */}
        <Section id="seo" icon={<IconSearch />} title="16. SEO İpuçları">
          <ul className="list-disc pl-5 space-y-1.5 text-sm">
            <li>Ürün adında <strong>arama yapılan kelimeleri</strong> kullan — "Modern Beyaz Köşe Koltuk Takımı" "Köşe Koltuk 1" 'den iyi</li>
            <li>Açıklamayı doldur — boş ürünler Google'da yukarıya çıkmaz</li>
            <li>Düzenli blog yaz — haftada 1 bile büyük fark yaratır</li>
            <li>Görsellere açıklayıcı isim verme şart değil (sistem hallediyor) ama 1.jpg 2.jpg yerine "beyaz-koltuk-1.jpg" verirsen daha iyi</li>
            <li><strong>Hakkımızda</strong> sayfası: İnegöl, mobilya, kalite gibi anahtar kelimeleri içersin</li>
            <li><strong>İlk müşteri yorumları</strong> Instagram'dan alıp Hakkımızda altına koymayı düşün</li>
          </ul>
          <Box tip="ip-ucu">
            <strong>Yeni: SSS sayfası ve AI arama (GEO).</strong> Siteye <strong>/sss</strong> (Sık Sorulan Sorular)
            sayfası eklendi — net soru-cevaplar ChatGPT, Perplexity gibi yapay zeka aramalarının sitenizi kaynak
            göstermesine yardımcı olur. Ayrıca site, AI botlarına açık tutulur (llms.txt + robots). Sizden istenen
            tek şey: Google Business Profile\u2019ı güncel tutmak ve adres-telefon bilgisini her yerde aynı yazmak.
          </Box>
        </Section>

        {/* ─── 15. SORUN ─── */}
        <Section id="sorun" icon={<IconAlertTriangle />} title="17. Sorun Giderme">
          <Sorun
            soru="Eklediğim kategori header'da görünmüyor"
            cevap="60 saniye bekleyin. Sistem cache'i her dakika yeniler. Hala görünmüyorsa tarayıcıyı yenilemeyi deneyin (Ctrl+Shift+R)."
          />
          <Sorun
            soru="Görsel yüklerken 'Dosya çok büyük' hatası"
            cevap="Görsel 10 MB'tan büyük. Telefonda Photos uygulamasıyla %50 küçültün, ya da TinyPNG.com'a yapıştırın, otomatik sıkıştırır."
          />
          <Sorun
            soru="Toplu yükleme bitmedi, hata verdi"
            cevap="ZIP yapısını kontrol edin: 2 seviye derinlik (Kategori/Ürün/resim.jpg). Mac'te Terminal'le yapıldıysa __MACOSX klasörü olabilir, sistem onu atlıyor ama temiz olsun isterseniz tekrar yapın."
          />
          <Sorun
            soru="Fiyat görmüyor müşteri"
            cevap="Ürün düzenle → Fiyat alanı dolu mu? Boşsa 'Fiyat için sorun' yazısı gösterilir."
          />
          <Sorun
            soru="WhatsApp linki açılmıyor"
            cevap="Ayarlar → WhatsApp numarası kontrolü. Başında + veya 0 olmadan, 90 ile başlasın. Örn: 905360400108"
          />
          <Sorun
            soru="Türkçe karakterler bozuk görünüyor (ışŞğĞ)"
            cevap="Sistemde UTF-8 standartı kullanılıyor — bu sorun olmaz. Eğer görüyorsan tarayıcıyı yenile, hala bozuksa ekran görüntüsü atıp destek talep et."
          />
          <Sorun
            soru="Dil değiştirince ürün adı Türkçe kalıyor"
            cevap="Otomatik sözlükte o kelime yoksa Türkçe gözükür. Ürün düzenle → İngilizce/Almanca alanlarını manuel doldur, sorun çözülür."
          />
        </Section>

        {/* ─── 16. GÜVENLİK ─── */}
        <Section id="guvenlik" icon={<IconShieldCheck />} title="18. Güvenlik">
          <ul className="list-disc pl-5 space-y-1.5 text-sm">
            <li>Şifreni <strong>kimseyle paylaşma</strong>. Yenisini Ayarlar'dan değiştir, en az 12 karakter olsun</li>
            <li>Bilgisayarın açıkken paneli açık bırakma — kafede vs çıkış yap (sağ üst → Çıkış)</li>
            <li>Şüpheli e-posta gelirse açma. Resmi servis sağlayıcılar asla şifre istemez</li>
            <li>Sistemde otomatik günlük yedek alınıyor. Yine de aylık 1 kez büyük değişiklik öncesi ubivo'ya haber ver</li>
          </ul>
          <Box uyari="dikkat">
            <strong>Tek admin sensin.</strong> Başkasını da admin yapmak istersen ubivo'ya yaz, ekleyelim.
          </Box>
        </Section>

        {/* ─── İLETİŞİM ─── */}
        <div className="mt-12 p-6 bg-gradient-to-br from-brand-gold/10 to-brand-cream rounded-2xl border border-brand-gold/30">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-full bg-brand-gold text-white flex items-center justify-center shrink-0">
              <IconInfoCircle size={24} />
            </div>
            <div>
              <h3 className="font-display text-lg font-semibold text-brand-dark mb-1">Hala sorunuz mu var?</h3>
              <p className="text-sm text-brand-ink/70 mb-3">
                Site size devredilmiş olsa bile destek hizmetimiz devam ediyor.
                Acil teknik destek için ubivo'ya WhatsApp'tan ulaşın.
              </p>
              <p className="text-xs text-brand-ink/50">
                Bu kılavuz yetersiz kaldığı durumlarda güncellenecektir.
              </p>
            </div>
          </div>
        </div>
      </article>
    </>
  );
}

// ─── Yardımcı componentler ──────────────────────────────────
function Section({ id, icon, title, children }) {
  return (
    <section id={id} className="scroll-mt-20">
      <div className="flex items-center gap-3 mb-4 pb-3 border-b border-brand-dark/10">
        <div className="w-10 h-10 rounded-xl bg-brand-gold/10 text-brand-gold flex items-center justify-center">
          {icon}
        </div>
        <h2 className="font-display text-2xl font-semibold text-brand-dark">{title}</h2>
      </div>
      <div className="space-y-3 text-brand-ink/85">
        {children}
      </div>
    </section>
  );
}

function Para({ children }) {
  return <p className="leading-relaxed text-sm md:text-base">{children}</p>;
}

function Box({ tip, uyari, children }) {
  const tipStilleri = {
    'ip-ucu':    { bg: 'bg-brand-teallt/50', border: 'border-brand-teal/30', text: 'text-brand-dark', icon: <IconInfoCircle size={20} className="text-brand-teal2" />, label: 'İPUCU' },
    'onemli':    { bg: 'bg-brand-gold/10', border: 'border-brand-gold/30', text: 'text-brand-dark', icon: <IconCheck size={20} className="text-brand-gold" />, label: 'ÖNEMLİ' },
  };
  const uyariStilleri = {
    'dikkat': { bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-900', icon: <IconAlertTriangle size={20} className="text-yellow-600" />, label: 'DİKKAT' },
  };
  const stil = tip ? tipStilleri[tip] : uyariStilleri[uyari];
  if (!stil) return null;
  return (
    <div className={`${stil.bg} border ${stil.border} rounded-lg p-4 my-3 text-sm`}>
      <div className="flex items-start gap-2.5">
        <div className="shrink-0 mt-0.5">{stil.icon}</div>
        <div className={`${stil.text} flex-1`}>
          <p className="text-xs font-bold tracking-widest mb-1">{stil.label}</p>
          <div className="leading-relaxed">{children}</div>
        </div>
      </div>
    </div>
  );
}

function Sorun({ soru, cevap }) {
  return (
    <details className="bg-white border border-brand-dark/5 rounded-lg p-4 group">
      <summary className="font-medium text-brand-dark cursor-pointer flex items-center gap-2 list-none">
        <span className="text-brand-gold group-open:rotate-90 transition-transform">▶</span>
        {soru}
      </summary>
      <p className="mt-3 text-sm text-brand-ink/70 leading-relaxed pl-5">{cevap}</p>
    </details>
  );
}

/* ─── NOT: Bu dosya otomatik üretilmiştir, aşağısı Möbel İnegöl ek bölümleridir ─── */
