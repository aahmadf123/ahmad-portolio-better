import React from 'react';
import { SH } from '@/components/shared/section-helpers';
import { skillGroups } from '@/lib/data/skills';

/** Capabilities: every skill, grouped, as plain text columns. */
export function SkillsSection() {
  const total = skillGroups.reduce((n, g) => n + g.skills.length, 0);
  return (
    <section id="skills" aria-label="Capabilities" className="sk">
      <div className="wrap">
        <SH label="Capabilities" sub={`${total} tools and methods, grouped by the kind of work they carry.`} variant="sub" />
        <div className="sk-grid">
          {skillGroups.map((g) => (
            <div key={g.id}>
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
        .sk-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(min(220px, 100%), 1fr)); gap: 32px clamp(24px, 3vw, 48px); }
        .sk-head { display: flex; align-items: center; gap: 10px; font-size: 16px; font-weight: 500; padding-bottom: 10px; border-bottom: 1px solid var(--foreground); }
        .sk-head i { width: 6px; height: 6px; border-radius: 50%; }
        .sk-list { list-style: none; margin-top: 10px; font-size: 15px; color: var(--text2); line-height: 1.85; }
      `}</style>
    </section>
  );
}
