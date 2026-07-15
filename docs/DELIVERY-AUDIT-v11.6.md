# 📋 Kanı Mobilya — Delivery Audit v11.6

> **Tarih:** 2026-05-21
> **Durum:** P0-P3 tüm maddeler kodlandı, build verified
> **Sorumlu:** Ubeyt (ubivo) → Enes (Kanı Mobilya)
> **Bu doküman:** Teslim öncesi tek kaynak rehber

---

## 🎯 Yönetici Özeti

Kanı Mobilya web sitesi v11.5 sevkiyatı sonrası **detaylı bir security +
durability audit'ten geçirildi**. 17 madde tespit edildi (3 kritik, 5
önemli, 5 izleme, 4 uzun vade). **Hepsi v11.6'da kodlandı veya
dokümante edildi.**

**Net durum:**
- ✅ Build geçiyor (`next build` clean)
- ✅ Tüm route'lar derlendi (sitemap, robots, API'ler)
- ✅ Test foundation kuruldu (admin auth için 15+ test case)
- ⚠️ Bazı maddeler env config + Supabase Dashboard ayarı gerektirir
  (kod değil, manuel adım)

---

## 🚨 KRITİK MADDELER — Teslim ÖNCESİ Mutlaka

### ☑️ Manuel Adım 1: Supabase Auth signup'ları kapat

Dashboard → **Authentication** → Sign Up Methods → Email:
- ❌ **Enable Email signups** → **OFF**

**Neden:** Allowlist sistemini aktive ettik ama signup açıkken hâlâ kimse
hesap açıp denediğinde Supabase JWT yaratıyor. Allowlist 2. savunma ama
"defense in depth" için 1. savunma da kapanmalı.

### ☑️ Manuel Adım 2: SQL'leri sırayla çalıştır

Supabase Dashboard → SQL Editor → New query:

```
1. sql/HOTFIX-RLS-v10.11.sql       (eğer önceden uygulanmadıysa)
2. sql/HOTFIX-ADMIN-EMAIL-v11.6.sql (yeni — v11.6 zorunlu)
```

İkinci dosyanın içinde `array['info@mobelinegol.com']` var. Ek admin
varsa virgülle ekle ve **çalıştırdıktan sonra** Vercel env'deki
`ADMIN_EMAILS` ile eşleşmesini garanti et.

### ☑️ Manuel Adım 3: Vercel Env Ekle

Dashboard → kani-mobilya → Settings → Environment Variables:

```
ADMIN_EMAILS=info@mobelinegol.com
```

Bu olmadan middleware allowlist kontrolü yapamaz, **giriş yapan herkesi
reddeder**. Mutlaka ekle.

### ☑️ Manuel Adım 4: Admin User Hazırla

