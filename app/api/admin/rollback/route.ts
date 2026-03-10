import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { requireAdmin } from '@/lib/auth';
import { logAudit } from '@/lib/audit';
import { invalidateCache } from '@/lib/cache';

// POST /api/admin/rollback
// Body: { audit_log_id: string }
export async function POST(req: NextRequest) {
  const authError = await requireAdmin(req);
  if (authError) return authError;

  try {
    const { audit_log_id } = await req.json();

    if (!audit_log_id) {
      return NextResponse.json({ error: 'audit_log_id is required' }, { status: 400 });
    }

    // 1. Fetch the audit log entry
    const { data: logEntry, error: logError } = await (supabaseAdmin as any)
      .from('audit_logs')
      .select('*')
      .eq('id', audit_log_id)
      .single();

    if (logError || !logEntry) {
      return NextResponse.json({ error: 'Audit log entry not found' }, { status: 404 });
    }

    if (logEntry.details?.rolled_back_at) {
      return NextResponse.json({ error: 'This entry has already been rolled back' }, { status: 409 });
    }

    const { action, table_name, record_id, details } = logEntry;

    // audit_logs itself cannot be rolled back
    if (table_name === 'audit_logs') {
      return NextResponse.json({ error: 'Cannot rollback audit log entries' }, { status: 400 });
    }

    const validTables = ['profiles', 'projects', 'skills', 'experience', 'education', 'certifications'];
    if (!validTables.includes(table_name)) {
      return NextResponse.json({ error: `Table "${table_name}" does not support rollback` }, { status: 400 });
    }

    let rolledBackData: any = null;

    if (action === 'CREATE') {
      // Rollback a CREATE → delete the record
      if (!record_id) {
        return NextResponse.json({ error: 'No record_id on log entry' }, { status: 400 });
      }
      const { error } = await (supabaseAdmin as any)
        .from(table_name)
        .delete()
        .eq('id', record_id);
      if (error) throw error;
      rolledBackData = { deleted_id: record_id };

    } else if (action === 'UPDATE') {
      // Rollback an UPDATE → restore previous_data
      const prevData = details?.previous_data;
      if (!prevData || !record_id) {
        return NextResponse.json(
          { error: 'No previous_data available in this log entry — cannot rollback UPDATE' },
          { status: 422 }
        );
      }
      const { data, error } = await (supabaseAdmin as any)
        .from(table_name)
        .update({ ...prevData, updated_at: new Date().toISOString() })
        .eq('id', record_id)
        .select()
        .single();
      if (error) throw error;
      rolledBackData = data;

    } else if (action === 'DELETE') {
      // Rollback a DELETE → re-insert the record using previous_data
      const prevData = details?.previous_data;
      if (!prevData) {
        return NextResponse.json(
          { error: 'No previous_data available in this log entry — cannot rollback DELETE' },
          { status: 422 }
        );
      }
      const { data, error } = await (supabaseAdmin as any)
        .from(table_name)
        .insert(prevData)
        .select()
        .single();
      if (error) throw error;
      rolledBackData = data;

    } else {
      return NextResponse.json({ error: `Action "${action}" cannot be rolled back` }, { status: 400 });
    }

    // 2. Stamp the original audit log entry as rolled back (inside details JSON)
    const rolledBackAt = new Date().toISOString();
    const updatedDetails = {
      ...details,
      rolled_back_at: rolledBackAt,
      rollback_data: rolledBackData,
    };

    await (supabaseAdmin as any)
      .from('audit_logs')
      .update({ details: updatedDetails })
      .eq('id', audit_log_id);

    // 3. Write a new ROLLBACK audit log entry
    await logAudit('UPDATE', table_name, record_id, {
      rollback_of: audit_log_id,
      original_action: action,
      rolled_back_at: rolledBackAt,
    });

    // 4. Invalidate caches
    invalidateCache('portfolio:');

    return NextResponse.json({
      success: true,
      rolled_back_at: rolledBackAt,
      data: rolledBackData,
    });
  } catch (err: any) {
    console.error('Rollback error:', err);
    return NextResponse.json({ error: err.message ?? 'Rollback failed' }, { status: 500 });
  }
}
