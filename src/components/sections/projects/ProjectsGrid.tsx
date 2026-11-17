'use client';

import React, { useState } from 'react';
import { projects } from '@/lib/data/projects';
import { worlds, type WorldId } from '@/lib/data/worlds';
import { ProjectTileLink } from './ProjectTile';

const MONO = 'var(--font-code), monospace';

/**
 * Every project as one centred, ordered collection (journey order: Chem-E Car → AI
 * Engineering), with a row of side filters. Every tile opens its case study page.
 */
export function ProjectsGrid() {
  const [side, setSide] = useState<WorldId | 'all'>('all');
  const shown = worlds
    .filter((w) => side === 'all' || w.id === side)
    .flatMap((w) => w.projectSlugs.map((slug) => projects.find((p) => p.slug === slug)!));

  const chip = (active: boolean, accent: string): React.CSSProperties => ({
    fontFamily: MONO, fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase',
    padding: '8px 14px', borderRadius: 999, cursor: 'pointer',
    border: `1px solid ${active ? accent : 'var(--bd2)'}`,
    background: active ? `color-mix(in srgb, ${accent} 14%, transparent)` : 'transparent',
    color: active ? 'var(--foreground)' : 'var(--text2)',
    transition: 'border-color .25s, background .25s, color .25s',
  });

  return (
    <>
      <div role="group" aria-label="Filter by side" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 8, marginBottom: 'clamp(28px, 4vw, 44px)' }}>
        <button type="button" aria-pressed={side === 'all'} onClick={() => setSide('all')} style={chip(side === 'all', 'var(--primary)')}>
          All
        </button>
        {worlds.map((w) => (
          <button key={w.id} type="button" aria-pressed={side === w.id} onClick={() => setSide(w.id)} style={chip(side === w.id, w.accent)}>
            {w.label}
            <span aria-hidden style={{ marginLeft: 8, color: w.accent }}>{w.projectSlugs.length}</span>
          </button>
        ))}
      </div>
      <div data-testid="project-grid" className="project-tiles">
        {shown.map((p) => <ProjectTileLink key={p.idx} project={p} />)}
      </div>
    </>
  );
}
