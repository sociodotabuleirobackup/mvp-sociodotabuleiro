import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Logo } from '../components/Logo';

const StaticLayout: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-background flex flex-col font-sans text-white">
      {/* Header */}
      <header className="h-20 border-b border-white/10 flex items-center justify-between px-6 bg-surface/80 backdrop-blur-md sticky top-0 z-50">
        <Link to="/" className="flex items-center gap-3 group">
           <Logo className="h-10 w-10 drop-shadow-[0_0_8px_rgba(107,38,217,0.5)] transition-transform group-hover:scale-110" />
           <span className="font-fantasy font-bold text-xl tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 hidden sm:block">Sócio do Tabuleiro</span>
        </Link>
        <button onClick={() => navigate(-1)} className="text-gray-400 hover:text-white flex items-center gap-2 text-sm font-bold">
          <span className="material-symbols-outlined">arrow_back</span> Voltar
        </button>
      </header>

      {/* Content */}
      <main className="flex-1 max-w-4xl mx-auto w-full p-8 animate-fade-in">
        <h1 className="text-3xl md:text-4xl font-display font-bold mb-8 text-primary">{title}</h1>
        <div className="prose prose-invert prose-p:text-gray-300 prose-headings:text-white prose-strong:text-white max-w-none">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-surface py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3 opacity-80 hover:opacity-100 transition-opacity">
            <Logo className="h-8 w-8 grayscale hover:grayscale-0 transition-all" />
            <span className="font-fantasy font-bold text-lg text-gray-400">Sócio do Tabuleiro</span>
          </div>
          
          <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-400 font-bold">
            <Link to="/terms" className="hover:text-primary transition-colors">Termos de Uso</Link>
            <Link to="/privacy" className="hover:text-primary transition-colors">Privacidade</Link>
            <Link to="/help" className="hover:text-primary transition-colors">Suporte</Link>
          </div>

          <p className="text-xs text-gray-600">
            &copy; 2025 Sócio do Tabuleiro. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
};

export const Terms: React.FC = () => (
  <StaticLayout title="Termos de Uso">
    <p className="lead text-lg text-gray-400 mb-6">Última atualização: Outubro de 2025</p>
    
    <h3>1. Aceitação dos Termos</h3>
    <p>Ao acessar e utilizar o <strong>Sócio do Tabuleiro</strong>, você aceita e concorda em estar vinculado aos termos e disposições deste acordo. Além disso, ao utilizar serviços específicos, você estará sujeito a quaisquer diretrizes ou regras publicadas aplicáveis a tais serviços.</p>

    <h3>2. Descrição do Serviço</h3>
    <p>O Sócio do Tabuleiro é uma plataforma de marketplace e gestão para jogos de RPG e tabuleiro, conectando Mestres, Jogadores e Lojistas. A plataforma atua como intermediária, fornecendo ferramentas para agendamento, pagamentos e gestão de mesas.</p>

    <h3>3. Conduta do Usuário</h3>
    <p>Você concorda em manter um ambiente de respeito e "fair play". Comportamentos tóxicos, discriminatórios ou assédio resultarão na suspensão imediata da conta.</p>

    <h3>4. Pagamentos e Taxas</h3>
    <p>Transações realizadas na plataforma estão sujeitas a uma taxa de serviço (Split de Pagamento) retida automaticamente. O usuário reconhece que o processamento financeiro é realizado por parceiros (Asaas).</p>
  </StaticLayout>
);

export const Privacy: React.FC = () => (
  <StaticLayout title="Política de Privacidade">
    <p className="lead text-lg text-gray-400 mb-6">Sua privacidade é crítica para nós (fizemos um teste de Percepção com vantagem).</p>

    <h3>1. Coleta de Informações</h3>
    <p>Coletamos informações necessárias para a prestação do serviço: dados de identificação (Nome, Email), dados de pagamento (processados de forma segura por terceiros) e dados de localização (para a funcionalidade de mapas).</p>

    <h3>2. Uso das Informações</h3>
    <p>Utilizamos seus dados para:</p>
    <ul>
      <li>Processar reservas e pagamentos.</li>
      <li>Conectar você a mesas e lojas próximas (Geolocalização).</li>
      <li>Melhorar nossos serviços e comunicar atualizações.</li>
    </ul>

    <h3>3. Compartilhamento de Dados</h3>
    <p>Não vendemos seus dados. Compartilhamos apenas o estritamente necessário com parceiros essenciais (ex: Gateway de Pagamento, Plataforma de Assinatura Digital).</p>
  </StaticLayout>
);

export const Support: React.FC = () => (
  <StaticLayout title="Ajuda e Suporte">
    <p className="lead text-lg text-gray-400 mb-8">Precisando de um Clérigo ou de um Mestre do Conhecimento?</p>

    <div className="grid md:grid-cols-2 gap-6 not-prose">
      <div className="p-6 border border-white/10 rounded-xl bg-white/5 hover:border-primary/50 transition-colors">
        <span className="material-symbols-outlined text-4xl text-primary mb-4">mail</span>
        <h3 className="text-xl font-bold text-white mb-2">Contato por Email</h3>
        <p className="text-gray-400 text-sm mb-4">Para questões complexas, denúncias ou parcerias.</p>
        <a href="mailto:suporte@sociodotabuleiro.com.br" className="text-accent font-bold hover:underline">suporte@sociodotabuleiro.com.br</a>
      </div>

      <div className="p-6 border border-white/10 rounded-xl bg-white/5 hover:border-primary/50 transition-colors">
        <span className="material-symbols-outlined text-4xl text-green-400 mb-4">help</span>
        <h3 className="text-xl font-bold text-white mb-2">FAQ / Base de Conhecimento</h3>
        <p className="text-gray-400 text-sm mb-4">Tutoriais sobre como criar mesas, configurar pagamentos e mais.</p>
        <button className="text-white bg-white/10 px-4 py-2 rounded hover:bg-white/20 font-bold text-sm">Acessar FAQ</button>
      </div>
    </div>
  </StaticLayout>
);