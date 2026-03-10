'use client';

import Link from 'next/link';
import { ADMIN_NAV_ITEMS } from '@/lib/admin-config';

interface DashboardQuickLinksProps {
  /** Current locale for URL generation */
  locale: string;
}

/**
 * Dashboard quick links component displaying navigation cards.
 * Filters out non-content navigation items (dashboard, audit-logs, settings).
 */
export default function DashboardQuickLinks({ locale }: DashboardQuickLinksProps): JSX.Element {
  const quickLinks = ADMIN_NAV_ITEMS.filter(
    (item) => !['dashboard', 'audit-logs', 'settings'].includes(item.key)
  ).map((item) => ({
    ...item,
    href: `/${locale}/x-admin-portal${item.href}`,
  }));

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {quickLinks.map((item) => (
        <Link key={item.href} href={item.href}>
          <div className="glass-card p-4 flex items-center gap-3 hover:border-neon-cyan/30 transition-all group cursor-pointer">
            <div className="w-9 h-9 border border-glass-border flex items-center justify-center group-hover:border-neon-cyan/50 transition-colors shrink-0">
              <item.icon
                size={16}
                className="text-text-muted group-hover:text-neon-cyan transition-colors"
              />
            </div>
            <div>
              <div className="text-sm font-medium text-text-primary group-hover:text-neon-cyan transition-colors">
                {item.label}
              </div>
              <div className="text-xs text-text-muted font-mono">
                Manage {item.label.toLowerCase()}
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
