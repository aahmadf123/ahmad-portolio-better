'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { resolveSkillColor } from '@/lib/skill-colors';

const SERIF = "var(--font-chakra), 'Chakra Petch', sans-serif";
const MONO  = "var(--font-chakra), 'Chakra Petch', monospace";
const ACCENT = '#F0B429';

const PALETTE = ['#F0B429','#4B7BF5','#2DD4C8','#F07832','#A78BFA','#F472B6','#0EA5E9','#22C55E','#EF4444'];
function pickColor(text: string) {
  let h = 0;
  for (let i = 0; i < text.length; i++) h = (h * 31 + text.charCodeAt(i)) >>> 0;
  return PALETTE[h % PALETTE.length];
}

function Tag({ children, color }: { children: React.ReactNode; color?: string }) {
  const c = color ?? (typeof children === 'string' ? (resolveSkillColor(children) ?? pickColor(children)) : ACCENT);
  return (
    <span style={{ fontFamily: MONO, fontSize: 10, padding: '3px 8px', background: `${c}14`, border: `1px solid ${c}30`, borderRadius: 3, color: c, letterSpacing: '0.03em' }}>
      {children}
    </span>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
      <span style={{ display: 'inline-block', width: 18, height: 1.5, background: ACCENT, opacity: 0.5, flexShrink: 0 }} />
      <span style={{ fontFamily: MONO, fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: ACCENT }}>{children}</span>
    </div>
  );
}

function Metric({ value, label }: { value: string; label: string }) {
  return (
    <div style={{ padding: '16px 18px', background: `linear-gradient(180deg, ${ACCENT}0d, ${ACCENT}04)`, border: `1px solid ${ACCENT}35`, boxShadow: `0 4px 20px ${ACCENT}05`, borderRadius: 8 }}>
      <div style={{ fontFamily: SERIF, fontSize: 28, color: ACCENT, lineHeight: 1, paddingBottom: '0.05em' }}>{value}</div>
      <div style={{ fontFamily: MONO, fontSize: 9, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: 6 }}>{label}</div>
    </div>
  );
}

function ArchLayer({ n, title, items }: { n: string; title: string; items: string[] }) {
  return (
    <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start', padding: '14px 18px', background: `${ACCENT}06`, border: `1px solid ${ACCENT}18`, borderRadius: 8 }}>
      <div style={{ fontFamily: MONO, fontSize: 10, color: ACCENT, opacity: 0.6, flexShrink: 0, minWidth: 22, marginTop: 1 }}>{n}</div>
      <div style={{ flex: 1 }}>
        <div style={{ fontFamily: MONO, fontSize: 11, color: ACCENT, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6 }}>{title}</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
          {items.map(item => { const ic = resolveSkillColor(item) ?? pickColor(item); return (
            <span key={item} style={{ fontFamily: MONO, fontSize: 10, color: ic, padding: '2px 7px', background: `${ic}12`, border: `1px solid ${ic}30`, borderRadius: 3 }}>{item}</span>
          ); })}
        </div>
      </div>
    </div>
  );
}

function Section({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <section id={id} style={{ paddingBottom: 72 }}>
      {children}
    </section>
  );
}

function useActiveSection(ids: string[]) {
  const [active, setActive] = useState(ids[0]);
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach(e => { if (e.isIntersecting) setActive(e.target.id); });
      },
      { rootMargin: '-40% 0px -50% 0px' }
    );
    ids.forEach(id => {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, [ids]);
  return active;
}

const SECTION_IDS = ['overview', 'problem', 'architecture', 'stack', 'results', 'insights', 'human-loop', 'future'];
const SECTION_LABELS = ['Overview', 'Problem', 'Architecture', 'Stack', 'Results', 'Insights', 'Human-in-Loop', 'Future'];

