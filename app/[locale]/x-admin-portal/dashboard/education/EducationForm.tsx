'use client';

import type { Education } from '@/lib/database.types';

interface EducationFormProps {
    editing: Partial<Education>;
    setEditing: (item: Partial<Education>) => void;
}

export function EducationForm({ editing, setEditing }: EducationFormProps) {
    return (
        <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-mono text-text-muted mb-1">Institution (EN)</label>
                    <input
                        className="input-neon text-sm"
                        value={editing.institution_en || ''}
                        onChange={e => setEditing({ ...editing, institution_en: e.target.value })}
                    />
                </div>
                <div>
                    <label className="block text-xs font-mono text-text-muted mb-1">Institution (AR) المؤسسة</label>
                    <input
                        className="input-neon text-right font-arabic text-sm"
                        dir="rtl"
                        value={editing.institution_ar || ''}
                        onChange={e => setEditing({ ...editing, institution_ar: e.target.value })}
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-mono text-text-muted mb-1">Degree (EN)</label>
                    <input
                        className="input-neon text-sm"
                        value={editing.degree_en || ''}
                        onChange={e => setEditing({ ...editing, degree_en: e.target.value })}
                    />
                </div>
                <div>
                    <label className="block text-xs font-mono text-text-muted mb-1">Degree (AR) الدرجة</label>
                    <input
                        className="input-neon text-right font-arabic text-sm"
                        dir="rtl"
                        value={editing.degree_ar || ''}
                        onChange={e => setEditing({ ...editing, degree_ar: e.target.value })}
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-mono text-text-muted mb-1">Field (EN)</label>
                    <input
                        className="input-neon text-sm"
                        value={editing.field_en || ''}
                        onChange={e => setEditing({ ...editing, field_en: e.target.value })}
                    />
                </div>
                <div>
                    <label className="block text-xs font-mono text-text-muted mb-1">Field (AR) التخصص</label>
                    <input
                        className="input-neon text-right font-arabic text-sm"
                        dir="rtl"
                        value={editing.field_ar || ''}
                        onChange={e => setEditing({ ...editing, field_ar: e.target.value })}
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

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-mono text-text-muted mb-1">GPA (optional)</label>
                    <input
                        className="input-neon w-40 text-sm"
                        value={editing.gpa || ''}
                        onChange={e => setEditing({ ...editing, gpa: e.target.value })}
                        placeholder="e.g. 3.8/4.0"
                    />
                </div>
                <div>
                    <label className="block text-xs font-mono text-text-muted mb-1">Order Index</label>
                    <input
                        type="number"
                        className="input-neon w-24 text-sm"
                        value={editing.order_index || 0}
                        onChange={e => setEditing({ ...editing, order_index: +e.target.value })}
                    />
                </div>
            </div>
        </div>
    );
}
