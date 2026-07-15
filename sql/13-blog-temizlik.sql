-- ════════════════════════════════════════════════════════════
-- Möbel İnegöl — Blog Temizlik (v24)
-- ════════════════════════════════════════════════════════════
-- AMAÇ:
--   1) İki blog yazısını kalıcı sil:
--      - "Mobilya Alırken Pişman Olmamak İçin 12 Altın Kural"
--      - "Mobilyanızı 10 Yıl Daha Genç Gösterecek Bakım Sırları"
--   2) "2025 Trend Renkler" yazısını 2026 olarak güncelle
--
-- ÇALIŞTIRMA: Supabase SQL Editor'de bir kez çalıştırın.
-- (Seed yeniden çalıştırılırsa bu yazılar zaten gelmeyecek; bu script
--  daha önce eklenmiş canlı kayıtları temizler.)
-- ════════════════════════════════════════════════════════════

-- 1) İstenmeyen iki yazıyı sil (hem slug hem başlık eşleşmesiyle garanti)
DELETE FROM public.blog_posts
WHERE slug IN (
  'mobilya-alirken-pisман-olmamak-icin-12-altin-kural',
  'mobilya-alirken-pisman-olmamak-icin-12-altin-kural',
  'mobilyanizi-10-yil-daha-genc-gosterecek-bakim-sirlari'
)
OR title ILIKE '%Pişman Olmamak İçin 12 Altın Kural%'
OR title ILIKE '%10 Yıl Daha Genç%';

-- 2) 2025 Trend yazısını 2026 yap (başlık, slug, özet, içerik)
UPDATE public.blog_posts
SET
  title   = REPLACE(title,   '2025', '2026'),
  excerpt = REPLACE(excerpt, '2025', '2026'),
  content = REPLACE(content, '2025', '2026'),
  slug    = REPLACE(slug,    '2025', '2026')
WHERE slug LIKE '%2025%' OR title LIKE '%2025%';

-- Kontrol:
-- SELECT title, slug, is_published FROM public.blog_posts ORDER BY published_at DESC;
