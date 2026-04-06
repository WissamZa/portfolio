'use client';

import { useState, useEffect } from 'react';
import type { Profile, Project, Skill, Experience, Education, Certification, Course } from '@/lib/database.types';

export interface PortfolioData {
  profile: Profile | null;
  projects: Project[];
  skills: Skill[];
  experience: Experience[];
  education: Education[];
  certifications: Certification[];
  courses: Course[];
}

let portfolioCache: { data: PortfolioData; timestamp: number } | null = null;
const CACHE_TTL = 5 * 60 * 1000; // 5 min client-side cache

export function usePortfolioData() {
  const [data, setData] = useState<PortfolioData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      // Use client cache
      if (portfolioCache && Date.now() - portfolioCache.timestamp < CACHE_TTL) {
        setData(portfolioCache.data);
        setLoading(false);
        return;
      }

      try {
        const res = await fetch('/api/portfolio', {
          next: { revalidate: 300 },
        });
        if (!res.ok) throw new Error('Failed to fetch');
        const json = await res.json();
        portfolioCache = { data: json, timestamp: Date.now() };
        setData(json);
      } catch (err) {
        setError('Failed to load portfolio data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return { data, loading, error };
}

export function invalidatePortfolioCache() {
  portfolioCache = null;
}
