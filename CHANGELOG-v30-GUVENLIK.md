# Möbel İnegöl v30 — Yapılan Düzeltmeler & Deploy Adımları
**by ubivo · UbivoAgentTeam · Tüm denetim bulguları kapatıldı**

> Bu sürüm henüz push edilmedi. Canlıdaki v26'nın üzerine geçecek.
> Aşağıdaki **iki tarafı da** uygula: (A) Supabase SQL, (B) kod push + Vercel env.

---

## A) SUPABASE'DE ÇALIŞTIR (canlı DB) — ÖNCE BUNU YAP

Supabase Dashboard → SQL Editor → **şu sırayla** çalıştır:

**1) `sql/15-analytics-events.sql`** — `site_events` tablosunu oluşturur (canlı v26'da muhtemelen YOK) + admin_stats view'ını günceller. İdempotent.

**2) `sql/SECURITY-MIGRATION-03-LIVE-HARDENING.sql`** — asıl hardening. İçinde:
1. `is_admin_email()` fonksiyonunu admin e-posta listesiyle (ARRAY) yeniden tanımlar
2. (eski GUC/fallback yaklaşımı kaldırıldı — Supabase uyumsuzdu)
3. 4 tablodaki açık anon-INSERT politikalarını siler (reviews, page_views, product_favorites, site_events)
4. Admin okuma politikalarını `is_admin_email()`'e sıkılaştırır
5. `inquiries.consent_at` kolonunu ekler (KVKK ispat)

> Neden bu sıra: 03, `site_events` tablosunu **değiştiriyor**; 15 onu **oluşturuyor**. Tablo yoksa önce 15. (03 savunmacı yazıldı — tablo yoksa o bloğu atlar, hata vermez; ama site_events v30 track-event için gerekli, o yüzden 15'i mutlaka çalıştır.)

**Sonra doğrula:**
- Admin olarak giriş yapıp `SELECT public.is_admin_email();` → `true` dönmeli
- `pg_policies`'te 4 tablo için `with_check = true` satırı GÖRÜNMEMELİ

> NOT: Supabase'de `ALTER DATABASE ... SET` yasak (hata 42501). Bu yüzden admin
> e-postaları GUC yerine `is_admin_email()` fonksiyonunun içinde ARRAY olarak
> tanımlı (MIGRATION-03 içinde). DB restart GEREKMEZ.

---

## B) KODU PUSH ET + VERCEL ENV

### Vercel Environment Variables (eksikse ekle):
```
ADMIN_EMAILS               = info@mobelinegol.com   (is_admin_email() fonksiyonundaki liste ile AYNI!)
UPSTASH_REDIS_REST_URL     = https://xxx.upstash.io   (rate-limit için ŞART)
UPSTASH_REDIS_REST_TOKEN   = AXxxx...
CRON_SECRET                = (güçlü rastgele)          (keepalive artık zorunlu kılıyor)
IP_SALT                    = (güçlü rastgele)          (yoksa IP hash atlanır)
```

### Push öncesi yerelde (opsiyonel ama önerilir):
```bash
npm install      # vitest dahil yeni devDep'ler
npm test         # 13/13 geçmeli
npm run build    # env'lerle birlikte yeşil olmalı
```

---

## DEĞİŞEN DOSYALAR (kod)

| Dosya | Değişiklik | Bulgu |
|---|---|---|
| `sql/00-ADMIN-EMAILS-SETUP.sql` | **YENİ** — admin GUC kurulumu | KRİTİK-1 |
| `sql/SECURITY-MIGRATION-03-LIVE-HARDENING.sql` | **YENİ** — canlıya konsolide hardening | K-1, K-2 |
| `sql/06-security-rls.sql` | is_admin_email fallback kaldırıldı | KRİTİK-1 |
| `sql/05-reviews-and-analytics.sql` | anon "Public insert reviews" kaldırıldı | KRİTİK-2 |
| `sql/11-mobel-analytics-favorites.sql` | anon insert kaldırıldı, admin read → is_admin_email | KRİTİK-2 |
| `sql/15-analytics-events.sql` | anon insert kaldırıldı, admin read → is_admin_email | KRİTİK-2 |
| `sql/01-schema.sql` | inquiries.consent_at kolonu | YÜKSEK-3 |
| `sql/KURULUM-SIRASI.md` | Adım 0 + GUC/Upstash uyarıları | K-1 |
| `app/api/inquiries/route.js` | kvkk_consent zorunlu + consent_at kaydı | YÜKSEK-3 |
| `app/[locale]/(public)/sepet/onayla/CheckoutFormu.jsx` | onay API'ye gönderiliyor + hata mesajı | YÜKSEK-3 |
| `app/api/keepalive/route.js` | CRON_SECRET zorunlu (bypass kapatıldı) | ORTA |
| `app/api/track-view/route.js` | IP_SALT yoksa hash atla (zayıf tuz kaldırıldı) | ORTA |
| `app/api/track-event/route.js` | aynı IP_SALT düzeltmesi | ORTA |
| `.env.example` | Upstash + Ubivo + ADMIN_EMAILS notu | YÜKSEK-1 |
| `.gitignore` | **YENİ** — .env/secret sızıntısı önlemi | YÜKSEK-4 |
| `package.json` | test script + vitest devDep'leri | QA |
| `test/auth/admin.test.js` | eski/yanlış test güvenli davranışa göre düzeltildi | QA |

**Doğrulama:** `npm test` → 13/13 geçer · `npm run lint` → hata yok · `next build` → derleme+lint temiz (statik üretim sadece gerçek Supabase env ile tamamlanır).

---

## ⚠️ TEK AÇIK KALEM — Bilinçli karar (otomatik UYGULANMADI)

**Bağımlılık major-yükseltmeleri (Next 15/16, next-intl 4.x, supabase-js/ssr).**

Neden ertelendi: `next@14.2.35` zaten 14.2.x'in **en son patch'i** — ilgili advisory'lerin fix'i yalnızca Next 15/16'da (major, kırıcı). next-intl fix'i 4.x'te, supabase-js/ssr ise büyük atlama. Bunları **canlı sitede test etmeden kör yükseltmek**, uğraşılarak stabilize edilmiş mobil auth/cookie akışını bozma riski taşır — CVE'lerin pratik riskinden daha tehlikeli.

Pratik durum: open-redirect riski uygulamanın kendi `isSafeRedirect` guard'ıyla zaten kısmen kapalı; next-intl prototype-pollution yalnızca kullanılmayan `experimental.messages.precompile` özelliğinde; Vercel bazı Next middleware/image CVE'lerini platform seviyesinde hafifletir.

**Önerilen (ayrı, test'li sprint):**
```bash
git checkout -b upgrade/next15
npm i next@15 eslint-config-next@15 next-intl@4 @supabase/ssr@latest @supabase/supabase-js@latest
npm run build && npm test
# Özellikle TEST ET: mobil giriş (iOS Safari), admin CRUD, checkout, i18n yönlendirme
npm audit   # sıfıra yakın olmalı
```
Yeşilse merge + deploy. Bu, "100/100"un son %2'si — ama doğru yol, hızlı yol değil.

---

*Tüm KRİTİK + YÜKSEK + ORTA bulgular kapatıldı. Geriye sadece test gerektiren bağımlılık yükseltmesi kaldı. — Agent 07 + 04 + 05 + 15, Agent 02 koordinasyon.*
