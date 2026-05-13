import { useEffect, useRef } from 'react';

/**
 * FloatingLines — animated flowing gradient lines background
 * Re-implemented to match the reactbits.dev FloatingLines API
 */
export default function FloatingLines({
  linesGradient = ['#E945F5', '#2F4BC0', '#E945F5'],
  animationSpeed = 1,
  interactive = true,
  bendRadius = 5,
  bendStrength = -0.5,
  mouseDamping = 0.05,
  parallax = true,
  parallaxStrength = 0.2,
  lineCount = 14,
  lineSpacing = 60,
  lineWidth = 1.5,
  opacity = 0.7,
}) {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const smoothMouseRef = useRef({ x: 0, y: 0 });
  const frameRef = useRef(null);
  const timeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };
    if (interactive) {
      canvas.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mousemove', handleMouseMove);
    }

    // Build gradient stops
    const buildGradient = (x0, y0, x1, y1) => {
      const g = ctx.createLinearGradient(x0, y0, x1, y1);
      linesGradient.forEach((color, i) => {
        g.addColorStop(i / (linesGradient.length - 1), color);
      });
      return g;
    };

    const draw = () => {
      timeRef.current += 0.008 * animationSpeed;
      const t = timeRef.current;
      const W = canvas.width;
      const H = canvas.height;

      // Smooth mouse interpolation (damping)
      smoothMouseRef.current.x +=
        (mouseRef.current.x - smoothMouseRef.current.x) * mouseDamping;
      smoothMouseRef.current.y +=
        (mouseRef.current.y - smoothMouseRef.current.y) * mouseDamping;

      ctx.clearRect(0, 0, W, H);

      const totalLines = lineCount;
      const spacing = H / (totalLines + 1);

      for (let li = 0; li < totalLines; li++) {
        const baseY = spacing * (li + 1);

        // Parallax offset — each line layer moves by a slightly different amount
        const layerDepth = li / totalLines; // 0 → 1
        const parallaxOffsetX = parallax
          ? ((smoothMouseRef.current.x - W / 2) / W) * parallaxStrength * 120 * layerDepth
          : 0;
        const parallaxOffsetY = parallax
          ? ((smoothMouseRef.current.y - H / 2) / H) * parallaxStrength * 40 * layerDepth
          : 0;

        ctx.beginPath();
        ctx.lineWidth = lineWidth + layerDepth * 0.8;
        ctx.globalAlpha = opacity * (0.5 + layerDepth * 0.5);

        // Build per-line gradient (shift hue slightly per line)
        const gradient = buildGradient(
          parallaxOffsetX,
          baseY + parallaxOffsetY,
          W + parallaxOffsetX,
          baseY + parallaxOffsetY
        );
        ctx.strokeStyle = gradient;

        // Draw the line as a smooth bezier path with sinusoidal flow
        const segments = 80;
        const phaseShift = li * (Math.PI * 2) / totalLines;

        for (let si = 0; si <= segments; si++) {
          const px = (si / segments) * W + parallaxOffsetX;

          // Base wave
          const wave1 = Math.sin(si / segments * Math.PI * bendRadius + t + phaseShift) * 28 * Math.abs(bendStrength);
          const wave2 = Math.sin(si / segments * Math.PI * (bendRadius * 0.6) + t * 1.3 + phaseShift * 1.5) * 14 * Math.abs(bendStrength);

          // Mouse bend interaction — lines curve toward/away from mouse
          let mouseBend = 0;
          if (interactive) {
            const mx = smoothMouseRef.current.x;
            const my = smoothMouseRef.current.y;
            const dist = Math.sqrt((px - mx) ** 2 + (baseY - my) ** 2);
            const influence = Math.max(0, 1 - dist / 220);
            mouseBend = influence * (my - baseY) * bendStrength * 0.6;
          }

          const py = baseY + parallaxOffsetY + wave1 + wave2 + mouseBend;

          if (si === 0) {
            ctx.moveTo(px, py);
          } else {
            ctx.lineTo(px, py);
          }
        }

        ctx.stroke();
      }

      ctx.globalAlpha = 1;
      frameRef.current = requestAnimationFrame(draw);
    };

    frameRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(frameRef.current);
      window.removeEventListener('resize', resize);
      if (interactive) {
        canvas.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mousemove', handleMouseMove);
      }
    };
  }, [linesGradient, animationSpeed, interactive, bendRadius, bendStrength, mouseDamping, parallax, parallaxStrength, lineCount, lineWidth, opacity]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        display: 'block',
        pointerEvents: interactive ? 'auto' : 'none',
      }}
    />
  );
}
