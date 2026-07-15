-- ════════════════════════════════════════════════════════════
-- KANİ MOBİLYA — HOTFIX ADMIN EMAIL ALLOWLIST (DÜZELTİLMİŞ)
-- v11.7 — 2026-05-22
-- ════════════════════════════════════════════════════════════
-- BU DOSYA v11.6'daki iki SQL'i BİRLEŞTİRİP DÜZELTİR:
--   - HOTFIX-RLS-v10.11.sql (is_approved kolon hatası giderildi)
--   - HOTFIX-ADMIN-EMAIL-v11.6.sql (production policy isimleri eklendi)
--
-- ÖNCEKİ HATA (v11.6):
--   1) Reviews tablosu kolonu 'is_hidden', 'is_approved' DEĞİL.
--   2) Bazı production policy isimleri snake_case değil
--      ("Admin manage reviews", "Admin write content_pages" gibi).
--      Eski drop policy isimleri onları görmediği için
--      eski 'authenticated' policy'leri silinmedi → güvenlik
--      açığı yarım kapanırdı.
--
-- AMAÇ:
--   Tüm bilinen admin write policy isimlerini DROP et,
--   sonra TEKRAR email allowlist kontrolü ile CREATE et.
--   Defalarca çalıştırılabilir (idempotent).
-- ════════════════════════════════════════════════════════════

-- ─── 1) ALLOWLIST FONKSİYONU ────────────────────────────────
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
        lower((auth.jwt() ->> 'email')) = any (
          array[
            'info@mobelinegol.com'
            -- ek admin email: ',ali@firma.com' gibi virgülle ekle
          ]
        )
        and (auth.jwt() ->> 'email_verified')::boolean = true
    ),
    false
  );
$$;

grant execute on function public.is_admin_email() to authenticated, anon;


-- ─── 2) PRODUCTS ────────────────────────────────────────────
drop policy if exists "products_write_admin" on products;
drop policy if exists "Admin write products" on products;
drop policy if exists "products_admin_all" on products;
create policy "products_write_admin" on products
  for all using (public.is_admin_email())
  with check (public.is_admin_email());


-- ─── 3) CATEGORIES ──────────────────────────────────────────
drop policy if exists "categories_write_admin" on categories;
drop policy if exists "Admin write categories" on categories;
drop policy if exists "categories_admin_all" on categories;
create policy "categories_write_admin" on categories
  for all using (public.is_admin_email())
  with check (public.is_admin_email());


-- ─── 4) SETTINGS ────────────────────────────────────────────
drop policy if exists "settings_write_admin" on settings;
drop policy if exists "Admin write settings" on settings;
create policy "settings_write_admin" on settings
  for all using (public.is_admin_email())
  with check (public.is_admin_email());


-- ─── 5) INQUIRIES ───────────────────────────────────────────
drop policy if exists "inquiries_read_admin" on inquiries;
drop policy if exists "Admin read inquiries" on inquiries;
create policy "inquiries_read_admin" on inquiries
  for select using (public.is_admin_email());

drop policy if exists "inquiries_update_admin" on inquiries;
drop policy if exists "Admin update inquiries" on inquiries;
create policy "inquiries_update_admin" on inquiries
  for update using (public.is_admin_email())
  with check (public.is_admin_email());

drop policy if exists "inquiries_delete_admin" on inquiries;
drop policy if exists "Admin delete inquiries" on inquiries;
create policy "inquiries_delete_admin" on inquiries
  for delete using (public.is_admin_email());


-- ─── 6) BLOG POSTS ──────────────────────────────────────────
drop policy if exists "blog_write_admin" on blog_posts;
drop policy if exists "blog_admin_all" on blog_posts;
drop policy if exists "Admin write blog_posts" on blog_posts;
create policy "blog_write_admin" on blog_posts
  for all using (public.is_admin_email())
  with check (public.is_admin_email());


-- ─── 7) HERO BANNERS ────────────────────────────────────────
drop policy if exists "hero_banners_write_admin" on hero_banners;
drop policy if exists "Admin write hero_banners" on hero_banners;
create policy "hero_banners_write_admin" on hero_banners
  for all using (public.is_admin_email())
  with check (public.is_admin_email());


-- ─── 8) CONTENT PAGES ───────────────────────────────────────
drop policy if exists "content_pages_write_admin" on content_pages;
drop policy if exists "Admin write content_pages" on content_pages;
create policy "content_pages_write_admin" on content_pages
  for all using (public.is_admin_email())
  with check (public.is_admin_email());


-- ─── 9) REVIEWS (kolon adı 'is_hidden' — düzeltilmiş) ───────
drop policy if exists "reviews_write_admin" on reviews;
drop policy if exists "Admin manage reviews" on reviews;
create policy "reviews_write_admin" on reviews
  for all using (public.is_admin_email())
  with check (public.is_admin_email());


-- ─── 10) WHATSAPP TEMPLATES ─────────────────────────────────
drop policy if exists "whatsapp_templates_write_admin" on whatsapp_templates;
drop policy if exists "Admin write whatsapp_templates" on whatsapp_templates;
create policy "whatsapp_templates_write_admin" on whatsapp_templates
  for all using (public.is_admin_email())
  with check (public.is_admin_email());


-- ─── 11) STORAGE OBJECTS (mobel-medya bucket) ────────────────
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


-- ─── 12) DOĞRULAMA ──────────────────────────────────────────
-- Aşağıdaki sorgu her tablo için kalan policy'leri gösterir.
-- Hiçbir policy'de "qual = (auth.role() = 'authenticated')"
-- görmüyorsan tamamdır — hepsi is_admin_email()'e döndü.

select
  tablename,
  policyname,
  cmd as komut,
  qual as kosul
from pg_policies
where schemaname = 'public'
  and policyname like '%admin%' or policyname like '%Admin%'
order by tablename, policyname;

-- ════════════════════════════════════════════════════════════
-- BİTTİ. Şimdi yapılacaklar:
--   1) Vercel env → ADMIN_EMAILS=info@mobelinegol.com
--   2) Supabase Auth → Sign Ups → DISABLE
--   3) v11.7 patch'inden HAKKIMIZDA-CONTENT-v11.7.sql çalıştır
-- ════════════════════════════════════════════════════════════
