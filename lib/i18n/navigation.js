// ════════════════════════════════════════════════════════════
// i18n Routing — Link, redirect, useRouter i18n versiyonları
// ════════════════════════════════════════════════════════════

import { createSharedPathnamesNavigation } from 'next-intl/navigation';
import { locales, defaultLocale, localePrefix } from './config';

export const { Link, redirect, usePathname, useRouter } =
  createSharedPathnamesNavigation({ locales, defaultLocale, localePrefix });
