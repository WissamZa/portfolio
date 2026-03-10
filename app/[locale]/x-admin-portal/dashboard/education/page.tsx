'use client';

import { useEffect, useState } from 'react';
import { Pencil, Trash2, Save } from 'lucide-react';
import { useAdminData } from '@/hooks/useAdminData';
import type { Education } from '@/lib/database.types';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { AdminModal } from '@/components/admin/AdminModal';
import { EducationForm } from './EducationForm';
import toast from 'react-hot-toast';

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
    try {
      if (isNew) await createItem(editing);
      else await updateItem(editing.id!, editing);
      setEditing(null);
      fetchItems();
      toast.success(isNew ? 'Education added' : 'Education updated');
    } catch (err) {
      toast.error('Failed to save');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this education entry?')) {
      try {
        await deleteItem(id);
        fetchItems();
        toast.success('Education deleted');
      } catch (err) {
        toast.error('Failed to delete');
      }
    }
  };

  return (
    <div className="p-8">
      <AdminHeader
        title="Education"
        count={items.length}
        itemLabel="entries"
        onAdd={() => { setEditing({ ...EMPTY }); setIsNew(true); }}
        addButtonLabel="Add Education"
      />

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="cyber-spinner" />
        </div>
      ) : (
        <div className="space-y-4">
          {items.map(edu => (
            <div key={edu.id} className="glass-card p-5 group hover:border-neon-cyan/20 transition-all flex items-start justify-between gap-4">
              <div>
                <div className="font-medium text-text-primary text-lg">
                  {edu.degree_en}{edu.field_en ? ` — ${edu.field_en}` : ''}
                </div>
                <div className="text-sm text-neon-purple font-mono uppercase tracking-wider">{edu.institution_en}</div>
                <div className="text-xs text-text-muted font-mono mt-2 flex items-center gap-2">
                  <span>{edu.start_date} — {edu.is_current ? 'Present' : edu.end_date}</span>
                  {edu.gpa && (
                    <>
                      <span className="w-1 h-1 rounded-full bg-glass-border" />
                      <span className="text-neon-cyan">GPA: {edu.gpa}</span>
                    </>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => { setEditing({ ...edu }); setIsNew(false); }}
                  className="p-2 text-text-muted hover:text-neon-cyan border border-glass-border hover:border-neon-cyan/30 transition-all"
                >
                  <Pencil size={14} />
                </button>
                <button
                  onClick={() => handleDelete(edu.id)}
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
        title={isNew ? 'New Education' : 'Edit Education'}
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
        {editing && <EducationForm editing={editing} setEditing={setEditing} />}
      </AdminModal>
    </div>
  );
}
