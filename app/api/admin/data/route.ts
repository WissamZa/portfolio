import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { requireAdmin } from '@/lib/auth';
import { invalidateCache } from '@/lib/cache';

type TableName = 'profiles' | 'projects' | 'skills' | 'experience' | 'education' | 'certifications' | 'contact_messages';

const VALID_TABLES: TableName[] = [
  'profiles', 'projects', 'skills', 'experience', 'education', 'certifications', 'contact_messages'
];

function validateTable(table: string): table is TableName {
  return VALID_TABLES.includes(table as TableName);
}

// GET /api/admin/data?table=projects
export async function GET(req: NextRequest) {
  const authError = requireAdmin(req);
  if (authError) return authError;

  const { searchParams } = new URL(req.url);
  const table = searchParams.get('table');

  if (!table || !validateTable(table)) {
    return NextResponse.json({ error: 'Invalid table' }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin.from(table).select('*').order('created_at', { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ data });
}

// POST /api/admin/data?table=projects
export async function POST(req: NextRequest) {
  const authError = requireAdmin(req);
  if (authError) return authError;

  const { searchParams } = new URL(req.url);
  const table = searchParams.get('table');

  if (!table || !validateTable(table)) {
    return NextResponse.json({ error: 'Invalid table' }, { status: 400 });
  }

  const body = await req.json();
  const { data, error } = await supabaseAdmin.from(table as any).insert(body as never).select().single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  invalidateCache(`portfolio:${table}`);
  invalidateCache('portfolio:profile');
  invalidateCache('portfolio:projects');

  return NextResponse.json({ data });
}

// PATCH /api/admin/data?table=projects&id=uuid
export async function PATCH(req: NextRequest) {
  const authError = requireAdmin(req);
  if (authError) return authError;

  const { searchParams } = new URL(req.url);
  const table = searchParams.get('table');
  const id = searchParams.get('id');

  if (!table || !validateTable(table) || !id) {
    return NextResponse.json({ error: 'Invalid table or missing id' }, { status: 400 });
  }

  const body = await req.json();
  const updateData = { ...body, updated_at: new Date().toISOString() };

  const { data, error } = await supabaseAdmin.from(table as any).update(updateData as never).eq('id', id).select().single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  invalidateCache('portfolio:');

  return NextResponse.json({ data });
}

// DELETE /api/admin/data?table=projects&id=uuid
export async function DELETE(req: NextRequest) {
  const authError = requireAdmin(req);
  if (authError) return authError;

  const { searchParams } = new URL(req.url);
  const table = searchParams.get('table');
  const id = searchParams.get('id');

  if (!table || !validateTable(table) || !id) {
    return NextResponse.json({ error: 'Invalid table or missing id' }, { status: 400 });
  }

  const { error } = await supabaseAdmin.from(table as any).delete().eq('id', id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  invalidateCache('portfolio:');

  return NextResponse.json({ success: true });
}
