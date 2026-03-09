import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { Locale } from './database.types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getLocalizedField(obj: Record<string, unknown>, field: string, locale: Locale): string {
  return (obj[`${field}_${locale}`] as string) || (obj[`${field}_en`] as string) || '';
}

export function formatDate(dateStr: string | null, locale: Locale): string {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleDateString(locale === 'ar' ? 'ar-SA' : 'en-US', {
    year: 'numeric',
    month: 'long',
  });
}

export function slugify(text: string): string {
  return text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
}

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

export function getTechColor(tech: string): string {
  const key = tech.toLowerCase().replace(/[.\s-]/g, '');
  return TECH_COLORS[key] || TECH_COLORS.default;
}
