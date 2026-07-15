# 🚀 KANI MOBİLYA — v11.7 HIZLI PATCH

> **Tarih:** 2026-05-22
> **İçerik:** 3 hızlı düzeltme + 1 SQL update
> **Süre:** Toplam 5 dakika kurulum

---

## 📦 Paket İçeriği

| Dosya | Hedef | Aksiyon |
|---|---|---|
| `next.config.js` | `<root>/next.config.js` | **REPLACE** |
| `CategoryShowcase.jsx` | `<root>/components/public/CategoryShowcase.jsx` | **REPLACE** |
| `04-i18n-and-cms.sql` | `<root>/sql/04-i18n-and-cms.sql` | **REPLACE** (yeni kurulumlar için) |
| `HAKKIMIZDA-CONTENT-v11.7.sql` | Supabase Dashboard → SQL Editor | **RUN** |

---

## 🔧 Sorun → Çözüm Eşleştirmesi

### 1. ❌ Mağazalarımız haritası "Bu içerik engellenmiştir"

**Neden:** v11.6'da eklediğim CSP (Content-Security-Policy) header'ında
`frame-src` direktifi yoktu. Bu durumda tarayıcı `default-src 'self'`
fallback'ine düşer → Google Maps iframe bloklanır.

**Çözüm:** `next.config.js`'deki CSP'ye `frame-src` eklendi:
```
frame-src 'self' https://www.google.com https://maps.google.com
          https://www.youtube.com https://www.youtube-nocookie.com https://wa.me
```

**Aksiyon:**
1. Mevcut `next.config.js`'i bu paketten gelenle değiştir
2. Vercel'e push → otomatik deploy
3. Mağazalarımız → harita yüklendiğini gör ✅

---

### 2. ❌ Kategori kartları dikey, ürünlerle uyumsuz

**Çözüm:** `CategoryShowcase.jsx`'te `aspect-[3/4]` → `aspect-[4/3]`
ProductCard ile aynı manzara oran.

**Aksiyon:** Mevcut `CategoryShowcase.jsx`'i bu paketten gelenle değiştir.

---

### 3. ❌ Hakkımızda metni placeholder + parantez içi admin notu

**Çözüm A — DB UPDATE (mevcut site için):**
1. Supabase Dashboard → SQL Editor → New query
2. `HAKKIMIZDA-CONTENT-v11.7.sql` dosyasını yapıştır
3. **Run** butonuna bas
4. Site → /hakkimizda → yeni metni gör ✅

Bu SQL aynı zamanda **diğer tüm sayfalardaki** `*(Bu metni Admin
Panelinden düzenleyebilirsiniz.)*` notunu da temizler (KVKK,
Teslimat, Garanti, Gizlilik, Mesafeli Satış).

**Çözüm B — Seed güncelleme (yeni kurulum için):**
`sql/04-i18n-and-cms.sql` dosyası da güncellendi. Gelecekte yeni
ortam kurulduğunda placeholder zaten gelmeyecek.

---

## 📋 Deploy Sırası

```bash
# 1) Local repo'ya kopyala
cp next.config.js <projeniz>/next.config.js
cp CategoryShowcase.jsx <projeniz>/components/public/CategoryShowcase.jsx
cp 04-i18n-and-cms.sql <projeniz>/sql/04-i18n-and-cms.sql

# 2) Commit + push
cd <projeniz>
git add -A
git commit -m "v11.7: CSP frame-src + landscape categories + Hakkimizda content"
git push

# 3) Supabase Dashboard'da SQL çalıştır
# (HAKKIMIZDA-CONTENT-v11.7.sql içeriğini SQL Editor'a yapıştır → Run)

# 4) Vercel otomatik deploy edecek (~2 dk)

# 5) Test:
#    - /magazalarimiz → harita yükleniyor ✅
#    - /             → kategoriler manzara ✅
#    - /hakkimizda   → yeni metin görünüyor, parantez yok ✅
```

---

## ✅ Test Checklist

- [ ] Vercel deploy başarılı (build error yok)
- [ ] /magazalarimiz → Google Maps yükleniyor
- [ ] /iletisim → Google Maps yükleniyor (aynı CSP fix faydası)
- [ ] / (anasayfa) → Kategori kartları yatay/manzara
- [ ] /hakkimizda → Yeni metin görünüyor, "(Bu metni Admin..." NOTU YOK
- [ ] /teslimat-kurulum, /garanti-iade vb. → admin notu yok
- [ ] Chrome DevTools → Console'da CSP warning yok

---

## 📝 Hakkımızda Metnini Değiştirmek İstersen

Admin Panel üzerinden tek tıkla:

1. `/admin/icerik-sayfalari` aç
2. "Hakkımızda" satırına bas
3. Markdown editöründe değiştir → Kaydet
4. Otomatik revalidate → site anında güncellenir

Markdown desteği: `## Başlık`, `**kalın**`, `*italik*`,
`[link](url)`, `- liste`, emoji.

---

**by ubivo — v11.7 hızlı patch — 2026-05-22**
