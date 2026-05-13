'use client';

import dynamic from 'next/dynamic';
import React, { useRef, useEffect, useState } from 'react';
import { Header } from '@/components/ui/header-2';
import { CinematicFooter } from '@/components/ui/motion-footer';
import { ExpandableCard } from '@/components/ui/expandable-card';
import { AnimatedFeatureSpotlight } from '@/components/ui/feature-spotlight';
import { TestimonialsColumn, type Testimonial } from '@/components/ui/testimonials-columns-1';
import { HoverPeek } from '@/components/ui/link-preview';
import { NeonButton } from '@/components/ui/neon-button';
import { PixelCanvas } from '@/components/ui/pixel-canvas';
import { Cpu, FlaskConical, Drone, ChartBar } from 'lucide-react';
import { motion } from 'framer-motion';

const NebulaCube = dynamic(
  () => import('@/components/ui/explorations-with-gsap-and-scroll-trigger').then(m => ({ default: m.NebulaCube })),
  { ssr: false }
);

// ── Section Header ──
function SH({ n, label, sub = '', color = '#F0B429' }: { n: string; label: string; sub?: string; color?: string }) {
  return (
    <div style={{ position: 'relative', marginBottom: 52, paddingTop: 8 }}>
      <div style={{ position: 'absolute', top: -48, left: -24, fontFamily: "'Fraunces', serif", fontSize: 'clamp(88px,14vw,200px)', fontWeight: 900, fontStyle: 'italic', color, opacity: 0.055, lineHeight: 1, userSelect: 'none', pointerEvents: 'none', letterSpacing: '-0.04em', zIndex: 0 }}>{n}</div>
      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: sub ? 10 : 0 }}>
          <span style={{ display: 'inline-block', width: 22, height: 1.5, background: color, opacity: 0.6, flexShrink: 0 }} />
          <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color }}>{label}</span>
        </div>
        {sub && <p style={{ fontSize: 15, color: '#B8B4A4', maxWidth: 460, lineHeight: 1.65, marginTop: 4 }}>{sub}</p>}
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
  const bg = color === '#F0B429' ? 'rgba(240,180,41,0.08)' : color === '#F07832' ? 'rgba(240,120,50,0.08)' : color === '#A78BFA' ? 'rgba(167,139,250,0.08)' : color === '#F472B6' ? 'rgba(244,114,182,0.08)' : color === '#2DD4C8' ? 'rgba(45,212,200,0.08)' : 'rgba(75,123,245,0.08)';
  return <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, padding: '4px 9px', background: bg, border: `1px solid ${color}22`, borderRadius: 4, color, letterSpacing: '0.03em' }}>{children}</span>;
}

