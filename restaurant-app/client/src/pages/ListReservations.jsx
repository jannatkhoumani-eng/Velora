import { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Search, 
  Calendar as CalendarIcon, 
  ArrowUpDown, 
  Trash2, 
  Users, 
  AlertCircle, 
  Loader, 
  Filter, 
  CheckCircle2, 
  Ticket,
  ChevronRight,
  Database,
  ArrowRight
} from 'lucide-react';
import ReservationTicket from '../components/ReservationTicket';

const BASE = import.meta.env.VITE_API_URL || `http://${window.location.hostname}:5000`;
const API_URL = `${BASE}/reservations`;

export default function ListReservations() {
  const [reservations, setReservations] = useState([]);
  const [displayedReservations, setDisplayedReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);
  const [viewTicket, setViewTicket] = useState(null);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [sortBy, setSortBy] = useState('time-asc');

  const [stats, setStats] = useState({ total: 0, today: 0, activeTables: 0 });

  useEffect(() => {
    fetchReservations();
  }, []);

  useEffect(() => {
    applyFiltersAndSort();
  }, [reservations, searchTerm, dateFilter, sortBy]);

  const fetchReservations = async () => {
    setLoading(true);
    try {
      const res = await axios.get(API_URL);
      setReservations(res.data);
      calculateStats(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (data) => {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const yy = String(today.getFullYear()).slice(-2);
    const todayStr = `${dd}/${mm}/${yy}`;
    const todayRes = data.filter(r => r.date === todayStr);
    setStats({
      total: data.length,
      today: todayRes.length,
      activeTables: todayRes.length > 10 ? 10 : todayRes.length
    });
  };

  const applyFiltersAndSort = () => {
    let result = [...reservations];
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(r => 
        r.id.toString().includes(term) || 
        r.nom.toLowerCase().includes(term) || 
        r.prenom.toLowerCase().includes(term) ||
        r.telephone.includes(term)
      );
    }
    if (dateFilter) {
      const [y, m, d] = dateFilter.split('-');
      const formattedDate = `${d}/${m}/${y.slice(-2)}`;
      result = result.filter(r => r.date === formattedDate);
    }
    result.sort((a, b) => {
      if (sortBy.includes('time')) {
        const [ah, am] = a.heure.split(':').map(Number);
        const [bh, bm] = b.heure.split(':').map(Number);
        const aMin = ah * 60 + am;
        const bMin = bh * 60 + bm;
        return sortBy === 'time-asc' ? aMin - bMin : bMin - aMin;
      }
      if (sortBy.includes('table')) {
        return sortBy === 'table-asc' ? parseInt(a.table) - parseInt(b.table) : parseInt(b.table) - parseInt(a.table);
      }
      return 0;
    });
    setDisplayedReservations(result);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await axios.delete(`${API_URL}/${deleteId}`);
      const updated = reservations.filter(r => r.id !== deleteId);
      setReservations(updated);
      calculateStats(updated);
      setDeleteId(null);
    } catch (err) {
      console.error(err);
    }
  };

  const getInitials = (prenom, nom) => {
    return `${prenom?.charAt(0) || ''}${nom?.charAt(0) || ''}`.toUpperCase();
  };

  return (
    <div className="max-w-7xl mx-auto space-y-10 animate-fade-in pb-20">
      
      {/* ─── HEADER ─── */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 px-2">
        <div>
          <h2 className="text-4xl font-black text-white tracking-tight mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
            Reservations <span className="italic font-light text-slate-500">List</span>
          </h2>
          <p className="text-slate-500 font-medium">Access and manage the full guest database.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-slate-900/50 px-4 py-2 rounded-xl border border-white/5 flex items-center gap-3">
            <Database className="w-4 h-4 text-blue-500" />
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Database Live</span>
          </div>
        </div>
      </div>

      {/* ─── STATS ─── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="glass-card group flex items-center justify-between p-8">
          <div>
            <p className="label-text mb-2">Total Database</p>
            <p className="text-4xl font-black text-white tracking-tighter">{stats.total}</p>
          </div>
          <div className="w-14 h-14 bg-blue-500/10 text-blue-400 rounded-2xl flex items-center justify-center border border-blue-500/20 group-hover:scale-110 transition-transform">
            <Database className="h-7 w-7" />
          </div>
        </div>
        <div className="glass-card group flex items-center justify-between p-8">
          <div>
            <p className="label-text mb-2">Daily Load</p>
            <p className="text-4xl font-black text-white tracking-tighter">{stats.today}</p>
          </div>
          <div className="w-14 h-14 bg-emerald-500/10 text-emerald-400 rounded-2xl flex items-center justify-center border border-emerald-500/20 group-hover:scale-110 transition-transform">
            <CalendarIcon className="h-7 w-7" />
          </div>
        </div>
        <div className="glass-card group flex items-center justify-between p-8">
          <div>
            <p className="label-text mb-2">Floor Density</p>
            <p className="text-4xl font-black text-white tracking-tighter">{stats.activeTables}<span className="text-lg opacity-30 font-normal ml-1">/10</span></p>
          </div>
          <div className="w-14 h-14 bg-amber-500/10 text-amber-500 rounded-2xl flex items-center justify-center border border-amber-500/20 group-hover:scale-110 transition-transform">
            <CheckCircle2 className="h-7 w-7" />
          </div>
        </div>
      </div>

      {/* ─── FILTERS & TABLE ─── */}
      <div className="space-y-8">
        <div className="glass-card p-0 overflow-hidden relative border-none">
          <div className="p-8 border-b border-white/5 bg-slate-900/20 flex flex-col lg:flex-row gap-6 justify-between items-center">
            <div className="relative w-full lg:w-[400px] group">
              <Search className="absolute left-5 top-4 h-4 w-4 text-slate-500 group-focus-within:text-amber-500 transition-colors" />
              <input 
                type="text" 
                placeholder="Search identity or ID..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-14 py-4"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-6 w-full lg:w-auto">
              <input 
                type="date" 
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="input-field-blue py-4 min-w-[180px]"
              />
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="input-field-blue py-4 min-w-[200px]"
              >
                <option value="time-asc">Time (Earliest First)</option>
                <option value="time-desc">Time (Latest First)</option>
                <option value="table-asc">Table Sequence (1-10)</option>
                <option value="table-desc">Table Sequence (10-1)</option>
              </select>
            </div>
          </div>

          <div className="p-0 overflow-x-auto">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-32 text-slate-500">
                <div className="w-10 h-10 border-4 border-amber-500/20 border-t-amber-500 rounded-full animate-spin mb-6" />
                <p className="text-[10px] font-black uppercase tracking-widest">Accessing Secure Records</p>
              </div>
            ) : displayedReservations.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-32 text-slate-500">
                <Filter className="h-16 w-16 opacity-10 mb-6" />
                <p className="font-bold text-white text-xl">No Matches Found</p>
                <p className="text-sm mt-1">Refine your query or clear filters.</p>
              </div>
            ) : (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Guest Identity</th>
                    <th>Schedule</th>
                    <th>Position</th>
                    <th>Atmosphere</th>
                    <th>Party</th>
                    <th className="text-right">Manage</th>
                  </tr>
                </thead>
                <tbody>
                  {displayedReservations.map((res, idx) => (
                    <tr key={res.id} className="animate-slide-up" style={{ animationDelay: `${idx * 0.03}s` }}>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="h-12 w-12 rounded-2xl bg-slate-900 border border-white/5 text-amber-500 flex items-center justify-center font-black text-xs shadow-inner shrink-0">
                            {getInitials(res.prenom, res.nom)}
                          </div>
                          <div className="min-w-0">
                            <div className="font-bold text-white text-base">{res.prenom} {res.nom}</div>
                            <div className="text-[10px] font-black text-slate-600 uppercase tracking-widest mt-0.5">{res.telephone} <span className="mx-2 opacity-30">|</span> ID #{res.id}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="text-slate-300 font-bold text-xs mb-1">{res.date}</div>
                        <div className="text-[10px] text-blue-400 font-black bg-blue-500/5 inline-flex px-2.5 py-1 rounded-lg border border-blue-500/10 uppercase tracking-widest">{res.heure}</div>
                      </td>
                      <td>
                        <span className="inline-flex items-center px-3.5 py-1.5 bg-slate-950 border border-white/5 text-slate-400 text-xs rounded-xl font-black uppercase tracking-widest">
                          T{res.table}
                        </span>
                      </td>
                      <td>
                        <span className={`text-[9px] font-black uppercase tracking-[0.15em] px-3 py-1.5 rounded-lg border ${
                          res.experience === 'Romantic Dinner' ? 'bg-pink-500/10 text-pink-400 border-pink-500/20' :
                          res.experience === 'Business Meeting' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                          res.experience === 'Celebration' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' :
                          res.experience === 'Window View' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                          'bg-slate-800/50 text-slate-500 border-white/5'
                        }`}>
                          {res.experience || 'Standard'}
                        </span>
                      </td>
                      <td>
                        <div className="flex items-center text-slate-400 font-black text-xs uppercase tracking-tighter">
                          <Users className="h-3.5 w-3.5 mr-2 text-slate-600" />
                          {res.persons} Guests
                        </div>
                      </td>
                      <td className="text-right px-8">
                        <div className="flex justify-end gap-3">
                          <button 
                            onClick={() => setViewTicket(res)}
                            className="p-3 bg-white/5 text-slate-400 hover:text-amber-500 hover:bg-amber-500/10 border border-white/5 hover:border-amber-500/20 rounded-xl transition-all shadow-lg"
                          >
                            <Ticket size={16} />
                          </button>
                          <button 
                            onClick={() => setDeleteId(res.id)}
                            className="p-3 bg-white/5 text-slate-400 hover:text-red-500 hover:bg-red-500/10 border border-white/5 hover:border-red-500/20 rounded-xl transition-all shadow-lg"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* ─── MODALS ─── */}
      {deleteId && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xl animate-fade-in">
          <div className="bg-[#111827] border border-white/10 rounded-[2.5rem] shadow-[0_0_100px_rgba(0,0,0,0.8)] max-w-sm w-full p-10 transform transition-all">
            <div className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center mb-8 mx-auto border border-red-500/20 shadow-inner">
              <AlertCircle className="h-10 w-10 text-red-500" />
            </div>
            <h3 className="text-2xl font-black text-center text-white mb-3 tracking-tight">Confirm Removal</h3>
            <p className="text-center text-slate-500 mb-10 text-sm leading-relaxed">
              You are about to delete record <span className="text-white font-bold">#{deleteId}</span>. This procedure is irreversible.
            </p>
            <div className="flex flex-col gap-4">
              <button 
                onClick={handleDelete}
                className="w-full btn-danger py-4"
              >
                Permanently Delete
              </button>
              <button 
                onClick={() => setDeleteId(null)}
                className="w-full btn-secondary py-4"
              >
                Cancel Action
              </button>
            </div>
          </div>
        </div>
      )}
      {viewTicket && (
        <ReservationTicket 
          reservation={viewTicket} 
          onClose={() => setViewTicket(null)} 
        />
      )}
    </div>
  );
}
