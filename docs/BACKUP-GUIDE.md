# 💾 Kanı Mobilya — Yedekleme Rehberi (v11.6)

> **Supabase Free tier'da otomatik PITR (Point-in-Time Recovery) YOKTUR.**
> Bu rehber haftalık manuel + isteğe bağlı otomatik yedekleme akışını anlatır.
> Tek bir "yanlış silme" → aylarca emek kaybolabilir. **Yedek almak ŞART.**

---

## 1) Hızlı Manuel Yedek (5 dakika)

Supabase Dashboard üzerinden:

1. **SQL Editor** → New query
2. Aşağıdaki sorguları sırasıyla çalıştır, sonuçları CSV olarak indir:

```sql
-- Ürünler
SELECT * FROM products ORDER BY created_at;
-- Kategoriler
SELECT * FROM categories ORDER BY sort_order;
-- Talepler (sipariş geçmişi — ÖNEMLİ!)
SELECT * FROM inquiries ORDER BY created_at DESC;
-- Blog
SELECT * FROM blog_posts ORDER BY created_at DESC;
-- Ayarlar
SELECT * FROM settings;
-- Hero banner
SELECT * FROM hero_banners;
-- İçerik sayfaları
SELECT * FROM content_pages;
-- Yorumlar
SELECT * FROM reviews;
```

Her sorgu sonucunda sağ üstte "Download CSV" butonu var.

**Sıklık:** En az haftada 1 kez, ürün katalogu büyüdükçe daha sık.

---

## 2) Tam Veritabanı Dump (PostgreSQL formatı)

### Yöntem A — Supabase CLI (önerilen)

```bash
# 1) CLI kur
npm i -g supabase

# 2) Projeye bağlan (bir defa)
supabase login
supabase link --project-ref <PROJECT_REF>

# 3) Dump al
supabase db dump --file backups/kani-$(date +%Y%m%d).sql

# 4) Sadece data dump (schema değişmediyse)
supabase db dump --data-only --file backups/kani-data-$(date +%Y%m%d).sql
```

### Yöntem B — Doğrudan pg_dump

Supabase Dashboard → Settings → Database → Connection string'den PostgreSQL
URL'sini al, sonra:

```bash
pg_dump "postgresql://postgres.[ref]:[PASSWORD]@aws-0-eu-central-1.pooler.supabase.com:5432/postgres" \
  --no-owner --no-acl --schema=public \
  --file backups/kani-$(date +%Y%m%d).sql
```

**Geri yükleme:**

```bash
psql "postgresql://..." --file backups/kani-20260521.sql
```

---

## 3) Storage Yedekleme (görseller)

Supabase Free → 1GB total storage. Möbel İnegöl görselleri en kıymetli varlık.

### Yöntem A — Storage CLI

```bash
# Tüm bucket'ı indir
supabase storage download kani-medya backups/storage-$(date +%Y%m%d)/ --recursive
```

### Yöntem B — Manuel (Dashboard)

Dashboard → Storage → kani-medya → her klasörü tek tek "Download" ile indir.
**Sürdürülebilir değil.** CLI'yi tercih et.

---

## 4) Otomatik Cron Backup (önerilen)

Vercel Cron Jobs ile haftalık otomatik backup'ı tetikle.

### Adım 1 — Cron route oluştur

`app/api/cron/backup/route.js`:

```javascript
import { NextResponse } from 'next/server';
import { getServiceClient } from '@/lib/supabase/service';

export const runtime = 'nodejs';
export const maxDuration = 60;

export async function GET(request) {
  // Vercel Cron'dan gelmiyorsa reddet (CRON_SECRET set edilmeli)
  const auth = request.headers.get('authorization');
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const svc = getServiceClient();
  if (!svc) return NextResponse.json({ ok: false }, { status: 503 });

  // Tüm tabloları çek
  const tablolar = ['products', 'categories', 'inquiries', 'blog_posts', 'settings', 'hero_banners', 'reviews'];
  const dump = {};
  for (const t of tablolar) {
    const { data } = await svc.from(t).select('*');
    dump[t] = data || [];
  }

  // E-posta ile gönder (Resend, SendGrid vb.) veya başka storage'a kaydet
  // ÖRNEK: GitHub Gist'e POST
  const tarih = new Date().toISOString().split('T')[0];
  console.log(`[BACKUP] ${tarih} — ${Object.keys(dump).join(', ')}`);

  // TODO: external storage push (S3, R2, GitHub gist, vb.)
  return NextResponse.json({
    ok: true,
    tarih,
    kayitlar: Object.fromEntries(
      Object.entries(dump).map(([k, v]) => [k, v.length])
    ),
  });
}
```

### Adım 2 — vercel.json'a cron ekle

```json
{
  "crons": [
    {
      "path": "/api/cron/backup",
      "schedule": "0 3 * * 0"
    }
  ]
}
```

Bu her **Pazar gece 03:00 UTC** çalışır.

### Adım 3 — Env değişkeni

Vercel'de `CRON_SECRET` ekle (rastgele 32+ karakter):

```
CRON_SECRET=$(openssl rand -hex 32)
```

---

## 5) Disaster Recovery Drill (yarıyıl 1 kez)

Yedeklerin GERÇEKTEN çalıştığını test et:

1. Supabase'de boş bir staging projesi aç
2. En son `kani-XXXXXXXX.sql` dump'ını yükle
3. Storage CSV'lerinin doğru kategori/ürün yapısı verdiğini doğrula
4. App'i staging Supabase'le başlat → site açılıyor mu?

Bu drill ayda 1 değil, en az 6 ayda 1 yapılmalı. Aksi halde yedek var ama
restore prosedürünü kimse bilmiyor → "Schrödinger's backup".

---

## 6) Free → Pro Plan'a Geçiş Sinyalleri

Supabase Pro ($25/ay) ile gelen ek güvenceler:

- **Daily automated backups** (7 gün retention) — Free'de YOK
- **Point-in-time Recovery** (7 gün retention)
- 8GB storage (Free 1GB)
- 50GB per-file limit (Free 50MB)

**Geçme sinyalleri:**
- 80+ ürün eklendi → 1GB storage limitine yakınlaşmak
- Aylık 1000+ inquiry → ciddi veri kaybı riski
- Müşteri sayısı arttı → "geri alabilmeliyim" güveni şart

---

## 7) Önerilen Yedek Rutini

| Sıklık | İş | Süre |
|---|---|---|
| Haftalık | Manuel CSV indir (kritik tablolar) | 5 dk |
| Aylık | `supabase db dump` (tam SQL) | 10 dk |
| Aylık | Storage CLI dump | 15 dk |
| 6 aylık | Disaster recovery drill | 1 saat |
| Production'da | Vercel Cron + external push | One-time setup |

---

## 8) Klasör Yapısı Önerisi

```
/Users/ubeyt/kani-yedekler/
├── 2026-05-21/
│   ├── kani-tam.sql
│   ├── products.csv
│   ├── inquiries.csv
│   └── storage/
└── 2026-06-04/
    └── ...
```

Sabit diskte tutma → bir Google Drive klasörüne ya da harici disk'e
yansıt. Tek nokta arıza riski yok.

---

**by ubivo — 2026-05-21 (v11.6)**
