// ════════════════════════════════════════════════════════════
// Basit Küfür Filtresi — TR/EN/DE
// ════════════════════════════════════════════════════════════
// Sadece açık küfürleri yakalar. Admin yine de moderation yapmalı.
// Liste güncellenebilir, mainly catch-all spam koruması.
// ════════════════════════════════════════════════════════════

const KUFURLER = [
  // TR
  'amk','amq','ananı','aq','aw','ass','bok','dalyarak','dalyarrak','daşşak','dassak',
  'göt','goet','götlek','goetlek','gotvere','sik','sikim','siktir','orospu','piç','pic',
  'oç','oc','şerefsiz','serefsiz','yarrak','yarak','am','amına','amina',
  // EN
  'fuck','fucking','shit','asshole','bitch','dick','cunt','bastard','motherfucker','pussy',
  // DE
  'scheisse','scheiße','arsch','arschloch','fotze','wichser','schlampe','hurensohn','verdammt',
  // Spam belirteçleri
  'casino','viagra','xxx','porn','sex.com',
];

const REGEX = new RegExp(
  '\\b(' + KUFURLER.map((k) => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|') + ')\\b',
  'i'
);

/**
 * Metin içinde küfür var mı?
 * Türkçe karakter normalizasyonu yapar — "amınakoyim" yakalanır.
 */
export function kufurIceriyorMu(metin) {
  if (!metin) return false;
  // Türkçe karakter normalize
  const normalize = metin
    .toLocaleLowerCase('tr')
    .replace(/[ığşöçü]/g, (c) => ({ı:'i',ğ:'g',ş:'s',ö:'o',ç:'c',ü:'u'}[c]))
    .replace(/[^a-z0-9\s]/g, ' ');
  return REGEX.test(normalize);
}
