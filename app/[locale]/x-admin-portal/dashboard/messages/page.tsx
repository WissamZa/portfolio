'use client';

import { useEffect } from 'react';
import { Trash2, Mail, MailOpen } from 'lucide-react';
import { useAdminData } from '@/hooks/useAdminData';
import type { ContactMessage } from '@/lib/database.types';
import { cn } from '@/lib/utils';
import { AdminHeader } from '@/components/admin/AdminHeader';
import toast from 'react-hot-toast';

export default function AdminMessages() {
  const { items, loading, fetchItems, updateItem, deleteItem } = useAdminData<ContactMessage>('contact_messages');

  useEffect(() => { fetchItems(); }, [fetchItems]);

  const unreadCount = items.filter(m => !m.is_read).length;

  const markRead = async (msg: ContactMessage) => {
    if (!msg.is_read) {
      try {
        await updateItem(msg.id, { is_read: true });
        fetchItems();
      } catch (_err) {
        // Silent fail for auto-mark-read
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this message?')) {
      try {
        await deleteItem(id);
        fetchItems();
        toast.success('Message deleted');
      } catch (_err) {
        toast.error('Failed to delete');
      }
    }
  };

  return (
    <div className="p-8">
      <AdminHeader
        title="Messages"
        count={items.length}
        itemLabel={`total — ${unreadCount} unread`}
      />

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="spinner" />
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((msg) => (
            <div
              key={msg.id}
              className={cn(
                'glass-card p-5 cursor-pointer transition-all group',
                !msg.is_read ? 'border-neon-orange/30 bg-neon-orange/5' : 'opacity-70 grayscale-[0.5] hover:opacity-100 hover:grayscale-0'
              )}
              onClick={() => markRead(msg)}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4 flex-1 min-w-0">
                  <div className="mt-1 shrink-0">
                    {msg.is_read
                      ? <MailOpen size={18} className="text-text-muted" />
                      : <Mail size={18} className="text-neon-orange drop-shadow-[0_0_8px_rgba(255,165,0,0.4)]" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-3 flex-wrap mb-1">
                      <span className="font-bold text-text-primary text-sm uppercase tracking-tight">{msg.name}</span>
                      <span className="font-mono text-[10px] text-text-muted bg-void-3 px-1.5 py-0.5 border border-glass-border">{msg.email}</span>
                      {msg.subject && (
                        <span className="text-[10px] text-neon-cyan font-mono tracking-widest uppercase">/ {msg.subject}</span>
                      )}
                    </div>
                    <p className="text-sm text-text-primary mt-2 font-display leading-relaxed opacity-90 line-clamp-3">
                      {msg.message}
                    </p>
                    <div className="flex items-center gap-2 mt-3">
                      <span className="text-[10px] text-text-muted font-mono uppercase">
                        RECEIVED: {new Date(msg.created_at).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); handleDelete(msg.id); }}
                  className="w-9 h-9 flex items-center justify-center text-text-muted hover:text-red-400 border border-glass-border hover:border-red-400/30 transition-all bg-void-2 shrink-0 group-hover:border-glass-border/80"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
          {items.length === 0 && (
            <div className="glass-card border-dashed border-glass-border py-20 text-center">
              <div className="text-text-muted font-mono text-sm uppercase tracking-[0.2em] opacity-30">
                Inbox Empty
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
