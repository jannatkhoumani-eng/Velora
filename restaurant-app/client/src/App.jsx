import { BrowserRouter as Router, Routes, Route, NavLink, useLocation, Link, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { LayoutDashboard, PlusCircle, List as ListIcon, Search as SearchIcon, Map as MapIcon, Bell, User as UserIcon, Sun, Moon, PieChart, Home, ChevronRight, Zap, LogOut } from 'lucide-react';
import { AuthProvider, useAuth } from './context/AuthContext';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import Dashboard from './pages/Dashboard';
import AddReservation from './pages/AddReservation';
import ListReservations from './pages/ListReservations';
import SearchReservations from './pages/SearchReservations';
import AvailableTables from './pages/AvailableTables';
import AnalyticsDashboard from './pages/AnalyticsDashboard';
import Logo from './components/Logo';
import MouseGlow from './components/MouseGlow';
import SplashScreen from './components/SplashScreen';
import AmbiencePlayer from './components/AmbiencePlayer';
import './index.css';

// Protected Route wrapper — redirects to /auth if not logged in
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-[#0B1120] text-slate-500">
        <div className="w-10 h-10 border-4 border-amber-500/20 border-t-amber-500 rounded-full animate-spin mb-4"></div>
        <p className="font-bold tracking-widest text-[10px] uppercase">Loading Session</p>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/auth" replace />;
  }
  
  return children;
}

function Sidebar() {
  const { user, signOut } = useAuth();
  
  const links = [
    { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { to: "/add",       icon: PlusCircle,      label: "Add Reservation" },
    { to: "/list",      icon: ListIcon,        label: "Reservations List" },
    { to: "/search",    icon: SearchIcon,      label: "Search Page" },
    { to: "/available", icon: MapIcon,         label: "Available Tables" },
    { to: "/analytics", icon: PieChart,        label: "Analytics" },
  ];

  return (
    <aside className="w-80 hidden lg:flex flex-col h-screen sticky top-0 bg-[#020617] border-r border-white/5 shadow-[20px_0_50px_rgba(0,0,0,0.2)] z-50">
      <div className="px-10 py-12">
        <Logo size="md" variant="light" />
      </div>

      <nav className="flex-1 px-6 space-y-2 overflow-y-auto custom-scrollbar">
        <div className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em] px-4 mb-6">Management</div>
        
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) => `
              flex items-center px-5 py-4.5 rounded-2xl text-xs font-black uppercase tracking-[0.15em] transition-all group relative
              ${isActive 
                ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20 shadow-2xl shadow-amber-900/20' 
                : 'text-slate-500 hover:text-white hover:bg-white/5 border border-transparent'
              }
            `}
          >
            <link.icon className={`h-4.5 w-4.5 mr-4 transition-transform group-hover:scale-110`} />
            {link.label}
          </NavLink>
        ))}

        <div className="pt-10">
          <Link
            to="/"
            className="flex items-center px-5 py-4.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all bg-slate-900/40 text-slate-400 border border-white/5 hover:bg-amber-500/10 hover:text-amber-500 hover:border-amber-500/20 group"
          >
            <Home className="h-4 w-4 mr-4 flex-shrink-0 group-hover:scale-110 transition-transform" />
            Landing Page
          </Link>
        </div>
      </nav>

      <div className="p-8 border-t border-white/5">
        <div className="bg-slate-900/60 p-5 rounded-3xl border border-white/5 group cursor-pointer hover:bg-slate-900 transition-all shadow-xl">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-200 to-amber-600 flex items-center justify-center font-black text-slate-950 shadow-2xl group-hover:scale-105 transition-transform">
              {user?.initial || 'U'}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-white truncate group-hover:text-amber-500 transition-colors">{user?.name || 'User'}</p>
              <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest mt-0.5">Member</p>
            </div>
            <button 
              onClick={(e) => { e.stopPropagation(); signOut(); }}
              className="p-2 text-slate-600 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}

