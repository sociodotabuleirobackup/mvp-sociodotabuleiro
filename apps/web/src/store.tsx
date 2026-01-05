import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { User, UserRole, Notification, ContractStatus } from '@socio-do-tabuleiro/shared';
import { setAuthFunctions } from './services/api';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
  loading: boolean;
  notifications: Notification[];
  markAsRead: (id: string) => void;
  updateContractStatus: (status: ContractStatus) => void;
  setUserRole: (role: UserRole) => void;
  getAccessToken: () => Promise<string>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { 
    isAuthenticated: auth0Authenticated, 
    isLoading: auth0Loading, 
    user: auth0User,
    loginWithRedirect,
    logout: auth0Logout,
    getAccessTokenSilently
  } = useAuth0();
  
  const [user, setUser] = useState<User | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const getAccessToken = async (): Promise<string> => {
    const token = await getAccessTokenSilently({
      authorizationParams: {
        audience: import.meta.env.VITE_AUTH0_AUDIENCE,
        scope: 'openid profile email'
      }
    });
    return token;
  };

  const login = () => {
    loginWithRedirect();
  };

  useEffect(() => {
    setAuthFunctions(getAccessToken, login);
  }, []);

  useEffect(() => {
    if (auth0Authenticated && auth0User) {
      const storedRole = localStorage.getItem('userRole') as UserRole || UserRole.PLAYER;
      
      const appUser: User = {
        uid: auth0User.sub || '',
        name: auth0User.name || auth0User.nickname || 'Usuário',
        email: auth0User.email || '',
        role: storedRole,
        avatarUrl: auth0User.picture || 'https://picsum.photos/200',
        level: 1,
        founderPactStatus: storedRole === UserRole.MASTER ? ContractStatus.PENDING_SIGNATURE : ContractStatus.SIGNED,
        termsAcceptedAt: new Date().toISOString()
      };
      setUser(appUser);
    } else {
      setUser(null);
    }
  }, [auth0Authenticated, auth0User]);

  useEffect(() => {
    if (user) {
      setNotifications([
        { id: '1', title: 'Bem-vindo!', message: 'Sua conta foi criada com sucesso.', type: 'BOOKING', read: false, date: 'agora', actionLink: '/dashboard' },
      ]);
    } else {
      setNotifications([]);
    }
  }, [user]);

  const logout = () => {
    localStorage.removeItem('userRole');
    auth0Logout({ 
      logoutParams: {
        returnTo: window.location.origin 
      }
    });
  };

  const setUserRole = (role: UserRole) => {
    localStorage.setItem('userRole', role);
    if (user) {
      setUser({ 
        ...user, 
        role,
        founderPactStatus: role === UserRole.MASTER ? ContractStatus.PENDING_SIGNATURE : ContractStatus.SIGNED
      });
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const updateContractStatus = (status: ContractStatus) => {
    if (user) {
      setUser({ ...user, founderPactStatus: status });
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated: auth0Authenticated, 
      login, 
      logout, 
      loading: auth0Loading, 
      notifications, 
      markAsRead, 
      updateContractStatus,
      setUserRole,
      getAccessToken
    }}>
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
