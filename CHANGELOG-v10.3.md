# Möbel İnegöl v10.3 — Runtime Fix (2026-05-21)

## Runtime hatası çözüldü: WeakMap.set TypeError

**Sorun:** Site Vercel'de "Ready" olmasına rağmen anasayfa açılınca
`TypeError: Invalid value used as weak map key` hatası fırlatıyor,
`app/error.jsx` boundary devreye girip "Bir Sorun Oluştu" gösteriyordu.

**Sebep:** Next.js 14.2.3'te `next-intl` + `unstable_setRequestLocale`
+ `dynamic = 'force-dynamic'` kombinasyonunda bilinen runtime bug'ı.
Next.js'in app-page runtime'ı WeakMap'e geçersiz key gönderiyor.

**Çözüm:** Next.js 14.2.3 → 14.2.35'e güncellendi
(eslint-config-next de aynı şekilde).
14.2 minor serisi içinde, breaking change yok, sadece bug + güvenlik patch'leri.

## Değişen dosya
- `package.json` — Next & eslint-config-next versiyonları

— by ubivo
