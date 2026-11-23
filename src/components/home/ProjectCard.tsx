import React from 'react';
import Link from 'next/link';
import { Pic } from '@/components/ui/pic';
import { projectStatusLabel, type Project } from '@/lib/data/projects';

/**
 * A project inside its story chapter: the project's own picture at its real shape, then
 * what it is, the result, the one-line story and the tools, and the way into its page.
 */
export function ProjectCard({ p, i = 0 }: { p: Project; i?: number }) {
  return (
    <Link href={`/case-study/${p.slug}`} transitionTypes={['nav-forward']} className="pc rv" style={{ '--i': i, '--area': p.color } as React.CSSProperties}>
      <span className="pc-media lift-img"><Pic src={p.image} alt="" sizes="(max-width: 860px) 92vw, 520px" style={{ display: 'block', width: '100%', height: 'auto' }} /></span>
      <span className="pc-meta">
        <span className="tnum">{p.idx} · {p.domain}</span>
        <span className="pc-status"><i aria-hidden />{projectStatusLabel[p.status]}</span>
      </span>
      <span className="pc-title">{p.title}<span aria-hidden className="pc-arrow"> →</span></span>
      <span className="pc-tag">{p.tag}</span>
      <span className="pc-headline">{p.headline}</span>
      <span className="pc-story">{p.story}</span>
      <span className="pc-tools">{p.stacks.join(' · ')}</span>
      <span className="pc-more">Read the case study →</span>
    </Link>
  );
}
