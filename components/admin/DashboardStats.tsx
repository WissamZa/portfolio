'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';

/** Color variants for stat cards */
type StatColor = 'cyan' | 'purple' | 'green' | 'orange';

interface Stat {
  label: string;
  value: number | string;
  color: StatColor;
  href: string;
}

/** Color class mapping for Tailwind (static for proper purging) */
const COLOR_CLASSES: Record<StatColor, string> = {
  cyan: 'text-neon-cyan',
  purple: 'text-neon-purple',
  green: 'text-neon-green',
  orange: 'text-neon-orange',
};

/**
 * Dashboard statistics component displaying clickable stat cards.
 * Shows counts for projects, skills, experience, and messages.
 */
export default function DashboardStats({
  stats,
  locale,
}: {
  stats: Record<string, number>;
  locale: string;
}): JSX.Element {
  const statItems: Stat[] = [
    {
      label: 'Projects',
      value: stats.projects,
      color: 'cyan',
      href: `/${locale}/x-admin-portal/dashboard/projects`,
    },
    {
      label: 'Skills',
      value: stats.skills,
      color: 'purple',
      href: `/${locale}/x-admin-portal/dashboard/skills`,
    },
    {
      label: 'Experience',
      value: stats.experience,
      color: 'green',
      href: `/${locale}/x-admin-portal/dashboard/experience`,
    },
    {
      label: 'Messages',
      value: stats.contact_messages,
      color: 'orange',
      href: `/${locale}/x-admin-portal/dashboard/messages`,
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {statItems.map((stat) => (
        <Link key={stat.label} href={stat.href}>
          <div className="glass-card p-5 hover:border-neon-cyan/20 transition-all group cursor-pointer">
            <div className={cn('text-3xl font-bold font-mono mb-1', COLOR_CLASSES[stat.color])}>
              {stats[stat.label.toLowerCase()] ?? '—'}
            </div>
            <div className="text-xs text-text-muted font-mono uppercase tracking-wider">
              {stat.label}
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
