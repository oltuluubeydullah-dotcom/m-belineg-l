-- ════════════════════════════════════════════════════════════
-- KANİ MOBİLYA — HOTFIX RLS v10.11
-- ════════════════════════════════════════════════════════════
-- TARİH: 2026-05-XX (orijinal) / Restored in v11.6
-- AMAÇ: Tüm tabloları RLS kapsamına al + admin yazma policy'lerini
--       eksiksiz topla. Idempotent — defalarca çalıştırılabilir.
--
-- ÖNCEKİ HATA:
--   "new row violates row-level security policy" hataları,
--   bazı tablolarda INSERT/UPDATE policy'si tanımsızdı.
--
-- ÇÖZÜM:
--   Her tablo için ayrı INSERT/UPDATE/DELETE policy tanımla.
--   v11.6 ile GÜNCELLENDİ: 'authenticated' yerine email allowlist
--   kontrolü için HOTFIX-ADMIN-EMAIL-v11.6.sql'i de uygula.
-- ════════════════════════════════════════════════════════════

-- ─── 1) RLS'i aktive et (idempotent) ────────────────────────
alter table if exists categories         enable row level security;
alter table if exists products           enable row level security;
alter table if exists inquiries          enable row level security;
alter table if exists settings           enable row level security;
alter table if exists blog_posts         enable row level security;
alter table if exists hero_banners       enable row level security;
alter table if exists content_pages      enable row level security;
alter table if exists reviews            enable row level security;
alter table if exists whatsapp_templates enable row level security;


-- ─── 2) PUBLIC SELECT — herkes okur ─────────────────────────
drop policy if exists "categories_read_public" on categories;
create policy "categories_read_public" on categories
  for select using (is_active = true);

drop policy if exists "products_read_public" on products;
create policy "products_read_public" on products
  for select using (is_active = true);

drop policy if exists "settings_read_public" on settings;
create policy "settings_read_public" on settings
  for select using (true);

drop policy if exists "blog_read_public" on blog_posts;
create policy "blog_read_public" on blog_posts
  for select using (is_published = true);

drop policy if exists "hero_banners_read_public" on hero_banners;
create policy "hero_banners_read_public" on hero_banners
  for select using (is_active = true);

drop policy if exists "content_pages_read_public" on content_pages;
create policy "content_pages_read_public" on content_pages
  for select using (true);

drop policy if exists "reviews_read_public" on reviews;
create policy "reviews_read_public" on reviews
  for select using (is_approved = true);


-- ─── 3) ADMIN WRITE (authenticated → v11.6'da email check ile değiştirilecek) ─
drop policy if exists "categories_write_admin" on categories;
create policy "categories_write_admin" on categories
  for all using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

drop policy if exists "products_write_admin" on products;
create policy "products_write_admin" on products
  for all using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

drop policy if exists "settings_write_admin" on settings;
create policy "settings_write_admin" on settings
  for all using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

drop policy if exists "blog_write_admin" on blog_posts;
create policy "blog_write_admin" on blog_posts
  for all using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

drop policy if exists "hero_banners_write_admin" on hero_banners;
create policy "hero_banners_write_admin" on hero_banners
  for all using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

drop policy if exists "content_pages_write_admin" on content_pages;
create policy "content_pages_write_admin" on content_pages
  for all using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

drop policy if exists "reviews_write_admin" on reviews;
create policy "reviews_write_admin" on reviews
  for all using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

drop policy if exists "whatsapp_templates_write_admin" on whatsapp_templates;
create policy "whatsapp_templates_write_admin" on whatsapp_templates
  for all using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

drop policy if exists "inquiries_read_admin" on inquiries;
create policy "inquiries_read_admin" on inquiries
  for select using (auth.role() = 'authenticated');


-- ─── 4) PUBLIC INSERT — Talepler (form submit) ──────────────
-- v11.6 NOT: Artık client doğrudan INSERT atmıyor;
-- /api/inquiries route'u service role ile yazıyor (price tampering
-- engeli için). Yine de fallback olarak public insert açık —
-- API down olursa client-side fallback patlamasın. Geleceğe
-- yönelik tamamen kapatmak istersen bu policy'yi sil.
drop policy if exists "inquiries_insert_public" on inquiries;
create policy "inquiries_insert_public" on inquiries
  for insert with check (true);


-- ─── 5) STORAGE policy (mobel-medya) ─────────────────────────
drop policy if exists "kani_medya_read_public" on storage.objects;
create policy "kani_medya_read_public" on storage.objects
  for select using (bucket_id = 'mobel-medya');

drop policy if exists "kani_medya_write_admin" on storage.objects;
create policy "kani_medya_write_admin" on storage.objects
  for insert with check (bucket_id = 'mobel-medya' and auth.role() = 'authenticated');

drop policy if exists "kani_medya_update_admin" on storage.objects;
create policy "kani_medya_update_admin" on storage.objects
  for update using (bucket_id = 'mobel-medya' and auth.role() = 'authenticated');

drop policy if exists "kani_medya_delete_admin" on storage.objects;
create policy "kani_medya_delete_admin" on storage.objects
  for delete using (bucket_id = 'mobel-medya' and auth.role() = 'authenticated');


-- ─── 6) DOĞRULAMA ───────────────────────────────────────────
-- Aşağıdaki sorgu her tablo için policy sayısını gösterir.
select schemaname, tablename, count(*) as policy_count
from pg_policies
where schemaname = 'public'
group by schemaname, tablename
order by tablename;

-- ════════════════════════════════════════════════════════════
-- BU DOSYA UYGULANDIKTAN SONRA HOTFIX-ADMIN-EMAIL-v11.6.sql'i
-- ÇALIŞTIRIN — yoksa 'authenticated' policy'leri güvenlik açığı
-- bırakır (her signup admin gibi yazabilir).
-- ════════════════════════════════════════════════════════════
