# R2 Görsel Küçültme — Kurulum & Çalıştırma

**Amaç:** Mevcut ~1537 tam-boyut görseli 1600px'e indirip siteyi hızlandırmak.
URL'ler aynı kalır → DB değişmez, redeploy gerekmez. Yeni upload'lar zaten küçük.

> ⚡ Beklenen: her görsel ~2 MB → ~250 KB (8x hafif). Kalite aynı (1600px, retina-net).

---

## ADIM 0 — Worker cache'ini güncelle (1 dk, ÖNEMLİ)
Toplu küçültme aynı dosyanın üzerine yazar. Worker eski büyük görseli cache'te
tutmasın diye cache süresini düşürdük.

1. Cloudflare → Workers & Pages → `mobel-gorsel` → **Edit code**
2. Güncel `worker.js`'i yapıştır (bu pakette) → **Deploy**

(Tek değişiklik: cache `immutable 1 yıl` → `1 gün`. Böylece küçülttüğün görsel
1 gün içinde her yerde yenilenir.)

---

## ADIM 1 — Gerekli araçlar (bilgisayarında)
- **Node.js 18+** kurulu olmalı (`node -v` ile kontrol et)
- Bu paketteki `scripts/resize-r2.mjs` dosyası

Terminalde script klasöründe:
```bash
npm init -y
npm install @aws-sdk/client-s3 sharp
```

---

## ADIM 2 — R2 API anahtarı al (Cloudflare)
1. Cloudflare → **R2** → sağ üst **Manage R2 API Tokens** → **Create API Token**
2. İzin: **Object Read & Write** · bucket: Möbel İnegöl bucket'ı
3. Sana şunları verir → bir yere kaydet:
   - **Access Key ID**
   - **Secret Access Key**
   - **Account ID** (R2 ana sayfasında da yazar)
   - **Bucket adı** (Worker binding'inde gördüğün bucket)

---

## ADIM 3 — Env değişkenlerini ver + çalıştır

**Mac/Linux:**
```bash
export R2_ACCOUNT_ID="hesap-id"
export R2_ACCESS_KEY_ID="access-key"
export R2_SECRET_ACCESS_KEY="secret-key"
export R2_BUCKET="bucket-adi"
```
**Windows (PowerShell):**
```powershell
$env:R2_ACCOUNT_ID="hesap-id"
$env:R2_ACCESS_KEY_ID="access-key"
$env:R2_SECRET_ACCESS_KEY="secret-key"
$env:R2_BUCKET="bucket-adi"
```

### Sırayla çalıştır (güvenli):
```bash
# 1) Önce DENE — hiçbir şey yazmaz, sadece ne olacağını gösterir
node scripts/resize-r2.mjs --dry-run

# 2) 5 görselde gerçek dene (yedekli) → siteyi aç, kaliteyi kontrol et
node scripts/resize-r2.mjs --limit=5 --backup

# 3) İyiyse TÜMÜNÜ çalıştır (yedekli)
node scripts/resize-r2.mjs --backup
```

---

## GÜVENLİK NOTLARI
- `--backup` → orijinaller `_orijinal/` klasörüne kopyalanır (geri dönüş garantisi)
- Script **sadece küçültür**, büyütmez; küçülmeyen görsele dokunmaz
- Format korunur (webp→webp, jpg→jpg) → bozulma yok
- URL'ler aynı → DB/site/deploy DEĞİŞMEZ

## SONUÇ
Çalışınca her görsel ~8x hafifler. Worker cache 1 gün içinde yenilenir,
site belirgin hızlanır. Ürün sayfasındaki 20 görsel artık ~5 MB yerine
toplam ~1 MB'a iner.

by ubivo · byubivo.com
