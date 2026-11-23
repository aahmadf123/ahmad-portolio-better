'use client';

import React from 'react';
import Link from 'next/link';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { useMagnetic } from '@/components/ui/use-magnetic';
import { AREA_COLORS } from '@/lib/data/areas';

/*
 * The first screen: one thin flight path loops across the page and touches the three
 * kinds of work. The path is drawn in a 1440×900 box stretched to the viewport
 * (preserveAspectRatio="none" + a non-scaling stroke keep the line 1px everywhere), so a
 * point (x, y) in that box sits at (x/1440, y/900) of the hero. Nodes are vertices of the
 * path; their labels are HTML links placed at those percentages.
 */
const W = 1440;
const H = 900;
const PATH = [
  'M 1520 110',
  'C 1160 40, 680 14, 430 34',
  'C 170 56, 40 180, 70 320',
  'C 100 470, 200 650, 300 800',
  'C 320 850, 250 800, 220 700',
  'C 190 600, 220 520, 300 470',
  'C 460 440, 720 430, 700 330',
  'C 680 236, 430 232, 404 292',
  'C 380 356, 560 420, 700 438',
  'C 820 452, 900 400, 940 340',
  'L 1140 190',
  'C 1260 100, 1400 40, 1520 -10',
].join(' ');

export const NODES = [
  { id: 'agentic-ai', label: 'Agentic AI', x: 940, y: 340, href: '#path-agentic-ai', color: AREA_COLORS['ai-engineering'] },
  { id: 'uav-research', label: 'UAV Research', x: 1140, y: 190, href: '#path-uav-research', color: AREA_COLORS.research },
  { id: 'sports-analytics', label: 'Sports Analytics', x: 300, y: 800, href: '#path-sports-analytics', color: AREA_COLORS['sports-analytics'] },
] as const;

const pct = (v: number, of: number) => `${(v / of) * 100}%`;

