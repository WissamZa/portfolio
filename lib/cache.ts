// In-memory cache with TTL for server-side data
interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}

const cache = new Map<string, CacheEntry<unknown>>();

export function getCached<T>(key: string): T | null {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    cache.delete(key);
    return null;
  }
  return entry.data as T;
}

export function setCached<T>(key: string, data: T, ttlSeconds = 300): void {
  cache.set(key, { data, expiresAt: Date.now() + ttlSeconds * 1000 });
}

export function invalidateCache(pattern?: string): void {
  if (!pattern) {
    cache.clear();
    return;
  }
  for (const key of cache.keys()) {
    if (key.includes(pattern)) cache.delete(key);
  }
}

// Cache keys
export const CACHE_KEYS = {
  PROFILE: 'portfolio:profile',
  PROJECTS: 'portfolio:projects',
  PROJECTS_FEATURED: 'portfolio:projects:featured',
  SKILLS: 'portfolio:skills',
  EXPERIENCE: 'portfolio:experience',
  EDUCATION: 'portfolio:education',
  CERTIFICATIONS: 'portfolio:certifications',
  COURSES: 'portfolio:courses',
} as const;
