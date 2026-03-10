import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { Locale } from './database.types';

/**
 * Combines class names using clsx and merges Tailwind classes using tailwind-merge.
 * This allows for conditional class application and proper Tailwind class deduplication.
 *
 * @param inputs - Class values to combine (strings, objects, arrays, etc.)
 * @returns Merged class string
 *
 * @example
 * cn('px-4', isActive && 'bg-blue-500', { 'text-white': isDark })
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Retrieves a localized field value from an object.
 * Falls back to English if the locale-specific field is not found.
 *
 * @param obj - Object containing localized fields (e.g., { name_en: '...', name_ar: '...' })
 * @param field - Base field name without locale suffix (e.g., 'name')
 * @param locale - Current locale
 * @returns The localized value or empty string
 *
 * @example
 * getLocalizedField(profile, 'name', 'ar') // Returns profile.name_ar
 */
export function getLocalizedField(
  obj: Record<string, unknown>,
  field: string,
  locale: Locale
): string {
  return (obj[`${field}_${locale}`] as string) || (obj[`${field}_en`] as string) || '';
}

/**
 * Formats a date string according to the locale.
 * Uses Arabic date formatting for 'ar' locale, US formatting for 'en'.
 *
 * @param dateStr - ISO date string to format
 * @param locale - Current locale for formatting
 * @returns Formatted date string (e.g., "January 2024" or "يناير ٢٠٢٤")
 */
export function formatDate(dateStr: string | null, locale: Locale): string {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleDateString(locale === 'ar' ? 'ar-SA' : 'en-US', {
    year: 'numeric',
    month: 'long',
  });
}

/**
 * Converts a string to a URL-friendly slug.
 * Lowercases, replaces spaces with hyphens, and removes special characters.
 *
 * @param text - Text to convert to slug
 * @returns URL-friendly slug string
 *
 * @example
 * slugify('My Project Name') // Returns 'my-project-name'
 */
export function slugify(text: string): string {
  return text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
}

/**
 * Color mapping for technology badges and icons.
 * Used for consistent theming across tech-related UI elements.
 */
export const TECH_COLORS: Record<string, string> = {
  typescript: '#3178C6',
  javascript: '#F7DF1E',
  python: '#3776AB',
  react: '#61DAFB',
  nextjs: '#000000',
  nodejs: '#339933',
  rust: '#000000',
  go: '#00ADD8',
  postgresql: '#4169E1',
  redis: '#DC382D',
  docker: '#2496ED',
  aws: '#FF9900',
  kubernetes: '#326CE5',
  graphql: '#E10098',
  tailwind: '#06B6D4',
  default: '#00f5ff',
};

/**
 * Retrieves the color for a technology by name.
 * Normalizes the tech name for matching and falls back to default color.
 *
 * @param tech - Technology name (case-insensitive)
 * @returns Hex color string
 *
 * @example
 * getTechColor('TypeScript') // Returns '#3178C6'
 * getTechColor('unknown') // Returns '#00f5ff'
 */
export function getTechColor(tech: string): string {
  const key = tech.toLowerCase().replace(/[.\s-]/g, '');
  return TECH_COLORS[key] || TECH_COLORS.default;
}
