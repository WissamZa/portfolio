'use client';

import type { Skill } from '@/lib/database.types';

const CATEGORIES = ['languages', 'frameworks', 'databases', 'tools', 'cloud', 'other'] as const;

interface SkillFormProps {
    editing: Partial<Skill>;
    setEditing: (item: Partial<Skill>) => void;
}

export function SkillForm({ editing, setEditing }: SkillFormProps) {
    return (
        <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-mono text-text-muted mb-1">Name (EN)</label>
                    <input
                        className="input-neon"
                        value={editing.name_en || ''}
                        onChange={e => setEditing({ ...editing, name_en: e.target.value })}
                    />
                </div>
                <div>
                    <label className="block text-xs font-mono text-text-muted mb-1">Name (AR) اسم</label>
                    <input
                        className="input-neon text-right font-arabic"
                        dir="rtl"
                        value={editing.name_ar || ''}
                        onChange={e => setEditing({ ...editing, name_ar: e.target.value })}
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-mono text-text-muted mb-1">Category</label>
                    <select
                        className="input-neon"
                        value={editing.category}
                        onChange={e => setEditing({ ...editing, category: e.target.value as Skill['category'] })}
                    >
                        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-xs font-mono text-text-muted mb-1">Proficiency ({editing.proficiency}%)</label>
                    <input
                        type="range"
                        min="0"
                        max="100"
                        className="w-full accent-neon-cyan mt-2"
                        value={editing.proficiency || 80}
                        onChange={e => setEditing({ ...editing, proficiency: +e.target.value })}
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-mono text-text-muted mb-1">Order Index</label>
                    <input
                        type="number"
                        className="input-neon w-32"
                        value={editing.order_index || 0}
                        onChange={e => setEditing({ ...editing, order_index: +e.target.value })}
                    />
                </div>
            </div>
        </div>
    );
}
