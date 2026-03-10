'use client';

import { AccountSettings } from '@stackframe/stack';
import AdminNav from '@/components/admin/AdminNav';
import { useParams } from 'next/navigation';

export default function AdminSettings() {
    const params = useParams();
    const locale = params.locale as string;

    return (
        <div className="flex min-h-screen bg-void">
            <AdminNav active="settings" />

            <main className="flex-1 p-8 overflow-y-auto">
                <header className="mb-8">
                    <h1 className="text-2xl font-display text-text-primary tracking-wider uppercase">System Settings</h1>
                    <p className="text-text-muted mt-1 font-mono text-sm">Manage authentication, passkeys, and account security</p>
                </header>

                <div className="glass-card p-6 max-w-4xl bg-void-2 border-glass-border">
                    <div className="stack-auth-settings-container">
                        <AccountSettings />
                    </div>
                </div>

                <style jsx global>{`
          .stack-auth-settings-container {
            --stack-primary: #00f5ff;
            --stack-background: transparent;
            color: #e2e8f0;
          }
          .stack-auth-settings-container :global(*) {
            font-family: inherit !important;
          }
          .stack-auth-settings-container :global(h1), 
          .stack-auth-settings-container :global(h2), 
          .stack-auth-settings-container :global(h3) {
            color: #fff !important;
            font-family: 'Outfit', sans-serif !important;
            text-transform: uppercase;
            letter-spacing: 0.05em;
          }
          .stack-auth-settings-container :global(button) {
             border-radius: 0 !important;
          }
          .stack-auth-settings-container :global(input) {
            background: rgba(15, 15, 26, 0.8) !important;
            border: 1px solid rgba(0, 245, 255, 0.2) !important;
            border-radius: 0 !important;
            color: #fff !important;
          }
        `}</style>
            </main>
        </div>
    );
}
