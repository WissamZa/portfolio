'use client';

import { motion } from 'framer-motion';
import { Code2, Cpu, Database, Globe } from 'lucide-react';
import type { Profile, Locale } from '@/lib/database.types';
import { getT } from '@/lib/i18n';
import { cn } from '@/lib/utils';
import SectionHeader from '../ui/SectionHeader';

interface AboutProps {
  profile: Profile | null;
  locale: Locale;
}

export default function AboutSection({ profile, locale }: AboutProps) {
  const t = getT(locale);
  const isAr = locale === 'ar';

  const highlights = [
    { icon: Code2, label: isAr ? 'كود نظيف' : 'Clean Code', color: 'neon-cyan' },
    { icon: Cpu, label: isAr ? 'أنظمة موزعة' : 'Distributed Systems', color: 'neon-purple' },
    { icon: Database, label: isAr ? 'تحسين الأداء' : 'Performance', color: 'neon-green' },
    { icon: Globe, label: isAr ? 'تطوير متكامل' : 'Full-Stack', color: 'neon-orange' },
  ];

  return (
    <section id="about" className="py-24 relative">
      <div className="absolute inset-0 bg-linear-to-b from-void via-void-2 to-void opacity-80" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={cn('grid lg:grid-cols-2 gap-16 items-center', isAr && 'lg:grid-flow-col-dense')}>
          {/* Text side */}
          <motion.div
            initial={{ opacity: 0, x: isAr ? 30 : -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className={isAr ? 'text-right' : ''}
          >
            <SectionHeader
              tag="// about"
              title={t.about.title}
              subtitle={t.about.subtitle}
              isAr={isAr}
            />

            <p className={cn(
              'text-text-muted leading-relaxed mt-6 text-base',
              isAr && 'font-arabic'
            )}>
              {isAr ? profile?.bio_ar : profile?.bio_en}
            </p>

            {/* Tech philosophy */}
            <div className="mt-8 font-mono text-xs space-y-2 text-text-muted/60">
              <div><span className="text-neon-purple">const</span> <span className="text-neon-cyan">philosophy</span> = {'{'}</div>
              <div className="pl-4"><span className="text-text-accent">clean_architecture</span>: <span className="text-neon-green">true</span>,</div>
              <div className="pl-4"><span className="text-text-accent">test_driven</span>: <span className="text-neon-green">true</span>,</div>
              <div className="pl-4"><span className="text-text-accent">continuous_learning</span>: <span className="text-neon-green">true</span>,</div>
              <div className="pl-4"><span className="text-text-accent">open_source</span>: <span className="text-neon-green">true</span></div>
              <div>{'};'}</div>
            </div>
          </motion.div>

          {/* Cards side */}
          <motion.div
            initial={{ opacity: 0, x: isAr ? -30 : 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="grid grid-cols-2 gap-4"
          >
            {highlights.map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 + 0.3 }}
                className={cn(
                  'glass-card p-6 flex flex-col items-center text-center gap-3',
                  'hover:border-neon-cyan/30 transition-all group cursor-default',
                  i % 2 === 1 && 'mt-8'
                )}
              >
                <div className={cn(
                  'w-12 h-12 flex items-center justify-center border',
                  `border-${item.color}/30 bg-${item.color}/5 group-hover:border-${item.color}/60 transition-colors`
                )}>
                  <item.icon
                    size={20}
                    className={`text-${item.color} group-hover:scale-110 transition-transform`}
                  />
                </div>
                <span className={cn(
                  'text-sm text-text-muted font-mono',
                  isAr && 'font-arabic'
                )}>
                  {item.label}
                </span>
              </motion.div>
            ))}

            {/* Avatar */}
            {profile?.avatar_url && (
              <div className="col-span-2 flex justify-center mt-4">
                <div className="relative w-32 h-32">
                  <div className="clip-hex w-full h-full overflow-hidden border-2 border-neon-cyan/40">
                    <img src={profile.avatar_url} alt={profile.name_en} className="w-full h-full object-cover" />
                  </div>
                  <div className="absolute inset-0 clip-hex bg-neon-cyan/10 animate-pulse-slow" />
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
