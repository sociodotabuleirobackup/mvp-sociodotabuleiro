import React from 'react';
import { useAuth } from '../store';
import { UserRole } from '../types';
import { Link } from 'react-router-dom';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="p-4 max-w-7xl mx-auto">
      {user.role === UserRole.MASTER && <MasterDashboard />}
      {user.role === UserRole.PLAYER && <PlayerDashboard />}
      {user.role === UserRole.VENUE && <VenueDashboard />}
    </div>
  );
};

// --- Sub-Dashboards ---

const MasterDashboard = () => (
  <div className="space-y-6">
    <div className="flex justify-between items-center">
      <h2 className="text-2xl font-display font-bold">Painel do Mestre</h2>
      <Link to="/create-session" className="flex items-center gap-2 bg-primary px-4 py-2 rounded-lg font-bold hover:bg-primary-hover transition-colors">
        <span className="material-symbols-outlined">add</span>
        Criar Sessão
      </Link>
    </div>

    {/* Quick Stats */}
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <StatCard label="Próxima Sessão" value="14 Out" icon="calendar_today" />
      <StatCard label="Jogadores Ativos" value="12" icon="group" />
      <StatCard label="Avaliação" value="4.9" icon="star" color="text-accent" />
      <StatCard label="Faturamento" value="R$ 450" icon="payments" color="text-green-400" />
    </div>

    {/* Active Campaigns */}
    <section>
      <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
        <span className="material-symbols-outlined text-primary">swords</span>
        Mesas Ativas
      </h3>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        <SessionCard 
          title="A Maldição de Strahd"
          system="D&D 5e"
          date="Sexta, 19:00"
          players="4/6"
          status="CONFIRMED"
          image="https://picsum.photos/seed/strahd/400/200"
        />
        <SessionCard 
          title="Cyberpunk: Neon City"
          system="Cyberpunk Red"
          date="Sábado, 14:00"
          players="2/5"
          status="PENDING"
          image="https://picsum.photos/seed/cyber/400/200"
        />
      </div>
    </section>
  </div>
);

const PlayerDashboard = () => (
  <div className="space-y-6">
    <div className="flex justify-between items-center">
      <h2 className="text-2xl font-display font-bold">Painel do Jogador</h2>
      <button className="flex items-center gap-2 bg-surface border border-border px-4 py-2 rounded-lg hover:border-primary transition-colors">
        <span className="material-symbols-outlined text-primary">search</span>
        Buscar Mesas
      </button>
    </div>

    <div className="glass-panel p-6 rounded-2xl relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4 opacity-10">
        <span className="material-symbols-outlined text-9xl">swords</span>
      </div>
      <h3 className="text-xl font-bold mb-2">Próxima Aventura</h3>
      <div className="flex gap-4 items-center mb-4">
        <div className="w-16 h-16 rounded-lg bg-cover bg-center" style={{backgroundImage: "url('https://picsum.photos/seed/strahd/200')"}}></div>
        <div>
          <p className="font-bold text-lg">A Maldição de Strahd</p>
          <p className="text-gray-400 text-sm">Mestre Alex • Sexta, 19:00</p>
        </div>
      </div>
      <div className="flex gap-2">
        <button className="flex-1 bg-primary text-white py-2 rounded-lg font-bold">Confirmar Presença</button>
        <button className="px-4 py-2 bg-white/5 rounded-lg border border-white/10">Chat</button>
      </div>
    </div>

    <section>
      <h3 className="text-lg font-bold mb-4">Recomendado para você</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
         {/* Placeholder recommendations */}
         {[1, 2, 3].map(i => (
           <div key={i} className="glass-panel p-3 rounded-xl flex gap-3 hover:bg-white/5 cursor-pointer transition-colors">
             <div className="w-20 h-20 rounded-lg bg-cover bg-center shrink-0" style={{backgroundImage: `url('https://picsum.photos/seed/rpg_rec_${i}/200')`}}></div>
             <div>
               <h4 className="font-bold text-sm">One-shot: O Dragão</h4>
               <p className="text-xs text-gray-400 mt-1">D&D 5e • Iniciante</p>
               <span className="text-accent text-xs font-bold mt-2 block">R$ 20,00</span>
             </div>
           </div>
         ))}
      </div>
    </section>
  </div>
);

