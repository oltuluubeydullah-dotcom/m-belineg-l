# Möbel İnegöl v31 — FINAL (Frontend + İçerik) — Deploy Rehberi
**by ubivo · UbivoAgentTeam**

> v30 (güvenlik) zaten canlıda. Bu paket onun ÜZERİNE v31 frontend + içerik ekler.
> Sıra: **(1) SQL çalıştır → (2) kodu push et.**

---

## (1) SUPABASE'DE ÇALIŞTIR — sadece 1 dosya kaldı
Daha önce çalıştırdıkların (15-analytics-events + SECURITY-MIGRATION-03) tamamdı.
Geriye **içerik sayfaları** kaldı:

**`sql/SEED-CONTENT-PAGES-v31.sql`** → 7 müşteri-hizmetleri sayfasını dolu içerikle doldurur (eksik `sss` dahil). İdempotent.

> ⚠️ İçindeki `[DOLDUR: ...]` (resmi unvan/vergi/MERSİS) alanlarını sonra tamamla; hukuki sayfaları bir hukukçuya onaylat.

## (2) KODU PUSH ET
Bu zip'teki tüm dosyalar güncel (v30 + v31). Repo'na uygula ve push et. Vercel otomatik deploy eder. Ekstra env gerekmiyor.

---

## v31'DE NE DEĞİŞTİ

### Performans (admin akıcılık)
- **Görsel yükleme donması** çözüldü: `lib/imageUpload.js` (tek-decode, paralel kuyruk 6→3 / 3→2), `MultiImageUploader.jsx` (önizleme `decoding=async` + `loading=lazy`). **Görsel kalitesi birebir aynı** (max 1600/1920px, kalite 0.82–0.85).

### Header / Hero
- **Header:** logo büyütüldü, arama çubuğu sağa alındı, kategori menüsü **flex-wrap** (EN/DE uzun etiketleri artık iki kenardan taşıp kırpılmıyor).
- **Hero TIR slide:** boş/kopuk kompozisyon düzeltildi — marka tonlu zemin + yumuşak turkuaz ışıma ile kamyon ve yazı görsel olarak bağlandı.
- **CTA butonları yeşil:** Hero "Koleksiyonu Keşfet" + "Tüm Koleksiyonu Gör" + TIR slide butonu → `brand-teal` (logo yeşili). Yeni `.btn-teal` sınıfı eklendi.

### Ürün kartı
- **Fiyat:** `font-display` (ince serif) → `font-sans font-bold text-lg/xl` (büyük, belirgin, profesyonel).
- **Ürün adı:** global serif override'ı kaldırıldı → temiz `font-sans font-semibold` (Inter).

### Kategori kartları (anasayfa)
- Sıra sabitlendi (firma talebi): **Düğün Paketleri · Yatak Odası · Koltuk Takımı · Köşe Koltuk · Yemek Odası · TV Ünitesi · Masa & Sandalye Set · Bebek & Genç Odası**. Sehpa & Aksesuar showcase'ten çıkarıldı, Düğün Paketleri başa alındı. (Nav/kategori sayfaları etkilenmez.)

### i18n / Çeviri
- **Ürün ismi çeviri kök bug'ı düzeltildi** (Türkçe ı/I): artık doğru → *Akra Bedroom Set*, *Candy Corner Sofa Set*, *Milano…* (Mılano değil), *TV Unit* korunur. Marka adları İngilizce Title Case.
- **Üst teslimat bandı** artık EN/DE'de yerelleştirilmiş metin gösterir (TR'de admin metni).
- "köşe koltuk takımı" tam kalıbı sözlüğe eklendi.

### Sepet / WhatsApp
- **"Sepetim"** (ve "Siparişi Onayla") başlığı kategori hero'suyla **birebir aynı** font/renk (`font-semibold text-white drop-shadow`).
- **WhatsApp mesajı:** "Toplam (yaklaşık)" → **"TOPLAM FİYAT"** (EN: TOTAL PRICE, DE: GESAMTPREIS).

### İçerik (SQL)
- 7 sayfa dolu/kapsamlı: Hakkımızda, Teslimat & Kurulum, SSS, Garanti & İade, Gizlilik & Çerez, KVKK, Mesafeli Satış Sözleşmesi.

---

**Doğrulama:** `next build` → ✓ Compiled successfully · `npm run lint` → hata yok · `npm test` → 13/13.

## Eyeball gereken tek yer
**Hero carousel** görsel/öznel kalemdi. TIR slide'ı ve responsive davranışı sağlamlaştırdım ama push'tan sonra PC + mobilde bir bak; "şurası şöyle olsun" dersen hızlı bir tur daha atarız. Diğer her şey net/tamam.
