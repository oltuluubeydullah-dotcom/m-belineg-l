-- ════════════════════════════════════════════════════════════
-- UBIVO NOTIFICATIONS SYSTEM (v13.1)
-- ════════════════════════════════════════════════════════════
-- ÖNCEKİ: UBIVO-MASTER-SETUP.sql (licenses tablosu) çalıştırılmış olmalı.
-- BU: Onun üstüne notifications + trigger ekler.
-- byubivo Supabase'de SQL Editor → Run.
-- ════════════════════════════════════════════════════════════

-- ─── 1. NOTIFICATIONS TABLOSU ──────────────────────────────
create table if not exists public.notifications (
  id              uuid primary key default gen_random_uuid(),
  license_id      text not null,
  client_name     text not null,
  contact_phone   text,                       -- mesaj atılacak numara
  contact_email   text,
  old_status      text,
  new_status      text not null,
  message_text    text not null,              -- WhatsApp'a yapıştırılacak hazır mesaj
  status          text not null default 'pending' check (status in (
                    'pending',                -- gönderilmedi (kırmızı badge)
                    'sent',                   -- gönderildi (yeşil tik)
                    'dismissed'               -- iptal (gri, görmezden gelindi)
                  )),
  sent_at         timestamptz,
  dismissed_at    timestamptz,
  created_at      timestamptz not null default now()
);

create index if not exists idx_notifications_status
  on public.notifications(status, created_at desc);

create index if not exists idx_notifications_license
  on public.notifications(license_id, created_at desc);


-- ─── 2. MESAJ ŞABLONU FONKSIYONU ───────────────────────────
-- Status'a göre hazır WhatsApp mesajı üretir. Üst-müşteri ile
-- profesyonel ton, ödeme detayı vurgulanır.
create or replace function public.notification_message(
  p_client_name text,
  p_domains text[],
  p_new_status text,
  p_paid_until date,
  p_monthly_fee numeric
)
returns text
language plpgsql
immutable
as $$
declare
  v_msg text;
  v_domain text;
  v_fee text;
begin
  v_domain := array_to_string(p_domains, ', ');
  v_fee := case
    when p_monthly_fee is not null then ' (' || p_monthly_fee::text || ' TL)'
    else ''
  end;

  v_msg := case p_new_status
    when 'warning_1' then
      'Merhaba,' || E'\n\n' ||
      'Bildiğiniz üzere ' || v_domain || ' sitesinin aylık servis bakım ücreti' || v_fee ||
      ' bu ay için bekleniyor.' || E'\n\n' ||
      'Müsait olduğunuzda dönüş yapabilir misiniz? İyi çalışmalar.' || E'\n\n' ||
      '— ubivo'

    when 'warning_2' then
      'Merhaba,' || E'\n\n' ||
      v_domain || ' için servis ödemesi 14 günü geçti. ' || E'\n\n' ||
      'Sitenin sürekliliği için ödemenin tamamlanması gerekiyor. ' ||
      'Bu hafta içinde halletmemiz mümkün mü? Detay için size dönebilirim.' || E'\n\n' ||
      '— ubivo'

    when 'restricted' then
      'Merhaba,' || E'\n\n' ||
      v_domain || ' siten geçici olarak kısıtlı moda alındı. ' ||
      'WhatsApp butonu ve sepet işlevleri devre dışıdır.' || E'\n\n' ||
      'Ödeme tamamlandığı anda 24 saat içinde geri açılacak. ' ||
      'Detay için lütfen iletişime geçelim.' || E'\n\n' ||
      '— ubivo'

    when 'maintenance' then
      'Merhaba,' || E'\n\n' ||
      v_domain || ' siten bakım moduna alındı. Müşterileriniz şu an siteye erişemiyor.' || E'\n\n' ||
      'Acilen iletişime geçip ödemeyi tamamlamamız gerekiyor. ' ||
      'Ödeme yapıldığı anda 24 saat içinde geri açılır.' || E'\n\n' ||
      '— ubivo'

    when 'active' then
      'Merhaba,' || E'\n\n' ||
      'Ödemeniz tarafımıza ulaştı, ' || v_domain || ' siteniz yeniden aktif hale getirildi. ' ||
      case
        when p_paid_until is not null
        then 'Bir sonraki ödeme tarihi: ' || to_char(p_paid_until, 'DD.MM.YYYY') || '.' || E'\n\n'
        else E'\n'
      end ||
      'Hayırlı satışlar dileriz. İyi çalışmalar.' || E'\n\n' ||
      '— ubivo'

    else
      ''
  end;

  return v_msg;
end;
$$;


-- ─── 3. OTOMATIK TRIGGER ───────────────────────────────────
-- licenses tablosunda status DEĞİŞTİĞİNDE notification oluştur.
create or replace function public.tg_license_status_changed()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_message text;
begin
  -- Sadece status DEĞİŞTİĞİNDE çalış
  if NEW.status is distinct from OLD.status then
    v_message := public.notification_message(
      NEW.client_name,
      NEW.domains,
      NEW.status,
      NEW.paid_until,
      NEW.monthly_fee
    );

    -- Boş mesaj atlamayalım (active → warning_1 gibi anlamlı geçişler)
    if v_message <> '' then
      insert into public.notifications (
        license_id, client_name, contact_phone, contact_email,
        old_status, new_status, message_text
      ) values (
        NEW.license_id,
        NEW.client_name,
        NEW.contact_phone,
        NEW.contact_email,
        OLD.status,
        NEW.status,
        v_message
      );
    end if;
  end if;

  return NEW;
end;
$$;

drop trigger if exists trg_license_status_changed on public.licenses;
create trigger trg_license_status_changed
  after update on public.licenses
  for each row
  execute function public.tg_license_status_changed();


-- ─── 4. RLS — Sadece Ubeyt görsün ──────────────────────────
alter table public.notifications enable row level security;

drop policy if exists "auth_full_notifications" on public.notifications;
create policy "auth_full_notifications" on public.notifications
  for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');


-- ─── 5. TEMİZLİK FONKSIYONU (opsiyonel) ────────────────────
-- 6 aydan eski dismissed/sent kayıtları temizle (cron'la çağrılabilir)
create or replace function public.purge_old_notifications()
returns void language sql as $$
  delete from public.notifications
  where status in ('sent', 'dismissed')
    and (sent_at < now() - interval '6 months'
         or dismissed_at < now() - interval '6 months');
$$;


-- ════════════════════════════════════════════════════════════
-- TEST
-- ════════════════════════════════════════════════════════════
-- Tabloyu kontrol et:
--   select * from notifications order by created_at desc;
--
-- Trigger'ı test et:
--   update licenses set status = 'warning_1' where license_id = 'kani-mobilya';
--   -- → notifications'a yeni satır düşmeli
--
--   update licenses set status = 'active' where license_id = 'kani-mobilya';
--   -- → notifications'a "ödeme alındı" mesajı düşmeli
-- ════════════════════════════════════════════════════════════
-- by ubivo — Notifications v1.0
