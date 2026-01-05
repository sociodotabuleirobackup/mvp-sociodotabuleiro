import { useState, useEffect } from 'react';
import { api, apiPublic } from '../services/api';

interface UseApiResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useApi<T>(endpoint: string, requiresAuth = true): UseApiResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [trigger, setTrigger] = useState(0);

  const refetch = () => setTrigger(t => t + 1);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const result = requiresAuth 
          ? await api.get<T>(endpoint)
          : await apiPublic.get<T>(endpoint);
          
        if (result.success && result.data) {
          setData(result.data);
        } else {
          setError(result.error || 'Request failed');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [endpoint, requiresAuth, trigger]);

  return { data, loading, error, refetch };
}

export { api, apiPublic };
