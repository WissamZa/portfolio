import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

const ADMIN_TOKEN_COOKIE = 'admin_session';
const ADMIN_SECRET = process.env.ADMIN_SECRET_TOKEN || 'changeme_in_production';

import { stack } from './stack';
import { supabaseAdmin } from './supabase';

export async function isAdminAuthenticated(): Promise<boolean> {
  const user = await stack.getUser();
  if (!user) return false;

  // Check if this user's email matches the primary profile email in Supabase
  // For a single-user portfolio, this effectively identifies the admin
  try {
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('email')
      .limit(1)
      .single() as any;
    
    return !!(user.primaryEmail && profile?.email && user.primaryEmail === profile.email);
  } catch (err) {
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

// The hidden puzzle key users must type to reveal the admin login
export const PUZZLE_SEQUENCE = process.env.ADMIN_PUZZLE_KEY || 'matrix';
