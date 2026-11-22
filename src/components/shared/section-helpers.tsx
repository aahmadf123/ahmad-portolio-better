'use client';

import React, { useEffect, useRef, useState } from 'react';
import { resolveSkillColor } from '@/lib/skill-colors';
import { accentInk } from '@/lib/accent';

// ── Font tokens (single source of truth for inline-styled components) ──
// One typeface. SERIF and MONO are kept as names so older components keep compiling;
// both resolve to the body face. CODE is the real monospace, for code only.
export const SERIF = 'var(--font-body), system-ui, sans-serif';
export const MONO = 'var(--font-body), system-ui, sans-serif';
export const CODE = 'var(--font-code), ui-monospace, monospace';
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
// `variant="sub"`: a part of a larger chapter (Capabilities, Timeline, Credentials and
// Signals inside About): no ghost numeral, an h3 label, a tighter gap below.
export function SH({ label, sub = '', color = 'var(--primary-fill)', variant = 'chapter' }: { n?: string; label: string; sub?: string; color?: string; variant?: 'chapter' | 'sub' }) {
  const Label = variant === 'sub' ? 'h3' : 'h2';
  return (
    <div style={{ marginBottom: variant === 'sub' ? 28 : 44, paddingTop: 8 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: sub ? 10 : 0 }}>
        <span aria-hidden style={{ width: 6, height: 6, borderRadius: 3, background: color, flexShrink: 0 }} />
        <Label style={{ fontFamily: SANS, fontSize: variant === 'sub' ? 20 : 'var(--fs-section-head)', fontWeight: 400, lineHeight: 1.1, letterSpacing: '-0.02em', color: 'var(--foreground)', margin: 0 }}>{label}</Label>
      </div>
      {sub && <p style={{ fontSize: 16, color: FG2, maxWidth: 520, lineHeight: 1.6, marginTop: 6, fontFamily: SANS }}>{sub}</p>}
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
const PALETTE = ['#e5c453', '#5b8af5', '#2dd4bf', '#fb7185', '#a78bfa', '#f472b6', '#38bdf8', '#22c55e', '#ef4444'];
export function pickColor(text: string) {
  let h = 0;
  for (let i = 0; i < text.length; i++) h = (h * 31 + text.charCodeAt(i)) >>> 0;
  return PALETTE[h % PALETTE.length];
}

export function Tag({ color, size = 11, children }: { color?: string; /** px; 14 where tags sit with project descriptions. */ size?: number; children: React.ReactNode }) {
  const skillColor = typeof children === 'string' ? resolveSkillColor(children) : undefined;
  const c = color ?? skillColor ?? (typeof children === 'string' ? pickColor(children) : '#5b8af5');
  return <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: SANS, fontSize: Math.max(size, 13), color: 'var(--text2)' }}><span aria-hidden style={{ width: 5, height: 5, borderRadius: 3, background: c, flexShrink: 0 }} />{children}</span>;
}

/**
 * Chip text: the accent mixed 30% toward the foreground. Red, blue and purple accents
 * on a tint of themselves fall just under 4.5:1 at 11px; this keeps the hue and passes.
 */
export const readable = (c: string) => accentInk(c);
export { accentInk };

export function SkillChip({ color, children }: { color?: string; children: React.ReactNode }) {
  const c = color ?? (typeof children === 'string' ? pickColor(children) : '#5b8af5');
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: SANS, fontSize: 14, color: 'var(--text2)' }}>
      <span aria-hidden style={{ width: 5, height: 5, borderRadius: 3, background: c, flexShrink: 0 }} />{children}
    </span>
  );
}

// ── Section wrapper ──
export function Section({ id, children, style }: { id?: string; children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <section id={id} style={{ padding: 'clamp(64px, 8vw, 100px) clamp(20px, 4vw, 52px)', position: 'relative', overflowX: 'clip', overflowY: 'visible', background: 'color-mix(in srgb, var(--background) 80%, transparent)', zIndex: 20, ...style }}>
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

