import React from 'react';
import { site } from '@/lib/data/site';
import { journeyPhoto, worlds, type PhotoId } from '@/lib/data/worlds';

// Stock photos only: Ahmad's own photos (the Chem-E Car) need no credit.
const CREDITED = (['opening', ...worlds.map((w) => w.photo)] as PhotoId[]).filter((id) => journeyPhoto(id).credit);


/** The footer on every page: a short sign-off, links, and credit for every photograph used. */
export function SiteFooter() {
  const year = 2026;
  return (
    <footer className="ft">
      <div className="wrap">
        <div className="ft-grid">
          <div>
            <p className="ft-sign">Let&apos;s build something real.</p>
            <p className="ft-small">{site.location} · Open to collaborate</p>
          </div>
          <nav aria-label="Footer - explore" className="ft-col">
            <span className="ft-small">Explore</span>
            {[
              { label: 'The Story', href: '/about#experience' },
              { label: 'Bodies of Work', href: '/projects' },
              { label: 'Field Notes', href: '/field-notes' },
              { label: 'Docs & Résumé', href: '/docs' },
            ].map((l) => <a key={l.href} href={l.href} className="text-link">{l.label}</a>)}
          </nav>
          <nav aria-label="Footer - connect" className="ft-col">
            <span className="ft-small">Connect</span>
            <a href={site.socials.github} target="_blank" rel="noopener" className="text-link">GitHub ↗</a>
            <a href={site.socials.linkedin} target="_blank" rel="noopener" className="text-link">LinkedIn ↗</a>
            <a href={`mailto:${site.email}`} className="text-link">{site.email}</a>
          </nav>
        </div>
        <div className="ft-base">
          <span>© {year} {site.name}. All rights reserved.</span>
          <span>Next.js · TypeScript</span>
        </div>
        {/* The photographs of places are other people's work: credit every one. */}
        <p className="ft-credits">
          Photos:{' '}
          {CREDITED.map((id, i) => {
            const c = journeyPhoto(id).credit!;
            return (
              <React.Fragment key={id}>
                <a href={c.page} target="_blank" rel="noopener">{c.photographer}</a>
                {' '}(<a href={c.licenceUrl} target="_blank" rel="noopener">{c.licence}</a>){i < CREDITED.length - 1 ? ' · ' : ''}
              </React.Fragment>
            );
          })}
          . All photos graded and resized for this site.
        </p>
      </div>
      <style>{`
        .ft { border-top: 1px solid var(--bd); padding: clamp(40px, 5vw, 64px) 0 32px; font-size: 15px; }
        .ft-grid { display: grid; grid-template-columns: 1.4fr 1fr 1fr; gap: 28px clamp(28px, 5vw, 72px); }
        .ft-sign { font-size: 22px; letter-spacing: -0.015em; }
        .ft-small { font-size: 14px; color: var(--text3); }
        .ft-sign + .ft-small { margin-top: 6px; }
        .ft-col { display: flex; flex-direction: column; align-items: flex-start; gap: 8px; color: var(--text2); }
        .ft-col a:hover { color: var(--foreground); }
        .ft-base { display: flex; justify-content: space-between; flex-wrap: wrap; gap: 12px; margin-top: 40px; padding-top: 18px; border-top: 1px solid var(--bd); font-size: 14px; color: var(--text3); }
        .ft-credits { margin-top: 12px; font-size: 13px; line-height: 1.7; color: var(--text3); }
        .ft-credits a { color: var(--text2); min-height: 0; min-width: 0; }
        @media (max-width: 760px) { .ft-grid { grid-template-columns: 1fr; } }
      `}</style>
    </footer>
  );
}
