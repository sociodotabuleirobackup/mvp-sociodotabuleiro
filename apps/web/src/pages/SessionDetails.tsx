import React, { useState, useEffect } from 'react';
// Changed react-router-dom to react-router to fix missing export errors
import { useParams, useNavigate } from 'react-router';
import { useAuth } from '../store';
import {
  UserRole,
  BookingStatus,
  GeoCoordinates,
  isSessionActive,
  isSessionCompleted,
  isSessionCancelled,
} from '@socio-do-tabuleiro/shared';
import { asaas } from '../services/asaas';
import { maps } from '../services/maps';
import { useSession } from '../features/sessions/useSession';
import { useBookings } from '../features/bookings/useBookings';

export const SessionDetails: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const {
    session,
    loading: sessionLoading,
    error: sessionError,
    deleteSession,
  } = useSession(id);
  const { bookings, createBooking, confirmBooking } = useBookings(false);

  const [actionLoading, setActionLoading] = useState(false);
  const [bookingStatus, setBookingStatus] = useState<BookingStatus | null>(
    null
  );

  // Maps Integration State
  const [, setUserLocation] = useState<GeoCoordinates | null>(null);
  const [distance, setDistance] = useState<string | null>(null);
  const [locLoading, setLocLoading] = useState(false);

  const isPlayer = user?.role === UserRole.PLAYER;
  const isMaster =
    user?.uid === session?.masterId || user?.role === UserRole.MASTER;

  // Check if user has an existing booking for this session
  useEffect(() => {
    if (session && bookings.length > 0) {
      const existingBooking = bookings.find(b => b.sessionId === session.id);
      if (existingBooking) {
        setBookingStatus(existingBooking.status);
      }
    }
  }, [session, bookings]);

  // Maps Effect
  useEffect(() => {
    const fetchLocationData = async () => {
      if (session?.locationType === 'VENUE' && session.venueAddress) {
        try {
          setLocLoading(true);
          // 1. Get Venue Coordinates (Mocked)
          const venueCoords = await maps.geocode(session.venueAddress);

          // 2. Get User Coordinates
          const userCoords = await maps.getCurrentPosition();
          setUserLocation(userCoords);

          // 3. Calculate Distance
          const dist = await maps.getDistance(userCoords, venueCoords);
          setDistance(dist);
        } catch (error) {
          console.log('Could not calculate distance:', error);
        } finally {
          setLocLoading(false);
        }
      }
    };

    if (session) {
      fetchLocationData();
    }
  }, [session?.locationType, session?.venueAddress]);

  const handleBook = async () => {
    if (!session) return;

    try {
      setActionLoading(true);
      await createBooking(session.id);
      setBookingStatus(BookingStatus.PENDING);
    } catch (error) {
      alert(
        'Erro ao fazer reserva: ' +
          (error instanceof Error ? error.message : 'Erro desconhecido')
      );
    } finally {
      setActionLoading(false);
    }
  };

  const handlePay = async () => {
    if (!session) return;

    try {
      setActionLoading(true);

      // Find the pending booking
      const pendingBooking = bookings.find(
        b =>
          b.sessionId === session.id &&
          b.status === BookingStatus.PENDING
      );
      if (pendingBooking) {
        await confirmBooking(pendingBooking.id);
        setBookingStatus(BookingStatus.CONFIRMED);
      } else {
        // Simulate payment with Asaas
        await asaas.createCharge({
          customer: 'cus_mock',
          billingType: 'PIX',
          value: session.price,
          dueDate: new Date().toISOString(),
        });
        setBookingStatus(BookingStatus.CONFIRMED);
      }
    } catch (error) {
      alert(
        'Erro no pagamento: ' +
          (error instanceof Error ? error.message : 'Erro desconhecido')
      );
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancelSession = async () => {
    if (!session) return;

    if (
      confirm(
        'Tem certeza que deseja cancelar esta sessão? Esta ação não pode ser desfeita.'
      )
    ) {
      try {
        setActionLoading(true);
        await deleteSession();
        alert('Sessão cancelada com sucesso!');
        navigate('/dashboard');
      } catch (error) {
        alert(
          'Erro ao cancelar sessão: ' +
            (error instanceof Error ? error.message : 'Erro desconhecido')
        );
      } finally {
        setActionLoading(false);
      }
    }
  };

  const openDirections = () => {
    if (session?.venueAddress) {
      window.open(maps.getDirectionsLink(session.venueAddress), '_blank');
    }
  };

  if (sessionLoading) {
    return (
      <div className="max-w-5xl mx-auto pb-12 animate-fade-in">
        <div className="h-64 md:h-80 w-full bg-gray-800 animate-pulse"></div>
        <div className="px-6 relative z-20 -mt-20">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex-1 space-y-6">
              <div className="animate-pulse">
                <div className="h-8 bg-gray-600 rounded mb-4"></div>
                <div className="h-6 bg-gray-600 rounded mb-2 w-1/3"></div>
                <div className="h-20 bg-gray-600 rounded"></div>
              </div>
            </div>
            <div className="w-full md:w-80 shrink-0">
              <div className="glass-panel p-6 rounded-xl animate-pulse">
                <div className="h-20 bg-gray-600 rounded mb-4"></div>
                <div className="h-12 bg-gray-600 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (sessionError || !session) {
    return (
      <div className="max-w-5xl mx-auto pb-12 animate-fade-in">
        <div className="px-6 py-20 text-center">
          <span className="material-symbols-outlined text-6xl text-gray-600 mb-4 block">
            error
          </span>
          <h2 className="text-2xl font-bold mb-2">Sessão não encontrada</h2>
          <p className="text-gray-400 mb-6">
            {sessionError ||
              'A sessão que você está procurando não existe ou foi removida.'}
          </p>
          <button
            onClick={() => navigate(-1)}
            className="bg-primary hover:bg-primary-hover px-6 py-3 rounded-lg font-bold transition-colors"
          >
            Voltar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto pb-12 animate-fade-in">
      {/* Hero Image */}
      <div className="h-64 md:h-80 w-full relative">
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10"></div>
        <img
          src={session.imageUrl}
          alt={session.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-4 right-4 z-20">
          <span
            className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg ${isSessionActive(session.status) ? 'bg-green-500 text-black' : isSessionCancelled(session.status) ? 'bg-red-500 text-white' : 'bg-gray-500 text-white'}`}
          >
            {isSessionActive(session.status)
              ? 'ATIVA'
              : isSessionCompleted(session.status)
                ? 'FINALIZADA'
                : isSessionCancelled(session.status)
                  ? 'CANCELADA'
                  : String(session.status).toUpperCase()}
          </span>
        </div>
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 z-20 bg-black/50 backdrop-blur-md p-2 rounded-full text-white hover:bg-black/70 transition-colors"
        >
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
      </div>

      <div className="px-6 relative z-20 -mt-20">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Main Info */}
          <div className="flex-1 space-y-6">
            <div>
              <div className="flex gap-2 mb-2">
                {(session.tags || []).map(tag => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 rounded bg-primary/20 text-primary text-[10px] font-bold uppercase tracking-wider border border-primary/30"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <h1 className="text-4xl font-display font-bold text-white mb-2">
                {session.title}
              </h1>
              <p className="text-lg text-primary font-bold mb-4">
                {session.system}
              </p>

              <div className="flex items-center gap-4 text-sm text-gray-400 border-y border-white/10 py-4">
                <div className="flex items-center gap-2">
                  <img
                    src={session.masterAvatar}
                    className="w-8 h-8 rounded-full border border-white/20"
                    alt="Master"
                  />
                  <span>
                    Narrado por{' '}
                    <strong className="text-white">{session.masterName}</strong>
                  </span>
                </div>
                <div className="w-px h-4 bg-white/20"></div>
                <div className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-base">
                    calendar_month
                  </span>
                  {new Date(session.date || session.scheduledAt || '').toLocaleDateString('pt-BR', {
                    weekday: 'short',
                    day: '2-digit',
                    month: 'short',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </div>
              </div>
            </div>

            <div className="glass-panel p-6 rounded-xl">
              <h3 className="text-lg font-bold mb-3 font-display">
                About the Adventure
              </h3>
              <p className="text-gray-300 leading-relaxed text-sm whitespace-pre-line">
                {session.description}
              </p>
            </div>

            {/* Management Panel (Master Only) */}
            {isMaster && (
              <div className="glass-panel p-6 rounded-xl border border-white/10">
                <h3 className="text-lg font-bold mb-4 font-display flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">
                    admin_panel_settings
                  </span>
                  Session Management
                </h3>
                <div className="flex gap-3">
                  {isSessionActive(session.status) && (
                    <button
                      onClick={handleCancelSession}
                      disabled={actionLoading}
                      className="px-4 py-2 bg-red-500/10 border border-red-500/50 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-colors text-sm font-bold disabled:opacity-50"
                    >
                      {actionLoading ? 'Cancelando...' : 'Cancelar Sessão'}
                    </button>
                  )}
                  {isSessionCompleted(session.status) && (
                    <span className="text-green-500 font-bold text-sm flex items-center gap-2">
                      <span className="material-symbols-outlined">
                        check_circle
                      </span>{' '}
                      Sessão Finalizada
                    </span>
                  )}
                  {isSessionCancelled(session.status) && (
                    <span className="text-red-500 font-bold text-sm flex items-center gap-2">
                      <span className="material-symbols-outlined">cancel</span>{' '}
                      Sessão Cancelada
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Location with Google Maps Integration */}
            <div className="glass-panel p-6 rounded-xl flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="flex gap-4 items-start">
                <div className="p-3 bg-white/5 rounded-lg text-accent shrink-0">
                  <span className="material-symbols-outlined text-2xl">
                    {session.locationType === 'ONLINE' ? 'wifi' : 'storefront'}
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-1 font-display">
                    {session.locationType === 'ONLINE'
                      ? 'Online Session'
                      : session.venueName}
                  </h3>
                  <p className="text-gray-400 text-sm">
                    {session.venueAddress ||
                      'Link will be sent after confirmation.'}
                  </p>

                  {/* Distance Indicator */}
                  {session.locationType === 'VENUE' && (
                    <div className="mt-2 flex items-center gap-2 text-xs">
                      {locLoading ? (
                        <span className="text-gray-500 animate-pulse">
                          Calculating distance...
                        </span>
                      ) : distance ? (
                        <span className="bg-primary/20 text-primary px-2 py-0.5 rounded flex items-center gap-1 font-bold">
                          <span className="material-symbols-outlined text-[10px]">
                            near_me
                          </span>
                          {distance} from you
                        </span>
                      ) : (
                        <span className="text-gray-600">
                          Location unavailable
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {session.locationType === 'VENUE' && (
                <button
                  onClick={openDirections}
                  className="w-full sm:w-auto px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-colors"
                >
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/a/aa/Google_Maps_icon_%282020%29.svg"
                    alt="Maps"
                    className="w-5 h-5"
                  />
                  Get Directions
                </button>
              )}
            </div>
          </div>

          {/* Action Card (Sticky) */}
          <div className="w-full md:w-80 shrink-0">
            <div className="glass-panel p-6 rounded-xl sticky top-20 border border-white/10 shadow-2xl bg-surface/90 backdrop-blur-xl">
              <div className="flex justify-between items-end mb-6">
                <div>
                  <span className="text-gray-400 text-xs uppercase tracking-wide">
                    Value per Player
                  </span>
                  <div className="text-3xl font-bold text-white font-display">
                    R$ {session.price.toFixed(0)}
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 text-sm font-bold text-gray-300">
                    <span className="material-symbols-outlined text-sm">
                      group
                    </span>
                    {session.playersCurrent || 0}/{session.playersMax || session.maxPlayers || 0}
                  </div>
                  <span className="text-[10px] text-green-400">
                    Spots available
                  </span>
                </div>
              </div>

              {/* Booking Logic UI */}
              {!isPlayer ? (
                <div className="p-3 bg-white/5 rounded-lg text-center text-gray-500 text-sm">
                  {isMaster
                    ? 'You are the Master of this table.'
                    : 'Log in as Player to book.'}
                </div>
              ) : bookingStatus === BookingStatus.CONFIRMED ? (
                <div className="bg-green-500/20 border border-green-500/50 p-4 rounded-xl text-center">
                  <span className="material-symbols-outlined text-4xl text-green-400 mb-2">
                    check_circle
                  </span>
                  <h3 className="font-bold text-white mb-1">Confirmed!</h3>
                  <p className="text-xs text-green-300 mb-4">
                    Your spot is guaranteed.
                  </p>
                  <button className="w-full py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg font-bold text-sm">
                    Add to Calendar
                  </button>
                </div>
              ) : bookingStatus === BookingStatus.PENDING ? (
                <div className="space-y-3">
                  <div className="bg-yellow-500/10 border border-yellow-500/30 p-3 rounded-lg text-xs text-yellow-200">
                    Your spot is reserved for 15 minutes. Complete the payment
                    to confirm.
                  </div>
                  <button
                    onClick={handlePay}
                    disabled={actionLoading}
                    className="w-full py-3 bg-green-600 hover:bg-green-500 text-white rounded-xl font-bold shadow-lg flex justify-center items-center gap-2"
                  >
                    {actionLoading ? (
                      'Processando...'
                    ) : (
                      <>
                        <span className="material-symbols-outlined">pix</span>
                        Pagar com Pix
                      </>
                    )}
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleBook}
                  disabled={
                    actionLoading ||
                    (session.playersCurrent || 0) >= (session.playersMax || session.maxPlayers || 0) ||
                    !isSessionActive(session.status)
                  }
                  className="w-full py-4 bg-primary hover:bg-primary-hover text-white rounded-xl font-bold text-lg shadow-[0_0_20px_rgba(107,38,217,0.4)] transition-all transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {!isSessionActive(session.status)
                    ? 'Mesa Fechada'
                    : actionLoading
                      ? 'Reservando...'
                      : 'Reservar Vaga'}
                </button>
              )}

              <div className="mt-6 pt-4 border-t border-white/10">
                <p className="text-[10px] text-center text-gray-500">
                  Refund guarantee if canceled by the master.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
