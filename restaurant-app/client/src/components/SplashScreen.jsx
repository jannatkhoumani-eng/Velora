import { useEffect, useState } from 'react';
import Logo from './Logo';

export default function SplashScreen({ onFinish }) {
  const [stage, setStage] = useState(0); // 0: start, 1: glow, 2: logo/text, 3: finish

  useEffect(() => {
    // Stage 1: Golden light appears
    const t1 = setTimeout(() => setStage(1), 400);
    // Stage 2: Logo and brand text reveal
    const t2 = setTimeout(() => setStage(2), 1200);
    // Stage 3: Transition out
    const t3 = setTimeout(() => setStage(3), 3800);
    // Finish
    const t4 = setTimeout(() => onFinish(), 4500);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [onFinish]);

  return (
    <div className={`fixed inset-0 z-[1000] bg-[#0B1120] flex items-center justify-center transition-opacity duration-1000 ease-in-out ${stage === 3 ? 'opacity-0 scale-110' : 'opacity-100'}`}>
      
      {/* ─── CINEMATIC BACKGROUND ────────────────────────────────────── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Animated Wave Lines (Subtle) */}
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M0 50 Q 25 45, 50 50 T 100 50" stroke="#F59E0B" strokeWidth="0.1" fill="none" className="animate-pulse" />
            <path d="M0 55 Q 25 50, 50 55 T 100 55" stroke="#3B82F6" strokeWidth="0.1" fill="none" className="animate-pulse" style={{ animationDelay: '1s' }} />
          </svg>
        </div>
        
        {/* Soft Golden Glow center */}
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[100px] transition-all duration-1000 ${stage >= 1 ? 'scale-150 opacity-100' : 'scale-50 opacity-0'}`}></div>
        
        {/* Moving Particles */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <div 
              key={i}
              className="absolute w-1 h-1 bg-amber-500/20 rounded-full animate-pulse"
              style={{ 
                top: `${Math.random() * 100}%`, 
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${2 + Math.random() * 3}s`
              }}
            ></div>
          ))}
        </div>
      </div>

      {/* ─── CENTER BRAND REVEAL ─────────────────────────────────────── */}
      <div className="relative z-10 flex flex-col items-center">
        
        {/* Logo Container with Scale-up & Glow */}
        <div className={`transition-all duration-[1200ms] cubic-bezier(0.16, 1, 0.3, 1) ${stage >= 2 ? 'scale-100 opacity-100 translate-y-0' : 'scale-50 opacity-0 translate-y-10'}`}>
          <div className="relative group">
            {/* Pulsing ring around logo */}
            <div className="absolute -inset-8 rounded-full bg-amber-500/5 animate-pulse blur-2xl"></div>
            <div className="bg-[#111827] p-12 rounded-[3.5rem] shadow-[0_40px_100px_rgba(0,0,0,0.8)] border border-white/5 relative z-10">
              <Logo size="lg" variant="light" />
            </div>
          </div>
        </div>

        {/* Brand Text & Subtitle */}
        <div className="mt-14 text-center">
          <div className="overflow-hidden">
            <h1 className={`text-6xl md:text-[5.5rem] font-black tracking-tighter text-gradient-gold transition-all duration-[1000ms] ease-out transform ${stage >= 2 ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`} style={{ fontFamily: "'Playfair Display', serif" }}>
              Velora
            </h1>
          </div>
          
          {/* Animated Gold Line */}
          <div className={`h-[1px] bg-gradient-to-r from-transparent via-amber-500 to-transparent mx-auto transition-all duration-[1500ms] delay-500 ${stage >= 2 ? 'w-48 opacity-40' : 'w-0 opacity-0'}`}></div>

          <p className={`text-[11px] font-black text-slate-500 uppercase tracking-[0.6em] mt-8 transition-all duration-1000 delay-700 transform ${stage >= 2 ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'}`}>
            Elegance <span className="italic font-light">Automated</span>.
          </p>
        </div>
      </div>

      {/* ─── SKIP BUTTON ─────────────────────────────────────────────── */}
      <button 
        onClick={onFinish}
        className="absolute bottom-12 right-12 px-6 py-2.5 rounded-full bg-white/5 border border-white/5 text-[9px] font-black text-slate-500 uppercase tracking-widest hover:bg-white/10 hover:text-white transition-all group z-[1100]"
      >
        Skip Intro
        <span className="inline-block ml-2 group-hover:translate-x-1 transition-transform">→</span>
      </button>

      {/* Loading Bar at bottom */}
      <div className="absolute bottom-0 left-0 h-[2px] bg-amber-500/30 transition-all duration-[4500ms] ease-linear" style={{ width: stage === 3 ? '100%' : '0%' }}></div>

    </div>
  );
}
