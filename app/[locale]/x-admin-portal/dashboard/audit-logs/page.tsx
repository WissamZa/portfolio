'use client';

import { useState, useEffect, useCallback } from 'react';
import {
    Search,
    ChevronDown,
    ChevronRight,
    RotateCcw,
    Loader2,
    CheckCircle,
    AlertTriangle,
    Filter,
    RefreshCw,
    Clock,
} from 'lucide-react';
import { cn } from '@/lib/utils';

/* ──────────────────────────────────────────────────────────
   Types
────────────────────────────────────────────────────────── */
interface AuditLog {
    id: string;
    user_email: string;
    action: string;
    table_name: string;
    record_id: string;
    details: Record<string, any> | null;
    created_at: string;
}

type RollbackStatus = 'idle' | 'loading' | 'success' | 'error';

/* ──────────────────────────────────────────────────────────
   Action pill
────────────────────────────────────────────────────────── */
function ActionBadge({ action }: { action: string }) {
    const cfg: Record<string, { color: string; bg: string }> = {
        CREATE: { color: 'var(--neon-green)', bg: 'rgba(0,255,136,0.08)' },
        UPDATE: { color: 'var(--neon-cyan)', bg: 'rgba(0,245,255,0.08)' },
        DELETE: { color: '#f87171', bg: 'rgba(248,113,113,0.08)' },
        LOGIN: { color: 'var(--neon-purple)', bg: 'rgba(179,71,255,0.08)' },
        ROLLBACK: { color: 'var(--neon-orange)', bg: 'rgba(255,107,53,0.08)' },
    };
    const { color, bg } = cfg[action] ?? { color: 'rgba(255,255,255,0.4)', bg: 'transparent' };
    return (
        <span
            className="px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-widest border"
            style={{ color, background: bg, borderColor: `${color}33` }}
        >
            {action}
        </span>
    );
}

/* ──────────────────────────────────────────────────────────
   JSON viewer
────────────────────────────────────────────────────────── */
function JsonViewer({ data }: { data: any }) {
    if (data === null || data === undefined) {
        return <span className="text-text-muted/40 italic">null</span>;
    }
    return (
        <pre className="font-mono text-[10px] text-neon-cyan/80 leading-relaxed whitespace-pre-wrap break-all">
            {JSON.stringify(data, null, 2)}
        </pre>
    );
}

