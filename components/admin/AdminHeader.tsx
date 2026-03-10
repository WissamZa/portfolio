'use client';

import { Plus } from 'lucide-react';

interface AdminHeaderProps {
  /** Section title */
  title: string;
  /** Number of items in the section */
  count?: number;
  /** Label for the items count (e.g., 'projects', 'skills') */
  itemLabel?: string;
  /** Callback for the add button */
  onAdd?: () => void;
  /** Custom label for the add button */
  addButtonLabel?: string;
}

/**
 * Admin section header with title, item count, and optional add button.
 * Used as a consistent header across admin dashboard sections.
 */
export function AdminHeader({
  title,
  count,
  itemLabel,
  onAdd,
  addButtonLabel,
}: AdminHeaderProps): JSX.Element {
  return (
    <div className="flex items-center justify-between mb-8">
      <div>
        <h1 className="text-2xl font-bold font-display text-text-primary">
          {title}
          <span className="text-neon-cyan">.</span>
        </h1>
        {typeof count === 'number' && (
          <p className="font-mono text-xs text-text-muted">
            {count} {itemLabel || 'items'}
          </p>
        )}
      </div>
      {onAdd && (
        <button
          onClick={onAdd}
          className="btn-neon-filled px-4 py-2 font-mono text-sm flex items-center gap-2"
        >
          <Plus size={16} /> {addButtonLabel || `Add ${title.slice(0, -1)}`}
        </button>
      )}
    </div>
  );
}
