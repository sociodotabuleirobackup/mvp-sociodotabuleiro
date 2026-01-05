import React, { createContext, useContext, useState, useEffect } from 'react';
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

const MOCK_TOKEN = 'mock-jwt-token-for-development';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const savedUser = localStorage.getItem('mockUser');
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        setUser(parsed);
        setIsAuthenticated(true);
      } catch (e) {
        localStorage.removeItem('mockUser');
      }
    }
    setLoading(false);
  }, []);

  const getAccessToken = async (): Promise<string> => {
    return MOCK_TOKEN;
  };

  const login = () => {
    const storedRole = localStorage.getItem('userRole') as UserRole || UserRole.PLAYER;
    const mockUser: User = {
      uid: 'mock-user-' + Date.now(),
      name: 'Usuário Demo',
      email: 'demo@sociodotabuleiro.app',
      role: storedRole,
      avatarUrl: 'https://picsum.photos/200',
      level: 1,
      founderPactStatus: storedRole === UserRole.MASTER ? ContractStatus.PENDING_SIGNATURE : ContractStatus.SIGNED,
      termsAcceptedAt: new Date().toISOString()
    };
    
    setUser(mockUser);
    setIsAuthenticated(true);
    localStorage.setItem('mockUser', JSON.stringify(mockUser));
  };

  useEffect(() => {
    setAuthFunctions(getAccessToken, login);
  }, []);

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
    localStorage.removeItem('mockUser');
    setUser(null);
    setIsAuthenticated(false);
  };

  const setUserRole = (role: UserRole) => {
    localStorage.setItem('userRole', role);
    if (user) {
      const updatedUser = { 
        ...user, 
        role,
        founderPactStatus: role === UserRole.MASTER ? ContractStatus.PENDING_SIGNATURE : ContractStatus.SIGNED
      };
      setUser(updatedUser);
      localStorage.setItem('mockUser', JSON.stringify(updatedUser));
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const updateContractStatus = (status: ContractStatus) => {
    if (user) {
      const updatedUser = { ...user, founderPactStatus: status };
      setUser(updatedUser);
      localStorage.setItem('mockUser', JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated, 
      login, 
      logout, 
      loading, 
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