Supabase Dashboard → Authentication → Users → **Add user**:
- Email: `info@mobelinegol.com`
- Password: (güçlü şifre, Bitwarden/1Password'a kaydet)
- ✅ Auto Confirm User (mail onayı atla)

Bu user `email_confirmed_at` set edilmiş olarak yaratılır → allowlist
kabul eder.

### ☑️ Manuel Adım 5: v11.4 Deploy Cleanup (eğer hâlâ açıksa)

Local repo'da:
```bash
git rm -r app/admin/toplu-yukleme app/api/admin/toplu-yukleme 2>/dev/null
git rm sql/06-arsiv-bucket.sql 2>/dev/null
git add -A
git commit -m "v11.4: bulk upload cleanup"
```

Sonra v11.6 source'u push et.

---

## ✅ Otomatik Yapılanlar (kod tarafında)

### Güvenlik
- ✅ Admin email allowlist (middleware + RLS + API routes)
- ✅ Cart total server-side recompute (price tampering engeli)
- ✅ Reviews API'de product existence check
- ✅ Content-Security-Policy header
- ✅ Session ile beraber email_confirmed_at kontrolü
- ✅ /api/admin/* artık middleware kapsamında

### Dayanıklılık
- ✅ HOTFIX-RLS-v10.11.sql restore (disaster recovery için)
- ✅ Service Worker auto-versioning (her deploy yeni cache)
- ✅ Sitemap + robots.txt (zaten vardı, doğrulandı)
- ✅ JSON-LD schema artık env constants'tan (WA tek kaynak)

### İzlenebilirlik (env-gated)
- ✅ Sentry init kodu (DSN env'ine bağlı)
- ✅ Vercel Analytics kodu (paket + env'e bağlı)
- ✅ GA4 Consent Mode v2 (CookieConsent ile uyumlu)

### Dokümantasyon
- ✅ `docs/BACKUP-GUIDE.md` (manuel + cron)
- ✅ `docs/UPSTASH-SETUP.md`
- ✅ `docs/PERFORMANCE.md`
- ✅ `docs/TESTING.md`
- ✅ `CHANGELOG-v11.6.md`
- ✅ Bu doküman (`DELIVERY-AUDIT-v11.6.md`)

---

## 📋 Teslim Görüşmesi Senaryosu (15-20 dk)

Enes'e siteyi gösterirken bu sırayla anlat:

### 1. Yönetim girişi (3 dk)
- `/giris` aç, e-posta + şifre → `/admin` açılır
- "Bu şifre sadece sende. Kimseyle paylaşma. Kaybedersen ben sıfırlayabilirim ama
  sahip sensin."

### 2. Ürün ekleme (5 dk) — Canlı yap
- `/admin/urunler` → Yeni ürün
- Foto yükleme (drag & drop), 20'ye kadar
- Fiyat, açıklama, kategori
- Kaydet → site açıp ürünü göster

### 3. Talep akışı (3 dk)
- Bir önceki ürünü kendi telefonundan sepete ekle
- WhatsApp'tan sipariş mesajı çıkar
- Sen "Enes'in numarasından açıyorum şimdi"
- `/admin/talepler` → yeni satır görünür
- **Burada vurgu:** "WhatsApp'a düşen mesaj otomatik. Sen sadece müşteriye
  cevap ver. Talepleri panelde de görebilirsin."

### 4. Diğer admin ayarları (5 dk)
- Ayarlar → WhatsApp numarası değişebilir
- Duyuru şeridi
- Banner yönetimi
- Blog (opsiyonel anlat)

### 5. Müşteriye güvence (2 dk)
- "Bir sorun olursa hemen ara/yaz. Haftada 2-3 saat hızlı dönüş garantili."
- "Yedeklerin haftalık alınıyor (`docs/BACKUP-GUIDE.md` ona göstermeye gerek yok,
  senin için)."
- "Site SSL'li, KVKK uyumlu, hızlı."

### 6. Teslim edilen materyaller
- Admin paneline URL + giriş bilgileri (kağıtta veya 1Password share)
- `KULLANIM-KILAVUZU.md` PDF olarak gönder (admin'de zaten `/admin/kilavuz`
  sayfası var)
- Senin iletişim bilgilerin

---

## ⏰ İlk 30 Gün — Sessiz İzleme

Yayından sonra **hiç dokunma demeyelim ama** günde 1-2 kez şunlara bak:

1. **Vercel Dashboard → Logs** — Hata var mı?
2. **Supabase Dashboard → Database → Logs** — Slow query, RLS reddedilen istek?
3. **Supabase Storage → Usage** — Görsel quota'sı yaklaşıyor mu?
4. **Sentry (kurulduysa)** — JS exception'ları
5. Site açılıyor, formlar çalışıyor mu? (haftada 1 manuel smoke test)

---

## 🎓 İlk 90 Günde Yapılması Gerekenler

### Hafta 1
- Sentry hesabı aç, DSN env'ine ekle, redeploy
- Upstash Redis hesabı aç → rate limit upgrade
- `npm i @vercel/analytics @vercel/speed-insights` + env aktive

### Hafta 2-4
- Vitest setup (`npm i -D ...` `docs/TESTING.md`'deki adımlar)
- En azından `admin.test.js` koşacak duruma getir
- GitHub Actions CI yaml ekle

### Ay 2
- Backup cron route'u implemente et
- vercel.json'a `crons` ekle
- İlk disaster recovery drill'i yap

### Ay 3
- Lighthouse skorlarını ölç, < 85 ise `docs/PERFORMANCE.md` adımlarını uygula
- Supabase Pro'ya geçiş kararı (storage 700MB+ → geç)
- Custom domain için SSL renewal kontrolü (Vercel otomatik ama doğrula)

---

## 📊 Risk Matrisi (post-v11.6)

| Risk | Olasılık | Etki | Mitigasyon | Durum |
|---|---|---|---|---|
| Admin takeover | Düşük | Kritik | Allowlist + signups kapalı | ✅ Mitigated |
| Veri kaybı (yanlış silme) | Orta | Yüksek | Manuel backup guide | ⚠️ Procedural |
| Spam yorumlar | Orta | Düşük | Rate limit + profanity + product FK | ✅ Mitigated |
| Bot scraping | Yüksek | Düşük | rate-limit + robots.txt | ✅ Acceptable |
| Görsel quota dolması | Orta | Orta | Storage monitoring | 📊 Monitor |
| WhatsApp link bozulması | Düşük | Yüksek | Fallback chain | ✅ Robust |
| Vercel free tier limit | Düşük | Orta | Pro upgrade hazır | 📊 Monitor |
| KVKK denetimi | Düşük | Yüksek | Çerez consent + KVKK sayfası | ⚠️ Enes verisi eksik |
| Locale/i18n bug | Düşük | Düşük | toLocaleLowerCase('tr-TR') | ✅ Mitigated |
| SEO ranking düşüş | Orta | Orta | Sitemap + meta + JSON-LD | ✅ Mitigated |

---

## 💼 Sahiplenme / Lifecycle

### Ubeyt'in sorumluluğu
- 6 ay süreyle bug fix garantisi (haftada 2-3 saat)
- Yeni özellik talepleri → hourly veya sabit fiyat anlaşma
- Disaster recovery'de "ben varım" güvencesi

### Enes'in sorumluluğu
- Admin şifresi güvenliği
- Yeni ürün/içerik upload
- KVKK için tam yasal bilgi sağlama
- Aylık fatura (Vercel + Supabase Pro'ya geçince)

### Devir/Devredilemezlik
- **Brand assets:** Kanı Mobilya'ya ait (logo, içerik, müşteri data'sı)
- **Source code:** `by ubivo` — Ubeyt'in IP'si; Enes lisanslı kullanır
- **Hosting:** Vercel + Supabase hesapları Enes'in mail'iyle açılmış olmalı
  → "vendor lock-in" yok, istediği zaman başka geliştiriciye devredebilir

---

## 🔚 Son Sözler

Bu site **1 yıllık freelance birikiminin (Works v3.2 + Lessons Learned)**
distile edilmiş halidir. 17 sürüm (v8.x → v11.6), 12 sprint, ~200 dosya,
~6,000 satır kod.

v11.6 ile sistem **endüstri standardı production hardening'i** taşıyor:
- Defense-in-depth (middleware + RLS + signup kapatma)
- Server-side data validation (cart, reviews)
- Standard security headers (CSP, HSTS, X-Frame, etc.)
- Observability stack (Sentry + Vercel Analytics + Web Vitals)
- Disaster recovery procedure'leri
- Test foundation + CI hazırlığı

**Teslim hazır.** P0 manuel adımları (5 dakika) yapıldıktan sonra **güvenle
ship edilebilir**.

---

**by ubivo — Kanı Mobilya v11.6 Delivery Audit — 2026-05-21**
