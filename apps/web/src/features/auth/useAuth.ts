import { useState, useEffect, useCallback } from 'react';
import { User } from '@socio-do-tabuleiro/shared';
import { apiClient, setAuthToken, handleApiError } from '../../lib/apiClient';
import { supabase } from '../../lib/supabase';

export const useAuthApi = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUserData = useCallback(async (token: string) => {
    try {
      setAuthToken(token);
      const userData = await apiClient.user.getMe();
      setUser(userData);
      return userData;
    } catch (err) {
      setAuthToken(null);
      throw err;
    }
  }, []);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.access_token) {
          await fetchUserData(session.access_token);
        }
      } catch (err) {
        setError(handleApiError(err));
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.access_token) {
        try {
          setLoading(true);
          await fetchUserData(session.access_token);
        } catch (err) {
          setError(handleApiError(err));
        } finally {
          setLoading(false);
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setAuthToken(null);
      } else if (event === 'TOKEN_REFRESHED' && session?.access_token) {
        setAuthToken(session.access_token);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [fetchUserData]);

  const loginWithEmail = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        throw new Error(authError.message);
      }

      if (data.session?.access_token) {
        await fetchUserData(data.session.access_token);
      }
    } catch (err) {
      setError(handleApiError(err));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signUpWithEmail = async (email: string, password: string, name: string) => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
          },
        },
      });

      if (authError) {
        throw new Error(authError.message);
      }

      if (data.session?.access_token) {
        await fetchUserData(data.session.access_token);
      }

      return data;
    } catch (err) {
      setError(handleApiError(err));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    try {
      setLoading(true);
      setError(null);

      const { error: authError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (authError) {
        throw new Error(authError.message);
      }
    } catch (err) {
      setError(handleApiError(err));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await supabase.auth.signOut();
      setUser(null);
      setAuthToken(null);
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (
    data: Partial<Pick<User, 'name' | 'avatarUrl'>>
  ) => {
    try {
      setLoading(true);
      setError(null);

      const updatedUser = await apiClient.user.updateMe(data);
      setUser(updatedUser);

      return updatedUser;
    } catch (err) {
      setError(handleApiError(err));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const becomeMaster = async (bio: string) => {
    try {
      setLoading(true);
      setError(null);

      const updatedUser = await apiClient.user.becomeMaster(bio);
      setUser(updatedUser);

      return updatedUser;
    } catch (err) {
      setError(handleApiError(err));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const refreshSession = async () => {
    try {
      const { data: { session }, error: refreshError } = await supabase.auth.refreshSession();
      
      if (refreshError) {
        throw new Error(refreshError.message);
      }

      if (session?.access_token) {
        setAuthToken(session.access_token);
      }

      return session;
    } catch (err) {
      setError(handleApiError(err));
      throw err;
    }
  };

  return {
    user,
    isAuthenticated: !!user,
    loading,
    error,
    loginWithEmail,
    signUpWithEmail,
    loginWithGoogle,
    logout,
    updateProfile,
    becomeMaster,
    refreshSession,
  };
};
