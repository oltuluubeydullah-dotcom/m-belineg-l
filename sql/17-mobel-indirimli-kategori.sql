-- ════════════════════════════════════════════════════════════
-- 17 — İndirimli Kategori Bölümü (anasayfa, Nakit/Taksit üstü)
-- ════════════════════════════════════════════════════════════
-- Anasayfada "Koltuk %30, Yatak %25..." gibi büyük indirim kartları.
-- 4 kategori (koltuk-takimi, yatak-odasi, yemek-odasi, kose-koltuk)
-- için: indirim oranı + kapakta gösterilecek ürün admin'den seçilir.
--   • discount_percent: kartta yazan "%X'e VARAN" oranı (0 = kart gizli)
--   • discount_cover_product_id: kapak görseli için ürün (boşsa otomatik:
--     kategorinin ilk ürün görseli — kategori kartlarındaki mantığın aynısı)
-- Additive + nullable → güvenli, idempotent, geri dönülebilir.
-- by ubivo
-- ════════════════════════════════════════════════════════════

ALTER TABLE public.categories
  ADD COLUMN IF NOT EXISTS discount_percent smallint NOT NULL DEFAULT 0;

ALTER TABLE public.categories
  ADD COLUMN IF NOT EXISTS discount_cover_product_id uuid
  REFERENCES public.products(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_categories_discount_cover
  ON public.categories(discount_cover_product_id)
  WHERE discount_cover_product_id IS NOT NULL;

-- Varsayılan oranlar (fotoğraftaki gibi) — admin sonradan değiştirebilir.
-- Sadece henüz oran girilmemiş (0) olanlara yazılır → tekrar çalıştırma güvenli.
UPDATE public.categories SET discount_percent = 30
  WHERE slug = 'koltuk-takimi' AND discount_percent = 0;
UPDATE public.categories SET discount_percent = 25
  WHERE slug = 'yatak-odasi' AND discount_percent = 0;
UPDATE public.categories SET discount_percent = 20
  WHERE slug = 'yemek-odasi' AND discount_percent = 0;
UPDATE public.categories SET discount_percent = 30
  WHERE slug = 'kose-koltuk' AND discount_percent = 0;
