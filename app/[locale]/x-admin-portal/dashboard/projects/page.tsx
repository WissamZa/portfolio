'use client';

import { useEffect, useState } from 'react';
import { Pencil, Trash2, Save, Star, ExternalLink } from 'lucide-react';
import { useAdminData } from '@/hooks/useAdminData';
import type { Project } from '@/lib/database.types';
import { cn } from '@/lib/utils';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { AdminModal } from '@/components/admin/AdminModal';
import { ProjectForm } from './ProjectForm';
import toast from 'react-hot-toast';

const EMPTY_PROJECT: Partial<Project> = {
  title_en: '', title_ar: '', description_en: '', description_ar: '',
  tech_stack: [], github_url: '', live_url: '', featured: false,
  status: 'completed', order_index: 0,
};

export default function AdminProjects() {
  const { items, loading, fetchItems, createItem, updateItem, deleteItem } = useAdminData<Project>('projects');
  const [editing, setEditing] = useState<Partial<Project> | null>(null);
  const [isNew, setIsNew] = useState(false);

  useEffect(() => { fetchItems(); }, [fetchItems]);

  const handleSave = async () => {
    if (!editing) return;
    try {
      if (isNew) await createItem(editing);
      else await updateItem(editing.id!, editing);
      setEditing(null);
      fetchItems();
      toast.success(isNew ? 'Project created' : 'Project updated');
    } catch (err) {
      toast.error('Failed to save');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this project?')) {
      try {
        await deleteItem(id);
        fetchItems();
        toast.success('Project deleted');
      } catch (err) {
        toast.error('Failed to delete');
      }
    }
  };

  return (
    <div className="p-8">
      <AdminHeader
        title="Projects"
        count={items.length}
        itemLabel="projects"
        onAdd={() => { setEditing({ ...EMPTY_PROJECT }); setIsNew(true); }}
        addButtonLabel="Add Project"
      />

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="spinner" />
        </div>
      ) : (
        <div className="grid gap-4">
          {items.map((project) => (
            <div key={project.id} className="glass-card p-5 group hover:border-neon-cyan/20 transition-all flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-semibold text-text-primary text-lg tracking-tight truncate">
                    {project.title_en}
                  </h3>
                  {project.featured && (
                    <div className="flex items-center gap-1 text-[10px] font-mono text-neon-cyan bg-neon-cyan/10 px-2 py-0.5 border border-neon-cyan/20 uppercase">
                      <Star size={10} fill="currentColor" /> Featured
                    </div>
                  )}
                  <span className={cn(
                    'text-[10px] font-mono px-2 py-0.5 border uppercase tracking-widest',
                    project.status === 'completed' ? 'border-neon-green/30 text-neon-green bg-neon-green/5' :
                      project.status === 'in_progress' ? 'border-neon-orange/30 text-neon-orange bg-neon-orange/5' :
                        'border-text-muted/30 text-text-muted bg-text-muted/5'
                  )}>{project.status.replace('_', ' ')}</span>
                </div>

                <p className="text-sm text-text-muted line-clamp-2 max-w-3xl mb-4 font-display opacity-80">
                  {project.description_en}
                </p>

                <div className="flex flex-wrap gap-2">
                  {project.tech_stack?.map((t) => (
                    <span key={t} className="text-[10px] font-mono text-text-accent bg-void-3 px-2 py-0.5 border border-glass-border">
                      {t}
                    </span>
                  ))}
                </div>

                <div className="flex gap-4 mt-4">
                  {project.github_url && (
                    <a href={project.github_url} target="_blank" rel="noreferrer" className="text-[10px] font-mono text-text-muted hover:text-white flex items-center gap-1 underline underline-offset-4">
                      GITHUB <ExternalLink size={10} />
                    </a>
                  )}
                  {project.live_url && (
                    <a href={project.live_url} target="_blank" rel="noreferrer" className="text-[10px] font-mono text-neon-cyan hover:text-white flex items-center gap-1 underline underline-offset-4">
                      LIVE DEMO <ExternalLink size={10} />
                    </a>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-2 shrink-0">
                <button
                  onClick={() => { setEditing({ ...project }); setIsNew(false); }}
                  className="w-9 h-9 flex items-center justify-center text-text-muted hover:text-neon-cyan border border-glass-border hover:border-neon-cyan/30 transition-all bg-void-2"
                >
                  <Pencil size={15} />
                </button>
                <button
                  onClick={() => handleDelete(project.id)}
                  className="w-9 h-9 flex items-center justify-center text-text-muted hover:text-red-400 border border-glass-border hover:border-red-400/30 transition-all bg-void-2"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <AdminModal
        title={isNew ? 'New Project' : 'Edit Project'}
        isOpen={!!editing}
        onClose={() => setEditing(null)}
        footer={
          <>
            <button onClick={() => setEditing(null)} className="btn-neon px-4 py-2 text-sm font-mono">Cancel</button>
            <button onClick={handleSave} className="btn-neon-filled px-4 py-2 text-sm font-mono flex items-center gap-2">
              <Save size={14} /> Save
            </button>
          </>
        }
      >
        {editing && <ProjectForm editing={editing} setEditing={setEditing} />}
      </AdminModal>
    </div>
  );
}
