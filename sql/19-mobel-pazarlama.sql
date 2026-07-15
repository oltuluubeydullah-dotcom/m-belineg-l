-- ════════════════════════════════════════════════════════════
-- Möbel İnegöl — Migration 19: PAZARLAMA MERKEZİ
-- ════════════════════════════════════════════════════════════
-- 1) settings.tracking  — pixel ID'leri (Meta/TikTok/Google) admin'den
-- 2) UTM kolonları      — site_events + page_views (kampanya takibi)
-- 3) Kampanya özet view — admin paneldeki rapor
-- 4) Ürün SEO meta      — products.meta_title / meta_description
-- İdempotent — tekrar tekrar çalıştırılabilir.
-- ════════════════════════════════════════════════════════════

-- ─── 1. Tracking ayarları (tek jsonb kolon) ─────────────────
ALTER TABLE public.settings
  ADD COLUMN IF NOT EXISTS tracking jsonb NOT NULL DEFAULT '{}'::jsonb;

COMMENT ON COLUMN public.settings.tracking IS
  'Pazarlama pixel ID''leri: {meta_pixel_id, tiktok_pixel_id, google_ads_id, ga4_id}';

-- ─── 2. UTM kolonları ────────────────────────────────────────
ALTER TABLE public.site_events
  ADD COLUMN IF NOT EXISTS utm_source   text,
  ADD COLUMN IF NOT EXISTS utm_medium   text,
  ADD COLUMN IF NOT EXISTS utm_campaign text;

ALTER TABLE public.page_views
  ADD COLUMN IF NOT EXISTS utm_source   text,
  ADD COLUMN IF NOT EXISTS utm_medium   text,
  ADD COLUMN IF NOT EXISTS utm_campaign text;

CREATE INDEX IF NOT EXISTS idx_site_events_utm
  ON public.site_events(utm_source, created_at DESC)
  WHERE utm_source IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_page_views_utm
  ON public.page_views(utm_source, created_at DESC)
  WHERE utm_source IS NOT NULL;

-- ─── 3. Kampanya özet view (son 30 gün) ─────────────────────
CREATE OR REPLACE VIEW public.pazarlama_kampanya_ozeti AS
SELECT
  COALESCE(pv.utm_source, se.utm_source)     AS kaynak,
  COALESCE(pv.utm_campaign, se.utm_campaign) AS kampanya,
  COALESCE(pv.ziyaret, 0)                    AS ziyaret,
  COALESCE(se.whatsapp, 0)                   AS whatsapp_tiklama,
  COALESCE(se.sepet, 0)                      AS sepete_ekleme
FROM (
  SELECT utm_source, utm_campaign, count(DISTINCT COALESCE(ip_hash, id::text)) AS ziyaret
  FROM public.page_views
  WHERE utm_source IS NOT NULL AND created_at > now() - interval '30 days'
  GROUP BY 1, 2
) pv
FULL OUTER JOIN (
  SELECT utm_source, utm_campaign,
         count(*) FILTER (WHERE event_type = 'whatsapp_tiklama') AS whatsapp,
         count(*) FILTER (WHERE event_type = 'sepete_ekleme')    AS sepet
  FROM public.site_events
  WHERE utm_source IS NOT NULL AND created_at > now() - interval '30 days'
  GROUP BY 1, 2
) se ON pv.utm_source = se.utm_source
     AND COALESCE(pv.utm_campaign, '') = COALESCE(se.utm_campaign, '');

-- View'lar RLS'ten geçmez; sadece service_role/admin erişsin:
REVOKE ALL ON public.pazarlama_kampanya_ozeti FROM anon, authenticated;

-- ─── 4. Ürün SEO meta alanları ──────────────────────────────
ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS meta_title       text,
  ADD COLUMN IF NOT EXISTS meta_description text;

COMMENT ON COLUMN public.products.meta_title IS
  'SEO: Google''da görünen başlık (boşsa ürün adı kullanılır)';
COMMENT ON COLUMN public.products.meta_description IS
  'SEO: Google''da görünen açıklama (boşsa ürün açıklamasından üretilir)';
