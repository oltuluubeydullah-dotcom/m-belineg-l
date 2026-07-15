# CHANGELOG v13.1 — Ubivo Notifications + Standalone Admin

> v13.0'a ek: otomatik bildirim üretimi + tek dosya admin panel.

---

## ✨ Yenilikler

### 1. `notifications` tablosu + otomatik trigger

`licenses` tablosunda `status` her değiştiğinde DB trigger otomatik bir notification kaydı yapar:
- Status'a uygun **hazır Türkçe WhatsApp mesajı** üretilir
- Müşteri adı + domain + ödeme bilgileri mesaja gömülür
- `pending` durumunda kuyruğa düşer

5 mesaj şablonu (warning_1, warning_2, restricted, maintenance, active'e dönüş).

### 2. Standalone Admin Panel — `ubivo-admin.html`

Tek HTML dosyası — sıfır build, sıfır deploy:
- Tailwind + Supabase JS via CDN
- Mobil + desktop responsive
- İlk açılışta Supabase URL + key sorulur (LocalStorage'a kaydedilir)
- Supabase Auth ile giriş
- **2 sekme:**
  - 📨 **Bildirimler** — bekleyen kuyruk, filtrele, click → WhatsApp aç
  - 🔑 **Lisanslar** — tüm müşteriler, status değiştir (otomatik bildirim oluşur)
- Auto-refresh 60sn
- Pending count badge

Yapılabilir aksiyonlar:
- `📱 WhatsApp Aç` → wa.me link **mesaj pre-fill** olarak açılır, 2sn sonra otomatik "sent" işaretlenir
- `✓ Gönderildi olarak işaretle` → manuel
- `İptal` → dismissed
- `↺ Tekrar bekleyene al` → undo

---

## 🚀 Kurulum (10 dakika)

### A) byubivo.com Supabase'inde SQL çalıştır

1. byubivo.com'un Supabase projesini aç → SQL Editor
2. **Önce** `sql/UBIVO-MASTER-SETUP.sql` (eğer henüz çalıştırılmadıysa) → Run
3. **Sonra** `sql/UBIVO-NOTIFICATIONS.sql` → Run

### B) Ubivo admin'i hostla

`ubivo-admin.html` dosyasını şuralardan birine koy:

- **byubivo.com/admin.html** (en pratik — ana sitenin alt yolu)
- **GitHub Pages** — public repo, free
- **Vercel** — ayrı project, `index.html` olarak deploy
- **file://** — bilgisayarında bookmark, gizli kullanım

İlk açılışta sorulan bilgiler:
- Supabase URL → byubivo.com Supabase URL'in
- Anon Key → byubivo.com Supabase anon key

### C) Supabase Auth kullanıcısı

byubivo Supabase → **Authentication** → **Users** → kendin için bir hesap aç:
- E-posta + şifre
- Email confirm
- Bu hesap RLS'te `authenticated` rolüyle gelir → tüm `licenses` ve `notifications` tablolarına erişir

### D) Test akışı

1. Admin'i aç → giriş yap
2. Lisanslar sekmesi → Kanı Mobilya → "Uyarı 1" seç
3. Confirm → bildirim otomatik oluşur
4. Bildirimler sekmesi → yeni kayıt görünür (kırmızı badge'le)
5. **📱 WhatsApp Aç** tıkla → telefon WhatsApp'tan açılır, **mesaj hazır yazılı**
6. Gönder bas → ayrıca dashboard'da 2sn sonra "sent" işaretlenir

---

## 📁 Yeni Dosyalar

```
+ sql/UBIVO-NOTIFICATIONS.sql        (notifications tablosu + trigger + 5 mesaj şablonu)
+ ubivo-admin.html                   (standalone admin — tek dosya, sıfır build)
+ CHANGELOG-v13.1.md                  (bu dosya)
```

**Hiç Kanı tarafı dosyası değişmedi.** v13.0'daki LicenseGate ve banner'lar aynen çalışıyor. Bu eklemeler tamamen senin tarafının.

---

## 🎯 Akış Özeti

```
[Sen Supabase'de status'u 'warning_1' yaptın]
            ↓
   [Trigger otomatik notification oluşturdu]
            ↓
   [byubivo.com/admin.html'i açtın]
            ↓
   [Bekleyen kuyrukta yeni mesajı gördün]
            ↓
   [📱 WhatsApp Aç tıkladın]
            ↓
   [WhatsApp açıldı, mesaj HAZIR]
            ↓
   [Send bastın → "sent" olarak işaretlendi]
            ↓
   [Müşteri ödedi → status'u 'active' yaptın]
            ↓
   [Trigger "ödemeniz alındı, hayırlı satışlar" mesajı oluşturdu]
            ↓
   [Aynı işlem 5 saniye]
```

**Toplam süre: günde 1 dk** ile tüm müşteri ödeme takibi.

---

## 🔮 İLERİDE (v13.2+)

- Auto-WhatsApp send (Twilio/CallMeBot entegrasyonu) — 5+ müşteri olunca
- E-posta otomatik (Resend.com) — bonus kanal
- Müşteri portali (müşteri kendi ödemesini görsün)
- Stripe entegrasyonu → otomatik ödeme = otomatik active

---

**by ubivo — Notifications v1.0 — 2026**
