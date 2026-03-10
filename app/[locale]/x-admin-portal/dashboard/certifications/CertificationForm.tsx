'use client';

import { useRef, useState } from 'react';
import { Upload, Loader, FileText } from 'lucide-react';
import type { Certification } from '@/lib/database.types';
import toast from 'react-hot-toast';

interface CertificationFormProps {
    editing: Partial<Certification>;
    setEditing: (item: Partial<Certification>) => void;
}

export function CertificationForm({ editing, setEditing }: CertificationFormProps) {
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        const formData = new FormData();
        formData.append('file', file);
        formData.append('folder', 'certifications');

        try {
            const res = await fetch('/api/admin/upload', {
                method: 'POST',
                body: formData,
            });
            const data = await res.json();
            if (data.url) {
                setEditing({ ...editing, credential_url: data.url });
                toast.success('File uploaded');
            } else {
                throw new Error(data.error || 'Upload failed');
            }
        } catch (err: unknown) {
            toast.error('Upload failed: ' + (err instanceof Error ? err.message : 'Unknown error'));
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-mono text-text-muted mb-1">Name (EN)</label>
                    <input
                        className="input-neon text-sm"
                        value={editing.name_en || ''}
                        onChange={e => setEditing({ ...editing, name_en: e.target.value })}
                    />
                </div>
                <div>
                    <label className="block text-xs font-mono text-text-muted mb-1">Name (AR) اسم</label>
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
                    <label className="block text-xs font-mono text-text-muted mb-1">Issuer (EN)</label>
                    <input
                        className="input-neon text-sm"
                        value={editing.issuer_en || ''}
                        onChange={e => setEditing({ ...editing, issuer_en: e.target.value })}
                    />
                </div>
                <div>
                    <label className="block text-xs font-mono text-text-muted mb-1">Issuer (AR) جهة</label>
                    <input
                        className="input-neon text-right font-arabic text-sm"
                        dir="rtl"
                        value={editing.issuer_ar || ''}
                        onChange={e => setEditing({ ...editing, issuer_ar: e.target.value })}
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-mono text-text-muted mb-1">Issue Date</label>
                    <input
                        type="date"
                        className="input-neon text-sm"
                        value={editing.issue_date || ''}
                        onChange={e => setEditing({ ...editing, issue_date: e.target.value })}
                    />
                </div>
                <div>
                    <label className="block text-xs font-mono text-text-muted mb-1">Expiry Date</label>
                    <input
                        type="date"
                        className="input-neon text-sm"
                        value={editing.expiry_date || ''}
                        onChange={e => setEditing({ ...editing, expiry_date: e.target.value })}
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-mono text-text-muted mb-1">Credential ID</label>
                    <input
                        className="input-neon text-sm"
                        value={editing.credential_id || ''}
                        onChange={e => setEditing({ ...editing, credential_id: e.target.value })}
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
                <label className="block text-xs font-mono text-text-muted mb-1">Credential Link or PDF</label>
                <div className="flex gap-2">
                    <input
                        type="url"
                        className="input-neon flex-1 text-sm font-mono"
                        placeholder="https://..."
                        value={editing.credential_url || ''}
                        onChange={e => setEditing({ ...editing, credential_url: e.target.value })}
                    />
                    <input
                        ref={fileInputRef}
                        type="file"
                        className="hidden"
                        accept="application/pdf,image/*"
                        onChange={handleFileUpload}
                    />
                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploading}
                        className="btn-neon px-4 py-2 flex items-center gap-2 shrink-0 transition-all uppercase text-[10px] font-bold tracking-widest"
                    >
                        {uploading ? <Loader size={14} className="animate-spin" /> : <Upload size={14} />}
                        {uploading ? 'Processing...' : 'Upload File'}
                    </button>
                </div>
                {editing.credential_url && editing.credential_url.includes('supabase') && (
                    <div className="bg-neon-cyan/5 border border-neon-cyan/20 p-2 mt-2 flex items-center justify-between">
                        <div className="text-[10px] font-mono text-neon-cyan flex items-center gap-2">
                            <FileText size={12} />
                            <span>FILE STORED IN SUPABASE BUCKET</span>
                        </div>
                        <button
                            onClick={() => setEditing({ ...editing, credential_url: '' })}
                            className="text-red-400 hover:text-red-300 text-[10px] font-mono"
                        >
                            REMOVE
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
