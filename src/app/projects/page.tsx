import React from 'react';
import type { Metadata } from 'next';
import { SubpageHeader } from '@/components/layout/SubpageHeader';
import { ProjectsGrid } from '@/components/sections/projects/ProjectsGrid';
import { projects } from '@/lib/data/projects';

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

/** All projects on one page, filterable by side; every tile opens its case study. */
export default function ProjectsPage() {
  return (
    <>
      <SubpageHeader backHref="/" backLabel="Home" restoreScroll />
      <div className="wrap" style={{ paddingTop: 'clamp(48px, 8vw, 112px)', paddingBottom: 96 }}>
        <header style={{ maxWidth: 760, margin: '0 auto clamp(32px, 5vw, 56px)', textAlign: 'center' }}>
          <p style={{ fontSize: 15, color: 'var(--text2)' }}>Projects · {projects.length}</p>
          <h1 style={{ fontWeight: 400, fontSize: 'clamp(40px, 5.4vw, 80px)', lineHeight: 1.02, letterSpacing: '-0.035em', margin: '12px 0 20px' }}>
            Everything I&apos;ve built,<br />in one place.
          </h1>
          <p style={{ fontSize: 18, color: 'var(--text2)', maxWidth: '34em', margin: '0 auto' }}>{DESCRIPTION}</p>
        </header>
        <ProjectsGrid />
      </div>
    </>
  );
}
