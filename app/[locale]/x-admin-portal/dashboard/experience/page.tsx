'use client';

import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, X, Save } from 'lucide-react';
import { useAdminData } from '@/hooks/useAdminData';
import type { Experience } from '@/lib/database.types';
import { Toaster } from 'react-hot-toast';
import AdminNav from '@/components/admin/AdminNav';

const EMPTY: Partial<Experience> = {
  company_en: '', company_ar: '', role_en: '', role_ar: '',
  description_en: '', description_ar: '', responsibilities_en: [],
  responsibilities_ar: [], start_date: '', is_current: false, order_index: 0,
};

export default function AdminExperience() {
  const { items, loading, fetchItems, createItem, updateItem, deleteItem } = useAdminData<Experience>('experience');
  const [editing, setEditing] = useState<Partial<Experience> | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [respEnInput, setRespEnInput] = useState('');
  const [respArInput, setRespArInput] = useState('');

  useEffect(() => { fetchItems(); }, [fetchItems]);

  const handleSave = async () => {
    if (!editing) return;
    if (isNew) await createItem(editing);
    else await updateItem(editing.id!, editing);
    setEditing(null);
    fetchItems();
  };

  const addResp = (lang: 'en' | 'ar') => {
    if (!editing) return;
    if (lang === 'en' && respEnInput.trim()) {
      setEditing({ ...editing, responsibilities_en: [...(editing.responsibilities_en || []), respEnInput.trim()] });
      setRespEnInput('');
    }
    if (lang === 'ar' && respArInput.trim()) {
      setEditing({ ...editing, responsibilities_ar: [...(editing.responsibilities_ar || []), respArInput.trim()] });
      setRespArInput('');
    }
  };

  return (
    <div className="flex h-screen bg-void">
      <AdminNav active="experience" />
      <Toaster position="top-right" />
      <main className="flex-1 overflow-auto p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold font-display text-text-primary">Experience<span className="text-neon-cyan">.</span></h1>
            <p className="font-mono text-xs text-text-muted">{items.length} positions</p>
          </div>
          <button onClick={() => { setEditing({...EMPTY}); setIsNew(true); }} className="btn-neon-filled px-4 py-2 font-mono text-sm flex items-center gap-2">
            <Plus size={16} /> Add Experience
          </button>
        </div>

        {loading ? <div className="flex justify-center py-20"><div className="spinner" /></div> : (
          <div className="space-y-4">
            {items.map(exp => (
              <div key={exp.id} className="glass-card p-5 flex items-start justify-between gap-4">
                <div>
                  <div className="font-medium text-text-primary">{exp.role_en}</div>
                  <div className="text-sm text-neon-cyan font-mono">{exp.company_en}</div>
                  <div className="text-xs text-text-muted font-mono mt-1">
                    {exp.start_date} — {exp.is_current ? 'Present' : exp.end_date}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => { setEditing({...exp}); setIsNew(false); }} className="p-2 text-text-muted hover:text-neon-cyan"><Pencil size={14} /></button>
                  <button onClick={() => deleteItem(exp.id)} className="p-2 text-text-muted hover:text-red-400"><Trash2 size={14} /></button>
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
              <h2 className="font-mono text-neon-cyan">{isNew ? 'New Experience' : 'Edit Experience'}</h2>
              <button onClick={() => setEditing(null)}><X size={18} className="text-text-muted" /></button>
            </div>
            <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-xs font-mono text-text-muted mb-1">Role (EN)</label>
                  <input className="input-neon" value={editing.role_en||''} onChange={e=>setEditing({...editing,role_en:e.target.value})} /></div>
                <div><label className="block text-xs font-mono text-text-muted mb-1">Role (AR) الدور</label>
                  <input className="input-neon text-right" dir="rtl" value={editing.role_ar||''} onChange={e=>setEditing({...editing,role_ar:e.target.value})} /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-xs font-mono text-text-muted mb-1">Company (EN)</label>
                  <input className="input-neon" value={editing.company_en||''} onChange={e=>setEditing({...editing,company_en:e.target.value})} /></div>
                <div><label className="block text-xs font-mono text-text-muted mb-1">Company (AR) الشركة</label>
                  <input className="input-neon text-right" dir="rtl" value={editing.company_ar||''} onChange={e=>setEditing({...editing,company_ar:e.target.value})} /></div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div><label className="block text-xs font-mono text-text-muted mb-1">Start Date</label>
                  <input type="date" className="input-neon" value={editing.start_date||''} onChange={e=>setEditing({...editing,start_date:e.target.value})} /></div>
                <div><label className="block text-xs font-mono text-text-muted mb-1">End Date</label>
                  <input type="date" className="input-neon" value={editing.end_date||''} onChange={e=>setEditing({...editing,end_date:e.target.value})} disabled={editing.is_current} /></div>
                <div className="flex items-end pb-3">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={editing.is_current||false} onChange={e=>setEditing({...editing,is_current:e.target.checked})} className="accent-neon-cyan w-4 h-4" />
                    <span className="text-xs font-mono text-text-muted">Current</span>
                  </label>
                </div>
              </div>
              {/* Responsibilities EN */}
              <div>
                <label className="block text-xs font-mono text-text-muted mb-1">Responsibilities (EN)</label>
                <div className="flex gap-2 mb-2">
                  <input className="input-neon flex-1 text-sm" value={respEnInput} onChange={e=>setRespEnInput(e.target.value)}
                    placeholder="Add responsibility..." onKeyDown={e=>e.key==='Enter'&&(e.preventDefault(),addResp('en'))} />
                  <button onClick={()=>addResp('en')} className="btn-neon px-3 text-xs">Add</button>
                </div>
                {editing.responsibilities_en?.map((r,i)=>(
                  <div key={i} className="flex items-center gap-2 text-xs text-text-muted mb-1">
                    <span className="text-neon-cyan">▸</span><span className="flex-1">{r}</span>
                    <button onClick={()=>setEditing({...editing,responsibilities_en:editing.responsibilities_en?.filter((_,j)=>j!==i)})}><X size={12} className="text-red-400" /></button>
                  </div>
                ))}
              </div>
              {/* Responsibilities AR */}
              <div>
                <label className="block text-xs font-mono text-text-muted mb-1">Responsibilities (AR) المهام</label>
                <div className="flex gap-2 mb-2">
                  <input className="input-neon flex-1 text-sm text-right font-arabic" dir="rtl" value={respArInput} onChange={e=>setRespArInput(e.target.value)}
                    placeholder="أضف مسؤولية..." onKeyDown={e=>e.key==='Enter'&&(e.preventDefault(),addResp('ar'))} />
                  <button onClick={()=>addResp('ar')} className="btn-neon px-3 text-xs">Add</button>
                </div>
                {editing.responsibilities_ar?.map((r,i)=>(
                  <div key={i} className="flex items-center gap-2 text-xs text-text-muted mb-1 flex-row-reverse">
                    <span className="text-neon-cyan">▸</span><span className="flex-1 text-right font-arabic">{r}</span>
                    <button onClick={()=>setEditing({...editing,responsibilities_ar:editing.responsibilities_ar?.filter((_,j)=>j!==i)})}><X size={12} className="text-red-400" /></button>
                  </div>
                ))}
              </div>
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
