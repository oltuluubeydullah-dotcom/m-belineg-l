-- ════════════════════════════════════════════════════════════
-- KANİ MOBİLYA — HAKKIMIZDA İÇERİĞİ v11.7
-- ════════════════════════════════════════════════════════════
-- TARİH: 2026-05-22
-- AMAÇ: content_pages.slug='hakkimizda' kaydını profesyonel bir
--       müşteri yüzü olan metinle güncelle. Placeholder
--       "(Bu metni Admin Panelinden düzenleyebilirsiniz.)"
--       kaldırıldı — müşteriler görüyordu.
--
-- ÇALIŞTIRMA:
--   Supabase Dashboard → SQL Editor → bu dosyayı yapıştır → Run.
--   İdempotent: defalarca çalıştırılabilir, UPDATE attığı için
--   yeni satır oluşturmaz.
--
-- ALTERNATIF:
--   Admin panel → İçerik Sayfaları → "Hakkımızda" → Markdown
--   editöründe aşağıdaki metni yapıştır, kaydet.
-- ════════════════════════════════════════════════════════════

UPDATE content_pages
    updated_at = now()
WHERE slug = 'hakkimizda';


-- ─── Diğer placeholder içerikleri de temizle ─────────────────
-- "Bu metni Admin Panelinden düzenleyebilirsiniz" notunu KALDIR
-- (müşteri yüzüne çıkmasın). İçerik aynı kalsın, sadece not silinsin.

UPDATE content_pages
SET content = REPLACE(
      content,
      E'\n\n*(Bu metni Admin Panelinden düzenleyebilirsiniz.)*',
      ''
    ),
    updated_at = now()
WHERE content LIKE '%Admin Panelinden düzenleyebilirsiniz%';


-- ─── DOĞRULAMA ───────────────────────────────────────────────
-- Aşağıdaki sorgu kaç sayfanın güncellendiğini gösterir:
SELECT slug, title, length(content) AS karakter, updated_at
FROM content_pages
ORDER BY slug;

-- ════════════════════════════════════════════════════════════
-- SONRAKİ ADIM: Admin panel → İçerik Sayfaları sekmesinden
-- istediğiniz zaman metni revize edebilirsiniz. Markdown formatı
-- desteklenir (## başlık, **kalın**, *italik*, [link](url), liste).
-- ════════════════════════════════════════════════════════════
