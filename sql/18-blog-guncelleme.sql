-- ════════════════════════════════════════════════════════════
-- 18 — Blog Güncelleme (v42)
-- ════════════════════════════════════════════════════════════
-- • "Ev Kuruyorum: Bütçeye Göre..." yazısı kaldırılır (bütçe konusu istenmiyor)
-- • Yerine 2 yeni detaylı yazı eklenir (bakım-onarım + satın alma rehberi)
-- Idempotent: slug çakışması varsa eski silinir, yeniden eklenir.
-- by ubivo
-- ════════════════════════════════════════════════════════════

-- 1) Bütçe yazısını kaldır
DELETE FROM public.blog_posts
  WHERE slug = 'ev-kuruyorum-butceye-gore-mobilya-planlamasi';

-- 2) Yeni yazılar (varsa önce temizle → tekrar çalıştırma güvenli)
DELETE FROM public.blog_posts
  WHERE slug IN ('kumas-secimi-rehberi-koltuk', 'mobilya-bakimi-uzun-omur');

INSERT INTO public.blog_posts (title, slug, excerpt, content, category, read_time_min, tags, is_published, published_at, cover_image)
VALUES

-- ════ YENİ 1 — SATIN ALMA REHBERİ ════
(
  'Koltuk Kumaşı Seçimi: Hangi Kumaş Hangi Yaşam Tarzına Uygun?',
  'kumas-secimi-rehberi-koltuk',
  'Babyface, keten, kadife, nubuk... Koltuk kumaşları arasındaki farkları, dayanıklılık ve temizlik özelliklerini karşılaştırdık.',
  E'## Koltuk Kumaşı Neden Bu Kadar Önemli?\\n\\nBir koltuk takımı ortalama 8-10 yıl evinizde kalır. Bu süre boyunca üzerine oturursunuz, çocuklar zıplar, kahve dökülür, kedi tırmalar. Kumaş seçimi sadece estetik değil; günlük yaşam konforunuzu ve koltuğun ömrünü doğrudan belirler.\\n\\nBu rehberde en çok tercih edilen kumaş türlerini, hangi yaşam tarzına uygun olduklarını ve nasıl bakım gerektirdiklerini ele alıyoruz.\\n\\n## Popüler Kumaş Türleri\\n\\n### Babyface (Yumuşak Dokulu)\\nSon yılların en çok tercih edilen kumaşı. Adından da anlaşılacağı gibi bebek teni kadar yumuşak bir dokuya sahip.\\n- **Avantaj:** İnanılmaz yumuşak, sıcak bir his verir, geniş renk seçeneği\\n- **Dikkat:** Tüy bırakabilir, leke tutma ihtimali orta seviyede\\n- **Kimler için:** Konforu önceleyen, yoğun kullanım olmayan evler\\n\\n### Keten Görünümlü Kumaşlar\\nDoğal, sade ve modern bir estetik sunar. Minimalist ve İskandinav tarzı dekorasyonların favorisi.\\n- **Avantaj:** Nefes alır, doğal görünüm, sıcak iklimde serin tutar\\n- **Dikkat:** Kolay kırışır, leke konusunda hassas\\n- **Kimler için:** Estetik kaygısı yüksek, düzenli bakım yapabilen kullanıcılar\\n\\n### Kadife (Velvet)\\nLüks ve gösterişli mekanlar için ideal. Işığa göre renk tonu değişen zengin bir doku sunar.\\n- **Avantaj:** Şık duruş, dayanıklı dokuma, premium görünüm\\n- **Dikkat:** Toz tutabilir, yön belli eder (havı)\\n- **Kimler için:** Salonunu vitrin gibi kullanan, davet seven evler\\n\\n### Nubuk / Süet Görünümlü\\nDeri hissi veren ama daha yumuşak bir alternatif.\\n- **Avantaj:** Şık, dayanıklı, modern\\n- **Dikkat:** Su ve leke konusunda dikkat ister\\n- **Kimler için:** Modern ve sade tasarım sevenler\\n\\n### Tekstüre / Boucle Kumaşlar\\nKabarık, dokulu yüzeyiyle 2026''nın en trend kumaşı.\\n- **Avantaj:** Çok şık, dokunsal zenginlik, trend\\n- **Dikkat:** Dokusu nedeniyle temizliği biraz daha özen ister\\n- **Kimler için:** Tasarım odaklı, modern evler\\n\\n## Çocuklu ve Evcil Hayvanlı Evler İçin\\n\\nEğer evde çocuk veya evcil hayvan varsa, kumaş seçiminde dayanıklılık ön planda olmalı:\\n\\n- **Su itici (leke tutmaz) kumaşları** tercih edin — sıvı döküldüğünde içeri işlemez, silmekle çıkar\\n- **Koyu veya desenli tonlar** lekeyi daha az belli eder\\n- **Sık dokuma** kumaşlar tırnak ve tırmalamaya daha dayanıklıdır\\n- Çıkarılabilir kılıflı modeller yıkama kolaylığı sağlar\\n\\n## Renk Seçiminde Pratik İpuçları\\n\\n### Küçük Salonlar\\nAçık tonlar (bej, gri, krem) mekanı daha geniş ve ferah gösterir.\\n\\n### Büyük Salonlar\\nKoyu ve doygun renkler (lacivert, antrasit, yeşil) sıcak ve davetkar bir atmosfer yaratır.\\n\\n### Uzun Ömürlü Tercih\\nNötr ana renk + değiştirilebilir renkli yastıklar = yıllarca güncel kalan bir kombin. Trendi yastık ve aksesuarla yakalayın, ana koltuğu nötr seçin.\\n\\n## Kumaşı Mağazada Test Edin\\n\\nFotoğrafa güvenmeyin. Mağazaya gittiğinizde:\\n- Elinizi kumaşa sürün, dokusunu hissedin\\n- Oturun, en az birkaç dakika bekleyin (ilk his ile uzun süreli his farklı olabilir)\\n- Işık altında rengin nasıl değiştiğine bakın\\n- Dikiş ve kenar işçiliğini inceleyin\\n\\n## Sonuç\\n\\nDoğru kumaş, doğru yaşam tarzıyla eşleştiğinde yıllarca konfor ve estetik sunar. Acele etmeyin, ihtiyacınızı netleştirin ve mümkünse mağazada deneyimleyin. Möbel İnegöl showroom''unda tüm kumaş seçeneklerini yerinde görebilir, uzman ekibimizden yaşam tarzınıza en uygun öneriyi alabilirsiniz. WhatsApp''tan yazın, size yardımcı olalım.',
  'satin-alma-rehberi',
  9,
  ARRAY['koltuk kumaşı', 'kumaş seçimi', 'babyface', 'kadife', 'satın alma rehberi'],
  true,
  now() - interval '8 days',
  NULL
),

