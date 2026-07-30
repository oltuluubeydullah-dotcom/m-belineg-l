# MEMORY — Möbel İnegöl (Proje Hafızası)

> **Ajan #49 (Bağlam Mühendisi):** Her yeni oturumun BAŞINDA bu dosyayı oku ve brifing ver.
> "Nerede kaldık" bağlamı burada tutulur. Oturum sonunda güncelle.
> Bu, UbivoAgentTeam'in oturumlar-arası süreklilik omurgasıdır (bkz. `.claude/UbivoAgentTeam-MASTER.md` Bölüm 7).

---

## 1. Proje Kimliği
- **Ürün:** Möbel İnegöl — İnegöl mobilyası WhatsApp-commerce katalog sitesi. `by ubivo`.
- **Repo:** `oltuluubeydullah-dotcom/m-belineg-l` (GitHub — **şahsi hesap**, public). Geliştirme branch'i: `claude/mobel-inegol-website-qqn2ty`. Prod branch: `main`.
- **Stack:** Next.js 14.2 · Supabase · next-intl (TR/EN/DE) · Tailwind · Vitest · Cloudflare R2.

## 2. Hesap Dağılımı (önemli)
| Servis | Hesap |
|---|---|
| GitHub + Vercel | **şahsi** (oltuluubeydullah) |
| Supabase + Cloudflare | **Möbel İnegöl** (mobelinegol16@gmail.com) |

- **Supabase:** proje `mobelinegol16` · ref `dkxduxcndxpuefvvinua` · URL `https://dkxduxcndxpuefvvinua.supabase.co` · bölge eu-central-1 (Frankfurt).
- **Cloudflare R2:** bucket `mobel-medya` (oluşturuldu; API token + public URL kullanıcı tarafından eklenecek — eklenene kadar görseller Supabase Storage'a düşer).
- **Vercel:** GitHub `main`'e bağlı, push'ta otomatik deploy. Prod URL: `m-belineg-l.vercel.app` (domain `mobelinegol.com` DNS bekliyor).

## 3. İşletme Gerçek Bilgileri (SABİT — değiştirme)
- **Telefon/WhatsApp:** `+90 536 040 01 18` yanlıştı → **doğru: `+90 536 040 01 08`** (905360400108). *(Instagram bio ile teyitli.)*
- **Adres:** Wobilimo AVM, 2. Kat No.122, İnegöl / Bursa.
- **E-posta (genel):** `mobelinegol16@gmail.com` *(eskiden info@mobelinegol.com — değişti).*
- **Admin giriş:** `mobelinegol16@gmail.com` (Supabase Auth + `is_admin_email()` + Vercel `ADMIN_EMAILS` birebir aynı).
- **Instagram:** `@mobelinegol` (igsh=OWh3YWZqM2RyNTVt) · **Facebook:** `facebook.com/102441879046107`.
- **Marka renkleri:** altın sarısı `#FEC401` (+ koyu `#D9A400`) · siyah `#1A1A1A`. Trendyol YOK.

## 4. Veritabanı Durumu (Supabase — canlı)
- 26 SQL migration uygulandı (01→19 + SEED-CONTENT-PAGES + SECURITY 01-03). RLS her tabloda.
- `is_admin_email()` → ARRAY['mobelinegol16@gmail.com'] (GUC değil; Supabase managed uyumlu).
- Seed: 8 kategori, 7 içerik sayfası, 3 blog. **site_reviews: 0** (sahte Google yorumları — Galerin Mobilya'ya aitti — silindi, seed devre dışı).
- settings: whatsapp 905360400108, e-posta gmail, adres Wobilimo. Ürün: 0 (admin ekleyecek).
- DB migration'ları `apply_migration` (MCP) ile yapıldı; `sql/` klasörü kaynak/kayıt.

## 5. Tamamlanan İşler (v52 zip üstüne)
- Site + UbivoAgentTeam (.claude/) + logo/marka entegre, main'e push, Vercel'de canlı.
- **Hero düzeltmesi:** `HeroCarousel` çöküyordu (tanımsız `BannerKargo` + bozuk `BannerNakliye`) → düzeltildi, 3 slide (nakliye/yasam/yatak). Nakliye slide'ı = `public/marka/hero-avrupa-teslimat.jpg` (Avrupa teslimat afişi).
- **Logo şeffaf:** `public/marka/mobel-logo.png` artık şeffaf arka planlı siyah işleme (koyu zemin admin için `mobel-logo-white.png`). Favicon/og seti altın zeminli kaldı.
- **Instagram bölümü:** telefon mockup'ında gerçek profil ekran görüntüsü (`public/marka/instagram-profil.jpg`).
- **TrustBadges:** 2 Yıl Garanti + 7/24 WhatsApp Destek görselleri + i18n (`Trust` namespace).
- **Almanca %100:** tr/en/de = 224 anahtar tam parite. `SeoTanitim.longform` DE/EN eklendi.
- **KategoriShowcase:** hero altı kategori kartları (`components/public/KategoriShowcase.jsx`).

## 6. AÇIK DÖNGÜLER (yapılacaklar)
- ⏳ **Kategori kartı illüstrasyonları:** kullanıcı SVG çizimleri beğenmedi; **Canva'dan** üretilecek (Canva MCP bağlandı). Hedef: 8 kategori (koltuk, köşe, yatak, yemek, tv, genç odası, masa-sandalye, sehpa) için marka renginde temiz görsel → `KategoriShowcase` ILLO'ya yerleştir.
- ⏳ **Cloudflare R2:** API token + public URL (`R2_*` + `NEXT_PUBLIC_R2_PUBLIC_URL`) Vercel'e eklenecek.
- ⏳ **Domain DNS:** `mobelinegol.com` Vercel'e bağlanacak (A/CNAME).
- ⏳ **Harita pini:** `NEXT_PUBLIC_MAP_LAT/LNG` hâlâ eski konumda; Wobilimo AVM koordinatı güncellenecek.
- ⏳ **Hukuki `[DOLDUR]` alanları:** KVKK/Mesafeli Satış/Garanti-İade içerik sayfalarında resmi unvan/vergi/MERSİS boş.
- ⏳ **Admin kullanıcısı:** Supabase Auth'ta `mobelinegol16@gmail.com` oluşturuldu (Auto Confirm açık).
- ⏳ **Upstash Redis:** rate-limit için opsiyonel; eklenmedi.

## 7. Çalışma Kuralları (bu projeye özel)
- Değişiklikler `main`'e push → Vercel otomatik deploy. Build öncesi `npm run build` MUTLAKA geçmeli.
- Sandbox Supabase'e erişemez (ağ allowlist) → yerel build'de sorgular boş döner; bu NORMAL, hata değil. Gerçek hata teşhisi için Supabase MCP `get_logs`.
- Yerel build testi için geçici `.env.local` (URL+anon) yaz, sonra SİL (asla commit etme).
- Görsel işleme (logo/rozet) `scratchpad`'de Python/PIL ile; çıktı `public/marka/`.
- Prod deploy 4-approval: #07 Security + #15 QA + #19 Legal + #20 SRE (bkz. MASTER).

---
_Son güncelleme: kategori illüstrasyonları Canva'dan üretilecek aşamasında. by ubivo._
