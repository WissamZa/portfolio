'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import DashboardStats from '@/components/admin/DashboardStats';
import DashboardQuickLinks from '@/components/admin/DashboardQuickLinks';

export default function AdminDashboard() {
  const [stats, setStats] = useState<Record<string, number>>({});
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;

  useEffect(() => {
    async function loadStats() {
      const tables = ['projects', 'skills', 'experience', 'education', 'contact_messages'];
      try {
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
      } catch (err) {
        console.error('Error loading stats:', err);
      }
    }
    loadStats();
  }, [locale, router]);

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold font-display text-text-primary">
          Dashboard<span className="text-neon-cyan">.</span>
        </h1>
        <p className="font-mono text-xs text-text-muted mt-1">Portfolio content management system</p>
      </div>

      <DashboardStats stats={stats} locale={locale} />

      <h2 className="text-lg font-bold font-display text-text-primary mb-4">Quick Links</h2>
      <DashboardQuickLinks locale={locale} />
    </div>
  );
}
