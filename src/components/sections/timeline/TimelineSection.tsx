import React from 'react';
import { SH } from '@/components/shared/section-helpers';
import { jobs, type Job } from '@/lib/data/jobs';
import { education } from '@/lib/data/education';
import { awards, type Award } from '@/lib/data/awards';

type Entry =
  | { kind: 'job'; id: string; date: string; job: Job }
  | { kind: 'award'; id: string; date: string; award: Award }
  | { kind: 'education'; id: string; date: string };

/**
 * Jobs, education and milestone awards as one dated list, newest first. Each job opens
 * in place to its full description, achievements and stack.
 */
export function TimelineSection() {
  const entries: Entry[] = [
    ...jobs.map((j): Entry => ({ kind: 'job', id: j.id, date: j.startDate, job: j })),
    ...awards.filter((a) => a.milestone).map((a): Entry => ({ kind: 'award', id: a.title, date: a.startDate, award: a })),
    { kind: 'education' as const, id: 'utoledo', date: education.startDate },
  ].sort((a, b) => (a.date < b.date ? 1 : -1));

  return (
    <section id="timeline" aria-label="Timeline" className="tl">
      <div className="wrap">
        <SH label="Timeline" sub="Career and education as one continuous line. Newest first, then back to the origin story." variant="sub" />
        <ol className="tl-list">
          {entries.map((e) => (
            <li key={e.id} className="tl-item">
              {e.kind === 'job' && <JobRow job={e.job} />}
              {e.kind === 'award' && (
                <>
                  <span className="tl-date tnum">{e.award.date}</span>
                  <div>
                    <span className="tl-kind">Milestone</span>
                    <div className="tl-role">{e.award.title}</div>
                    <div className="tl-org">{e.award.detail}</div>
                  </div>
                </>
              )}
              {e.kind === 'education' && (
                <>
                  <span className="tl-date tnum">{education.period}</span>
                  <div>
                    <span className="tl-kind">Education · where it begins</span>
                    <div className="tl-role">{education.school}</div>
                    <div className="tl-org">{education.degree} · {education.status} · GPA {education.gpa}</div>
                    <p className="tl-tools">{education.coursework.join(' · ')}</p>
                  </div>
                </>
              )}
            </li>
          ))}
        </ol>
      </div>
      <style>{`
        .tl { padding: clamp(40px, 6vw, 80px) 0; }
        .tl-list { list-style: none; border-top: 1px solid var(--foreground); }
        .tl-item { display: grid; grid-template-columns: 12em minmax(0, 1fr); gap: 6px 32px; padding: 22px 0; border-bottom: 1px solid var(--bd); }
        .tl-date { font-size: 15px; color: var(--text2); }
        .tl-kind { font-size: 14px; color: var(--text3); }
        .tl-role { font-size: 20px; letter-spacing: -0.015em; line-height: 1.3; margin-top: 2px; }
        .tl-org { font-size: 15px; color: var(--text2); margin-top: 2px; }
        .tl-highlights { font-size: 15px; margin-top: 8px; }
        .tl-item details { margin-top: 6px; }
        .tl-item summary { cursor: pointer; font-size: 15px; color: var(--text2); min-height: 44px; display: inline-flex; align-items: center; }
        .tl-item summary:hover { color: var(--foreground); }
        .tl-desc { color: var(--text2); font-size: 16px; max-width: 40em; }
        .tl-ach { margin: 12px 0 0 1.1em; font-size: 15px; color: var(--text2); }
        .tl-ach li { margin-top: 4px; }
        .tl-tools { margin-top: 10px; font-size: 14px; color: var(--text3); line-height: 1.7; }
        @media (max-width: 700px) { .tl-item { grid-template-columns: minmax(0, 1fr); } }
      `}</style>
    </section>
  );
}

function JobRow({ job }: { job: Job }) {
  return (
    <>
      <span className="tl-date tnum">{job.period}</span>
      <div>
        <span className="tl-kind">{job.type}{job.active ? ' · current' : ''}</span>
        <div className="tl-role">{job.role}</div>
        <div className="tl-org">{job.company} · {job.location}</div>
        <p className="tl-highlights">{job.achievements.slice(0, 2).join(' · ')}</p>
        <details>
          <summary>Details</summary>
          <p className="tl-desc">{job.description}</p>
          <ul className="tl-ach">{job.achievements.map((a) => <li key={a}>{a}</li>)}</ul>
          <p className="tl-tools">{job.stack.join(' · ')}</p>
        </details>
      </div>
    </>
  );
}
