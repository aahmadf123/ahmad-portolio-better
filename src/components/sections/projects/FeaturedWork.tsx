'use client';

import React from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { MONO, SERIF, SANS, Tag } from '@/components/shared/section-helpers';
import { Pic } from '@/components/ui/pic';
import { projects, projectStatusLabel, type Project } from '@/lib/data/projects';
import { useProjectModal } from './ProjectModalProvider';

// Split out (still server-rendered): GSAP and the play diagram stay off the critical
// path of the hero photo.
const FootballIQFeature = dynamic(() => import('./FootballIQFeature').then((m) => ({ default: m.FootballIQFeature })));

const STATUS_COLOR: Record<Project['status'], string> = {
  live: 'var(--green)',
  'active-build': 'var(--red)',
  shipped: 'var(--primary)',
  research: 'var(--blue)',
};

/**
 * The two projects shown straight after the hero, before the chronological background:
 * Toledo Football IQ (its flagship panel) and Homeowner Loss Prediction. Both keep their
 * own descriptions, links and status labels; their worlds no longer repeat them.
 */
export function FeaturedWork() {
  const homeowner = projects.find((p) => p.slug === 'homeowner-loss-prediction')!;
  return (
    <div style={{ position: 'relative', zIndex: 20, background: 'var(--background)', padding: 'clamp(40px, 6vw, 80px) clamp(16px, 4vw, 52px)' }}>
      {/* Old links from before the redesign: /#projects lands on the work. */}
      <span id="projects" aria-hidden style={{ position: 'absolute', top: 0, left: 0, width: 1, height: 1 }} />
      <div style={{ maxWidth: 1280, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 'clamp(32px, 4vw, 56px)' }}>
        <section id="toledo-football-iq" aria-labelledby="toledo-football-iq-title" style={{ scrollMarginTop: 72 }}>
          <FootballIQFeature />
        </section>
        <section id="homeowner-loss-prediction" aria-labelledby="homeowner-loss-prediction-title" style={{ scrollMarginTop: 72 }}>
          <ProjectPanel project={homeowner} />
        </section>
      </div>
    </div>
  );
}

const label: React.CSSProperties = { fontFamily: MONO, fontSize: 14 };

/** A project as a full-width panel: its picture beside its description, tools, links and details. */
function ProjectPanel({ project: p }: { project: Project }) {
  const { open } = useProjectModal();
  return (
    <div className="project-panel" style={{ '--tile': p.color } as React.CSSProperties}>
      <div className="project-panel-media">
        <Pic src={p.image} alt={p.title} sizes="(max-width: 900px) 92vw, 600px" style={{ display: 'block', width: '100%', height: '100%', objectFit: 'contain' }} />
      </div>
      <div className="project-panel-body">
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '8px 16px' }}>
          <span style={{ ...label, color: p.color }}>{p.domain} · {p.idx}</span>
          <span style={{ ...label, color: STATUS_COLOR[p.status], display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <span aria-hidden style={{ width: 6, height: 6, borderRadius: '50%', background: STATUS_COLOR[p.status] }} />
            {projectStatusLabel[p.status]}
          </span>
        </div>
        <div style={{ ...label, color: 'var(--text2)', marginTop: 10 }}>{p.tag}</div>
        <h3 id={`${p.slug}-title`} style={{ fontFamily: SERIF, fontWeight: 400, fontSize: 'var(--fs-section-head)', lineHeight: 1.05, letterSpacing: '-0.02em', color: 'var(--foreground)', margin: '8px 0 0' }}>{p.title}</h3>
        <div style={{ ...label, color: `color-mix(in srgb, ${p.color} 70%, #f4f4f2)`, marginTop: 10 }}>{p.headline}</div>
        <p style={{ fontFamily: SANS, fontSize: 16, lineHeight: 1.7, color: 'var(--foreground)', marginTop: 14, maxWidth: 560 }}>{p.story}</p>
        {/* tools, directly below the description */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 16 }}>
          {p.stacks.map((t) => <Tag key={t} size={14}>{t}</Tag>)}
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 24 }}>
          {p.links.map((l, i) => {
            const style: React.CSSProperties = i === 0
              ? { ...label, display: 'inline-flex', alignItems: 'center', padding: '10px 18px', borderRadius: 5, background: p.color, color: 'var(--background)', fontWeight: 700 }
              : { ...label, display: 'inline-flex', alignItems: 'center', padding: '10px 18px', borderRadius: 5, background: 'var(--background)', border: '1px solid var(--text2)', color: 'var(--foreground)' };
            if (l.kind === 'case-study') return <Link key={l.href} href={l.href} transitionTypes={['nav-forward']} style={style}>{l.label} ↗</Link>;
            return <a key={l.href} href={l.href} target="_blank" rel="noopener" style={style}>{l.label} {l.kind === 'pdf' ? '↓' : '↗'}</a>;
          })}
          <button type="button" onClick={() => open(p)} aria-label={`${p.title} - open project details`} style={{ ...label, display: 'inline-flex', alignItems: 'center', padding: '10px 18px', borderRadius: 5, background: 'var(--background)', border: '1px solid var(--text2)', color: 'var(--foreground)', cursor: 'pointer' }}>
            Details →
          </button>
        </div>
      </div>
      <style>{`
        .project-panel { display: grid; grid-template-columns: minmax(0, 46fr) minmax(0, 54fr); border: 1px solid color-mix(in srgb, var(--tile) 28%, transparent); border-radius: 10px; overflow: hidden; background: var(--surface); }
        .project-panel-media { min-height: 260px; display: flex; align-items: center; background: var(--foreground); } /* light backing for the white diagram (the lightest token) */
        .project-panel-body { padding: clamp(20px, 3.5vw, 44px); }
        @media (max-width: 900px) { .project-panel { grid-template-columns: minmax(0, 1fr); } .project-panel-media { min-height: 0; aspect-ratio: 16/10; } }
      `}</style>
    </div>
  );
}
