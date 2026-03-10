'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter, usePathname } from 'next/navigation';
import { LogOut, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUser } from '@stackframe/stack';

import { ADMIN_NAV_ITEMS } from '@/lib/admin-config';

export default function AdminSidebar() {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const router = useRouter();
    const params = useParams();
    const pathname = usePathname();
    const locale = params.locale as string;
    const user = useUser();

    const navItems = ADMIN_NAV_ITEMS.map(item => ({
        ...item,
        href: `/${locale}/x-admin-portal${item.href}`
    }));

    const handleLogout = async () => {
        await user?.signOut();
        router.push(`/${locale}/x-admin-portal`);
    };

    const isActive = (href: string) => {
        if (href.endsWith('/dashboard')) return pathname === href;
        return pathname.startsWith(href);
    };

    return (
        <aside className={cn(
            'flex flex-col border-r border-glass-border transition-all duration-300 admin-sidebar h-screen relative shrink-0',
            sidebarOpen ? 'w-56' : 'w-14'
        )}>
            {/* Logo */}
            <div className="flex items-center gap-3 px-4 py-4 border-b border-glass-border min-h-[64px]">
                <div className="w-8 h-8 border border-neon-cyan/50 flex items-center justify-center shrink-0">
                    <span className="font-mono text-neon-cyan text-xs font-bold">CS</span>
                </div>
                {sidebarOpen && <span className="font-mono text-sm text-neon-cyan">Admin CMS</span>}
            </div>

            {/* Toggle */}
            <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="absolute top-4 -right-3 w-6 h-6 bg-void-2 border border-glass-border flex items-center justify-center text-text-muted hover:text-neon-cyan z-20"
            >
                {sidebarOpen ? <X size={12} /> : <Menu size={12} />}
            </button>

            {/* Nav */}
            <nav className="flex-1 py-4 space-y-1 overflow-y-auto overflow-x-hidden">
                {navItems.map((item) => {
                    const active = isActive(item.href);
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                'flex items-center gap-3 px-4 py-2.5 transition-all group relative',
                                'font-mono text-xs',
                                active
                                    ? 'text-neon-cyan bg-neon-cyan/5 border-r-2 border-neon-cyan'
                                    : 'text-text-muted hover:text-neon-cyan hover:bg-neon-cyan/5',
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
                    );
                })}
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
    );
}
