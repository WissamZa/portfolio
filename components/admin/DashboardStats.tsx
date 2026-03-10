'use client';

import Link from 'next/link';

interface Stat {
    label: string;
    value: number | string;
    color: string;
    href: string;
}

export default function DashboardStats({ stats, locale }: { stats: Record<string, number>, locale: string }) {
    const statItems: Stat[] = [
        { label: 'Projects', value: stats.projects, color: 'neon-cyan', href: `/${locale}/x-admin-portal/dashboard/projects` },
        { label: 'Skills', value: stats.skills, color: 'neon-purple', href: `/${locale}/x-admin-portal/dashboard/skills` },
        { label: 'Experience', value: stats.experience, color: 'neon-green', href: `/${locale}/x-admin-portal/dashboard/experience` },
        { label: 'Messages', value: stats.contact_messages, color: 'neon-orange', href: `/${locale}/x-admin-portal/dashboard/messages` },
    ];

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {statItems.map((stat) => (
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
    );
}
