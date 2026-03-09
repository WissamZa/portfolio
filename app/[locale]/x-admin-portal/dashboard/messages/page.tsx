'use client';

import { useEffect, useState } from 'react';
import { Trash2, Mail, MailOpen } from 'lucide-react';
import { useAdminData } from '@/hooks/useAdminData';
import type { ContactMessage } from '@/lib/database.types';
import { cn } from '@/lib/utils';
import { Toaster } from 'react-hot-toast';
import AdminNav from '@/components/admin/AdminNav';

export default function AdminMessages() {
  const { items, loading, fetchItems, updateItem, deleteItem } = useAdminData<ContactMessage>('contact_messages');

  useEffect(() => { fetchItems(); }, [fetchItems]);

  const unread = items.filter(m => !m.is_read).length;

  const markRead = async (msg: ContactMessage) => {
    if (!msg.is_read) await updateItem(msg.id, { is_read: true });
  };

  return (
    <div className="flex h-screen bg-void">
      <AdminNav active="messages" />
      <Toaster position="top-right" />

      <main className="flex-1 overflow-auto p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold font-display text-text-primary">
            Messages<span className="text-neon-cyan">.</span>
          </h1>
          <p className="font-mono text-xs text-text-muted">
            {items.length} total — <span className="text-neon-orange">{unread} unread</span>
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><div className="spinner" /></div>
        ) : (
          <div className="space-y-3">
            {items.map((msg) => (
              <div
                key={msg.id}
                className={cn(
                  'glass-card p-5 cursor-pointer transition-all',
                  !msg.is_read ? 'border-neon-orange/30' : 'opacity-70'
                )}
                onClick={() => markRead(msg)}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className="mt-0.5 shrink-0">
                      {msg.is_read
                        ? <MailOpen size={16} className="text-text-muted" />
                        : <Mail size={16} className="text-neon-orange" />}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium text-text-primary text-sm">{msg.name}</span>
                        <span className="font-mono text-xs text-text-muted">{msg.email}</span>
                        {msg.subject && (
                          <span className="text-xs text-neon-cyan font-mono">— {msg.subject}</span>
                        )}
                      </div>
                      <p className="text-sm text-text-muted mt-1 line-clamp-2">{msg.message}</p>
                      <span className="text-xs text-text-muted/50 font-mono mt-1 block">
                        {new Date(msg.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); deleteItem(msg.id); }}
                    className="p-2 text-text-muted hover:text-red-400 transition-colors shrink-0"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
            {items.length === 0 && (
              <div className="text-center py-20 text-text-muted font-mono text-sm">
                No messages yet
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
