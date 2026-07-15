-- ════════════════════════════════════════════════════════════
-- Möbel İnegöl — Migration 11
-- Ziyaretçi Analitiği + Favoriler + Blog Kategorisi
-- ════════════════════════════════════════════════════════════

-- ─── 1. Sayfa Ziyaretçi Analitiği ───────────────────────────
CREATE TABLE IF NOT EXISTS public.page_views (
  id          uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  path        text NOT NULL,
  referrer    text,
  user_agent  text,
  ip_hash     text,  -- SHA256 ile hash'lenmiş, KVKK uyumlu
  locale      text DEFAULT 'tr',
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_page_views_path    ON public.page_views(path, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_page_views_date    ON public.page_views(created_at DESC);
-- NOT: date_trunc index yerine created_at DESC yeterli (IMMUTABLE hatası önlendi)

ALTER TABLE public.page_views ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon insert page_views"  ON public.page_views;
DROP POLICY IF EXISTS "admin read page_views"   ON public.page_views;
DROP POLICY IF EXISTS "admin_read_page_views"   ON public.page_views;
-- GÜVENLİK (v30): Anon INSERT KALDIRILDI — sadece /api/track-view (service-role) yazar.
-- Okuma sadece admin (is_admin_email — herhangi bir kayıtlı kullanıcı DEĞİL).
CREATE POLICY "admin_read_page_views" ON public.page_views FOR SELECT USING (is_admin_email());

-- ─── 2. Ürün Favorileri ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.product_favorites (
  id          uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id  uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  session_id  text NOT NULL,  -- tarayıcı session (cookie)
  created_at  timestamptz NOT NULL DEFAULT now(),
  UNIQUE(product_id, session_id)
);

CREATE INDEX IF NOT EXISTS idx_favorites_product ON public.product_favorites(product_id);
CREATE INDEX IF NOT EXISTS idx_favorites_session ON public.product_favorites(session_id);

ALTER TABLE public.product_favorites ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon manage favorites"  ON public.product_favorites;
DROP POLICY IF EXISTS "admin read favorites"   ON public.product_favorites;
DROP POLICY IF EXISTS "admin_read_favorites"   ON public.product_favorites;
-- GÜVENLİK (v30): Anon ALL KALDIRILDI — sadece /api/favorite (service-role) yazar.
CREATE POLICY "admin_read_favorites" ON public.product_favorites FOR SELECT USING (is_admin_email());

-- ─── 3. Ürünlere favorite_count kolonunu ekle ─────────────────
ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS favorite_count integer NOT NULL DEFAULT 0;

CREATE INDEX IF NOT EXISTS idx_products_favorite_count
  ON public.products(favorite_count DESC) WHERE is_active = true;

-- ─── 4. Favori sayacı trigger ────────────────────────────────
CREATE OR REPLACE FUNCTION public.sync_favorite_count()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.products SET favorite_count = favorite_count + 1 WHERE id = NEW.product_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.products SET favorite_count = GREATEST(0, favorite_count - 1) WHERE id = OLD.product_id;
  END IF;
  RETURN NULL;
END;
$$;

DROP TRIGGER IF EXISTS trg_sync_favorite_count ON public.product_favorites;
CREATE TRIGGER trg_sync_favorite_count
  AFTER INSERT OR DELETE ON public.product_favorites
  FOR EACH ROW EXECUTE FUNCTION public.sync_favorite_count();

-- ─── 5. Blog kategorisi kolonu ────────────────────────────────
ALTER TABLE public.blog_posts
  ADD COLUMN IF NOT EXISTS category text NOT NULL DEFAULT 'genel'
    CHECK (category IN ('dekorasyon', 'satin-alma-rehberi', 'bakim-onarim', 'yasam-tarzlari', 'genel'));

ALTER TABLE public.blog_posts
  ADD COLUMN IF NOT EXISTS cover_image text;    -- Admin panelden yüklenen kapak görseli

ALTER TABLE public.blog_posts
  ADD COLUMN IF NOT EXISTS read_time_min integer NOT NULL DEFAULT 5;

ALTER TABLE public.blog_posts
  ADD COLUMN IF NOT EXISTS tags text[] NOT NULL DEFAULT '{}';

ALTER TABLE public.blog_posts
  ADD COLUMN IF NOT EXISTS view_count integer NOT NULL DEFAULT 0;

CREATE INDEX IF NOT EXISTS idx_blog_category    ON public.blog_posts(category);
CREATE INDEX IF NOT EXISTS idx_blog_view_count  ON public.blog_posts(view_count DESC);

-- ─── 6. Blog görüntülenme artırma fonksiyonu ─────────────────
CREATE OR REPLACE FUNCTION public.increment_blog_view(p_id uuid)
RETURNS void LANGUAGE sql SECURITY DEFINER AS $$
  UPDATE public.blog_posts SET view_count = view_count + 1 WHERE id = p_id;
$$;

GRANT EXECUTE ON FUNCTION public.increment_blog_view(uuid) TO anon, authenticated;

-- ─── 7. Supabase Keep-Alive — hareketsiz hesap koruması ───────
-- Bu fonksiyon her gün otomatik çağrılır (pg_cron veya Supabase Edge Function)
-- Supabase free tier'ı 90 günde bir kapanır. Bu bunu önler.
CREATE OR REPLACE FUNCTION public.keepalive_ping()
RETURNS json LANGUAGE sql SECURITY DEFINER AS $$
  SELECT json_build_object(
    'status', 'alive',
    'ts', now(),
    'products', (SELECT count(*) FROM public.products WHERE is_active = true),
    'categories', (SELECT count(*) FROM public.categories WHERE is_active = true)
  );
$$;

GRANT EXECUTE ON FUNCTION public.keepalive_ping() TO anon, authenticated;

-- ─── 8. Hızlı istatistik view ────────────────────────────────
CREATE OR REPLACE VIEW public.admin_stats AS
SELECT
  (SELECT count(*) FROM public.products WHERE is_active = true)         AS aktif_urun,
  (SELECT count(*) FROM public.products)                                  AS toplam_urun,
  (SELECT count(*) FROM public.categories WHERE is_active = true)        AS aktif_kategori,
  (SELECT count(*) FROM public.inquiries
   WHERE created_at > now() - interval '30 days')                        AS son_30_gun_talep,
  (SELECT count(*) FROM public.inquiries)                                 AS toplam_talep,
  (SELECT count(*) FROM public.page_views
   WHERE created_at > now() - interval '30 days')                        AS son_30_gun_ziyaret,
  (SELECT count(*) FROM public.page_views
   WHERE created_at > now() - interval '1 day')                          AS bugun_ziyaret,
  (SELECT count(*) FROM public.page_views)                               AS toplam_ziyaret,
  (SELECT count(*) FROM public.reviews WHERE is_hidden = false)           AS toplam_yorum,
  (SELECT count(*) FROM public.blog_posts WHERE is_published = true)      AS yayinda_blog;

-- Admin erişimi
GRANT SELECT ON public.admin_stats TO authenticated;
