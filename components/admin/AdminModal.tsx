'use client';

import { X } from 'lucide-react';
import { ReactNode } from 'react';

interface AdminModalProps {
    title: string;
    isOpen: boolean;
    onClose: () => void;
    children: ReactNode;
    footer?: ReactNode;
}

export function AdminModal({ title, isOpen, onClose, children, footer }: AdminModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-start justify-center overflow-auto py-8 px-4 animate-in fade-in duration-300">
            <div className="w-full max-w-2xl glass-card border border-neon-cyan/20 animate-in zoom-in-95 duration-300">
                <div className="flex items-center justify-between p-5 border-b border-glass-border">
                    <h2 className="font-mono text-neon-cyan">{title}</h2>
                    <button onClick={onClose} className="text-text-muted hover:text-text-primary transition-colors">
                        <X size={18} />
                    </button>
                </div>

                <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto custom-scrollbar">
                    {children}
                </div>

                {footer && (
                    <div className="flex justify-end gap-3 p-5 border-t border-glass-border">
                        {footer}
                    </div>
                )}
            </div>
        </div>
    );
}
