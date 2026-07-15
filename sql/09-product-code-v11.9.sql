-- ════════════════════════════════════════════════════════════
-- Möbel İnegöl — v11.9 PRODUCT_CODE MIGRATION
-- ════════════════════════════════════════════════════════════
-- TARİH: 2026-05-22
-- AMAÇ: products tablosuna 'product_code' (ürün kodu) alanı ekle.
--       Admin panelinden serbest yazılır. Anasayfa ürün kartlarında
--       ve ürün detay sayfasında müşteriye gösterilir.
--
-- ÇALIŞTIRMA:
--   Supabase Dashboard → SQL Editor → bu dosyayı yapıştır → Run.
--   İdempotent: defalarca çalıştırılabilir.
-- ════════════════════════════════════════════════════════════

-- 1) Kolon ekle (nullable — eski ürünlerde boş kalır)
ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS product_code TEXT;

-- 2) İsteğe bağlı index (admin'de arama için)
CREATE INDEX IF NOT EXISTS idx_products_product_code
  ON public.products(product_code)
  WHERE product_code IS NOT NULL;

-- 3) Comment (admin için doc)
COMMENT ON COLUMN public.products.product_code IS
  'Ürün kodu/SKU — admin tarafından serbest yazılır. Site kartlarında gösterilir.';


-- ─── DOĞRULAMA ───────────────────────────────────────────────
-- Aşağıdaki sorgu kolonun eklendiğini doğrular:
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'products'
  AND column_name = 'product_code';

-- ════════════════════════════════════════════════════════════
-- SONRAKİ ADIM:
--   1) v11.9 kodu push edilir (admin form + kart + detay)
--   2) Admin panel → Ürünler → her ürünü düzenle → "Ürün Kodu" gir
--   3) Kaydet → site anında günceller
-- ════════════════════════════════════════════════════════════
