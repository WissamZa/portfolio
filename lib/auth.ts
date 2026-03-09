import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

const ADMIN_TOKEN_COOKIE = 'admin_session';
const ADMIN_SECRET = process.env.ADMIN_SECRET_TOKEN || 'changeme_in_production';

export function verifyAdminToken(token: string): boolean {
  return token === ADMIN_SECRET;
}

export async function getAdminSession(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(ADMIN_TOKEN_COOKIE)?.value || null;
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const session = await getAdminSession();
  return session ? verifyAdminToken(session) : false;
}

export function requireAdmin(req: NextRequest): NextResponse | null {
  const token =
    req.cookies.get(ADMIN_TOKEN_COOKIE)?.value ||
    req.headers.get('x-admin-token');
  if (!token || !verifyAdminToken(token)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  return null;
}

// The hidden puzzle key users must type to reveal the admin login
export const PUZZLE_SEQUENCE = process.env.ADMIN_PUZZLE_KEY || 'matrix';
