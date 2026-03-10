'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import AdminNav from '@/components/admin/AdminNav';
import { ShieldCheck, Search, Filter, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AuditLog {
    id: string;
    user_email: string;
    action: string;
    table_name: string;
    record_id: string;
    details: any;
    created_at: string;
}

export default function AuditLogsPage() {
    const [logs, setLogs] = useState<AuditLog[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const params = useParams();
    const locale = params.locale as string;

    useEffect(() => {
        fetchLogs();
    }, []);

    const fetchLogs = async () => {
        try {
            const res = await fetch('/api/admin/data?table=audit_logs', { credentials: 'include' });
            if (res.ok) {
                const data = await res.json();
                setLogs(data.data || []);
            }
        } catch (error) {
            console.error('Error fetching logs:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredLogs = logs.filter(log =>
        log.user_email.toLowerCase().includes(search.toLowerCase()) ||
        log.action.toLowerCase().includes(search.toLowerCase()) ||
        (log.table_name && log.table_name.toLowerCase().includes(search.toLowerCase()))
    );

    return (
        <div className="flex min-h-screen bg-void">
            <AdminNav active="audit-logs" />

            <main className="flex-1 p-8 overflow-y-auto">
                <header className="mb-8 flex justify-between items-end">
                    <div>
                        <h1 className="text-2xl font-display text-text-primary tracking-wider uppercase">Audit Security Logs</h1>
                        <p className="text-text-muted mt-1 font-mono text-sm">System activity tracking and security monitoring</p>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={14} />
                            <input
                                type="text"
                                placeholder="Search logs..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="bg-void-2 border border-glass-border pl-10 pr-4 py-2 font-mono text-sm outline-none focus:border-neon-cyan/50 text-text-primary min-w-64"
                            />
                        </div>
                        <button className="btn-neon-outline px-4 py-2 flex items-center gap-2">
                            <Filter size={14} />
                            <span className="font-mono text-xs">Filter</span>
                        </button>
                    </div>
                </header>

                <div className="glass-card bg-void-2 border-glass-border overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="border-b border-glass-border bg-void-3">
                                    <th className="px-6 py-4 text-left font-mono text-xs text-neon-cyan font-bold uppercase tracking-wider">Timestamp</th>
                                    <th className="px-6 py-4 text-left font-mono text-xs text-neon-cyan font-bold uppercase tracking-wider">User</th>
                                    <th className="px-6 py-4 text-left font-mono text-xs text-neon-cyan font-bold uppercase tracking-wider">Action</th>
                                    <th className="px-6 py-4 text-left font-mono text-xs text-neon-cyan font-bold uppercase tracking-wider">Target</th>
                                    <th className="px-6 py-4 text-left font-mono text-xs text-neon-cyan font-bold uppercase tracking-wider">Details</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-glass-border/30">
                                {loading ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center text-text-muted font-mono text-sm">
                                            <div className="flex flex-col items-center gap-2">
                                                <div className="w-8 h-8 border-2 border-neon-cyan border-t-transparent animate-spin rounded-full" />
                                                Scanning security logs...
                                            </div>
                                        </td>
                                    </tr>
                                ) : filteredLogs.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center text-text-muted font-mono text-sm uppercase italic">
                                            No logs found in registry
                                        </td>
                                    </tr>
                                ) : (
                                    filteredLogs.map((log) => (
                                        <tr key={log.id} className="hover:bg-white/5 transition-colors group">
                                            <td className="px-6 py-4 whitespace-nowrap font-mono text-xs text-text-muted">
                                                {new Date(log.created_at).toLocaleString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="px-2 py-1 bg-white/5 border border-white/10 rounded font-mono text-[10px] text-text-primary">
                                                    {log.user_email}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={cn(
                                                    "px-2 py-0.5 rounded-sm font-mono text-[10px] font-bold uppercase",
                                                    log.action === 'CREATE' ? "bg-neon-green/10 text-neon-green border border-neon-green/20" :
                                                        log.action === 'UPDATE' ? "bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/20" :
                                                            log.action === 'DELETE' ? "bg-red-500/10 text-red-500 border border-red-500/20" :
                                                                "bg-white/10 text-text-muted"
                                                )}>
                                                    {log.action}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap font-mono text-xs">
                                                <span className="text-text-primary uppercase tracking-tighter">{log.table_name || 'SYSTEM'}</span>
                                                <span className="text-text-muted/50 ml-2 text-[10px]">{log.record_id?.slice(0, 8) || 'GLOBAL'}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="max-w-xs truncate font-mono text-[10px] text-text-muted group-hover:text-text-primary transition-colors">
                                                    {JSON.stringify(log.details)}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
}
