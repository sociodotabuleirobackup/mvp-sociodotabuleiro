import React, { useState, useEffect } from 'react';
import { useAuth } from '../store';
import { StripeConnectOnboarding, StripeConnectDashboard } from '../components/stripe';
import { stripeApi } from '../lib/apiClient';
import { UserRole, isStoreRole } from '@socio-do-tabuleiro/shared';

export const Profile: React.FC = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [stripeStatus, setStripeStatus] = useState<{
    hasAccount: boolean;
    verified: boolean;
    status: string | null;
  } | null>(null);
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    if (user && (user.role === UserRole.MASTER || isStoreRole(user.role))) {
      loadStripeStatus();
    }
  }, [user]);

  const loadStripeStatus = async () => {
    try {
      const result = await stripeApi.getConnectStatus();
      setStripeStatus({
        hasAccount: result.hasAccount,
        verified: result.verified || false,
        status: result.status || null,
      });
    } catch (e) {
      setStripeStatus({ hasAccount: false, verified: false, status: null });
    }
  };

  const handleResumeOnboarding = async () => {
    try {
      const result = await stripeApi.getRefreshOnboardingUrl();
      if (result.success && result.url) {
        window.location.href = result.url;
      }
    } catch (e) {
      console.error('Failed to get onboarding link:', e);
    }
  };

  if (!user) return null;

  const canReceivePayments = user.role === UserRole.MASTER || isStoreRole(user.role);

  return (
    <div className="p-4 max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-display font-bold">Perfil</h1>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="px-4 py-2 border border-white/10 rounded-lg hover:bg-white/5 text-sm font-bold transition-colors"
        >
          {isEditing ? 'Cancelar' : 'Editar Perfil'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Avatar & Basic Info */}
        <div className="glass-panel p-6 rounded-2xl flex flex-col items-center text-center space-y-4 h-fit">
          <div className="w-32 h-32 rounded-full p-1 bg-gradient-to-br from-primary to-accent">
            <img
              src={user.avatarUrl}
              alt={user.name}
              className="w-full h-full rounded-full object-cover border-4 border-background"
            />
          </div>
          <div>
            <h2 className="text-xl font-bold font-display">{user.name}</h2>
            <span className="text-xs uppercase tracking-widest text-primary font-bold px-3 py-1 bg-primary/10 rounded-full mt-2 inline-block">
              {user.role}
            </span>
          </div>
          <div className="w-full pt-4 border-t border-white/10 grid grid-cols-2 gap-4">
            <div>
              <span className="block text-2xl font-bold font-display">12</span>
              <span className="text-[10px] text-gray-500 uppercase">
                Sessões
              </span>
            </div>
            <div>
              <span className="block text-2xl font-bold font-display text-accent">
                4.9
              </span>
              <span className="text-[10px] text-gray-500 uppercase">
                Avaliação
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Details & Settings */}
        <div className="md:col-span-2 glass-panel p-8 rounded-2xl space-y-8">
          {/* Account Info */}
          <section className="space-y-4">
            <h3 className="text-lg font-bold border-b border-white/10 pb-2 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">
                badge
              </span>
              Dados da Conta
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-gray-500 mb-1">
                  Email
                </label>
                <input
                  disabled
                  value={user.email}
                  className="w-full bg-surface/50 border border-white/5 rounded p-2 text-gray-400 cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider text-gray-500 mb-1">
                  ID de Usuário
                </label>
                <div className="flex items-center gap-2">
                  <input
                    disabled
                    value={user.uid}
                    className="w-full bg-surface/50 border border-white/5 rounded p-2 text-gray-400 font-mono text-xs"
                  />
                  <button className="text-gray-500 hover:text-white">
                    <span className="material-symbols-outlined text-sm">
                      content_copy
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Role Specific Settings */}
          <section className="space-y-4">
            <h3 className="text-lg font-bold border-b border-white/10 pb-2 flex items-center gap-2">
              <span className="material-symbols-outlined text-accent">
                tune
              </span>
              Preferências
            </h3>

            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-white/5 rounded-lg text-sm border border-white/10">
                D&D 5e
              </span>
              <span className="px-3 py-1 bg-white/5 rounded-lg text-sm border border-white/10">
                Cyberpunk
              </span>
              <button className="px-3 py-1 bg-transparent border border-dashed border-gray-600 text-gray-500 rounded-lg text-sm hover:text-white hover:border-white transition-colors">
                + Adicionar Tag
              </button>
            </div>
          </section>

          {/* Legal & Danger Zone */}
          <section className="pt-4 border-t border-white/10">
            <div className="flex justify-between items-center">
              <button className="text-gray-400 hover:text-white text-sm underline">
                Termos de Uso
              </button>
              <button className="text-red-500 hover:text-red-400 text-sm font-bold">
                Sair da Conta
              </button>
            </div>
          </section>
        </div>
      </div>

      {canReceivePayments && (
        <div className="space-y-6">
          <h2 className="text-xl font-bold font-display flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">payments</span>
            Pagamentos e Recebimentos
          </h2>

          {stripeStatus?.hasAccount ? (
            <StripeConnectDashboard onResumeOnboarding={handleResumeOnboarding} />
          ) : showOnboarding ? (
            <StripeConnectOnboarding onSuccess={loadStripeStatus} />
          ) : (
            <div className="glass-panel p-6 rounded-2xl">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-primary text-2xl">account_balance</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-bold mb-1">Configure sua conta para receber pagamentos</h3>
                  <p className="text-sm text-gray-400 mb-4">
                    {user.role === UserRole.MASTER 
                      ? 'Receba pagamentos diretamente por suas sessões de RPG. Você receberá 85% do valor, com 15% de taxa da plataforma.'
                      : 'Receba pagamentos por reservas de mesas (90%) e pedidos de comida (95%). A diferença é a taxa da plataforma.'}
                  </p>
                  <button
                    onClick={() => setShowOnboarding(true)}
                    className="px-6 py-2 bg-gradient-to-r from-primary to-accent rounded-lg font-bold text-white hover:opacity-90 transition-opacity flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined text-sm">add</span>
                    Configurar Recebimentos
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
