'use client';

import React, { useCallback, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { Section, SH, MONO } from '@/components/shared/section-helpers';
import { sectionById } from '@/lib/data/sections';
import type { SkillNode } from '@/lib/data/skills';
import { SkillListFallback } from './SkillListFallback';
import { RadialSkills } from './RadialSkills';
import { SkillDetailCard } from './SkillDetailCard';
import { ConstellationLegend } from './ConstellationLegend';

/** The constellation's own height (ConstellationCanvas), reserved before it loads. */
const CANVAS_H = 'clamp(420px, 58vh, 620px)';
const placeholder = <div aria-hidden style={{ height: CANVAS_H, borderRadius: 10, border: '1px solid var(--bd)' }} />;

const ConstellationCanvas = dynamic(
  () => import('./ConstellationCanvas').then((m) => ({ default: m.ConstellationCanvas })),
  { ssr: false, loading: () => placeholder }
);

type Mode = 'pending' | 'constellation' | 'radial' | 'list';

/**
 * Skills as an interactive constellation (desktop, fine pointer, motion OK),
 * a swipeable radial carousel (touch), or the full chip inventory (reduced
 * motion / by choice). All 88 skills stay reachable as text in every mode.
 */
export function SkillsSection() {
  const def = sectionById('skills')!;
  const [mode, setMode] = useState<Mode>('pending');
  const [near, setNear] = useState(false);
  const [listOpen, setListOpen] = useState(false);
  const [selected, setSelected] = useState<SkillNode | null>(null);
  const [focusGroup, setFocusGroup] = useState<string | null>(null);

  // Pick the layout as soon as the page starts, so the section never changes height
  // while someone is scrolling (a mid-scroll resize re-lays out the whole long page).
  // three.js (~130KB) still only loads when the section is about a screen away, so it
  // never competes with the journey's opening photo; until then its space is reserved.
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const fine = window.matchMedia('(pointer: fine) and (min-width: 860px)').matches;
    setMode(reduced ? 'list' : fine ? 'constellation' : 'radial');
    const el = document.getElementById('skills');
    if (!el || !('IntersectionObserver' in window)) { setNear(true); return; }
    const io = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) { io.disconnect(); setNear(true); }
    }, { rootMargin: '900px 0px' });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const onSelect = useCallback((node: SkillNode | null) => setSelected(node), []);

  return (
    <Section id="skills">
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 14, flexWrap: 'wrap' }}>
        <SH n={def.n} label="Capabilities" sub="The stack as a constellation: clusters that orbit each other, with stars sized by how often they carry real work." color={def.color} variant="sub" />
        {mode === 'constellation' && (
          <button
            onClick={() => setListOpen((v) => !v)}
            aria-pressed={listOpen}
            style={{ fontFamily: MONO, fontSize: 10, letterSpacing: '0.09em', textTransform: 'uppercase', padding: '8px 16px', borderRadius: 5, border: '1px solid var(--bd2)', background: listOpen ? 'rgba(45,212,191,0.1)' : 'transparent', color: listOpen ? 'var(--primary)' : 'var(--text3)', cursor: 'pointer', marginBottom: 52 }}
          >
            {listOpen ? 'Hide list' : 'View as list'}
          </button>
        )}
      </div>

      {mode === 'constellation' && (
        <>
          <ConstellationLegend focus={focusGroup} onToggle={setFocusGroup} />
          <div style={{ position: 'relative' }}>
            {near ? <ConstellationCanvas focusGroup={focusGroup} onSelect={onSelect} /> : placeholder}
            <SkillDetailCard node={selected} onClose={() => setSelected(null)} />
          </div>
        </>
      )}
      {mode === 'radial' && <RadialSkills />}
      {(mode === 'list' || mode === 'pending') && <SkillListFallback />}

      {/* the full inventory stays in the DOM for search/SR; visually revealed on toggle */}
      {mode === 'constellation' && (
        <div style={listOpen ? { marginTop: 20 } : { position: 'absolute', width: 1, height: 1, overflow: 'hidden', clipPath: 'inset(50%)' }} aria-hidden={false}>
          <SkillListFallback />
        </div>
      )}
    </Section>
  );
}
