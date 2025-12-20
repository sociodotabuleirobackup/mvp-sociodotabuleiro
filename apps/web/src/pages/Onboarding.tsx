import React, { useState, useEffect } from 'react';
// Changed react-router-dom to react-router to fix missing export errors
import { useNavigate, Link } from 'react-router';
import { useAuth } from '../store';
import { UserRole } from '@socio-do-tabuleiro/shared';
import { Logo } from '../components/Logo';

export const Welcome: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState<'LANDING' | 'ROLE_SELECT' | 'LOGIN'>(
    'LANDING'
  );

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  if (isAuthenticated) {
    return null;
  }

  const handleStart = () => {
    setStep('ROLE_SELECT');
    window.scrollTo(0, 0);
  };

  const handleLoginClick = () => {
    setStep('LOGIN');
    window.scrollTo(0, 0);
  };

  const handleRoleSelect = (role: UserRole) => {
    navigate(`/register/${role}`);
  };

  if (step === 'LANDING') {
    return <LandingPage onStart={handleStart} onLogin={handleLoginClick} />;
  }

  if (step === 'LOGIN') {
    return (
      <LoginForm
        onBack={() => setStep('LANDING')}
        onLoginSuccess={() => {
          navigate('/dashboard');
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background p-6 flex flex-col items-center justify-center relative overflow-hidden">
      <div className="absolute top-[-20%] left-[-20%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-[-20%] right-[-20%] w-[500px] h-[500px] bg-accent/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="w-full max-w-md z-10 animate-fade-in">
        <button
          onClick={() => setStep('LANDING')}
          className="mb-8 flex items-center text-gray-400 hover:text-white transition-colors"
        >
          <span className="material-symbols-outlined">arrow_back</span> Voltar
          para Home
        </button>

        <h2 className="text-3xl font-display font-bold mb-2">
          Escolha seu Destino
        </h2>
        <p className="text-gray-400 mb-8">
          Como você deseja participar da comunidade?
        </p>

        <div className="flex flex-col gap-4">
          <RoleCard
            icon="swords"
            title="Jogador"
            desc="Busco mesas para jogar e grupos para me unir."
            onClick={() => handleRoleSelect(UserRole.PLAYER)}
          />
          <RoleCard
            icon="history_edu"
            title="Mestre (DM)"
            desc="Crio mundos, narro histórias e organizo sessões."
            onClick={() => handleRoleSelect(UserRole.MASTER)}
          />
          <RoleCard
            icon="storefront"
            title="Lojista"
            desc="Ofereço espaço e estrutura para jogos."
            onClick={() => handleRoleSelect(UserRole.VENUE)}
          />
        </div>
      </div>
    </div>
  );
};

const LoginForm: React.FC<{
  onBack: () => void;
  onLoginSuccess: () => void;
}> = ({ onBack, onLoginSuccess }) => {
  const { loginWithEmail, loginWithGoogle, loading, error } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);

  const handleEmailLogin = async () => {
    try {
      setLocalError(null);
      await loginWithEmail(email, password);
      onLoginSuccess();
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : 'Login failed');
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setLocalError(null);
      await loginWithGoogle();
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : 'Login failed');
    }
  };

  return (
    <div className="min-h-screen bg-background p-6 flex flex-col items-center justify-center relative overflow-hidden">
      <div className="absolute top-[-20%] left-[-20%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-[-20%] right-[-20%] w-[500px] h-[500px] bg-accent/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="w-full max-w-md z-10 animate-fade-in glass-panel p-8 rounded-2xl border border-white/10 relative">
        <button
          onClick={onBack}
          className="absolute top-6 left-6 flex items-center text-gray-400 hover:text-white transition-colors text-sm"
        >
          <span className="material-symbols-outlined text-lg mr-1">
            arrow_back
          </span>{' '}
          Voltar
        </button>

        <div className="mt-8">
          <h2 className="text-3xl font-display font-bold mb-2 text-white">
            Bem-vindo de volta
          </h2>
          <p className="text-gray-400 mb-8 text-sm">
            Acesse sua conta para continuar sua jornada.
          </p>

          {(localError || error) && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-300 text-sm">
              {localError || error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-gray-500 mb-1">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full bg-surface border border-white/10 rounded-lg p-3 text-white focus:border-primary outline-none transition-colors"
                placeholder="seu@email.com"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-gray-500 mb-1">
                Senha
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full bg-surface border border-white/10 rounded-lg p-3 text-white focus:border-primary outline-none transition-colors"
                placeholder="••••••••"
              />
            </div>

            <div className="text-right">
              <button className="text-xs text-primary hover:text-primary-light transition-colors">
                Esqueceu a senha?
              </button>
            </div>

            <button
              onClick={handleEmailLogin}
              disabled={loading}
              className="w-full py-3 bg-primary hover:bg-primary-hover text-white rounded-xl font-bold text-lg shadow-[0_0_20px_rgba(107,38,217,0.4)] transition-all transform active:scale-95 mt-2 disabled:opacity-50"
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-2 bg-background text-gray-500">ou continue com</span>
              </div>
            </div>

            <button
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Google
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const LandingPage: React.FC<{ onStart: () => void; onLogin: () => void }> = ({
  onStart,
  onLogin,
}) => {
  return (
    <div className="bg-background min-h-screen text-white overflow-x-hidden selection:bg-primary selection:text-white">
      <nav className="absolute top-0 w-full p-6 flex justify-between items-center z-50">
        <div className="flex items-center gap-2">
          <Logo className="h-10 w-10 drop-shadow-[0_0_8px_rgba(107,38,217,0.5)]" />
          <span className="font-fantasy font-bold text-lg tracking-wider hidden sm:block text-white">
            Sócio do Tabuleiro
          </span>
        </div>
        <button
          onClick={onLogin}
          className="px-6 py-2 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 hover:border-primary text-white transition-all text-sm font-bold tracking-wide uppercase backdrop-blur-md"
        >
          Entrar
        </button>
      </nav>

      <section className="relative min-h-screen flex items-center justify-center px-6 py-20">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?q=80&w=2831&auto=format&fit=crop"
            alt="Epic Tabletop Setup"
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background"></div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-8">
          <h1 className="text-5xl md:text-7xl font-fantasy font-bold leading-tight text-white drop-shadow-2xl">
            A SOBERANIA DA <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-light via-white to-primary-light">
              IMAGINAÇÃO
            </span>
          </h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto font-display font-light">
            Você passou anos construindo mundos inteiros.{' '}
            <br className="hidden md:block" />
            Nós construímos o trono onde você deve sentar.
          </p>
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={onStart}
              className="px-8 py-4 bg-accent hover:bg-accent-hover text-black font-bold rounded-lg text-lg shadow-[0_0_30px_rgba(255,184,0,0.3)] hover:shadow-[0_0_50px_rgba(255,184,0,0.5)] transition-all transform hover:-translate-y-1 uppercase tracking-wide font-display"
            >
              Reivindicar Acesso de Fundador
            </button>
            <button
              onClick={() =>
                document
                  .getElementById('manifesto')
                  ?.scrollIntoView({ behavior: 'smooth' })
              }
              className="px-8 py-4 bg-transparent border border-white/20 hover:border-white text-white rounded-lg text-lg transition-all font-display"
            >
              Ler o Manifesto
            </button>
          </div>
          <div className="text-xs text-gray-500 font-mono pt-4 text-center">
            Acesso antecipado. Sem cartão para cadastro inicial. Cancelamento
            livre.
          </div>
        </div>
      </section>

      <section id="manifesto" className="py-24 px-6 relative bg-surface">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <h2 className="text-3xl md:text-5xl font-fantasy font-bold text-gray-100">
            A ERA DA INOCÊNCIA ACABOU.
          </h2>
          <div className="space-y-6 text-lg text-gray-400 font-sans leading-relaxed">
            <p>
              Disseram que era “apenas um jogo”. Disseram para você crescer.{' '}
              <strong className="text-white block mt-2 text-xl">
                Eles estavam errados.
              </strong>
            </p>
            <p>
              Enquanto o world lá fora simula produtividade em reuniões vazias e
              planilhas cinzas, você gerenciava economias complexas. Você
              liderava exércitos. Você resolvia crises políticas em mundos que
              só existiam na sua mente.
            </p>
            <p className="text-primary-light italic font-serif text-2xl border-l-4 border-primary pl-6 py-2 my-8 text-left">
              "Você não estava brincando. Você estava treinando."
            </p>
            <p>
              O <strong>Sócio do Tabuleiro</strong> não é “um app de agenda”. É
              a infraestrutura que transforma a sua imaginação em{' '}
              <strong>sistema</strong>, em <strong>mercado</strong>, em{' '}
              <strong>carreira</strong>.
            </p>
            <p className="text-xl text-white font-display">
              Porque a imaginação é o petróleo do século 21. <br /> E petróleo
              sem refinaria é só poça no chão.
            </p>
          </div>
        </div>
      </section>

      <section className="py-24 px-6 bg-background">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <ArchetypeCard
            title="PARA O MESTRE"
            subtitle="(O CRIADOR)"
            quote="“Sua narrativa é um ativo financeiro.”"
            image="https://images.unsplash.com/photo-1519074069444-1ba4fff66d16?q=80&w=2574&auto=format&fit=crop"
            features={[
              'Calculadora de Precificação (Hora/Homem)',
              'Contratos Digitais automáticos (ZapSign)',
              'Recebimento com Split (Asaas)',
              'IA de Aventuras: enredo, ganchos e NPCs',
            ]}
          />
          <ArchetypeCard
            title="PARA A LUDERIA"
            subtitle="(O TEMPLO)"
            quote="“O silêncio é prejuízo.”"
            image="https://images.unsplash.com/photo-1563941402622-4e7a488bcc57?q=80&w=2670&auto=format&fit=crop"
            features={[
              'Mapa de Visibilidade (Google Maps)',
              'Agendamento de mesas físicas',
              'Gestão de reservas e horários',
              'Upsell de snacks e bebidas no app',
            ]}
            highlight
          />
          <ArchetypeCard
            title="PARA O JOGADOR"
            subtitle="(O VIAJANTE)"
            quote="“Chega de RPG ruim.”"
            image="https://images.unsplash.com/photo-1605806616949-1e87b487bc2a?q=80&w=2574&auto=format&fit=crop"
            features={[
              'Busca por proximidade (Maps) e filtros',
              'Mestres e mesas com reputação',
              'Agendamento automático (Calendar)',
              'Pagamento simples e seguro (Asaas)',
            ]}
          />
        </div>
      </section>

      <section className="py-24 px-6 bg-surface/50 border-y border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              A BUROCRACIA É NOSSA.{' '}
              <span className="text-primary">A MAGIA É SUA.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <TechItem
              icon="verified_user"
              title="Segurança e Identidade"
              desc="Conta, acesso, perfis e permissões com base sólida (Supabase). Menos gambiarra. Mais controle."
            />
            <TechItem
              icon="gavel"
              title="Segurança Jurídica"
              desc="Contratos (ZapSign). Cada participação pode ter termo de conduta. O profissionalismo blinda a diversão."
            />
            <TechItem
              icon="account_balance_wallet"
              title="Gestão Financeira"
              desc="Cobrança, split, repasses e assinatura (Asaas). Um painel digno de fintech."
            />
            <TechItem
              icon="calendar_month"
              title="Agenda de Verdade"
              desc="Integração Google Calendar. O sistema administra o tempo — você narra."
            />
            <TechItem
              icon="pin_drop"
              title="Geografia e Tráfego"
              desc="Google Maps. Quem está perto te encontra. A cidade vira seu tabuleiro."
            />
            <TechItem
              icon="psychology"
              title="IA do Mestre"
              desc="Você dita o tom. A IA acelera a execução: estrutura, consistência e material pronto."
            />
          </div>
        </div>
      </section>

      <section className="py-24 px-6 bg-background">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-xs font-bold tracking-widest text-accent uppercase mb-12">
            Quem já assumiu o controle
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Testimonial
              quote="Antes eu tinha vergonha de cobrar. Quando coloquei no papel o tempo de preparação, entendi meu valor. Hoje, tenho agenda e respeito."
              author="Lucas F."
              role="Mestre Profissional"
            />
            <Testimonial
              quote="Minha loja ficava morta durante a semana. Agora tenho mesas fixas rodando e o consumo acompanha."
              author="Carlos A."
              role="Dono de Luderia"
            />
            <Testimonial
              quote="Eu só queria jogar sem dor de cabeça. Agora eu encontro mesas perto de mim, vejo avaliações e já sai tudo organizado."
              author="Marina S."
              role="Jogadora"
            />
          </div>
        </div>
      </section>

      <footer className="py-12 px-6 bg-surface border-t border-white/10 relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <Logo className="h-12 w-12" />
            <div className="text-left">
              <h3 className="font-fantasy font-bold text-xl text-white">
                Sócio do Tabuleiro
              </h3>
              <p className="text-xs text-gray-500">
                Onde sua imaginação ganha poder.
              </p>
            </div>
          </div>
          <div className="flex gap-6 text-sm text-gray-400">
            <Link to="/terms" className="hover:text-white transition-colors">
              Termos de Uso
            </Link>
            <Link to="/privacy" className="hover:text-white transition-colors">
              Privacidade
            </Link>
            <Link to="/help" className="hover:text-white transition-colors">
              Suporte
            </Link>
          </div>
          <p className="text-xs text-gray-600">
            &copy; 2025 Sócio do Tabuleiro. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
};

const ArchetypeCard: React.FC<{
  title: string;
  subtitle: string;
  quote: string;
  image: string;
  features: string[];
  highlight?: boolean;
}> = ({ title, subtitle, quote, image, features, highlight }) => (
  <div
    className={`relative group overflow-hidden rounded-2xl border ${highlight ? 'border-accent/50 shadow-[0_0_30px_rgba(255,184,0,0.1)]' : 'border-white/10'} bg-surface transition-all hover:border-white/30`}
  >
    <div className="h-48 relative overflow-hidden">
      <div className="absolute inset-0 bg-black/40 z-10"></div>
      <img
        src={image}
        alt={title}
        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
      />
      <div className="absolute bottom-4 left-4 z-20">
        <h3 className="font-fantasy font-bold text-2xl text-white">{title}</h3>
        <span className="text-xs font-display tracking-widest text-gray-300 uppercase">
          {subtitle}
        </span>
      </div>
    </div>
    <div className="p-6 space-y-6">
      <p className="text-xl font-serif italic text-gray-200">{quote}</p>
      <div className="h-px bg-white/10 w-full"></div>
      <ul className="space-y-3">
        {features.map((feat, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-gray-400">
            <span
              className={`material-symbols-outlined text-base ${highlight ? 'text-accent' : 'text-primary'}`}
            >
              check
            </span>
            {feat}
          </li>
        ))}
      </ul>
    </div>
  </div>
);

const TechItem: React.FC<{ icon: string; title: string; desc: string }> = ({
  icon,
  title,
  desc,
}) => (
  <div className="flex flex-col items-center text-center p-6 rounded-xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/5">
    <div className="w-12 h-12 rounded-full bg-surface border border-white/10 flex items-center justify-center mb-4 text-primary-light">
      <span className="material-symbols-outlined text-2xl">{icon}</span>
    </div>
    <h3 className="font-bold text-lg mb-2 text-white font-display">{title}</h3>
    <p className="text-sm text-gray-400 leading-relaxed">{desc}</p>
  </div>
);

const Testimonial: React.FC<{
  quote: string;
  author: string;
  role: string;
}> = ({ quote, author, role }) => (
  <div className="p-6 rounded-2xl bg-surface border border-white/5 relative">
    <span className="material-symbols-outlined absolute top-4 left-4 text-4xl text-white/5 font-serif">
      format_quote
    </span>
    <p className="text-gray-300 italic mb-6 relative z-10">"{quote}"</p>
    <div>
      <p className="font-bold text-white font-display">{author}</p>
      <p className="text-xs text-primary-light uppercase tracking-wide">
        {role}
      </p>
    </div>
  </div>
);

const RoleCard: React.FC<{
  icon: string;
  title: string;
  desc: string;
  onClick: () => void;
}> = ({ icon, title, desc, onClick }) => (
  <button
    onClick={onClick}
    className="group relative p-5 rounded-2xl glass-panel text-left hover:border-primary/50 transition-all duration-300 hover:-translate-y-1 w-full bg-surface/50"
  >
    <div className="flex items-start gap-4">
      <div className="w-12 h-12 rounded-xl bg-surface flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors text-primary border border-white/5">
        <span className="material-symbols-outlined text-2xl">{icon}</span>
      </div>
      <div>
        <h3 className="text-lg font-bold text-white mb-1 font-display">
          {title}
        </h3>
        <p className="text-sm text-gray-400 leading-snug">{desc}</p>
      </div>
      <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
        <span className="material-symbols-outlined text-primary">
          chevron_right
        </span>
      </div>
    </div>
  </button>
);
