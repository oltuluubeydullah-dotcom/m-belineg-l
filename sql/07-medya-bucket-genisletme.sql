-- ════════════════════════════════════════════════════════════
-- Möbel İnegöl — Medya Bucket Genişletme (v10.9)
-- 10 MB → 50 MB + tüm yaygın resim formatları
-- ════════════════════════════════════════════════════════════

UPDATE storage.buckets
SET
  file_size_limit = 52428800,   -- 50 MB
  allowed_mime_types = ARRAY[
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
    'image/avif',
    'image/gif',
    'image/heic',
    'image/heif',
    'image/bmp',
    'image/tiff',
    'image/svg+xml',
    'application/octet-stream'  -- bazı tarayıcılar HEIC için bunu gönderir
  ]
WHERE id = 'mobel-medya';
