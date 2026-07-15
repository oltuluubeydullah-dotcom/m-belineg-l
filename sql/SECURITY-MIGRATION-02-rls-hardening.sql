-- ════════════════════════════════════════════════════════════
-- SECURITY MIGRATION 02 — page_views + product_favorites RLS
-- ════════════════════════════════════════════════════════════
-- SORUN: page_views ve product_favorites tablolarında
--        anon INSERT WITH CHECK (true) var — herkes direkt
--        Supabase REST API'ye istek atıp sınırsız kayıt ekleyebilir.
--        API route rate limit'i bypass edilebilir.
-- RİSK SEVİYESİ: ORTA-YÜKSEK
-- ETKİ: Analytics şişmesi, storage dolması, saldırı vektörü.
-- ÇÖZÜM: anon INSERT policy'leri kaldır.
--        Sadece service-role (API route'lar) yazabilir.
-- GERİ ALMA: Aşağıdaki ROLLBACK bölümünü çalıştır.
-- ════════════════════════════════════════════════════════════

-- ─── page_views ───────────────────────────────────────────
-- Anon INSERT'i kaldır — sadece service-role yazabilir (/api/track-view)
DROP POLICY IF EXISTS "anon insert page_views"  ON public.page_views;
DROP POLICY IF EXISTS "anon_insert_page_views"  ON public.page_views;

-- Admin okuma policy'sini güçlendir — is_admin_email() kullan
DROP POLICY IF EXISTS "admin read page_views"   ON public.page_views;
DROP POLICY IF EXISTS "admin_read_page_views"   ON public.page_views;
CREATE POLICY "admin_read_page_views"
  ON public.page_views FOR SELECT
  USING (is_admin_email());

-- ─── product_favorites ────────────────────────────────────
-- Anon ALL policy'sini kaldır — sadece service-role yazabilir (/api/favorite)
DROP POLICY IF EXISTS "anon manage favorites"   ON public.product_favorites;
DROP POLICY IF EXISTS "anon_manage_favorites"   ON public.product_favorites;
DROP POLICY IF EXISTS "admin read favorites"    ON public.product_favorites;
DROP POLICY IF EXISTS "admin_read_favorites"    ON public.product_favorites;

-- Admin okuma
CREATE POLICY "admin_read_favorites"
  ON public.product_favorites FOR SELECT
  USING (is_admin_email());

-- ─── reviews — anon INSERT'i kaldır (05-schema'da açık) ──
-- /api/reviews service-role ile yazıyor, anon INSERT'e gerek yok
DROP POLICY IF EXISTS "Public insert reviews"   ON public.reviews;
DROP POLICY IF EXISTS "anon insert reviews"     ON public.reviews;
-- Admin manage policy'si zaten is_admin_email() kullanıyor (06-security-rls.sql)
-- Eski "Admin manage reviews" auth.role()='authenticated' ile varsa kaldır
DROP POLICY IF EXISTS "Admin manage reviews"    ON public.reviews;

-- Doğrulama:
-- SELECT schemaname, tablename, policyname, cmd
-- FROM pg_policies
-- WHERE tablename IN ('page_views', 'product_favorites', 'reviews')
-- ORDER BY tablename, policyname;

-- ════════════════════════════════════════════════════════════
-- ROLLBACK:
-- ════════════════════════════════════════════════════════════
/*
-- page_views anon INSERT geri aç
CREATE POLICY "anon insert page_views" ON public.page_views
  FOR INSERT WITH CHECK (true);

-- product_favorites anon ALL geri aç
CREATE POLICY "anon manage favorites" ON public.product_favorites
  FOR ALL WITH CHECK (true);

-- reviews anon INSERT geri aç
CREATE POLICY "Public insert reviews" ON public.reviews
  FOR INSERT WITH CHECK (true);
*/
