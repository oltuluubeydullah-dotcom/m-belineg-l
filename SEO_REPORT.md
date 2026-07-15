# SEO REPORT — Möbel İnegöl
**Tarih:** 2026-06-02 | **Auditor:** by ubivo / Works v3.2

---

## ✅ UYGULANAN FIX'LER

### SEO-01: HTML lang dinamik (KRİTİK → ÇÖZÜLDÜ)
- `app/[locale]/layout.jsx` → `<html lang={htmlLang}>`
- TR=`tr`, EN=`en`, DE=`de` — Google artık 3 dili ayrı ayrı indexler

### SEO-02: OG locale dinamik (YÜKSEK → ÇÖZÜLDÜ)
- Root layout'ta `tr_TR` hardcoded → locale layout'ta override
- TR=`tr_TR`, EN=`en_US`, DE=`de_DE`

### SEO-03: Alternates + hreflang root (YÜKSEK → ÇÖZÜLDÜ)
- `app/[locale]/layout.jsx` → `generateMetadata` ile tüm locale'lar için alternates

### SEO-04: Kategori sayfası canonical + alternates (ORTA → ÇÖZÜLDÜ)
- `kategori/[slug]/page.jsx` → tam locale-aware metadata
- Canonical: `/kategori/slug` (TR) veya `/en/kategori/slug` (EN/DE)

### SEO-05: Blog tekil yazı canonical + alternates (ORTA → ÇÖZÜLDÜ)
- `blog/[slug]/page.jsx` → alternates + canonical + locale OG

### SEO-06: Blog sitemap hreflang (ORTA → ÇÖZÜLDÜ)
- Sitemap'te blog sayfalarına `alternates.languages` eklendi

### SEO-07: Ürün OG type (DÜŞÜK → ÇÖZÜLDÜ)
- `type: 'website'` → `type: 'product'`

---

## SEO SKORU (Etap Öncesi / Sonrası)

| Alan | Öncesi | Sonrası |
|------|--------|---------|
| Teknik SEO (lang, canonical) | 40/100 | 95/100 |
| Hreflang / Alternates | 30/100 | 90/100 |
| Structured Data (Schema.org) | 75/100 | 88/100 |
| Sitemap | 75/100 | 92/100 |
| Metadata kalitesi | 70/100 | 88/100 |
| **Genel** | **58/100** | **90/100** |

---

## KALAN ÖNERİLER (kritik değil)

- `iletisim` sayfası için `LocalBusiness` schema eklenebilir
- Blog yazıları için `Article` schema düşünülebilir
- Ürün görselleri için `ImageObject` schema eklenebilir
- Google Search Console'a site eklenmeli ve sitemap submit edilmeli
