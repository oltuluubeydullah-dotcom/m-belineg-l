# CHANGELOG v11.5 — Mobil UX + İçerik + Hız Patch (2026-05-21)

Mobil testten 4 issue + Ubeyt'in eklediği 3 ek madde = **7 maddelik batch**. v11.4 üzerine kurulur.

---

## 1) Mobile Header Layout Fix
**Sorun:** Arama simgesi logonun üstüne biniyordu — `grid-cols-3` mobile'da eşit 3 sütun veriyor, ama `h-12` logo (4:1 oran) merkez sütundan taşıyordu.

**Çözüm:** `components/public/Header.jsx`
- Mobil grid: `grid-cols-[auto_1fr_auto]` → hamburger (auto) | logo (esnek) | actions (auto)
- Masaüstü: `md:grid-cols-3` korundu (sol arama formu için)
- Logo: `h-12 → h-10` (mobilde), `md:h-20` korundu
- `min-w-0` ve `max-w-full` eklendi — extreme dar viewport'lar için güvence
- Buton padding'leri `p-3 → p-2.5`, gap'ler sıkıştırıldı

---

## 2) Mobile Sidebar — Fixed Overlay + Body Scroll Lock
**Sorun:** Mobil menü açıkken arka sayfa kayıyordu (inline drawer'dı, sticky değildi).

**Çözüm:** `components/public/Header.jsx`
- Mobil menü artık **fixed overlay sidebar**:
  - `<aside>` panel: `fixed top-0 left-0 bottom-0 z-[51] w-80 max-w-[85vw]` — soldan slide-in
  - Backdrop: `fixed inset-0 z-50 bg-brand-dark/40 backdrop-blur-sm`
  - `overscroll-contain` ile scroll bouncing kontrolü
  - `role="dialog"` + `aria-modal="true"` — erişilebilirlik
- **Body scroll lock**: `useEffect` ile `menuAcik || aramaAcik` true iken `document.body.style.overflow = 'hidden'`
- Sidebar üstüne brand ismi + X kapat butonu
- Yeni keyframe: `slideInLeft` → `tailwind.config.js`

---

## 3) Category Cards — İnobilya-Style Image-First Overlay
**Sorun:** Eski tasarımda karartma katmanı çok kuvvetliydi, fotoğraf solgun görünüyordu. Referans (inobilya.com) tarzı istendi: fotoğraf ön planda, üzerine sadece başlık + zarif beyaz pill.

**Çözüm:** `components/public/CategoryShowcase.jsx`
- Full-overlay `bg-brand-dark/30` katmanı **kaldırıldı** — fotoğraf %100 opaklıkta
- Eski koyu gradient (`from-brand-dark/70`) → çok hafif iki uçtan koyulaşma: `from-brand-dark/15 to-brand-dark/35`
- Hover'da gradient daha da açılır → fotoğraf parlar
- Başlık: `text-lg → text-base` (mobil), `font-semibold → font-bold`, tracking sıkıştırıldı
- Drop shadow daha güçlü inline `textShadow` ile (`0 2px 14px rgba(0,0,0,0.55)`) — açık fotoğraflarda da okunur
- "İNCELE" pill butonu: padding küçültüldü `px-3.5 py-1`, tracking arttırıldı `[0.2em]` — daha zarif
- Hover scale `105 → 110` — daha belirgin canlanma

---

## 4) Sticky + Saydam Header (scroll'da blur)
**Sorun:** Header zaten sticky ama kaydırırken arka plan opak krem.

**Çözüm:** `components/public/Header.jsx`
- Yeni state: `scrolled` (window.scrollY > 8)
- `useEffect` scroll listener (`{ passive: true }`)
- Header className koşullu:
  - Üstte: `bg-brand-cream` (opak)
  - Kaydırılınca: `bg-brand-cream/80 backdrop-blur-md shadow-card`
- `transition-colors duration-200` ile yumuşak geçiş

---

## 5) "Sizin İçin Seçtiklerimiz" — Random Shuffle (YENİ)
**İstek:** Anasayfa ürün listesi yükleme sırasına göre değil, **her sayfa yüklemesinde farklı** sırada görünsün.

**Çözüm:** `app/[locale]/(public)/page.jsx`
- DB'den 48 aktif ürün çekiliyor (önceden 12 sıralı)
- **Fisher-Yates shuffle** ile JS tarafında karıştırılıyor (O(n), bias-free)
- İlk 12 ürün sunuluyor
- `force-dynamic` zaten layout'ta aktif → ISR cache devre dışı → her istekte yeni sıra
- Featured / created_at sıralaması artık etkili değil (random)

**Etki:** Müşteri ana sayfayı her açtığında farklı ürünler görür → katalogun tamamı keşfedilir.

---

## 6) Görsel Yükleme Hızlandırma (YENİ)
**İstek:** Admin'den ürün eklerken görsel yükleme yavaş.

**Çözüm:** `lib/imageUpload.js` baştan revize edildi.

| Parametre | v10.10/v11.4 | v11.5 | Etki |
|---|---|---|---|
| `MAX_BOYUT` | 2400 px | **1920 px** | %36 daha az piksel → daha küçük JPEG, daha hızlı upload |
| `KALITE` | 0.92 | **0.85** | Gözle aynı, ~%35 küçülür |
| `RESIZE_SKIP_BYTE` | 800 KB | **1.5 MB** | Web fotoları zaten optimize → resize'a hiç değmiyor, doğrudan yükle |
| `createImageBitmap` | sade decode | **resizeWidth/Height/Quality options** | GPU'da tek-pasta decode+resize (~%30-50 daha hızlı) |
| "Zaten küçükse?" check | yok | **`if (!kucult && blob.type === hedefTip) → original döndür`** | Boyut yeterliyse canvas hiç açılmaz |
| Paralellik | sınırsız `Promise.allSettled` | **4'lü kuyruk (worker pool)** | 20 dosya seçince tarayıcı boğulmaz; CPU/bandwidth dengeli |

**Yan etki:** JPEG output dosyaları artık daha küçük → Supabase storage daha az dolar, sayfa yükleme de hızlanır.

**Korunan davranışlar:**
- Magic byte tip tespiti (uzantıya güvenmez)
- HEIC → JPEG dönüşüm (heic2any lazy import, kalite 0.85 oldu)
- Türkçe spesifik hata mesajları (RLS, MIME, network, decode...)
- Eski tarayıcı fallback (`canvasResizeKlasik` korundu)
- API contract aynı — `MultiImageUploader.jsx` değişmedi

---

## 8) Hero "En İyi Teklif" Banner — Yatak Odası Modeli (YENİ)
**İstek:** Mevcut banner'da sol alanda SVG çizgi-art üçgen ve eskiz mobilyalar vardı. Sol alana gerçek bir yatak odası modeli (Enes'in gönderdiği görsel) yerleştirilsin.

