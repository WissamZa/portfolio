'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import type { Experience } from '@/lib/database.types';

interface ExperienceFormProps {
    editing: Partial<Experience>;
    setEditing: (item: Partial<Experience>) => void;
}

export function ExperienceForm({ editing, setEditing }: ExperienceFormProps) {
    const [respEnInput, setRespEnInput] = useState('');
    const [respArInput, setRespArInput] = useState('');

    const addResp = (lang: 'en' | 'ar') => {
        if (lang === 'en' && respEnInput.trim()) {
            setEditing({
                ...editing,
                responsibilities_en: [...(editing.responsibilities_en || []), respEnInput.trim()]
            });
            setRespEnInput('');
        }
        if (lang === 'ar' && respArInput.trim()) {
            setEditing({
                ...editing,
                responsibilities_ar: [...(editing.responsibilities_ar || []), respArInput.trim()]
            });
            setRespArInput('');
        }
    };

    const removeResp = (lang: 'en' | 'ar', index: number) => {
        if (lang === 'en') {
            setEditing({
                ...editing,
                responsibilities_en: editing.responsibilities_en?.filter((_, i) => i !== index)
            });
        } else {
            setEditing({
                ...editing,
                responsibilities_ar: editing.responsibilities_ar?.filter((_, i) => i !== index)
            });
        }
    };

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-mono text-text-muted mb-1">Role (EN)</label>
                    <input
                        className="input-neon"
                        value={editing.role_en || ''}
                        onChange={e => setEditing({ ...editing, role_en: e.target.value })}
                    />
                </div>
                <div>
                    <label className="block text-xs font-mono text-text-muted mb-1">Role (AR) الدور</label>
                    <input
                        className="input-neon text-right font-arabic"
                        dir="rtl"
                        value={editing.role_ar || ''}
                        onChange={e => setEditing({ ...editing, role_ar: e.target.value })}
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-mono text-text-muted mb-1">Company (EN)</label>
                    <input
                        className="input-neon"
                        value={editing.company_en || ''}
                        onChange={e => setEditing({ ...editing, company_en: e.target.value })}
                    />
                </div>
                <div>
                    <label className="block text-xs font-mono text-text-muted mb-1">Company (AR) الشركة</label>
                    <input
                        className="input-neon text-right font-arabic"
                        dir="rtl"
                        value={editing.company_ar || ''}
                        onChange={e => setEditing({ ...editing, company_ar: e.target.value })}
                    />
                </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
                <div>
                    <label className="block text-xs font-mono text-text-muted mb-1">Start Date</label>
                    <input
                        type="date"
                        className="input-neon text-xs"
                        value={editing.start_date || ''}
                        onChange={e => setEditing({ ...editing, start_date: e.target.value })}
                    />
                </div>
                <div>
                    <label className="block text-xs font-mono text-text-muted mb-1">End Date</label>
                    <input
                        type="date"
                        className="input-neon text-xs"
                        value={editing.end_date || ''}
                        onChange={e => setEditing({ ...editing, end_date: e.target.value })}
                        disabled={editing.is_current}
                    />
                </div>
                <div className="flex items-end pb-3">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={editing.is_current || false}
                            onChange={e => setEditing({ ...editing, is_current: e.target.checked })}
                            className="accent-neon-cyan w-4 h-4"
                        />
                        <span className="text-xs font-mono text-text-muted">Current</span>
                    </label>
                </div>
            </div>

            {/* Responsibilities EN */}
            <div>
                <label className="block text-xs font-mono text-text-muted mb-1">Responsibilities (EN)</label>
                <div className="flex gap-2 mb-2">
                    <input
                        className="input-neon flex-1 text-sm font-mono"
                        value={respEnInput}
                        onChange={e => setRespEnInput(e.target.value)}
                        placeholder="Add responsibility..."
                        onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addResp('en'))}
                    />
                    <button onClick={() => addResp('en')} className="btn-neon px-3 text-xs uppercase tracking-tighter">Add</button>
                </div>
                <div className="space-y-1">
                    {editing.responsibilities_en?.map((r, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs text-text-muted bg-void-3 p-2 border border-glass-border">
                            <span className="text-neon-cyan select-none">▸</span>
                            <span className="flex-1">{r}</span>
                            <button onClick={() => removeResp('en', i)} className="hover:text-red-400 p-1">
                                <X size={12} />
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Responsibilities AR */}
            <div>
                <label className="block text-xs font-mono text-text-muted mb-1 text-right">Responsibilities (AR) المهام</label>
                <div className="flex gap-2 mb-2">
                    <input
                        className="input-neon flex-1 text-sm text-right font-arabic"
                        dir="rtl"
                        value={respArInput}
                        onChange={e => setRespArInput(e.target.value)}
                        placeholder="أضف مسؤولية..."
                        onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addResp('ar'))}
                    />
                    <button onClick={() => addResp('ar')} className="btn-neon px-3 text-xs uppercase tracking-tighter">Add</button>
                </div>
                <div className="space-y-1">
                    {editing.responsibilities_ar?.map((r, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs text-text-muted bg-void-3 p-2 border border-glass-border flex-row-reverse font-arabic">
                            <span className="text-neon-cyan select-none">▸</span>
                            <span className="flex-1 text-right">{r}</span>
                            <button onClick={() => removeResp('ar', i)} className="hover:text-red-400 p-1">
                                <X size={12} />
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-mono text-text-muted mb-1">Order Index</label>
                    <input
                        type="number"
                        className="input-neon w-24"
                        value={editing.order_index || 0}
                        onChange={e => setEditing({ ...editing, order_index: +e.target.value })}
                    />
                </div>
            </div>
        </div>
    );
}
