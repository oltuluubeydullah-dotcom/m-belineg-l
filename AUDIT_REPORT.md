# AUDIT REPORT — Möbel İnegöl
**Tarih:** 2026-06-02  
**Versiyon:** v13.1  
**Auditor:** by ubivo / Works v3.2

---

## 🔴 KRİTİK SORUNLAR (Etap 1'de Fix)

### K-01: `app/layout.jsx` — HTML lang attribute hardcoded `tr`
**Dosya:** `app/layout.jsx:103`  
**Sorun:** `<html lang="tr">` sabit yazılmış. Site 3 dilli ama root layout locale'ı bilmiyor.  
**Etki:** Google'a "bu site sadece Türkçe" diyor. EN ve DE sayfaları yanlış lang ile indexleniyor.  
**Fix:** `app/[locale]/layout.jsx`'e `<html lang={locale}>` taşınmalı. Root layout'taki html tag kaldırılmalı.

### K-02: `app/layout.jsx` — Schema.org telephone hardcoded
**Dosya:** `app/layout.jsx:81`  
**Sorun:** `telephone: '+905360400108'` hâlâ hardcoded (az önce `process.env` yaptık ama dosyada kaldı mı kontrol gerekiyor).  
**Fix:** `process.env.NEXT_PUBLIC_BUSINESS_PHONE || ''` ile çözülmeli.

### K-03: `lib/auth/admin.js` — Fallback email hâlâ hardcoded
**Dosya:** `lib/auth/admin.js:34`  
**Sorun:** `process.env.ADMIN_EMAILS || 'info@mobelinegol.com'` — orijinal dosyada hâlâ var.  
**Etki:** ADMIN_EMAILS env var set edilmezse beklenmedik email admin olabilir.  
**Fix:** Fallback tamamen kaldırılmalı, env var yoksa boş dizi dönmeli.

### K-04: `app/api/track-view` — Rate limit YOK
**Dosya:** `app/api/track-view/route.js`  
**Sorun:** Rate limiting hiç uygulanmamış. Bot filtresi var ama IP bazlı limit yok.  
**Etki:** 100k/gün trafik hedefinde kolayca analytics şişirilebilir, Supabase insert kotası dolar.  
**Fix:** `checkRateLimit(ip, 'track-view', 30, 60)` — 1 IP'den dakikada 30 view.

### K-05: `app/api/favorite` — Rate limit YOK + sessionId validation eksik
**Dosya:** `app/api/favorite/route.js`  
**Sorun:** Rate limiting yok. sessionId format kontrolü yok — teorik olarak herhangi bir string girilebilir.  
**Etki:** Tek session ile binlerce toggle yapılabilir, favorites tablosu şişer.  
**Fix:** Rate limit + UUID format validation.

### K-06: `SeoTanitim.jsx` — `t.raw()` ile `dangerouslySetInnerHTML`
**Dosya:** `components/public/SeoTanitim.jsx:23-24`  
**Sorun:** `t.raw('p1')` translation dosyasındaki ham içeriği döndürür, `dangerouslySetInnerHTML` ile render ediliyor.  
**Etki:** Translation dosyası (`messages/tr.json`) admin tarafından düzenlenebiliyorsa XSS açığı. Şu an static ama risk var.  
**Fix:** `markdownToHtml()` veya `sanitize-html` ile sanitize et, sonra render.

---

## 🟠 YÜKSEK ÖNCELİKLİ SORUNLAR

### Y-01: Tüm public sayfalar `force-dynamic` — ISR kullanılmıyor
**Dosyalar:** Tüm `app/[locale]/(public)/*/page.jsx` — 18 sayfa  
**Sorun:** Her istek Supabase'e gidiyor. 100k ziyaretçide bu anlık 100k Supabase sorgusu demek.  
**Etki:** Free tier Supabase connection limiti (60 connection) patlar. Sayfa TTFB yavaşlar.  
**Fix (kademeli):**
- Statik CMS sayfaları (hakkimizda, kvkk, gizlilik, garanti-iade, teslimat, satis-sozlesmesi): `revalidate = 3600` (1 saat)
- Kategori/ürün sayfaları: `revalidate = 300` (5 dakika)
- Anasayfa: `revalidate = 60` (1 dakika)
- Arama, sepet, checkout: `force-dynamic` kalabilir

### Y-02: ESLint config yok
**Sorun:** `.eslintrc` dosyası hiç yok. `npm run lint` Next.js default'u kullanıyor — çok az kural.  
**Etki:** Unused import, hook violation, a11y sorunları yakalanmıyor.  
**Fix:** Profesyonel `.eslintrc.json` kurulumu.

### Y-03: `openGraph.locale` sadece `tr_TR` — dinamik değil
**Dosya:** `app/layout.jsx:40`  
**Sorun:** `locale: 'tr_TR'` sabit. EN ve DE sayfaları için yanlış OG locale.  
**Etki:** Facebook/LinkedIn paylaşımında yanlış dil gösterimi.  
**Fix:** Locale-aware metadata üretimi `app/[locale]/(public)/layout.jsx`'e taşınmalı.

### Y-04: `app/[locale]/layout.jsx` — `<html lang>` uygulanmıyor
**Dosya:** `app/[locale]/layout.jsx`  
**Sorun:** Bu layout `<html>` tag'i üretmiyor, sadece provider wrapping yapıyor. Root layout'taki `lang="tr"` override edilemiyor.  
**Fix:** K-01 ile birlikte çözülecek.

