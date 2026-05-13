/**
 * MouseGlow — Premium cursor-follow glow effect
 *
 * Layers:
 *  1. Large outer soft-blue radial glow  (slow lerp, follows cursor)
 *  2. Small inner gold accent glow       (fast lerp, tighter follow)
 *  3. Very large bg spotlight            (very slow, ambient lighting)
 *
 * Card tilt:
 *  - Global mousemove queries `.glass-card` elements
 *  - Applies subtle 3-D perspective tilt + dynamic border glow
 *  - Resets smoothly on mouse-leave
 *
 * Pure DOM / rAF — zero React state, zero re-renders.
 */
import { useEffect, useRef } from 'react';

const lerp = (a, b, t) => a + (b - a) * t;

export default function MouseGlow() {
  const outerRef = useRef(null);
  const innerRef = useRef(null);
  const bgRef    = useRef(null);

  /* live target (updated on every mousemove) */
  const target = useRef({ x: -800, y: -800 });
  /* interpolated positions for each layer */
  const outerPos = useRef({ x: -800, y: -800 });
  const innerPos = useRef({ x: -200, y: -200 });
  const bgPos    = useRef({ x: -800, y: -800 });
  const rafRef   = useRef(null);

  useEffect(() => {
    /* ── Mouse move handler ── */
    const onMove = (e) => {
      target.current = { x: e.clientX, y: e.clientY };

      /* ── Card tilt ── */
      const cards = document.querySelectorAll('.glass-card');
      cards.forEach((card) => {
        const rect   = card.getBoundingClientRect();
        const inside =
          e.clientX >= rect.left && e.clientX <= rect.right &&
          e.clientY >= rect.top  && e.clientY <= rect.bottom;

        if (inside) {
          /* normalised position within card:  -0.5 → +0.5 */
          const nx = (e.clientX - rect.left) / rect.width  - 0.5;
          const ny = (e.clientY - rect.top)  / rect.height - 0.5;
          const rx = (-ny * 6).toFixed(2);          /* pitch */
          const ry = ( nx * 6).toFixed(2);          /* yaw   */

          /* subtle border highlight based on cursor quadrant */
          const borderAlpha = (Math.abs(nx) * Math.abs(ny) * 0.35 + 0.07).toFixed(3);

          card.style.transition = 'box-shadow 0.1s ease';
          card.style.transform  =
            `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(5px)`;
          card.style.boxShadow  = `
            ${(-ry * 2.5)}px ${(rx * 2.5)}px 28px rgba(0,0,0,0.18),
            0 0 0 1px rgba(245,158,11,${borderAlpha})
          `;
        } else {
          /* smooth reset */
          card.style.transition = 'transform 0.55s ease, box-shadow 0.55s ease';
          card.style.transform  = '';
          card.style.boxShadow  = '';
        }
      });
    };

    /* ── Animation loop (lerp all three layers) ── */
    const tick = () => {
      const tx = target.current.x;
      const ty = target.current.y;

      /* outer blue glow — slow, dreamy */
      outerPos.current.x = lerp(outerPos.current.x, tx, 0.055);
      outerPos.current.y = lerp(outerPos.current.y, ty, 0.055);

      /* inner gold accent — faster, more reactive */
      innerPos.current.x = lerp(innerPos.current.x, tx, 0.13);
      innerPos.current.y = lerp(innerPos.current.y, ty, 0.13);

      /* bg spotlight — very slow, ambient */
      bgPos.current.x = lerp(bgPos.current.x, tx, 0.025);
      bgPos.current.y = lerp(bgPos.current.y, ty, 0.025);

      if (outerRef.current) {
        const ox = outerPos.current.x - 300;
        const oy = outerPos.current.y - 300;
        outerRef.current.style.transform = `translate(${ox}px,${oy}px)`;
      }
      if (innerRef.current) {
        const ix = innerPos.current.x - 80;
        const iy = innerPos.current.y - 80;
        innerRef.current.style.transform = `translate(${ix}px,${iy}px)`;
      }
      if (bgRef.current) {
        const bx = bgPos.current.x - 600;
        const by = bgPos.current.y - 600;
        bgRef.current.style.transform = `translate(${bx}px,${by}px)`;
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    document.addEventListener('mousemove', onMove, { passive: true });
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      document.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const shared = {
    position: 'fixed',
    top: 0,
    left: 0,
    borderRadius: '50%',
    pointerEvents: 'none',
  };

  return (
    <>
      {/* ── 1. Background ambient spotlight ── */}
      <div
        ref={bgRef}
        aria-hidden="true"
        style={{
          ...shared,
          width: '1200px',
          height: '1200px',
          background:
            'radial-gradient(circle, rgba(59,130,246,0.022) 0%, rgba(59,130,246,0.008) 45%, transparent 65%)',
          filter: 'blur(80px)',
          zIndex: 0,
          willChange: 'transform',
        }}
      />

      {/* ── 2. Outer soft blue cursor glow ── */}
      <div
        ref={outerRef}
        aria-hidden="true"
        style={{
          ...shared,
          width: '600px',
          height: '600px',
          background:
            'radial-gradient(circle, rgba(59,130,246,0.09) 0%, rgba(59,130,246,0.03) 40%, transparent 70%)',
          filter: 'blur(28px)',
          zIndex: 9990,
          willChange: 'transform',
        }}
      />

      {/* ── 3. Inner gold accent ── */}
      <div
        ref={innerRef}
        aria-hidden="true"
        style={{
          ...shared,
          width: '160px',
          height: '160px',
          background:
            'radial-gradient(circle, rgba(245,158,11,0.14) 0%, rgba(245,158,11,0.04) 55%, transparent 75%)',
          filter: 'blur(10px)',
          zIndex: 9991,
          willChange: 'transform',
        }}
      />
    </>
  );
}
