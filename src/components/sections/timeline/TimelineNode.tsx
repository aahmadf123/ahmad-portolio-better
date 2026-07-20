'use client';

import React, { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { MONO, SERIF, SANS, Tag, pickColor, FG2, FG3 } from '@/components/shared/section-helpers';
import type { Job } from '@/lib/data/jobs';
import type { Award } from '@/lib/data/awards';
import { education } from '@/lib/data/education';

export type TimelineEntry =
  | { kind: 'job'; id: string; date: string; milestone: boolean; job: Job }
  | { kind: 'award'; id: string; date: string; milestone: boolean; award: Award }
  | { kind: 'education'; id: string; date: string; milestone: boolean };

/**
 * One event on the kinetic timeline. Cards slide in from their side; the
 * center dot pops (milestones add a double gold ring burst). Job cards expand
 * in place with the complete preserved description/achievements/stack.
 */
export function TimelineNode({ entry, side, accent }: { entry: TimelineEntry; side: 'left' | 'right'; accent: string }) {
  const reduced = useReducedMotion();
  const color = entry.kind === 'job' ? entry.job.color : entry.kind === 'award' ? 'var(--gold)' : 'var(--purple)';
  const fromX = side === 'left' ? -36 : 36;

  return (
    <div className="tl-row" style={{ display: 'grid', gridTemplateColumns: '1fr 64px 1fr', alignItems: 'start' }}>
      {/* card */}
      <motion.div
        initial={reduced ? false : { opacity: 0, x: fromX }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        className={`tl-card tl-card-${side}`}
        style={{ gridColumn: side === 'left' ? 1 : 3, gridRow: 1, minWidth: 0 }}
      >
        {entry.kind === 'job' && <JobCard job={entry.job} />}
        {entry.kind === 'award' && <AwardCard award={entry.award} />}
        {entry.kind === 'education' && <EducationCard />}
      </motion.div>

      {/* node dot */}
      <div className="tl-dot-col" style={{ gridColumn: 2, gridRow: 1, display: 'flex', justifyContent: 'center', paddingTop: 26, position: 'relative' }}>
        <motion.div
          initial={reduced ? false : { scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true, amount: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 18 }}
          style={{ position: 'relative', width: 14, height: 14 }}
        >
          <span style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: entry.milestone ? 'var(--gold)' : color, boxShadow: `0 0 12px ${entry.milestone ? 'rgba(245,158,11,0.7)' : 'rgba(45,212,191,0.4)'}`, border: '2px solid var(--background)' }} />
          {entry.milestone && !reduced && (
            <>
              <motion.span
                initial={{ scale: 0.4, opacity: 0 }}
                whileInView={{ scale: 2.6, opacity: [0, 0.7, 0] }}
                viewport={{ once: true, amount: 1 }}
                transition={{ duration: 0.7, delay: 0.15 }}
                style={{ position: 'absolute', inset: -4, borderRadius: '50%', border: '1.5px solid var(--gold)' }}
              />
              <motion.span
                initial={{ scale: 0.4, opacity: 0 }}
                whileInView={{ scale: 3.8, opacity: [0, 0.45, 0] }}
                viewport={{ once: true, amount: 1 }}
                transition={{ duration: 0.85, delay: 0.28 }}
                style={{ position: 'absolute', inset: -4, borderRadius: '50%', border: '1px solid var(--gold)' }}
              />
            </>
          )}
        </motion.div>
      </div>

      {/* spacer keeps grid symmetric */}
      <div style={{ gridColumn: side === 'left' ? 3 : 1, gridRow: 1 }} className="tl-spacer" />

      <style>{`
        @media (max-width: 820px) {
          .tl-row { grid-template-columns: 30px 1fr !important; }
          .tl-dot-col { grid-column: 1 !important; justify-content: flex-start !important; padding-left: 8px; }
          .tl-card { grid-column: 2 !important; }
          .tl-spacer { display: none; }
        }
      `}</style>
    </div>
  );
}

