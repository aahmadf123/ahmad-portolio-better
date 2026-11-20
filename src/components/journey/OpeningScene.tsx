import React from 'react';
import { MONO, SERIF, SANS } from '@/components/shared/section-helpers';
import { site, heroFacts } from '@/lib/data/site';
import { opening } from '@/lib/data/worlds';
import { TypedTagline } from '@/components/sections/hero/TypedTagline';
import { JourneyPhoto } from './JourneyPhoto';
import { SceneCopy } from './FlyInScene';
import { ChapterCopy } from './ChapterCopy';
import { StageArt } from './StageArt';

/**
 * The first screen: Ahmad's name, description, buttons and credentials on an opaque
 * panel over a real photo that belongs to no single world. It is an ordinary block in
 * the page flow (no pinning, no shared layer with the Toledo prologue), so everything
 * after it starts below all of its content at any width or text size.
 */
export function OpeningScene() {
  return (
    <section id="hero" tabIndex={-1} aria-labelledby="hero-name" className="hero">
      <div className="hero-photo"><JourneyPhoto id="opening" priority /></div>
      <div className="hero-inner">
        <div className="hero-panel opening-name">
          <div className="hero-roles">
            <TypedTagline segments={site.taglineSegments} active instant={false} />
          </div>
          <h1 id="hero-name" style={{ textAlign: 'center', fontFamily: SERIF, fontWeight: 400, fontSize: 'min(clamp(52px, 10vw, 132px), 13svh)', lineHeight: 0.95, letterSpacing: '-0.025em', color: 'var(--foreground)', margin: 0, paddingBottom: '0.08em' }}>
            <span style={{ color: 'var(--primary)' }}>Ahmad</span><br />Firas
          </h1>
          <p className="opening-sub" style={{ fontSize: 17, lineHeight: 1.6, color: 'var(--foreground)', maxWidth: 560, margin: '20px auto 0', fontFamily: SANS }}>{site.heroSub}</p>
          <div className="opening-ctas">
            <a href="/projects" data-magnetic="" className="hero-btn hero-btn-primary">View projects</a>
            <a href={site.resumeUrl} target="_blank" rel="noopener" className="hero-btn">Download resume</a>
            <a href="/projects" data-magnetic="" className="hero-btn">View Work</a>
            <a href={site.degreeUrl} target="_blank" rel="noopener" className="hero-btn hero-btn-teal">Degree ↓</a>
          </div>
          <dl className="opening-facts">
            {heroFacts.map((f) => (
              <div key={f.label}>
                <dt style={{ fontFamily: MONO, fontSize: 14, color: f.color, marginBottom: 2 }}>{f.label}</dt>
                <dd style={{ margin: 0, fontSize: 15, fontWeight: 500, color: 'var(--foreground)' }}>{f.value}</dd>
                {f.sub && <dd style={{ margin: 0, fontSize: 14, color: 'var(--foreground)', marginTop: 1 }}>{f.sub}</dd>}
              </div>
            ))}
          </dl>
        </div>
      </div>
      <style>{`
        .hero { position: relative; z-index: 1; display: flex; flex-direction: column; background: var(--background); }
        .hero-photo { position: absolute; inset: 0; overflow: hidden; }
        .hero-photo picture, .hero-photo img { position: absolute; inset: 0; width: 100%; height: 100%; }
        /* Starts a short gap under the sticky header, so the introduction shows at once. */
        .hero-inner { position: relative; flex: 1; display: flex; justify-content: center; align-items: flex-start; padding: clamp(14px, 3svh, 32px) clamp(16px, 4vw, 52px) clamp(32px, 6svh, 72px); }
        .hero-panel { width: 100%; max-width: 900px; text-align: center; background: var(--background); border: 1px solid var(--bd2); border-radius: 10px; padding: clamp(20px, 3.5vw, 40px) clamp(16px, 3.5vw, 44px); }
        .hero-roles { margin-bottom: 16px; }
        .opening-ctas { margin: 24px auto 0; display: flex; gap: 10px; align-items: center; justify-content: center; flex-wrap: wrap; max-width: 100%; }
        .hero-btn { display: inline-flex; align-items: center; justify-content: center; gap: 8px; border-radius: 5px; padding: 11px 22px; font-family: ${MONO}; font-size: 14px; color: var(--foreground); background: var(--background); border: 1px solid var(--text2); transition: border-color .2s, background-color .2s; }
        .hero-btn:hover { border-color: var(--foreground); background: var(--surface-2); }
        .hero-btn-primary { background: var(--primary); border-color: var(--primary); color: var(--background); font-weight: 700; }
        .hero-btn-primary:hover { background: var(--primary); border-color: var(--foreground); }
        .hero-btn-teal { color: var(--primary); border-color: var(--primary); }
        .opening-facts { margin: 28px auto 0; display: grid; grid-template-columns: repeat(auto-fit, minmax(min(170px, 100%), 1fr)); gap: 14px 22px; max-width: 820px; }
        @media (min-width: 901px) {
          .hero { min-height: 100svh; }
          /* clear the fixed Now Building bar (bottom-left, shown above 900px) */
          .hero-inner { padding-bottom: 120px; }
          .opening-facts { grid-template-columns: repeat(4, minmax(0, 1fr)); }
        }
        @media (max-width: 600px) {
          .opening-name h1 { font-size: clamp(48px, 13vw, 64px) !important; }
          .opening-sub { font-size: 15px !important; line-height: 1.55 !important; }
          .opening-ctas { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(140px, 100%), 1fr)); gap: 8px; width: 100%; margin-top: 20px; }
          .hero-btn { padding: 11px 8px; }
          .opening-facts { grid-template-columns: repeat(auto-fit, minmax(min(140px, 100%), 1fr)); gap: 12px 14px; margin-top: 22px; }
        }
      `}</style>
    </section>
  );
}

/**
 * "Toledo, Ohio." The first chapter of "Experience and background": its own block in
 * the page flow, over the opening photo, with the map drawing in a separate artwork
 * column beside the words (hidden on narrow screens).
 */
export function PrologueScene() {
  return (
    <section id="prologue" aria-labelledby="prologue-title" style={{ position: 'relative', zIndex: 20 }}>
      <div style={{ position: 'relative', minHeight: '100svh', display: 'flex', flexDirection: 'column', background: 'var(--background)' }}>
        <div aria-hidden className="flyin-photo" style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}><JourneyPhoto id="opening" /></div>
        <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', padding: 'clamp(40px, 8svh, 96px) 0' }}>
          <SceneCopy photo="opening" aside={<StageArt id="opening" scene={opening.scene} accent="#2dd4bf" />}>
            <ChapterCopy
              mark={`Prologue · ${opening.kicker}`}
              title={opening.title}
              titleId="prologue-title"
              paragraphs={[opening.body]}
              stat={opening.stat}
              accent="#2dd4bf"
              testId="opening-story"
            />
          </SceneCopy>
        </div>
      </div>
    </section>
  );
}
