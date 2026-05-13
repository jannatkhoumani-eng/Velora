import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { useAuth } from '../context/AuthContext';
import { 
  Users, 
  Calendar, 
  Clock, 
  Table as TableIcon, 
  Sparkles, 
  MessageSquare, 
  Loader, 
  CheckCircle2, 
  UtensilsCrossed,
  ArrowRight,
  Info,
  ChevronRight,
  Moon,
  AlertCircle,
  Ticket,
  MapPin,
  Smartphone,
  Star,
  X
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';

const BASE = import.meta.env.VITE_API_URL || `http://${window.location.hostname}:5000`;
const API_URL = `${BASE}/reservations`;
const TABLES_URL = `${BASE}/available-tables`;

export default function AddReservation() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    nom: '', prenom: '', telephone: '', persons: '2', date: '', heure: '', table: '', experience: 'Standard', specialRequests: '', groupType: 'Friends', isRamadan: false
  });
  const [availableTables, setAvailableTables] = useState(null);
  const [loadingTables, setLoadingTables] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [apiError, setApiError] = useState('');

  useEffect(() => {
    if (formData.date && formData.heure) {
      fetchAvailableTables();
    }
  }, [formData.date, formData.heure]);

  const fetchAvailableTables = async () => {
    setLoadingTables(true);
    try {
      const [y, m, d] = formData.date.split('-');
      const formattedDate = `${d}/${m}/${y.slice(-2)}`;
      const { data, error } = await supabase
        .from('reservations')
        .select('table')
        .eq('date', formattedDate)
        .eq('heure', formData.heure);
        
      if (error) throw error;
      
      const bookedTables = data.map(r => parseInt(r.table));
      const getTableCapacity = (num) => {
        if (num >= 1 && num <= 3) return 2;
        if (num >= 4 && num <= 6) return 4;
        if (num >= 7 && num <= 9) return 6;
        if (num === 10) return 10;
        return 0;
      };
      
      const availability = [];
      for (let i = 1; i <= 10; i++) {
        availability.push({
          table: i,
          capacity: getTableCapacity(i),
          available: !bookedTables.includes(i)
        });
      }
      setAvailableTables(availability);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingTables(false);
    }
  };

  const validateField = (name, value) => {
    let error = '';
    if (!value && name !== 'specialRequests') {
      error = 'Required field';
    }
    
    if (name === 'telephone' && value && !/^\d{10}$/.test(value)) {
      error = 'Invalid phone number (10 digits)';
    }
    
    if (name === 'date' && value) {
      const selectedDate = new Date(value);
      const today = new Date();
      today.setHours(0,0,0,0);
      if (selectedDate < today) error = 'Date cannot be in the past';
    }
    return error;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === 'checkbox' ? checked : value;
    
    setFormData({ ...formData, [name]: val });
    setApiError('');
    
    if (touched[name]) {
      const error = validateField(name, val);
      setErrors({ ...errors, [name]: error });
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched({ ...touched, [name]: true });
    const error = validateField(name, value);
    setErrors({ ...errors, [name]: error });
  };

  const handleTableSelect = (tableId) => {
    if (loadingTables) return;
    const tData = availableTables?.find(t => t.table === tableId);
    
    if (tData && !tData.available) {
      setApiError(`Table ${tableId} is already booked for this time.`);
      return;
    }
    if (tData && parseInt(formData.persons) > tData.capacity) {
      setApiError(`Table ${tableId} capacity is too small for ${formData.persons} guests.`);
      return;
    }
    
    setFormData({ ...formData, table: tableId.toString() });
    setTouched({ ...touched, table: true });
    setErrors({ ...errors, table: '' });
    setApiError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    const required = ['nom', 'prenom', 'telephone', 'date', 'heure', 'persons', 'table'];
    required.forEach(key => {
      const error = validateField(key, formData[key]);
      if (error) newErrors[key] = error;
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setTouched(Object.keys(formData).reduce((acc, key) => ({ ...acc, [key]: true }), {}));
      setApiError('Missing required fields or invalid floor selection.');
      return;
    }

    setSubmitting(true);
    setApiError('');
    try {
      const [y, m, d] = formData.date.split('-');
      const payload = { 
        ...formData, 
        date: `${d}/${m}/${y.slice(-2)}`, 
        persons: parseInt(formData.persons), 
        table: parseInt(formData.table),
        isRamadan: !!formData.isRamadan,
        user_id: user?.userId || 'anonymous'
      };
      
      // Prevent double booking manually
      const { data: existing } = await supabase
        .from('reservations')
        .select('id')
        .eq('date', payload.date)
        .eq('heure', payload.heure)
        .eq('table', payload.table);
        
      if (existing && existing.length > 0) {
        setApiError("La table est déjà réservée à cette date et cette heure.");
        setSubmitting(false);
        return;
      }
      
      const { error } = await supabase.from('reservations').insert([payload]);
      if (error) throw error;
      
      setSuccess(true);
      setTimeout(() => navigate('/list'), 3000);
    } catch (err) {
      console.error("SUPABASE ERROR:", err);
      setApiError(err.message || err.details || "Synchronisation failed. Check connection.");
    } finally {
      setSubmitting(false);
    }
  };

  const isFormComplete = formData.nom && formData.prenom && formData.telephone && formData.date && formData.heure && formData.table;

  return (
    <div className="max-w-7xl mx-auto animate-fade-in pb-20 px-4 sm:px-6">
      
      {/* ─── FLOATING FEEDBACK SYSTEM (CENTERED VIEWPORT) ────────────────── */}
      {(apiError || success) && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 animate-fade-in">
          {/* Subtle Overlay */}
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => !success && setApiError('')}></div>
          
          <div 
            className="relative w-full max-w-[580px] p-10 rounded-[3rem] shadow-[0_50px_100px_rgba(0,0,0,0.8)] border-2 animate-scale-up text-center"
            style={{ 
              background: apiError ? 'rgba(127, 29, 29, 0.22)' : 'rgba(20, 83, 45, 0.22)', 
              borderColor: apiError ? 'rgba(239, 68, 68, 0.35)' : 'rgba(34, 197, 94, 0.35)', 
              color: apiError ? '#FCA5A5' : '#86EFAC',
              backdropFilter: 'blur(16px)'
            }}
          >
            {/* Close Button */}
            {!success && (
              <button 
                onClick={() => setApiError('')} 
                className="absolute top-8 right-8 p-2 rounded-full hover:bg-white/5 transition-colors text-white/40 hover:text-white"
              >
                <X size={20} />
              </button>
            )}

            <div className="flex flex-col items-center">
              <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-8 border-2 ${apiError ? 'bg-red-500/10 border-red-500/20 shadow-[0_0_40px_rgba(239,68,68,0.2)]' : 'bg-emerald-500/10 border-emerald-500/20 shadow-[0_0_40px_rgba(16,185,129,0.2)]'}`}>
                {apiError ? <AlertCircle size={36} /> : <CheckCircle2 size={36} />}
              </div>

              <h3 className="text-2xl font-black uppercase tracking-tighter mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
                {apiError ? 'Operational Alert' : 'Reservation Secured'}
              </h3>
              
              <p className="text-lg font-medium leading-relaxed opacity-90 max-w-sm mx-auto">
                {apiError || (
                  <span>The table for <span className="text-white font-bold">{formData.prenom} {formData.nom}</span> has been successfully synchronized.</span>
                )}
              </p>

              {success && (
                <div className="mt-10 flex flex-col items-center gap-4">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_15px_rgba(16,185,129,1)]"></div>
                  <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-50">Syncing with Central Archive...</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ─── HEADER ────────────────────────────────────────────────────── */}
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6 px-2">
        <div>
          <h2 className="text-3xl font-black text-white tracking-tight mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
            Add <span className="italic font-light text-slate-500">Reservation</span>
          </h2>
          <p className="text-slate-500 font-medium">Create a new dining experience for your guests.</p>
        </div>
        <div className="flex items-center gap-3 bg-slate-900/50 px-4 py-2 rounded-xl border border-white/5">
          <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></div>
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Floor Plan Live</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 xl:grid-cols-12 gap-10 items-start">
        
        {/* ─── FORM CONTENT (LEFT) ───────────────────────────────────────── */}
        <div className="xl:col-span-8 space-y-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="glass-card">
              <h3 className="text-sm font-black text-white uppercase tracking-widest mb-8 flex items-center gap-3">
                <Users className="w-4 h-4 text-amber-500" />
                Client Identity
              </h3>
              <div className="space-y-6">
                <div className="group">
                  <label className="label-text">First Name</label>
                  <input name="prenom" className={`input-field ${errors.prenom && touched.prenom ? 'border-red-500/50' : ''}`} placeholder="e.g. Jannat" value={formData.prenom} onChange={handleChange} onBlur={handleBlur} />
                  {errors.prenom && touched.prenom && <p className="mt-2 text-[10px] font-bold text-red-500 uppercase tracking-widest ml-1">{errors.prenom}</p>}
                </div>
                <div className="group">
                  <label className="label-text">Last Name</label>
                  <input name="nom" className={`input-field ${errors.nom && touched.nom ? 'border-red-500/50' : ''}`} placeholder="e.g. Dupont" value={formData.nom} onChange={handleChange} onBlur={handleBlur} />
                  {errors.nom && touched.nom && <p className="mt-2 text-[10px] font-bold text-red-500 uppercase tracking-widest ml-1">{errors.nom}</p>}
                </div>
                <div className="group">
                  <label className="label-text">Phone Number</label>
                  <input name="telephone" className={`input-field ${errors.telephone && touched.telephone ? 'border-red-500/50' : ''}`} placeholder="06XXXXXXXX" value={formData.telephone} onChange={handleChange} onBlur={handleBlur} />
                  {errors.telephone && touched.telephone && <p className="mt-2 text-[10px] font-bold text-red-500 uppercase tracking-widest ml-1">{errors.telephone}</p>}
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <div className="glass-card h-fit">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-sm font-black text-amber-500 uppercase tracking-widest flex items-center gap-3">
                    <Moon className="w-4 h-4" />
                    Ramadan Mode
                  </h3>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" name="isRamadan" checked={formData.isRamadan} onChange={handleChange} className="sr-only peer" />
                    <div className="w-11 h-6 bg-slate-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-slate-400 after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-600 peer-checked:after:bg-white"></div>
                  </label>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed font-medium">Enable specialized Ftour slots and Moroccan group options for the holy month.</p>
              </div>

              <div className="glass-card h-fit">
                <h3 className="text-sm font-black text-white uppercase tracking-widest mb-6 flex items-center gap-3">
                  <Sparkles className="w-4 h-4 text-purple-500" />
                  Atmosphere
                </h3>
                <select name="experience" className="input-field" value={formData.experience} onChange={handleChange}>
                  <option value="Standard">Standard Dining</option>
                  <option value="Romantic Dinner">Romantic Evening</option>
                  <option value="Business Meeting">Corporate Meeting</option>
                  <option value="Celebration">Birthday / Celebration</option>
                  <option value="Window View">Panoramic View</option>
                </select>
              </div>
            </div>
          </div>

          <div className="glass-card">
            <h3 className="text-sm font-black text-white uppercase tracking-widest mb-8 flex items-center gap-3">
              <Calendar className="w-4 h-4 text-blue-500" />
              Scheduling & Capacity
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="group">
                <label className="label-text">Select Date</label>
                <input type="date" name="date" className={`input-field ${errors.date && touched.date ? 'border-red-500/50' : ''}`} value={formData.date} onChange={handleChange} onBlur={handleBlur} />
                {errors.date && touched.date && <p className="mt-2 text-[10px] font-bold text-red-500 uppercase tracking-widest ml-1">{errors.date}</p>}
              </div>
              <div className="group">
                <label className="label-text">Select Time</label>
                <input type="time" name="heure" className={`input-field ${errors.heure && touched.heure ? 'border-red-500/50' : ''}`} value={formData.heure} onChange={handleChange} onBlur={handleBlur} />
                {errors.heure && touched.heure && <p className="mt-2 text-[10px] font-bold text-red-500 uppercase tracking-widest ml-1">{errors.heure}</p>}
              </div>
              <div className="group">
                <label className="label-text">Guest Count</label>
                <div className="relative">
                  <Users className="absolute left-4 top-3.5 h-5 w-5 text-slate-600" />
                  <input type="number" name="persons" min="1" max="10" className="input-field pl-12" value={formData.persons} onChange={handleChange} />
                </div>
              </div>
            </div>
          </div>

          <div className="glass-card">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-3">
                <TableIcon className="w-4 h-4 text-emerald-500" />
                Floor Configuration
              </h3>
              {loadingTables && <Loader className="animate-spin h-4 w-4 text-emerald-500" />}
            </div>

            {!formData.date || !formData.heure ? (
              <div className="py-12 border-2 border-dashed border-white/5 rounded-2xl flex flex-col items-center justify-center bg-slate-900/20">
                <Info className="w-10 h-10 text-slate-700 mb-4" />
                <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Awaiting Schedule Input</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(t => {
                  const tData = availableTables?.find(tbl => tbl.table === t);
                  const isOccupied = tData && !tData.available;
                  const isCapacityTooSmall = tData && parseInt(formData.persons) > tData.capacity;
                  const isSelected = formData.table === t.toString();
                  const isDisabled = isOccupied || isCapacityTooSmall;

                  let bgClass = "bg-slate-900/50 border-white/5 text-slate-500 hover:border-amber-500/30 hover:bg-slate-900 cursor-pointer";
                  if (isOccupied) bgClass = "bg-red-500/5 border-red-500/10 text-red-500/40 cursor-not-allowed";
                  else if (isCapacityTooSmall) bgClass = "bg-slate-900/20 border-white/5 text-slate-700 cursor-not-allowed";
                  else if (isSelected) bgClass = "bg-amber-500/10 border-amber-500 text-amber-500 ring-4 ring-amber-500/10 shadow-lg shadow-amber-500/10";
                  else if (tData?.available) bgClass = "bg-emerald-500/5 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/10 cursor-pointer";

                  return (
                    <div 
                      key={t} 
                      onClick={() => handleTableSelect(t)} 
                      className={`relative overflow-hidden rounded-2xl p-5 border-2 transition-all duration-300 flex flex-col items-center gap-2 ${bgClass}`}
                    >
                      <span className="text-xl font-black">{t}</span>
                      <span className="text-[9px] font-bold uppercase tracking-tighter opacity-50">Cap: {t === 10 ? '10' : t > 6 ? '6' : t > 3 ? '4' : '2'}</span>
                      {isSelected && <div className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,1)]"></div>}
                    </div>
                  );
                })}
              </div>
            )}
            {errors.table && touched.table && <p className="mt-6 text-[10px] font-bold text-red-500 uppercase tracking-widest ml-1">{errors.table}</p>}
          </div>

          <div className="glass-card">
            <h3 className="text-sm font-black text-white uppercase tracking-widest mb-6 flex items-center gap-3">
              <MessageSquare className="w-4 h-4 text-blue-500" />
              Special Requests
            </h3>
            <textarea 
              name="specialRequests" 
              rows="3" 
              className="input-field" 
              placeholder="e.g. Quiet corner, allergic to shellfish, birthday cake..." 
              value={formData.specialRequests} 
              onChange={handleChange}
            />
          </div>

        </div>

        {/* ─── LUXURY PREVIEW (RIGHT) ───────────────────────────────────── */}
        <div className="xl:col-span-4 sticky top-32 space-y-8">
          <div className="glass-card p-0 overflow-hidden relative group animate-fade-in border-amber-500/20 bg-slate-950/40 shadow-[0_40px_100px_rgba(0,0,0,0.6)]">
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #fff 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-transparent to-blue-500/5"></div>
            
            <div className="p-10 relative z-10">
              <div className="flex justify-center mb-12">
                <Logo size="sm" variant="light" />
              </div>

              <div className="text-center mb-12">
                <p className="text-[10px] font-black text-amber-500/60 uppercase tracking-[0.4em] mb-4">Official Invitation</p>
                <div className="w-12 h-[1px] bg-amber-500/20 mx-auto"></div>
              </div>

              <div className="space-y-10">
                <div className="text-center animate-fade-in">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Guest of Honor</p>
                  <h4 className="text-3xl font-black text-white tracking-tighter" style={{ fontFamily: "'Playfair Display', serif" }}>
                    {formData.prenom || formData.nom ? `${formData.prenom} ${formData.nom}` : <span className="text-white/10 italic">Awaiting Identity</span>}
                  </h4>
                  {formData.telephone && <p className="text-xs text-slate-500 mt-2 font-medium tracking-widest">{formData.telephone}</p>}
                </div>

                <div className="grid grid-cols-2 gap-8 py-8 border-y border-white/5">
                  <div className="space-y-2">
                    <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest flex items-center gap-2"><Calendar size={10} className="text-amber-500" /> Date</p>
                    <p className="text-sm font-bold text-white">{formData.date || <span className="opacity-10 italic">TBD</span>}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest flex items-center gap-2"><Clock size={10} className="text-blue-500" /> Time</p>
                    <p className="text-sm font-bold text-white">{formData.heure || <span className="opacity-10 italic">TBD</span>}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest flex items-center gap-2"><TableIcon size={10} className="text-emerald-500" /> Table</p>
                    <p className="text-sm font-bold text-white">{formData.table ? `Point ${formData.table}` : <span className="opacity-10 italic">Unassigned</span>}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest flex items-center gap-2"><Users size={10} className="text-purple-500" /> Party</p>
                    <p className="text-sm font-bold text-white">{formData.persons} Guests</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Experience</p>
                    <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest flex items-center gap-2">
                      <Star size={10} /> {formData.experience}
                    </span>
                  </div>
                  {formData.specialRequests && (
                    <div className="bg-white/5 p-5 rounded-2xl border border-white/5">
                      <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-2 flex items-center gap-2"><MessageSquare size={10} /> Notes</p>
                      <p className="text-[11px] text-slate-400 italic leading-relaxed">{formData.specialRequests}</p>
                    </div>
                  )}
                </div>

                <div className="pt-8 text-center">
                  {isFormComplete ? (
                    <div className="flex flex-col items-center gap-4 animate-pulse">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,1)]"></div>
                      <p className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.4em]">Ready to Confirm</p>
                    </div>
                  ) : (
                    <p className="text-[10px] font-black text-slate-700 uppercase tracking-[0.3em]">Complete form to finalize</p>
                  )}
                </div>
              </div>
            </div>
            <div className="absolute top-0 left-0 w-24 h-[1px] bg-gradient-to-r from-transparent via-amber-500/40 to-transparent"></div>
            <div className="absolute bottom-0 right-0 w-24 h-[1px] bg-gradient-to-r from-transparent via-amber-500/40 to-transparent"></div>
          </div>

          <button 
            type="submit" 
            onClick={handleSubmit}
            className="btn-primary w-full py-6 text-sm font-black uppercase tracking-[0.3em] shadow-[0_30px_60px_rgba(245,158,11,0.2)] group"
            disabled={submitting}
          >
            {submitting ? <Loader className="animate-spin w-5 h-5 mr-3" /> : <ChevronRight className="w-5 h-5 mr-3 group-hover:translate-x-2 transition-transform" />}
            Confirm Reservation
          </button>
        </div>

      </form>
    </div>
  );
}
