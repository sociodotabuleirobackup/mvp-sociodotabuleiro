
import React from 'react';
// Import from 'react-router' instead of 'react-router-dom' to resolve export errors in this environment
import { HashRouter, Routes, Route, Navigate, useLocation, Link } from 'react-router';
import { AuthProvider, useAuth } from './store.tsx';
import { Welcome } from './pages/Onboarding.tsx';
import { Dashboard } from './pages/Dashboard.tsx';
import { CreateSession } from './pages/Session.tsx';
import { SessionDetails } from './pages/SessionDetails.tsx';
import { Marketplace } from './pages/Marketplace.tsx';
import { Register } from './pages/Register.tsx';
import { Profile } from './pages/Profile.tsx';
import { Chat } from './pages/Chat.tsx';
import { Notifications } from './pages/Notifications.tsx';
import { Terms, Privacy, Support } from './pages/StaticPages.tsx';
import { Logo } from './components/Logo.tsx';

// Layout Component
const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout, notifications } = useAuth();
  const location = useLocation();
  const unreadCount = notifications.filter(n => !n.read).length;

  const navItems = [
    { icon: 'dashboard', label: 'Painel', path: '/dashboard' },
    { icon: 'swords', label: 'Mesas', path: '/sessions' }, // Placeholder for session list
    { icon: 'chat', label: 'Chat', path: '/chat' },
    { icon: 'storefront', label: 'Mercado', path: '/marketplace' },
  ];

  return (
    <div className="flex flex-col h-screen bg-background text-white font-sans overflow-hidden">
      {/* Top Bar */}
      <header className="h-16 border-b border-border bg-surface/80 backdrop-blur-md flex items-center justify-between px-4 shrink-0 z-20">
        <Link to="/dashboard" className="flex items-center gap-2 group">
           <Logo className="h-10 w-10 drop-shadow-[0_0_8px_rgba(107,38,217,0.5)] transition-transform group-hover:scale-110" />
           <span className="font-fantasy font-bold text-lg tracking-wider hidden sm:block text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">Sócio do Tabuleiro</span>
        </Link>
        <div className="flex items-center gap-4">
          
          {/* Notifications Icon */}
          <Link to="/notifications" className="relative text-gray-400 hover:text-white transition-colors">
            <span className="material-symbols-outlined text-2xl">notifications</span>
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] font-bold flex items-center justify-center text-white border border-background">
                {unreadCount}
              </span>
            )}
          </Link>

          <Link to="/profile" className="flex items-center gap-2 hover:bg-white/5 p-1 rounded-full transition-colors">
            <span className="text-sm font-medium hidden sm:block text-gray-400">{user?.name}</span>
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center border border-primary overflow-hidden">
              {user?.avatarUrl ? (
                <img src={user.avatarUrl} alt="avatar" className="w-full h-full object-cover" />
              ) : (
                <span className="material-symbols-outlined text-sm">person</span>
              )}
            </div>
          </Link>
          <button onClick={logout} className="text-gray-500 hover:text-white ml-2">
            <span className="material-symbols-outlined">logout</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pb-20 sm:pb-4 scroll-smooth flex flex-col">
        <div className="flex-1">
          {children}
        </div>
        
        {/* Internal Footer */}
        <footer className="mt-12 py-8 border-t border-white/5 text-center">
          <div className="flex justify-center items-center gap-2 mb-4 opacity-50 grayscale hover:grayscale-0 transition-all">
             <Logo className="h-6 w-6" />
             <span className="text-xs text-gray-400 font-fantasy">&copy; 2025 Sócio do Tabuleiro.</span>
          </div>
          <div className="flex justify-center gap-4 text-[10px] text-gray-500 uppercase tracking-wider font-bold">
            <Link to="/terms" className="hover:text-primary">Termos</Link>
            <Link to="/privacy" className="hover:text-primary">Privacidade</Link>
            <Link to="/help" className="hover:text-primary">Suporte</Link>
          </div>
        </footer>
      </main>

      {/* Bottom Navigation (Mobile) */}
      <nav className="sm:hidden fixed bottom-0 w-full h-16 bg-surface/95 backdrop-blur-lg border-t border-border flex justify-around items-center z-30 pb-safe">
        {navItems.map((item) => (
          <Link 
            key={item.path}
            to={item.path}
            className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${location.pathname === item.path ? 'text-primary' : 'text-gray-500 hover:text-gray-300'}`}
          >
            <span className="material-symbols-outlined">{item.icon}</span>
            <span className="text-[10px] font-medium">{item.label}</span>
          </Link>
        ))}
        <Link to="/profile" className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${location.pathname === '/profile' ? 'text-primary' : 'text-gray-500 hover:text-gray-300'}`}>
            <span className="material-symbols-outlined">person</span>
            <span className="text-[10px] font-medium">Perfil</span>
        </Link>
      </nav>
    </div>
  );
};

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) return <div className="h-screen flex items-center justify-center text-primary">Carregando...</div>;
  
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <AppLayout>{children}</AppLayout>;
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <HashRouter>
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/register/:role" element={<Register />} />
          
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/create-session" element={<ProtectedRoute><CreateSession /></ProtectedRoute>} />
          <Route path="/sessions/:id" element={<ProtectedRoute><SessionDetails /></ProtectedRoute>} />
          
          <Route path="/marketplace" element={<ProtectedRoute><Marketplace /></ProtectedRoute>} />
          <Route path="/chat" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
          <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          
          {/* Static Pages */}
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/help" element={<Support />} />
          
          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </HashRouter>
    </AuthProvider>
  );
};

export default App;
