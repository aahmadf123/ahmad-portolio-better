'use client';

import React from 'react';
import Link from 'next/link';
import { Pic, largestVariant } from '@/components/ui/pic';
import { useLightboxOpen } from '@/components/layout/LightboxProvider';
import { accentInk } from '@/lib/accent';
import { flagshipProject, projects, projectStatusLabel, type Project } from '@/lib/data/projects';
import { useProjectModal } from './ProjectModalProvider';
import { CountUp } from '@/components/ui/count-up';
import { PlayDiagram } from './PlayDiagram';

/** A real screen from the Football IQ build: Clip Review with its vision overlays and play labels. */
const OUTPUT = {
  src: '/Images/Football_IQ_Clip_Review.png',
  alt: 'Toledo Football IQ Clip Review screen: an overhead practice clip with player-tracking overlays, the play marked Preliminary and Reviewed, and the play tag fields beside it.',
};

const FIQ_STATS = [
  { value: '10', label: 'Pipeline stages' },
  { value: '18+', label: 'Structured metrics' },
  { value: '90%+', label: 'Field-marking accuracy target' },
];

/**
 * Two projects, straight after the hero: Toledo Football IQ and Homeowner Loss
 * Prediction, as editorial spreads (words on one side, the real output on the other).
 */
export function FeaturedWork() {
  const homeowner = projects.find((p) => p.slug === 'homeowner-loss-prediction')!;
  return (
    <section aria-labelledby="selected-title" className="fw">
      {/* Old links from before the redesign: /#projects lands on the work. */}
      <span id="projects" aria-hidden className="fw-anchor" />
      <div className="wrap">
        <h2 id="selected-title" className="fw-kicker rv">Selected work</h2>
        <FootballIQ />
        <Spread project={homeowner} />
      </div>
      <style>{`
        .fw { position: relative; padding-top: clamp(64px, 10vw, 140px); }
        .fw-anchor { position: absolute; top: 0; left: 0; width: 1px; height: 1px; }
        .fw-kicker { font-size: 15px; font-weight: 400; color: var(--text2); padding-bottom: 14px; border-bottom: 1px solid var(--bd); }
        .fw-spread { display: grid; grid-template-columns: minmax(0, 5fr) minmax(0, 7fr); gap: clamp(28px, 5vw, 80px); padding: clamp(40px, 6vw, 88px) 0; border-bottom: 1px solid var(--bd); scroll-margin-top: 24px; }
        .fw-spread.flip > .fw-media { order: -1; }
        .fw-spread.flip { grid-template-columns: minmax(0, 7fr) minmax(0, 5fr); }
        .fw-meta { display: flex; flex-wrap: wrap; justify-content: space-between; gap: 6px 16px; font-size: 14px; color: var(--text2); }
        .fw-status { display: inline-flex; align-items: center; gap: 8px; }
        .fw-status i { width: 6px; height: 6px; border-radius: 50%; }
        .fw-title { font-size: clamp(32px, 3.6vw, 52px); font-weight: 400; line-height: 1.05; letter-spacing: -0.03em; margin-top: 18px; }
        .fw-headline { margin-top: 14px; font-size: 17px; }
        .fw-story { margin-top: 18px; color: var(--text2); max-width: 34em; }
        .fw-tools { margin-top: 18px; font-size: 14px; color: var(--text3); line-height: 1.7; }
        .fw-stats { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 20px clamp(16px, 2.5vw, 40px); margin-top: 28px; padding-top: 18px; border-top: 1px solid var(--bd); }
        .fw-stats dt { font-size: 14px; color: var(--text2); order: 2; }
        .fw-stats div { display: flex; flex-direction: column; gap: 2px; }
        .fw-stats dd { font-size: 28px; letter-spacing: -0.02em; line-height: 1.1; order: 1; }
        .fw-actions { display: flex; flex-wrap: wrap; gap: 10px 28px; margin-top: 28px; align-items: center; }
        .fw-actions button { background: none; border: 0; font: inherit; font-size: 15px; color: var(--text2); cursor: pointer; padding: 0; min-height: 44px; text-decoration: underline; text-decoration-color: var(--bd2); text-underline-offset: 5px; }
        .fw-actions button:hover { color: var(--foreground); }
        .fw-note { margin-top: 10px; font-size: 14px; color: var(--text3); }
        .fw-media { min-width: 0; display: flex; flex-direction: column; gap: 28px; }
        .fw-figure { margin: 0; }
        .fw-figure h3 { font-size: 15px; font-weight: 400; color: var(--text2); margin-bottom: 12px; }
        .fw-shot { display: block; width: 100%; padding: 0; border: 1px solid var(--bd); border-radius: 3px; overflow: hidden; background: var(--surface); cursor: zoom-in; }
        .fw-shot img { display: block; width: 100%; height: auto; }
        .fw-figure figcaption { margin-top: 10px; font-size: 14px; color: var(--text2); }
        .fw-diagram { border: 1px solid var(--bd); border-radius: 3px; padding: clamp(12px, 2vw, 20px); }
        .fw-plain-img { border-radius: 3px; overflow: hidden; background: #f4f4f2; } /* the pipeline drawing is white-backed */
        @media (max-width: 900px) {
          .fw-spread, .fw-spread.flip { grid-template-columns: minmax(0, 1fr); }
          .fw-spread.flip > .fw-media { order: 0; }
        }
      `}</style>
    </section>
  );
}

