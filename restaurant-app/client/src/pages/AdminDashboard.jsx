import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { useAuth } from '../context/AuthContext';
import { Shield, Users, Calendar, Trash2, ShieldAlert, Loader, AlertCircle, Eye, Search } from 'lucide-react';
import { Navigate } from 'react-router-dom';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteId, setDeleteId] = useState(null);

  // Stats
  const [stats, setStats] = useState({ total: 0, users: 0, today: 0 });

  useEffect(() => {
    if (user?.isAdmin) {
      fetchAllReservations();
    }
  }, [user]);

  const fetchAllReservations = async () => {
    setLoading(true);
    try {
      // Admin sees everything! No .eq('user_id', ...) filter here.
      const { data, error } = await supabase
        .from('reservations')
        .select('*')
        .order('id', { ascending: false });
        
      if (error) throw error;
      
      const resData = data || [];
      setReservations(resData);
      
      // Calculate global stats
      const today = new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: '2-digit' });
      const uniqueUsers = new Set(resData.map(r => r.user_id)).size;
      const todayCount = resData.filter(r => r.date === today).length;
      
      setStats({
        total: resData.length,
        users: uniqueUsers,
        today: todayCount
      });
      
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const { error } = await supabase.from('reservations').delete().eq('id', id);
      if (error) throw error;
      setReservations(reservations.filter(r => r.id !== id));
      setDeleteId(null);
    } catch (err) {
      console.error(err);
    }
  };

  // Redirect non-admins
  if (!user?.isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  const filtered = reservations.filter(r => {
    const term = searchTerm.toLowerCase();
    return (
      (r.nom && r.nom.toLowerCase().includes(term)) ||
      (r.prenom && r.prenom.toLowerCase().includes(term)) ||
      (r.user_id && r.user_id.toLowerCase().includes(term)) ||
      (r.telephone && r.telephone.includes(term))
    );
  });

  return (
    <div className="space-y-10 max-w-7xl mx-auto animate-fade-in pb-12">
      {/* ─── HEADER AREA ────────────────────────────────────────────────── */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-2">
        <div>
          <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-500 font-black text-[9px] uppercase tracking-[0.4em] mb-4">
            <ShieldAlert className="w-3 h-3 mr-2 animate-pulse" />
            Global Admin Access
          </div>
          <h2 className="text-4xl font-black text-white tracking-tight mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
            Master <span className="italic font-light text-slate-500">Control</span>
          </h2>
          <p className="text-slate-500 text-sm font-medium">Overriding user isolation to view all global platform data.</p>
        </div>
      </div>

      {/* ─── GLOBAL STATS ────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="glass-card p-8 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
          <p className="label-text mb-2">Total Global Bookings</p>
          <p className="text-5xl font-black text-white">{stats.total}</p>
          <div className="mt-4 flex items-center gap-2 text-[10px] font-bold text-blue-400 uppercase tracking-widest bg-blue-500/10 py-1 px-3 rounded-lg w-fit border border-blue-500/20">
            <Calendar className="w-3 h-3" /> Entire Database
          </div>
        </div>

        <div className="glass-card p-8 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
          <p className="label-text mb-2">Active Tenants (Users)</p>
          <p className="text-5xl font-black text-white">{stats.users}</p>
          <div className="mt-4 flex items-center gap-2 text-[10px] font-bold text-emerald-400 uppercase tracking-widest bg-emerald-500/10 py-1 px-3 rounded-lg w-fit border border-emerald-500/20">
            <Users className="w-3 h-3" /> Unique Accounts
          </div>
        </div>

        <div className="glass-card p-8 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
          <p className="label-text mb-2">Global Live Demand</p>
          <p className="text-5xl font-black text-white">{stats.today}</p>
          <div className="mt-4 flex items-center gap-2 text-[10px] font-bold text-amber-500 uppercase tracking-widest bg-amber-500/10 py-1 px-3 rounded-lg w-fit border border-amber-500/20">
            <Shield className="w-3 h-3" /> Bookings Today
          </div>
        </div>
      </div>

      {/* ─── DATA TABLE ────────────────────────────────────────────────── */}
      <div className="glass-card p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div>
            <h3 className="text-xl font-black text-white">Global Database Viewer</h3>
            <p className="text-sm text-slate-500 mt-1">Showing reservations from all users across the platform.</p>
          </div>
          
          <div className="relative w-full md:w-72">
            <Search className="absolute left-4 top-3.5 h-5 w-5 text-slate-500" />
            <input
              type="text"
              placeholder="Search by client, tenant, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-12 py-3 w-full"
            />
          </div>
        </div>

        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center">
            <Loader className="w-10 h-10 text-amber-500 animate-spin mb-4" />
            <p className="text-slate-500 font-bold tracking-widest uppercase text-xs">Querying Global Database</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-20 flex flex-col items-center justify-center text-slate-500 bg-slate-900/30 rounded-3xl border border-white/5 border-dashed">
            <ShieldAlert className="w-12 h-12 mb-4 opacity-20" />
            <p className="text-lg font-medium text-slate-400">No records found in the system.</p>
          </div>
        ) : (
          <div className="overflow-x-auto custom-scrollbar">
            <table className="data-table w-full">
              <thead>
                <tr>
                  <th>Database ID</th>
                  <th>Tenant (Owner)</th>
                  <th>Client Identity</th>
                  <th>Schedule</th>
                  <th>Experience</th>
                  <th className="text-right">Admin Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((res) => (
                  <tr key={res.id} className="group hover:bg-slate-800/30">
                    <td className="font-mono text-xs text-slate-500">#{res.id.toString().padStart(4, '0')}</td>
                    <td>
                      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-500 text-xs font-bold">
                        <Users className="w-3 h-3" />
                        {res.user_id || 'anonymous'}
                      </div>
                    </td>
                    <td>
                      <div className="font-bold text-white">{res.prenom} {res.nom}</div>
                      <div className="text-[10px] font-bold text-slate-500">{res.telephone}</div>
                    </td>
                    <td>
                      <div className="text-slate-300 font-medium">{res.date}</div>
                      <div className="text-xs font-bold text-blue-400">{res.heure} - T{res.table}</div>
                    </td>
                    <td>
                      <span className="text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-md bg-white/5 text-slate-400 border border-white/10">
                        {res.experience}
                      </span>
                    </td>
                    <td className="text-right">
                      <button
                        onClick={() => setDeleteId(res.id)}
                        className="p-2.5 text-slate-500 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
                        title="Force Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border border-red-500/30 rounded-3xl p-8 max-w-md w-full shadow-[0_0_100px_rgba(239,68,68,0.15)] animate-scale-up relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-red-500"></div>
            <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mb-6 border border-red-500/20">
              <AlertCircle className="w-8 h-8 text-red-500" />
            </div>
            <h3 className="text-2xl font-black text-white mb-2 tracking-tight">Override & Delete?</h3>
            <p className="text-slate-400 text-sm mb-8 leading-relaxed">
              You are executing a global admin deletion. This will permanently remove this record from its owner's tenant space. This action cannot be undone.
            </p>
            <div className="flex gap-4">
              <button onClick={() => setDeleteId(null)} className="btn-secondary flex-1 py-4">Cancel</button>
              <button onClick={() => handleDelete(deleteId)} className="flex-1 py-4 px-6 bg-red-500 hover:bg-red-600 text-white text-xs font-black uppercase tracking-[0.2em] rounded-xl transition-colors shadow-lg shadow-red-500/25">
                Force Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
