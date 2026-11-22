'use client';

import React from 'react';
import { SH } from '@/components/shared/section-helpers';
import { useLightboxOpen } from '@/components/layout/LightboxProvider';
import { Pic } from '@/components/ui/pic';
import { awards } from '@/lib/data/awards';
import { affiliations } from '@/lib/data/affiliations';
import { certs } from '@/lib/data/certs';

/** Certifications, awards and affiliations as three plain lists; photos open in place. */
export function CredentialsSection() {
  const openLb = useLightboxOpen();
  const photos = (images: string[], alt: string, ratio?: string, fit?: React.CSSProperties['objectFit'], pos?: string) => (
    <div className="cr-photos">
      {images.map((src) => (
        <button key={src} type="button" onClick={() => openLb(src, alt)} aria-label={`Enlarge photo: ${alt}`} style={{ aspectRatio: ratio ?? '16/9' }}>
          <Pic src={src} alt={alt} sizes="(max-width: 860px) 45vw, 300px" style={{ width: '100%', height: '100%', objectFit: fit ?? 'cover', objectPosition: pos ?? 'center', display: 'block' }} />
        </button>
      ))}
    </div>
  );

  return (
    <section id="credentials" aria-label="Credentials" className="cr">
      <div className="wrap">
        <SH label="Credentials" sub="Certifications, awards, and the communities behind the work." variant="sub" />

        <h4 className="cr-h">Certifications</h4>
        <ul className="cr-list">
          {certs.map((c) => (
            <li key={c.id} className="cr-cert">
              <Pic src={c.badgeImage} alt="" sizes="72px" className="cr-badge" />
              <div>
                <div className="cr-meta">{c.issuer} · {c.track} · Earned {c.earned}</div>
                <h5 className="cr-title">{c.title}</h5>
                <p className="cr-desc">{c.description}</p>
                <p className="cr-tools">{c.skills.join(' · ')}</p>
                <p className="cr-links">
                  {c.verifyUrl && <a href={c.verifyUrl} target="_blank" rel="noopener" className="text-link is-underlined">Verify Badge ↗</a>}
                  {c.certificateUrl && <a href={c.certificateUrl} target="_blank" rel="noopener" className="text-link is-underlined">Certificate ↓</a>}
                </p>
              </div>
            </li>
          ))}
        </ul>

        <h4 className="cr-h">Awards & Recognition</h4>
        <ul className="cr-list">
          {awards.map((a) => (
            <li key={a.title} className="cr-row">
              <span className="cr-date tnum">{a.date}</span>
              <div>
                <h5 className="cr-title">{a.title}{a.milestone && <span className="cr-milestone"> · milestone</span>}</h5>
                <p className="cr-desc">{a.detail}</p>
                <details>
                  <summary>Photos</summary>
                  {photos(a.images, a.title, a.ratio, a.imgFit, a.imgPos)}
                </details>
              </div>
            </li>
          ))}
        </ul>

        <h4 className="cr-h">Professional Affiliations</h4>
        <ul className="cr-list">
          {affiliations.map((a) => (
            <li key={a.name} className="cr-row">
              <span className="cr-date">{a.role}</span>
              <div>
                <h5 className="cr-title">{a.name}</h5>
                <p className="cr-desc">{a.short}</p>
                <details>
                  <summary>More</summary>
                  {photos(a.images, a.name, a.ratio, a.imgFit, a.imgPos)}
                  <p className="cr-desc">{a.desc}</p>
                </details>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <style>{`
        .cr { padding: clamp(40px, 6vw, 80px) 0; }
        .cr-h { font-size: 15px; font-weight: 400; color: var(--text2); margin-top: 40px; padding-bottom: 12px; border-bottom: 1px solid var(--foreground); }
        .cr-list { list-style: none; }
        .cr-cert, .cr-row { display: grid; grid-template-columns: 12em minmax(0, 1fr); gap: 8px 32px; padding: 22px 0; border-bottom: 1px solid var(--bd); }
        .cr-cert { grid-template-columns: 72px minmax(0, 1fr); }
        .cr-badge { width: 72px; height: 72px; object-fit: contain; }
        .cr-meta, .cr-date { font-size: 14px; color: var(--text2); }
        .cr-title { font-size: 19px; font-weight: 400; letter-spacing: -0.01em; line-height: 1.3; }
        .cr-milestone { color: var(--text3); font-size: 15px; }
        .cr-desc { font-size: 15px; color: var(--text2); margin-top: 4px; max-width: 44em; }
        .cr-tools { font-size: 14px; color: var(--text3); margin-top: 8px; }
        .cr-links { display: flex; gap: 20px; margin-top: 8px; font-size: 15px; }
        .cr details { margin-top: 4px; }
        .cr summary { cursor: pointer; font-size: 15px; color: var(--text2); min-height: 44px; display: inline-flex; align-items: center; }
        .cr-photos { display: grid; grid-template-columns: repeat(auto-fill, minmax(min(200px, 100%), 1fr)); gap: 8px; margin: 6px 0 10px; }
        .cr-photos button { padding: 0; border: 0; background: var(--surface); border-radius: 3px; overflow: hidden; cursor: zoom-in; }
        @media (max-width: 700px) { .cr-row { grid-template-columns: minmax(0, 1fr); } }
      `}</style>
    </section>
  );
}
