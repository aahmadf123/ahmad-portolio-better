'use client';

import React from 'react';
import Link from 'next/link';
import { Section, SH, Tag, useReveal, MONO, FG2 } from '@/components/shared/section-helpers';
import { ExpandableCard } from '@/components/ui/expandable-card';
import { projects, type Project, type ProjectLink } from '@/lib/data/projects';
import { sectionById } from '@/lib/data/sections';

/** Renders a project's structured detail sections inside the expandable modal. */
export function ProjectDetail({ project }: { project: Project }) {
  return (
    <>
      {project.detail.map((sec, i) => (
        <React.Fragment key={sec.label}>
          <h4 style={{ color: project.color, fontFamily: MONO, fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: i === 0 ? 0 : 16, marginBottom: 8 }}>{sec.label}</h4>
          <p>{sec.body}</p>
        </React.Fragment>
      ))}

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 14, marginBottom: 4 }}>
        {project.detailStacks.map(t => <Tag key={t}>{t}</Tag>)}
      </div>

      {project.links.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 22, paddingTop: 16, borderTop: `1px solid color-mix(in srgb, ${project.color} 13%, transparent)` }}>
          {project.links.map((l, i) => <ProjectLinkButton key={l.href} link={l} color={project.color} primary={i === 0} />)}
        </div>
      )}
    </>
  );
}

function ProjectLinkButton({ link, color, primary }: { link: ProjectLink; color: string; primary: boolean }) {
  const base: React.CSSProperties = {
    display: 'inline-flex', alignItems: 'center', gap: 6, padding: '9px 18px',
    fontFamily: MONO, fontSize: 10, letterSpacing: '0.06em', borderRadius: 5,
    textTransform: 'uppercase', textDecoration: 'none',
  };
  const style: React.CSSProperties = primary
    ? { ...base, background: color, color: 'var(--background)', fontWeight: 700 }
    : { ...base, border: `1px solid color-mix(in srgb, ${color} 35%, transparent)`, color };

  if (link.kind === 'case-study') {
    return <Link href={link.href} transitionTypes={['nav-forward']} style={style}>{link.label} ↗</Link>;
  }
  if (link.kind === 'anchor') {
    return (
      <a
        href={link.href}
        onClick={(e) => { e.preventDefault(); document.getElementById(link.href.slice(1))?.scrollIntoView({ behavior: 'smooth' }); }}
        style={{ ...style, cursor: 'pointer' }}
      >{link.label} ↓</a>
    );
  }
  const suffix = link.kind === 'pdf' ? '↓' : '↗';
  return <a href={link.href} target="_blank" rel="noopener" style={style}>{link.label} {suffix}</a>;
}

export function ProjectsSection() {
  const { ref, visible } = useReveal();
  const def = sectionById('projects')!;
  return (
    <Section id="projects">
      <SH n={def.n} label="Bodies of Work" sub="Each project a different operating condition. Click any card for the full case study." color={def.color} />
      <div ref={ref} className={`reveal ${visible ? 'in' : ''}`}
        style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
        {projects.map((p) => (
          <div key={p.title} style={{ gridColumn: `span ${p.span}` }}>
            <ExpandableCard
              title={p.title}
              src={p.image}
              description={`${p.domain.toUpperCase()} · ${p.idx}`}
              thumbnailAspect={p.span === 2 ? '16/7' : '4/3'}
              thumbnailSubtitle={p.headline}
              thumbnailTags={p.stacks}
              accentColor={p.color}
            >
              <ProjectDetail project={p} />
            </ExpandableCard>
          </div>
        ))}
      </div>
      <style>{`@media(max-width:900px){#projects .reveal{grid-template-columns:repeat(2,1fr)!important}#projects .reveal>div[style*="span 2"]{grid-column:span 2!important}}@media(max-width:600px){#projects .reveal{grid-template-columns:1fr!important}#projects .reveal>div[style*="span 2"]{grid-column:span 1!important}}`}</style>
    </Section>
  );
}
