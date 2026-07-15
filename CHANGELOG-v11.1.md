# Möbel İnegöl v11.1 — Parça Adeti + WhatsApp Bug Fix (2026-05-21)

## 1. 🐛 KRİTİK BUG: Sepet → WhatsApp Onayla → arama sayfası ✓
**Sebep:** `CheckoutFormu.jsx`'in sağ panelindeki "WhatsApp Onayla" butonu `document.querySelector('form')` ile **sayfadaki ilk form'u** submit ediyordu. Header'daki arama formu sayfada checkout formundan ÖNCE geldiği için, header arama formu submit ediliyordu → /arama sayfasına yönleniyordu.

**Fix:** `formRef = useRef(null)` + `<form ref={formRef}>` + `formRef.current?.requestSubmit()`. Artık doğru formu hedefliyor.

**Sonuç:** Sepet → Onayla → bilgileri doldur → WhatsApp Onayla → **doğrudan WhatsApp açılır**, sepetteki tüm ürünler hazır mesaj olarak gelir, müşteri sadece Gönder basar.

## 2. Parça başına adet seçici (inobilya tarzı) ✓
**Önce:** Her parça checkbox ile seçili/seçilsiz.
**Sonra:** Her parça için `[- adet +]` spinner. Adet 0 = seçili değil, 1+ = seçili. Fiyat × adet dinamik toplanır.

**Örnek (Liberta tarzı):**
- Liberta Üçlü Koltuk: 44.550 TL/adet → [- 2 +] → 89.100 TL
- Liberta Berjer: 20.640 TL/adet → [- 1 +] → 20.640 TL
- **Toplam:** 109.740 TL

**Sepete eklerken:** Her parça **kendi adetiyle ayrı sepet satırı** olarak eklenir. WhatsApp mesajında da ayrı ayrı listelenir.

**Değişen:**
- `UrunDetay.jsx`: `secimler` (checkbox) → `adetler` (sayı). Yeni `adetDegistir(i, fark)` fonksiyonu. UI tamamen yenilendi — `- N +` spinner her satırda.
- Parça modunda büyük "adet" seçici gizli (her parçanın kendi adeti var).
- `whatsappMesaj` ve `sepeteEkle` adet bazlı çalışıyor.

## Push'tan sonra
1. ZIP indir, üzerine yaz, push
2. Vercel build bekle
3. SQL adımı yok — bu sürüm sadece kod
4. Test: bir ürünün parçalarına 2 ve 1 adet seç → toplam fiyat doğru gelmeli
5. Sepete ekle → /sepet → Onayla → bilgileri doldur → "WhatsApp Onayla" → WhatsApp açılmalı (arama değil!)
6. WhatsApp'a yapışan mesajda sepetteki tüm ürünler listelenmiş olmalı

— by ubivo
