'use client';

import React, { useMemo, useState } from 'react';
import { AnimatePresence, m, useReducedMotion } from 'framer-motion';
import { Section, SH, MONO } from '@/components/shared/section-helpers';
import { projects, projectCategories, type Project, type ProjectCategory } from '@/lib/data/projects';
import { sectionById } from '@/lib/data/sections';
import { ProjectPosterCard } from './ProjectPosterCard';
import { ProjectDetailModal } from './ProjectDetailModal';
import { FootballIQFeature } from './FootballIQFeature';

/**
 * Dynamic showcase gallery: the Football-IQ flagship panel on top (always
 * visible), then category filters re-flowing a bento grid of movie-poster
 * cards. Clicking a poster morphs it into the detail modal.
 */
export function ProjectsSection() {
  const def = sectionById('projects')!;
  const reduced = useReducedMotion();
  const [category, setCategory] = useState<ProjectCategory | 'all'>('all');
  const [openProject, setOpenProject] = useState<Project | null>(null);

  const gridProjects = useMemo(
    () => projects.filter((p) => !p.flagship && (category === 'all' || p.category === category)),
    [category]
  );

  return (
    <Section id="projects">
      <SH n={def.n} label="Bodies of Work" sub="Each project a different operating condition. Hover a poster for the story; click for the full picture." color={def.color} />

      <FootballIQFeature />

      {/* filter chips */}
      <div role="tablist" aria-label="Filter projects by category" style={{ display: 'flex', flexWrap: 'wrap', gap: 8, margin: '4px 0 22px' }}>
        {projectCategories.map((c) => {
          const active = category === c.id;
          return (
            <button
              key={c.id}
              role="tab"
              aria-selected={active}
              onClick={() => setCategory(c.id)}
              style={{
                fontFamily: MONO, fontSize: 10, letterSpacing: '0.09em', textTransform: 'uppercase',
                padding: '7px 15px', borderRadius: 99, cursor: 'pointer',
                border: `1px solid ${active ? 'var(--primary)' : 'var(--bd2)'}`,
                background: active ? 'rgba(45,212,191,0.12)' : 'transparent',
                color: active ? 'var(--primary)' : 'var(--text3)',
                transition: 'all 0.2s ease',
              }}
            >
              {c.label}
            </button>
          );
        })}
        <span aria-live="polite" style={{ fontFamily: MONO, fontSize: 10, color: 'var(--text3)', alignSelf: 'center', marginLeft: 'auto', letterSpacing: '0.06em' }}>
          {gridProjects.length} / {projects.length - 1}
        </span>
      </div>

      {/* bento poster grid */}
      <m.div layout={!reduced} className="poster-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
        <AnimatePresence mode="popLayout" initial={false}>
          {gridProjects.map((p) => (
            <m.div
              key={p.idx}
              layout={!reduced}
              initial={reduced ? false : { opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={reduced ? undefined : { opacity: 0, scale: 0.96 }}
              transition={{ duration: reduced ? 0 : 0.22, ease: [0.16, 1, 0.3, 1] }}
              style={{ gridColumn: p.span === 2 ? 'span 2' : 'span 1', minWidth: 0 }}
            >
              <ProjectPosterCard project={p} onOpen={setOpenProject} />
            </m.div>
          ))}
        </AnimatePresence>
      </m.div>

      <ProjectDetailModal project={openProject} onClose={() => setOpenProject(null)} />

      <style>{`
        @media (max-width: 900px) {
          .poster-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 600px) {
          .poster-grid { grid-template-columns: 1fr !important; }
          .poster-grid > div { grid-column: span 1 !important; }
        }
      `}</style>
    </Section>
  );
}
