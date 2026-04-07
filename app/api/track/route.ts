import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

// Simple in-process rate limit: max 5 tracking events per IP per minute
const ipHitMap = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = ipHitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    ipHitMap.set(ip, { count: 1, resetAt: now + 60_000 });
    return false;
  }
  if (entry.count >= 5) return true;
  entry.count += 1;
  return false;
}

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? '127.0.0.1';

    if (isRateLimited(ip)) {
      return NextResponse.json({ success: true }); // silent drop — don't hint at rate limiting
    }

    const body: { url?: string; referrer?: string } = await req.json();
    const { url, referrer } = body;

    const country = req.headers.get('x-vercel-ip-country') ?? 'Local';
    const city = req.headers.get('x-vercel-ip-city') ?? 'Local';
    const userAgent = req.headers.get('user-agent') ?? 'Unknown';

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabaseAdmin as any).from('visitors').insert({
      ip,
      country,
      city,
      browser: userAgent,
      os: 'Unknown',
      url: url ?? '/',
      referrer: referrer ?? 'Direct',
    });

    if (error) {
      // eslint-disable-next-line no-console
      console.error('[track] Failed to log visitor:', error);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('[track] Unexpected error:', err);
    return NextResponse.json({ error: 'Tracking failed' }, { status: 500 });
  }
}
