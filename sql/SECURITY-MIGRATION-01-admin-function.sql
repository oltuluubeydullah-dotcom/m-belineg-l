-- ════════════════════════════════════════════════════════════
-- SECURITY MIGRATION 01 — is_admin_email() hardcode kaldır
-- ════════════════════════════════════════════════════════════
-- SORUN: Mevcut fonksiyonda 'info@mobelinegol.com' hardcoded fallback var.
--        app.admin_emails setting set edilmemişse bu email admin sayılır.
-- RİSK SEVİYESİ: ORTA
-- ETKİ: Üretimde app.admin_emails doğru set edilmişse risk yok.
--       Set edilmemişse beklenmedik kullanıcı RLS bypass yapabilir.
-- UYGULAMA: Supabase SQL Editor'da çalıştır.
-- GERİ ALMA: Aşağıdaki ROLLBACK bölümünü çalıştır.
-- ════════════════════════════════════════════════════════════

-- Mevcut fonksiyonu hardcode OLMADAN yeniden oluştur
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
      AND email_confirmed_at IS NOT NULL  -- Onaylanmamış email admin olamaz
      AND email = ANY(
        string_to_array(
          COALESCE(
            current_setting('app.admin_emails', true),
            ''  -- Fallback BOŞ — set edilmemişse kimse admin olamaz
          ),
          ','
        )
      )
  );
$$;

-- Doğrulama: Bu sorgu mevcut kullanıcının admin olup olmadığını gösterir
-- SELECT public.is_admin_email();

-- ════════════════════════════════════════════════════════════
-- ROLLBACK (geri almak için):
-- ════════════════════════════════════════════════════════════
/*
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
      AND (
        email = ANY(
          string_to_array(
            COALESCE(
              current_setting('app.admin_emails', true),
              'info@mobelinegol.com'
            ),
            ','
          )
        )
        OR (
          email_confirmed_at IS NOT NULL
          AND raw_user_meta_data->>'role' = 'admin'
        )
      )
  );
$$;
*/
