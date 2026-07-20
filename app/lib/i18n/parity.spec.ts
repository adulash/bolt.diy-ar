import { describe, expect, it } from 'vitest';
import { I18N_NAMESPACES, resources } from './index';

/**
 * Guards against missing Arabic translations: every key present in the English
 * (source-of-truth) catalog must exist in Arabic, and vice-versa. Plural suffix
 * variants (_zero/_one/_two/_few/_many/_other) are collapsed to their base key
 * because English and Arabic have different plural category sets.
 */

type Dict = Record<string, unknown>;

const PLURAL_SUFFIX = /_(zero|one|two|few|many|other)$/;

function flatten(obj: Dict, prefix = ''): Set<string> {
  const keys = new Set<string>();

  for (const [key, value] of Object.entries(obj)) {
    const full = prefix ? `${prefix}.${key}` : key;

    if (value && typeof value === 'object' && !Array.isArray(value)) {
      for (const nested of flatten(value as Dict, full)) {
        keys.add(nested);
      }
    } else {
      keys.add(full.replace(PLURAL_SUFFIX, ''));
    }
  }

  return keys;
}

describe('i18n key parity', () => {
  for (const ns of I18N_NAMESPACES) {
    it(`ar and en have matching keys for the "${ns}" namespace`, () => {
      const en = flatten(resources.en[ns] as Dict);
      const ar = flatten(resources.ar[ns] as Dict);

      const missingInAr = [...en].filter((k) => !ar.has(k)).sort();
      const missingInEn = [...ar].filter((k) => !en.has(k)).sort();

      expect(missingInAr, `keys missing from ar/${ns}.json`).toEqual([]);
      expect(missingInEn, `keys missing from en/${ns}.json`).toEqual([]);
    });
  }
});
