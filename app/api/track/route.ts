import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { url, referrer } = body;
    
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0] || '127.0.0.1';
    const country = req.headers.get('x-vercel-ip-country') || 'Local';
    const city = req.headers.get('x-vercel-ip-city') || 'Local';
    const userAgent = req.headers.get('user-agent') || 'Unknown';

    // Using supabaseAdmin to insert the tracking data
    const { error } = await supabaseAdmin.from('visitors' as any).insert({
      ip,
      country,
      city,
      browser: userAgent,
      os: 'Unknown',
      url: url || '/',
      referrer: referrer || 'Direct',
    } as any);

    if (error) {
      console.error('Failed to log visitor:', error);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Tracking API error:', error);
    return NextResponse.json({ error: 'Tracking failed' }, { status: 500 });
  }
}
