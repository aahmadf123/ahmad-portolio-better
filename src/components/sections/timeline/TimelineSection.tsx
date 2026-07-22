'use client';

import React, { useEffect, useMemo, useRef } from 'react';
import { gsap, refreshOnFontsReady } from '@/lib/motion/gsap';
import { Section, SH } from '@/components/shared/section-helpers';
import { jobs, type Job } from '@/lib/data/jobs';
import { education } from '@/lib/data/education';
import { awards, type Award } from '@/lib/data/awards';
import { sectionById } from '@/lib/data/sections';
import { TimelineNode, type TimelineEntry } from './TimelineNode';

/**
 * Kinetic career strip: jobs, education, and milestone awards merged into one
 * dated line that draws itself as you scroll (GSAP scrub). Nodes slide in from
 * alternating sides; gold milestones burst. All job/education content from the
 * old Experience section lives inside the expandable nodes, unchanged.
 */
export function TimelineSection() {
  const def = sectionById('timeline')!;
  const wrapRef = useRef<HTMLDivElement>(null);

  const entries = useMemo<TimelineEntry[]>(() => {
    const jobEntries: TimelineEntry[] = jobs.map((j: Job) => ({
      kind: 'job',
      id: j.id,
      date: j.startDate,
      milestone: !!j.milestone,
      job: j,
    }));
    const awardEntries: TimelineEntry[] = awards
      .filter((a: Award) => a.milestone)
      .map((a) => ({ kind: 'award', id: a.title, date: a.startDate, milestone: true, award: a }));
    const eduEntry: TimelineEntry = {
      kind: 'education',
      id: 'utoledo',
      date: education.startDate,
      milestone: false,
    };
    return [...jobEntries, ...awardEntries, eduEntry].sort((a, b) => (a.date < b.date ? 1 : -1));
  }, []);

  // Scroll-scrubbed line draw
  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const fill = wrap.querySelector<HTMLElement>('[data-tl-fill]');
      if (fill) fill.style.transform = 'scaleY(1)';
      return;
    }
    const ctx = gsap.context(() => {
      const fill = wrap.querySelector<HTMLElement>('[data-tl-fill]');
      if (!fill) return;
      gsap.fromTo(
        fill,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: 'none',
          scrollTrigger: { trigger: wrap, start: 'top 72%', end: 'bottom 58%', scrub: 1 },
        }
      );
    }, wrap);
    refreshOnFontsReady();
    return () => ctx.revert();
  }, []);

  return (
    <Section id="timeline" style={{ background: 'rgba(17,19,26,0.85)' }}>
      <SH n={def.n} label="Timeline" sub="Career and education as one continuous line. Newest first, then back to the origin story." color={def.color} />

      <div ref={wrapRef} className="tl-wrap" style={{ position: 'relative', padding: '10px 0 30px' }}>
        {/* the line */}
        <div aria-hidden className="tl-line" style={{ position: 'absolute', top: 0, bottom: 0, left: '50%', width: 2, transform: 'translateX(-50%)', background: 'var(--bd)', borderRadius: 2, overflow: 'hidden' }}>
          <div data-tl-fill style={{ position: 'absolute', inset: 0, transformOrigin: 'top', transform: 'scaleY(0)', background: 'linear-gradient(to bottom, var(--primary), color-mix(in srgb, var(--primary) 55%, var(--gold)))', boxShadow: '0 0 12px rgba(45,212,191,0.5)' }} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(18px, 2.4vw, 30px)' }}>
          {entries.map((entry, i) => (
            <TimelineNode key={entry.id} entry={entry} side={i % 2 === 0 ? 'left' : 'right'} accent={def.color} />
          ))}
        </div>

        {/* origin cap */}
        <div aria-hidden style={{ position: 'absolute', bottom: 0, left: '50%', transform: 'translate(-50%, 50%)', width: 10, height: 10, borderRadius: '50%', border: '2px solid var(--gold)', background: 'var(--background)' }} className="tl-cap" />
      </div>

      <style>{`
        @media (max-width: 820px) {
          .tl-line { left: 14px !important; }
          .tl-cap { left: 14px !important; }
        }
      `}</style>
    </Section>
  );
}
