import type { Locale } from './database.types';

import { en } from './locales/en';
import { ar } from './locales/ar';

export const translations = {
  en,
  ar,
} as const;

export type TranslationKeys = typeof translations.en;

export function getT(locale: Locale) {
  return translations[locale] || translations['en'];
}

export function localizedValue<T>(obj: { en: T; ar: T } | null | undefined, locale: Locale): T {
  if (!obj) return '' as T;
  return obj[locale];
}

export function isRTL(locale: Locale): boolean {
  return locale === 'ar';
}
