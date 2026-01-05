import React from 'react';

interface LogoProps {
  className?: string;
  width?: number;
  height?: number;
}

export const Logo: React.FC<LogoProps> = ({ 
  className = '', 
  width = 48, 
  height = 48 
}) => (
  <img 
    src="/logo.png" 
    alt="Sócio do Tabuleiro" 
    width={width}
    height={height}
    className={className}
    style={{ objectFit: 'contain' }}
  />
);
