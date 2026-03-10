'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard, FolderCode, Cpu, Briefcase, GraduationCap,
  MessageSquare, LogOut, Menu, X, Award, User
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUser } from '@stackframe/stack';

export default function AdminDashboard() {
  const [stats, setStats] = useState<Record<string, number>>({});
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;

  const navItems = [
    { href: `/${locale}/x-admin-portal/dashboard`, icon: LayoutDashboard, label: 'Dashboard' },
    { href: `/${locale}/x-admin-portal/dashboard/profile`, icon: User, label: 'Profile' },
    { href: `/${locale}/x-admin-portal/dashboard/projects`, icon: FolderCode, label: 'Projects' },
    { href: `/${locale}/x-admin-portal/dashboard/skills`, icon: Cpu, label: 'Skills' },
    { href: `/${locale}/x-admin-portal/dashboard/experience`, icon: Briefcase, label: 'Experience' },
    { href: `/${locale}/x-admin-portal/dashboard/education`, icon: GraduationCap, label: 'Education' },
    { href: `/${locale}/x-admin-portal/dashboard/certifications`, icon: Award, label: 'Certifications' },
    { href: `/${locale}/x-admin-portal/dashboard/messages`, icon: MessageSquare, label: 'Messages' },
  ];

  useEffect(() => {
    // Load stats
    async function loadStats() {
      const tables = ['projects', 'skills', 'experience', 'education', 'contact_messages'];
      const results = await Promise.all(
        tables.map(async (table) => {
          const res = await fetch(`/api/admin/data?table=${table}`, { credentials: 'include' });
          if (!res.ok) {
            if (res.status === 401) router.push(`/${locale}/x-admin-portal`);
            return [table, 0];
          }
          const { data } = await res.json();
          return [table, data?.length || 0];
        })
      );
      setStats(Object.fromEntries(results));
    }
    loadStats();
  }, [locale]);

  const user = useUser();

  useEffect(() => {
    if (!user) {
      router.push(`/${locale}/x-admin-portal`);
    }
  }, [user, locale, router]);

  const handleLogout = async () => {
    await user?.signOut();
  };

  return (
    <div className="flex h-screen bg-void">
      {/* Sidebar */}
      <aside className={cn(
        'flex flex-col border-r border-glass-border transition-all duration-300 admin-sidebar',
        sidebarOpen ? 'w-56' : 'w-14'
      )}>
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 py-4 border-b border-glass-border">
          <div className="w-8 h-8 border border-neon-cyan/50 flex items-center justify-center shrink-0">
            <span className="font-mono text-neon-cyan text-xs font-bold">CS</span>
          </div>
          {sidebarOpen && <span className="font-mono text-sm text-neon-cyan">Admin CMS</span>}
        </div>

        {/* Toggle */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="absolute top-4 -right-3 w-6 h-6 bg-void-2 border border-glass-border flex items-center justify-center text-text-muted hover:text-neon-cyan z-10"
        >
          {sidebarOpen ? <X size={12} /> : <Menu size={12} />}
        </button>

        {/* Nav */}
        <nav className="flex-1 py-4 space-y-1 overflow-hidden">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-4 py-2.5 text-text-muted hover:text-neon-cyan hover:bg-neon-cyan/5 transition-all',
                'font-mono text-xs group relative',
                !sidebarOpen && 'justify-center px-0'
              )}
            >
              <item.icon size={16} className="shrink-0" />
              {sidebarOpen && <span>{item.label}</span>}
              {!sidebarOpen && (
                <div className="absolute left-14 bg-void-2 border border-glass-border px-2 py-1 text-xs text-text-primary opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
                  {item.label}
                </div>
              )}
            </Link>
          ))}
        </nav>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className={cn(
            'flex items-center gap-3 px-4 py-3 text-text-muted hover:text-red-400 transition-colors border-t border-glass-border font-mono text-xs',
            !sidebarOpen && 'justify-center px-0'
          )}
        >
          <LogOut size={16} className="shrink-0" />
          {sidebarOpen && <span>Logout</span>}
        </button>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold font-display text-text-primary">
              Dashboard<span className="text-neon-cyan">.</span>
            </h1>
            <p className="font-mono text-xs text-text-muted mt-1">Portfolio content management system</p>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Projects', value: stats.projects, color: 'neon-cyan', href: `/${locale}/x-admin-portal/dashboard/projects` },
              { label: 'Skills', value: stats.skills, color: 'neon-purple', href: `/${locale}/x-admin-portal/dashboard/skills` },
              { label: 'Experience', value: stats.experience, color: 'neon-green', href: `/${locale}/x-admin-portal/dashboard/experience` },
              { label: 'Messages', value: stats.contact_messages, color: 'neon-orange', href: `/${locale}/x-admin-portal/dashboard/messages` },
            ].map((stat) => (
              <Link key={stat.label} href={stat.href}>
                <div className="glass-card p-5 hover:border-neon-cyan/20 transition-all group cursor-pointer">
                  <div className={`text-3xl font-bold font-mono text-${stat.color} mb-1`}>
                    {stat.value ?? '—'}
                  </div>
                  <div className="text-xs text-text-muted font-mono uppercase tracking-wider">
                    {stat.label}
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Quick links */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {navItems.slice(1).map((item) => (
              <Link key={item.href} href={item.href}>
                <div className="glass-card p-4 flex items-center gap-3 hover:border-neon-cyan/30 transition-all group cursor-pointer">
                  <div className="w-9 h-9 border border-glass-border flex items-center justify-center group-hover:border-neon-cyan/50 transition-colors shrink-0">
                    <item.icon size={16} className="text-text-muted group-hover:text-neon-cyan transition-colors" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-text-primary group-hover:text-neon-cyan transition-colors">
                      {item.label}
                    </div>
                    <div className="text-xs text-text-muted font-mono">Manage {item.label.toLowerCase()}</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
