# Möbel İnegöl — Tam Denetim Düzeltmeleri (v33)

Agent ekip tam taraması sonrası uygulanan düzeltmeler. v32 (kapak ürünü +
featured sıralama) üzerine eklenmiştir.

## 🔴 Supabase free-tier ömrü — KRİTİK düzeltme
page_views ve site_events tabloları sınırsız büyüyordu (temizlik yoktu) →
500MB limiti dolacaktı. Artık günlük keepalive cron'u 90 günden eski analytics
satırlarını otomatik siliyor. Free tier bu site için yıllarca yeter.
> Dosya: app/api/keepalive/route.js
> Gereksinim: CRON_SECRET env + mevcut günlük Vercel cron (zaten var).
> Ek SQL gerekmez.

## 🟠 Sessiz hata düzeltmesi (Agent 54)
Admin panelinde 7 boş catch hatayı sessizce yutuyordu → artık console.error ile
loglanıyor (admin boş ekranın sebebini görebilir).
> Dosya: app/admin/page.jsx

## 🟢 Hız
Anasayfa ISR 60s → 300s (gereksiz DB yenilemesini azaltır, egress düşer).
> Dosya: app/[locale]/(public)/page.jsx

## 🔵 SEO/AEO/GEO
NOT: LocalBusiness/FurnitureStore schema, AI-bot izinleri (robots), ürün
aggregateRating + offers + review schema ZATEN mevcuttu — dokunulmadı.
Tek gerçek eksik olan BreadcrumbList eklendi (ürün + kategori) →
Google kırıntı yolu + AEO/GEO için yapısal veri.
> Dosyalar: app/[locale]/(public)/urun/[slug]/page.jsx
>           app/[locale]/(public)/kategori/[slug]/page.jsx

## Dürüst notlar
- "Her aramada 1. sıra" garanti edilemez (Google + rekabet + eski domain belirler);
  teknik altyapı zirveye çekildi.
- Free tier retention ile uzar; trafik çok artarsa ileride Pro gerekebilir.

## Deploy hatırlatması
- v32'den gelen sql/15-mobel-category-cover-product.sql HÂLÂ çalıştırılmalı
  (kapak ürünü kolonu). Bu denetim batch'i ek SQL gerektirmez.
- Build doğrulandı: next build ✓, 78/78 sayfa.

by ubivo
