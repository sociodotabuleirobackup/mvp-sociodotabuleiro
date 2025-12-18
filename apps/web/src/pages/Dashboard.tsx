import React from 'react';
import { useAuth } from '../store';
import { UserRole } from '@socio-do-tabuleiro/shared';
// Changed react-router-dom to react-router to fix missing export errors
import { Link } from 'react-router';
import { useSessions } from '../features/sessions/useSessions';
import { useBookings } from '../features/bookings/useBookings';

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

const MasterDashboard = () => {
  const { user } = useAuth();
  const { sessions, loading, error } = useSessions({
    autoFetch: true,
    filters: { masterId: user?.uid },
  });

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-display font-bold">Painel do Mestre</h2>
          <Link
            to="/create-session"
            className="flex items-center gap-2 bg-primary px-4 py-2 rounded-lg font-bold hover:bg-primary-hover transition-colors"
          >
            <span className="material-symbols-outlined">add</span>
            Criar Sessão
          </Link>
        </div>
        <div className="text-center py-8">
          <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto"></div>
          <p className="text-gray-400 mt-2">Carregando suas sessões...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-display font-bold">Painel do Mestre</h2>
          <Link
            to="/create-session"
            className="flex items-center gap-2 bg-primary px-4 py-2 rounded-lg font-bold hover:bg-primary-hover transition-colors"
          >
            <span className="material-symbols-outlined">add</span>
            Criar Sessão
          </Link>
        </div>
        <div className="glass-panel p-6 rounded-xl border border-red-500/20 bg-red-500/5">
          <p className="text-red-400">Erro ao carregar sessões: {error}</p>
        </div>
      </div>
    );
  }

  const activeSessions = sessions.filter(s => s.status === 'published');
  const totalPlayers = sessions.reduce(
    (acc, session) => acc + (session.playersCurrent || 0),
    0
  );
  const totalRevenue = sessions.reduce(
    (acc, session) => acc + session.price * (session.playersCurrent || 0),
    0
  );
  const nextSession = sessions
    .filter(s => new Date(s.date) > new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-display font-bold">Painel do Mestre</h2>
        <Link
          to="/create-session"
          className="flex items-center gap-2 bg-primary px-4 py-2 rounded-lg font-bold hover:bg-primary-hover transition-colors"
        >
          <span className="material-symbols-outlined">add</span>
          Criar Sessão
        </Link>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          label="Próxima Sessão"
          value={
            nextSession
              ? new Date(nextSession.date).toLocaleDateString('pt-BR', {
                  day: '2-digit',
                  month: 'short',
                })
              : 'Nenhuma'
          }
          icon="calendar_today"
        />
        <StatCard
          label="Jogadores Ativos"
          value={totalPlayers.toString()}
          icon="group"
        />
        <StatCard
          label="Sessões Ativas"
          value={activeSessions.length.toString()}
          icon="star"
          color="text-accent"
        />
        <StatCard
          label="Faturamento"
          value={`R$ ${totalRevenue.toFixed(0)}`}
          icon="payments"
          color="text-green-400"
        />
      </div>

      {/* Active Campaigns */}
      <section>
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">swords</span>
          Mesas Ativas
        </h3>
        {activeSessions.length === 0 ? (
          <div className="glass-panel p-8 rounded-xl text-center">
            <span className="material-symbols-outlined text-6xl text-gray-600 mb-4 block">
              add_circle
            </span>
            <h4 className="text-lg font-bold mb-2">Nenhuma sessão ativa</h4>
            <p className="text-gray-400 mb-4">
              Crie sua primeira sessão para começar a receber jogadores!
            </p>
            <Link
              to="/create-session"
              className="inline-flex items-center gap-2 bg-primary px-4 py-2 rounded-lg font-bold hover:bg-primary-hover transition-colors"
            >
              <span className="material-symbols-outlined">add</span>
              Criar Primeira Sessão
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeSessions.map(session => (
              <SessionCard
                key={session.id}
                id={session.id}
                title={session.title}
                system={session.system}
                date={new Date(session.date).toLocaleDateString('pt-BR', {
                  weekday: 'short',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
                players={`${session.playersCurrent}/${session.playersMax}`}
                status={session.status}
                image={session.imageUrl}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

const PlayerDashboard = () => {
  const { bookings, loading: bookingsLoading } = useBookings();
  const { sessions, loading: sessionsLoading } = useSessions({
    autoFetch: true,
    filters: { status: 'published' },
  });

  const nextBooking = bookings
    .filter(
      b =>
        b.status === 'CONFIRMED' &&
        b.session &&
        new Date(b.session.scheduledAt) > new Date()
    )
    .sort(
      (a, b) =>
        new Date(a.session!.scheduledAt).getTime() -
        new Date(b.session!.scheduledAt).getTime()
    )[0];

  const recommendedSessions = sessions.slice(0, 3);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-display font-bold">Painel do Jogador</h2>
        <Link
          to="/sessions"
          className="flex items-center gap-2 bg-surface border border-border px-4 py-2 rounded-lg hover:border-primary transition-colors"
        >
          <span className="material-symbols-outlined text-primary">search</span>
          Buscar Mesas
        </Link>
      </div>

      {/* Next Adventure */}
      {bookingsLoading ? (
        <div className="glass-panel p-6 rounded-2xl">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-600 rounded mb-4 w-1/3"></div>
            <div className="flex gap-4 items-center mb-4">
              <div className="w-16 h-16 bg-gray-600 rounded-lg"></div>
              <div className="flex-1">
                <div className="h-5 bg-gray-600 rounded mb-2"></div>
                <div className="h-4 bg-gray-600 rounded w-2/3"></div>
              </div>
            </div>
          </div>
        </div>
      ) : nextBooking ? (
        <div className="glass-panel p-6 rounded-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <span className="material-symbols-outlined text-9xl">swords</span>
          </div>
          <h3 className="text-xl font-bold mb-2">Próxima Aventura</h3>
          <div className="flex gap-4 items-center mb-4">
            <div
              className="w-16 h-16 rounded-lg bg-cover bg-center"
              style={{
                backgroundImage: `url('${nextBooking.session?.imageUrl || 'https://picsum.photos/seed/default/200'}')`,
              }}
            ></div>
            <div>
              <p className="font-bold text-lg">{nextBooking.session?.title}</p>
              <p className="text-gray-400 text-sm">
                {nextBooking.session?.master?.user?.name ||
                  nextBooking.session?.masterName ||
                  'Mestre'}{' '}
                •{' '}
                {new Date(
                  nextBooking.session?.scheduledAt || ''
                ).toLocaleDateString('pt-BR', {
                  weekday: 'short',
                  day: '2-digit',
                  month: 'short',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Link
              to={`/sessions/${nextBooking.sessionId}`}
              className="flex-1 bg-primary text-white py-2 rounded-lg font-bold text-center"
            >
              Ver Detalhes
            </Link>
            <button className="px-4 py-2 bg-white/5 rounded-lg border border-white/10">
              Chat
            </button>
          </div>
        </div>
      ) : (
        <div className="glass-panel p-6 rounded-2xl text-center">
          <span className="material-symbols-outlined text-6xl text-gray-600 mb-4 block">
            event_available
          </span>
          <h3 className="text-xl font-bold mb-2">Nenhuma aventura agendada</h3>
          <p className="text-gray-400 mb-4">
            Explore as mesas disponíveis e reserve sua próxima aventura!
          </p>
          <Link
            to="/sessions"
            className="inline-flex items-center gap-2 bg-primary px-4 py-2 rounded-lg font-bold hover:bg-primary-hover transition-colors"
          >
            <span className="material-symbols-outlined">search</span>
            Buscar Mesas
          </Link>
        </div>
      )}

      {/* Recommended Sessions */}
      <section>
        <h3 className="text-lg font-bold mb-4">Recomendado para você</h3>
        {sessionsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="glass-panel p-3 rounded-xl animate-pulse">
                <div className="flex gap-3">
                  <div className="w-20 h-20 bg-gray-600 rounded-lg shrink-0"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-600 rounded mb-2"></div>
                    <div className="h-3 bg-gray-600 rounded mb-2 w-2/3"></div>
                    <div className="h-3 bg-gray-600 rounded w-1/3"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : recommendedSessions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recommendedSessions.map(session => (
              <Link
                key={session.id}
                to={`/sessions/${session.id}`}
                className="glass-panel p-3 rounded-xl flex gap-3 hover:bg-white/5 cursor-pointer transition-colors"
              >
                <div
                  className="w-20 h-20 rounded-lg bg-cover bg-center shrink-0"
                  style={{ backgroundImage: `url('${session.imageUrl}')` }}
                ></div>
                <div>
                  <h4 className="font-bold text-sm">{session.title}</h4>
                  <p className="text-xs text-gray-400 mt-1">
                    {session.system} •{' '}
                    {session.locationType === 'ONLINE'
                      ? 'Online'
                      : 'Presencial'}
                  </p>
                  <span className="text-accent text-xs font-bold mt-2 block">
                    R$ {session.price.toFixed(0)}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-400">
            <p>Nenhuma sessão disponível no momento.</p>
          </div>
        )}
      </section>
    </div>
  );
};

const VenueDashboard = () => (
  <div className="space-y-6">
    <h2 className="text-2xl font-display font-bold">Gestão da Loja</h2>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Table Management */}
      <div className="glass-panel p-5 rounded-2xl">
        <div className="flex justify-between mb-4">
          <h3 className="font-bold flex items-center gap-2">
            <span className="material-symbols-outlined text-accent">
              table_restaurant
            </span>
            Mesas
          </h3>
          <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded">
            3 Ocupadas
          </span>
        </div>
        <div className="space-y-3">
          <VenueTableItem
            name="Mesa Principal"
            status="OCCUPIED"
            time="19:00 - 23:00"
          />
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
            <span className="material-symbols-outlined text-orange-400">
              restaurant
            </span>
            Pedidos Cozinha
          </h3>
          <span className="text-xs bg-red-500/20 text-red-400 px-2 py-1 rounded">
            2 Pendentes
          </span>
        </div>
        <div className="space-y-3">
          <div className="flex justify-between items-center p-3 bg-surface rounded-lg border-l-4 border-red-500">
            <div>
              <p className="font-bold text-sm">Mesa Principal</p>
              <p className="text-xs text-gray-400">2x Hambúrguer, 1x Cola</p>
            </div>
            <button className="p-2 hover:bg-white/10 rounded-full">
              <span className="material-symbols-outlined">check</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// --- Components ---

const StatCard = ({ label, value, icon, color = 'text-primary' }: any) => (
  <div className="glass-panel p-4 rounded-xl flex flex-col items-center justify-center text-center hover:border-primary/50 transition-colors cursor-default">
    <span className={`material-symbols-outlined text-2xl mb-1 ${color}`}>
      {icon}
    </span>
    <span className="text-xl font-bold font-display">{value}</span>
    <span className="text-xs text-gray-500 uppercase tracking-wide">
      {label}
    </span>
  </div>
);

const SessionCard = ({
  id,
  title,
  system,
  date,
  players,
  status,
  image,
}: any) => (
  <Link
    to={`/sessions/${id}`}
    className="glass-panel rounded-xl overflow-hidden group block hover:border-primary/50 transition-colors"
  >
    <div
      className="h-32 bg-cover bg-center relative"
      style={{ backgroundImage: `url('${image}')` }}
    >
      <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors"></div>
      <span
        className={`absolute top-2 right-2 px-2 py-0.5 text-[10px] font-bold rounded ${status === 'published' ? 'bg-green-500 text-black' : status === 'completed' ? 'bg-blue-500 text-white' : 'bg-yellow-500 text-black'}`}
      >
        {status === 'published'
          ? 'ATIVA'
          : status === 'completed'
            ? 'FINALIZADA'
            : status.toUpperCase()}
      </span>
    </div>
    <div className="p-4">
      <h4 className="font-bold text-lg mb-1 truncate">{title}</h4>
      <p className="text-xs text-primary font-bold mb-3">{system}</p>

      <div className="flex justify-between text-sm text-gray-400 border-t border-border pt-3">
        <span className="flex items-center gap-1">
          <span className="material-symbols-outlined text-base">
            calendar_month
          </span>{' '}
          {date}
        </span>
        <span className="flex items-center gap-1">
          <span className="material-symbols-outlined text-base">person</span>{' '}
          {players}
        </span>
      </div>
    </div>
  </Link>
);

const VenueTableItem = ({ name, status, time }: any) => (
  <div className="flex justify-between items-center p-3 bg-surface rounded-lg">
    <div className="flex items-center gap-3">
      <div
        className={`w-2 h-2 rounded-full ${status === 'OCCUPIED' ? 'bg-red-500' : status === 'RESERVED' ? 'bg-yellow-500' : 'bg-green-500'}`}
      ></div>
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
