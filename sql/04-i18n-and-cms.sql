-- ════════════════════════════════════════════════════════════
-- Migration 04 — i18n: Translations JSONB columns (v10.0)
-- ════════════════════════════════════════════════════════════
-- Supabase Dashboard → SQL Editor → Run.
--
-- products, categories ve blog_posts tablolarına translations
-- JSONB kolonu ekler. Format:
--   { "en": { "name": "...", "description": "..." },
--     "de": { "name": "...", "description": "..." } }
--
-- Mevcut name/description Turkish kalır (default locale = tr).
-- ════════════════════════════════════════════════════════════

-- ─── 1) Products tablosu ────
ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS translations jsonb NOT NULL DEFAULT '{}'::jsonb;

CREATE INDEX IF NOT EXISTS idx_products_translations
  ON public.products USING GIN (translations);

-- ─── 2) Categories tablosu ────
ALTER TABLE public.categories
  ADD COLUMN IF NOT EXISTS translations jsonb NOT NULL DEFAULT '{}'::jsonb;

CREATE INDEX IF NOT EXISTS idx_categories_translations
  ON public.categories USING GIN (translations);

-- ─── 3) Blog posts tablosu ────
ALTER TABLE public.blog_posts
  ADD COLUMN IF NOT EXISTS translations jsonb NOT NULL DEFAULT '{}'::jsonb;

CREATE INDEX IF NOT EXISTS idx_blog_posts_translations
  ON public.blog_posts USING GIN (translations);

-- ─── 4) Settings — çoklu dil duyuru bandı için ────
-- announcement_bar_text artık JSONB olabilir, ama uyumluluk için sütun ekleyelim
ALTER TABLE public.settings
  ADD COLUMN IF NOT EXISTS announcement_bar_translations jsonb NOT NULL DEFAULT '{}'::jsonb;

-- ─── 5) CMS — Statik sayfalar (Hakkımızda, KVKK vs) için ────
CREATE TABLE IF NOT EXISTS public.content_pages (
  id            uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug          text NOT NULL UNIQUE,        -- 'hakkimizda', 'kvkk', 'gizlilik' vb
  title         text NOT NULL,
  content       text NOT NULL,               -- Markdown (TR default)
  translations  jsonb NOT NULL DEFAULT '{}'::jsonb,  -- { en: {title, content}, de: {...} }
  meta_title    text,
  meta_desc     text,
  is_published  boolean NOT NULL DEFAULT true,
  updated_at    timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_content_pages_slug ON public.content_pages(slug);

-- ─── 6) Hero banners (CMS-ified) ────
CREATE TABLE IF NOT EXISTS public.hero_banners (
  id            uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  kind          text NOT NULL CHECK (kind IN ('simdi', 'teklif', 'avrupa', 'custom')),
  sort_order    integer NOT NULL DEFAULT 0,
  is_active     boolean NOT NULL DEFAULT true,
  -- TR default
  kicker        text,
  title         text,
  title_em      text,
  body          text,
  cta_label     text,
  cta_url       text,
  -- Translations
  translations  jsonb NOT NULL DEFAULT '{}'::jsonb,
  -- Görsel (opsiyonel, SVG arka planlar dahili çiziliyor)
  bg_image_url  text,
  updated_at    timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_hero_banners_active_sort
  ON public.hero_banners(is_active, sort_order);

-- ─── 7) WhatsApp Mesaj Şablonları ────
CREATE TABLE IF NOT EXISTS public.whatsapp_templates (
  id            uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  key           text NOT NULL UNIQUE,        -- 'support', 'product_inquiry', 'cart_checkout'
  template_tr   text NOT NULL,
  template_en   text,
  template_de   text,
  description   text,                        -- Admin için açıklama
  updated_at    timestamptz NOT NULL DEFAULT now()
);

-- Default şablonları ekle (idempotent)
INSERT INTO public.whatsapp_templates (key, template_tr, template_en, template_de, description)
VALUES
  ('support',
   'Merhaba, web sitenizden iletişime geçtim. Yardımcı olabilir misiniz?',
   'Hello, I''m reaching out from your website. Could you help me?',
   'Hallo, ich melde mich über Ihre Website. Können Sie mir helfen?',
   'Genel destek talebi — floating button + footer'),
  ('product_inquiry',
   'Merhaba, "{urun}" ürünü hakkında bilgi almak istiyorum.',
   'Hello, I''d like information about the "{urun}" product.',
   'Hallo, ich hätte gerne Informationen zum Produkt "{urun}".',
   'Ürün detay sayfasında — {urun} ile ürün ismi yerleştirilir'),
  ('cart_checkout',
   'Merhaba, sepetimi onaylamak istiyorum. Detaylar mesajda.',
   'Hello, I''d like to confirm my cart. Details below.',
   'Hallo, ich möchte meinen Warenkorb bestätigen. Details siehe unten.',
   'Sepet onay sayfasında — WhatsApp mesaj başlığı')
ON CONFLICT (key) DO NOTHING;

