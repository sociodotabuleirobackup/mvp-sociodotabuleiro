import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole, Notification, ContractStatus } from './types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (role: UserRole) => void;
  logout: () => void;
  loading: boolean;
  notifications: Notification[];
  markAsRead: (id: string) => void;
  updateContractStatus: (status: ContractStatus) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    // Simulate initial load
    setTimeout(() => setLoading(false), 500);
  }, []);

  useEffect(() => {
    if (user) {
      // Mock Notifications
      setNotifications([
        { id: '1', title: 'Reserva Confirmada', message: 'Sua vaga na mesa "A Maldição de Strahd" foi garantida!', type: 'BOOKING', read: false, date: '10 min atrás', actionLink: '/sessions/1' },
        { id: '2', title: 'Nova Mensagem', message: 'Mestre Alex: Lembrem de atualizar as fichas...', type: 'CHAT', read: false, date: '1h atrás', actionLink: '/chat' }
      ]);
    } else {
      setNotifications([]);
    }
  }, [user]);

  const login = (role: UserRole) => {
    // Mock login
    const mockUser: User = {
      uid: 'user_123',
      name: role === UserRole.MASTER ? 'Mestre Alex' : role === UserRole.VENUE ? 'Caverna do Dragão' : 'Aventureiro John',
      email: 'test@example.com',
      role: role,
      avatarUrl: 'https://picsum.photos/200',
      level: 5,
      // Default contract status based on role logic
      founderPactStatus: role === UserRole.MASTER ? ContractStatus.PENDING_SIGNATURE : ContractStatus.SIGNED, 
      termsAcceptedAt: new Date().toISOString()
    };
    setUser(mockUser);
  };

  const logout = () => {
    setUser(null);
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
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout, loading, notifications, markAsRead, updateContractStatus }}>
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