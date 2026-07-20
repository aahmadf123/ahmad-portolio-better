'use client';

import React, { useEffect, useRef } from 'react';
import { gsap } from '@/lib/motion/gsap';

const ROUTES = [
  { id: 'r1', d: 'M 120 300 v -90 l 70 -60', color: 'var(--primary)', delay: 0 },
  { id: 'r2', d: 'M 260 300 v -60 l -50 -50 l 70 -70', color: 'var(--gold)', delay: 0.15 },
  { id: 'r3', d: 'M 400 300 v -110 l 80 -50', color: 'var(--sky)', delay: 0.3 },
];

/**
 * SVG football play: routes stroke-draw in, player dots run the routes on a
 * loop (MotionPathPlugin), tracking boxes pulse. Reduced motion renders the
 * completed play statically.
 */
export function PlayDiagram({ loop = true }: { loop?: boolean }) {
  const ref = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svg = ref.current;
    if (!svg) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ repeat: loop ? -1 : 0, repeatDelay: 2 });
      ROUTES.forEach((r) => {
        const path = svg.querySelector<SVGPathElement>(`#${r.id}`);
        const dot = svg.querySelector<SVGGElement>(`#${r.id}-dot`);
        if (!path || !dot) return;
        const len = path.getTotalLength();
        gsap.set(path, { strokeDasharray: `${len}`, strokeDashoffset: len });
        tl.to(path, { strokeDashoffset: 0, duration: 0.9, ease: 'power1.inOut' }, r.delay);
        tl.to(
          dot,
          {
            motionPath: { path, align: path, alignOrigin: [0.5, 0.5] },
            duration: 1.6,
            ease: 'power1.inOut',
          },
          r.delay + 0.25
        );
      });
      tl.to({}, { duration: 0.8 });
    }, svg);

    return () => ctx.revert();
  }, [loop]);

  return (
    <svg ref={ref} viewBox="0 0 560 340" fill="none" aria-label="Animated football play diagram" role="img" style={{ width: '100%', height: 'auto', display: 'block' }}>
      {/* field */}
      <rect x="20" y="16" width="520" height="308" rx="8" stroke="rgba(45,212,191,0.35)" strokeWidth="1.4" />
      {[0, 1, 2, 3, 4, 5, 6].map((i) => (
        <line key={i} x1={20} y1={60 + i * 38} x2={540} y2={60 + i * 38} stroke="rgba(45,212,191,0.14)" strokeWidth="1" />
      ))}
      {[0, 1, 2, 3, 4, 5, 6].map((i) => (
        <g key={`h${i}`} stroke="rgba(45,212,191,0.25)" strokeWidth="1">
          <line x1={200} y1={56 + i * 38} x2={200} y2={64 + i * 38} />
          <line x1={360} y1={56 + i * 38} x2={360} y2={64 + i * 38} />
        </g>
      ))}
      {/* line of scrimmage */}
      <line x1="20" y1="300" x2="540" y2="300" stroke="rgba(244,244,242,0.4)" strokeWidth="1.6" strokeDasharray="10 6" />

      {/* routes */}
      {ROUTES.map((r) => (
        <path key={r.id} id={r.id} d={r.d} stroke={r.color} strokeWidth="2" strokeDasharray="6 7" opacity="0.85" />
      ))}

      {/* offensive line */}
      {[190, 225, 295, 330].map((x) => (
        <circle key={x} cx={x} cy={300} r="7" fill="rgba(244,244,242,0.5)" />
      ))}
      <rect x="253" y="293" width="14" height="14" fill="none" stroke="rgba(244,244,242,0.7)" strokeWidth="1.6" />

      {/* skill players with tracking boxes */}
      {ROUTES.map((r) => {
        const startX = Number(r.d.split(' ')[1]);
        return (
          <g key={`${r.id}-dot`} id={`${r.id}-dot`} transform={`translate(${startX} 300)`}>
            <rect x="-14" y="-14" width="28" height="28" stroke={r.color} strokeWidth="1.1" strokeDasharray="4 4" opacity="0.55" className="pd-box" />
            <circle r="8" fill={r.color} />
          </g>
        );
      })}

      {/* confidence labels */}
      <text x="52" y="150" fill="var(--primary)" opacity="0.75" fontSize="11" fontFamily="var(--font-code), monospace">WR·0.94</text>
      <text x="470" y="120" fill="var(--gold)" opacity="0.75" fontSize="11" fontFamily="var(--font-code), monospace">TE·0.89</text>

      <style>{`
        @media (prefers-reduced-motion: no-preference) {
          .pd-box { animation: pd-pulse 2.2s ease-in-out infinite; }
        }
        @keyframes pd-pulse { 0%,100% { opacity: 0.55; } 50% { opacity: 0.2; } }
      `}</style>
    </svg>
  );
}
