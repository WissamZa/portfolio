'use client';

import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, X, Save } from 'lucide-react';
import { useAdminData } from '@/hooks/useAdminData';
import type { Skill } from '@/lib/database.types';
import { Toaster } from 'react-hot-toast';
import AdminNav from '@/components/admin/AdminNav';

const EMPTY: Partial<Skill> = {
  name_en: '', name_ar: '', category: 'languages', proficiency: 80, order_index: 0
};

const CATEGORIES = ['languages', 'frameworks', 'databases', 'tools', 'cloud', 'other'] as const;

export default function AdminSkills() {
  const { items, loading, fetchItems, createItem, updateItem, deleteItem } = useAdminData<Skill>('skills');
  const [editing, setEditing] = useState<Partial<Skill> | null>(null);
  const [isNew, setIsNew] = useState(false);

  useEffect(() => { fetchItems(); }, [fetchItems]);

  const handleSave = async () => {
    if (!editing) return;
    if (isNew) await createItem(editing);
    else await updateItem(editing.id!, editing);
    setEditing(null);
    fetchItems();
  };

  const grouped = CATEGORIES.reduce((acc, cat) => {
    acc[cat] = items.filter(s => s.category === cat);
    return acc;
  }, {} as Record<string, Skill[]>);

  return (
    <div className="flex h-screen bg-void">
      <AdminNav active="skills" />
      <Toaster position="top-right" />
      <main className="flex-1 overflow-auto p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold font-display text-text-primary">Skills<span className="text-neon-cyan">.</span></h1>
            <p className="font-mono text-xs text-text-muted">{items.length} skills</p>
          </div>
          <button onClick={() => { setEditing({...EMPTY}); setIsNew(true); }} className="btn-neon-filled px-4 py-2 font-mono text-sm flex items-center gap-2">
            <Plus size={16} /> Add Skill
          </button>
        </div>

        {loading ? <div className="flex justify-center py-20"><div className="spinner" /></div> : (
          <div className="space-y-6">
            {CATEGORIES.filter(cat => grouped[cat].length > 0).map(cat => (
              <div key={cat}>
                <h3 className="font-mono text-xs text-neon-cyan uppercase tracking-widest mb-3">{cat}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {grouped[cat].map(skill => (
                    <div key={skill.id} className="glass-card p-4 flex items-center justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-text-primary">{skill.name_en}</div>
                        <div className="text-xs text-text-muted font-arabic">{skill.name_ar}</div>
                        <div className="flex items-center gap-2 mt-2">
                          <div className="skill-bar flex-1"><div className="skill-bar-fill" style={{width:`${skill.proficiency}%`}} /></div>
                          <span className="font-mono text-xs text-neon-cyan">{skill.proficiency}%</span>
                        </div>
                      </div>
                      <div className="flex gap-1 shrink-0">
                        <button onClick={() => { setEditing({...skill}); setIsNew(false); }} className="p-1.5 text-text-muted hover:text-neon-cyan"><Pencil size={13} /></button>
                        <button onClick={() => deleteItem(skill.id)} className="p-1.5 text-text-muted hover:text-red-400"><Trash2 size={13} /></button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {editing && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-lg glass-card border border-neon-cyan/20">
            <div className="flex items-center justify-between p-5 border-b border-glass-border">
              <h2 className="font-mono text-neon-cyan">{isNew ? 'New Skill' : 'Edit Skill'}</h2>
              <button onClick={() => setEditing(null)}><X size={18} className="text-text-muted" /></button>
            </div>
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-xs font-mono text-text-muted mb-1">Name (EN)</label>
                  <input className="input-neon" value={editing.name_en||''} onChange={e=>setEditing({...editing,name_en:e.target.value})} /></div>
                <div><label className="block text-xs font-mono text-text-muted mb-1">Name (AR) اسم</label>
                  <input className="input-neon text-right" dir="rtl" value={editing.name_ar||''} onChange={e=>setEditing({...editing,name_ar:e.target.value})} /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-xs font-mono text-text-muted mb-1">Category</label>
                  <select className="input-neon" value={editing.category} onChange={e=>setEditing({...editing,category:e.target.value as Skill['category']})}>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select></div>
                <div><label className="block text-xs font-mono text-text-muted mb-1">Proficiency ({editing.proficiency}%)</label>
                  <input type="range" min="0" max="100" className="w-full accent-neon-cyan mt-2" value={editing.proficiency||80}
                    onChange={e=>setEditing({...editing,proficiency:+e.target.value})} /></div>
              </div>
              <div><label className="block text-xs font-mono text-text-muted mb-1">Order Index</label>
                <input type="number" className="input-neon w-32" value={editing.order_index||0} onChange={e=>setEditing({...editing,order_index:+e.target.value})} /></div>
            </div>
            <div className="flex justify-end gap-3 p-5 border-t border-glass-border">
              <button onClick={() => setEditing(null)} className="btn-neon px-4 py-2 text-sm font-mono">Cancel</button>
              <button onClick={handleSave} className="btn-neon-filled px-4 py-2 text-sm font-mono flex items-center gap-2"><Save size={14} /> Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
