-- ════════════════════════════════════════════════════════════
-- UBIVO MASTER LICENSE SYSTEM — SQL SETUP
-- ════════════════════════════════════════════════════════════
-- Bu dosya UBIVO'nun KENDI Supabase projesinde çalıştırılır.
-- (Kanı Mobilya'nın Supabase'i değil — ayrı bir proje.)
--
-- Adımlar:
-- 1) supabase.com → New Project → "ubivo-master" (Frankfurt önerilen)
-- 2) Free plan yeter (5-10 müşteriye kadar)
-- 3) SQL Editor → bu dosyayı yapıştır → Run
-- 4) Project Settings → API → anon key'i not al (Kanı env'a girilecek)
-- ════════════════════════════════════════════════════════════

-- ─── 1. LICENSES TABLOSU ────────────────────────────────────
-- Her müşteri burada bir satır.
create table if not exists public.licenses (
  id              uuid primary key default gen_random_uuid(),
  license_id      text unique not null,        -- 'kani-mobilya', 'mavi-cafe' vb. (slug)
  client_name     text not null,               -- 'Kanı Mobilya — Enes'
  domains         text[] not null default '{}',-- ['mobelinegol.com','www.mobelinegol.com']
  status          text not null default 'active' check (status in (
                    'active',       -- normal çalışıyor
                    'warning_1',    -- ince banner (7 gün gecikme)
                    'warning_2',    -- büyük banner (14 gün gecikme)
                    'restricted',   -- WhatsApp/Sepete ekle disabled (21 gün)
                    'maintenance'   -- tam ekran "servis duraklatıldı" (30 gün)
                  )),
  message         text,                        -- müşteriye gösterilecek özel mesaj (opsiyonel)
  paid_until      date,                        -- sonraki ödeme tarihi
  monthly_fee     numeric(10,2),               -- aylık servis ücreti TL
  contact_phone   text,                        -- müşteri WhatsApp
  contact_email   text,
  notes           text,                        -- sadece sen görürsün (private)
  is_active       boolean not null default true, -- soft delete
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index if not exists idx_licenses_license_id on public.licenses(license_id);
create index if not exists idx_licenses_status on public.licenses(status);

-- updated_at otomatik
create or replace function public.tg_set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end;
$$;

drop trigger if exists trg_licenses_updated on public.licenses;
create trigger trg_licenses_updated
  before update on public.licenses
  for each row execute function public.tg_set_updated_at();


-- ─── 2. LİCENSE CHECK FONKSIYONU (Public RPC) ──────────────
-- Her müşteri sitesi bunu çağırır. SADECE public bilgi döner.
-- price/notes gizli kalır.
create or replace function public.check_license(
  p_license_id text,
  p_domain     text
)
returns table (
  status         text,
  message        text,
  paid_until     date,
  found          boolean
)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_rec record;
begin
  select l.status, l.message, l.paid_until, l.domains, l.is_active
    into v_rec
    from public.licenses l
   where l.license_id = p_license_id
   limit 1;

  -- Lisans yok → fail-open (active kabul et, log düş)
  if not found or not v_rec.is_active then
    return query select 'active'::text, null::text, null::date, false;
    return;
  end if;

  -- Domain whitelist kontrolü
  if array_length(v_rec.domains, 1) > 0
     and not (lower(p_domain) = any (select lower(d) from unnest(v_rec.domains) d))
  then
    -- Domain eşleşmiyor → şüpheli (kod kopyalandı?) → 'maintenance' dön
    return query select 'maintenance'::text,
                        'Bu site için geçerli lisans bulunamadı.'::text,
                        null::date, false;
    return;
  end if;

  return query select v_rec.status, v_rec.message, v_rec.paid_until, true;
end;
$$;

grant execute on function public.check_license(text, text) to anon, authenticated;


-- ─── 3. ERIŞIM LOG'U (opsiyonel ama faydalı) ──────────────
-- Hangi domain ne zaman check etti → trafik takibi
create table if not exists public.license_logs (
  id              bigserial primary key,
  license_id      text not null,
  domain          text,
  status_returned text,
  is_valid        boolean,
  checked_at      timestamptz not null default now()
);

create index if not exists idx_license_logs_license on public.license_logs(license_id, checked_at desc);

-- 30 günden eski logları sil (cron'la çalıştır, opsiyonel)
create or replace function public.purge_old_license_logs()
returns void language sql as $$
  delete from public.license_logs where checked_at < now() - interval '30 days';
$$;


-- ─── 4. RLS — TABLE LEVEL SECURITY ────────────────────────
alter table public.licenses    enable row level security;
alter table public.license_logs enable row level security;

-- Licenses: sadece authenticated (sen) okur/yazar.
-- Public, sadece check_license() fonksiyonu ile dolaylı erişir.
drop policy if exists "no_anon_select_licenses" on public.licenses;
create policy "auth_full_licenses" on public.licenses
  for all using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- Logs: anon insert edebilir (otomatik logging için), sadece auth okur.
drop policy if exists "anon_insert_logs" on public.license_logs;
create policy "anon_insert_logs" on public.license_logs
  for insert with check (true);

drop policy if exists "auth_read_logs" on public.license_logs;
create policy "auth_read_logs" on public.license_logs
  for select using (auth.role() = 'authenticated');


-- ─── 5. KANI MOBİLYA İLK KAYIT ─────────────────────────────
-- Domain ve paid_until'i kendine göre ayarla.
insert into public.licenses (
  license_id, client_name, domains, status, paid_until, monthly_fee, contact_email
) values (
  'kani-mobilya',
  'Kanı Mobilya — Enes',
  array['mobelinegol.com', 'www.mobelinegol.com', 'kani-mobilya.vercel.app'],
  'active',
  '2026-12-31',
  5000.00,
  'info@mobelinegol.com'
)
on conflict (license_id) do nothing;


-- ════════════════════════════════════════════════════════════
-- KULLANIM
-- ════════════════════════════════════════════════════════════
-- Status değiştirmek için (Supabase Dashboard → Table Editor → licenses):
--   active        → her şey normal
--   warning_1     → ince sarı banner görünür
--   warning_2     → büyük banner görünür
--   restricted    → WhatsApp + sepet butonları disabled
--   maintenance   → tam ekran "duraklatıldı" mesajı
--
-- Veya SQL ile:
--   update licenses set status = 'warning_1', message = 'Ödeme bekleniyor'
--   where license_id = 'kani-mobilya';
--
-- Geri açmak:
--   update licenses set status = 'active', message = null
--   where license_id = 'kani-mobilya';
-- ════════════════════════════════════════════════════════════
-- by ubivo — License System v1.0
