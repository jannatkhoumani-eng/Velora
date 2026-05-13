import { useState, useEffect } from 'react';
import { ArrowRight, CalendarPlus, Search, Map, PieChart, Moon, ShieldCheck, Zap, Sparkles, UtensilsCrossed, ChevronRight, PlayCircle, Star, Globe, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import Logo from '../components/Logo';

export default function LandingPage() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const features = [
    { icon: CalendarPlus, title: 'Concierge Logic', desc: 'Sophisticated capacity modeling that ensures every cover is a masterpiece of timing.' },
    { icon: Map, title: 'Architectural Layout', desc: 'Real-time interactive deployment of your floor space with cinematic precision.' },
    { icon: Search, title: 'Elite Discovery', desc: 'Identify VIP profiles and heritage reservation data with near-zero latency.' },
    { icon: PieChart, title: 'Strategic Insight', desc: 'Transform raw behavioral patterns into predictive operational intelligence.' },
    { icon: UtensilsCrossed, title: 'Optimized Pairing', desc: 'Smart algorithms that harmonize guest party size with the perfect floor position.' },
    { icon: Moon, title: 'Midnight Aesthetic', desc: 'A meticulously crafted premium dark interface designed for elite late-night service.' },
  ];

  return (
    <div className="min-h-screen bg-[#020617] text-white overflow-x-hidden selection:bg-amber-500/30">

      {/* ─── NAVIGATION ─────────────────────────────────────────────────── */}
      <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-700 px-8 lg:px-16 ${scrollY > 50 ? 'py-4 bg-[#020617]/90 backdrop-blur-3xl border-b border-white/5 shadow-2xl' : 'py-10 bg-transparent'}`}>
        <div className="max-w-[1800px] mx-auto flex items-center justify-between">
          <Link to="/" className="hover:scale-105 transition-transform duration-500">
            <Logo size="md" variant="light" />
          </Link>
          
          <div className="hidden lg:flex items-center space-x-16 text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">
            <a href="#menu" className="hover:text-amber-500 transition-colors">The Menu</a>
            <a href="#about" className="hover:text-amber-500 transition-colors">About</a>
            <a href="#experience" className="hover:text-amber-500 transition-colors">Experience</a>
            <a href="#contact" className="hover:text-amber-500 transition-colors">Contact</a>
          </div>

          <div className="flex items-center gap-8">
            <Link to="/dashboard" className="hidden md:block text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 hover:text-white transition-colors">
              Staff Portal
            </Link>
            <Link to="/add" className="px-10 py-4 bg-gradient-to-r from-amber-600 to-amber-500 text-slate-950 font-black text-[10px] uppercase tracking-[0.2em] rounded-full hover:shadow-[0_0_30px_rgba(245,158,11,0.3)] hover:-translate-y-0.5 transition-all">
              Book a Table
            </Link>
          </div>
        </div>
      </nav>

      {/* ─── CINEMATIC HERO SECTION ────────────────────────────────────── */}
      <section className="relative w-full h-screen min-h-[600px] flex flex-col justify-center items-center text-center px-6 overflow-hidden bg-black">
        
        {/* THE VIDEO (No complex classes, just direct CSS) */}
        <video 
          autoPlay 
          muted 
          loop 
          playsInline
          className="absolute top-0 left-0 w-full h-full object-cover z-0"
          style={{ opacity: 1, visibility: 'visible' }}
        >
          {/* Most reliable direct links */}
          <source src="https://player.vimeo.com/external/434045526.sd.mp4?s=c27dbed3077a163af1d484c31135767853100672&profile_id=164&oauth2_token_id=57447761" type="video/mp4" />
          <source src="https://vjs.zencdn.net/v/oceans.mp4" type="video/mp4" />
        </video>

        {/* OVERLAYS (Explicit z-index) */}
        <div className="absolute inset-0 z-10 bg-black/50 pointer-events-none"></div>
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/60 via-transparent to-black/80 pointer-events-none"></div>
        
        {/* HERO CONTENT (Explicitly High z-index) */}
        <div className="relative z-30 max-w-7xl mx-auto mt-20">
          <div className="inline-flex items-center px-8 py-3 rounded-full bg-white/5 backdrop-blur-2xl text-amber-500 font-black text-[10px] uppercase tracking-[0.5em] mb-12 border border-white/10 shadow-2xl animate-fade-in">
            <Sparkles className="w-4 h-4 mr-4 animate-pulse" />
            Premium Dining Experience
          </div>

          <h1 className="text-8xl md:text-[12rem] lg:text-[14rem] font-black tracking-tighter mb-6 leading-[0.75] animate-slide-up-slow" style={{ fontFamily: "'Playfair Display', serif" }}>
            <span className="text-gradient-gold block drop-shadow-[0_0_30px_rgba(0,0,0,0.5)]">Velora</span>
          </h1>

          <h2 className="text-2xl md:text-5xl lg:text-6xl font-light text-white mb-10 tracking-tight animate-slide-up-slow" style={{ animationDelay: '0.4s', fontFamily: "'Playfair Display', serif" }}>
            Where Dining Becomes an <span className="italic text-slate-400">Experience</span>.
          </h2>

          <p className="text-lg md:text-xl text-slate-400 mb-16 max-w-3xl mx-auto leading-relaxed font-medium animate-fade-in-slow px-4" style={{ animationDelay: '0.8s' }}>
            A premium restaurant reservation experience with elegance, atmosphere, and effortless booking. Transition your evening into the extraordinary.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-10 animate-fade-in" style={{ animationDelay: '1s' }}>
            <Link to="/add" className="btn-primary py-6 px-16 text-xs shadow-[0_20px_60px_rgba(245,158,11,0.25)] group">
              Book a Table <ArrowRight className="w-5 h-5 ml-4 group-hover:translate-x-2 transition-transform" />
            </Link>
            <a href="#experience" className="flex items-center gap-4 text-[11px] font-black uppercase tracking-[0.3em] text-white hover:text-amber-500 transition-all group">
              <div className="w-14 h-14 rounded-full border border-white/20 flex items-center justify-center group-hover:border-amber-500 transition-all">
                <PlayCircle className="w-6 h-6" />
              </div>
              Explore Experience
            </a>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 animate-bounce opacity-40 z-30">
          <ChevronDown className="w-5 h-5" />
        </div>
      </section>

      {/* ─── REST OF THE PAGE ──────────────────────────────────────────── */}
      <div className="relative z-10 bg-[#020617]">
        
        {/* Features Section */}
        <section id="experience" className="py-40 px-8 container mx-auto">
          <div className="text-center mb-32 max-w-3xl mx-auto">
            <h2 className="text-5xl md:text-7xl font-black mb-8 tracking-tighter" style={{ fontFamily: "'Playfair Display', serif" }}>
              Velora <span className="text-gradient-gold italic font-light">Technology</span>
            </h2>
            <p className="text-slate-500 text-lg font-medium">Sophisticated infrastructure for the world's most discerning establishments.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((f, i) => (
              <div key={i} className="glass-card group hover:scale-[1.02]">
                <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-10 group-hover:bg-amber-500 group-hover:text-slate-950 transition-all duration-500">
                  <f.icon className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-black mb-4 tracking-tight text-white group-hover:text-amber-500 transition-colors">{f.title}</h3>
                <p className="text-slate-500 leading-relaxed font-medium">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Visual Gallery / Experience */}
        <section className="py-40 bg-slate-950/40 border-y border-white/5">
          <div className="container mx-auto px-8">
            <div className="flex flex-col lg:flex-row items-center gap-20">
              <div className="lg:w-1/2 space-y-10">
                <div className="w-16 h-[1px] bg-amber-500"></div>
                <h2 className="text-5xl md:text-8xl font-black tracking-tighter leading-[0.9] text-white" style={{ fontFamily: "'Playfair Display', serif" }}>
                  The <span className="text-gradient-gold italic font-light">Atmosphere</span> <br/>
                  of Excellence.
                </h2>
                <p className="text-xl text-slate-400 font-medium leading-relaxed max-w-xl">
                  Every reservation is a commitment to a standard of service that transcends the ordinary. Our platform ensures that the digital gateway matches the physical excellence of your floor.
                </p>
                <div className="flex items-center gap-10 pt-6">
                  <div className="text-center">
                    <p className="text-4xl font-black text-white mb-2">99.9%</p>
                    <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Uptime Precision</p>
                  </div>
                  <div className="w-[1px] h-12 bg-white/10"></div>
                  <div className="text-center">
                    <p className="text-4xl font-black text-white mb-2">24/7</p>
                    <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Elite Support</p>
                  </div>
                </div>
              </div>
              <div className="lg:w-1/2 grid grid-cols-2 gap-6 relative">
                <div className="absolute inset-0 bg-amber-500/5 blur-[120px] rounded-full"></div>
                <img src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=2070&auto=format&fit=crop" className="rounded-[2.5rem] shadow-2xl relative z-10 translate-y-12" alt="Interior" />
                <img src="https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=1974&auto=format&fit=crop" className="rounded-[2.5rem] shadow-2xl relative z-10" alt="Detail" />
              </div>
            </div>
          </div>
        </section>

        {/* Footer CTA */}
        <section className="py-60 px-6 text-center relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-amber-500/5 rounded-full blur-[160px] pointer-events-none"></div>
          <div className="container mx-auto relative z-10">
            <h2 className="text-5xl md:text-[8rem] font-black mb-12 tracking-tighter text-white" style={{ fontFamily: "'Playfair Display', serif" }}>
              Join the <span className="text-gradient-gold italic font-light">Elite</span>.
            </h2>
            <p className="text-xl md:text-2xl text-slate-500 mb-16 max-w-3xl mx-auto font-medium leading-relaxed">
              Transition your operations to the future of restaurant technology. <br className="hidden md:block"/>
              The Velora ecosystem is ready for your deployment.
            </p>
            <Link to="/dashboard" className="btn-primary py-6 px-20">
              Initialize Dashboard <ChevronRight className="w-5 h-5 ml-4" />
            </Link>
          </div>
        </section>

      </div>

      <footer className="py-12 border-t border-white/5 bg-[#020617] relative z-10">
        <div className="container mx-auto px-8 flex flex-col md:flex-row items-center justify-between gap-8 text-slate-600 font-black text-[10px] uppercase tracking-widest">
          <div className="flex items-center gap-4">
            <Logo size="sm" variant="light" />
            <span>&copy; {new Date().getFullYear()} VELORA SYSTEMS. ALL RIGHTS RESERVED. <br className="md:hidden" /><span className="text-amber-500">MADE BY JANNAT</span>.</span>
          </div>
          <div className="flex items-center gap-12">
            <a href="#" className="hover:text-white transition-colors">Security</a>
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Legal</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
