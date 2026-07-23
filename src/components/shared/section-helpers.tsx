'use client';

import React, { useEffect, useRef, useState } from 'react';
import { resolveSkillColor } from '@/lib/skill-colors';

// ── Font tokens (single source of truth for inline-styled components) ──
export const SERIF = 'var(--font-display), Georgia, serif';
export const MONO = 'var(--font-code), monospace';
export const SANS = 'var(--font-body), system-ui, sans-serif';
export const HAND = 'var(--font-hand), cursive';

// ── Color tokens ──
export const FG = 'var(--foreground)';
export const FG2 = 'var(--text2)';
export const FG3 = 'var(--text3)';
export const BG = 'var(--background)';

// ── Section Header (ghost numeral + kicker) ──
// Kinetic: self-reveals on scroll-in via useReveal (transform/opacity only, no
// layout shift). `.reveal`/`.in` transitions + the reduced-motion force-visible
// rule live in globals.css; the inline transitionDelay staggers kicker → sub.
// This module is 'use client', so SH is already a client component - safe to
// hook here and still renderable from server components.
export function SH({ n, label, sub = '', color = 'var(--primary)' }: { n: string; label: string; sub?: string; color?: string }) {
  const { ref, visible } = useReveal();
  const revealCls = 'reveal' + (visible ? ' in' : '');
  return (
    <div ref={ref} style={{ position: 'relative', marginBottom: 52, paddingTop: 8 }}>
      <div aria-hidden className="ghost-num" style={{ position: 'absolute', top: -32, left: -8, fontFamily: SERIF, fontSize: 'clamp(72px,11vw,160px)', fontWeight: 400, color, opacity: 0.05, lineHeight: 1, userSelect: 'none', pointerEvents: 'none', letterSpacing: '-0.03em', zIndex: 0 }}>{n}</div>
      <div style={{ position: 'relative', zIndex: 1 }}>
        <div className={revealCls} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: sub ? 10 : 0, transitionDelay: '0ms' }}>
          <span style={{ display: 'inline-block', width: 22, height: 1.5, background: color, opacity: 0.6, flexShrink: 0 }} />
          <span style={{ fontFamily: MONO, fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color }}>{label}</span>
        </div>
        {sub && <p className={revealCls} style={{ fontSize: 15, color: FG2, maxWidth: 460, lineHeight: 1.65, marginTop: 4, fontFamily: SANS, transitionDelay: '60ms' }}>{sub}</p>}
      </div>
    </div>
  );
}

// ── Reveal hook (IntersectionObserver; CSS scroll-driven upgrade in globals) ──
export function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.1 });
    io.observe(ref.current);
    return () => io.disconnect();
  }, []);
  return { ref, visible };
}

// ── Deterministic accent picker for uncolored tags ──
const PALETTE = ['#f59e0b', '#5b8af5', '#2dd4bf', '#f0823c', '#a78bfa', '#f472b6', '#38bdf8', '#22c55e', '#ef4444'];
export function pickColor(text: string) {
  let h = 0;
  for (let i = 0; i < text.length; i++) h = (h * 31 + text.charCodeAt(i)) >>> 0;
  return PALETTE[h % PALETTE.length];
}

export function Tag({ color, children }: { color?: string; children: React.ReactNode }) {
  const skillColor = typeof children === 'string' ? resolveSkillColor(children) : undefined;
  const c = color ?? skillColor ?? (typeof children === 'string' ? pickColor(children) : '#5b8af5');
  return <span style={{ fontFamily: MONO, fontSize: 11, padding: '4px 9px', background: `${c}14`, border: `1px solid ${c}33`, borderRadius: 4, color: c, letterSpacing: '0.03em' }}>{children}</span>;
}

export function SkillChip({ color, children }: { color?: string; children: React.ReactNode }) {
  const c = color ?? (typeof children === 'string' ? pickColor(children) : '#5b8af5');
  return (
    <span
      style={{ fontFamily: MONO, fontSize: 11, padding: '4px 9px', background: `${c}14`, border: `1px solid ${c}35`, borderRadius: 4, color: `${c}dd`, letterSpacing: '0.02em', cursor: 'default', transition: 'background 0.18s, color 0.18s' }}
      onMouseEnter={e => { e.currentTarget.style.background = `${c}2a`; e.currentTarget.style.color = 'var(--foreground)'; }}
      onMouseLeave={e => { e.currentTarget.style.background = `${c}14`; e.currentTarget.style.color = `${c}dd`; }}
    >{children}</span>
  );
}

// ── Section wrapper ──
export function Section({ id, children, style }: { id?: string; children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <section id={id} style={{ padding: 'clamp(64px, 8vw, 100px) clamp(20px, 4vw, 52px)', position: 'relative', overflowX: 'clip', overflowY: 'visible', background: 'rgba(13,14,18,0.80)', zIndex: 20, ...style }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        {children}
      </div>
    </section>
  );
}

// ── Inline social icons ──
export function GithubIcon({ size = 24, color = 'currentColor', strokeWidth = 2 }: { size?: number; color?: string; strokeWidth?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
    </svg>
  );
}

export function LinkedinIcon({ size = 24, color = 'currentColor', strokeWidth = 2 }: { size?: number; color?: string; strokeWidth?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

