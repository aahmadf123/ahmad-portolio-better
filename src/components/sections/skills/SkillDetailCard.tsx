'use client';

import React from 'react';
import Link from 'next/link';
import { AnimatePresence, m } from 'framer-motion';
import { MONO, SERIF, SANS, FG2, FG3 } from '@/components/shared/section-helpers';
import { skillGroups, type SkillNode } from '@/lib/data/skills';

/** Expanded context for a clicked constellation node: where the skill was actually used. */
export function SkillDetailCard({ node, onClose }: { node: SkillNode | null; onClose: () => void }) {
  const group = node ? skillGroups.find((g) => g.id === node.group) : null;
  return (
    <AnimatePresence>
      {node && group && (
        <m.aside
          key={node.name}
          initial={{ opacity: 0, y: 16, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.98 }}
          transition={{ duration: 0.26, ease: [0.16, 1, 0.3, 1] }}
          aria-label={`${node.name} details`}
          style={{
            position: 'absolute',
            left: 'clamp(10px, 2vw, 22px)',
            bottom: 'clamp(10px, 2vw, 22px)',
            width: 'min(340px, calc(100% - 24px))',
            background: 'rgba(15,17,23,0.95)',
            border: `1px solid ${group.color}55`,
            borderRadius: 10,
            padding: '16px 18px',
            backdropFilter: 'blur(10px)',
            zIndex: 5,
          }}
        >
          <button
            onClick={onClose}
            aria-label="Close skill details"
            style={{ position: 'absolute', top: 8, right: 10, background: 'none', border: 'none', color: FG3, cursor: 'pointer', fontSize: 14 }}
          >✕</button>
          <div style={{ fontFamily: MONO, fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase', color: group.color }}>{group.label}</div>
          <div style={{ fontFamily: SERIF, fontSize: 24, color: 'var(--foreground)', margin: '4px 0 2px', paddingBottom: '0.05em' }}>{node.name}</div>
          <div style={{ fontFamily: SANS, fontSize: 12, color: FG2 }}>
            {node.usedIn.length > 0
              ? `Used across ${node.usedIn.length} ${node.usedIn.length === 1 ? 'project or role' : 'projects & roles'}:`
              : 'Part of the working toolkit.'}
          </div>
          {node.usedIn.length > 0 && (
            <ul style={{ listStyle: 'none', margin: '10px 0 0', padding: 0, display: 'flex', flexDirection: 'column', gap: 6, maxHeight: 180, overflowY: 'auto' }}>
              {node.usedIn.slice(0, 6).map((u) => (
                <li key={u.title}>
                  {u.href.startsWith('#') ? (
                    <a href={u.href} style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: MONO, fontSize: 11, color: FG2 }}>
                      <span style={{ width: 5, height: 5, borderRadius: '50%', background: group.color, flexShrink: 0 }} />
                      {u.title}
                    </a>
                  ) : (
                    <Link href={u.href} transitionTypes={['nav-forward']} style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: MONO, fontSize: 11, color: FG2 }}>
                      <span style={{ width: 5, height: 5, borderRadius: '50%', background: group.color, flexShrink: 0 }} />
                      {u.title} ↗
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          )}
        </m.aside>
      )}
    </AnimatePresence>
  );
}
