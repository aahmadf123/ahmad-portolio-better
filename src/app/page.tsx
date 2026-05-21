'use client';

import dynamic from 'next/dynamic';
import React, { useRef, useEffect, useState } from 'react';
import Link from 'next/link';
import { Header } from '@/components/ui/header-2';
import { ExpandableCard } from '@/components/ui/expandable-card';
import { AnimatedFeatureSpotlight } from '@/components/ui/feature-spotlight';
import { HoverPeek } from '@/components/ui/link-preview';
import { NeonButton } from '@/components/ui/neon-button';
import { Lightbox } from '@/components/ui/image-lightbox';
import { FlaskConical, Mail, MapPin, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

function GithubIcon({ size = 24, color = 'currentColor', strokeWidth = 2 }: { size?: number; color?: string; strokeWidth?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
    </svg>
  );
}

function LinkedinIcon({ size = 24, color = 'currentColor', strokeWidth = 2 }: { size?: number; color?: string; strokeWidth?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}
import { fieldNotes } from '@/lib/field-notes';
import { FieldNoteCard } from '@/components/ui/field-notes/field-note-card';
import { resolveSkillColor } from '@/lib/skill-colors';

const NebulaCube = dynamic(
  () => import('@/components/ui/explorations-with-gsap-and-scroll-trigger').then(m => ({ default: m.NebulaCube })),
  { ssr: false }
);

// ── Font tokens (single source of truth) ──
const SERIF = "var(--font-chakra), 'Chakra Petch', sans-serif";
const MONO  = "var(--font-chakra), 'Chakra Petch', monospace";
const SANS  = "var(--font-chakra), 'Chakra Petch', sans-serif";

// ── Color tokens (mirrors CSS custom properties) ──
const FG  = 'var(--foreground)';
const FG2 = 'var(--text2)';
const FG3 = 'var(--text3)';
const BG  = 'var(--background)';

// ── Lightbox context ──
const LightboxCtx = React.createContext<(src: string, alt?: string) => void>(() => {});
function useLightboxOpen() { return React.useContext(LightboxCtx); }

// ── Section Header ──
function SH({ n, label, sub = '', color = 'var(--amber)' }: { n: string; label: string; sub?: string; color?: string }) {
  return (
    <div style={{ position: 'relative', marginBottom: 52, paddingTop: 8 }}>
      <div aria-hidden className="ghost-num" style={{ position: 'absolute', top: -32, left: -8, fontFamily: SERIF, fontSize: 'clamp(72px,11vw,160px)', fontWeight: 400, color, opacity: 0.05, lineHeight: 1, userSelect: 'none', pointerEvents: 'none', letterSpacing: '-0.03em', zIndex: 0 }}>{n}</div>
      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: sub ? 10 : 0 }}>
          <span style={{ display: 'inline-block', width: 22, height: 1.5, background: color, opacity: 0.6, flexShrink: 0 }} />
          <span style={{ fontFamily: MONO, fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color }}>{label}</span>
        </div>
        {sub && <p style={{ fontSize: 15, color: FG2, maxWidth: 460, lineHeight: 1.65, marginTop: 4, fontFamily: SANS }}>{sub}</p>}
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
const PALETTE = ['#F0B429','#4B7BF5','#2DD4C8','#F07832','#A78BFA','#F472B6','#0EA5E9','#22C55E','#EF4444'];
function pickColor(text: string) {
  let h = 0;
  for (let i = 0; i < text.length; i++) h = (h * 31 + text.charCodeAt(i)) >>> 0;
  return PALETTE[h % PALETTE.length];
}

function Tag({ color, children }: { color?: string; children: React.ReactNode }) {
  const skillColor = typeof children === 'string' ? resolveSkillColor(children) : undefined;
  const c = color ?? skillColor ?? (typeof children === 'string' ? pickColor(children) : '#4B7BF5');
  return <span style={{ fontFamily: MONO, fontSize: 11, padding: '4px 9px', background: `${c}14`, border: `1px solid ${c}33`, borderRadius: 4, color: c, letterSpacing: '0.03em' }}>{children}</span>;
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
    <section id="hero" tabIndex={-1} style={{
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
        flexWrap: 'wrap',
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
              <span style={{ color: '#F0B429' }}>Ahmad</span><br />Firas
            </h1>
            <p style={{ fontSize: 16, lineHeight: 1.72, color: '#B8B4A4', maxWidth: 440, marginTop: 26, fontFamily: SANS }}>
              Building AI systems for uncertain environments — from UAV autonomy research to enterprise agentic workflows.
            </p>
            <div style={{ marginTop: 28, display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
              <a href="#projects" data-magnetic="" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '11px 24px', background: '#F0B429', color: '#0B0D14', fontFamily: MONO, fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', borderRadius: 5, textTransform: 'uppercase' }}>View Work ↗</a>
              <a href="#contact" data-magnetic="" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '11px 24px', border: '1px solid rgba(242,237,216,0.16)', color: '#B8B4A4', fontFamily: MONO, fontSize: 11, letterSpacing: '0.06em', borderRadius: 5, textTransform: 'uppercase' }}>Get in Touch</a>
              <a href="/docs/Ahmad_Resume_Developer_I_FirstSolar.pdf" target="_blank" rel="noopener" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '9px 18px', border: '1px solid rgba(242,237,216,0.1)', color: FG3, fontFamily: MONO, fontSize: 10, letterSpacing: '0.07em', borderRadius: 5, textTransform: 'uppercase' }}>Resume ↓</a>
            </div>
          </div>

          {/* bottom scroll hint */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, opacity: 0.45, animation: rdy ? 'bob 2.2s ease-in-out 2s infinite' : 'none' }}>
            <div style={{ width: 1, height: 32, background: 'linear-gradient(to bottom, #F0B429, transparent)' }} />
            <span style={{ fontFamily: MONO, fontSize: 9, letterSpacing: '0.14em', color: FG3, textTransform: 'uppercase' }}>Scroll to explore</span>
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
                {f.s && <div style={{ fontSize: 11, color: FG3, marginTop: 1 }}>{f.s}</div>}
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes bob { 0%,100%{transform:translateY(0)} 50%{transform:translateY(6px)} }
        @keyframes pulse-a { 0%{box-shadow:0 0 0 0 rgba(45,212,200,0.5)} 70%{box-shadow:0 0 0 7px rgba(45,212,200,0)} 100%{box-shadow:0 0 0 0 rgba(45,212,200,0)} }
        @media (max-width: 960px) {
          #hero > div { flex-direction: column !important; }
          #hero .hero-left { flex: none !important; width: 100% !important; }
          #hero .hero-right { flex: none !important; width: 100% !important; border-left: none !important; border-top: 1px solid rgba(240,180,41,0.08) !important; }
          #hero .hero-right img { max-height: 440px !important; min-height: 180px; width: 100% !important; object-fit: cover !important; }
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
    <div style={{ position: 'relative' }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/Images/my%20pic.png"
        alt="Ahmad Firas"
        title="Click to enlarge"
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
      <div
        aria-hidden
        style={{
          position: 'absolute', bottom: 10, right: 10,
          background: 'rgba(11,13,20,0.62)',
          borderRadius: 4, padding: '4px 8px',
          display: 'flex', alignItems: 'center', gap: 5,
          pointerEvents: 'none',
        }}
      >
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#B8B4A4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <polyline points="15 3 21 3 21 9" /><polyline points="9 21 3 21 3 15" />
          <line x1="21" y1="3" x2="14" y2="10" /><line x1="3" y1="21" x2="10" y2="14" />
        </svg>
        <span style={{ fontFamily: MONO, fontSize: 9, letterSpacing: '0.1em', color: '#B8B4A4', textTransform: 'uppercase' }}>Enlarge</span>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// ABOUT
// ─────────────────────────────────────────────
function About() {
  const { ref, visible } = useReveal();
  return (
    <Section id="about">
      <SH n="01" label="About" color="var(--blue)" />
      <div ref={ref} className={`reveal ${visible ? 'in' : ''}`} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))', gap: 48 }}>
        <div>
          <h2 style={{ fontFamily: SERIF, fontSize: 32, fontWeight: 400, lineHeight: 1.25, letterSpacing: '-0.02em', color: '#F2EDD8', paddingBottom: '0.08em' }}>
            Chasing the gap between what AI can do in a lab and what it actually does when someone&apos;s counting on it.
          </h2>
          <p style={{ fontSize: 16, lineHeight: 1.75, color: '#B8B4A4', marginTop: 24 }}>Computer Science &amp; Engineering graduate from the University of Toledo. My work spans autonomous drone systems, enterprise AI, sports analytics, and data engineering. Not by design, but by instinct: I go where the hardest problems are.</p>
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
          <div style={{ fontFamily: MONO, fontSize: 11, color: FG3, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 20 }}>Three things I believe</div>
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
              {['Machine Learning', 'Neural Networks', 'Databases', 'Software Eng.', 'Embedded Systems'].map(c => <Tag key={c}>{c}</Tag>)}
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
    {
      r: 'Sports Analytics & Data Science Intern',
      co: 'UToledo Athletics',
      p: 'Oct 2025 – Present',
      loc: 'Toledo, OH',
      t: 'Internship',
      active: true,
      color: '#2DD4C8',
      d: 'Collaborate with Athletics Directors and Coaches to develop ML-Powered analytics solutions for athletic performance improvement. Developed statistical models for evaluating roster efficiency and optimizing student-athlete benefit allocation. Created DOMO dashboards translating complex data into actionable insights for coaches and administrators. Facilitated onboarding and technical training for incoming interns.',
      achievements: ['ML-powered roster efficiency models', 'DOMO dashboards for coaches & admins', 'Onboarded & trained incoming interns', 'Featured in official UToledo Rockets media'],
      s: ['Python', 'scikit-learn', 'DOMO', 'Statistical Modeling', 'ML'],
    },
    {
      r: 'Microsoft Solution Developer',
      co: 'First Solar',
      p: 'Jan 2026 – May 2026',
      loc: 'Perrysburg, OH',
      t: 'Full-time',
      color: '#F0B429',
      d: 'Functioned as an AI Engineer & Data Engineer, delivering AI solutions within Microsoft for the Business. Developed and tested automated workflows using Power Automate. Integrated Azure AI services into Microsoft 365 applications for enhanced functionality. Spearheaded project workflows for a team of two additional interns, coordinating contributions to meet critical milestones. Created connectors and scripts to support enterprise-level automation.',
      achievements: ['Agentic AI solutions in Copilot Studio', 'Automated Power Automate workflows', 'Led intern team across project milestones', 'Azure AI × M365 enterprise integration'],
      s: ['Copilot Studio', 'Azure AI', 'Power Automate', 'M365', 'Python'],
    },
    {
      r: 'Undergraduate Researcher',
      co: 'LION Lab · CPHS Lab',
      p: 'May – Dec 2025',
      loc: 'University of Toledo',
      t: 'Research Co-Op',
      color: '#4B7BF5',
      d: 'Led research on next-generation drone autonomy integrating Graph-Based Reinforcement Learning, Visual-Inertial Odometry, UWB, and real-time Human-in-the-Loop collaboration for indoor/outdoor GPS-denied navigation. Built GNN/GAT with PPO/SAC algorithms and MAML meta-learning for rapid policy adaptation. Designed AWS DeepRacer-inspired interface for real-time reward shaping. Authored ACM CSUR survey paper on AI failure taxonomy.',
      achievements: ['72.8% zero-shot UAV deployment via MAML', '97.3% HITL success at sub-100ms', 'ACM CSUR survey paper (under review)', 'USRCAP $3,000 fellowship'],
      s: ['PyTorch', 'ROS 2', 'MAML', 'YOLO11', 'AirSim', 'NVIDIA Jetson', 'GNN/GAT'],
    },
    {
      r: 'Senior Design Team Lead',
      co: 'Grange Insurance × UToledo',
      p: 'Aug 2024 – May 2025',
      loc: 'Toledo, OH',
      t: 'Industry Project',
      color: '#A78BFA',
      d: 'Led interdisciplinary team delivering a production-grade MLOps insurance risk model. Designed Airflow + MLflow pipeline with drift monitoring and HITL gates — automating the full ML lifecycle from data ingestion through deployment. Achieved R² = 0.982, outperforming the GLM baseline by 26%, while reducing manual actuarial review by 75%.',
      achievements: ['R² = 0.982 · 26% over GLM baseline', '75% reduction in manual review', 'Airflow + MLflow full MLOps pipeline', 'AWS S3/EC2 production infrastructure'],
      s: ['XGBoost', 'Airflow', 'MLflow', 'AWS S3/EC2', 'Bayesian Opt.', 'SHAP', 'Docker'],
    },
    {
      r: 'Database Engineer Co-Op',
      co: 'Park Place Technologies',
      p: 'May – Aug 2023',
      loc: 'Toledo, OH',
      t: 'Co-Op',
      color: '#F07832',
      d: 'Architected and implemented a data governance framework consolidating security data from Active Directory, Cisco AMP, and Microsoft Defender into a centralized PostgreSQL database. Implemented validation rules catching 95% of non-compliant entries during ingestion. Revamped disaster recovery protocol — achieving zero data loss across all quarterly DR simulations.',
      achievements: ['15% faster incident response', '95% data integrity rate', 'Zero data loss across all DR tests', '3 enterprise security sources unified'],
      s: ['PostgreSQL', 'pgAdmin', 'Active Directory', 'Cisco AMP', 'Data Governance', 'SQL'],
    },
    {
      r: 'IT Student Assistant',
      co: 'The University of Toledo',
      p: 'Oct 2022 – Feb 2023',
      loc: 'Toledo, OH',
      t: 'Part-time',
      color: '#22C55E',
      d: 'Resolved 60% of recurring IT issues by streamlining account troubleshooting for students and medical staff. Achieved 100% compliance with FERPA and HIPAA guidelines while handling sensitive data across platforms. Revamped the account access troubleshooting system by authoring detailed guides that slashed repeat issues by 40%. Delivered cross-platform support for students, faculty, patients, and Doctors.',
      achievements: ['60% fewer recurring IT issues', '100% FERPA & HIPAA compliance', '40% reduction in repeat incidents', 'Cross-platform support: students & medical staff'],
      s: ['IT Support', 'FERPA', 'HIPAA', 'Troubleshooting', 'Documentation'],
    },
  ];
  const { ref, visible } = useReveal();
  return (
    <Section id="experience" style={{ background: 'rgba(15,17,25,0.92)' }}>
      <SH n="02" label="Experience" sub="Where the work actually happened." color="var(--purple)" />
      <div ref={ref} className={`reveal ${visible ? 'in' : ''}`} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {jobs.map((job, i) => (
          <div
            key={i}
            onClick={() => setOpen(open === i ? null : i)}
            style={{
              cursor: 'pointer',
              background: open === i ? `${job.color}13` : `${job.color}08`,
              border: `1px solid ${open === i ? job.color + '60' : job.color + '30'}`,
              transition: 'all 0.28s cubic-bezier(0.16,1,0.3,1)',
              borderRadius: 10,
              overflow: 'hidden',
              position: 'relative',
            }}
          >
            {/* Left accent bar */}
            <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 4, background: `linear-gradient(to bottom, ${job.color}, ${job.color}70)`, borderRadius: '10px 0 0 10px' }} />

            <div style={{ padding: '20px 24px 20px 30px' }}>
              {/* Header row */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                    {job.active && <span className="pulse" style={{ width: 6, height: 6, borderRadius: '50%', background: job.color, display: 'inline-block', flexShrink: 0 }} />}
                    <span style={{ fontFamily: MONO, fontSize: 10, color: job.color, letterSpacing: '0.1em', textTransform: 'uppercase', background: `${job.color}18`, padding: '2px 9px', borderRadius: 3 }}>{job.t}</span>
                  </div>
                  <div style={{ fontFamily: SERIF, fontSize: 19, fontWeight: 400, color: '#F2EDD8', letterSpacing: '-0.01em', lineHeight: 1.25, paddingBottom: '0.05em' }}>{job.r}</div>
                  <div style={{ fontSize: 13, color: '#B8B4A4', marginTop: 4 }}>{job.co} · {job.loc}</div>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ fontFamily: MONO, fontSize: 11, color: job.color, letterSpacing: '0.06em' }}>{job.p}</div>
                  <span style={{ fontSize: 18, color: job.color, marginTop: 8, display: 'inline-block', transition: 'transform 0.3s', transform: open === i ? 'rotate(45deg)' : 'none' }}>+</span>
                </div>
              </div>

              {/* Collapsed preview — 2 achievement chips */}
              {open !== i && (
                <div style={{ marginTop: 12, display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                  {job.achievements.slice(0, 2).map((a, ai) => { const ac = pickColor(a); return (
                    <span key={ai} style={{ fontFamily: MONO, fontSize: 10, padding: '3px 8px', background: `${ac}12`, border: `1px solid ${ac}30`, borderRadius: 3, color: ac, letterSpacing: '0.02em' }}>{a}</span>
                  ); })}
                </div>
              )}

              {/* Expanded detail */}
              {open === i && (
                <div style={{ marginTop: 18, paddingTop: 16, borderTop: `1px solid ${job.color}22` }} onClick={e => e.stopPropagation()}>
                  <p style={{ fontSize: 15, lineHeight: 1.8, color: '#B8B4A4', marginBottom: 18 }}>{job.d}</p>

                  <div style={{ fontFamily: MONO, fontSize: 10, color: job.color, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 10, opacity: 0.8 }}>Key Achievements</div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: 8, marginBottom: 18 }}>
                    {job.achievements.map((a, ai) => (
                      <div key={ai} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, padding: '10px 14px', background: `${job.color}0a`, borderRadius: 6, border: `1px solid ${job.color}22` }}>
                        <span style={{ color: job.color, fontSize: 10, marginTop: 2, flexShrink: 0 }}>▸</span>
                        <span style={{ fontSize: 13, color: '#C8C4B4', lineHeight: 1.45 }}>{a}</span>
                      </div>
                    ))}
                  </div>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {job.s.map(s => <Tag key={s}>{s}</Tag>)}
                  </div>
                </div>
              )}
            </div>
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
      fr: '73% zero-shot success across 1,000+ environments',
      src: '/Images/graph_RL.png', span: 2,
      stacks: ['Graph-Based RL', 'MAML', 'GNN/GAT', 'PINN', 'ROS 2', 'Jetson Orin NX', 'ArduPilot', 'AirSim'],
      detail: (<>
        <h4 style={{ color: '#F0B429', fontFamily: MONO, fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>Overview</h4>
        <p>AeroSynapse is an edge-first UAV autonomy research framework for navigation in GPS-denied, map-free, and communication-denied environments. The system converts the local environment into a dynamic graph — obstacles, waypoints, targets, and free-space regions become nodes; spatial and risk relationships become edges. A graph-based RL policy reasons over this structure without pre-mapping or cloud inference. Across 1,000+ randomized simulation environments, the framework achieves 73% zero-shot navigation success on unseen layouts, reaching 89% after 5 episodes. The control loop runs under 20ms on a Jetson Orin NX; voice-to-action commands resolve in under 500ms.</p>

        {/* Architecture */}
        <h4 style={{ color: '#F0B429', fontFamily: MONO, fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: 16, marginBottom: 8 }}>Architecture</h4>
        <p>Stereo vision, LiDAR, and IMU feeds enter a PINN-based state estimator for physically consistent predictions. The environment is encoded as a real-time dynamic graph. A GNN policy with Q-Prop actor-critic selects navigation actions. MAML-style meta-learning trained across 1000+ randomized environments enables zero-shot and few-shot adaptation to unseen layouts. A safety layer with runtime assurance and control-barrier constraints governs the policy, with human-in-the-loop override via direct control, supervised autonomy, and natural-language command modes.</p>

        {/* My Role */}
        <h4 style={{ color: '#F0B429', fontFamily: MONO, fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: 16, marginBottom: 8 }}>My Role</h4>
        <p>Led the full AI and autonomy architecture direction: graph-based RL framework design, zero-shot/few-shot learning methodology, PINN state estimation integration, human-in-the-loop workflow design, Jetson Orin NX edge deployment strategy, and the research framing, validation plan, and performance metrics for the USRCAP fellowship report.</p>

        {/* Stack */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 14, marginBottom: 4 }}>
          {['Graph-Based RL','GNN/GAT','MAML','PINN','Q-Prop','ROS 2','ArduPilot','Jetson Orin NX','AirSim','SHAP/LIME','OAK-D Pro','SLAMTEC C1'].map(t => <Tag key={t}>{t}</Tag>)}
        </div>

        {/* Key Insight */}
        <h4 style={{ color: '#F0B429', fontFamily: MONO, fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: 16, marginBottom: 8 }}>Key Insight</h4>
        <p>Navigation is a relational problem. A flat perception model sees objects — a graph sees relationships between obstacles, goals, risk, and motion constraints. That structural representation is what makes zero-shot generalization tractable. The safety layer exists not because the policy is weak, but because a UAV autonomy system must fail safely, recover predictably, and keep humans at the right level of control.</p>

        {/* Action buttons */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 22, paddingTop: 16, borderTop: '1px solid rgba(240,180,41,0.15)' }}>
          <Link href="/case-study/graph-based-rl-uav-autonomy" transitionTypes={['nav-forward']} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '9px 18px', background: '#F0B429', color: '#0B0D14', fontFamily: MONO, fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', borderRadius: 5, textTransform: 'uppercase', textDecoration: 'none' }}>View Full Case Study ↗</Link>
          <a href="/docs/USRCAP_Final_Report.pdf" target="_blank" rel="noopener" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '9px 18px', border: '1px solid rgba(240,180,41,0.35)', color: '#F0B429', fontFamily: MONO, fontSize: 10, letterSpacing: '0.06em', borderRadius: 5, textTransform: 'uppercase', textDecoration: 'none' }}>Final Report ↓</a>
        </div>
      </>),
    },
    {
      idx: '02', dom: 'Research Tools', color: '#4B7BF5',
      title: 'DeepFlyer',
      tag: 'Educational Drone RL Platform · LION Lab',
      fr: '80% PPO success over 1M training steps; <1s Gazebo cold-start',
      src: '/Images/DeepFlyer_pics.png', span: 1,
      stacks: ['PPO', 'ROS 2', 'Gazebo', 'Stable-Baselines3', 'React', 'MLflow'],
      detail: (<>
        <h4 style={{ color: '#4B7BF5', fontFamily: MONO, fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>Overview</h4>
        <p>DeepFlyer is a 3D educational drone RL platform inspired by AWS DeepRacer. Instead of racing a 2D car around a track, students train a drone in simulation to fly through hoops, avoid obstacles, and improve through reward-function design. The goal: make reinforcement learning visible — if the reward is poorly shaped, the drone behaves poorly. PPO training converges to 80% hoop-navigation success over 1M steps. Gazebo cold-starts in under 1 second, the reward API responds in under 10ms, and URDF mesh optimization reduced scene complexity by 40% without impacting physics fidelity.</p>

        {/* Architecture */}
        <h4 style={{ color: '#4B7BF5', fontFamily: MONO, fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: 16, marginBottom: 8 }}>Platform Stack</h4>
        <p>A React reward editor sits above a Node/Express backend with MongoDB session storage. Reward presets are dynamically switchable through API endpoints consumed by a Gym environment wrapper. Stable-Baselines3 runs PPO training; ROS 2 Humble + Gazebo Fortress simulate the X500 drone with validated URDF, contact sensors, and course elements. MLflow tracks every experiment run.</p>

        {/* My Role */}
        <h4 style={{ color: '#4B7BF5', fontFamily: MONO, fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: 16, marginBottom: 8 }}>My Role</h4>
        <p>Led the RL and AI side of the platform: reward preset design, Path-Efficiency preset concept, PPO benchmarking, Gym/Stable-Baselines3 training workflow, curriculum learning strategy, and connecting the platform to broader UAV autonomy research and sim-to-real learning principles.</p>

        {/* Stack */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 14, marginBottom: 4 }}>
          {['PPO','Stable-Baselines3','Gym','ROS 2','Gazebo Fortress','React','Node.js','Express','MongoDB','MLflow','X500 URDF','ZED Mini'].map(t => <Tag key={t}>{t}</Tag>)}
        </div>

        {/* Key Insight */}
        <h4 style={{ color: '#4B7BF5', fontFamily: MONO, fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: 16, marginBottom: 8 }}>Key Insight</h4>
        <p>Reward functions are not just math — they encode behavior. A student who increases the collision penalty and watches the drone become more conservative has understood something that no lecture can teach as directly. That physical intuition is what DeepFlyer is built to create.</p>

        {/* Action button */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 22, paddingTop: 16, borderTop: '1px solid rgba(75,123,245,0.15)' }}>
          <Link href="/case-study/deepflyer-drone-reinforcement-learning" transitionTypes={['nav-forward']} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '9px 18px', background: '#4B7BF5', color: '#fff', fontFamily: MONO, fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', borderRadius: 5, textTransform: 'uppercase', textDecoration: 'none' }}>View Full Case Study ↗</Link>
        </div>
      </>),
    },
    {
      idx: '03', dom: 'ACM CSUR', color: '#F07832',
      title: '4-Pillars Taxonomy',
      tag: 'ACM Computing Surveys · Under Review',
      fr: '37 incidents · 127 sources · ACM Computing Surveys, under review',
      src: '/Images/4-Pillars.png', span: 1,
      stacks: ['Taxonomy Design', 'Literature Review', 'AI Safety'],
      detail: (<>
        <h4 style={{ color: '#F07832', fontFamily: MONO, fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>Overview</h4>
        <p>A four-pillar taxonomy of AI failures in safety-critical autonomous environments, synthesized from 37 documented incidents across 127 sources. Submitted to ACM Computing Surveys in April 2026, currently under review.</p>
        <a href="#research" onClick={(e) => { e.preventDefault(); document.getElementById('research')?.scrollIntoView({ behavior: 'smooth' }); }} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 14, padding: '8px 16px', border: '1px solid rgba(240,120,50,0.3)', borderRadius: 5, color: '#F07832', fontFamily: MONO, fontSize: 10, letterSpacing: '0.06em', textTransform: 'uppercase', cursor: 'pointer' }}>Full methodology in Research section ↓</a>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 12 }}>
          {['Taxonomy Design','Literature Review','AI Safety','ACM CSUR'].map(t => <Tag key={t}>{t}</Tag>)}
        </div>
      </>),
    },
    {
      idx: '04', dom: 'MLOps', color: '#A78BFA',
      title: 'Homeowner Loss Prediction',
      tag: 'Grange Insurance × UToledo · Senior Design',
      fr: 'R² = 0.982 · 26% over GLM baseline · 75% reduction in manual review',
      src: '/Images/SeniorDesign_Pipeline.jpeg', span: 2,
      stacks: ['XGBoost', 'Airflow', 'MLflow', 'AWS S3/EC2', 'Pandera', 'Prometheus', 'Hyperopt', 'SHAP'],
      detail: (<>
        <h4 style={{ color: '#A78BFA', fontFamily: MONO, fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>Overview</h4>
        <p>A production-grade MLOps automation pipeline built with Grange Insurance to modernize homeowner risk and pure premium predictions. The project reframed risk modeling as a continuously operating system — automating the full ML lifecycle from raw data ingestion through drift detection, model training, experiment tracking, and human-approved deployment. The XGBoost pipeline achieved R² = 0.982, outperforming the incumbent GLM baseline by 26% on holdout data (RMSE 7,216), while reducing manual actuarial review by 75%.</p>

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
          {['XGBoost','Hyperopt','Airflow','MLflow','AWS S3','AWS EC2','Pandera','Prometheus','Slack API','Docker','GitHub Actions','SHAP','scikit-learn'].map(t => <Tag key={t}>{t}</Tag>)}
        </div>

        {/* Key Insight */}
        <h4 style={{ color: '#A78BFA', fontFamily: MONO, fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: 16, marginBottom: 8 }}>Key Insight</h4>
        <p>The 75% reduction in manual review didn&apos;t happen because humans were removed from the workflow. It happened because the system moved humans to the right point in the loop — intervening only where judgment actually matters: drift remediation, suspicious model behavior, hyperparameter override, rollback, or production promotion.</p>

        {/* Action buttons */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 22, paddingTop: 16, borderTop: '1px solid rgba(167,139,250,0.15)' }}>
          <Link href="/case-study/homeowner-loss-prediction" transitionTypes={['nav-forward']} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '9px 18px', background: '#A78BFA', color: '#0B0D14', fontFamily: MONO, fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', borderRadius: 5, textTransform: 'uppercase', textDecoration: 'none' }}>View Full Case Study ↗</Link>
          <a href="/docs/EECS4020_FinalReport_G3.pdf" target="_blank" rel="noopener" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '9px 18px', border: '1px solid rgba(167,139,250,0.35)', color: '#A78BFA', fontFamily: MONO, fontSize: 10, letterSpacing: '0.06em', borderRadius: 5, textTransform: 'uppercase', textDecoration: 'none' }}>Final Report ↓</a>
          <a href="https://github.com/RayFrightener/ml_automation" target="_blank" rel="noopener" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '9px 18px', border: '1px solid rgba(242,237,216,0.12)', color: '#B8B4A4', fontFamily: MONO, fontSize: 10, letterSpacing: '0.06em', borderRadius: 5, textTransform: 'uppercase', textDecoration: 'none' }}>GitHub ↗</a>
        </div>
      </>),
    },
    {
      idx: '05', dom: 'Infrastructure', color: '#2DD4C8',
      title: 'Security Discovery Tool',
      tag: 'Park Place Technologies · AIIS Summer 2023',
      fr: '15% faster response · 95% data integrity · zero data loss across 3 sources',
      src: '/Images/sdt_tool.png', span: 1,
      stacks: ['PostgreSQL', 'pgAdmin', 'Active Directory', 'Cisco AMP', 'Microsoft Defender', 'SQL'],
      detail: (<>
        <h4 style={{ color: '#2DD4C8', fontFamily: MONO, fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>Overview</h4>
        <p>Industry case study with Park Place Technologies (AIIS Summer 2023). Designed a centralized PostgreSQL security database consolidating fragmented feeds from 3 sources — Active Directory, Cisco AMP, and Microsoft Defender — enforcing validation rules, building disaster-recovery procedures, and enabling faster analyst queries. Result: 15% faster incident response, 95% improvement in data integrity, and zero data loss across all disaster-recovery tests.</p>
        <h4 style={{ color: '#2DD4C8', fontFamily: MONO, fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: 14, marginBottom: 8 }}>My Role</h4>
        <p>Database engineering on the AIIS Database I team: schema design, SQL, data-integrity validation, DR simulation planning, and technical documentation.</p>
        <h4 style={{ color: '#2DD4C8', fontFamily: MONO, fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: 14, marginBottom: 8 }}>Key Insight</h4>
        <p>Most data-quality problems in security ops aren&apos;t adversarial — they&apos;re inconsistent tooling assumptions meeting at a shared data boundary. A validated schema is a security control.</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 12, marginBottom: 16 }}>
          {['PostgreSQL','pgAdmin','Active Directory','Cisco AMP','Microsoft Defender','Data Governance','Disaster Recovery','SQL'].map(t => <Tag key={t}>{t}</Tag>)}
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 8, paddingTop: 14, borderTop: '1px solid rgba(45,212,200,0.15)' }}>
          <Link href="/case-study/security-discovery-tool" transitionTypes={['nav-forward']} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '9px 18px', background: '#2DD4C8', color: '#0B0D14', fontFamily: MONO, fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', borderRadius: 5, textTransform: 'uppercase', textDecoration: 'none' }}>View Full Case Study ↗</Link>
        </div>
      </>),
    },
    {
      idx: '06', dom: 'Hackathon', color: '#F0B429',
      title: 'DeepTruth',
      tag: 'RocketHacks 2025 · Best Use of MongoDB Atlas',
      fr: '#1 Best Use of MongoDB Atlas · 9,500+ training points in 24 hours',
      src: '/Images/DeepTruth_Group.png', span: 1,
      stacks: ['Gemini AI', 'DistilBERT', 'Django', 'React', 'MongoDB', 'Chrome Extension'],
      detail: (<>
        <h4 style={{ color: '#F0B429', fontFamily: MONO, fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>What Was Built</h4>
        <p>Built in 24 hours at RocketHacks 2025, winning Best Use of MongoDB Atlas. A web app and Chrome extension that analyze article titles using dual-model AI across 9,500+ training data points — Gemini handles high-level reasoning and explanation, DistilBERT adds NLP classification, and a 70/30 weighted fusion produces a credibility score, veracity assessment, reasoning, and independent source links. Claims stored in MongoDB.</p>
        <h4 style={{ color: '#F0B429', fontFamily: MONO, fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: 14, marginBottom: 8 }}>Key Insight</h4>
        <p>Credibility systems need explanations, not only scores — and multi-model architectures are more honest than trusting a single signal. The goal was never to decide truth; it was to help users ask better questions faster.</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 12, marginBottom: 16 }}>
          {['Gemini AI','DistilBERT','Django REST','React','Vite','MongoDB','Chrome Extension','NLP','Hugging Face'].map(t => <Tag key={t}>{t}</Tag>)}
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 8, paddingTop: 14, borderTop: '1px solid rgba(240,180,41,0.15)' }}>
          <Link href="/case-study/deeptruth-ai-fact-checking" transitionTypes={['nav-forward']} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '9px 18px', background: '#F0B429', color: '#0B0D14', fontFamily: MONO, fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', borderRadius: 5, textTransform: 'uppercase', textDecoration: 'none' }}>View Full Case Study ↗</Link>
          <a href="https://github.com/TheChozenWon/DeepTruth.git" target="_blank" rel="noopener" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '9px 18px', border: '1px solid rgba(240,180,41,0.35)', color: '#F0B429', fontFamily: MONO, fontSize: 10, letterSpacing: '0.06em', borderRadius: 5, textTransform: 'uppercase', textDecoration: 'none' }}>GitHub ↗</a>
          <a href="https://youtu.be/whTYKriT5JU?si=M-0yUWXURhPrvy--" target="_blank" rel="noopener" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '9px 18px', border: '1px solid rgba(242,237,216,0.12)', color: '#B8B4A4', fontFamily: MONO, fontSize: 10, letterSpacing: '0.06em', borderRadius: 5, textTransform: 'uppercase', textDecoration: 'none' }}>Watch Demo ↗</a>
        </div>
      </>),
    },
    {
      idx: '07', dom: 'Embedded', color: '#F07832',
      title: 'Camel Car',
      tag: 'AIChE 2025 · Most Innovative Car Design · 3rd Poster · 24th Overall',
      fr: '24th overall · #1 Most Innovative · AIChE 2025 ChemE Car',
      src: '/Images/AIChE%20ChemECar_International.jpg', span: 1,
      stacks: ['Arduino', 'Pressure Sensing', 'Solenoid Control', 'Embedded C', 'Calibration'],
      detail: (<>
        <h4 style={{ color: '#F07832', fontFamily: MONO, fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>What Was Built</h4>
        <p>University of Toledo&apos;s entry placed 24th overall at AIChE 2025 in Boston — earning Most Innovative Car Design and 3rd in Poster & Presentation nationally. CO₂ generation provides propulsion; H₂O₂ decomposition provides stopping. As Control Team Lead, I built the Arduino-based pressure-sensing and shutoff system: monitor the stopping reaction, detect the ~5 psi setpoint, trigger the solenoid to cut gas flow to the motor. Calibrated via KI volume vs. time-to-pressure experiments for the target competition distance.</p>
        <h4 style={{ color: '#F07832', fontFamily: MONO, fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: 14, marginBottom: 8 }}>Key Insight</h4>
        <p>The chemistry creates the signal. The control system is what turns that signal into a repeatable vehicle action. A well-calibrated threshold controller beats a complex one when variability is chemical, not electrical.</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 12, marginBottom: 16 }}>
          {['Arduino','Pressure Sensing','Solenoid Control','Embedded C','Calibration','Safety Systems','CO₂ Propulsion'].map(t => <Tag key={t}>{t}</Tag>)}
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 8, paddingTop: 14, borderTop: '1px solid rgba(240,120,50,0.15)' }}>
          <Link href="/case-study/camel-car-cheme-car-control-system" transitionTypes={['nav-forward']} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '9px 18px', background: '#F07832', color: '#0B0D14', fontFamily: MONO, fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', borderRadius: 5, textTransform: 'uppercase', textDecoration: 'none' }}>View Full Case Study ↗</Link>
        </div>
      </>),
    },
    {
      idx: '08', dom: 'Civic Tech', color: '#F472B6',
      title: 'Batting Cleanup',
      tag: 'City of Toledo · Applied Labs · In Production',
      fr: 'In production: <10ms geospatial queries across 10,000+ city assets',
      src: '/Images/Batting_Cleanup.jpg', span: 1,
      stacks: ['Deno', 'PostGIS', 'Cloudflare Workers', 'Drizzle ORM', 'Docker', 'Hono'],
      detail: (<>
        <h4 style={{ color: '#F472B6', fontFamily: MONO, fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>What Was Built</h4>
        <p>In active production in downtown Toledo. Residents scan QR codes on public trash assets to instantly file maintenance reports. I contributed to backend architecture: modernized raw init scripts into a type-safe Deno monorepo, built PostGIS geospatial models with GiST indexing, benchmarked ST_DWithin queries to under 10ms against 10,000+ simulated localized assets, designed Docker Compose local infrastructure for the 7-person team, and implemented location-verification and anti-spoofing layers.</p>
        <h4 style={{ color: '#F472B6', fontFamily: MONO, fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: 14, marginBottom: 8 }}>Key Insight</h4>
        <p>The hard part was not making a form. The hard part was making location-aware public reporting reliable enough for real city use — GPS noise, indoor submissions, spoofing attempts, and all.</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 12, marginBottom: 16 }}>
          {['Deno','PostGIS','Cloudflare Workers','Hono','Drizzle ORM','Docker','GiST Indexing','Geospatial Validation','Anti-Spoofing'].map(t => <Tag key={t}>{t}</Tag>)}
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 8, paddingTop: 14, borderTop: '1px solid rgba(244,114,182,0.15)' }}>
          <Link href="/case-study/batting-cleanup-smart-city-waste-reporting" transitionTypes={['nav-forward']} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '9px 18px', background: '#F472B6', color: '#0B0D14', fontFamily: MONO, fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', borderRadius: 5, textTransform: 'uppercase', textDecoration: 'none' }}>View Full Case Study ↗</Link>
          <a href="https://battingcleanup.appliedlabs.org/" target="_blank" rel="noopener" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '9px 18px', border: '1px solid rgba(244,114,182,0.35)', color: '#F472B6', fontFamily: MONO, fontSize: 10, letterSpacing: '0.06em', borderRadius: 5, textTransform: 'uppercase', textDecoration: 'none' }}>Documentation ↗</a>
          <a href="https://toledofreepress.com/batting-cleanup-aims-to-improve-toledo-maintenance-with-tech/" target="_blank" rel="noopener" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '9px 18px', border: '1px solid rgba(242,237,216,0.12)', color: '#B8B4A4', fontFamily: MONO, fontSize: 10, letterSpacing: '0.06em', borderRadius: 5, textTransform: 'uppercase', textDecoration: 'none' }}>News Article ↗</a>
        </div>
      </>),
    },
    {
      idx: '09', dom: 'Athletics', color: '#0EA5E9',
      title: 'Champions Complex Digital Campaign',
      tag: 'University of Toledo Athletics · Digital Fundraising Campaign',
      fr: '74,000 sq ft · 450+ athletes · 6-stage donor psychology journey',
      src: '/Images/Champion_Complex_Render1.jpg', span: 2,
      stacks: ['Web Strategy', 'Sidearm Sports', 'Donor UX', 'Information Architecture', 'Digital Fundraising', 'Brand Strategy'],
      detail: (<>
        {/* Overview */}
        <h4 style={{ color: 'var(--sky)', fontFamily: MONO, fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>Overview</h4>
        <p>The Champions Complex Digital Campaign is a strategic webpage and digital fundraising blueprint for University of Toledo Athletics. The project supports the Champions Complex initiative — a 74,000-square-foot renovation of the Health Education Building that centralizes resources for 450+ student-athletes, bringing academics, nutrition, wellness, training, and team spaces under one roof while returning baseball and softball to main campus. The campaign deploys 10 architectural renderings across a six-stage donor psychology sequence built on the Sidearm Narrator platform.</p>

        {/* My Role */}
        <h4 style={{ color: 'var(--sky)', fontFamily: MONO, fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: 16, marginBottom: 8 }}>My Role</h4>
        <p>Created the full digital campaign strategy: information architecture, scroll-based donor journey, rendering-to-section narrative mapping, Sidearm Sports / Narrator implementation planning, donation CTA flow, naming-rights structure, UToledo brand alignment, and digital donor recognition concepts. The work sits at the intersection of web development, UX, sports marketing, and donor psychology.</p>

        {/* Digital Strategy */}
        <h4 style={{ color: 'var(--sky)', fontFamily: MONO, fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: 16, marginBottom: 8 }}>Digital Strategy</h4>
        <p>The page follows a deliberate six-stage donor psychology sequence: Awe → Understanding → Trust → Exploration → Legacy → Action. Each architectural rendering is assigned to a specific narrative section rather than a generic gallery — exterior dusk rendering opens the hero, Academic Center renders anchor the excellence section, Champions Corridor ties donor recognition to legacy. Sidearm Narrator enables the immersive single-page experience using parallax, sliders, and scroll-triggered animation within the existing athletics web ecosystem.</p>

        {/* Stack */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 14, marginBottom: 4 }}>
          {['Sidearm Sports','Sidearm Narrator','Web Strategy','Information Architecture','Donor UX','Digital Fundraising','Sports Marketing','Brand Strategy','UToledo Design System','Naming-Rights Planning','Conversion Psychology'].map(t => <Tag key={t}>{t}</Tag>)}
        </div>

        {/* Key Insight */}
        <h4 style={{ color: 'var(--sky)', fontFamily: MONO, fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: 16, marginBottom: 8 }}>Key Insight</h4>
        <p>Capital campaign websites are conversion systems, not information pages. Donor trust is built through clarity, momentum, and proof — not renderings alone. The donation flow must be designed as carefully as the visual experience: a donor who is emotionally convinced should not have to search for the next step.</p>

        {/* Action buttons */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 22, paddingTop: 16, borderTop: '1px solid rgba(14,165,233,0.15)' }}>
          <Link href="/case-study/champions-complex-digital-campaign" transitionTypes={['nav-forward']} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '9px 18px', background: 'var(--sky)', color: '#0B0D14', fontFamily: MONO, fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', borderRadius: 5, textTransform: 'uppercase', textDecoration: 'none' }}>View Full Case Study ↗</Link>
        </div>
      </>),
    },
    {
      idx: '10', dom: 'Internal Tools', color: '#22C55E',
      title: 'Toledo Athletics Onboarding Portal',
      tag: 'University of Toledo Athletics · Internal Platform',
      fr: '14-table schema · serverless edge deployment across 5 service tiers',
      src: '/Images/Toledo_Athletics_Onboarding.png', span: 2,
      stacks: ['Cloudflare Workers', 'Hono', 'React', 'Cloudflare D1', 'Workers AI', 'TypeScript'],
      detail: (<>
        {/* Overview */}
        <h4 style={{ color: 'var(--green)', fontFamily: MONO, fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>Overview</h4>
        <p>A serverless internal onboarding platform built for University of Toledo Athletics staff, spanning 5 core services and a 14-table relational schema. The portal centralizes 10+ onboarding content areas — articles, staff hierarchy, key contacts, HR timelines, compliance resources, systems directories, policy links, quick links, and moderated employee tips — replacing scattered documents and tribal knowledge with a single searchable source of truth, deployed at the edge via Cloudflare Workers.</p>

        {/* Problem */}
        <h4 style={{ color: 'var(--green)', fontFamily: MONO, fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: 16, marginBottom: 8 }}>Problem</h4>
        <p>New staff entering a Division I athletics department must simultaneously navigate university HR, NCAA compliance, Title IX, NIL rules, FERPA, IT systems, campus logistics, facilities, brand standards, and athletics-specific workflows. Without a centralized system, onboarding is inconsistent, supervisors repeat themselves, and outdated information creates operational and compliance risk.</p>

        {/* Architecture */}
        <h4 style={{ color: 'var(--green)', fontFamily: MONO, fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: 16, marginBottom: 8 }}>Architecture</h4>
        <p>React SPA frontend → Cloudflare Worker API → Hono routes → Cloudflare D1 (SQLite relational schema) → Workers AI chat assistant. The database separates official published content from employee submissions behind a moderation layer: staff submit tips, which remain pending until a moderator approves or rejects them. This captures practical knowledge without letting unverified guidance become official policy.</p>

        {/* My Role */}
        <h4 style={{ color: 'var(--green)', fontFamily: MONO, fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: 16, marginBottom: 8 }}>My Role</h4>
        <p>Designed and built the full platform: onboarding content architecture, relational schema design across 14 tables, Cloudflare Workers + Hono serverless API, React SPA, Workers AI chat integration, moderated knowledge-management workflow, and a maintenance guide for future staff to update content, contacts, policies, and systems without touching the codebase.</p>

        {/* Stack */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 14, marginBottom: 4 }}>
          {['Cloudflare Workers','Hono','TypeScript','React','Cloudflare D1','SQLite','Workers AI','Wrangler','Serverless','Knowledge Management','NCAA Compliance','HR Onboarding'].map(t => <Tag key={t}>{t}</Tag>)}
        </div>

        {/* Key Insight */}
        <h4 style={{ color: 'var(--green)', fontFamily: MONO, fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: 16, marginBottom: 8 }}>Key Insight</h4>
        <p>Onboarding is a knowledge-management problem, not a documentation problem. The moderation layer matters most: athletics onboarding covers compliance topics where incorrect guidance about NCAA rules, Title IX, NIL, FERPA, or HR policy creates institutional risk. The portal captures real staff knowledge while preserving administrative control over what becomes official.</p>

        {/* Action buttons */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 22, paddingTop: 16, borderTop: '1px solid rgba(34,197,94,0.15)' }}>
          <Link href="/case-study/toledo-athletics-onboarding-portal" transitionTypes={['nav-forward']} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '9px 18px', background: 'var(--green)', color: '#0B0D14', fontFamily: MONO, fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', borderRadius: 5, textTransform: 'uppercase', textDecoration: 'none' }}>View Full Case Study ↗</Link>
        </div>
      </>),
    },
    {
      idx: '11', dom: 'Sports Analytics', color: '#EF4444',
      title: 'Toledo Football IQ',
      tag: 'University of Toledo Athletics · Football · Active Build',
      fr: '10-stage CV pipeline · 90%+ field-marking accuracy · 18+ structured metrics',
      src: '/Images/Football_IQ_Analytics.png', span: 1,
      stacks: ['YOLO', 'ByteTrack', 'RTMPose', 'FastAPI', 'React', 'Postgres', 'Cloudflare R2', 'MLflow'],
      detail: (<>
        {/* Overview */}
        <h4 style={{ color: 'var(--red)', fontFamily: MONO, fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>Overview</h4>
        <p>An active computer vision platform for Toledo Football — a 10-stage pipeline from video ingest to coach dashboard, targeting 90%+ field-marking accuracy across a 18+ table database schema. In Phase 0, the system works through 50–100 annotated evaluation clips to validate each pipeline stage before advancing. Every output connects to the exact clip, overlay, confidence score, and correction path. If a coach cannot verify it, correct it, and teach from it — it is not a production metric.</p>

        {/* Problem */}
        <h4 style={{ color: 'var(--red)', fontFamily: MONO, fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: 16, marginBottom: 8 }}>Problem</h4>
        <p>Raw practice film is time-consuming to review. Coaches manually tag plays, identify formations, evaluate routes, track effort, and create cutups. Commercial tools provide generic AI tagging, but Toledo can build a local advantage through overhead drone footage, Toledo-specific terminology, a coach-correction flywheel, and integration with athlete-development workflows.</p>

        {/* CV Pipeline */}
        <h4 style={{ color: 'var(--red)', fontFamily: MONO, fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: 16, marginBottom: 8 }}>10-Stage CV Pipeline</h4>
        <p>Video ingest → play segmentation → field calibration (homography) → player detection (YOLO/RF-DETR) → tracking (ByteTrack/BoT-SORT) → Re-ID (jersey OCR + biometric priors) → event detection → football labels → metric computation → overlay rendering and dashboard indexing.</p>

        {/* My Role */}
        <h4 style={{ color: 'var(--red)', fontFamily: MONO, fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: 16, marginBottom: 8 }}>My Role</h4>
        <p>Designing the full system: phased roadmap, CV pipeline, database schema, dashboard surfaces, coach-correction flywheel, Toledo terminology layer, calibration confidence scoring, self-scout exposure index, pose-lite biomechanics approach, player development profiles, and same-session feedback architecture.</p>

        {/* Stack */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 14, marginBottom: 4 }}>
          {['YOLO','RF-DETR','ByteTrack','BoT-SORT','RTMPose','FastAPI','React','Postgres','pgvector','Cloudflare R2','MLflow','PyTorch','FFmpeg','CUDA'].map(t => <Tag key={t}>{t}</Tag>)}
        </div>

        {/* Key Insight */}
        <h4 style={{ color: 'var(--red)', fontFamily: MONO, fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: 16, marginBottom: 8 }}>Key Insight</h4>
        <p>Correction workflows must be built before advanced models. The coach-correction flywheel — where every corrected label becomes Toledo-specific training data — is the competitive moat. Private, corrected, domain-specific data beats any off-the-shelf model at Toledo football terminology.</p>

        {/* Action button */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 22, paddingTop: 16, borderTop: '1px solid rgba(239,68,68,0.15)' }}>
          <Link href="/case-study/toledo-football-iq-computer-vision-analytics" transitionTypes={['nav-forward']} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '9px 18px', background: 'var(--red)', color: 'var(--background)', fontFamily: MONO, fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', borderRadius: 5, textTransform: 'uppercase', textDecoration: 'none' }}>View Full Case Study ↗</Link>
        </div>
      </>),
    },
  ];
  const { ref, visible } = useReveal();
  return (
    <Section id="projects">
      <SH n="03" label="Bodies of Work" sub="Each project a different operating condition. Click any card for the full case study." color="var(--orange)" />
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
      <SH n="05" label="Research" sub="Published work and ongoing investigations." color="var(--blue)" />
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
              <div style={{ fontFamily: MONO, fontSize: 10, color: FG3, textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: 8 }}>{m.label}</div>
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
      <SH n="07" label="Featured In" sub="Press coverage and public recognition." color="var(--teal)" />
      <div ref={ref} className={`reveal ${visible ? 'in' : ''}`}
        style={{ background: 'rgba(242,237,216,0.025)', border: '1px solid rgba(242,237,216,0.08)', borderRadius: 10, overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 0 }} className="featured-in-grid">
          <div style={{ position: 'relative', overflow: 'hidden', borderRadius: 0, background: '#0d0f1a', width: '100%', height: '100%', minHeight: 220 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/Images/athletics_group_pics.png" alt="UToledo Athletics feature" title="Click to enlarge" onClick={() => openLb('/Images/athletics_group_pics.png', 'UToledo Athletics feature')} style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block', cursor: 'zoom-in' }} />
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
  { label: 'Languages',    color: '#F0B429', skills: ['Python','JavaScript','TypeScript','C++','Java','SQL','HTML/CSS','Embedded C','MATLAB','Simulink','Bash'] },
  { label: 'ML & AI',      color: '#4B7BF5', skills: ['PyTorch','TensorFlow','scikit-learn','RL','MAML','GNNs','GNN/GAT','PPO','Stable-Baselines3','Gym','Meta-Learning','NLP','Computer Vision','DistilBERT','Gemini AI'] },
  { label: 'MLOps & Data', color: '#F07832', skills: ['Airflow','MLflow','Pandas','NumPy','AWS','AWS S3','AWS EC2','Docker','Git','GitHub Actions','CI/CD','Linux','Pandera','Prometheus','Hyperopt','DOMO','Slack API'] },
  { label: 'Robotics',     color: '#A78BFA', skills: ['ROS 2','Gazebo','Gazebo Fortress','ArduPilot','OpenCV','YOLO11','NVIDIA Jetson','Jetson Orin NX','Sensor Fusion','VINS-Mono','HITL','AirSim','OAK-D Pro','SLAMTEC C1','X500 URDF','Q-Prop'] },
  { label: 'Web & Edge',   color: '#0EA5E9', skills: ['React','Node.js','Express','FastAPI','Django','Cloudflare Workers','Hono','Deno','Cloudflare D1','Cloudflare R2','Drizzle ORM','Chrome Extension'] },
  { label: 'Databases',    color: '#2DD4C8', skills: ['PostgreSQL','MySQL','MongoDB','SQLite','PostGIS','pgvector','ETL','pgAdmin 4','Active Directory','Cisco AMP','Microsoft Defender'] },
  { label: 'Microsoft',    color: '#F472B6', skills: ['Azure AI','Copilot Studio','Power Automate','Power BI','M365','SharePoint','Microsoft Defender'] },
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
            onClick={() => setShowAll(true)}
            style={{ fontFamily: MONO, fontSize: 11, padding: '4px 9px', background: `${group.color}0a`, border: `1px solid ${group.color}30`, borderRadius: 4, color: group.color, letterSpacing: '0.03em', cursor: 'pointer', opacity: 0.75 }}
          >+{hidden}</span>
        )}
      </div>
    </div>
  );
}