**Çözüm:**
- `public/hero/yatak-odasi.jpg` eklendi (1536x1024 → 1920px uzun kenar, JPEG q=85, **138 KB**)
- `components/public/HeroCarousel.jsx` → `BannerTeklif` baştan revize:
  - SVG üçgen + eskiz çizimler **kaldırıldı**
  - Sol alana gerçek foto yerleşti, `clip-path: polygon(0 0, 100% 0, 88% 100%, 0 100%)` ile diagonal kesim (eski üçgenin estetiğini korur)
  - Masaüstü: foto sol %65 + diagonal kesim → text sağ %35 krem zeminde
  - Mobil: foto full-width + sağ kenardan kreme fade gradient → text okunur kalır
  - 2 küçük altın aksan noktası (brand karakter)
- **Admin-aware**: `banner.bg_image_url` DB'de doluysa onu kullanır, boşsa default yatak odası — yani admin'den istediğin zaman başka modelle değişebilir
- Yazı bloğu (kicker + title + body + CTA) **aynen korundu**

**Sonuç:** "En İyi Teklif" slidı artık üçgen yerine premium yatak odası modeliyle açılıyor.

---

## Değişen Dosyalar

```
M  components/public/Header.jsx           (199 → 263 satır, kapsamlı refactor)
M  components/public/CategoryShowcase.jsx (inobilya-style overlay)
M  components/public/HeroCarousel.jsx     (BannerTeklif foto-aware)
M  app/[locale]/(public)/page.jsx          (random shuffle)
M  lib/imageUpload.js                      (303 → 332 satır, speed pass)
M  tailwind.config.js                      (+1 keyframe: slideInLeft)
A  public/hero/yatak-odasi.jpg             (138 KB, 1920px hero görseli)
A  CHANGELOG-v11.5.md
```

