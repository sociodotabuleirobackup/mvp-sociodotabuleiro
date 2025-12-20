import { useState, useEffect } from 'react';
import { User, UserRole } from '@socio-do-tabuleiro/shared';
import { apiClient, setAuthToken, handleApiError } from '../../lib/apiClient';

// Mock JWT tokens for development
const MOCK_TOKENS: Record<UserRole, string> = {
  [UserRole.GUEST]: 'mock-guest-token',
  [UserRole.MASTER]: 'mock-master-token',
  [UserRole.PLAYER]: 'mock-player-token',
  [UserRole.VENUE]: 'mock-venue-token',
  [UserRole.ADMIN]: 'mock-admin-token',
};

export const useAuthApi = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize auth state from localStorage
  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        if (token) {
          setAuthToken(token);
          const userData = await apiClient.user.getMe();
          setUser(userData);
        }
      } catch (err) {
        // Token is invalid, clear it
        localStorage.removeItem('auth_token');
        setAuthToken(null);
        setError(handleApiError(err));
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (role: UserRole) => {
    try {
      setLoading(true);
      setError(null);

      // In development, use mock tokens
      const token = MOCK_TOKENS[role];

      setAuthToken(token);
      localStorage.setItem('auth_token', token);

      // Fetch user data from API
      const userData = await apiClient.user.getMe();
      setUser(userData);
    } catch (err) {
      setError(handleApiError(err));
      setAuthToken(null);
      localStorage.removeItem('auth_token');
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setAuthToken(null);
    localStorage.removeItem('auth_token');
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

  return {
    user,
    isAuthenticated: !!user,
    loading,
    error,
    login,
    logout,
    updateProfile,
    becomeMaster,
  };
};
