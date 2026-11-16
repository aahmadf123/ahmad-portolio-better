'use client';

import React from 'react';
import { MONO } from '@/components/shared/section-helpers';
import { projects, flagshipProject } from '@/lib/data/projects';
import type { World } from '@/lib/data/worlds';
import { ProjectPosterCard } from '@/components/sections/projects/ProjectPosterCard';
import { useProjectModal } from '@/components/sections/projects/ProjectModalProvider';
import { FootballIQFeature } from '@/components/sections/projects/FootballIQFeature';

/**
 * The calm part of a world, after its photo: the projects that belong to it (poster
 * cards that open the shared project modal), then anything special to this world
 * (Football IQ and its play diagram, the research paper, technical insights).
 */
export function WorldWork({ world, children }: { world: World; children?: React.ReactNode }) {
  const { open } = useProjectModal();
  const list = world.projectSlugs
    .map((slug) => projects.find((p) => p.slug === slug)!)
    .filter((p) => p !== flagshipProject);
  const hasFlagship = world.projectSlugs.includes(flagshipProject.slug!);

  return (
    <div style={{ background: 'var(--background)', padding: 'clamp(48px, 6vw, 88px) clamp(20px, 4vw, 52px)', position: 'relative', zIndex: 1 }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
          <span aria-hidden style={{ width: 22, height: 1.5, background: world.accent }} />
          <h3 style={{ margin: 0, fontFamily: MONO, fontWeight: 400, fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: world.accent }}>
            {world.n} · {world.label} · the work
          </h3>
        </div>
        {hasFlagship && <FootballIQFeature />}
        {list.length > 0 && (
          <div className="world-posters" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(300px, 100%), 1fr))', gap: 14, marginTop: hasFlagship ? 22 : 0 }}>
            {list.map((p) => (
              <div key={p.idx} style={{ minWidth: 0 }}>
                <ProjectPosterCard project={p} onOpen={open} />
              </div>
            ))}
          </div>
        )}
        {children && <div style={{ marginTop: 'clamp(40px, 5vw, 64px)', display: 'flex', flexDirection: 'column', gap: 'clamp(32px, 4vw, 48px)' }}>{children}</div>}
      </div>
    </div>
  );
}
