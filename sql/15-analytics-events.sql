-- ════════════════════════════════════════════════════════════
-- Möbel İnegöl — Migration 15
-- Gerçek Analitik: Site Olayları (sepete ekleme) + Tekil Ziyaretçi
-- ════════════════════════════════════════════════════════════
-- NEDEN: page_views ham "görüntülenme" sayıyordu (1 kişi 10 sayfa = 10).
-- Bu migration:
--   1) site_events tablosu — sepete ekleme gibi etkileşim olayları
--   2) admin_stats view'ını TEKİL ZİYARETÇİ (distinct ip_hash) + sepete
--      ekleme sayılarıyla günceller.
-- İdempotent — tekrar tekrar çalıştırılabilir.
-- ════════════════════════════════════════════════════════════

-- ─── 1. Site Olayları (etkileşim) ───────────────────────────
CREATE TABLE IF NOT EXISTS public.site_events (
  id          uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_type  text NOT NULL CHECK (event_type IN ('sepete_ekleme', 'urun_tiklama', 'whatsapp_tiklama')),
  product_id  uuid REFERENCES public.products(id) ON DELETE SET NULL,
  path        text,
  session_id  text,
  ip_hash     text,   -- SHA256, KVKK uyumlu
  locale      text DEFAULT 'tr',
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_site_events_type ON public.site_events(event_type, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_site_events_date ON public.site_events(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_site_events_prod ON public.site_events(product_id);

ALTER TABLE public.site_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon insert site_events" ON public.site_events;
DROP POLICY IF EXISTS "admin read site_events"   ON public.site_events;
DROP POLICY IF EXISTS "admin_read_site_events"   ON public.site_events;
-- GÜVENLİK (v30): Anon INSERT KALDIRILDI — sadece /api/track-event (service-role) yazar.
CREATE POLICY "admin_read_site_events" ON public.site_events FOR SELECT USING (is_admin_email());

-- ─── 2. admin_stats view — TEKİL ziyaretçi + sepete ekleme ───
-- page_views'tan distinct ip_hash ile gerçek (tekil) ziyaretçi sayılır.
-- NOT: Eski view'da kolon SIRASI farklı olduğu için CREATE OR REPLACE
--      "cannot change name of view column" hatası verir. Önce DROP et.
DROP VIEW IF EXISTS public.admin_stats;
CREATE VIEW public.admin_stats AS
SELECT
  (SELECT count(*) FROM public.products WHERE is_active = true)                          AS aktif_urun,
  (SELECT count(*) FROM public.products)                                                   AS toplam_urun,
  (SELECT count(*) FROM public.categories WHERE is_active = true)                         AS aktif_kategori,
  (SELECT count(*) FROM public.inquiries
   WHERE created_at > now() - interval '30 days')                                         AS son_30_gun_talep,
  (SELECT count(*) FROM public.inquiries)                                                  AS toplam_talep,
  -- Ham görüntülenme (eski uyumluluk)
  (SELECT count(*) FROM public.page_views
   WHERE created_at > now() - interval '30 days')                                         AS son_30_gun_ziyaret,
  (SELECT count(*) FROM public.page_views
   WHERE created_at > now() - interval '1 day')                                           AS bugun_ziyaret,
  (SELECT count(*) FROM public.page_views)                                                AS toplam_ziyaret,
  -- TEKİL ziyaretçi (distinct ip_hash) — gerçek kişi sayısına yakın
  (SELECT count(DISTINCT ip_hash) FROM public.page_views
   WHERE created_at > now() - interval '30 days' AND ip_hash IS NOT NULL)                 AS tekil_ziyaret_30g,
  (SELECT count(DISTINCT ip_hash) FROM public.page_views
   WHERE created_at > now() - interval '1 day' AND ip_hash IS NOT NULL)                   AS tekil_ziyaret_bugun,
  -- Sepete ekleme (gerçek etkileşim)
  (SELECT count(*) FROM public.site_events
   WHERE event_type = 'sepete_ekleme' AND created_at > now() - interval '30 days')        AS sepete_ekleme_30g,
  -- Diğer
  (SELECT count(*) FROM public.reviews WHERE is_hidden = false)                           AS toplam_yorum,
  (SELECT count(*) FROM public.blog_posts WHERE is_published = true)                      AS yayinda_blog;

GRANT SELECT ON public.admin_stats TO authenticated;
