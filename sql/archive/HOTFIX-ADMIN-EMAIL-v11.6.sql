-- ════════════════════════════════════════════════════════════
-- KANİ MOBİLYA — HOTFIX RLS v11.6: EMAIL ALLOWLIST
-- ════════════════════════════════════════════════════════════
-- TARİH: 2026-05-21
-- AMAÇ: Tüm admin yazma policy'lerini "authenticated" yerine
--       email allowlist ile koru. Supabase signup'lar açık olsa
--       bile saldırgan admin işlemi yapamaz.
--
-- ÖNEMLİ:
--   1) HOTFIX-RLS-v10.11.sql'i ÖNCE çalıştırın.
--   2) Allowlist'i aşağıdaki ADMIN_EMAILS dizisinde düzenleyin.
--      Production'da Vercel env'deki ADMIN_EMAILS ile EŞLEŞMELİ.
--   3) İdempotent — defalarca çalıştırılabilir.
--   4) Supabase Dashboard → Authentication → Sign Ups → DISABLE
--      yapmayı da unutmayın (2. savunma hattı).
-- ════════════════════════════════════════════════════════════

-- ─── 1) ALLOWLIST FONKSİYONU ────────────────────────────────
-- JWT'deki email lowercased + allowlist'le karşılaştırılır.
-- email_confirmed_at olmadan admin olamaz (signup spam koruması).
--
-- Allowlist'i değiştirmek için bu fonksiyonu güncelle.

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
        -- JWT iddialarından email çek
        lower((auth.jwt() ->> 'email')) = any (
          array[
            'info@mobelinegol.com'
            -- ek admin email'i: ',ubeyt@example.com' gibi ekle
          ]
        )
        -- email_confirmed_at boş olmamalı
        and (auth.jwt() ->> 'email_verified')::boolean = true
    ),
    false
  );
$$;

grant execute on function public.is_admin_email() to authenticated, anon;


-- ─── 2) ADMIN WRITE POLICY'LERİNİ EMAIL CHECK İLE DEĞİŞTİR ──
-- products
drop policy if exists "products_write_admin" on products;
create policy "products_write_admin" on products
  for all using (public.is_admin_email())
  with check (public.is_admin_email());

-- categories
drop policy if exists "categories_write_admin" on categories;
create policy "categories_write_admin" on categories
  for all using (public.is_admin_email())
  with check (public.is_admin_email());

-- settings
drop policy if exists "settings_write_admin" on settings;
create policy "settings_write_admin" on settings
  for all using (public.is_admin_email())
  with check (public.is_admin_email());

-- inquiries (sadece admin READ — INSERT zaten public)
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

-- blog_posts
drop policy if exists "blog_write_admin" on blog_posts;
create policy "blog_write_admin" on blog_posts
  for all using (public.is_admin_email())
  with check (public.is_admin_email());

-- hero_banners
drop policy if exists "hero_banners_write_admin" on hero_banners;
create policy "hero_banners_write_admin" on hero_banners
  for all using (public.is_admin_email())
  with check (public.is_admin_email());

-- content_pages
drop policy if exists "content_pages_write_admin" on content_pages;
create policy "content_pages_write_admin" on content_pages
  for all using (public.is_admin_email())
  with check (public.is_admin_email());

-- reviews (admin moderation: approve/delete)
drop policy if exists "reviews_write_admin" on reviews;
create policy "reviews_write_admin" on reviews
  for all using (public.is_admin_email())
  with check (public.is_admin_email());

-- whatsapp_templates
drop policy if exists "whatsapp_templates_write_admin" on whatsapp_templates;
create policy "whatsapp_templates_write_admin" on whatsapp_templates
  for all using (public.is_admin_email())
  with check (public.is_admin_email());


-- ─── 3) STORAGE POLICY'LERİNİ DE EMAIL CHECK İLE GÜNCELLE ──
drop policy if exists "kani_medya_write_admin" on storage.objects;
create policy "kani_medya_write_admin" on storage.objects
  for insert with check (
    bucket_id = 'mobel-medya'
    and public.is_admin_email()
  );

drop policy if exists "kani_medya_update_admin" on storage.objects;
create policy "kani_medya_update_admin" on storage.objects
  for update using (
    bucket_id = 'mobel-medya'
    and public.is_admin_email()
  );

drop policy if exists "kani_medya_delete_admin" on storage.objects;
create policy "kani_medya_delete_admin" on storage.objects
  for delete using (
    bucket_id = 'mobel-medya'
    and public.is_admin_email()
  );


-- ─── 4) DOĞRULAMA ───────────────────────────────────────────
-- Bu fonksiyonu kendi user'ınla test edin:
--   select public.is_admin_email();  -- true dönmeli (admin email ile giriş yaptıysanız)
--
-- Allowlist dışı kullanıcı ile test:
--   1) Yeni hesap aç (başka email)
--   2) /admin'e gitmeyi dene → middleware atar
--   3) Doğrudan Supabase'e INSERT atmayı dene → RLS reddeder


-- ─── 5) UYARI ───────────────────────────────────────────────
-- Yeni admin eklemek istersen:
--   1) Yukarıdaki array'e email ekle (örnek: 'ali@mobelinegol.com')
--   2) Vercel env'deki ADMIN_EMAILS değişkenini de güncelle (virgüllü)
--   3) Bu SQL'i tekrar çalıştır (idempotent)
--   4) Yeni admin /giris'e gitsin, Supabase Dashboard'dan
--      "Send magic link" ile davet et veya manuel user ekle.
-- ════════════════════════════════════════════════════════════
