'use client';

import dynamic from 'next/dynamic';
import React, { useRef, useEffect, useState } from 'react';
import { Header } from '@/components/ui/header-2';
import { ExpandableCard } from '@/components/ui/expandable-card';
import { AnimatedFeatureSpotlight } from '@/components/ui/feature-spotlight';
import { HoverPeek } from '@/components/ui/link-preview';
import { NeonButton } from '@/components/ui/neon-button';
import { Lightbox } from '@/components/ui/image-lightbox';
import { FlaskConical } from 'lucide-react';
import { motion } from 'framer-motion';
import { fieldNotes } from '@/lib/field-notes';
import { FieldNoteCard } from '@/components/ui/field-notes/field-note-card';

const NebulaCube = dynamic(
  () => import('@/components/ui/explorations-with-gsap-and-scroll-trigger').then(m => ({ default: m.NebulaCube })),
  { ssr: false }
);

// ── Font tokens (single source of truth) ──
const SERIF = "var(--font-chakra), 'Chakra Petch', sans-serif";
const MONO  = "var(--font-chakra), 'Chakra Petch', monospace";
const SANS  = "var(--font-chakra), 'Chakra Petch', sans-serif";

// ── Lightbox context ──
const LightboxCtx = React.createContext<(src: string, alt?: string) => void>(() => {});
function useLightboxOpen() { return React.useContext(LightboxCtx); }

// ── Section Header ──
function SH({ n, label, sub = '', color = '#F0B429' }: { n: string; label: string; sub?: string; color?: string }) {
  return (
    <div style={{ position: 'relative', marginBottom: 52, paddingTop: 8 }}>
      <div aria-hidden style={{ position: 'absolute', top: -32, left: -8, fontFamily: SERIF, fontSize: 'clamp(72px,11vw,160px)', fontWeight: 400, color, opacity: 0.05, lineHeight: 1, userSelect: 'none', pointerEvents: 'none', letterSpacing: '-0.03em', zIndex: 0 }}>{n}</div>
      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: sub ? 10 : 0 }}>
          <span style={{ display: 'inline-block', width: 22, height: 1.5, background: color, opacity: 0.6, flexShrink: 0 }} />
          <span style={{ fontFamily: MONO, fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color }}>{label}</span>
        </div>
        {sub && <p style={{ fontSize: 15, color: '#B8B4A4', maxWidth: 460, lineHeight: 1.65, marginTop: 4, fontFamily: SANS }}>{sub}</p>}
      </div>
    </div>
  );
}

// ── Reveal hook ──
function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.1 });
    io.observe(ref.current);
    return () => io.disconnect();
  }, []);
  return { ref, visible };
}

// ── Tag ──
function Tag({ color = '#4B7BF5', children }: { color?: string; children: React.ReactNode }) {
  return <span style={{ fontFamily: MONO, fontSize: 11, padding: '4px 9px', background: `${color}14`, border: `1px solid ${color}33`, borderRadius: 4, color, letterSpacing: '0.03em' }}>{children}</span>;
}

