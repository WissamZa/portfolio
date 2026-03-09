'use client';

import { motion } from 'framer-motion';
import type { Education, Locale } from '@/lib/database.types';
import { getT } from '@/lib/i18n';
import { cn, formatDate } from '@/lib/utils';
import SectionHeader from '../ui/SectionHeader';
import { GraduationCap, MapPin, Award } from 'lucide-react';

interface EducationProps {
  education: Education[];
  locale: Locale;
}

export default function EducationSection({ education, locale }: EducationProps) {
  const t = getT(locale);
  const isAr = locale === 'ar';

  return (
    <section id="education" className="py-24 relative">
      <div className="absolute inset-0 bg-linear-to-b from-void via-void-3 to-void" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          tag="// education"
          title={t.education.title}
          subtitle={t.education.subtitle}
          isAr={isAr}
        />

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {education.map((edu, i) => (
            <motion.div
              key={edu.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className={cn('glass-card p-6 hover:border-neon-purple/30 transition-all group', isAr && 'text-right')}
            >
              <div className={cn('flex items-start gap-4 mb-4', isAr && 'flex-row-reverse')}>
                <div className="w-12 h-12 shrink-0 border border-neon-purple/30 bg-neon-purple/5 flex items-center justify-center group-hover:border-neon-purple/60 transition-colors">
                  <GraduationCap size={20} className="text-neon-purple" />
                </div>
                <div>
                  <h3 className={cn('font-semibold text-text-primary', isAr && 'font-arabic')}>
                    {isAr ? edu.degree_ar : edu.degree_en}
                    {edu.field_en && (
                      <span className="text-neon-purple font-mono text-sm ml-1 mr-1">
                        — {isAr ? edu.field_ar : edu.field_en}
                      </span>
                    )}
                  </h3>
                  <p className={cn('text-sm text-text-muted mt-0.5', isAr && 'font-arabic')}>
                    {isAr ? edu.institution_ar : edu.institution_en}
                  </p>
                </div>
              </div>

              <div className={cn('flex flex-wrap gap-3 text-xs text-text-muted font-mono', isAr && 'justify-end')} suppressHydrationWarning>
                <span>
                  {formatDate(edu.start_date, locale)} — {edu.is_current ? (isAr ? 'حالياً' : 'Present') : formatDate(edu.end_date, locale)}
                </span>
                {edu.location_en && (
                  <span className="flex items-center gap-1">
                    <MapPin size={10} />
                    {isAr ? edu.location_ar : edu.location_en}
                  </span>
                )}
                {edu.gpa && (
                  <span className="flex items-center gap-1 text-neon-green">
                    <Award size={10} />
                    {t.education.gpa}: {edu.gpa}
                  </span>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
