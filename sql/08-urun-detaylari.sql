-- ════════════════════════════════════════════════════════════
-- Möbel İnegöl — v11.0 Ürün Detay Genişletme
-- ════════════════════════════════════════════════════════════
-- products tablosuna `details` JSONB kolonu ekler.
-- İçerik:
--   {
--     "parts": [{"ad": "Üçlü Koltuk", "fiyat": 44550, "varsayilan": true}],
--     "dimensions": [{"ad": "Üçlü", "genislik": "250 cm", "yukseklik": "85 cm", "derinlik": "103 cm"}],
--     "bullets": ["İnegöl'de üretilmektedir", "2 adet üçlü koltuk", ...]
--   }
--
-- Idempotent. Defalarca çalıştırılabilir.
-- ════════════════════════════════════════════════════════════

ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS details JSONB NOT NULL DEFAULT '{}'::jsonb;

COMMENT ON COLUMN public.products.details IS
  'Ürün detay paneli için yapısal veri: parts (parça fiyatlandırma), dimensions (ölçüler), bullets (açıklama maddeleri)';

-- Doğrulama
SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'products'
  AND column_name = 'details';