// ── Section wrapper (overflow-x clipped, vertical visible so italic descenders aren't cut) ──
function Section({ id, children, style }: { id?: string; children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <section id={id} style={{ padding: 'clamp(64px, 8vw, 100px) clamp(20px, 4vw, 52px)', position: 'relative', overflowX: 'clip', overflowY: 'visible', background: 'rgba(11,13,20,0.88)', zIndex: 20, ...style }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        {children}
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// HERO
// ─────────────────────────────────────────────
function Hero() {
  const [rdy, setRdy] = useState(false);
  useEffect(() => { const t = setTimeout(() => setRdy(true), 220); return () => clearTimeout(t); }, []);

  return (
    <section id="hero" style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      overflow: 'hidden',
      background: 'transparent',
      zIndex: 20,
    }}>
      <div style={{
        flex: 1,
        display: 'flex',
        position: 'relative',
        zIndex: 1,
        opacity: rdy ? 1 : 0,
        transition: 'opacity 1.1s cubic-bezier(0.16,1,0.3,1)',
      }}>

        {/* LEFT — 58% */}
        <div className="hero-left" style={{
          flex: '1 1 58%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: 'clamp(64px,6vw,80px) clamp(28px,4vw,64px) clamp(40px,4vw,56px) clamp(20px,4vw,52px)',
        }}>

          {/* center block */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingTop: 24 }}>
            <div style={{ marginBottom: 20 }}>
              <span style={{ fontFamily: MONO, fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#F0B429' }}>Computer Engineer · AI Researcher</span>
            </div>
            <h1 style={{
              fontFamily: SERIF, fontWeight: 400,
              fontSize: 'clamp(56px, 10vw, 132px)',
              lineHeight: 0.95, letterSpacing: '-0.025em', color: '#F2EDD8',
              margin: 0, paddingBottom: '0.08em',
            }}>
              Ahmad<br /><span style={{ color: '#F0B429' }}>Firas</span>
            </h1>
            <p style={{ fontSize: 16, lineHeight: 1.72, color: '#B8B4A4', maxWidth: 440, marginTop: 26, fontFamily: SANS }}>
              Building AI systems for uncertain environments — from UAV autonomy research to enterprise agentic workflows.
            </p>
            <div style={{ marginTop: 28, display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
              <a href="#projects" data-magnetic="" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '11px 24px', background: '#F0B429', color: '#0B0D14', fontFamily: MONO, fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', borderRadius: 5, textTransform: 'uppercase' }}>View Work ↗</a>
              <a href="#contact" data-magnetic="" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '11px 24px', border: '1px solid rgba(242,237,216,0.16)', color: '#B8B4A4', fontFamily: MONO, fontSize: 11, letterSpacing: '0.06em', borderRadius: 5, textTransform: 'uppercase' }}>Get in Touch</a>
              <a href="/docs/Ahmad_Resume_Developer_I_FirstSolar.pdf" target="_blank" rel="noopener" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '9px 18px', border: '1px solid rgba(242,237,216,0.1)', color: '#6E6B60', fontFamily: MONO, fontSize: 10, letterSpacing: '0.07em', borderRadius: 5, textTransform: 'uppercase' }}>Resume ↓</a>
            </div>
          </div>

          {/* bottom scroll hint */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, opacity: 0.45, animation: rdy ? 'bob 2.2s ease-in-out 2s infinite' : 'none' }}>
            <div style={{ width: 1, height: 32, background: 'linear-gradient(to bottom, #F0B429, transparent)' }} />
            <span style={{ fontFamily: MONO, fontSize: 9, letterSpacing: '0.14em', color: '#6E6B60', textTransform: 'uppercase' }}>Scroll to explore</span>
          </div>
        </div>

        {/* RIGHT — 42%, fully transparent, border divider only */}
        <div className="hero-right" style={{
          flex: '0 0 42%',
          borderLeft: '1px solid rgba(240,180,41,0.08)',
          display: 'flex',
          flexDirection: 'column',
          padding: 'clamp(64px,6vw,80px) clamp(24px,3.5vw,48px) clamp(40px,4vw,56px)',
          background: 'transparent',
        }}>
          {/* photo — natural aspect ratio, never cropped */}
          <div style={{ borderRadius: 8, overflow: 'hidden', flexShrink: 0 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <HeroPhoto />
          </div>

          {/* info cards */}
          <div style={{ marginTop: 20 }}>
            {([
              { l: 'Now',      v: 'Sports Analytics Intern',  s: 'UToledo Athletics',             c: '#2DD4C8' },
              { l: 'Research', v: 'LION Lab · CPHS Lab',       s: 'University of Toledo',          c: '#4B7BF5' },
              { l: 'Degree',   v: 'B.S. CS & Engineering',     s: 'Minor: Math · GPA 3.23 · 2026', c: '#A78BFA' },
              { l: 'Focus',    v: 'Agentic AI · UAV · MLOps',  s: null,                            c: '#F0B429' },
            ] as const).map((f) => (
              <div key={f.l} style={{ padding: '10px 0', borderBottom: '1px solid rgba(242,237,216,0.07)' }}>
                <div style={{ fontFamily: MONO, fontSize: 10, color: f.c, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 2, opacity: 0.85 }}>{f.l}</div>
                <div style={{ fontSize: 13, fontWeight: 500, color: '#F2EDD8' }}>{f.v}</div>
                {f.s && <div style={{ fontSize: 11, color: '#6E6B60', marginTop: 1 }}>{f.s}</div>}
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes bob { 0%,100%{transform:translateY(0)} 50%{transform:translateY(6px)} }
        @keyframes pulse-a { 0%{box-shadow:0 0 0 0 rgba(45,212,200,0.5)} 70%{box-shadow:0 0 0 7px rgba(45,212,200,0)} 100%{box-shadow:0 0 0 0 rgba(45,212,200,0)} }
        @media (max-width: 960px) {
          #hero .hero-left { flex: none !important; width: 100% !important; }
          #hero .hero-right { flex: none !important; width: 100% !important; border-left: none !important; border-top: 1px solid rgba(240,180,41,0.08) !important; }
          #hero .hero-right img { max-height: 44vw !important; min-height: 180px; }
        }
        @media (max-width: 600px) {
          #hero .hero-left h1 { font-size: clamp(48px,13vw,80px) !important; }
        }
      `}</style>
    </section>
  );
}

function HeroPhoto() {
  const openLb = useLightboxOpen();
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/Images/my%20pic.png"
      alt="Ahmad Firas"
      onClick={() => openLb('/Images/my%20pic.png', 'Ahmad Firas')}
      style={{
        display: 'block',
        width: '100%',
        height: 'auto',
        maxHeight: 'clamp(220px, calc(100svh - 370px), 390px)',
        objectFit: 'contain',
        objectPosition: 'center top',
        cursor: 'zoom-in',
      }}
    />
  );
}

// ─────────────────────────────────────────────
// ABOUT
// ─────────────────────────────────────────────
function About() {
  const { ref, visible } = useReveal();
  return (
    <Section id="about">
      <SH n="01" label="About" color="#F0B429" />
      <div ref={ref} className={`reveal ${visible ? 'in' : ''}`} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 420px), 1fr))', gap: 48 }}>
        <div>
          <h2 style={{ fontFamily: SERIF, fontSize: 32, fontWeight: 400, lineHeight: 1.25, letterSpacing: '-0.02em', color: '#F2EDD8', paddingBottom: '0.08em' }}>
            Chasing the gap between what AI can do in a lab and what it actually does when someone&apos;s counting on it.
          </h2>
          <p style={{ fontSize: 16, lineHeight: 1.75, color: '#B8B4A4', marginTop: 24 }}>I&apos;m a Computer Science &amp; Engineering graduate from the University of Toledo. My work has moved across autonomous drone systems, enterprise AI, sports analytics, and data engineering — not because I planned a portfolio, but because I follow whatever problem is genuinely hard.</p>
          <p style={{ fontSize: 16, lineHeight: 1.75, color: '#B8B4A4', marginTop: 16 }}>The common thread: does it hold up when someone is counting on it?</p>
          <div style={{ marginTop: 28, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <HoverPeek url="https://linkedin.com/in/ahmadfirasazfar">
              <a href="https://linkedin.com/in/ahmadfirasazfar" target="_blank" rel="noopener" style={{ fontFamily: MONO, fontSize: 11, padding: '10px 20px', border: '1px solid rgba(242,237,216,0.16)', color: '#B8B4A4', borderRadius: 5, textTransform: 'uppercase', letterSpacing: '0.06em' }}>LinkedIn ↗</a>
            </HoverPeek>
            <HoverPeek url="https://github.com/aahmadf123">
              <a href="https://github.com/aahmadf123" target="_blank" rel="noopener" style={{ fontFamily: MONO, fontSize: 11, padding: '10px 20px', border: '1px solid rgba(242,237,216,0.16)', color: '#B8B4A4', borderRadius: 5, textTransform: 'uppercase', letterSpacing: '0.06em' }}>GitHub ↗</a>
            </HoverPeek>
          </div>
        </div>
        <div>
          <div style={{ fontFamily: MONO, fontSize: 11, color: '#6E6B60', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 20 }}>Three things I believe</div>
          {[
            { n: '01', color: '#F0B429', t: 'Interdisciplinary by instinct', b: "The skill that transfers between fields isn't domain knowledge — it's knowing how to ask the right question when you don't have home-field advantage." },
            { n: '02', color: '#4B7BF5', t: 'Human-in-the-loop by design', b: "A system someone can't override isn't autonomous — it's unpredictable. The recovery mechanism is part of the design, not an afterthought." },
            { n: '03', color: '#F07832', t: 'Deployment from line one', b: "Real edge cases, latency requirements, stakeholders who need to understand the output. That pressure makes the work honest." },
          ].map((item) => (
            <div key={item.n} style={{ padding: '18px 20px', border: `1px solid rgba(242,237,216,0.08)`, background: `${item.color}0a`, borderRadius: 6, marginBottom: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <span style={{ fontFamily: MONO, fontSize: 10, color: item.color, opacity: 0.7 }}>{item.n}</span>
                <span style={{ fontSize: 14, fontWeight: 600, color: '#F2EDD8' }}>{item.t}</span>
              </div>
              <p style={{ fontSize: 14, lineHeight: 1.75, color: '#B8B4A4' }}>{item.b}</p>
            </div>
          ))}
          <div style={{ marginTop: 16, padding: '20px', background: 'rgba(242,237,216,0.025)', borderRadius: 8, border: '1px solid rgba(242,237,216,0.08)' }}>
            <div style={{ fontFamily: MONO, fontSize: 11, color: '#A78BFA', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 10 }}>Education</div>
            <div style={{ fontSize: 20, fontWeight: 400, color: '#F2EDD8', fontFamily: SERIF, paddingBottom: '0.05em' }}>University of Toledo</div>
            <div style={{ fontSize: 14, color: '#B8B4A4', marginTop: 3 }}>B.S. Computer Science &amp; Engineering · Minor in Mathematics</div>
            <div style={{ fontFamily: MONO, fontSize: 10, color: '#F0B429', marginTop: 8 }}>2021 – 2026 · Graduated · GPA 3.23</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 12 }}>
              {['Machine Learning', 'Neural Networks', 'Databases', 'Software Eng.', 'Embedded Systems'].map(c => <Tag key={c} color="#4B7BF5">{c}</Tag>)}
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}

// ─────────────────────────────────────────────
// EXPERIENCE
// ─────────────────────────────────────────────
function Experience() {
  const [open, setOpen] = useState<number | null>(null);
  const jobs = [
    { r: 'Sports Analytics & Data Science Intern', co: 'UToledo Athletics', p: 'Oct 2025 – Present', loc: 'Toledo, OH', t: 'Internship', active: true, color: '#2DD4C8', d: 'ML-powered statistical models for roster efficiency and student-athlete benefit allocation. Interactive DOMO dashboards translating performance metrics into coaching insights.', s: ['Python', 'scikit-learn', 'DOMO', 'Statistical Modeling'] },
    { r: 'Microsoft Solution Developer', co: 'First Solar', p: 'Jan 2026 – May 2026', loc: 'Perrysburg, OH', t: 'Full-time', color: '#F0B429', d: 'Design and ship agentic AI solutions in Microsoft Copilot Studio, translating business requirements into autonomous multi-step workflows. Lead intern team on code reviews, delivery milestones, and enterprise governance.', s: ['Copilot Studio', 'Azure AI', 'Power Automate', 'M365', 'Python'] },
    { r: 'Undergraduate Researcher', co: 'LION Lab · CPHS Lab', p: 'May – Dec 2025', loc: 'University of Toledo', t: 'Research Co-Op', color: '#4B7BF5', d: '72.8% zero-shot UAV deployment via MAML across 1,000+ simulated environments. 97.3% HITL success at sub-100ms. Built Deep Flyer drone training platform. Authored ACM Computing Surveys paper on AI failure taxonomy.', s: ['PyTorch', 'ROS 2', 'MAML', 'YOLO11', 'AirSim', 'NVIDIA Jetson'] },
    { r: 'Senior Design Team Lead', co: 'Grange Insurance × UToledo', p: 'Aug 2024 – May 2025', loc: 'Toledo, OH', t: 'Industry Project', color: '#A78BFA', d: 'Led interdisciplinary team delivering MLOps insurance risk model (R² = 0.976). Airflow + MLflow pipeline with drift monitoring and HITL gates, reducing manual intervention by 75%.', s: ['XGBoost', 'Airflow', 'MLflow', 'AWS S3', 'Bayesian Opt.'] },
    { r: 'Database Engineer Co-Op', co: 'Park Place Technologies', p: 'May – Aug 2023', loc: 'Toledo, OH', t: 'Co-Op', color: '#F07832', d: 'Centralized PostgreSQL security database consolidating Active Directory, Cisco AMP, and Microsoft Defender. 15% faster incident response, 95% data integrity, zero data loss in quarterly DR tests.', s: ['PostgreSQL', 'pgAdmin', 'Active Directory', 'Cisco AMP'] },
  ];
  const { ref, visible } = useReveal();
  return (
    <Section id="experience" style={{ background: 'rgba(15,17,25,0.92)' }}>
      <SH n="02" label="Experience" sub="Where the work actually happened." color="#F0B429" />
      <div ref={ref} className={`reveal ${visible ? 'in' : ''}`} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {jobs.map((job, i) => (
          <div key={i} onClick={() => setOpen(open === i ? null : i)}
            style={{ padding: '22px 26px', border: `1px solid ${open === i ? job.color + '55' : 'rgba(242,237,216,0.07)'}`, cursor: 'pointer', background: open === i ? `${job.color}0a` : 'rgba(242,237,216,0.02)', transition: 'all 0.25s', borderRadius: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                  {job.active && <span className="pulse" style={{ width: 6, height: 6, borderRadius: '50%', background: job.color, display: 'inline-block', flexShrink: 0 }} />}
                  <span style={{ fontFamily: MONO, fontSize: 10, color: job.color, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{job.t}</span>
                </div>
                <div style={{ fontFamily: SERIF, fontSize: 20, fontWeight: 400, color: '#F2EDD8', letterSpacing: '-0.01em', lineHeight: 1.25, paddingBottom: '0.05em' }}>{job.r}</div>
                <div style={{ fontSize: 14, color: '#B8B4A4', marginTop: 4 }}>{job.co} · {job.loc}</div>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div style={{ fontFamily: MONO, fontSize: 11, color: '#B8B4A4', letterSpacing: '0.06em' }}>{job.p}</div>
                <span style={{ fontSize: 18, color: job.color, marginTop: 8, display: 'inline-block', transition: 'transform 0.3s', transform: open === i ? 'rotate(45deg)' : 'none' }}>+</span>
              </div>
            </div>
            {open === i && (
              <div style={{ marginTop: 18, paddingTop: 16, borderTop: '1px solid rgba(242,237,216,0.06)' }} onClick={e => e.stopPropagation()}>
                <p style={{ fontSize: 15, lineHeight: 1.8, color: '#B8B4A4', marginBottom: 14 }}>{job.d}</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {job.s.map(s => <Tag key={s} color={job.color}>{s}</Tag>)}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </Section>
  );
}

// ─────────────────────────────────────────────
// PROJECTS (Bodies of Work)
// ─────────────────────────────────────────────
function Projects() {
  const projects: Array<{
    idx: string; dom: string; color: string; title: string; tag: string; fr: string;
    src: string; span: 1 | 2; stacks: string[];
    detail: React.ReactNode;
  }> = [
    {
      idx: '01', dom: 'Autonomy', color: '#F0B429',
      title: 'Graph-Based RL for UAV Autonomy',
      tag: 'USRCAP Summer 2025 · LION Lab · $3,000',
      fr: 'Autonomy that holds up when the map runs out.',
      src: '/Images/graph_RL.png', span: 2,
      stacks: ['Graph-Based RL', 'MAML', 'GNN/GAT', 'PINN', 'ROS 2', 'Jetson Orin NX', 'ArduPilot', 'AirSim'],
      detail: (<>
        {/* Metrics */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8, marginBottom: 20 }}>
          {[['73%','Zero-shot success'],['89%','After 5 episodes'],['<20ms','Control-loop latency'],['<500ms','Voice-to-action'],['1000+','Simulated envs'],['95%','Infra cost reduction']].map(([v,l]) => (
            <div key={l} style={{ padding: '10px 12px', background: 'rgba(240,180,41,0.06)', border: '1px solid rgba(240,180,41,0.2)', borderRadius: 6 }}>
              <div style={{ fontFamily: SERIF, fontSize: 19, color: '#F0B429', lineHeight: 1, paddingBottom: '0.05em' }}>{v}</div>
              <div style={{ fontFamily: MONO, fontSize: 9, color: '#6E6B60', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: 4 }}>{l}</div>
            </div>
          ))}
        </div>

        {/* Overview */}
        <h4 style={{ color: '#F0B429', fontFamily: MONO, fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>Overview</h4>
        <p>AeroSynapse is an edge-first UAV autonomy research framework for navigation in GPS-denied, map-free, and communication-denied environments. The system converts the local environment into a dynamic graph — obstacles, waypoints, targets, and free-space regions become nodes; spatial and risk relationships become edges. A graph-based RL policy reasons over this structure without pre-mapping or cloud inference.</p>

        {/* Architecture */}
        <h4 style={{ color: '#F0B429', fontFamily: MONO, fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: 16, marginBottom: 8 }}>Architecture</h4>
        <p>Stereo vision, LiDAR, and IMU feeds enter a PINN-based state estimator for physically consistent predictions. The environment is encoded as a real-time dynamic graph. A GNN policy with Q-Prop actor-critic selects navigation actions. MAML-style meta-learning trained across 1000+ randomized environments enables zero-shot and few-shot adaptation to unseen layouts. A safety layer with runtime assurance and control-barrier constraints governs the policy, with human-in-the-loop override via direct control, supervised autonomy, and natural-language command modes.</p>

        {/* My Role */}
        <h4 style={{ color: '#F0B429', fontFamily: MONO, fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: 16, marginBottom: 8 }}>My Role</h4>
        <p>Led the full AI and autonomy architecture direction: graph-based RL framework design, zero-shot/few-shot learning methodology, PINN state estimation integration, human-in-the-loop workflow design, Jetson Orin NX edge deployment strategy, and the research framing, validation plan, and performance metrics for the USRCAP fellowship report.</p>

        {/* Stack */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 14, marginBottom: 4 }}>
          {['Graph-Based RL','GNN/GAT','MAML','PINN','Q-Prop','ROS 2','ArduPilot','Jetson Orin NX','AirSim','SHAP/LIME','OAK-D Pro','SLAMTEC C1'].map(t => <Tag key={t} color="#F0B429">{t}</Tag>)}
        </div>

        {/* Key Insight */}
        <h4 style={{ color: '#F0B429', fontFamily: MONO, fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: 16, marginBottom: 8 }}>Key Insight</h4>
        <p>Navigation is a relational problem. A flat perception model sees objects — a graph sees relationships between obstacles, goals, risk, and motion constraints. That structural representation is what makes zero-shot generalization tractable. The safety layer exists not because the policy is weak, but because a UAV autonomy system must fail safely, recover predictably, and keep humans at the right level of control.</p>

        {/* Action buttons */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 22, paddingTop: 16, borderTop: '1px solid rgba(240,180,41,0.15)' }}>
          <a href="/case-study/graph-based-rl-uav-autonomy" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '9px 18px', background: '#F0B429', color: '#0B0D14', fontFamily: MONO, fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', borderRadius: 5, textTransform: 'uppercase', textDecoration: 'none' }}>View Full Case Study ↗</a>
          <a href="/docs/USRCAP_Final_Report.pdf" target="_blank" rel="noopener" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '9px 18px', border: '1px solid rgba(240,180,41,0.35)', color: '#F0B429', fontFamily: MONO, fontSize: 10, letterSpacing: '0.06em', borderRadius: 5, textTransform: 'uppercase', textDecoration: 'none' }}>Final Report ↓</a>
        </div>
      </>),
    },
    {
      idx: '02', dom: 'Research Tools', color: '#4B7BF5',
      title: 'DeepFlyer',
      tag: 'Educational Drone RL Platform · LION Lab',
      fr: 'Reinforcement learning made visible through autonomous drone flight.',
      src: '/Images/DeepFlyer_pics.png', span: 1,
      stacks: ['PPO', 'ROS 2', 'Gazebo', 'Stable-Baselines3', 'React', 'MLflow'],
      detail: (<>
        {/* Metrics */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8, marginBottom: 20 }}>
          {[['80%','PPO success rate'],['<1s','Sim cold start'],['10ms','Reward API latency'],['1M','PPO training steps'],['<5%','Collision false positives'],['40%','URDF mesh optimization']].map(([v,l]) => (
            <div key={l} style={{ padding: '10px 12px', background: 'rgba(75,123,245,0.06)', border: '1px solid rgba(75,123,245,0.2)', borderRadius: 6 }}>
              <div style={{ fontFamily: SERIF, fontSize: 18, color: '#4B7BF5', lineHeight: 1, paddingBottom: '0.05em' }}>{v}</div>
              <div style={{ fontFamily: MONO, fontSize: 9, color: '#6E6B60', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: 4 }}>{l}</div>
            </div>
          ))}
        </div>

        {/* Overview */}
        <h4 style={{ color: '#4B7BF5', fontFamily: MONO, fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>Overview</h4>
        <p>DeepFlyer is a 3D educational drone RL platform inspired by AWS DeepRacer. Instead of racing a 2D car around a track, students train a drone in simulation to fly through hoops, avoid obstacles, and improve through reward-function design. The goal: make reinforcement learning visible — if the reward is poorly shaped, the drone behaves poorly.</p>

        {/* Architecture */}
        <h4 style={{ color: '#4B7BF5', fontFamily: MONO, fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: 16, marginBottom: 8 }}>Platform Stack</h4>
        <p>A React reward editor sits above a Node/Express backend with MongoDB session storage. Reward presets are dynamically switchable through API endpoints consumed by a Gym environment wrapper. Stable-Baselines3 runs PPO training; ROS 2 Humble + Gazebo Fortress simulate the X500 drone with validated URDF, contact sensors, and course elements. MLflow tracks every experiment run.</p>

        {/* My Role */}
        <h4 style={{ color: '#4B7BF5', fontFamily: MONO, fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: 16, marginBottom: 8 }}>My Role</h4>
        <p>Led the RL and AI side of the platform: reward preset design, Path-Efficiency preset concept, PPO benchmarking, Gym/Stable-Baselines3 training workflow, curriculum learning strategy, and connecting the platform to broader UAV autonomy research and sim-to-real learning principles.</p>

        {/* Stack */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 14, marginBottom: 4 }}>
          {['PPO','Stable-Baselines3','Gym','ROS 2','Gazebo Fortress','React','Node.js','Express','MongoDB','MLflow','X500 URDF','ZED Mini'].map(t => <Tag key={t} color="#4B7BF5">{t}</Tag>)}
        </div>

        {/* Key Insight */}
        <h4 style={{ color: '#4B7BF5', fontFamily: MONO, fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: 16, marginBottom: 8 }}>Key Insight</h4>
        <p>Reward functions are not just math — they encode behavior. A student who increases the collision penalty and watches the drone become more conservative has understood something that no lecture can teach as directly. That physical intuition is what DeepFlyer is built to create.</p>

        {/* Action button */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 22, paddingTop: 16, borderTop: '1px solid rgba(75,123,245,0.15)' }}>
          <a href="/case-study/deepflyer-drone-reinforcement-learning" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '9px 18px', background: '#4B7BF5', color: '#fff', fontFamily: MONO, fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', borderRadius: 5, textTransform: 'uppercase', textDecoration: 'none' }}>View Full Case Study ↗</a>
        </div>
      </>),
    },
    {
      idx: '03', dom: 'ACM CSUR', color: '#F07832',
      title: '4-Pillars Taxonomy',
      tag: 'ACM Computing Surveys · Under Review',
      fr: 'A framework for how deployed intelligence breaks, and why it repeats.',
      src: '/Images/4-Pillars.png', span: 1,
      stacks: ['Taxonomy Design', 'Literature Review', 'AI Safety'],
      detail: (<>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10, marginBottom: 16 }}>
          {[['37','AI failures analyzed'],['127','Sources reviewed'],['Apr 2026','Submitted']].map(([v,l]) => (
            <div key={l} style={{ padding: '10px 12px', background: 'rgba(240,120,50,0.06)', border: '1px solid rgba(240,120,50,0.2)', borderRadius: 6 }}>
              <div style={{ fontFamily: SERIF, fontSize: 22, color: '#F07832', lineHeight: 1, paddingBottom: '0.05em' }}>{v}</div>
              <div style={{ fontFamily: MONO, fontSize: 9, color: '#6E6B60', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: 4 }}>{l}</div>
            </div>
          ))}
        </div>
        <h4 style={{ color: '#F07832', fontFamily: MONO, fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>Overview</h4>
        <p>A four-pillar taxonomy of AI failures in safety-critical autonomous environments, synthesized from 37 documented incidents across 127 sources. Published to ACM Computing Surveys, currently under review.</p>
        <a href="#research" onClick={(e) => { e.preventDefault(); document.getElementById('research')?.scrollIntoView({ behavior: 'smooth' }); }} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 14, padding: '8px 16px', border: '1px solid rgba(240,120,50,0.3)', borderRadius: 5, color: '#F07832', fontFamily: MONO, fontSize: 10, letterSpacing: '0.06em', textTransform: 'uppercase', cursor: 'pointer' }}>Full methodology in Research section ↓</a>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 12 }}>
          {['Taxonomy Design','Literature Review','AI Safety','ACM CSUR'].map(t => <Tag key={t} color="#F07832">{t}</Tag>)}
        </div>
      </>),
    },
    {
      idx: '04', dom: 'MLOps', color: '#A78BFA',
      title: 'Homeowner Loss Prediction',
      tag: 'Grange Insurance × UToledo · Senior Design',
      fr: 'Risk modeling as a continuous operating system, not a batch job.',
      src: '/Images/SeniorDesign_Pipeline.jpeg', span: 2,
      stacks: ['XGBoost', 'Airflow', 'MLflow', 'AWS S3/EC2', 'Pandera', 'Prometheus', 'Hyperopt', 'SHAP'],
      detail: (<>
        {/* Metrics */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8, marginBottom: 20 }}>
          {[['R² 0.982','Model accuracy'],['RMSE 7216','Prediction error'],['26%','vs GLM baseline'],['75%','Manual review ↓']].map(([v,l]) => (
            <div key={l} style={{ padding: '10px 12px', background: 'rgba(167,139,250,0.06)', border: '1px solid rgba(167,139,250,0.2)', borderRadius: 6 }}>
              <div style={{ fontFamily: SERIF, fontSize: 19, color: '#A78BFA', lineHeight: 1, paddingBottom: '0.05em' }}>{v}</div>
              <div style={{ fontFamily: MONO, fontSize: 9, color: '#6E6B60', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: 4 }}>{l}</div>
            </div>
          ))}
        </div>

        {/* Overview */}
        <h4 style={{ color: '#A78BFA', fontFamily: MONO, fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>Overview</h4>
        <p>A production-grade MLOps automation pipeline built with Grange Insurance to modernize homeowner risk and pure premium predictions. The project reframed risk modeling as a continuously operating system — automating the full ML lifecycle from raw data ingestion through drift detection, model training, experiment tracking, and human-approved deployment.</p>

        {/* Problem */}
        <h4 style={{ color: '#A78BFA', fontFamily: MONO, fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: 16, marginBottom: 8 }}>Problem</h4>
        <p>Traditional actuarial workflows depend on manual data pulls, notebook-based preprocessing, and repeated model rebuilds. Risk patterns shift faster than manual processes can adapt — claim volatility, inflation, weather events, and regional property trends all create windows where stale models drive pricing decisions.</p>

        {/* Architecture */}
        <h4 style={{ color: '#A78BFA', fontFamily: MONO, fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: 16, marginBottom: 8 }}>Architecture</h4>
        <p>Airflow orchestrates ingestion and scheduling. Pandera validates schemas. XGBoost with Hyperopt/Bayesian optimization handles prediction across 100+ engineered features. MLflow tracks every experiment, artifact, and model version. Prometheus monitors system health. Drift detection triggers self-healing retraining workflows. Slack delivers alerts and approval requests. Human-in-the-loop gates require analyst sign-off before retraining or model promotion — automation with accountability, not without it.</p>

        {/* My Role */}
        <h4 style={{ color: '#A78BFA', fontFamily: MONO, fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: 16, marginBottom: 8 }}>My Role</h4>
        <p>Led MLOps architecture design, pipeline decomposition, ingestion/preprocessing modules, drift detection, schema validation, AWS infrastructure (EC2, S3, Prometheus), Airflow orchestration strategy, Slack-based human-in-the-loop workflows, testing automation, and dashboard design.</p>

        {/* Stack */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 14, marginBottom: 4 }}>
          {['XGBoost','Hyperopt','Airflow','MLflow','AWS S3','AWS EC2','Pandera','Prometheus','Slack API','Docker','GitHub Actions','SHAP','scikit-learn'].map(t => <Tag key={t} color="#A78BFA">{t}</Tag>)}
        </div>

        {/* Key Insight */}
        <h4 style={{ color: '#A78BFA', fontFamily: MONO, fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: 16, marginBottom: 8 }}>Key Insight</h4>
        <p>The 75% reduction in manual review didn&apos;t happen because humans were removed from the workflow. It happened because the system moved humans to the right point in the loop — intervening only where judgment actually matters: drift remediation, suspicious model behavior, hyperparameter override, rollback, or production promotion.</p>

        {/* Action buttons */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 22, paddingTop: 16, borderTop: '1px solid rgba(167,139,250,0.15)' }}>
          <a href="/case-study/homeowner-loss-prediction" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '9px 18px', background: '#A78BFA', color: '#0B0D14', fontFamily: MONO, fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', borderRadius: 5, textTransform: 'uppercase', textDecoration: 'none' }}>View Full Case Study ↗</a>
          <a href="/docs/EECS4020_FinalReport_G3.pdf" target="_blank" rel="noopener" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '9px 18px', border: '1px solid rgba(167,139,250,0.35)', color: '#A78BFA', fontFamily: MONO, fontSize: 10, letterSpacing: '0.06em', borderRadius: 5, textTransform: 'uppercase', textDecoration: 'none' }}>Final Report ↓</a>
          <a href="https://github.com/RayFrightener/ml_automation" target="_blank" rel="noopener" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '9px 18px', border: '1px solid rgba(242,237,216,0.12)', color: '#B8B4A4', fontFamily: MONO, fontSize: 10, letterSpacing: '0.06em', borderRadius: 5, textTransform: 'uppercase', textDecoration: 'none' }}>GitHub ↗</a>
        </div>
      </>),
    },
    {
      idx: '05', dom: 'Infrastructure', color: '#2DD4C8',
      title: 'Security Discovery Tool',
      tag: 'Park Place Technologies · AIIS Summer 2023',
      fr: 'Security operations gained one dependable source of truth.',
      src: '/Images/sdt_tool.png', span: 1,
      stacks: ['PostgreSQL', 'pgAdmin', 'Active Directory', 'Cisco AMP', 'Microsoft Defender', 'SQL'],
      detail: (<>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10, marginBottom: 16 }}>
          {[['15%','Faster incident response'],['95%','Data integrity improvement'],['Zero','Data loss in DR tests'],['3','Consolidated security sources'],['AIIS','Summer 2023'],['100%','On-time delivery']].map(([v,l]) => (
            <div key={l} style={{ padding: '10px 12px', background: 'rgba(45,212,200,0.06)', border: '1px solid rgba(45,212,200,0.2)', borderRadius: 6 }}>
              <div style={{ fontFamily: SERIF, fontSize: 20, color: '#2DD4C8', lineHeight: 1, paddingBottom: '0.05em' }}>{v}</div>
              <div style={{ fontFamily: MONO, fontSize: 9, color: '#6E6B60', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: 4 }}>{l}</div>
            </div>
          ))}
        </div>
        <h4 style={{ color: '#2DD4C8', fontFamily: MONO, fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>Overview</h4>
        <p>Industry case study with Park Place Technologies. Designed a centralized PostgreSQL security database consolidating fragmented feeds from Active Directory, Cisco AMP, and Microsoft Defender — enforcing validation rules, building disaster-recovery procedures, and enabling faster analyst queries.</p>
        <h4 style={{ color: '#2DD4C8', fontFamily: MONO, fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: 14, marginBottom: 8 }}>My Role</h4>
        <p>Database engineering on the AIIS Database I team: schema design, SQL, data-integrity validation, DR simulation planning, and technical documentation.</p>
        <h4 style={{ color: '#2DD4C8', fontFamily: MONO, fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: 14, marginBottom: 8 }}>Key Insight</h4>
        <p>Most data-quality problems in security ops aren&apos;t adversarial — they&apos;re inconsistent tooling assumptions meeting at a shared data boundary. A validated schema is a security control.</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 12, marginBottom: 16 }}>
          {['PostgreSQL','pgAdmin','Active Directory','Cisco AMP','Microsoft Defender','Data Governance','Disaster Recovery','SQL'].map(t => <Tag key={t} color="#2DD4C8">{t}</Tag>)}
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 8, paddingTop: 14, borderTop: '1px solid rgba(45,212,200,0.15)' }}>
          <a href="/case-study/security-discovery-tool" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '9px 18px', background: '#2DD4C8', color: '#0B0D14', fontFamily: MONO, fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', borderRadius: 5, textTransform: 'uppercase', textDecoration: 'none' }}>View Full Case Study ↗</a>
        </div>
      </>),
    },
    {
      idx: '06', dom: 'Hackathon', color: '#F0B429',
      title: 'DeepTruth',
      tag: 'RocketHacks 2025 · Best Use of MongoDB Atlas',
      fr: 'AI-assisted credibility analysis for a noisy internet.',
      src: '/Images/DeepTruth_Group.png', span: 1,
      stacks: ['Gemini AI', 'DistilBERT', 'Django', 'React', 'MongoDB', 'Chrome Extension'],
      detail: (<>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10, marginBottom: 16 }}>
          {[['#1','Best Use of MongoDB Atlas'],['24h','Build sprint'],['70/30','Gemini / DistilBERT weight'],['2','Interfaces: web + extension'],['9.5K','Training data points'],['2025','RocketHacks']].map(([v,l]) => (
            <div key={l} style={{ padding: '10px 12px', background: 'rgba(240,180,41,0.06)', border: '1px solid rgba(240,180,41,0.2)', borderRadius: 6 }}>
              <div style={{ fontFamily: SERIF, fontSize: 20, color: '#F0B429', lineHeight: 1, paddingBottom: '0.05em' }}>{v}</div>
              <div style={{ fontFamily: MONO, fontSize: 9, color: '#6E6B60', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: 4 }}>{l}</div>
            </div>
          ))}
        </div>
        <h4 style={{ color: '#F0B429', fontFamily: MONO, fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>What Was Built</h4>
        <p>A web app and Chrome extension that analyze article titles using dual-model AI — Gemini handles high-level reasoning and explanation, DistilBERT adds NLP classification, and a 70/30 weighted fusion produces a credibility score, veracity assessment, reasoning, and independent source links. Claims stored in MongoDB.</p>
        <h4 style={{ color: '#F0B429', fontFamily: MONO, fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: 14, marginBottom: 8 }}>Key Insight</h4>
        <p>Credibility systems need explanations, not only scores — and multi-model architectures are more honest than trusting a single signal. The goal was never to decide truth; it was to help users ask better questions faster.</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 12, marginBottom: 16 }}>
          {['Gemini AI','DistilBERT','Django REST','React','Vite','MongoDB','Chrome Extension','NLP','Hugging Face'].map(t => <Tag key={t} color="#F0B429">{t}</Tag>)}
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 8, paddingTop: 14, borderTop: '1px solid rgba(240,180,41,0.15)' }}>
          <a href="/case-study/deeptruth-ai-fact-checking" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '9px 18px', background: '#F0B429', color: '#0B0D14', fontFamily: MONO, fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', borderRadius: 5, textTransform: 'uppercase', textDecoration: 'none' }}>View Full Case Study ↗</a>
          <a href="https://github.com/TheChozenWon/DeepTruth.git" target="_blank" rel="noopener" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '9px 18px', border: '1px solid rgba(240,180,41,0.35)', color: '#F0B429', fontFamily: MONO, fontSize: 10, letterSpacing: '0.06em', borderRadius: 5, textTransform: 'uppercase', textDecoration: 'none' }}>GitHub ↗</a>
          <a href="https://youtu.be/whTYKriT5JU?si=M-0yUWXURhPrvy--" target="_blank" rel="noopener" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '9px 18px', border: '1px solid rgba(242,237,216,0.12)', color: '#B8B4A4', fontFamily: MONO, fontSize: 10, letterSpacing: '0.06em', borderRadius: 5, textTransform: 'uppercase', textDecoration: 'none' }}>Watch Demo ↗</a>
        </div>
      </>),
    },
    {
      idx: '07', dom: 'Embedded', color: '#F07832',
      title: 'Camel Car',
      tag: 'AIChE 2025 · Most Innovative Car Design · 3rd Poster · 24th Overall',
      fr: 'Chemical propulsion. Pressure-triggered stop. No second chances.',
      src: '/Images/AIChE%20ChemECar_International.jpg', span: 1,
      stacks: ['Arduino', 'Pressure Sensing', 'Solenoid Control', 'Embedded C', 'Calibration'],
      detail: (<>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10, marginBottom: 16 }}>
          {[['#1','Most Innovative Car Design'],['3rd','Poster & Presentation'],['24th','Overall at AIChE 2025'],['Boston','AIChE Annual Conf.'],['~5 psi','Stop threshold setpoint'],['2025','National qualifier']].map(([v,l]) => (
            <div key={l} style={{ padding: '10px 12px', background: 'rgba(240,120,50,0.06)', border: '1px solid rgba(240,120,50,0.2)', borderRadius: 6 }}>
              <div style={{ fontFamily: SERIF, fontSize: 20, color: '#F07832', lineHeight: 1, paddingBottom: '0.05em' }}>{v}</div>
              <div style={{ fontFamily: MONO, fontSize: 9, color: '#6E6B60', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: 4 }}>{l}</div>
            </div>
          ))}
        </div>
        <h4 style={{ color: '#F07832', fontFamily: MONO, fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>What Was Built</h4>
        <p>University of Toledo&apos;s competition vehicle using CO₂ generation for propulsion and H₂O₂ decomposition for stopping. As Control Team Lead, I built the Arduino-based pressure-sensing and shutoff system — monitor the stopping reaction, detect the ~5 psi setpoint, trigger the solenoid to cut gas flow to the motor. Calibrated via KI volume vs. time-to-pressure experiments for the target competition distance.</p>
        <h4 style={{ color: '#F07832', fontFamily: MONO, fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: 14, marginBottom: 8 }}>Key Insight</h4>
        <p>The chemistry creates the signal. The control system is what turns that signal into a repeatable vehicle action. A well-calibrated threshold controller beats a complex one when variability is chemical, not electrical.</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 12, marginBottom: 16 }}>
          {['Arduino','Pressure Sensing','Solenoid Control','Embedded C','Calibration','Safety Systems','CO₂ Propulsion'].map(t => <Tag key={t} color="#F07832">{t}</Tag>)}
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 8, paddingTop: 14, borderTop: '1px solid rgba(240,120,50,0.15)' }}>
          <a href="/case-study/camel-car-cheme-car-control-system" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '9px 18px', background: '#F07832', color: '#0B0D14', fontFamily: MONO, fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', borderRadius: 5, textTransform: 'uppercase', textDecoration: 'none' }}>View Full Case Study ↗</a>
        </div>
      </>),
    },
    {
      idx: '08', dom: 'Civic Tech', color: '#F472B6',
      title: 'Batting Cleanup',
      tag: 'City of Toledo · Applied Labs · In Production',
      fr: 'Cleaner cities need better feedback loops.',
      src: '/Images/Batting_Cleanup.jpg', span: 1,
      stacks: ['Deno', 'PostGIS', 'Cloudflare Workers', 'Drizzle ORM', 'Docker', 'Hono'],
      detail: (<>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10, marginBottom: 16 }}>
          {[['Live','Production deployment'],['10K+','Simulated localized assets'],['<10ms','ST_DWithin geofence query'],['7-dev','Docker Compose team env'],['GiST','Spatial index — no table scans'],['QR','Public reporting workflow']].map(([v,l]) => (
            <div key={l} style={{ padding: '10px 12px', background: 'rgba(244,114,182,0.06)', border: '1px solid rgba(244,114,182,0.2)', borderRadius: 6 }}>
              <div style={{ fontFamily: SERIF, fontSize: 20, color: '#F472B6', lineHeight: 1, paddingBottom: '0.05em' }}>{v}</div>
              <div style={{ fontFamily: MONO, fontSize: 9, color: '#6E6B60', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: 4 }}>{l}</div>
            </div>
          ))}
        </div>
        <h4 style={{ color: '#F472B6', fontFamily: MONO, fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>What Was Built</h4>
        <p>A production smart-city waste reporting system for downtown Toledo. Residents scan QR codes on public trash assets to instantly file maintenance reports. I contributed to backend architecture: modernized raw init scripts into a type-safe Deno monorepo, built PostGIS geospatial models with GiST indexing, benchmarked ST_DWithin queries against 10,000+ assets, designed Docker Compose local infra for the 7-person team, and implemented location-verification and anti-spoofing layers.</p>
        <h4 style={{ color: '#F472B6', fontFamily: MONO, fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: 14, marginBottom: 8 }}>Key Insight</h4>
        <p>The hard part was not making a form. The hard part was making location-aware public reporting reliable enough for real city use — GPS noise, indoor submissions, spoofing attempts, and all.</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 12, marginBottom: 16 }}>
          {['Deno','PostGIS','Cloudflare Workers','Hono','Drizzle ORM','Docker','GiST Indexing','Geospatial Validation','Anti-Spoofing'].map(t => <Tag key={t} color="#F472B6">{t}</Tag>)}
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 8, paddingTop: 14, borderTop: '1px solid rgba(244,114,182,0.15)' }}>
          <a href="/case-study/batting-cleanup-smart-city-waste-reporting" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '9px 18px', background: '#F472B6', color: '#0B0D14', fontFamily: MONO, fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', borderRadius: 5, textTransform: 'uppercase', textDecoration: 'none' }}>View Full Case Study ↗</a>
          <a href="https://battingcleanup.appliedlabs.org/" target="_blank" rel="noopener" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '9px 18px', border: '1px solid rgba(244,114,182,0.35)', color: '#F472B6', fontFamily: MONO, fontSize: 10, letterSpacing: '0.06em', borderRadius: 5, textTransform: 'uppercase', textDecoration: 'none' }}>Documentation ↗</a>
          <a href="https://toledofreepress.com/batting-cleanup-aims-to-improve-toledo-maintenance-with-tech/" target="_blank" rel="noopener" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '9px 18px', border: '1px solid rgba(242,237,216,0.12)', color: '#B8B4A4', fontFamily: MONO, fontSize: 10, letterSpacing: '0.06em', borderRadius: 5, textTransform: 'uppercase', textDecoration: 'none' }}>News Article ↗</a>
        </div>
      </>),
    },
    {
      idx: '09', dom: 'Athletics', color: '#0EA5E9',
      title: 'Champions Complex Digital Campaign',
      tag: 'University of Toledo Athletics · Digital Fundraising Campaign',
      fr: 'The physical facility builds champions. The digital campaign builds belief.',
      src: '/Images/Champion_Complex_Render1.jpg', span: 2,
      stacks: ['Web Strategy', 'Sidearm Sports', 'Donor UX', 'Information Architecture', 'Digital Fundraising', 'Brand Strategy'],
      detail: (<>
        {/* Metrics */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8, marginBottom: 20 }}>
          {[['74K sq ft','Renovation scope'],['450+','Student-athletes impacted'],['10','Architectural renderings'],['6','Donor journey stages'],['Sidearm','Narrator platform'],['UToledo','Brand-aligned']].map(([v,l]) => (
            <div key={l} style={{ padding: '10px 12px', background: 'rgba(14,165,233,0.06)', border: '1px solid rgba(14,165,233,0.2)', borderRadius: 6 }}>
              <div style={{ fontFamily: SERIF, fontSize: 19, color: '#0EA5E9', lineHeight: 1, paddingBottom: '0.05em' }}>{v}</div>
              <div style={{ fontFamily: MONO, fontSize: 9, color: '#6E6B60', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: 4 }}>{l}</div>
            </div>
          ))}
        </div>

        {/* Overview */}
        <h4 style={{ color: '#0EA5E9', fontFamily: MONO, fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>Overview</h4>
        <p>The Champions Complex Digital Campaign is a strategic webpage and digital fundraising blueprint for University of Toledo Athletics. The project supports the Champions Complex initiative — a 74,000-square-foot renovation of the Health Education Building into a centralized home for student-athlete development, bringing academics, nutrition, wellness, training, and team spaces under one roof while returning baseball and softball to main campus.</p>

        {/* My Role */}
        <h4 style={{ color: '#0EA5E9', fontFamily: MONO, fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: 16, marginBottom: 8 }}>My Role</h4>
        <p>Created the full digital campaign strategy: information architecture, scroll-based donor journey, rendering-to-section narrative mapping, Sidearm Sports / Narrator implementation planning, donation CTA flow, naming-rights structure, UToledo brand alignment, and digital donor recognition concepts. The work sits at the intersection of web development, UX, sports marketing, and donor psychology.</p>

        {/* Digital Strategy */}
        <h4 style={{ color: '#0EA5E9', fontFamily: MONO, fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: 16, marginBottom: 8 }}>Digital Strategy</h4>
        <p>The page follows a deliberate six-stage donor psychology sequence: Awe → Understanding → Trust → Exploration → Legacy → Action. Each architectural rendering is assigned to a specific narrative section rather than a generic gallery — exterior dusk rendering opens the hero, Academic Center renders anchor the excellence section, Champions Corridor ties donor recognition to legacy. Sidearm Narrator enables the immersive single-page experience using parallax, sliders, and scroll-triggered animation within the existing athletics web ecosystem.</p>

        {/* Stack */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 14, marginBottom: 4 }}>
          {['Sidearm Sports','Sidearm Narrator','Web Strategy','Information Architecture','Donor UX','Digital Fundraising','Sports Marketing','Brand Strategy','UToledo Design System','Naming-Rights Planning','Conversion Psychology'].map(t => <Tag key={t} color="#0EA5E9">{t}</Tag>)}
        </div>

        {/* Key Insight */}
        <h4 style={{ color: '#0EA5E9', fontFamily: MONO, fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: 16, marginBottom: 8 }}>Key Insight</h4>
        <p>Capital campaign websites are conversion systems, not information pages. Donor trust is built through clarity, momentum, and proof — not renderings alone. The donation flow must be designed as carefully as the visual experience: a donor who is emotionally convinced should not have to search for the next step.</p>

        {/* Action buttons */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 22, paddingTop: 16, borderTop: '1px solid rgba(14,165,233,0.15)' }}>
          <a href="/case-study/champions-complex-digital-campaign" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '9px 18px', background: '#0EA5E9', color: '#0B0D14', fontFamily: MONO, fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', borderRadius: 5, textTransform: 'uppercase', textDecoration: 'none' }}>View Full Case Study ↗</a>
        </div>
      </>),
    },
    {
      idx: '10', dom: 'Internal Tools', color: '#22C55E',
      title: 'Toledo Athletics Onboarding Portal',
      tag: 'University of Toledo Athletics · Internal Platform',
      fr: 'Great onboarding is infrastructure for institutional memory.',
      src: '/Images/Toledo_Athletics_Onboarding.png', span: 2,
      stacks: ['Cloudflare Workers', 'Hono', 'React', 'Cloudflare D1', 'Workers AI', 'TypeScript'],
      detail: (<>
        {/* Metrics */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8, marginBottom: 20 }}>
          {[['14','DB schema tables'],['5','Core services'],['10+','Onboarding content areas'],['Serverless','Edge deployment'],['Workers AI','Chat assistant'],['Moderated','Tips workflow']].map(([v,l]) => (
            <div key={l} style={{ padding: '10px 12px', background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: 6 }}>
              <div style={{ fontFamily: SERIF, fontSize: 19, color: '#22C55E', lineHeight: 1, paddingBottom: '0.05em' }}>{v}</div>
              <div style={{ fontFamily: MONO, fontSize: 9, color: '#6E6B60', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: 4 }}>{l}</div>
            </div>
          ))}
        </div>

        {/* Overview */}
        <h4 style={{ color: '#22C55E', fontFamily: MONO, fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>Overview</h4>
        <p>A serverless internal onboarding platform built for University of Toledo Athletics staff. The portal centralizes official onboarding articles, staff hierarchy, key contacts, HR timelines, compliance resources, systems directories, policy links, quick links, and moderated employee tips — replacing scattered documents and tribal knowledge with a single searchable source of truth.</p>

        {/* Problem */}
        <h4 style={{ color: '#22C55E', fontFamily: MONO, fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: 16, marginBottom: 8 }}>Problem</h4>
        <p>New staff entering a Division I athletics department must simultaneously navigate university HR, NCAA compliance, Title IX, NIL rules, FERPA, IT systems, campus logistics, facilities, brand standards, and athletics-specific workflows. Without a centralized system, onboarding is inconsistent, supervisors repeat themselves, and outdated information creates operational and compliance risk.</p>

        {/* Architecture */}
        <h4 style={{ color: '#22C55E', fontFamily: MONO, fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: 16, marginBottom: 8 }}>Architecture</h4>
        <p>React SPA frontend → Cloudflare Worker API → Hono routes → Cloudflare D1 (SQLite relational schema) → Workers AI chat assistant. The database separates official published content from employee submissions behind a moderation layer: staff submit tips, which remain pending until a moderator approves or rejects them. This captures practical knowledge without letting unverified guidance become official policy.</p>

        {/* My Role */}
        <h4 style={{ color: '#22C55E', fontFamily: MONO, fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: 16, marginBottom: 8 }}>My Role</h4>
        <p>Designed and built the full platform: onboarding content architecture, relational schema design across 14 tables, Cloudflare Workers + Hono serverless API, React SPA, Workers AI chat integration, moderated knowledge-management workflow, and a maintenance guide for future staff to update content, contacts, policies, and systems without touching the codebase.</p>

        {/* Stack */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 14, marginBottom: 4 }}>
          {['Cloudflare Workers','Hono','TypeScript','React','Cloudflare D1','SQLite','Workers AI','Wrangler','Serverless','Knowledge Management','NCAA Compliance','HR Onboarding'].map(t => <Tag key={t} color="#22C55E">{t}</Tag>)}
        </div>

        {/* Key Insight */}
        <h4 style={{ color: '#22C55E', fontFamily: MONO, fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: 16, marginBottom: 8 }}>Key Insight</h4>
        <p>Onboarding is a knowledge-management problem, not a documentation problem. The moderation layer matters most: athletics onboarding covers compliance topics where incorrect guidance about NCAA rules, Title IX, NIL, FERPA, or HR policy creates institutional risk. The portal captures real staff knowledge while preserving administrative control over what becomes official.</p>

        {/* Action buttons */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 22, paddingTop: 16, borderTop: '1px solid rgba(34,197,94,0.15)' }}>
          <a href="/case-study/toledo-athletics-onboarding-portal" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '9px 18px', background: '#22C55E', color: '#0B0D14', fontFamily: MONO, fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', borderRadius: 5, textTransform: 'uppercase', textDecoration: 'none' }}>View Full Case Study ↗</a>
        </div>
      </>),
    },
  ];
  const { ref, visible } = useReveal();
  return (
    <Section id="projects">
      <SH n="03" label="Bodies of Work" sub="Each project a different operating condition. Click any card for the full case study." color="#F0B429" />
      <div ref={ref} className={`reveal ${visible ? 'in' : ''}`}
        style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
        {projects.map((p) => (
          <div key={p.title} style={{ gridColumn: `span ${p.span}` }}>
            <ExpandableCard
              title={p.title}
              src={p.src}
              description={`${p.dom.toUpperCase()} · ${p.idx}`}
              thumbnailAspect={p.span === 2 ? '16/7' : '4/3'}
              thumbnailSubtitle={p.fr}
              thumbnailTags={p.stacks}
              accentColor={p.color}
            >
              {p.detail}
            </ExpandableCard>
          </div>
        ))}
      </div>
      <style>{`@media(max-width:900px){#projects .reveal{grid-template-columns:repeat(2,1fr)!important}#projects .reveal>div[style*="span 2"]{grid-column:span 2!important}}@media(max-width:600px){#projects .reveal{grid-template-columns:1fr!important}#projects .reveal>div[style*="span 2"]{grid-column:span 1!important}}`}</style>
    </Section>
  );
}

// ─────────────────────────────────────────────
// RESEARCH
// ─────────────────────────────────────────────
function Research() {
  const { ref, visible } = useReveal();
  const openLb = useLightboxOpen();
  return (
    <Section id="research" style={{ background: 'rgba(15,17,25,0.92)' }}>
      <SH n="04" label="Research" sub="Published work and ongoing investigations." color="#4B7BF5" />
      <div ref={ref} className={`reveal ${visible ? 'in' : ''}`}>
        <AnimatedFeatureSpotlight
          preheaderIcon={<FlaskConical className="h-4 w-4" />}
          preheaderText="ACM Computing Surveys · Under Review · 2025"
          heading={<><span style={{ color: '#4B7BF5' }}>AI Failure</span> Taxonomy for<br />Autonomous Systems</>}
          description="A four-pillar taxonomy of AI failures in safety-critical autonomous environments. Synthesizes 37 documented incidents across 127 sources, formalizing how data-environment mismatch, oversight gaps, distributional brittleness, and multi-agent instability compound under operational stress."
          buttonText="View Research"
          buttonProps={{ onClick: () => window.open('/docs/Manuscript.pdf', '_blank'), style: { background: '#4B7BF5', color: '#fff', border: 'none' } }}
          imageUrl="/Images/4-Pillars.png"
          imageAlt="4-Pillars AI failure taxonomy"
          onImageClick={() => openLb('/Images/4-Pillars.png', '4-Pillars AI Failure Taxonomy')}
          style={{ border: 'none', background: 'transparent' }}
        />
        <div style={{ marginTop: 40, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
          {[
            { metric: '37', label: 'AI failures analyzed', color: '#4B7BF5' },
            { metric: '127', label: 'Sources reviewed', color: '#2DD4C8' },
            { metric: '4', label: 'Pillars in taxonomy', color: '#F0B429' },
            { metric: '2025', label: 'ACM CSUR submission', color: '#A78BFA' },
          ].map((m) => (
            <div key={m.label} style={{ padding: '24px', background: `${m.color}08`, border: `1px solid ${m.color}33`, borderRadius: 8 }}>
              <div style={{ fontFamily: SERIF, fontSize: 38, fontWeight: 400, color: '#F2EDD8', lineHeight: 1, paddingBottom: '0.05em' }}>{m.metric}</div>
              <div style={{ fontFamily: MONO, fontSize: 10, color: '#6E6B60', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: 8 }}>{m.label}</div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 24, display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 10 }} className="two-col-pillars">
          {[
            { n: '01', label: 'Data-Environment Mismatch', color: '#4B7BF5', desc: 'Training distributions that diverge from deployment conditions. The initiating mechanism in 18 of 37 documented failures.' },
            { n: '02', label: 'Oversight-Gap Amplification', color: '#F0B429', desc: 'Monitoring blind spots that allow small deviations to compound undetected until failure becomes irreversible.' },
            { n: '03', label: 'Distributional Brittleness', color: '#2DD4C8', desc: 'Systems that perform on benchmarks but fail at the boundary of their training manifold under novel real-world inputs.' },
            { n: '04', label: 'Multi-Agent Instability', color: '#A78BFA', desc: 'Emergent failure modes from agent interactions producing unsafe equilibria that are absent in single-agent testing.' },
          ].map(p => (
            <div key={p.n} style={{ padding: '18px 22px', border: `1px solid ${p.color}22`, background: `${p.color}06`, borderRadius: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <span style={{ fontFamily: MONO, fontSize: 10, color: p.color, opacity: 0.7 }}>{p.n}</span>
                <span style={{ fontFamily: MONO, fontSize: 11, color: p.color, letterSpacing: '0.07em', textTransform: 'uppercase' }}>{p.label}</span>
              </div>
              <p style={{ fontSize: 13, lineHeight: 1.7, color: '#B8B4A4' }}>{p.desc}</p>
            </div>
          ))}
        </div>
        <style>{`@media(max-width:640px){.two-col-pillars{grid-template-columns:1fr!important}}`}</style>
      </div>
    </Section>
  );
}

// ─────────────────────────────────────────────
// FEATURED IN (press)
// ─────────────────────────────────────────────
function FeaturedIn() {
  const { ref, visible } = useReveal();
  const openLb = useLightboxOpen();
  return (
    <Section id="featured-in">
      <SH n="06" label="Featured In" sub="Press coverage and public recognition." color="#2DD4C8" />
      <div ref={ref} className={`reveal ${visible ? 'in' : ''}`}
        style={{ background: 'rgba(242,237,216,0.025)', border: '1px solid rgba(242,237,216,0.08)', borderRadius: 10, overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 0 }} className="featured-in-grid">
          <div style={{ position: 'relative', overflow: 'hidden', borderRadius: 0, background: '#0d0f1a', width: '100%', height: '100%', minHeight: 220 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/Images/athletics_group_pics.png" alt="UToledo Athletics feature" onClick={() => openLb('/Images/athletics_group_pics.png', 'UToledo Athletics feature')} style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block', cursor: 'zoom-in' }} />
          </div>
          <div style={{ padding: '28px 36px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{ fontFamily: MONO, fontSize: 10, color: '#F07832', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 14, opacity: 0.9 }}>Featured In</div>
            <h3 style={{ fontFamily: SERIF, fontSize: 22, fontWeight: 700, color: '#F2EDD8', lineHeight: 1.3 }}>
              Toledo Athletics Data Internship Program Aids The Rockets, Spurs Student Careers
            </h3>
            <div style={{ fontFamily: MONO, fontSize: 10, color: '#2DD4C8', marginTop: 10, letterSpacing: '0.04em' }}>UToledo Rockets · April 20, 2026</div>
            <p style={{ fontSize: 14, lineHeight: 1.75, color: '#B8B4A4', marginTop: 14, maxWidth: 560 }}>
              Featured for describing the goal of becoming an AI Engineer who builds end-to-end data systems that drive real decisions at scale, and how the internship bridged technical modeling work with direct communication to athletics leadership.
            </p>
            <a
              href="https://utrockets.com/news/2026/4/20/toledo-athletics-data-internship-program-aids-the-rockets-spurs-student-careers.aspx"
              target="_blank" rel="noopener noreferrer"
              data-magnetic=""
              style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 20, padding: '9px 18px', border: '1px solid rgba(45,212,200,0.27)', borderRadius: 6, color: '#2DD4C8', fontFamily: MONO, fontSize: 10, letterSpacing: '0.06em', textTransform: 'uppercase', width: 'fit-content', transition: 'all 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(45,212,200,0.07)'; e.currentTarget.style.borderColor = '#2DD4C8'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'rgba(45,212,200,0.27)'; }}
            >Read Article ↗</a>
          </div>
        </div>
      </div>
      <style>{`@media(max-width:640px){.featured-in-grid{grid-template-columns:1fr!important}}`}</style>
    </Section>
  );
}

// ─────────────────────────────────────────────
// SKILLS
// ─────────────────────────────────────────────
const skillGroups = [
  { label: 'Languages',    color: '#F0B429', skills: ['Python','JavaScript','C++','Java','SQL','HTML/CSS','Embedded C','MATLAB','Simulink','Bash'] },
  { label: 'ML & AI',      color: '#4B7BF5', skills: ['PyTorch','TensorFlow','scikit-learn','RL','GNNs','Meta-Learning','NLP','Computer Vision'] },
  { label: 'MLOps & Data', color: '#F07832', skills: ['Airflow','MLflow','Pandas','NumPy','AWS','Docker','Git','CI/CD','Linux','DOMO'] },
  { label: 'Robotics',     color: '#A78BFA', skills: ['ROS 2','OpenCV','YOLO11','NVIDIA Jetson','Sensor Fusion','VINS-Mono','HITL','AirSim'] },
  { label: 'Databases',    color: '#2DD4C8', skills: ['PostgreSQL','MySQL','MongoDB','SQLite','ETL','pgAdmin 4'] },
  { label: 'Microsoft',    color: '#F472B6', skills: ['Azure AI','Copilot Studio','Power Automate','Power BI','M365','SharePoint'] },
];

const awards = [
  { t: 'AIChE Chem E Car Poster & Presentation', d: 'AIChE · Worldwide',                     y: 'Nov 2025', color: '#4B7BF5', imgs: ['/Images/AIChE.jpg'],                                                               imgFit: 'cover',    imgPos: 'center',  ratio: '4/3' },
  { t: 'Most Innovative Car Design',             d: 'AIChE Chem-E Car · Worldwide',           y: 'Nov 2025', color: '#4B7BF5', imgs: ['/Images/AIChE%20ChemECar_International.jpg', '/Images/AIChE.jpg'], imgFit: 'cover',    imgPos: 'center',  ratio: '4/3' },
  { t: 'USRCAP Research Fellowship',             d: '$3,000 · Graph-Based RL UAV Research',   y: 'May 2025', color: '#F0B429', imgs: ['/Images/graph_RL.png'],                                                                imgFit: 'contain',  imgPos: 'center',  ratio: '4/3' },
  { t: 'AIChE Chem E Car – Regional',            d: '3rd Place · AIChE Regional',             y: 'Mar 2025', color: '#F07832', imgs: ['/Images/AIChE_Regional_Pics.jpg'],                                                          imgFit: 'cover',    imgPos: 'center',  ratio: '16/9' },
  { t: 'Best Use of MongoDB Atlas',              d: 'RocketHacks 2025 · Deep Truth',          y: 'Mar 2025', color: '#F07832', imgs: ['/Images/DeepTruth_Group.png'],                                                             imgFit: 'cover',    imgPos: 'top',     ratio: '16/9' },
];

const affiliations = [
  { n: 'IEEE & AESS',        role: 'Member',                   color: '#2DD4C8', short: 'Institute of Electrical & Electronics Engineers / Aerospace & Electronic Systems Society', desc: 'Active member of IEEE and AESS. Engaged in technical communities around autonomous systems, AI safety, and engineering standards.', imgs: ['/Images/IEEE.jpg', '/Images/aess.jpg'],                                                                imgFit: 'contain', imgPos: 'center', ratio: '4/3'  },
  { n: 'AIChE / Chem-E Car', role: 'Team Member & Competitor', color: '#F07832', short: 'American Institute of Chemical Engineers — University of Toledo Chapter', desc: 'Competed on the UT AIChE Chem-E Car team. Contributed to Arduino-based automation integrating pressure sensors, load cells, and stopping algorithms. Won Most Innovative Car Design worldwide.', imgs: ['/Images/AIChE.jpg', '/Images/AIChE%20ChemECar_International.jpg'], imgFit: 'cover',   imgPos: 'center', ratio: '4/3'  },
  { n: 'Pi Sigma Epsilon',   role: 'Member',                   color: '#A78BFA', short: 'National Co-Educational Professional Fraternity — Sales, Marketing & Management', desc: 'Member of Pi Sigma Epsilon, the only national professional co-educational fraternity in sales, marketing, and management.', imgs: ['/Images/PSE_1.jpg', '/Images/PSE_2.jpg', '/Images/PSE_3.jpg'],                                                         imgFit: 'contain', imgPos: 'center', ratio: '3/4'  },
  { n: 'UToledo Athletics',  role: 'Data Science Intern',      color: '#2DD4C8', short: 'University of Toledo Department of Athletics', desc: 'Embedded within UT Athletics as a Sports Analytics & Data Science Intern. Featured in official UToledo Rockets media for bridging technical modeling with direct communication to athletics leadership.', imgs: ['/Images/athletics_group_pics.png'],                                                                    imgFit: 'cover',   imgPos: 'top',    ratio: '16/9' },
];

// ── Skill Group Card (progressive disclosure) ──
function SkillGroupCard({ group }: { group: { label: string; color: string; skills: string[] } }) {
  const SHOW = 6;
  const [showAll, setShowAll] = React.useState(false);
  const visible = showAll ? group.skills : group.skills.slice(0, SHOW);
  const hidden = group.skills.length - SHOW;
  return (
    <div style={{ background: 'rgba(242,237,216,0.025)', borderTop: `2px solid ${group.color}`, borderRight: '1px solid rgba(242,237,216,0.08)', borderBottom: '1px solid rgba(242,237,216,0.08)', borderLeft: '1px solid rgba(242,237,216,0.08)', borderRadius: 8, padding: '22px 20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 14 }}>
        <div style={{ width: 5, height: 5, background: group.color, borderRadius: 1, flexShrink: 0 }} />
        <span style={{ fontFamily: MONO, fontSize: 11, color: group.color, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{group.label}</span>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
        {visible.map(s => <SkillChip key={s} color={group.color}>{s}</SkillChip>)}
        {!showAll && hidden > 0 && (
          <span
            role="button"
            onClick={() => setShowAll(true)}
            style={{ fontFamily: MONO, fontSize: 11, padding: '4px 9px', background: `${group.color}0a`, border: `1px solid ${group.color}30`, borderRadius: 4, color: group.color, letterSpacing: '0.03em', cursor: 'pointer', opacity: 0.75 }}
          >+{hidden}</span>
        )}
      </div>
    </div>
  );
}

function SkillChip({ color, children }: { color: string; children: React.ReactNode }) {
  return (
    <span
      style={{ fontFamily: MONO, fontSize: 11, padding: '4px 9px', background: 'rgba(242,237,216,0.03)', border: '1px solid rgba(242,237,216,0.08)', borderRadius: 4, color: '#B8B4A4', letterSpacing: '0.02em', cursor: 'default', transition: 'background 0.18s, color 0.18s' }}
      onMouseEnter={e => { e.currentTarget.style.background = `${color}18`; e.currentTarget.style.color = '#F2EDD8'; }}
      onMouseLeave={e => { e.currentTarget.style.background = 'rgba(242,237,216,0.03)'; e.currentTarget.style.color = '#B8B4A4'; }}
    >{children}</span>
  );
}

function Skills() {
  const { ref, visible } = useReveal();
  const [openAward, setOpenAward] = React.useState<number | null>(null);
  const [openAffil, setOpenAffil] = React.useState<number | null>(null);
  const openLb = useLightboxOpen();
  return (
    <Section id="skills">
      <SH n="05" label="Capabilities" sub="Technical stack built across research, industry, and deployment." color="#F0B429" />
      <div ref={ref} className={`reveal ${visible ? 'in' : ''}`}>
        {/* Skill grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }} className="three-col-skills">
          {skillGroups.map((group) => (
            <SkillGroupCard key={group.label} group={group} />
          ))}
        </div>

        {/* Awards */}
        <div style={{ marginTop: 52 }}>
          <div style={{ fontFamily: MONO, fontSize: 11, color: '#6E6B60', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 20 }}>Awards & Recognition</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10, alignItems: 'start' }} className="two-col-awards">
            {awards.map((a, i) => (
              <div key={i}
                onClick={() => setOpenAward(openAward === i ? null : i)}
                style={{ background: 'rgba(242,237,216,0.025)', borderTop: `2px solid ${a.color}`, borderRight: `1px solid ${openAward === i ? a.color + '44' : 'rgba(242,237,216,0.08)'}`, borderBottom: `1px solid ${openAward === i ? a.color + '44' : 'rgba(242,237,216,0.08)'}`, borderLeft: `1px solid ${openAward === i ? a.color + '44' : 'rgba(242,237,216,0.08)'}`, borderRadius: 8, cursor: 'pointer', transition: 'border-color 0.25s', overflow: 'hidden' }}>
                <div style={{ padding: '18px 22px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ fontFamily: SANS, fontSize: 14, fontWeight: 600, color: '#F2EDD8' }}>{a.t}</div>
                    <div style={{ fontSize: 12, color: '#B8B4A4', marginTop: 3 }}>{a.d}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0, marginLeft: 10 }}>
                    <span style={{ fontFamily: MONO, fontSize: 11, color: a.color }}>{a.y}</span>
                    <span style={{ fontSize: 14, color: '#6E6B60', transition: 'transform 0.3s', transform: openAward === i ? 'rotate(45deg)' : 'none' }}>+</span>
                  </div>
                </div>
                {openAward === i && (
                  <div style={{ padding: '0 18px 18px', borderTop: '1px solid rgba(242,237,216,0.06)' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${a.imgs.length}, 1fr)`, gap: 8, marginTop: 14 }}>
                      {a.imgs.map((src, j) => (
                        <div key={j} style={{ width: '100%', aspectRatio: a.ratio ?? '16/9', background: '#0B0D14', borderRadius: 6, overflow: 'hidden' }}>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={src} alt={a.t} onClick={e => { e.stopPropagation(); openLb(src, a.t); }} style={{ width: '100%', height: '100%', objectFit: (a.imgFit ?? 'cover') as React.CSSProperties['objectFit'], objectPosition: a.imgPos ?? 'center', display: 'block', cursor: 'zoom-in' }} />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Affiliations */}
        <div style={{ marginTop: 52 }}>
          <div style={{ fontFamily: MONO, fontSize: 11, color: '#6E6B60', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 20 }}>Professional Affiliations</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10, alignItems: 'start' }} className="two-col-awards">
            {affiliations.map((a, i) => (
              <div key={i}
                onClick={() => setOpenAffil(openAffil === i ? null : i)}
                style={{ background: 'rgba(242,237,216,0.025)', borderTop: `1px solid ${openAffil === i ? a.color + '44' : 'rgba(242,237,216,0.08)'}`, borderRight: `1px solid ${openAffil === i ? a.color + '44' : 'rgba(242,237,216,0.08)'}`, borderBottom: `1px solid ${openAffil === i ? a.color + '44' : 'rgba(242,237,216,0.08)'}`, borderLeft: `1px solid ${openAffil === i ? a.color + '44' : 'rgba(242,237,216,0.08)'}`, borderRadius: 10, cursor: 'pointer', transition: 'border-color 0.25s', overflow: 'hidden' }}>
                <div style={{ padding: '20px 22px', display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 8, background: `${a.color}15`, border: `1px solid ${a.color}33`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <div style={{ width: 10, height: 10, borderRadius: 2, background: a.color }} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: SANS, fontSize: 14, fontWeight: 600, color: '#F2EDD8', lineHeight: 1.3 }}>{a.n}</div>
                    <div style={{ fontFamily: MONO, fontSize: 10, color: a.color, marginTop: 3 }}>{a.role}</div>
                    <div style={{ fontSize: 12, color: '#6E6B60', marginTop: 3, lineHeight: 1.4 }}>{a.short}</div>
                  </div>
                  <span style={{ fontSize: 16, color: '#6E6B60', transition: 'transform 0.3s', transform: openAffil === i ? 'rotate(45deg)' : 'none', flexShrink: 0, marginTop: 2 }}>+</span>
                </div>
                {openAffil === i && (
                  <div style={{ padding: '0 22px 22px', borderTop: '1px solid rgba(242,237,216,0.06)' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${a.imgs.length}, 1fr)`, gap: 8, marginTop: 14 }}>
                      {a.imgs.map((src, j) => (
                        <div key={j} style={{ width: '100%', aspectRatio: a.ratio ?? '16/9', background: '#0B0D14', borderRadius: 6, overflow: 'hidden' }}>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={src} alt={a.n} onClick={e => { e.stopPropagation(); openLb(src, a.n); }} style={{ width: '100%', height: '100%', objectFit: (a.imgFit ?? 'cover') as React.CSSProperties['objectFit'], objectPosition: a.imgPos ?? 'center', display: 'block', cursor: 'zoom-in' }} />
                        </div>
                      ))}
                    </div>
                    <p style={{ fontSize: 13, lineHeight: 1.75, color: '#B8B4A4', marginTop: 14 }}>{a.desc}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Certifications */}
        <div style={{ marginTop: 52 }}>
          <div style={{ fontFamily: MONO, fontSize: 11, color: '#6E6B60', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 20 }}>Certifications</div>
          <div style={{ background: 'rgba(167,139,250,0.05)', border: '1px solid rgba(167,139,250,0.2)', borderRadius: 12, padding: '28px 32px', display: 'flex', alignItems: 'flex-start', gap: 28 }}>
            <div style={{ width: 52, height: 52, borderRadius: 10, background: 'rgba(167,139,250,0.12)', border: '1px solid rgba(167,139,250,0.28)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span style={{ fontFamily: MONO, fontSize: 10, fontWeight: 700, color: '#A78BFA', letterSpacing: '0.04em' }}>BO</span>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: MONO, fontSize: 11, color: '#A78BFA', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>Black Opal · Quantum Computing</div>
              <div style={{ fontFamily: SANS, fontSize: 20, fontWeight: 700, color: '#F2EDD8', lineHeight: 1.2, marginBottom: 10 }}>Superposition</div>
              <p style={{ fontSize: 14, lineHeight: 1.7, color: '#B8B4A4', maxWidth: 600, marginBottom: 14 }}>Qubit state manipulation, superposition principles, and measurement postulates. Foundational for quantum circuit design and quantum-enhanced autonomous systems research.</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                {['Quantum Computing', 'Qubits', 'Superposition', 'Quantum Circuits'].map(s => <SkillChip key={s} color="#A78BFA">{s}</SkillChip>)}
              </div>
            </div>
          </div>
        </div>
      </div>
      <style>{`@media(max-width:860px){.three-col-skills{grid-template-columns:repeat(2,1fr)!important}.two-col-awards{grid-template-columns:1fr!important}}@media(max-width:560px){.three-col-skills{grid-template-columns:1fr!important}}`}</style>
    </Section>
  );
}

// ─────────────────────────────────────────────
// NOW
// ─────────────────────────────────────────────
function Now() {
  const { ref, visible } = useReveal();

  const cards = [
    {
      icon: '◎',
      category: 'Learning',
      status: 'In Progress',
      statusColor: '#4B7BF5',
      color: '#4B7BF5',
      items: [
        { title: 'Drive AI Transformation in Your Organization', sub: 'Microsoft · Course AB-731T00-A' },
      ],
    },
    {
      icon: '◇',
      category: 'Building',
      status: 'Active',
      statusColor: '#2DD4C8',
      color: '#A78BFA',
      items: [
        { title: 'Student Athlete Health Insurance Site', sub: 'Toledo Athletics' },
        { title: 'Athletics Onboarding Website', sub: 'Toledo Athletics' },
        { title: 'Football Performance Metrics: CV Model', sub: 'Computer Vision · In progress' },
      ],
    },
    {
      icon: '◎',
      category: 'Pursuing',
      status: 'Upcoming',
      statusColor: '#F07832',
      color: '#F07832',
      items: [
        { title: 'Full-Time Role', sub: 'Actively interviewing' },
        { title: 'Microsoft Certified: AI Transformation Leader', sub: 'Exam prep underway' },
      ],
    },
  ];

  return (
    <Section id="now" style={{ background: 'rgba(15,17,25,0.92)' }}>
      {/* Header */}
      <div style={{ marginBottom: 52 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 10 }}>
          <span style={{ display: 'inline-block', width: 22, height: 1.5, background: '#2DD4C8', opacity: 0.6, flexShrink: 0 }} />
          <span style={{ fontFamily: MONO, fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#2DD4C8' }}>Now</span>
          <span style={{ fontFamily: MONO, fontSize: 10, color: '#6E6B60', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Updated · May 2026</span>
        </div>
        <p style={{ fontSize: 15, color: '#B8B4A4', maxWidth: 460, lineHeight: 1.65, fontFamily: SANS }}>
          What I&apos;m actively learning, building, and chasing outside of work.
        </p>
      </div>

      <div ref={ref} className={`reveal ${visible ? 'in' : ''} now-grid`}
        style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
        {cards.map((card) => (
          <div key={card.category} style={{
            background: 'rgba(242,237,216,0.02)',
            border: `1px solid ${card.color}44`,
            borderRadius: 10,
            padding: '24px 26px',
            display: 'flex',
            flexDirection: 'column',
            gap: 18,
          }}>
            {/* Card header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ color: card.color, fontSize: 13, opacity: 0.85 }}>{card.icon}</span>
                <span style={{ fontFamily: MONO, fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: card.color }}>
                  {card.category}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: card.statusColor, display: 'inline-block', flexShrink: 0 }} className={card.statusColor === '#2DD4C8' || card.statusColor === '#4B7BF5' ? 'pulse' : ''} />
                <span style={{ fontFamily: MONO, fontSize: 10, color: card.statusColor, letterSpacing: '0.08em', textTransform: 'uppercase' }}>{card.status}</span>
              </div>
            </div>

            {/* Items */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {card.items.map((item) => (
                <div key={item.title}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#F2EDD8', lineHeight: 1.4 }}>{item.title}</div>
                  <div style={{ fontSize: 12, color: '#6E6B60', marginTop: 3 }}>{item.sub}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <style>{`@media(max-width:860px){#now .reveal{grid-template-columns:repeat(2,1fr)!important}}@media(max-width:560px){#now .reveal{grid-template-columns:1fr!important}}`}</style>
    </Section>
  );
}

// ─────────────────────────────────────────────
// CONTACT
// ─────────────────────────────────────────────
function Contact() {
  const { ref, visible } = useReveal();
  return (
    <Section id="contact">
      <SH n="09" label="Contact" sub="Let's talk about building something real." color="#F0B429" />
      <div ref={ref} className={`reveal ${visible ? 'in' : ''}`} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 420px), 1fr))', gap: 48, alignItems: 'center' }}>
        <div>
          <h2 style={{ fontFamily: SERIF, fontSize: 40, fontWeight: 400, lineHeight: 1.2, letterSpacing: '-0.02em', color: '#F2EDD8', marginBottom: 20, paddingBottom: '0.08em' }}>
            Open to roles in AI research, ML engineering, and data science.
          </h2>
          <p style={{ fontSize: 16, lineHeight: 1.75, color: '#B8B4A4', marginBottom: 28 }}>
            Whether it&apos;s a full-time opportunity, research collaboration, or just a conversation about autonomous systems — I&apos;m listening.
          </p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <a href="mailto:firas.azfar@gmail.com" data-magnetic="">
              <NeonButton style={{ fontFamily: MONO, fontSize: 11, padding: '12px 24px', letterSpacing: '0.06em', background: '#F0B429', color: '#0B0D14', border: 'none', borderRadius: 5, textTransform: 'uppercase' }}>
                firas.azfar@gmail.com
              </NeonButton>
            </a>
            <a href="/docs/Ahmad_Resume_Developer_I_FirstSolar.pdf" target="_blank" rel="noopener" data-magnetic="">
              <NeonButton variant="ghost" style={{ fontFamily: MONO, fontSize: 11, padding: '12px 24px', letterSpacing: '0.06em', border: '1px solid rgba(242,237,216,0.16)', color: '#B8B4A4', borderRadius: 5, textTransform: 'uppercase' }}>
                Resume ↓
              </NeonButton>
            </a>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {[
            { label: 'Email', value: 'firas.azfar@gmail.com', href: 'mailto:firas.azfar@gmail.com', color: '#F0B429' },
            { label: 'LinkedIn', value: '/in/ahmadfirasazfar', href: 'https://linkedin.com/in/ahmadfirasazfar', color: '#4B7BF5' },
            { label: 'GitHub', value: '/aahmadf123', href: 'https://github.com/aahmadf123', color: '#2DD4C8' },
            { label: 'Location', value: 'Toledo, OH', href: null, color: '#A78BFA' },
          ].map((c) => (
            <div key={c.label} style={{ padding: '20px', background: `${c.color}08`, border: `1px solid ${c.color}2a`, borderRadius: 8 }}>
              <div style={{ fontFamily: MONO, fontSize: 10, color: c.color, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 6 }}>{c.label}</div>
              {c.href ? (
                <a href={c.href} target={c.href.startsWith('http') ? '_blank' : undefined} rel={c.href.startsWith('http') ? 'noopener' : undefined} style={{ fontSize: 14, color: '#F2EDD8', wordBreak: 'break-all' }}>{c.value}</a>
              ) : (
                <span style={{ fontSize: 14, color: '#F2EDD8' }}>{c.value}</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}

// ─────────────────────────────────────────────
// FIELD NOTES (preview)
// ─────────────────────────────────────────────
function FieldNotesSection() {
  const { ref, visible } = useReveal();
  const published = fieldNotes
    .filter(n => n.published && n.date)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);

  return (
    <Section id="field-notes">
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap', marginBottom: 52 }}>
        <div style={{ position: 'relative', paddingTop: 8, flex: 1 }}>
          <div aria-hidden style={{ position: 'absolute', top: -32, left: -8, fontFamily: SERIF, fontSize: 'clamp(72px,11vw,160px)', fontWeight: 400, color: '#F0B429', opacity: 0.05, lineHeight: 1, userSelect: 'none', pointerEvents: 'none', letterSpacing: '-0.03em', zIndex: 0 }}>08</div>
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
              <span style={{ display: 'inline-block', width: 22, height: 1.5, background: '#F0B429', opacity: 0.6, flexShrink: 0 }} />
              <span style={{ fontFamily: MONO, fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#F0B429' }}>Field Notes</span>
            </div>
            <p style={{ fontSize: 15, color: '#B8B4A4', maxWidth: 500, lineHeight: 1.65, marginTop: 4, fontFamily: SANS }}>
              Thinking in public — dispatches from the edge of AI, robotics, and real-world systems.
            </p>
          </div>
        </div>
        <a
          href="/field-notes"
          style={{
            fontFamily: MONO, fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase',
            color: '#F0B429', border: '1px solid rgba(240,180,41,0.3)', borderRadius: 5,
            padding: '9px 18px', textDecoration: 'none', flexShrink: 0, marginTop: 8,
            display: 'inline-block',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(240,180,41,0.08)'; e.currentTarget.style.borderColor = '#F0B429'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'rgba(240,180,41,0.3)'; }}
        >
          View All ↗
        </a>
      </div>

      <div ref={ref} className={`reveal ${visible ? 'in' : ''}`}
        style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 340px), 1fr))', gap: 20 }}>
        {published.length > 0
          ? published.map(note => <FieldNoteCard key={note.slug} note={note} />)
          : (
            <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '64px 0', color: '#6E6B60', fontFamily: MONO, fontSize: 12, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              New field notes coming soon.
            </div>
          )
        }
      </div>

      <div style={{ marginTop: 40, display: 'flex', justifyContent: 'center' }}>
        <a
          href="/field-notes"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '12px 28px', background: '#F0B429', color: '#0B0D14',
            fontFamily: MONO, fontSize: 11, fontWeight: 700, letterSpacing: '0.06em',
            borderRadius: 5, textTransform: 'uppercase', textDecoration: 'none',
          }}
          onMouseEnter={e => { e.currentTarget.style.opacity = '0.88'; }}
          onMouseLeave={e => { e.currentTarget.style.opacity = '1'; }}
        >
          Browse All Field Notes ↗
        </a>
      </div>
    </Section>
  );
}

// ─────────────────────────────────────────────
// PAGE
// ─────────────────────────────────────────────
export default function Portfolio() {
  const [lb, setLb] = useState<{ src: string; alt: string } | null>(null);
  const openLb = React.useCallback((src: string, alt = '') => setLb({ src, alt }), []);
  return (
    <LightboxCtx.Provider value={openLb}>
      <>
        <Header />
        <NebulaCube />
        <main style={{ position: 'relative', zIndex: 20, background: 'transparent' }}>
          <Hero />
          <About />
          <Experience />
          <Projects />
          <Research />
          <Skills />
          <FeaturedIn />
          <Now />
          <FieldNotesSection />
          <Contact />
        </main>
        <footer style={{ position: 'relative', zIndex: 20, borderTop: '1px solid rgba(242,237,216,0.06)', padding: '28px 52px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
          <span style={{ fontFamily: MONO, fontSize: 10, color: '#6E6B60', letterSpacing: '0.12em', textTransform: 'uppercase' }}>© 2026 Ahmad Firas. All rights reserved.</span>
          <span style={{ fontFamily: MONO, fontSize: 10, color: '#6E6B60', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Next.js · TypeScript · Framer Motion</span>
        </footer>
        {lb && <Lightbox src={lb.src} alt={lb.alt} onClose={() => setLb(null)} />}
      </>
    </LightboxCtx.Provider>
  );
}



