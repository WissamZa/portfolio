'use client';

import { Upload, Loader } from 'lucide-react';
import type { Course } from '@/lib/database.types';
import { useFileUpload } from '@/hooks/useFileUpload';

interface CourseFormProps {
    editing: Partial<Course>;
    setEditing: (item: Partial<Course>) => void;
}

export function CourseForm({ editing, setEditing }: CourseFormProps) {
    const { uploading, fileInputRef, handleFileUpload } = useFileUpload({
        folder: 'courses',
        successMessage: 'Certificate uploaded',
    });

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-mono text-text-muted mb-1">Course Name (EN)</label>
                    <input
                        className="input-neon text-sm"
                        value={editing.name_en || ''}
                        onChange={e => setEditing({ ...editing, name_en: e.target.value })}
                        placeholder="e.g. Full Stack Web Development"
                    />
                </div>
                <div>
                    <label className="block text-xs font-mono text-text-muted mb-1">Course Name (AR)</label>
                    <input
                        className="input-neon text-right font-arabic text-sm"
                        dir="rtl"
                        value={editing.name_ar || ''}
                        onChange={e => setEditing({ ...editing, name_ar: e.target.value })}
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-mono text-text-muted mb-1">Provider (EN)</label>
                    <input
                        className="input-neon text-sm"
                        value={editing.provider_en || ''}
                        onChange={e => setEditing({ ...editing, provider_en: e.target.value })}
                        placeholder="e.g. Udemy, Coursera"
                    />
                </div>
                <div>
                    <label className="block text-xs font-mono text-text-muted mb-1">Provider (AR)</label>
                    <input
                        className="input-neon text-right font-arabic text-sm"
                        dir="rtl"
                        value={editing.provider_ar || ''}
                        onChange={e => setEditing({ ...editing, provider_ar: e.target.value })}
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-mono text-text-muted mb-1">Completion Date</label>
                    <input
                        type="date"
                        className="input-neon text-sm"
                        value={editing.completion_date || ''}
                        onChange={e => setEditing({ ...editing, completion_date: e.target.value })}
                    />
                </div>
                <div>
                    <label className="block text-xs font-mono text-text-muted mb-1">Order Index</label>
                    <input
                        type="number"
                        className="input-neon text-sm w-24"
                        value={editing.order_index || 0}
                        onChange={e => setEditing({ ...editing, order_index: +e.target.value })}
                    />
                </div>
            </div>

            <div>
                <label className="block text-xs font-mono text-text-muted mb-1">Description (EN)</label>
                <textarea
                    className="input-neon text-sm min-h-[80px]"
                    value={editing.description_en || ''}
                    onChange={e => setEditing({ ...editing, description_en: e.target.value })}
                />
            </div>

            <div>
                <label className="block text-xs font-mono text-text-muted mb-1">Description (AR)</label>
                <textarea
                    className="input-neon text-right font-arabic text-sm min-h-[80px]"
                    dir="rtl"
                    value={editing.description_ar || ''}
                    onChange={e => setEditing({ ...editing, description_ar: e.target.value })}
                />
            </div>

            <div className="grid grid-cols-1 gap-4">
                <div>
                    <label className="block text-xs font-mono text-text-muted mb-1">Course URL</label>
                    <input
                        type="url"
                        className="input-neon text-sm font-mono"
                        placeholder="https://..."
                        value={editing.course_url || ''}
                        onChange={e => setEditing({ ...editing, course_url: e.target.value })}
                    />
                </div>
            </div>

            <div>
                <label className="block text-xs font-mono text-text-muted mb-1">Certificate Link or PDF</label>
                <div className="flex gap-2">
                    <input
                        type="url"
                        className="input-neon flex-1 text-sm font-mono"
                        placeholder="https://..."
                        value={editing.certificate_url || ''}
                        onChange={e => setEditing({ ...editing, certificate_url: e.target.value })}
                    />
                    <input
                        ref={fileInputRef}
                        type="file"
                        className="hidden"
                        accept="application/pdf,image/*"
                        onChange={e => handleFileUpload(e, url => setEditing({ ...editing, certificate_url: url }))}
                    />
                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploading}
                        className="btn-neon px-4 py-2 flex items-center gap-2 shrink-0 transition-all uppercase text-[10px] font-bold tracking-widest"
                    >
                        {uploading ? <Loader size={14} className="animate-spin" /> : <Upload size={14} />}
                        {uploading ? 'Processing...' : 'Upload Cert'}
                    </button>
                </div>
            </div>
        </div>
    );
}