function TopBar() {
  const location = useLocation();
  const { user, signOut } = useAuth();
  
  const getTitle = () => {
    switch (location.pathname) {
      case '/dashboard': return 'Dashboard';
      case '/add': return 'Add Reservation';
      case '/list': return 'Reservations List';
      case '/search': return 'Search Page';
      case '/available': return 'Available Tables';
      case '/analytics': return 'Analytics';
      default: return 'Velora Manager';
    }
  };

  return (
    <header className="h-24 bg-[#0B1120]/80 backdrop-blur-3xl sticky top-0 z-40 border-b border-white/5 px-10">
      <div className="h-full flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="w-1.5 h-10 bg-amber-500 rounded-full shadow-[0_0_15px_rgba(245,158,11,0.5)]" />
          <div>
            <h2 className="text-2xl font-black text-white tracking-tighter" style={{ fontFamily: "'Playfair Display', serif" }}>{getTitle()}</h2>
            <div className="flex items-center gap-2 mt-1">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
              <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Personal Session Active</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-8">
          <div className="hidden sm:flex items-center gap-4 bg-slate-900/40 border border-white/5 px-5 py-2.5 rounded-2xl">
            <Zap className="w-4 h-4 text-amber-500" />
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Network Speed: <span className="text-white">0.4ms</span></span>
          </div>
          
          <button className="p-3.5 text-slate-500 hover:text-white bg-white/5 border border-white/5 hover:border-white/10 rounded-2xl transition-all shadow-xl">
            <Bell size={20} />
          </button>
          
          <div className="w-[1px] h-10 bg-white/10" />
          
          <div className="flex items-center gap-4 bg-amber-500/5 border border-amber-500/10 pl-2 pr-5 py-2 rounded-2xl shadow-2xl hover:bg-amber-500/10 transition-all cursor-pointer group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-100 to-amber-500 text-slate-950 flex items-center justify-center font-black text-sm shadow-inner group-hover:scale-105 transition-transform">
              {user?.initial || 'U'}
            </div>
            <div className="hidden md:block">
              <p className="text-xs font-black text-white uppercase tracking-tighter">{user?.name || 'User'}</p>
              <p className="text-[9px] font-black text-amber-500 uppercase tracking-widest mt-0.5">{user?.userId || 'user'}.vlr</p>
            </div>
          </div>

          <button 
            onClick={signOut}
            className="p-3.5 text-slate-500 hover:text-red-500 bg-white/5 border border-white/5 hover:border-red-500/20 hover:bg-red-500/10 rounded-2xl transition-all shadow-xl"
            title="Sign Out"
          >
            <LogOut size={20} />
          </button>
        </div>
      </div>
    </header>
  );
}

function DashboardLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-[#0B1120]">
      <Sidebar />
      <main className="flex-1 flex flex-col min-w-0">
        <TopBar />
        <div className="p-10 flex-1 overflow-x-hidden animate-fade-in">
          {children}
        </div>
      </main>
    </div>
  );
}

function AppContent() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const hasSeenSplash = sessionStorage.getItem('velora_splash_seen');
    if (hasSeenSplash) {
      setShowSplash(false);
    }
  }, []);

  const handleSplashFinish = () => {
    setShowSplash(false);
    sessionStorage.setItem('velora_splash_seen', 'true');
  };

  return (
    <>
      {showSplash && <SplashScreen onFinish={handleSplashFinish} />}
      <MouseGlow />
      <AmbiencePlayer />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout><Dashboard /></DashboardLayout></ProtectedRoute>} />
        <Route path="/add" element={<ProtectedRoute><DashboardLayout><AddReservation /></DashboardLayout></ProtectedRoute>} />
        <Route path="/list" element={<ProtectedRoute><DashboardLayout><ListReservations /></DashboardLayout></ProtectedRoute>} />
        <Route path="/search" element={<ProtectedRoute><DashboardLayout><SearchReservations /></DashboardLayout></ProtectedRoute>} />
        <Route path="/available" element={<ProtectedRoute><DashboardLayout><AvailableTables /></DashboardLayout></ProtectedRoute>} />
        <Route path="/analytics" element={<ProtectedRoute><DashboardLayout><AnalyticsDashboard /></DashboardLayout></ProtectedRoute>} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;
