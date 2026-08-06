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

### v61 oturumu (agent ekip — LAUNCH/DNS + header) — CANLI
- **Masaüstü header logo ORTAYA alındı (main'e merge — CANLI):** PC üst bar `flex` → `grid grid-cols-3`: **solda arama · ortada logo · sağda dil+sepet** (mobil ile görsel tutarlılık — kullanıcı talebi). Logo `h-24 lg:h-28`, arama `max-w-xs lg:max-w-sm`. Mobil düzen değişmedi (zaten logo ortadaydı). Build ✓, commit `e49a441`.
- **NAMESERVER BAĞLANDI → DNS cutover başladı (kullanıcı yapıyor):** Cloudflare'a NS geçti (`kayleigh` + `nitin`). Cloudflare eski Hostinger kayıtlarını import etti; düzeltildi. **Apex `A` → `76.76.21.21` (DNS only) → ÇALIŞIYOR.** Vercel'de apex "DNS Change Recommended" (öneri, HATA DEĞİL — A kaydı geçerli), `www` "Generating SSL Certificate" (bekliyor). **Not:** Cloudflare bir kaydın TİPİNİ (A→CNAME) yerinde değiştirmez; CNAME istenirse sil-ekle gerekir — ama A kaydı çalıştığı için GEREK YOK.
- **Vercel env değişkenleri kullanıcı tarafından eklendi:** `NEXT_PUBLIC_SITE_URL=https://mobelinegol.com` + R2 beşlisi + (Upstash). ⚠️ `NEXT_PUBLIC_*` girerken Vercel "exposes to browser / Mark as Safe" uyarısı verir → site URL/R2 public URL için NORMAL, **Mark as Safe** basılır (gizli değiller). `UPSTASH_*` ve `R2_SECRET/ACCESS_KEY` ASLA `NEXT_PUBLIC_` yapılmaz.
- **Lorien Furniture uyarlaması TESLİM:** ayrı proje (kardeş repo değil, zip). Möbel iyileştirmeleri (whatsapp binding, sayfalama, ayarlar singleton, görsel temizliği, checkout yarışı, SEO Service+makesOffer+x-default+h1, WhatsAppButton i18n) uyarlandı. **Marka/adres/kategori kartları DOKUNULMADI** (Lorien orijinal). `scratchpad/lorien/` + `lorien-furniture-uyarlanmis.zip` + `UYARLAMA-NOTU.md`. Build ✓.

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
- 🔄 **Domain DNS (SÜRÜYOR):** NS Cloudflare'da, apex A çalışıyor, www SSL üretiliyor. www "Valid" olunca redirect ayarı + Redeploy + test (bkz. Launch Checklist).
- 🔄 **Cloudflare R2:** env'ler Vercel'e girildi; `cdn.mobelinegol.com` custom domain + bucket public erişimi doğrulanacak (girilmezse görseller Supabase Storage'a düşer — çalışır).
- 🔄 **Upstash Redis:** env girildi (kullanıcı); Redeploy sonrası rate-limit'in Upstash'e bağlandığı doğrulanmalı.
- ⏳ **Harita pini:** Wobilimo AVM Google Maps LİNKİ 3 tıklanabilir noktada güncel (link-only). SEO fallback koordinat `40.07660/29.51540` (İnegöl merkez) — yeterli; kesin koordinat istenirse `NEXT_PUBLIC_MAP_LAT/LNG` set edilir.
- ⏳ **Hukuki `[DOLDUR]` alanları:** olabildiğince dolduruldu (amatör placeholder kalmadı); resmi unvan/vergi/MERSİS kullanıcıda — o gelince eklenecek.
- ✅ **Admin kullanıcısı:** Supabase Auth'ta `mobelinegol16@gmail.com` (Auto Confirm açık).

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
## 🚀 LAUNCH CHECKLIST — DEVAM EDEN (nameserver BAĞLI, DNS cutover sürüyor)
Durum: NS Cloudflare'da · apex A kaydı çalışıyor · www SSL üretiliyor · env'ler girildi.
1. ✅ **NS:** Cloudflare'a geçti. ✅ **DNS apex:** `A @ → 76.76.21.21` (DNS only) çalışıyor. 🔄 **www:** `CNAME www → cname.vercel-dns.com` (DNS only), Vercel SSL üretiyor — "Valid Configuration" olana kadar bekle. `cdn` → R2 (proxy açık) R2 bağlanınca.
2. 🔄 **Vercel → Domains:** apex "DNS Change Recommended" (öneri, hata değil — çalışıyor), www SSL bitince yeşile döner. **Redirect:** apex ana, www → apex.
3. ✅ **Vercel env girildi (kullanıcı):** `NEXT_PUBLIC_SITE_URL=https://mobelinegol.com` + R2 beşlisi + Upstash. (`NEXT_PUBLIC_*` uyarısında "Mark as Safe".)
4. 🔄 **Redeploy** (env aktif olması için) → **test:** `https://mobelinegol.com` açılıyor mu + SSL kilit + **mobil admin girişi** (kendi domainde Safari cookie sorunu düzelmeli) + görseller (R2 hazırsa CDN'den).
5. **Canlı sonrası:** Google Search Console + Bing + sitemap gönder → sonra off-page SEO (`SEO-YAPILACAKLAR.md`) → ürün yüklemesi.

## v60 oturumu kararları (kullanıcı onaylı)
- **Yorumlar:** misafir yorumu ANINDA görünür kalsın; admin isterse siler (ön-moderasyon YOK — kullanıcı kararı).
- **Hero Bannerlar:** admin panelinden GİZLENDİ (AdminShell menüsünden çıkarıldı). Sayfa/kod duruyor ama hero 6 slide KOD tarafından yönetiliyor; admin yönetmiyor.
- **Toplu ZIP yükleme: KOMPLE SİLİNDİ** (E özelliği geri alındı — kullanıcı "gerek yok, ürüne 20 görsel zaten yüklenebiliyor" dedi). Silinenler: `app/admin/toplu-yukleme/`, `app/api/admin/toplu-yukleme/`, `sql/21`, `jszip` bağımlılığı, kılavuz bölümü. Canlı `mobel-arsiv` bucket policy düşürüldü (boş bucket kaldı — Supabase SQL'den silinemiyor, zararsız).
- **Denetim düzeltmeleri (5 ajan):** güvenlik bucket policy is_admin_email, sessiz-hata (admin sorgu error kontrolü, whatsapp-server log, yorum sayfalama toplamı), frontend (ana sayfa sr-only h1, afiş picture+lokalize alt, checkout yarışı), i18n (İletişim/Kategori/Mağazalarımız TR/EN/DE). Hepsi main'de.
- **SEO/AEO/GEO güçlendirmesi (main'de):** llms.txt eski NAP düzeltildi + zenginleştirildi; org schema streetAddress+hasMap; ana sayfa hedef-kelime metadata "İnegöl Mobilya + Avrupa'ya Teslimat" TR/EN/DE + hreflang x-default; Service şeması (Avrupa nakliye+kurulum) + makesOffer; SSS'e 3 Avrupa long-tail sorusu ×3 dil; **SeoTanitim longform EN/DE açıldı** (içerik vardı ama locale==='tr' kapısıyla gizliymiş — büyük kazanım). Off-page için `SEO-YAPILACAKLAR.md` (firma sahibine teslim belgesi — GBP/yorum/Search Console/backlink/blog, öncelik sıralı) yazıldı.

_Son güncelleme: **v61** — masaüstü header logosu ORTAYA alındı (main'de CANLI, commit `e49a441`) + **nameserver Cloudflare'a bağlandı, DNS cutover sürüyor** (apex A `76.76.21.21` çalışıyor, www SSL üretiliyor) + Vercel env'leri girildi (`NEXT_PUBLIC_SITE_URL` + R2 + Upstash, "Mark as Safe") + Lorien Furniture uyarlaması teslim (zip). **ŞU AN NEREDE KALDIK:** www SSL "Valid" olmasını bekliyoruz → sonra redirect (apex ana) + Redeploy + `https://mobelinegol.com` testi + mobil admin girişi testi. Bekleyen: (1) hukuki resmi unvan/vergi/MERSİS (kullanıcıda), (2) R2/Upstash bağlantı doğrulaması (Redeploy sonrası), (3) canlı sonrası Search Console + off-page SEO (`SEO-YAPILACAKLAR.md`) + ürün yüklemesi. Yeni oturum bu dosyadan + Launch Checklist'ten devam etmeli. by ubivo._
