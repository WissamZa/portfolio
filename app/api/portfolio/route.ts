import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { getCached, setCached, CACHE_KEYS } from '@/lib/cache';

export const revalidate = 300; // 5 minutes ISR

async function fetchWithCache<T>(key: string, fetcher: () => Promise<T>, ttl = 300): Promise<T> {
  const cached = getCached<T>(key);
  if (cached) return cached;
  const data = await fetcher();
  setCached(key, data, ttl);
  return data;
}

export async function GET() {
  try {
    const [profile, projects, skills, experience, education, certifications] = await Promise.all([
      fetchWithCache(CACHE_KEYS.PROFILE, async () => {
        const { data } = await supabaseAdmin.from('profiles').select('*').single();
        return data;
      }),
      fetchWithCache(CACHE_KEYS.PROJECTS, async () => {
        const { data } = await supabaseAdmin
          .from('projects')
          .select('*')
          .order('order_index')
          .order('created_at', { ascending: false });
        return data || [];
      }),
      fetchWithCache(CACHE_KEYS.SKILLS, async () => {
        const { data } = await supabaseAdmin
          .from('skills')
          .select('*')
          .order('category')
          .order('order_index');
        return data || [];
      }),
      fetchWithCache(CACHE_KEYS.EXPERIENCE, async () => {
        const { data } = await supabaseAdmin
          .from('experience')
          .select('*')
          .order('order_index')
          .order('start_date', { ascending: false });
        return data || [];
      }),
      fetchWithCache(CACHE_KEYS.EDUCATION, async () => {
        const { data } = await supabaseAdmin
          .from('education')
          .select('*')
          .order('order_index')
          .order('start_date', { ascending: false });
        return data || [];
      }),
      fetchWithCache(CACHE_KEYS.CERTIFICATIONS, async () => {
        const { data } = await supabaseAdmin
          .from('certifications')
          .select('*')
          .order('order_index')
          .order('issue_date', { ascending: false });
        return data || [];
      }),
    ]);

    return NextResponse.json(
      { profile, projects, skills, experience, education, certifications },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
        },
      }
    );
  } catch (error) {
    console.error('Portfolio API error:', error);
    return NextResponse.json({ error: 'Failed to fetch portfolio data' }, { status: 500 });
  }
}
