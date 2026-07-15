-- ════════════════════════════════════════════════════════════
-- Blog Tablosu — Sprint 6 ek şema
-- ════════════════════════════════════════════════════════════
-- 01-schema.sql'i çalıştırdıktan sonra bunu da çalıştır.
-- ════════════════════════════════════════════════════════════

create table if not exists blog_posts (
  id            uuid primary key default uuid_generate_v4(),
  title         text not null,
  slug          text not null unique,
  excerpt       text,                    -- Kısa özet (liste sayfasında gösterilir)
  content       text not null,           -- Tam içerik (markdown veya HTML)
  cover_image   text,                    -- Kapak görseli URL
  author_name   text default 'Möbel İnegöl',
  is_published  boolean not null default false,
  published_at  timestamptz,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index if not exists idx_blog_slug      on blog_posts(slug);
create index if not exists idx_blog_published on blog_posts(is_published, published_at desc);

-- updated_at trigger
drop trigger if exists set_updated_at_blog on blog_posts;
create trigger set_updated_at_blog
  before update on blog_posts
  for each row execute function trigger_set_updated_at();

-- RLS
alter table blog_posts enable row level security;

-- Public okuma: sadece yayınlanmış olanlar
drop policy if exists "blog_read_public" on blog_posts;
create policy "blog_read_public" on blog_posts
  for select using (is_published = true);

-- Admin yazma/okuma
drop policy if exists "blog_admin_all" on blog_posts;
create policy "blog_admin_all" on blog_posts
  for all using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- ════════════════════════════════════════════════════════════
-- Bitti
-- ════════════════════════════════════════════════════════════
