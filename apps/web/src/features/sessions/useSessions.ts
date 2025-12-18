import { useState, useEffect } from 'react';
import { Session } from '@socio-do-tabuleiro/shared';
import { apiClient, handleApiError } from '../../lib/apiClient';

interface UseSessionsOptions {
  autoFetch?: boolean;
  filters?: {
    status?: string;
    locationType?: 'ONLINE' | 'VENUE';
    gameSystem?: string;
    masterId?: string;
    storeId?: string;
    minPrice?: number;
    maxPrice?: number;
    scheduledAfter?: string;
    scheduledBefore?: string;
  };
}

export const useSessions = (options: UseSessionsOptions = {}) => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [count, setCount] = useState(0);

  const fetchSessions = async (filters?: UseSessionsOptions['filters']) => {
    try {
      setLoading(true);
      setError(null);

      const result = await apiClient.sessions.list(filters || options.filters);
      setSessions(result.sessions);
      setCount(result.count);
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setLoading(false);
    }
  };

  const createSession = async (sessionData: {
    title: string;
    description?: string;
    gameSystem: string;
    maxPlayers: number;
    price: number;
    duration: number;
    scheduledAt: string;
    locationType: 'ONLINE' | 'VENUE';
    storeId?: string;
  }) => {
    try {
      setLoading(true);
      setError(null);

      const newSession = await apiClient.sessions.create(sessionData);
      setSessions(prev => [newSession, ...prev]);
      setCount(prev => prev + 1);

      return newSession;
    } catch (err) {
      setError(handleApiError(err));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateSession = async (
    id: string,
    updates: Partial<{
      title: string;
      description: string;
      gameSystem: string;
      maxPlayers: number;
      price: number;
      duration: number;
      scheduledAt: string;
      locationType: 'ONLINE' | 'VENUE';
      storeId: string;
    }>
  ) => {
    try {
      setLoading(true);
      setError(null);

      const updatedSession = await apiClient.sessions.update(id, updates);
      setSessions(prev => prev.map(s => (s.id === id ? updatedSession : s)));

      return updatedSession;
    } catch (err) {
      setError(handleApiError(err));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteSession = async (id: string) => {
    try {
      setLoading(true);
      setError(null);

      await apiClient.sessions.delete(id);
      setSessions(prev => prev.filter(s => s.id !== id));
      setCount(prev => prev - 1);
    } catch (err) {
      setError(handleApiError(err));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Auto-fetch on mount if enabled
  useEffect(() => {
    if (options.autoFetch !== false) {
      fetchSessions();
    }
  }, []);

  return {
    sessions,
    loading,
    error,
    count,
    fetchSessions,
    createSession,
    updateSession,
    deleteSession,
    refetch: () => fetchSessions(options.filters),
  };
};
