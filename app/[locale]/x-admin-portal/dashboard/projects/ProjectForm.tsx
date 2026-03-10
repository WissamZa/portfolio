'use client';

import { useState, useRef } from 'react';
import { X, Upload, Loader } from 'lucide-react';
import type { Project } from '@/lib/database.types';
import toast from 'react-hot-toast';

interface ProjectFormProps {
    editing: Partial<Project>;
    setEditing: (item: Partial<Project>) => void;
}

export function ProjectForm({ editing, setEditing }: ProjectFormProps) {
    const [techInput, setTechInput] = useState('');
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        const formData = new FormData();
        formData.append('file', file);
        formData.append('folder', 'projects');

        try {
            const res = await fetch('/api/admin/upload', {
                method: 'POST',
                body: formData,
            });
            const data = await res.json();
            if (data.url) {
                setEditing({ ...editing, image_url: data.url });
                toast.success('Image uploaded');
            } else {
                throw new Error(data.error || 'Upload failed');
            }
        } catch (err: any) {
            toast.error('Upload failed: ' + err.message);
        } finally {
            setUploading(false);
        }
    };

    const addTech = () => {
        if (!techInput.trim()) return;
        setEditing({
            ...editing,
            tech_stack: [...(editing.tech_stack || []), techInput.trim()]
        });
        setTechInput('');
    };

    const removeTech = (t: string) => {
        setEditing({
            ...editing,
            tech_stack: editing.tech_stack?.filter((x) => x !== t)
        });
    };

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-mono text-text-muted mb-1">Title (EN)</label>
                    <input
                        className="input-neon text-sm"
                        value={editing.title_en || ''}
                        onChange={e => setEditing({ ...editing, title_en: e.target.value })}
                    />
                </div>
                <div>
                    <label className="block text-xs font-mono text-text-muted mb-1 text-right">Title (AR) عنوان</label>
                    <input
                        className="input-neon text-right font-arabic text-sm"
                        dir="rtl"
                        value={editing.title_ar || ''}
                        onChange={e => setEditing({ ...editing, title_ar: e.target.value })}
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-mono text-text-muted mb-1">Description (EN)</label>
                    <textarea
                        rows={3}
                        className="input-neon resize-none text-sm"
                        value={editing.description_en || ''}
                        onChange={e => setEditing({ ...editing, description_en: e.target.value })}
                    />
                </div>
                <div>
                    <label className="block text-xs font-mono text-text-muted mb-1 text-right">Description (AR) وصف</label>
                    <textarea
                        rows={3}
                        className="input-neon resize-none text-right font-arabic text-sm"
                        dir="rtl"
                        value={editing.description_ar || ''}
                        onChange={e => setEditing({ ...editing, description_ar: e.target.value })}
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-mono text-text-muted mb-1">GitHub URL</label>
                    <input
                        className="input-neon text-sm font-mono"
                        value={editing.github_url || ''}
                        onChange={e => setEditing({ ...editing, github_url: e.target.value })}
                    />
                </div>
                <div>
                    <label className="block text-xs font-mono text-text-muted mb-1">Live URL</label>
                    <input
                        className="input-neon text-sm font-mono"
                        value={editing.live_url || ''}
                        onChange={e => setEditing({ ...editing, live_url: e.target.value })}
                    />
                </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
                <div>
                    <label className="block text-xs font-mono text-text-muted mb-1">Status</label>
                    <select
                        className="input-neon text-sm"
                        value={editing.status}
                        onChange={e => setEditing({ ...editing, status: e.target.value as Project['status'] })}
                    >
                        <option value="completed">Completed</option>
                        <option value="in_progress">In Progress</option>
                        <option value="archived">Archived</option>
                    </select>
                </div>
                <div>
                    <label className="block text-xs font-mono text-text-muted mb-1">Order</label>
                    <input
                        type="number"
                        className="input-neon text-sm w-full"
                        value={editing.order_index || 0}
                        onChange={e => setEditing({ ...editing, order_index: +e.target.value })}
                    />
                </div>
                <div className="flex items-end pb-3">
                    <label className="flex items-center gap-2 cursor-pointer group">
                        <input
                            type="checkbox"
                            checked={editing.featured || false}
                            onChange={e => setEditing({ ...editing, featured: e.target.checked })}
                            className="w-4 h-4 accent-neon-cyan"
                        />
                        <span className="text-xs font-mono text-text-muted group-hover:text-neon-cyan transition-colors">Featured</span>
                    </label>
                </div>
            </div>

            <div>
                <label className="block text-xs font-mono text-text-muted mb-1">Project Image</label>
                <div className="flex gap-2">
                    <input
                        type="url"
                        className="input-neon flex-1 text-sm font-mono"
                        placeholder="Image URL..."
                        value={editing.image_url || ''}
                        onChange={e => setEditing({ ...editing, image_url: e.target.value })}
                    />
                    <input
                        ref={fileInputRef}
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleFileUpload}
                    />
                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploading}
                        className="btn-neon px-4 py-2 flex items-center gap-2 shrink-0 uppercase text-[10px] font-bold"
                    >
                        {uploading ? <Loader size={14} className="animate-spin" /> : <Upload size={14} />}
                        {uploading ? 'Processing' : 'Upload'}
                    </button>
                </div>
            </div>

            <div>
                <label className="block text-xs font-mono text-text-muted mb-1">Tech Stack</label>
                <div className="flex gap-2 mb-2">
                    <input
                        className="input-neon flex-1 text-sm font-mono"
                        value={techInput}
                        onChange={e => setTechInput(e.target.value)}
                        placeholder="Add technology..."
                        onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTech())}
                    />
                    <button onClick={addTech} className="btn-neon px-3 py-2 text-[10px] uppercase font-bold">Add</button>
                </div>
                <div className="flex flex-wrap gap-2">
                    {editing.tech_stack?.map(t => (
                        <span key={t} className="bg-void-3 border border-neon-cyan/20 text-neon-cyan text-[10px] px-2 py-1 flex items-center gap-2 font-mono group">
                            {t}
                            <button
                                onClick={() => removeTech(t)}
                                className="text-text-muted hover:text-red-400 transition-colors"
                            >
                                <X size={10} />
                            </button>
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
}
