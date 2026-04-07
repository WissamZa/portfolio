import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { requireAdmin } from '@/lib/auth';
import { logAudit } from '@/lib/audit';
import { invalidateCache } from '@/lib/cache';

type TableName =
  | 'profiles'
  | 'projects'
  | 'skills'
  | 'experience'
  | 'education'
  | 'certifications'
  | 'courses'
  | 'contact_messages'
  | 'audit_logs'
  | 'visitors';

const VALID_TABLES: TableName[] = [
  'profiles', 'projects', 'skills', 'experience', 'education',
  'certifications', 'courses', 'contact_messages', 'audit_logs', 'visitors',
];

const TABLES_WITH_UPDATED_AT: TableName[] = ['profiles', 'projects', 'experience', 'courses'];

function validateTable(table: string): table is TableName {
  return VALID_TABLES.includes(table as TableName);
}

/** Return a generic message to the client; log the real error server-side. */
function internalError(label: string, err: unknown) {
  // eslint-disable-next-line no-console
  console.error(`[admin/data] ${label}:`, err);
  return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
}

// GET /api/admin/data?table=projects
export async function GET(req: NextRequest) {
  const authError = await requireAdmin(req);
  if (authError) return authError;

  try {
    const { searchParams } = new URL(req.url);
    const table = searchParams.get('table');

    if (!table || !validateTable(table)) {
      return NextResponse.json({ error: 'Invalid table' }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from(table)
      .select('*')
      .order('created_at', { ascending: false });

    if (error) return internalError(`GET ${table}`, error);

    return NextResponse.json({ data });
  } catch (err) {
    return internalError('GET', err);
  }
}

// POST /api/admin/data?table=projects
export async function POST(req: NextRequest) {
  const authError = await requireAdmin(req);
  if (authError) return authError;

  try {
    const { searchParams } = new URL(req.url);
    const table = searchParams.get('table');

    if (!table || !validateTable(table)) {
      return NextResponse.json({ error: 'Invalid table' }, { status: 400 });
    }

    const body: Record<string, unknown> = await req.json();

    // supabase-js types require a cast when the table name is dynamic
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabaseAdmin as any)
      .from(table)
      .insert(body)
      .select()
      .single();

    if (error) return internalError(`POST ${table}`, error);

    const recordId = (data as { id?: string })?.id;
    await logAudit('CREATE', table, recordId, body);

    invalidateCache(`portfolio:${table}`);
    invalidateCache('portfolio:profile');
    invalidateCache('portfolio:projects');

    return NextResponse.json({ data });
  } catch (err) {
    return internalError('POST', err);
  }
}

// PATCH /api/admin/data?table=projects&id=uuid
export async function PATCH(req: NextRequest) {
  const authError = await requireAdmin(req);
  if (authError) return authError;

  try {
    const { searchParams } = new URL(req.url);
    const table = searchParams.get('table');
    const id = searchParams.get('id');

    if (!table || !validateTable(table) || !id) {
      return NextResponse.json({ error: 'Invalid table or missing id' }, { status: 400 });
    }

    const body: Record<string, unknown> = await req.json();

    const updateData = TABLES_WITH_UPDATED_AT.includes(table)
      ? { ...body, updated_at: new Date().toISOString() }
      : body;

    // Snapshot previous record for rollback
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: previousRecord } = await (supabaseAdmin as any)
      .from(table)
      .select('*')
      .eq('id', id)
      .single();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabaseAdmin as any)
      .from(table)
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) return internalError(`PATCH ${table}`, error);

    await logAudit('UPDATE', table, id, {
      new_data: body,
      previous_data: previousRecord ?? null,
    });

    invalidateCache('portfolio:');

    return NextResponse.json({ data });
  } catch (err) {
    return internalError('PATCH', err);
  }
}

// DELETE /api/admin/data?table=projects&id=uuid
export async function DELETE(req: NextRequest) {
  const authError = await requireAdmin(req);
  if (authError) return authError;

  try {
    const { searchParams } = new URL(req.url);
    const table = searchParams.get('table');
    const id = searchParams.get('id');

    if (!table || !validateTable(table) || !id) {
      return NextResponse.json({ error: 'Invalid table or missing id' }, { status: 400 });
    }

    // Snapshot record before deletion for rollback support
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: previousRecord } = await (supabaseAdmin as any)
      .from(table)
      .select('*')
      .eq('id', id)
      .single();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabaseAdmin as any).from(table).delete().eq('id', id);

    if (error) return internalError(`DELETE ${table}`, error);

    await logAudit('DELETE', table, id, { previous_data: previousRecord ?? null });

    invalidateCache('portfolio:');

    return NextResponse.json({ success: true });
  } catch (err) {
    return internalError('DELETE', err);
  }
}
