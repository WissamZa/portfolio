import { NextRequest, NextResponse } from 'next/server';
import { stack } from './stack';
import { supabaseAdmin } from './supabase';

// Fail loudly at startup if the secret is missing rather than using an insecure default
const ADMIN_SECRET = process.env.ADMIN_SECRET_TOKEN;
if (!ADMIN_SECRET) {
  // Log warning — do not crash at import time (Next.js builds would break)
  // eslint-disable-next-line no-console
  console.warn('WARNING: ADMIN_SECRET_TOKEN is not set. Admin cookie auth will be disabled.');
}

// The hidden puzzle key users must type to reveal the admin login
export const PUZZLE_SEQUENCE = process.env.ADMIN_PUZZLE_KEY ?? 'matrix';

export async function isAdminAuthenticated(): Promise<boolean> {
  const user = await stack.getUser();
  if (!user) return false;

  try {
    const { data: profile, error } = await supabaseAdmin
      .from('profiles')
      .select('email')
      .single();

    if (error || !profile) return false;

    return !!(user.primaryEmail && (profile as { email: string | null }).email && user.primaryEmail === (profile as { email: string | null }).email);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('CRITICAL: Error verifying admin status:', err);
    return false;
  }
}

export async function requireAdmin(req: NextRequest): Promise<NextResponse | null> {
  if (await isAdminAuthenticated()) {
    return null;
  }
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}
