import React, { useState } from 'react';
// Changed react-router-dom to react-router to fix missing export errors
import { useNavigate } from 'react-router';
import { useAuth } from '../store';
import { ContractStatus, SessionStatus } from '@socio-do-tabuleiro/shared';

export const CreateSession: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    system: 'D&D 5e',
    price: 0,
    isOnline: false,
    date: '',
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSave = async (status: SessionStatus) => {
    setSubmitting(true);

    // Business Rule: Contract Check for Publishing
    if (status === SessionStatus.PUBLISHED) {
      if (user?.founderPactStatus !== ContractStatus.SIGNED) {
        alert(
          'Para publicar sessões cobradas, você precisa assinar o Pacto de Fundador.'
        );
        // In real app, redirect to legal/contract page
        setSubmitting(false);
        return;
      }
    }

    // Mock API Call
    await new Promise(r => setTimeout(r, 1000));

    console.log(`Session saved as ${status}`, formData);
    navigate('/dashboard');
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-gray-400 mb-6 hover:text-white"
      >
        <span className="material-symbols-outlined">arrow_back</span> Voltar
      </button>

      <h1 className="text-3xl font-display font-bold mb-6">
        Criar Nova Sessão
      </h1>

      <div className="glass-panel p-6 rounded-2xl space-y-6">
        {/* Basic Info */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">
              Título da Aventura
            </label>
            <input
              type="text"
              className="w-full bg-surface border border-border rounded-lg p-3 text-white focus:border-primary outline-none transition-colors"
              placeholder="Ex: A Tumba dos Horrores"
              value={formData.title}
              onChange={e =>
                setFormData({ ...formData, title: e.target.value })
              }
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">
                Sistema
              </label>
              <select className="w-full bg-surface border border-border rounded-lg p-3 text-white outline-none">
                <option>D&D 5e</option>
                <option>Pathfinder 2e</option>
                <option>Call of Cthulhu</option>
                <option>Tormenta 20</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Data</label>
              <input
                type="datetime-local"
                className="w-full bg-surface border border-border rounded-lg p-3 text-white outline-none scheme-dark"
              />
            </div>
          </div>
        </div>

        {/* Pricing Calculator Component */}
        <div className="bg-surface/50 p-4 rounded-xl border border-primary/20">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold flex items-center gap-2">
              <span className="material-symbols-outlined text-accent">
                calculate
              </span>
              Calculadora de Preço
            </h3>
            <span className="text-xs text-gray-400">Sugestão Automática</span>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-400">Sua Hora/Aula</span>
              <span className="font-mono">R$ 50,00</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-400">Duração (4h)</span>
              <span className="font-mono">x 4</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-400">Taxa Plataforma (10%)</span>
              <span className="font-mono text-red-400">- R$ 20,00</span>
            </div>
            <div className="h-px bg-border"></div>
            <div className="flex justify-between items-center font-bold text-lg">
              <span>Total por Jogador (5 vagas)</span>
              <span className="text-green-400">R$ 36,00</span>
            </div>
          </div>
        </div>

        {/* Location Selection */}
        <div>
          <label className="block text-sm text-gray-400 mb-2">
            Local da Sessão
          </label>
          <div className="grid grid-cols-2 gap-4">
            <button
              className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${formData.isOnline ? 'border-primary bg-primary/10 text-white' : 'border-border bg-surface text-gray-400'}`}
              onClick={() => setFormData({ ...formData, isOnline: true })}
            >
              <span className="material-symbols-outlined text-3xl">wifi</span>
              <span className="font-bold">Online</span>
            </button>
            <button
              className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${!formData.isOnline ? 'border-primary bg-primary/10 text-white' : 'border-border bg-surface text-gray-400'}`}
              onClick={() => setFormData({ ...formData, isOnline: false })}
            >
              <span className="material-symbols-outlined text-3xl">
                storefront
              </span>
              <span className="font-bold">Presencial (Loja)</span>
            </button>
          </div>
        </div>

        {/* Contract Warning */}
        {user?.founderPactStatus !== ContractStatus.SIGNED && (
          <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg flex gap-3 text-sm text-red-200">
            <span className="material-symbols-outlined shrink-0">gavel</span>
            <p>
              Assinatura pendente do Pacto de Fundador. Você só poderá salvar
              como rascunho.
            </p>
          </div>
        )}

        <div className="flex gap-4">
          <button
            onClick={() => handleSave(SessionStatus.DRAFT)}
            disabled={submitting}
            className="flex-1 py-4 bg-transparent border border-white/20 hover:bg-white/5 text-white rounded-xl font-bold transition-colors"
          >
            Salvar Rascunho
          </button>

          <button
            onClick={() => handleSave(SessionStatus.PUBLISHED)}
            disabled={
              submitting || user?.founderPactStatus !== ContractStatus.SIGNED
            }
            className="flex-1 py-4 bg-primary hover:bg-primary-hover text-white rounded-xl font-bold text-lg shadow-[0_0_15px_rgba(107,38,217,0.4)] transition-all transform active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? 'Processando...' : 'Publicar'}
          </button>
        </div>
      </div>
    </div>
  );
};
