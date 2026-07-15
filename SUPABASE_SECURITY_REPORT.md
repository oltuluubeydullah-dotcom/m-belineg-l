# SUPABASE SECURITY REPORT — Möbel İnegöl
**Tarih:** 2026-06-02

---

## TABLO BAZLI RLS ANALİZİ

| Tablo | RLS | Public Okuma | Public Yazma | Admin |
|-------|-----|-------------|-------------|-------|
| categories | ✅ | is_active=true | ❌ | is_admin_email() |
| products | ✅ | is_active=true | ❌ | is_admin_email() |
| inquiries | ✅ | ❌ | ❌ (service-role) | is_admin_email() |
| reviews | ✅ | is_hidden=false | ⚠️ anon INSERT açık* | is_admin_email() |
| content_pages | ✅ | is_published=true | ❌ | is_admin_email() |
| hero_banners | ✅ | is_active=true | ❌ | is_admin_email() |
| settings | ✅ | ✅ (tümü) | ❌ | is_admin_email() |
| blog_posts | ✅ | is_published=true | ❌ | is_admin_email() |
| page_views | ✅ | ❌ | ⚠️ anon INSERT açık* | auth.role()=authenticated |
| product_favorites | ✅ | ❌ | ⚠️ anon ALL açık* | auth.role()=authenticated |

*⚠️ SECURITY-MIGRATION-02 ile kapatılacak

---

## KRİTİK BULGULAR

### B-01: is_admin_email() — hardcoded fallback
**Mevcut:** `COALESCE(current_setting(...), 'info@mobelinegol.com')`
**Sorun:** app.admin_emails setting Supabase'de set edilmemişse bu email admin sayılır.
**Fix:** SECURITY-MIGRATION-01 — boş string fallback

### B-02: reviews — anon INSERT açık (05-schema.sql)
**Mevcut:** `CREATE POLICY "Public insert reviews" FOR INSERT WITH CHECK (true)`
**Sorun:** Herkes direkt REST API ile yorum ekleyebilir, /api/reviews bypass edilebilir.
**Fix:** SECURITY-MIGRATION-02

### B-03: page_views — anon INSERT açık (11-analytics.sql)
**Mevcut:** `CREATE POLICY "anon insert page_views" FOR INSERT WITH CHECK (true)`
**Fix:** SECURITY-MIGRATION-02

### B-04: product_favorites — anon ALL açık (11-analytics.sql)
**Mevcut:** `CREATE POLICY "anon manage favorites" FOR ALL WITH CHECK (true)`
**Fix:** SECURITY-MIGRATION-02

### B-05: admin_stats VIEW — authenticated tüm kullanıcılar görebilir
**Mevcut:** `GRANT SELECT ON public.admin_stats TO authenticated`
**Sorun:** Supabase'de signup açıksa authenticated olan herkes istatistikleri görebilir.
**Öneri:** `REVOKE SELECT ON public.admin_stats FROM authenticated;` + is_admin_email() kontrolü

### B-06: increment_product_view() — anon/authenticated EXECUTE
**Mevcut:** `GRANT EXECUTE ON FUNCTION public.increment_product_view(uuid) TO anon, authenticated`
**Sorun:** Herhangi bir UUID ile view sayacı artırılabilir, geçersiz UUID'ler de kabul edilir.
**Öneri:** Ürün varlığını fonksiyon içinde kontrol et (zaten /api/track-view yapıyor ama RPC bypass edilebilir).

---

## MIGRATION ÖNERİ 03 (Opsiyonel)

```sql
-- SECURITY-MIGRATION-03 (opsiyonel, daha sonra uygulanabilir)
-- admin_stats view — sadece admin görebilir

DROP VIEW IF EXISTS public.admin_stats;
CREATE VIEW public.admin_stats AS
SELECT
  (SELECT count(*) FROM public.products WHERE is_active = true)  AS aktif_urun,
  (SELECT count(*) FROM public.products)                          AS toplam_urun,
  (SELECT count(*) FROM public.categories WHERE is_active = true) AS aktif_kategori,
  (SELECT count(*) FROM public.inquiries
   WHERE created_at > now() - interval '30 days')                 AS son_30_gun_talep,
  (SELECT count(*) FROM public.inquiries)                         AS toplam_talep,
  (SELECT count(*) FROM public.page_views
   WHERE created_at > now() - interval '30 days')                 AS son_30_gun_ziyaret,
  (SELECT count(*) FROM public.page_views
   WHERE created_at > now() - interval '1 day')                   AS bugun_ziyaret,
  (SELECT count(*) FROM public.page_views)                        AS toplam_ziyaret,
  (SELECT count(*) FROM public.reviews WHERE is_hidden = false)   AS toplam_yorum,
  (SELECT count(*) FROM public.blog_posts WHERE is_published = true) AS yayinda_blog;

-- Sadece admin erişimi
REVOKE SELECT ON public.admin_stats FROM authenticated;
CREATE POLICY "admin_view_stats" ON public.admin_stats
  FOR SELECT USING (is_admin_email());
-- NOT: View'lara RLS uygulamak için Supabase'de security_barrier gerekebilir.
-- Alternatif: admin API route üzerinden veri çek.
```

---

## ACIL YAPILACAKLAR (Dashboard'dan)

1. **Authentication → Sign Ups → DISABLE** — Yeni kayıt kesinlikle kapatılmalı
2. **app.admin_emails setting** — Supabase SQL Editor: `ALTER DATABASE postgres SET app.admin_emails = 'admin@firmaadi.com';`
3. **SECURITY-MIGRATION-01** — Çalıştır
4. **SECURITY-MIGRATION-02** — Çalıştır (rollback dosyada mevcut)
