import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { requireAdmin } from '@/lib/auth';
import { logAudit } from '@/lib/audit';
import { invalidateCache } from '@/lib/cache';

type TableName = 'profiles' | 'projects' | 'skills' | 'experience' | 'education' | 'certifications' | 'contact_messages' | 'audit_logs';

type DatabaseRecord = Record<string, unknown> & { id: string };

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
  } catch (err: unknown) {
    console.error('API Error (GET):', err);
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Unknown error' }, { status: 500 });
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabaseAdmin as any).from(table).insert(body).select().single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Log audit
  const recordId = (data as DatabaseRecord | null)?.id;
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
  const updateData = { ...body, updated_at: new Date().toISOString() };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabaseAdmin as any).from(table).update(updateData).eq('id', id).select().single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Log audit
  await logAudit('UPDATE', table, id, body);

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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabaseAdmin as any).from(table).delete().eq('id', id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Log audit
  await logAudit('DELETE', table, id);

  invalidateCache('portfolio:');

  return NextResponse.json({ success: true });
}
