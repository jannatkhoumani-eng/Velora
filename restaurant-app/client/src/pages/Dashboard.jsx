import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { 
  CalendarCheck, 
  Clock, 
  UtensilsCrossed, 
  Search, 
  Plus, 
  TrendingUp, 
  Bell,
  Sparkles,
  Zap,
  LayoutDashboard,
  Users
} from 'lucide-react';
import { Link } from 'react-router-dom';

const BASE = import.meta.env.VITE_API_URL || `http://${window.location.hostname}:5000`;
const API_URL = `${BASE}/reservations`;

export default function Dashboard() {
  const [stats, setStats] = useState({ total: 0, today: 0 });
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [insight, setInsight] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await axios.get(API_URL);
      const data = res.data;
      setStats({
        total: data.length,
        today: data.filter(r => r.date === new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: '2-digit' })).length
      });
      setRecent(data.slice(-5).reverse());
      generateInsight(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const generateInsight = (data) => {
    setIsTyping(true);
    const today = new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: '2-digit' });
    const todayRes = data.filter(r => r.date === today);
    const vipCount = data.filter(r => r.experience === 'Celebration' || r.table === '10').length;
    
    let text = `Welcome back, Jannat. We have ${todayRes.length} bookings scheduled for today. `;
    if (todayRes.length > 5) text += "The floor will be busy tonight. ";
    if (vipCount > 0) text += `You have ${vipCount} premium experiences upcoming. `;
    text += "All systems are optimal.";
    
    let i = 0;
    const interval = setInterval(() => {
      setInsight(text.substring(0, i));
      i++;
      if (i > text.length) {
        clearInterval(interval);
        setIsTyping(false);
      }
    }, 30);
  };

  const getExpStyle = (res) => {
    const exp = res.experience || 'Standard';
    switch (exp) {
      case 'Romantic Dinner': return 'bg-pink-500/10 text-pink-400 border-pink-500/20';
      case 'Business Meeting': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'Celebration': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
      default: return 'bg-slate-800/50 text-slate-500 border-white/5';
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-[60vh] text-slate-500">
      <div className="w-10 h-10 border-4 border-amber-500/20 border-t-amber-500 rounded-full animate-spin mb-4"></div>
      <p className="font-bold tracking-widest text-[10px] uppercase">Synchronizing Systems</p>
    </div>
  );

  return (
    <div className="space-y-10 max-w-7xl mx-auto animate-fade-in pb-12">
      
      {/* ─── HEADER AREA ────────────────────────────────────────────────── */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-2">
        <div>
          <h2 className="text-4xl font-black text-white tracking-tight mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
            Velora <span className="italic font-light text-slate-500">Intelligence</span>
          </h2>
          <div className="flex items-center gap-3 text-slate-500">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <p className="text-xs font-bold uppercase tracking-widest">Live Operations Control</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/search" className="btn-secondary">
            <Search className="w-4 h-4" />
            Quick Locate
          </Link>
          <Link to="/add" className="btn-primary">
            <Plus className="w-4 h-4" />
            New Booking
          </Link>
        </div>
      </div>

      {/* ─── ASSISTANT PANEL ────────────────────────────────────────────── */}
      <div className="assistant-card glass-card relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-[100px] -mr-64 -mt-64 group-hover:bg-amber-500/10 transition-colors duration-700"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-8">
          <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-amber-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-amber-500/20 shrink-0 assistant-glow">
            <Sparkles className="w-10 h-10 text-slate-950" />
          </div>
          <div className="flex-1">
            <h3 className="text-xs font-black text-amber-500 uppercase tracking-[0.3em] mb-3">Velora AI Assistant</h3>
            <div className="text-2xl font-medium text-slate-200 leading-relaxed min-h-[3.5em]">
              {insight}
              {isTyping && <span className="assistant-cursor"></span>}
            </div>
          </div>
        </div>
      </div>

      {/* ─── STATS GRID ────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="glass-card group p-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="label-text mb-2">Network Volume</p>
              <p className="text-5xl font-black text-white tracking-tighter">{stats.total}</p>
            </div>
            <div className="w-14 h-14 bg-blue-500/10 text-blue-400 rounded-2xl flex items-center justify-center border border-blue-500/20 group-hover:scale-110 transition-transform">
              <CalendarCheck className="w-7 h-7" />
            </div>
          </div>
          <div className="mt-6 flex items-center gap-2 text-[10px] font-bold text-blue-400 uppercase tracking-widest bg-blue-500/5 py-1.5 px-3 rounded-lg w-fit">
            <TrendingUp className="w-3 h-3" /> System Optimal
          </div>
        </div>

        <div className="glass-card group p-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="label-text mb-2">Live Demand</p>
              <p className="text-5xl font-black text-white tracking-tighter">{stats.today}</p>
            </div>
            <div className="w-14 h-14 bg-emerald-500/10 text-emerald-400 rounded-2xl flex items-center justify-center border border-emerald-500/20 group-hover:scale-110 transition-transform">
              <Clock className="w-7 h-7" />
            </div>
          </div>
          <div className="mt-6 flex items-center gap-2 text-[10px] font-bold text-emerald-400 uppercase tracking-widest bg-emerald-500/5 py-1.5 px-3 rounded-lg w-fit">
            <Zap className="w-3 h-3" /> Sync Real-time
          </div>
        </div>

        <div className="glass-card group p-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="label-text mb-2">Floor Density</p>
              <p className="text-5xl font-black text-white tracking-tighter">
                {stats.today > 10 ? 10 : stats.today}
                <span className="text-xl font-light text-slate-600 ml-1">/10</span>
              </p>
            </div>
            <div className="w-14 h-14 bg-amber-500/10 text-amber-500 rounded-2xl flex items-center justify-center border border-amber-500/20 group-hover:scale-110 transition-transform">
              <UtensilsCrossed className="w-7 h-7" />
            </div>
          </div>
          <div className="mt-6 flex items-center gap-2 text-[10px] font-bold text-amber-500 uppercase tracking-widest bg-amber-500/5 py-1.5 px-3 rounded-lg w-fit">
            <Sparkles className="w-3 h-3" /> Peak Performance
          </div>
        </div>
      </div>

      {/* ─── RECENT TABLE ──────────────────────────────────────────────── */}
      <div className="space-y-6">
        <div className="flex items-center justify-between px-2">
          <h3 className="text-xl font-bold text-white flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center border border-white/10">
              <Bell className="w-4 h-4 text-amber-500" />
            </div>
            Recent Arrivals
          </h3>
          <Link to="/list" className="text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-white transition-colors">
            View All Archives →
          </Link>
        </div>

        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Identity</th>
                <th>Schedule</th>
                <th>Floor Position</th>
                <th>Experience</th>
                <th className="text-right">Database ID</th>
              </tr>
            </thead>
            <tbody>
              {recent.map((res, idx) => (
                <tr key={res.id} className="animate-slide-up" style={{ animationDelay: `${idx * 0.05}s` }}>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-slate-900 border border-white/5 flex items-center justify-center font-black text-xs text-amber-500 shadow-inner shrink-0">
                        {res.prenom[0]}{res.nom[0]}
                      </div>
                      <div className="min-w-0">
                        <div className="font-bold text-white text-base">{res.prenom} {res.nom}</div>
                        <div className="text-[10px] font-bold text-slate-600 uppercase tracking-tighter">{res.telephone}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="text-slate-300 font-medium">{res.date}</div>
                    <div className="text-[10px] font-black text-blue-400 mt-1 bg-blue-400/10 px-2 py-0.5 rounded-md inline-block border border-blue-400/20">{res.heure}</div>
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                      <span className="font-bold text-slate-400">Table {res.table}</span>
                    </div>
                  </td>
                  <td>
                    <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md border ${getExpStyle(res)}`}>
                      {res.experience || 'Standard'}
                    </span>
                  </td>
                  <td className="text-right text-[10px] font-mono text-slate-600 font-bold tracking-widest">
                    #{res.id.toString().padStart(4, '0')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
