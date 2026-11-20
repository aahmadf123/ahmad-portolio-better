'use client';

import React from 'react';
import { MONO } from '@/components/shared/section-helpers';
import { projects } from '@/lib/data/projects';
import { featuredProjectSlugs, type World } from '@/lib/data/worlds';
import { ProjectTile } from '@/components/sections/projects/ProjectTile';
import { useProjectModal } from '@/components/sections/projects/ProjectModalProvider';
import { jumpTo } from '@/components/ui/smooth-scroll';

const featured: readonly string[] = featuredProjectSlugs;

/**
 * The calm part of a world, after its photo: every project that belongs to it as an
 * equal-size tile (opens the shared project modal), then anything special to this world
 * (the research paper, technical insights). The featured projects (Football IQ and
 * Homeowner Loss Prediction) are shown below the hero instead (FeaturedWork).
 */
export function WorldWork({ world, anchors = [], children }: { world: World; anchors?: string[]; children?: React.ReactNode }) {
  const { open } = useProjectModal();
  const list = world.projectSlugs.filter((slug) => !featured.includes(slug)).map((slug) => projects.find((p) => p.slug === slug)!);
  const hasExtras = React.Children.toArray(children).length > 0;
  if (list.length === 0 && !hasExtras && anchors.length === 0) return null;

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
            jumpTo(window.scrollY); // keep the glide in step
          }
        };
        fix();
        window.addEventListener('scrollend', fix, { once: true });
        window.setTimeout(fix, 1200); // browsers without scrollend
      }}
      style={{ background: 'var(--background)', padding: 'clamp(48px, 6vw, 88px) clamp(20px, 4vw, 52px)', position: 'relative', zIndex: 1 }}>
      {anchors.map((a) => <span key={a} id={a} aria-hidden style={{ position: 'absolute', top: 0, left: 0, width: 1, height: 1 }} />)}
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 24 }}>
          <span aria-hidden style={{ width: 22, height: 1.5, background: world.accent }} />
          <h3 style={{ margin: 0, fontFamily: MONO, fontWeight: 400, fontSize: 14, color: world.accent }}>
            {world.n} · {world.label} · the work
          </h3>
          <span aria-hidden style={{ width: 22, height: 1.5, background: world.accent }} />
        </div>
        {list.length > 0 && (
          <div className="project-tiles">
            {list.map((p) => <ProjectTile key={p.idx} project={p} onOpen={open} />)}
          </div>
        )}
        {hasExtras && <div style={{ marginTop: list.length > 0 ? 'clamp(40px, 5vw, 64px)' : 0, display: 'flex', flexDirection: 'column', gap: 'clamp(32px, 4vw, 48px)' }}>{children}</div>}
      </div>
    </div>
  );
}
