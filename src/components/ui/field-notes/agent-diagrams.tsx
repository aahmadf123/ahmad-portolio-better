import React from 'react';

const MONO  = "var(--font-chakra), 'Chakra Petch', monospace";
const SERIF = "var(--font-chakra), 'Chakra Petch', sans-serif";

// ── 1. The Five-Layer Architecture ──────────────────────────────────────────

const LAYERS = [
  {
    n: '01', name: 'Model',
    desc: 'Interprets the goal, reasons over context, generates plans and outputs',
    failure: 'Misunderstands intent or produces low-quality decisions',
    color: '#F0B429',
  },
  {
    n: '02', name: 'Orchestrator',
    desc: 'Manages state, routing, retries, handoffs, and loop limits',
    failure: 'Agent gets stuck, loses context, or becomes impossible to debug',
    color: '#4B7BF5',
  },
  {
    n: '03', name: 'Tools',
    desc: 'Give the agent access to data and actions outside the model itself',
    failure: 'Agent cannot verify facts or take useful action beyond text generation',
    color: '#10B981',
  },
  {
    n: '04', name: 'Guardrails',
    desc: 'Constrain inputs, outputs, tool permissions, and escalation rules',
    failure: 'Agent takes unsafe actions or leaks sensitive information',
    color: '#EF4444',
  },
  {
    n: '05', name: 'Evaluation & Tracing',
    desc: 'Measures quality, safety, cost, latency, and task success over time',
    failure: 'Team cannot tell whether the agent is improving or failing differently',
    color: '#8B5CF6',
  },
];

