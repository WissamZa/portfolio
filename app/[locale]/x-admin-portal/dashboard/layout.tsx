'use client';

import AdminSidebar from '@/components/admin/AdminSidebar';
import { Toaster } from 'react-hot-toast';
import { useUser } from '@stackframe/stack';
import { useRouter, useParams } from 'next/navigation';
import { useEffect } from 'react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const user = useUser();
    const router = useRouter();
    const params = useParams();
    const locale = params.locale as string;

    useEffect(() => {
        if (user === null) {
            router.push(`/${locale}/x-admin-portal`);
        }
    }, [user, locale, router]);

    if (user === undefined) {
        return (
            <div className="flex flex-col h-screen bg-void items-center justify-center gap-4">
                <div className="cyber-spinner shadow-[0_0_15px_rgba(0,245,255,0.5)]" />
                <p className="font-mono text-xs text-text-muted animate-pulse">VERIFYING AUTHENTICATION...</p>
            </div>
        );
    }

    if (!user) return null;

    return (
        <div className="flex h-screen bg-void overflow-hidden">
            <AdminSidebar />
            <Toaster position="top-right" />
            <main className="flex-1 overflow-auto relative">
                {children}
            </main>
        </div>
    );
}
