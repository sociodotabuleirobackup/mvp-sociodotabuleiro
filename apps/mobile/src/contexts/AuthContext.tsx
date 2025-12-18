import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User, UserRole } from '@socio-do-tabuleiro/shared';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (role: UserRole) => void;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  const login = (role: UserRole) => {
    setLoading(true);
    // Mock login
    setTimeout(() => {
      const mockUser: User = {
        uid: 'user_123',
        name: role === UserRole.MASTER ? 'Mestre Alex' : 'Aventureiro John',
        email: 'test@example.com',
        role: role,
        level: 5,
      };
      setUser(mockUser);
      setLoading(false);
    }, 1000);
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
