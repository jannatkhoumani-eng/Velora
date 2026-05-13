/**
 * Velora — Premium Restaurant Reservation Platform
 * SVG emblem: fork (left arm) + knife (right arm) forming a stylized V
 * Minimal · Elegant · Luxury
 */
export default function Logo({ size = 'md', variant = 'default' }) {
  // size: 'sm' | 'md' | 'lg'
  // variant: 'default' (dark bg) | 'light' (sidebar, adapts to dark/light mode)

  const dims = {
    sm: { icon: 38, brandSize: 'text-[17px]', tagSize: 'text-[9px]' },
    md: { icon: 46, brandSize: 'text-xl',     tagSize: 'text-[10px]' },
    lg: { icon: 58, brandSize: 'text-3xl',    tagSize: 'text-xs' },
  }[size] ?? { icon: 46, brandSize: 'text-xl', tagSize: 'text-[10px]' };

  return (
    <div className="flex items-center gap-3 group cursor-pointer select-none">

      {/* ─── SVG V Emblem ─────────────────────────────────────────── */}
      <div
        className="relative flex-shrink-0 transition-all duration-500
                   group-hover:scale-110
                   group-hover:drop-shadow-[0_0_14px_rgba(245,158,11,0.65)]"
        style={{ width: dims.icon, height: dims.icon }}
      >
        <svg
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          width={dims.icon}
          height={dims.icon}
        >
          {/* ── Outer ring ── */}
          <circle cx="24" cy="24" r="22.5"
            fill="#0B0F1A"
            stroke="url(#vRing)"
            strokeWidth="1.4"
          />

          {/* ── Subtle inner glow arc ── */}
          <circle cx="24" cy="24" r="19"
            fill="none"
            stroke="rgba(245,158,11,0.06)"
            strokeWidth="0.6"
          />

          {/* ══ FORK — left arm of the V ══ */}
          {/* Tine 1 */}
          <line x1="12.5" y1="10" x2="12.5" y2="17"
            stroke="url(#vGold)" strokeWidth="1.5" strokeLinecap="round"/>
          {/* Tine 2 (center) */}
          <line x1="15.5" y1="10" x2="15.5" y2="17"
            stroke="url(#vGold)" strokeWidth="1.5" strokeLinecap="round"/>
          {/* Tine 3 */}
          <line x1="18.5" y1="10" x2="18.5" y2="17"
            stroke="url(#vGold)" strokeWidth="1.5" strokeLinecap="round"/>
          {/* Fork neck joining tines to stem */}
          <path d="M12.5 17 Q15.5 18.5 15.5 20"
            stroke="url(#vGold)" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
          {/* Fork stem → left arm of V */}
          <line x1="15.5" y1="20" x2="24" y2="39"
            stroke="url(#vGold)" strokeWidth="2.2" strokeLinecap="round"/>

          {/* ══ KNIFE — right arm of the V ══ */}
          {/* Knife blade (slightly tapered look via strokeWidth) */}
          <line x1="35.5" y1="10" x2="24" y2="39"
            stroke="url(#vGold)" strokeWidth="2.0" strokeLinecap="round"/>
          {/* Guard / bolster – small horizontal accent */}
          <line x1="31.2" y1="17" x2="38.2" y2="17"
            stroke="url(#vGoldBright)" strokeWidth="1.3" strokeLinecap="round"/>
          {/* Spine detail — slightly thinner line along blade back */}
          <line x1="34.8" y1="12" x2="24.6" y2="37"
            stroke="rgba(245,158,11,0.18)" strokeWidth="0.7" strokeLinecap="round"/>

          {/* ─── Gradient Defs ─── */}
          <defs>
            <linearGradient id="vGold" x1="0" y1="0" x2="0.3" y2="1">
              <stop offset="0%"   stopColor="#FDE68A"/>
              <stop offset="55%"  stopColor="#F59E0B"/>
              <stop offset="100%" stopColor="#B45309"/>
            </linearGradient>
            <linearGradient id="vGoldBright" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%"   stopColor="#FDE68A"/>
              <stop offset="100%" stopColor="#F59E0B"/>
            </linearGradient>
            <linearGradient id="vRing" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%"   stopColor="#F59E0B" stopOpacity="0.85"/>
              <stop offset="40%"  stopColor="#FCD34D" stopOpacity="0.45"/>
              <stop offset="100%" stopColor="#B45309" stopOpacity="0.9"/>
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* ─── Brand Text ───────────────────────────────────────────── */}
      <div className="flex flex-col leading-none">
        <span
          className={`${dims.brandSize} font-bold tracking-wide transition-all duration-300 text-gradient-gold`}
          style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            letterSpacing: '0.04em',
          }}
        >
          Velora
        </span>
        <span
          className={`${dims.tagSize} font-semibold tracking-[0.18em] uppercase mt-1`}
          style={{
            color: variant === 'light'
              ? 'var(--velora-sub-light, #94a3b8)'
              : 'rgba(255,255,255,0.45)',
            fontFamily: "'Inter', sans-serif",
          }}
        >
          RestoAdmin
        </span>
      </div>

    </div>
  );
}
