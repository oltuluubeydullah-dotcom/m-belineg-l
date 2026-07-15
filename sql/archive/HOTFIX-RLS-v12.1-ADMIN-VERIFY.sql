-- ════════════════════════════════════════════════════════════
-- KANİ MOBİLYA — HOTFIX RLS v12.1: ADMIN EMAIL VERIFY FALLBACK
-- ════════════════════════════════════════════════════════════
-- TARİH: 2026-05-22
-- AMAÇ: "Cannot coerce the result to a single JSON object" hatası
--        production'da müşteri ürün güncellerken çıktı. Kök sebep:
--        `is_admin_email()` fonksiyonu JWT'de `email_verified` claim'i
--        zorunlu kılıyordu — bazı Supabase Auth session'larında bu
--        claim eksik veya false geliyor. Bu durumda admin login OLSA da
--        RLS onu admin görmüyor → UPDATE/SELECT block → Cannot coerce.
--
-- ÇÖZÜM: email_verified kontrolünü `auth.users.email_confirmed_at`
--         fallback ile destekle. Güvenlik aynı kalır (mail confirm
--         olmadan admin olunamaz) ama JWT claim eksikliğinde de çalışır.
--
-- ÖNEMLİ:
--   • HOTFIX-ADMIN-EMAIL-v11.6.sql'in çalıştırılmış olması gerekir.
--   • İdempotent — defalarca çalıştırılabilir.
--   • Sadece is_admin_email() fonksiyonunu günceller, policy'ler aynı kalır.
-- ════════════════════════════════════════════════════════════

create or replace function public.is_admin_email()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(
    (
      select
        -- 1) Email allowlist kontrolü
        lower(coalesce(auth.jwt() ->> 'email', '')) = any (
          array[
            'info@mobelinegol.com'
            -- Ek admin: ',ubeyt@example.com' gibi
          ]
        )
        -- 2) Email VERIFIED kontrolü — JWT claim VEYA auth.users.email_confirmed_at
        and (
          coalesce((auth.jwt() ->> 'email_verified')::boolean, false) = true
          or exists (
            select 1
            from auth.users
            where id = auth.uid()
              and email_confirmed_at is not null
          )
        )
    ),
    false
  );
$$;

grant execute on function public.is_admin_email() to authenticated, anon;


-- ─── TEST QUERY (admin login olduktan sonra çalıştır) ──
-- Bu sorgu admin için TRUE dönmeli; değilse hata vardır.
-- select public.is_admin_email() as ben_admin_miyim;


-- ─── DEBUG QUERY (sorun devam ederse çalıştır) ─────────
-- select
--   auth.uid() as kullanici_id,
--   auth.jwt() ->> 'email' as jwt_email,
--   auth.jwt() ->> 'email_verified' as jwt_email_verified,
--   (select email_confirmed_at from auth.users where id = auth.uid()) as users_confirmed_at,
--   public.is_admin_email() as ben_admin_miyim;


-- ════════════════════════════════════════════════════════════
-- by ubivo — v12.1 RLS hotfix — admin email verify fallback
-- ════════════════════════════════════════════════════════════
