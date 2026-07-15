# Möbel İnegöl — Detaylı Kurulum Rehberi

Bu rehber adım adım, hiç şey atlamadan kurulum anlatır.

---

## Bölüm 1: Lokalde Çalıştır (Adım 1-3)

### 1.1 — Node.js Kurulu mu?

Bilgisayarında **Node.js 20+** olmalı. Terminalde kontrol:

```bash
node --version
```

`v20.x.x` veya üstü görmen lazım. Yoksa:
- **Windows/Mac:** https://nodejs.org/ → LTS sürümünü indir
- **Mac (Homebrew ile):** `brew install node`

### 1.2 — Proje klasöründe terminal aç

ZIP'i açtın, içinde `kani-mobilya` klasörü var. O klasörün **içine** terminal aç.

### 1.3 — Bağımlılıkları kur

```bash
npm install
```

İlk seferde 2-5 dakika. Sonunda `node_modules` klasörü oluşur.

### 1.4 — Geliştirme sunucusunu başlat

```bash
npm run dev
```

Tarayıcıda **http://localhost:3000** adresini aç.

Anasayfayı görüyorsan **iskelet çalışıyor** demektir.

---

## Bölüm 2: Supabase Kurulumu (DB)

### 2.1 — Hesap aç

https://supabase.com → "Start your project" → GitHub veya e-posta ile kayıt.

### 2.2 — Yeni proje oluştur

- **Project Name:** `kani-mobilya`
- **Database Password:** GÜÇLÜ bir şifre (kaydet, lazım olacak)
- **Region:** **Frankfurt (Central EU)** ← Türkiye'ye en yakın
- **Pricing Plan:** Free

Proje hazır olması ~2 dakika sürer.

### 2.3 — API anahtarlarını al

Sol menüden **Settings (⚙️) → API**.

Buradaki 2 değeri kopyala:
1. **Project URL** — örn. `https://abcxyzdef.supabase.co`
2. **Project API keys → anon public** — uzun bir token

### 2.4 — .env.local dosyasını düzenle

Proje klasöründe `.env.local` dosyasını aç (yoksa `.env.example`'dan kopyala):

```bash
NEXT_PUBLIC_SUPABASE_URL=https://abcxyzdef.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=ey... (uzun token)
NEXT_PUBLIC_WHATSAPP_NUMBER=905351234567   # gerçek numaranız
```

### 2.5 — SQL şemasını çalıştır

Sol menü → **SQL Editor** → **New query**.

Proje klasöründeki `sql/01-schema.sql` dosyasının İÇERİĞİNİ tamamen kopyala, SQL Editor'a yapıştır, sağ üstte **Run** tuşuna bas.

Başarılı olursa:
- 4 tablo oluşur: `categories`, `products`, `inquiries`, `settings`
- 9 kategori otomatik eklenir
- Bir tane settings satırı eklenir

Kontrol et: sol menü → **Table Editor** → 4 tablonun listelendiğini gör.

### 2.6 — Dev sunucusunu yeniden başlat

`.env.local` değişikliği için:

```bash
# Çalışan dev sunucusunu Ctrl+C ile durdur
npm run dev
```

Artık Supabase bağlı.

---

## Bölüm 3: Vercel'e Deploy (Production)

> Bu bölümü site Enes'e gösterilmeye hazır olduğunda yap. Şu an erken.

### 3.1 — GitHub'a yükle

Proje klasöründe:

```bash
git init
git add .
git commit -m "İlk yükleme - paket 1 iskelet"
```

GitHub'da yeni repo oluştur (private önerilir): `kani-mobilya`

```bash
git remote add origin https://github.com/KULLANICI_ADIN/kani-mobilya.git
git branch -M main
git push -u origin main
```

### 3.2 — Vercel'e bağla

https://vercel.com → "Add New → Project" → GitHub repo seç.

**Framework Preset:** Next.js (otomatik algılar).

**Environment Variables** kısmında `.env.local`'daki tüm değerleri ekle:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_WHATSAPP_NUMBER`
- `NEXT_PUBLIC_SITE_URL` → `https://mobelinegol.com`
- `NEXT_PUBLIC_BUSINESS_*` (hepsi)

**Deploy** tuşuna bas. ~2 dakikada canlıya çıkar.

Vercel sana `kani-mobilya.vercel.app` gibi geçici bir adres verir. Buradan test edebilirsin.

### 3.3 — Domain bağla (mobelinegol.com)

> ⚠️ **ÖNCE** "Your domain is suspended" durumu çözülmeli. Hostinger panele bak.

Vercel proje → **Settings → Domains** → `mobelinegol.com` yaz → Add.

Vercel sana DNS kayıtları gösterir:
- **A record:** `76.76.21.21`
- **CNAME (www):** `cname.vercel-dns.com`

Bunları **Hostinger paneline** ekle:
- hPanel → Domains → mobelinegol.com → DNS Zone Editor
- Mevcut WordPress A kaydını **sil** veya değiştir
- Yukarıdaki kayıtları ekle

**5-60 dakikada** DNS yayılır, Vercel otomatik SSL sertifikası kurar.

---

## Sorun Giderme

### "Cannot find module..." hatası
```bash
rm -rf node_modules .next
npm install
```

### Supabase env hatası ("Supabase URL gerekli")
- `.env.local` dosyasının kök dizinde olduğunu kontrol et
- Sunucuyu yeniden başlat (`Ctrl+C` sonra `npm run dev`)
- Değerlerin tırnak içinde **olmaması** lazım

### Port 3000 dolu
```bash
npm run dev -- -p 3001
```

### Build hatası
```bash
npm run build
# Hata mesajını oku, ekran fotoğrafı at, beraber çözelim
```

---

## Yardım

Tıkandığın yerde:
1. Ekran fotoğrafı al
2. Terminal mesajını kopyala
3. Ubeyt'e gönder

**by ubivo** — © 2026
