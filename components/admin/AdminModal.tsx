'use client';

import { X } from 'lucide-react';
import { ReactNode } from 'react';

interface AdminModalProps {
  /** Modal title displayed in the header */
  title: string;
  /** Whether the modal is currently open */
  isOpen: boolean;
  /** Callback when the modal should close */
  onClose: () => void;
  /** Modal body content */
  children: ReactNode;
  /** Optional footer content (typically action buttons) */
  footer?: ReactNode;
}

/**
 * Admin modal component for forms and dialogs.
 * Features a glass-card style with fade-in animation.
 * Renders as null when closed to maintain clean DOM.
 */
export function AdminModal({
  title,
  isOpen,
  onClose,
  children,
  footer,
}: AdminModalProps): JSX.Element | null {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-start justify-center overflow-auto py-8 px-4 animate-in fade-in duration-300">
      <div className="w-full max-w-2xl glass-card border border-neon-cyan/20 animate-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-glass-border">
          <h2 className="font-mono text-neon-cyan">{title}</h2>
          <button
            onClick={onClose}
            className="text-text-muted hover:text-text-primary transition-colors"
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto custom-scrollbar">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="flex justify-end gap-3 p-5 border-t border-glass-border">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
