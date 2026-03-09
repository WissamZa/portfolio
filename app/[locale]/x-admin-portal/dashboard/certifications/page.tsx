'use client';

import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, X, Save, Award, ExternalLink } from 'lucide-react';
import { useAdminData } from '@/hooks/useAdminData';
import type { Certification } from '@/lib/database.types';
import { cn } from '@/lib/utils';
import { Toaster } from 'react-hot-toast';
import AdminNav from '@/components/admin/AdminNav';

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
    if (isNew) await createItem(editing);
    else await updateItem(editing.id!, editing);
    setEditing(null);
    fetchItems();
  };

  return (
    <div className="flex h-screen bg-void">
      <AdminNav active="certifications" />
      <Toaster position="top-right" />

      <main className="flex-1 overflow-auto p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold font-display text-text-primary">
              Certifications<span className="text-neon-cyan">.</span>
            </h1>
            <p className="font-mono text-xs text-text-muted">{items.length} certifications</p>
          </div>
          <button
            onClick={() => { setEditing({ ...EMPTY }); setIsNew(true); }}
            className="btn-neon-filled px-4 py-2 font-mono text-sm flex items-center gap-2"
          >
            <Plus size={16} /> Add Certification
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><div className="spinner" /></div>
        ) : items.length === 0 ? (
          <div className="glass-card p-12 text-center">
            <Award size={48} className="mx-auto mb-4 text-text-muted/30" />
            <p className="font-mono text-text-muted text-sm">No certifications yet</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {items.map((cert) => (
              <div key={cert.id} className="glass-card p-5 hover:border-neon-cyan/20 transition-all group">
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-text-primary truncate text-sm">{cert.name_en}</h3>
                    <p className="text-xs text-neon-cyan font-mono mt-0.5">{cert.issuer_en}</p>
                    {cert.name_ar && (
                      <p className="text-xs text-text-muted font-arabic mt-0.5 text-right" dir="rtl">{cert.name_ar}</p>
                    )}
                  </div>
                  <div className="flex gap-1.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => { setEditing({ ...cert }); setIsNew(false); }}
                      className="w-7 h-7 flex items-center justify-center border border-glass-border text-text-muted hover:text-neon-cyan hover:border-neon-cyan/30 transition-colors"
                    >
                      <Pencil size={12} />
                    </button>
                    <button
                      onClick={() => confirm('Delete this certification?') && deleteItem(cert.id)}
                      className="w-7 h-7 flex items-center justify-center border border-glass-border text-text-muted hover:text-red-400 hover:border-red-400/30 transition-colors"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>

                <div className="space-y-1 mt-3">
                  {cert.issue_date && (
                    <p className="font-mono text-xs text-text-muted">
                      Issued: {new Date(cert.issue_date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}
                    </p>
                  )}
                  {cert.credential_id && (
                    <p className="font-mono text-xs text-text-muted truncate">ID: {cert.credential_id}</p>
                  )}
                  {cert.credential_url && (
                    <a
                      href={cert.credential_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-xs text-neon-cyan hover:underline font-mono"
                    >
                      <ExternalLink size={11} /> Verify
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Modal */}
      {editing && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-start justify-center overflow-auto py-8 px-4">
          <div className="w-full max-w-2xl glass-card border border-neon-cyan/20">
            <div className="flex items-center justify-between p-5 border-b border-glass-border">
              <h2 className="font-mono text-neon-cyan">{isNew ? 'New Certification' : 'Edit Certification'}</h2>
              <button onClick={() => setEditing(null)} className="text-text-muted hover:text-text-primary">
                <X size={18} />
              </button>
            </div>

            <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-text-muted mb-1">Name (EN)</label>
                  <input className="input-neon" value={editing.name_en || ''} onChange={e => setEditing({ ...editing, name_en: e.target.value })} />
                </div>
                <div>
                  <label className="block text-xs font-mono text-text-muted mb-1">Name (AR) اسم</label>
                  <input className="input-neon text-right" dir="rtl" value={editing.name_ar || ''} onChange={e => setEditing({ ...editing, name_ar: e.target.value })} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-text-muted mb-1">Issuer (EN)</label>
                  <input className="input-neon" value={editing.issuer_en || ''} onChange={e => setEditing({ ...editing, issuer_en: e.target.value })} />
                </div>
                <div>
                  <label className="block text-xs font-mono text-text-muted mb-1">Issuer (AR) جهة</label>
                  <input className="input-neon text-right" dir="rtl" value={editing.issuer_ar || ''} onChange={e => setEditing({ ...editing, issuer_ar: e.target.value })} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-text-muted mb-1">Issue Date</label>
                  <input type="date" className="input-neon" value={editing.issue_date || ''} onChange={e => setEditing({ ...editing, issue_date: e.target.value })} />
                </div>
                <div>
                  <label className="block text-xs font-mono text-text-muted mb-1">Expiry Date</label>
                  <input type="date" className="input-neon" value={editing.expiry_date || ''} onChange={e => setEditing({ ...editing, expiry_date: e.target.value })} />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-text-muted mb-1">Credential ID</label>
                <input className="input-neon" value={editing.credential_id || ''} onChange={e => setEditing({ ...editing, credential_id: e.target.value })} />
              </div>

              <div>
                <label className="block text-xs font-mono text-text-muted mb-1">Credential URL</label>
                <input type="url" className="input-neon" value={editing.credential_url || ''} onChange={e => setEditing({ ...editing, credential_url: e.target.value })} />
              </div>

              <div>
                <label className="block text-xs font-mono text-text-muted mb-1">Order Index</label>
                <input type="number" className="input-neon" value={editing.order_index || 0} onChange={e => setEditing({ ...editing, order_index: +e.target.value })} />
              </div>
            </div>

            <div className="flex justify-end gap-3 p-5 border-t border-glass-border">
              <button onClick={() => setEditing(null)} className="btn-neon px-4 py-2 text-sm font-mono">Cancel</button>
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
