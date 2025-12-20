import React, { useState, useEffect } from 'react';
import { stripeApi, handleApiError } from '../../lib/apiClient';
import { VerificationBadge } from './VerificationBadge';

type VerificationStatus = 'pending' | 'processing' | 'verified' | 'failed' | 'requires_action';

interface StripeConnectDashboardProps {
  onResumeOnboarding?: () => void;
}

export const StripeConnectDashboard: React.FC<StripeConnectDashboardProps> = ({ onResumeOnboarding }) => {
  const [status, setStatus] = useState<{
    hasAccount: boolean;
    verified: boolean;
    status: VerificationStatus | null;
    requirements: string[];
    chargesEnabled: boolean;
    payoutsEnabled: boolean;
  } | null>(null);
  const [balance, setBalance] = useState<{
    available: number;
    pending: number;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const statusResult = await stripeApi.getConnectStatus();
      
      if (statusResult.success && statusResult.hasAccount) {
        setStatus({
          hasAccount: true,
          verified: statusResult.verified || false,
          status: statusResult.status || null,
          requirements: statusResult.requirements || [],
          chargesEnabled: statusResult.chargesEnabled || false,
          payoutsEnabled: statusResult.payoutsEnabled || false,
        });

        if (statusResult.chargesEnabled) {
          try {
            const balanceResult = await stripeApi.getBalance();
            if (balanceResult.success) {
              setBalance(balanceResult.balance);
            }
          } catch (balanceErr) {
            console.warn('Could not fetch balance:', balanceErr);
          }
        }
      } else {
        setStatus(null);
      }
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setIsLoading(false);
    }
  };

  const openStripeDashboard = async () => {
    try {
      const result = await stripeApi.getDashboardUrl();
      if (result.success && result.url) {
        window.open(result.url, '_blank');
      }
    } catch (err) {
      setError(handleApiError(err));
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(amount / 100);
  };

  if (isLoading) {
    return (
      <div className="glass-panel p-6 rounded-2xl flex items-center justify-center">
        <span className="material-symbols-outlined animate-spin text-primary">sync</span>
        <span className="ml-2 text-gray-400">Carregando...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass-panel p-6 rounded-2xl">
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-red-400 text-sm">
          {error}
        </div>
      </div>
    );
  }

  if (!status?.hasAccount) {
    return null;
  }

  return (
    <div className="glass-panel p-6 rounded-2xl space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
            <span className="material-symbols-outlined text-white text-2xl">account_balance</span>
          </div>
          <div>
            <h3 className="text-lg font-bold">Conta de Recebimentos</h3>
            <VerificationBadge status={status.status} size="sm" />
          </div>
        </div>
        {status.verified && (
          <button
            onClick={openStripeDashboard}
            className="px-4 py-2 border border-white/10 rounded-lg hover:bg-white/5 text-sm font-medium transition-colors flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-sm">open_in_new</span>
            Abrir Dashboard
          </button>
        )}
      </div>

      {status.status === 'requires_action' && status.requirements.length > 0 && (
        <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-4 space-y-3">
          <div className="flex items-center gap-2 text-orange-400">
            <span className="material-symbols-outlined">warning</span>
            <span className="font-medium">Ação necessária</span>
          </div>
          <p className="text-sm text-gray-400">
            Complete as seguintes informações para ativar sua conta:
          </p>
          <ul className="text-sm text-gray-300 space-y-1">
            {status.requirements.slice(0, 3).map((req, i) => (
              <li key={i} className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-400"></span>
                {req.replace(/_/g, ' ')}
              </li>
            ))}
          </ul>
          <button
            onClick={onResumeOnboarding}
            className="w-full py-2 bg-orange-500/20 hover:bg-orange-500/30 text-orange-400 rounded-lg text-sm font-medium transition-colors"
          >
            Completar Verificação
          </button>
        </div>
      )}

      {status.chargesEnabled && balance && (
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-surface/50 rounded-xl p-4 border border-white/5">
            <div className="flex items-center gap-2 text-gray-400 mb-2">
              <span className="material-symbols-outlined text-sm">account_balance_wallet</span>
              <span className="text-xs uppercase tracking-wider">Disponível</span>
            </div>
            <span className="text-2xl font-bold text-green-400">{formatCurrency(balance.available)}</span>
          </div>
          <div className="bg-surface/50 rounded-xl p-4 border border-white/5">
            <div className="flex items-center gap-2 text-gray-400 mb-2">
              <span className="material-symbols-outlined text-sm">schedule</span>
              <span className="text-xs uppercase tracking-wider">Pendente</span>
            </div>
            <span className="text-2xl font-bold text-yellow-400">{formatCurrency(balance.pending)}</span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${status.chargesEnabled ? 'bg-green-400' : 'bg-gray-500'}`}></span>
          <span className="text-sm text-gray-400">
            {status.chargesEnabled ? 'Recebe pagamentos' : 'Pagamentos desativados'}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${status.payoutsEnabled ? 'bg-green-400' : 'bg-gray-500'}`}></span>
          <span className="text-sm text-gray-400">
            {status.payoutsEnabled ? 'Saques ativos' : 'Saques desativados'}
          </span>
        </div>
      </div>
    </div>
  );
};
