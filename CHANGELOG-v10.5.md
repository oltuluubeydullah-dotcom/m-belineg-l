# Möbel İnegöl v10.5 — /giris Routing Fix (2026-05-21)

## /giris 404 hatası çözüldü

**Sorun:** `/giris` ve `/tr/giris` adresleri 404 dönüyordu.

**Sebep:** `middleware.js`'de `/giris` path'i auth middleware'e yönlendirilmişti,
ancak gerçek sayfa `app/[locale]/giris/page.jsx` altında. Auth middleware
locale segmentini çözmediği için Next.js sayfayı bulamıyordu.

**Çözüm:** `/giris` artık intl middleware'e gidiyor.
Login sayfası auth gerektirmediği için bu güvenli (login OLAN sayfa zaten).
Login sonrası `/admin`'e yönlendirme yine auth middleware'den geçer.

## Değişen dosya
- `middleware.js` — 1 satır

— by ubivo
