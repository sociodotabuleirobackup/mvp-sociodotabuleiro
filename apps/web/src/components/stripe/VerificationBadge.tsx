import React from 'react';

type VerificationStatus = 'pending' | 'processing' | 'verified' | 'failed' | 'requires_action' | null;

interface VerificationBadgeProps {
  status: VerificationStatus;
  size?: 'sm' | 'md' | 'lg';
}

const statusConfig: Record<string, { label: string; bgColor: string; textColor: string; icon: string }> = {
  verified: {
    label: 'Verificado',
    bgColor: 'bg-green-500/20',
    textColor: 'text-green-400',
    icon: 'verified',
  },
  pending: {
    label: 'Pendente',
    bgColor: 'bg-yellow-500/20',
    textColor: 'text-yellow-400',
    icon: 'hourglass_empty',
  },
  processing: {
    label: 'Processando',
    bgColor: 'bg-blue-500/20',
    textColor: 'text-blue-400',
    icon: 'sync',
  },
  requires_action: {
    label: 'Ação Necessária',
    bgColor: 'bg-orange-500/20',
    textColor: 'text-orange-400',
    icon: 'warning',
  },
  failed: {
    label: 'Falhou',
    bgColor: 'bg-red-500/20',
    textColor: 'text-red-400',
    icon: 'error',
  },
};

export const VerificationBadge: React.FC<VerificationBadgeProps> = ({ status, size = 'md' }) => {
  if (!status) return null;

  const config = statusConfig[status] || statusConfig.pending;

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-2',
  };

  const iconSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full font-medium ${config.bgColor} ${config.textColor} ${sizeClasses[size]}`}
    >
      <span className={`material-symbols-outlined ${iconSizes[size]}`}>
        {config.icon}
      </span>
      {config.label}
    </span>
  );
};
