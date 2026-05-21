'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Lightbox } from '@/components/ui/image-lightbox';
import { resolveSkillColor } from '@/lib/skill-colors';

const SERIF  = "var(--font-chakra), 'Chakra Petch', sans-serif";
const MONO   = "var(--font-chakra), 'Chakra Petch', monospace";
const ACCENT = '#F07832';

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

function LayerRow({ n, title, items, color = ACCENT }: { n: string; title: string; items: string[]; color?: string }) {
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

const SECTION_IDS    = ['overview', 'results', 'problem', 'system', 'control', 'calibration', 'safety', 'lessons', 'future'];
const SECTION_LABELS = ['Overview', 'Results', 'Problem', 'System', 'Control', 'Calibration', 'Safety', 'Lessons', 'Future'];

export default function CamelCarCaseStudy() {
  const active = useActiveSection(SECTION_IDS);
  const [scrolled, setScrolled] = useState(false);
  const [lb, setLb] = useState<string | null>(null);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div style={{ background: '#090B12', minHeight: '100vh', color: '#B8B4A4' }}>
      <style>{`
        body { background: #090B12; }
        .cs-body { font-family: ${SERIF}; font-size: 15px; line-height: 1.75; color: #B8B4A4; }
        .cs-body p { margin: 0 0 14px; }
        .cs-body ul { margin: 0 0 14px; padding-left: 20px; }
        .cs-body li { margin-bottom: 6px; }
        .cs-body li::marker { color: ${ACCENT}; }
        .cs-h2 { font-family: ${SERIF}; font-size: clamp(22px, 3vw, 30px); color: #F2EDD8; font-weight: 400; margin: 0 0 18px; line-height: 1.2; padding-bottom: 0.04em; }
        .cs-h3 { font-family: ${MONO}; font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase; color: ${ACCENT}; margin: 24px 0 10px; }
        .metrics-grid-cc { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; margin-bottom: 36px; }
        @media (max-width: 640px) { .metrics-grid-cc { grid-template-columns: repeat(2, 1fr); } }
        .two-col-cc { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        @media (max-width: 700px) { .two-col-cc { grid-template-columns: 1fr; } }
        .three-col-cc { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; }
        @media (max-width: 700px) { .three-col-cc { grid-template-columns: 1fr 1fr; } }
        @media (max-width: 480px) { .three-col-cc { grid-template-columns: 1fr; } }
        .info-card { padding: 16px 18px; background: rgba(242,237,216,0.02); border: 1px solid rgba(242,237,216,0.07); border-left: 2px solid ${ACCENT}50; border-radius: 8px; transition: all 0.2s ease; }
        .info-card:hover { border-color: ${ACCENT}40; background: ${ACCENT}0a; }
        .accent-card { padding: 16px 18px; background: ${ACCENT}04; border: 1px solid ${ACCENT}18; border-left: 2px solid ${ACCENT}90; border-radius: 8px; transition: all 0.2s ease; }
        .accent-card:hover { border-color: ${ACCENT}50; background: ${ACCENT}0c; }
        .award-banner { padding: 20px 24px; background: ${ACCENT}10; border: 1px solid ${ACCENT}35; border-radius: 10px; margin-bottom: 32px; }
        .roadmap-row { display: flex; gap: 14px; padding: 16px 18px; background: rgba(242,237,216,0.02); border: 1px solid rgba(242,237,216,0.06); border-left: 2px solid ${ACCENT}30; border-radius: 8px; align-items: flex-start; transition: all 0.2s ease; }
        .roadmap-row:hover { border-color: ${ACCENT}40; background: ${ACCENT}06; }
        .nav-link { font-family: ${MONO}; font-size: 10px; letter-spacing: 0.08em; text-transform: uppercase; text-decoration: none; transition: color 0.2s; padding: 4px 0; cursor: pointer; background: none; border: none; }
        .reaction-box { padding: 14px 18px; background: rgba(242,237,216,0.02); border: 1px solid rgba(242,237,216,0.08); border-radius: 8px; font-family: ${MONO}; font-size: 12px; color: #B8B4A4; line-height: 1.7; }
        .reaction-box .eq { color: ${ACCENT}; }
        code { font-family: ${MONO}; font-size: 11px; background: ${ACCENT}12; border: 1px solid ${ACCENT}25; padding: 2px 5px; border-radius: 4px; color: #F2EDD8; }
      `}</style>

      {/* ── Sticky header ── */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: scrolled ? 'rgba(9,11,18,0.95)' : 'transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        borderBottom: scrolled ? `1px solid ${ACCENT}35` : '1px solid transparent',
        transition: 'background 0.3s, border-color 0.3s',
        padding: '0 clamp(20px, 5vw, 80px)',
        height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24,
      }}>
        <Link href="/#projects" transitionTypes={['nav-back']} style={{ fontFamily: MONO, fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text3)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/></svg>
          Portfolio
        </Link>
        <span style={{ fontFamily: MONO, fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: ACCENT }}>Camel Car</span>
        <div style={{ width: 80 }} />
      </header>

      {/* ── Hero ── */}
      <div style={{ padding: 'clamp(48px,8vh,96px) clamp(20px,5vw,80px) 0' }}>
        <div style={{ maxWidth: 860, margin: '0 auto' }}>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 20 }}>
            <Tag>Embedded Control</Tag>
            <Tag>Competition Engineering</Tag>
            <Tag>AIChE 2025</Tag>
            <Tag>University of Toledo</Tag>
          </div>
          <h1 style={{ fontFamily: SERIF, fontSize: 'clamp(32px,5vw,56px)', fontWeight: 400, margin: '0 0 16px', lineHeight: 1.1, paddingBottom: '0.04em', background: `linear-gradient(135deg, #F2EDD8 70%, ${ACCENT} 100%)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', display: 'inline-block' }}>
            Camel Car
          </h1>
          <p style={{ fontFamily: SERIF, fontSize: 'clamp(15px,2vw,18px)', color: '#B8B4A4', maxWidth: 620, lineHeight: 1.6, margin: '0 0 12px' }}>
            Chemical propulsion. Pressure-triggered stop. No second chances.
          </p>
          <p style={{ fontFamily: SERIF, fontSize: 15, color: 'var(--text3)', maxWidth: 620, lineHeight: 1.6, margin: '0 0 40px' }}>
            University of Toledo&apos;s Chem-E Car competition vehicle — CO₂-powered propulsion, H₂O₂ decomposition stopping, and Arduino-based pressure-threshold control. Competed at the 2025 AIChE Annual Student Conference in Boston against teams from across the globe.
          </p>

          <div className="metrics-grid-cc">
            <Metric value="#1" label="Most Innovative Car Design" />
            <Metric value="3rd" label="Poster & Presentation" />
            <Metric value="24th" label="Overall performance — worldwide" />
            <Metric value="Boston" label="AIChE Annual Conf. 2025" />
            <Metric value="~5 psi" label="Arduino stop threshold" />
            <Metric value="Dual" label="Reaction system (propulsion + stop)" />
          </div>

          {/* Hero image */}
          <div style={{ width: '100%', borderRadius: 12, overflow: 'hidden', border: `1px solid ${ACCENT}18`, background: '#06080E', marginBottom: 64 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/Images/AIChE%20ChemECar_International.jpg" alt="Camel Car at AIChE 2025" onClick={() => setLb('/Images/AIChE%20ChemECar_International.jpg')} style={{ width: '100%', display: 'block', objectFit: 'cover', cursor: 'zoom-in' }} />
          </div>
        </div>
      </div>

      {/* ── Body ── */}
      <div style={{ padding: '0 clamp(20px,5vw,80px)', maxWidth: 860 + 160, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 200px', gap: 48, alignItems: 'start', maxWidth: 1060, margin: '0 auto' }}>

          {/* Content column */}
          <div className="cs-body">

            {/* OVERVIEW */}
            <Section id="overview">
              <SectionLabel>01 — Overview</SectionLabel>
              <h2 className="cs-h2">The chemistry creates the signal. The control system makes it repeatable.</h2>
              <p>
                Camel Car is the University of Toledo&apos;s Chem-E Car competition vehicle. The car travels a target distance using chemical energy and stops using a controlled chemical reaction — no batteries, no conventional brakes. Two separate reactions drive the system: CO₂ generation for propulsion, H₂O₂ decomposition for stopping.
              </p>
              <p>
                As Control Team Lead, my contribution was the embedded layer connecting these chemical processes to reliable vehicle behavior. An Arduino monitors the stopping reaction pressure, compares it to a target threshold, and triggers a solenoid to cut gas flow to the motor when that threshold is reached. The calibration work — mapping KI catalyst volume to pressure rise time — is what turns a chemical process into a predictable stop distance.
              </p>
              <p>
                The team qualified for and competed at the 2025 AIChE Annual Student Conference in Boston, representing UToledo on the world stage against teams from across the globe.
              </p>
            </Section>

            {/* RESULTS */}
            <Section id="results">
              <SectionLabel>02 — Competition Results</SectionLabel>
              <h2 className="cs-h2">Boston, 2025 — competing worldwide</h2>

              <div className="award-banner">
                <div style={{ fontFamily: MONO, fontSize: 9, color: ACCENT, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 12 }}>2025 AIChE Annual Student Conference · Boston, MA</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {[
                    { place: '#1', label: 'Most Innovative Car Design', note: 'Awarded for the novel pressure-based control architecture and dual-reaction vehicle concept' },
                    { place: '3rd', label: 'Poster & Presentation', note: 'Recognized for technical communication and visual documentation of the system' },
                    { place: '24th', label: 'Overall Performance', note: 'Ranked 24th among teams from universities worldwide' },
                  ].map(({ place, label, note }) => (
                    <div key={place} style={{ display: 'flex', gap: 16, alignItems: 'flex-start', padding: '12px 16px', background: 'rgba(9,11,18,0.6)', border: `1px solid ${ACCENT}20`, borderRadius: 8 }}>
                      <div style={{ fontFamily: SERIF, fontSize: 26, color: ACCENT, lineHeight: 1, flexShrink: 0, minWidth: 52 }}>{place}</div>
                      <div>
                        <div style={{ fontFamily: MONO, fontSize: 11, color: '#F2EDD8', letterSpacing: '0.04em', marginBottom: 4 }}>{label}</div>
                        <div style={{ fontFamily: SERIF, fontSize: 12, color: 'var(--text3)', lineHeight: 1.5 }}>{note}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <p>
                The Most Innovative Car Design award recognized the team&apos;s approach to the stopping-control problem: using chemical pressure as a control signal rather than a timing-only mechanism, and building a calibration workflow that could be tuned to any competition distance.
              </p>
            </Section>

            {/* PROBLEM */}
            <Section id="problem">
              <SectionLabel>03 — Problem</SectionLabel>
              <h2 className="cs-h2">Stop accurately at a distance you don&apos;t know until competition day</h2>
              <p>
                In Chem-E Car, the challenge is not simply making a car move. The challenge is making it stop at a target distance that is revealed close to competition time — with no conventional electronics, motors, or braking systems allowed. The car must use chemical energy, and the stopping mechanism must be based on a chemical reaction.
              </p>
              <div className="two-col-cc" style={{ marginBottom: 24 }}>
                {[
                  ['Unknown target distance', 'The exact stop distance is not known in advance. The team must have a calibrated way to tune the system quickly on competition day.'],
                  ['Chemical variability', 'Reaction rates depend on concentration, volume, temperature, and mixing — all of which vary between runs.'],
                  ['Pressure noise', 'Sensor readings are not perfectly clean. The controller must trigger reliably despite signal variation.'],
                  ['Actuator delay', 'The solenoid has a mechanical response delay between trigger and gas cutoff.'],
                  ['Mechanical coast', 'The car continues moving after the gas stops. Coast distance must be factored into the calibration.'],
                  ['Safety constraints', 'The system operates with oxidizers, acids, and pressurized gas — safety limits every design decision.'],
                ].map(([title, body]) => (
                  <div key={title} className="info-card">
                    <div style={{ fontFamily: MONO, fontSize: 10, color: ACCENT, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6 }}>{title}</div>
                    <p style={{ margin: 0, fontSize: 13, lineHeight: 1.6 }}>{body}</p>
                  </div>
                ))}
              </div>
            </Section>

            {/* SYSTEM */}
            <Section id="system">
              <SectionLabel>04 — Dual-Reaction System</SectionLabel>
              <h2 className="cs-h2">One reaction drives it. One reaction stops it.</h2>
              <p>
                Camel Car uses two independent chemical reactions, one for each function of the vehicle. The propulsion and stopping subsystems operate in parallel — the car begins moving as the propulsion reaction feeds gas to the motor, and the stopping reaction begins building pressure simultaneously.
              </p>

              <h3 className="cs-h3">Propulsion — CO₂ generation</h3>
              <p>Acetic acid and sodium bicarbonate react to generate CO₂ gas, which is fed through a pressure regulator and flow valve into an air motor that drives the front axle.</p>
              <div className="reaction-box" style={{ marginBottom: 20 }}>
                <span className="eq">NaHCO₃(aq) + CH₃COOH(aq)</span>{' '}→{' '}
                <span className="eq">CH₃COONa(aq) + H₂O(l) + CO₂(g)</span>
              </div>

              <h3 className="cs-h3">Stopping — H₂O₂ decomposition</h3>
              <p>Hydrogen peroxide is decomposed by potassium iodide acting as a catalyst. The reaction produces oxygen gas, raising pressure inside a sealed reaction vessel. When the pressure reaches the control threshold, the Arduino cuts gas flow to the motor.</p>
              <div className="reaction-box" style={{ marginBottom: 20 }}>
                <span className="eq">H₂O₂(aq) + I⁻(aq)</span>{' '}→{' '}
                <span className="eq">H₂O(l) + OI⁻(aq)</span>
                <br />
                <span className="eq">H₂O₂(aq) + OI⁻(aq)</span>{' '}→{' '}
                <span className="eq">H₂O(l) + O₂(g) + I⁻(aq)</span>
              </div>

              <p>
                This makes the stopping mechanism a chemical-electrical-mechanical hybrid loop: chemistry generates pressure → sensor reads pressure → Arduino compares to threshold → solenoid cuts gas → car decelerates and coasts to stop.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 8 }}>
                <LayerRow n="1" title="Propulsion Subsystem" items={['Acetic acid + sodium bicarbonate', 'CO₂ generation', 'Pressure regulator', 'Flow valve', 'Air motor', 'Front axle drive']} />
                <LayerRow n="2" title="Stopping Subsystem" items={['H₂O₂ + KI catalyst', 'O₂ pressure generation', 'Sealed reaction vessel', 'Pressure sensor', 'Arduino threshold logic', 'Solenoid gas shutoff']} />
              </div>
            </Section>

            {/* CONTROL */}
            <Section id="control">
              <SectionLabel>05 — Control Architecture</SectionLabel>
              <h2 className="cs-h2">Threshold-triggered embedded stopping</h2>
              <p>
                The control system is deliberately simple: a threshold-triggered loop running on an Arduino. Simplicity matters in competition — a system that fails silently is worse than one that is easy to debug in two minutes.
              </p>

              <h3 className="cs-h3">Control loop</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 20 }}>
                {[
                  ['1', 'Stopping reaction begins — H₂O₂ + KI mixed in vessel'],
                  ['2', 'O₂ pressure rises inside the sealed reaction vessel'],
                  ['3', 'Pressure sensor sends analog signal to Arduino'],
                  ['4', 'Arduino compares reading to target pressure setpoint (~5 psi)'],
                  ['5', 'Threshold reached → Arduino triggers solenoid/valve actuator'],
                  ['6', 'Gas flow to air motor is cut'],
                  ['7', 'Car coasts to stop — coast distance factored into calibration'],
                ].map(([n, step]) => (
                  <div key={n} style={{ display: 'flex', gap: 14, padding: '10px 16px', background: 'rgba(242,237,216,0.02)', border: '1px solid rgba(242,237,216,0.06)', borderRadius: 6 }}>
                    <span style={{ fontFamily: MONO, fontSize: 10, color: ACCENT, opacity: 0.7, flexShrink: 0, minWidth: 16 }}>{n}</span>
                    <span style={{ fontSize: 13, lineHeight: 1.5 }}>{step}</span>
                  </div>
                ))}
              </div>

              <h3 className="cs-h3">Core logic</h3>
              <div style={{ padding: '16px 20px', background: 'rgba(240,120,50,0.06)', border: '1px solid rgba(240,120,50,0.18)', borderRadius: 8, marginBottom: 20 }}>
                <pre style={{ margin: 0, fontFamily: MONO, fontSize: 12, color: '#B8B4A4', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>{`read pressure_sensor;

if (pressure >= target_pressure_threshold) {
    close_solenoid_valve();
    stop_gas_flow_to_motor();
}`}</pre>
              </div>
              <p>
                A production-grade version accounts for sensor noise (low-pass filter or moving average), hysteresis to avoid false re-triggering, actuator delay compensation, and a safety cutoff that fires the stop regardless of pressure if a maximum run time is exceeded.
              </p>
            </Section>

            {/* CALIBRATION */}
            <Section id="calibration">
              <SectionLabel>06 — Calibration</SectionLabel>
              <h2 className="cs-h2">KI volume maps to stop distance</h2>
              <p>
                Calibration is the core engineering challenge that makes or breaks a competition run. The chemistry does not produce the same pressure curve every time — concentration, temperature, and mixing all introduce variability. The team&apos;s job is to characterize that variability and build a tuning method that works under competition conditions.
              </p>

              <div className="two-col-cc" style={{ marginBottom: 24 }}>
                <div className="accent-card">
                  <div style={{ fontFamily: MONO, fontSize: 10, color: ACCENT, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>KI Volume → Pressure Rise Rate</div>
                  <p style={{ margin: 0, fontSize: 13, lineHeight: 1.6 }}>More potassium iodide catalyst accelerates H₂O₂ decomposition, which increases the rate of O₂ production and raises pressure faster. Calibration maps a specific KI volume to an expected time-to-threshold at ~5 psi.</p>
                </div>
                <div className="accent-card">
                  <div style={{ fontFamily: MONO, fontSize: 10, color: ACCENT, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>Pressure Rise Rate → Stop Distance</div>
                  <p style={{ margin: 0, fontSize: 13, lineHeight: 1.6 }}>Faster pressure rise → earlier Arduino trigger → car stops sooner → shorter travel distance. On competition day, the target distance is converted into a required time-to-threshold, then mapped to a KI volume via the calibration curve.</p>
                </div>
              </div>

              <div style={{ padding: '16px 20px', background: 'rgba(242,237,216,0.02)', border: '1px solid rgba(242,237,216,0.07)', borderRadius: 8, marginBottom: 8 }}>
                <div style={{ fontFamily: MONO, fontSize: 10, color: 'var(--text3)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 10 }}>Calibration workflow</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {[
                    'Run stopping reaction at several KI volumes — record pressure vs. time',
                    'Identify time-to-threshold (5 psi) for each KI volume',
                    'Run full vehicle runs — record actual stop distance for each timing',
                    'Build KI volume → stop distance lookup table',
                    'On competition day: convert target distance to KI volume and load the run',
                  ].map((step, i) => (
                    <div key={i} style={{ display: 'flex', gap: 10, fontSize: 13, color: '#B8B4A4', lineHeight: 1.5 }}>
                      <span style={{ fontFamily: MONO, fontSize: 10, color: ACCENT, opacity: 0.7, flexShrink: 0 }}>{i + 1}.</span>
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Section>

            {/* SAFETY */}
            <Section id="safety">
              <SectionLabel>07 — Safety</SectionLabel>
              <h2 className="cs-h2">Safety is an engineering constraint, not an afterthought</h2>
              <p>
                Every design decision in Camel Car operates under safety constraints. The chemicals involved — hydrogen peroxide (strong oxidizer), potassium iodide, acetic acid, and pressurized gas — require careful handling at every stage of testing and competition.
              </p>
              <div className="three-col-cc" style={{ marginBottom: 24 }}>
                {[
                  ['Hydrogen peroxide', 'Strong oxidizer — requires gloves, goggles, and controlled handling. Skin contact causes immediate bleaching. Stored away from organic materials.'],
                  ['Potassium iodide / molecular iodine', 'KI is the catalyst. As the reaction proceeds, molecular iodine (I₂) can form — which is toxic and staining. PPE required throughout.'],
                  ['Acetic acid', 'Corrosive at high concentrations. Fume hood use required during preparation. Avoid inhalation.'],
                  ['Pressurized gas', 'CO₂ and O₂ generation under sealed conditions. All connections must be leak-checked before each run. Relief valve behavior must be understood.'],
                  ['Moving parts', 'The air motor and axle create mechanical hazard during live runs. Test area must be cleared.'],
                  ['Control system', 'The shutoff must be reliable — a control failure that leaves gas on is a pressure and chemical hazard, not just a competition loss.'],
                ].map(([title, body]) => (
                  <div key={title} className="info-card">
                    <div style={{ fontFamily: MONO, fontSize: 10, color: ACCENT, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6 }}>{title}</div>
                    <p style={{ margin: 0, fontSize: 12, lineHeight: 1.6 }}>{body}</p>
                  </div>
                ))}
              </div>
              <p style={{ fontSize: 13, color: 'var(--text3)' }}>
                Required PPE: lab coat, safety goggles, chemical-resistant gloves, closed-toe shoes, long pants, fume hood for preparation. All testing followed controlled procedures with a checklist.
              </p>
            </Section>

            {/* LESSONS */}
            <Section id="lessons">
              <SectionLabel>08 — Lessons Learned</SectionLabel>
              <h2 className="cs-h2">What competition-grade embedded work teaches</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
                {[
                  ['A calibrated simple controller beats an uncalibrated complex one', 'The threshold-trigger approach is basic control theory. What made it competitive was the calibration data behind it — knowing exactly what KI volume maps to what stop distance under what conditions.'],
                  ['Chemical systems introduce irreducible variability', 'Reaction rates depend on temperature, mixing quality, concentration precision, and timing. The control system must tolerate that variability rather than assume perfect inputs.'],
                  ['Sensor data must map to physical outcome', 'Pressure readings are only useful if we know what pressure value corresponds to what motor behavior. That mapping comes from test runs, not datasheets.'],
                  ['Mechanical coast distance is part of the control problem', 'The electronic stop trigger is not the same as the mechanical stop. Calibration must account for how far the car travels after gas cutoff.'],
                  ['Cross-disciplinary communication is non-negotiable', 'Chemistry, mechanical design, and embedded control are tightly coupled. A change in KI concentration, a new solenoid, or a different regulator changes the calibration. Every team member needs enough context across disciplines to communicate tradeoffs.'],
                  ['Competition constraints produce better engineering', 'Unknown target distance, one-shot execution, and real chemical hazards force engineering decisions that open-ended projects never surface. Design for worst case.'],
                ].map(([title, body]) => (
                  <div key={title} style={{ padding: '14px 18px', background: `${ACCENT}06`, border: `1px solid ${ACCENT}18`, borderRadius: 8 }}>
                    <div style={{ fontFamily: MONO, fontSize: 10, color: ACCENT, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6 }}>{title}</div>
                    <p style={{ margin: 0, fontSize: 13, lineHeight: 1.65 }}>{body}</p>
                  </div>
                ))}
              </div>
            </Section>

            {/* FUTURE */}
            <Section id="future">
              <SectionLabel>09 — Future Improvements</SectionLabel>
              <h2 className="cs-h2">Where the control system goes next</h2>
              <p>
                The current threshold-trigger design works under competition conditions but has room for significant improvement, especially in repeatability and diagnostics.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
                {[
                  { phase: 'Sensing', color: ACCENT, items: ['Add pressure data logging to every run (SD card or serial)', 'Apply low-pass filter or moving average to reduce sensor noise', 'Add a second pressure sensor for redundancy', 'Add temperature sensing to correct for reaction-rate variation'] },
                  { phase: 'Control', color: '#F0B429', items: ['Add hysteresis to prevent false re-triggering near threshold', 'Model and compensate for actuator delay', 'Add a maximum-run-time safety cutoff independent of pressure', 'Build a predictive stopping algorithm that uses pressure slope, not just level'] },
                  { phase: 'Calibration', color: '#4B7BF5', items: ['Build a calibration dashboard: KI volume → time-to-threshold → stop distance', 'Add wheel encoder data to measure actual travel distance per run', 'Add IMU to detect acceleration and vibration patterns', 'Add environmental correction for temperature and humidity'] },
                ].map(({ phase, color, items }) => (
                  <div key={phase} className="roadmap-row">
                    <div style={{ fontFamily: MONO, fontSize: 10, color, letterSpacing: '0.08em', textTransform: 'uppercase', flexShrink: 0, minWidth: 90, paddingTop: 2 }}>{phase}</div>
                    <ul style={{ margin: 0, padding: '0 0 0 16px' }}>
                      {items.map(item => <li key={item} style={{ fontSize: 13, marginBottom: 4, lineHeight: 1.5 }}>{item}</li>)}
                    </ul>
                  </div>
                ))}
              </div>

              <div style={{ padding: '24px 28px', background: `${ACCENT}08`, border: `1px solid ${ACCENT}22`, borderRadius: 10, marginTop: 32 }}>
                <p style={{ fontFamily: SERIF, fontSize: 15, color: '#F2EDD8', margin: '0 0 8px', lineHeight: 1.5 }}>
                  The chemistry creates the signal. The control system is what turns that signal into a repeatable vehicle action.
                </p>
                <p style={{ fontFamily: SERIF, fontSize: 14, color: '#B8B4A4', margin: 0, lineHeight: 1.6 }}>
                  Camel Car shows that embedded control, calibration, and safety engineering are not just software problems — they are the bridge between chemical energy and competition-grade performance.
                </p>
              </div>

              <div style={{ display: 'flex', gap: 10, marginTop: 32, flexWrap: 'wrap' }}>
                <Link href="/#projects" transitionTypes={['nav-back']} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '10px 20px', background: ACCENT, color: '#0B0D14', fontFamily: MONO, fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', borderRadius: 5, textTransform: 'uppercase', textDecoration: 'none' }}>← Back to Projects</Link>
              </div>
            </Section>

          </div>

          {/* ── Sticky section nav ── */}
          <nav style={{ position: 'sticky', top: 72, alignSelf: 'start' }}>
            <div style={{ fontFamily: MONO, fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--text3)', marginBottom: 14 }}>On This Page</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {SECTION_IDS.map((id, i) => (
                <button
                  key={id}
                  className="nav-link"
                  style={{ color: active === id ? ACCENT : 'var(--text3)', textAlign: 'left', borderLeft: `2px solid ${active === id ? ACCENT : 'transparent'}`, paddingLeft: active === id ? 12 : 6, background: active === id ? `${ACCENT}0d` : 'transparent', borderRadius: '0 4px 4px 0', transition: 'all 0.2s ease', display: 'block', width: '100%' }}
                  onClick={() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })}
                >
                  {SECTION_LABELS[i]}
                </button>
              ))}
            </div>
          </nav>

        </div>
      </div>
      {lb && <Lightbox src={lb} onClose={() => setLb(null)} />}
    </div>
  );
}
