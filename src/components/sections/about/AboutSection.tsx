import React from 'react';
import Link from 'next/link';
import { SH } from '@/components/shared/section-helpers';
import { accentInk } from '@/lib/accent';
import { MetricsBand } from '@/components/shared/MetricsBand';
import { about, type Lens } from '@/lib/data/about';
import { education } from '@/lib/data/education';
import { site } from '@/lib/data/site';
import { Headshot } from './Headshot';
import { SignOff } from './SignOff';

/**
 * About, as a long read: the headline and bio beside the headshot, then the three
 * lenses (Engineer · Builder · Thinker) one after another, each with its beliefs and
 * links, and the handwritten sign-off.
 */
export function AboutSection() {
  return (
    <section id="about" aria-label="About" className="ab">
      <div className="wrap">
        <SH label="About" sub="Beyond the résumé: who is actually doing the work." />
        <MetricsBand />

        <div className="ab-intro rv">
          <div id="about-intro">
            <h2 className="ab-headline">{about.headline}</h2>
            <p className="ab-bio">{about.bio}</p>
            <p className="ab-links">
              <Link href="/projects" transitionTypes={['nav-forward']} className="text-link is-underlined">View Projects →</Link>
              <Link href="/field-notes" transitionTypes={['nav-forward']} className="text-link is-underlined">Read Field Notes ↗</Link>
              <a href="#timeline" className="text-link is-underlined">Open Timeline ↓</a>
              <a href={site.socials.linkedin} target="_blank" rel="noopener" className="text-link is-underlined">LinkedIn ↗</a>
              <a href={site.socials.github} target="_blank" rel="noopener" className="text-link is-underlined">GitHub ↗</a>
            </p>
          </div>
          <div className="ab-photo lift-img"><Headshot /></div>
        </div>

        <div className="ab-lenses">
          {about.lenses.map((lens) => <LensBlock key={lens.id} lens={lens} />)}
        </div>

        <SignOff text={about.signOff.text} sub={about.signOff.sub} />
      </div>
      <style>{`
        .ab { padding: clamp(40px, 6vw, 80px) 0 clamp(56px, 8vw, 112px); }
        .ab-intro { display: grid; grid-template-columns: minmax(0, 1fr) minmax(220px, 300px); gap: clamp(24px, 5vw, 80px); align-items: start; }
        .ab-headline { font-size: clamp(26px, 2.8vw, 40px); font-weight: 400; line-height: 1.2; letter-spacing: -0.02em; max-width: 22em; }
        .ab-bio { margin-top: 20px; color: var(--text2); max-width: 36em; }
        .ab-links { display: flex; flex-wrap: wrap; gap: 8px 24px; margin-top: 24px; font-size: 15px; }
        .ab-lenses { margin-top: clamp(56px, 8vw, 112px); border-top: 1px solid var(--foreground); }
        .ab-lens { display: grid; grid-template-columns: minmax(0, 4fr) minmax(0, 8fr); gap: 20px clamp(24px, 5vw, 80px); padding: clamp(32px, 4vw, 56px) 0; border-bottom: 1px solid var(--bd); scroll-margin-top: 80px; }
        .ab-lens-kicker { font-size: 14px; color: var(--text2); }
        .ab-lens-title { font-size: clamp(28px, 3vw, 44px); font-weight: 400; letter-spacing: -0.025em; line-height: 1.05; margin-top: 6px; }
        .ab-lens-lead { font-size: 21px; line-height: 1.35; letter-spacing: -0.01em; font-weight: 400; }
        .ab-lens-body { margin-top: 14px; color: var(--text2); }
        .ab-data { display: flex; gap: 10px; margin-top: 18px; font-size: 15px; }
        .ab-data dt { color: var(--text3); }
        .ab-beliefs { list-style: none; margin-top: 24px; display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 260px), 1fr)); gap: 20px 32px; }
        .ab-beliefs li { padding-top: 12px; border-top: 1px solid var(--bd); }
        .ab-beliefs strong { font-weight: 500; font-size: 16px; display: flex; gap: 10px; }
        .ab-beliefs strong span { color: var(--text3); font-weight: 400; }
        .ab-beliefs p { margin-top: 6px; font-size: 15px; color: var(--text2); }
        .ab-edu { margin-top: 28px; padding-top: 16px; border-top: 1px solid var(--bd); }
        .ab-edu h4 { font-size: 14px; font-weight: 400; color: var(--text3); }
        .ab-edu-school { font-size: 19px; margin-top: 4px; }
        .ab-edu-meta { font-size: 15px; color: var(--text2); }
        .ab-edu details { margin-top: 8px; font-size: 15px; }
        .ab-edu summary { cursor: pointer; color: var(--text2); min-height: 44px; display: inline-flex; align-items: center; }
        .ab-edu-courses { color: var(--text2); line-height: 1.8; font-size: 15px; margin-top: 8px; }
        .ab-edu-courses span { color: var(--text3); margin-right: 6px; }
        .ab-next { margin-top: 24px; font-size: 15px; display: flex; flex-wrap: wrap; gap: 8px 24px; align-items: baseline; }
        .ab-next > span { color: var(--text3); }
        @media (max-width: 860px) {
          .ab-intro, .ab-lens { grid-template-columns: minmax(0, 1fr); }
          .ab-photo { max-width: 300px; }
        }
      `}</style>
    </section>
  );
}

function LensBlock({ lens }: { lens: Lens }) {
  const beliefs = about.beliefs.filter((b) => lens.beliefIds.includes(b.n));
  return (
    <article id={`lens-${lens.id}`} className="ab-lens rv">
      <div>
        <div className="ab-lens-kicker">{lens.kicker} · {lens.title}</div>
        <div className="ab-lens-title">{lens.title}</div>
      </div>
      <div>
        <h3 className="ab-lens-lead">{lens.lead}</h3>
        <p className="ab-lens-body">{lens.body}</p>
        <dl className="ab-data"><dt>{lens.dataPoint.label}</dt><dd style={{ color: accentInk('#38bdf8') }}>{lens.dataPoint.value}</dd></dl>

        {beliefs.length > 0 && (
          <ul className="ab-beliefs">
            {beliefs.map((b, i) => (
              <li key={b.n} className="rv" style={{ '--i': i + 1 } as React.CSSProperties}>
                <strong><span>{b.n}</span>{b.title}</strong>
                <p>{b.body}</p>
              </li>
            ))}
          </ul>
        )}

        {lens.id === 'engineer' && (
          <div className="ab-edu">
            <h4>Education</h4>
            <div className="ab-edu-school">{education.school}</div>
            <div className="ab-edu-meta">{education.degree}</div>
            <div className="ab-edu-meta tnum">{education.period} · {education.status} · GPA {education.gpa}</div>
            <p className="ab-edu-courses"><span>Coursework</span> {education.coursework.join(' · ')}</p>
          </div>
        )}

        <p className="ab-next">
          <span>Recommended Next Step</span>
          {lens.artifacts.map((a) =>
            a.external ? (
              <a key={a.href} href={a.href} target="_blank" rel="noopener" className="text-link is-underlined">{a.label} ↗</a>
            ) : a.href.startsWith('#') ? (
              <a key={a.href} href={a.href} className="text-link is-underlined">{a.label} ↓</a>
            ) : (
              <Link key={a.href} href={a.href} transitionTypes={['nav-forward']} className="text-link is-underlined">{a.label} →</Link>
            )
          )}
        </p>
      </div>
    </article>
  );
}
