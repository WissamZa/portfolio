'use client';

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  LayoutDashboard, FolderCode, Cpu, Briefcase, GraduationCap,
  MessageSquare, LogOut, Award, User
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function AdminNav({ active }: { active: string }) {
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;

  const navItems = [
    { href: `/${locale}/x-admin-portal/dashboard`, icon: LayoutDashboard, label: 'Dashboard', key: 'dashboard' },
    { href: `/${locale}/x-admin-portal/dashboard/profile`, icon: User, label: 'Profile', key: 'profile' },
    { href: `/${locale}/x-admin-portal/dashboard/projects`, icon: FolderCode, label: 'Projects', key: 'projects' },
    { href: `/${locale}/x-admin-portal/dashboard/skills`, icon: Cpu, label: 'Skills', key: 'skills' },
    { href: `/${locale}/x-admin-portal/dashboard/experience`, icon: Briefcase, label: 'Experience', key: 'experience' },
    { href: `/${locale}/x-admin-portal/dashboard/education`, icon: GraduationCap, label: 'Education', key: 'education' },
    { href: `/${locale}/x-admin-portal/dashboard/certifications`, icon: Award, label: 'Certifications', key: 'certifications' },
    { href: `/${locale}/x-admin-portal/dashboard/messages`, icon: MessageSquare, label: 'Messages', key: 'messages' },
  ];

  const handleLogout = async () => {
    await fetch('/api/admin/auth', { method: 'DELETE', credentials: 'include' });
    router.push(`/${locale}/x-admin-portal`);
  };

  return (
    <aside className="flex flex-col w-52 border-r border-glass-border admin-sidebar shrink-0">
      <div className="flex items-center gap-2 px-4 py-4 border-b border-glass-border">
        <div className="w-7 h-7 border border-neon-cyan/50 flex items-center justify-center">
          <span className="font-mono text-neon-cyan text-xs font-bold">CS</span>
        </div>
        <span className="font-mono text-xs text-neon-cyan">Admin CMS</span>
      </div>
      <nav className="flex-1 py-3 space-y-0.5 overflow-hidden">
        {navItems.map((item) => (
          <Link
            key={item.key}
            href={item.href}
            className={cn(
              'flex items-center gap-3 px-4 py-2.5 font-mono text-xs transition-all',
              active === item.key
                ? 'text-neon-cyan bg-neon-cyan/5 border-r-2 border-neon-cyan'
                : 'text-text-muted hover:text-neon-cyan hover:bg-neon-cyan/5'
            )}
          >
            <item.icon size={15} className="shrink-0" />
            {item.label}
          </Link>
        ))}
      </nav>
      <button
        onClick={handleLogout}
        className="flex items-center gap-3 px-4 py-3 text-text-muted hover:text-red-400 transition-colors border-t border-glass-border font-mono text-xs"
      >
        <LogOut size={15} />
        Logout
      </button>
    </aside>
  );
}
