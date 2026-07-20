import { atom } from 'nanostores';
import Cookies from 'js-cookie';
import { logStore } from './logs';

export type Locale = 'ar' | 'en';

export const kLocale = 'bolt_locale';

export const DEFAULT_LOCALE: Locale = 'ar';

export const SUPPORTED_LOCALES: Locale[] = ['ar', 'en'];

const RTL_LOCALES: ReadonlySet<Locale> = new Set<Locale>(['ar']);

export function isRTL(locale: Locale) {
  return RTL_LOCALES.has(locale);
}

export function localeDirection(locale: Locale): 'rtl' | 'ltr' {
  return isRTL(locale) ? 'rtl' : 'ltr';
}

export const localeStore = atom<Locale>(initStore());

function initStore(): Locale {
  if (!import.meta.env.SSR) {
    const persistedLocale = localStorage.getItem(kLocale) as Locale | null;
    const langAttribute = document.querySelector('html')?.getAttribute('lang') as Locale | null;
    const candidate = persistedLocale ?? langAttribute ?? DEFAULT_LOCALE;

    return SUPPORTED_LOCALES.includes(candidate) ? candidate : DEFAULT_LOCALE;
  }

  return DEFAULT_LOCALE;
}

export function setLocale(newLocale: Locale) {
  if (!SUPPORTED_LOCALES.includes(newLocale)) {
    return;
  }

  localeStore.set(newLocale);

  localStorage.setItem(kLocale, newLocale);
  Cookies.set(kLocale, newLocale, { expires: 365 });

  const html = document.querySelector('html');
  html?.setAttribute('lang', newLocale);
  html?.setAttribute('dir', localeDirection(newLocale));

  // i18n is imported lazily to avoid a cycle: i18n init reads localeStore.
  import('~/lib/i18n')
    .then(({ default: i18n }) => i18n.changeLanguage(newLocale))
    .catch((error) => console.error('Failed to change i18n language:', error));

  logStore.logSystem(`Locale changed to ${newLocale}`);
}
