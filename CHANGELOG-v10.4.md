# Möbel İnegöl v10.4 — next-intl Runtime Fix (2026-05-21)

## Aynı WeakMap hatası: gerçek suçlu next-intl idi

**v10.3'te Next.js'i bump'ladım, hata geçmedi.**
Asıl sebep next-intl 3.17.2'deki bilinen bug — `unstable_setRequestLocale`
çağrısı Next.js cache WeakMap'ine geçersiz key gönderiyor.

**Çözüm:** next-intl 3.17.2 → 3.26.5
(bu bug 3.20.0'da fix'lendi, 3.26.5 latest stable)

## Değişen dosya
- `package.json` — sadece `next-intl` versiyonu

— by ubivo
