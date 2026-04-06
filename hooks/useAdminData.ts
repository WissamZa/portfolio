'use client';

import { useState, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import { invalidatePortfolioCache } from './usePortfolioData';

type TableName = 'profiles' | 'projects' | 'skills' | 'experience' | 'education' | 'certifications' | 'courses' | 'contact_messages';

async function adminFetch(method: string, table: TableName, body?: unknown, id?: string) {
  const params = new URLSearchParams({ table, _: Date.now().toString() });
  if (id) params.set('id', id);

  const res = await fetch(`/api/admin/data?${params}`, {
    method,
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    cache: 'no-store',
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Operation failed');
  }

  return res.json();
}

export function useAdminData<T>(table: TableName) {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await adminFetch('GET', table);
      setItems(data || []);
    } catch (err) {
      toast.error(`Failed to load ${table}`);
    } finally {
      setLoading(false);
    }
  }, [table]);

  const createItem = useCallback(async (item: Partial<T>) => {
    try {
      const { data } = await adminFetch('POST', table, item);
      setItems((prev) => [data, ...prev]);
      invalidatePortfolioCache();
      toast.success('Created successfully');
      return data;
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Create failed');
      throw err;
    }
  }, [table]);

  const updateItem = useCallback(async (id: string, updates: Partial<T>) => {
    try {
      const { data } = await adminFetch('PATCH', table, updates, id);
      setItems((prev) => prev.map((item: T) => ((item as { id: string }).id === id ? data : item)));
      invalidatePortfolioCache();
      toast.success('Updated successfully');
      return data;
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Update failed');
      throw err;
    }
  }, [table]);

  const deleteItem = useCallback(async (id: string) => {
    try {
      await adminFetch('DELETE', table, undefined, id);
      setItems((prev) => prev.filter((item: T) => (item as { id: string }).id !== id));
      invalidatePortfolioCache();
      toast.success('Deleted successfully');
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Delete failed');
      throw err;
    }
  }, [table]);

  return { items, loading, fetchItems, createItem, updateItem, deleteItem };
}
