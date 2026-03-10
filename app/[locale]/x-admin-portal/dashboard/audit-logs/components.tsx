import { useState } from 'react';
import { ChevronDown, ChevronRight, RotateCcw, Loader2, CheckCircle, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AuditLog, RollbackStatus } from './types';

export function ActionBadge({ action }: { action: string }) {
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

export function JsonViewer({ data }: { data: any }) {
    if (data === null || data === undefined) {
        return <span className="text-text-muted/40 italic">null</span>;
    }
    return (
        <pre className="font-mono text-[10px] text-neon-cyan/80 leading-relaxed whitespace-pre-wrap break-all">
            {JSON.stringify(data, null, 2)}
        </pre>
    );
}

export function LogRow({ log, onRollback }: { log: AuditLog; onRollback: (id: string) => Promise<void> }) {
    const [expanded, setExpanded] = useState(false);
    const [rbStatus, setRbStatus] = useState<RollbackStatus>('idle');
    const [rbMsg, setRbMsg] = useState('');

    const rolledBackAt: string | null = log.details?.rolled_back_at ?? null;
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
            <tr
                onClick={() => setExpanded(v => !v)}
                className={cn(
                    'cursor-pointer transition-colors group border-b border-glass-border/30',
                    expanded ? 'bg-neon-cyan/5' : 'hover:bg-white/3',
                    rolledBackAt && 'opacity-60'
                )}
            >
                <td className="pl-4 pr-2 py-4 w-6">
                    {expanded
                        ? <ChevronDown size={12} className="text-neon-cyan/60" />
                        : <ChevronRight size={12} className="text-text-muted/30 group-hover:text-neon-cyan/40" />}
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                    <span className="font-mono text-[10px] text-text-muted">
                        {new Date(log.created_at).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                    </span>
                </td>
                <td className="px-4 py-4 whitespace-nowrap max-w-[180px]">
                    <span className="font-mono text-[10px] text-text-primary bg-void-3 border border-glass-border px-2 py-1 truncate block">
                        {log.user_email}
                    </span>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                    <ActionBadge action={log.action} />
                </td>
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
                <td className="px-4 py-4 whitespace-nowrap text-right" onClick={e => e.stopPropagation()}>
                    {rolledBackAt ? (
                        <div className="flex items-center justify-end gap-1.5">
                            <RotateCcw size={10} className="text-neon-orange/60" />
                            <span className="font-mono text-[9px] text-neon-orange/80 uppercase tracking-widest">
                                Rolled back
                            </span>
                        </div>
                    ) : canRollback ? (
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
            {expanded && (
                <tr className="bg-void-3 border-b border-glass-border/30">
                    <td colSpan={6} className="px-6 py-0">
                        <div
                            className="overflow-hidden transition-all duration-300"
                            style={{ maxHeight: expanded ? '600px' : '0' }}
                        >
                            <div className="py-5 space-y-4">
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
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <p className="font-mono text-[10px] text-text-muted/50 uppercase tracking-widest">
                                            Record ID
                                        </p>
                                        <p className="font-mono text-[11px] text-text-primary break-all">
                                            {log.record_id || '—'}
                                        </p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="font-mono text-[10px] text-text-muted/50 uppercase tracking-widest">
                                            Timestamp
                                        </p>
                                        <p className="font-mono text-[11px] text-text-primary">
                                            {new Date(log.created_at).toLocaleString([], { dateStyle: 'long', timeStyle: 'long' })}
                                        </p>
                                    </div>
                                </div>
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
