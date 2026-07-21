'use client';

import React from 'react';
import { MONO, SkillChip } from '@/components/shared/section-helpers';
import { skillGroups, type SkillGroup } from '@/lib/data/skills';

function SkillGroupCard({ group }: { group: SkillGroup }) {
  const SHOW = 6;
  const [showAll, setShowAll] = React.useState(false);
  const visible = showAll ? group.skills : group.skills.slice(0, SHOW);
  const hidden = group.skills.length - SHOW;
  const expandKey = (e: React.KeyboardEvent) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setShowAll(true); } };
  return (
    <div style={{ background: `${group.color}0a`, borderTop: `2px solid ${group.color}`, borderRight: `1px solid ${group.color}28`, borderBottom: `1px solid ${group.color}28`, borderLeft: `1px solid ${group.color}28`, borderRadius: 8, padding: '22px 20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 14 }}>
        <div style={{ width: 5, height: 5, background: group.color, borderRadius: 1, flexShrink: 0 }} />
        <span style={{ fontFamily: MONO, fontSize: 11, color: group.color, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{group.label}</span>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
        {visible.map(s => <SkillChip key={s} color={group.color}>{s}</SkillChip>)}
        {!showAll && hidden > 0 && (
          <span
            role="button"
            tabIndex={0}
            onClick={() => setShowAll(true)}
            onKeyDown={expandKey}
            style={{ fontFamily: MONO, fontSize: 11, padding: '4px 9px', background: `${group.color}0a`, border: `1px solid ${group.color}30`, borderRadius: 4, color: group.color, letterSpacing: '0.03em', cursor: 'pointer', opacity: 0.75 }}
          >+{hidden}</span>
        )}
      </div>
    </div>
  );
}

/** The complete skill inventory (currently 88 chips) — the accessible/searchable ground truth. */
export function SkillListFallback() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }} className="three-col-skills">
      {skillGroups.map((group) => (
        <SkillGroupCard key={group.id} group={group} />
      ))}
      <style>{`
        @media (max-width: 860px) { .three-col-skills { grid-template-columns: repeat(2, 1fr) !important; } }
        @media (max-width: 560px) { .three-col-skills { grid-template-columns: 1fr !important; } }
      `}</style>
    </div>
  );
}
