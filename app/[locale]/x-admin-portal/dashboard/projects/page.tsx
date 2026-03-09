'use client';

import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, X, Save, Star } from 'lucide-react';
import { useAdminData } from '@/hooks/useAdminData';
import type { Project } from '@/lib/database.types';
import { cn } from '@/lib/utils';
import { Toaster } from 'react-hot-toast';
import AdminNav from '@/components/admin/AdminNav';

const EMPTY_PROJECT: Partial<Project> = {
  title_en: '', title_ar: '', description_en: '', description_ar: '',
  tech_stack: [], github_url: '', live_url: '', featured: false,
  status: 'completed', order_index: 0,
};

export default function AdminProjects() {
  const { items, loading, fetchItems, createItem, updateItem, deleteItem } = useAdminData<Project>('projects');
  const [editing, setEditing] = useState<Partial<Project> | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [techInput, setTechInput] = useState('');

  useEffect(() => { fetchItems(); }, [fetchItems]);

  const openNew = () => { setEditing({ ...EMPTY_PROJECT }); setIsNew(true); };
  const openEdit = (p: Project) => { setEditing({ ...p }); setIsNew(false); };
  const closeForm = () => { setEditing(null); setIsNew(false); };

  const handleSave = async () => {
    if (!editing) return;
    if (isNew) await createItem(editing);
    else await updateItem(editing.id!, editing);
    closeForm();
    fetchItems();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this project?')) return;
    await deleteItem(id);
  };

  const addTech = () => {
    if (!techInput.trim() || !editing) return;
    setEditing({ ...editing, tech_stack: [...(editing.tech_stack || []), techInput.trim()] });
    setTechInput('');
  };

  const removeTech = (t: string) => {
    if (!editing) return;
    setEditing({ ...editing, tech_stack: editing.tech_stack?.filter((x) => x !== t) });
  };

  return (
    <div className="flex h-screen bg-void">
      <AdminNav active="projects" />
      <Toaster position="top-right" />

      <main className="flex-1 overflow-auto p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold font-display text-text-primary">
              Projects<span className="text-neon-cyan">.</span>
            </h1>
            <p className="font-mono text-xs text-text-muted">{items.length} projects</p>
          </div>
          <button onClick={openNew} className="btn-neon-filled px-4 py-2 font-mono text-sm flex items-center gap-2">
            <Plus size={16} /> Add Project
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><div className="spinner" /></div>
        ) : (
          <div className="grid gap-4">
            {items.map((project) => (
              <div key={project.id} className="glass-card p-5 flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    {project.featured && <Star size={14} className="text-neon-cyan shrink-0" />}
                    <h3 className="font-medium text-text-primary truncate">{project.title_en}</h3>
                    <span className={cn(
                      'text-xs font-mono px-2 py-0.5 rounded',
                      project.status === 'completed' ? 'bg-neon-green/10 text-neon-green' :
                      project.status === 'in_progress' ? 'bg-neon-orange/10 text-neon-orange' :
                      'bg-text-muted/10 text-text-muted'
                    )}>{project.status}</span>
                  </div>
                  <p className="text-sm text-text-muted line-clamp-1">{project.description_en}</p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {project.tech_stack?.slice(0, 5).map((t) => (
                      <span key={t} className="tech-badge text-xs">{t}</span>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button onClick={() => openEdit(project)}
                    className="p-2 text-text-muted hover:text-neon-cyan transition-colors border border-transparent hover:border-neon-cyan/30">
                    <Pencil size={15} />
                  </button>
                  <button onClick={() => handleDelete(project.id)}
                    className="p-2 text-text-muted hover:text-red-400 transition-colors border border-transparent hover:border-red-400/30">
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Edit/Create Modal */}
      {editing && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-start justify-center overflow-auto py-8 px-4">
          <div className="w-full max-w-2xl glass-card border border-neon-cyan/20">
            <div className="flex items-center justify-between p-5 border-b border-glass-border">
              <h2 className="font-mono text-neon-cyan">{isNew ? 'New Project' : 'Edit Project'}</h2>
              <button onClick={closeForm} className="text-text-muted hover:text-text-primary"><X size={18} /></button>
            </div>
            <div className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-text-muted mb-1">Title (EN)</label>
                  <input className="input-neon" value={editing.title_en || ''} onChange={e => setEditing({...editing, title_en: e.target.value})} />
                </div>
                <div>
                  <label className="block text-xs font-mono text-text-muted mb-1">Title (AR) عنوان</label>
                  <input className="input-neon text-right" dir="rtl" value={editing.title_ar || ''} onChange={e => setEditing({...editing, title_ar: e.target.value})} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-text-muted mb-1">Description (EN)</label>
                  <textarea rows={3} className="input-neon resize-none" value={editing.description_en || ''} onChange={e => setEditing({...editing, description_en: e.target.value})} />
                </div>
                <div>
                  <label className="block text-xs font-mono text-text-muted mb-1">Description (AR) وصف</label>
                  <textarea rows={3} className="input-neon resize-none text-right" dir="rtl" value={editing.description_ar || ''} onChange={e => setEditing({...editing, description_ar: e.target.value})} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-text-muted mb-1">GitHub URL</label>
                  <input className="input-neon" value={editing.github_url || ''} onChange={e => setEditing({...editing, github_url: e.target.value})} />
                </div>
                <div>
                  <label className="block text-xs font-mono text-text-muted mb-1">Live URL</label>
                  <input className="input-neon" value={editing.live_url || ''} onChange={e => setEditing({...editing, live_url: e.target.value})} />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-mono text-text-muted mb-1">Status</label>
                  <select className="input-neon" value={editing.status} onChange={e => setEditing({...editing, status: e.target.value as Project['status']})}>
                    <option value="completed">Completed</option>
                    <option value="in_progress">In Progress</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-mono text-text-muted mb-1">Order</label>
                  <input type="number" className="input-neon" value={editing.order_index || 0} onChange={e => setEditing({...editing, order_index: +e.target.value})} />
                </div>
                <div className="flex items-end pb-3">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={editing.featured || false}
                      onChange={e => setEditing({...editing, featured: e.target.checked})}
                      className="w-4 h-4 accent-neon-cyan" />
                    <span className="text-xs font-mono text-text-muted">Featured</span>
                  </label>
                </div>
              </div>
              {/* Tech stack */}
              <div>
                <label className="block text-xs font-mono text-text-muted mb-1">Tech Stack</label>
                <div className="flex gap-2 mb-2">
                  <input className="input-neon flex-1" value={techInput} onChange={e => setTechInput(e.target.value)}
                    placeholder="Add technology..." onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTech())} />
                  <button onClick={addTech} className="btn-neon px-3 py-2 text-xs">Add</button>
                </div>
                <div className="flex flex-wrap gap-1">
                  {editing.tech_stack?.map(t => (
                    <span key={t} className="tech-badge flex items-center gap-1">
                      {t}
                      <button onClick={() => removeTech(t)} className="ml-1 text-neon-cyan/60 hover:text-red-400"><X size={10} /></button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3 p-5 border-t border-glass-border">
              <button onClick={closeForm} className="btn-neon px-4 py-2 text-sm font-mono">Cancel</button>
              <button onClick={handleSave} className="btn-neon-filled px-4 py-2 text-sm font-mono flex items-center gap-2">
                <Save size={14} /> Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
