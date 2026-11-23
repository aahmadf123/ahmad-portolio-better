import React from 'react';
import Link from 'next/link';
import { site, heroFacts } from '@/lib/data/site';
import { Headshot } from '@/components/sections/about/Headshot';

/** A short introduction on the homepage; the full story is on /about. */
export function AboutBrief() {
  return (
    <section id="intro" aria-labelledby="intro-title" className="ib">
      <div className="wrap ib-grid">
        <div className="ib-photo rv-photo lift-img"><Headshot /></div>
        <div className="rv">
          <p className="ib-kicker">{site.role}</p>
          <h2 id="intro-title" className="ib-title">{site.name}</h2>
          <p className="ib-lead">{site.heroSub}</p>
          <dl className="ib-facts">
            {heroFacts.map((f, i) => (
              <div key={f.label} className="rv" style={{ '--i': i + 2 } as React.CSSProperties}>
                <dt>{f.label}</dt>
                <dd>{f.value}{f.sub && <span>{f.sub}</span>}</dd>
              </div>
            ))}
          </dl>
          <p className="ib-now">
            <i aria-hidden /> {site.nowPlaying.label}:{' '}
            <Link href={site.nowPlaying.href} className="text-link is-underlined">{site.nowPlaying.detail}</Link>
          </p>
          <p className="ib-links">
            <a href="#about" className="text-link is-underlined">More about Ahmad ↓</a>
            <a href={site.resumeUrl} target="_blank" rel="noopener" className="text-link is-underlined">Download resume ↓</a>
            <a href={site.degreeUrl} target="_blank" rel="noopener" className="text-link is-underlined">Degree ↓</a>
          </p>
        </div>
      </div>
      <style>{`
        .ib { padding: clamp(64px, 10vw, 140px) 0; border-top: 1px solid var(--bd); }
        .ib-grid { display: grid; grid-template-columns: minmax(180px, 3fr) minmax(0, 7fr); gap: 32px clamp(32px, 6vw, 96px); align-items: start; }
        .ib-photo { max-width: 320px; }
        .ib-kicker { font-size: 15px; color: var(--text2); }
        .ib-title { margin-top: 10px; font-size: clamp(40px, 5vw, 72px); font-weight: 400; letter-spacing: -0.03em; line-height: 1; }
        .ib-lead { margin-top: 20px; font-size: clamp(19px, 1.6vw, 23px); line-height: 1.45; letter-spacing: -0.01em; max-width: 30em; }
        .ib-facts { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(190px, 100%), 1fr)); gap: 20px 32px; margin-top: 36px; padding-top: 20px; border-top: 1px solid var(--bd); }
        .ib-facts dt { font-size: 14px; color: var(--text3); }
        .ib-facts dd { font-size: 16px; margin-top: 2px; }
        .ib-facts dd span { display: block; font-size: 15px; color: var(--text2); }
        .ib-now { margin-top: 28px; font-size: 15px; color: var(--text2); display: flex; flex-wrap: wrap; align-items: center; gap: 6px; }
        .ib-now i { width: 7px; height: 7px; border-radius: 50%; background: var(--primary-fill); margin-right: 4px; }
        .ib-links { display: flex; flex-wrap: wrap; gap: 10px 28px; margin-top: 24px; font-size: 16px; }
        @media (max-width: 760px) { .ib-grid { grid-template-columns: minmax(0, 1fr); } .ib-photo { max-width: 220px; } }
      `}</style>
    </section>
  );
}
