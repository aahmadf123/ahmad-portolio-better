'use client';

import dynamic from 'next/dynamic';
import React, { useRef, useEffect, useState } from 'react';
import { Header } from '@/components/ui/header-2';
import { ExpandableCard } from '@/components/ui/expandable-card';
import { AnimatedFeatureSpotlight } from '@/components/ui/feature-spotlight';
import { HoverPeek } from '@/components/ui/link-preview';
import { NeonButton } from '@/components/ui/neon-button';
import { FlaskConical } from 'lucide-react';
import { motion } from 'framer-motion';

const NebulaCube = dynamic(
  () => import('@/components/ui/explorations-with-gsap-and-scroll-trigger').then(m => ({ default: m.NebulaCube })),
  { ssr: false }
);

// ── Font tokens (single source of truth) ──
const SERIF = "var(--font-chakra), 'Chakra Petch', sans-serif";
const MONO  = "var(--font-chakra), 'Chakra Petch', monospace";
const SANS  = "var(--font-chakra), 'Chakra Petch', sans-serif";

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
  useEffect(() => { const t = setTimeout(() => setRdy(true), 180); return () => clearTimeout(t); }, []);
  return (
    <section id="hero" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative', padding: 'clamp(80px,8vw,100px) clamp(20px,4vw,52px) clamp(60px,6vw,80px)', background: 'transparent', zIndex: 20 }}>
      <div className="hero-grid" style={{ maxWidth: 1280, width: '100%', margin: '0 auto', display: 'grid', gridTemplateColumns: 'minmax(0, 1.4fr) minmax(0, 1fr)', gap: 'clamp(28px, 4vw, 64px)', alignItems: 'center', flex: 1 }}>
        {/* LEFT */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 22, opacity: rdy ? 1 : 0, transition: 'opacity 0.7s ease' }}>
            <span style={{ display: 'inline-block', width: 22, height: 1.5, background: '#F0B429', opacity: 0.65 }} />
            <span style={{ fontFamily: MONO, fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#F0B429' }}>Computer Engineer · AI Researcher</span>
          </div>
          <h1 style={{
            fontFamily: SERIF, fontWeight: 400,
            fontSize: 'clamp(56px, 10vw, 132px)',
            lineHeight: 0.95, letterSpacing: '-0.025em', color: '#F2EDD8',
            opacity: rdy ? 1 : 0, transform: rdy ? 'translateY(0)' : 'translateY(36px)',
            transition: 'opacity 0.9s 0.15s cubic-bezier(0.16,1,0.3,1), transform 0.9s 0.15s cubic-bezier(0.16,1,0.3,1)',
            margin: 0, paddingBottom: '0.08em',
          }}>
            Ahmad<br /><span style={{ color: '#F0B429' }}>Firas</span>
          </h1>
          <p style={{
            fontSize: 17, lineHeight: 1.7, color: '#B8B4A4', maxWidth: 480, marginTop: 28, fontFamily: SANS,
            opacity: rdy ? 1 : 0, transform: rdy ? 'translateY(0)' : 'translateY(20px)',
            transition: 'opacity 0.9s 0.35s ease, transform 0.9s 0.35s ease',
          }}>
            Building AI systems for uncertain environments — from UAV autonomy research to enterprise agentic workflows.
          </p>
          <div style={{ marginTop: 32, display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center', opacity: rdy ? 1 : 0, transition: 'opacity 0.9s 0.55s ease' }}>
            <a href="#projects" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 24px', background: '#F0B429', color: '#0B0D14', fontFamily: MONO, fontSize: 11, fontWeight: 700, letterSpacing: '0.07em', borderRadius: 5, textTransform: 'uppercase' }}>View Work ↗</a>
            <a href="#contact" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 24px', border: '1px solid rgba(242,237,216,0.18)', color: '#B8B4A4', fontFamily: MONO, fontSize: 11, letterSpacing: '0.07em', borderRadius: 5, textTransform: 'uppercase' }}>Get in Touch</a>
            <a href="/docs/Ahmad_Resume_Developer_I_FirstSolar.pdf" target="_blank" rel="noopener" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '10px 18px', border: '1px solid rgba(242,237,216,0.1)', color: '#6E6B60', fontFamily: MONO, fontSize: 10, letterSpacing: '0.08em', borderRadius: 5, textTransform: 'uppercase' }}>Resume ↓</a>
          </div>
          <div style={{ marginTop: 40, display: 'flex', alignItems: 'center', gap: 10, opacity: rdy ? 0.5 : 0, transition: 'opacity 1s 0.9s ease' }}>
            <div style={{ width: 1, height: 28, background: 'linear-gradient(to bottom, #F0B429, transparent)' }} />
            <span style={{ fontFamily: MONO, fontSize: 9, letterSpacing: '0.16em', color: '#6E6B60', textTransform: 'uppercase' }}>Scroll to explore</span>
          </div>
        </div>
        {/* RIGHT — photo + facts */}
        <div className="hero-side" style={{ display: 'flex', flexDirection: 'column', gap: 18, opacity: rdy ? 1 : 0, transform: rdy ? 'translateY(0)' : 'translateY(20px)', transition: 'opacity 1s 0.5s ease, transform 1s 0.5s ease' }}>
          <div style={{ position: 'relative', width: '100%', aspectRatio: '4/5', borderRadius: 10, overflow: 'hidden', border: '1px solid rgba(240,180,41,0.18)', background: '#131520' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/Images/my%20pic.png" alt="Ahmad Firas" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top', display: 'block' }} />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent 60%, rgba(11,13,20,0.55) 100%)', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', left: 14, bottom: 12, fontFamily: MONO, fontSize: 9, letterSpacing: '0.14em', color: 'rgba(242,237,216,0.65)', textTransform: 'uppercase' }}>Toledo, OH · 2026</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {[
              { l: 'Now', v: 'Sports Analytics Intern', s: 'UToledo Athletics', c: '#2DD4C8' },
              { l: 'Research', v: 'LION Lab · CPHS Lab', s: 'University of Toledo', c: '#4B7BF5' },
              { l: 'Focus', v: 'Agentic AI · UAV · MLOps', s: null, c: '#F0B429' },
            ].map((f) => (
              <div key={f.l} style={{ padding: '12px 0', borderBottom: '1px solid rgba(242,237,216,0.07)' }}>
                <div style={{ fontFamily: MONO, fontSize: 10, color: f.c, letterSpacing: '0.13em', textTransform: 'uppercase', marginBottom: 4 }}>{f.l}</div>
                <div style={{ fontSize: 14, fontWeight: 500, color: '#F2EDD8' }}>{f.v}</div>
                {f.s && <div style={{ fontSize: 12, color: '#6E6B60', marginTop: 2 }}>{f.s}</div>}
              </div>
            ))}
          </div>
        </div>
      </div>
      <style>{`
        @media (max-width: 820px) {
          #hero .hero-grid { grid-template-columns: 1fr !important; }
          #hero .hero-side { order: -1; max-width: 360px; margin: 0 auto; }
        }
      `}</style>
    </section>
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
          <h2 style={{ fontFamily: SERIF, fontSize: 30, fontWeight: 400, lineHeight: 1.3, letterSpacing: '-0.015em', color: '#F2EDD8', borderLeft: '3px solid #F0B429', paddingLeft: 18, paddingBottom: '0.08em' }}>
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
            <div key={item.n} style={{ padding: '18px 20px', borderTop: `1px solid rgba(242,237,216,0.06)`, borderRight: `1px solid rgba(242,237,216,0.06)`, borderBottom: `1px solid rgba(242,237,216,0.06)`, borderLeft: `2px solid ${item.color}`, borderRadius: 6, marginBottom: 8 }}>
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
            style={{ padding: '22px 26px', borderTop: `1px solid ${open === i ? job.color + '55' : 'rgba(242,237,216,0.07)'}`, borderRight: `1px solid ${open === i ? job.color + '55' : 'rgba(242,237,216,0.07)'}`, borderBottom: `1px solid ${open === i ? job.color + '55' : 'rgba(242,237,216,0.07)'}`, cursor: 'pointer', borderLeft: `2px solid ${job.color}`, background: open === i ? `${job.color}0a` : 'rgba(242,237,216,0.02)', transition: 'all 0.25s', borderRadius: 8 }}>
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
      tag: 'USRCAP Fellowship · $3,000',
      fr: 'Autonomy that holds up when the map runs out.',
      src: '/Images/graph_RL.png', span: 2,
      stacks: ['MAML', 'GAT', 'PPO', 'SAC', 'AirSim', 'SHAP/LIME'],
      detail: (<>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10, marginBottom: 16 }}>
          {[['72.8%','Zero-shot deploy'],['97.3%','HITL success'],['<100ms','Intervention']].map(([v,l]) => (
            <div key={l} style={{ padding: '10px 12px', background: 'rgba(240,180,41,0.06)', border: '1px solid rgba(240,180,41,0.2)', borderRadius: 6 }}>
              <div style={{ fontFamily: SERIF, fontSize: 22, color: '#F0B429', lineHeight: 1, paddingBottom: '0.05em' }}>{v}</div>
              <div style={{ fontFamily: MONO, fontSize: 9, color: '#6E6B60', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: 4 }}>{l}</div>
            </div>
          ))}
        </div>
        <h4 style={{ color: '#F0B429', fontFamily: MONO, fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>Approach</h4>
        <p>Graph Attention Networks encoded the environment relationally, generalizing across topologies rather than memorizing textures. MAML enabled rapid adaptation to unseen environments. Human-in-the-loop safety gates at sub-100ms ensured any degraded state could be interrupted without vehicle loss.</p>
        <h4 style={{ color: '#F0B429', fontFamily: MONO, fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: 14 }}>Key Insight</h4>
        <p>Zero-shot generalization required structured representations and a recovery system the team would actually trust. The 97.3% HITL rate proved the boundary between autonomous and human control was designed deliberately.</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 12 }}>
          {['MAML','GAT','PPO','SAC','AirSim','SHAP/LIME'].map(t => <Tag key={t} color="#F0B429">{t}</Tag>)}
        </div>
      </>),
    },
    {
      idx: '02', dom: 'Research Tools', color: '#4B7BF5',
      title: 'Deep Flyer',
      tag: 'AWS DeepRacer-Inspired UAV Platform',
      fr: 'A training platform so the next experiment starts faster.',
      src: '/Images/graph_RL.png', span: 1,
      stacks: ['PyTorch', 'ROS 2', 'YOLO11', 'PX4', 'NVIDIA Jetson'],
      detail: (<>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10, marginBottom: 16 }}>
          {[['<5ms','Control latency'],['PPO','Policy'],['Zero-shot','Sim-to-real']].map(([v,l]) => (
            <div key={l} style={{ padding: '10px 12px', background: 'rgba(75,123,245,0.06)', border: '1px solid rgba(75,123,245,0.2)', borderRadius: 6 }}>
              <div style={{ fontFamily: SERIF, fontSize: 22, color: '#4B7BF5', lineHeight: 1, paddingBottom: '0.05em' }}>{v}</div>
              <div style={{ fontFamily: MONO, fontSize: 9, color: '#6E6B60', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: 4 }}>{l}</div>
            </div>
          ))}
        </div>
        <h4 style={{ color: '#4B7BF5', fontFamily: MONO, fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>Architecture</h4>
        <p>Direct PX4-ROS2 bridge replaced MAVROS, cutting latency below 5ms. YOLO11 with ZED Mini and OAK-D Pro gave spatial understanding from real-time stereo vision. Reward functions were student-modifiable without touching core code.</p>
        <h4 style={{ color: '#4B7BF5', fontFamily: MONO, fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: 14 }}>Key Insight</h4>
        <p>The hardest constraint was latency, not accuracy. A well-trained policy at 20ms is a crashed drone. Documentation is infrastructure.</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 12 }}>
          {['PyTorch','ROS 2','YOLO11','Gazebo','PX4','ZED Mini','NVIDIA Jetson'].map(t => <Tag key={t} color="#4B7BF5">{t}</Tag>)}
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
        <h4 style={{ color: '#F07832', fontFamily: MONO, fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>Framework</h4>
        <p>37 documented AI failures organized by mechanism: data-environment mismatch, oversight-gap amplification, distributional brittleness, multi-agent instability. The Contested-Environment Amplifier Model formalized how operational stressors compound quiet failures into catastrophic ones.</p>
        <h4 style={{ color: '#F07832', fontFamily: MONO, fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: 14 }}>Key Insight</h4>
        <p>Almost all 37 failures had detectable precursors that appeared normal under standard evaluation. Evaluation environments need to be hostile, not merely representative.</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 12 }}>
          {['Taxonomy Design','Literature Review','AI Safety','ACM CSUR'].map(t => <Tag key={t} color="#F07832">{t}</Tag>)}
        </div>
      </>),
    },
    {
      idx: '04', dom: 'MLOps', color: '#A78BFA',
      title: 'Homeowner Loss Prediction',
      tag: 'Grange Insurance × UToledo',
      fr: 'Risk modeling as a continuous operating system, not a batch job.',
      src: '/Images/SeniorDesign_Pipeline.jpeg', span: 2,
      stacks: ['XGBoost', 'Airflow', 'MLflow', 'AWS S3', 'Bayesian Opt.'],
      detail: (<>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10, marginBottom: 16 }}>
          {[['R² 0.976','Model accuracy'],['75%','Manual review reduction'],['25%','Claim lift']].map(([v,l]) => (
            <div key={l} style={{ padding: '10px 12px', background: 'rgba(167,139,250,0.06)', border: '1px solid rgba(167,139,250,0.2)', borderRadius: 6 }}>
              <div style={{ fontFamily: SERIF, fontSize: 22, color: '#A78BFA', lineHeight: 1, paddingBottom: '0.05em' }}>{v}</div>
              <div style={{ fontFamily: MONO, fontSize: 9, color: '#6E6B60', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: 4 }}>{l}</div>
            </div>
          ))}
        </div>
        <h4 style={{ color: '#A78BFA', fontFamily: MONO, fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>Architecture</h4>
        <p>XGBoost with Bayesian optimization. Airflow + MLflow orchestration. AI drift agents triggered retraining. HITL gates required sign-off only on low-confidence predictions, reducing review volume 75% while maintaining oversight where it mattered.</p>
        <h4 style={{ color: '#A78BFA', fontFamily: MONO, fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: 14 }}>Key Insight</h4>
        <p>The 75% reduction didn&apos;t happen because we removed humans. It happened because we gave humans a better loop to be in.</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 12 }}>
          {['XGBoost','Airflow','MLflow','AWS S3','Bayesian Opt.','CI/CD'].map(t => <Tag key={t} color="#A78BFA">{t}</Tag>)}
        </div>
      </>),
    },
    {
      idx: '05', dom: 'Infrastructure', color: '#2DD4C8',
      title: 'Security Discovery Database',
      tag: 'Park Place Technologies',
      fr: 'Security operations gained one dependable source of truth.',
      src: '/Images/aess.jpg', span: 1,
      stacks: ['PostgreSQL', 'Active Directory', 'Cisco AMP'],
      detail: (<>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10, marginBottom: 16 }}>
          {[['15%','Faster incident response'],['95%','Data integrity'],['Zero','Data loss in DR tests']].map(([v,l]) => (
            <div key={l} style={{ padding: '10px 12px', background: 'rgba(45,212,200,0.06)', border: '1px solid rgba(45,212,200,0.2)', borderRadius: 6 }}>
              <div style={{ fontFamily: SERIF, fontSize: 22, color: '#2DD4C8', lineHeight: 1, paddingBottom: '0.05em' }}>{v}</div>
              <div style={{ fontFamily: MONO, fontSize: 9, color: '#6E6B60', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: 4 }}>{l}</div>
            </div>
          ))}
        </div>
        <h4 style={{ color: '#2DD4C8', fontFamily: MONO, fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>What Was Built</h4>
        <p>Disparate security feeds from Active Directory, Cisco AMP, and Microsoft Defender consolidated into a single PostgreSQL architecture with principled validation and quarterly-tested disaster recovery.</p>
        <h4 style={{ color: '#2DD4C8', fontFamily: MONO, fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: 14 }}>Key Insight</h4>
        <p>Most data quality problems in security ops aren&apos;t adversarial: they&apos;re inconsistent tooling assumptions meeting at a data boundary.</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 12 }}>
          {['PostgreSQL','Active Directory','Cisco AMP','Disaster Recovery'].map(t => <Tag key={t} color="#2DD4C8">{t}</Tag>)}
        </div>
      </>),
    },
    {
      idx: '06', dom: 'Hackathon', color: '#F0B429',
      title: 'Deep Truth',
      tag: 'RocketHacks 2025 · Best Use of MongoDB Atlas',
      fr: 'News credibility assessment, built in 24 hours.',
      src: '/Images/DeepTruth_Group.png', span: 1,
      stacks: ['MongoDB Atlas', 'Python', 'ML', 'NLP'],
      detail: (<>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 10, marginBottom: 16 }}>
          {[['#1','MongoDB Atlas prize'],['24h','Build sprint']].map(([v,l]) => (
            <div key={l} style={{ padding: '10px 12px', background: 'rgba(240,180,41,0.06)', border: '1px solid rgba(240,180,41,0.2)', borderRadius: 6 }}>
              <div style={{ fontFamily: SERIF, fontSize: 22, color: '#F0B429', lineHeight: 1, paddingBottom: '0.05em' }}>{v}</div>
              <div style={{ fontFamily: MONO, fontSize: 9, color: '#6E6B60', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: 4 }}>{l}</div>
            </div>
          ))}
        </div>
        <h4 style={{ color: '#F0B429', fontFamily: MONO, fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>What Was Built</h4>
        <p>Users submit a news article and receive an AI-powered credibility verdict with plain-language explanation and five sourced references. Explainability was a first-class constraint, not a retrofit.</p>
        <h4 style={{ color: '#F0B429', fontFamily: MONO, fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: 14 }}>Key Insight</h4>
        <p>The 24-hour clock produced the best decision: build explainability from the start.</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 12 }}>
          {['MongoDB Atlas','Python','ML','NLP'].map(t => <Tag key={t} color="#F0B429">{t}</Tag>)}
        </div>
      </>),
    },
    {
      idx: '07', dom: 'Embedded', color: '#F07832',
      title: 'ChemE Car',
      tag: 'AIChE · Most Innovative Design (Worldwide)',
      fr: 'Precision control. No second chances.',
      src: '/Images/AIChE%20ChemECar_International.jpg', span: 1,
      stacks: ['Arduino', 'C/C++', 'MATLAB', 'Sensor Fusion'],
      detail: (<>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 10, marginBottom: 16 }}>
          {[['Worldwide','Most Innovative award'],['National','Qualifier 2024']].map(([v,l]) => (
            <div key={l} style={{ padding: '10px 12px', background: 'rgba(240,120,50,0.06)', border: '1px solid rgba(240,120,50,0.2)', borderRadius: 6 }}>
              <div style={{ fontFamily: SERIF, fontSize: 22, color: '#F07832', lineHeight: 1, paddingBottom: '0.05em' }}>{v}</div>
              <div style={{ fontFamily: MONO, fontSize: 9, color: '#6E6B60', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: 4 }}>{l}</div>
            </div>
          ))}
        </div>
        <h4 style={{ color: '#F07832', fontFamily: MONO, fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>What Was Built</h4>
        <p>Arduino-based automation integrated pressure sensors, load cells, wheel encoders, IMU, and temperature data into stopping algorithms reliable under live competition conditions.</p>
        <h4 style={{ color: '#F07832', fontFamily: MONO, fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: 14 }}>Key Insight</h4>
        <p>Competition constraints produce better engineering than open-ended briefs. Design for worst case.</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 12 }}>
          {['Arduino','C/C++','MATLAB','Simulink','Sensor Fusion'].map(t => <Tag key={t} color="#F07832">{t}</Tag>)}
        </div>
      </>),
    },
    {
      idx: '08', dom: 'Civic Tech', color: '#F472B6',
      title: 'Batting Cleanup',
      tag: 'Toledo Codes · Active Deployment',
      fr: 'QR codes and data science for city maintenance.',
      src: '/Images/Batting_Cleanup.jpg', span: 1,
      stacks: ['AI', 'QR Code Tech', 'Data Science', 'Project Management'],
      detail: (<>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 10, marginBottom: 16 }}>
          {[['Active','Live deployment'],['Toledo','City partnership']].map(([v,l]) => (
            <div key={l} style={{ padding: '10px 12px', background: 'rgba(244,114,182,0.06)', border: '1px solid rgba(244,114,182,0.2)', borderRadius: 6 }}>
              <div style={{ fontFamily: SERIF, fontSize: 22, color: '#F472B6', lineHeight: 1, paddingBottom: '0.05em' }}>{v}</div>
              <div style={{ fontFamily: MONO, fontSize: 9, color: '#6E6B60', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: 4 }}>{l}</div>
            </div>
          ))}
        </div>
        <h4 style={{ color: '#F472B6', fontFamily: MONO, fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>What Was Built</h4>
        <p>QR codes at community locations let residents report issues in seconds. The backend surfaces clusters to prioritize municipal response patterns.</p>
        <h4 style={{ color: '#F472B6', fontFamily: MONO, fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: 14 }}>Key Insight</h4>
        <p>One extra step kills adoption. Infrastructure that generates no data is not data infrastructure.</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 12 }}>
          {['AI','QR Code Tech','Data Science','Project Management'].map(t => <Tag key={t} color="#F472B6">{t}</Tag>)}
        </div>
      </>),
    },
  ];
  const { ref, visible } = useReveal();
  return (
    <Section id="projects">
      <SH n="04" label="Bodies of Work" sub="Each project a different operating condition. Click any card for the full case study." color="#F0B429" />
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
          style={{ border: 'none', background: 'transparent' }}
        />
        <div style={{ marginTop: 40, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
          {[
            { metric: '37', label: 'AI failures analyzed', color: '#4B7BF5' },
            { metric: '127', label: 'Sources reviewed', color: '#2DD4C8' },
            { metric: '4', label: 'Pillars in taxonomy', color: '#F0B429' },
            { metric: '2025', label: 'ACM CSUR submission', color: '#A78BFA' },
          ].map((m) => (
            <div key={m.label} style={{ padding: '24px', background: 'rgba(242,237,216,0.025)', borderTop: `1px solid ${m.color}22`, borderRight: `1px solid ${m.color}22`, borderBottom: `1px solid ${m.color}22`, borderRadius: 8, borderLeft: `2px solid ${m.color}` }}>
              <div style={{ fontFamily: SERIF, fontSize: 38, fontWeight: 400, color: '#F2EDD8', lineHeight: 1, paddingBottom: '0.05em' }}>{m.metric}</div>
              <div style={{ fontFamily: MONO, fontSize: 10, color: '#6E6B60', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: 8 }}>{m.label}</div>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}

// ─────────────────────────────────────────────
// FEATURED IN (press)
// ─────────────────────────────────────────────
function FeaturedIn() {
  const { ref, visible } = useReveal();
  return (
    <Section id="featured-in">
      <SH n="05" label="Featured In" sub="Press coverage and public recognition." color="#2DD4C8" />
      <div ref={ref} className={`reveal ${visible ? 'in' : ''}`}
        style={{ background: 'rgba(242,237,216,0.025)', border: '1px solid rgba(242,237,216,0.08)', borderRadius: 10, overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 0 }} className="featured-in-grid">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/Images/athletics_group_pics.png" alt="UToledo Athletics feature" style={{ width: '100%', height: '100%', minHeight: 220, objectFit: 'cover', objectPosition: 'center top', display: 'block' }} />
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
  { t: 'USRCAP Research Fellowship',  d: '$3,000 · Graph-Based RL UAV Research', y: '2025', color: '#F0B429', imgs: ['/Images/graph_RL.png'] },
  { t: 'Best Use of MongoDB Atlas',   d: 'RocketHacks 2025 · Deep Truth',        y: '2025', color: '#F07832', imgs: ['/Images/DeepTruth_Group.png'] },
  { t: 'Most Innovative Car Design',  d: 'AIChE Chem-E Car · Worldwide',         y: '2024', color: '#4B7BF5', imgs: ['/Images/AIChE%20ChemECar_International.jpg', '/Images/AIChE.jpg'] },
  { t: 'Poster & Presentation',       d: 'AIChE · Worldwide Recognition',        y: '2024', color: '#4B7BF5', imgs: ['/Images/AIChE.jpg'] },
];

const affiliations = [
  { n: 'IEEE & AESS',        role: 'Member',                   color: '#2DD4C8', short: 'Institute of Electrical & Electronics Engineers / Aerospace & Electronic Systems Society', desc: 'Active member of IEEE and AESS. Engaged in technical communities around autonomous systems, AI safety, and engineering standards.', imgs: ['/Images/IEEE.jpg', '/Images/aess.jpg'] },
  { n: 'AIChE / Chem-E Car', role: 'Team Member & Competitor', color: '#F07832', short: 'American Institute of Chemical Engineers — University of Toledo Chapter', desc: 'Competed on the UT AIChE Chem-E Car team. Contributed to Arduino-based automation integrating pressure sensors, load cells, and stopping algorithms. Won Most Innovative Car Design worldwide.', imgs: ['/Images/AIChE.jpg', '/Images/AIChE%20ChemECar_International.jpg'] },
  { n: 'Pi Sigma Epsilon',   role: 'Member',                   color: '#A78BFA', short: 'National Co-Educational Professional Fraternity — Sales, Marketing & Management', desc: 'Member of Pi Sigma Epsilon, the only national professional co-educational fraternity in sales, marketing, and management.', imgs: ['/Images/PSE_1.jpg', '/Images/PSE_2.jpg', '/Images/PSE_3.jpg'] },
  { n: 'UToledo Athletics',  role: 'Data Science Intern',      color: '#2DD4C8', short: 'University of Toledo Department of Athletics', desc: 'Embedded within UT Athletics as a Sports Analytics & Data Science Intern. Featured in official UToledo Rockets media for bridging technical modeling with direct communication to athletics leadership.', imgs: ['/Images/athletics_group_pics.png'] },
];

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
  return (
    <Section id="skills">
      <SH n="06" label="Capabilities" sub="Technical stack built across research, industry, and deployment." color="#F0B429" />
      <div ref={ref} className={`reveal ${visible ? 'in' : ''}`}>
        {/* Skill grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }} className="three-col-skills">
          {skillGroups.map((group) => (
            <div key={group.label} style={{ background: 'rgba(242,237,216,0.025)', borderTop: `2px solid ${group.color}`, borderRight: '1px solid rgba(242,237,216,0.08)', borderBottom: '1px solid rgba(242,237,216,0.08)', borderLeft: '1px solid rgba(242,237,216,0.08)', borderRadius: 8, padding: '22px 20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 14 }}>
                <div style={{ width: 5, height: 5, background: group.color, borderRadius: 1, flexShrink: 0 }} />
                <span style={{ fontFamily: MONO, fontSize: 11, color: group.color, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{group.label}</span>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                {group.skills.map(s => <SkillChip key={s} color={group.color}>{s}</SkillChip>)}
              </div>
            </div>
          ))}
        </div>

        {/* Awards */}
        <div style={{ marginTop: 52 }}>
          <div style={{ fontFamily: MONO, fontSize: 11, color: '#6E6B60', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 20 }}>Awards & Recognition</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }} className="two-col-awards">
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
                    <div style={{ display: 'flex', gap: 8, marginTop: 14, overflowX: 'auto' }}>
                      {a.imgs.map((src, j) => (
                        <img key={j} src={src} alt={a.t} style={{ height: 140, borderRadius: 6, objectFit: 'cover', flexShrink: 0, maxWidth: '100%' }} />
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
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }} className="two-col-awards">
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
                    <div style={{ display: 'flex', gap: 8, marginTop: 14, overflowX: 'auto' }}>
                      {a.imgs.map((src, j) => (
                        <img key={j} src={src} alt={a.n} style={{ height: 140, borderRadius: 6, objectFit: 'cover', flexShrink: 0, maxWidth: '100%' }} />
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
// CONTACT
// ─────────────────────────────────────────────
function Contact() {
  const { ref, visible } = useReveal();
  return (
    <Section id="contact">
      <SH n="07" label="Contact" sub="Let's talk about building something real." color="#F0B429" />
      <div ref={ref} className={`reveal ${visible ? 'in' : ''}`} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 420px), 1fr))', gap: 48, alignItems: 'center' }}>
        <div>
          <h2 style={{ fontFamily: SERIF, fontSize: 40, fontWeight: 400, lineHeight: 1.2, letterSpacing: '-0.02em', color: '#F2EDD8', marginBottom: 20, paddingBottom: '0.08em' }}>
            Open to roles in AI research, ML engineering, and data science.
          </h2>
          <p style={{ fontSize: 16, lineHeight: 1.75, color: '#B8B4A4', marginBottom: 28 }}>
            Whether it&apos;s a full-time opportunity, research collaboration, or just a conversation about autonomous systems — I&apos;m listening.
          </p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <a href="mailto:firas.azfar@gmail.com">
              <NeonButton style={{ fontFamily: MONO, fontSize: 11, padding: '12px 24px', letterSpacing: '0.06em', background: '#F0B429', color: '#0B0D14', border: 'none', borderRadius: 5, textTransform: 'uppercase' }}>
                firas.azfar@gmail.com
              </NeonButton>
            </a>
            <a href="/docs/Ahmad_Resume_Developer_I_FirstSolar.pdf" target="_blank" rel="noopener">
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
            <div key={c.label} style={{ padding: '20px', background: 'rgba(242,237,216,0.025)', borderTop: '1px solid rgba(242,237,216,0.07)', borderRight: '1px solid rgba(242,237,216,0.07)', borderBottom: '1px solid rgba(242,237,216,0.07)', borderRadius: 8, borderLeft: `2px solid ${c.color}` }}>
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
// PAGE
// ─────────────────────────────────────────────
export default function Portfolio() {
  return (
    <>
      <Header />
      <NebulaCube />
      <main style={{ position: 'relative', zIndex: 20, background: 'transparent' }}>
        <Hero />
        <About />
        <Experience />
        <Projects />
        <Research />
        <FeaturedIn />
        <Skills />
        <Contact />
      </main>
      <footer style={{ position: 'relative', zIndex: 20, borderTop: '1px solid rgba(242,237,216,0.06)', padding: '28px 52px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
        <span style={{ fontFamily: MONO, fontSize: 10, color: '#6E6B60', letterSpacing: '0.12em', textTransform: 'uppercase' }}>© 2026 Ahmad Firas. All rights reserved.</span>
        <span style={{ fontFamily: MONO, fontSize: 10, color: '#6E6B60', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Built with ♥ by Ahmad Firas</span>
      </footer>
    </>
  );
}



