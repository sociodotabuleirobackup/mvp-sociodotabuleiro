import React from 'react';
import logoImage from '../assets/logo.png';

export const Logo: React.FC<{ className?: string }> = ({ className }) => (
  <img 
    src={logoImage} 
    alt="Sócio do Tabuleiro" 
    className={className}
  />
);
