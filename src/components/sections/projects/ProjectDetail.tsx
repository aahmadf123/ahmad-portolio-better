'use client';

import React from 'react';
import Link from 'next/link';
import { MONO, Tag } from '@/components/shared/section-helpers';
import type { Project, ProjectLink } from '@/lib/data/projects';

/** Renders a project's structured detail sections (used inside the modal). */
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
