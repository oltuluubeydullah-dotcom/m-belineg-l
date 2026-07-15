# KANİ MOBİLYA — v13.0 Deploy Paketi (by ubivo)

Bu paket iki şey yapar: (1) modüllü takım ürününe "tüm takım / tekil modül"
sepet akışı + checkout bug fix, (2) teslimat denetiminde bulunan güvenlik
açıklarının kapatılması.

---

## 1) DOSYALARI YERLEŞTİR (repo'ya kopyala)

Aşağıdaki dosyaları repodaki **aynı yollara** koy (üzerine yaz):

| Dosya | Yol |
|------|-----|
| UrunDetay.jsx | `app/[locale]/(public)/urun/[slug]/UrunDetay.jsx` |
| page.jsx (ürün) | `app/[locale]/(public)/urun/[slug]/page.jsx` |
| CheckoutFormu.jsx | `app/[locale]/(public)/sepet/onayla/CheckoutFormu.jsx` |
| route.js (inquiries) | `app/api/inquiries/route.js` |
| cms.js | `lib/cms.js` |
| layout.jsx | `app/layout.jsx` |
| .gitignore | (kök) |

### SİL
- `ubivo-admin.html` (kök) — bu senin Ubivo master panelin, müşteri deposunda
  olmamalı. Repodan sil. (.gitignore'a eklendi, bir daha eklenmez.)

---

## 2) SQL ÇALIŞTIR (Supabase → SQL Editor)

`sql/HOTFIX-RLS-v13.0-SECURITY.sql` dosyasının tamamını yapıştır → Run.
İdempotent, kaç kez çalıştırsan sorun olmaz. Mevcut veriye dokunmaz.

Çalıştıktan sonra doğrulama (dosyanın altındaki sorgular): "açık INSERT" ve
"authenticated gevşek policy" sorguları **boş** dönmeli.

---

## 3) DEPLOY

Dosyaları push et → Vercel otomatik build alır. SQL'i build'den önce veya
sonra çalıştırabilirsin (sıra önemli değil, bağımsızlar).

---

## NE DEĞİŞTİ — ÖZET

**Özellik / Bug**
- Modüllü takımda üstte "Tüm Takımı Sepete Ekle" (yazan fiyattan, tek tık).
- Modül seçilince ayrıca "Seçili Modülleri Ekle".
- İkisi de gerçek sipariş; checkout artık modülleri DB'den fiyatlandırır
  (eski `uuid::0` hatası giderildi → modüllü sepet onayı artık çalışıyor).

**Güvenlik**
- inquiries + reviews: anon doğrudan INSERT kapatıldı (sadece API/service-role).
- reviews: eski gevşek "Admin manage reviews" (giriş yapan herkes) policy'si
  kaldırıldı; admin yazma email-allowlist'e bağlandı.
- CMS içeriği (hakkımızda, kvkk vb.): markdown render artık HTML escape + link
  şema kontrolü yapıyor → stored XSS vektörü kapandı.
- JSON-LD (`</script>` kaçışı): ürün adı vb. ile script breakout engellendi.
- ubivo-admin.html paketten çıkarıldı + .gitignore'a eklendi.

**Dokunulmayanlar**
- Veritabanı şeması, mevcut veriler, public okuma izinleri.
- Yeni npm bağımlılığı YOK.
