'use client';

import { motion } from 'framer-motion';
import type { Experience, Locale } from '@/lib/database.types';
import { getT } from '@/lib/i18n';
import { cn, formatDate as fmtDate } from '@/lib/utils';
import SectionHeader from '../ui/SectionHeader';
import { MapPin, Calendar } from 'lucide-react';

interface ExperienceProps {
  experience: Experience[];
  locale: Locale;
}

export default function ExperienceSection({ experience, locale }: ExperienceProps) {
  const t = getT(locale);
  const isAr = locale === 'ar';

  return (
    <section id="experience" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          tag="// experience"
          title={t.experience.title}
          subtitle={t.experience.subtitle}
          isAr={isAr}
        />

        <div className="mt-12 relative">
          {/* Timeline line */}
          <div className={cn(
            'absolute top-0 bottom-0 w-px bg-linear-to-b from-neon-cyan via-neon-purple to-transparent',
            isAr ? 'right-4' : 'left-4'
          )} />

          <div className="space-y-8">
            {experience.map((exp, i) => (
              <motion.div
                key={exp.id}
                initial={{ opacity: 0, x: isAr ? 20 : -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className={cn('relative', isAr ? 'pr-12' : 'pl-12')}
              >
                {/* Dot */}
                <div className={cn(
                  'absolute top-5 w-3 h-3 rounded-full bg-neon-cyan border-2 border-void',
                  'shadow-neon-cyan',
                  isAr ? 'right-2.5' : 'left-2.5'
                )} />

                <div className={cn(
                  'glass-card p-6 hover:border-neon-cyan/20 transition-all',
                  isAr && 'text-right'
                )}>
                  {/* Header */}
                  <div className={cn('flex flex-wrap items-start justify-between gap-4 mb-4', isAr && 'flex-row-reverse')}>
                    <div>
                      <h3 className={cn(
                        'text-lg font-semibold text-text-primary',
                        isAr && 'font-arabic'
                      )}>
                        {isAr ? exp.role_ar : exp.role_en}
                      </h3>
                      <p className={cn('text-neon-cyan font-mono text-sm mt-0.5', isAr && 'font-arabic')}>
                        {isAr ? exp.company_ar : exp.company_en}
                      </p>
                    </div>

                    <div className={cn('flex flex-col gap-1', isAr ? 'items-end' : 'items-end')}>
                      <div className={cn('flex items-center gap-1.5 text-xs text-text-muted font-mono', isAr && 'flex-row-reverse')} suppressHydrationWarning>
                        <Calendar size={12} />
                        <span>
                          {fmtDate(exp.start_date, locale)} —{' '}
                          {exp.is_current ? t.experience.present : fmtDate(exp.end_date, locale)}
                        </span>
                      </div>
                      {exp.location_en && (
                        <div className={cn('flex items-center gap-1.5 text-xs text-text-muted', isAr && 'flex-row-reverse')}>
                          <MapPin size={12} />
                          <span>{isAr ? exp.location_ar : exp.location_en}</span>
                        </div>
                      )}
                      {exp.is_current && (
                        <span className="px-2 py-0.5 bg-neon-green/10 border border-neon-green/30 text-neon-green text-xs font-mono">
                          {isAr ? 'حالياً' : 'Current'}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Description */}
                  {(exp.description_en || exp.description_ar) && (
                    <p className={cn('text-sm text-text-muted mb-4 leading-relaxed', isAr && 'font-arabic')}>
                      {isAr ? exp.description_ar : exp.description_en}
                    </p>
                  )}

                  {/* Responsibilities */}
                  {(exp.responsibilities_en?.length > 0 || exp.responsibilities_ar?.length > 0) && (
                    <ul className="space-y-1.5">
                      {(isAr ? exp.responsibilities_ar : exp.responsibilities_en)?.map((resp, j) => (
                        <li
                          key={j}
                          className={cn(
                            'flex items-start gap-2 text-sm text-text-muted',
                            isAr && 'flex-row-reverse font-arabic'
                          )}
                        >
                          <span className="text-neon-cyan font-mono mt-0.5 shrink-0">▸</span>
                          <span>{resp}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
