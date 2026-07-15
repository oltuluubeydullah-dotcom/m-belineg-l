-- ════════════════════════════════════════════════════════════
-- Migration v12.7 — search_vector'a product_code ekle
-- ════════════════════════════════════════════════════════════
-- Önce: arama sadece name + description'ı kapsıyordu
-- Sonra: name + description + product_code (ürün kodu)
--
-- Firma sahibi ürün koduyla daha hızlı bulabilsin diye.
-- Idempotent — defalarca çalıştırılabilir.
-- ════════════════════════════════════════════════════════════

-- 1) Eski generated kolonu drop et (yeniden tanımlamak için zorunlu)
ALTER TABLE public.products DROP COLUMN IF EXISTS search_vector;

-- 2) Yeni search_vector — product_code dahil
ALTER TABLE public.products
  ADD COLUMN search_vector tsvector
  GENERATED ALWAYS AS (
    to_tsvector(
      'simple',
      public.normalize_tr(name) || ' ' ||
      public.normalize_tr(coalesce(description, '')) || ' ' ||
      public.normalize_tr(coalesce(product_code, ''))
    )
  ) STORED;

-- 3) GIN index'i yeniden oluştur
DROP INDEX IF EXISTS idx_products_search_vector;
CREATE INDEX idx_products_search_vector
  ON public.products USING GIN (search_vector);

-- ─── Test ─────────────────────────────────────────────
-- Ürün koduyla aramayı test et:
-- SELECT name, product_code FROM products
-- WHERE search_vector @@ plainto_tsquery('simple', normalize_tr('mbs-007'))
-- LIMIT 5;
--
-- Sonuç: ürün kodu eşleşen ürünler dönmeli
-- ════════════════════════════════════════════════════════════
