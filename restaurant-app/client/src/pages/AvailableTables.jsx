import { useState, useEffect } from 'react';
import axios from 'axios';
import { Loader, Users, CheckCircle2, XCircle, Search, Calendar, Clock, ArrowRight, Info, Crown, X, Map as MapIcon, Zap } from 'lucide-react';

const API_URL = `http://${window.location.hostname}:5000/available-tables`;

export default function AvailableTables() {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedTable, setSelectedTable] = useState(null);

  const [allReservations, setAllReservations] = useState([]);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const fetchTables = async () => {
    setLoading(true);
    setError(null);
    try {
      const targetDate = date || new Date().toISOString().split('T')[0];
      const targetTime = time || `${String(new Date().getHours()).padStart(2, '0')}:${String(new Date().getMinutes()).padStart(2, '0')}`;
      const [y, m, d] = targetDate.split('-');
      const formattedDate = `${d}/${m}/${y.slice(-2)}`;

      const [resAvailability, resAll] = await Promise.all([
        axios.get(API_URL, { params: { date: formattedDate, time: targetTime } }),
        axios.get(`http://${window.location.hostname}:5000/reservations`)
      ]);

      setTables(resAvailability.data);
      setAllReservations(resAll.data);
    } catch (err) {
      setError(err.response?.data?.error || "Load synchronization failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!date) {
      const today = new Date().toISOString().split('T')[0];
      setDate(today);
    }
    if (!time) {
      const now = `${String(new Date().getHours()).padStart(2, '0')}:${String(new Date().getMinutes()).padStart(2, '0')}`;
      setTime(now);
    }
  }, []);

  useEffect(() => {
    if (date && time) {
      fetchTables();
      setSelectedTable(null);
    }
  }, [date, time]);

  const getTableStatus = (tableId) => {
    const tData = tables.find(t => t.table === tableId);
    if (!tData) return 'disabled';
    const [y, m, d] = date.split('-');
    const formattedDate = `${d}/${m}/${y.slice(-2)}`;
    const dayRes = allReservations.filter(r => r.table === tableId && r.date === formattedDate);
    if (dayRes.length === 0) return 'available';
    const activeRes = dayRes.find(r => r.heure === time);
    if (activeRes) return 'active';
    const [selH, selM] = time.split(':').map(Number);
    const selTotalMin = selH * 60 + selM;
    const upcomingRes = dayRes.find(r => {
      const [rH, rM] = r.heure.split(':').map(Number);
      const rTotalMin = rH * 60 + rM;
      return rTotalMin > selTotalMin && rTotalMin <= selTotalMin + 60;
    });
    if (upcomingRes) return 'upcoming';
    if (!tData.available) return 'reserved';
    return 'reserved-today';
  };

  const getTableReservation = (tableId) => {
    const [y, m, d] = date.split('-');
    const formattedDate = `${d}/${m}/${y.slice(-2)}`;
    const dayRes = allReservations.filter(r => r.table === tableId && r.date === formattedDate);
    if (dayRes.length === 0) return null;
    const [selH, selM] = time.split(':').map(Number);
    const selTotalMin = selH * 60 + selM;
    const current = dayRes.find(r => r.heure === time);
    if (current) return current;
    const next = [...dayRes].sort((a,b) => {
      const [ah, am] = a.heure.split(':').map(Number);
      const [bh, bm] = b.heure.split(':').map(Number);
      return (ah*60+am) - (bh*60+bm);
    }).find(r => {
      const [rh, rm] = r.heure.split(':').map(Number);
      return (rh*60+rm) > selTotalMin;
    });
    return next || dayRes[0];
  };

  const floorPlanConfig = [
    { id: 1, capacity: 2, shape: 'square' },
    { id: 2, capacity: 2, shape: 'square' },
    { id: 3, capacity: 2, shape: 'square' },
    { id: 4, capacity: 4, shape: 'circle' },
    { id: 5, capacity: 4, shape: 'circle' },
    { id: 6, capacity: 4, shape: 'circle' },
    { id: 7, capacity: 6, shape: 'rectangle' },
    { id: 8, capacity: 6, shape: 'rectangle' },
    { id: 9, capacity: 6, shape: 'rectangle' },
    { id: 10, capacity: 10, shape: 'oval', isVip: true },
  ];

  const renderSeats = (capacity) => {
    const seats = [];
    const baseClass = "absolute w-2.5 h-2.5 bg-slate-800 rounded-full transition-colors duration-300";
    if (capacity === 2) {
      seats.push(<div key="1" className={`${baseClass} -left-4 top-1/2 -translate-y-1/2`} />);
      seats.push(<div key="2" className={`${baseClass} -right-4 top-1/2 -translate-y-1/2`} />);
    } else if (capacity === 4) {
      seats.push(<div key="1" className={`${baseClass} -top-4 left-1/2 -translate-x-1/2`} />);
      seats.push(<div key="2" className={`${baseClass} -bottom-4 left-1/2 -translate-x-1/2`} />);
      seats.push(<div key="3" className={`${baseClass} -left-4 top-1/2 -translate-y-1/2`} />);
      seats.push(<div key="4" className={`${baseClass} -right-4 top-1/2 -translate-y-1/2`} />);
    } else if (capacity === 6) {
      [1, 2, 3].forEach(i => seats.push(<div key={`t${i}`} className={`${baseClass} -top-4`} style={{left: `${(i*25)}%`}} />));
      [1, 2, 3].forEach(i => seats.push(<div key={`b${i}`} className={`${baseClass} -bottom-4`} style={{left: `${(i*25)}%`}} />));
    } else if (capacity === 10) {
      [1, 2, 3, 4].forEach(i => seats.push(<div key={`t${i}`} className={`${baseClass} -top-4`} style={{left: `${(i*20)}%`}} />));
      [1, 2, 3, 4].forEach(i => seats.push(<div key={`b${i}`} className={`${baseClass} -bottom-4`} style={{left: `${(i*20)}%`}} />));
      seats.push(<div key="l" className={`${baseClass} -left-4 top-1/2 -translate-y-1/2`} />);
      seats.push(<div key="r" className={`${baseClass} -right-4 top-1/2 -translate-y-1/2`} />);
    }
    return seats;
  };

  return (
    <div className="space-y-12 max-w-7xl mx-auto animate-fade-in pb-20 flex flex-col xl:flex-row gap-12 items-start">
      
      <div className="flex-1 w-full space-y-12">
        <div className="mb-2 px-2">
          <h2 className="text-4xl font-black text-white tracking-tight mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
            Available <span className="italic font-light text-slate-500">Tables</span>
          </h2>
          <p className="text-slate-500 font-medium">Interactive table deployment and live synchronization.</p>
        </div>

        <div className="glass-card p-10 z-10 relative group">
          <div className="absolute top-0 right-0 -m-32 w-64 h-64 bg-blue-500/5 rounded-full blur-[80px] pointer-events-none group-hover:bg-blue-500/10 transition-colors" />
          <div className="flex flex-col md:flex-row gap-10">
            <div className="flex-1 relative group">
              <label className="label-text">Select Operation Date</label>
              <div className="relative">
                <Calendar className="absolute left-5 top-4.5 h-5 w-5 text-slate-600 group-focus-within:text-amber-500 transition-colors" />
                <input type="date" className="input-field pl-14 py-4.5" value={date} onChange={(e) => setDate(e.target.value)} />
              </div>
            </div>
            
            <div className="flex-1 relative group">
              <label className="label-text">Select Target Time</label>
              <div className="relative">
                <Clock className="absolute left-5 top-4.5 h-5 w-5 text-slate-600 group-focus-within:text-amber-500 transition-colors" />
                <input type="time" className="input-field pl-14 py-4.5" value={time} onChange={(e) => setTime(e.target.value)} />
              </div>
            </div>
          </div>
          {error && <div className="mt-8 p-5 bg-red-500/10 text-red-500 rounded-[2rem] flex items-center border border-red-500/20 text-sm font-black uppercase tracking-widest"><XCircle className="h-4 w-4 mr-4" />{error}</div>}
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-40 text-slate-600">
            <div className="w-12 h-12 border-4 border-amber-500/20 border-t-amber-500 rounded-full animate-spin mb-8" />
            <p className="font-black text-[10px] uppercase tracking-[0.3em] text-white">Rendering Floor Environment</p>
          </div>
        ) : tables.length > 0 ? (
          <div className="glass-card p-12 bg-slate-950/30 relative overflow-hidden border-none shadow-[0_0_100px_rgba(0,0,0,0.4)]">
            <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #fff 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
            
            <div className="flex flex-wrap items-center gap-10 mb-16 pb-10 border-b border-white/5 relative z-10">
              <div className="flex items-center gap-4">
                <div className="w-3.5 h-3.5 rounded bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.4)]"></div>
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Clear / Open</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-3.5 h-3.5 rounded bg-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.4)]"></div>
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Active Match</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-3.5 h-3.5 rounded bg-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.4)]"></div>
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Upcoming Slot</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-3.5 h-3.5 rounded bg-red-500 shadow-[0_0_20px_rgba(239,68,68,0.4)]"></div>
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Reserved Locked</span>
              </div>
            </div>

            <div className="flex flex-col gap-24 relative z-10 py-8">
              {[
                { start: 0, end: 3, gap: "gap-28" },
                { start: 3, end: 6, gap: "gap-28" },
                { start: 6, end: 9, gap: "gap-24" },
                { start: 9, end: 10, gap: "" }
              ].map((row, rowIdx) => (
                <div key={rowIdx} className={`flex justify-center ${row.gap} ${rowIdx === 3 ? 'mt-10' : ''}`}>
                  {floorPlanConfig.slice(row.start, row.end).map(config => {
                    const status = getTableStatus(config.id);
                    const res = getTableReservation(config.id);
                    const isSelected = selectedTable?.table === config.id;
                    
                    let statusColor = "bg-slate-900 border-white/5";
                    let glowColor = "rgba(148,163,184,0.05)";
                    
                    if (status === 'available') {
                      statusColor = "bg-emerald-500/10 border-emerald-500/30";
                      glowColor = "rgba(16,185,129,0.15)";
                    } else if (status === 'active') {
                      statusColor = "bg-blue-500/10 border-blue-500/30";
                      glowColor = "rgba(59,130,246,0.2)";
                    } else if (status === 'upcoming') {
                      statusColor = "bg-amber-500/10 border-amber-500/30";
                      glowColor = "rgba(245,158,11,0.15)";
                    } else if (status === 'reserved' || status === 'reserved-today') {
                      statusColor = "bg-red-500/10 border-red-500/30";
                      glowColor = "rgba(239,68,68,0.15)";
                    }

                    return (
                      <div key={config.id} onClick={() => setSelectedTable({table: config.id, capacity: config.capacity, available: status === 'available'})} className="relative group cursor-pointer">
                        {/* TOOLTIP POPUP */}
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-6 w-56 bg-slate-900/95 text-white p-5 rounded-[2rem] shadow-2xl opacity-0 group-hover:opacity-100 translate-y-3 group-hover:translate-y-0 transition-all duration-400 pointer-events-none z-50 border border-white/10 backdrop-blur-xl">
                          <div className="flex justify-between items-center mb-4">
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Point {config.id}</span>
                            <span className={`text-[9px] px-2.5 py-1 rounded-lg font-black uppercase tracking-tighter ${status === 'available' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}`}>
                              {status}
                            </span>
                          </div>
                          {res ? (
                            <div className="space-y-2.5">
                              <div className="flex items-center gap-3 text-xs font-bold text-white">
                                <Clock size={12} className="text-amber-500" /> {res.heure}
                              </div>
                              <div className="flex items-center gap-3 text-[11px] text-slate-400">
                                <Users size={12} /> {res.persons} Guests
                              </div>
                            </div>
                          ) : (
                            <p className="text-[11px] text-slate-500 italic">No operations listed</p>
                          )}
                          <div className="absolute top-full left-1/2 -translate-x-1/2 border-[8px] border-transparent border-t-slate-900" />
                        </div>

                        {renderSeats(config.capacity)}
                        
                        {config.id === 10 && (
                          <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 text-[10px] font-black px-4 py-2 rounded-full shadow-[0_10px_20px_rgba(245,158,11,0.3)] flex items-center z-20 uppercase tracking-widest border border-white/30 animate-bounce">
                            <Crown className="w-4 h-4 mr-2"/> Premium VIP
                          </div>
                        )}

                        <div 
                          className={`
                            ${config.shape === 'square' ? 'w-18 h-18 rounded-[1.5rem]' : ''}
                            ${config.shape === 'circle' ? 'w-22 h-22 rounded-full' : ''}
                            ${config.shape === 'rectangle' ? 'w-36 h-18 rounded-[1.5rem]' : ''}
                            ${config.shape === 'oval' ? 'w-64 h-28 rounded-[4rem]' : ''}
                            border-2 flex flex-col items-center justify-center relative z-10 transition-all duration-500 
                            ${statusColor} text-white shadow-2xl
                            group-hover:scale-110 group-hover:-translate-y-3
                            ${isSelected ? 'ring-4 ring-amber-500/30 scale-110 -translate-y-3' : ''}
                          `}
                          style={{ boxShadow: `0 20px 50px -15px ${glowColor}` }}
                        >
                          <span className="text-3xl font-black tracking-tighter">{config.id}</span>
                          <span className="text-[10px] font-black text-white/30 uppercase tracking-tighter mt-0.5">{config.capacity}p</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="glass-card flex flex-col items-center justify-center py-40 text-slate-700 border-dashed bg-slate-950/20">
            <MapIcon className="h-16 w-16 opacity-5 mb-8" />
            <h3 className="text-2xl font-black text-white mb-3 tracking-tight">Deployment Offline</h3>
            <p className="text-slate-500 font-medium max-w-xs text-center">Set valid temporal parameters to synchronize the architectural floor plan.</p>
          </div>
        )}
      </div>

      {selectedTable && (
        <div className="w-full xl:w-[440px] glass-card p-0 overflow-hidden sticky top-32 animate-slide-up shrink-0 shadow-[0_40px_100px_rgba(0,0,0,0.6)] border-white/5">
          <div className={`h-40 p-10 relative flex flex-col justify-end overflow-hidden ${selectedTable.available ? 'bg-emerald-600/10' : 'bg-red-600/10'} ${selectedTable.table === 10 ? 'bg-amber-600/10' : ''}`}>
            <div className="absolute top-0 right-0 -m-10 w-40 h-40 rounded-full blur-[60px]" style={{ background: selectedTable.available ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)' }}></div>
            <button onClick={() => setSelectedTable(null)} className="absolute top-8 right-8 text-slate-600 hover:text-white transition-colors z-20">
              <X className="w-8 h-8" />
            </button>
            <h3 className="text-5xl font-black text-white tracking-tighter relative z-10">Point {selectedTable.table}</h3>
            {selectedTable.table === 10 && <span className="absolute bottom-10 right-10 bg-amber-500/10 text-amber-500 border border-amber-500/20 px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center shadow-2xl backdrop-blur-md z-10"><Crown className="w-4 h-4 mr-2"/>Premium Elite Zone</span>}
          </div>
          
          <div className="p-10 space-y-10">
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em]">Operational Status</p>
              {selectedTable.available ? (
                <span className="inline-flex items-center text-emerald-500 text-xs font-black uppercase tracking-widest"><CheckCircle2 className="w-4 h-4 mr-3"/> Optimal</span>
              ) : (
                <span className="inline-flex items-center text-red-500 text-xs font-black uppercase tracking-widest"><XCircle className="w-4 h-4 mr-3"/> Locked</span>
              )}
            </div>

            <div className="grid grid-cols-2 gap-8">
              <div className="bg-white/5 p-6 rounded-[2rem] border border-white/5 group hover:bg-white/[0.07] transition-all">
                <Users className="w-6 h-6 text-amber-500 mb-4" />
                <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-1">Max Payload</p>
                <p className="text-2xl font-black text-white">{selectedTable.capacity} Guests</p>
              </div>
              <div className="bg-white/5 p-6 rounded-[2rem] border border-white/5 group hover:bg-white/[0.07] transition-all">
                <Clock className="w-6 h-6 text-blue-500 mb-4" />
                <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-1">Target Sync</p>
                <p className="text-2xl font-black text-white">{time}</p>
              </div>
            </div>

            {!selectedTable.available && (
              <div className="p-6 bg-red-500/10 border border-red-500/20 rounded-[2rem] flex gap-5 animate-pulse">
                <Zap className="w-6 h-6 text-red-500 shrink-0 mt-1" />
                <div>
                  <h4 className="font-bold text-white text-base mb-1 tracking-tight">Security Lockout</h4>
                  <p className="text-xs text-slate-500 leading-relaxed font-medium">This floor position is currently engaged for the selected temporal window.</p>
                </div>
              </div>
            )}

            {selectedTable.available && (
              <button onClick={() => window.location.href=`/add?table=${selectedTable.table}&date=${date}&time=${time}`} className="btn-blue w-full py-5 text-xs font-black uppercase tracking-[0.3em] shadow-[0_20px_40px_rgba(37,99,235,0.3)]">
                Initialize Booking
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