function Status({ p }: { p: Project }) {
  return (
    <span className="fw-status">
      <i aria-hidden style={{ background: p.color }} />
      {projectStatusLabel[p.status]}
    </span>
  );
}

function FootballIQ() {
  const p = flagshipProject;
  const openLb = useLightboxOpen();
  const { open } = useProjectModal();
  return (
    <article id="toledo-football-iq" aria-labelledby="toledo-football-iq-title" className="fw-spread">
      <div className="rv-left">
        <div className="fw-meta">
          <span>Flagship · {p.tag}</span>
          <Status p={p} />
        </div>
        <h3 id="toledo-football-iq-title" className="fw-title">{p.title}</h3>
        <p className="fw-headline" style={{ color: accentInk(p.color) }}>{p.headline}</p>
        <p className="fw-story">
          {p.story} A 10-stage pipeline from drone footage to coach dashboard - every output connects to the exact clip, overlay, confidence score, and correction path.
        </p>
        <p className="fw-tools">{p.stacks.join(' · ')}</p>
        <dl className="fw-stats tnum">
          {FIQ_STATS.map((s) => (
            <div key={s.label}><dt>{s.label}</dt><dd><CountUp value={s.value} /></dd></div>
          ))}
        </dl>
        <div className="fw-actions">
          <Link href={`/case-study/${p.slug}`} transitionTypes={['nav-forward']} className="text-link is-underlined">Read the case study →</Link>
          <button type="button" onClick={() => open(p)}>{p.detailsLabel ?? 'Details →'}</button>
        </div>
        <p className="fw-note">Live URL coming when it ships</p>
      </div>
      <div className="fw-media rv-right">
        <figure className="fw-figure">
          <h3>Inspect a practice-film analysis</h3>
          <button type="button" className="fw-shot lift-img" onClick={() => openLb(largestVariant(OUTPUT.src), OUTPUT.alt)} aria-label="Enlarge the Clip Review screen">
            <Pic src={OUTPUT.src} alt={OUTPUT.alt} sizes="(max-width: 900px) 92vw, 680px" />
          </button>
          <figcaption>Review a clip, inspect an overlay and see the associated labels.</figcaption>
        </figure>
        <figure className="fw-figure">
          <div className="fw-diagram">
            <span className="illustrative-chip" style={{ display: 'inline-block', marginBottom: 10 }}>Illustrative example</span>
            <PlayDiagram />
          </div>
          <figcaption>Detection → tracking → labels - rendered from the pipeline&apos;s point of view</figcaption>
        </figure>
      </div>
    </article>
  );
}

function Spread({ project: p }: { project: Project }) {
  const { open } = useProjectModal();
  return (
    <article id={p.slug} aria-labelledby={`${p.slug}-title`} className="fw-spread flip">
      <div className="rv-right">
        <div className="fw-meta">
          <span>{p.domain} · {p.idx}</span>
          <Status p={p} />
        </div>
        <p className="fw-meta" style={{ marginTop: 6 }}>{p.tag}</p>
        <h3 id={`${p.slug}-title`} className="fw-title">{p.title}</h3>
        <p className="fw-headline" style={{ color: accentInk(p.color) }}>{p.headline}</p>
        <p className="fw-story">{p.story}</p>
        <p className="fw-tools">{p.stacks.join(' · ')}</p>
        <div className="fw-actions">
          {p.links.map((l) =>
            l.kind === 'case-study'
              ? <Link key={l.href} href={l.href} transitionTypes={['nav-forward']} className="text-link is-underlined">{l.label} →</Link>
              : <a key={l.href} href={l.href} target="_blank" rel="noopener" className="text-link is-underlined">{l.label} {l.kind === 'pdf' ? '↓' : '↗'}</a>
          )}
          <button type="button" onClick={() => open(p)}>{p.detailsLabel ?? 'Details →'}</button>
        </div>
      </div>
      <div className="fw-media rv-left">
        <div className="fw-plain-img lift-img">
          <Pic src={p.image} alt={p.title} sizes="(max-width: 900px) 92vw, 680px" style={{ display: 'block', width: '100%', height: 'auto' }} />
        </div>
      </div>
    </article>
  );
}
