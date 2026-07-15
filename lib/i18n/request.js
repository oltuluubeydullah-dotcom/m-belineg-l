// ════════════════════════════════════════════════════════════
// i18n Request Config — next-intl her istekte çağırır
// ════════════════════════════════════════════════════════════
// next-intl 3.17.x: locale param okunabilir AMA return objesinde
// tekrar döndürülmemeli. Sadece messages + ek config döndür.
// ════════════════════════════════════════════════════════════

import { getRequestConfig } from 'next-intl/server';
import { locales, defaultLocale } from './config';

export default getRequestConfig(async ({ requestLocale }) => {
  // next-intl 3.22+: requestLocale bir Promise, await et
  const requested = await requestLocale;
  const locale = locales.includes(requested) ? requested : defaultLocale;

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
    timeZone: 'Europe/Istanbul',
  };
});
