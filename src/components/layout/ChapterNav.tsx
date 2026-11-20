'use client';

import React, { useEffect, useId, useState } from 'react';
import { sections, type SectionDef } from '@/lib/data/sections';
import { MONO } from '@/components/shared/section-helpers';
import { useScrollSpy } from '@/components/ui/use-scroll-spy';

const CHAPTER_IDS = sections.map((s) => s.id);

const label = (s: SectionDef) => `${s.n ? `${s.n} · ` : ''}${s.label}`;

/**
 * Homepage chapter rail (wide desktop only). It sits in its own reserved column on the
 * left (globals.css pads the page by --rail-w while it is shown), so it never covers
 * the words, the artwork or the hero's links. Collapsed it shows a "Chapters" toggle
 * and the chapter you are in; expanded it lists every chapter, grouped as on the page.
 * Below 1200px it is not shown (the reading column would get cramped) and the header
 * nav takes over.
 */
export function ChapterNav() {
  const { active } = useScrollSpy(CHAPTER_IDS);
  const [open, setOpen] = useState(false);
  const listId = useId();
  const current = sections.find((s) => s.id === active) ?? sections[0];

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <nav aria-label="Chapters" className="chapter-nav" style={{ fontFamily: MONO }}>
      <button type="button" className="chapter-toggle" aria-expanded={open} aria-controls={listId} onClick={() => setOpen((o) => !o)}>
        <span>Chapters</span>
        <span aria-hidden className="chapter-chevron" data-open={open || undefined}>▾</span>
      </button>

      {!open && (
        <a href={`#${current.id}`} className="chapter-current" aria-current="true">
          <span aria-hidden className="chapter-dot" style={{ background: current.color }} />
          <span><span className="sr-only">Current chapter: </span>{label(current)}</span>
        </a>
      )}

      <ol id={listId} hidden={!open} className="chapter-list">
        {sections.map((s, i) => {
          const isActive = s.id === current.id;
          const startsGroup = s.group && sections[i - 1]?.group !== s.group;
          return (
            <li key={s.id} className={s.group ? 'in-group' : undefined}>
              {startsGroup && <div className="chapter-group" aria-hidden>{s.group}</div>}
              <a href={`#${s.id}`} aria-current={isActive ? 'true' : undefined} className="chapter-link" style={isActive ? { color: 'var(--foreground)' } : undefined}>
                <span aria-hidden className="chapter-dot" style={{ background: isActive ? s.color : 'var(--text3)' }} />
                <span>{label(s)}</span>
              </a>
            </li>
          );
        })}
      </ol>

      <style>{`
        .chapter-nav { display: none; }
        @media (min-width: 1200px) {
          .chapter-nav {
            display: block; position: fixed; left: 0; top: 0; bottom: 0; width: var(--rail-w); z-index: 60;
            background: var(--background); border-right: 1px solid var(--bd);
            padding: 78px 12px 104px; overflow-y: auto; overscroll-behavior: contain;
          }
        }
        .chapter-toggle {
          width: 100%; min-height: 40px; display: flex; align-items: center; justify-content: space-between; gap: 8px;
          padding: 8px 10px; border-radius: 5px; border: 1px solid var(--text2); background: var(--background);
          color: var(--foreground); font: inherit; font-size: 14px; cursor: pointer;
        }
        .chapter-toggle:hover { background: var(--surface-2); }
        .chapter-chevron { transition: transform .2s ease; }
        .chapter-chevron[data-open] { transform: rotate(180deg); }
        .chapter-current, .chapter-link {
          display: flex; align-items: flex-start; gap: 9px; min-height: 34px; min-width: 0; padding: 7px 10px; border-radius: 5px;
          font-size: 14px; line-height: 1.35; text-decoration: none;
        }
        .chapter-current { margin-top: 10px; color: var(--foreground); }
        .chapter-link { color: var(--text2); }
        .chapter-current:hover, .chapter-link:hover { background: var(--surface); color: var(--foreground); }
        .chapter-dot { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; margin-top: 6px; }
        .chapter-list { list-style: none; margin: 10px 0 0; padding: 0; display: flex; flex-direction: column; gap: 2px; }
        .chapter-list li.in-group .chapter-link { padding-left: 18px; }
        .chapter-group { font-size: 14px; line-height: 1.35; color: var(--foreground); padding: 12px 10px 4px; border-top: 1px solid var(--bd); margin-top: 6px; }
        .chapter-list li.in-group + li:not(.in-group) { border-top: 1px solid var(--bd); margin-top: 6px; padding-top: 6px; }
      `}</style>
    </nav>
  );
}
