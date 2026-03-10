'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ChevronDown, Github, Linkedin, Twitter, Terminal } from 'lucide-react';
import type { Profile, Locale } from '@/lib/database.types';
import { getT } from '@/lib/i18n';
import { cn } from '@/lib/utils';
import { useTypewriter } from '@/hooks/useTypewriter';
import { HERO_STATS, getLocalizedStats, DEFAULT_TITLES } from '@/lib/constants/hero';

interface HeroProps {
  profile: Profile | null;
  locale: Locale;
}

/**
 * Hero section component displaying the main introduction.
 * Features a typewriter effect for titles and animated stats.
 */
export default function HeroSection({ profile, locale }: HeroProps) {
  const t = getT(locale);
  const isAr = locale === 'ar';

  // Get localized name
  const name = isAr ? profile?.name_ar : profile?.name_en;

  // Get titles for typewriter effect
  const titles = isAr
    ? [profile?.title_ar || DEFAULT_TITLES.ar[0], ...DEFAULT_TITLES.ar.slice(1)]
    : [profile?.title_en || DEFAULT_TITLES.en[0], ...DEFAULT_TITLES.en.slice(1)];

  const { text: typeText } = useTypewriter(titles.filter(Boolean) as string[]);

  // Get localized stats
  const stats = getLocalizedStats(HERO_STATS, locale);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Grid bg */}
      <div className="absolute inset-0 bg-grid opacity-50" />

      {/* Radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-neon-cyan/5 blur-[100px] pointer-events-none" />
      <div className="absolute top-1/3 left-1/3 w-[300px] h-[300px] rounded-full bg-neon-purple/5 blur-[80px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className={cn('flex flex-col', isAr ? 'items-end text-right' : 'items-start text-left')}>
          {/* Status badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-2 mb-6"
          >
            <div className="w-2 h-2 rounded-full bg-neon-green animate-pulse-slow" />
            <span className="font-mono text-neon-green text-xs tracking-widest uppercase">
              {t.hero.available}
            </span>
          </motion.div>

          {/* Greeting */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="font-mono text-text-muted text-sm mb-2"
          >
            <span className="text-neon-cyan">&gt;</span> {t.hero.greeting}
          </motion.p>

          {/* Name */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className={cn(
              'text-5xl sm:text-7xl font-bold tracking-tight mb-4',
              isAr ? 'font-arabic' : 'font-display'
            )}
          >
            <span className="text-text-primary">{name || 'Developer'}</span>
          </motion.h1>

          {/* Typewriter title */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="flex items-center gap-2 mb-6 h-10"
          >
            <Terminal size={18} className="text-neon-cyan shrink-0" />
            <span className={cn('text-xl sm:text-2xl font-mono text-neon-cyan')}>
              {typeText}
              <span className="animate-terminal-cursor">|</span>
            </span>
          </motion.div>

          {/* Bio */}
          {(profile?.bio_en || profile?.bio_ar) && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className={cn(
                'max-w-2xl text-text-muted text-base sm:text-lg leading-relaxed mb-8',
                isAr && 'font-arabic'
              )}
            >
              {isAr ? profile.bio_ar : profile.bio_en}
            </motion.p>
          )}

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className={cn('flex gap-8 mb-10', isAr && 'flex-row-reverse')}
          >
            {stats.map((stat) => (
              <div key={stat.label} className={cn('flex flex-col', isAr ? 'items-end' : 'items-start')}>
                <span className="text-2xl font-bold font-mono neon-text">{stat.value}</span>
                <span className="text-xs text-text-muted font-mono uppercase tracking-wider">{stat.label}</span>
              </div>
            ))}
          </motion.div>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className={cn('flex flex-wrap gap-4 mb-12', isAr && 'flex-row-reverse')}
          >
            <a href="#projects" className="btn-neon-filled px-6 py-3 font-mono text-sm flex items-center gap-2">
              <span className="text-neon-cyan">&gt;</span> {t.hero.viewWork}
            </a>
            <Link
              href={`/${locale}/resume`}
              className="btn-neon px-6 py-3 font-mono text-sm"
            >
              {t.hero.downloadCV}
            </Link>
          </motion.div>

          {/* Social links */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.6 }}
            className={cn('flex gap-4', isAr && 'flex-row-reverse')}
          >
            {profile?.github_url && (
              <SocialLink href={profile.github_url} icon={<Github size={18} />} />
            )}
            {profile?.linkedin_url && (
              <SocialLink href={profile.linkedin_url} icon={<Linkedin size={18} />} />
            )}
            {profile?.twitter_url && (
              <SocialLink href={profile.twitter_url} icon={<Twitter size={18} />} />
            )}
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.a
        href="#about"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-text-muted hover:text-neon-cyan transition-colors group"
      >
        <span className="font-mono text-xs tracking-widest">{t.hero.scrollDown}</span>
        <ChevronDown size={16} className="animate-bounce" />
      </motion.a>

      {/* Corner decorations */}
      <CornerDecoration />
    </section>
  );
}

/**
 * Social media link button with hover effects
 */
function SocialLink({ href, icon }: { href: string; icon: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="w-10 h-10 border border-glass-border flex items-center justify-center text-text-muted hover:text-neon-cyan hover:border-neon-cyan/50 transition-all"
    >
      {icon}
    </a>
  );
}

/**
 * Corner decoration showing system status
 */
function CornerDecoration() {
  return (
    <div className="absolute top-20 right-8 hidden lg:block">
      <div className="font-mono text-xs text-text-muted/30 text-right space-y-1">
        <div>{"// system initialized"}</div>
        <div className="text-neon-green/30">status: online</div>
        <div suppressHydrationWarning>v2.0.{new Date().getFullYear()}</div>
      </div>
    </div>
  );
}