/* ──────────────────────────────────────────────────────────
   Single row
────────────────────────────────────────────────────────── */
function LogRow({ log, onRollback }: { log: AuditLog; onRollback: (id: string) => Promise<void> }) {
    const [expanded, setExpanded] = useState(false);
    const [rbStatus, setRbStatus] = useState<RollbackStatus>('idle');
    const [rbMsg, setRbMsg] = useState('');

    // Is this entry already rolled back?
    const rolledBackAt: string | null = log.details?.rolled_back_at ?? null;
    // Can this entry be rolled back?
    const canRollback = !rolledBackAt && ['CREATE', 'UPDATE', 'DELETE'].includes(log.action);

    const handleRollback = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (rbStatus === 'loading') return;

        const confirmed = window.confirm(
            `Rollback this ${log.action} on "${log.table_name}"?\n\nThis will undo the change and cannot be undone again.`
        );
        if (!confirmed) return;

        setRbStatus('loading');
        try {
            await onRollback(log.id);
            setRbStatus('success');
            setRbMsg('Rolled back');
        } catch (err: any) {
            setRbStatus('error');
            setRbMsg(err.message ?? 'Rollback failed');
            setTimeout(() => setRbStatus('idle'), 4000);
        }
    };

    return (
        <>
            {/* Main row */}
            <tr
                onClick={() => setExpanded(v => !v)}
                className={cn(
                    'cursor-pointer transition-colors group border-b border-glass-border/30',
                    expanded ? 'bg-neon-cyan/5' : 'hover:bg-white/3',
                    rolledBackAt && 'opacity-60'
                )}
            >
                {/* Expand icon */}
                <td className="pl-4 pr-2 py-4 w-6">
                    {expanded
                        ? <ChevronDown size={12} className="text-neon-cyan/60" />
                        : <ChevronRight size={12} className="text-text-muted/30 group-hover:text-neon-cyan/40" />}
                </td>

                {/* Timestamp */}
                <td className="px-4 py-4 whitespace-nowrap">
                    <span className="font-mono text-[10px] text-text-muted">
                        {new Date(log.created_at).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                    </span>
                </td>

                {/* User */}
                <td className="px-4 py-4 whitespace-nowrap max-w-[180px]">
                    <span className="font-mono text-[10px] text-text-primary bg-void-3 border border-glass-border px-2 py-1 truncate block">
                        {log.user_email}
                    </span>
                </td>

                {/* Action */}
                <td className="px-4 py-4 whitespace-nowrap">
                    <ActionBadge action={log.action} />
                </td>

                {/* Target */}
                <td className="px-4 py-4 whitespace-nowrap">
                    <span className="font-mono text-[10px] text-text-primary uppercase tracking-tighter">
                        {log.table_name || 'SYSTEM'}
                    </span>
                    {log.record_id && (
                        <span className="text-text-muted/30 font-mono text-[9px] ml-2">
                            #{log.record_id.slice(0, 8)}
                        </span>
                    )}
                </td>

                {/* Rollback / Status column */}
                <td className="px-4 py-4 whitespace-nowrap text-right" onClick={e => e.stopPropagation()}>
                    {rolledBackAt ? (
                        /* Rolled-back stamp */
                        <div className="flex items-center justify-end gap-1.5">
                            <RotateCcw size={10} className="text-neon-orange/60" />
                            <span className="font-mono text-[9px] text-neon-orange/80 uppercase tracking-widest">
                                Rolled back
                            </span>
                        </div>
                    ) : canRollback ? (
                        /* Rollback button */
                        <button
                            onClick={handleRollback}
                            disabled={rbStatus === 'loading' || rbStatus === 'success'}
                            className={cn(
                                'flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-widest px-3 py-1.5 border transition-all duration-200',
                                rbStatus === 'success'
                                    ? 'border-neon-green/30 text-neon-green cursor-default'
                                    : rbStatus === 'error'
                                        ? 'border-red-400/30 text-red-400 cursor-default'
                                        : 'border-glass-border text-text-muted hover:border-neon-orange/50 hover:text-neon-orange hover:bg-neon-orange/5'
                            )}
                        >
                            {rbStatus === 'loading' && <Loader2 size={10} className="animate-spin" />}
                            {rbStatus === 'success' && <CheckCircle size={10} />}
                            {rbStatus === 'error' && <AlertTriangle size={10} />}
                            {rbStatus === 'idle' && <RotateCcw size={10} />}
                            {rbStatus === 'idle' ? 'Rollback' : rbMsg || 'Rollback'}
                        </button>
                    ) : null}
                </td>
            </tr>

            {/* Expanded detail row */}
            {expanded && (
                <tr className="bg-void-3 border-b border-glass-border/30">
                    <td colSpan={6} className="px-6 py-0">
                        <div
                            className="overflow-hidden transition-all duration-300"
                            style={{ maxHeight: expanded ? '600px' : '0' }}
                        >
                            <div className="py-5 space-y-4">

                                {/* Rolled-back banner */}
                                {rolledBackAt && (
                                    <div className="flex items-center gap-3 p-3 border border-neon-orange/20 bg-neon-orange/5">
                                        <RotateCcw size={13} className="text-neon-orange shrink-0" />
                                        <div>
                                            <p className="font-mono text-xs text-neon-orange font-bold uppercase tracking-widest">
                                                This entry has been rolled back
                                            </p>
                                            <p className="font-mono text-[10px] text-neon-orange/70 mt-0.5">
                                                Reversed on{' '}
                                                {new Date(rolledBackAt).toLocaleString([], { dateStyle: 'long', timeStyle: 'medium' })}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {/* Detail grid */}
                                <div className="grid grid-cols-2 gap-4">
                                    {/* Left: full record_id */}
                                    <div className="space-y-1">
                                        <p className="font-mono text-[10px] text-text-muted/50 uppercase tracking-widest">
                                            Record ID
                                        </p>
                                        <p className="font-mono text-[11px] text-text-primary break-all">
                                            {log.record_id || '—'}
                                        </p>
                                    </div>

                                    {/* Right: time */}
                                    <div className="space-y-1">
                                        <p className="font-mono text-[10px] text-text-muted/50 uppercase tracking-widest">
                                            Timestamp
                                        </p>
                                        <p className="font-mono text-[11px] text-text-primary">
                                            {new Date(log.created_at).toLocaleString([], { dateStyle: 'long', timeStyle: 'long' })}
                                        </p>
                                    </div>
                                </div>

                                {/* Details JSON */}
                                <div className="space-y-2">
                                    <p className="font-mono text-[10px] text-text-muted/50 uppercase tracking-widest">
                                        Details payload
                                    </p>
                                    <div className="bg-void-2 border border-glass-border p-4 max-h-72 overflow-y-auto">
                                        <JsonViewer data={log.details} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </td>
                </tr>
            )}
        </>
    );
}

/* ──────────────────────────────────────────────────────────
   Page
────────────────────────────────────────────────────────── */
export default function AuditLogsPage() {
    const [logs, setLogs] = useState<AuditLog[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [search, setSearch] = useState('');
    const [actionFilter, setActionFilter] = useState<string>('ALL');

    const fetchLogs = useCallback(async (silent = false) => {
        if (!silent) setLoading(true);
        else setRefreshing(true);
        try {
            const res = await fetch('/api/admin/data?table=audit_logs', { credentials: 'include' });
            if (res.ok) {
                const data = await res.json();
                setLogs(data.data || []);
            }
        } catch (err) {
            console.error('Error fetching logs:', err);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useEffect(() => { fetchLogs(); }, [fetchLogs]);

    /* Rollback handler */
    const handleRollback = async (logId: string) => {
        const res = await fetch('/api/admin/rollback', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ audit_log_id: logId }),
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error ?? 'Rollback failed');

        // Optimistically stamp the entry in local state
        setLogs(prev =>
            prev.map(l =>
                l.id === logId
                    ? { ...l, details: { ...(l.details || {}), rolled_back_at: json.rolled_back_at } }
                    : l
            )
        );

        // Refresh in background to pull in the new ROLLBACK log entry
        setTimeout(() => fetchLogs(true), 800);
    };

    /* Unique actions for filter pill */
    const uniqueActions = ['ALL', ...Array.from(new Set(logs.map(l => l.action)))];

    const filteredLogs = logs.filter(log => {
        const matchesSearch =
            log.user_email.toLowerCase().includes(search.toLowerCase()) ||
            log.action.toLowerCase().includes(search.toLowerCase()) ||
            (log.table_name ?? '').toLowerCase().includes(search.toLowerCase()) ||
            (log.record_id ?? '').toLowerCase().includes(search.toLowerCase());
        const matchesAction = actionFilter === 'ALL' || log.action === actionFilter;
        return matchesSearch && matchesAction;
    });

    const rolledBackCount = logs.filter(l => l.details?.rolled_back_at).length;

    return (
        <div className="p-8 space-y-6">

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold font-display text-text-primary">
                        Audit Logs<span className="text-neon-cyan">.</span>
                    </h1>
                    <p className="font-mono text-xs text-text-muted mt-1">
                        System activity · security monitoring · change history
                    </p>
                </div>

                {/* Stat chips */}
                <div className="flex items-center gap-3 shrink-0">
                    <div className="glass-card px-4 py-2 flex items-center gap-2 border-glass-border">
                        <span className="font-mono text-[10px] text-text-muted uppercase tracking-widest">Entries</span>
                        <span className="font-mono text-sm text-neon-cyan font-bold">{logs.length}</span>
                    </div>
                    {rolledBackCount > 0 && (
                        <div className="glass-card px-4 py-2 flex items-center gap-2 border-neon-orange/20">
                            <RotateCcw size={11} className="text-neon-orange" />
                            <span className="font-mono text-[10px] text-neon-orange uppercase tracking-widest">
                                {rolledBackCount} rolled back
                            </span>
                        </div>
                    )}
                </div>
            </div>

            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-3">
                {/* Search */}
                <div className="relative flex-1 min-w-[200px] max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={13} />
                    <input
                        type="text"
                        placeholder="Search user, action, table…"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="w-full bg-void-2 border border-glass-border pl-9 pr-4 py-2 font-mono text-xs
              outline-none focus:border-neon-cyan/50 text-text-primary placeholder:text-text-muted/40
              transition-colors"
                    />
                </div>

                {/* Action filter pills */}
                <div className="flex items-center gap-1.5 flex-wrap">
                    {uniqueActions.map(a => (
                        <button
                            key={a}
                            onClick={() => setActionFilter(a)}
                            className={cn(
                                'font-mono text-[9px] uppercase tracking-widest px-3 py-1.5 border transition-all duration-200',
                                actionFilter === a
                                    ? 'border-neon-cyan/60 text-neon-cyan bg-neon-cyan/10'
                                    : 'border-glass-border text-text-muted hover:border-neon-cyan/30 hover:text-text-primary'
                            )}
                        >
                            {a}
                        </button>
                    ))}
                </div>

                {/* Refresh */}
                <button
                    onClick={() => fetchLogs(true)}
                    disabled={refreshing}
                    className="ml-auto flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest
            px-3 py-2 border border-glass-border text-text-muted hover:border-neon-cyan/40
            hover:text-neon-cyan transition-all duration-200 disabled:opacity-50"
                >
                    <RefreshCw size={11} className={refreshing ? 'animate-spin' : ''} />
                    Refresh
                </button>
            </div>

            {/* Table */}
            <div className="glass-card bg-void-2 border-glass-border overflow-hidden animate-in fade-in duration-700">
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="border-b border-glass-border bg-void-3">
                                <th className="w-6 pl-4 pr-2" />
                                <th className="px-4 py-4 text-left font-mono text-[10px] text-neon-cyan font-bold uppercase tracking-[0.2em]">
                                    Timestamp
                                </th>
                                <th className="px-4 py-4 text-left font-mono text-[10px] text-neon-cyan font-bold uppercase tracking-[0.2em]">
                                    User
                                </th>
                                <th className="px-4 py-4 text-left font-mono text-[10px] text-neon-cyan font-bold uppercase tracking-[0.2em]">
                                    Action
                                </th>
                                <th className="px-4 py-4 text-left font-mono text-[10px] text-neon-cyan font-bold uppercase tracking-[0.2em]">
                                    Target
                                </th>
                                <th className="px-4 py-4 text-right font-mono text-[10px] text-neon-cyan font-bold uppercase tracking-[0.2em]">
                                    Rollback
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-16 text-center">
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="spinner h-6 w-6" />
                                            <p className="font-mono text-[10px] text-text-muted uppercase tracking-widest animate-pulse">
                                                Reading security registry…
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredLogs.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-16 text-center">
                                        <p className="font-mono text-[10px] text-text-muted uppercase tracking-widest italic">
                                            No entries match your filter
                                        </p>
                                    </td>
                                </tr>
                            ) : (
                                filteredLogs.map(log => (
                                    <LogRow key={log.id} log={log} onRollback={handleRollback} />
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Footer count */}
                {!loading && filteredLogs.length > 0 && (
                    <div className="px-6 py-3 border-t border-glass-border bg-void-3 flex items-center justify-between">
                        <span className="font-mono text-[10px] text-text-muted/50 uppercase tracking-widest">
                            Showing {filteredLogs.length} of {logs.length} entries
                        </span>
                        <div className="flex items-center gap-1.5">
                            <Clock size={10} className="text-text-muted/40" />
                            <span className="font-mono text-[10px] text-text-muted/40">Click any row to expand details</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
