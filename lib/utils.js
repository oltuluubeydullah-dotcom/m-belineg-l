// ════════════════════════════════════════════════════════════
// Möbel İnegöl - Yardımcı Fonksiyonlar (Utilities)
// ════════════════════════════════════════════════════════════

import clsx from 'clsx';

/**
 * Tailwind class'ları koşullu birleştir.
 * cn('p-4', isActive && 'bg-brand-gold', 'rounded')
 */
export function cn(...inputs) {
  return clsx(inputs);
}

/**
 * Türk Lirası olarak formatla (örn. 12500 → "12.500 ₺").
 */
export function formatFiyat(tutar) {
  if (tutar == null) return '';
  // NOT: Intl.NumberFormat kullanılmıyor — Node (server) ile tarayıcı (client)
  // farklı ICU sürümlerinde farklı boşluk karakteri (\u00a0 vs ' ') ve grup
  // ayıracı üretebiliyor; bu da React hydration mismatch (#418) → beyaz ekran
  // yaratıyordu. Deterministik, ortamdan bağımsız manuel format:
  const sayi = Math.round(Number(tutar) || 0);
  const gruplu = sayi.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return `${gruplu} ₺`;
}

/**
 * Tarih formatı (örn. "20 Mayıs 2026").
 */
export function formatTarih(tarih) {
  if (!tarih) return '';
  return new Date(tarih).toLocaleDateString('tr-TR', {
    day:   'numeric',
    month: 'long',
    year:  'numeric',
  });
}

/**
 * Türkçe metni URL-safe slug'a çevir.
 * "Yatak Odası" → "yatak-odasi"
 * Admin panel'de yeni ürün/kategori eklerken otomatik slug üretmek için.
 */
export function slugOlustur(metin) {
  if (!metin) return '';

  const cevirim = {
    'ç': 'c', 'Ç': 'c', 'ğ': 'g', 'Ğ': 'g',
    'ı': 'i', 'İ': 'i', 'ö': 'o', 'Ö': 'o',
    'ş': 's', 'Ş': 's', 'ü': 'u', 'Ü': 'u',
  };

  return metin
    .toLowerCase()
    .split('')
    .map((ch) => cevirim[ch] || ch)
    .join('')
    .replace(/[^a-z0-9]+/g, '-')   // Harf/rakam olmayanı tireye çevir
    .replace(/^-+|-+$/g, '')        // Baş/son tirelerini sil
    .replace(/-+/g, '-');           // Birden fazla tireyi teke indir
}

/**
 * Telefon numarası formatı (girdi temizleme).
 * "+90 535 123 45 67" → "905351234567"
 */
export function telefonTemizle(telefon) {
  if (!telefon) return '';
  return telefon.replace(/\D/g, '');  // Sadece rakamları tut
}

/**
 * Bir array'i karıştır (Fisher-Yates).
 * "İlgini çekebilecekler" gibi yerlerde rastgele ürün önerme için.
 */
export function karistir(array) {
  const a = [...array];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Metni belirli uzunlukta kes ve sonuna "..." ekle.
 */
export function kisaltMetin(metin, uzunluk = 100) {
  if (!metin) return '';
  if (metin.length <= uzunluk) return metin;
  return metin.slice(0, uzunluk).trim() + '…';
}

/** Boş string veya null mu */
export function bosMu(deger) {
  return !deger || (typeof deger === "string" && deger.trim() === "");
}
