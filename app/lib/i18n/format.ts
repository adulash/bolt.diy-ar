import { formatDistanceToNow } from 'date-fns';
import { ar, enUS } from 'date-fns/locale';
import { intlLocaleTag, localeStore, type Locale } from '~/lib/stores/locale';

/**
 * Locale-aware formatting helpers. Numbers and dates always use the Latin
 * numbering system (0-9) even in Arabic — this is a developer tool where ports,
 * versions and token counts must stay in Western digits. Only month/day names
 * and relative-time words are translated.
 */

function currentLocale(): Locale {
  return localeStore.get();
}

export function formatNumber(value: number, options?: Intl.NumberFormatOptions): string {
  return new Intl.NumberFormat(intlLocaleTag(), { numberingSystem: 'latn', ...options }).format(value);
}

export function formatDate(value: Date | number | string, options?: Intl.DateTimeFormatOptions): string {
  const date = value instanceof Date ? value : new Date(value);
  return new Intl.DateTimeFormat(intlLocaleTag(), { numberingSystem: 'latn', ...options }).format(date);
}

export function formatDateTime(value: Date | number | string): string {
  return formatDate(value, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatRelative(value: Date | number | string): string {
  const date = value instanceof Date ? value : new Date(value);
  return formatDistanceToNow(date, {
    addSuffix: true,
    locale: currentLocale() === 'ar' ? ar : enUS,
  });
}
