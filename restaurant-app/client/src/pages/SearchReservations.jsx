import { useState } from 'react';
import { supabase } from '../supabaseClient';
import { Search, Loader, Users, Calendar, Hash, Filter, ChevronRight, AlertCircle, Trash2, Clock, Zap } from 'lucide-react';

const BASE = import.meta.env.VITE_API_URL || `http://${window.location.hostname}:5000`;
const API_URL = `${BASE}/reservations`;

export default function SearchReservations() {
  const [searchMode, setSearchMode] = useState('name');
  const [query, setQuery] = useState('');
  const [qDate, setQDate] = useState('');
  const [qTime, setQTime] = useState('');
  const [results, setResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setHasSearched(true);
    
    try {
      let queryBuilder = supabase.from('reservations').select('*');
      
      if (searchMode === 'id') {
        queryBuilder = queryBuilder.eq('id', parseInt(query) || 0);
      } else if (searchMode === 'name') {
        const q = query.toLowerCase();
        queryBuilder = queryBuilder.or(`nom.ilike.%${q}%,prenom.ilike.%${q}%`);
      } else if (searchMode === 'datetime') {
        if (qDate) {
          const [y, m, d] = qDate.split('-');
          queryBuilder = queryBuilder.eq('date', `${d}/${m}/${y.slice(-2)}`);
        }
        if (qTime) queryBuilder = queryBuilder.eq('heure', qTime);
      }
      
      const { data, error } = await queryBuilder;
      if (error) throw error;
      setResults(data || []);
    } catch (err) {
      console.error(err);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (prenom, nom) => `${prenom?.charAt(0) || ''}${nom?.charAt(0) || ''}`.toUpperCase();

  const tabs = [
    { id: 'name', label: 'Identity Search', icon: Users },
    { id: 'id', label: 'Reference Code', icon: Hash },
    { id: 'datetime', label: 'Schedule Match', icon: Calendar },
  ];

  return (
    <div className="space-y-12 max-w-6xl mx-auto animate-fade-in pb-20">
      
      <div className="mb-2 px-2">
        <h2 className="text-4xl font-black text-white tracking-tight mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
          Search <span className="italic font-light text-slate-500">Reservation</span>
        </h2>
        <p className="text-slate-500 font-medium">Deep search engine for reservation management.</p>
      </div>

      <div className="glass-card p-12 relative overflow-hidden group">
        <div className="absolute top-0 right-0 -m-32 w-80 h-80 bg-amber-500/5 rounded-full blur-[100px] pointer-events-none group-hover:bg-amber-500/10 transition-colors duration-700" />

        <div className="flex flex-wrap items-center gap-4 mb-12 bg-slate-950/40 p-2.5 rounded-2xl w-fit border border-white/5">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => { setSearchMode(tab.id); setQuery(''); setHasSearched(false); setResults([]); }}
              className={`flex items-center py-3 px-6 text-[10px] font-black uppercase tracking-[0.2em] rounded-xl transition-all duration-300 ${
                searchMode === tab.id 
                  ? 'bg-amber-500/10 text-amber-500 shadow-xl border border-amber-500/20' 
                  : 'text-slate-500 hover:text-slate-300 hover:bg-white/5 border border-transparent'
              }`}
            >
              <tab.icon className={`h-4 w-4 mr-3 ${searchMode === tab.id ? 'text-amber-500' : 'text-slate-600'}`} />
              {tab.label}
            </button>
          ))}
        </div>

        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-8 items-end relative z-10">
          {(searchMode === 'id' || searchMode === 'name') && (
            <div className="flex-1 w-full relative group">
              <label className="label-text">{searchMode === 'id' ? 'System Reference ID' : 'Guest Identification'}</label>
              <div className="relative">
                {searchMode === 'name' ? <Users className="absolute left-5 top-4.5 h-5 w-5 text-slate-600 group-focus-within:text-amber-500 transition-colors" /> : <Hash className="absolute left-5 top-4.5 h-5 w-5 text-slate-600 group-focus-within:text-amber-500 transition-colors" />}
                <input 
                  type={searchMode === 'id' ? 'number' : 'text'} 
                  className="input-field pl-14 py-4.5 text-lg font-medium" 
                  value={query} 
                  onChange={(e) => setQuery(e.target.value)} 
                  placeholder={searchMode === 'id' ? "e.g. 1024" : "e.g. Jannat Dupont"}
                  required
                />
              </div>
            </div>
          )}

          {searchMode === 'datetime' && (
            <div className="flex-1 w-full flex flex-col md:flex-row gap-8">
              <div className="flex-1 relative group">
                <label className="label-text">Select Date</label>
                <div className="relative">
                  <Calendar className="absolute left-5 top-4.5 h-5 w-5 text-slate-600 group-focus-within:text-amber-500 transition-colors" />
                  <input type="date" className="input-field pl-14 py-4.5" value={qDate} onChange={(e) => setQDate(e.target.value)} />
                </div>
              </div>
              <div className="flex-1 relative group">
                <label className="label-text">Select Time</label>
                <div className="relative">
                  <Clock className="absolute left-5 top-4.5 h-5 w-5 text-slate-600 group-focus-within:text-amber-500 transition-colors" />
                  <input type="time" className="input-field pl-14 py-4.5" value={qTime} onChange={(e) => setQTime(e.target.value)} />
                </div>
              </div>
            </div>
          )}

          <button type="submit" className="btn-primary w-full md:w-auto h-[62px] px-12" disabled={loading}>
            {loading ? <Loader className="animate-spin h-4 w-4 mr-3" /> : <Search className="h-4 w-4 mr-3" />}
            Execute Search
          </button>
        </form>
      </div>

      {hasSearched && !loading && (
        <div className="animate-fade-in space-y-8">
          <div className="flex items-center justify-between mb-2 px-2">
            <h3 className="text-2xl font-black text-white flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
                <Zap className="h-5 w-5 text-amber-500" />
              </div>
              Retrieved Records
            </h3>
            <span className="bg-amber-500/10 text-amber-500 py-2 px-6 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] border border-amber-500/20 shadow-lg">
              {results.length} Found
            </span>
          </div>
          
          {results.length === 0 ? (
            <div className="text-center py-32 border-2 border-dashed border-white/5 rounded-[3rem] bg-slate-900/10 flex flex-col items-center">
              <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-8 border border-white/5">
                <Search className="h-12 w-12 text-slate-800" />
              </div>
              <h3 className="text-2xl font-black text-white mb-3 tracking-tight">Zero Matches Recovered</h3>
              <p className="text-slate-500 max-w-sm px-6 font-medium">We couldn't find any data matching your criteria. Please refine your system query.</p>
            </div>
          ) : (
            <div className="data-table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Guest Identity</th>
                    <th>Schedule</th>
                    <th>Position</th>
                    <th>Party Size</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((res, idx) => (
                    <tr key={res.id} className="animate-slide-up" style={{ animationDelay: `${idx * 0.03}s` }}>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="h-12 w-12 rounded-2xl bg-slate-900 border border-white/5 text-amber-500 flex items-center justify-center font-black text-xs shadow-inner shrink-0">
                            {getInitials(res.prenom, res.nom)}
                          </div>
                          <div className="min-w-0">
                            <div className="font-bold text-white text-base">{res.prenom} {res.nom}</div>
                            <div className="text-[10px] font-black text-slate-600 uppercase tracking-widest mt-1">{res.telephone} <span className="mx-2 opacity-30">|</span> ID #{res.id}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="text-slate-300 font-bold text-xs mb-1">{res.date}</div>
                        <div className="text-[10px] text-blue-400 font-black bg-blue-500/5 inline-flex px-2.5 py-1 rounded-lg border border-blue-500/10 uppercase tracking-widest">{res.heure}</div>
                      </td>
                      <td>
                        <span className="inline-flex items-center px-3.5 py-1.5 bg-slate-950 border border-white/5 text-slate-400 text-xs rounded-xl font-black uppercase tracking-widest">
                          Table {res.table}
                        </span>
                      </td>
                      <td>
                        <div className="flex items-center text-slate-400 font-black text-xs uppercase tracking-tighter">
                          <Users className="h-3.5 w-3.5 mr-2 text-slate-600" />
                          {res.persons} Guests
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
