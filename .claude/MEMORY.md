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

### v55 oturumu (agent ekip — 5b89e90 main'e merge, canlıda)
- **SeoTanitim 4 kart artık gerçek marka görseli:** garanti+whatsapp şeffaf rozet (`trust-*.png`, beyaz zemin PIL ile şeffaflaştırıldı); avrupa+nakliye tam-kanama afiş kapak (`hero-avrupa-teslimat.jpg` yeni tam-tasarım afişle, `hero-nakliye.jpg` = "Tüm Türkiye'ye Nakliye ve Kurulum"). Eski SVG ikonlar/IKONLAR kaldırıldı.
- **Hero:** Avrupa afişi portre → PC/mobil kusursuz (arka bulanık kapak + ön object-contain, `BannerNakliye`). Koltuk slaytı `hero-koltuk.jpg`, yatak slaytı `hero-yatak.jpg` (yerel fallback; DB `bg_image_url` varsa üstüne biner).
- **Telefon:** `+90 531 347 74 68` siteden tamamen kaldırıldı (Footer + iletişim). Kalan: `+90 536 040 01 08`.
- **Header gold şerit:** arka plan `#FEC401`, logo büyütüldü (h-16/md:h-24), gold zeminde kontrast düzeltmeleri (hover'lar beyaz, sepet rozeti koyu).
- **KategoriTanitim** (yeni bileşen): kategoriye özel tanıtım (oda görseli + üst-başlık + başlık + açıklama + "Ürünleri Keşfet"). Ana sayfada kategori kartlarından sonra **Yatak Odası** bölümü eklendi (TR/EN/DE). Yemek Odası şablonu hazır, görsel bekliyor.
- **Site fontu tek fonta:** Cormorant+Inter → **Poppins** (self-hosted `@fontsource/poppins`, tailwind+globals). Bölüm başlıkları `font-light`→`font-semibold` (referans bold görünüm).

### v59 oturumu (agent ekip — branch `claude/agent-ekip-devrede-mobel-g4i49f`)
- **Hero teslimat afişleri (main'e merge — CANLI):** Avrupa afişi yeni tam-tasarım görselle değişti; **Türkiye "Nakliye ve Kurulum" afişi 4. slide** olarak eklendi. Ortak `AfisTeslimat` bileşeni: **mobil kare (1080×1080) + PC 16:9**, `object-cover` ile kenardan kenara — kırpma/bulanıklık YOK. Hero kutusu `aspect-square md:aspect-video` (max-w 1280). Görseller: `hero-avrupa-teslimat.jpg` + `hero-turkiye-nakliye.jpg` (PC), `hero-avrupa-mobil.jpg` + `hero-turkiye-mobil.jpg` (mobil 1254×1254). Slide sırası: Avrupa→Koltuk→Yatak→Türkiye.
- **A) WhatsApp şablonları CANLIYA BAĞLANDI:** `lib/whatsapp.js` builder'ları opsiyonel `templates` param alır (fallback `VARSAYILAN_SABLONLAR`). `lib/whatsapp-server.js` (cache'li server fetch, `createPublicClient`). `context/WhatsAppContext.jsx` (`useWhatsapp()` hook). Layout tek sefer çeker → provider + Footer prop; client bileşenler hook'a, server sayfalar cache'li fetch'e geçti. Admin banner "aktif" oldu. RLS zaten public-read.
- **B) Talepler & Yorumlar sayfalama:** `limit(200)` kaldırıldı → `range()` + exact/head SQL count. `components/admin/Sayfalama.jsx` (ortak). Talepler araması artık SUNUCUDA (ilike, tüm DB). Yorumlar sekme sayımları SQL count, aksiyonlarda local güncellenir.
- **C) Ürün silince yetim görsel temizliği:** UrunlerYonetim tekil+toplu silmede `resimSil` (R2 + Supabase Storage) çağırır (best-effort).
- **D) Settings singleton kaydı:** `queries.ayarlariKaydet` — id yoksa körlemesine INSERT yerine DB'den bakar (çift-satır riski kapandı); form dönen id'yi tutar.
- **E) Toplu yükleme backend'i SIFIRDAN YAZILDI:** `/api/admin/toplu-yukleme` route'u HİÇ YOKTU (UI 404 alıyordu). Artık: ZIP indir (Storage) → JSZip çöz → Kategori/Ürün/resim.jpg işle → kategori auto-create + mevcut slug atla (idempotent) → görsel R2/Storage'a. **Chunk'lama:** `offset` tabanlı, stabil sıralı, CHUNK=5 ürün/istek, client bitene kadar döngüyle çağırır (504 yok). `jszip` eklendi. ⚠️ **CANLIDA ÇALIŞMASI İÇİN:** `sql/21-mobel-arsiv-bucket.sql` Supabase'de çalıştırılmalı (eski SQL yanlışça `kani-arsiv` oluşturuyordu; doğrusu `mobel-arsiv`).

