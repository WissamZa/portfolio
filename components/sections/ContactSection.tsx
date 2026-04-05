'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Mail, MapPin, Phone } from 'lucide-react';
import type { Profile, Locale } from '@/lib/database.types';
import { getT } from '@/lib/i18n';
import { cn } from '@/lib/utils';
import SectionHeader from '../ui/SectionHeader';

interface ContactProps {
  profile: Profile | null;
  locale: Locale;
}

export default function ContactSection({ profile, locale }: ContactProps) {
  const t = getT(locale);
  const isAr = locale === 'ar';
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      setStatus('success');
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch {
      setStatus('error');
    }
  };

  return (
    <section id="contact" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          tag="// contact"
          title={t.contact.title}
          subtitle={t.contact.subtitle}
          isAr={isAr}
        />

        <div className={cn('mt-12 grid md:grid-cols-2 gap-12', isAr && 'md:grid-flow-col-dense')}>
          {/* Contact info */}
          <motion.div
            initial={{ opacity: 0, x: isAr ? 20 : -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className={cn('space-y-6', isAr && 'text-right')}
          >
            <div className="font-mono text-text-muted text-sm leading-relaxed">
              <span className="text-neon-cyan">{'>'}</span>{' '}
              {isAr
                ? 'هل لديك مشروع تريد بناءه؟ أو فقط تريد التواصل؟'
                : "Have a project you'd like to build? Or just want to connect?"}
            </div>

            {profile?.email && (
              <a href={`mailto:${profile.email}`}
                className="flex items-center justify-between w-full sm:w-80 gap-3 text-text-muted hover:text-neon-cyan transition-colors group">
                <span className="font-mono text-sm">{profile.email}</span>
                <div className="w-10 h-10 border border-glass-border flex items-center justify-center group-hover:border-neon-cyan/50 transition-colors shrink-0">
                  <Mail size={16} />
                </div>
              </a>
            )}

            {profile?.phone && (
              <a href={`tel:${profile.phone}`}
                className="flex items-center justify-between w-full sm:w-80 gap-3 text-text-muted hover:text-neon-cyan transition-colors group">
                <span className="font-mono text-sm">{profile.phone}</span>
                <div className="w-10 h-10 border border-glass-border flex items-center justify-center group-hover:border-neon-cyan/50 transition-colors shrink-0">
                  <Phone size={16} />
                </div>
              </a>
            )}

            {(profile?.location_en || profile?.location_ar) && (
              <div className="flex items-center justify-between w-full sm:w-80 gap-3 text-text-muted">
                <span className={cn('font-mono text-sm', isAr && 'font-arabic')}>
                  {isAr ? profile.location_ar : profile.location_en}
                </span>
                <div className="w-10 h-10 border border-glass-border flex items-center justify-center shrink-0">
                  <MapPin size={16} />
                </div>
              </div>
            )}

            {/* Decorative code comment */}
            <div className="font-mono text-xs text-text-muted/40 mt-8 space-y-1">
              <div>{'// response_time: &lt; 24h'}</div>
              <div>{'// availability: open_to_opportunities'}</div>
            </div>
          </motion.div>

          {/* Contact form */}
          <motion.form
            initial={{ opacity: 0, x: isAr ? -20 : 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            onSubmit={handleSubmit}
            className={cn('space-y-4 glass-card p-6', isAr && 'text-right')}
          >
            <div className={cn('grid grid-cols-2 gap-4', isAr && '')}>
              <div>
                <label className={cn('block text-xs font-mono text-text-muted mb-1', isAr && 'text-right')}>
                  {t.contact.name}
                </label>
                <input
                  type="text"
                  className="input-neon rounded-none"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className={cn('block text-xs font-mono text-text-muted mb-1', isAr && 'text-right')}>
                  {t.contact.email}
                </label>
                <input
                  type="email"
                  className="input-neon rounded-none"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                />
              </div>
            </div>

            <div>
              <label className={cn('block text-xs font-mono text-text-muted mb-1', isAr && 'text-right')}>
                {t.contact.subject}
              </label>
              <input
                type="text"
                className="input-neon rounded-none"
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
              />
            </div>

            <div>
              <label className={cn('block text-xs font-mono text-text-muted mb-1', isAr && 'text-right')}>
                {t.contact.message}
              </label>
              <textarea
                rows={5}
                className="input-neon rounded-none resize-none"
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                required
              />
            </div>

            {status === 'success' && (
              <p className="text-neon-green text-sm font-mono">{t.contact.success}</p>
            )}
            {status === 'error' && (
              <p className="text-red-400 text-sm font-mono">{t.contact.error}</p>
            )}

            <button
              type="submit"
              disabled={status === 'sending'}
              className={cn(
                'w-full btn-neon-filled py-3 font-mono text-sm flex items-center justify-center gap-2',
                status === 'sending' && 'opacity-70 cursor-not-allowed'
              )}
            >
              <Send size={16} />
              {status === 'sending' ? t.contact.sending : t.contact.send}
            </button>
          </motion.form>
        </div>
      </div>
    </section>
  );
}
