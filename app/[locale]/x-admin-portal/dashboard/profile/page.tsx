'use client';

import { useEffect, useState } from 'react';
import { Save, Loader } from 'lucide-react';
import { useAdminData } from '@/hooks/useAdminData';
import type { Profile } from '@/lib/database.types';
import { AdminHeader } from '@/components/admin/AdminHeader';
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
      toast.success('Profile updated successfully');
      fetchItems();
    } catch (err) {
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const fields = [
    { key: 'name_en', label: 'Full Name (EN)', type: 'text' },
    { key: 'name_ar', label: 'Full Name (AR)', type: 'text', rtl: true },
    { key: 'title_en', label: 'Title (EN)', type: 'text' },
    { key: 'title_ar', label: 'Title (AR)', type: 'text', rtl: true },
    { key: 'email', label: 'Email', type: 'email' },
    { key: 'phone', label: 'Phone', type: 'text' },
    { key: 'location_en', label: 'Location (EN)', type: 'text' },
    { key: 'location_ar', label: 'Location (AR)', type: 'text', rtl: true },
    { key: 'github_url', label: 'GitHub URL', type: 'url' },
    { key: 'linkedin_url', label: 'LinkedIn URL', type: 'url' },
    { key: 'twitter_url', label: 'Twitter URL', type: 'url' },
    { key: 'avatar_url', label: 'Avatar URL', type: 'url' },
  ];

  return (
    <div className="p-8">
      <AdminHeader
        title="Profile"
        onAdd={handleSave}
        addButtonLabel={saving ? "Saving..." : "Save Changes"}
      />

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="spinner" />
        </div>
      ) : (
        <div className="max-w-4xl space-y-8 animate-in fade-in duration-500">
          <div className="glass-card p-6 border-neon-cyan/10">
            <h3 className="font-mono text-xs text-neon-cyan uppercase tracking-widest mb-6 px-2 border-l-2 border-neon-cyan">
              General Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {fields.map(f => (
                <div key={f.key}>
                  <label className="block text-[10px] font-mono text-text-muted mb-1.5 uppercase tracking-tighter">
                    {f.label}
                  </label>
                  <input
                    type={f.type}
                    className={`input-neon text-sm ${f.rtl ? 'text-right font-arabic' : 'font-mono'}`}
                    dir={f.rtl ? 'rtl' : 'ltr'}
                    value={(form as Record<string, any>)[f.key] || ''}
                    onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card p-6 border-neon-cyan/10">
            <h3 className="font-mono text-xs text-neon-cyan uppercase tracking-widest mb-6 px-2 border-l-2 border-neon-cyan">
              Biography
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-[10px] font-mono text-text-muted mb-1.5 uppercase tracking-tighter">Bio (EN)</label>
                <textarea
                  rows={5}
                  className="input-neon resize-none text-sm font-display leading-relaxed"
                  value={form.bio_en || ''}
                  onChange={e => setForm({ ...form, bio_en: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-[10px] font-mono text-text-muted mb-1.5 uppercase tracking-tighter text-right">Bio (AR)</label>
                <textarea
                  rows={5}
                  className="input-neon resize-none text-right font-arabic text-sm leading-relaxed"
                  dir="rtl"
                  value={form.bio_ar || ''}
                  onChange={e => setForm({ ...form, bio_ar: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button
              onClick={handleSave}
              disabled={saving}
              className="btn-neon-filled px-8 py-3 font-mono text-sm flex items-center gap-2 group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              {saving ? <Loader size={16} className="animate-spin" /> : <Save size={16} />}
              <span>{saving ? 'UPDATING...' : 'UPDATE PROFILE'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
