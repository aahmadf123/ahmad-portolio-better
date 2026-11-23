import React from 'react';
import { SH } from '@/components/shared/section-helpers';
import { skillGroups } from '@/lib/data/skills';

/** Capabilities: every skill, grouped, as plain text columns. */
export function SkillsSection() {
  const total = skillGroups.reduce((n, g) => n + g.skills.length, 0);
  return (
    <section id="skills" aria-label="Capabilities" className="sk">
      <div className="wrap">
        <SH color="#f472b6" label="Capabilities" sub={`${total} tools and methods, grouped by the kind of work they carry.`} variant="sub" />
        {/* A drifting row of every skill (decorative; the full grouped list follows). */}
        <div className="marquee sk-marquee" aria-hidden>
          <div className="marquee-track">
            {[0, 1].map((copy) => (
              <React.Fragment key={copy}>
                {skillGroups.flatMap((g) => g.skills).map((s) => <span key={`${copy}-${s}`}>{s}</span>)}
              </React.Fragment>
            ))}
          </div>
        </div>
        <div className="sk-grid">
          {skillGroups.map((g, i) => (
            <div key={g.id} className="rv" style={{ '--i': i } as React.CSSProperties}>
              <h4 className="sk-head"><i aria-hidden style={{ background: g.color }} />{g.label}</h4>
              <ul className="sk-list">
                {g.skills.map((s) => <li key={s}>{s}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <style>{`
        .sk { padding: clamp(40px, 6vw, 80px) 0; }
        .sk-marquee { font-size: clamp(28px, 3.4vw, 48px); letter-spacing: -0.02em; color: var(--text3); margin: 0 0 clamp(32px, 4vw, 56px); padding: 10px 0; border-top: 1px solid var(--bd); border-bottom: 1px solid var(--bd); }
        .sk-list li { transition: color .2s, translate .2s; }
        .sk-list li:hover { color: var(--foreground); translate: 4px 0; }
        .sk-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(min(220px, 100%), 1fr)); gap: 32px clamp(24px, 3vw, 48px); }
        .sk-head { display: flex; align-items: center; gap: 10px; font-size: 16px; font-weight: 500; padding-bottom: 10px; border-bottom: 1px solid var(--foreground); }
        .sk-head i { width: 6px; height: 6px; border-radius: 50%; }
        .sk-list { list-style: none; margin-top: 10px; font-size: 15px; color: var(--text2); line-height: 1.85; }
      `}</style>
    </section>
  );
}
