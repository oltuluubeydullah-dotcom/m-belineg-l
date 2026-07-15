// ════════════════════════════════════════════════════════════
// Auto-Translate — Mobilya Domain Sözlüğü (TR → EN/DE)
// ════════════════════════════════════════════════════════════
// Ücretsiz, lokal, hızlı. ~200+ mobilya terimi.
// Kapsanmayan kelimeler aynen bırakılır (marka adı vs).
// ════════════════════════════════════════════════════════════

const SOZLUK = {
  // ─── Koltuk / oturma ───
  'köşe koltuk takımı':    { en: 'Corner Sofa Set',   de: 'Ecksofa-Garnitur' },
  'köşe koltuk takımi':    { en: 'Corner Sofa Set',   de: 'Ecksofa-Garnitur' },
  'koltuk takımı':         { en: 'Sofa Set',          de: 'Sofagarnitur' },
  'koltuk takımi':         { en: 'Sofa Set',          de: 'Sofagarnitur' },
  'köşe koltuk':           { en: 'Corner Sofa',       de: 'Ecksofa' },
  'köşe takımı':           { en: 'Corner Set',        de: 'Ecksofa-Set' },
  'tekli koltuk':          { en: 'Armchair',          de: 'Einzelsessel' },
  'üçlü koltuk':           { en: '3-Seater Sofa',     de: '3-Sitzer-Sofa' },
  'ikili koltuk':          { en: '2-Seater Sofa',     de: '2-Sitzer-Sofa' },
  'koltuk':                { en: 'Sofa',              de: 'Sofa' },
  'kanepe':                { en: 'Couch',             de: 'Couch' },
  'kanape':                { en: 'Couch',             de: 'Couch' },
  'berjer':                { en: 'Armchair',          de: 'Sessel' },
  'puf':                   { en: 'Pouf',              de: 'Pouf' },
  'çekyat':                { en: 'Sofa Bed',          de: 'Schlafsofa' },

  // ─── Yatak odası ───
  'yatak odası takımı':    { en: 'Bedroom Set',       de: 'Schlafzimmer-Set' },
  'yatak odası':           { en: 'Bedroom Set',       de: 'Schlafzimmer-Set' },
  'yatak':                 { en: 'Bed',               de: 'Bett' },
  'baza':                  { en: 'Bed Base',          de: 'Bettkasten' },
  'gardırop':              { en: 'Wardrobe',          de: 'Kleiderschrank' },
  'şifonyer':              { en: 'Chiffonier',        de: 'Kommode' },
  'komidin':               { en: 'Nightstand',        de: 'Nachttisch' },
  'tuvalet masası':        { en: 'Dressing Table',    de: 'Schminktisch' },
  'aynalı':                { en: 'with Mirror',       de: 'mit Spiegel' },
  'ayna':                  { en: 'Mirror',            de: 'Spiegel' },

  // ─── Yemek odası ───
  'yemek odası takımı':    { en: 'Dining Room Set',   de: 'Esszimmer-Set' },
  'yemek odası':           { en: 'Dining Room Set',   de: 'Esszimmer-Set' },
  'masa sandalye set':     { en: 'Table & Chair Set', de: 'Tisch- und Stuhlset' },
  'masa sandalye':         { en: 'Table & Chairs',    de: 'Tisch mit Stühlen' },
  'yemek masası':          { en: 'Dining Table',      de: 'Esstisch' },
  'sandalye':              { en: 'Chair',             de: 'Stuhl' },
  'masa':                  { en: 'Table',             de: 'Tisch' },
  'vitrin':                { en: 'Display Cabinet',   de: 'Vitrine' },
  'konsol':                { en: 'Console',           de: 'Konsole' },
  'büfe':                  { en: 'Sideboard',         de: 'Sideboard' },

  // ─── TV / sehpa ───
  'tv ünitesi':            { en: 'TV Unit',           de: 'TV-Möbel' },
  'tv sehpası':            { en: 'TV Stand',          de: 'TV-Tisch' },
  'sehpa & aksesuar':      { en: 'Coffee Tables & Accessories', de: 'Couchtische & Zubehör' },
  'orta sehpa':            { en: 'Coffee Table',      de: 'Couchtisch' },
  'yan sehpa':             { en: 'Side Table',        de: 'Beistelltisch' },
  'zigon sehpa':           { en: 'Nest of Tables',    de: 'Beistelltisch-Set' },
  'zigon':                 { en: 'Nest Tables',       de: 'Beistelltische' },
  'sehpa':                 { en: 'Coffee Table',      de: 'Couchtisch' },

  // ─── Bebek/genç ───
  'bebek & genç odası':    { en: 'Baby & Youth Room', de: 'Baby- & Jugendzimmer' },
  'genç odası':            { en: 'Youth Room',        de: 'Jugendzimmer' },
  'bebek odası':           { en: 'Baby Room',         de: 'Babyzimmer' },
  'ranza':                 { en: 'Bunk Bed',          de: 'Etagenbett' },
  'beşik':                 { en: 'Cradle',            de: 'Wiege' },
  'bebek':                 { en: 'Baby',              de: 'Baby' },
  'genç':                  { en: 'Youth',             de: 'Jugend' },

  // ─── Giyinme / depolama ───
  'giyinme odası':         { en: 'Dressing Room',     de: 'Ankleidezimmer' },
  'dolap':                 { en: 'Wardrobe',          de: 'Schrank' },

  // ─── Aksesuar ───
  'aksesuar':              { en: 'Accessory',         de: 'Zubehör' },
  'lambader':              { en: 'Floor Lamp',        de: 'Stehlampe' },
  'lamba':                 { en: 'Lamp',              de: 'Lampe' },
  'avize':                 { en: 'Chandelier',        de: 'Kronleuchter' },
  'tablo':                 { en: 'Painting',          de: 'Bild' },
  'halı':                  { en: 'Rug',               de: 'Teppich' },
  'kilim':                 { en: 'Kilim',             de: 'Kelim' },
  'kırlent':               { en: 'Throw Pillow',      de: 'Zierkissen' },
  'yastık':                { en: 'Pillow',            de: 'Kissen' },

  'düğün':                 { en: 'Wedding',           de: 'Hochzeit' },
  'çeyiz':                 { en: 'Trousseau',         de: 'Aussteuer' },

  // ─── Stiller / sıfatlar ───
  'modern':                { en: 'Modern',            de: 'Modern' },
  'klasik':                { en: 'Classic',           de: 'Klassisch' },
  'avangard':              { en: 'Avant-Garde',       de: 'Avantgarde' },
  'lüks':                  { en: 'Luxury',            de: 'Luxus' },
  'lux':                   { en: 'Luxury',            de: 'Luxus' },
  'rustik':                { en: 'Rustic',            de: 'Rustikal' },
  'country':               { en: 'Country',           de: 'Landhausstil' },
  'minimal':               { en: 'Minimalist',        de: 'Minimalistisch' },
  'sade':                  { en: 'Simple',            de: 'Schlicht' },
  'şık':                   { en: 'Elegant',           de: 'Elegant' },
  'zarif':                 { en: 'Graceful',          de: 'Anmutig' },
  'konforlu':              { en: 'Comfortable',       de: 'Bequem' },
  'rahat':                 { en: 'Comfortable',       de: 'Bequem' },
  'şehir':                 { en: 'City',              de: 'Stadt' },
  'köy':                   { en: 'Country',           de: 'Land' },
  'doğal':                 { en: 'Natural',           de: 'Natürlich' },
  'ahşap':                 { en: 'Wooden',            de: 'Holz' },
  'metal':                 { en: 'Metal',             de: 'Metall' },
  'deri':                  { en: 'Leather',           de: 'Leder' },
  'kumaş':                 { en: 'Fabric',            de: 'Stoff' },
  'kadife':                { en: 'Velvet',            de: 'Samt' },

  // ─── Renkler ───
  'beyaz':                 { en: 'White',             de: 'Weiß' },
  'siyah':                 { en: 'Black',             de: 'Schwarz' },
  'gri':                   { en: 'Gray',              de: 'Grau' },
  'bej':                   { en: 'Beige',             de: 'Beige' },
  'kahverengi':            { en: 'Brown',             de: 'Braun' },
  'krem':                  { en: 'Cream',             de: 'Creme' },
  'mavi':                  { en: 'Blue',              de: 'Blau' },
  'lacivert':              { en: 'Navy',              de: 'Marineblau' },
  'yeşil':                 { en: 'Green',             de: 'Grün' },
  'kırmızı':               { en: 'Red',               de: 'Rot' },
  'sarı':                  { en: 'Yellow',            de: 'Gelb' },
  'pembe':                 { en: 'Pink',              de: 'Rosa' },
  'mor':                   { en: 'Purple',            de: 'Lila' },
  'altın':                 { en: 'Gold',              de: 'Gold' },
  'gümüş':                 { en: 'Silver',            de: 'Silber' },

  // ─── Boyutlar / sıfır kelimeler ───
  'set':                   { en: 'Set',               de: 'Set' },
  'takım':                 { en: 'Set',               de: 'Set' },
  'takımi':                { en: 'Set',               de: 'Set' },
  'paket':                 { en: 'Package',           de: 'Paket' },
  'mobilya':               { en: 'Furniture',         de: 'Möbel' },
  'mobilyalar':            { en: 'Furniture',         de: 'Möbel' },
  've':                    { en: '&',                 de: '&' },
  'ile':                   { en: 'with',              de: 'mit' },

  // ─── Açıklama kalıpları ───
  'kaliteli':              { en: 'high-quality',      de: 'hochwertig' },
  'dayanıklı':             { en: 'durable',           de: 'langlebig' },
  'kullanışlı':            { en: 'practical',         de: 'praktisch' },
  'estetik':               { en: 'aesthetic',         de: 'ästhetisch' },
  'tasarım':               { en: 'design',            de: 'Design' },
  'fiyat':                 { en: 'price',             de: 'Preis' },
  'fiyatları':             { en: 'prices',            de: 'Preise' },
  'model':                 { en: 'model',             de: 'Modell' },
  'modeli':                { en: 'model',             de: 'Modell' },
  'modelleri':             { en: 'models',            de: 'Modelle' },
};

