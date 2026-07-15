-- ════════════════════════════════════════════════════════════
-- Möbel İnegöl — Settings Seed
-- Admin paneli ilk kurulumda bu bilgilerle başlar
-- ════════════════════════════════════════════════════════════
-- 01-schema.sql'den SONRA çalıştır

INSERT INTO public.settings (
  whatsapp_number,
  business_name,
  business_tagline,
  business_address,
  business_phone,
  business_email,
  social_links,
  announcement_bar_text,
  announcement_bar_highlight,
  announcement_bar_active
) VALUES (
  '905360400118',
  'Möbel İnegöl',
  'Evinize Değer Katar',
  'Wobilimo AVM, 2. Kat No.122, İnegöl / Bursa',
  '+90 536 040 01 18',
  'info@mobelinegol.com',
  jsonb_build_object(
    'instagram', 'https://www.instagram.com/mobelinegol',
    'maps',      ''
  ),
  '',
  '',
  false
)
ON CONFLICT DO NOTHING;

-- Kontrol: SELECT * FROM settings;
