-- ════════════════════════════════════════════════════════════
-- Möbel İnegöl — SECURITY MIGRATION 03 (v30) — CANLI DB HARDENING
-- ════════════════════════════════════════════════════════════
-- CANLIDAKİ (v26) Supabase'e uygulanır. Denetimdeki tüm KRİTİK + RLS
-- bulgularını tek seferde kapatır.
--
-- ⚠️ ÇALIŞTIRMA SIRASI:
--    1) ÖNCE  → sql/15-analytics-events.sql   (site_events tablosunu oluşturur)
--    2) SONRA → BU DOSYA
--    (Bu script SAVUNMACI yazıldı: bir tablo yoksa o bloğu ATLAR, hata
--     vermez. Yine de site_events'in v30 track-event için var olması gerekir.)
--
-- Tamamen idempotent — defalarca çalıştırılabilir.
-- NEREDE: Supabase Dashboard → SQL Editor → tümünü yapıştır → Run.
-- ════════════════════════════════════════════════════════════


-- ─── 1+2) KRİTİK-1: Admin doğrulama ───
-- Supabase managed'da "ALTER DATABASE ... SET app.admin_emails" YASAK (hata 42501),
-- çünkü postgres rolü gerçek superuser değil. Bu yüzden GUC yerine admin
-- e-postaları doğrudan SECURITY DEFINER fonksiyonun içinde tanımlanır
-- (Supabase'de standart, güvenli yöntem — e-posta zaten gizli değil).
--
-- 👉 ADMIN E-POSTALARINI BURADAN YÖNET (Vercel ADMIN_EMAILS ile AYNI olmalı).
--    Yeni admin eklemek için diziye virgülle satır ekle.
CREATE OR REPLACE FUNCTION public.is_admin_email()
RETURNS boolean
LANGUAGE sql SECURITY DEFINER STABLE SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM auth.users
    WHERE id = auth.uid()
      AND email_confirmed_at IS NOT NULL          -- onaysız e-posta admin OLAMAZ
      AND lower(email) = ANY (ARRAY[
        'mobelinegol16@gmail.com'                   -- 👈 admin 1
        -- ,'ikinci@admin.com'                     --   admin 2 (gerekirse aç)
      ]::text[])
  );
$$;


-- ─── 3) YÜKSEK-3: KVKK açık rıza ispat kolonu (inquiries v26'da mevcut) ───
DO $$
BEGIN
  IF to_regclass('public.inquiries') IS NOT NULL THEN
    ALTER TABLE public.inquiries ADD COLUMN IF NOT EXISTS consent_at timestamptz;
  ELSE
    RAISE NOTICE 'ATLANDI: inquiries tablosu yok.';
  END IF;
END $$;


-- ─── 4) KRİTİK-2: Açık anon-INSERT politikalarını kaldır + admin read sıkılaştır ───
-- Her tablo varlık kontrolünden geçirilir; yoksa NOTICE basıp atlanır.

-- reviews
DO $$
BEGIN
  IF to_regclass('public.reviews') IS NOT NULL THEN
    DROP POLICY IF EXISTS "Public insert reviews" ON public.reviews;
    DROP POLICY IF EXISTS "public insert reviews" ON public.reviews;
    DROP POLICY IF EXISTS "anon insert reviews"   ON public.reviews;
    DROP POLICY IF EXISTS "Admin manage reviews"  ON public.reviews;
    DROP POLICY IF EXISTS "admin_manage_reviews"  ON public.reviews;
    CREATE POLICY "admin_manage_reviews" ON public.reviews FOR ALL
      USING (is_admin_email()) WITH CHECK (is_admin_email());
    ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
  ELSE
    RAISE NOTICE 'ATLANDI: reviews tablosu yok.';
  END IF;
END $$;

-- page_views
DO $$
BEGIN
  IF to_regclass('public.page_views') IS NOT NULL THEN
    DROP POLICY IF EXISTS "anon insert page_views" ON public.page_views;
    DROP POLICY IF EXISTS "anon_insert_page_views" ON public.page_views;
    DROP POLICY IF EXISTS "admin read page_views"  ON public.page_views;
    DROP POLICY IF EXISTS "admin_read_page_views"  ON public.page_views;
    CREATE POLICY "admin_read_page_views" ON public.page_views FOR SELECT USING (is_admin_email());
    ALTER TABLE public.page_views ENABLE ROW LEVEL SECURITY;
  ELSE
    RAISE NOTICE 'ATLANDI: page_views tablosu yok.';
  END IF;
END $$;

-- product_favorites
DO $$
BEGIN
  IF to_regclass('public.product_favorites') IS NOT NULL THEN
    DROP POLICY IF EXISTS "anon manage favorites" ON public.product_favorites;
    DROP POLICY IF EXISTS "anon_manage_favorites" ON public.product_favorites;
    DROP POLICY IF EXISTS "admin read favorites"  ON public.product_favorites;
    DROP POLICY IF EXISTS "admin_read_favorites"  ON public.product_favorites;
    CREATE POLICY "admin_read_favorites" ON public.product_favorites FOR SELECT USING (is_admin_email());
    ALTER TABLE public.product_favorites ENABLE ROW LEVEL SECURITY;
  ELSE
    RAISE NOTICE 'ATLANDI: product_favorites tablosu yok.';
  END IF;
END $$;

-- site_events  (⚠️ önce 15-analytics-events.sql çalıştırılmalı)
DO $$
BEGIN
  IF to_regclass('public.site_events') IS NOT NULL THEN
    DROP POLICY IF EXISTS "anon insert site_events" ON public.site_events;
    DROP POLICY IF EXISTS "anon_insert_site_events" ON public.site_events;
    DROP POLICY IF EXISTS "admin read site_events"  ON public.site_events;
    DROP POLICY IF EXISTS "admin_read_site_events"  ON public.site_events;
    CREATE POLICY "admin_read_site_events" ON public.site_events FOR SELECT USING (is_admin_email());
    ALTER TABLE public.site_events ENABLE ROW LEVEL SECURITY;
  ELSE
    RAISE NOTICE '!!! ATLANDI: site_events yok — ONCE 15-analytics-events.sql calistir, sonra bu dosyayi TEKRAR calistir.';
  END IF;
END $$;


-- ════════════════════════════════════════════════════════════
-- 5) DOĞRULAMA
-- ════════════════════════════════════════════════════════════
-- (a) Admin fonksiyonu (admin olarak giriş yapıp çağır → true dönmeli)
-- SELECT public.is_admin_email();
--
-- (b) Açık anon yazma KALMADI mı? (with_check 'true' satırı GÖRÜNMEMELİ)
-- SELECT tablename, policyname, cmd, with_check
-- FROM pg_policies
-- WHERE schemaname='public'
--   AND tablename IN ('reviews','page_views','product_favorites','site_events')
-- ORDER BY tablename, cmd;
--
-- NOT: GUC kullanılmadığı için DB restart GEREKMEZ — CREATE OR REPLACE FUNCTION
--      bir sonraki çağrıda anında geçerli olur. Yine de admin panelde bir
--      test kaydıyla (ürün düzenle/kaydet) doğrula.
