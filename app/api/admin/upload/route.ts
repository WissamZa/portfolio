import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { requireAdmin } from '@/lib/auth';

const ALLOWED_BUCKETS = ['portfolio', 'certifications', 'courses', 'projects'] as const;
type AllowedBucket = (typeof ALLOWED_BUCKETS)[number];

function isAllowedBucket(b: string): b is AllowedBucket {
  return ALLOWED_BUCKETS.includes(b as AllowedBucket);
}

export async function POST(req: NextRequest) {
  const authError = await requireAdmin(req);
  if (authError) return authError;

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const rawBucket = (formData.get('bucket') as string | null) ?? 'portfolio';
    const folder = (formData.get('folder') as string | null) ?? 'uploads';

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validate bucket to prevent arbitrary bucket access
    if (!isAllowedBucket(rawBucket)) {
      return NextResponse.json({ error: 'Invalid bucket' }, { status: 400 });
    }

    const fileExt = file.name.split('.').pop();
    const fileName = `${crypto.randomUUID()}.${fileExt}`;
    const filePath = `${folder}/${fileName}`;

    const { data, error } = await supabaseAdmin.storage
      .from(rawBucket)
      .upload(filePath, file, { cacheControl: '3600', upsert: true });

    if (error) {
      // eslint-disable-next-line no-console
      console.error('[admin/upload] Supabase storage error:', error);
      return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
    }

    const { data: { publicUrl } } = supabaseAdmin.storage
      .from(rawBucket)
      .getPublicUrl(data.path);

    return NextResponse.json({ url: publicUrl });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('[admin/upload] Unexpected error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
