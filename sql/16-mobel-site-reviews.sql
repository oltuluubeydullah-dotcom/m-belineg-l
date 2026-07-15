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

-- ────────────────────────────────────────────────────────────
-- NOT: Örnek/seed yorumlar KALDIRILDI (başka firmaya aitti).
-- Yorumlar admin panelinden veya gerçek Google yorumlarıyla eklenir.
-- ────────────────────────────────────────────────────────────
