'use client';

import { useEffect, useState } from 'react';
import { Pencil, Trash2, Save } from 'lucide-react';
import { useAdminData } from '@/hooks/useAdminData';
import type { Skill } from '@/lib/database.types';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { AdminModal } from '@/components/admin/AdminModal';
import { SkillForm } from './SkillForm';
import toast from 'react-hot-toast';

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
    try {
      if (isNew) await createItem(editing);
      else await updateItem(editing.id!, editing);
      setEditing(null);
      fetchItems();
      toast.success(isNew ? 'Skill added' : 'Skill updated');
    } catch (_err) {
      toast.error('Failed to save');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this skill?')) {
      try {
        await deleteItem(id);
        fetchItems();
        toast.success('Skill deleted');
      } catch (_err) {
        toast.error('Failed to delete');
      }
    }
  };

  const grouped = CATEGORIES.reduce((acc, cat) => {
    acc[cat] = items.filter(s => s.category === cat);
    return acc;
  }, {} as Record<string, Skill[]>);

  return (
    <div className="p-8">
      <AdminHeader
        title="Skills"
        count={items.length}
        itemLabel="skills"
        onAdd={() => { setEditing({ ...EMPTY }); setIsNew(true); }}
        addButtonLabel="Add Skill"
      />

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="spinner" />
        </div>
      ) : (
        <div className="space-y-8">
          {CATEGORIES.filter(cat => grouped[cat].length > 0).map(cat => (
            <div key={cat}>
              <h3 className="font-mono text-xs text-neon-cyan uppercase tracking-[0.2em] mb-4 border-l-2 border-neon-cyan pl-3">
                {cat}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {grouped[cat].map(skill => (
                  <div key={skill.id} className="glass-card p-4 flex items-center justify-between gap-3 group hover:border-neon-cyan/20 transition-all">
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-text-primary capitalize">{skill.name_en}</div>
                      <div className="text-[10px] text-text-muted font-arabic mt-0.5">{skill.name_ar}</div>
                      <div className="flex items-center gap-2 mt-3">
                        <div className="skill-bar flex-1 h-1 bg-void-3 border border-glass-border">
                          <div className="skill-bar-fill h-full bg-neon-cyan shadow-[0_0_8px_rgba(0,245,255,0.5)]" style={{ width: `${skill.proficiency}%` }} />
                        </div>
                        <span className="font-mono text-[10px] text-neon-cyan">{skill.proficiency}%</span>
                      </div>
                    </div>
                    <div className="flex gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => { setEditing({ ...skill }); setIsNew(false); }} className="p-1.5 text-text-muted hover:text-neon-cyan transition-colors">
                        <Pencil size={13} />
                      </button>
                      <button onClick={() => handleDelete(skill.id)} className="p-1.5 text-text-muted hover:text-red-400 transition-colors">
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <AdminModal
        title={isNew ? 'New Skill' : 'Edit Skill'}
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
        {editing && <SkillForm editing={editing} setEditing={setEditing} />}
      </AdminModal>
    </div>
  );
}
