import React from 'react';
import type { Metadata } from 'next';
import { SubpageHeader } from '@/components/layout/SubpageHeader';
import { PhotoBackdrop } from '@/components/journey/PhotoBackdrop';
import { ProjectTileLink } from '@/components/sections/projects/ProjectTile';
import { projects } from '@/lib/data/projects';
import { worlds } from '@/lib/data/worlds';

const DESCRIPTION = 'Every project in one place: AI engineering, research, sports analytics, data science and the Chem-E Car. Open any one for its full case study.';

export const metadata: Metadata = {
  title: 'Projects',
  description: DESCRIPTION,
  alternates: { canonical: 'https://ahmadfx.xyz/projects' },
  openGraph: {
    type: 'website',
    url: 'https://ahmadfx.xyz/projects',
    title: 'Projects · Ahmad Firas',
    description: DESCRIPTION,
    images: [{ url: '/Images/optimized/og.png', width: 1200, height: 630 }],
  },
  twitter: { card: 'summary_large_image', title: 'Projects · Ahmad Firas', description: DESCRIPTION, images: ['/Images/optimized/og.png'] },
};

const SERIF = 'var(--font-display), Georgia, serif';
const MONO = 'var(--font-code), monospace';

/**
 * All projects on one page (the homepage spreads them across the journey's worlds).
 * Grouped by the same five sides, newest side first as on the homepage; every tile
 * opens that project's own case study page.
 */
export default function ProjectsPage() {
  const groups = [...worlds].reverse().map((w) => ({
    world: w,
    list: w.projectSlugs.map((slug) => projects.find((p) => p.slug === slug)!),
  }));
  const total = groups.reduce((n, g) => n + g.list.length, 0);

  return (
    <div style={{ background: 'transparent', position: 'relative', isolation: 'isolate', color: 'var(--foreground)', minHeight: '100vh' }}>
      <PhotoBackdrop id="opening" />
      <SubpageHeader backHref="/" backLabel="Portfolio" />

      <div style={{ maxWidth: 1240, margin: '0 auto', padding: 'clamp(64px,9vw,120px) clamp(20px,4vw,52px) 96px' }}>
        <header style={{ marginBottom: 'clamp(40px, 6vw, 72px)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
            <span aria-hidden style={{ width: 28, height: 1.5, background: 'linear-gradient(90deg, var(--primary), var(--gold))', opacity: 0.8 }} />
            <span style={{ fontFamily: MONO, fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--primary)' }}>
              Projects · {total}
            </span>
          </div>
          <h1 style={{ fontFamily: SERIF, fontWeight: 400, fontSize: 'var(--text-3xl)', lineHeight: 1, letterSpacing: '-0.03em', margin: '0 0 20px', paddingBottom: '0.04em' }}>
            Everything I&apos;ve built,<br />
            <span style={{ color: 'var(--primary)', fontStyle: 'italic' }}>in one place.</span>
          </h1>
          <p style={{ fontFamily: 'var(--font-body), sans-serif', fontSize: 17, lineHeight: 1.75, color: 'var(--text2)', maxWidth: 580, margin: 0 }}>
            {DESCRIPTION}
          </p>
        </header>

        {groups.map(({ world, list }) => (
          <section key={world.id} aria-labelledby={`p-${world.id}`} style={{ marginBottom: 'clamp(44px, 6vw, 72px)' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 14, marginBottom: 20, borderBottom: '1px solid var(--bd)', paddingBottom: 12 }}>
              <h2 id={`p-${world.id}`} style={{ fontFamily: SERIF, fontWeight: 400, fontSize: 'var(--text-xl)', margin: 0, color: 'var(--foreground)' }}>
                {world.label}
              </h2>
              <span style={{ fontFamily: MONO, fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: world.accent }}>
                {world.years} · {list.length} {list.length === 1 ? 'project' : 'projects'}
              </span>
            </div>
            <div className="project-tiles" style={{ justifyContent: 'start' }}>
              {list.map((p) => <ProjectTileLink key={p.idx} project={p} />)}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
