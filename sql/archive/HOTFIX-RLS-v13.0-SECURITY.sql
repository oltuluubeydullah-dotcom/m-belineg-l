-- ════════════════════════════════════════════════════════════
-- KANİ MOBİLYA — HOTFIX RLS v13.0: GÜVENLİK KAPATMA PAKETİ
-- ════════════════════════════════════════════════════════════
-- TARİH: 2026-05-30
-- AMAÇ: Teslimat denetiminde bulunan gerçek açıkları kapatmak.
--
-- KAPATILAN AÇIKLAR:
--   1) inquiries: "herkes INSERT edebilir" (with check true) → anon, public
--      anon-key ile DOĞRUDAN Supabase REST'e POST atıp /api/inquiries'in
--      tüm korumalarını (rate-limit, fiyat doğrulama, küfür filtresi)
--      ATLAYABİLİYORDU. Artık talep yazımı SADECE service-role (API) ile.
--   2) reviews: aynı "herkes INSERT" açığı + eski gevşek "Admin manage
--      reviews" policy'si (auth.role()='authenticated' = giriş yapan HERKES).
--      İkisi de kaldırıldı; admin yazma email-allowlist'e bağlandı.
--
-- NEDEN GÜVENLİ:
--   /api/inquiries ve /api/reviews route'ları getServiceClient() (service
--   role) kullanır → RLS'i zaten bypass eder. Bu yüzden public INSERT
--   policy'sini kaldırmak NORMAL AKIŞI BOZMAZ, sadece arka kapıyı kapatır.
--
-- ÖNEMLİ:
--   • İdempotent — defalarca çalıştırılabilir.
--   • Self-contained — is_admin_email() burada da garanti altına alınır,
--     v11.6/v12.1 çalıştırılmamış olsa bile bu dosya tek başına işi bitirir.
--   • Public OKUMA (ürün, kategori, yorum) policy'lerine DOKUNULMAZ.
-- ════════════════════════════════════════════════════════════


-- ─── 0) is_admin_email() — garanti (v12.1 sürümü, email_confirmed_at fallback) ──
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
        lower(coalesce(auth.jwt() ->> 'email', '')) = any (
          array[
            'info@mobelinegol.com'
            -- Ek admin eklemek için: ,'ikinci@admin.com'
          ]
        )
        and (
          coalesce((auth.jwt() ->> 'email_verified')::boolean, false) = true
          or exists (
            select 1 from auth.users
            where id = auth.uid() and email_confirmed_at is not null
          )
        )
    ),
    false
  );
$$;

grant execute on function public.is_admin_email() to authenticated, anon;


-- ─── 1) INQUIRIES: anon DOĞRUDAN INSERT KAPALI ──────────────
-- Talep yazımı yalnızca /api/inquiries (service-role) üzerinden olur.
drop policy if exists "inquiries_insert_public" on inquiries;

-- Admin okuma/güncelleme/silme email-allowlist'te (garanti):
drop policy if exists "inquiries_read_admin" on inquiries;
create policy "inquiries_read_admin" on inquiries
  for select using (public.is_admin_email());

drop policy if exists "inquiries_update_admin" on inquiries;
create policy "inquiries_update_admin" on inquiries
  for update using (public.is_admin_email())
  with check (public.is_admin_email());

drop policy if exists "inquiries_delete_admin" on inquiries;
create policy "inquiries_delete_admin" on inquiries
  for delete using (public.is_admin_email());


-- ─── 2) REVIEWS: anon DOĞRUDAN INSERT KAPALI + gevşek policy temizliği ──
-- Yorum yazımı yalnızca /api/reviews (service-role) üzerinden olur.
drop policy if exists "Public insert reviews" on reviews;
drop policy if exists "reviews_insert_public" on reviews;

-- ESKİ GEVŞEK POLICY — auth.role()='authenticated' = giriş yapan herkes.
-- Birden çok permissive policy OR'lanır → bu kalırsa email kilidi delinir.
drop policy if exists "Admin manage reviews" on reviews;

-- Admin yorum yönetimi (gizle/onayla/sil) email-allowlist'te (FOR ALL → SELECT dahil,
-- admin gizli yorumları da görebilir):
drop policy if exists "reviews_write_admin" on reviews;
create policy "reviews_write_admin" on reviews
  for all using (public.is_admin_email())
  with check (public.is_admin_email());

-- Public yorum OKUMA korunur (sadece gizli olmayanlar):
drop policy if exists "Public read reviews" on reviews;
drop policy if exists "reviews_read_public" on reviews;
create policy "reviews_read_public" on reviews
  for select using (is_hidden = false);


-- ─── 3) DOĞRULAMA SORGULARI (admin login olduktan sonra) ────
-- Aşağıdakileri Supabase SQL editöründe çalıştırıp kontrol edebilirsin:
--
-- Açık kalan public INSERT var mı? (BOŞ dönmeli)
--   select tablename, policyname, cmd, with_check
--   from pg_policies
--   where schemaname='public' and tablename in ('inquiries','reviews')
--     and cmd='INSERT';
--
-- 'authenticated'-tabanlı gevşek policy kaldı mı? (BOŞ dönmeli)
--   select tablename, policyname, qual
--   from pg_policies
--   where schemaname='public'
--     and qual ilike '%auth.role()%authenticated%';


-- ════════════════════════════════════════════════════════════
-- by ubivo — v13.0 güvenlik kapatma paketi
-- ════════════════════════════════════════════════════════════