## 6. AÇIK DÖNGÜLER (yapılacaklar)
- ⏳ **Yemek Odası tanıtım görseli:** `KategoriTanitim` şablonu + TR/EN/DE metinler hazır (`KategoriTanitim.yemek_*`). Kullanıcı yemek odası fotoğrafı atınca ana sayfaya Yatak bölümünün altına eklenecek (`image=/marka/hero-yemek.jpg`, `href=/kategori/yemek-odasi`).
- ⏳ **Kategori kartı illüstrasyonları — kullanıcı export edecek.** Mevcut: `KategoriShowcase.jsx` içinde premium SVG illüstrasyonlar (canlıda). Kullanıcı Canva istedi. **Sandbox ağ politikası Canva görsel/export host'larını (`design.canva.ai`, `export-download.canva.com`) 403 ile engelliyor → ben indiremiyorum/göremiyorum.** Bu yüzden 8 kategori tasarımı kullanıcının Canva hesabında üretildi (design_type=logo, marka kiti `kAGpJfJ6wKw`); kullanıcı "ben export edip eklerim" dedi. **Bekleyen:** kullanıcı 8 PNG'yi (slug adlarıyla: koltuk-takimi/kose-koltuk/yatak-odasi/yemek-odasi/tv-unitesi/bebek-genc-odasi/masa-sandalye-set/sehpa-aksesuar) atınca `public/marka/kategori/`'ye koy + `KategoriShowcase`'i `next/image`'a çevir.
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

## 8. Bağlı Servisler (MCP — oturuma göre değişir)
- GitHub (kod), Supabase (proje `dkxduxcndxpuefvvinua`), Vercel, Cloudflare, Canva bağlanabiliyor.
- ⚠️ **Sandbox ağ kısıtı:** Supabase REST'e ve Canva export'una doğrudan `curl` ENGELLİ (403). Supabase için MCP araçlarını kullan (`apply_migration`, `execute_sql`, `get_logs`). Canva export'u indirilemiyor.

---
## 🚀 NAMESERVER GELİNCE LAUNCH CHECKLIST (kullanıcı yapacak)
Nameserver Cloudflare'a geçince tek oturumda yapılacaklar:
1. **DNS (Cloudflare):** `@`+`www` → Vercel (A `76.76.21.21` / CNAME `cname.vercel-dns.com`, proxy KAPALI), `cdn` → R2 (proxy açık).
2. **Vercel → Domains:** `mobelinegol.com` ekle (SSL otomatik).
3. **Vercel env (aynı anda gir):**
   - **R2 (görsel CDN):** `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET=mobel-medya`, `NEXT_PUBLIC_R2_PUBLIC_URL=https://cdn.mobelinegol.com`
   - **⚠️ UPSTASH (rate-limit — Agent #07 P1, kullanıcı "hatırlat" dedi):** `UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN`. Yoksa rate-limit in-memory'ye düşer, prod'da dağıtık bypass edilir (spam talep/yorum riski). **DNS için Vercel'e girerken bunu da gir.**
4. Redeploy → tam canlı.

## v60 oturumu kararları (kullanıcı onaylı)
- **Yorumlar:** misafir yorumu ANINDA görünür kalsın; admin isterse siler (ön-moderasyon YOK — kullanıcı kararı).
- **Hero Bannerlar:** admin panelinden GİZLENDİ (AdminShell menüsünden çıkarıldı). Sayfa/kod duruyor ama hero 6 slide KOD tarafından yönetiliyor; admin yönetmiyor.
- **Toplu ZIP yükleme: KOMPLE SİLİNDİ** (E özelliği geri alındı — kullanıcı "gerek yok, ürüne 20 görsel zaten yüklenebiliyor" dedi). Silinenler: `app/admin/toplu-yukleme/`, `app/api/admin/toplu-yukleme/`, `sql/21`, `jszip` bağımlılığı, kılavuz bölümü. Canlı `mobel-arsiv` bucket policy düşürüldü (boş bucket kaldı — Supabase SQL'den silinemiyor, zararsız).
- **Denetim düzeltmeleri (5 ajan):** güvenlik bucket policy is_admin_email, sessiz-hata (admin sorgu error kontrolü, whatsapp-server log, yorum sayfalama toplamı), frontend (ana sayfa sr-only h1, afiş picture+lokalize alt, checkout yarışı), i18n (İletişim/Kategori/Mağazalarımız TR/EN/DE). Hepsi main'de.
- **SEO/AEO/GEO güçlendirmesi (main'de):** llms.txt eski NAP düzeltildi + zenginleştirildi; org schema streetAddress+hasMap; ana sayfa hedef-kelime metadata "İnegöl Mobilya + Avrupa'ya Teslimat" TR/EN/DE + hreflang x-default; Service şeması (Avrupa nakliye+kurulum) + makesOffer; SSS'e 3 Avrupa long-tail sorusu ×3 dil; **SeoTanitim longform EN/DE açıldı** (içerik vardı ama locale==='tr' kapısıyla gizliymiş — büyük kazanım). Off-page için `SEO-YAPILACAKLAR.md` (firma sahibine teslim belgesi — GBP/yorum/Search Console/backlink/blog, öncelik sıralı) yazıldı.

_Son güncelleme: v59 — hero teslimat afişleri (main'de CANLI) + WhatsApp şablonları canlıya + talepler/yorumlar sayfalama + ürün-sil görsel temizliği + settings singleton + toplu-yükleme backend'i (branch'te). TAMAMLANANLAR (main'de canlı): A-E hepsi merge edildi + sql/21 canlı Supabase'de çalıştırıldı (mobel-arsiv bucket kuruldu) + harita konum linkleri yeni Wobilimo AVM pinine güncellendi (link-only, koordinat girilmedi — SEO fallback 40.07660/29.51540 = İnegöl merkez, yeterli). Bekleyen: (1) hukuki [DOLDUR] alanları (kullanıcı: ünvan/vergi/MERSİS bilgisi bekliyor), (2) R2 görsel CDN + domain DNS (nameserver değişimi bekliyor), (3) ürün yüklemesi (toplu yükleme hazır). Yeni oturum bu dosyadan devam etmeli. by ubivo._
