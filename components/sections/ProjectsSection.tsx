'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Github, ExternalLink, Star } from 'lucide-react';
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

              {/* Project image placeholder / status bar */}
              <div className="h-2 w-full bg-linear-to-r from-neon-cyan/30 via-neon-purple/30 to-neon-green/30" />

              <div className={cn('p-6', isAr && 'text-right')}>
                {/* Status */}
                <div className={cn('flex items-center gap-2 mb-3', isAr && 'justify-end')}>
                  <div className={cn(
                    'w-1.5 h-1.5 rounded-full',
                    project.status === 'completed' ? 'bg-neon-green' :
                    project.status === 'in_progress' ? 'bg-neon-orange' : 'bg-text-muted'
                  )} />
                  <span className="font-mono text-xs text-text-muted">
                    {t.projects.status[project.status]}
                  </span>
                </div>

                {/* Title */}
                <h3 className={cn(
                  'text-lg font-semibold text-text-primary mb-2 group-hover:text-neon-cyan transition-colors',
                  isAr && 'font-arabic'
                )}>
                  {isAr ? project.title_ar : project.title_en}
                </h3>

                {/* Description */}
                <p className={cn(
                  'text-sm text-text-muted leading-relaxed mb-4 line-clamp-3',
                  isAr && 'font-arabic'
                )}>
                  {isAr ? project.description_ar : project.description_en}
                </p>

                {/* Tech stack */}
                <div className={cn('flex flex-wrap gap-1.5 mb-5', isAr && 'justify-end')}>
                  {project.tech_stack?.slice(0, 4).map((tech) => (
                    <span
                      key={tech}
                      className="tech-badge"
                      style={{ borderColor: `${getTechColor(tech)}40`, color: getTechColor(tech) }}
                    >
                      {tech}
                    </span>
                  ))}
                  {project.tech_stack?.length > 4 && (
                    <span className="tech-badge text-text-muted">+{project.tech_stack.length - 4}</span>
                  )}
                </div>

                {/* Links */}
                <div className={cn('flex gap-3', isAr && 'flex-row-reverse')}>
                  {project.github_url && (
                    <a
                      href={project.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-xs text-text-muted hover:text-neon-cyan transition-colors font-mono"
                    >
                      <Github size={14} />
                      <span>{t.projects.viewCode}</span>
                    </a>
                  )}
                  {project.live_url && (
                    <a
                      href={project.live_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-xs text-text-muted hover:text-neon-green transition-colors font-mono"
                    >
                      <ExternalLink size={14} />
                      <span>{t.projects.liveDemo}</span>
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
