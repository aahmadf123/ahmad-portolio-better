'use client';

import React from 'react';
import { useLightboxOpen } from '@/components/layout/LightboxProvider';
import { Pic } from '@/components/ui/pic';
import { research } from '@/lib/data/research';
import { CountUp } from '@/components/ui/count-up';

/** The research paper: what it is, its figure, its numbers and its four pillars. */
export function ResearchPaper() {
  const openLb = useLightboxOpen();
  return (
    <div className="rp">
      <p className="rp-kicker">Research under review and ongoing investigations.</p>
      {research.storyLine && <p className="rp-story">{research.storyLine}</p>}
      <div className="rp-grid">
        <div>
          <p className="rp-pre">{research.preheader}</p>
          <h4 className="rp-title">{research.headingAccent} Taxonomy for<br />Autonomous Systems</h4>
          <p className="rp-desc">{research.description}</p>
          <a href={research.pdf} target="_blank" rel="noopener" className="text-link is-underlined rp-link">{research.buttonText} ↗</a>
        </div>
        <button type="button" className="rp-img lift-img rv-fade" onClick={() => openLb(research.image, '4-Pillars AI Failure Taxonomy')} aria-label="Enlarge the taxonomy figure">
          <Pic src={research.image} alt={research.imageAlt} sizes="(max-width: 860px) 92vw, 520px" style={{ width: '100%', height: 'auto', display: 'block' }} />
        </button>
      </div>
      <dl className="rp-metrics tnum">
        {research.metrics.map((m) => <div key={m.label}><dd><CountUp value={m.metric} /></dd><dt>{m.label}</dt></div>)}
      </dl>
      <ol className="rp-pillars">
        {research.pillars.map((p, i) => (
          <li key={p.n} className="rv" style={{ '--i': i } as React.CSSProperties}>
            <h5><span>{p.n}</span> {p.label}</h5>
            <p>{p.desc}</p>
          </li>
        ))}
      </ol>
      <style>{`
        .rp-kicker { font-size: 14px; color: var(--text2); }
        .rp-story { margin-top: 8px; color: var(--text2); max-width: 36em; }
        .rp-grid { display: grid; grid-template-columns: minmax(0, 6fr) minmax(0, 5fr); gap: 28px clamp(24px, 4vw, 64px); margin-top: 28px; }
        .rp-pre { font-size: 14px; color: var(--text3); }
        .rp-title { font-size: clamp(26px, 2.6vw, 38px); font-weight: 400; line-height: 1.1; letter-spacing: -0.025em; margin-top: 8px; }
        .rp-desc { margin-top: 14px; color: var(--text2); }
        .rp-link { margin-top: 16px; font-size: 15px; }
        .rp-img { padding: 0; border: 0; border-radius: 3px; overflow: hidden; background: #f4f4f2; cursor: zoom-in; align-self: start; }
        .rp-metrics { display: flex; flex-wrap: wrap; gap: 16px clamp(24px, 4vw, 56px); margin-top: 32px; padding: 18px 0; border-top: 1px solid var(--bd); border-bottom: 1px solid var(--bd); }
        .rp-metrics div { display: flex; flex-direction: column; }
        .rp-metrics dd { font-size: 28px; letter-spacing: -0.02em; order: 1; }
        .rp-metrics dt { font-size: 14px; color: var(--text2); order: 2; }
        .rp-pillars { list-style: none; display: grid; grid-template-columns: repeat(auto-fit, minmax(min(260px, 100%), 1fr)); gap: 24px 40px; margin-top: 28px; }
        .rp-pillars h5 { font-size: 17px; font-weight: 500; }
        .rp-pillars h5 span { color: var(--text3); font-weight: 400; margin-right: 6px; }
        .rp-pillars p { margin-top: 6px; font-size: 15px; color: var(--text2); }
        @media (max-width: 860px) { .rp-grid { grid-template-columns: minmax(0, 1fr); } }
      `}</style>
    </div>
  );
}
