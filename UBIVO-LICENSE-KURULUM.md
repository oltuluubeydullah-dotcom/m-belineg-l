# Ubivo License System — Kurulum Rehberi

> **v13.0 — License & Service Control**
> Solo freelancer için kontrolün her zaman sende kalmasını sağlayan sistem.

---

## 🎯 NEDİR?

Müşterinin sitesi senin **Ubivo Master Supabase**'inden gelen "lisans" sinyalini dinler. Müşteri ödemeyi geciktirirse, sen status'u Supabase Dashboard'tan değiştirirsin → site otomatik tepkilere geçer:

- **`active`** → her şey normal
- **`warning_1`** → ince sarı banner (üstte)
- **`warning_2`** → büyük turuncu banner
- **`restricted`** → WhatsApp + sepet butonları disabled
- **`maintenance`** → tam ekran "duraklatıldı" sayfası

Müşteri kodu kopyalasa bile başka domain'de çalışmaz (domain whitelist).

---

## 📦 KURULUM — 30 DAKİKA

### ADIM 1 — Ubivo Master Supabase Oluştur (10 dk)

1. [supabase.com](https://supabase.com) → **New Project**
2. İsim: `ubivo-master` (veya `ubivo-licenses`)
3. Bölge: **Frankfurt (eu-central-1)** — Türkiye'ye en yakın
4. DB şifresi: güçlü bir şifre, **kasaya kaydet**
5. Plan: **Free** yeter (5-10 müşteriye kadar)

### ADIM 2 — SQL Şemasını Yükle (5 dk)

1. Dashboard → **SQL Editor** → New Query
2. `sql/UBIVO-MASTER-SETUP.sql` içeriğini yapıştır
3. **Run** → "Success" görmeli
4. Sol menü → **Table Editor** → `licenses` tablosu görünmeli
5. İlk kayıt olarak Kanı Mobilya otomatik eklenmiş olacak

### ADIM 3 — Anon Key Al (1 dk)

1. Dashboard → **Project Settings** → **API**
2. **Project URL** kopyala → `UBIVO_SUPABASE_URL`
3. **anon public key** kopyala → `UBIVO_SUPABASE_ANON_KEY`

### ADIM 4 — Vercel Env Vars Set Et (5 dk)

Kanı Mobilya Vercel project'i → **Settings** → **Environment Variables**:

```
UBIVO_SUPABASE_URL          = https://xxx.supabase.co
UBIVO_SUPABASE_ANON_KEY     = eyJxxx...
UBIVO_LICENSE_ID            = kani-mobilya
UBIVO_DOMAIN                = mobelinegol.com
```

**Tüm environments** için: Production + Preview + Development.

### ADIM 5 — Deploy + Test (10 dk)

```bash
git add -A
git commit -m "v13.0: Ubivo License System integration"
git push
```

Deploy bittikten sonra:

#### Test 1: Active (normal mod)
- Site açılsın → hiçbir banner görünmemeli
- Admin paneline gir → uyarı yok
- WhatsApp butonu yeşil, sepet çalışıyor ✅

#### Test 2: Warning_1
Supabase Dashboard → `licenses` tablosu → Kanı satırı → `status` = `warning_1`
- 1 saat sonra (veya Vercel'den `Redeploy → Skip build cache`) anasayfada ince sarı banner görünmeli
- Admin'de turuncu uyarı kutusu

#### Test 3: Restricted
`status` = `restricted`
- WhatsApp butonu gri-kilit ikonuna döner
- Sepet onaylama → "service_paused" hatası

#### Test 4: Maintenance
`status` = `maintenance`
- Tüm public site yerine tam ekran "Servis duraklatıldı" sayfası
- Admin'e giriş yine çalışır (Enes sorunu görüp seninle iletişim kurar)

#### Test 5: Geri Açma
`status` = `active`
- 1 saat içinde her şey normale döner
- Hemen test etmek için: `Redeploy` veya kullanıcının cache'i temizlemesi gerekir

---

## 🔄 GÜNLÜK KULLANIM

### Müşteri Ödedi → Aktive Et
```sql
update licenses
   set status = 'active',
       message = null,
       paid_until = '2027-01-31'
 where license_id = 'kani-mobilya';
```

### Ödeme Gecikti → Kademeli Uyarı
```sql
-- 7 gün gecikti
update licenses set status = 'warning_1',
  message = 'Ödeme bekleniyor. Detay için iletişime geçin.'
where license_id = 'kani-mobilya';

-- 14 gün gecikti
update licenses set status = 'warning_2',
  message = 'Ödemeniz 14 gün gecikti. Lütfen bizimle iletişime geçin.'
where license_id = 'kani-mobilya';

-- 21 gün gecikti
update licenses set status = 'restricted',
  message = 'Hesabınız geçici olarak kısıtlanmıştır.'
where license_id = 'kani-mobilya';

-- 30 gün gecikti
update licenses set status = 'maintenance',
  message = 'Site servisi duraklatıldı. Lütfen bizimle iletişime geçin.'
where license_id = 'kani-mobilya';
```

Veya **Supabase Dashboard → Table Editor → tıkla edit → Save** (daha kolay).

---

## 🆕 YENİ MÜŞTERİ EKLEME (~30 dk)

### 1. Ubivo Master'da kayıt yarat
```sql
insert into licenses (
  license_id, client_name, domains, status, paid_until, monthly_fee, contact_email
) values (
  'cafe-mavi',                                    -- slug (env'da bu kullanılır)
  'Cafe Mavi — Hasan Bey',
  array['cafemavi.com', 'www.cafemavi.com'],
  'active',
  '2027-01-31',
  3000.00,
  'info@cafemavi.com'
);
```

### 2. Yeni client kodunda env vars:
```
UBIVO_SUPABASE_URL          = https://xxx.supabase.co   (SAME — senin master URL'in)
UBIVO_SUPABASE_ANON_KEY     = eyJxxx...                  (SAME — aynı anon key)
UBIVO_LICENSE_ID            = cafe-mavi                  (FARK — bu müşterinin slug'ı)
UBIVO_DOMAIN                = cafemavi.com               (FARK — bu sitenin domain'i)
```

### 3. Kanı'daki `lib/ubivo/` + `components/ubivo/` klasörlerini yeni projeye kopyala. Layout'a `<LicenseGate>` ekle. Tamam.

---

## 🛡️ HUKUKİ ZEMİN — SÖZLEŞMEYE EKLE

Bu mekanizmayı kullanmadan ÖNCE müşteri sözleşmesine ekle:

> **Madde 5 — Servis Sürekliliği ve Kesintisi**
>
> Geliştirici (ubivo) tarafından sağlanan hosting/bakım servisinin ücretinin ödenmemesi durumunda:
> - 7 gün gecikme: bilgilendirme bildirimi
> - 14 gün gecikme: site üzerinde uyarı bildirimi
> - 21 gün gecikme: işlevsellik kısıtlaması (iletişim ve sepet)
> - 30 gün gecikme: tam servis kesintisi
>
> Ödeme yapıldıktan sonra 24 saat içinde servis aynen geri verilir. Müşteri kaynak koduna sahiptir ancak hosting/servis aboneliği ayrı bir hizmettir.

Bu yazıyla **legal + etik + profesyonel.** Olmazsa "şantaj" davası riski.

---

## 🚨 GÜVENLİK NOTLARI

### Fail-Open Tasarım
Senin Ubivo Supabase'in çöker, ağ kesilirse → **client site normal çalışır** (kısıtlama uygulanmaz). Sebep: senin sunucunun çökmesi müşterinin işini etkilemesin. Etik + uzun vadeli güven.

### Cache 1 Saat
Status değişikliği anında yansımaz, **maksimum 1 saat** gecikir. Bu kabul edilebilir (acil durum yok). Acil yansıması için Vercel'den `Redeploy` veya bu repo'da `revalidateTag('ubivo-license')` çağrısı yapılabilir.

### Domain Whitelist
`domains` array'inde olmayan domain'ler `maintenance` cevabı alır. Müşteri kodu çalsa başka domain'de çalışmaz.

### Acil Override
Eğer Ubivo Master Supabase'in çöker ve hızlı çözmen gerekirse:
- Vercel'de `UBIVO_SUPABASE_URL`'i boş yap → fail-open → site normal çalışır
- Sonra Supabase'i tamir edip env'ı geri ekle

---

## 📊 İLERİ ÖZELLİKLER (v13.1+)

Şu an MVP. İleride eklenebilir:
- Otomatik ödeme takibi (Stripe/iyzico ile entegre)
- E-posta uyarı sistemi (gecikmede otomatik müşteriye mail)
- Ubivo Admin Panel (Supabase Dashboard yerine güzel bir UI)
- Çoklu seviye uyarı zamanlaması (otomatik warning_1 → warning_2 geçişi)
- Müşteri portali (müşteri ödeme geçmişini görebilsin)
- Webhook (Slack/Discord'a status değişiklik bildirimi)

---

**by ubivo — License System v1.0 — 2026**
