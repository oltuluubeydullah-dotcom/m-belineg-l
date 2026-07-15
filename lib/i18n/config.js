// ════════════════════════════════════════════════════════════
// i18n Config — Dil yapılandırması
// ════════════════════════════════════════════════════════════
// Desteklenen 3 dil: TR (default, prefix YOK) + EN + DE.
// next-intl bu config'i tüm sayfalarda kullanır.
// ════════════════════════════════════════════════════════════

export const locales = ['tr', 'en', 'de'];
export const defaultLocale = 'tr';
export const localePrefix = 'as-needed'; // TR'de prefix yok, EN/DE'de var

export const localeMeta = {
  tr: { name: 'Türkçe',  flag: '🇹🇷', short: 'TR', dir: 'ltr', html: 'tr' },
  en: { name: 'English', flag: '🇬🇧', short: 'EN', dir: 'ltr', html: 'en' },
  de: { name: 'Deutsch', flag: '🇩🇪', short: 'DE', dir: 'ltr', html: 'de' },
};
