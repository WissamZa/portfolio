'use client';

import { motion } from 'framer-motion';
import type { Course, Locale } from '@/lib/database.types';
import { getT } from '@/lib/i18n';
import { cn, formatDate } from '@/lib/utils';
import SectionHeader from '../ui/SectionHeader';
import { BookOpen, ExternalLink, Award } from 'lucide-react';

interface CoursesProps {
  courses: Course[];
  locale: Locale;
}

export default function CoursesSection({ courses, locale }: CoursesProps) {
  const t = getT(locale);
  const isAr = locale === 'ar';

  if (!courses || courses.length === 0) return null;

  return (
    <section id="courses" className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-linear-to-b from-void via-void-2 to-void" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          tag="// professional development"
          title={t.courses.title}
          subtitle={t.courses.subtitle}
          isAr={isAr}
        />

        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {courses.map((course, i) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className={cn(
                'glass-card p-6 hover:border-neon-cyan/30 transition-all group relative overflow-hidden flex flex-col',
                isAr && 'text-right'
              )}
            >
              {/* Decorative accent */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-neon-cyan/5 blur-3xl rounded-full -mr-12 -mt-12 group-hover:bg-neon-cyan/10 transition-colors" />

              <div className={cn('flex items-start gap-4 mb-4', isAr && 'flex-row-reverse')}>
                <div className="w-12 h-12 shrink-0 border border-neon-cyan/30 bg-neon-cyan/5 flex items-center justify-center group-hover:border-neon-cyan/60 transition-colors">
                  <BookOpen size={20} className="text-neon-cyan" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className={cn('font-semibold text-text-primary text-lg leading-tight mb-1', isAr && 'font-arabic')}>
                    {isAr ? course.name_ar : course.name_en}
                  </h3>
                  <p className={cn('text-sm text-neon-cyan font-mono', isAr && 'font-arabic')}>
                    {isAr ? course.provider_ar : course.provider_en}
                  </p>
                </div>
              </div>

              {(course.description_en || course.description_ar) && (
                <p className={cn('text-sm text-text-muted mb-6 flex-1', isAr && 'font-arabic')}>
                  {isAr ? course.description_ar : course.description_en}
                </p>
              )}

              <div className={cn('mt-auto flex items-center justify-between gap-4 pt-4 border-t border-white/5', isAr && 'flex-row-reverse')}>
                <div className="text-xs text-text-muted font-mono" suppressHydrationWarning>
                  {course.completion_date && formatDate(course.completion_date, locale)}
                </div>
                
                <div className="flex gap-2">
                  {course.certificate_url && (
                    <a
                      href={course.certificate_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-xs font-mono text-neon-cyan hover:text-white transition-colors"
                    >
                      <Award size={14} />
                      <span className="hidden sm:inline">{t.courses.viewCertificate}</span>
                    </a>
                  )}
                  {course.course_url && (
                    <a
                      href={course.course_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1 text-text-muted hover:text-neon-cyan transition-colors"
                    >
                      <ExternalLink size={14} />
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
