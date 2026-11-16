'use client';

import React, { useRef } from 'react';
import { MONO, SERIF, SANS, FG3 } from '@/components/shared/section-helpers';
import { site, heroFacts } from '@/lib/data/site';
import { opening } from '@/lib/data/worlds';
import { TypedTagline } from '@/components/sections/hero/TypedTagline';
import { FlyInScene, SceneCopy, setLayer, span, useScene, useSceneFrame } from './FlyInScene';
import { StageArt } from './StageArt';

/**
 * The first screen: Ahmad's name over a real photo that belongs to no single world.
 * Scrolling swaps the name for the first chapter of the story ("Toledo, Ohio."),
 * then the first world's fly-in takes over.
 */
export function OpeningScene() {
  return (
    // Stacked above the first world (z 21 vs 20): that world's stage waits underneath,
    // already showing this same photo, and is revealed as the opening scrolls away.
    <section id="hero" tabIndex={-1} aria-labelledby="hero-name" style={{ position: 'relative', zIndex: 21 }}>
      <FlyInScene id="opening" to="opening" length={1.8} priority>
        <OpeningCopy />
      </FlyInScene>
    </section>
  );
}

const button: React.CSSProperties = {
  display: 'inline-flex', alignItems: 'center', gap: 8, borderRadius: 5, textTransform: 'uppercase', fontFamily: MONO,
};

function OpeningCopy() {
  const { still } = useScene();
  const nameRef = useRef<HTMLDivElement>(null);
  const storyRef = useRef<HTMLDivElement>(null);
  useSceneFrame((p) => {
    setLayer(nameRef.current, span(p, 0.3, 0.45, 1, 0), `translateY(${span(p, 0.3, 0.45, 0, -40)}px)`);
    // In at 0.45-0.6, out at 0.88-1 so the handover to the first world is photo-only.
    const story = p < 0.7 ? span(p, 0.45, 0.6, 0, 1) : span(p, 0.88, 1, 1, 0);
    setLayer(storyRef.current, story, `translateY(${p < 0.7 ? span(p, 0.45, 0.6, 40, 0) : span(p, 0.88, 1, 0, -30)}px)`);
  });

  const name = (
    <SceneCopy photo="opening" style={{ paddingTop: 62 }} maxWidth={720}>
      <div className="opening-name">
      <div style={{ marginBottom: 18, minHeight: 17 }}>
        <TypedTagline segments={site.taglineSegments} active instant={still} />
      </div>
      <h1 id="hero-name" style={{ fontFamily: SERIF, fontWeight: 400, fontSize: 'min(clamp(52px, 10vw, 132px), 13svh)', lineHeight: 0.95, letterSpacing: '-0.025em', color: 'var(--foreground)', margin: 0, paddingBottom: '0.08em' }}>
        <span style={{ color: 'var(--primary)' }}>Ahmad</span><br />Firas
      </h1>
      <p className="opening-sub" style={{ fontSize: 16, lineHeight: 1.65, color: 'var(--text2)', maxWidth: 460, marginTop: 'min(22px, 2.4svh)', fontFamily: SANS }}>{site.heroSub}</p>
      <div className="opening-ctas" style={{ marginTop: 'min(24px, 2.6svh)', display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
        <a href="#chem-e-car" data-magnetic="" style={{ ...button, padding: '11px 24px', background: 'var(--primary)', color: 'var(--background)', fontSize: 11, fontWeight: 700, letterSpacing: '0.06em' }}>Start the journey ↓</a>
        <a href="#projects" data-magnetic="" style={{ ...button, padding: '11px 24px', border: '1px solid var(--bd2)', color: 'var(--text2)', fontSize: 11, letterSpacing: '0.06em' }}>View Work</a>
        <a href={site.resumeUrl} target="_blank" rel="noopener" style={{ ...button, gap: 6, padding: '9px 18px', border: '1px solid var(--bd)', color: FG3, fontSize: 10, letterSpacing: '0.07em' }}>Resume ↓</a>
        <a href={site.degreeUrl} target="_blank" rel="noopener" style={{ ...button, gap: 6, padding: '9px 18px', border: '1px solid rgba(45,212,191,0.35)', color: 'var(--primary)', fontSize: 10, letterSpacing: '0.07em' }}>Degree ↓</a>
      </div>
      <dl className="opening-facts" style={{ marginTop: 'min(26px, 2.8svh)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '10px 22px' }}>
        {heroFacts.map((f) => (
          <div key={f.label}>
            <dt style={{ fontFamily: MONO, fontSize: 10, color: f.color, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 2 }}>{f.label}</dt>
            <dd style={{ margin: 0, fontSize: 13, fontWeight: 500, color: 'var(--foreground)' }}>{f.value}</dd>
            {f.sub && <dd style={{ margin: 0, fontSize: 11, color: 'var(--text2)', marginTop: 1 }}>{f.sub}</dd>}
          </div>
        ))}
      </dl>
      </div>
      <style>{`
        /* clear the fixed Now Building bar (bottom-left, shown above 900px) */
        @media (min-width: 901px) {
          .opening-name { padding-bottom: 120px; }
          .opening-facts { grid-template-columns: repeat(4, minmax(0, 1fr)) !important; }
        }
        @media (max-width: 600px) {
          .opening-name h1 { font-size: min(clamp(48px, 13vw, 64px), 9svh) !important; }
          .opening-sub { font-size: 15px !important; line-height: 1.5 !important; }
          .opening-ctas { display: grid !important; grid-template-columns: 1fr 1fr; gap: 8px !important; }
          .opening-ctas a { justify-content: center; padding: 10px 8px !important; }
          .opening-facts { grid-template-columns: 1fr 1fr !important; gap: 8px 16px !important; }
          .opening-facts dd { font-size: 12px !important; }
          .opening-story p { font-size: 15px !important; line-height: 1.55 !important; }
        }
      `}</style>
    </SceneCopy>
  );

  const story = (
    <SceneCopy photo="opening" aside={<StageArt id="opening" scene={opening.scene} accent="#2dd4bf" />}>
      <div data-testid="opening-story" className="opening-story">
        <div style={{ fontFamily: MONO, fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--primary)' }}>Prologue · {opening.kicker}</div>
        <h2 style={{ fontFamily: SERIF, fontWeight: 400, fontSize: 'var(--text-3xl)', lineHeight: 1, letterSpacing: '-0.02em', color: 'var(--foreground)', margin: '12px 0 18px' }}>{opening.title}</h2>
        <p style={{ fontFamily: SANS, fontSize: 17, lineHeight: 1.7, color: 'var(--foreground)', margin: 0, maxWidth: 560 }}>{opening.body}</p>
        <div style={{ marginTop: 22, paddingTop: 12, borderTop: '2px solid var(--primary)', display: 'inline-block' }}>
          <div style={{ fontFamily: SERIF, fontSize: 34, lineHeight: 1, color: 'var(--foreground)' }}>{opening.stat.value}</div>
          <div style={{ fontFamily: MONO, fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text2)', marginTop: 6 }}>{opening.stat.label}</div>
        </div>
      </div>
    </SceneCopy>
  );

  if (still) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 48, padding: '96px 0 64px' }}>
        {name}
        {story}
      </div>
    );
  }
  return (
    <>
      <div ref={nameRef} data-show-at="0" style={{ position: 'absolute', inset: 0, display: 'flex' }}>{name}</div>
      <div ref={storyRef} data-show-at="0.75" style={{ position: 'absolute', inset: 0, display: 'flex', opacity: 0, pointerEvents: 'none' }}>{story}</div>
    </>
  );
}
