-- ════════════════════════════════════════════════════════════
-- 15 — Kategori kapak ürünü (cover_product_id)
-- ════════════════════════════════════════════════════════════
-- Her kategori için kapakta gösterilecek ürünü admin elle seçebilir.
-- Seçilmezse → mevcut otomatik davranış (kategorinin ilk ürün görseli).
-- Additive + nullable + ON DELETE SET NULL → güvenli, geri dönülebilir.
-- by ubivo
-- ════════════════════════════════════════════════════════════

ALTER TABLE public.categories
  ADD COLUMN IF NOT EXISTS cover_product_id uuid
  REFERENCES public.products(id) ON DELETE SET NULL;

-- Seçili kapak ürününün görselini hızlı çekmek için index
CREATE INDEX IF NOT EXISTS idx_categories_cover_product
  ON public.categories(cover_product_id)
  WHERE cover_product_id IS NOT NULL;
