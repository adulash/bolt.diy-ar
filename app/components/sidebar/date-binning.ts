import { format, isAfter, isThisWeek, isThisYear, isToday, isYesterday, subDays } from 'date-fns';
import { ar } from 'date-fns/locale';
import i18n from '~/lib/i18n';
import type { ChatHistoryItem } from '~/lib/persistence';

type Bin = { category: string; items: ChatHistoryItem[] };

function dateFnsLocale() {
  return i18n.language === 'ar' ? ar : undefined;
}

export function binDates(_list: ChatHistoryItem[]) {
  const list = _list.toSorted((a, b) => Date.parse(b.timestamp) - Date.parse(a.timestamp));

  const binLookup: Record<string, Bin> = {};
  const bins: Array<Bin> = [];

  list.forEach((item) => {
    const category = dateCategory(new Date(item.timestamp));

    if (!(category in binLookup)) {
      const bin = {
        category,
        items: [item],
      };

      binLookup[category] = bin;

      bins.push(bin);
    } else {
      binLookup[category].items.push(item);
    }
  });

  return bins;
}

function dateCategory(date: Date) {
  if (isToday(date)) {
    return i18n.t('common:dates.today');
  }

  if (isYesterday(date)) {
    return i18n.t('common:dates.yesterday');
  }

  if (isThisWeek(date)) {
    // e.g., "Mon" instead of "Monday"
    return format(date, 'EEE', { locale: dateFnsLocale() });
  }

  const thirtyDaysAgo = subDays(new Date(), 30);

  if (isAfter(date, thirtyDaysAgo)) {
    return i18n.t('common:dates.past30Days');
  }

  if (isThisYear(date)) {
    // e.g., "Jan" instead of "January"
    return format(date, 'LLL', { locale: dateFnsLocale() });
  }

  // e.g., "Jan 2023" instead of "January 2023"
  return format(date, 'LLL yyyy', { locale: dateFnsLocale() });
}
