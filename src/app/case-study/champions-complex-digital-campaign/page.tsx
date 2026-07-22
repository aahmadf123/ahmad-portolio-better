'use client';

import React, { useEffect, useState } from 'react';
import { SmartBackLink } from '@/components/ui/smart-back-link';
import { Lightbox } from '@/components/ui/image-lightbox';
import { Pic } from '@/components/ui/pic';
import { resolveSkillColor } from '@/lib/skill-colors';

const SERIF  = "var(--font-chakra), 'Chakra Petch', sans-serif";
const MONO   = "var(--font-chakra), 'Chakra Petch', monospace";
const ACCENT = '#0EA5E9';

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

const SECTION_IDS    = ['overview', 'problem', 'strategy', 'ia', 'rendering', 'brand', 'platform', 'lessons', 'future'];
const SECTION_LABELS = ['Overview', 'Problem', 'Digital Strategy', 'Donor Journey', 'Rendering Strategy', 'Brand', 'Technical Platform', 'Lessons', 'Future Work'];

export default function ChampionsComplexCaseStudy() {
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
        .roadmap-row { display: flex; gap: 14px; padding: 16px 18px; background: rgba(242,237,216,0.02); border: 1px solid rgba(242,237,216,0.06); border-left: 2px solid ${ACCENT}30; border-radius: 8px; align-items: flex-start; transition: all 0.2s ease; }
        .roadmap-row:hover { border-color: ${ACCENT}40; background: ${ACCENT}06; }
        .nav-link { font-family: ${MONO}; font-size: 10px; letter-spacing: 0.08em; text-transform: uppercase; text-decoration: none; transition: color 0.2s; padding: 4px 0; cursor: pointer; background: none; border: none; }
        code { font-family: ${MONO}; font-size: 11px; background: ${ACCENT}12; border: 1px solid ${ACCENT}25; padding: 2px 5px; border-radius: 4px; color: #F2EDD8; }
        .cs-grid-container {
          display: grid;
          grid-template-columns: 1fr 200px;
          gap: 48px;
          align-items: start;
          max-width: 1060px;
          margin: 0 auto;
        }
        .cs-sidebar-nav {
          position: sticky;
          top: 72px;
          align-self: start;
        }
        @media (max-width: 900px) {
          .cs-grid-container {
            grid-template-columns: 1fr;
            gap: 24px;
          }
          .cs-sidebar-nav {
            display: none;
          }
        }
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
        <SmartBackLink fallbackHref="/#projects" style={{ fontFamily: MONO, fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text3)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/></svg>
          Portfolio
        </SmartBackLink>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 10px', fontFamily: MONO, fontSize: 9, letterSpacing: '0.1em', textTransform: 'uppercase', color: ACCENT, background: `${ACCENT}10`, border: `1px solid ${ACCENT}30`, borderRadius: 20 }}>
            <span style={{ width: 5, height: 5, borderRadius: '50%', background: ACCENT, display: 'inline-block' }} />
            Athletics
          </span>
          <span style={{ fontFamily: MONO, fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: ACCENT }}>Champions Complex</span>
        </div>
        <div style={{ width: 80 }} />
      </header>

      {/* ── Hero ── */}
      <div style={{ padding: 'clamp(48px,8vh,96px) clamp(20px,5vw,80px) 0' }}>
        <div style={{ maxWidth: 860, margin: '0 auto' }}>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 20 }}>
            <Tag>Athletics</Tag>
            <Tag>Web Strategy</Tag>
            <Tag>Digital Fundraising</Tag>
            <Tag>UToledo</Tag>
            <Tag>Donor UX</Tag>
          </div>
          <h1 style={{ fontFamily: SERIF, fontSize: 'clamp(32px,5vw,56px)', fontWeight: 400, margin: '0 0 16px', lineHeight: 1.1, paddingBottom: '0.04em', background: `linear-gradient(135deg, #F2EDD8 70%, ${ACCENT} 100%)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', display: 'inline-block' }}>
            Champions Complex<br />Digital Campaign
          </h1>
          <p style={{ fontFamily: SERIF, fontSize: 'clamp(15px,2vw,18px)', color: '#B8B4A4', maxWidth: 620, lineHeight: 1.6, margin: '0 0 12px' }}>
            Building the digital front door for Rocket Athletics&apos; next era.
          </p>
          <p style={{ fontFamily: SERIF, fontSize: 15, color: 'var(--text3)', maxWidth: 640, lineHeight: 1.6, margin: '0 0 40px' }}>
            A donor-focused web campaign strategy for the Champions Complex - a 74,000-square-foot transformation of the University of Toledo Health Education Building into a centralized student-athlete development hub.
          </p>

          <div className="metrics-grid-cc">
            <Metric value="74K sq ft" label="Facility renovation scope" />
            <Metric value="450+" label="Rocket student-athletes impacted" />
            <Metric value="10" label="Architectural renderings mapped" />
            <Metric value="6" label="Donor journey stages" />
            <Metric value="Sidearm" label="Narrator platform strategy" />
            <Metric value="UToledo" label="Brand-aligned throughout" />
          </div>

          {/* Hero image */}
          <div style={{ width: '100%', borderRadius: 12, overflow: 'hidden', border: `1px solid ${ACCENT}18`, background: '#06080E', marginBottom: 64 }}>
            <Pic src="/Images/Champion_Complex_Render1.jpg" alt="Champions Complex architectural rendering" onClick={() => setLb('/Images/Champion_Complex_Render1.jpg')} style={{ width: '100%', display: 'block', objectFit: 'cover', cursor: 'zoom-in' }} priority />
          </div>
        </div>
      </div>

      {/* ── Body ── */}
      <div style={{ padding: '0 clamp(20px,5vw,80px)', maxWidth: 860 + 160, margin: '0 auto' }}>
        <div className="cs-grid-container">

          {/* Content column */}
          <div className="cs-body">

            {/* OVERVIEW */}
            <Section id="overview">
              <SectionLabel>01 - Overview</SectionLabel>
              <h2 className="cs-h2">A capital campaign needs more than a donate button.</h2>
              <p>
                The Champions Complex Digital Campaign is a strategic webpage and digital fundraising blueprint created for University of Toledo Athletics. The project supports the Champions Complex initiative - a major renovation of the 74,000-square-foot Health Education Building into a centralized home for student-athlete development.
              </p>
              <p>
                The proposed facility consolidates academics, nutrition, health, wellness, training, and team spaces under one roof, and returns baseball and softball programs from Scott Park to the main campus. The digital campaign was designed to match the ambition of the physical facility: immersive, polished, donor-focused, and aligned with the University of Toledo brand.
              </p>
              <p>
                My work focused on creating the complete digital strategy for the campaign webpage - information architecture, visual sequencing, donor journey design, rendering integration, technical feasibility analysis, fundraising conversion, naming-rights strategy, and brand execution.
              </p>
            </Section>

            {/* PROBLEM */}
            <Section id="problem">
              <SectionLabel>02 - Problem</SectionLabel>
              <h2 className="cs-h2">A static page with renderings and a donate button does not move donors.</h2>
              <p>
                A major athletics capital campaign requires more than an information page. The Champions Complex needed to answer questions that a basic webpage cannot: Why does this facility matter? How does it change student-athlete life? Why should donors trust this project? How does it affect recruiting and competitive excellence? And critically - how does the page convert interest into financial commitment?
              </p>
              <div className="two-col-cc" style={{ marginBottom: 24 }}>
                {[
                  ['No emotional hook', 'A list of facility amenities does not inspire. Donors give to vision, legacy, and impact - not square footage.'],
                  ['Rendering overload', 'Dumping all architectural renders into a gallery loses the narrative. Each image needs a purpose in the story.'],
                  ['Friction in giving', 'Even willing donors abandon when the giving path is unclear. Conversion requires frictionless flow from belief to action.'],
                  ['Platform constraints', 'The page must live within the Sidearm Sports athletics ecosystem - not a blank-canvas build.'],
                  ['Two audiences at once', 'Major gift donors and grassroots supporters have different motivations. The page must serve both without alienating either.'],
                  ['Brand consistency', 'UToledo brand standards govern color, type, and voice - any deviation undermines institutional credibility.'],
                ].map(([title, body]) => (
                  <div key={title} className="info-card">
                    <div style={{ fontFamily: MONO, fontSize: 10, color: ACCENT, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6 }}>{title}</div>
                    <p style={{ margin: 0, fontSize: 13, lineHeight: 1.6 }}>{body}</p>
                  </div>
                ))}
              </div>
              <p>
                The challenge was to design a webpage that functions simultaneously as a storytelling platform, a facility showcase, and a donor-conversion engine - all within an existing athletics web ecosystem.
              </p>
            </Section>

            {/* DIGITAL STRATEGY */}
            <Section id="strategy">
              <SectionLabel>03 - Digital Strategy</SectionLabel>
              <h2 className="cs-h2">A conversion system, not an information page.</h2>
              <p>
                The proposed solution is an immersive single-page campaign experience built on a deliberate six-stage sequence. Each stage serves a specific psychological function in the donor journey. The page does not ask for money until belief, trust, and legacy have been established.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 24 }}>
                {[
                  { stage: '01 · Awe', label: 'Hero', desc: 'A cinematic exterior rendering or video loop establishes scale and emotional pull. Champions Complex logo, bold campaign headline, and a single CTA: Explore the Vision.' },
                  { stage: '02 · Understanding', label: 'Project Overview', desc: '74,000 sq ft renovation. Centralized student-athlete hub. Baseball and softball returning to main campus. Impact on 450+ Rocket student-athletes.' },
                  { stage: '03 · Trust', label: 'Campaign Momentum', desc: 'Fundraising progress bar, leadership gift recognition, donor confidence messaging, and testimonial grid. Shows that the campaign is real and moving.' },
                  { stage: '04 · Exploration', label: 'Facility Storytelling', desc: 'Each space - Academic Center, Performance Dining, Central Hub, locker rooms, indoor turf, Champions Corridor - gets its own section with a dedicated rendering and student-athlete benefit.' },
                  { stage: '05 · Legacy', label: 'Naming-Rights', desc: 'Premium spaces for major gifts, sport-specific donor opportunities, corporate partnership options. Donors see how their gift becomes part of the facility permanently.' },
                  { stage: '06 · Action', label: 'Donation Pathway', desc: 'Clear giving CTA, Rocket Fund integration, mobile-friendly flow, recurring and pledge-friendly options. Placed after emotional and rational buy-in has been built.' },
                ].map(({ stage, label, desc }) => (
                  <div key={stage} style={{ display: 'flex', gap: 14, padding: '14px 18px', background: `${ACCENT}06`, border: `1px solid ${ACCENT}18`, borderRadius: 8 }}>
                    <div style={{ flexShrink: 0, minWidth: 100 }}>
                      <div style={{ fontFamily: MONO, fontSize: 9, color: ACCENT, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 4 }}>{stage}</div>
                      <div style={{ fontFamily: MONO, fontSize: 10, color: '#F2EDD8', letterSpacing: '0.04em' }}>{label}</div>
                    </div>
                    <p style={{ margin: 0, fontSize: 13, lineHeight: 1.6 }}>{desc}</p>
                  </div>
                ))}
              </div>
              <p>
                A donor who arrives at the Action stage has already been guided through awe, context, social proof, exploration, and legacy imagination. The donate button is the logical next step - not an interruption.
              </p>
            </Section>

            {/* INFORMATION ARCHITECTURE */}
            <Section id="ia">
              <SectionLabel>04 - Donor Journey Architecture</SectionLabel>
              <h2 className="cs-h2">Every section earns the one that follows it.</h2>
              <p>
                The page&apos;s information architecture is organized around donor psychology, not facility logistics. Spaces are introduced in the order that maximizes belief - not alphabetically or by square footage.
              </p>
              <h3 className="cs-h3">Facility sections in narrative order</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 24 }}>
                {[
                  ['Exterior & Campus Context', 'Opens with the full vision - what the building becomes, how it fits the campus, and what it signals to recruits.'],
                  ['Academic Center', 'Leads with student-athlete success. Academics first positions the facility as a development investment, not just an athletic perk.'],
                  ['Central Hub', 'The shared heart of the facility. Emphasizes community and cross-sport connection - the building as a home, not a collection of rooms.'],
                  ['Performance Dining Center', 'Nutrition as competitive advantage. Connects the physical space to performance outcomes on the field.'],
                  ['Baseball & Softball Locker Rooms', 'The campus return story. Emotionally resonant for alumni and sport-specific donors - a promise kept.'],
                  ['Indoor Training Turf', '11,000+ sq ft of year-round practice capacity. Recruiting and preparation argument made visually concrete.'],
                  ['Champions Corridor', 'History, legacy, and donor recognition. Sets up the naming-rights section naturally - donors see where they fit in the story.'],
                  ['Wellness & Support Spaces', 'Holistic student-athlete care. Closes the facility tour before the giving section with a values-aligned message.'],
                ].map(([title, body]) => (
                  <div key={title} style={{ display: 'flex', gap: 14, padding: '10px 16px', background: 'rgba(242,237,216,0.02)', border: '1px solid rgba(242,237,216,0.06)', borderRadius: 6 }}>
                    <span style={{ fontFamily: MONO, fontSize: 9, color: ACCENT, flexShrink: 0, marginTop: 3 }}>→</span>
                    <div>
                      <div style={{ fontFamily: MONO, fontSize: 10, color: '#F2EDD8', letterSpacing: '0.04em', marginBottom: 4 }}>{title}</div>
                      <p style={{ margin: 0, fontSize: 13, lineHeight: 1.5 }}>{body}</p>
                    </div>
                  </div>
                ))}
              </div>

              <h3 className="cs-h3">Naming-rights opportunities</h3>
              <div className="three-col-cc" style={{ marginBottom: 8 }}>
                {['Performance Dining Center', 'Indoor Training Turf', 'Baseball Locker Room', 'Softball Locker Room', 'Academic Center', 'Student-Athlete Wellness Suite', 'Champions Corridor', 'Team Meeting Rooms', 'Coaches\' Offices'].map(space => (
                  <div key={space} style={{ padding: '10px 14px', background: `${ACCENT}06`, border: `1px solid ${ACCENT}18`, borderRadius: 6, fontFamily: MONO, fontSize: 10, color: '#B8B4A4', lineHeight: 1.4 }}>{space}</div>
                ))}
              </div>
            </Section>

            {/* RENDERING STRATEGY */}
            <Section id="rendering">
              <SectionLabel>05 - Rendering Strategy</SectionLabel>
              <h2 className="cs-h2">Renderings as narrative evidence, not decorative assets.</h2>
              <p>
                The blueprint maps each of the ten architectural renderings directly into a specific section of the donor narrative, rather than placing them in a generic gallery. Each rendering earns its position by answering a donor question or advancing the story.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
                <LayerRow n="Hero" title="Exterior Dusk Rendering" items={['Cinematic first impression', 'Scale and prestige', 'Campaign momentum mood']} />
                <LayerRow n="02" title="Daytime Exterior" items={['Campus integration section', 'Community access', 'Main-campus presence']} />
                <LayerRow n="03" title="Academic Center" items={['Academic excellence section', 'Study and collaboration spaces', 'Student-athlete support']} />
                <LayerRow n="04" title="Central Hub" items={['Unification section', 'Shared home for all Rockets', 'Community and cross-sport identity']} />
                <LayerRow n="05" title="Performance Dining Center" items={['Nutrition and performance section', 'Fueling student-athlete development', 'Competitive advantage messaging']} />
                <LayerRow n="06–07" title="Baseball & Softball Locker Rooms" items={['Campus return section', 'Elite team spaces', 'Sport-specific donor targeting']} />
                <LayerRow n="08" title="Indoor Training Turf" items={['Year-round training section', '11,000+ sq ft of indoor capacity', 'Recruiting and preparation argument']} />
                <LayerRow n="09" title="Champions Corridor" items={['Legacy section', 'Donor recognition', 'History and future achievement']} />
                <LayerRow n="10" title="Wellness Spaces" items={['Holistic care section', 'Values alignment', 'Pre-giving section closer']} />
              </div>
              <p>
                This visual sequence turns the page into a guided facility tour. A donor who reaches the giving section has already seen the spaces their contribution helps build.
              </p>
            </Section>

            {/* BRAND STRATEGY */}
            <Section id="brand">
              <SectionLabel>06 - Brand Strategy</SectionLabel>
              <h2 className="cs-h2">Brand consistency is institutional credibility.</h2>
              <p>
                The webpage strictly follows University of Toledo brand standards. Every color, type choice, and copy tone is a signal to donors that this is a serious, credible institutional campaign - not a side project.
              </p>

              <h3 className="cs-h3">Color system</h3>
              <div className="two-col-cc" style={{ marginBottom: 24 }}>
                {[
                  { name: 'Midnight Blue', hex: '#003E7E', use: 'Main backgrounds, overlays, section blocks, footer' },
                  { name: 'UToledo Gold', hex: '#FFD200', use: 'CTAs, progress bars, highlights, interactive hotspots' },
                  { name: 'Secondary Dark Blue', hex: '#000F3E', use: 'Image overlays, premium athletic sections, high-contrast backgrounds' },
                  { name: 'Secondary Azure', hex: '#009CE5', use: 'Wellness or support-service accents' },
                ].map(({ name, hex, use }) => (
                  <div key={name} className="info-card" style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                    <div style={{ width: 32, height: 32, borderRadius: 6, background: hex, flexShrink: 0, marginTop: 2, border: '1px solid rgba(255,255,255,0.08)' }} />
                    <div>
                      <div style={{ fontFamily: MONO, fontSize: 10, color: '#F2EDD8', letterSpacing: '0.04em', marginBottom: 3 }}>{name} <span style={{ color: 'var(--text3)' }}>{hex}</span></div>
                      <p style={{ margin: 0, fontSize: 12, lineHeight: 1.5 }}>{use}</p>
                    </div>
                  </div>
                ))}
              </div>

              <h3 className="cs-h3">Typography & Voice</h3>
              <div className="two-col-cc">
                <div className="accent-card">
                  <div style={{ fontFamily: MONO, fontSize: 10, color: ACCENT, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>Typography</div>
                  <ul style={{ margin: 0, padding: '0 0 0 16px' }}>
                    {['Poppins - primary font family', 'Heavy weights for bold headlines', 'Light/regular for body text', 'Strong spacing for donor readability', 'Accessible contrast throughout'].map(i => (
                      <li key={i} style={{ fontSize: 13, marginBottom: 5, lineHeight: 1.5 }}>{i}</li>
                    ))}
                  </ul>
                </div>
                <div className="accent-card">
                  <div style={{ fontFamily: MONO, fontSize: 10, color: ACCENT, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>Voice</div>
                  <ul style={{ margin: 0, padding: '0 0 0 16px' }}>
                    {['Proud but not arrogant', 'Ambitious but credible', 'Donor-focused, not transactional', 'Student-athlete-centered', 'Aligned with UToledo\'s "Power To Do" tone'].map(i => (
                      <li key={i} style={{ fontSize: 13, marginBottom: 5, lineHeight: 1.5 }}>{i}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </Section>

            {/* TECHNICAL PLATFORM */}
            <Section id="platform">
              <SectionLabel>07 - Technical Platform</SectionLabel>
              <h2 className="cs-h2">Sidearm is not a limitation - it is the canvas.</h2>
              <p>
                The campaign strategy is designed to deploy within the existing University of Toledo Athletics web ecosystem using Sidearm Sports capabilities. The core technical insight is that Sidearm Narrator - the platform&apos;s feature-page builder - can support immersive capital-campaign storytelling when given the right content architecture.
              </p>

              <h3 className="cs-h3">Sidearm Narrator capabilities used</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
                <LayerRow n="01" title="Full-Viewport Sections" items={['Feature-style campaign page', 'Cinematic hero section', 'Section-level storytelling']} />
                <LayerRow n="02" title="Parallax & Motion" items={['Scroll-triggered animations', 'Parallax scrolling sections', 'Entrance transitions for content blocks']} />
                <LayerRow n="03" title="Rendering Display" items={['Slider blocks for facility renderings', 'Full-bleed image sections', 'Before/after or multi-render comparisons']} />
                <LayerRow n="04" title="Conversion Modules" items={['Donation CTA integration', 'Campaign progress bar module', 'Rocket Fund / giving platform embed']} />
                <LayerRow n="05" title="Interactive Elements" items={['Embedded facility-tour maps', 'Interactive hotspots on floor plans', 'Naming-rights inquiry forms']} />
                <LayerRow n="06" title="Accessibility" items={['Skip links', 'Pause controls for motion', 'Responsive mobile-first layout', 'Mobile donation optimization']} />
              </div>

              <h3 className="cs-h3">Donor conversion elements</h3>
              <div className="two-col-cc">
                <div className="accent-card">
                  <div style={{ fontFamily: MONO, fontSize: 10, color: ACCENT, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>Always visible</div>
                  <ul style={{ margin: 0, padding: '0 0 0 16px' }}>
                    {['Persistent Donate CTA in header', 'Campaign progress bar', 'Leadership gift recognition', 'Student-athlete impact counter'].map(i => (
                      <li key={i} style={{ fontSize: 13, marginBottom: 5, lineHeight: 1.5 }}>{i}</li>
                    ))}
                  </ul>
                </div>
                <div className="accent-card">
                  <div style={{ fontFamily: MONO, fontSize: 10, color: ACCENT, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>Giving pathway</div>
                  <ul style={{ margin: 0, padding: '0 0 0 16px' }}>
                    {['Mobile-friendly donation flow', 'Digital wallet-ready giving', 'Recurring and pledge options', 'Naming-rights inquiry form', 'Rocket Fund integration'].map(i => (
                      <li key={i} style={{ fontSize: 13, marginBottom: 5, lineHeight: 1.5 }}>{i}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </Section>

            {/* LESSONS */}
            <Section id="lessons">
              <SectionLabel>08 - Lessons Learned</SectionLabel>
              <h2 className="cs-h2">What capital campaign strategy teaches you about digital storytelling.</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
                {[
                  ['Capital campaign websites are conversion systems', 'A page that informs but does not convert has failed. Every design decision - section order, rendering placement, CTA timing - serves the donor journey first.'],
                  ['Donor trust is built in sequence', 'Trust cannot be front-loaded. Donors need awe, then context, then social proof, then exploration, then legacy - before the ask arrives.'],
                  ['Renderings are narrative evidence, not decoration', 'A render placed without context is wallpaper. The same render tied to a student-athlete benefit becomes proof. Placement determines meaning.'],
                  ['Platform constraints sharpen strategy', 'Working within Sidearm Sports was not a limitation. It forced clarity about what actually needs to be custom versus what the platform handles well.'],
                  ['Two-audience design requires hierarchy, not compromise', 'Major gift donors and grassroots supporters do not need separate pages. They need a page where every section speaks to one of them - with the right elements surfaced for each.'],
                  ['The giving path deserves as much design attention as the hero', 'A donor who is emotionally ready to give and cannot find the path is a failed conversion. Friction kills momentum at exactly the wrong moment.'],
                ].map(([title, body]) => (
                  <div key={title} style={{ padding: '14px 18px', background: `${ACCENT}06`, border: `1px solid ${ACCENT}18`, borderRadius: 8 }}>
                    <div style={{ fontFamily: MONO, fontSize: 10, color: ACCENT, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6 }}>{title}</div>
                    <p style={{ margin: 0, fontSize: 13, lineHeight: 1.65 }}>{body}</p>
                  </div>
                ))}
              </div>
              {/* PROMPT FOR AHMAD: what actually broke on the Champions Complex campaign? This shipped as a strategy + content blueprint, not a deployed page, so nothing has failed in production. If a real setback surfaced during the strategy or stakeholder work, name it and a "What broke" block can go here. */}
              <div style={{ padding: '16px 18px', background: 'rgba(242,237,216,0.02)', border: '1px solid rgba(242,237,216,0.09)', borderRadius: 8 }}>
                <div style={{ fontFamily: MONO, fontSize: 10, color: '#F2EDD8', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>What I&apos;d do differently</div>
                <p style={{ margin: 0, fontSize: 13, lineHeight: 1.65 }}>
                  This is a blueprint, not a shipped page - the six-stage donor sequence is a hypothesis about what converts, not a measured result. If I take it further, I&apos;d get it live with funnel analytics and A/B testing on CTA copy and placement, so the sequence is validated rather than asserted.
                </p>
              </div>
            </Section>

            {/* FUTURE */}
            <Section id="future">
              <SectionLabel>09 - Future Work</SectionLabel>
              <h2 className="cs-h2">The blueprint is ready. The build is next.</h2>
              <p>
                The current work delivers the complete strategic and content architecture for the Champions Complex campaign page. The next phase is live deployment and optimization.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
                {[
                  { phase: 'Build', color: ACCENT, items: ['Live Sidearm/Narrator page deployment', 'Full rendering sequence integration', 'Campaign progress tracking module', 'Naming-rights inquiry forms'] },
                  { phase: 'Content', color: '#F0B429', items: ['Coach and student-athlete testimonials', 'Video content for hero section', 'Interactive facility map hotspots', 'Digital donor wall in Champions Corridor'] },
                  { phase: 'Optimize', color: '#A78BFA', items: ['Mobile donation flow optimization', 'A/B testing on CTA copy and placement', 'Analytics tracking for donor funnel behavior', 'Post-launch performance reporting'] },
                ].map(({ phase, color, items }) => (
                  <div key={phase} className="roadmap-row">
                    <div style={{ fontFamily: MONO, fontSize: 10, color, letterSpacing: '0.08em', textTransform: 'uppercase', flexShrink: 0, minWidth: 70, paddingTop: 2 }}>{phase}</div>
                    <ul style={{ margin: 0, padding: '0 0 0 16px' }}>
                      {items.map(item => <li key={item} style={{ fontSize: 13, marginBottom: 4, lineHeight: 1.5 }}>{item}</li>)}
                    </ul>
                  </div>
                ))}
              </div>

              <div style={{ padding: '24px 28px', background: `${ACCENT}08`, border: `1px solid ${ACCENT}22`, borderRadius: 10, marginTop: 32 }}>
                <p style={{ fontFamily: SERIF, fontSize: 15, color: '#F2EDD8', margin: '0 0 8px', lineHeight: 1.5 }}>
                  The physical facility builds champions. The digital campaign builds belief.
                </p>
                <p style={{ fontFamily: SERIF, fontSize: 14, color: '#B8B4A4', margin: 0, lineHeight: 1.6 }}>
                  Toledo is investing in student-athletes. Toledo is building for competitive excellence. Donors can be part of that legacy - and the webpage&apos;s job is to make that obvious.
                </p>
              </div>

              <div style={{ display: 'flex', gap: 10, marginTop: 32, flexWrap: 'wrap' }}>
                <SmartBackLink fallbackHref="/#projects" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '10px 20px', background: ACCENT, color: '#0B0D14', fontFamily: MONO, fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', borderRadius: 5, textTransform: 'uppercase', textDecoration: 'none' }}>← Back to Projects</SmartBackLink>
              </div>
            </Section>

          </div>

          {/* ── Sticky section nav ── */}
          <nav className="cs-sidebar-nav">
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