### Y-05: Schema.org — `LocalBusiness` adresi ENV'den okumuyor
**Dosya:** `app/layout.jsx`  
**Sorun:** `streetAddress`, `addressLocality` vs. hardcoded. Env var'dan okumalı.  
**Fix:** ISLETME constant'tan besle.

### Y-06: `favorite/route.js` — `supabase` module-level instantiation
**Dosya:** `app/api/favorite/route.js:8-11`  
**Sorun:** Supabase client module scope'ta oluşturulmuş. Edge runtime'da bu cold-start problemlerine yol açar.  
**Fix:** Her request içinde oluştur.

---

## 🟡 ORTA ÖNCELİKLİ SORUNLAR

### O-01: `hakkimizda` ve diğer CMS sayfaları — canonical URL eksik
**Sorun:** CMS sayfalarında `generateMetadata` içinde canonical belirtilmemiyor.  
**Etki:** 3 dilli sayfalarda duplicate content riski.

### O-02: Blog sayfaları sitemap'te alternates eksik
**Dosya:** `app/sitemap.js`  
**Sorun:** Blog sayfaları sitemap'e ekleniyor ama `alternates.languages` yok.  
**Fix:** Blog sayfalarına da hreflang alternates ekle.

### O-03: `admin.js` fallback email — orijinal dosyada kalmış olabilir
**Etki:** Kani Mobilya email'i admin olabilir teorik olarak.

### O-04: `app/api/track-view` — edge runtime + service role key
**Sorun:** Edge runtime'da service role key kullanımı güvenli ama `createClient` her request'te yeniden oluşturuluyor — performans.

### O-05: `keepalive` cron — her 3 günde bir çok seyrek
**Dosya:** `vercel.json`  
**Sorun:** `"schedule": "0 6 */3 * *"` — 3 günde bir. Supabase free tier 7 gün inaktivitede pause ediyor, yeterli ama marginale yakın.  
**Öneri:** Her gün çalıştır: `"0 6 * * *"`

### O-06: `messages/tr.json` — `p1`, `p2` inline HTML içeriyor
**Sorun:** Translation dosyasında `<strong>` tag'leri var. Sanitize edilmeden render ediliyor.

---

## 🔵 DÜŞÜK ÖNCELİKLİ / TEKNİK BORÇ

### D-01: 14 ayrı SQL migration dosyası
**Sorun:** Bakım zorlaşıyor, yeni kurulumda sıra hatası riski var.  
**Öneri:** `sql/KURULUM-SIRASI.md` doğru ama tek master schema'ya konsolide edilmeli (uzun vadede).

### D-02: `lib/whatsapp.js` — fonksiyon testi yok
**Sorun:** WhatsApp mesaj oluşturma kritik iş akışı ama test coverage sıfır.

### D-03: `vitest.config.js` var ama test dosyası neredeyse boş
**Sorun:** `test/auth/admin.test.js` tek test dosyası, çok az kapsam.

### D-04: `package.json` — `lint` script'te `--fix` yok
**Sorun:** `npm run lint` sadece raporlar, düzeltmez. `lint:fix` script eklenmeli.

### D-05: `tailwind.config.js` — `content` array'inde `context/` klasörü yok
**Sorun:** Context dosyalarında Tailwind class kullansaydı purge edilirdi.

---

## 🏭 ÜRETİM RİSKLERİ

| Risk | Seviye | Etki |
|------|--------|------|
| Tüm sayfalar force-dynamic | YÜKSEK | 100k ziyaret = Supabase çöker |
| Rate limit eksik (track-view, favorite) | YÜKSEK | Analytics şişmesi, kota tüketimi |
| HTML lang="tr" hardcoded | YÜKSEK | EN/DE SEO sıfır etki |
| Admin email hardcode (orijinal dosya) | ORTA | Beklenmedik admin erişimi |
| Blog sitemap hreflang eksik | ORTA | EN/DE blog indexleme sorunu |
| Cron 3 günde bir | DÜŞÜK | Marginalde ama yeterli |

---

## ✅ İYİ OLAN ŞEYLER (değiştirme)

- **Middleware auth:** 3 katmanlı (middleware + layout + RLS) — sağlam
- **inquiries API:** Server-side price recompute mükemmel — price tampering koruması var
- **reviews API:** Rate limit + profanity filter + product existence check — iyi
- **CSP headers:** Detaylı ve doğru
- **markdownToHtml:** Escape-first yaklaşım — güvenli
- **Schema.org:** LocalBusiness markup var, Product markup ürün sayfasında var
- **Sitemap:** Multi-language alternates düzgün (blog hariç)
- **robots.txt:** Admin ve API koruması doğru

---

## ETap 1 Fix Listesi (Sıralı)

1. `lib/auth/admin.js` → hardcoded email kaldır
2. `app/layout.jsx` → telephone env'den oku, hardcode temizle  
3. `app/layout.jsx` + `app/[locale]/layout.jsx` → html lang fix
4. `app/api/track-view/route.js` → rate limit ekle
5. `app/api/favorite/route.js` → rate limit + sessionId validation + module-level client fix
6. `.eslintrc.json` → profesyonel config
7. `package.json` → lint:fix script
8. `vercel.json` → cron daily yap
9. CMS sayfaları → force-dynamic → ISR revalidate
10. `components/public/SeoTanitim.jsx` → sanitize

