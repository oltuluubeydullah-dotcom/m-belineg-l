-- ════════════════════════════════════════════════════════════
-- Möbel İnegöl - Supabase Veritabanı Şeması
-- Versiyon: 2.0.0 (Sprint 2 - Auth + CRUD)
-- ════════════════════════════════════════════════════════════
-- Bu dosyayı Supabase Dashboard → SQL Editor'a yapıştırıp Run.
-- ════════════════════════════════════════════════════════════

create extension if not exists "uuid-ossp";

-- ─── TABLO 1: KATEGORİLER ────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.categories (
  id            uuid primary key default uuid_generate_v4(),
  name          text not null,
  slug          text not null unique,
  description   text,
  image_url     text,
  sort_order    integer not null default 0,
  is_active     boolean not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

CREATE INDEX IF NOT EXISTS idx_categories_slug    ON public.categories(slug);
CREATE INDEX IF NOT EXISTS idx_categories_active  ON public.categories(is_active);
CREATE INDEX IF NOT EXISTS idx_categories_sort    ON public.categories(sort_order);

-- ─── TABLO 2: ÜRÜNLER ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.products (
  id            uuid primary key default uuid_generate_v4(),
  category_id   uuid not null REFERENCES public.categories(id) on delete restrict,
  name          text not null,
  slug          text not null unique,
  description   text,
  base_price    numeric(12, 2),
  sale_price    numeric(12, 2),
  is_on_sale    boolean not null default false,
  images        text[] not null default '{}',
  variants      jsonb not null default '{}'::jsonb,
  sort_order    integer not null default 0,
  is_active     boolean not null default true,
  is_featured   boolean not null default false,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

CREATE INDEX IF NOT EXISTS idx_products_slug      ON public.products(slug);
CREATE INDEX IF NOT EXISTS idx_products_category  ON public.products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_active    ON public.products(is_active);
CREATE INDEX IF NOT EXISTS idx_products_featured  ON public.products(is_featured) where is_featured = true;

-- ─── TABLO 3: TALEPLER ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.inquiries (
  id                  uuid primary key default uuid_generate_v4(),
  customer_name       text not null,
  customer_phone      text not null,
  customer_address    text,
  customer_note       text,
  cart_items          jsonb not null default '[]'::jsonb,
  total_estimate      numeric(12, 2),
  consent_at          timestamptz,  -- KVKK açık rıza zaman damgası (ispat)
  whatsapp_sent_at    timestamptz,
  created_at          timestamptz not null default now()
);

CREATE INDEX IF NOT EXISTS idx_inquiries_created ON public.inquiries(created_at desc);

-- ─── TABLO 4: AYARLAR ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.settings (
  id                            uuid primary key default uuid_generate_v4(),
  whatsapp_number               text not null,
  business_name                 text not null default 'Möbel İnegöl',
  business_tagline              text default 'Evinize Değer Katar',
  business_address              text,
  business_phone                text,
  business_email                text,
  social_links                  jsonb not null default '{}'::jsonb,
  announcement_bar_text         text,
  announcement_bar_highlight    text,
  announcement_bar_active       boolean not null default true,
  updated_at                    timestamptz not null default now()
);

-- ─── UPDATED_AT TRIGGER ──────────────────────────────────────
CREATE OR REPLACE FUNCTION public.trigger_set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_updated_at_categories ON public.categories;
create trigger set_updated_at_categories
  before update ON public.categories
  for each row EXECUTE FUNCTION public.trigger_set_updated_at();

drop trigger if exists set_updated_at_products ON public.products;
create trigger set_updated_at_products
  before update ON public.products
  for each row EXECUTE FUNCTION public.trigger_set_updated_at();

drop trigger if exists set_updated_at_settings ON public.settings;
create trigger set_updated_at_settings
  before update ON public.settings
  for each row EXECUTE FUNCTION public.trigger_set_updated_at();

-- ─── 9 KATEGORİ SEED ─────────────────────────────────────────
INSERT INTO public.categories (name, slug, sort_order) VALUES
  ('Koltuk Takımı',       'koltuk-takimi',        2),
  ('Köşe Koltuk',         'kose-koltuk',          3),
  ('Yatak Odası',         'yatak-odasi',          4),
  ('Yemek Odası',         'yemek-odasi',          5),
  ('TV Ünitesi',          'tv-unitesi',           6),
  ('Bebek & Genç Odası',  'bebek-genc-odasi',     7),
  ('Masa Sandalye Set',   'masa-sandalye-set',    8),
  ('Sehpa & Aksesuar',    'sehpa-aksesuar',       9)
ON CONFLICT (slug) DO NOTHING;

-- ─── AYARLAR SEED (Möbel İnegöl gerçek bilgileri) ────────────
INSERT INTO public.settings (
  whatsapp_number, business_name, business_tagline,
  business_address, business_email,
  announcement_bar_text, announcement_bar_highlight,
  social_links
) values (
  '905360400118',
  'Möbel İnegöl',
  'Evinize Değer Katar',
  'İnegöl / Bursa',
  'info@mobelinegol.com',
  'Tüm Türkiye ve Avrupa''ya garantili teslimat',
  'GARANTİLİ TESLİMAT',
  '{"instagram": "https://instagram.com/mobelinegol"}'::jsonb
)
ON CONFLICT DO NOTHING;

-- ─── STORAGE BUCKET (ürün/kategori fotoğrafları için) ────────
-- Bucket'ı Supabase Dashboard'dan da oluşturabilirsiniz:
-- Storage → New bucket → "mobel-medya" → public ✓
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'mobel-medya',
  'mobel-medya',
  true,
  52428800,  -- 50 MB (max upload limiti)
  array['image/jpeg', 'image/png', 'image/webp', 'image/avif']
)
ON CONFLICT (id) DO NOTHING;

-- ─── ROW LEVEL SECURITY ──────────────────────────────────────
ALTER TABLE public.categories  enable row level security;
ALTER TABLE public.products    enable row level security;
ALTER TABLE public.inquiries   enable row level security;
ALTER TABLE public.settings    enable row level security;

-- PUBLIC OKUMA: herkes aktif olanları görebilir
drop policy if exists "categories_read_public" ON public.categories;
create policy "categories_read_public" ON public.categories
  for select using (is_active = true);

drop policy if exists "products_read_public" ON public.products;
create policy "products_read_public" ON public.products
  for select using (is_active = true);

drop policy if exists "settings_read_public" ON public.settings;
create policy "settings_read_public" ON public.settings
  for select using (true);

-- ADMIN OKUMA: giriş yapmış kullanıcılar inactive olanları da görebilir
drop policy if exists "categories_read_admin" ON public.categories;
create policy "categories_read_admin" ON public.categories
  for select using (auth.role() = 'authenticated');

drop policy if exists "products_read_admin" ON public.products;
create policy "products_read_admin" ON public.products
  for select using (auth.role() = 'authenticated');

drop policy if exists "inquiries_read_admin" ON public.inquiries;
create policy "inquiries_read_admin" ON public.inquiries
  for select using (auth.role() = 'authenticated');

-- ADMIN YAZMA: sadece giriş yapmış kullanıcılar
drop policy if exists "categories_write_admin" ON public.categories;
create policy "categories_write_admin" ON public.categories
  for all using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

drop policy if exists "products_write_admin" ON public.products;
create policy "products_write_admin" ON public.products
  for all using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

drop policy if exists "settings_write_admin" ON public.settings;
create policy "settings_write_admin" ON public.settings
  for update using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- TALEP YAZMA: HERKES (form submit'tan)
drop policy if exists "inquiries_insert_public" ON public.inquiries;
create policy "inquiries_insert_public" ON public.inquiries
  for insert with check (true);

-- ─── STORAGE RLS ─────────────────────────────────────────────
-- mobel-medya bucket için
drop policy if exists "mobel_medya_read_public" ON storage.objects;
create policy "mobel_medya_read_public" on storage.objects
  for select using (bucket_id = 'mobel-medya');

drop policy if exists "mobel_medya_write_admin" ON storage.objects;
create policy "mobel_medya_write_admin" on storage.objects
  for insert with check (bucket_id = 'mobel-medya' and auth.role() = 'authenticated');

drop policy if exists "mobel_medya_update_admin" ON storage.objects;
create policy "mobel_medya_update_admin" on storage.objects
  for update using (bucket_id = 'mobel-medya' and auth.role() = 'authenticated');

drop policy if exists "mobel_medya_delete_admin" ON storage.objects;
create policy "mobel_medya_delete_admin" on storage.objects
  for delete using (bucket_id = 'mobel-medya' and auth.role() = 'authenticated');

-- ════════════════════════════════════════════════════════════
-- KURULUM BİTTİ
-- Kontrol: select count(*) from categories; -- 9 dönmeli
-- ════════════════════════════════════════════════════════════
