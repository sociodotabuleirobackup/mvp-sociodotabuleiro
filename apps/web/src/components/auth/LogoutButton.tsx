import React from 'react';
import { useAuth } from '../../store';

interface LogoutButtonProps {
  className?: string;
  children?: React.ReactNode;
}

export const LogoutButton: React.FC<LogoutButtonProps> = ({ 
  className = "text-gray-500 hover:text-white transition-colors",
  children
}) => {
  const { logout } = useAuth();
  
  return (
    <button onClick={logout} className={className}>
      {children || <span className="material-symbols-outlined">logout</span>}
    </button>
  );
};
