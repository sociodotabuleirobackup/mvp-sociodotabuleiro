import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useAuth } from '../store';
import { UserRole } from '@socio-do-tabuleiro/shared';

export const Register: React.FC = () => {
  const { role } = useParams<{ role: UserRole }>();
  const navigate = useNavigate();
  const { signUpWithEmail, loading, error } = useAuth();
  const [localError, setLocalError] = useState<string | null>(null);

  const [step, setStep] = useState(1);
  const [termsAccepted, setTermsAccepted] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    genres: [] as string[],
    experienceYears: 0,
    systems: [] as string[],
    hourRate: 0,
    venueName: '',
    address: '',
    amenities: [] as string[],
  });

  const handleInputChange = (field: keyof typeof formData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const getRoleLabel = () => {
    switch (role) {
      case UserRole.MASTER:
        return 'Mestre do Jogo';
      case UserRole.VENUE:
        return 'Lojista';
      default:
        return 'Jogador';
    }
  };

  const getMaxSteps = () => {
    if (role === UserRole.PLAYER) return 2;
    return 3;
  };

  const handleNext = () => {
    if (step < getMaxSteps()) {
      setStep(step + 1);
    } else {
      handleFinish();
    }
  };

  const handleFinish = async () => {
    if (!termsAccepted) {
      alert('Você deve aceitar os termos de uso.');
      return;
    }
    
    try {
      setLocalError(null);
      await signUpWithEmail(formData.email, formData.password, formData.name);
      navigate('/dashboard');
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : 'Registration failed');
    }
  };

  const toggleSelection = (
    field: 'genres' | 'systems' | 'amenities',
    value: string
  ) => {
    const list = formData[field];
    if (list.includes(value)) {
      setFormData(prev => ({ ...prev, [field]: list.filter(i => i !== value) }));
    } else {
      setFormData(prev => ({ ...prev, [field]: [...list, value] }));
    }
  };

  const renderStep1Basic = () => (
    <div className="space-y-4 animate-fade-in">
      <h3 className="text-xl font-bold font-display text-white">
        Informações Básicas
      </h3>
      <div>
        <label className="block text-xs uppercase tracking-wider text-gray-500 mb-1">
          Nome Completo
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={e => handleInputChange('name', e.target.value)}
          className="w-full bg-surface border border-white/10 rounded-lg p-3 text-white focus:border-primary outline-none"
          placeholder="Ex: Aragorn Filho de Arathorn"
        />
      </div>
      <div>
        <label className="block text-xs uppercase tracking-wider text-gray-500 mb-1">
          Email
        </label>
        <input
          type="email"
          value={formData.email}
          onChange={e => handleInputChange('email', e.target.value)}
          className="w-full bg-surface border border-white/10 rounded-lg p-3 text-white focus:border-primary outline-none"
          placeholder="seu@email.com"
        />
      </div>
      <div>
        <label className="block text-xs uppercase tracking-wider text-gray-500 mb-1">
          Senha
        </label>
        <input
          type="password"
          value={formData.password}
          onChange={e => handleInputChange('password', e.target.value)}
          className="w-full bg-surface border border-white/10 rounded-lg p-3 text-white focus:border-primary outline-none"
          placeholder="••••••••"
        />
      </div>
    </div>
  );

  const renderStep2Preferences = () => (
    <div className="space-y-6 animate-fade-in">
      <h3 className="text-xl font-bold font-display text-white">
        Preferências de Jogo
      </h3>
      <div>
        <label className="block text-xs uppercase tracking-wider text-gray-500 mb-3">
          Gêneros Favoritos
        </label>
        <div className="flex flex-wrap gap-2">
          {[
            'Fantasia Medieval',
            'Cyberpunk',
            'Terror',
            'Investigação',
            'Sci-Fi',
          ].map(g => (
            <button
              key={g}
              type="button"
              onClick={() => toggleSelection('genres', g)}
              className={`px-3 py-1 rounded-full text-xs font-bold border transition-colors ${formData.genres.includes(g) ? 'bg-primary border-primary text-white' : 'bg-surface border-white/10 text-gray-400 hover:border-white/30'}`}
            >
              {g}
            </button>
          ))}
        </div>
      </div>

      <div className="pt-4 border-t border-white/10">
        <label className="flex items-center gap-3 cursor-pointer group">
          <div
            className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${termsAccepted ? 'bg-accent border-accent' : 'border-gray-500 group-hover:border-white'}`}
          >
            {termsAccepted && (
              <span className="material-symbols-outlined text-black text-sm font-bold">
                check
              </span>
            )}
          </div>
          <input
            type="checkbox"
            className="hidden"
            checked={termsAccepted}
            onChange={e => setTermsAccepted(e.target.checked)}
          />
          <span className="text-sm text-gray-400">
            Li e aceito os{' '}
            <span className="text-white underline">Termos de Uso</span> e a{' '}
            <span className="text-white underline">
              Política de Privacidade
            </span>
            .
          </span>
        </label>
      </div>
    </div>
  );

  const renderStep2Master = () => (
    <div className="space-y-6 animate-fade-in">
      <h3 className="text-xl font-bold font-display text-white">
        Perfil do Mestre
      </h3>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs uppercase tracking-wider text-gray-500 mb-1">
            Anos de Experiência
          </label>
          <input
            type="number"
            value={formData.experienceYears}
            onChange={e => handleInputChange('experienceYears', parseInt(e.target.value) || 0)}
            className="w-full bg-surface border border-white/10 rounded-lg p-3 text-white focus:border-primary outline-none"
          />
        </div>
        <div></div>
      </div>
      <div>
        <label className="block text-xs uppercase tracking-wider text-gray-500 mb-3">
          Sistemas Dominados
        </label>
        <div className="flex flex-wrap gap-2">
          {[
            'D&D 5e',
            'Pathfinder 2e',
            'Call of Cthulhu',
            'Vampiro',
            'Tormenta 20',
          ].map(s => (
            <button
              key={s}
              type="button"
              onClick={() => toggleSelection('systems', s)}
              className={`px-3 py-1 rounded-full text-xs font-bold border transition-colors ${formData.systems.includes(s) ? 'bg-primary border-primary text-white' : 'bg-surface border-white/10 text-gray-400 hover:border-white/30'}`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const renderStep3Master = () => (
    <div className="space-y-6 animate-fade-in">
      <h3 className="text-xl font-bold font-display text-white">
        Serviços Profissionais
      </h3>
      <div className="bg-surface/50 p-4 rounded-xl border border-white/10">
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm font-bold text-gray-300">
            Valor da Sessão (Hora)
          </span>
          <span className="text-accent font-bold text-xl">
            R$ {formData.hourRate},00
          </span>
        </div>
        <input
          type="range"
          min="0"
          max="200"
          step="10"
          value={formData.hourRate}
          onChange={e => handleInputChange('hourRate', parseInt(e.target.value))}
          className="w-full accent-primary h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
        />
        <p className="text-xs text-gray-500 mt-2">
          Este valor será base para a calculadora automática de mesas.
        </p>
      </div>

      <div className="pt-4 border-t border-white/10">
        <label className="flex items-center gap-3 cursor-pointer group">
          <div
            className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${termsAccepted ? 'bg-accent border-accent' : 'border-gray-500 group-hover:border-white'}`}
          >
            {termsAccepted && (
              <span className="material-symbols-outlined text-black text-sm font-bold">
                check
              </span>
            )}
          </div>
          <input
            type="checkbox"
            className="hidden"
            checked={termsAccepted}
            onChange={e => setTermsAccepted(e.target.checked)}
          />
          <span className="text-sm text-gray-400">
            Aceito o{' '}
            <span className="text-white underline">Pacto de Fundador</span> e
            concordo com as taxas da plataforma (10%).
          </span>
        </label>
      </div>
    </div>
  );

  const renderStep2Venue = () => (
    <div className="space-y-4 animate-fade-in">
      <h3 className="text-xl font-bold font-display text-white">
        Detalhes do Estabelecimento
      </h3>
      <div>
        <label className="block text-xs uppercase tracking-wider text-gray-500 mb-1">
          Nome da Loja
        </label>
        <input
          type="text"
          value={formData.venueName}
          onChange={e => handleInputChange('venueName', e.target.value)}
          className="w-full bg-surface border border-white/10 rounded-lg p-3 text-white focus:border-primary outline-none"
        />
      </div>
      <div>
        <label className="block text-xs uppercase tracking-wider text-gray-500 mb-1">
          Endereço Completo
        </label>
        <textarea
          value={formData.address}
          onChange={e => handleInputChange('address', e.target.value)}
          className="w-full bg-surface border border-white/10 rounded-lg p-3 text-white focus:border-primary outline-none h-24"
        />
      </div>
    </div>
  );

  const renderStep3Venue = () => (
    <div className="space-y-6 animate-fade-in">
      <h3 className="text-xl font-bold font-display text-white">
        Comodidades e Termos
      </h3>
      <div>
        <label className="block text-xs uppercase tracking-wider text-gray-500 mb-3">
          O que sua loja oferece?
        </label>
        <div className="flex flex-wrap gap-2">
          {[
            'Wi-Fi',
            'Ar Condicionado',
            'Lanchonete',
            'Estacionamento',
            'Mesas Privativas',
            'Empréstimo de Jogos',
          ].map(a => (
            <button
              key={a}
              type="button"
              onClick={() => toggleSelection('amenities', a)}
              className={`px-3 py-1 rounded-full text-xs font-bold border transition-colors ${formData.amenities.includes(a) ? 'bg-primary border-primary text-white' : 'bg-surface border-white/10 text-gray-400 hover:border-white/30'}`}
            >
              {a}
            </button>
          ))}
        </div>
      </div>

      <div className="pt-4 border-t border-white/10">
        <label className="flex items-center gap-3 cursor-pointer group">
          <div
            className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${termsAccepted ? 'bg-accent border-accent' : 'border-gray-500 group-hover:border-white'}`}
          >
            {termsAccepted && (
              <span className="material-symbols-outlined text-black text-sm font-bold">
                check
              </span>
            )}
          </div>
          <input
            type="checkbox"
            className="hidden"
            checked={termsAccepted}
            onChange={e => setTermsAccepted(e.target.checked)}
          />
          <span className="text-sm text-gray-400">
            Declaro que sou proprietário legal e aceito os{' '}
            <span className="text-white underline">
              Termos de Uso Comercial
            </span>
            .
          </span>
        </label>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 relative">
      <div className="absolute top-0 w-full h-2 bg-gradient-to-r from-primary to-accent opacity-20"></div>

      <div className="w-full max-w-lg z-10">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center text-gray-500 hover:text-white transition-colors text-sm"
        >
          <span className="material-symbols-outlined text-lg mr-1">
            arrow_back
          </span>{' '}
          Voltar
        </button>

        <div className="glass-panel p-8 rounded-2xl border border-white/10">
          <div className="mb-8">
            <div className="flex justify-between items-end mb-2">
              <h2 className="text-2xl font-display font-bold text-white">
                Cadastro {getRoleLabel()}
              </h2>
              <span className="text-sm font-mono text-primary">
                Passo {step} de {getMaxSteps()}
              </span>
            </div>
            <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-500 ease-out"
                style={{ width: `${(step / getMaxSteps()) * 100}%` }}
              ></div>
            </div>
          </div>

          <div className="min-h-[300px]">
            {step === 1 && renderStep1Basic()}
            {role === UserRole.PLAYER && step === 2 && renderStep2Preferences()}
            {role === UserRole.MASTER && step === 2 && renderStep2Master()}
            {role === UserRole.MASTER && step === 3 && renderStep3Master()}
            {role === UserRole.VENUE && step === 2 && renderStep2Venue()}
            {role === UserRole.VENUE && step === 3 && renderStep3Venue()}
          </div>

          <div className="mt-8 flex justify-between items-center">
            <button
              onClick={() => setStep(step - 1)}
              disabled={step === 1}
              className={`text-sm font-bold ${step === 1 ? 'text-gray-600 cursor-not-allowed' : 'text-gray-400 hover:text-white'}`}
            >
              Anterior
            </button>
            <button
              onClick={handleNext}
              className="px-6 py-3 bg-primary hover:bg-primary-hover text-white rounded-xl font-bold shadow-lg transition-all transform hover:-translate-y-0.5"
            >
              {step === getMaxSteps() ? 'Concluir Cadastro' : 'Próximo'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
