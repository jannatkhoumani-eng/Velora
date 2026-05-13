import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LogIn, 
  UserPlus, 
  ArrowRight, 
  Sparkles, 
  User, 
  ChevronRight, 
  Star,
  Loader,
  CheckCircle2
} from 'lucide-react';
import Logo from '../components/Logo';

export default function AuthPage() {
  const [mode, setMode] = useState('signin'); // 'signin' or 'signup'
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signIn, user } = useAuth();
  const navigate = useNavigate();

  // If already logged in, redirect
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!name.trim()) {
      setError('Please enter your name to continue.');
      return;
    }

    if (name.trim().length < 2) {
      setError('Name must be at least 2 characters.');
      return;
    }

    setLoading(true);
    
    // Small delay for premium feel
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const ok = signIn(name);
    if (ok) {
      setSuccess(true);
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    } else {
      setError('Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center relative overflow-hidden px-4">
      
      {/* ── Background Effects ── */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-amber-500/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[120px]" />
        <div className="absolute inset-0 opacity-[0.015]" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #fff 1px, transparent 0)', backgroundSize: '40px 40px' }} />
      </div>

      {/* ── Floating Stars Decoration ── */}
      {[...Array(5)].map((_, i) => (
        <div 
          key={i}
          className="absolute w-1 h-1 bg-amber-500/30 rounded-full animate-pulse"
          style={{ 
            top: `${15 + i * 18}%`, 
            left: `${10 + i * 20}%`,
            animationDelay: `${i * 0.5}s`,
            boxShadow: '0 0 10px rgba(245, 158, 11, 0.3)'
          }}
        />
      ))}

      {/* ── Main Auth Card ── */}
      <div className="relative z-10 w-full max-w-[520px] animate-fade-in">
        
        {/* Logo */}
        <div className="flex justify-center mb-16">
          <Logo size="lg" variant="light" />
        </div>

        {/* Card */}
        <div className="relative overflow-hidden rounded-[3rem] border border-white/5 shadow-[0_50px_150px_rgba(0,0,0,0.7)]" 
          style={{ 
            background: 'linear-gradient(135deg, rgba(17, 24, 39, 0.9) 0%, rgba(17, 24, 39, 0.98) 100%)',
            backdropFilter: 'blur(20px)' 
          }}
        >
          {/* Top Gradient Bar */}
          <div className="h-1 bg-gradient-to-r from-transparent via-amber-500/50 to-transparent" />

          {/* Inner Glow */}
          <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-amber-500/5 rounded-full blur-[80px] -mr-32 -mt-32 pointer-events-none" />

          <div className="p-12 md:p-16 relative z-10">
            
            {/* ── Success State ── */}
            {success ? (
              <div className="flex flex-col items-center py-10 animate-scale-up">
                <div className="w-24 h-24 rounded-full bg-emerald-500/10 border-2 border-emerald-500/20 flex items-center justify-center mb-8 shadow-[0_0_50px_rgba(16,185,129,0.2)]">
                  <CheckCircle2 className="w-12 h-12 text-emerald-400" />
                </div>
                <h3 className="text-3xl font-black text-white mb-3 tracking-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
                  Welcome, <span className="text-amber-500">{name}</span>
                </h3>
                <p className="text-slate-500 font-medium mb-8">Initializing your personal dashboard...</p>
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_15px_rgba(16,185,129,1)]" />
                  <p className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.4em]">Syncing Session</p>
                </div>
              </div>
            ) : (
              <>
                {/* ── Tab Switcher ── */}
                <div className="flex items-center bg-slate-950/50 p-2 rounded-2xl border border-white/5 mb-12">
                  <button 
                    onClick={() => { setMode('signin'); setError(''); }}
                    className={`flex-1 flex items-center justify-center gap-3 py-4 px-6 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 ${
                      mode === 'signin' 
                        ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20 shadow-xl' 
                        : 'text-slate-500 hover:text-slate-300 border border-transparent'
                    }`}
                  >
                    <LogIn className="w-4 h-4" />
                    Sign In
                  </button>
                  <button 
                    onClick={() => { setMode('signup'); setError(''); }}
                    className={`flex-1 flex items-center justify-center gap-3 py-4 px-6 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 ${
                      mode === 'signup' 
                        ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20 shadow-xl' 
                        : 'text-slate-500 hover:text-slate-300 border border-transparent'
                    }`}
                  >
                    <UserPlus className="w-4 h-4" />
                    Sign Up
                  </button>
                </div>

                {/* ── Header ── */}
                <div className="text-center mb-12">
                  <div className="inline-flex items-center px-5 py-2 rounded-full bg-white/5 border border-white/5 text-amber-500 font-black text-[9px] uppercase tracking-[0.4em] mb-8">
                    <Sparkles className="w-3 h-3 mr-3 animate-pulse" />
                    {mode === 'signin' ? 'Welcome Back' : 'Join Velora'}
                  </div>
                  <h2 className="text-4xl font-black text-white tracking-tight mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
                    {mode === 'signin' ? (
                      <>Enter Your <span className="italic font-light text-slate-400">Identity</span></>
                    ) : (
                      <>Create Your <span className="italic font-light text-slate-400">Account</span></>
                    )}
                  </h2>
                  <p className="text-slate-500 font-medium text-sm">
                    {mode === 'signin' 
                      ? 'Enter your name to access your personal reservations.' 
                      : 'Choose a name to start managing your dining experiences.'}
                  </p>
                </div>

                {/* ── Form ── */}
                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="group">
                    <label className="label-text">Your Name</label>
                    <div className="relative">
                      <User className="absolute left-5 top-4.5 h-5 w-5 text-slate-600 group-focus-within:text-amber-500 transition-colors" />
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => { setName(e.target.value); setError(''); }}
                        placeholder={mode === 'signin' ? 'Enter your name...' : 'Choose a name...'}
                        className="input-field pl-14 py-5 text-lg font-medium"
                        autoFocus
                      />
                    </div>
                  </div>

                  {error && (
                    <div className="flex items-center gap-3 px-5 py-4 bg-red-500/10 border border-red-500/20 rounded-2xl animate-fade-in">
                      <div className="w-2 h-2 rounded-full bg-red-500 shrink-0" />
                      <p className="text-red-400 text-xs font-bold">{error}</p>
                    </div>
                  )}

                  <button 
                    type="submit" 
                    disabled={loading}
                    className="btn-primary w-full py-6 text-sm font-black uppercase tracking-[0.3em] shadow-[0_30px_60px_rgba(245,158,11,0.2)] group"
                  >
                    {loading ? (
                      <Loader className="animate-spin w-5 h-5 mr-3" />
                    ) : (
                      <ChevronRight className="w-5 h-5 mr-3 group-hover:translate-x-2 transition-transform" />
                    )}
                    {mode === 'signin' ? 'Access Dashboard' : 'Create Account'}
                  </button>
                </form>

                {/* ── Subtle Info ── */}
                <div className="mt-10 pt-8 border-t border-white/5 text-center">
                  <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em]">
                    {mode === 'signin' 
                      ? "Don't have an account? " 
                      : 'Already have one? '}
                    <button 
                      onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')} 
                      className="text-amber-500 hover:text-amber-400 transition-colors ml-1"
                    >
                      {mode === 'signin' ? 'Sign Up' : 'Sign In'}
                    </button>
                  </p>
                </div>

                {/* ── Trust Badges ── */}
                <div className="mt-8 flex items-center justify-center gap-8">
                  <div className="flex items-center gap-2 text-[9px] font-bold text-slate-700 uppercase tracking-widest">
                    <Star className="w-3 h-3 text-amber-500/40" />
                    No Password Needed
                  </div>
                  <div className="w-[1px] h-4 bg-white/5" />
                  <div className="flex items-center gap-2 text-[9px] font-bold text-slate-700 uppercase tracking-widest">
                    <Sparkles className="w-3 h-3 text-amber-500/40" />
                    Instant Access
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-12">
          <p className="text-[10px] font-black text-slate-700 uppercase tracking-[0.3em]">
            © {new Date().getFullYear()} Velora Systems · <span className="text-amber-500/40">Made by Jannat</span>
          </p>
        </div>
      </div>
    </div>
  );
}