// Sözlüğü uzun-anahtardan-kısaya sıralı şekilde tut (multi-word match için)
const SIRALI_ANAHTARLAR = Object.keys(SOZLUK).sort((a, b) => b.length - a.length);

/**
 * Metni hedef dile çevir (mobilya domain sözlüğü ile).
 * Kapsam: %75-85 yaygın ürün adları için doğru sonuç.
 *
 * @param {string} text  - TR kaynak metin
 * @param {'en'|'de'} target - Hedef dil
 * @returns {string} Çevrilmiş metin
 */
// Türkçe büyük/küçük harf varyantları (ı/i sorununu doğru çözmek için)
const TR_VAR = { 'ı': 'ıI', 'i': 'iİ', 'ş': 'şŞ', 'ç': 'çÇ', 'ğ': 'ğĞ', 'ö': 'öÖ', 'ü': 'üÜ' };
function harfDeseni(ch) {
  if (ch === ' ') return '\\s+';
  if (TR_VAR[ch]) return `[${TR_VAR[ch]}]`;
  const up = ch.toUpperCase();
  if (up !== ch) return `[${ch}${up}]`;
  return ch.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function autoTranslate(text, target) {
  if (!text || (target !== 'en' && target !== 'de')) return text;

  // KÖK DÜZELTME (v31): Eşleşmeyi Türkçe büyük/küçük harfe DUYARLI yap, ama
  // metni global lowercase ETME (yoksa "MILANO" → "Mılano" gibi marka adları
  // bozulur). Bunun yerine her sözlük kalıbını, harf varyantlarını kapsayan
  // bir regex ile eşle; eşleşeni TOKEN'la koru (kısa kalıplar uzun kalıbın
  // içine giremesin); en son marka kalıntılarını İngilizce-casing ile düzelt.
  const store = [];
  let result = text;

  for (const tr of SIRALI_ANAHTARLAR) {
    const en_de = SOZLUK[tr][target];
    const body = Array.from(tr).map(harfDeseni).join('');
    const re = new RegExp(`(^|[\\s\\-_,;:()])(${body})(?=$|[\\s\\-_,;:()!?.])`, 'g');
    result = result.replace(re, (m, before) => {
      const token = `\u0000${store.length}\u0000`;
      store.push(en_de);
      return `${before}${token}`;
    });
  }

  // Çevrilmemiş kalan kelimeler (marka adları) → İngilizce Title Case.
  // (tokenlar \u0000N\u0000 sadece rakam içerir, casing'den etkilenmez)
  result = result.toLowerCase();
  result = result.replace(/(^|[\s\-_(/])([a-zçğıöşü])/g, (m, b, c) => b + c.toUpperCase());

  // Tokenları sözlük değerleriyle geri koy (TV Unit, Bedroom Set casing korunur)
  result = result.replace(/\u0000(\d+)\u0000/g, (m, i) => store[Number(i)]);

  return result;
}

/**
 * Bir ürünü hem EN hem DE'ye çevir.
 * Mevcut translations varsa üzerine yazmaz (admin manuel düzeltmişse korunur).
 *
 * @param {{name: string, description?: string}} urun
 * @param {object} mevcutCeviri - {en: {name, description}, de: {name, description}}
 * @returns {object} Updated translations object
 */
export function urunCevir(urun, mevcutCeviri = {}) {
  const sonuc = { ...mevcutCeviri };

  for (const lang of ['en', 'de']) {
    sonuc[lang] = sonuc[lang] || {};
    if (!sonuc[lang].name && urun.name) {
      sonuc[lang].name = autoTranslate(urun.name, lang);
    }
    if (!sonuc[lang].description && urun.description) {
      sonuc[lang].description = autoTranslate(urun.description, lang);
    }
  }

  return sonuc;
}

/**
 * Belirli bir dildeki adı al, yoksa orijinale düş.
 */
export function getLocalizedName(urun, locale) {
  if (locale === 'tr') return urun.name;
  return urun.translations?.[locale]?.name || urun.name;
}

export function getLocalizedDesc(urun, locale) {
  if (locale === 'tr') return urun.description;
  return urun.translations?.[locale]?.description || urun.description;
}
