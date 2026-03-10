import { Loader2, CheckCircle, AlertTriangle } from 'lucide-react';
import React from 'react';

export type Status = 'idle' | 'loading' | 'success' | 'error';

export function StatusBadge({ status, msg }: { status: Status; msg?: string }) {
    if (status === 'idle') return null;
    const map: Record<Exclude<Status, 'idle'>, { icon: React.ReactNode; color: string }> = {
        loading: { icon: <Loader2 size={14} className="animate-spin" />, color: 'text-neon-cyan' },
        success: { icon: <CheckCircle size={14} />, color: 'text-neon-green' },
        error: { icon: <AlertTriangle size={14} />, color: 'text-red-400' },
    };
    const { icon, color } = map[status as Exclude<Status, 'idle'>];
    return (
        <span className={`flex items-center gap-1.5 font-mono text-xs ${color}`}>
            {icon} {msg}
        </span>
    );
}

export function Section({
    icon: Icon,
    title,
    accent = 'cyan',
    children,
}: {
    icon: React.ElementType;
    title: string;
    accent?: 'cyan' | 'purple' | 'green' | 'orange';
    children: React.ReactNode;
}) {
    const accentVars: Record<string, string> = {
        cyan: 'var(--neon-cyan)',
        purple: 'var(--neon-purple)',
        green: 'var(--neon-green)',
        orange: 'var(--neon-orange)',
    };
    const color = accentVars[accent];

    return (
        <div
            className="glass-card rounded-none overflow-hidden"
            style={{ borderColor: `color-mix(in srgb, ${color} 20%, transparent)` }}
        >
            <div
                className="flex items-center gap-3 px-6 py-4 border-b"
                style={{
                    background: `linear-gradient(90deg, color-mix(in srgb, ${color} 8%, transparent), transparent)`,
                    borderColor: `color-mix(in srgb, ${color} 20%, transparent)`,
                }}
            >
                <div
                    className="w-8 h-8 flex items-center justify-center border"
                    style={{ borderColor: `color-mix(in srgb, ${color} 40%, transparent)`, color }}
                >
                    <Icon size={15} />
                </div>
                <h2
                    className="font-mono text-sm font-bold tracking-widest uppercase"
                    style={{ color }}
                >
                    {title}
                </h2>
                <div className="flex-1 h-px ml-2" style={{ background: `linear-gradient(90deg, ${color}33, transparent)` }} />
            </div>
            <div className="p-6 space-y-5">{children}</div>
        </div>
    );
}

export function Field({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) {
    return (
        <div className="space-y-1.5">
            <label className="font-mono text-[11px] text-text-muted uppercase tracking-widest">{label}</label>
            {children}
            {hint && <p className="font-mono text-[10px] text-text-muted/60">{hint}</p>}
        </div>
    );
}

export function NeonInput(props: React.InputHTMLAttributes<HTMLInputElement> & { accent?: string }) {
    const { accent = 'var(--neon-cyan)', className = '', ...rest } = props;
    return (
        <input
            {...rest}
            className={`w-full bg-void-2 border border-glass-border text-text-primary font-mono text-sm px-4 py-2.5
        focus:outline-none transition-all duration-200 placeholder:text-text-muted/40 ${className}`}
            style={{
                // @ts-ignore
                '--tw-ring-color': accent,
            }}
            onFocus={e => {
                e.currentTarget.style.borderColor = accent;
                e.currentTarget.style.boxShadow = `0 0 0 1px ${accent}22, 0 0 16px ${accent}11`;
            }}
            onBlur={e => {
                e.currentTarget.style.borderColor = '';
                e.currentTarget.style.boxShadow = '';
            }}
        />
    );
}

export function DangerButton({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
    return (
        <button
            onClick={onClick}
            className="flex items-center gap-2 border border-red-500/30 text-red-400 font-mono text-xs px-4 py-2.5
        hover:bg-red-500/10 hover:border-red-500/60 transition-all duration-200 uppercase tracking-widest"
        >
            {children}
        </button>
    );
}

export function PrimaryButton({
    onClick,
    children,
    status,
    accent = 'cyan',
}: {
    onClick: () => void;
    children: React.ReactNode;
    status?: Status;
    accent?: 'cyan' | 'purple' | 'green';
}) {
    const accentVars: Record<string, string> = {
        cyan: 'var(--neon-cyan)',
        purple: 'var(--neon-purple)',
        green: 'var(--neon-green)',
    };
    const color = accentVars[accent];
    const disabled = status === 'loading';

    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className="flex items-center gap-2 font-mono text-xs px-5 py-2.5 uppercase tracking-widest
        transition-all duration-200 disabled:opacity-50"
            style={{
                border: `1px solid ${color}`,
                color,
                background: disabled ? `${color}10` : 'transparent',
            }}
            onMouseEnter={e => { if (!disabled) e.currentTarget.style.background = `${color}15`; }}
            onMouseLeave={e => { e.currentTarget.style.background = disabled ? `${color}10` : 'transparent'; }}
        >
            {status === 'loading' ? <Loader2 size={13} className="animate-spin" /> : null}
            {children}
        </button>
    );
}
