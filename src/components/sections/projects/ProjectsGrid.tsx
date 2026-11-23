'use client';

import React, { useState } from 'react';
import { projects } from '@/lib/data/projects';
import { worlds, type WorldId } from '@/lib/data/worlds';
import { ProjectTileLink } from './ProjectTile';

/**
 * Every project as one centred, ordered collection (journey order: Chem-E Car → AI
 * Engineering), with a row of side filters. Every tile opens its case study page.
 */
export function ProjectsGrid() {
  const [side, setSide] = useState<WorldId | 'all'>('all');
  const shown = worlds
    .filter((w) => side === 'all' || w.id === side)
    .flatMap((w) => w.projectSlugs.map((slug) => projects.find((p) => p.slug === slug)!));

  const chip = (active: boolean): React.CSSProperties => ({
    font: 'inherit', fontSize: 15, padding: '0 2px', cursor: 'pointer', background: 'none', border: 0,
    borderBottom: `1px solid ${active ? 'var(--foreground)' : 'transparent'}`,
    color: active ? 'var(--foreground)' : 'var(--text2)',
    transition: 'color .2s, border-color .2s',
  });

  return (
    <>
      <div role="group" aria-label="Filter by side" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '4px 24px', marginBottom: 'clamp(28px, 4vw, 44px)' }}>
        <button type="button" aria-pressed={side === 'all'} onClick={() => setSide('all')} style={chip(side === 'all')}>
          All
        </button>
        {worlds.map((w) => (
          <button key={w.id} type="button" aria-pressed={side === w.id} onClick={() => setSide(w.id)} style={chip(side === w.id)}>
            {w.label}
            <span aria-hidden style={{ marginLeft: 6, color: 'var(--text3)' }}>{w.projectSlugs.length}</span>
          </button>
        ))}
      </div>
      <div data-testid="project-grid" className="project-tiles">
        {shown.map((p) => <ProjectTileLink key={p.idx} project={p} />)}
      </div>
    </>
  );
}
