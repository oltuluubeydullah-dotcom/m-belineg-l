-- ════════════════════════════════════════════════════════════
-- Möbel İnegöl — Hero Banner Temizlik (v25)
-- ════════════════════════════════════════════════════════════
-- SORUN: hero_banners tablosunda eski 3 banner var (simdi, teklif, avrupa).
--   Site DB'de kayıt VARSA onları gösteriyor, koddaki yeni 4-slide
--   fallback'i (yasam, yatak, nakliye, kargo) DEVRE DIŞI kalıyor.
--   Eski kind'lar yeni component'lerle eşleşmediği için hepsi aynı
--   slide (Evinizin kalbi) olarak görünüyor → "tek slide, 3 nokta".
--
-- ÇÖZÜM: Tabloyu boşalt. Tablo boş olunca kod fallback'i devreye girer
--   ve doğru 4 slide gösterilir.
--
-- ÇALIŞTIRMA: Supabase SQL Editor'de bir kez çalıştırın.
-- ════════════════════════════════════════════════════════════

-- hero_banners tablosundaki tüm kayıtları sil → kod fallback'i (4 slide) aktif olur
DELETE FROM public.hero_banners;

-- Kontrol (0 dönmeli):
-- SELECT count(*) FROM public.hero_banners;
