// ════════════════════════════════════════════════════════════
// Kategori illüstrasyon anahtarı + sıralama — TEK KAYNAK (v48)
// Hem KategoriSeritleri (görsel) hem page.jsx (sıra/filtre) kullanır.
// by ubivo
// ════════════════════════════════════════════════════════════

// Kategoriyi slug/isim anahtar kelimesine göre illüstrasyona eşle.
// Sıra ÖNEMLİ: 'kose' → 'koltuk'tan, 'giyinme' → 'tv'den önce kontrol edilir.
export function kategoriAnahtar(kat) {
  const s = `${kat?.slug || ''} ${kat?.name || ''}`
    .toLowerCase()
    .replace(/ş/g, 's').replace(/ğ/g, 'g').replace(/ç/g, 'c')
    .replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ü/g, 'u');
  if (s.includes('kose')) return 'kose';
  if (s.includes('koltuk')) return 'koltuk';
  if (s.includes('yatak')) return 'yatak';
  if (s.includes('yemek')) return 'yemek';
  if (s.includes('giyinme')) return 'giyinme';
  if (s.includes('tv')) return 'tv';
  if (s.includes('genc') || s.includes('bebek')) return 'genc';
  if (s.includes('sehpa') || s.includes('aksesuar')) return 'sehpa';
  return null;
}

// Görselli şerit/kart sıralaması — Giyinme, Yemek ile TV ARASINDA.
export const KATEGORI_SIRA = [
  'koltuk', 'kose', 'yatak', 'yemek', 'giyinme', 'tv', 'genc', 'sehpa',
];

// Kategorileri yukarıdaki sıraya göre diz; tanınmayan (yeni) kategoriler sona.
export function kategoriSirala(kategoriler) {
  const rank = (k) => {
    const i = KATEGORI_SIRA.indexOf(kategoriAnahtar(k));
    return i < 0 ? 999 : i;
  };
  return [...(kategoriler || [])].sort((a, b) => rank(a) - rank(b));
}
