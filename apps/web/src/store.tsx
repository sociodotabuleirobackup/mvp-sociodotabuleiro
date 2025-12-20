import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  Notification,
  ContractStatus,
  NotificationType,
} from '@socio-do-tabuleiro/shared';
import { useAuthApi } from './features/auth/useAuth';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loginWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string, name: string) => Promise<any>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
  notifications: Notification[];
  markAsRead: (id: string) => void;
  updateContractStatus: (status: ContractStatus) => void;
  updateProfile: (
    data: Partial<Pick<User, 'name' | 'avatarUrl'>>
  ) => Promise<User>;
  becomeMaster: (bio: string) => Promise<User>;
  refreshSession: () => Promise<any>;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const authApi = useAuthApi();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    if (authApi.user) {
      setNotifications([
        {
          id: '1',
          title: 'Reserva Confirmada',
          message: 'Sua vaga na mesa "A Maldição de Strahd" foi garantida!',
          type: NotificationType.BOOKING_CONFIRMED,
          isRead: false,
          userId: authApi.user.id,
          createdAt: new Date().toISOString(),
          read: false,
          date: '10 min atrás',
          actionLink: '/sessions/1',
        },
        {
          id: '2',
          title: 'Nova Mensagem',
          message: 'Mestre Alex: Lembrem de atualizar as fichas...',
          type: NotificationType.CHAT_MESSAGE,
          isRead: false,
          userId: authApi.user.id,
          createdAt: new Date().toISOString(),
          read: false,
          date: '1h atrás',
          actionLink: '/chat',
        },
      ]);
    } else {
      setNotifications([]);
    }
  }, [authApi.user]);

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const updateContractStatus = (status: ContractStatus) => {
    console.log('Contract status update:', status);
  };

  return (
    <AuthContext.Provider
      value={{
        user: authApi.user,
        isAuthenticated: authApi.isAuthenticated,
        loginWithEmail: authApi.loginWithEmail,
        signUpWithEmail: authApi.signUpWithEmail,
        loginWithGoogle: authApi.loginWithGoogle,
        logout: authApi.logout,
        loading: authApi.loading,
        error: authApi.error,
        notifications,
        markAsRead,
        updateContractStatus,
        updateProfile: authApi.updateProfile,
        becomeMaster: authApi.becomeMaster,
        refreshSession: authApi.refreshSession,
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
