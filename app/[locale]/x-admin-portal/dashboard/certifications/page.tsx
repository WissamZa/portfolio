'use client';

import { useEffect, useState } from 'react';
import { Pencil, Trash2, Save, Award, ExternalLink } from 'lucide-react';
import { useAdminData } from '@/hooks/useAdminData';
import type { Certification } from '@/lib/database.types';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { AdminModal } from '@/components/admin/AdminModal';
import { CertificationForm } from './CertificationForm';
import toast from 'react-hot-toast';

const EMPTY: Partial<Certification> = {
  name_en: '', name_ar: '', issuer_en: '', issuer_ar: '',
  credential_id: '', credential_url: '', order_index: 0,
};

export default function AdminCertifications() {
  const { items, loading, fetchItems, createItem, updateItem, deleteItem } = useAdminData<Certification>('certifications');
  const [editing, setEditing] = useState<Partial<Certification> | null>(null);
  const [isNew, setIsNew] = useState(false);

  useEffect(() => { fetchItems(); }, [fetchItems]);

  const handleSave = async () => {
    if (!editing) return;
    try {
      if (isNew) await createItem(editing);
      else await updateItem(editing.id!, editing);
      setEditing(null);
      fetchItems();
      toast.success(isNew ? 'Certification added' : 'Certification updated');
    } catch (_err) {
      toast.error('Failed to save');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this certification?')) {
      try {
        await deleteItem(id);
        fetchItems();
        toast.success('Certification deleted');
      } catch (_err) {
        toast.error('Failed to delete');
      }
    }
  };

  return (
    <div className="p-8">
      <AdminHeader
        title="Certifications"
        count={items.length}
        itemLabel="certifications"
        onAdd={() => { setEditing({ ...EMPTY }); setIsNew(true); }}
        addButtonLabel="Add Certification"
      />

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="spinner" />
        </div>
      ) : items.length === 0 ? (
        <div className="glass-card p-12 text-center border-dashed border-glass-border">
          <Award size={48} className="mx-auto mb-4 text-text-muted/30" />
          <p className="font-mono text-text-muted text-sm uppercase tracking-widest">No certifications found</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {items.map((cert) => (
            <div key={cert.id} className="glass-card p-5 group hover:border-neon-cyan/20 transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between gap-2 mb-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-text-primary text-sm tracking-wide">{cert.name_en}</h3>
                    <p className="text-[10px] text-neon-cyan font-mono uppercase mt-1">{cert.issuer_en}</p>
                    {cert.name_ar && (
                      <p className="text-[10px] text-text-muted font-arabic mt-1 text-right" dir="rtl">{cert.name_ar}</p>
                    )}
                  </div>
                  <div className="flex gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => { setEditing({ ...cert }); setIsNew(false); }}
                      className="w-7 h-7 flex items-center justify-center border border-glass-border text-text-muted hover:text-neon-cyan hover:border-neon-cyan/30 transition-colors"
                    >
                      <Pencil size={12} />
                    </button>
                    <button
                      onClick={() => handleDelete(cert.id)}
                      className="w-7 h-7 flex items-center justify-center border border-glass-border text-text-muted hover:text-red-400 hover:border-red-400/30 transition-colors"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5 border-t border-glass-border/50 pt-3">
                  {cert.issue_date && (
                    <p className="font-mono text-[10px] text-text-muted flex justify-between">
                      <span>ISSUED:</span>
                      <span className="text-text-primary">
                        {new Date(cert.issue_date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}
                      </span>
                    </p>
                  )}
                  {cert.credential_id && (
                    <p className="font-mono text-[10px] text-text-muted flex justify-between truncate">
                      <span>ID:</span>
                      <span className="text-text-primary truncate ml-2">{cert.credential_id}</span>
                    </p>
                  )}
                </div>
              </div>

              {cert.credential_url && (
                <a
                  href={cert.credential_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 flex items-center justify-center gap-2 text-[10px] text-neon-cyan hover:text-white border border-neon-cyan/20 hover:bg-neon-cyan/10 py-2 font-mono uppercase tracking-widest transition-all"
                >
                  <ExternalLink size={10} /> Verify Credential
                </a>
              )}
            </div>
          ))}
        </div>
      )}

      <AdminModal
        title={isNew ? 'New Certification' : 'Edit Certification'}
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
        {editing && <CertificationForm editing={editing} setEditing={setEditing} />}
      </AdminModal>
    </div>
  );
}
