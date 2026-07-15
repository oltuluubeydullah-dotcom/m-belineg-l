-- ════════════════════════════════════════════════════════════
-- Möbel İnegöl — v10.10 KONSOLIDE UPGRADE SQL
-- ════════════════════════════════════════════════════════════
-- Bu dosyayı Supabase Dashboard → SQL Editor → New Query'de
-- yapıştır → Run. Idempotent (defalarca çalıştırılabilir).
--
-- Önceki sürümlerden geliyorsan sql/06 ve sql/07'yi atlamış
-- olsan da bu dosya hepsini halleder.
-- ════════════════════════════════════════════════════════════

-- ─── 1) MEDYA BUCKET (görsel yüklemeleri için) ──────────────
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'mobel-medya',
  'mobel-medya',
  true,                  -- PUBLIC (site görselleri herkes okuyabilsin)
  52428800,              -- 50 MB
  ARRAY[
    'image/jpeg', 'image/jpg', 'image/png', 'image/webp',
    'image/avif', 'image/gif', 'image/heic', 'image/heif',
    'image/bmp', 'image/tiff', 'image/svg+xml',
    'application/octet-stream'  -- iPhone HEIC bazen bu olur
  ]
)
ON CONFLICT (id) DO UPDATE SET
  public             = true,
  file_size_limit    = 52428800,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Medya bucket policy
DROP POLICY IF EXISTS "kani_medya_read_public" ON storage.objects;
CREATE POLICY "kani_medya_read_public" ON storage.objects
  FOR SELECT USING (bucket_id = 'mobel-medya');

DROP POLICY IF EXISTS "kani_medya_write_admin" ON storage.objects;
CREATE POLICY "kani_medya_write_admin" ON storage.objects
  FOR ALL
  USING (bucket_id = 'mobel-medya' AND auth.role() = 'authenticated')
  WITH CHECK (bucket_id = 'mobel-medya' AND auth.role() = 'authenticated');


-- ─── 2) ARŞIV BUCKET (toplu yükleme .zip/.rar için) ─────────
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'kani-arsiv',
  'kani-arsiv',
  false,                  -- ÖZEL — dışarıdan okunamaz
  52428800,               -- 50 MB (Free plan max)
  ARRAY[
    'application/zip',
    'application/x-zip-compressed',
    'application/x-rar-compressed',
    'application/vnd.rar',
    'application/octet-stream'
  ]
)
ON CONFLICT (id) DO UPDATE SET
  file_size_limit    = 52428800,
  allowed_mime_types = EXCLUDED.allowed_mime_types,
  public             = false;

DROP POLICY IF EXISTS "kani_arsiv_admin_all" ON storage.objects;
CREATE POLICY "kani_arsiv_admin_all" ON storage.objects
  FOR ALL
  USING (bucket_id = 'kani-arsiv' AND auth.role() = 'authenticated')
  WITH CHECK (bucket_id = 'kani-arsiv' AND auth.role() = 'authenticated');


-- ─── 3) DOĞRULAMA ───────────────────────────────────────────
-- Aşağıdaki sorgu iki bucket'ı da gösterir; SELECT döner.
SELECT id, public, file_size_limit, array_length(allowed_mime_types, 1) as mime_sayisi
FROM storage.buckets
WHERE id IN ('mobel-medya', 'kani-arsiv')
ORDER BY id;
