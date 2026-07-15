-- ════════════════════════════════════════════════════════════
-- Möbel İnegöl — site_reviews (Google Müşteri Yorumları)
-- Site içi (ürün) yorumlarından BAĞIMSIZ. Ana sayfa carousel için.
-- by ubivo · idempotent
-- ════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS public.site_reviews (
  id             uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  author         text NOT NULL CHECK (length(author) BETWEEN 1 AND 80),
  rating         smallint NOT NULL DEFAULT 5 CHECK (rating BETWEEN 1 AND 5),
  text           text NOT NULL CHECK (length(text) BETWEEN 2 AND 2000),
  time_label     text,
  is_local_guide boolean NOT NULL DEFAULT false,
  is_active      boolean NOT NULL DEFAULT true,
  sort_order     int NOT NULL DEFAULT 0,
  created_at     timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_site_reviews_active
  ON public.site_reviews(is_active, sort_order);

ALTER TABLE public.site_reviews ENABLE ROW LEVEL SECURITY;

-- Herkes aktif yorumları okuyabilir
DROP POLICY IF EXISTS "Public read site_reviews" ON public.site_reviews;
CREATE POLICY "Public read site_reviews" ON public.site_reviews
  FOR SELECT USING (is_active = true);

-- Sadece giriş yapmış admin yönetir
DROP POLICY IF EXISTS "Admin manage site_reviews" ON public.site_reviews;
CREATE POLICY "Admin manage site_reviews" ON public.site_reviews
  FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

-- Seed — yalnızca tablo boşsa ekle (idempotent, tekrar çalıştırmak güvenli)
INSERT INTO public.site_reviews (author, rating, text, time_label, is_local_guide, sort_order)
SELECT * FROM (VALUES
  ('Ramazan Ozbek', 5, 'Satış öncesi ve sonrası güvenebileceğiniz güzel insanlar çalıştık. Burdaysanız doğru ✅ Adrestesiniz.', 'bir yıl önce', false, 0),
  ('Gürkan Uyar', 5, 'Almış olduğum salon takımı yatak odası yemek odası oturma grubu bugün tam teslimat saatinde geldi ürünler eksiksiz olarak tarafımıza teslim edildi ve kurulumu yapıldı kurulum yapan arkadaşlar gerçekten işlerini bilen ve güler yüzlü insanlar hepsinden ve Möbel İnegöl mobilya ailesine çok teşekkür ederiz mobilyada fiyat açısından ilgilenme yardımcı olma açısından ürünlerin kalitesi açısından tek adres bana göre herkese tavsiye edeceğim tekrardan teşekkür ederim', '4 yıl önce', false, 1),
  ('Gamze Bolat', 5, 'Yaklaşık bir hafta önce verdiğim siparişim elimize ulaştı ve zamanından önce. Hizmetiyle ilgileriyle çok memnun kaldık heleki kumaşa bayıldım şiddetle MOBEL INEGOL MOBILYA YI öneriyorum iyi günler', '4 yıl önce', false, 2),
  ('Kemal Berkay Yıldız', 5, 'Evlilik öncesi tüm alışverişimizi Möbel İnegöl mobilyadan yaptık. Taahhüt etmiş oldukları tarihte ürünlerimizi teslim ettiler. Ürünler kaliteli ve fiyatları muadillere göre uygun.', '4 yıl önce', false, 3),
  ('Gülçin Avnos', 5, 'İşinin en güzelini yapan bir firma çalışanları özellikle muhteşem işimizi kolaylaştıran insanlar hepsi her bütçeye uygun kaliteli mobilyalar var teşekkür ediyoruz', 'bir yıl önce', false, 4),
  ('Hasan Basri', 5, 'Hizmeti ve ürünleriyle kusursuz bir firma', '6 ay önce', false, 5),
  ('Ademm Nalpara', 5, 'Ürünleri çok kaliteli ve güzel ürünlerinin her zaman arkasında duruyorlar. Her konuda bize yardımcı olan Sezen beye teşekkür ederiz.', 'bir yıl önce', false, 6),
  ('Ramazan Dumlupinar', 5, 'Çok memnun kaldık Satış danışmanı Ahmet beyede ayrıca teşekkür ederim dedikleri gibi çok hızlı bir şekilde teslimat için.', 'bir yıl önce', false, 7),
  ('Semih YALÇIN', 5, 'Satıştan teslimata kadar geçen süreçte sattıkları ürünlerin sonuna kadar takipçisi olan bir firma oluşan aksaklıklarda değişim ve tedarik konusunda mallarının arkasında durdular teşekkürler mobel mobilya', 'bir yıl önce', false, 8),
  ('Mucahit Tankit', 5, 'İlgili ve alakalı ve malının arkasındalar baya zaman geçmesine rağmen ufak bir arıza olsa bile zaman gözekmeksizin yardımcı oluyorlar çok teşekkür ederim ilginiz ve alakanız için', 'bir yıl önce', false, 9),
  ('Ysgl Trpnc', 5, 'İnternet üzerinden alışveriş yapılınca genelde satıcılar kendilerini ulaşılmaz bir konuma getirir ve aramaya sormaya çekinirsiniz arasanız karşınızda muhatap bulamazsınız, Möbel İnegöl mobilyanın bana göre en büyük artılarından biri de bu oldu her soruma mesajlarıma saatlerce vakit ayırıp tek tek cevapladılar, asla karşılıksız bırakmadılar, müsait olamama durumlarında bile geri dönüş yapıp durumlarını açıkladılar mükemmel bir iletişim, ilgi, alaka, güleryüz, ellerinden gelen ne varsa yapan bir firma. Aldıkları parayı sonuna kadar hak eden bir firma. Salonun için L koltuk aldım. İnanılmaz kaliteli ve kullanışlı bakıldığında ben buradayım diyorlar zaten. Satılan ürünlerin sonuna kadar arkasında duran bir firma biz çok memnun kaldık. Herşey için çok teşekkür ederiz.', '2 yıl önce', false, 10),
  ('Metin Bulut', 5, 'Kurulum teslimat en iyi şekilde elimize ulaştı hiçbir sorun yaşanmadı dediği günde teslim edildi sorunsuz güler yüzlü ilgili satıcılar var fiyat olarakta diğer piyasaya göre daha uygun aynı kalite', 'bir yıl önce', false, 11),
  ('Fuat F.C', 5, 'Evimizin eşyalarını mobel mobilyadan aldık. Alışveriş sürecinden teslimat sürecine kadar çok yardımcı oldular. Sonrasında yaşanan sıkıntılarda mobilyalarının arkasında durdular il dışından alışveriş yapmama rağmen mobilyalarda değişim yapılıp tekrar gönderim sağlandı. gösterdikleri müşteri memnuniyeti için ayrıca teşekkür ediyorum.', 'bir yıl önce', false, 12),
  ('Amine Arslan', 5, 'Yeni mobilya arayışı içersindeydim yoldan geçerken Möbel İnegölnın vitrini dikkatimizi çekti ve içeri girdik daha girer girmez ekipçe güzel karşılanmak ve mobilyaların ışıltısı kalitesi gözlerimizi aldı Tabiki satış temsilcimiz Sezer bey her şeyiyle çok ilgiliydi.', 'bir yıl önce', false, 13),
  ('Erdem', 5, 'Koltuk alışverişimizde, Sezer Bey sürecin başından sonuna kadar ilgili ve çözüm odaklıydı. Nakliye sırasında, kendisinden bağımsız bir aksaklık yaşanmasına rağmen sürekli iletişimde kaldı ve süreci yakından takip etti. Ürün söz verdiği tarihte teslim edildi ve genel olarak memnun kaldık. Teşekkür ederiz.', '11 ay önce', false, 14),
  ('Mahmut Tuğsuz', 5, 'Mobilyalarımız elimize ulaştı. Bir çizik bile yok teşekkür ederiz kurulumu yapan kişilerde en kusursuz şekilde kurulumlarını yaptı çok memnun kaldık kesinlikle tavsiye ediyorum ❤️', 'bir yıl önce', false, 15),
  ('Nur Nalan Özdemir', 5, 'Teslimat hızlı bir şekilde dedikleri vakitte geldi. İletişimleri gayet iyi. Memnun kaldım.', '5 ay önce', false, 16),
  ('Emrah Demirtaş', 5, 'Aldığımız ürünler oldukça güzel paketlenmiş tek bir çizik olmadan elimize ulaştı ve montajı hemen yapıldı. Ürünler çok kaliteli ve sağlam. Çok beğendik. Her aradığımızda ulaştık ve yakından ilgilendiler. İstediğimiz bilgiye hemen ulaştık.', 'bir yıl önce', false, 17),
  ('Anadolu Çocuğu', 5, 'Firma sahibi Sezer beye çok teşekkür ediyorum başarılı teslimat başarılı hizmet güvenli bir alışveriş oldu kendilerine hayırlı satışlar diliyorum. Tekrardan çok teşekkür ediyorum. ☺️', '6 ay önce', false, 18),
  ('ferayi özdemir', 5, 'Defne model yatak odası takımı aldım. Firmanın kendisinden, ilgisinden, iletişimde kalmasından, montaj ekibinden hepsinden çok çok çok memnundum. Dertleri ürün satmak olmayan bir işletme. kesinlikle tavsiye ederim. Defne takımı çok güzel oldu.', '4 ay önce', false, 19),
  ('Azra Abaklı', 5, 'Öncelikle Sezer beye ve tüm ekibe ilgilerinden dolayı çok teşekkür ederim çok yardım sever insanlar, koltuğun kalitesi dokusu işçiliği her şeyi harika gözünüz kapalı güvenebilirsiniz tavsiye ederim 🙏', '5 ay önce', false, 20),
  ('Otto Mercisko', 5, 'Sezer beye çok teşekkür ederim baştan sona kadar çok yardımcı oldu kuruluma gelen arkadaşlara da teşekkür ederim aldıkları paranın hakkını veren bir firma 🙏🙏🙏', '8 ay önce', true, 21),
  ('Aysenur bekar', 5, 'Çok memnun kaldım. Adıyaman''dan sipariş verdim. kalitesi görünüş hepsi İstediğim gibi geldi. Sezer bey çok ilgili bir satıcı aşırı memnun kaldım. Hızlı teslimat güvenli alışveriş 🛍️ teşekkür ederim bol kazançlar diliyorum.', '4 ay önce', false, 22)
) AS v(author, rating, text, time_label, is_local_guide, sort_order)
WHERE NOT EXISTS (SELECT 1 FROM public.site_reviews);
