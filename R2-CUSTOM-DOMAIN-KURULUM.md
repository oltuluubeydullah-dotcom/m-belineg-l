# Cloudflare R2 — Özel Domain (CDN) Kurulumu

**Amaç:** Görseller şu an `pub-xxxx.r2.dev` üzerinden geliyor. Bu adres
Cloudflare tarafından **hız sınırlıdır** ve production için önerilmez —
"görsel bir açılıp bir kapanıyor" (flicker) sorununun asıl kaynağı budur.
Bucket'a **özel bir domain** bağlayınca limit tamamen kalkar, tam CDN cache
devreye girer. **Ücretsiz plan yeterli.**

> Kod tarafı zaten hazır: domain bağlanınca **tek bir env değeri** değişecek,
> tüm eski görseller otomatik yeni domaine yönlenecek (DB'ye dokunulmaz).

---

## ÖN KOŞUL: Domain Cloudflare'de olmalı

`mobelinegol.com` şu an İHS/Vercel DNS'inde. R2 özel domaini için
domainin **nameserver'ları Cloudflare'e** taşınmalı. Bu canlı DNS işidir —
**düşük trafik saatinde**, önce mevcut kayıtları yedekleyerek yapılır.

### A) Domaini Cloudflare'e ekle
1. https://dash.cloudflare.com → **Add a site** → `mobelinegol.com`
2. **Free** planı seç.
3. Cloudflare mevcut DNS kayıtlarını otomatik tarar → **hepsinin geldiğini
   doğrula** (özellikle: `@` ve `www` → Vercel kaydı, mail/MX kayıtları varsa).
   Eksik varsa elle ekle. **Bu adım kritik — site ve mail kesilmesin.**
4. Cloudflare sana 2 nameserver verir (örn. `xxx.ns.cloudflare.com`).
5. İHS panelinden domainin **nameserver'larını** bu ikisiyle değiştir.
6. Yayılmayı bekle (genelde 10 dk – birkaç saat). Cloudflare "Active" olunca
   site Cloudflare üzerinden çalışır (Vercel'e dokunmana gerek yok, DNS kaydı
   zaten Vercel'i gösteriyor).

> ⚠️ SSL: Cloudflare'de **SSL/TLS → Full (strict)** seç. "Flexible" SEÇME
> (sonsuz yönlendirme döngüsü yapar).

---

## ADIM 1 — R2 bucket'ına özel domain bağla
1. Cloudflare dash → **R2** → ilgili bucket (örn. `mobel-medya`)
2. **Settings → Public access → Custom Domains → Connect Domain**
3. Subdomain gir: **`gorsel.mobelinegol.com`**
   (istersen `cdn.` de olur — `gorsel` Türkçe ve nettir)
4. Cloudflare gerekli CNAME'i **otomatik** ekler (domain zaten Cloudflare'de
   olduğu için tek tık). Birkaç dk içinde "Active" olur.
5. Test: tarayıcıda `https://gorsel.mobelinegol.com/<bir-görsel-yolu>`
   açılıyorsa hazır.

---

## ADIM 2 — Tek env değişimi (Vercel)
Vercel → Proje → **Settings → Environment Variables**:

```
NEXT_PUBLIC_R2_PUBLIC_URL = https://gorsel.mobelinegol.com
```

- Eskiden bu değer `https://pub-xxxx.r2.dev` idi → yenisiyle değiştir.
- **Redeploy** et (Deployments → son deployment → Redeploy).

Bu kadar. Kod (`lib/gorsel.js`) eski `r2.dev` URL'lerini render anında
otomatik bu domaine çevirir — **DB'de tek satır değişmez, tek görsel bozulmaz.**

---

## DOĞRULAMA
- [ ] `gorsel.mobelinegol.com/...` doğrudan açılıyor
- [ ] Sitede ürün/kategori/blog görselleri geliyor
- [ ] Anasayfayı art arda yenile → görseller HER seferinde geliyor (flicker bitti)
- [ ] DevTools → Network → görsel isteği `gorsel.mobelinegol.com`'den
      ve **cf-cache-status: HIT** (CDN cache çalışıyor)

---

## NOTLAR
- **Maliyet:** Cloudflare Free + R2 (10 GB ücretsiz, çıkış sınırsız ücretsiz)
  → bu ölçekte **0 TL**.
- **Worker GEREKMEZ:** Statik katalog görseli için custom domain yeterli.
  Worker ekstra istek limiti + bakım demek; gereksiz karmaşıklık.
- **Geri dönüş:** Sorun olursa env'i eski `r2.dev` değerine geri al + redeploy
  → eski haline döner (kod iki durumu da destekler).

by ubivo · byubivo.com
