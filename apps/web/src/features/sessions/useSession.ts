import { useState, useEffect } from 'react';
import { Session } from '@socio-do-tabuleiro/shared';
import { apiClient, handleApiError } from '../../lib/apiClient';

export const useSession = (id: string | undefined) => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSession = async () => {
    if (!id) return;

    try {
      setLoading(true);
      setError(null);

      const sessionData = await apiClient.sessions.getById(id);
      setSession(sessionData);
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setLoading(false);
    }
  };

  const updateSession = async (
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
    if (!id) throw new Error('Session ID is required');

    try {
      setLoading(true);
      setError(null);

      const updatedSession = await apiClient.sessions.update(id, updates);
      setSession(updatedSession);

      return updatedSession;
    } catch (err) {
      setError(handleApiError(err));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteSession = async () => {
    if (!id) throw new Error('Session ID is required');

    try {
      setLoading(true);
      setError(null);

      await apiClient.sessions.delete(id);
      setSession(null);
    } catch (err) {
      setError(handleApiError(err));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Auto-fetch on mount and when ID changes
  useEffect(() => {
    if (id) {
      fetchSession();
    }
  }, [id]);

  return {
    session,
    loading,
    error,
    fetchSession,
    updateSession,
    deleteSession,
    refetch: fetchSession,
  };
};
