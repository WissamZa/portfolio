'use client';

import { useState } from 'react';
import { useUser } from '@stackframe/stack';
import {
  User,
  Lock,
  Shield,
  Bell,
  Eye,
  EyeOff,
  Save,
  AlertTriangle,
  CheckCircle,
  Loader2,
  KeyRound,
  Mail,
  LogOut,
  Trash2,
  ChevronRight,
  Fingerprint,
  Plus,
  X,
} from 'lucide-react';
import { AdminHeader } from '@/components/admin/AdminHeader';

/* ─── tiny helper ─── */
type Status = 'idle' | 'loading' | 'success' | 'error';

function StatusBadge({ status, msg }: { status: Status; msg?: string }) {
  if (status === 'idle') return null;
  const map: Record<Exclude<Status, 'idle'>, { icon: React.ReactNode; color: string }> = {
    loading: { icon: <Loader2 size={14} className="animate-spin" />, color: 'text-neon-cyan' },
    success: { icon: <CheckCircle size={14} />, color: 'text-neon-green' },
    error: { icon: <AlertTriangle size={14} />, color: 'text-red-400' },
  };
  const { icon, color } = map[status as Exclude<Status, 'idle'>];
  return (
    <span className={`flex items-center gap-1.5 font-mono text-xs ${color}`}>
      {icon} {msg}
    </span>
  );
}

/* ─── Section wrapper ─── */
function Section({
  icon: Icon,
  title,
  accent = 'cyan',
  children,
}: {
  icon: React.ElementType;
  title: string;
  accent?: 'cyan' | 'purple' | 'green' | 'orange';
  children: React.ReactNode;
}) {
  const accentVars: Record<string, string> = {
    cyan: 'var(--neon-cyan)',
    purple: 'var(--neon-purple)',
    green: 'var(--neon-green)',
    orange: 'var(--neon-orange)',
  };
  const color = accentVars[accent];

  return (
    <div
      className="glass-card rounded-none overflow-hidden"
      style={{ borderColor: `color-mix(in srgb, ${color} 20%, transparent)` }}
    >
      {/* Section header bar */}
      <div
        className="flex items-center gap-3 px-6 py-4 border-b"
        style={{
          background: `linear-gradient(90deg, color-mix(in srgb, ${color} 8%, transparent), transparent)`,
          borderColor: `color-mix(in srgb, ${color} 20%, transparent)`,
        }}
      >
        <div
          className="w-8 h-8 flex items-center justify-center border"
          style={{ borderColor: `color-mix(in srgb, ${color} 40%, transparent)`, color }}
        >
          <Icon size={15} />
        </div>
        <h2
          className="font-mono text-sm font-bold tracking-widest uppercase"
          style={{ color }}
        >
          {title}
        </h2>
        <div className="flex-1 h-px ml-2" style={{ background: `linear-gradient(90deg, ${color}33, transparent)` }} />
      </div>

      <div className="p-6 space-y-5">{children}</div>
    </div>
  );
}

