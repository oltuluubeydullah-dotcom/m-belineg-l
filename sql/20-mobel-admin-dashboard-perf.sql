-- ════════════════════════════════════════════════════════════
-- Möbel İnegöl — Migration 20
-- Admin Dashboard PERFORMANS: JS'te satır toplama → SQL agregasyon
-- ════════════════════════════════════════════════════════════
-- NEDEN: Dashboard (app/admin/page.jsx) "son 7 gün ziyaret" ve
-- "en çok ziyaret edilen sayfalar" için page_views'tan TÜM ham
-- satırları çekip JavaScript'te sayıyordu. Trafik arttıkça bu
-- binlerce satırı tel üzerinden taşır → yavaşlar.
-- Bu migration aggregation'ı SQL'e taşır (≤8 satır döner) ve
-- yorum ortalamasını admin_stats view'ına ekler.
-- İdempotent — tekrar tekrar çalıştırılabilir.
-- ════════════════════════════════════════════════════════════

-- ─── 1. En çok ziyaret edilen sayfalar (SQL GROUP BY) ────────
CREATE OR REPLACE FUNCTION public.admin_top_paths(days int DEFAULT 30, lim int DEFAULT 8)
RETURNS TABLE(path text, count bigint)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT path, count(*) AS count
  FROM public.page_views
  WHERE created_at > now() - (days || ' days')::interval
    AND path IS NOT NULL
  GROUP BY path
  ORDER BY count DESC
  LIMIT lim;
$$;

-- ─── 2. Günlük ziyaret (SQL date_trunc bucketing) ────────────
CREATE OR REPLACE FUNCTION public.admin_daily_views(days int DEFAULT 7)
RETURNS TABLE(gun date, count bigint)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT date_trunc('day', created_at)::date AS gun, count(*) AS count
  FROM public.page_views
  WHERE created_at > now() - (days || ' days')::interval
  GROUP BY 1
  ORDER BY 1;
$$;

-- Bu fonksiyonlar SECURITY DEFINER — RLS'i atlar ama sadece
-- authenticated (admin girişli) rol çağırabilir. Anon erişimi yok.
REVOKE ALL ON FUNCTION public.admin_top_paths(int, int)  FROM public, anon;
REVOKE ALL ON FUNCTION public.admin_daily_views(int)     FROM public, anon;
GRANT EXECUTE ON FUNCTION public.admin_top_paths(int, int) TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_daily_views(int)    TO authenticated;

-- ─── 3. admin_stats view'ına yorum ORTALAMASI ekle ───────────
-- Dashboard artık ortalamayı hesaplamak için TÜM reviews'ı çekmez.
DROP VIEW IF EXISTS public.admin_stats;
CREATE VIEW public.admin_stats AS
SELECT
  (SELECT count(*) FROM public.products WHERE is_active = true)                          AS aktif_urun,
  (SELECT count(*) FROM public.products)                                                   AS toplam_urun,
  (SELECT count(*) FROM public.categories WHERE is_active = true)                         AS aktif_kategori,
  (SELECT count(*) FROM public.inquiries
   WHERE created_at > now() - interval '30 days')                                         AS son_30_gun_talep,
  (SELECT count(*) FROM public.inquiries)                                                  AS toplam_talep,
  (SELECT count(*) FROM public.page_views
   WHERE created_at > now() - interval '30 days')                                         AS son_30_gun_ziyaret,
  (SELECT count(*) FROM public.page_views
   WHERE created_at > now() - interval '1 day')                                           AS bugun_ziyaret,
  (SELECT count(*) FROM public.page_views)                                                AS toplam_ziyaret,
  (SELECT count(DISTINCT ip_hash) FROM public.page_views
   WHERE created_at > now() - interval '30 days' AND ip_hash IS NOT NULL)                 AS tekil_ziyaret_30g,
  (SELECT count(DISTINCT ip_hash) FROM public.page_views
   WHERE created_at > now() - interval '1 day' AND ip_hash IS NOT NULL)                   AS tekil_ziyaret_bugun,
  (SELECT count(*) FROM public.site_events
   WHERE event_type = 'sepete_ekleme' AND created_at > now() - interval '30 days')        AS sepete_ekleme_30g,
  (SELECT count(*) FROM public.reviews WHERE is_hidden = false)                           AS toplam_yorum,
  -- YENİ: yorum ortalaması (dashboard'da ikinci tam-tablo sorgusunu ortadan kaldırır)
  (SELECT round(avg(rating)::numeric, 1) FROM public.reviews WHERE is_hidden = false)     AS ortalama_yorum,
  (SELECT count(*) FROM public.blog_posts WHERE is_published = true)                      AS yayinda_blog;

GRANT SELECT ON public.admin_stats TO authenticated;

-- ─── 4. "Son görünür yorumlar" için index ────────────────────
-- Mevcut idx_reviews_product_visible product_id ile başlıyor;
-- global ORDER BY created_at (is_hidden=false) bunu iyi kullanamaz.
CREATE INDEX IF NOT EXISTS idx_reviews_visible_recent
  ON public.reviews(created_at DESC) WHERE is_hidden = false;
