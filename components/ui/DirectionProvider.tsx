'use client';

import { useEffect } from 'react';
import type { Locale } from '@/lib/database.types';

export default function DirectionProvider({ locale, dir }: { locale: Locale; dir: string }) {
  useEffect(() => {
    document.documentElement.dir = dir;
    document.documentElement.lang = locale;
  }, [locale, dir]);

  return null;
}
