import React from 'react';
import Link from 'next/link';
import { projects, projectStatusLabel, type Project } from '@/lib/data/projects';
import { worlds, featuredProjectSlugs, type WorldId } from '@/lib/data/worlds';
import { accentInk } from '@/lib/accent';
import { Pic } from '@/components/ui/pic';

/**
 * Every project, grouped by the path it belongs to. The first three groups are the
 * three nodes on the hero's flight path (their anchors are the node links); the other
 * two worlds follow. Rows are plain type: index, title, the one result that matters,
 * the one-line story and the tools, each a link to the case study.
 */
const GROUPS: { world: WorldId; anchor: string; label: string }[] = [
  { world: 'ai-engineering', anchor: 'path-agentic-ai', label: 'Agentic AI' },
  { world: 'research', anchor: 'path-uav-research', label: 'UAV Research' },
  { world: 'sports-analytics', anchor: 'path-sports-analytics', label: 'Sports Analytics' },
  { world: 'data-science', anchor: 'path-data-science', label: 'Data Science' },
  { world: 'chem-e-car', anchor: 'path-chem-e-car', label: 'Chem-E Car (AIChE)' },
];

const FEATURED: readonly string[] = featuredProjectSlugs;

export function WorkIndex() {
  return (
    <section id="work" aria-labelledby="work-title" className="wi">
      <div className="wrap">
        <div className="wi-head rv">
          <h2 id="work-title" className="wi-title draw-rule">Work</h2>
          <p className="wi-lede">
            Eight more projects, beyond the two above. Each one is a different way of
            dealing with data, environments or people that don&apos;t behave as planned.
          </p>
          <Link href="/projects" className="text-link is-underlined wi-all">All projects with pictures →</Link>
        </div>

        {GROUPS.map((g) => {
          const w = worlds.find((x) => x.id === g.world)!;
          // The featured projects are shown in full above; the list holds the rest.
          const list = w.projectSlugs.filter((slug) => !FEATURED.includes(slug)).map((slug) => projects.find((p) => p.slug === slug)!);
          if (list.length === 0) return null;
          return (
            <div key={g.anchor} id={g.anchor} className="wi-group" aria-labelledby={`${g.anchor}-h`}>
              <div className="wi-group-head rv">
                <h3 id={`${g.anchor}-h`} className="wi-group-title">
                  <span aria-hidden className="wi-dot" />
                  {g.label}
                </h3>
                <span className="wi-group-years tnum">{w.years}</span>
              </div>
              <ol className="wi-rows">
                {list.map((p, i) => <Row key={p.idx} p={p} i={i} />)}
              </ol>
            </div>
          );
        })}
      </div>
      <style>{`
        .wi { padding: clamp(80px, 12vw, 160px) 0 clamp(40px, 6vw, 80px); scroll-margin-top: 0; }
        .wi-head { display: grid; grid-template-columns: minmax(0, 5fr) minmax(0, 7fr); gap: 16px 40px; align-items: end; margin-bottom: clamp(40px, 6vw, 80px); }
        .wi-title { font-size: clamp(40px, 5vw, 72px); font-weight: 400; letter-spacing: -0.03em; line-height: 1; }
        .wi-lede { color: var(--text2); max-width: 34em; font-size: 18px; }
        .wi-all { grid-column: 2; justify-self: start; font-size: 15px; }
        .wi-group { scroll-margin-top: 24px; margin-top: clamp(40px, 5vw, 64px); }
        .wi-group-head { display: flex; align-items: baseline; justify-content: space-between; gap: 16px; padding-bottom: 14px; border-bottom: 1px solid var(--foreground); }
        .wi-group-title { display: inline-flex; align-items: center; gap: 12px; font-size: 22px; font-weight: 400; letter-spacing: -0.015em; }
        .wi-dot { width: 7px; height: 7px; border-radius: 50%; background: var(--text2); }
        .wi-group:target .wi-dot { background: var(--primary-fill); }
        .wi-group-years { color: var(--text3); font-size: 15px; }
        .wi-rows { list-style: none; }
        .wi-row { border-bottom: 1px solid var(--bd); }
        .wi-link { position: relative; transition: background-color .3s, padding .3s; border-radius: 3px; display: grid; grid-template-columns: 3.2em minmax(0, 4fr) minmax(0, 5fr) 7.5em; gap: 8px 28px; padding: 22px 0; align-items: baseline; color: inherit; }
        .wi-idx { color: var(--text3); font-size: 15px; }
        .wi-thumb { display: block; width: 128px; aspect-ratio: 16 / 10; border-radius: 2px; overflow: hidden; background: var(--surface); margin-bottom: 14px; }
        .wi-thumb img { display: block; width: 100%; height: 100%; object-fit: contain; transition: opacity .25s; }
        .wi-link:hover .wi-thumb img { opacity: .85; }
        .wi-name { font-size: clamp(20px, 1.7vw, 24px); line-height: 1.2; letter-spacing: -0.015em; color: var(--foreground); }
        .wi-name-arrow { display: inline-block; margin-left: .35em; color: var(--text3); transition: transform .25s, color .25s; }
        .wi-link:hover .wi-name-arrow, .wi-link:focus-visible .wi-name-arrow { transform: translateX(6px); color: var(--foreground); }
        .wi-link:is(:hover, :focus-visible) { background: var(--surface); padding-left: 14px; padding-right: 14px; }
        .wi-name { background: linear-gradient(currentColor, currentColor) 0 100% / 0 1px no-repeat; transition: background-size .4s cubic-bezier(.2,.7,.2,1); }
        .wi-link:is(:hover, :focus-visible) .wi-name { background-size: 100% 1px; }
        .wi-tag { display: block; margin-top: 6px; font-size: 14px; color: var(--text3); }
        .wi-result { font-size: 16px; line-height: 1.45; }
        .wi-story { display: block; margin-top: 6px; font-size: 15px; line-height: 1.5; color: var(--text2); }
        .wi-tools { display: block; margin-top: 10px; font-size: 14px; color: var(--text3); }
        .wi-status { justify-self: end; display: inline-flex; align-items: center; gap: 8px; font-size: 14px; color: var(--text2); white-space: nowrap; }
        .wi-status i { width: 6px; height: 6px; border-radius: 50%; }
        @media (max-width: 860px) {
          .wi-head { grid-template-columns: minmax(0, 1fr); }
          .wi-all { grid-column: 1; }
          .wi-link { grid-template-columns: 2.4em minmax(0, 1fr); }
          .wi-result, .wi-status { grid-column: 2; }
          .wi-status { justify-self: start; }
        }
      `}</style>
    </section>
  );
}

function Row({ p, i }: { p: Project; i: number }) {
  return (
    <li className="wi-row rv" style={{ '--i': i } as React.CSSProperties}>
      <Link href={`/case-study/${p.slug}`} transitionTypes={['nav-forward']} className="wi-link">
        <span className="wi-idx tnum">{p.idx}</span>
        <span>
          <span className="wi-thumb lift-img"><Pic src={p.image} alt="" sizes="160px" /></span>
          <span className="wi-name">{p.title}<span aria-hidden className="wi-name-arrow">→</span></span>
          <span className="wi-tag">{p.tag}</span>
        </span>
        <span className="wi-result">
          <span style={{ color: accentInk(p.color) }}>{p.headline}</span>
          <span className="wi-story">{p.story}</span>
          <span className="wi-tools">{p.stacks.join(' · ')}</span>
        </span>
        <span className="wi-status">
          <i aria-hidden style={{ background: p.color }} />
          {projectStatusLabel[p.status]}
        </span>
      </Link>
    </li>
  );
}
