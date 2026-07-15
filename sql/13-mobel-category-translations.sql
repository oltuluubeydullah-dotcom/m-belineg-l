-- ════════════════════════════════════════════════════════════
-- Möbel İnegöl — Kategori Çevirileri (EN + DE)
-- ════════════════════════════════════════════════════════════
-- 01-schema.sql + 04-i18n-and-cms.sql'den SONRA çalıştır.
-- Kategorilerin İngilizce ve Almanca çevirilerini ekler.
-- ════════════════════════════════════════════════════════════

UPDATE public.categories SET translations = jsonb_build_object(
  'en', jsonb_build_object(
    'name', 'Sofa Sets',
    'description', 'Classic and modern 3-2-1 sofa sets crafted from quality fabrics and durable frames.'
  ),
  'de', jsonb_build_object(
    'name', 'Sofagarnituren',
    'description', 'Klassische und moderne 3-2-1-Sofagarnituren aus hochwertigen Stoffen und stabilen Rahmen.'
  )
) WHERE slug = 'koltuk-takimi';

UPDATE public.categories SET translations = jsonb_build_object(
  'en', jsonb_build_object(
    'name', 'Corner Sofas',
    'description', 'L-shaped and U-shaped corner sofas that maximise space in your living room.'
  ),
  'de', jsonb_build_object(
    'name', 'Ecksofas',
    'description', 'L- und U-förmige Eckssofas, die den Platz in Ihrem Wohnzimmer optimal ausnutzen.'
  )
) WHERE slug = 'kose-koltuk';

UPDATE public.categories SET translations = jsonb_build_object(
  'en', jsonb_build_object(
    'name', 'Bedroom Sets',
    'description', 'Complete bedroom furniture sets — bed frame, wardrobe, dressing table and bedside tables.'
  ),
  'de', jsonb_build_object(
    'name', 'Schlafzimmer-Sets',
    'description', 'Komplette Schlafzimmermöbel — Bettgestell, Kleiderschrank, Schminktisch und Nachttische.'
  )
) WHERE slug = 'yatak-odasi';

UPDATE public.categories SET translations = jsonb_build_object(
  'en', jsonb_build_object(
    'name', 'Dining Room Sets',
    'description', 'Extendable dining tables and matching chair sets for family gatherings.'
  ),
  'de', jsonb_build_object(
    'name', 'Esszimmer-Sets',
    'description', 'Ausziehbare Esstische und passende Stuhlsets für Familientreffen.'
  )
) WHERE slug = 'yemek-odasi';

UPDATE public.categories SET translations = jsonb_build_object(
  'en', jsonb_build_object(
    'name', 'TV Units',
    'description', 'Stylish TV cabinets and wall units to complete your living room look.'
  ),
  'de', jsonb_build_object(
    'name', 'TV-Einheiten',
    'description', 'Stilvolle TV-Schränke und Wandeinheiten für ein vollendetes Wohnzimmer-Look.'
  )
) WHERE slug = 'tv-unitesi';

UPDATE public.categories SET translations = jsonb_build_object(
  'en', jsonb_build_object(
    'name', 'Kids & Youth Rooms',
    'description', 'Safe and fun bedroom furniture for babies, children and teenagers.'
  ),
  'de', jsonb_build_object(
    'name', 'Kinder- & Jugendzimmer',
    'description', 'Sichere und kindgerechte Schlafzimmermöbel für Babys, Kinder und Teenager.'
  )
) WHERE slug = 'bebek-genc-odasi';

UPDATE public.categories SET translations = jsonb_build_object(
  'en', jsonb_build_object(
    'name', 'Table & Chair Sets',
    'description', 'Kitchen and dining table-chair sets that combine practicality with style.'
  ),
  'de', jsonb_build_object(
    'name', 'Tisch- & Stuhl-Sets',
    'description', 'Küchen- und Esstisch-Stuhl-Sets, die Praktikabilität mit Stil verbinden.'
  )
) WHERE slug = 'masa-sandalye-set';

UPDATE public.categories SET translations = jsonb_build_object(
  'en', jsonb_build_object(
    'name', 'Coffee Tables & Accessories',
    'description', 'Coffee tables, side tables, decorative items and accessories to add the finishing touch.'
  ),
  'de', jsonb_build_object(
    'name', 'Couchtische & Accessoires',
    'description', 'Couchtische, Beistelltische, Dekorationsartikel und Accessoires für den letzten Schliff.'
  )
) WHERE slug = 'sehpa-aksesuar';

-- Kontrol:
-- SELECT slug, translations FROM categories ORDER BY sort_order;