export default function UAVCaseStudy() {
  const active = useActiveSection(SECTION_IDS);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div style={{ background: '#0B0D14', color: '#F2EDD8', minHeight: '100vh', fontFamily: SERIF }}>

      {/* ── Sticky header ── */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 100, height: 56,
        borderBottom: scrolled ? `1px solid ${ACCENT}35` : '1px solid transparent',
        background: scrolled ? 'rgba(11,13,20,0.95)' : 'transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 clamp(20px,4vw,52px)',
        transition: 'background 0.3s, border-color 0.3s',
      }}>
        <Link href="/#projects" transitionTypes={['nav-back']} style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#B8B4A4', fontFamily: MONO, fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase', textDecoration: 'none' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5" /><path d="M12 5l-7 7 7 7" /></svg>
          Back to Portfolio
        </Link>
        <a href="/docs/USRCAP_Final_Report.pdf" target="_blank" rel="noopener" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '7px 14px', border: `1px solid ${ACCENT}35`, borderRadius: 5, color: ACCENT, fontFamily: MONO, fontSize: 10, letterSpacing: '0.06em', textTransform: 'uppercase', textDecoration: 'none' }}>
          Research Report ↓
        </a>
      </header>

      {/* ── Hero ── */}
      <div style={{ padding: 'clamp(48px,7vw,96px) clamp(20px,4vw,52px) 0', maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
          <span style={{ fontFamily: MONO, fontSize: 10, padding: '4px 10px', background: `${ACCENT}15`, border: `1px solid ${ACCENT}35`, borderRadius: 3, color: ACCENT, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Autonomy Research</span>
          <span style={{ fontFamily: MONO, fontSize: 10, padding: '4px 10px', background: 'rgba(242,237,216,0.04)', border: '1px solid rgba(242,237,216,0.1)', borderRadius: 3, color: '#B8B4A4', letterSpacing: '0.05em', textTransform: 'uppercase' }}>USRCAP Summer 2025</span>
          <span style={{ fontFamily: MONO, fontSize: 10, padding: '4px 10px', background: 'rgba(242,237,216,0.04)', border: '1px solid rgba(242,237,216,0.1)', borderRadius: 3, color: '#B8B4A4', letterSpacing: '0.05em', textTransform: 'uppercase' }}>LION Lab · University of Toledo</span>
        </div>
        <h1 style={{ fontFamily: SERIF, fontWeight: 400, fontSize: 'clamp(32px,5vw,60px)', lineHeight: 1.05, letterSpacing: '-0.025em', color: '#F2EDD8', marginBottom: 18, paddingBottom: '0.06em' }}>
          AeroSynapse:<br />
          <span style={{ color: ACCENT }}>Graph-Based RL</span> for UAV Autonomy
        </h1>
        <p style={{ fontSize: 17, lineHeight: 1.75, color: '#B8B4A4', maxWidth: 680, marginBottom: 36 }}>
          An edge-first UAV autonomy framework combining graph-based reinforcement learning, meta-learning, PINN-based sensor fusion, and human-in-the-loop control for navigation in GPS-denied, map-free environments.
        </p>

        {/* Metrics */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 36 }} className="metrics-grid-uav">
          <Metric value="73%" label="Zero-shot navigation success" />
          <Metric value="89%" label="Success after 5 adaptation episodes" />
          <Metric value="<20ms" label="Control-loop latency (HIL)" />
          <Metric value="<500ms" label="Voice-to-action latency" />
          <Metric value="1000+" label="Randomized simulated environments" />
          <Metric value="95%" label="Operational cost vs. cloud alternatives" />
        </div>

        {/* CTA buttons */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, paddingBottom: 'clamp(48px,6vw,72px)', borderBottom: '1px solid rgba(242,237,216,0.07)' }}>
          <a href="/docs/USRCAP_Final_Report.pdf" target="_blank" rel="noopener" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '11px 22px', background: ACCENT, color: '#0B0D14', fontFamily: MONO, fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', borderRadius: 5, textTransform: 'uppercase', textDecoration: 'none' }}>Research Report ↓</a>
          <Link href="/#projects" transitionTypes={['nav-back']} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '11px 22px', border: '1px solid rgba(242,237,216,0.16)', color: '#B8B4A4', fontFamily: MONO, fontSize: 11, letterSpacing: '0.06em', borderRadius: 5, textTransform: 'uppercase', textDecoration: 'none' }}>← All Projects</Link>
        </div>
      </div>

      {/* ── Section nav ── */}
      <div style={{ position: 'sticky', top: 56, zIndex: 90, background: 'rgba(11,13,20,0.96)', backdropFilter: 'blur(10px)', borderBottom: '1px solid rgba(242,237,216,0.06)', overflowX: 'auto' }}>
        <div style={{ display: 'flex', gap: 0, padding: '0 clamp(20px,4vw,52px)', maxWidth: 1100, margin: '0 auto' }}>
          {SECTION_IDS.map((id, i) => (
            <button
              key={id}
              onClick={() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })}
              style={{
                fontFamily: MONO, fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase',
                padding: '14px 16px', background: 'transparent', border: 'none', cursor: 'pointer', whiteSpace: 'nowrap',
                color: active === id ? ACCENT : 'var(--text3)',
                borderBottom: active === id ? `2px solid ${ACCENT}` : '2px solid transparent',
                transition: 'color 0.2s, border-color 0.2s',
              }}
            >{SECTION_LABELS[i]}</button>
          ))}
        </div>
      </div>

      {/* ── Content ── */}
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: 'clamp(48px,6vw,72px) clamp(20px,4vw,52px) 0' }}>

        {/* ─ Overview ─ */}
        <Section id="overview">
          <SectionLabel>Overview</SectionLabel>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, alignItems: 'start' }} className="two-col-uav">
            <div>
              <p style={{ fontSize: 15, lineHeight: 1.85, color: '#B8B4A4', marginBottom: 16 }}>
                AeroSynapse investigates a hard autonomy problem: how can a UAV operate in a new environment without GPS, pre-mapping, or cloud inference? The project treats UAV autonomy as a layered system rather than a single model — perception, graph construction, control, learning, safety, and human supervision are separated into coordinated modules.
              </p>
              <p style={{ fontSize: 15, lineHeight: 1.85, color: '#B8B4A4', marginBottom: 16 }}>
                The core idea is to represent the UAV&apos;s local environment as a dynamic graph. Obstacles, targets, waypoints, free-space regions, and semantic objects become nodes; spatial and risk relationships become edges. A graph-based RL policy then reasons over this structure to make navigation decisions.
              </p>
              <p style={{ fontSize: 15, lineHeight: 1.85, color: '#B8B4A4' }}>
                The system prioritizes onboard edge compute over cloud dependency, reducing latency and preserving autonomy in degraded or denied communication environments.
              </p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { l: 'Project', v: 'AeroSynapse — Graph-Based RL for UAV Autonomy' },
                { l: 'Program', v: 'USRCAP Summer 2025 · $3,000 Fellowship' },
                { l: 'Institution', v: 'LION Lab, University of Toledo' },
                { l: 'Mentor', v: 'Dr. Liang Cheng' },
                { l: 'Role', v: 'AI & Autonomy Architecture Lead' },
                { l: 'Hardware', v: 'Jetson Orin NX · Cube Orange+ · OAK-D Pro' },
              ].map(({ l, v }) => (
                <div key={l} style={{ display: 'flex', gap: 12, padding: '10px 0', borderBottom: '1px solid rgba(242,237,216,0.06)' }}>
                  <span style={{ fontFamily: MONO, fontSize: 10, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.08em', flexShrink: 0, minWidth: 90 }}>{l}</span>
                  <span style={{ fontSize: 13, color: '#B8B4A4' }}>{v}</span>
                </div>
              ))}
              <div style={{ marginTop: 14, padding: '18px', background: `${ACCENT}08`, border: `1px solid ${ACCENT}20`, borderRadius: 8 }}>
                <div style={{ fontFamily: MONO, fontSize: 10, color: ACCENT, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>Research Question</div>
                <p style={{ fontSize: 14, lineHeight: 1.7, color: '#F2EDD8', fontStyle: 'italic' }}>
                  &ldquo;Can a UAV enter an unfamiliar environment and make useful navigation decisions without being pre-trained on that exact space?&rdquo;
                </p>
              </div>
            </div>
          </div>
        </Section>

        {/* ─ Problem ─ */}
        <Section id="problem">
          <SectionLabel>Problem</SectionLabel>
          <h2 style={{ fontFamily: SERIF, fontSize: 'clamp(22px,3vw,32px)', fontWeight: 400, color: '#F2EDD8', marginBottom: 16, lineHeight: 1.2, paddingBottom: '0.06em' }}>
            Most autonomous UAV systems are fragile outside controlled environments.
          </h2>
          <p style={{ fontSize: 15, lineHeight: 1.85, color: '#B8B4A4', maxWidth: 720, marginBottom: 32 }}>
            They depend on GPS, pre-built maps, stable internet, or carefully controlled conditions. In disaster response, indoor inspection, warehouse automation, and GPS-denied defense environments, these assumptions break down.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 32 }} className="three-col-uav">
            {[
              { t: 'GPS / GNSS Dependency', d: 'Conventional systems lose localization immediately when GPS is unavailable — a common condition indoors, underground, or in contested environments.' },
              { t: 'Pre-Built Map Requirement', d: 'SLAM-based systems require pre-mapping runs. In emergency scenarios or degraded environments, no prior map is available.' },
              { t: 'Cloud Inference Latency', d: 'Cloud-dependent AI adds hundreds of milliseconds of latency and becomes unavailable when communication is denied.' },
              { t: 'Environment-Specific Training', d: 'Models trained on one environment fail to generalize. Re-training for each new deployment is impractical at operational scale.' },
              { t: 'Sim-to-Reality Gap', d: 'Deep RL policies can achieve near-perfect simulation scores while failing entirely when facing real-world sensor noise and dynamics.' },
              { t: 'No Safe Failure Mode', d: 'When constraints are violated, most autonomy stacks have no principled fallback — leading to unpredictable or catastrophic failure.' },
            ].map(({ t, d }) => (
              <div key={t} style={{ padding: '16px 18px', background: 'rgba(242,237,216,0.02)', border: '1px solid rgba(242,237,216,0.07)', borderLeft: `2px solid ${ACCENT}50`, borderRadius: 8 }}>
                <div style={{ fontFamily: MONO, fontSize: 11, color: '#F2EDD8', letterSpacing: '0.04em', marginBottom: 8 }}>{t}</div>
                <p style={{ fontSize: 13, lineHeight: 1.7, color: 'var(--text3)' }}>{d}</p>
              </div>
            ))}
          </div>
          <div style={{ padding: '20px 24px', background: `${ACCENT}08`, border: `1px solid ${ACCENT}22`, borderRadius: 10 }}>
            <div style={{ fontFamily: MONO, fontSize: 10, color: ACCENT, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 }}>Design Principle</div>
            <p style={{ fontSize: 15, lineHeight: 1.75, color: '#F2EDD8' }}>
              Autonomy should not collapse when the environment is unknown. AeroSynapse was designed around this exact failure case.
            </p>
          </div>
        </Section>

        {/* ─ Architecture ─ */}
        <Section id="architecture">
          <SectionLabel>Architecture</SectionLabel>
          <h2 style={{ fontFamily: SERIF, fontSize: 'clamp(22px,3vw,32px)', fontWeight: 400, color: '#F2EDD8', marginBottom: 16, lineHeight: 1.2, paddingBottom: '0.06em' }}>
            A layered autonomy stack — each module coordinates, none is monolithic.
          </h2>
          <p style={{ fontSize: 15, lineHeight: 1.85, color: '#B8B4A4', maxWidth: 720, marginBottom: 28 }}>
            Rather than one large model, AeroSynapse decomposes autonomy into coordinated layers: sensing, state estimation, graph representation, decision-making, adaptation, safety, and human interaction.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 32 }} className="arch-grid-uav">
            <ArchLayer n="01" title="Sensor Input" items={['Stereo / Depth Camera', 'LiDAR', 'IMU', 'Environmental Sensors', 'Voice Input (optional)']} />
            <ArchLayer n="02" title="Perception & State Estimation" items={['Visual Perception', 'Obstacle Detection', 'PINN-Based State Estimation', 'Physically Consistent Prediction']} />
            <ArchLayer n="03" title="Dynamic Graph Construction" items={['Obstacle Nodes', 'Free-Space Regions', 'Waypoint / Goal Nodes', 'Semantic Objects', 'Risk & Visibility Edges', 'Real-Time Updates']} />
            <ArchLayer n="04" title="Graph-Based Reinforcement Learning" items={['GNN Policy (Graph Attention)', 'Q-Prop Actor-Critic', 'Reward: Safety · Progress · Stability · Mission', 'Relational Spatial Reasoning']} />
            <ArchLayer n="05" title="Meta-Learning & Adaptation" items={['MAML-Style Training', '1000+ Randomized Envs', 'Zero-Shot Deployment', 'Few-Shot Adaptation (5 episodes)']} />
            <ArchLayer n="06" title="Safety & Runtime Assurance" items={['Runtime State Monitor', 'Constraint Checking', 'Control-Barrier Boundaries', 'Baseline Controller Fallback', 'Human Override']} />
            <ArchLayer n="07" title="Human-in-the-Loop Interface" items={['Direct Control Mode', 'Supervised Autonomy', 'Natural-Language Commands', 'Intervention & Recovery']} />
            <ArchLayer n="08" title="Edge Deployment" items={['Jetson Orin NX (onboard)', 'ArduPilot / Cube Orange+', 'ROS 2 Modular Coordination', 'Local Inference (no cloud)']} />
          </div>
          <div style={{ padding: '16px 22px', background: 'rgba(242,237,216,0.025)', border: '1px solid rgba(242,237,216,0.08)', borderRadius: 8 }}>
            <p style={{ fontSize: 14, lineHeight: 1.75, color: '#B8B4A4' }}>
              <span style={{ color: '#F2EDD8', fontFamily: MONO, fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Validation method:</span> Hardware-in-the-loop simulation with edge deployment assumptions centered on Jetson Orin NX-class compute. Progressive testing protocol with domain randomization for sim-to-reality transfer evaluation.
            </p>
          </div>
        </Section>

        {/* ─ Stack ─ */}
        <Section id="stack">
          <SectionLabel>Technical Stack</SectionLabel>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }} className="two-col-uav">
            {[
              {
                label: 'Core Autonomy',
                color: ACCENT,
                tags: ['Graph-Based RL', 'Graph Neural Networks', 'Graph Attention Networks', 'Q-Prop Actor-Critic', 'MAML Meta-Learning', 'Physics-Informed Neural Networks', 'Model Predictive Control', 'Control Barrier Functions', 'Runtime Assurance'],
              },
              {
                label: 'Perception & AI',
                color: '#4B7BF5',
                tags: ['Stereo / Depth Vision', 'LiDAR Obstacle Detection', 'Vision-Language Models', 'SAM-Style Segmentation', 'Local Language-Action Model', 'Voice Command Pipeline', 'SHAP / LIME Explainability'],
              },
              {
                label: 'Robotics & Hardware',
                color: '#2DD4C8',
                tags: ['ROS 2', 'ArduPilot', 'MAVLink / MAVROS', 'Jetson Orin NX', 'CubePilot Cube Orange+', 'OAK-D Pro FF', 'SLAMTEC C1 LiDAR', 'AirSim (simulation)'],
              },
              {
                label: 'Research Methods',
                color: '#A78BFA',
                tags: ['Domain Randomization', 'Sim-to-Reality Transfer', 'Zero-Shot Evaluation', 'Few-Shot Evaluation', 'Hardware-in-the-Loop Testing', 'Safety & Failure-Mode Analysis', 'Progressive Testing Protocol'],
              },
            ].map(({ label, color, tags }) => (
              <div key={label} style={{ padding: '22px 20px', background: 'rgba(242,237,216,0.025)', borderTop: `2px solid ${color}`, borderRight: '1px solid rgba(242,237,216,0.08)', borderBottom: '1px solid rgba(242,237,216,0.08)', borderLeft: '1px solid rgba(242,237,216,0.08)', borderRadius: 8 }}>
                <div style={{ fontFamily: MONO, fontSize: 10, color, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 14 }}>{label}</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                  {tags.map(t => <Tag key={t} color={color}>{t}</Tag>)}
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* ─ Results ─ */}
        <Section id="results">
          <SectionLabel>Key Results</SectionLabel>
          <h2 style={{ fontFamily: SERIF, fontSize: 'clamp(22px,3vw,32px)', fontWeight: 400, color: '#F2EDD8', marginBottom: 16, lineHeight: 1.2, paddingBottom: '0.06em' }}>
            Validation outcomes from hardware-in-the-loop testing.
          </h2>
          <p style={{ fontSize: 15, lineHeight: 1.85, color: '#B8B4A4', maxWidth: 720, marginBottom: 28 }}>
            Results support the core research direction: graph-structured learning and meta-learning produce UAV autonomy that is more adaptable than systems trained for one fixed environment.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 28 }} className="three-col-uav">
            {[
              { v: '73%', l: 'Zero-shot navigation success in unseen environments' },
              { v: '89%', l: 'Navigation success after five adaptation episodes' },
              { v: '<20ms', l: 'Control-loop latency in hardware-in-the-loop validation' },
              { v: '<500ms', l: 'Voice-to-action interaction latency' },
              { v: '1000+', l: 'Randomized environments used for meta-learning training' },
              { v: '13%', l: 'Simulation-to-reality transfer gap in reported validation' },
            ].map(({ v, l }) => (
              <div key={l} style={{ padding: '16px 18px', background: `linear-gradient(180deg, ${ACCENT}0d, ${ACCENT}04)`, border: `1px solid ${ACCENT}35`, boxShadow: `0 4px 20px ${ACCENT}05`, borderRadius: 8 }}>
                <div style={{ fontFamily: SERIF, fontSize: 28, color: ACCENT, lineHeight: 1, paddingBottom: '0.05em', marginBottom: 8 }}>{v}</div>
                <p style={{ fontSize: 12, lineHeight: 1.6, color: '#B8B4A4' }}>{l}</p>
              </div>
            ))}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }} className="two-col-uav">
            <div style={{ padding: '16px 20px', background: 'rgba(45,212,200,0.06)', border: '1px solid rgba(45,212,200,0.2)', borderRadius: 8 }}>
              <div style={{ fontFamily: MONO, fontSize: 10, color: '#2DD4C8', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>Safety</div>
              <div style={{ fontFamily: SERIF, fontSize: 24, color: '#2DD4C8', marginBottom: 6, paddingBottom: '0.05em' }}>100%</div>
              <p style={{ fontSize: 12, lineHeight: 1.6, color: '#B8B4A4' }}>Collision-free testing across all evaluated safety scenarios in the reported validation.</p>
            </div>
            <div style={{ padding: '16px 20px', background: 'rgba(167,139,250,0.06)', border: '1px solid rgba(167,139,250,0.2)', borderRadius: 8 }}>
              <div style={{ fontFamily: MONO, fontSize: 10, color: '#A78BFA', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>Infrastructure Cost</div>
              <div style={{ fontFamily: SERIF, fontSize: 24, color: '#A78BFA', marginBottom: 6, paddingBottom: '0.05em' }}>95% ↓</div>
              <p style={{ fontSize: 12, lineHeight: 1.6, color: '#B8B4A4' }}>Estimated operational cost reduction by replacing cloud-dependent inference with edge-first architecture.</p>
            </div>
          </div>
        </Section>

        {/* ─ Insights ─ */}
        <Section id="insights">
          <SectionLabel>Key Insights</SectionLabel>
          <div style={{ padding: '28px 32px', background: `${ACCENT}06`, border: `1px solid ${ACCENT}20`, borderRadius: 12, marginBottom: 28 }}>
            <div style={{ fontFamily: MONO, fontSize: 10, color: ACCENT, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>Why Graph-Based RL</div>
            <p style={{ fontSize: 16, lineHeight: 1.8, color: '#F2EDD8' }}>
              Navigation is a relational problem. A flat perception model sees objects — a graph sees relationships between obstacles, goals, risk, and motion constraints. UAV navigation is naturally relational: which gap is safest? which path preserves battery? which region should be avoided? Graphs make these relationships explicit. By using graph-based RL, AeroSynapse gives the UAV a stronger representation for decisions in cluttered and unfamiliar environments.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }} className="two-col-uav">
            {[
              { t: 'Generalization over Peak Performance', d: 'A policy that scores 99% in one simulation environment but fails immediately in any other is not useful for real deployment. Meta-learning shifts the objective from memorization to adaptation.' },
              { t: 'Edge Deployment Changes Every Design Decision', d: 'Inference time, model size, power consumption, and memory constraints are hard limits on a UAV. Every AI component must be designed with those constraints from the beginning.' },
              { t: 'Safety Must Be Designed Around the Policy', d: 'A safety layer added after training is already too late. Runtime assurance, control barriers, and fallback controllers must be designed as first-class components of the autonomy stack.' },
              { t: 'Graph Representations Enable Relational Reasoning', d: 'The most valuable thing about the graph representation isn\'t performance — it\'s interpretability. An operator can understand a graph of obstacles and goals in a way they cannot understand an opaque neural network state.' },
              { t: 'Human Oversight Is a Control Layer, Not a Weakness', d: 'Full autonomy is not always the right answer. The human-in-the-loop modes exist because some decisions require human judgment, and a system that removes that option is more dangerous, not more capable.' },
              { t: 'Credible Research Requires Measurable Claims', d: 'The most important discipline in this project was separating what the architecture is designed to achieve from what has actually been validated. Strong framing with honest limitations is what makes research credible.' },
            ].map(({ t, d }) => (
              <div key={t} style={{ padding: '18px 20px', background: 'rgba(242,237,216,0.025)', border: '1px solid rgba(242,237,216,0.08)', borderRadius: 8 }}>
                <div style={{ fontFamily: MONO, fontSize: 11, color: '#F2EDD8', letterSpacing: '0.04em', marginBottom: 8 }}>{t}</div>
                <p style={{ fontSize: 13, lineHeight: 1.7, color: 'var(--text3)' }}>{d}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* ─ Human-in-the-Loop ─ */}
        <Section id="human-loop">
          <SectionLabel>Human-in-the-Loop Design</SectionLabel>
          <h2 style={{ fontFamily: SERIF, fontSize: 'clamp(22px,3vw,32px)', fontWeight: 400, color: '#F2EDD8', marginBottom: 16, lineHeight: 1.2, paddingBottom: '0.06em' }}>
            The goal is not to remove the human — it&apos;s to put the human at the right level of control.
          </h2>
          <p style={{ fontSize: 15, lineHeight: 1.85, color: '#B8B4A4', maxWidth: 720, marginBottom: 28 }}>
            AeroSynapse uses a tiered human-in-the-loop model. Each mode reflects a different operating condition and trust level in the autonomous system.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12, marginBottom: 28 }} className="two-col-uav">
            {[
              { mode: 'Direct Control', color: '#F07832', d: 'The human operator controls the UAV manually. The autonomy stack is passive. Used during high-risk phases or when the environment is completely novel.' },
              { mode: 'Supervised Autonomy', color: ACCENT, d: 'The UAV proposes or executes navigation actions while the human monitors. The operator can intervene at any point without taking full manual control.' },
              { mode: 'Intervention Mode', color: '#4B7BF5', d: 'The system detects uncertainty, safety constraint proximity, or mission ambiguity and requests human input before continuing autonomous operation.' },
              { mode: 'Natural-Language Command Mode', color: '#A78BFA', d: 'The operator gives high-level mission instructions. The voice-to-action pipeline translates these into safe flight objectives within the current graph representation.' },
            ].map(({ mode, color, d }) => (
              <div key={mode} style={{ padding: '18px 20px', background: `${color}06`, border: `1px solid ${color}22`, borderRadius: 8 }}>
                <div style={{ fontFamily: MONO, fontSize: 10, color, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>{mode}</div>
                <p style={{ fontSize: 13, lineHeight: 1.7, color: '#B8B4A4' }}>{d}</p>
              </div>
            ))}
          </div>
          <div style={{ padding: '20px 24px', background: 'rgba(242,237,216,0.025)', border: '1px solid rgba(242,237,216,0.08)', borderRadius: 8 }}>
            <div style={{ fontFamily: MONO, fontSize: 10, color: '#B8B4A4', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 }}>Safety Mechanisms</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {['Runtime State Monitoring', 'Collision-Distance Constraints', 'Altitude Limits', 'Battery Safety Bounds', 'Emergency Fallback', 'Human Override', 'Baseline Controller Takeover', 'Decision Logging'].map(m => (
                <span key={m} style={{ fontFamily: MONO, fontSize: 10, padding: '4px 9px', background: 'rgba(242,237,216,0.04)', border: '1px solid rgba(242,237,216,0.1)', borderRadius: 4, color: '#B8B4A4' }}>{m}</span>
              ))}
            </div>
          </div>
        </Section>

        {/* ─ Future Work ─ */}
        <Section id="future">
          <SectionLabel>Future Work</SectionLabel>
          <h2 style={{ fontFamily: SERIF, fontSize: 'clamp(22px,3vw,32px)', fontWeight: 400, color: '#F2EDD8', marginBottom: 16, lineHeight: 1.2, paddingBottom: '0.06em' }}>
            Turning the research architecture into a stronger experimental platform.
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 40 }} className="three-col-uav">
            {[
              { n: '01', t: 'Real-Time Graph Pipeline', d: 'Implement a minimal real-time graph-construction pipeline on the Jetson Orin NX and measure latency against the <20ms control-loop target.' },
              { n: '02', t: 'GNN Policy Benchmark', d: 'Train and benchmark a small GNN policy against PPO/SAC baselines on the same randomized environment suite to quantify the graph representation advantage.' },
              { n: '03', t: 'Indoor Test Course', d: 'Build a simplified indoor test course with repeatable obstacle layouts to ground the simulation metrics in real flight data.' },
              { n: '04', t: 'Sim-to-Real Gap Analysis', d: 'Add real flight logs and compare against simulation performance to produce an empirical sim-to-reality gap estimate beyond the current 13%.' },
              { n: '05', t: 'Safety-Gated ArduPilot Integration', d: 'Integrate safety-gated autonomy with ArduPilot flight modes so the constraint layer can trigger failsafe behaviors through the standard flight controller interface.' },
              { n: '06', t: 'Multi-Agent Extension', d: 'Extend the single-UAV graph-based RL framework to cooperative multi-agent UAV navigation for search, coverage, and formation tasks.' },
            ].map(({ n, t, d }) => (
              <div key={n} style={{ padding: '18px 20px', background: 'rgba(242,237,216,0.025)', border: '1px solid rgba(242,237,216,0.08)', borderRadius: 8 }}>
                <div style={{ fontFamily: MONO, fontSize: 10, color: ACCENT, opacity: 0.6, marginBottom: 8 }}>{n}</div>
                <div style={{ fontFamily: MONO, fontSize: 12, color: '#F2EDD8', marginBottom: 8 }}>{t}</div>
                <p style={{ fontSize: 12, lineHeight: 1.65, color: 'var(--text3)' }}>{d}</p>
              </div>
            ))}
          </div>

          {/* Footer CTA */}
          <div style={{ padding: '36px 40px', background: 'rgba(242,237,216,0.025)', border: '1px solid rgba(242,237,216,0.07)', borderRadius: 12, textAlign: 'center' }}>
            <div style={{ fontFamily: MONO, fontSize: 10, color: ACCENT, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 12 }}>AeroSynapse</div>
            <h3 style={{ fontFamily: SERIF, fontSize: 'clamp(20px,3vw,30px)', fontWeight: 400, color: '#F2EDD8', marginBottom: 14, lineHeight: 1.2, paddingBottom: '0.06em' }}>
              Edge AI for the environments that matter most.
            </h3>
            <p style={{ fontSize: 14, lineHeight: 1.75, color: '#B8B4A4', maxWidth: 540, margin: '0 auto 24px' }}>
              Graph learning, meta-learning, safety assurance, and human-AI teaming — composed into a practical autonomy stack for GPS-denied, map-free UAV navigation.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center' }}>
              <a href="/docs/USRCAP_Final_Report.pdf" target="_blank" rel="noopener" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '11px 22px', background: ACCENT, color: '#0B0D14', fontFamily: MONO, fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', borderRadius: 5, textTransform: 'uppercase', textDecoration: 'none' }}>
                Download Research Report ↓
              </a>
              <Link href="/#projects" transitionTypes={['nav-back']} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '11px 22px', border: '1px solid rgba(242,237,216,0.16)', color: '#B8B4A4', fontFamily: MONO, fontSize: 11, letterSpacing: '0.06em', borderRadius: 5, textTransform: 'uppercase', textDecoration: 'none' }}>
                ← Back to Portfolio
              </Link>
            </div>
          </div>
        </Section>
      </div>

      <style>{`
        @media(max-width:640px){
          .metrics-grid-uav { grid-template-columns: repeat(2,1fr) !important; }
          .two-col-uav { grid-template-columns: 1fr !important; }
          .three-col-uav { grid-template-columns: 1fr !important; }
        }
        @media(max-width:900px){
          .three-col-uav { grid-template-columns: repeat(2,1fr) !important; }
        }
      `}</style>
    </div>
  );
}
