'use client';

import React from 'react';
import { m } from 'framer-motion';
import Link from 'next/link';
import { MONO, SERIF, SANS } from '@/components/shared/section-helpers';
import { Pic } from '@/components/ui/pic';
import { projectStatusLabel, type Project } from '@/lib/data/projects';

const STATUS_COLOR: Record<Project['status'], string> = {
  live: 'var(--green)',
  'active-build': 'var(--red)',
  shipped: 'var(--primary)',
  research: 'var(--blue)',
};

/** The tile's contents, shared by the in-journey button and the /projects link. */
function TileBody({ p }: { p: Project }) {
  return (
    <>
      <span className="project-tile-media">
        <Pic src={p.image} alt="" sizes="(max-width: 420px) 100vw, 360px" />
        {p.imageIllustrative && <span className="illustrative-chip" style={{ position: 'absolute', left: 10, bottom: 10 }}>Illustrative example</span>}
        <span className="project-tile-chips">
          <span style={{ color: p.color }}>{p.domain} · {p.idx}</span>
          <span style={{ color: STATUS_COLOR[p.status], display: 'inline-flex', alignItems: 'center', gap: 5 }}>
            <span aria-hidden style={{ width: 5, height: 5, borderRadius: '50%', background: STATUS_COLOR[p.status] }} />
            {projectStatusLabel[p.status]}
          </span>
        </span>
      </span>
      <span className="project-tile-body">
        <span className="project-tile-title" style={{ fontFamily: SERIF }}>{p.title}</span>
        <span className="project-tile-headline" style={{ fontFamily: MONO, color: p.color }}>{p.headline}</span>
        <span className="project-tile-story" style={{ fontFamily: SANS }}>{p.story}</span>
        <span className="project-tile-stack">
          {p.stacks.map((t) => <span key={t} style={{ fontFamily: MONO }}>{t}</span>)}
        </span>
        <span className="project-tile-more" style={{ fontFamily: MONO, color: p.color }}>Details →</span>
      </span>
    </>
  );
}

/**
 * One project, the same size as every other: its own picture at full brightness, then
 * the title, headline, story and stack in fixed-height rows so every tile on the page
 * lines up. Click opens the shared details modal (layoutId morph into it).
 */
export function ProjectTile({ project: p, onOpen }: { project: Project; onOpen: (p: Project) => void }) {
  return (
    <m.button
      layoutId={`poster-${p.idx}`}
      type="button"
      onClick={() => onOpen(p)}
      data-testid="project-tile"
      className="project-tile"
      aria-label={`${p.title} - open project details`}
      style={{ '--tile': p.color } as React.CSSProperties}
    >
      <TileBody p={p} />
    </m.button>
  );
}

/** The same tile as a link to the project's own page (the /projects index). */
export function ProjectTileLink({ project: p }: { project: Project }) {
  return (
    <Link
      href={`/case-study/${p.slug}`}
      transitionTypes={['nav-forward']}
      data-testid="project-tile"
      className="project-tile"
      style={{ '--tile': p.color, textDecoration: 'none', color: 'inherit' } as React.CSSProperties}
    >
      <TileBody p={p} />
    </Link>
  );
}