/* ─── Field row ─── */
function Field({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) {
  return (
    <div className="space-y-1.5">
      <label className="font-mono text-[11px] text-text-muted uppercase tracking-widest">{label}</label>
      {children}
      {hint && <p className="font-mono text-[10px] text-text-muted/60">{hint}</p>}
    </div>
  );
}

/* ─── Input ─── */
function NeonInput(props: React.InputHTMLAttributes<HTMLInputElement> & { accent?: string }) {
  const { accent = 'var(--neon-cyan)', className = '', ...rest } = props;
  return (
    <input
      {...rest}
      className={`w-full bg-void-2 border border-glass-border text-text-primary font-mono text-sm px-4 py-2.5
        focus:outline-none transition-all duration-200 placeholder:text-text-muted/40 ${className}`}
      style={{
        // @ts-ignore
        '--tw-ring-color': accent,
      }}
      onFocus={e => {
        e.currentTarget.style.borderColor = accent;
        e.currentTarget.style.boxShadow = `0 0 0 1px ${accent}22, 0 0 16px ${accent}11`;
      }}
      onBlur={e => {
        e.currentTarget.style.borderColor = '';
        e.currentTarget.style.boxShadow = '';
      }}
    />
  );
}

/* ─── Danger button ─── */
function DangerButton({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 border border-red-500/30 text-red-400 font-mono text-xs px-4 py-2.5
        hover:bg-red-500/10 hover:border-red-500/60 transition-all duration-200 uppercase tracking-widest"
    >
      {children}
    </button>
  );
}

/* ─── Primary button ─── */
function PrimaryButton({
  onClick,
  children,
  status,
  accent = 'cyan',
}: {
  onClick: () => void;
  children: React.ReactNode;
  status?: Status;
  accent?: 'cyan' | 'purple' | 'green';
}) {
  const accentVars: Record<string, string> = {
    cyan: 'var(--neon-cyan)',
    purple: 'var(--neon-purple)',
    green: 'var(--neon-green)',
  };
  const color = accentVars[accent];
  const disabled = status === 'loading';

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="flex items-center gap-2 font-mono text-xs px-5 py-2.5 uppercase tracking-widest
        transition-all duration-200 disabled:opacity-50"
      style={{
        border: `1px solid ${color}`,
        color,
        background: disabled ? `${color}10` : 'transparent',
      }}
      onMouseEnter={e => { if (!disabled) e.currentTarget.style.background = `${color}15`; }}
      onMouseLeave={e => { e.currentTarget.style.background = disabled ? `${color}10` : 'transparent'; }}
    >
      {status === 'loading' ? <Loader2 size={13} className="animate-spin" /> : null}
      {children}
    </button>
  );
}

