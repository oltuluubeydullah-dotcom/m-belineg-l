-- ════════════════════════════════════════════════════════════
-- Möbel İnegöl — Admin E-posta Yönetimi (BİLGİ)
-- ════════════════════════════════════════════════════════════
-- NOT (v30): Eski sürümde burada "ALTER DATABASE postgres SET app.admin_emails"
-- vardı. Supabase managed ortamında bu YASAK (hata 42501 — postgres rolü
-- gerçek superuser değil). Bu yüzden GUC yöntemi KALDIRILDI.
--
-- Admin e-postaları artık doğrudan is_admin_email() fonksiyonunun içinde
-- (06-security-rls.sql) tanımlı. Admin eklemek/çıkarmak için:
--
--   1) 06-security-rls.sql içindeki is_admin_email() fonksiyonundaki
--      ARRAY[...] listesini düzenle (veya aşağıdaki bloğu çalıştır).
--   2) Vercel'de ADMIN_EMAILS env değişkenini AYNI listeyle güncelle.
--
-- İkisi de (SQL fonksiyon + Vercel env) BİREBİR AYNI olmalı:
--   • is_admin_email() (SQL)  → Postgres RLS politikaları kullanır
--   • ADMIN_EMAILS (Vercel)   → JS middleware/API kullanır
-- ════════════════════════════════════════════════════════════

-- Admin listesini buradan da güncelleyebilirsin (06 ile aynı fonksiyon):
CREATE OR REPLACE FUNCTION public.is_admin_email()
RETURNS boolean
LANGUAGE sql SECURITY DEFINER STABLE SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM auth.users
    WHERE id = auth.uid()
      AND email_confirmed_at IS NOT NULL
      AND lower(email) = ANY (ARRAY[
        'info@mobelinegol.com'        -- 👈 admin e-postaları
      ]::text[])
  );
$$;

-- Doğrulama (admin olarak giriş yapıp çalıştır → true dönmeli):
-- SELECT public.is_admin_email();
