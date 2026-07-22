'use client';

import React from 'react';
import { MONO, SERIF, SkillChip, FG3 } from '@/components/shared/section-helpers';
import { skillGroups } from '@/lib/data/skills';

/**
 * Mobile fallback for the constellation: a swipeable snap carousel - one
 * radial cluster card per skill group, hub label centered, chips orbiting.
 */
export function RadialSkills() {
  return (
    <div>
      <div
        style={{
          display: 'flex',
          gap: 14,
          overflowX: 'auto',
          scrollSnapType: 'x mandatory',
          paddingBottom: 12,
          WebkitOverflowScrolling: 'touch',
        }}
      >
        {skillGroups.map((group) => (
          <div
            key={group.id}
            style={{
              flex: '0 0 86%',
              scrollSnapAlign: 'center',
              border: `1px solid ${group.color}30`,
              background: `radial-gradient(ellipse 80% 70% at 50% 40%, ${group.color}0d, transparent 75%)`,
              borderRadius: 14,
              padding: '22px 18px 18px',
              textAlign: 'center',
            }}
          >
            <div style={{ fontFamily: MONO, fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase', color: group.color }}>Cluster</div>
            <div style={{ fontFamily: SERIF, fontSize: 24, color: 'var(--foreground)', margin: '4px 0 14px' }}>{group.label}</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, justifyContent: 'center' }}>
              {group.skills.map((s) => (
                <SkillChip key={s} color={group.color}>{s}</SkillChip>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div style={{ fontFamily: MONO, fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase', color: FG3, textAlign: 'center', marginTop: 6 }}>
        Swipe through the clusters →
      </div>
    </div>
  );
}
