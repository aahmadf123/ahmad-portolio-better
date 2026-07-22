'use client';

import React, { useEffect, useState } from 'react';
import { MONO, SERIF, SANS, FG3 } from '@/components/shared/section-helpers';
import { useLightboxOpen } from '@/components/layout/LightboxProvider';
import { site, heroFacts } from '@/lib/data/site';
import { TypedTagline } from './TypedTagline';

/**
 * Static hero: server-rendered h1 as the LCP element, typed tagline, soft
 * atmosphere glow. Reduced motion renders the tagline instantly.
 */
export function HeroSection() {
  const [instantTagline, setInstantTagline] = useState(false);
  const [taglineActive, setTaglineActive] = useState(false);

  useEffect(() => {
    setInstantTagline(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    setTaglineActive(true);
  }, []);

  return (
    <section id="hero" tabIndex={-1} style={{
      minHeight: '100svh',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      overflow: 'hidden',
      background: 'transparent',
      zIndex: 20,
    }}>
      {/* atmosphere */}
      <div aria-hidden style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse 60% 45% at 30% 42%, rgba(45,212,191,0.07), transparent 70%)',
      }} />

      <div style={{ flex: 1, display: 'flex', flexWrap: 'wrap', position: 'relative', zIndex: 1 }}>

        {/* LEFT - 58% */}
        <div className="hero-left" style={{
          flex: '1 1 58%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: 'clamp(64px,6vw,80px) clamp(28px,4vw,64px) clamp(40px,4vw,56px) clamp(20px,4vw,52px)',
        }}>

          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingTop: 24 }}>
            <div style={{ marginBottom: 20, minHeight: 17 }}>
              <TypedTagline segments={site.taglineSegments} active={taglineActive} instant={instantTagline} />
            </div>
            <h1 style={{
              fontFamily: SERIF, fontWeight: 400,
              fontSize: 'clamp(56px, 10vw, 132px)',
              lineHeight: 0.95, letterSpacing: '-0.025em', color: 'var(--foreground)',
              margin: 0, paddingBottom: '0.08em',
              width: 'fit-content',
            }}>
              <span style={{ color: 'var(--primary)' }}>Ahmad</span><br />Firas
            </h1>
            <div>
              <p style={{ fontSize: 16, lineHeight: 1.72, color: 'var(--text2)', maxWidth: 440, marginTop: 26, fontFamily: SANS }}>
                {site.heroSub}
              </p>
              <div style={{ marginTop: 28, display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
                <a href="#story" data-magnetic="" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '11px 24px', background: 'var(--primary)', color: '#06211e', fontFamily: MONO, fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', borderRadius: 5, textTransform: 'uppercase' }}>Enter the Story ↓</a>
                <a href="#projects" data-magnetic="" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '11px 24px', border: '1px solid var(--bd2)', color: 'var(--text2)', fontFamily: MONO, fontSize: 11, letterSpacing: '0.06em', borderRadius: 5, textTransform: 'uppercase' }}>View Work</a>
                <a href={site.resumeUrl} target="_blank" rel="noopener" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '9px 18px', border: '1px solid var(--bd)', color: FG3, fontFamily: MONO, fontSize: 10, letterSpacing: '0.07em', borderRadius: 5, textTransform: 'uppercase' }}>Resume ↓</a>
                <a href={site.degreeUrl} target="_blank" rel="noopener" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '9px 18px', border: '1px solid rgba(45,212,191,0.35)', color: 'var(--primary)', fontFamily: MONO, fontSize: 10, letterSpacing: '0.07em', borderRadius: 5, textTransform: 'uppercase' }}>Degree ↓</a>
              </div>
            </div>
          </div>

          {/* bottom scroll hint */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, opacity: 0.45, animation: 'bob 2.2s ease-in-out 2s infinite' }}>
            <div style={{ width: 1, height: 32, background: 'linear-gradient(to bottom, var(--primary), transparent)' }} />
            <span style={{ fontFamily: MONO, fontSize: 9, letterSpacing: '0.14em', color: FG3, textTransform: 'uppercase' }}>Scroll to explore</span>
          </div>
        </div>

        {/* RIGHT - 42% */}
        <div className="hero-right" style={{
          flex: '0 0 42%',
          borderLeft: '1px solid rgba(45,212,191,0.08)',
          display: 'flex',
          flexDirection: 'column',
          padding: 'clamp(64px,6vw,80px) clamp(24px,3.5vw,48px) clamp(40px,4vw,56px)',
          background: 'transparent',
        }}>
          <div style={{ borderRadius: 8, overflow: 'hidden', flexShrink: 0 }}>
            <HeroPhoto />
          </div>

          {/* info cards */}
          <div style={{ marginTop: 20, backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)', borderRadius: 8, boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06)' }}>
            {heroFacts.map((f) => (
              <div key={f.label} style={{ padding: '10px 0', borderBottom: '1px solid var(--bd)' }}>
                <div style={{ fontFamily: MONO, fontSize: 10, color: f.color, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 2, opacity: 0.85 }}>{f.label}</div>
                <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--foreground)' }}>{f.value}</div>
                {f.sub && <div style={{ fontSize: 11, color: FG3, marginTop: 1 }}>{f.sub}</div>}
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 960px) {
          #hero > div:not([aria-hidden]) { flex-direction: column !important; }
          #hero .hero-left { flex: none !important; width: 100% !important; }
          #hero .hero-right { flex: none !important; width: 100% !important; border-left: none !important; border-top: 1px solid rgba(45,212,191,0.08) !important; }
          #hero .hero-right img { max-height: 440px !important; min-height: 180px; width: 100% !important; object-fit: cover !important; }
        }
        @media (max-width: 600px) {
          #hero .hero-left h1 { font-size: clamp(48px,13vw,80px) !important; }
        }
      `}</style>
    </section>
  );
}

function HeroPhoto() {
  const openLb = useLightboxOpen();
  return (
    <div style={{ position: 'relative' }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/Images/optimized/headshot-800.webp"
        alt="Ahmad Firas"
        title="Click to enlarge"
        onClick={() => openLb('/Images/optimized/headshot-1600.webp', 'Ahmad Firas')}
        style={{
          display: 'block',
          width: '100%',
          height: 'auto',
          maxHeight: 'clamp(220px, calc(100svh - 370px), 390px)',
          objectFit: 'contain',
          objectPosition: 'center top',
          cursor: 'zoom-in',
        }}
      />
      <div
        aria-hidden
        style={{
          position: 'absolute', bottom: 10, right: 10,
          background: 'rgba(13,14,18,0.62)',
          borderRadius: 4, padding: '4px 8px',
          display: 'flex', alignItems: 'center', gap: 5,
          pointerEvents: 'none',
        }}
      >
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="var(--text2)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <polyline points="15 3 21 3 21 9" /><polyline points="9 21 3 21 3 15" />
          <line x1="21" y1="3" x2="14" y2="10" /><line x1="3" y1="21" x2="10" y2="14" />
        </svg>
        <span style={{ fontFamily: MONO, fontSize: 9, letterSpacing: '0.1em', color: 'var(--text2)', textTransform: 'uppercase' }}>Enlarge</span>
      </div>
    </div>
  );
}
