-- ════════════════════════════════════════════════════════════
-- Möbel İnegöl - Blog Eklemesi (Sprint 6)
-- ════════════════════════════════════════════════════════════
-- Bu dosyayı 01-schema.sql çalıştırdıktan SONRA, Supabase SQL
-- Editor'a yapıştır ve Run yap.
-- ════════════════════════════════════════════════════════════

-- ─── BLOG YAZILARI TABLOSU ──────────────────────────────────
create table if not exists blog_posts (
  id            uuid primary key default uuid_generate_v4(),
  title         text not null,
  slug          text not null unique,
  excerpt       text,
  content       text not null,
  image_url     text,
  is_published  boolean not null default false,
  published_at  timestamptz,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index if not exists idx_blog_slug      on blog_posts(slug);
create index if not exists idx_blog_published on blog_posts(is_published, published_at desc);

-- updated_at trigger (mevcut function'ı kullanır)
drop trigger if exists set_updated_at_blog on blog_posts;
create trigger set_updated_at_blog
  before update on blog_posts
  for each row execute function trigger_set_updated_at();

-- ─── ROW LEVEL SECURITY ──────────────────────────────────────
alter table blog_posts enable row level security;

drop policy if exists "blog_read_public" on blog_posts;
create policy "blog_read_public" on blog_posts
  for select using (is_published = true);

drop policy if exists "blog_read_admin" on blog_posts;
create policy "blog_read_admin" on blog_posts
  for select using (auth.role() = 'authenticated');

drop policy if exists "blog_write_admin" on blog_posts;
create policy "blog_write_admin" on blog_posts
  for all using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- ════════════════════════════════════════════════════════════
-- KURULUM TAMAM
-- Kontrol: select count(*) from blog_posts;  -- 0 dönmeli
-- ════════════════════════════════════════════════════════════
