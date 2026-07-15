-- ════════════════════════════════════════════════════════════
-- Migration 05 — Müşteri Yorumları + Ürün Görüntülenme Analitiği
-- ════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS public.reviews (
  id          uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id  uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  name        text NOT NULL CHECK (length(name) BETWEEN 2 AND 60),
  rating      smallint NOT NULL CHECK (rating BETWEEN 1 AND 5),
  text        text NOT NULL CHECK (length(text) BETWEEN 5 AND 1000),
  locale      text NOT NULL DEFAULT 'tr',
  is_hidden   boolean NOT NULL DEFAULT false,
  is_verified boolean NOT NULL DEFAULT false,
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_reviews_product_visible
  ON public.reviews(product_id, is_hidden, created_at DESC);

ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read reviews" ON public.reviews;
CREATE POLICY "Public read reviews" ON public.reviews
  FOR SELECT USING (is_hidden = false);

DROP POLICY IF EXISTS "Public insert reviews" ON public.reviews;
-- GÜVENLİK (v30): Anon doğrudan INSERT KALDIRILDI.
-- Yorumlar yalnızca /api/reviews (service-role) üzerinden eklenir:
-- böylece rate-limit + küfür filtresi + ürün-var-mı kontrolü ZORUNLU olur.
-- (Eski "Public insert reviews WITH CHECK(true)" açık spam vektörüydü.)

DROP POLICY IF EXISTS "Admin manage reviews" ON public.reviews;
CREATE POLICY "Admin manage reviews" ON public.reviews
  FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

-- ─── Ürün görüntülenme sayacı ───
ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS view_count integer NOT NULL DEFAULT 0;

CREATE OR REPLACE FUNCTION public.increment_product_view(p_id uuid)
RETURNS void
LANGUAGE sql
SECURITY DEFINER
AS $$
  UPDATE public.products SET view_count = view_count + 1 WHERE id = p_id;
$$;

GRANT EXECUTE ON FUNCTION public.increment_product_view(uuid) TO anon, authenticated;

CREATE INDEX IF NOT EXISTS idx_products_view_count
  ON public.products(view_count DESC) WHERE is_active = true;
