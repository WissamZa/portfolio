import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { requireAdmin } from '@/lib/auth';
import { logAudit } from '@/lib/audit';
import { invalidateCache } from '@/lib/cache';

type RollbackAction = 'CREATE' | 'UPDATE' | 'DELETE';

interface AuditLogEntry {
  id: string;
  action: RollbackAction;
  table_name: string;
  record_id: string | null;
  details: Record<string, unknown> | null;
}

const ROLLBACK_ALLOWED_TABLES = [
  'profiles', 'projects', 'skills', 'experience', 'education', 'certifications', 'courses',
] as const;

const TABLES_WITH_UPDATED_AT = ['profiles', 'projects', 'experience', 'courses'];

function internalError(label: string, err: unknown) {
  // eslint-disable-next-line no-console
  console.error(`[admin/rollback] ${label}:`, err);
  return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
}

// POST /api/admin/rollback — Body: { audit_log_id: string }
export async function POST(req: NextRequest) {
  const authError = await requireAdmin(req);
  if (authError) return authError;

  try {
    const body: { audit_log_id?: string } = await req.json();
    const { audit_log_id } = body;

    if (!audit_log_id) {
      return NextResponse.json({ error: 'audit_log_id is required' }, { status: 400 });
    }

    // 1. Fetch the audit log entry — dynamic table name requires cast
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: logEntry, error: logError } = await (supabaseAdmin as any)
      .from('audit_logs')
      .select('*')
      .eq('id', audit_log_id)
      .single() as { data: AuditLogEntry | null; error: unknown };

    if (logError || !logEntry) {
      return NextResponse.json({ error: 'Audit log entry not found' }, { status: 404 });
    }

    if (logEntry.details?.rolled_back_at) {
      return NextResponse.json({ error: 'This entry has already been rolled back' }, { status: 409 });
    }

    const { action, table_name, record_id, details } = logEntry;

    if (table_name === 'audit_logs') {
      return NextResponse.json({ error: 'Cannot rollback audit log entries' }, { status: 400 });
    }

    if (!ROLLBACK_ALLOWED_TABLES.includes(table_name as (typeof ROLLBACK_ALLOWED_TABLES)[number])) {
      return NextResponse.json(
        { error: `Table "${table_name}" does not support rollback` },
        { status: 400 }
      );
    }

    let rolledBackData: Record<string, unknown> | null = null;

    if (action === 'CREATE') {
      if (!record_id) {
        return NextResponse.json({ error: 'No record_id on log entry' }, { status: 400 });
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (supabaseAdmin as any).from(table_name).delete().eq('id', record_id);
      if (error) throw error;
      rolledBackData = { deleted_id: record_id };

    } else if (action === 'UPDATE') {
      const prevData = details?.previous_data as Record<string, unknown> | undefined;
      if (!prevData || !record_id) {
        return NextResponse.json(
          { error: 'No previous_data available in this log entry — cannot rollback UPDATE' },
          { status: 422 }
        );
      }
      const updatePayload = TABLES_WITH_UPDATED_AT.includes(table_name)
        ? { ...prevData, updated_at: new Date().toISOString() }
        : prevData;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = await (supabaseAdmin as any)
        .from(table_name)
        .update(updatePayload)
        .eq('id', record_id)
        .select()
        .single();
      if (error) throw error;
      rolledBackData = data as Record<string, unknown>;

    } else if (action === 'DELETE') {
      const prevData = details?.previous_data as Record<string, unknown> | undefined;
      if (!prevData) {
        return NextResponse.json(
          { error: 'No previous_data available in this log entry — cannot rollback DELETE' },
          { status: 422 }
        );
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = await (supabaseAdmin as any)
        .from(table_name)
        .insert(prevData)
        .select()
        .single();
      if (error) throw error;
      rolledBackData = data as Record<string, unknown>;

    } else {
      return NextResponse.json({ error: `Action "${action}" cannot be rolled back` }, { status: 400 });
    }

    // 2. Stamp the original audit log as rolled back
    const rolledBackAt = new Date().toISOString();
    const updatedDetails = { ...details, rolled_back_at: rolledBackAt, rollback_data: rolledBackData };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabaseAdmin as any)
      .from('audit_logs')
      .update({ details: updatedDetails })
      .eq('id', audit_log_id);

    // 3. Write a ROLLBACK audit log entry
    await logAudit('UPDATE', table_name, record_id, {
      rollback_of: audit_log_id,
      original_action: action,
      rolled_back_at: rolledBackAt,
    });

    // 4. Invalidate caches
    invalidateCache('portfolio:');

    return NextResponse.json({ success: true, rolled_back_at: rolledBackAt, data: rolledBackData });
  } catch (err) {
    return internalError('POST', err);
  }
}
