'use client';

import { useEffect, useState } from 'react';
import { Save, Loader } from 'lucide-react';
import { useAdminData } from '@/hooks/useAdminData';
import type { Profile } from '@/lib/database.types';
import { Toaster } from 'react-hot-toast';
import AdminNav from '@/components/admin/AdminNav';
import toast from 'react-hot-toast';

export default function AdminProfile() {
  const { items, loading, fetchItems, updateItem, createItem } = useAdminData<Profile>('profiles');
  const [form, setForm] = useState<Partial<Profile>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  useEffect(() => {
    if (items.length > 0) setForm(items[0]);
  }, [items]);

  const handleSave = async () => {
    setSaving(true);
    try {
      if (form.id) await updateItem(form.id, form);
      else await createItem(form);
      toast.success('Profile saved!');
    } finally {
      setSaving(false);
    }
  };

  const fields = [
    { key: 'name_en', label: 'Full Name (EN)', type: 'text' },
    { key: 'name_ar', label: 'Full Name (AR) الاسم', type: 'text', rtl: true },
    { key: 'title_en', label: 'Title (EN)', type: 'text' },
    { key: 'title_ar', label: 'Title (AR) المسمى', type: 'text', rtl: true },
    { key: 'email', label: 'Email', type: 'email' },
    { key: 'phone', label: 'Phone', type: 'text' },
    { key: 'location_en', label: 'Location (EN)', type: 'text' },
    { key: 'location_ar', label: 'Location (AR) الموقع', type: 'text', rtl: true },
    { key: 'github_url', label: 'GitHub URL', type: 'url' },
    { key: 'linkedin_url', label: 'LinkedIn URL', type: 'url' },
    { key: 'twitter_url', label: 'Twitter URL', type: 'url' },
    { key: 'avatar_url', label: 'Avatar URL', type: 'url' },
  ];

  return (
    <div className="flex h-screen bg-void">
      <AdminNav active="profile" />
      <Toaster position="top-right" />
      <main className="flex-1 overflow-auto p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold font-display text-text-primary">Profile<span className="text-neon-cyan">.</span></h1>
            <p className="font-mono text-xs text-text-muted">Personal information in both languages</p>
          </div>
          <button onClick={handleSave} disabled={saving} className="btn-neon-filled px-4 py-2 font-mono text-sm flex items-center gap-2">
            {saving ? <Loader size={16} className="animate-spin" /> : <Save size={16} />}
            Save Changes
          </button>
        </div>

        {loading ? <div className="flex justify-center py-20"><div className="spinner" /></div> : (
          <div className="max-w-3xl space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {fields.map(f => (
                <div key={f.key}>
                  <label className="block text-xs font-mono text-text-muted mb-1">{f.label}</label>
                  <input
                    type={f.type}
                    className={`input-neon ${f.rtl ? 'text-right font-arabic' : ''}`}
                    dir={f.rtl ? 'rtl' : 'ltr'}
                    value={(form as Record<string, unknown>)[f.key] as string || ''}
                    onChange={e => setForm({...form, [f.key]: e.target.value})}
                  />
                </div>
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-text-muted mb-1">Bio (EN)</label>
                <textarea rows={5} className="input-neon resize-none" value={form.bio_en||''} onChange={e=>setForm({...form,bio_en:e.target.value})} />
              </div>
              <div>
                <label className="block text-xs font-mono text-text-muted mb-1">Bio (AR) السيرة</label>
                <textarea rows={5} className="input-neon resize-none text-right font-arabic" dir="rtl" value={form.bio_ar||''} onChange={e=>setForm({...form,bio_ar:e.target.value})} />
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
