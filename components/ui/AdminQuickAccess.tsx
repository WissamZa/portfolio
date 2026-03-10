'use client';

import { useUser } from '@stackframe/stack';
import Link from 'next/link';
import { Shield } from 'lucide-react';

export default function AdminQuickAccess({ locale }: { locale: string }) {
    const user = useUser();

    if (!user) return null;

    return (
        <div className="fixed bottom-6 right-6 z-50 group animate-in slide-in-from-bottom-4 duration-500">
            <Link
                href={`/${locale}/x-admin-portal/dashboard`}
                className="flex items-center gap-3 bg-neon-cyan/10 hover:bg-neon-cyan/20 border border-neon-cyan/30 hover:border-neon-cyan p-1 pl-4 rounded-full transition-all duration-300 group-hover:shadow-[0_0_20px_rgba(0,245,255,0.2)]"
            >
                <div className="flex flex-col items-end">
                    <span className="font-mono text-[10px] text-neon-cyan uppercase tracking-wider leading-none">System Admin</span>
                    <span className="font-display text-xs text-text-primary tracking-tight font-medium">Dashboard</span>
                </div>
                <div className="w-9 h-9 bg-neon-cyan text-void flex items-center justify-center rounded-full shadow-lg group-hover:scale-110 transition-transform">
                    <Shield size={18} />
                </div>
            </Link>
        </div>
    );
}