export function AgentArchitectureLayers() {
  return (
    <div style={{ margin: '2.5rem 0' }}>
      <div style={{
        fontFamily: MONO, fontSize: 10, letterSpacing: '0.12em',
        textTransform: 'uppercase', color: '#F0B429', opacity: 0.7,
        marginBottom: 14, display: 'flex', alignItems: 'center', gap: 10,
      }}>
        <span style={{ display: 'inline-block', width: 18, height: 1, background: '#F0B429', opacity: 0.5 }} />
        Five-Layer Production Architecture
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
        {LAYERS.map((layer, i) => (
          <div key={layer.n} style={{ display: 'flex', position: 'relative' }}>
            {/* Connector line */}
            {i < LAYERS.length - 1 && (
              <div style={{
                position: 'absolute', left: 28, top: '100%',
                width: 1, height: 12, background: `${layer.color}40`, zIndex: 1,
              }} />
            )}

            <div style={{
              flex: 1, display: 'flex', gap: 0,
              background: `${layer.color}07`,
              border: `1px solid ${layer.color}22`,
              borderRadius: i === 0 ? '8px 8px 0 0' : i === LAYERS.length - 1 ? '0 0 8px 8px' : 0,
              borderTop: i === 0 ? undefined : 'none',
              overflow: 'hidden',
              transition: 'background 0.2s',
            }}>
              {/* Color bar */}
              <div style={{
                width: 4, background: layer.color,
                opacity: 0.7, flexShrink: 0,
              }} />

              {/* Content */}
              <div style={{ flex: 1, padding: '14px 16px', display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                {/* Layer number + name */}
                <div style={{ flexShrink: 0, minWidth: 130 }}>
                  <div style={{
                    fontFamily: MONO, fontSize: 9, color: layer.color,
                    opacity: 0.6, letterSpacing: '0.1em', marginBottom: 3,
                  }}>
                    Layer {layer.n}
                  </div>
                  <div style={{
                    fontFamily: MONO, fontSize: 13, color: layer.color,
                    letterSpacing: '0.04em', fontWeight: 500,
                  }}>
                    {layer.name}
                  </div>
                </div>

                {/* Description */}
                <div style={{ flex: 1, fontFamily: SERIF, fontSize: 13, color: '#C8C4B4', lineHeight: 1.6 }}>
                  {layer.desc}
                </div>

                {/* Failure mode */}
                <div style={{
                  flexShrink: 0, maxWidth: 200,
                  padding: '6px 10px',
                  background: `${layer.color}0A`,
                  border: `1px solid ${layer.color}25`,
                  borderRadius: 6,
                }}>
                  <div style={{
                    fontFamily: MONO, fontSize: 8, letterSpacing: '0.1em',
                    textTransform: 'uppercase', color: layer.color, opacity: 0.7,
                    marginBottom: 4,
                  }}>
                    If weak
                  </div>
                  <div style={{ fontFamily: SERIF, fontSize: 11, color: '#A09C8E', lineHeight: 1.5 }}>
                    {layer.failure}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Caption */}
      <div style={{
        marginTop: 12, fontFamily: MONO, fontSize: 10,
        color: 'var(--text3)', letterSpacing: '0.05em', textAlign: 'center',
      }}>
        Every production agent relies on all five layers. Weakness in any one compounds across the rest.
      </div>
    </div>
  );
}

// ── 2. Maturity Ladder ──────────────────────────────────────────────────────

const STAGES = [
  {
    n: 1, name: 'Prompted Model',
    trigger: 'One-step, low-risk task',
    question: 'Is the answer good enough with a strong prompt and examples?',
    color: 'var(--text3)',
  },
  {
    n: 2, name: 'Workflow',
    trigger: 'Steps are known and repeatable',
    question: 'Can code define the path more reliably than the model can?',
    color: '#4B7BF5',
  },
  {
    n: 3, name: 'Single Agent + Tools',
    trigger: 'Task varies, domain is bounded',
    question: 'Can one agent safely choose tools and recover from errors?',
    color: '#10B981',
  },
  {
    n: 4, name: 'Agent + Human Approvals',
    trigger: 'Agent prepares actions, consequences matter',
    question: 'Where should autonomy pause for review?',
    color: '#F0B429',
  },
  {
    n: 5, name: 'Multi-Agent System',
    trigger: 'Task genuinely spans roles, domains, or security boundaries',
    question: 'Does specialization outperform the added coordination cost?',
    color: '#EF4444',
  },
];

export function MaturityLadder() {
  return (
    <div style={{ margin: '2.5rem 0' }}>
      <div style={{
        fontFamily: MONO, fontSize: 10, letterSpacing: '0.12em',
        textTransform: 'uppercase', color: '#F0B429', opacity: 0.7,
        marginBottom: 14, display: 'flex', alignItems: 'center', gap: 10,
      }}>
        <span style={{ display: 'inline-block', width: 18, height: 1, background: '#F0B429', opacity: 0.5 }} />
        Agentic Maturity Progression
      </div>

      {/* Staircase layout - each stage is offset to the right */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, position: 'relative' }}>
        {/* Vertical axis label */}
        <div style={{
          position: 'absolute', left: -28, top: '50%', transform: 'translateY(-50%) rotate(-90deg)',
          transformOrigin: 'center center',
          fontFamily: MONO, fontSize: 8, letterSpacing: '0.15em',
          textTransform: 'uppercase', color: 'var(--text3)', whiteSpace: 'nowrap',
        }}>
          More Agentic →
        </div>

        {[...STAGES].reverse().map((stage) => (
          <div
            key={stage.n}
            style={{
              marginLeft: `${(stage.n - 1) * 24}px`,
              display: 'flex', gap: 0,
              background: `${stage.color}08`,
              border: `1px solid ${stage.color}28`,
              borderRadius: 8, overflow: 'hidden',
            }}
          >
            {/* Stage number badge */}
            <div style={{
              width: 48, flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: `${stage.color}15`,
              borderRight: `1px solid ${stage.color}20`,
            }}>
              <span style={{
                fontFamily: MONO, fontSize: 20, color: stage.color,
                opacity: 0.8, fontWeight: 300, lineHeight: 1,
              }}>
                {stage.n}
              </span>
            </div>

            {/* Stage details */}
            <div style={{ flex: 1, padding: '12px 16px' }}>
              <div style={{
                fontFamily: MONO, fontSize: 12, color: stage.color,
                letterSpacing: '0.05em', marginBottom: 4,
              }}>
                {stage.name}
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontFamily: MONO, fontSize: 8, color: 'var(--text3)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 2 }}>Use when</div>
                  <div style={{ fontFamily: SERIF, fontSize: 12, color: '#A09C8E', lineHeight: 1.5 }}>{stage.trigger}</div>
                </div>
                <div style={{ flex: 1, minWidth: 180 }}>
                  <div style={{ fontFamily: MONO, fontSize: 8, color: 'var(--text3)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 2 }}>Production question</div>
                  <div style={{ fontFamily: SERIF, fontSize: 12, color: '#C8C4B4', lineHeight: 1.5 }}>{stage.question}</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={{
        marginTop: 12, fontFamily: MONO, fontSize: 10,
        color: 'var(--text3)', letterSpacing: '0.05em', textAlign: 'center',
      }}>
        Move up only when the current stage genuinely cannot handle the task&apos;s variability.
      </div>
    </div>
  );
}

// ── 3. The Autonomy–Control Tradeoff ────────────────────────────────────────

export function AutonomyTradeoff() {
  const bands = [
    { label: 'Text Only', sub: 'Can be wrong', color: '#4B7BF5', width: '20%' },
    { label: 'Tool Read', sub: 'Can be wrong\nabout facts', color: '#10B981', width: '20%' },
    { label: 'Tool Write', sub: 'Can be wrong\nand take action', color: '#F0B429', width: '20%' },
    { label: 'Persistent\nActions', sub: 'Errors may\nnot be reversible', color: '#F97316', width: '20%' },
    { label: 'External\nImpact', sub: 'Errors reach\nreal systems', color: '#EF4444', width: '20%' },
  ];

  return (
    <div style={{ margin: '2.5rem 0' }}>
      <div style={{
        fontFamily: MONO, fontSize: 10, letterSpacing: '0.12em',
        textTransform: 'uppercase', color: '#F0B429', opacity: 0.7,
        marginBottom: 14, display: 'flex', alignItems: 'center', gap: 10,
      }}>
        <span style={{ display: 'inline-block', width: 18, height: 1, background: '#F0B429', opacity: 0.5 }} />
        Tool Use Risk Spectrum
      </div>

      {/* Spectrum bar */}
      <div style={{ display: 'flex', borderRadius: 8, overflow: 'hidden', height: 10, marginBottom: 16 }}>
        {bands.map((b) => (
          <div key={b.label} style={{ width: b.width, background: b.color, opacity: 0.75 }} />
        ))}
      </div>

      {/* Labels */}
      <div style={{ display: 'flex', gap: 0 }}>
        {bands.map((b, i) => (
          <div
            key={b.label}
            style={{
              width: b.width,
              padding: '10px 8px',
              borderTop: `2px solid ${b.color}`,
              borderRight: i < bands.length - 1 ? '1px solid rgba(242,237,216,0.06)' : 'none',
              background: `${b.color}06`,
            }}
          >
            <div style={{
              fontFamily: MONO, fontSize: 9, color: b.color,
              letterSpacing: '0.06em', lineHeight: 1.3,
              marginBottom: 4, whiteSpace: 'pre-line',
            }}>
              {b.label}
            </div>
            <div style={{
              fontFamily: SERIF, fontSize: 10, color: 'var(--text3)',
              lineHeight: 1.4, whiteSpace: 'pre-line',
            }}>
              {b.sub}
            </div>
          </div>
        ))}
      </div>

      <div style={{
        marginTop: 14, display: 'flex', justifyContent: 'space-between',
        fontFamily: MONO, fontSize: 9, color: 'var(--text3)', letterSpacing: '0.08em',
      }}>
        <span>← Safer / Less Useful</span>
        <span>More Useful / Higher Stakes →</span>
      </div>

      <div style={{
        marginTop: 10, fontFamily: MONO, fontSize: 10,
        color: 'var(--text3)', letterSpacing: '0.05em', textAlign: 'center',
      }}>
        Permissions, not personality, determine how dangerous a wrong step can be.
      </div>
    </div>
  );
}

// ── 4. Production Checklist ─────────────────────────────────────────────────

const CHECKLIST_ITEMS = [
  { label: 'Bounded job',        desc: 'Clear domain, not a vague mandate to "do work"',                           color: '#F0B429' },
  { label: 'Explicit tools',     desc: 'Every external action is named, typed, permissioned, and logged',           color: '#F0B429' },
  { label: 'Loop limits',        desc: 'Cannot retry forever or spend indefinitely',                                color: '#4B7BF5' },
  { label: 'State management',   desc: 'Defined what persists, expires, and must never be stored',                  color: '#4B7BF5' },
  { label: 'Human-in-the-loop',  desc: 'System knows which actions require human approval',                         color: '#10B981' },
  { label: 'Injection posture',  desc: 'External content treated as untrusted input, not instructions',             color: '#10B981' },
  { label: 'Traceability',       desc: 'Team can replay decisions, tool calls, and outputs after any incident',     color: '#8B5CF6' },
  { label: 'Eval datasets',      desc: 'Examples of success, failure, edge cases, and policy-sensitive tasks',      color: '#8B5CF6' },
  { label: 'Cost & latency',     desc: 'Agent measured as a product system, not a demo',                           color: '#EF4444' },
  { label: 'Rollback plan',      desc: 'Team knows exactly what to do when the agent takes a bad action',           color: '#EF4444' },
];

export function ProductionChecklist() {
  return (
    <div style={{ margin: '2.5rem 0' }}>
      <div style={{
        fontFamily: MONO, fontSize: 10, letterSpacing: '0.12em',
        textTransform: 'uppercase', color: '#F0B429', opacity: 0.7,
        marginBottom: 14, display: 'flex', alignItems: 'center', gap: 10,
      }}>
        <span style={{ display: 'inline-block', width: 18, height: 1, background: '#F0B429', opacity: 0.5 }} />
        Production Readiness Checklist
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: 8,
      }}>
        {CHECKLIST_ITEMS.map((item) => (
          <div
            key={item.label}
            style={{
              display: 'flex', gap: 12, alignItems: 'flex-start',
              padding: '12px 14px',
              background: `${item.color}07`,
              border: `1px solid ${item.color}22`,
              borderRadius: 8,
            }}
          >
            {/* Check indicator */}
            <div style={{
              flexShrink: 0, marginTop: 1,
              width: 16, height: 16, borderRadius: 4,
              border: `1.5px solid ${item.color}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
                <path d="M1 3L3 5L7 1" stroke={item.color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>

            <div>
              <div style={{
                fontFamily: MONO, fontSize: 11, color: item.color,
                letterSpacing: '0.04em', marginBottom: 3,
              }}>
                {item.label}
              </div>
              <div style={{ fontFamily: SERIF, fontSize: 12, color: '#8A877A', lineHeight: 1.5 }}>
                {item.desc}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
