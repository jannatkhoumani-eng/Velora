import { useState, useRef, useEffect } from 'react';
import { Music, Volume2, VolumeX, Play, Pause, X, Sliders, CheckCircle, AlertCircle } from 'lucide-react';

export default function AmbiencePlayer() {
  const [isOpen, setIsOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.01);
  
  const audioRef = useRef(null);
  const fadeIntervalRef = useRef(null);

  useEffect(() => {
    // 1. Force the audio object creation
    if (!audioRef.current) {
      audioRef.current = new Audio("/audio/a-thousand-years.mp3");
      audioRef.current.loop = true;
      audioRef.current.currentTime = 70; // 1:10
      audioRef.current.volume = 0.01;
    }

    const forceStart = () => {
      if (audioRef.current && audioRef.current.paused) {
        audioRef.current.play()
          .then(() => {
            console.log("VELORA: Audio Autoplay Success");
            setIsPlaying(true);
            startFadeIn();
            removeForceListeners();
          })
          .catch(() => {
            // Browsers block unmuted autoplay without a gesture.
            // This is a physical security limit of the browser.
          });
      }
    };

    const removeForceListeners = () => {
      window.removeEventListener('mousemove', forceStart);
      window.removeEventListener('scroll', forceStart);
      window.removeEventListener('mousedown', forceStart);
      window.removeEventListener('click', forceStart);
      window.removeEventListener('touchstart', forceStart);
      window.removeEventListener('keydown', forceStart);
    };

    // Attempt to play on mount (rarely works but we try)
    forceStart();

    // Aggressive listeners - the MOMENT anything happens, the music starts.
    window.addEventListener('mousemove', forceStart, { once: true });
    window.addEventListener('scroll', forceStart, { once: true });
    window.addEventListener('mousedown', forceStart, { once: true });
    window.addEventListener('click', forceStart, { once: true });
    window.addEventListener('touchstart', forceStart, { once: true });
    window.addEventListener('keydown', forceStart, { once: true });

    return () => removeForceListeners();
  }, []);

  const startFadeIn = () => {
    if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);
    let currentVol = 0.01;
    fadeIntervalRef.current = setInterval(() => {
      currentVol += 0.005;
      if (currentVol >= 0.15) {
        currentVol = 0.15;
        clearInterval(fadeIntervalRef.current);
      }
      setVolume(currentVol);
      if (audioRef.current) audioRef.current.volume = currentVol;
    }, 100);
  };

  const toggleAmbience = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
      setVolume(0.15);
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-8 left-8 z-[60] p-4 rounded-2xl border transition-all duration-500 group shadow-2xl backdrop-blur-xl
          ${isPlaying 
            ? 'bg-amber-500/20 border-amber-500/30 text-amber-500 animate-pulse' 
            : 'bg-slate-900/80 border-white/5 text-slate-400 hover:text-white hover:border-white/10'
          }`}
      >
        <Music className={`w-6 h-6 ${isPlaying ? 'animate-spin-slow' : 'group-hover:scale-110 transition-transform'}`} />
        {isPlaying && (
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-[#0B1120]"></span>
        )}
      </button>

      <div className={`fixed bottom-8 left-8 z-[70] w-80 bg-[#111827]/95 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] shadow-[0_50px_100px_rgba(0,0,0,0.6)] p-8 transition-all duration-700 ease-out transform
        ${isOpen ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-20 opacity-0 scale-90 pointer-events-none'}`}>
        
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-sm font-black text-white uppercase tracking-widest">Ambience</h3>
            <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-1 italic">
              {isPlaying ? "Playing Romantic Piano" : "Cinematic Mode Active"}
            </p>
          </div>
          <button onClick={() => setIsOpen(false)} className="p-2 text-slate-500 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-6">
          <button 
            onClick={toggleAmbience}
            className={`w-full py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-4
              ${isPlaying 
                ? 'bg-amber-500 text-slate-950 shadow-[0_10px_30px_rgba(245,158,11,0.3)]' 
                : 'bg-white/5 text-white border border-white/10 hover:bg-white/10'
              }`}
          >
            {isPlaying ? "Ambience OFF" : "Ambience ON"}
          </button>

          <div className="pt-4 border-t border-white/5">
            <div className="flex items-center justify-between text-slate-500 mb-4">
              <span className="text-[9px] font-black uppercase tracking-widest">Atmosphere</span>
              <span className="text-[10px] font-black tracking-widest">{Math.round(volume * 100)}%</span>
            </div>
            <input 
              type="range" min="0" max="1" step="0.01" value={volume}
              onChange={(e) => {
                const v = parseFloat(e.target.value);
                setVolume(v);
                if (audioRef.current) audioRef.current.volume = v;
              }}
              className="w-full h-1 bg-white/10 rounded-full appearance-none cursor-pointer accent-amber-500"
            />
          </div>
        </div>
      </div>
    </>
  );
}
