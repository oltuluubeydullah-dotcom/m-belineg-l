# 🚀 Kanı Mobilya — Performans Rehberi (v11.6)

> Lighthouse hedefleri ve mobile-first optimizasyonlar.

---

## 📊 Hedefler (TESLIM-KONTROL-LISTESI'nde de var)

| Metrik | Hedef | Önemli? |
|---|---|---|
| Performance | > 85 | Mobil dönüşüm için kritik |
| Accessibility | > 90 | KVKK + erişilebilirlik yasası |
| Best Practices | > 90 | Güvenlik header'ları + HTTPS |
| SEO | > 95 | Google Search Console ranking |
| LCP (Largest Contentful Paint) | < 2.5s | Hero foto bunu belirler |
| CLS (Cumulative Layout Shift) | < 0.1 | Galeri carousel'in titrememeli |
| FID/INP (Interaction) | < 100ms | WhatsApp tıklama anında |

---

## ✅ Yapıldı (v11.6'ya kadar)

- ✅ `next/image` ile AVIF/WebP otomatik format negotiation
- ✅ Static asset 1 yıllık cache (`Cache-Control: max-age=31536000, immutable`)
- ✅ Service Worker — HTML network-first, asset cache-first
- ✅ Preconnect Supabase Storage (resource hints)
- ✅ `next/font/google` ile Poppins subset + display:swap (FOIT engellendi)
- ✅ React 18 `useDeferredValue` arama input'unda
- ✅ Image upload pipeline 2400→1920px + 0.92→0.85 quality (v11.5)
- ✅ `force-dynamic` admin write sonrası anlık reflect (no ISR stale)
- ✅ Brotli/gzip otomatik Vercel CDN
- ✅ X-DNS-Prefetch-Control on

---

## ⚠️ Kontrol Edilmesi Gerekenler

### 1. Hero foto LCP testi
`public/hero/yatak-odasi.jpg` = 141KB. Mobile 4G'de ~600ms decode + render.

**Test:**
```bash
# Production'da Chrome DevTools → Network → "Slow 3G" → Reload → LCP'yi gözle
```

**Optimizasyon yapılırsa:**
- `priority` prop'u zaten `HeroCarousel.jsx`'te ilk slide'a verilmiş mi?
- WebP/AVIF varyantı yüklenmiş mi? (next/image otomatik dönüştürür ama orijinal jpg da bandwidth yer)

### 2. Ürün galeri 20 görsel
Ürün başına 20 görselli sayfa — galeri tüm görselleri eager-load ederse ağır olur.

**Mevcut:** `Galeri.jsx` lightbox açıldığında lazy. Kontrol et:
```bash
grep -n "loading=" app/\[locale\]/\(public\)/urun/\[slug\]/Galeri.jsx
```

### 3. JS bundle size
```bash
npm run build
# .next/analyze/client.html üretilirse open et
```

**Beklenen tipik bundle:**
- First Load JS shared: ~80-100KB
- Anasayfa route: ~150-200KB

Eğer > 300KB ise:
- `@tabler/icons-react` tree-shake doğru mu? (`{ IconX } from '@tabler/icons-react'` ✅)
- Lodash, moment varsa bundle'a girer — yok şu an, OK

---

## 🎯 Performans İçin İlerideki Adımlar

### a) Hero foto optimizasyonu (LCP < 2.5s garantisi)
```bash
# 3 versiyon üret:
# - mobile-hero.webp (768px, 60KB)
# - tablet-hero.webp (1280px, 90KB)
# - desktop-hero.webp (1920px, 140KB)
# next/image sizes="(max-width: 768px) 100vw..." ile responsive serve
```

### b) Font subsetting daha agresif
Şu an Poppins 6 weight (300-800). Gerçekten kullanılan: 400, 500, 600, 700.
300 ve 800'ü kaldırırsan ~30KB font transfer azalır.

```javascript
// app/layout.jsx
const poppins = Poppins({
  weight: ['400', '500', '600', '700'],  // 300, 800 çıktı
  ...
});
```

### c) ProductCard hover efekti — CLS engeli
ProductCard hover'da `aspect-[4/3]` korumalı mı? Foto yüklenmeden div'in
yüksekliği belli olmalı, yoksa CLS artar.

```css
.product-image { aspect-ratio: 4 / 3; }
```

### d) Görseller için `loading="eager"` sadece above-fold
Anasayfa hero'da `priority` (Next.js bunu eager yapar). Diğer tüm görseller
default `loading="lazy"` olmalı.

### e) Supabase query optimization
```sql
-- Sık çekilen kolonlara index ekle (HOTFIX-RLS-v10.11.sql'den sonra)
create index if not exists idx_products_category_active
  on products(category_id) where is_active = true;

create index if not exists idx_products_featured_active
  on products(is_featured, sort_order) where is_active = true and is_featured = true;
```

### f) Edge runtime'a alabileceğin route'lar
Şu an tüm API'ler `runtime = 'nodejs'`. Gerçekten Node'a ihtiyacı olmayan
basit route'lar (`/api/reviews` GET, gelecekte cache route'ları) edge'e
alınabilir → daha hızlı cold start.

---

## 🔬 Lighthouse Otomatik Ölçüm

Vercel'de her deploy'da otomatik:

1. **Speed Insights** — `<VercelAnalytics />` set ettiğin için aktif (v11.6)
2. Dashboard → Project → Speed Insights → Real User Monitoring

Veya local CLI:
```bash
npm i -g lighthouse
lighthouse https://mobelinegol.com --view --preset=desktop
lighthouse https://mobelinegol.com --view --emulated-form-factor=mobile
```

---

## 🚨 Performans Regression Alarmı

Bir sprint sonrası Lighthouse skoru -10 düştüyse:
1. `git diff` ile son sprint'in eklediği bağımlılıkları kontrol et
2. `next build` sonrası bundle analyzer kullan
3. Network tab → "Disable cache" + reload → en yavaş request'i bul
4. CHANGELOG'a "Performance regression detected" notu düş

---

**by ubivo — v11.6**
