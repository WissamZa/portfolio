'use client';

import { useEffect, useState } from 'react';
import { Pencil, Trash2, Save } from 'lucide-react';
import { useAdminData } from '@/hooks/useAdminData';
import type { Experience } from '@/lib/database.types';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { AdminModal } from '@/components/admin/AdminModal';
import { ExperienceForm } from './ExperienceForm';
import toast from 'react-hot-toast';

const EMPTY: Partial<Experience> = {
  company_en: '', company_ar: '', role_en: '', role_ar: '',
  description_en: '', description_ar: '', responsibilities_en: [],
  responsibilities_ar: [], start_date: '', is_current: false, order_index: 0,
};

export default function AdminExperience() {
  const { items, loading, fetchItems, createItem, updateItem, deleteItem } = useAdminData<Experience>('experience');
  const [editing, setEditing] = useState<Partial<Experience> | null>(null);
  const [isNew, setIsNew] = useState(false);

  useEffect(() => { fetchItems(); }, [fetchItems]);

  const handleSave = async () => {
    if (!editing) return;
    try {
      if (isNew) await createItem(editing);
      else await updateItem(editing.id!, editing);
      setEditing(null);
      fetchItems();
      toast.success(isNew ? 'Experience added' : 'Experience updated');
    } catch (_err) {
      toast.error('Failed to save');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this experience?')) {
      try {
        await deleteItem(id);
        fetchItems();
        toast.success('Experience deleted');
      } catch (_err) {
        toast.error('Failed to delete');
      }
    }
  };

  return (
    <div className="p-8">
      <AdminHeader
        title="Experience"
        count={items.length}
        itemLabel="positions"
        onAdd={() => { setEditing({ ...EMPTY }); setIsNew(true); }}
        addButtonLabel="Add Experience"
      />

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="spinner" />
        </div>
      ) : (
        <div className="space-y-4">
          {items.map(exp => (
            <div key={exp.id} className="glass-card p-5 flex items-start justify-between gap-4 group hover:border-neon-cyan/20 transition-all">
              <div>
                <div className="font-medium text-text-primary text-lg">{exp.role_en}</div>
                <div className="text-sm text-neon-cyan font-mono uppercase tracking-wider">{exp.company_en}</div>
                <div className="text-xs text-text-muted font-mono mt-1">
                  {exp.start_date} — {exp.is_current ? 'Present' : exp.end_date}
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => { setEditing({ ...exp }); setIsNew(false); }}
                  className="p-2 text-text-muted hover:text-neon-cyan border border-glass-border hover:border-neon-cyan/30 transition-all"
                >
                  <Pencil size={14} />
                </button>
                <button
                  onClick={() => handleDelete(exp.id)}
                  className="p-2 text-text-muted hover:text-red-400 border border-glass-border hover:border-red-400/30 transition-all"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <AdminModal
        title={isNew ? 'New Experience' : 'Edit Experience'}
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
        {editing && <ExperienceForm editing={editing} setEditing={setEditing} />}
      </AdminModal>
    </div>
  );
}