// ── Section wrapper ──
function Section({ id, children, style }: { id?: string; children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <section id={id} style={{ padding: '100px 52px', position: 'relative', overflow: 'hidden', background: 'var(--background)', zIndex: 20, ...style }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        {children}
      </div>
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
      <div ref={ref} className={`reveal ${visible ? 'in' : ''}`} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 72 }}>
        <div>
          <h2 style={{ fontFamily: "'Fraunces', serif", fontStyle: 'italic', fontSize: 28, fontWeight: 700, lineHeight: 1.25, letterSpacing: '-0.02em', color: '#F2EDD8', borderLeft: '3px solid #F0B429', paddingLeft: 18 }}>
            Chasing the gap between what AI can do in a lab and what it actually does when someone&apos;s counting on it.
          </h2>
          <p style={{ fontSize: 16, lineHeight: 1.82, color: '#B8B4A4', marginTop: 24 }}>I&apos;m a Computer Science &amp; Engineering graduate from the University of Toledo. My work has moved across autonomous drone systems, enterprise AI, sports analytics, and data engineering — not because I planned a portfolio, but because I follow whatever problem is genuinely hard.</p>
          <p style={{ fontSize: 16, lineHeight: 1.82, color: '#B8B4A4', marginTop: 16 }}>The common thread: does it hold up when someone is counting on it?</p>
          <div style={{ marginTop: 28, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <HoverPeek url="https://linkedin.com/in/ahmadfiras">
              <a href="https://linkedin.com/in/ahmadfiras" target="_blank" rel="noopener" style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, padding: '10px 20px', border: '1px solid rgba(242,237,216,0.16)', color: '#B8B4A4', borderRadius: 5, textTransform: 'uppercase', letterSpacing: '0.06em' }}>LinkedIn ↗</a>
            </HoverPeek>
            <HoverPeek url="https://github.com/ahmadfirass">
              <a href="https://github.com/ahmadfirass" target="_blank" rel="noopener" style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, padding: '10px 20px', border: '1px solid rgba(242,237,216,0.16)', color: '#B8B4A4', borderRadius: 5, textTransform: 'uppercase', letterSpacing: '0.06em' }}>GitHub ↗</a>
            </HoverPeek>
          </div>
        </div>
        <div>
          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: '#6E6B60', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 20 }}>Three things I believe</div>
          {[
            { n: '01', color: '#F0B429', t: 'Interdisciplinary by instinct', b: "The skill that transfers between fields isn't domain knowledge — it's knowing how to ask the right question when you don't have home-field advantage." },
            { n: '02', color: '#4B7BF5', t: 'Human-in-the-loop by design', b: "A system someone can't override isn't autonomous — it's unpredictable. The recovery mechanism is part of the design, not an afterthought." },
            { n: '03', color: '#F07832', t: 'Deployment from line one', b: "Real edge cases, latency requirements, stakeholders who need to understand the output. That pressure makes the work honest." },
          ].map((item) => (
            <div key={item.n} style={{ padding: '18px 20px', border: `1px solid rgba(242,237,216,0.06)`, borderLeft: `2px solid ${item.color}`, borderRadius: 6, marginBottom: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: item.color, opacity: 0.7 }}>{item.n}</span>
                <span style={{ fontSize: 14, fontWeight: 600, color: '#F2EDD8' }}>{item.t}</span>
              </div>
              <p style={{ fontSize: 14, lineHeight: 1.8, color: '#B8B4A4' }}>{item.b}</p>
            </div>
          ))}
          <div style={{ marginTop: 16, padding: '20px', background: 'rgba(242,237,216,0.025)', borderRadius: 8, border: '1px solid rgba(242,237,216,0.08)' }}>
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: '#A78BFA', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 10 }}>Education</div>
            <div style={{ fontSize: 16, fontWeight: 600, color: '#F2EDD8', fontFamily: "'Fraunces', serif", fontStyle: 'italic' }}>University of Toledo</div>
            <div style={{ fontSize: 14, color: '#B8B4A4', marginTop: 3 }}>B.S. Computer Science &amp; Engineering · Minor in Mathematics</div>
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: '#F0B429', marginTop: 8 }}>2021 – 2026 · Graduated · GPA 3.23</div>
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
    <Section id="experience" style={{ background: '#0f1119' }}>
      <SH n="02" label="Experience" sub="Where the work actually happened." color="#F0B429" />
      <div ref={ref} className={`reveal ${visible ? 'in' : ''}`} style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
        {jobs.map((job, i) => (
          <div key={i} onClick={() => setOpen(open === i ? null : i)}
            style={{ padding: '24px 28px', borderBottom: '1px solid rgba(242,237,216,0.07)', cursor: 'pointer', borderLeft: `2px solid ${open === i ? job.color : 'transparent'}`, background: open === i ? 'rgba(242,237,216,0.025)' : 'transparent', transition: 'all 0.25s', borderRadius: 6, marginBottom: 4 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 8 }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                  {job.active && <span className="pulse" style={{ width: 6, height: 6, borderRadius: '50%', background: job.color, display: 'inline-block', flexShrink: 0 }} />}
                  <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: job.color, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{job.t}</span>
                </div>
                <div style={{ fontSize: 16, fontWeight: 600, color: '#F2EDD8' }}>{job.r}</div>
                <div style={{ fontSize: 14, color: '#B8B4A4', marginTop: 2 }}>{job.co} · {job.loc}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: '#6E6B60', letterSpacing: '0.08em' }}>{job.p}</div>
              </div>
            </div>
            {open === i && (
              <div style={{ marginTop: 16 }}>
                <p style={{ fontSize: 15, lineHeight: 1.75, color: '#B8B4A4', marginBottom: 12 }}>{job.d}</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
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
// PROJECTS
// ─────────────────────────────────────────────
function Projects() {
  const projects = [
    {
      title: 'Deep Flyer UAV Platform',
      src: 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=800&h=600&fit=crop',
      description: 'AI Research · LION Lab',
      detail: (
        <>
          <h4 style={{ color: '#F0B429', fontFamily: "'Space Mono', monospace", fontSize: 12, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>Overview</h4>
          <p>Custom drone training platform enabling zero-shot deployment across novel environments using Model-Agnostic Meta-Learning (MAML). Achieved 72.8% deployment success across 1,000+ simulated environments.</p>
          <h4 style={{ color: '#4B7BF5', fontFamily: "'Space Mono', monospace", fontSize: 12, letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: 16 }}>Key Results</h4>
          <p>97.3% HITL override success rate at sub-100ms latency. Real-time obstacle avoidance via YOLO11 on NVIDIA Jetson hardware. ROS 2 middleware integration for modular autonomy stack.</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 12 }}>
            {['PyTorch', 'ROS 2', 'MAML', 'YOLO11', 'AirSim', 'NVIDIA Jetson'].map(t => <Tag key={t} color="#4B7BF5">{t}</Tag>)}
          </div>
        </>
      )
    },
    {
      title: 'Insurance MLOps Pipeline',
      src: '/Images/SeniorDesign_Pipeline.jpeg',
      description: 'Senior Design · Grange Insurance',
      detail: (
        <>
          <h4 style={{ color: '#A78BFA', fontFamily: "'Space Mono', monospace", fontSize: 12, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>Overview</h4>
          <p>End-to-end MLOps pipeline for insurance risk scoring with XGBoost ensemble model achieving R² = 0.976. Deployed with Apache Airflow orchestration, MLflow experiment tracking, and real-time drift monitoring.</p>
          <h4 style={{ color: '#A78BFA', fontFamily: "'Space Mono', monospace", fontSize: 12, letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: 16 }}>Impact</h4>
          <p>75% reduction in manual underwriting review. Human-in-the-loop gates with automated flagging and Bayesian hyperparameter optimization across 40+ features.</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 12 }}>
            {['XGBoost', 'Apache Airflow', 'MLflow', 'AWS S3', 'Bayesian Optimization'].map(t => <Tag key={t} color="#A78BFA">{t}</Tag>)}
          </div>
        </>
      )
    },
    {
      title: 'Sports Analytics Engine',
      src: '/Images/athletics_group_pics.png',
      description: 'Data Science · UToledo Athletics',
      detail: (
        <>
          <h4 style={{ color: '#2DD4C8', fontFamily: "'Space Mono', monospace", fontSize: 12, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>Overview</h4>
          <p>ML-powered statistical models for roster efficiency analysis and student-athlete benefit allocation at the University of Toledo Athletics department.</p>
          <h4 style={{ color: '#2DD4C8', fontFamily: "'Space Mono', monospace", fontSize: 12, letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: 16 }}>Deliverables</h4>
          <p>Interactive DOMO dashboards enabling coaching staff to extract actionable insights. Statistical modeling frameworks for performance prediction and roster optimization.</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 12 }}>
            {['Python', 'scikit-learn', 'DOMO', 'Statistical Modeling', 'Data Visualization'].map(t => <Tag key={t} color="#2DD4C8">{t}</Tag>)}
          </div>
        </>
      )
    },
    {
      title: 'DeepTruth',
      src: '/Images/DeepTruth_Group.png',
      description: 'AI · Fact-Checking System',
      detail: (
        <>
          <h4 style={{ color: '#F07832', fontFamily: "'Space Mono', monospace", fontSize: 12, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>Overview</h4>
          <p>AI-powered misinformation detection and fact-checking system leveraging large language models and retrieval-augmented generation for real-time claim verification.</p>
          <h4 style={{ color: '#F07832', fontFamily: "'Space Mono', monospace", fontSize: 12, letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: 16 }}>Architecture</h4>
          <p>RAG pipeline with vector similarity search, multi-source fact retrieval, and confidence scoring. Designed for integration into social media pipelines and news aggregators.</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 12 }}>
            {['LLM', 'RAG', 'Vector DB', 'Python', 'NLP'].map(t => <Tag key={t} color="#F07832">{t}</Tag>)}
          </div>
        </>
      )
    },
  ];
  const { ref, visible } = useReveal();
  return (
    <Section id="projects">
      <SH n="03" label="Work" sub="Selected projects across research, industry, and personal exploration." color="#F0B429" />
      <div ref={ref} className={`reveal ${visible ? 'in' : ''}`} style={{ display: 'flex', flexWrap: 'wrap', gap: 24, justifyContent: 'center' }}>
        {projects.map((p) => (
          <ExpandableCard key={p.title} title={p.title} src={p.src} description={p.description}
            classNameExpanded="[&_h4]:text-white [&_h4]:font-medium dark:[&_h4]:text-white">
            {p.detail}
          </ExpandableCard>
        ))}
      </div>
    </Section>
  );
}

// ─────────────────────────────────────────────
// RESEARCH
// ─────────────────────────────────────────────
function Research() {
  const { ref, visible } = useReveal();
  return (
    <Section id="research" style={{ background: '#0f1119' }}>
      <SH n="04" label="Research" sub="Published work and ongoing investigations." color="#4B7BF5" />
      <div ref={ref} className={`reveal ${visible ? 'in' : ''}`}>
        <AnimatedFeatureSpotlight
          preheaderIcon={<FlaskConical className="h-4 w-4" />}
          preheaderText="ACM Computing Surveys · 2025"
          heading={<><span style={{ color: '#4B7BF5' }}>AI Failure</span> Taxonomy for<br />Autonomous Systems</>}
          description="A comprehensive survey and novel taxonomy of AI system failures in safety-critical autonomous environments. Developed from real-world UAV deployment data across 1,000+ simulated scenarios, with focus on HITL recovery mechanisms and zero-shot generalization."
          buttonText="View Research"
          buttonProps={{ onClick: () => window.open('/docs/Manuscript.pdf', '_blank'), style: { background: '#4B7BF5', color: '#fff', border: 'none' } }}
          imageUrl="https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&h=600&fit=crop"
          imageAlt="AI research visualization"
          style={{ border: '1px solid rgba(75,123,245,0.2)', background: 'rgba(11,13,20,0.8)' }}
        />
        <div style={{ marginTop: 40, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
          {[
            { metric: '72.8%', label: 'Zero-shot deployment rate', color: '#4B7BF5' },
            { metric: '97.3%', label: 'HITL override success', color: '#2DD4C8' },
            { metric: '<100ms', label: 'Real-time response latency', color: '#F0B429' },
            { metric: '1,000+', label: 'Simulated environments tested', color: '#A78BFA' },
          ].map((m) => (
            <div key={m.label} style={{ padding: '24px', background: 'rgba(242,237,216,0.025)', border: `1px solid ${m.color}22`, borderRadius: 8, borderLeft: `2px solid ${m.color}` }}>
              <div style={{ fontFamily: "'Fraunces', serif", fontStyle: 'italic', fontSize: 32, fontWeight: 700, color: '#F2EDD8', lineHeight: 1 }}>{m.metric}</div>
              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: '#6E6B60', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: 6 }}>{m.label}</div>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}

// ─────────────────────────────────────────────
// SKILLS
// ─────────────────────────────────────────────
const skillGroups = [
  { label: 'AI / ML', color: '#4B7BF5', skills: ['PyTorch', 'TensorFlow', 'scikit-learn', 'MAML', 'YOLO11', 'Transformers', 'RAG', 'LangChain'] },
  { label: 'Agentic / Cloud', color: '#F0B429', skills: ['Copilot Studio', 'Azure AI', 'Power Automate', 'M365', 'AWS S3', 'MLflow', 'Airflow'] },
  { label: 'Robotics / Systems', color: '#2DD4C8', skills: ['ROS 2', 'AirSim', 'NVIDIA Jetson', 'Computer Vision', 'Embedded C', 'HITL Systems'] },
  { label: 'Data Engineering', color: '#A78BFA', skills: ['Python', 'PostgreSQL', 'DOMO', 'Pandas', 'NumPy', 'Statistical Modeling', 'pgAdmin'] },
];

function Skills() {
  const { ref, visible } = useReveal();
  return (
    <Section id="skills">
      <SH n="05" label="Capabilities" sub="Technical stack built across research, industry, and deployment." color="#F0B429" />
      <div ref={ref} className={`reveal ${visible ? 'in' : ''}`} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
        {skillGroups.map((group) => (
          <div key={group.label} style={{ padding: '24px', background: 'rgba(242,237,216,0.025)', border: '1px solid rgba(242,237,216,0.07)', borderRadius: 12 }}>
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: group.color, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 16 }}>{group.label}</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {group.skills.map((skill) => (
                <button key={skill}
                  className="group relative overflow-hidden border border-border rounded-[32px] transition-colors duration-200 hover:border-[var(--active-color)] focus:outline-none px-3 py-1.5"
                  style={{ '--active-color': group.color, fontFamily: "'Space Mono', monospace", fontSize: 11, color: '#B8B4A4', background: 'transparent', cursor: 'default' } as React.CSSProperties}
                >
                  <PixelCanvas gap={4} speed={25} colors={[group.color + '44', group.color + '88', group.color]} variant="default" />
                  <span style={{ position: 'relative', zIndex: 1 }}>{skill}</span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}

// ─────────────────────────────────────────────
// ACHIEVEMENTS (TestimonialsColumn repurposed)
// ─────────────────────────────────────────────
const achievementsCol1: Testimonial[] = [
  { text: '72.8% zero-shot UAV deployment success across 1,000+ novel simulated environments via MAML meta-learning.', image: 'https://randomuser.me/api/portraits/men/1.jpg', name: 'LION Lab', role: 'Research Result · 2025' },
  { text: 'R² = 0.976 insurance risk model with 75% reduction in manual underwriting review. Deployed in production.', image: 'https://randomuser.me/api/portraits/men/2.jpg', name: 'Grange Insurance', role: 'Senior Design · 2025' },
  { text: 'ACM Computing Surveys paper authored on AI failure taxonomy for safety-critical autonomous systems.', image: 'https://randomuser.me/api/portraits/men/3.jpg', name: 'ACM Publication', role: 'Academic · 2025' },
];
const achievementsCol2: Testimonial[] = [
  { text: '97.3% HITL override success rate at sub-100ms latency for real-time UAV safety intervention.', image: 'https://randomuser.me/api/portraits/women/1.jpg', name: 'CPHS Lab', role: 'Safety Research · 2025' },
  { text: 'Enterprise agentic AI in Microsoft Copilot Studio — multi-step autonomous workflows for First Solar operations.', image: 'https://randomuser.me/api/portraits/women/2.jpg', name: 'First Solar', role: 'Industry · 2026' },
  { text: 'PostgreSQL security consolidation: 15% faster incident response, zero data loss across quarterly DR tests.', image: 'https://randomuser.me/api/portraits/women/3.jpg', name: 'Park Place Technologies', role: 'Engineering · 2023' },
];
const achievementsCol3: Testimonial[] = [
  { text: 'Deep Flyer platform: custom drone simulation and training infrastructure for meta-learning research.', image: 'https://randomuser.me/api/portraits/men/4.jpg', name: 'Deep Flyer', role: 'Open Research Platform' },
  { text: 'ML statistical models and DOMO dashboards for roster efficiency at UToledo Athletics department.', image: 'https://randomuser.me/api/portraits/women/4.jpg', name: 'UToledo Athletics', role: 'Data Science · 2025–Present' },
  { text: 'GPA 3.23 · B.S. Computer Science & Engineering · Minor Mathematics · University of Toledo 2026.', image: 'https://randomuser.me/api/portraits/men/5.jpg', name: 'University of Toledo', role: 'B.S. CSE · Class of 2026' },
];

function Achievements() {
  const { ref, visible } = useReveal();
  return (
    <Section style={{ background: '#0f1119' }}>
      <SH n="06" label="Highlights" sub="Key results and milestones." color="#2DD4C8" />
      <div ref={ref} className={`reveal ${visible ? 'in' : ''}`}>
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }} viewport={{ once: true }} className="flex flex-col items-center justify-center max-w-[540px] mx-auto mb-10">
          <p className="text-center opacity-75" style={{ color: '#B8B4A4' }}>Selected achievements from research, industry, and academic work.</p>
        </motion.div>
        <div className="flex justify-center gap-6 [mask-image:linear-gradient(to_bottom,transparent,black_25%,black_75%,transparent)] max-h-[740px] overflow-hidden">
          <TestimonialsColumn testimonials={achievementsCol1} duration={18} />
          <TestimonialsColumn testimonials={achievementsCol2} className="hidden md:block" duration={22} />
          <TestimonialsColumn testimonials={achievementsCol3} className="hidden lg:block" duration={20} />
        </div>
      </div>
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
      <div ref={ref} className={`reveal ${visible ? 'in' : ''}`} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 72, alignItems: 'center' }}>
        <div>
          <h2 style={{ fontFamily: "'Fraunces', serif", fontStyle: 'italic', fontSize: 36, fontWeight: 700, lineHeight: 1.2, letterSpacing: '-0.02em', color: '#F2EDD8', marginBottom: 20 }}>
            Open to roles in AI research, ML engineering, and data science.
          </h2>
          <p style={{ fontSize: 16, lineHeight: 1.82, color: '#B8B4A4', marginBottom: 28 }}>
            Whether it&apos;s a full-time opportunity, research collaboration, or just a conversation about autonomous systems — I&apos;m listening.
          </p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <a href="mailto:firas.azfar@gmail.com">
              <NeonButton style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, padding: '12px 24px', letterSpacing: '0.06em', background: '#F0B429', color: '#0B0D14', border: 'none', borderRadius: 5, textTransform: 'uppercase' }}>
                firas.azfar@gmail.com
              </NeonButton>
            </a>
            <a href="/docs/Ahmad_Resume_Developer_I_FirstSolar.pdf" target="_blank" rel="noopener">
              <NeonButton variant="ghost" style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, padding: '12px 24px', letterSpacing: '0.06em', border: '1px solid rgba(242,237,216,0.16)', color: '#B8B4A4', borderRadius: 5, textTransform: 'uppercase' }}>
                Resume ↓
              </NeonButton>
            </a>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {[
            { label: 'Email', value: 'firas.azfar@gmail.com', href: 'mailto:firas.azfar@gmail.com', color: '#F0B429' },
            { label: 'LinkedIn', value: '/in/ahmadfiras', href: 'https://linkedin.com/in/ahmadfiras', color: '#4B7BF5' },
            { label: 'GitHub', value: '/ahmadfirass', href: 'https://github.com/ahmadfirass', color: '#2DD4C8' },
            { label: 'Location', value: 'Toledo, OH', href: null, color: '#A78BFA' },
          ].map((c) => (
            <div key={c.label} style={{ padding: '20px', background: 'rgba(242,237,216,0.025)', border: '1px solid rgba(242,237,216,0.07)', borderRadius: 8, borderLeft: `2px solid ${c.color}` }}>
              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: c.color, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 6 }}>{c.label}</div>
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
      <main style={{ position: 'relative', zIndex: 20 }}>
        <About />
        <Experience />
        <Projects />
        <Research />
        <Skills />
        <Achievements />
        <Contact />
      </main>
      <div style={{ position: 'relative', zIndex: 20 }}>
        <CinematicFooter />
      </div>
    </>
  );
}
