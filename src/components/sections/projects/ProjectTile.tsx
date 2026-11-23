'use client';

import React from 'react';
import { m } from 'framer-motion';
import Link from 'next/link';
import { accentInk } from '@/lib/accent';
import { Pic } from '@/components/ui/pic';
import { projectStatusLabel, type Project } from '@/lib/data/projects';

/** The tile's contents, shared by the in-journey button and the /projects link. */
function TileBody({ p }: { p: Project }) {
  return (
    <>
      <span className="project-tile-media">
        <Pic src={p.image} alt="" sizes="(max-width: 420px) 100vw, 360px" />
        {p.imageIllustrative && <span className="illustrative-chip" style={{ position: 'absolute', left: 10, bottom: 10 }}>Illustrative example</span>}
        <span className="project-tile-chips">
          <span>{p.domain} · {p.idx}</span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <span aria-hidden style={{ width: 6, height: 6, borderRadius: '50%', background: p.color }} />
            {projectStatusLabel[p.status]}
          </span>
        </span>
      </span>
      <span className="project-tile-body">
        <span className="project-tile-title">{p.title}</span>
        <span className="project-tile-headline" style={{ color: accentInk(p.color) }}>{p.headline}</span>
        <span className="project-tile-story">{p.story}</span>
        <span className="project-tile-stack">
          {p.stacks.map((t) => <span key={t}>{t}</span>)}
        </span>
        <span className="project-tile-more">{p.detailsLabel ?? 'Details →'}</span>
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