function JobCard({ job }: { job: Job }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      role="button"
      tabIndex={0}
      aria-expanded={open}
      onClick={() => setOpen(!open)}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setOpen(!open); } }}
      style={{
        cursor: 'pointer',
        background: `color-mix(in oklch, ${job.color} ${open ? '7%' : '3%'}, transparent)`,
        border: `1px solid color-mix(in srgb, ${job.color} ${open ? '38%' : '20%'}, transparent)`,
        borderRadius: 10,
        padding: '18px 20px',
        transition: 'all 0.28s cubic-bezier(0.16,1,0.3,1)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {job.active && <span className="pulse" style={{ width: 6, height: 6, borderRadius: '50%', background: job.color, display: 'inline-block' }} />}
          <span style={{ fontFamily: MONO, fontSize: 9, color: job.color, letterSpacing: '0.1em', textTransform: 'uppercase', background: `color-mix(in srgb, ${job.color} 9%, transparent)`, padding: '2px 8px', borderRadius: 3 }}>{job.type}</span>
          {job.milestone && <span style={{ color: 'var(--gold)', fontSize: 12 }} aria-label="milestone">✦</span>}
        </div>
        <span style={{ fontFamily: MONO, fontSize: 10, color: job.color, letterSpacing: '0.05em' }}>{job.period}</span>
      </div>
      <div style={{ fontFamily: SERIF, fontSize: 19, fontWeight: 400, color: 'var(--foreground)', lineHeight: 1.25, marginTop: 8, paddingBottom: '0.05em' }}>{job.role}</div>
      <div style={{ fontFamily: SANS, fontSize: 13, color: FG2, marginTop: 3 }}>{job.company} · {job.location}</div>

      {!open && (
        <div style={{ marginTop: 10, display: 'flex', flexWrap: 'wrap', gap: 5, alignItems: 'center' }}>
          {job.achievements.slice(0, 2).map((a, i) => { const c = pickColor(a); return (
            <span key={i} style={{ fontFamily: MONO, fontSize: 9, padding: '3px 8px', background: `${c}12`, border: `1px solid ${c}30`, borderRadius: 3, color: c, letterSpacing: '0.02em' }}>{a}</span>
          ); })}
          <span style={{ fontFamily: MONO, fontSize: 9, color: FG3, letterSpacing: '0.08em', textTransform: 'uppercase' }}>+ details</span>
        </div>
      )}

      {open && (
        <div style={{ marginTop: 14, paddingTop: 12, borderTop: `1px solid color-mix(in srgb, ${job.color} 13%, transparent)` }} onClick={(e) => e.stopPropagation()}>
          <p style={{ fontSize: 14, lineHeight: 1.75, color: FG2 }}>{job.description}</p>
          <div style={{ fontFamily: MONO, fontSize: 9, color: job.color, letterSpacing: '0.1em', textTransform: 'uppercase', margin: '14px 0 8px', opacity: 0.8 }}>Key Achievements</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 6 }}>
            {job.achievements.map((a, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 7, padding: '8px 12px', background: `color-mix(in srgb, ${job.color} 4%, transparent)`, borderRadius: 5, border: `1px solid color-mix(in srgb, ${job.color} 13%, transparent)` }}>
                <span style={{ color: job.color, fontSize: 9, marginTop: 3, flexShrink: 0 }}>▸</span>
                <span style={{ fontSize: 12.5, color: 'var(--text2)', lineHeight: 1.45 }}>{a}</span>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginTop: 12 }}>
            {job.stack.map((s) => <Tag key={s}>{s}</Tag>)}
          </div>
        </div>
      )}
    </div>
  );
}

function AwardCard({ award }: { award: Award }) {
  return (
    <div style={{ border: '1px solid rgba(245,158,11,0.3)', background: 'rgba(245,158,11,0.05)', borderRadius: 10, padding: '14px 18px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, flexWrap: 'wrap' }}>
        <span style={{ fontFamily: MONO, fontSize: 9, color: 'var(--gold)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>✦ Milestone</span>
        <span style={{ fontFamily: MONO, fontSize: 10, color: 'var(--gold)' }}>{award.date}</span>
      </div>
      <div style={{ fontFamily: SERIF, fontSize: 17, color: 'var(--foreground)', marginTop: 6, lineHeight: 1.3 }}>{award.title}</div>
      <div style={{ fontFamily: SANS, fontSize: 12.5, color: FG2, marginTop: 2 }}>{award.detail}</div>
    </div>
  );
}

function EducationCard() {
  return (
    <div style={{ border: '1px solid rgba(167,139,250,0.3)', background: 'rgba(167,139,250,0.05)', borderRadius: 10, padding: '16px 20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, flexWrap: 'wrap' }}>
        <span style={{ fontFamily: MONO, fontSize: 9, color: 'var(--purple)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>Education · where it begins</span>
        <span style={{ fontFamily: MONO, fontSize: 10, color: 'var(--purple)' }}>{education.period}</span>
      </div>
      <div style={{ fontFamily: SERIF, fontSize: 19, color: 'var(--foreground)', marginTop: 8, paddingBottom: '0.05em' }}>{education.school}</div>
      <div style={{ fontFamily: SANS, fontSize: 13, color: FG2, marginTop: 2 }}>{education.degree}</div>
      <div style={{ fontFamily: MONO, fontSize: 10, color: 'var(--gold)', marginTop: 6 }}>{education.status} · GPA {education.gpa}</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 10 }}>
        {education.coursework.map((c) => <Tag key={c}>{c}</Tag>)}
      </div>
    </div>
  );
}
