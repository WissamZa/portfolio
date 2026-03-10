import type { Locale } from '@/lib/database.types';

/**
 * Hero section statistics configuration
 */
export interface HeroStat {
  /** Display value (e.g., "20+") */
  value: string;
  /** Label in English */
  labelEn: string;
  /** Label in Arabic */
  labelAr: string;
}

/**
 * Default stats displayed in the hero section.
 * These can be overridden by profile data if needed.
 */
export const HERO_STATS: HeroStat[] = [
  { value: '20+', labelEn: 'Projects', labelAr: 'مشروع' },
  { value: '5+', labelEn: 'Years Exp', labelAr: 'سنوات خبرة' },
  { value: '30+', labelEn: 'Technologies', labelAr: 'تقنية' },
];

/**
 * Gets localized stats for the hero section
 * @param stats - Array of stats to localize
 * @param locale - Current locale
 * @returns Stats with localized labels
 */
export function getLocalizedStats(
  stats: HeroStat[],
  locale: Locale
): { label: string; value: string }[] {
  return stats.map((stat) => ({
    label: locale === 'ar' ? stat.labelAr : stat.labelEn,
    value: stat.value,
  }));
}

/**
 * Default titles for the typewriter effect when profile title is not available
 */
export const DEFAULT_TITLES = {
  en: ['Software Engineer', 'Full-Stack Developer', 'Systems Architect'],
  ar: ['مهندس برمجيات', 'مطور متكامل', 'معمار الأنظمة'],
} as const;
