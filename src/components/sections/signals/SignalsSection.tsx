'use client';

import React from 'react';
import { SH } from '@/components/shared/section-helpers';
import { useLightboxOpen } from '@/components/layout/LightboxProvider';
import { Pic } from '@/components/ui/pic';
import { press } from '@/lib/data/press';
import { testimonials } from '@/lib/data/testimonials';

/** Press, and testimonials as plain quotes once they exist (no placeholders). */
export function SignalsSection() {
  const openLb = useLightboxOpen();
  const feature = press[0];

  return (
    <section id="signals" aria-label="Signals" className="sg">
      <div className="wrap">
        <SH label="Signals" sub="Press, recognition, and - as they arrive - words from the people behind the work." variant="sub" />
        {feature && (
          <article className="sg-press rv">
            <button type="button" className="sg-img lift-img" onClick={() => openLb(feature.image, feature.imageAlt)} aria-label="Enlarge the article image">
              <Pic src={feature.image} alt={feature.imageAlt} sizes="(max-width: 700px) 92vw, 320px" style={{ width: '100%', height: 'auto', display: 'block' }} />
            </button>
            <div>
              <p className="sg-kicker">Featured In · {feature.outlet} · {feature.date}</p>
              <h4 className="sg-head">“{feature.headline}”</h4>
              <p className="sg-sum">{feature.summary}</p>
              <a href={feature.url} target="_blank" rel="noopener noreferrer" className="text-link is-underlined sg-link">Read Article ↗</a>
            </div>
          </article>
        )}
        {testimonials.length > 0 ? (
          <div className="sg-quotes">
            {testimonials.map((t) => (
              <blockquote key={t.name}>
                <p>“{t.quote}”</p>
                <footer>{t.name} · {t.role} · {t.org}</footer>
              </blockquote>
            ))}
          </div>
        ) : (
          <p className="sg-empty">Endorsements from collaborators land here as they arrive.</p>
        )}
      </div>
      <style>{`
        .sg { padding: clamp(40px, 6vw, 80px) 0; }
        .sg-press { display: grid; grid-template-columns: minmax(0, 320px) minmax(0, 1fr); gap: 24px clamp(24px, 4vw, 56px); padding: 24px 0; border-top: 1px solid var(--foreground); border-bottom: 1px solid var(--bd); }
        .sg-img { padding: 0; border: 0; background: var(--surface); cursor: zoom-in; border-radius: 3px; overflow: hidden; align-self: start; }
        .sg-kicker { font-size: 14px; color: var(--text2); }
        .sg-head { font-size: clamp(22px, 2.2vw, 30px); font-weight: 400; line-height: 1.25; letter-spacing: -0.02em; margin-top: 10px; }
        .sg-sum { margin-top: 12px; color: var(--text2); max-width: 40em; }
        .sg-link { margin-top: 16px; font-size: 15px; }
        .sg-quotes { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(320px, 100%), 1fr)); gap: 32px; margin-top: 32px; }
        .sg-quotes p { font-size: 19px; line-height: 1.5; }
        .sg-quotes footer { margin-top: 10px; font-size: 14px; color: var(--text2); }
        .sg-empty { margin-top: 16px; font-size: 15px; color: var(--text3); }
        @media (max-width: 700px) { .sg-press { grid-template-columns: minmax(0, 1fr); } }
      `}</style>
    </section>
  );
}
