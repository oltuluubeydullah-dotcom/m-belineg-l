-- ════════════════════════════════════════════════════════════
-- Möbel İnegöl — Blog Seed (4 Ana Kategori)
-- Web''den araştırılmış, mobilya sektörüne özel
-- ════════════════════════════════════════════════════════════
-- ÇALIŞTIRMA: sql/11-mobel-analytics-favorites.sql''den SONRA

INSERT INTO public.blog_posts (title, slug, excerpt, content, category, read_time_min, tags, is_published, published_at, cover_image)
VALUES

-- ════ 1. DEKORASYONl ════
(
  'Yaşam Odanızı Baştan Tasarlayın: 2026 Trend Mobilya Renkleri ve Kombinasyonları',
  'yasam-odanizi-bastan-tasarlayin-2026-trend-renkler',
  '2026 yılının en gözde mobilya renkleri, ton kombinasyonları ve tasarım ipuçlarıyla yaşam odanıza yeni bir soluk katın.',
  E'## 2026''te Mobilya Dünyasını Şekillendiren Renkler\n\nHer yıl değişen trend dalgaları mobilya sektöründe de kendini hissettiriyor. 2026 yılının öne çıkan paleti **toprak tonları ve yumuşak nötrler** üzerine kurulu. Terrakota, tozlu gül ve adaçayı yeşili önceki yılların baskın renkleri arasındaydı; bu yıl yerlerini daha sakin, kalıcı tonlara bırakıyor.\n\n### Öne Çıkan Renkler\n\n**Kiesel Beyazı (Off-White):** Saf beyazın soğukluğundan kaçınanlar için mükemmel. Krem ile beyaz arası bu ton her ahşap dokusunu tamamlıyor.\n\n**Kil Gri (Clay Gray):** Hem sıcak hem sakin. Açık meşe veya koyu ceviz ile bir araya geldiğinde ferah ama dinlendirici bir atmosfer yaratıyor.\n\n**Zeytin Yeşili:** Doğayla bağ kuran, zamansız bir seçenek. Kadife kaplama koltuk takımlarında özellikle etkileyici.\n\n**Yanık Turuncu Vurgu:** Ana rengi nötr tutup tek bir sandalye veya sehpada yanık turuncu kullanmak mekanı anında canlandırıyor.\n\n## Kombinasyon Rehberi\n\n### Sakin & Zarif\n- Ana mobilya: Off-white / kiesel koltuk takımı\n- Zemin: Açık meşe parke\n- Aksesuar: Altın veya pirinç metal detaylar\n- Duvar: Çok açık gri veya beyaz\n\n### Sıcak & Davetkar\n- Ana mobilya: Kil gri köşe koltuk\n- Zemin: Koyu meşe veya ceviz parke\n- Aksesuar: Keten kumaş, doğal rattan\n- Vurgu: Terrakota veya toprak kırmızısı yastıklar\n\n### Modern & Minimal\n- Ana mobilya: Antrasit veya koyu lacivert\n- Zemin: Beton görünümlü gres fayans\n- Aksesuar: Beyaz ve siyah geometrik desenler\n- Aydınlatma: Sarkıt endüstriyel lambalar\n\n## Küçük Mekanlar İçin Altın Kural\n\nKüçük bir salonda koyu renkten kaçınmak gerekmez — ancak **tek duvar veya tek mobilya** üzerinde kullanın. Geri kalanını açık bırakın. Bu "feature wall" yaklaşımı mekanı hem derin hem dinamik gösterir.\n\n## Profesyonel İpucu: 60-30-10 Kuralı\n\nTasarımcıların yıllardır kullandığı bu basit formül:\n- **%60** — Baskın renk (duvarlar, büyük mobilya)\n- **%30** — İkincil renk (perdeler, halı, tekli koltuk)\n- **%10** — Vurgu rengi (yastıklar, çiçek vazosu, resim çerçevesi)\n\nBu dengeyi kurduğunuzda mekan kaotik değil, uyumlu görünür.\n\n## Sonuç\n\nRenk seçimi kişisel bir karar olsa da 2026 trendleri bize net bir mesaj veriyor: **kalıcı, sakin, doğal.** Moda renklerle test yapmak istiyorsanız büyük mobilyayı nötr tutup aksesuarlarla oyun oynayın. Bu sayede birkaç yılda bir büyük değişiklik yapmadan mekanınızı güncelleyebilirsiniz.',
  'dekorasyon',
  8,
  ARRAY['dekorasyon', 'renk trendi', 'koltuk takımı', 'yaşam odası', '2026 trend'],
  true,
  now() - interval '2 days',
  NULL  -- cover_image (admin panelden yüklenecek)
),

-- ════ 4. YAŞAM TARZLARI ════
(
  'Ev Kuruyorum: Bütçeye Göre Mobilya Planlaması ve Öncelik Sırası',
  'ev-kuruyorum-butceye-gore-mobilya-planlamasi',
  'Yeni evliler ve ilk evini kuranlar için gerçekçi bütçe planlaması, öncelik sırası ve en sık yapılan hatalar.',
  'yasam-tarzlari',
  12,
  true,
  now() - interval '15 days',
  NULL  -- cover_image (admin panelden yüklenecek)
);

-- ════════════════════════════════════════════════════════════
-- Kontrol
-- SELECT title, category, read_time_min, array_length(tags,1) FROM blog_posts ORDER BY created_at;
-- ════════════════════════════════════════════════════════════
