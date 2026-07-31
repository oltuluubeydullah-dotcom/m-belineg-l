-- ════════════════════════════════════════════════════════════
-- Möbel İnegöl — Arşiv Bucket (Toplu Yükleme ZIP'leri)
-- ════════════════════════════════════════════════════════════
-- Toplu ürün yükleme (admin/toplu-yukleme) akışı: client ZIP'i bu
-- private bucket'a yükler, /api/admin/toplu-yukleme arşivi indirip işler,
-- son chunk'ta arşivi siler. Sadece authenticated (admin) erişebilir.
-- İDEMPOTENT — tekrar çalıştırılabilir.
-- Supabase Dashboard → SQL Editor'da çalıştırın.
-- ════════════════════════════════════════════════════════════

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'mobel-arsiv',
  'mobel-arsiv',
  false,                       -- private
  52428800,                    -- 50 MB (Supabase Free tavanı)
  ARRAY[
    'application/zip',
    'application/x-zip-compressed',
    'application/octet-stream'  -- bazı tarayıcılar ZIP için bunu gönderir
  ]
)
ON CONFLICT (id) DO UPDATE SET
  public             = false,
  file_size_limit    = 52428800,
  allowed_mime_types = ARRAY[
    'application/zip',
    'application/x-zip-compressed',
    'application/octet-stream'
  ];

-- Sadece admin (authenticated) yükler/okur/siler. İşleme service-role ile
-- yapıldığı için RLS'i bypass eder; bu policy client'ın yüklemesi içindir.
DROP POLICY IF EXISTS "mobel_arsiv_admin_all" ON storage.objects;
CREATE POLICY "mobel_arsiv_admin_all" ON storage.objects
  FOR ALL
  USING (bucket_id = 'mobel-arsiv' AND auth.role() = 'authenticated')
  WITH CHECK (bucket_id = 'mobel-arsiv' AND auth.role() = 'authenticated');

-- Doğrula:
-- SELECT id, public, file_size_limit FROM storage.buckets WHERE id = 'mobel-arsiv';