const VenueDashboard = () => (
  <div className="space-y-6">
    <h2 className="text-2xl font-display font-bold">Gestão da Loja</h2>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Table Management */}
      <div className="glass-panel p-5 rounded-2xl">
        <div className="flex justify-between mb-4">
          <h3 className="font-bold flex items-center gap-2">
            <span className="material-symbols-outlined text-accent">table_restaurant</span>
            Mesas
          </h3>
          <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded">3 Ocupadas</span>
        </div>
        <div className="space-y-3">
          <VenueTableItem name="Mesa Principal" status="OCCUPIED" time="19:00 - 23:00" />
          <VenueTableItem name="Sala VIP" status="RESERVED" time="20:00" />
          <VenueTableItem name="Mesa 03" status="FREE" />
        </div>
        <button className="w-full mt-4 py-2 border border-dashed border-gray-600 rounded-lg text-sm text-gray-400 hover:border-primary hover:text-primary transition-colors">
          + Adicionar Mesa
        </button>
      </div>

      {/* Food Orders (Stub) */}
      <div className="glass-panel p-5 rounded-2xl">
        <div className="flex justify-between mb-4">
          <h3 className="font-bold flex items-center gap-2">
            <span className="material-symbols-outlined text-orange-400">restaurant</span>
            Pedidos Cozinha
          </h3>
          <span className="text-xs bg-red-500/20 text-red-400 px-2 py-1 rounded">2 Pendentes</span>
        </div>
        <div className="space-y-3">
          <div className="flex justify-between items-center p-3 bg-surface rounded-lg border-l-4 border-red-500">
            <div>
              <p className="font-bold text-sm">Mesa Principal</p>
              <p className="text-xs text-gray-400">2x Hambúrguer, 1x Cola</p>
            </div>
            <button className="p-2 hover:bg-white/10 rounded-full"><span className="material-symbols-outlined">check</span></button>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// --- Components ---

const StatCard = ({ label, value, icon, color = 'text-primary' }: any) => (
  <div className="glass-panel p-4 rounded-xl flex flex-col items-center justify-center text-center hover:border-primary/50 transition-colors cursor-default">
    <span className={`material-symbols-outlined text-2xl mb-1 ${color}`}>{icon}</span>
    <span className="text-xl font-bold font-display">{value}</span>
    <span className="text-xs text-gray-500 uppercase tracking-wide">{label}</span>
  </div>
);

const SessionCard = ({ title, system, date, players, status, image }: any) => (
  <div className="glass-panel rounded-xl overflow-hidden group">
    <div className="h-32 bg-cover bg-center relative" style={{backgroundImage: `url('${image}')`}}>
      <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors"></div>
      <span className={`absolute top-2 right-2 px-2 py-0.5 text-[10px] font-bold rounded ${status === 'CONFIRMED' ? 'bg-green-500 text-black' : 'bg-yellow-500 text-black'}`}>
        {status}
      </span>
    </div>
    <div className="p-4">
      <h4 className="font-bold text-lg mb-1 truncate">{title}</h4>
      <p className="text-xs text-primary font-bold mb-3">{system}</p>
      
      <div className="flex justify-between text-sm text-gray-400 border-t border-border pt-3">
        <span className="flex items-center gap-1"><span className="material-symbols-outlined text-base">calendar_month</span> {date}</span>
        <span className="flex items-center gap-1"><span className="material-symbols-outlined text-base">person</span> {players}</span>
      </div>
    </div>
  </div>
);

const VenueTableItem = ({ name, status, time }: any) => (
  <div className="flex justify-between items-center p-3 bg-surface rounded-lg">
    <div className="flex items-center gap-3">
      <div className={`w-2 h-2 rounded-full ${status === 'OCCUPIED' ? 'bg-red-500' : status === 'RESERVED' ? 'bg-yellow-500' : 'bg-green-500'}`}></div>
      <div>
        <p className="text-sm font-bold">{name}</p>
        {time && <p className="text-xs text-gray-400">{time}</p>}
      </div>
    </div>
    <button className="text-gray-500 hover:text-white">
      <span className="material-symbols-outlined text-lg">more_vert</span>
    </button>
  </div>
);
