import React from 'react';
import { site } from '@/lib/data/site';
import { MagneticLink } from '@/components/ui/magnetic-link';

/** The last section on the homepage: the address large, everything else as plain links. */
export function ContactSection() {
  const channels = [
    { label: 'LinkedIn', value: '/in/ahmadfirasazfar', href: site.socials.linkedin },
    { label: 'GitHub', value: '/aahmadf123', href: site.socials.github },
    { label: 'Location', value: site.location, href: null },
    { label: 'Response', value: 'Within 24 hours', href: null },
  ];
  return (
    <section id="contact" aria-labelledby="contact-title" className="ct">
      <div className="wrap">
        <p className="ct-kicker rv">Contact · Let&apos;s talk about building something real.</p>
        <h2 id="contact-title" className="ct-title rv" style={{ '--i': 1 } as React.CSSProperties}>
          Open to collaborating on AI&nbsp;research, ML&nbsp;engineering, and sports&nbsp;analytics.
        </h2>
        <div className="ct-grid rv" style={{ '--i': 2 } as React.CSSProperties}>
          <div>
            <p className="ct-body">
              Working full time at First Solar and on sports analytics with Toledo Athletics. For a research collaboration, a side build, or just a conversation about autonomous systems, I&apos;m listening.
            </p>
            <MagneticLink href={`mailto:${site.email}`} className="ct-email" max={8}>{site.email}<span aria-hidden> ↗</span></MagneticLink>
            <p className="ct-status"><i aria-hidden /> {site.availability.label}</p>
            <div className="ct-docs">
              <a href={site.resumeUrl} target="_blank" rel="noopener" className="text-link is-underlined">Resume PDF ↓</a>
              <a href={site.degreeUrl} target="_blank" rel="noopener" className="text-link is-underlined">Degree PDF ↓</a>
            </div>
          </div>
          <div>
            <dl className="ct-channels">
              {channels.map((c) => (
                <div key={c.label}>
                  <dt>{c.label}</dt>
                  <dd>{c.href ? <a href={c.href} target="_blank" rel="noopener" className="text-link">{c.value} ↗</a> : c.value}</dd>
                </div>
              ))}
            </dl>
            <p className="ct-interests"><span>Collab on</span> {site.availability.interests.join(' · ')}</p>
          </div>
        </div>
      </div>
      <style>{`
        .ct { padding: clamp(72px, 11vw, 160px) 0 clamp(56px, 8vw, 112px); border-top: 1px solid var(--bd); }
        .ct-kicker { font-size: 15px; color: var(--text2); }
        .ct-title { margin-top: 20px; max-width: 18em; font-size: clamp(32px, 4.2vw, 64px); font-weight: 400; line-height: 1.08; letter-spacing: -0.03em; }
        .ct-grid { display: grid; grid-template-columns: minmax(0, 7fr) minmax(0, 5fr); gap: 40px clamp(32px, 6vw, 96px); margin-top: clamp(40px, 5vw, 64px); }
        .ct-body { color: var(--text2); max-width: 32em; }
        .ct-email { display: inline-block; margin-top: 28px; font-size: clamp(22px, 2.6vw, 36px); letter-spacing: -0.02em; border-bottom: 1px solid var(--foreground); padding-bottom: 4px; overflow-wrap: anywhere; }
        .ct-email:hover { color: var(--primary); border-color: var(--primary); }
        .ct-status { margin-top: 20px; font-size: 15px; color: var(--text2); display: flex; align-items: center; gap: 10px; }
        .ct-status i { width: 7px; height: 7px; border-radius: 50%; background: var(--primary-fill); }
        .ct-docs { display: flex; flex-wrap: wrap; gap: 12px 28px; margin-top: 24px; font-size: 15px; }
        .ct-channels { border-top: 1px solid var(--bd); }
        .ct-channels > div { display: grid; grid-template-columns: 7em minmax(0, 1fr); gap: 16px; padding: 14px 0; border-bottom: 1px solid var(--bd); font-size: 16px; }
        .ct-channels dt { color: var(--text3); font-size: 15px; }
        .ct-interests { margin-top: 24px; font-size: 15px; color: var(--text2); line-height: 1.7; }
        .ct-interests span { color: var(--text3); margin-right: 6px; }
        @media (max-width: 860px) { .ct-grid { grid-template-columns: minmax(0, 1fr); } }
      `}</style>
    </section>
  );
}
