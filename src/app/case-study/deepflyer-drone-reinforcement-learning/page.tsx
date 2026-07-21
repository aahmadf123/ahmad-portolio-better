'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Lightbox } from '@/components/ui/image-lightbox';
import { Pic } from '@/components/ui/pic';
import { resolveSkillColor } from '@/lib/skill-colors';

const SERIF  = "var(--font-chakra), 'Chakra Petch', sans-serif";
const MONO   = "var(--font-chakra), 'Chakra Petch', monospace";
const ACCENT = '#4B7BF5';

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

function StackRow({ n, title, items, color = ACCENT }: { n: string; title: string; items: string[]; color?: string }) {
  return (
    <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start', padding: '14px 18px', background: `${color}06`, border: `1px solid ${color}18`, borderRadius: 8 }}>
      <div style={{ fontFamily: MONO, fontSize: 10, color, opacity: 0.6, flexShrink: 0, minWidth: 22, marginTop: 1 }}>{n}</div>
      <div style={{ flex: 1 }}>
        <div style={{ fontFamily: MONO, fontSize: 11, color, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6 }}>{title}</div>
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
  return <section id={id} style={{ paddingBottom: 72 }}>{children}</section>;
}

function useActiveSection(ids: string[]) {
  const [active, setActive] = useState(ids[0]);
  useEffect(() => {
    const obs = new IntersectionObserver(
      entries => { entries.forEach(e => { if (e.isIntersecting) setActive(e.target.id); }); },
      { rootMargin: '-40% 0px -50% 0px' }
    );
    ids.forEach(id => { const el = document.getElementById(id); if (el) obs.observe(el); });
    return () => obs.disconnect();
  }, [ids]);
  return active;
}

const SECTION_IDS    = ['overview', 'problem', 'platform', 'reward-design', 'stack', 'results', 'lessons', 'future'];
const SECTION_LABELS = ['Overview', 'Problem', 'Platform', 'Reward Design', 'Stack', 'Results', 'Lessons', 'Future'];

export default function DeepFlyerCaseStudy() {
  const active = useActiveSection(SECTION_IDS);
  const [scrolled, setScrolled] = useState(false);
  const [lb, setLb] = useState<string | null>(null);
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
        <span style={{ fontFamily: MONO, fontSize: 10, padding: '6px 14px', background: `${ACCENT}15`, border: `1px solid ${ACCENT}35`, borderRadius: 4, color: ACCENT, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Prototype · Research Platform</span>
      </header>

      {/* ── Hero ── */}
      <div style={{ padding: 'clamp(48px,7vw,96px) clamp(20px,4vw,52px) 0', maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
          <span style={{ fontFamily: MONO, fontSize: 10, padding: '4px 10px', background: `${ACCENT}15`, border: `1px solid ${ACCENT}35`, borderRadius: 3, color: ACCENT, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Educational AI / Robotics</span>
          <span style={{ fontFamily: MONO, fontSize: 10, padding: '4px 10px', background: 'rgba(242,237,216,0.04)', border: '1px solid rgba(242,237,216,0.1)', borderRadius: 3, color: '#B8B4A4', letterSpacing: '0.05em', textTransform: 'uppercase' }}>LION Lab · University of Toledo</span>
          <span style={{ fontFamily: MONO, fontSize: 10, padding: '4px 10px', background: 'rgba(242,237,216,0.04)', border: '1px solid rgba(242,237,216,0.1)', borderRadius: 3, color: '#B8B4A4', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Team: Uma · Jay · Ahmad</span>
        </div>

        {/* Hero image */}
        <div style={{ width: '100%', borderRadius: 12, overflow: 'hidden', border: `1px solid ${ACCENT}22`, marginBottom: 36, background: '#06080E' }}>
          <Pic
            src="/Images/DeepFlyer_pics.png"
            alt="DeepFlyer platform dashboard — drone, reward editor, hoop navigation course, and edge hardware overview"
            onClick={() => setLb('/Images/DeepFlyer_pics.png')}
            style={{ width: '100%', height: 'auto', display: 'block', cursor: 'zoom-in' }}
            priority
          />
        </div>

        <h1 style={{ fontFamily: SERIF, fontWeight: 400, fontSize: 'clamp(32px,5vw,60px)', lineHeight: 1.05, letterSpacing: '-0.025em', color: '#F2EDD8', marginBottom: 18, paddingBottom: '0.06em' }}>
          DeepFlyer:<br />
          <span style={{ color: ACCENT }}>3D DeepRacer</span> for Drone RL
        </h1>
        <p style={{ fontSize: 17, lineHeight: 1.75, color: '#B8B4A4', maxWidth: 680, marginBottom: 36 }}>
          An educational drone reinforcement learning platform that teaches students RL through reward-function editing, PPO agent training, and autonomous drone simulation — no deep AI background required.
        </p>

        {/* Metrics */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 36 }} className="metrics-grid-df">
          <Metric value="80%" label="PPO success rate within 100 steps" />
          <Metric value="1M" label="PPO training steps completed" />
          <Metric value="<1s" label="Gazebo cold simulation startup" />
          <Metric value="10ms" label="Reward API median latency" />
          <Metric value="<5%" label="Collision-detection false-positive rate" />
          <Metric value="40%" label="X500 URDF mesh optimization" />
        </div>

        {/* CTA */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, paddingBottom: 'clamp(48px,6vw,72px)', borderBottom: '1px solid rgba(242,237,216,0.07)' }}>
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
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, alignItems: 'start' }} className="two-col-df">
            <div>
              <p style={{ fontSize: 15, lineHeight: 1.85, color: '#B8B4A4', marginBottom: 16 }}>
                DeepFlyer reimagines AWS DeepRacer for drone autonomy. Instead of racing an RC car around a flat 2D track, students train a drone in simulation to fly through hoops, avoid obstacles, and navigate a 3D course — all by modifying reward functions in a browser-based editor.
              </p>
              <p style={{ fontSize: 15, lineHeight: 1.85, color: '#B8B4A4', marginBottom: 16 }}>
                The platform reframes reinforcement learning as something physical and visual. If the reward function is poorly shaped, the drone behaves poorly. If it&apos;s better designed, the drone becomes safer, smoother, and more efficient. Students can see that relationship directly — no lectures about abstract RL theory required.
              </p>
              <p style={{ fontSize: 15, lineHeight: 1.85, color: '#B8B4A4' }}>
                The early prototype established the simulation stack, drone model, React reward editor, backend API, dynamic reward switching, and initial PPO training results. Future milestones target SLAM, event cameras, XAI overlays, and sim-to-real deployment.
              </p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { l: 'Platform', v: 'DeepFlyer — Educational Drone RL' },
                { l: 'Inspired By', v: 'AWS DeepRacer (2D car → 3D drone)' },
                { l: 'Lab', v: 'LION Lab, University of Toledo' },
                { l: 'Team', v: 'Uma (simulation/CAD) · Jay (UI/integration) · Ahmad (RL/AI)' },
                { l: 'Status', v: 'Prototype — Weeks 1–3 complete' },
                { l: 'Hardware Target', v: 'Holybro S500 · Pixhawk 6C · ZED Mini' },
              ].map(({ l, v }) => (
                <div key={l} style={{ display: 'flex', gap: 12, padding: '10px 0', borderBottom: '1px solid rgba(242,237,216,0.06)' }}>
                  <span style={{ fontFamily: MONO, fontSize: 10, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.08em', flexShrink: 0, minWidth: 90 }}>{l}</span>
                  <span style={{ fontSize: 13, color: '#B8B4A4' }}>{v}</span>
                </div>
              ))}
              <div style={{ marginTop: 14, padding: '18px', background: `${ACCENT}08`, border: `1px solid ${ACCENT}20`, borderRadius: 8 }}>
                <div style={{ fontFamily: MONO, fontSize: 10, color: ACCENT, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>Core Thesis</div>
                <p style={{ fontSize: 14, lineHeight: 1.7, color: '#F2EDD8', fontStyle: 'italic' }}>
                  &ldquo;Reward functions are not just math. They encode behavior. The best way to teach that is to let students see a drone learn — and fail — in real time.&rdquo;
                </p>
              </div>
            </div>
          </div>
        </Section>

        {/* ─ Problem ─ */}
        <Section id="problem">
          <SectionLabel>Problem</SectionLabel>
          <h2 style={{ fontFamily: SERIF, fontSize: 'clamp(22px,3vw,32px)', fontWeight: 400, color: '#F2EDD8', marginBottom: 16, lineHeight: 1.2, paddingBottom: '0.06em' }}>
            Reinforcement learning is powerful, but it&apos;s difficult to teach.
          </h2>
          <p style={{ fontSize: 15, lineHeight: 1.85, color: '#B8B4A4', maxWidth: 720, marginBottom: 28 }}>
            The core concepts are abstract. Students tune parameters, watch plots, and read reward curves — but rarely develop the physical intuition for why reward design matters.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 28 }} className="three-col-df">
            {[
              { t: 'Abstract Objectives', d: 'Students are taught that the reward function drives behavior, but never experience the consequences of a bad reward directly.' },
              { t: 'No Physical Feedback', d: 'RL assignments produce plots and numbers. They don\'t produce a drone that crashes because the penalty for going off-course was too low.' },
              { t: 'Reward Exploitation', d: 'Without a physical system to anchor understanding, reward hacking is a concept. With a drone, it\'s immediately obvious.' },
              { t: 'Sim-to-Real Gap', d: 'Why does a policy that scores 99% in simulation fail on hardware? The abstraction of code-only experiments never makes this tangible.' },
              { t: 'Safety Constraints', d: 'Safety boundaries and emergency stops are afterthoughts in most RL coursework. In real robotics, they are foundational design decisions.' },
              { t: 'AWS DeepRacer Ceiling', d: 'DeepRacer is excellent for 2D car navigation but limited in scope. Drone autonomy requires 3D reasoning, altitude control, and richer state representations.' },
            ].map(({ t, d }) => (
              <div key={t} style={{ padding: '16px 18px', background: 'rgba(242,237,216,0.02)', border: '1px solid rgba(242,237,216,0.07)', borderLeft: `2px solid ${ACCENT}50`, borderRadius: 8 }}>
                <div style={{ fontFamily: MONO, fontSize: 11, color: '#F2EDD8', letterSpacing: '0.04em', marginBottom: 8 }}>{t}</div>
                <p style={{ fontSize: 13, lineHeight: 1.7, color: 'var(--text3)' }}>{d}</p>
              </div>
            ))}
          </div>

          {/* DeepRacer vs DeepFlyer comparison */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }} className="two-col-df">
            <div style={{ padding: '20px 22px', background: 'rgba(242,237,216,0.025)', border: '1px solid rgba(242,237,216,0.08)', borderRadius: 8 }}>
              <div style={{ fontFamily: MONO, fontSize: 10, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>AWS DeepRacer</div>
              {['2D track navigation', 'RC car (ground vehicle)', 'Fixed action space', '2D obstacle avoidance', 'Cloud training only', 'Pre-built course only'].map(p => (
                <div key={p} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, fontSize: 13, color: 'var(--text3)' }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'rgba(242,237,216,0.2)', flexShrink: 0, display: 'inline-block' }} />{p}
                </div>
              ))}
            </div>
            <div style={{ padding: '20px 22px', background: `${ACCENT}06`, border: `1px solid ${ACCENT}22`, borderRadius: 8 }}>
              <div style={{ fontFamily: MONO, fontSize: 10, color: ACCENT, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>DeepFlyer</div>
              {['3D hoop & obstacle navigation', 'Quadcopter drone (aerial)', '3D continuous action space', 'Altitude, yaw, speed, alignment', 'Edge + local inference', 'Configurable course layouts'].map(p => (
                <div key={p} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, fontSize: 13, color: '#B8B4A4' }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: ACCENT, flexShrink: 0, display: 'inline-block' }} />{p}
                </div>
              ))}
            </div>
          </div>
        </Section>

        {/* ─ Platform ─ */}
        <Section id="platform">
          <SectionLabel>Platform Architecture</SectionLabel>
          <h2 style={{ fontFamily: SERIF, fontSize: 'clamp(22px,3vw,32px)', fontWeight: 400, color: '#F2EDD8', marginBottom: 16, lineHeight: 1.2, paddingBottom: '0.06em' }}>
            A full-stack learning loop from browser to simulation to hardware.
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 32 }}>
            <StackRow n="01" title="Student UI" items={['React 18 Reward Editor', 'Mission Selector', 'Training Dashboard', 'Reward Preset Library', 'Future: Leaderboard / Telemetry']} />
            <StackRow n="02" title="Backend API" items={['Node.js + Express', 'MongoDB', 'JWT Authentication', 'Reward Preset Endpoints', 'Session & Log Storage', '10ms median / 20ms P95 latency']} color="#2DD4C8" />
            <StackRow n="03" title="RL Training Layer" items={['OpenAI Gym Environment', 'Stable-Baselines3', 'PPO Algorithm', 'YAML Reward-Interface Schema', 'Dynamic Reward Switching', 'MLflow Experiment Logging']} />
            <StackRow n="04" title="Simulation Layer" items={['ROS 2 Humble', 'Gazebo Fortress', 'X500 URDF (visual + collision + inertial)', 'Gazebo Contact Sensors', 'Future: SLAM / Event-Camera Plugins']} color="#A78BFA" />
            <StackRow n="05" title="Drone Control (Future)" items={['ROS 2 Bridge', 'MAVROS', 'Pixhawk 6C Flight Controller', 'Safety Boundaries', 'Emergency Stop Protocol']} color="#F07832" />
            <StackRow n="06" title="Physical Hardware (Planned)" items={['Holybro S500 Frame', 'Pixhawk 6C', 'Raspberry Pi 4B Companion', 'ZED Mini Stereo Camera', 'Safety Netting + Propeller Guards', 'Instructor Kill Switch']} color="#F0B429" />
          </div>

          {/* Course design */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }} className="two-col-df">
            <div style={{ padding: '20px 22px', background: `${ACCENT}06`, border: `1px solid ${ACCENT}22`, borderRadius: 8 }}>
              <div style={{ fontFamily: MONO, fontSize: 10, color: ACCENT, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>Course Type A — Hoop Navigation</div>
              <p style={{ fontSize: 13, lineHeight: 1.7, color: '#B8B4A4', marginBottom: 10 }}>A fixed 4–5 hoop circuit with multiple laps at ~0.8 m altitude. Visual targets provide immediate student feedback. Best for public demos and intuitive reward-behavior observation.</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                {['5 Hoops', 'Multi-lap', '0.8m altitude', 'Visual targets', 'Demo-friendly'].map(t => <Tag key={t}>{t}</Tag>)}
              </div>
            </div>
            <div style={{ padding: '20px 22px', background: 'rgba(242,237,216,0.025)', border: '1px solid rgba(242,237,216,0.08)', borderRadius: 8 }}>
              <div style={{ fontFamily: MONO, fontSize: 10, color: '#B8B4A4', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>Course Type B — Obstacle Course</div>
              <p style={{ fontSize: 13, lineHeight: 1.7, color: '#B8B4A4', marginBottom: 10 }}>A straight path from start to finish with static obstacles requiring lateral maneuvering. Fixed altitude. Easier to compare across reward functions. Best for controlled benchmarking.</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                {['Static obstacles', 'Lateral maneuver', 'Fixed altitude', 'Benchmark-friendly', 'Used in Week 3'].map(t => <Tag key={t} color="var(--text3)">{t}</Tag>)}
              </div>
            </div>
          </div>
        </Section>

        {/* ─ Reward Design ─ */}
        <Section id="reward-design">
          <SectionLabel>Reward Design</SectionLabel>
          <h2 style={{ fontFamily: SERIF, fontSize: 'clamp(22px,3vw,32px)', fontWeight: 400, color: '#F2EDD8', marginBottom: 16, lineHeight: 1.2, paddingBottom: '0.06em' }}>
            The reward function is the educational core of DeepFlyer.
          </h2>
          <p style={{ fontSize: 15, lineHeight: 1.85, color: '#B8B4A4', maxWidth: 720, marginBottom: 28 }}>
            Students don&apos;t write RL training code. They modify reward weights through the editor and observe how incentive changes produce different drone behaviors.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 28 }} className="three-col-df">
            {[
              { term: 'Hoop Passage Reward', effect: 'Higher values make the drone prioritize passing through hoops aggressively, potentially sacrificing smoothness.' },
              { term: 'Center Alignment Bonus', effect: 'Rewards cleaner hoop passage. Students observe the drone gradually centering its approach path over training.' },
              { term: 'Speed Efficiency Bonus', effect: 'Can produce faster flight but less precise hoop targeting. Classic exploration vs. exploitation tradeoff.' },
              { term: 'Collision Penalty', effect: 'Increasing this makes the policy more conservative — students directly observe the agent "choosing" to avoid obstacles.' },
              { term: 'Smooth Flight Bonus', effect: 'Reduces jerk in motor commands. Students notice the drone trajectory becoming more continuous over episodes.' },
              { term: 'Boundary Violation Penalty', effect: 'Hard constraint on staying within the safety zone. Essential for real-hardware deployment with safety netting.' },
            ].map(({ term, effect }) => (
              <div key={term} style={{ padding: '16px 18px', background: `${ACCENT}06`, border: `1px solid ${ACCENT}18`, borderRadius: 8 }}>
                <div style={{ fontFamily: MONO, fontSize: 11, color: ACCENT, letterSpacing: '0.04em', marginBottom: 8 }}>{term}</div>
                <p style={{ fontSize: 12, lineHeight: 1.65, color: '#B8B4A4' }}>{effect}</p>
              </div>
            ))}
          </div>
          <div style={{ padding: '22px 26px', background: `linear-gradient(180deg, ${ACCENT}0d, ${ACCENT}04)`, border: `1px solid ${ACCENT}35`, boxShadow: `0 4px 20px ${ACCENT}05`, borderRadius: 10 }}>
            <div style={{ fontFamily: MONO, fontSize: 10, color: ACCENT, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 }}>12-Dimensional Observation Space</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {['Direction to target hoop', 'Relative altitude error', 'Forward velocity', 'Lateral velocity', 'Distance to target', 'Velocity alignment', 'Hoop alignment (camera)', 'Vision hoop distance', 'Hoop visibility', 'Course progress', 'Lap progress', 'Safety zone proximity'].map(obs => (
                <span key={obs} style={{ fontFamily: MONO, fontSize: 10, padding: '4px 9px', background: 'rgba(242,237,216,0.04)', border: '1px solid rgba(242,237,216,0.1)', borderRadius: 4, color: '#B8B4A4' }}>{obs}</span>
              ))}
            </div>
            <p style={{ fontSize: 13, lineHeight: 1.7, color: 'var(--text3)', marginTop: 12 }}>
              The observation space teaches students that RL agents don&apos;t learn from magic — they learn from state representations. Better observations consistently produce better policies.
            </p>
          </div>
        </Section>

        {/* ─ Stack ─ */}
        <Section id="stack">
          <SectionLabel>Technical Stack</SectionLabel>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }} className="two-col-df">
            {[
              { label: 'Frontend', color: ACCENT, tags: ['React 18', 'Node.js v18', 'ESLint', 'Prettier', 'Figma (user flows)'] },
              { label: 'Backend', color: '#2DD4C8', tags: ['Node.js', 'Express', 'MongoDB', 'JWT Auth', 'Reward API Endpoints', 'Session / Log Storage'] },
              { label: 'RL & Experiment Tracking', color: '#A78BFA', tags: ['OpenAI Gym', 'Stable-Baselines3', 'PPO', 'YAML Reward Schema', 'MLflow', 'Dynamic Reward Switching'] },
              { label: 'Simulation & Robotics', color: '#F0B429', tags: ['ROS 2 Humble', 'Gazebo Fortress', 'X500 URDF', 'Gazebo Contact Sensors', 'MAVROS (planned)', 'Future: SLAM / Event-Camera'] },
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
          <SectionLabel>Prototype Results</SectionLabel>
          <h2 style={{ fontFamily: SERIF, fontSize: 'clamp(22px,3vw,32px)', fontWeight: 400, color: '#F2EDD8', marginBottom: 16, lineHeight: 1.2, paddingBottom: '0.06em' }}>
            Weeks 1–3 validated the full learning loop.
          </h2>
          <p style={{ fontSize: 15, lineHeight: 1.85, color: '#B8B4A4', maxWidth: 720, marginBottom: 28 }}>
            Progress spanned simulation infrastructure, drone model, backend, frontend, RL training, and experiment tracking — all in three weeks.
          </p>

          {/* Week-by-week */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 28 }}>
            {[
              {
                week: 'Week 1', color: 'var(--text3)',
                items: ['ROS 2 Humble + Gazebo Fortress installed and configured', 'Simulation startup performance validated', 'React frontend repo initialized with ESLint/Prettier', 'Gym + Stable-Baselines3 Docker environment', 'YAML reward-interface schema defined', 'CI builds passing'],
              },
              {
                week: 'Week 2', color: ACCENT,
                items: ['X500 URDF built with visual, collision, and inertial components', '40% mesh optimization achieved', 'Mass/inertia validated within 2%', 'React Dashboard + Reward Editor UI scaffolded', 'Figma user flows finalized', 'Reward API endpoints implemented — 10ms median / 20ms P95 latency', 'Dynamic reward switching integrated into Gym environment'],
              },
              {
                week: 'Week 3', color: '#2DD4C8',
                items: ['Gazebo contact sensors integrated', 'Collision false positives reduced below 5%', 'Node.js + Express + MongoDB + JWT backend complete', 'PPO agent trained for 1M steps', '80% success rate within 100 steps on Distance-to-Goal preset', 'MLflow experiment logging integrated', 'Convergence plateau identified at ~9e5 steps for further tuning'],
              },
            ].map(({ week, color, items }) => (
              <div key={week} style={{ padding: '18px 20px', background: 'rgba(242,237,216,0.025)', borderLeft: `3px solid ${color}`, borderRadius: 8 }}>
                <div style={{ fontFamily: MONO, fontSize: 11, color, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>{week}</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 4 }}>
                  {items.map(item => (
                    <div key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 13, color: '#B8B4A4', lineHeight: 1.5 }}>
                      <span style={{ width: 5, height: 5, borderRadius: '50%', background: color, flexShrink: 0, marginTop: 5 }} />{item}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Metrics grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }} className="three-col-df">
            {[
              { v: '80%', l: 'PPO success within 100 steps (Distance-to-Goal preset)' },
              { v: '<1s', l: 'Gazebo cold start / ~0.3s warm start' },
              { v: '10ms', l: 'Reward API median latency (20ms P95)' },
              { v: '<5%', l: 'Collision-detection false-positive rate' },
              { v: '40%', l: 'X500 URDF mesh optimization' },
              { v: '<2%', l: 'Mass/inertia validation error' },
            ].map(({ v, l }) => (
              <div key={l} style={{ padding: '14px 16px', background: `linear-gradient(180deg, ${ACCENT}0d, ${ACCENT}04)`, border: `1px solid ${ACCENT}35`, boxShadow: `0 4px 20px ${ACCENT}05`, borderRadius: 8 }}>
                <div style={{ fontFamily: SERIF, fontSize: 26, color: ACCENT, lineHeight: 1, paddingBottom: '0.05em', marginBottom: 8 }}>{v}</div>
                <p style={{ fontSize: 12, lineHeight: 1.6, color: '#B8B4A4' }}>{l}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* ─ Lessons ─ */}
        <Section id="lessons">
          <SectionLabel>Lessons Learned</SectionLabel>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }} className="two-col-df">
            {[
              { t: 'Educational AI Needs Clean Abstractions', d: 'Students learn reward design most effectively when the platform hides unnecessary complexity. Every API endpoint exposed in the UI should have a direct observable effect on drone behavior.' },
              { t: 'Reward Design Is the Best RL Entry Point', d: 'No other concept maps as directly from abstract theory to physical outcome. Students who adjust a collision penalty and watch the drone become more conservative have had a genuine insight.' },
              { t: 'A Stable Simulator Beats a Flashy Demo', d: 'A sub-1s startup and reliable contact sensor behavior matters more than impressive visuals. Students who encounter simulation bugs stop learning RL and start debugging ROS.' },
              { t: 'UI Latency Kills Learning Flow', d: 'The 10ms Reward API response time was a deliberate design target. If reward updates feel sluggish, students disengage from the feedback loop.' },
              { t: 'Log Everything From Day One', d: 'MLflow was integrated in Week 3 and it immediately revealed the convergence plateau at 9e5 steps. Without experiment tracking, that insight would have required re-running experiments.' },
              { t: 'Separate High-Level RL From Low-Level Flight Control', d: 'Students should reason about rewards and actions, not attitude stabilization and PID tuning. The flight controller abstraction boundary is a pedagogical design decision as much as a technical one.' },
            ].map(({ t, d }) => (
              <div key={t} style={{ padding: '18px 20px', background: 'rgba(242,237,216,0.025)', border: '1px solid rgba(242,237,216,0.08)', borderRadius: 8 }}>
                <div style={{ fontFamily: MONO, fontSize: 11, color: '#F2EDD8', letterSpacing: '0.04em', marginBottom: 8 }}>{t}</div>
                <p style={{ fontSize: 13, lineHeight: 1.7, color: 'var(--text3)' }}>{d}</p>
              </div>
            ))}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12, marginTop: 12 }} className="two-col-df">
            <div style={{ padding: '18px 20px', background: `${ACCENT}08`, border: `1px solid ${ACCENT}22`, borderRadius: 8 }}>
              <div style={{ fontFamily: MONO, fontSize: 10, color: ACCENT, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 }}>What broke</div>
              <p style={{ fontSize: 13, lineHeight: 1.75, color: '#B8B4A4' }}>
                The X500 URDF came in too mesh-heavy to simulate smoothly — I cut its complexity 40% (mass and inertia still validated within 2%) to hold a sub-1-second Gazebo start. Training had its own ceiling: PPO plateaued around 80% success, with convergence flattening near 9e5 of the 1M steps.
              </p>
            </div>
            <div style={{ padding: '18px 20px', background: 'rgba(242,237,216,0.025)', border: '1px solid rgba(242,237,216,0.08)', borderRadius: 8 }}>
              <div style={{ fontFamily: MONO, fontSize: 10, color: '#F2EDD8', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 }}>What I&apos;d do differently</div>
              <p style={{ fontSize: 13, lineHeight: 1.75, color: '#B8B4A4' }}>
                Wire experiment tracking in on day one. MLflow only went in during Week 3, and it surfaced the ~9e5-step plateau immediately — had it been logging from the first PPO run, I&apos;d have seen that ceiling before spending a full 1M-step run to find it.
              </p>
            </div>
          </div>
        </Section>

        {/* ─ Future ─ */}
        <Section id="future">
          <SectionLabel>Roadmap</SectionLabel>
          <h2 style={{ fontFamily: SERIF, fontSize: 'clamp(22px,3vw,32px)', fontWeight: 400, color: '#F2EDD8', marginBottom: 16, lineHeight: 1.2, paddingBottom: '0.06em' }}>
            From prototype to production-ready educational platform.
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 40 }} className="three-col-df">
            {[
              { phase: 'Near-Term', color: ACCENT, items: ['Motor & camera plugin integration', 'Mission Selector UI MVP', 'Path-Efficiency reward preset', 'SLAM plugin integration', 'SLAM map widget', 'Energy-Efficiency preset'] },
              { phase: 'Mid-Term', color: '#A78BFA', items: ['Event-camera simulation', 'Collision-Avoidance preset', 'Live telemetry view', 'Downloadable logs', 'Model upload (.pt / .onnx)', 'Live model swapping'] },
              { phase: 'Long-Term', color: '#2DD4C8', items: ['XAI logging + attention overlays', 'SHAP explainability', 'Altitude-stability maps', 'Dynamic leaderboard', 'Composite reward presets', 'Final sim-to-real validation'] },
            ].map(({ phase, color, items }) => (
              <div key={phase} style={{ padding: '18px 20px', background: `${color}06`, border: `1px solid ${color}22`, borderRadius: 8 }}>
                <div style={{ fontFamily: MONO, fontSize: 10, color, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 14 }}>{phase}</div>
                {items.map(item => (
                  <div key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 8, fontSize: 13, color: '#B8B4A4', lineHeight: 1.5 }}>
                    <span style={{ width: 5, height: 5, borderRadius: '50%', background: color, flexShrink: 0, marginTop: 5 }} />{item}
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* Footer CTA */}
          <div style={{ padding: '36px 40px', background: 'rgba(242,237,216,0.025)', border: '1px solid rgba(242,237,216,0.07)', borderRadius: 12, textAlign: 'center' }}>
            <div style={{ fontFamily: MONO, fontSize: 10, color: ACCENT, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 12 }}>DeepFlyer</div>
            <h3 style={{ fontFamily: SERIF, fontSize: 'clamp(20px,3vw,30px)', fontWeight: 400, color: '#F2EDD8', marginBottom: 14, lineHeight: 1.2, paddingBottom: '0.06em' }}>
              Making reinforcement learning physical.
            </h3>
            <p style={{ fontSize: 14, lineHeight: 1.75, color: '#B8B4A4', maxWidth: 520, margin: '0 auto 24px' }}>
              Reward design, PPO training, ROS 2 simulation, and a future path to real drone hardware — all accessible through a browser.
            </p>
            <Link href="/#projects" transitionTypes={['nav-back']} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '11px 22px', border: '1px solid rgba(242,237,216,0.16)', color: '#B8B4A4', fontFamily: MONO, fontSize: 11, letterSpacing: '0.06em', borderRadius: 5, textTransform: 'uppercase', textDecoration: 'none' }}>
              ← Back to Portfolio
            </Link>
          </div>
        </Section>
      </div>

      <style>{`
        @media(max-width:640px){
          .metrics-grid-df { grid-template-columns: repeat(2,1fr) !important; }
          .two-col-df { grid-template-columns: 1fr !important; }
          .three-col-df { grid-template-columns: 1fr !important; }
        }
        @media(max-width:900px){
          .three-col-df { grid-template-columns: repeat(2,1fr) !important; }
        }
      `}</style>
      {lb && <Lightbox src={lb} onClose={() => setLb(null)} />}
    </div>
  );
}
