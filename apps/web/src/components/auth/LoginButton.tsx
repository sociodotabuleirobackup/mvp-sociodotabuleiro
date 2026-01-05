import React from 'react';
import { useAuth } from '../../store';

interface LoginButtonProps {
  className?: string;
  children?: React.ReactNode;
}

export const LoginButton: React.FC<LoginButtonProps> = ({ 
  className = "px-6 py-2 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 hover:border-primary text-white transition-all text-sm font-bold tracking-wide uppercase backdrop-blur-md",
  children = "Entrar"
}) => {
  const { login } = useAuth();
  
  return (
    <button onClick={login} className={className}>
      {children}
    </button>
  );
};
