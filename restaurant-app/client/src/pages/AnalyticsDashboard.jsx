import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { TrendingUp, Users, Clock, Hash, Loader, CalendarDays, Percent, BarChart3, PieChart, Activity, Zap } from 'lucide-react';

const BASE = import.meta.env.VITE_API_URL || `http://${window.location.hostname}:5000`;
const API_URL = `${BASE}/reservations`;

export default function AnalyticsDashboard() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  const [totalGuests, setTotalGuests] = useState(0);
  const [avgGuests, setAvgGuests] = useState(0);
  const [occupancyRate, setOccupancyRate] = useState(0);

  const [reservationsOverTime, setReservationsOverTime] = useState([]);
  const [mostUsedTables, setMostUsedTables] = useState([]);
  const [peakHours, setPeakHours] = useState([]);

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    try {
      const { data: resData, error } = await supabase.from('reservations').select('*');
      if (error) throw error;
      setReservations(resData || []);
      processAnalytics(resData || []);
    } catch (err) {
      console.error("Failed to fetch data", err);
    } finally {
      setLoading(false);
    }
  };

  const processAnalytics = (data) => {
    if (!data.length) return;

    const totalG = data.reduce((acc, curr) => acc + parseInt(curr.persons), 0);
    setTotalGuests(totalG);
    setAvgGuests((totalG / data.length).toFixed(1));

    const today = new Date();
    const todayStr = `${String(today.getDate()).padStart(2, '0')}/${String(today.getMonth() + 1).padStart(2, '0')}/${String(today.getFullYear()).slice(-2)}`;
    const todayRes = data.filter(r => r.date === todayStr);
    const uniqueTablesToday = new Set(todayRes.map(r => r.table)).size;
    setOccupancyRate(((uniqueTablesToday / 10) * 100).toFixed(0));

    const dateCounts = {};
    data.forEach(r => {
      dateCounts[r.date] = (dateCounts[r.date] || 0) + 1;
    });
    const sortedDates = Object.keys(dateCounts).sort((a, b) => {
      const [d1, m1, y1] = a.split('/');
      const [d2, m2, y2] = b.split('/');
      return new Date(`20${y1}-${m1}-${d1}`) - new Date(`20${y2}-${m2}-${d2}`);
    });
    const recentDates = sortedDates.slice(-7);
    const timelineData = recentDates.map(date => ({
      date: date.substring(0, 5),
      reservations: dateCounts[date]
    }));
    setReservationsOverTime(timelineData);

    const tableCounts = {};
    data.forEach(r => {
      tableCounts[`T${r.table}`] = (tableCounts[`T${r.table}`] || 0) + 1;
    });
    const tableData = Object.keys(tableCounts)
      .map(t => ({ table: t, bookings: tableCounts[t] }))
      .sort((a, b) => parseInt(a.table.substring(1)) - parseInt(b.table.substring(1)));
    setMostUsedTables(tableData);

    const hourCounts = {};
    data.forEach(r => {
      const hour = r.heure.split(':')[0] + ':00';
      hourCounts[hour] = (hourCounts[hour] || 0) + 1;
    });
    const hoursData = Object.keys(hourCounts)
      .sort()
      .map(h => ({ hour: h, count: hourCounts[h] }));
    setPeakHours(hoursData);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh]">
        <div className="w-12 h-12 border-4 border-amber-500/20 border-t-amber-500 rounded-full animate-spin mb-8" />
        <h3 className="text-[10px] font-black text-white uppercase tracking-[0.3em]">Synthesizing Data Models</h3>
      </div>
    );
  }

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-950 border border-white/10 p-5 rounded-2xl shadow-2xl backdrop-blur-xl">
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm font-bold flex items-center gap-3" style={{ color: entry.color }}>
              <span className="w-2 h-2 rounded-full shadow-[0_0_8px_currentColor]" style={{ backgroundColor: entry.color }} />
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-12 max-w-7xl mx-auto animate-fade-in pb-20">
      
      <div className="mb-2 px-2">
        <h2 className="text-4xl font-black text-white tracking-tight mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
          Analytics <span className="italic font-light text-slate-500">Dashboard</span>
        </h2>
        <p className="text-slate-500 font-medium">Advanced booking metrics and behavioral analytics.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <div className="glass-card group p-8">
          <div className="flex justify-between items-start mb-8">
            <div>
              <p className="label-text mb-2">Total Volume</p>
              <h3 className="text-4xl font-black text-white tracking-tighter">{reservations.length}</h3>
            </div>
            <div className="p-4 bg-blue-500/10 text-blue-400 rounded-2xl border border-blue-500/20 group-hover:scale-110 transition-transform shadow-xl shadow-blue-500/5">
              <CalendarDays className="h-7 w-7" />
            </div>
          </div>
          <div className="flex items-center text-[10px] font-black text-emerald-500 uppercase tracking-widest bg-emerald-500/5 py-1.5 px-3 rounded-lg w-fit">
            <TrendingUp className="h-3.5 w-3.5 mr-2" /> Data Integrity Confirmed
          </div>
        </div>

        <div className="glass-card group p-8">
          <div className="flex justify-between items-start mb-8">
            <div>
              <p className="label-text mb-2">Aggregate Guests</p>
              <h3 className="text-4xl font-black text-white tracking-tighter">{totalGuests}</h3>
            </div>
            <div className="p-4 bg-emerald-500/10 text-emerald-400 rounded-2xl border border-emerald-500/20 group-hover:scale-110 transition-transform shadow-xl shadow-emerald-500/5">
              <Users className="h-7 w-7" />
            </div>
          </div>
          <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest bg-white/5 py-1.5 px-3 rounded-lg w-fit">
            Global coverage
          </div>
        </div>

        <div className="glass-card group p-8">
          <div className="flex justify-between items-start mb-8">
            <div>
              <p className="label-text mb-2">Mean Party Size</p>
              <h3 className="text-4xl font-black text-white tracking-tighter">{avgGuests}</h3>
            </div>
            <div className="p-4 bg-purple-500/10 text-purple-400 rounded-2xl border border-purple-500/20 group-hover:scale-110 transition-transform shadow-xl shadow-purple-500/5">
              <Hash className="h-7 w-7" />
            </div>
          </div>
          <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest bg-white/5 py-1.5 px-3 rounded-lg w-fit">
            Per confirmed slot
          </div>
        </div>

        <div className="glass-card group p-8">
          <div className="flex justify-between items-start mb-8">
            <div>
              <p className="label-text mb-2">Operation Ratio</p>
              <h3 className="text-4xl font-black text-white tracking-tighter">{occupancyRate}%</h3>
            </div>
            <div className="p-4 bg-amber-500/10 text-amber-500 rounded-2xl border border-amber-500/20 group-hover:scale-110 transition-transform shadow-xl shadow-amber-500/5">
              <Percent className="h-7 w-7" />
            </div>
          </div>
          <div className="flex items-center text-[10px] font-black text-amber-500 uppercase tracking-widest bg-amber-500/5 py-1.5 px-3 rounded-lg w-fit">
            <Zap className="h-3.5 w-3.5 mr-2" /> Sync Real-time
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="glass-card p-10 group">
          <div className="mb-10 flex justify-between items-center">
            <h3 className="text-lg font-bold text-white flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20 group-hover:bg-blue-500/20 transition-all">
                <Activity className="h-5 w-5 text-blue-500" />
              </div>
              Temporal Distribution
            </h3>
          </div>
          <div className="h-[340px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={reservationsOverTime} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRes" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff" opacity={0.03} />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#475569', fontSize: 10, fontWeight: 900 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#475569', fontSize: 10, fontWeight: 900 }} allowDecimals={false} />
                <RechartsTooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="reservations" name="Bookings" stroke="#3b82f6" strokeWidth={4} fillOpacity={1} fill="url(#colorRes)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card p-10 group">
          <div className="mb-10 flex justify-between items-center">
            <h3 className="text-lg font-bold text-white flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20 group-hover:bg-amber-500/20 transition-all">
                <Clock className="h-5 w-5 text-amber-500" />
              </div>
              Peak Frequency Analysis
            </h3>
          </div>
          <div className="h-[340px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={peakHours} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff" opacity={0.03} />
                <XAxis dataKey="hour" axisLine={false} tickLine={false} tick={{ fill: '#475569', fontSize: 10, fontWeight: 900 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#475569', fontSize: 10, fontWeight: 900 }} allowDecimals={false} />
                <RechartsTooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="count" name="Reservations" stroke="#f59e0b" strokeWidth={4} dot={{ r: 5, strokeWidth: 3, fill: '#0B1120' }} activeDot={{ r: 8, strokeWidth: 0 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card p-10 lg:col-span-2 group">
          <div className="mb-10 flex justify-between items-center">
            <h3 className="text-lg font-bold text-white flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 group-hover:bg-emerald-500/20 transition-all">
                <BarChart3 className="h-5 w-5 text-emerald-500" />
              </div>
              Position Utilization Rank
            </h3>
          </div>
          <div className="h-[340px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mostUsedTables} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff" opacity={0.03} />
                <XAxis dataKey="table" axisLine={false} tickLine={false} tick={{ fill: '#475569', fontSize: 10, fontWeight: 900 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#475569', fontSize: 10, fontWeight: 900 }} allowDecimals={false} />
                <RechartsTooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255, 255, 255, 0.02)' }} />
                <Bar dataKey="bookings" name="Operational Load" fill="#10b981" radius={[10, 10, 0, 0]} barSize={50} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
