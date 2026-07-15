# Möbel İnegöl v10.2 — Build Fix Patch (2026-05-21)

## 5 kritik düzeltme — build geçti ✓

### 1. Syntax error: kategori sayfası
**Dosya:** `app/[locale]/(public)/kategori/[slug]/page.jsx`
**Sorun:** `generateStaticParams` fonksiyonunun 3 satırı uçmuş (function header + `createPublicClient()` init + `const { data }` destructuring).
**Çözüm:** Fonksiyon tam haline geri getirildi.

### 2. Geçersiz Tabler icon
**Dosya:** `app/admin/yorumlar/YorumlarYonetim.jsx`
**Sorun:** `IconBadgeCheck` @tabler/icons-react v3.6.0'da yok.
**Çözüm:** `IconRosetteDiscountCheck` ile değiştirildi (onaylanmış rozet eşdeğeri).

### 3. Eksik export: createClient
**Dosya:** `lib/supabase/client.js`
**Sorun:** 4 admin sayfası `createClient` adıyla import ediyor ama dosya sadece `getSupabaseClient` export ediyordu.
**Çözüm:** `export const createClient = getSupabaseClient;` alias eklendi (backward-compatible).

### 4. /_not-found prerender hatası
**Dosya:** `app/layout.jsx`
**Sorun:** `<CookieConsent />` root layout'taydı, `useTranslations` hook'u kullanıyordu. `/_not-found` `[locale]` segmenti dışında olduğu için `NextIntlClientProvider` scope'unda değildi → prerender'da intl-messageformat patlıyordu.
**Çözüm:** `<CookieConsent />` root layout'tan kaldırıldı.

### 5. CookieConsent yeniden konumlandırıldı
**Dosya:** `app/[locale]/(public)/layout.jsx`
**Çözüm:** `<CookieConsent />` public layout'a taşındı — locale provider scope'unda, sadece public sayfalarda görünüyor (admin'de gereksizdi zaten).

## Build sonucu
```
Route (app)                              Size     First Load JS
└ ○ /_not-found                          ✓
└ ƒ /[locale]                            ✓
└ ƒ /[locale]/kategori/[slug]            ✓
└ ƒ /admin/yorumlar                      ✓
✓ Generating static pages (65/65)
```

— by ubivo
