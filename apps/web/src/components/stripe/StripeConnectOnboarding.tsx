import React, { useState } from 'react';
import { stripeApi, handleApiError } from '../../lib/apiClient';

interface OnboardingFormData {
  businessType: 'individual' | 'company';
  firstName: string;
  lastName: string;
  companyName: string;
  cpf: string;
  cnpj: string;
}

interface StripeConnectOnboardingProps {
  onSuccess?: () => void;
}

export const StripeConnectOnboarding: React.FC<StripeConnectOnboardingProps> = ({ onSuccess }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<OnboardingFormData>({
    businessType: 'individual',
    firstName: '',
    lastName: '',
    companyName: '',
    cpf: '',
    cnpj: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const payload = {
        businessType: formData.businessType,
        ...(formData.businessType === 'individual'
          ? {
              firstName: formData.firstName,
              lastName: formData.lastName,
              cpf: formData.cpf,
            }
          : {
              companyName: formData.companyName,
              cnpj: formData.cnpj,
            }),
      };

      const result = await stripeApi.createConnectAccount(payload);

      if (result.success && result.onboardingUrl) {
        window.location.href = result.onboardingUrl;
      }

      onSuccess?.();
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setIsLoading(false);
    }
  };

  const formatCPF = (value: string) => {
    const numbers = value.replace(/\D/g, '').slice(0, 11);
    return numbers
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  };

  const formatCNPJ = (value: string) => {
    const numbers = value.replace(/\D/g, '').slice(0, 14);
    return numbers
      .replace(/(\d{2})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1/$2')
      .replace(/(\d{4})(\d{1,2})$/, '$1-$2');
  };

  return (
    <div className="glass-panel p-6 rounded-2xl space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
          <span className="material-symbols-outlined text-white text-2xl">account_balance</span>
        </div>
        <div>
          <h3 className="text-lg font-bold">Configurar Recebimentos</h3>
          <p className="text-sm text-gray-400">Configure sua conta para receber pagamentos</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-red-400 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs uppercase tracking-wider text-gray-500 mb-2">
            Tipo de Conta
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, businessType: 'individual' }))}
              className={`p-4 rounded-xl border transition-all ${
                formData.businessType === 'individual'
                  ? 'border-primary bg-primary/10 text-white'
                  : 'border-white/10 hover:border-white/20 text-gray-400'
              }`}
            >
              <span className="material-symbols-outlined text-2xl mb-2">person</span>
              <p className="font-medium">Pessoa Física</p>
              <p className="text-xs opacity-60">CPF</p>
            </button>
            <button
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, businessType: 'company' }))}
              className={`p-4 rounded-xl border transition-all ${
                formData.businessType === 'company'
                  ? 'border-primary bg-primary/10 text-white'
                  : 'border-white/10 hover:border-white/20 text-gray-400'
              }`}
            >
              <span className="material-symbols-outlined text-2xl mb-2">business</span>
              <p className="font-medium">Pessoa Jurídica</p>
              <p className="text-xs opacity-60">CNPJ</p>
            </button>
          </div>
        </div>

        {formData.businessType === 'individual' ? (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-gray-500 mb-1">
                  Nome
                </label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                  className="w-full bg-surface/50 border border-white/10 rounded-lg p-3 focus:border-primary focus:outline-none transition-colors"
                  placeholder="Seu nome"
                  required
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider text-gray-500 mb-1">
                  Sobrenome
                </label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                  className="w-full bg-surface/50 border border-white/10 rounded-lg p-3 focus:border-primary focus:outline-none transition-colors"
                  placeholder="Seu sobrenome"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-gray-500 mb-1">
                CPF
              </label>
              <input
                type="text"
                value={formData.cpf}
                onChange={(e) => setFormData(prev => ({ ...prev, cpf: formatCPF(e.target.value) }))}
                className="w-full bg-surface/50 border border-white/10 rounded-lg p-3 focus:border-primary focus:outline-none transition-colors"
                placeholder="000.000.000-00"
                required
              />
            </div>
          </>
        ) : (
          <>
            <div>
              <label className="block text-xs uppercase tracking-wider text-gray-500 mb-1">
                Razão Social
              </label>
              <input
                type="text"
                value={formData.companyName}
                onChange={(e) => setFormData(prev => ({ ...prev, companyName: e.target.value }))}
                className="w-full bg-surface/50 border border-white/10 rounded-lg p-3 focus:border-primary focus:outline-none transition-colors"
                placeholder="Nome da empresa"
                required
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-gray-500 mb-1">
                CNPJ
              </label>
              <input
                type="text"
                value={formData.cnpj}
                onChange={(e) => setFormData(prev => ({ ...prev, cnpj: formatCNPJ(e.target.value) }))}
                className="w-full bg-surface/50 border border-white/10 rounded-lg p-3 focus:border-primary focus:outline-none transition-colors"
                placeholder="00.000.000/0000-00"
                required
              />
            </div>
          </>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 bg-gradient-to-r from-primary to-accent rounded-xl font-bold text-white hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <span className="material-symbols-outlined animate-spin">sync</span>
              Processando...
            </>
          ) : (
            <>
              <span className="material-symbols-outlined">arrow_forward</span>
              Continuar Configuração
            </>
          )}
        </button>
      </form>

      <p className="text-xs text-gray-500 text-center">
        Você será redirecionado para o Stripe para completar a verificação de identidade de forma segura.
      </p>
    </div>
  );
};
