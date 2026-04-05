import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { requireAdmin } from '@/lib/auth';
import { logAudit } from '@/lib/audit';
import { invalidateCache } from '@/lib/cache';

type TableName = 'profiles' | 'projects' | 'skills' | 'experience' | 'education' | 'certifications' | 'contact_messages' | 'audit_logs';

const VALID_TABLES: TableName[] = [
  'profiles', 'projects', 'skills', 'experience', 'education', 'certifications', 'contact_messages', 'audit_logs'
];

function validateTable(table: string): table is TableName {
  return VALID_TABLES.includes(table as TableName);
}

// GET /api/admin/data?table=projects
export async function GET(req: NextRequest) {
  try {
    const authError = await requireAdmin(req);
    if (authError) return authError;

    const { searchParams } = new URL(req.url);
    const table = searchParams.get('table');

    if (!table || !validateTable(table)) {
      return NextResponse.json({ error: 'Invalid table' }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin.from(table).select('*').order('created_at', { ascending: false });
    if (error) {
      console.error(`Supabase error fetching ${table}:`, error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data });
  } catch (err: any) {
    console.error('API Error (GET):', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// POST /api/admin/data?table=projects
export async function POST(req: NextRequest) {
  const authError = await requireAdmin(req);
  if (authError) return authError;

  const { searchParams } = new URL(req.url);
  const table = searchParams.get('table');

  if (!table || !validateTable(table)) {
    return NextResponse.json({ error: 'Invalid table' }, { status: 400 });
  }

  const body = await req.json();
  const { data, error } = await supabaseAdmin.from(table as any).insert(body as never).select().single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  
  // Log audit
  const recordId = (data as any)?.id;
  await logAudit('CREATE', table, recordId, body);

  invalidateCache(`portfolio:${table}`);
  invalidateCache('portfolio:profile');
  invalidateCache('portfolio:projects');

  return NextResponse.json({ data });
}

// PATCH /api/admin/data?table=projects&id=uuid
export async function PATCH(req: NextRequest) {
  const authError = await requireAdmin(req);
  if (authError) return authError;

  const { searchParams } = new URL(req.url);
  const table = searchParams.get('table');
  const id = searchParams.get('id');

  if (!table || !validateTable(table) || !id) {
    return NextResponse.json({ error: 'Invalid table or missing id' }, { status: 400 });
  }

  const body = await req.json();

  const tablesWithUpdatedAt = ['profiles', 'projects', 'experience'];
  const updateData = tablesWithUpdatedAt.includes(table)
    ? { ...body, updated_at: new Date().toISOString() }
    : body;

  // Snapshot previous record for rollback
  const { data: previousRecord } = await supabaseAdmin.from(table as any).select('*').eq('id', id).single();

  const { data, error } = await supabaseAdmin.from(table as any).update(updateData as never).eq('id', id).select().single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Log audit (include previous_data for rollback support)
  await logAudit('UPDATE', table, id, {
    new_data: body,
    previous_data: previousRecord ?? null,
  });

  invalidateCache('portfolio:');

  return NextResponse.json({ data });
}

// DELETE /api/admin/data?table=projects&id=uuid
export async function DELETE(req: NextRequest) {
  const authError = await requireAdmin(req);
  if (authError) return authError;

  const { searchParams } = new URL(req.url);
  const table = searchParams.get('table');
  const id = searchParams.get('id');

  if (!table || !validateTable(table) || !id) {
    return NextResponse.json({ error: 'Invalid table or missing id' }, { status: 400 });
  }

  // Snapshot record before deletion for rollback support
  const { data: previousRecord } = await supabaseAdmin.from(table as any).select('*').eq('id', id).single();

  const { error } = await supabaseAdmin.from(table as any).delete().eq('id', id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Log audit (include previous_data so DELETE can be rolled back)
  await logAudit('DELETE', table, id, { previous_data: previousRecord ?? null });

  invalidateCache('portfolio:');

  return NextResponse.json({ success: true });
}
