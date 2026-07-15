# Möbel İnegöl — v44 (Instagram + Mobil Fix + İnegöl SEO + R2 Custom Domain Hazırlığı)

SQL yok — direkt push edilebilir.

## ✅ 1) Instagram telefon mockup — gerçek ekran
- Gönderdiğin gerçek Instagram profil ekran görüntüsü telefonun içine kondu
  (82KB WebP). Tıklayınca IG sayfasına gider. Trendyol ile artık simetrik.

## ✅ 2) Mobil "sağa-sola kayma" (yatay taşma) — kökten çözüldü
İki cepheden birden kapatıldı:
- **Telefon mockup'ları** küçük ekranda taşıyordu (150+150px > 320px ekran).
  → Ekran-oranlı genişliğe geçildi (`42vw`, max 180px) → her telefonda
  iki-yan-yana tam sığıyor.
- **Global yatay kilit:** `html, body { overflow-x: hidden; max-width: 100% }`
  → tek bir bölüm 1px taşsa bile sayfa artık titremez.

## ✅ 3) İnegöl Mobilya uzun SEO metni (footer üstü)
- Garanti / 81 il / Avrupa / 7-24 WhatsApp kutularının HEMEN ALTINA,
  genişletilmiş İnegöl mobilya tanıtım metni eklendi (8 başlık):
  giriş · koltuk · yemek odası · yatak odası · düğün paketleri · genç odası
  · fiyatlar · "Neden Möbel İnegöl?" (7 maddelik liste).
- "İnegöl mobilya" anahtarı doğal akışta korundu (stuffing yok), Möbel İnegöl
  Mobilya markası dokundu, Avrupa teslimat + WhatsApp vurgulandı.
- **Sadece /tr** sayfasında görünür (EN/DE'de yarım çeviri SEO'ya zarar
  vermesin diye). EN/DE'de mevcut kısa tanıtım kalır.

## ✅ 4) R2 Custom Domain HAZIRLIĞI (kod tarafı bitti)
- Yeni `lib/gorsel.js` → render anında eski `r2.dev` URL'lerini canlı CDN
  domainine çevirir. 12 public render noktası + Hero + ürün galerisi bağlandı.
- **Geçiş = TEK env değişimi** (`NEXT_PUBLIC_R2_PUBLIC_URL`), DB elleme yok,
  tek görsel bile bozulmaz. Supabase URL'lerine dokunmaz.
- Cloudflare panel adımları: `R2-CUSTOM-DOMAIN-KURULUM.md` (zip içinde).
- Bu adım `r2.dev` hız sınırını (flicker'ın asıl kaynağı) kalıcı sıfırlar.

## Doğrulama
- `npm run build` ✓ Compiled successfully · tip kontrolü geçti · BUILD_ID üretildi
- Değişen tüm komponentler esbuild syntax kontrolünden geçti

## Deploy sonrası test
- [ ] Anasayfa altı: İnegöl mobilya metni 8 başlıkla görünüyor (sadece /tr)
- [ ] Mobilde sağa-sola kayma YOK, telefon mockup'ları sığıyor
- [ ] Instagram telefonunda gerçek profil ekranı, tıkla → IG açılıyor
- [ ] (R2 domain bağlanınca) env değişip görseller cdn.* üzerinden geliyor

---

## v44.1 — Instagram isim temizliği + Worker kodu
- Instagram telefon görselinden "mustafa.balci16, kanibeyi ve 4 diğer kişi
  takip ediyor" satırı kaldırıldı (FB butonu → Takip/Mesaj geçişi temiz).
- `worker.js` eklendi: r2.dev hız limitini bitiren Cloudflare Worker kodu
  (DNS taşımadan, workers.dev üzerinde). Kurulum başlığı dosyanın içinde.
- Hatırlatma: Möbel İnegöl altyapısı MÜŞTERİNİN Cloudflare/Supabase hesabında →
  Worker müşteri panelinde kurulur, sonra Vercel'de NEXT_PUBLIC_R2_PUBLIC_URL
  güncellenir.
