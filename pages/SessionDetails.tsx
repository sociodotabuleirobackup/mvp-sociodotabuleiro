
import React, { useState, useEffect } from 'react';
// Changed react-router-dom to react-router to fix missing export errors
import { useParams, useNavigate } from 'react-router';
import { useAuth } from '../store';
import { Session, UserRole, BookingStatus, SessionStatus, GeoCoordinates } from '../types';
import { asaas } from '../services/asaas';
import { maps } from '../services/maps';

export const SessionDetails: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [loading, setLoading] = useState(false);
  const [bookingStatus, setBookingStatus] = useState<BookingStatus | null>(null);
  
  // Maps Integration State
  const [userLocation, setUserLocation] = useState<GeoCoordinates | null>(null);
  const [distance, setDistance] = useState<string | null>(null);
  const [locLoading, setLocLoading] = useState(false);
  
  // Mock Session Data with Local State for interactions
  const [session, setSession] = useState<Session>({
    id: id || '1',
    title: 'A Maldição de Strahd',
    system: 'D&D 5e',
    description: 'Uma aventura de horror gótico nas terras de Barovia. Jogadores de nível 3-10.',
    masterId: 'master_1',
    masterName: 'Mestre Alex',
    masterAvatar: 'https://picsum.photos/seed/master1/100',
    date: '2023-10-14T19:00:00',
    price: 35.00,
    playersCurrent: 3,
    playersMax: 5,
    imageUrl: 'https://picsum.photos/seed/strahd/800/400',
    tags: ['Horror', 'Roleplay', 'Iniciante'],
    status: SessionStatus.PUBLISHED,
    locationType: 'VENUE',
    venueName: 'Taverna do Dragão',
    venueAddress: 'Rua Augusta, 1500 - Consolação, São Paulo - SP'
  });

  const isPlayer = user?.role === UserRole.PLAYER;
  const isMaster = user?.uid === session.masterId || (user?.role === UserRole.MASTER && user.uid === 'user_123'); // Mock ownership check

  // Maps Effect
  useEffect(() => {
    const fetchLocationData = async () => {
      if (session.locationType === 'VENUE' && session.venueAddress) {
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
          console.log("Could not calculate distance:", error);
        } finally {
          setLocLoading(false);
        }
      }
    };

    fetchLocationData();
  }, [session.locationType, session.venueAddress]);

  const handleBook = async () => {
    setLoading(true);
    setTimeout(() => {
      setBookingStatus(BookingStatus.PENDING_PAYMENT);
      setLoading(false);
    }, 500);
  };

  const handlePay = async () => {
    setLoading(true);
    try {
      await asaas.createCharge({
        customer: 'cus_mock',
        billingType: 'PIX',
        value: session.price,
        dueDate: new Date().toISOString()
      });
      setBookingStatus(BookingStatus.CONFIRMED);
    } catch (error) {
      console.error(error);
      alert('Erro no pagamento');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = (newStatus: SessionStatus) => {
    if (confirm(`Tem certeza que deseja mudar o status para ${newStatus}?`)) {
       setSession({ ...session, status: newStatus });
    }
  };

  const openDirections = () => {
    if (session.venueAddress) {
      window.open(maps.getDirectionsLink(session.venueAddress), '_blank');
    }
  };

  return (
    <div className="max-w-5xl mx-auto pb-12 animate-fade-in">
      {/* Hero Image */}
      <div className="h-64 md:h-80 w-full relative">
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10"></div>
        <img src={session.imageUrl} alt={session.title} className="w-full h-full object-cover" />
        <div className="absolute top-4 right-4 z-20">
           <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg ${session.status === SessionStatus.PUBLISHED ? 'bg-green-500 text-black' : session.status === SessionStatus.CANCELED ? 'bg-red-500 text-white' : 'bg-gray-500 text-white'}`}>
             {session.status}
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
                 {session.tags.map(tag => (
                   <span key={tag} className="px-2 py-0.5 rounded bg-primary/20 text-primary text-[10px] font-bold uppercase tracking-wider border border-primary/30">
                     {tag}
                   </span>
                 ))}
              </div>
              <h1 className="text-4xl font-display font-bold text-white mb-2">{session.title}</h1>
              <p className="text-lg text-primary font-bold mb-4">{session.system}</p>
              
              <div className="flex items-center gap-4 text-sm text-gray-400 border-y border-white/10 py-4">
                 <div className="flex items-center gap-2">
                   <img src={session.masterAvatar} className="w-8 h-8 rounded-full border border-white/20" alt="Master" />
                   <span>Narrado por <strong className="text-white">{session.masterName}</strong></span>
                 </div>
                 <div className="w-px h-4 bg-white/20"></div>
                 <div className="flex items-center gap-1">
                   <span className="material-symbols-outlined text-base">calendar_month</span>
                   {new Date(session.date).toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: 'short', hour: '2-digit', minute:'2-digit' })}
                 </div>
              </div>
            </div>

            <div className="glass-panel p-6 rounded-xl">
              <h3 className="text-lg font-bold mb-3 font-display">About the Adventure</h3>
              <p className="text-gray-300 leading-relaxed text-sm whitespace-pre-line">
                {session.description}
              </p>
            </div>

            {/* Management Panel (Master Only) */}
            {isMaster && (
              <div className="glass-panel p-6 rounded-xl border border-white/10">
                <h3 className="text-lg font-bold mb-4 font-display flex items-center gap-2">
                   <span className="material-symbols-outlined text-primary">admin_panel_settings</span>
                   Session Management
                </h3>
                <div className="flex gap-3">
                   {session.status !== SessionStatus.COMPLETED && session.status !== SessionStatus.CANCELED && (
                     <>
                        <button 
                          onClick={() => handleStatusChange(SessionStatus.CANCELED)}
                          className="px-4 py-2 bg-red-500/10 border border-red-500/50 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-colors text-sm font-bold"
                        >
                          Cancel Session
                        </button>
                        <button 
                          onClick={() => handleStatusChange(SessionStatus.COMPLETED)}
                          className="px-4 py-2 bg-green-500/10 border border-green-500/50 text-green-500 rounded-lg hover:bg-green-500 hover:text-white transition-colors text-sm font-bold"
                        >
                          Finish Session
                        </button>
                     </>
                   )}
                   {session.status === SessionStatus.COMPLETED && (
                      <span className="text-green-500 font-bold text-sm flex items-center gap-2">
                        <span className="material-symbols-outlined">check_circle</span> Session Finished
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
                    {session.locationType === 'ONLINE' ? 'Online Session' : session.venueName}
                  </h3>
                  <p className="text-gray-400 text-sm">{session.venueAddress || 'Link will be sent after confirmation.'}</p>
                  
                  {/* Distance Indicator */}
                  {session.locationType === 'VENUE' && (
                    <div className="mt-2 flex items-center gap-2 text-xs">
                      {locLoading ? (
                        <span className="text-gray-500 animate-pulse">Calculating distance...</span>
                      ) : distance ? (
                        <span className="bg-primary/20 text-primary px-2 py-0.5 rounded flex items-center gap-1 font-bold">
                          <span className="material-symbols-outlined text-[10px]">near_me</span>
                          {distance} from you
                        </span>
                      ) : (
                        <span className="text-gray-600">Location unavailable</span>
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
                  <img src="https://upload.wikimedia.org/wikipedia/commons/a/aa/Google_Maps_icon_%282020%29.svg" alt="Maps" className="w-5 h-5" />
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
                     <span className="text-gray-400 text-xs uppercase tracking-wide">Value per Player</span>
                     <div className="text-3xl font-bold text-white font-display">R$ {session.price.toFixed(0)}</div>
                   </div>
                   <div className="text-right">
                     <div className="flex items-center gap-1 text-sm font-bold text-gray-300">
                        <span className="material-symbols-outlined text-sm">group</span>
                        {session.playersCurrent}/{session.playersMax}
                     </div>
                     <span className="text-[10px] text-green-400">Spots available</span>
                   </div>
                </div>

                {/* Booking Logic UI */}
                {!isPlayer ? (
                   <div className="p-3 bg-white/5 rounded-lg text-center text-gray-500 text-sm">
                     {isMaster ? 'You are the Master of this table.' : 'Log in as Player to book.'}
                   </div>
                ) : bookingStatus === BookingStatus.CONFIRMED ? (
                   <div className="bg-green-500/20 border border-green-500/50 p-4 rounded-xl text-center">
                      <span className="material-symbols-outlined text-4xl text-green-400 mb-2">check_circle</span>
                      <h3 className="font-bold text-white mb-1">Confirmed!</h3>
                      <p className="text-xs text-green-300 mb-4">Your spot is guaranteed.</p>
                      <button className="w-full py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg font-bold text-sm">
                        Add to Calendar
                      </button>
                   </div>
                ) : bookingStatus === BookingStatus.PENDING_PAYMENT ? (
                   <div className="space-y-3">
                      <div className="bg-yellow-500/10 border border-yellow-500/30 p-3 rounded-lg text-xs text-yellow-200">
                        Your spot is reserved for 15 minutes. Complete the payment to confirm.
                      </div>
                      <button 
                        onClick={handlePay}
                        disabled={loading}
                        className="w-full py-3 bg-green-600 hover:bg-green-500 text-white rounded-xl font-bold shadow-lg flex justify-center items-center gap-2"
                      >
                         {loading ? 'Processing...' : (
                           <>
                             <span className="material-symbols-outlined">pix</span>
                             Pay with Pix
                           </>
                         )}
                      </button>
                   </div>
                ) : (
                  <button 
                    onClick={handleBook}
                    disabled={loading || session.playersCurrent >= session.playersMax || session.status !== SessionStatus.PUBLISHED}
                    className="w-full py-4 bg-primary hover:bg-primary-hover text-white rounded-xl font-bold text-lg shadow-[0_0_20px_rgba(107,38,217,0.4)] transition-all transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {session.status !== SessionStatus.PUBLISHED ? 'Table Closed' : loading ? 'Booking...' : 'Reserve Spot'}
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
