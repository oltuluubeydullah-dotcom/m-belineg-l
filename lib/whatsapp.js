// ════════════════════════════════════════════════════════════
// WhatsApp Entegrasyonu — Saf, FALLBACK only
// ════════════════════════════════════════════════════════════
// DB fetch yok — sebep: build-time prerender'da cookies()
// çağrısı patlıyordu. WhatsApp Şablonları admin sayfası
// görsel olarak duruyor (v10.2'de API endpoint ile bağlanacak).
// ════════════════════════════════════════════════════════════

import { ISLETME } from './constants';

const TEMPLATES = {
  support: {
    tr: 'Merhaba, Möbel İnegöl hakkında bilgi almak istiyorum.',
    en: 'Hello, I would like information about Möbel İnegöl.',
    de: 'Hallo, ich hätte gerne Informationen zu Möbel İnegöl.',
  },
  product_inquiry: {
    tr: 'Merhaba, "{urun}" ürünü hakkında bilgi almak istiyorum.',
    en: 'Hello, I would like information about the "{urun}" product.',
    de: 'Hallo, ich hätte gerne Informationen zum Produkt "{urun}".',
  },
  cart_checkout: {
    tr: 'Merhaba, sepetimi onaylamak istiyorum. Detaylar mesajda.',
    en: 'Hello, I would like to confirm my cart. Details below.',
    de: 'Hallo, ich möchte meinen Warenkorb bestätigen. Details siehe unten.',
  },
};

function getTemplate(key, locale) {
  const l = ['tr','en','de'].includes(locale) ? locale : 'tr';
  return TEMPLATES[key]?.[l] || TEMPLATES[key]?.tr || '';
}

const SIPARIS_BASLIK = {
  tr: '🛋️ *MÖBEL İNEGÖL - YENİ SİPARİŞ TALEBİ*',
  en: '🛋️ *MÖBEL İNEGÖL - NEW ORDER REQUEST*',
  de: '🛋️ *MÖBEL İNEGÖL - NEUE BESTELLANFRAGE*',
};
const SIPARIS_ETIKETLER = {
  tr: { musteri: 'Müşteri Bilgileri', ad: 'Ad Soyad', tel: 'Telefon', adres: 'Adres', not: 'Not', urunler: 'Ürünler', toplam: 'TOPLAM FİYAT', adet: 'adet', icin: 'fiyat bilgisi için', oto: 'Bu mesaj mobelinegol.com sepet formundan otomatik oluşturulmuştur.' },
  en: { musteri: 'Customer Info', ad: 'Full Name', tel: 'Phone', adres: 'Address', not: 'Note', urunler: 'Products', toplam: 'TOTAL PRICE', adet: 'pcs', icin: 'price on request', oto: 'This message was generated automatically from mobelinegol.com cart form.' },
  de: { musteri: 'Kundeninfo', ad: 'Name', tel: 'Telefon', adres: 'Adresse', not: 'Notiz', urunler: 'Produkte', toplam: 'GESAMTPREIS', adet: 'Stk', icin: 'Preis auf Anfrage', oto: 'Diese Nachricht wurde automatisch aus dem Warenkorb-Formular von mobelinegol.com erstellt.' },
};

function formatFiyat(tutar) {
  const sayi = Math.round(Number(tutar) || 0);
  const gruplu = sayi.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return `${gruplu} ₺`;
}

export function siparisMesajiOlustur({ sepet, musteri, locale = 'tr' }) {
  const l = ['tr','en','de'].includes(locale) ? locale : 'tr';
  const L = SIPARIS_ETIKETLER[l];
  const giris = getTemplate('cart_checkout', l);

  const tarih = new Date().toLocaleString(l === 'tr' ? 'tr-TR' : l === 'de' ? 'de-DE' : 'en-US', {
    dateStyle: 'short', timeStyle: 'short',
  });

  const satirlar = [
    SIPARIS_BASLIK[l], `📅 ${tarih}`, '', giris, '',
    `*━━━ ${L.musteri} ━━━*`,
    `👤 *${L.ad}:* ${musteri.ad}`,
    `📱 *${L.tel}:* ${musteri.telefon}`,
    `📍 *${L.adres}:* ${musteri.adres}`,
  ];
  if (musteri.not?.trim()) satirlar.push(`📝 *${L.not}:* ${musteri.not}`);
  satirlar.push('', `*━━━ ${L.urunler} ━━━*`);

  let toplam = 0;
  sepet.forEach((urun, i) => {
    const adet = urun.qty || 1;
    const fiyat = urun.price || 0;
    const tutar = fiyat * adet;
    toplam += tutar;
    satirlar.push(
      `\n${i + 1}. *${urun.name}*` +
      (urun.slug ? `\n   🔗 mobelinegol.com/urun/${urun.slug}` : '') +
      (fiyat > 0
        ? `\n   ${adet} ${L.adet} × ${formatFiyat(fiyat)} = ${formatFiyat(tutar)}`
        : `\n   ${adet} ${L.adet} (${L.icin})`)
    );
  });
  if (toplam > 0) satirlar.push('', `*💰 ${L.toplam}: ${formatFiyat(toplam)}*`);
  satirlar.push('', `_${L.oto}_`);

  return `https://wa.me/${ISLETME.whatsapp}?text=${encodeURIComponent(satirlar.join('\n'))}`;
}

export function urunIcinSorMesaji(urun, locale = 'tr') {
  const l = ['tr','en','de'].includes(locale) ? locale : 'tr';
  const tmpl = getTemplate('product_inquiry', l);
  const ad = urun.translations?.[l]?.name || urun.name;
  const mesaj = (tmpl || '').replace('{urun}', ad) +
    (urun.slug ? `\n🔗 mobelinegol.com/urun/${urun.slug}` : '');
  return `https://wa.me/${ISLETME.whatsapp}?text=${encodeURIComponent(mesaj)}`;
}

export function genelDestekLinki(locale = 'tr') {
  return `https://wa.me/${ISLETME.whatsapp}?text=${encodeURIComponent(getTemplate('support', locale))}`;
}