export function FlightPathHero() {
  const heroRef = React.useRef<HTMLElement>(null);
  const pathRef = React.useRef<SVGPathElement>(null);
  const maskId = `fp-reveal-${React.useId().replace(/:/g, '')}`;
  const dotRef = React.useRef<HTMLSpanElement>(null);
  const [near, setNear] = React.useState<string>('agentic-ai');
  const exploreRef = useMagnetic<HTMLAnchorElement>(8);

  React.useEffect(() => {
    const hero = heroRef.current;
    const path = pathRef.current;
    const dot = dotRef.current;
    if (!hero || !path || !dot) return;

    const total = path.getTotalLength();
    // Where each node sits along the path (nearest sampled point), so the dot can
    // light the node it is passing.
    const samples = 600;
    const nodeAt = NODES.map((n) => {
      let best = 0;
      let bestD = Infinity;
      for (let i = 0; i <= samples; i++) {
        const p = path.getPointAtLength((i / samples) * total);
        const d = (p.x - n.x) ** 2 + (p.y - n.y) ** 2;
        if (d < bestD) { bestD = d; best = i / samples; }
      }
      return { id: n.id, at: best };
    });

    const place = (t: number) => {
      const p = path.getPointAtLength(t * total);
      dot.style.left = pct(p.x, W);
      dot.style.top = pct(p.y, H);
      let current = '';
      for (const n of nodeAt) if (Math.abs(n.at - t) < 0.035) current = n.id;
      if (current) setNear((prev) => (prev === current ? prev : current));
    };

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    const agentic = nodeAt.find((n) => n.id === 'agentic-ai')!.at;
    if (reduce.matches) {
      place(agentic);
      return;
    }

    // One pass takes 28s; the first starts after the line has drawn itself.
    const PERIOD = 28000;
    let start = performance.now() + 1400;
    let raf = 0;
    let visible = true;
    let pausedAt = 0;

    const tick = (now: number) => {
      raf = 0;
      if (!visible || document.hidden) return;
      const t = Math.max(0, now - start) / PERIOD;
      place(t % 1);
      raf = requestAnimationFrame(tick);
    };
    const resume = () => {
      if (raf || !visible || document.hidden) return;
      if (pausedAt) { start += performance.now() - pausedAt; pausedAt = 0; }
      raf = requestAnimationFrame(tick);
    };
    const pause = () => {
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
      if (!pausedAt) pausedAt = performance.now();
    };

    place(0);
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible) resume(); else pause();
    });
    io.observe(hero);
    const onVis = () => (document.hidden ? pause() : resume());
    document.addEventListener('visibilitychange', onVis);
    resume();
    return () => {
      io.disconnect();
      document.removeEventListener('visibilitychange', onVis);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section ref={heroRef} id="hero" tabIndex={-1} aria-labelledby="hero-title" className="fp-hero">
      <div className="fp-art" aria-hidden>
        <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="fp-svg">
          {/* The line draws itself through a mask: the visible stroke is non-scaling (1px at
              any size), and dashes on a non-scaling stroke are measured in screen pixels, so
              a normalised dash would end early on wide screens. The mask's thick stroke scales
              normally, so its pathLength=1 dash always covers the whole line. */}
          <defs>
            <mask id={maskId} maskUnits="userSpaceOnUse" x={-200} y={-200} width={W + 400} height={H + 400}>
              <path d={PATH} pathLength={1} className="fp-reveal" />
            </mask>
          </defs>
          <path ref={pathRef} d={PATH} className="fp-path" mask={`url(#${maskId})`} />
        </svg>
        <span ref={dotRef} className="fp-dot" style={{ background: NODES.find((n) => n.id === near)?.color }} />
      </div>

      <SiteHeader />

      <ul className="fp-nodes" aria-label="Three kinds of work">
        {NODES.map((n) => (
          <li key={n.id} style={{ left: pct(n.x, W), top: pct(n.y, H), '--area': n.color } as React.CSSProperties} data-near={near === n.id || undefined}>
            <a href={n.href} className="fp-node">
              <span aria-hidden className="fp-node-dot" />
              <span>{n.label}</span>
            </a>
          </li>
        ))}
      </ul>

      <div className="fp-copy">
        <h1 id="hero-title" className="fp-title">AI systems for<br />uncertain environments</h1>
      </div>

      <Link ref={exploreRef} href="#work" className="fp-explore">
        <span>Explore the work</span>
        <span aria-hidden>↓</span>
      </Link>

      <style>{`
        .fp-hero { position: relative; min-height: max(100svh, 640px); display: flex; flex-direction: column; overflow: hidden; isolation: isolate; }
        .fp-art { position: absolute; inset: 0; z-index: -1; pointer-events: none; }
        .fp-svg { position: absolute; inset: 0; width: 100%; height: 100%; max-width: none; overflow: visible; }
        .fp-path { fill: none; stroke: var(--path); stroke-width: 1; vector-effect: non-scaling-stroke; stroke-linecap: round; }
        .fp-reveal { fill: none; stroke: #fff; stroke-width: 80; stroke-linecap: round; stroke-dasharray: 1 1; stroke-dashoffset: 0; }
        .fp-dot { position: absolute; left: 0; top: 0; width: 14px; height: 4px; margin: -2px 0 0 -7px; border-radius: 2px; background: var(--primary-fill); transition: background-color .6s; }
        .fp-nodes { list-style: none; position: absolute; inset: 0; pointer-events: none; }
        .fp-nodes li { position: absolute; transform: translate(-5px, -50%); pointer-events: auto; }
        .fp-node { display: inline-flex; align-items: center; gap: 14px; font-size: 16px; color: var(--text2); white-space: nowrap; min-height: 44px; transition: color .2s; }
        .fp-node { transition: color .2s, translate .3s cubic-bezier(.2,.7,.2,1); }
        .fp-node:is(:hover, :focus-visible) { color: var(--foreground); translate: 4px 0; }
        .fp-node:is(:hover, :focus-visible) .fp-node-dot { transform: scale(1.6); }
        .fp-node-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--area); transition: transform .4s, box-shadow .4s; }
        [data-near] .fp-node-dot { transform: scale(1.5); box-shadow: 0 0 0 5px color-mix(in srgb, var(--area) 22%, transparent); }
        [data-near] .fp-node { color: var(--foreground); }
                .fp-copy { position: absolute; left: clamp(16px, 4vw, 56px); right: clamp(16px, 4vw, 56px); top: 56%; text-align: center; }
        .fp-title { font-size: clamp(40px, 4.6vw, 88px); font-weight: 400; line-height: 1.08; letter-spacing: -0.03em; color: var(--foreground); }
        .fp-explore { position: absolute; left: 0; right: 0; margin: 0 auto; width: max-content; bottom: clamp(24px, 6svh, 64px); display: inline-flex; align-items: center; gap: 48px; padding-bottom: 12px; border-bottom: 1px solid var(--bd2); font-size: 18px; color: var(--foreground); transition: border-color .2s, gap .3s; }
        .fp-explore:hover { border-color: var(--foreground); gap: 56px; }
        @media (prefers-reduced-motion: no-preference) {
          .fp-reveal { stroke-dashoffset: 1; animation: fp-draw 1.6s cubic-bezier(.45,.05,.2,1) .15s forwards; }
          .fp-dot, .fp-nodes li { opacity: 0; animation: fp-in .6s ease forwards; }
          .fp-dot { animation-delay: 1.4s; }
          .fp-nodes li:nth-child(1) { animation-delay: 1.25s; }
          .fp-nodes li:nth-child(2) { animation-delay: 1.4s; }
          .fp-nodes li:nth-child(3) { animation-delay: .75s; }
          .fp-title, .fp-explore { opacity: 0; translate: 0 18px; animation: fp-rise .9s cubic-bezier(.2,.7,.2,1) forwards; }
          .fp-title { animation-delay: .35s; }
          .fp-explore { animation-delay: 1.5s; }
        }
        @keyframes fp-rise { to { opacity: 1; translate: 0 0; } }
        @keyframes fp-draw { to { stroke-dashoffset: 0; } }
        @keyframes fp-in { to { opacity: 1; } }

        /* Narrow screens: the words take the page; the three areas become a short list
           under them and the line stays as a quiet background. */
        @media (max-width: 860px) {
          .fp-hero { min-height: auto; }
          .fp-copy { position: relative; left: auto; right: auto; top: auto; padding: clamp(96px, 22svh, 200px) clamp(16px, 4vw, 56px) 0; }
          .fp-nodes { position: relative; inset: auto; display: flex; flex-wrap: wrap; justify-content: center; gap: 0 28px; padding: 28px clamp(16px, 4vw, 56px) 0; order: 3; }
          .fp-nodes li { position: static; transform: none; }
          .fp-explore { position: relative; left: auto; right: auto; bottom: auto; order: 4; align-self: center; margin: 40px clamp(16px, 4vw, 56px) 48px; }
          .fp-copy { order: 2; }
          .fp-path { stroke: color-mix(in srgb, var(--path) 70%, transparent); }
          .fp-dot { display: none; }
        }
      `}</style>
    </section>
  );
}
