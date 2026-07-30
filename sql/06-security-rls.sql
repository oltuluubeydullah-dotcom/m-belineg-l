-- ════════════════════════════════════════════════════════════
-- Möbel İnegöl — Migration 06: Güvenlik & RLS
-- ════════════════════════════════════════════════════════════
-- ÇALIŞTIRMA SIRASI: 05-reviews-and-analytics.sql'den SONRA
--
-- İÇERİK:
--   1) is_admin_email() fonksiyonu — email allowlist tabanlı admin doğrulama
--   2) inquiries RLS — anon INSERT'i API üzerinden zorunlu kıl
--   3) reviews RLS — admin write email allowlist ile kısıtla
--   4) products / categories okuma policy'leri
--   5) content_pages admin write policy'leri
--
-- NOT: İdempotent — defalarca çalıştırılabilir.
-- ════════════════════════════════════════════════════════════


-- ─── 1. Admin email doğrulama fonksiyonu ─────────────────────────
-- ADMIN_EMAILS env değişkeninden okur (virgülle ayrılmış liste)
-- Yoksa fallback: info@mobelinegol.com
-- ADMIN DOĞRULAMA — Supabase'de "ALTER DATABASE SET" yasak olduğu için
-- admin e-postaları doğrudan bu SECURITY DEFINER fonksiyonda tanımlı.
-- 👉 Admin eklemek/çıkarmak için aşağıdaki diziyi düzenle (Vercel ADMIN_EMAILS ile AYNI tut).
CREATE OR REPLACE FUNCTION public.is_admin_email()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM auth.users
    WHERE id = auth.uid()
      AND email_confirmed_at IS NOT NULL  -- Onaylanmamış e-posta admin OLAMAZ
      AND lower(email) = ANY (ARRAY[
        'mobelinegol16@gmail.com'           -- 👈 admin 1
        -- ,'ikinci@admin.com'             --   admin 2 (gerekirse aç)
      ]::text[])
  );
$$;

