'use client';

import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, X, Save } from 'lucide-react';
import { useAdminData } from '@/hooks/useAdminData';
import type { Education } from '@/lib/database.types';
import { Toaster } from 'react-hot-toast';
import AdminNav from '@/components/admin/AdminNav';

const EMPTY: Partial<Education> = {
  institution_en: '', institution_ar: '', degree_en: '', degree_ar: '',
  field_en: '', field_ar: '', start_date: '', is_current: false, gpa: '', order_index: 0,
};

export default function AdminEducation() {
  const { items, loading, fetchItems, createItem, updateItem, deleteItem } = useAdminData<Education>('education');
  const [editing, setEditing] = useState<Partial<Education> | null>(null);
  const [isNew, setIsNew] = useState(false);

  useEffect(() => { fetchItems(); }, [fetchItems]);

  const handleSave = async () => {
    if (!editing) return;
    if (isNew) await createItem(editing);
    else await updateItem(editing.id!, editing);
    setEditing(null);
    fetchItems();
  };

  return (
    <div className="flex h-screen bg-void">
      <AdminNav active="education" />
      <Toaster position="top-right" />
      <main className="flex-1 overflow-auto p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold font-display text-text-primary">Education<span className="text-neon-cyan">.</span></h1>
            <p className="font-mono text-xs text-text-muted">{items.length} entries</p>
          </div>
          <button onClick={() => { setEditing({...EMPTY}); setIsNew(true); }} className="btn-neon-filled px-4 py-2 font-mono text-sm flex items-center gap-2">
            <Plus size={16} /> Add Education
          </button>
        </div>

        {loading ? <div className="flex justify-center py-20"><div className="spinner" /></div> : (
          <div className="space-y-4">
            {items.map(edu => (
              <div key={edu.id} className="glass-card p-5 flex items-start justify-between gap-4">
                <div>
                  <div className="font-medium text-text-primary">{edu.degree_en}{edu.field_en ? ` — ${edu.field_en}` : ''}</div>
                  <div className="text-sm text-neon-purple font-mono">{edu.institution_en}</div>
                  <div className="text-xs text-text-muted font-mono mt-1">
                    {edu.start_date} — {edu.is_current ? 'Present' : edu.end_date}
                    {edu.gpa && ` • GPA: ${edu.gpa}`}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => { setEditing({...edu}); setIsNew(false); }} className="p-2 text-text-muted hover:text-neon-cyan"><Pencil size={14} /></button>
                  <button onClick={() => deleteItem(edu.id)} className="p-2 text-text-muted hover:text-red-400"><Trash2 size={14} /></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {editing && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-start justify-center overflow-auto py-8 px-4">
          <div className="w-full max-w-2xl glass-card border border-neon-cyan/20">
            <div className="flex items-center justify-between p-5 border-b border-glass-border">
              <h2 className="font-mono text-neon-cyan">{isNew ? 'New Education' : 'Edit Education'}</h2>
              <button onClick={() => setEditing(null)}><X size={18} className="text-text-muted" /></button>
            </div>
            <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-xs font-mono text-text-muted mb-1">Institution (EN)</label>
                  <input className="input-neon" value={editing.institution_en||''} onChange={e=>setEditing({...editing,institution_en:e.target.value})} /></div>
                <div><label className="block text-xs font-mono text-text-muted mb-1">Institution (AR) المؤسسة</label>
                  <input className="input-neon text-right" dir="rtl" value={editing.institution_ar||''} onChange={e=>setEditing({...editing,institution_ar:e.target.value})} /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-xs font-mono text-text-muted mb-1">Degree (EN)</label>
                  <input className="input-neon" value={editing.degree_en||''} onChange={e=>setEditing({...editing,degree_en:e.target.value})} /></div>
                <div><label className="block text-xs font-mono text-text-muted mb-1">Degree (AR) الدرجة</label>
                  <input className="input-neon text-right" dir="rtl" value={editing.degree_ar||''} onChange={e=>setEditing({...editing,degree_ar:e.target.value})} /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-xs font-mono text-text-muted mb-1">Field (EN)</label>
                  <input className="input-neon" value={editing.field_en||''} onChange={e=>setEditing({...editing,field_en:e.target.value})} /></div>
                <div><label className="block text-xs font-mono text-text-muted mb-1">Field (AR) التخصص</label>
                  <input className="input-neon text-right" dir="rtl" value={editing.field_ar||''} onChange={e=>setEditing({...editing,field_ar:e.target.value})} /></div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div><label className="block text-xs font-mono text-text-muted mb-1">Start Date</label>
                  <input type="date" className="input-neon" value={editing.start_date||''} onChange={e=>setEditing({...editing,start_date:e.target.value})} /></div>
                <div><label className="block text-xs font-mono text-text-muted mb-1">End Date</label>
                  <input type="date" className="input-neon" value={editing.end_date||''} onChange={e=>setEditing({...editing,end_date:e.target.value})} disabled={editing.is_current} /></div>
                <div className="flex items-end pb-3">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" checked={editing.is_current||false} onChange={e=>setEditing({...editing,is_current:e.target.checked})} className="accent-neon-cyan w-4 h-4" />
                    <span className="text-xs font-mono text-text-muted">Current</span>
                  </label>
                </div>
              </div>
              <div><label className="block text-xs font-mono text-text-muted mb-1">GPA (optional)</label>
                <input className="input-neon w-40" value={editing.gpa||''} onChange={e=>setEditing({...editing,gpa:e.target.value})} placeholder="e.g. 3.8/4.0" /></div>
            </div>
            <div className="flex justify-end gap-3 p-5 border-t border-glass-border">
              <button onClick={()=>setEditing(null)} className="btn-neon px-4 py-2 text-sm font-mono">Cancel</button>
              <button onClick={handleSave} className="btn-neon-filled px-4 py-2 text-sm font-mono flex items-center gap-2"><Save size={14}/> Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
