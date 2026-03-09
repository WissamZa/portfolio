'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import type { Skill, Locale } from '@/lib/database.types';
import { getT } from '@/lib/i18n';
import { cn } from '@/lib/utils';
import SectionHeader from '../ui/SectionHeader';

interface SkillsProps {
  skills: Skill[];
  locale: Locale;
}

const CATEGORY_ORDER = ['languages', 'frameworks', 'databases', 'tools', 'cloud', 'other'] as const;

export default function SkillsSection({ skills, locale }: SkillsProps) {
  const t = getT(locale);
  const isAr = locale === 'ar';
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const grouped = CATEGORY_ORDER.reduce((acc, cat) => {
    const filtered = skills.filter((s) => s.category === cat);
    if (filtered.length) acc[cat] = filtered;
    return acc;
  }, {} as Record<string, Skill[]>);

  const categories = ['all', ...Object.keys(grouped)];

  const filtered = activeCategory === 'all'
    ? skills
    : skills.filter((s) => s.category === activeCategory);

  return (
    <section id="skills" className="py-24 relative">
      {/* Background accent */}
      <div className="absolute inset-0 bg-linear-to-b from-void via-void-2 to-void" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          tag="// skills"
          title={t.skills.title}
          subtitle={t.skills.subtitle}
          isAr={isAr}
        />

        {/* Category Filter */}
        <div className={cn('flex flex-wrap gap-2 mt-10 mb-10', isAr && 'flex-row-reverse')}>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                'px-4 py-1.5 font-mono text-xs border transition-all uppercase tracking-wider',
                activeCategory === cat
                  ? 'border-neon-cyan bg-neon-cyan/10 text-neon-cyan'
                  : 'border-glass-border text-text-muted hover:border-neon-cyan/40 hover:text-neon-cyan'
              )}
            >
              {cat === 'all'
                ? isAr ? 'الكل' : 'ALL'
                : t.skills.categories[cat as keyof typeof t.skills.categories] || cat}
            </button>
          ))}
        </div>

        {/* Skills grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((skill, i) => (
            <SkillCard key={skill.id} skill={skill} locale={locale} index={i} />
          ))}
        </div>

        {/* Radar-style visualization placeholder */}
        <div className="mt-16 glass-card p-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-grid opacity-20" />
          <h3 className={cn('font-mono text-neon-cyan text-sm mb-6', isAr && 'text-right font-arabic')}>
            {isAr ? '// نظرة عامة على المهارات' : '// skill_overview.map()'}
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {CATEGORY_ORDER.filter(cat => grouped[cat]).map((cat) => (
              <div key={cat}>
                <div className={cn('flex justify-between mb-2', isAr && 'flex-row-reverse')}>
                  <span className={cn('text-xs text-text-muted font-mono uppercase tracking-wider', isAr && 'font-arabic')}>
                    {t.skills.categories[cat]}
                  </span>
                  <span className="text-xs text-neon-green font-mono">{grouped[cat].length}</span>
                </div>
                <div className="skill-bar">
                  <div
                    className="skill-bar-fill"
                    style={{ width: `${Math.min(grouped[cat].length * 12, 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function SkillCard({ skill, locale, index }: { skill: Skill; locale: Locale; index: number }) {
  const isAr = locale === 'ar';
  const barRef = useRef<HTMLDivElement>(null);
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setAnimated(true); },
      { threshold: 0.2 }
    );
    if (barRef.current) observer.observe(barRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <motion.div
      ref={barRef}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      className="glass-card p-4 hover:border-neon-cyan/20 transition-all group"
    >
      <div className={cn('flex items-center justify-between mb-3', isAr && 'flex-row-reverse')}>
        <span className={cn(
          'text-sm font-medium text-text-primary group-hover:text-neon-cyan transition-colors',
          isAr && 'font-arabic'
        )}>
          {isAr ? skill.name_ar : skill.name_en}
        </span>
        <span className="text-xs font-mono text-neon-cyan">{skill.proficiency}%</span>
      </div>
      <div className="skill-bar">
        <div
          className="skill-bar-fill transition-all duration-1000 ease-out"
          style={{ width: animated ? `${skill.proficiency}%` : '0%' }}
        />
      </div>
    </motion.div>
  );
}
