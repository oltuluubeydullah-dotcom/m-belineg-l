-- ════════════════════════════════════════════════════════════
-- Migration 03 — Full-Text Search (tsvector + GIN index)
-- ════════════════════════════════════════════════════════════
-- Bu dosyayı Supabase Dashboard → SQL Editor'a yapıştırıp Run.
-- products tablosuna full-text arama desteği ekler.
--
-- Önce/Sonra:
--   Önce: ilike '%koltuk%'  → tablo tarar, yavaş (10k+ üründe sorun)
--   Sonra: tsvector + GIN   → milisaniye, büyük katalog için hazır
--
-- Türkçe aksanları normalize için unaccent extension.
-- ════════════════════════════════════════════════════════════

-- ─── 1) Gerekli extension ────
CREATE EXTENSION IF NOT EXISTS unaccent;

-- ─── 2) Türkçe + aksansız text helper fonksiyonu ────
-- "Köşe Koltuk" → "kose koltuk"
CREATE OR REPLACE FUNCTION public.normalize_tr(t text)
RETURNS text
LANGUAGE sql
IMMUTABLE
AS $$
  SELECT lower(unaccent(coalesce(t, '')));
$$;

-- ─── 3) products tablosuna search_vector kolonu ekle ────
-- GENERATED ALWAYS: name + description otomatik birleşir, manuel UPDATE gerek yok.
ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS search_vector tsvector
  GENERATED ALWAYS AS (
    to_tsvector(
      'simple',
      public.normalize_tr(name) || ' ' || public.normalize_tr(coalesce(description, ''))
    )
  ) STORED;

-- ─── 4) GIN index (hızlı arama için kritik) ────
CREATE INDEX IF NOT EXISTS idx_products_search_vector
  ON public.products USING GIN (search_vector);

-- ─── 5) Test sorgusu ────
-- SELECT name FROM products
-- WHERE search_vector @@ plainto_tsquery('simple', normalize_tr('köşe koltuk'))
-- LIMIT 5;

-- ─── DONE ────
-- Migration başarılı. Arama API'sı artık tsvector kullanabilir.
