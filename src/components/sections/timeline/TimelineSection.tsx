'use client';

import React from 'react';
import { SH } from '@/components/shared/section-helpers';
import { Pic } from '@/components/ui/pic';
import { jobs, type Job } from '@/lib/data/jobs';
import { education } from '@/lib/data/education';

const UT_LOGO = '/Images/VERT%20UToledo%20Logos%202019%20OL_RGB_VERT%20Reverse.png';

type Entry =
  | { kind: 'job'; id: string; date: string; job: Job }
  | { kind: 'education'; id: string; date: string };

/**
 * Jobs and education as one dated list, newest first (awards live under Credentials).
 * Each row shows the logo, role, place and dates; click it to open the full description,
 * achievements and stack. The newest role starts open.
 */
export function TimelineSection() {
  const entries: Entry[] = [
    ...jobs.map((j): Entry => ({ kind: 'job', id: j.id, date: j.startDate, job: j })),
    { kind: 'education' as const, id: 'utoledo', date: education.startDate },
  ].sort((a, b) => (a.date < b.date ? 1 : -1));
  const [open, setOpen] = React.useState<Set<string>>(() => new Set([entries[0].id]));
  const toggle = (id: string) => setOpen((prev) => {
    const next = new Set(prev);
    if (next.has(id)) next.delete(id); else next.add(id);
    return next;
  });
  const allOpen = open.size === entries.length;

  return (
    <section id="timeline" aria-label="Timeline" className="tl">
      <div className="wrap">
        <SH color="#a78bfa" label="Timeline" sub="Career and education as one continuous line. Newest first, then back to the origin story." variant="sub" />
        <div className="tl-wrap">
          <div className="tl-tools-bar">
            <button type="button" className="tl-all" onClick={() => setOpen(allOpen ? new Set() : new Set(entries.map((e) => e.id)))}>
              {allOpen ? 'Close all' : 'Open all'}
            </button>
          </div>
          <div aria-hidden className="tl-line"><div data-tl-fill className="tl-fill" /></div>
          <ol className="tl-list">
            {entries.map((e) => {
              const isOpen = open.has(e.id);
              const panelId = `tl-panel-${e.id}`;
              const color = e.kind === 'job' ? e.job.color : '#a78bfa';
              const logo = e.kind === 'job' ? e.job.logo : UT_LOGO;
              const org = e.kind === 'job' ? e.job.company : education.school;
              return (
                <li key={e.id} className={`tl-item rv${isOpen ? ' is-open' : ''}`} style={{ '--area': color } as React.CSSProperties}>
                  <span aria-hidden className="tl-dot rv-pop" />
                  <span className="tl-date tnum">{e.kind === 'job' ? e.job.period : education.period}</span>
                  <div className="tl-main">
                    <button type="button" className="tl-head" aria-expanded={isOpen} aria-controls={panelId} onClick={() => toggle(e.id)}>
                      <span className="tl-logo"><Pic src={logo} alt={`${org} logo`} sizes="64px" /></span>
                      <span className="tl-titles">
                        <span className="tl-kind">
                          {e.kind === 'job' ? `${e.job.type}${e.job.active ? ' · current' : ''}` : 'Education · where it begins'}
                        </span>
                        <span className="tl-role">{e.kind === 'job' ? e.job.role : education.school}</span>
                        <span className="tl-org">
                          {e.kind === 'job' ? `${e.job.company} · ${e.job.location}` : `${education.degree} · ${education.status} · GPA ${education.gpa}`}
                        </span>
                      </span>
                      <span className="tl-toggle" aria-hidden><i /></span>
                    </button>
                    {/* Kept in the page when closed (search, the content checks); hidden from
                        keyboard and screen readers until opened. */}
                    <div id={panelId} className="tl-panel" inert={!isOpen}>
                      <div className="tl-panel-inner">
                        {e.kind === 'job' ? (
                          <>
                            <p className="tl-desc">{e.job.description}</p>
                            <ul className="tl-ach">{e.job.achievements.map((a) => <li key={a}>{a}</li>)}</ul>
                            <p className="tl-tools">{e.job.stack.join(' · ')}</p>
                          </>
                        ) : (
                          <p className="tl-tools"><span>Coursework</span> {education.coursework.join(' · ')}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
      <style>{`
        .tl { padding: clamp(40px, 6vw, 80px) 0; }
        .tl-wrap { position: relative; }
        .tl-tools-bar { display: flex; justify-content: flex-end; margin-bottom: 8px; }
        .tl-all { background: none; border: 0; font: inherit; font-size: 15px; color: var(--text2); cursor: pointer; min-height: 44px; text-decoration: underline; text-decoration-color: var(--bd2); text-underline-offset: 5px; }
        .tl-all:hover { color: var(--foreground); }
        .tl-line { position: absolute; left: calc(11em + 15px); top: 52px; bottom: 0; width: 1px; background: var(--bd); }
        .tl-fill { position: absolute; inset: 0; background: var(--foreground); transform-origin: top; transform: scaleY(1); }
        .tl-list { list-style: none; border-top: 2px solid var(--area, var(--foreground)); }
        .tl-item { position: relative; display: grid; grid-template-columns: 11em minmax(0, 1fr); gap: 6px 32px; padding: 18px 0; border-bottom: 1px solid var(--bd); }
        .tl-dot { position: absolute; left: calc(11em + 10px); top: 40px; width: 11px; height: 11px; border-radius: 50%; background: var(--background); border: 2px solid var(--area); z-index: 1; }
        .tl-item.is-open .tl-dot, .tl-item:first-child .tl-dot { background: var(--area); }
        .tl-date { font-size: 15px; color: var(--text2); padding-top: 22px; }
        .tl-head { display: flex; align-items: center; gap: 18px; width: 100%; text-align: left; background: none; border: 0; font: inherit; color: inherit; cursor: pointer; padding: 6px 10px; margin: 0 -10px; border-radius: 4px; transition: background-color .25s; }
        .tl-head:hover, .tl-head:focus-visible { background: color-mix(in srgb, var(--area) 8%, var(--background)); }
        /* The logos are made for dark backgrounds, so they sit on a dark tile in both themes. */
        .tl-logo { flex: 0 0 64px; width: 64px; height: 64px; border-radius: 10px; background: #17181b; border: 1px solid color-mix(in srgb, var(--area) 50%, #2c2f36); display: grid; place-items: center; padding: 9px; overflow: hidden; }
        .tl-logo img { width: 100%; height: 100%; object-fit: contain; display: block; }
        .tl-titles { display: flex; flex-direction: column; min-width: 0; flex: 1; }
        .tl-kind { font-size: 14px; color: color-mix(in oklab, var(--area) var(--accent-mix), var(--foreground)); }
        .tl-role { font-size: 21px; letter-spacing: -0.015em; line-height: 1.3; }
        .tl-org { font-size: 15px; color: var(--text2); }
        .tl-toggle { flex: 0 0 36px; width: 36px; height: 36px; border-radius: 50%; border: 1px solid var(--bd2); display: grid; place-items: center; transition: background-color .25s, border-color .25s, transform .35s cubic-bezier(.2,.7,.2,1); }
        .tl-toggle i { position: relative; width: 12px; height: 12px; }
        .tl-toggle i::before, .tl-toggle i::after { content: ''; position: absolute; left: 0; top: 5.5px; width: 12px; height: 1.5px; background: currentColor; border-radius: 1px; transition: transform .35s cubic-bezier(.2,.7,.2,1); }
        .tl-toggle i::after { transform: rotate(90deg); }
        .tl-item.is-open .tl-toggle { background: var(--area); border-color: var(--area); color: #121314; }
        .tl-item.is-open .tl-toggle i::after { transform: rotate(0deg); }
        /* Opens smoothly: the panel's row grows from 0 to its content height. */
        .tl-panel { display: grid; grid-template-rows: 0fr; transition: grid-template-rows .45s cubic-bezier(.2,.7,.2,1); }
        .tl-item.is-open .tl-panel { grid-template-rows: 1fr; }
        .tl-panel-inner { overflow: hidden; padding-left: 82px; }
        .tl-panel-inner > :first-child { margin-top: 14px; }
        .tl-panel-inner > :last-child { margin-bottom: 8px; }
        .tl-desc { color: var(--text2); font-size: 16px; max-width: 44em; }
        .tl-ach { margin: 12px 0 0 1.1em; font-size: 15px; color: var(--text2); }
        .tl-ach li { margin-top: 4px; }
        .tl-ach li::marker { color: var(--area); }
        .tl-tools { margin-top: 10px; font-size: 14px; color: var(--text3); line-height: 1.7; }
        .tl-tools span { color: var(--text2); margin-right: 6px; }
        @media (max-width: 700px) {
          .tl-item { grid-template-columns: minmax(0, 1fr); padding-left: 24px; }
          .tl-line { left: 4px; top: 52px; }
          .tl-dot { left: 0; top: 24px; }
          .tl-date { padding-top: 0; }
          .tl-logo { flex-basis: 48px; width: 48px; height: 48px; padding: 7px; }
          .tl-panel-inner { padding-left: 0; }
        }
      `}</style>
    </section>
  );
}