-- ─── 8) Default Hero banner kayıtları ────
-- DEVRE DIŞI (v25): Hero artık koddaki 4-slide fallback ile yönetiliyor
-- (yasam, yatak, nakliye, kargo). DB'ye banner eklenirse kod fallback'i
-- devre dışı kalır ve eski/uyumsuz kind'lar tek slide olarak görünür.
-- Bu yüzden default banner INSERT'leri kapatıldı.
--
-- INSERT INTO public.hero_banners (kind, sort_order, kicker, title, title_em, body, cta_label, cta_url, translations)
-- SELECT 'simdi', 1,
--   'Zamlardan etkilenmeden indirimli fiyatlarla',
--   'ŞİMDİ', 'ALIN!',
--   'Depomuzda bekletelim, istediğiniz zaman teslim',
--   NULL, NULL,
--   '{}'::jsonb
-- WHERE NOT EXISTS (SELECT 1 FROM public.hero_banners WHERE kind = 'simdi');
--
-- INSERT INTO public.hero_banners (kind, sort_order, kicker, title, title_em, body, cta_label, cta_url, translations)
-- SELECT 'teklif', 2,
--   'Avantajlı fiyat ve ödeme koşullarıyla',
--   'En İyi', 'Teklif',
--   'Tüm mobilya modellerimizde en iyi fiyat teklifi için hemen bizimle iletişime geçin!',
--   'İletişim Hattı', '#whatsapp',
--   '{}'::jsonb
-- WHERE NOT EXISTS (SELECT 1 FROM public.hero_banners WHERE kind = 'teklif');
--
-- INSERT INTO public.hero_banners (kind, sort_order, kicker, title, title_em, body, cta_label, cta_url, translations)
-- SELECT 'avrupa', 3,
--   NULL,
--   'İnegöl''den Avrupa''ya', 'Kapınıza Teslim',
--   NULL, NULL, NULL,
--   '{}'::jsonb
-- WHERE NOT EXISTS (SELECT 1 FROM public.hero_banners WHERE kind = 'avrupa');

-- ─── 9) Default content_pages kayıtları ────
INSERT INTO public.content_pages (slug, title, content, is_published)
VALUES
  ('hakkimizda', 'Hakkımızda', E'## Köklü Geleneğin Modern Yüzü\n\nMöbel İnegöl, **Türkiye''nin mobilya başkenti İnegöl''ün** köklü ustalık kültüründen doğdu. Yıllardır süregelen aile birikimimizi modern tasarım anlayışıyla harmanlayarak, evinizin her köşesine değer katacak mobilyalar üretiyoruz.\n\nHer üretim adımında üç temel ilkeye bağlı kalıyoruz: **kalite**, **estetik** ve **güven**. Türkiye''nin her iline ve Avrupa''daki gurbetçi ailelerimize özenli teslimat sunuyoruz.\n\n📞 +90 534 306 65 92  📧 info@mobelinegol.com', true),
  ('teslimat-kurulum', 'Teslimat ve Kurulum', E'# Teslimat ve Kurulum\n\nTüm Türkiye + Avrupa''ya teslimat. Profesyonel kurulum hizmeti.', true),
  ('garanti-iade', 'Garanti ve İade', E'# Garanti ve İade\n\n2 yıl fabrikasyon garantisi. İade koşulları için iletişime geçin.', true),
  ('gizlilik', 'Gizlilik ve Çerez Politikası', E'# Gizlilik ve Çerez Politikası\n\nKişisel verileriniz KVKK kapsamında korunur. Detaylar...', true),
  ('kvkk', 'KVKK Aydınlatma Metni', E'# KVKK Aydınlatma Metni\n\n6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamında...', true),
  ('satis-sozlesmesi', 'Mesafeli Satış Sözleşmesi', E'# Mesafeli Satış Sözleşmesi\n\nBu sözleşme...', true)
ON CONFLICT (slug) DO NOTHING;

-- ─── 10) RLS — Public okuma, admin yazma ────
ALTER TABLE public.content_pages   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hero_banners    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.whatsapp_templates ENABLE ROW LEVEL SECURITY;

-- Public okuma
DROP POLICY IF EXISTS "Public read content_pages" ON public.content_pages;
CREATE POLICY "Public read content_pages" ON public.content_pages
  FOR SELECT USING (is_published = true);

DROP POLICY IF EXISTS "Public read hero_banners" ON public.hero_banners;
CREATE POLICY "Public read hero_banners" ON public.hero_banners
  FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Public read whatsapp_templates" ON public.whatsapp_templates;
CREATE POLICY "Public read whatsapp_templates" ON public.whatsapp_templates
  FOR SELECT USING (true);

-- Admin (authenticated) yazma
DROP POLICY IF EXISTS "Admin write content_pages" ON public.content_pages;
CREATE POLICY "Admin write content_pages" ON public.content_pages
  FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admin write hero_banners" ON public.hero_banners;
CREATE POLICY "Admin write hero_banners" ON public.hero_banners
  FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admin write whatsapp_templates" ON public.whatsapp_templates;
CREATE POLICY "Admin write whatsapp_templates" ON public.whatsapp_templates
  FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

-- ─── DONE ────
