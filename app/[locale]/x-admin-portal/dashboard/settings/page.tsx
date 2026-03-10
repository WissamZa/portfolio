'use client';

import { AccountSettings } from '@stackframe/stack';
import { Suspense } from 'react';
import { AdminHeader } from '@/components/admin/AdminHeader';

export default function AdminSettings() {
  return (
    <div className="p-8">
      <AdminHeader
        title="Settings"
        itemLabel="Manage authentication and account security"
      />

      <div className="glass-card p-8 max-w-4xl bg-void-2 border-glass-border shadow-2xl animate-in fade-in duration-700">
        <div className="stack-auth-settings-container">
          <Suspense fallback={
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <div className="spinner h-8 w-8" />
              <p className="font-mono text-[10px] text-text-muted animate-pulse">LOADING SECURITY INTERFACE...</p>
            </div>
          }>
            <AccountSettings />
          </Suspense>
        </div>
      </div>

      <style jsx global>{`
          .stack-auth-settings-container {
            --stack-primary: #00f5ff;
            --stack-background: transparent;
            color: #e2e8f0;
          }
          .stack-auth-settings-container :global(*) {
            font-family: 'Space Mono', monospace !important;
          }
          .stack-auth-settings-container :global(h1), 
          .stack-auth-settings-container :global(h2), 
          .stack-auth-settings-container :global(h3) {
            color: #fff !important;
            font-family: 'Outfit', sans-serif !important;
            text-transform: uppercase;
            letter-spacing: 0.1em;
            font-weight: 700 !important;
          }
          .stack-auth-settings-container :global(button) {
             border-radius: 0 !important;
             text-transform: uppercase;
             letter-spacing: 0.05em;
             font-weight: bold !important;
          }
          .stack-auth-settings-container :global(input) {
            background: rgba(10, 10, 15, 0.9) !important;
            border: 1px solid rgba(0, 245, 255, 0.2) !important;
            border-radius: 0 !important;
            color: #fff !important;
          }
          .stack-auth-settings-container :global(.st-account-settings) {
            background: transparent !important;
          }
        `}</style>
    </div>
  );
}