## Etkilenmeyen alanlar (regression kontrol)
- Masaüstü header layout
- LanguageSwitcher, sepet badge davranışı
- Admin tarafı (zaten ayrı shell)
- AnnouncementBar (server component, dokunulmadı)
- ProductCard, HeroCarousel (dokunulmadı)
- WhatsApp flow, sepet state (dokunulmadı)
- `birdenCokResimYukle` API contract — return shape aynı
- `is_featured` admin tarafı görünür, sadece anasayfa "Sizin için seçtiklerimiz"de etkisiz (Düğün Paketleri ve kategori showcase hâlâ featured-aware)

---

## Manuel Test Listesi

### Mobil (375px–414px)
- [ ] Header layout: hamburger sol, logo orta, arama+dil+sepet sağ — taşma yok
- [ ] Hamburger → sidebar soldan kayarak girer
- [ ] Backdrop veya X → sidebar kapanır
- [ ] Sidebar açıkken telefonu kaydır → **arka sayfa hareketsiz**
- [ ] Arama ikonu → drawer açılır, body kilitli kalır
- [ ] Anasayfa biraz aşağı kaydır → header yarı saydam + blur
- [ ] En üste dön → header opak kreme döner
- [ ] Kategori kartları: fotoğraf parlak, başlık + İNCELE tam ortada, hover'da fotoğraf büyür

### Anasayfa
- [ ] "Sizin için seçtiklerimiz" → sayfayı 2-3 kez yenile, **sıra her seferinde farklı** olmalı
- [ ] Tüm ürünler hâlâ tıklanabilir, kart hover'ları çalışıyor

### Admin → Ürün Ekle
- [ ] 5 fotoğraflı bir ürün ekle, kronometre tut. Önceki yükleme süresiyle karşılaştır (beklenti: ~%30-50 hızlı)
- [ ] 20 fotoğraf seç → ilk dalga (4 tane) tamamlandıktan sonra otomatik bir sonraki dalga başlar
- [ ] HEIC fotoğraf yükle → otomatik JPEG'e çevirip yüklemeli
- [ ] Çok küçük fotoğraf (~200KB) → "resize skip" yolundan gider, anında biter
- [ ] Görsel kalitesi yüklemeden sonra hâlâ keskin (1920px @ 0.85 — visually identical)

### Masaüstü (1280px+)
- [ ] Üst satır: sol arama + orta logo + sağ dil+sepet
- [ ] Alt satır: kategori nav
- [ ] Scroll → blur + transparan
- [ ] Mobile sidebar görünmemeli (md+ için gizli)

---

## Sonraki Adımlar
- v11.4 deploy fix henüz tamamlanmadıysa önce o (git rm komutları MEMORY-v11.4'te)
- Bu ZIP içinde silinmiş bulk-upload dosyaları yok, dolayısıyla aynı problem **tekrar etmez**
- Random shuffle backend'de yapılıyor (server component) → cache hatası ile sabit kalmaz
- Görsel hız: 1920px yeterli gelmediği proje olursa `MAX_BOYUT` env var'a alınabilir (şu an sabit)

— by ubivo