function SkillChip({ color, children }: { color?: string; children: React.ReactNode }) {
  const c = color ?? (typeof children === 'string' ? pickColor(children) : '#4B7BF5');
  return (
    <span
      style={{ fontFamily: MONO, fontSize: 11, padding: '4px 9px', background: `${c}14`, border: `1px solid ${c}35`, borderRadius: 4, color: `${c}dd`, letterSpacing: '0.02em', cursor: 'default', transition: 'background 0.18s, color 0.18s' }}
      onMouseEnter={e => { e.currentTarget.style.background = `${c}2a`; e.currentTarget.style.color = '#F2EDD8'; }}
      onMouseLeave={e => { e.currentTarget.style.background = `${c}14`; e.currentTarget.style.color = `${c}dd`; }}
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
      <SH n="06" label="Capabilities" sub="Technical stack built across research, industry, and deployment." color="var(--pink)" />
      <div ref={ref} className={`reveal ${visible ? 'in' : ''}`}>
        {/* Skill grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }} className="three-col-skills">
          {skillGroups.map((group) => (
            <SkillGroupCard key={group.label} group={group} />
          ))}
        </div>

        {/* Awards */}
        <div style={{ marginTop: 52 }}>
          <div style={{ fontFamily: MONO, fontSize: 11, color: FG3, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 20 }}>Awards & Recognition</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10, alignItems: 'start' }} className="two-col-awards">
            {awards.map((a, i) => (
              <div key={i}
                onClick={() => setOpenAward(openAward === i ? null : i)}
                style={{ background: openAward === i ? `${a.color}10` : `${a.color}07`, borderTop: `2px solid ${a.color}`, borderRight: `1px solid ${openAward === i ? a.color + '55' : a.color + '25'}`, borderBottom: `1px solid ${openAward === i ? a.color + '55' : a.color + '25'}`, borderLeft: `1px solid ${openAward === i ? a.color + '55' : a.color + '25'}`, borderRadius: 8, cursor: 'pointer', transition: 'all 0.25s', overflow: 'hidden' }}>
                <div style={{ padding: '18px 22px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ fontFamily: SANS, fontSize: 14, fontWeight: 600, color: '#F2EDD8' }}>{a.t}</div>
                    <div style={{ fontSize: 12, color: '#B8B4A4', marginTop: 3 }}>{a.d}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0, marginLeft: 10 }}>
                    <span style={{ fontFamily: MONO, fontSize: 11, color: a.color }}>{a.y}</span>
                    <span style={{ fontSize: 14, color: FG3, transition: 'transform 0.3s', transform: openAward === i ? 'rotate(45deg)' : 'none' }}>+</span>
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
          <div style={{ fontFamily: MONO, fontSize: 11, color: FG3, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 20 }}>Professional Affiliations</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10, alignItems: 'start' }} className="two-col-awards">
            {affiliations.map((a, i) => (
              <div key={i}
                onClick={() => setOpenAffil(openAffil === i ? null : i)}
                style={{ background: openAffil === i ? `${a.color}10` : `${a.color}07`, borderTop: `1px solid ${openAffil === i ? a.color + '55' : a.color + '25'}`, borderRight: `1px solid ${openAffil === i ? a.color + '55' : a.color + '25'}`, borderBottom: `1px solid ${openAffil === i ? a.color + '55' : a.color + '25'}`, borderLeft: `1px solid ${openAffil === i ? a.color + '55' : a.color + '25'}`, borderRadius: 10, cursor: 'pointer', transition: 'all 0.25s', overflow: 'hidden' }}>
                <div style={{ padding: '20px 22px', display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 8, background: `${a.color}15`, border: `1px solid ${a.color}33`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <div style={{ width: 10, height: 10, borderRadius: 2, background: a.color }} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: SANS, fontSize: 14, fontWeight: 600, color: '#F2EDD8', lineHeight: 1.3 }}>{a.n}</div>
                    <div style={{ fontFamily: MONO, fontSize: 10, color: a.color, marginTop: 3 }}>{a.role}</div>
                    <div style={{ fontSize: 12, color: FG3, marginTop: 3, lineHeight: 1.4 }}>{a.short}</div>
                  </div>
                  <span style={{ fontSize: 16, color: FG3, transition: 'transform 0.3s', transform: openAffil === i ? 'rotate(45deg)' : 'none', flexShrink: 0, marginTop: 2 }}>+</span>
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
          <div style={{ fontFamily: MONO, fontSize: 11, color: FG3, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 20 }}>Certifications</div>
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
          <span style={{ fontFamily: MONO, fontSize: 10, color: FG3, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Updated · May 2026</span>
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
                  <div style={{ fontSize: 12, color: FG3, marginTop: 3 }}>{item.sub}</div>
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
  const [emailHovered, setEmailHovered] = useState(false);
  return (
    <Section id="contact" style={{ background: 'rgba(7,9,15,0.97)' }}>
      <style>{`
        @keyframes contact-blink { 0%,100%{opacity:.55}50%{opacity:0} }
        @keyframes contact-pulse { 0%,100%{box-shadow:0 0 0 0 rgba(34,197,94,0.55)}60%{box-shadow:0 0 0 5px rgba(34,197,94,0)} }
        @keyframes contact-scan { 0%{transform:translateY(-100%)}100%{transform:translateY(100vh)} }
        .contact-email-wrap:hover .contact-email-text { color: #38BDF8; }
        .contact-email-wrap:hover { border-color: rgba(14,165,233,0.65); background: rgba(14,165,233,0.10); }
        .contact-channel-row:hover { background: rgba(242,237,216,0.03); }
        .contact-resume-link:hover { color: #B8B4A4; border-bottom-color: rgba(242,237,216,0.2); }
        @media (max-width: 767px) {
          .contact-layout-grid { grid-template-columns: 1fr !important; gap: 32px !important; }
        }
      `}</style>

      {/* Ghost watermark */}
      <div aria-hidden style={{ position: 'absolute', top: -28, right: -4, fontFamily: SERIF, fontSize: 'clamp(110px,17vw,210px)', fontWeight: 400, color: 'var(--sky)', opacity: 0.04, lineHeight: 1, userSelect: 'none', pointerEvents: 'none', letterSpacing: '-0.03em', zIndex: 0 }}>09</div>

      {/* Section header row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, marginBottom: 56, position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ display: 'inline-block', width: 22, height: 1.5, background: 'var(--sky)', opacity: 0.6, flexShrink: 0 }} />
          <span style={{ fontFamily: MONO, fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--sky)' }}>Contact</span>
          <span style={{ fontFamily: MONO, fontSize: 10, color: '#4E4B40', letterSpacing: '0.06em' }}>— Let&apos;s talk about building something real.</span>
        </div>
        {/* Live status badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 14px', border: '1px solid rgba(34,197,94,0.22)', borderRadius: 4, background: 'rgba(34,197,94,0.05)', flexShrink: 0 }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#22C55E', display: 'inline-block', animation: 'contact-pulse 2.4s ease-in-out infinite' }} />
          <span style={{ fontFamily: MONO, fontSize: 9, color: '#22C55E', letterSpacing: '0.12em', textTransform: 'uppercase' }}>Available · Toledo, OH</span>
        </div>
      </div>

      <div ref={ref} className={`reveal ${visible ? 'in' : ''}`} style={{ position: 'relative', zIndex: 1 }}>
        <div className="contact-layout-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: 52, alignItems: 'start' }}>

          {/* ── Left ── */}
          <div>
            <h2 style={{ fontFamily: SERIF, fontSize: 'clamp(28px,4vw,52px)', fontWeight: 400, color: '#F2EDD8', lineHeight: 1.12, marginBottom: 20, maxWidth: 560, paddingBottom: '0.05em' }}>
              Open to roles in AI&nbsp;research, ML&nbsp;engineering, and data&nbsp;science.
            </h2>
            <p style={{ fontFamily: SANS, fontSize: 15, color: FG3, lineHeight: 1.8, marginBottom: 44, maxWidth: 440 }}>
              Whether it&apos;s a full-time opportunity, research collaboration, or just a conversation about autonomous systems — I&apos;m listening.
            </p>

            {/* Email as terminal send-signal element */}
            <a
              href="mailto:firas.azfar@gmail.com"
              className="contact-email-wrap"
              onMouseEnter={() => setEmailHovered(true)}
              onMouseLeave={() => setEmailHovered(false)}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 18,
                padding: '18px 28px',
                background: emailHovered ? 'rgba(14,165,233,0.10)' : 'rgba(14,165,233,0.06)',
                border: `1px solid ${emailHovered ? 'rgba(14,165,233,0.65)' : 'rgba(14,165,233,0.32)'}`,
                borderRadius: 6, textDecoration: 'none',
                marginBottom: 20, position: 'relative', overflow: 'hidden',
                transition: 'background 0.18s, border-color 0.18s',
              }}
            >
              {/* Corner brackets */}
              <span aria-hidden style={{ position: 'absolute', top: 0, left: 0, width: 20, height: 20, borderTop: '2px solid rgba(14,165,233,0.55)', borderLeft: '2px solid rgba(14,165,233,0.55)' }} />
              <span aria-hidden style={{ position: 'absolute', bottom: 0, right: 0, width: 20, height: 20, borderBottom: '2px solid rgba(14,165,233,0.55)', borderRight: '2px solid rgba(14,165,233,0.55)' }} />
              <span style={{ fontFamily: MONO, fontSize: 9, color: 'var(--sky)', opacity: 0.5, textTransform: 'uppercase', letterSpacing: '0.1em', flexShrink: 0 }}>SEND →</span>
              <span className="contact-email-text" style={{ fontFamily: MONO, fontSize: 'clamp(13px,1.5vw,17px)', color: 'var(--sky)', letterSpacing: '0.04em', transition: 'color 0.18s' }}>
                firas.azfar@gmail.com
              </span>
              <span aria-hidden style={{ fontFamily: MONO, fontSize: 15, color: 'var(--sky)', opacity: 0.5, animation: 'contact-blink 1s step-end infinite' }}>▮</span>
            </a>

            <div>
              <a
                href="/docs/Ahmad_Resume_Developer_I_FirstSolar.pdf"
                target="_blank" rel="noopener"
                className="contact-resume-link"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: MONO, fontSize: 10, color: '#4E4B40', letterSpacing: '0.08em', textTransform: 'uppercase', textDecoration: 'none', paddingBottom: 4, borderBottom: '1px solid rgba(242,237,216,0.08)', transition: 'color 0.15s, border-color 0.15s' }}>
                Resume PDF ↓
              </a>
            </div>

            {/* Interest tags */}
            <div style={{ marginTop: 52, paddingTop: 24, borderTop: '1px solid rgba(242,237,216,0.05)', display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
              <span style={{ fontFamily: MONO, fontSize: 9, color: '#3A3830', letterSpacing: '0.1em', textTransform: 'uppercase', marginRight: 4 }}>Open to</span>
              {['AI Research', 'ML Engineering', 'Data Science', 'Robotics & Autonomy', 'Computer Vision', 'Sports Analytics', 'Full-Time Roles', 'Research Collab'].map(t => (
                <span key={t} style={{ fontFamily: MONO, fontSize: 9, padding: '3px 8px', border: '1px solid rgba(242,237,216,0.06)', borderRadius: 3, color: '#3E3B32', letterSpacing: '0.04em', textTransform: 'uppercase', wordBreak: 'break-word' }}>{t}</span>
              ))}
            </div>
          </div>

          {/* ── Right: channel terminal ── */}
          <div style={{ border: '1px solid rgba(242,237,216,0.08)', borderRadius: 10, overflow: 'hidden', background: 'rgba(242,237,216,0.015)' }}>
            {/* Terminal title bar */}
            <div style={{ padding: '14px 22px', background: 'rgba(242,237,216,0.03)', borderBottom: '1px solid rgba(242,237,216,0.06)', display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'rgba(239,68,68,0.45)', display: 'inline-block' }} />
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'rgba(240,180,41,0.45)', display: 'inline-block' }} />
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'rgba(34,197,94,0.45)', display: 'inline-block' }} />
              <span style={{ fontFamily: MONO, fontSize: 10, color: '#4E4B40', letterSpacing: '0.12em', textTransform: 'uppercase', marginLeft: 8 }}>Channels</span>
            </div>
            {/* Channel rows */}
            {[
              { label: 'Email', value: 'firas.azfar@gmail.com', href: 'mailto:firas.azfar@gmail.com', color: '#F0B429', Icon: Mail },
              { label: 'LinkedIn', value: '/in/ahmadfirasazfar', href: 'https://linkedin.com/in/ahmadfirasazfar', color: '#4B7BF5', Icon: LinkedinIcon },
              { label: 'GitHub', value: '/aahmadf123', href: 'https://github.com/aahmadf123', color: '#2DD4C8', Icon: GithubIcon },
              { label: 'Location', value: 'Toledo, OH', href: null, color: '#A78BFA', Icon: MapPin },
              { label: 'Response', value: 'Within 24 hours', href: null, color: '#22C55E', Icon: Clock },
            ].map((c, i) => (
              <div
                key={c.label}
                className="contact-channel-row"
                style={{ padding: '20px 22px', borderBottom: i < 4 ? '1px solid rgba(242,237,216,0.05)' : 'none', transition: 'background 0.15s', display: 'flex', alignItems: 'center', gap: 16 }}
              >
                {/* Icon badge */}
                <div style={{ width: 38, height: 38, borderRadius: 8, background: `${c.color}10`, border: `1px solid ${c.color}28`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <c.Icon size={16} color={c.color} strokeWidth={1.5} />
                </div>
                {/* Label + value */}
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontFamily: MONO, fontSize: 9, color: '#3A3830', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 5 }}>{c.label}</div>
                  {c.href ? (
                    <a href={c.href} target={c.href.startsWith('http') ? '_blank' : undefined} rel={c.href.startsWith('http') ? 'noopener' : undefined} style={{ fontFamily: MONO, fontSize: 13, color: c.color, textDecoration: 'none', wordBreak: 'break-all', letterSpacing: '0.02em' }}>{c.value}</a>
                  ) : (
                    <span style={{ fontFamily: MONO, fontSize: 13, color: c.color }}>{c.value}</span>
                  )}
                </div>
              </div>
            ))}
          </div>

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
          <div aria-hidden style={{ position: 'absolute', top: -32, left: -8, fontFamily: SERIF, fontSize: 'clamp(72px,11vw,160px)', fontWeight: 400, color: '#F0B429', opacity: 0.05, lineHeight: 1, userSelect: 'none', pointerEvents: 'none', letterSpacing: '-0.03em', zIndex: 0 }}>04</div>
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
            <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '64px 0', color: FG3, fontFamily: MONO, fontSize: 12, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
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
          <FieldNotesSection />
          <Research />
          <Skills />
          <FeaturedIn />
          <Now />
          <Contact />
        </main>
        <footer style={{ position: 'relative', zIndex: 20, borderTop: '1px solid rgba(242,237,216,0.06)', padding: '28px 52px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
          <span style={{ fontFamily: MONO, fontSize: 10, color: FG3, letterSpacing: '0.12em', textTransform: 'uppercase' }}>© 2026 Ahmad Firas. All rights reserved.</span>
          <span style={{ fontFamily: MONO, fontSize: 10, color: FG3, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Next.js · TypeScript · Framer Motion</span>
        </footer>
        {lb && <Lightbox src={lb.src} alt={lb.alt} onClose={() => setLb(null)} />}
      </>
    </LightboxCtx.Provider>
  );
}



