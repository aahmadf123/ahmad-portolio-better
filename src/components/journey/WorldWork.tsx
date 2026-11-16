'use client';

import React from 'react';
import { MONO } from '@/components/shared/section-helpers';
import { projects, flagshipProject } from '@/lib/data/projects';
import type { World } from '@/lib/data/worlds';
import { ProjectTile } from '@/components/sections/projects/ProjectTile';
import { useProjectModal } from '@/components/sections/projects/ProjectModalProvider';
import dynamic from 'next/dynamic';

// Split out (still server-rendered): GSAP and the play diagram (~140KB) stay off the
// critical path of the opening photo.
const FootballIQFeature = dynamic(() => import('@/components/sections/projects/FootballIQFeature').then((m) => ({ default: m.FootballIQFeature })));

/**
 * The calm part of a world, after its photo: every project that belongs to it as an
 * equal-size tile (opens the shared project modal), then anything special to this world
 * (Football IQ's deep dive with its play diagram, the research paper, technical insights).
 */
export function WorldWork({ world, anchors = [], children }: { world: World; anchors?: string[]; children?: React.ReactNode }) {
  const { open } = useProjectModal();
  const list = world.projectSlugs.map((slug) => projects.find((p) => p.slug === slug)!);
  const hasFlagship = list.includes(flagshipProject);

  return (
    // No content-visibility here on purpose: skipped worlds change size mid-scroll, which
    // made header links and keyboard focus land in the wrong place.
    <div
      id={`${world.id}-work`}
      // Keyboard focus: the browser's smooth focus-scroll stalls over this long page of
      // pinned scenes and can leave the focused card off screen. Bring it into view right
      // away (instant, so there is nothing left for the smooth scroll to do), and check
      // again once scrolling settles.
      onFocusCapture={(e) => {
        const el = e.target as HTMLElement;
        const fix = () => {
          const r = el.getBoundingClientRect();
          if (document.activeElement === el && (r.top < 0 || r.bottom > window.innerHeight)) {
            el.scrollIntoView({ block: 'nearest', behavior: 'instant' as ScrollBehavior });
          }
        };
        fix();
        window.addEventListener('scrollend', fix, { once: true });
        window.setTimeout(fix, 1200); // browsers without scrollend
      }}
      style={{ background: 'var(--background)', padding: 'clamp(48px, 6vw, 88px) clamp(20px, 4vw, 52px)', position: 'relative', zIndex: 1 }}>
      {anchors.map((a) => <span key={a} id={a} aria-hidden style={{ position: 'absolute', top: 0, left: 0, width: 1, height: 1 }} />)}
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
          <span aria-hidden style={{ width: 22, height: 1.5, background: world.accent }} />
          <h3 style={{ margin: 0, fontFamily: MONO, fontWeight: 400, fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: world.accent }}>
            {world.n} · {world.label} · the work
          </h3>
        </div>
        <div className="project-tiles">
          {list.map((p) => <ProjectTile key={p.idx} project={p} onOpen={open} />)}
        </div>
        {hasFlagship && <div style={{ marginTop: 'clamp(40px, 5vw, 64px)' }}><FootballIQFeature /></div>}
        {children && <div style={{ marginTop: 'clamp(40px, 5vw, 64px)', display: 'flex', flexDirection: 'column', gap: 'clamp(32px, 4vw, 48px)' }}>{children}</div>}
      </div>
    </div>
  );
}
