'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Star } from 'lucide-react';
import { Github } from '../ui/BrandIcons';
import type { Project, Locale } from '@/lib/database.types';
import { getT } from '@/lib/i18n';
import { cn, getTechColor } from '@/lib/utils';
import SectionHeader from '../ui/SectionHeader';

interface ProjectsProps {
  projects: Project[];
  locale: Locale;
}

export default function ProjectsSection({ projects, locale }: ProjectsProps) {
  const t = getT(locale);
  const isAr = locale === 'ar';
  const [showAll, setShowAll] = useState(false);

  const displayed = showAll ? projects : projects.slice(0, 6);

  return (
    <section id="projects" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          tag="// projects"
          title={t.projects.title}
          subtitle={t.projects.subtitle}
          isAr={isAr}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
          {displayed.map((project, i) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className={cn(
                'glass-card group relative overflow-hidden transition-all duration-300',
                'hover:border-neon-cyan/30 hover:shadow-neon-cyan',
                project.featured && 'ring-1 ring-neon-cyan/20'
              )}
            >
              {/* Featured badge */}
              {project.featured && (
                <div className={cn(
                  'absolute top-3 flex items-center gap-1 px-2 py-0.5 bg-neon-cyan/10 border border-neon-cyan/30 text-neon-cyan text-xs font-mono z-10',
                  isAr ? 'right-3' : 'left-3'
                )}>
                  <Star size={10} />
                  <span>{t.projects.featured}</span>
                </div>
              )}

              {/* Project Image or Canvas */}
              <div className="relative h-48 w-full overflow-hidden bg-void-3">
                {project.image_url ? (
                  <img
                    src={project.image_url}
                    alt={isAr ? project.title_ar : project.title_en}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                ) : (
                  <div className="w-full h-full bg-linear-to-br from-neon-cyan/10 via-neon-purple/10 to-neon-orange/10 flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--color-neon-cyan)_0%,transparent_70%)] opacity-5" />
                    <Star size={32} className="text-neon-cyan/20 animate-pulse-slow" />
                  </div>
                )}
                {/* Status Overlay */}
                <div className={cn(
                  'absolute bottom-3 flex items-center gap-2 px-2 py-1 bg-void/80 backdrop-blur-sm border border-white/10 text-[10px] font-mono z-10',
                  isAr ? 'left-3' : 'right-3'
                )}>
                  <div className={cn(
                    'w-1.5 h-1.5 rounded-full animate-pulse',
                    project.status === 'completed' ? 'bg-neon-green' :
                    project.status === 'in_progress' ? 'bg-neon-orange' : 'bg-text-muted'
                  )} />
                  <span className="text-text-muted uppercase tracking-widest">
                    {t.projects.status[project.status]}
                  </span>
                </div>
              </div>

              <div className={cn('p-6 flex-1 flex flex-col', isAr && 'text-right')}>
                {/* Title */}
                <h3 className={cn(
                  'text-xl font-bold text-text-primary mb-3 group-hover:text-neon-cyan transition-colors line-tight',
                  isAr && 'font-arabic'
                )}>
                  {isAr ? project.title_ar : project.title_en}
                </h3>

                {/* Description */}
                <p className={cn(
                  'text-sm text-text-muted leading-relaxed mb-6 flex-1',
                  isAr && 'font-arabic'
                )}>
                  {isAr ? project.description_ar : project.description_en}
                </p>

                {/* Tech stack */}
                <div className={cn('flex flex-wrap gap-2 mb-6', isAr && 'justify-end')}>
                  {project.tech_stack?.map((tech) => (
                    <span
                      key={tech}
                      className="px-2 py-0.5 text-[10px] font-mono border border-white/5 bg-white/5 text-text-muted group-hover:border-neon-cyan/20 group-hover:text-neon-cyan transition-all"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Links */}
                <div className={cn('flex items-center gap-4 pt-4 border-t border-white/5', isAr && 'flex-row-reverse')}>
                  {project.github_url && (
                    <a
                      href={project.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-text-muted hover:text-neon-cyan transition-all"
                    >
                      <Github size={14} />
                      <span className="hidden sm:inline">{t.projects.viewCode}</span>
                    </a>
                  )}
                  {project.live_url && (
                    <a
                      href={project.live_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-neon-green hover:text-white transition-all ml-auto"
                    >
                      <ExternalLink size={14} />
                      <span className="hidden sm:inline">{t.projects.liveDemo}</span>
                    </a>
                  )}
                </div>
              </div>

              {/* Hover glow */}
              <div className="absolute inset-0 bg-card-glow opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            </motion.div>
          ))}
        </div>

        {projects.length > 6 && (
          <div className="mt-10 text-center">
            <button
              onClick={() => setShowAll(!showAll)}
              className="btn-neon px-8 py-3 font-mono text-sm"
            >
              {showAll ? (isAr ? 'عرض أقل' : 'Show Less') : t.projects.viewAll}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