-- ─── 2. Inquiries (Müşteri Talepleri) RLS ────────────────────────
-- Anon kullanıcı direkt Supabase REST'e POST yapamasın
-- Sadece /api/inquiries (service-role) yazabilir
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon insert inquiries"         ON public.inquiries;
DROP POLICY IF EXISTS "public insert inquiries"       ON public.inquiries;
DROP POLICY IF EXISTS "anyone can insert"             ON public.inquiries;
DROP POLICY IF EXISTS "admin read inquiries"          ON public.inquiries;
DROP POLICY IF EXISTS "Admin manage inquiries"        ON public.inquiries;
-- GÜVENLİK FIX (v57 · Agent #07 H-1): 01-schema.sql anon INSERT policy'sini
-- gerçek adıyla düşür — yoksa anon key ile /api/inquiries bypass edilip
-- doğrudan REST INSERT yapılabiliyordu (rate-limit/KVKK/fiyat recompute atlanır).
DROP POLICY IF EXISTS "inquiries_insert_public"        ON public.inquiries;

-- Okuma: sadece admin
CREATE POLICY "admin_read_inquiries"
  ON public.inquiries FOR SELECT
  USING (is_admin_email());

-- Yazma: service-role (API route'dan) bypass eder, başkası yazamaz
-- (INSERT policy yok = hiçbir anon/authenticated yazamaz, sadece service-role)


-- ─── 3. Reviews RLS ──────────────────────────────────────────────
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon insert reviews"           ON public.reviews;
DROP POLICY IF EXISTS "public insert reviews"         ON public.reviews;
DROP POLICY IF EXISTS "Admin manage reviews"          ON public.reviews;
DROP POLICY IF EXISTS "admin_manage_reviews"          ON public.reviews;
DROP POLICY IF EXISTS "anyone can insert reviews"     ON public.reviews;

-- Okuma: herkes onaylanmış yorumları görebilir
DROP POLICY IF EXISTS "public read approved reviews"  ON public.reviews;
CREATE POLICY "public_read_reviews"
  ON public.reviews FOR SELECT
  USING (is_hidden = false);

-- Admin tam erişim
CREATE POLICY "admin_manage_reviews"
  ON public.reviews FOR ALL
  USING (is_admin_email())
  WITH CHECK (is_admin_email());


-- ─── 4. Products & Categories okuma ─────────────────────────────
ALTER TABLE public.products   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- Herkes aktif ürünleri okuyabilir
DROP POLICY IF EXISTS "public read active products"  ON public.products;
CREATE POLICY "public_read_products"
  ON public.products FOR SELECT
  USING (is_active = true);

-- Admin tam erişim (CRUD)
DROP POLICY IF EXISTS "admin manage products"        ON public.products;
DROP POLICY IF EXISTS "Admin manage products"        ON public.products;
CREATE POLICY "admin_manage_products"
  ON public.products FOR ALL
  USING (is_admin_email())
  WITH CHECK (is_admin_email());

-- Herkes aktif kategorileri okuyabilir
DROP POLICY IF EXISTS "public read categories"       ON public.categories;
CREATE POLICY "public_read_categories"
  ON public.categories FOR SELECT
  USING (is_active = true);

-- Admin tam erişim
DROP POLICY IF EXISTS "admin manage categories"      ON public.categories;
DROP POLICY IF EXISTS "Admin manage categories"      ON public.categories;
CREATE POLICY "admin_manage_categories"
  ON public.categories FOR ALL
  USING (is_admin_email())
  WITH CHECK (is_admin_email());


-- ─── 5. content_pages ────────────────────────────────────────────
ALTER TABLE public.content_pages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public read content_pages"    ON public.content_pages;
CREATE POLICY "public_read_content_pages"
  ON public.content_pages FOR SELECT
  USING (is_published = true);

DROP POLICY IF EXISTS "Admin write content_pages"    ON public.content_pages;
DROP POLICY IF EXISTS "admin write content_pages"    ON public.content_pages;
CREATE POLICY "admin_write_content_pages"
  ON public.content_pages FOR ALL
  USING (is_admin_email())
  WITH CHECK (is_admin_email());


-- ─── 6. hero_banners ─────────────────────────────────────────────
ALTER TABLE public.hero_banners ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public read hero_banners"     ON public.hero_banners;
CREATE POLICY "public_read_hero_banners"
  ON public.hero_banners FOR SELECT
  USING (is_active = true);

DROP POLICY IF EXISTS "admin manage hero_banners"    ON public.hero_banners;
DROP POLICY IF EXISTS "Admin manage hero_banners"    ON public.hero_banners;
CREATE POLICY "admin_manage_hero_banners"
  ON public.hero_banners FOR ALL
  USING (is_admin_email())
  WITH CHECK (is_admin_email());


-- ─── 7. settings ─────────────────────────────────────────────────
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public read settings"         ON public.settings;
CREATE POLICY "public_read_settings"
  ON public.settings FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "admin manage settings"        ON public.settings;
DROP POLICY IF EXISTS "Admin manage settings"        ON public.settings;
CREATE POLICY "admin_manage_settings"
  ON public.settings FOR ALL
  USING (is_admin_email())
  WITH CHECK (is_admin_email());


-- ─── 8. blog_posts ────────────────────────────────────────────────
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public read blog_posts"       ON public.blog_posts;
CREATE POLICY "public_read_blog_posts"
  ON public.blog_posts FOR SELECT
  USING (is_published = true);

DROP POLICY IF EXISTS "admin manage blog_posts"      ON public.blog_posts;
DROP POLICY IF EXISTS "Admin manage blog_posts"      ON public.blog_posts;
CREATE POLICY "admin_manage_blog_posts"
  ON public.blog_posts FOR ALL
  USING (is_admin_email())
  WITH CHECK (is_admin_email());


-- ─── Son: v13.0 HOTFIX içeriği entegre edildi ────────────────────
-- HOTFIX-RLS-v13.0-SECURITY.sql artık bu dosyaya dahil.
-- archive/ klasöründe yedek olarak durmaktadır.
