import React from 'react';
import { useAuth } from '../../store';

interface UserProfileProps {
  showName?: boolean;
  showEmail?: boolean;
  showAvatar?: boolean;
  avatarSize?: 'sm' | 'md' | 'lg';
}

export const UserProfile: React.FC<UserProfileProps> = ({ 
  showName = true,
  showEmail = false,
  showAvatar = true,
  avatarSize = 'md'
}) => {
  const { user, isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <div className="animate-pulse bg-white/10 rounded-full h-8 w-8"></div>;
  }
  
  if (!isAuthenticated || !user) {
    return null;
  }
  
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };
  
  return (
    <div className="flex items-center gap-3">
      {showAvatar && (
        <div className={`${sizeClasses[avatarSize]} rounded-full bg-primary/20 flex items-center justify-center border border-primary overflow-hidden`}>
          {user.avatarUrl ? (
            <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
          ) : (
            <span className="material-symbols-outlined text-sm text-primary">person</span>
          )}
        </div>
      )}
      <div className="flex flex-col">
        {showName && (
          <span className="text-sm font-medium text-white">{user.name}</span>
        )}
        {showEmail && (
          <span className="text-xs text-gray-400">{user.email}</span>
        )}
      </div>
    </div>
  );
};
