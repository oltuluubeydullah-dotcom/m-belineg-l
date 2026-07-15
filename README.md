# Möbel İnegöl — Web Sitesi

Next.js 14 + Supabase + Vercel altyapısıyla hazırlanmış mobilya e-ticaret sitesi.

## Kurulum

1. `sql/KURULUM-SIRASI.md` dosyasını okuyun ve SQL'leri sırayla çalıştırın
2. `.env.example`'ı `.env.local` olarak kopyalayın ve doldurun
3. Vercel'e deploy edin, env değişkenlerini ekleyin

## Özellikler

- 🛍️ Ürün katalogu (max 1500 ürün, 25 fotoğraf/ürün)
- 📊 Admin: Ziyaretçi, tıklanma, favori istatistikleri
- ❤️ Ürün favorileme (session bazlı)
- 📸 Instagram + Yurtdışı Teslimat bölümü
- 📝 Blog: 4 kategori, kapak görseli, okuma süresi
- 🗺️ Koordinat bazlı mağaza haritası
- 🔄 Supabase keep-alive (her 3 günde otomatik ping)
- 🌍 Çoklu dil (TR / EN / DE)

## Admin Panel

`/giris` adresinden giriş → `/admin` dashboard

by ubivo — 2026
