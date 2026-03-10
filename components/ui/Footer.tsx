import Link from 'next/link';
import type { Locale } from '@/lib/database.types';
import { getT } from '@/lib/i18n';
import { cn } from '@/lib/utils';

interface FooterProps {
  locale: Locale;
}

export default function Footer({ locale }: FooterProps) {
  const t = getT(locale);
  const isAr = locale === 'ar';

  return (
    <footer className="border-t border-glass-border py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={cn('flex flex-col sm:flex-row items-center justify-between gap-4', isAr && 'sm:flex-row-reverse')}>
          <p className={cn('font-mono text-xs text-text-muted', isAr && 'font-arabic')} suppressHydrationWarning>
            &copy; {new Date().getFullYear()} — {t.footer.rights}
          </p>
          <p className="font-mono text-xs text-text-muted">
            {t.footer.builtWith}
          </p>
          <div className={cn('flex gap-4 font-mono text-xs', isAr && 'flex-row-reverse')}>
            <Link href={`/${locale}`} className="text-text-muted hover:text-neon-cyan transition-colors">
              {t.nav.home}
            </Link>
            <Link href={`/${locale}/x-admin-portal`} className="text-text-muted hover:text-neon-cyan transition-colors">
              {t.nav.console}
            </Link>
            <Link href={`/${locale}/resume`} className="text-text-muted hover:text-neon-cyan transition-colors">
              {t.nav.resume}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