-- ════ YENİ 2 — BAKIM ONARIM ════
(
  'Mobilyanızın Ömrünü Uzatın: Bölüm Bölüm Bakım Rehberi',
  'mobilya-bakimi-uzun-omur',
  'Ahşap, kumaş, deri ve metal mobilyalar için pratik bakım yöntemleri. Doğru bakımla mobilyanız ilk günkü gibi kalsın.',
  E'## Neden Düzenli Bakım?\\n\\nKaliteli mobilya bir yatırımdır. Doğru bakımla bu yatırımın ömrü iki katına çıkabilir. Üstelik bakım, çoğu zaman düşündüğünüzden çok daha basit ve evde bulunan malzemelerle yapılabilir.\\n\\nBu rehberde mobilya tipine göre bakım yöntemlerini, sık yapılan hataları ve mevsimsel bakım ipuçlarını topladık.\\n\\n## Ahşap Mobilya Bakımı\\n\\nAhşap, doğru bakıldığında nesiller boyu dayanan bir malzemedir.\\n\\n### Günlük / Haftalık\\n- Yumuşak, kuru bir bezle tozunu alın (mikrofiber idealdir)\\n- Asla ıslak bez kullanmayın — nem ahşaba zarar verir\\n\\n### Aylık\\n- Ahşaba özel bakım yağı veya cilası ile besleyin\\n- Cilayı bezle ince bir tabaka halinde uygulayın, lif yönünde silin\\n\\n### Dikkat Edilmesi Gerekenler\\n- Doğrudan güneş ışığı rengi soldurur — perde veya stor kullanın\\n- Sıcak bardak/tabağı doğrudan koymayın, altlık kullanın\\n- Kalorifer ve şömine yakınında aşırı kuruma çatlamaya yol açar\\n\\n## Kumaş Koltuk Bakımı\\n\\n### Rutin Bakım\\n- Haftada bir elektrikli süpürgenin yumuşak başlığıyla tozunu alın\\n- Minderleri periyodik olarak çevirin (eşit aşınma için)\\n\\n### Leke Müdahalesi\\n- Sıvı döküldüğünde hemen kuru bezle emdirin — ovmayın, bastırarak çekin\\n- Ovma işlemi lekeyi kumaşın içine işler\\n- Bilinmeyen lekeler için önce görünmeyen bir köşede test yapın\\n\\n### Yılda Bir\\n- Profesyonel koltuk yıkama hizmeti aldırın veya kuru köpük temizleyici kullanın\\n\\n## Deri Mobilya Bakımı\\n\\nDeri, yaşayan bir malzemedir ve nemini korumak ister.\\n\\n- Tozunu kuru bezle alın\\n- 2-3 ayda bir deri bakım kremi/sütü ile nemlendirin\\n- Çatlama ve kuruma deri bakımının ihmal edildiğinin işaretidir\\n- Güneşten ve ısı kaynaklarından uzak tutun\\n- Asla deterjan veya alkol bazlı temizleyici kullanmayın\\n\\n## Metal ve Cam Detaylar\\n\\n- Metal ayak ve kollar için nemli bez + kuru bezle parlatma yeterli\\n- Cam yüzeyleri cam temizleyici ile silin, iz bırakmaması için gazete veya mikrofiber kullanın\\n- Paslanmaya karşı nemli ortamlardan kaçının\\n\\n## Mevsimsel Bakım Takvimi\\n\\n### İlkbahar\\nKış boyunca biriken tozdan kapsamlı temizlik. Kumaş mobilyaları havalandırın.\\n\\n### Yaz\\nGüneş koruması önemli. Perdeleri gün ortasında kapatın, mobilyayı solmadan koruyun.\\n\\n### Sonbahar\\nKalorifer sezonu öncesi ahşapları besleyin (kuru hava çatlama yapar).\\n\\n### Kış\\nNem dengesi için odada bir miktar nem bulunması ahşap için faydalıdır.\\n\\n## En Sık Yapılan 5 Bakım Hatası\\n\\n1. **Islak bezle ahşap silmek** — nem en büyük düşman\\n2. **Lekeyi ovmak** — içeri işler, daha kötü hale gelir\\n3. **Deriyi nemlendirmemek** — kuruyup çatlar\\n4. **Güneşi görmezden gelmek** — tüm malzemeler için renk solmasına yol açar\\n5. **Yanlış kimyasal kullanmak** — her malzemenin kendine özel temizleyicisi var\\n\\n## Sonuç\\n\\nMobilya bakımı pahalı veya zahmetli değil; sadece düzenli ve bilinçli olmayı gerektirir. Bu basit alışkanlıklar mobilyanızın hem görünümünü hem de değerini korur. Möbel İnegöl''dan aldığınız ürünlerin bakımıyla ilgili sorularınız için bize WhatsApp''tan ulaşabilirsiniz — ürününüze özel bakım önerisi sunalım.',
  'bakim-onarim',
  10,
  ARRAY['mobilya bakımı', 'ahşap bakım', 'koltuk temizliği', 'deri bakımı', 'uzun ömür'],
  true,
  now() - interval '4 days',
  NULL
);

-- ════════════════════════════════════════════════════════════
-- Kontrol:
-- SELECT title, slug, category FROM blog_posts ORDER BY published_at DESC;
-- ════════════════════════════════════════════════════════════
