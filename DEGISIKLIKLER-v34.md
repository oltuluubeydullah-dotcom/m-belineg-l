# Möbel İnegöl — v34 Değişiklikleri

İki yeni ana sayfa bölümü eklendi. **Mevcut hiçbir bölüme dokunulmadı.**

## Yeni Özellikler
1. **Kategori İkon Şeridi** — hero'nun hemen üstünde (PC + mobil), yuvarlak yeşil-çerçeveli line-art ikonlar, yatay kaydırma. İkonlar sabit (by ubivo özgün SVG), admin değiştirmez.
2. **Google Müşteri Yorumları** — blog'un hemen üstünde, sürekli kayan carousel, Google görünümlü kartlar. Site içi (ürün) yorumlarından bağımsız. 23 gerçek yorum seed'li.

## Eklenen / Değişen Dosyalar
- `components/public/category-icons.jsx` (yeni — SVG ikon seti)
- `components/public/CategoryIconStrip.jsx` (yeni)
- `components/public/GoogleReviews.jsx` (yeni)
- `sql/16-mobel-site-reviews.sql` (yeni — tablo + RLS + 23 seed, idempotent)
- `app/[locale]/(public)/page.jsx` (değişti — 2 bölüm eklendi + 1 sorgu)

## DEPLOY ADIMLARI (sırayla)
1. **SQL:** Supabase'te `sql/16-mobel-site-reviews.sql` çalıştır (önce, push'tan önce). Tekrar çalıştırmak güvenli (idempotent).
2. **(Opsiyonel) Google link:** `.env`'e `NEXT_PUBLIC_GOOGLE_REVIEWS_URL=<gerçek Google yorumlar linki>` ekle. Eklemezsen "Möbel İnegöl yorumları" Google aramasına gider.
3. **Lokalde test:** `npm run build` (hatasız geçmeli) → `npm run start` ile ana sayfayı aç, iki bölümü de gör.
4. Sorun yoksa **deploy**.

## TEST CHECKLIST
- [ ] `npm run build` hatasız geçti
- [ ] Hero üstünde kategori şeridi görünüyor (PC + mobil), kaydırma çalışıyor
- [ ] İkonlar kategoriye uygun, isimler doğru
- [ ] Şerit ikonlarına tıklayınca doğru kategori sayfası açılıyor
- [ ] Blog üstünde "Google Müşteri Yorumları" görünüyor, kartlar kayıyor
- [ ] Yorum kartları Google görünümünde (avatar+ad+yıldız+zaman+metin)
- [ ] "Yorumları Gör" linki Google'a gidiyor

## NOTLAR
- **Dürüst uyarı:** Bu kod senin canlı Supabase'in ve `npm run build` ortamı buradan test EDİLEMEDİ. Sözdizimi kontrolü yapıldı (esbuild ✅) ama deploy öncesi mutlaka lokalde build + tıklama testi yap.
- Yorumlar şu an seed'li/sabit. **Admin'den yorum ekleme/düzenleme paneli** istersen bir sonraki sürümde (v35) eklerim — tablo + RLS bunu zaten destekliyor.
- İkonlar basit-temiz line-art; referans kadar zengin değil. İstersen sonra zenginleştiririz.

by ubivo
