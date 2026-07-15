// ════════════════════════════════════════════════════════════
// Validators — Form doğrulama yardımcıları
// ════════════════════════════════════════════════════════════

/** E-posta formatı kontrolü */
export function emailGecerliMi(deger) {
  if (!deger) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(deger);
}

/** Türkiye telefon numarası kontrolü (en az 10 rakam) */
export function telefonGecerliMi(deger) {
  if (!deger) return false;
  const rakam = deger.replace(/\D/g, '');
  return rakam.length >= 10 && rakam.length <= 13;
}

/** Boş string ve null kontrolü */
export function bosMu(deger) {
  return !deger || (typeof deger === 'string' && deger.trim() === '');
}

/** Sayı kontrolü (fiyat alanları için) */
export function sayiMi(deger) {
  if (deger === '' || deger === null || deger === undefined) return false;
  const sayi = Number(deger);
  return !isNaN(sayi) && sayi >= 0;
}

/**
 * Ürün form verisini doğrula.
 * Hata varsa: { name: 'mesaj', ... } döner. Yoksa: null.
 */
export function urunDogrula(veri) {
  const hatalar = {};

  if (bosMu(veri.name)) {
    hatalar.name = 'Ürün adı gerekli';
  } else if (veri.name.length < 3) {
    hatalar.name = 'En az 3 karakter olmalı';
  }

  if (bosMu(veri.slug)) {
    hatalar.slug = 'Slug gerekli';
  } else if (!/^[a-z0-9-]+$/.test(veri.slug)) {
    hatalar.slug = 'Slug sadece küçük harf, rakam, tire içerebilir';
  }

  if (bosMu(veri.category_id)) {
    hatalar.category_id = 'Kategori seçin';
  }

  if (veri.base_price && !sayiMi(veri.base_price)) {
    hatalar.base_price = 'Geçerli bir fiyat girin';
  }

  if (veri.is_on_sale) {
    if (!veri.sale_price || !sayiMi(veri.sale_price)) {
      hatalar.sale_price = 'İndirim fiyatı gerekli';
    } else if (Number(veri.sale_price) >= Number(veri.base_price || 0)) {
      hatalar.sale_price = 'İndirim fiyatı normal fiyattan küçük olmalı';
    }
  }

  return Object.keys(hatalar).length === 0 ? null : hatalar;
}

/**
 * Kategori form verisini doğrula.
 */
export function kategoriDogrula(veri) {
  const hatalar = {};

  if (bosMu(veri.name)) hatalar.name = 'Kategori adı gerekli';
  if (bosMu(veri.slug)) hatalar.slug = 'Slug gerekli';
  else if (!/^[a-z0-9-]+$/.test(veri.slug)) {
    hatalar.slug = 'Slug sadece küçük harf, rakam, tire içerebilir';
  }

  return Object.keys(hatalar).length === 0 ? null : hatalar;
}

/**
 * Checkout form verisini doğrula.
 */
export function checkoutDogrula(veri) {
  const hatalar = {};

  if (bosMu(veri.ad)) hatalar.ad = 'Ad soyad gerekli';
  if (!telefonGecerliMi(veri.telefon)) {
    hatalar.telefon = 'Geçerli bir telefon numarası girin';
  }
  if (bosMu(veri.adres)) hatalar.adres = 'Adres gerekli';
  if (!veri.kvkkOnay) hatalar.kvkkOnay = 'KVKK metnini onaylayın';

  return Object.keys(hatalar).length === 0 ? null : hatalar;
}