/* ══════════════════════════════════════════════
   MAIN PAGE
══════════════════════════════════════════════ */
export default function AdminSettings() {
  const user = useUser();

  /* Profile */
  const [displayName, setDisplayName] = useState(user?.displayName ?? '');
  const [profileStatus, setProfileStatus] = useState<Status>('idle');
  const [profileMsg, setProfileMsg] = useState('');

  /* Password */
  const [currentPwd, setCurrentPwd] = useState('');
  const [newPwd, setNewPwd] = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [pwdStatus, setPwdStatus] = useState<Status>('idle');
  const [pwdMsg, setPwdMsg] = useState('');

  /* Notifications */
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [securityAlerts, setSecurityAlerts] = useState(true);

  /* Delete confirm */
  const [deleteConfirm, setDeleteConfirm] = useState('');

  /* ── Handlers ── */
  const handleProfileSave = async () => {
    setProfileStatus('loading');
    try {
      await user?.update({ displayName });
      setProfileStatus('success');
      setProfileMsg('Display name updated');
    } catch {
      setProfileStatus('error');
      setProfileMsg('Failed to update profile');
    }
    setTimeout(() => setProfileStatus('idle'), 3000);
  };

  const handlePasswordChange = async () => {
    if (newPwd !== confirmPwd) {
      setPwdStatus('error');
      setPwdMsg('Passwords do not match');
      setTimeout(() => setPwdStatus('idle'), 3000);
      return;
    }
    if (newPwd.length < 8) {
      setPwdStatus('error');
      setPwdMsg('Password must be at least 8 characters');
      setTimeout(() => setPwdStatus('idle'), 3000);
      return;
    }
    setPwdStatus('loading');
    try {
      // Stack Auth password update via client
      await (user as any)?.updatePassword?.({ oldPassword: currentPwd, newPassword: newPwd });
      setPwdStatus('success');
      setPwdMsg('Password updated successfully');
      setCurrentPwd(''); setNewPwd(''); setConfirmPwd('');
    } catch {
      setPwdStatus('error');
      setPwdMsg('Failed to update password');
    }
    setTimeout(() => setPwdStatus('idle'), 3000);
  };

  /* Passkey */
  const [passkeyStatus, setPasskeyStatus] = useState<Status>('idle');
  const [passkeyMsg, setPasskeyMsg] = useState('');
  const [removeStatus, setRemoveStatus] = useState<Status>('idle');
  const [removeMsg, setRemoveMsg] = useState('');

  const handleAddPasskey = async () => {
    setPasskeyStatus('loading');
    try {
      const result = await (user as any)?.registerPasskey?.();
      if (result?.status === 'error') {
        throw new Error(result.error?.message ?? 'Registration failed');
      }
      setPasskeyStatus('success');
      setPasskeyMsg('Passkey registered successfully');
    } catch (e: any) {
      setPasskeyStatus('error');
      setPasskeyMsg(e?.message ?? 'Failed to register passkey');
    }
    setTimeout(() => setPasskeyStatus('idle'), 4000);
  };

  const handleRemovePasskey = async () => {
    setRemoveStatus('loading');
    try {
      await user?.update({ passkeyAuthEnabled: false } as any);
      setRemoveStatus('success');
      setRemoveMsg('Passkey removed');
    } catch {
      setRemoveStatus('error');
      setRemoveMsg('Failed to remove passkey');
    }
    setTimeout(() => setRemoveStatus('idle'), 4000);
  };

  const handleSignOut = async () => {
    await user?.signOut();
  };

  return (
    <div className="p-8 space-y-6 max-w-3xl">
      <AdminHeader
        title="Settings"
        itemLabel="Account & security configuration"
      />

      {/* ── Account Info bar ── */}
      <div className="glass-card px-6 py-4 flex items-center gap-4 border-neon-cyan/10">
        {/* Avatar glyph */}
        <div className="w-12 h-12 border border-neon-cyan/40 flex items-center justify-center bg-neon-cyan/5 shrink-0">
          <span className="font-mono text-neon-cyan text-lg font-bold select-none">
            {(user?.displayName ?? user?.primaryEmail ?? 'A')[0].toUpperCase()}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-mono text-sm text-text-primary font-bold truncate">
            {user?.displayName || <span className="text-text-muted italic">No display name</span>}
          </p>
          <p className="font-mono text-xs text-text-muted truncate">{user?.primaryEmail}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-neon-green animate-pulse" />
          <span className="font-mono text-[10px] text-neon-green uppercase tracking-widest">Active</span>
        </div>
      </div>

      {/* ── Profile ── */}
      <Section icon={User} title="Profile" accent="cyan">
        <Field label="Display Name" hint="Shown in the admin panel header">
          <NeonInput
            value={displayName}
            onChange={e => setDisplayName(e.target.value)}
            placeholder="Enter display name…"
          />
        </Field>
        <Field label="Email Address" hint="Managed by your auth provider — contact support to change">
          <NeonInput
            value={user?.primaryEmail ?? ''}
            disabled
            className="opacity-50 cursor-not-allowed"
          />
        </Field>
        <div className="flex items-center justify-between pt-1">
          <StatusBadge status={profileStatus} msg={profileMsg} />
          <PrimaryButton onClick={handleProfileSave} status={profileStatus} accent="cyan">
            <Save size={13} /> Save Profile
          </PrimaryButton>
        </div>
      </Section>

      {/* ── Password ── */}
      <Section icon={Lock} title="Change Password" accent="purple">
        <Field label="Current Password">
          <div className="relative">
            <NeonInput
              type={showPwd ? 'text' : 'password'}
              value={currentPwd}
              onChange={e => setCurrentPwd(e.target.value)}
              placeholder="Enter current password…"
              accent="var(--neon-purple)"
            />
            <button
              type="button"
              onClick={() => setShowPwd(v => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-neon-purple transition-colors"
            >
              {showPwd ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
          </div>
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="New Password">
            <NeonInput
              type={showPwd ? 'text' : 'password'}
              value={newPwd}
              onChange={e => setNewPwd(e.target.value)}
              placeholder="Min. 8 characters"
              accent="var(--neon-purple)"
            />
          </Field>
          <Field label="Confirm Password">
            <NeonInput
              type={showPwd ? 'text' : 'password'}
              value={confirmPwd}
              onChange={e => setConfirmPwd(e.target.value)}
              placeholder="Repeat new password"
              accent="var(--neon-purple)"
            />
          </Field>
        </div>
        {/* Strength meter */}
        {newPwd.length > 0 && (
          <div className="space-y-1">
            <div className="flex gap-1">
              {[1, 2, 3, 4].map(i => {
                const strength = Math.min(4, Math.floor(newPwd.length / 3));
                const colors = ['', '#ef4444', '#f97316', '#eab308', 'var(--neon-green)'];
                return (
                  <div
                    key={i}
                    className="flex-1 h-1 transition-all duration-300"
                    style={{
                      background: i <= strength ? colors[strength] : 'rgba(255,255,255,0.06)',
                    }}
                  />
                );
              })}
            </div>
            <p className="font-mono text-[10px] text-text-muted/70">
              {['', 'Weak', 'Fair', 'Good', 'Strong'][Math.min(4, Math.floor(newPwd.length / 3))]} password
            </p>
          </div>
        )}
        <div className="flex items-center justify-between pt-1">
          <StatusBadge status={pwdStatus} msg={pwdMsg} />
          <PrimaryButton onClick={handlePasswordChange} status={pwdStatus} accent="purple">
            <KeyRound size={13} /> Update Password
          </PrimaryButton>
        </div>
      </Section>

      {/* ── Passkey ── */}
      <Section icon={Fingerprint} title="Passkey Authentication" accent="green">
        {/* Status chip */}
        <div className="flex items-center gap-3 p-4 bg-void-3 border border-glass-border">
          <div
            className="w-2 h-2 rounded-full shrink-0"
            style={{
              background: (user as any)?.passkeyAuthEnabled
                ? 'var(--neon-green)'
                : 'rgba(255,255,255,0.2)',
              boxShadow: (user as any)?.passkeyAuthEnabled
                ? '0 0 8px var(--neon-green)'
                : 'none',
            }}
          />
          <div className="flex-1">
            <p className="font-mono text-sm text-text-primary">
              {(user as any)?.passkeyAuthEnabled ? 'Passkey enabled' : 'No passkey registered'}
            </p>
            <p className="font-mono text-[10px] text-text-muted/70">
              {(user as any)?.passkeyAuthEnabled
                ? 'You can sign in using your device biometric or hardware key'
                : 'Register a passkey to sign in without a password (Touch ID, Face ID, security key…)'}
            </p>
          </div>
          <Fingerprint
            size={18}
            style={{ color: (user as any)?.passkeyAuthEnabled ? 'var(--neon-green)' : 'rgba(255,255,255,0.15)' }}
          />
        </div>

        {/* Add passkey row */}
        <div className="flex items-center justify-between pt-1">
          <StatusBadge status={passkeyStatus} msg={passkeyMsg} />
          <PrimaryButton
            onClick={handleAddPasskey}
            status={passkeyStatus}
            accent="green"
          >
            <Plus size={13} />
            {(user as any)?.passkeyAuthEnabled ? 'Add Another Passkey' : 'Register Passkey'}
          </PrimaryButton>
        </div>

        {/* Remove passkey row — only shown when enabled */}
        {(user as any)?.passkeyAuthEnabled && (
          <div className="flex items-center justify-between border-t border-glass-border pt-4">
            <div>
              <p className="font-mono text-xs text-text-muted">Remove passkey</p>
              <p className="font-mono text-[10px] text-text-muted/60">Disables passkey sign-in for this account</p>
            </div>
            <div className="flex items-center gap-3">
              <StatusBadge status={removeStatus} msg={removeMsg} />
              <DangerButton onClick={handleRemovePasskey}>
                <X size={13} />
                {removeStatus === 'loading' ? 'Removing…' : 'Remove Passkey'}
              </DangerButton>
            </div>
          </div>
        )}
      </Section>

      {/* ── Notification Prefs ── */}
      <Section icon={Bell} title="Notification Preferences" accent="green">
        {[
          {
            id: 'email-notifs',
            label: 'Email Notifications',
            hint: 'Receive email updates on important admin events',
            icon: Mail,
            value: emailNotifs,
            set: setEmailNotifs,
          },
          {
            id: 'security-alerts',
            label: 'Security Alerts',
            hint: 'Notify on unusual login attempts or permission changes',
            icon: Shield,
            value: securityAlerts,
            set: setSecurityAlerts,
          },
        ].map(({ id, label, hint, icon: Icon, value, set }) => (
          <div key={id} className="flex items-center justify-between py-3 border-b border-glass-border last:border-none">
            <div className="flex items-center gap-3">
              <Icon size={14} className="text-neon-green/70" />
              <div>
                <p className="font-mono text-sm text-text-primary">{label}</p>
                <p className="font-mono text-[10px] text-text-muted/70">{hint}</p>
              </div>
            </div>
            {/* Toggle */}
            <button
              id={id}
              onClick={() => set(v => !v)}
              className="relative w-10 h-5 transition-all duration-300"
              style={{
                background: value ? 'var(--neon-green)' : 'rgba(255,255,255,0.08)',
                border: `1px solid ${value ? 'var(--neon-green)' : 'rgba(255,255,255,0.12)'}`,
              }}
            >
              <span
                className="absolute top-0.5 h-3.5 w-3.5 transition-all duration-300 bg-white"
                style={{ left: value ? 'calc(100% - 18px)' : '2px' }}
              />
            </button>
          </div>
        ))}
      </Section>

      {/* ── Security ── */}
      <Section icon={Shield} title="Active Session" accent="orange">
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Auth Provider', value: 'Stack Auth' },
            { label: 'Session Type', value: 'Cookie-based' },
            { label: 'Access Level', value: 'Super Admin' },
          ].map(({ label, value }) => (
            <div key={label} className="p-4 bg-void-3 border border-glass-border space-y-1">
              <p className="font-mono text-[10px] text-text-muted uppercase tracking-widest">{label}</p>
              <p className="font-mono text-sm text-neon-orange">{value}</p>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between pt-2">
          <p className="font-mono text-xs text-text-muted">
            <span className="text-neon-orange">▸</span> Signed in as{' '}
            <span className="text-text-primary">{user?.primaryEmail}</span>
          </p>
          <PrimaryButton onClick={handleSignOut} accent="cyan">
            <LogOut size={13} /> Sign Out
          </PrimaryButton>
        </div>
      </Section>

      {/* ── Danger Zone ── */}
      <Section icon={AlertTriangle} title="Danger Zone" accent="orange">
        <div className="p-4 border border-red-500/20 bg-red-500/5 space-y-3">
          <div className="flex items-start gap-3">
            <AlertTriangle size={14} className="text-red-400 mt-0.5 shrink-0" />
            <p className="font-mono text-xs text-red-400/80 leading-relaxed">
              Deleting your account is <span className="text-red-400 font-bold">permanent and irreversible</span>.
              All data associated with this admin account will be removed. Type{' '}
              <span className="text-red-300 bg-red-500/10 px-1">DELETE</span> to confirm.
            </p>
          </div>
          <NeonInput
            value={deleteConfirm}
            onChange={e => setDeleteConfirm(e.target.value)}
            placeholder="Type DELETE to confirm…"
            accent="#ef4444"
          />
          <DangerButton
            onClick={() => {
              if (deleteConfirm === 'DELETE') {
                // handle delete account
                alert('Account deletion initiated');
              }
            }}
          >
            <Trash2 size={13} />
            Delete Account
          </DangerButton>
        </div>
      </Section>

      {/* Bottom fade spacer */}
      <div className="h-8" />
    </div>
  );
}
