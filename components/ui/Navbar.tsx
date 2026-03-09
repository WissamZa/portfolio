'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import type { Locale } from '@/lib/database.types';
import { getT, isRTL } from '@/lib/i18n';
import { cn } from '@/lib/utils';
import { Menu, X, Globe, FileText } from 'lucide-react';

interface NavbarProps {
  locale: Locale;
}

export default function Navbar({ locale }: NavbarProps) {
  const t = getT(locale);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const rtl = isRTL(locale);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const toggleLocale = () => {
    const newLocale = locale === 'en' ? 'ar' : 'en';
    const newPath = pathname.replace(`/${locale}`, `/${newLocale}`);
    router.push(newPath);
  };

  const navLinks = [
    { href: `/${locale}#about`, label: t.nav.about },
    { href: `/${locale}#projects`, label: t.nav.projects },
    { href: `/${locale}#skills`, label: t.nav.skills },
    { href: `/${locale}#experience`, label: t.nav.experience },
    { href: `/${locale}#education`, label: t.nav.education },
    { href: `/${locale}#contact`, label: t.nav.contact },
  ];

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled ? 'glass-card' : 'bg-transparent',
        rtl && 'font-arabic'
      )}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={cn('flex items-center justify-between h-16', rtl && 'flex-row-reverse')}>
          {/* Logo */}
          <Link href={`/${locale}`} className="flex items-center gap-2 group">
            <div className="w-8 h-8 border border-neon-cyan/50 flex items-center justify-center relative">
              <span className="font-mono text-neon-cyan text-xs font-bold">CS</span>
              <div className="absolute inset-0 bg-neon-cyan/5 group-hover:bg-neon-cyan/10 transition-colors" />
            </div>
            <span className="font-mono text-sm text-text-accent group-hover:text-neon-cyan transition-colors">
              {locale === 'ar' ? 'ملف.أعمال' : 'portfolio.cs'}
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className={cn('hidden md:flex items-center gap-6', rtl && 'flex-row-reverse')}>
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-text-muted hover:text-neon-cyan text-sm transition-colors font-mono"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Right actions */}
          <div className={cn('flex items-center gap-3', rtl && 'flex-row-reverse')}>
            {/* Language toggle */}
            <button
              onClick={toggleLocale}
              className="flex items-center gap-1 text-text-muted hover:text-neon-cyan transition-colors font-mono text-sm px-2 py-1 border border-transparent hover:border-neon-cyan/30 rounded"
            >
              <Globe size={14} />
              <span>{locale === 'en' ? 'عربي' : 'EN'}</span>
            </button>

            {/* Resume link */}
            <Link
              href={`/${locale}/resume`}
              className="hidden md:flex items-center gap-2 btn-neon text-xs"
            >
              <FileText size={14} />
              <span>{t.nav.resume}</span>
            </Link>

            {/* Mobile toggle */}
            <button
              className="md:hidden text-text-muted hover:text-neon-cyan transition-colors"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden glass-card border-t border-glass-border">
          <div className="px-4 py-3 space-y-2">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="block px-3 py-2 text-text-muted hover:text-neon-cyan font-mono text-sm"
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <Link
              href={`/${locale}/resume`}
              className="block px-3 py-2 text-neon-cyan font-mono text-sm"
              onClick={() => setMenuOpen(false)}
            >
              {t.nav.resume}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
