'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Lightbox } from '@/components/ui/image-lightbox';
import { Pic } from '@/components/ui/pic';
import { resolveSkillColor } from '@/lib/skill-colors';

const SERIF  = "var(--font-chakra), 'Chakra Petch', sans-serif";
const MONO   = "var(--font-chakra), 'Chakra Petch', monospace";
const ACCENT = '#F472B6';

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

const SECTION_IDS    = ['overview', 'problem', 'architecture', 'geospatial', 'performance', 'infra', 'integrity', 'lessons', 'future'];
const SECTION_LABELS = ['Overview', 'Problem', 'Architecture', 'Geospatial', 'Performance', 'Infra / IaC', 'Integrity', 'Lessons', 'Future'];

export default function BattingCleanupCaseStudy() {
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
        .metrics-grid-bc { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; margin-bottom: 36px; }
        @media (max-width: 640px) { .metrics-grid-bc { grid-template-columns: repeat(2, 1fr); } }
        .two-col-bc { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        @media (max-width: 700px) { .two-col-bc { grid-template-columns: 1fr; } }
        .three-col-bc { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; }
        @media (max-width: 700px) { .three-col-bc { grid-template-columns: 1fr 1fr; } }
        @media (max-width: 480px) { .three-col-bc { grid-template-columns: 1fr; } }
        .info-card { padding: 16px 18px; background: rgba(242,237,216,0.02); border: 1px solid rgba(242,237,216,0.07); border-left: 2px solid ${ACCENT}50; border-radius: 8px; transition: all 0.2s ease; }
        .info-card:hover { border-color: ${ACCENT}40; background: ${ACCENT}0a; }
        .accent-card { padding: 16px 18px; background: ${ACCENT}04; border: 1px solid ${ACCENT}18; border-left: 2px solid ${ACCENT}90; border-radius: 8px; transition: all 0.2s ease; }
        .accent-card:hover { border-color: ${ACCENT}50; background: ${ACCENT}0c; }
        .live-badge { display: inline-flex; align-items: center; gap: 6px; padding: '4px 10px'; font-family: ${MONO}; font-size: 10px; letter-spacing: 0.1em; text-transform: uppercase; color: #4ade80; background: rgba(74,222,128,0.1); border: 1px solid rgba(74,222,128,0.3); border-radius: 20px; }
        .entity-card { padding: 16px 18px; background: ${ACCENT}04; border: 1px solid ${ACCENT}18; border-left: 2px solid ${ACCENT}90; border-radius: 8px; transition: all 0.2s ease; }
        .entity-card:hover { border-color: ${ACCENT}50; background: ${ACCENT}0c; }
        .entity-field { font-family: ${MONO}; font-size: 10px; color: var(--text3); padding: 2px 0; letter-spacing: 0.03em; }
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
        <Link href="/#projects" transitionTypes={['nav-back']} style={{ fontFamily: MONO, fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text3)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/></svg>
          Portfolio
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 10px', fontFamily: MONO, fontSize: 9, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#4ade80', background: 'rgba(74,222,128,0.08)', border: '1px solid rgba(74,222,128,0.25)', borderRadius: 20 }}>
            <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#4ade80', display: 'inline-block' }} />
            Live
          </span>
          <span style={{ fontFamily: MONO, fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: ACCENT }}>Batting Cleanup</span>
        </div>
        <div style={{ width: 80 }} />
      </header>

      {/* ── Hero ── */}
      <div style={{ padding: 'clamp(48px,8vh,96px) clamp(20px,5vw,80px) 0' }}>
        <div style={{ maxWidth: 860, margin: '0 auto' }}>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 20 }}>
            <Tag>Civic Tech</Tag>
            <Tag>In Production</Tag>
            <Tag>Geospatial Backend</Tag>
            <Tag>City of Toledo</Tag>
            <Tag>Applied Labs</Tag>
          </div>
          <h1 style={{ fontFamily: SERIF, fontSize: 'clamp(32px,5vw,56px)', fontWeight: 400, margin: '0 0 16px', lineHeight: 1.1, paddingBottom: '0.04em', background: `linear-gradient(135deg, #F2EDD8 70%, ${ACCENT} 100%)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', display: 'inline-block' }}>
            Batting Cleanup
          </h1>
          <p style={{ fontFamily: SERIF, fontSize: 'clamp(15px,2vw,18px)', color: '#B8B4A4', maxWidth: 620, lineHeight: 1.6, margin: '0 0 12px' }}>
            QR-code waste reporting for a smarter Toledo.
          </p>
          <p style={{ fontFamily: SERIF, fontSize: 15, color: 'var(--text3)', maxWidth: 640, lineHeight: 1.6, margin: '0 0 40px' }}>
            A production civic-tech platform connecting public QR-code reports, edge APIs, and PostGIS geospatial validation to improve downtown Toledo maintenance workflows.
          </p>

          <div className="metrics-grid-bc">
            <Metric value="Live" label="Production — downtown Toledo" />
            <Metric value="10K+" label="Localized assets in simulator" />
            <Metric value="<10ms" label="ST_DWithin geofence query" />
            <Metric value="GiST" label="Spatial index — no table scans" />
            <Metric value="7-dev" label="Docker Compose team environment" />
            <Metric value="Edge" label="Cloudflare Workers + Hono API" />
          </div>

          {/* Hero image */}
          <div style={{ width: '100%', borderRadius: 12, overflow: 'hidden', border: `1px solid ${ACCENT}18`, background: '#06080E', marginBottom: 64 }}>
            <Pic src="/Images/Batting_Cleanup.jpg" alt="Batting Cleanup" onClick={() => setLb('/Images/Batting_Cleanup.jpg')} style={{ width: '100%', display: 'block', objectFit: 'cover', cursor: 'zoom-in' }} priority />
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
              <SectionLabel>01 — Overview</SectionLabel>
              <h2 className="cs-h2">Not theoretical. Used by real people in a real city.</h2>
              <p>
                Batting Cleanup is a live smart-city waste reporting application deployed in downtown Toledo. The system lets residents scan QR codes placed near public waste assets and instantly file a maintenance report — overflowing trash, nearby litter, anything that needs attention.
              </p>
              <p>
                The project is more than a reporting form. It connects public-facing QR codes, edge-hosted APIs, geospatial validation, city asset telemetry, and backend data integrity into one civic technology platform. Residents get a low-friction way to report problems. Maintainers get structured, location-aware data to prioritize response.
              </p>
              <p>
                I contributed as a core backend engineer. My work transitioned the system from raw initialization scripts into a modern, type-safe Deno monorepo bridging Cloudflare Workers/Hono APIs with a PostGIS geospatial database — and built the spatial modeling, performance optimization, and validation infrastructure that makes the system reliable at city scale.
              </p>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 4, marginBottom: 4 }}>
                <a href="https://battingcleanup.appliedlabs.org/" target="_blank" rel="noopener" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 16px', background: ACCENT, color: '#0B0D14', fontFamily: MONO, fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', borderRadius: 5, textTransform: 'uppercase', textDecoration: 'none' }}>Documentation ↗</a>
                <a href="https://toledofreepress.com/batting-cleanup-aims-to-improve-toledo-maintenance-with-tech/" target="_blank" rel="noopener" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 16px', border: `1px solid ${ACCENT}40`, color: ACCENT, fontFamily: MONO, fontSize: 10, letterSpacing: '0.06em', borderRadius: 5, textTransform: 'uppercase', textDecoration: 'none' }}>Toledo Free Press ↗</a>
              </div>
            </Section>

            {/* PROBLEM */}
            <Section id="problem">
              <SectionLabel>02 — Problem</SectionLabel>
              <h2 className="cs-h2">Cities need better feedback loops for public infrastructure</h2>
              <p>
                Traditional waste maintenance workflows create friction on both sides: residents don&apos;t know who to contact, and maintenance teams receive incomplete, unlocated, or duplicate reports. The gap between &ldquo;a trash can is overflowing&rdquo; and &ldquo;a maintenance crew knows about it&rdquo; can be days.
              </p>
              <div className="two-col-bc" style={{ marginBottom: 24 }}>
                {[
                  ['No reporting path', 'Most residents have no simple way to report an overflowing trash can. Phone lines and 311 apps create friction that kills adoption.'],
                  ['Unlocated reports', 'Even when reports come in, they often lack precise asset location — just a street address, or nothing.'],
                  ['GPS noise downtown', 'Urban canyons and indoor environments degrade GPS accuracy. A naive location check will reject valid reports.'],
                  ['Spoofing risk', 'A public-facing system with no location validation is easy to flood with fake or mislocated reports.'],
                  ['Duplicate submissions', 'Multiple users report the same asset without any deduplication, creating noise for maintenance teams.'],
                  ['Local dev friction', 'A 7-person team doing manual database setup diverges quickly — inconsistent environments slow everyone down.'],
                ].map(([title, body]) => (
                  <div key={title} className="info-card">
                    <div style={{ fontFamily: MONO, fontSize: 10, color: ACCENT, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6 }}>{title}</div>
                    <p style={{ margin: 0, fontSize: 13, lineHeight: 1.6 }}>{body}</p>
                  </div>
                ))}
              </div>
              <p>
                Batting Cleanup solves the first-mile reporting problem by putting QR codes directly where the issue happens — no app install, no account, no friction. Scan, report, done.
              </p>
            </Section>

            {/* ARCHITECTURE */}
            <Section id="architecture">
              <SectionLabel>03 — Architecture</SectionLabel>
              <h2 className="cs-h2">Edge API → validation → PostGIS → city ops</h2>
              <p>
                The system flows from a physical QR code through an edge-hosted API, a type-safe service layer, and a geospatial database before surfacing structured data to city maintainers.
              </p>

              <h3 className="cs-h3">User reporting flow</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 24 }}>
                {[
                  ['1', 'Resident spots overflowing trash or litter near a QR-coded asset'],
                  ['2', 'Scans the QR code on their phone — no app install required'],
                  ['3', 'Public report form opens with the asset pre-identified'],
                  ['4', 'Resident selects issue type and optionally provides contact info'],
                  ['5', 'Backend validates report context: location, geofence, plausibility'],
                  ['6', 'Report stored with verification metadata in PostGIS database'],
                  ['7', 'Maintainers query structured, location-aware report data'],
                ].map(([n, step]) => (
                  <div key={n} style={{ display: 'flex', gap: 14, padding: '10px 16px', background: 'rgba(242,237,216,0.02)', border: '1px solid rgba(242,237,216,0.06)', borderRadius: 6 }}>
                    <span style={{ fontFamily: MONO, fontSize: 10, color: ACCENT, opacity: 0.7, flexShrink: 0, minWidth: 16 }}>{n}</span>
                    <span style={{ fontSize: 13, lineHeight: 1.5 }}>{step}</span>
                  </div>
                ))}
              </div>

              <h3 className="cs-h3">System layers</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 8 }}>
                <LayerRow n="01" title="Public QR Interface" items={['Physical QR codes downtown', 'Zero-install reporting', 'Optional contact info', 'Mobile-first flow']} />
                <LayerRow n="02" title="Edge API" items={['Cloudflare Workers', 'Hono REST routes', 'Fast public-facing handler', 'Lightweight serverless']} />
                <LayerRow n="03" title="Type-Safe Backend" items={['Deno monorepo', 'Drizzle ORM', 'Repository pattern', 'Service pattern', 'TypeScript schema']} />
                <LayerRow n="04" title="Geospatial Database" items={['PostgreSQL', 'PostGIS', 'Spatial asset models', 'GiST indexes', 'ST_DWithin geofence queries', 'Location verification logs']} />
                <LayerRow n="05" title="Validation Layer" items={['isIndoor flags', 'Geofence checks', 'Anti-spoofing logic', 'GPS uncertainty handling', 'Report plausibility metadata']} />
                <LayerRow n="06" title="Local Infrastructure" items={['Docker Compose', 'Alpine Linux', 'Bash automation', 'SQL hydration scripts', '10,000+ simulated assets']} />
              </div>
            </Section>

            {/* GEOSPATIAL */}
            <Section id="geospatial">
              <SectionLabel>04 — Geospatial Database Design</SectionLabel>
              <h2 className="cs-h2">Real-world location data is messier than static records</h2>
              <p>
                The database had to handle real-world GPS data, not clean coordinates. Each entity was modeled to preserve enough location context to support both query performance and validation logic.
              </p>
              <div className="three-col-bc" style={{ marginBottom: 24 }}>
                {[
                  { name: 'Waste Assets', fields: ['QR-code identity', 'Physical location (PostGIS)', 'Asset metadata', 'Report history', 'Geofence radius'] },
                  { name: 'Reports', fields: ['Submitted timestamp', 'Issue type', 'Associated asset', 'Optional contact', 'Device location', 'Verification status'] },
                  { name: 'Location Verification', fields: ['Reported coordinates', 'Expected asset coordinates', 'Distance from asset', 'isIndoor flag', 'GPS confidence', 'Spoofing indicators'] },
                  { name: 'Audit Trail', fields: ['Report context metadata', 'Validation outcomes', 'Timestamp chain', 'Source tracking'] },
                  { name: 'Simulator Data', fields: ['10,000+ generated assets', 'Relational report records', 'Geospatial test state', 'Repeatable seed data'] },
                  { name: 'Maintainer View', fields: ['Asset clusters', 'Report frequency', 'Recurring hotspots', 'Response status'] },
                ].map(({ name, fields }) => (
                  <div key={name} className="entity-card">
                    <div style={{ fontFamily: MONO, fontSize: 11, color: ACCENT, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 10 }}>{name}</div>
                    {fields.map(f => (
                      <div key={f} className="entity-field" style={{ paddingBottom: 3 }}>
                        <span style={{ color: ACCENT }}>— </span>{f}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
              <p>
                This structure lets the backend answer operational questions in real time: Is the user near the asset they&apos;re reporting? Are multiple reports clustering around one location? Which assets have recurring issues? How does query performance hold at city scale?
              </p>
            </Section>

            {/* PERFORMANCE */}
            <Section id="performance">
              <SectionLabel>05 — Performance Optimization</SectionLabel>
              <h2 className="cs-h2">B-Tree indexes don&apos;t work for proximity queries</h2>
              <p>
                A major engineering focus was geospatial query performance. The backend needs to run proximity checks on every report submission: Is this report within the expected geofence? Which asset is nearest to this coordinate? How many reports are clustered near this location?
              </p>
              <p>
                I benchmarked <code>ST_DWithin</code> geofence queries against 10,000+ localized assets. The initial run used standard B-Tree indexing — which is the PostgreSQL default but completely wrong for spatial distance lookups. B-Tree indexes sort by scalar value; they cannot efficiently prune the search space for a geometric &ldquo;within N meters&rdquo; query.
              </p>

              <div className="two-col-bc" style={{ marginBottom: 24 }}>
                <div className="info-card">
                  <div style={{ fontFamily: MONO, fontSize: 10, color: 'var(--text3)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>Before — B-Tree Index</div>
                  <p style={{ margin: 0, fontSize: 13, lineHeight: 1.6, color: 'var(--text3)' }}>Full table scan on every geofence query. Latency grows linearly with asset count. Not viable at city scale — every report submission triggers an O(n) scan across all assets.</p>
                </div>
                <div className="accent-card">
                  <div style={{ fontFamily: MONO, fontSize: 10, color: ACCENT, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>After — GiST Spatial Index</div>
                  <p style={{ margin: 0, fontSize: 13, lineHeight: 1.6 }}>GiST (Generalized Search Tree) indexes are designed for spatial lookup patterns. They prune the search space geometrically. Result: sub-10 ms <code>ST_DWithin</code> benchmarks against 10,000+ assets in the simulator.</p>
                </div>
              </div>

              <div style={{ padding: '16px 20px', background: 'rgba(244,114,182,0.06)', border: '1px solid rgba(244,114,182,0.18)', borderRadius: 8 }}>
                <div style={{ fontFamily: MONO, fontSize: 10, color: ACCENT, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>Key queries optimized</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {[
                    'Which asset is nearest to this submitted coordinate?',
                    'Is this report coordinate within the asset\'s geofence radius?',
                    'Which assets exist within a given bounding area?',
                    'How many reports are clustered within N meters of a location?',
                  ].map(q => (
                    <div key={q} style={{ display: 'flex', gap: 10, fontSize: 13, color: '#B8B4A4', lineHeight: 1.5 }}>
                      <span style={{ color: ACCENT, flexShrink: 0 }}>→</span>
                      <span>{q}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Section>

            {/* INFRA */}
            <Section id="infra">
              <SectionLabel>06 — Infrastructure as Code</SectionLabel>
              <h2 className="cs-h2">Reproducible local environments for a 7-person team</h2>
              <p>
                Manual database setup across a 7-person team creates drift fast. One developer has a different schema version, another has stale seed data, a third has a different PostGIS extension installed. These inconsistencies slow everyone down and hide bugs that only appear in certain environments.
              </p>
              <p>
                I helped create reproducible local development infrastructure using Docker Compose and Alpine Linux containers, scripted with Bash and SQL initialization files. The local simulator generates a fully hydrated, geospatially accurate development environment from scratch in a single command.
              </p>

              <div className="two-col-bc" style={{ marginBottom: 24 }}>
                <div className="accent-card">
                  <div style={{ fontFamily: MONO, fontSize: 10, color: ACCENT, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>Local simulator generates</div>
                  <ul style={{ margin: 0, padding: '0 0 0 16px' }}>
                    {['10,000+ localized waste assets', 'Relational report records', 'Geospatially accurate test coordinates', 'Repeatable development seed state', 'PostGIS extension and GiST indexes pre-configured'].map(i => (
                      <li key={i} style={{ fontSize: 13, marginBottom: 5, lineHeight: 1.5 }}>{i}</li>
                    ))}
                  </ul>
                </div>
                <div className="accent-card">
                  <div style={{ fontFamily: MONO, fontSize: 10, color: ACCENT, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>What this eliminates</div>
                  <ul style={{ margin: 0, padding: '0 0 0 16px' }}>
                    {['Schema version drift between developers', 'Manual PostGIS setup steps', 'Stale or inconsistent seed data', 'Reliance on production data for testing', '"Works on my machine" environment bugs'].map(i => (
                      <li key={i} style={{ fontSize: 13, marginBottom: 5, lineHeight: 1.5 }}>{i}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <h3 className="cs-h3">Stack</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <LayerRow n="IaC" title="Infrastructure" items={['Docker Compose', 'Alpine Linux containers', 'Bash automation scripts', 'SQL initialization files', 'Conditional hydration logic']} />
              </div>
            </Section>

            {/* INTEGRITY */}
            <Section id="integrity">
              <SectionLabel>07 — Data Integrity & Anti-Spoofing</SectionLabel>
              <h2 className="cs-h2">Public-facing systems attract imperfect data</h2>
              <p>
                Because Batting Cleanup is publicly accessible, the backend must handle a wide range of real-world edge cases — not as errors to reject, but as signals to classify. The goal is not to block every imperfect report; it is to preserve enough verification context that the system can distinguish trusted, uncertain, and suspicious submissions.
              </p>

              <h3 className="cs-h3">Real-world edge cases</h3>
              <div className="two-col-bc" style={{ marginBottom: 24 }}>
                {[
                  ['GPS inaccuracy downtown', 'Urban canyons and tall buildings degrade mobile GPS accuracy. A report 30m from the asset may still be legitimate.'],
                  ['Location permission denied', 'A user may scan a QR code but decline to share their location. The report is still valid — the QR code already identifies the asset.'],
                  ['Indoor submissions', 'A user near a public trash can inside a lobby may have GPS coordinates that appear far from the street asset.'],
                  ['Distant submissions', 'Users may attempt to file reports from far away — either mistakenly or maliciously.'],
                  ['Duplicate reports', 'Multiple users may report the same asset in a short window without knowing others already did.'],
                  ['Spoofed coordinates', 'A bad actor may attempt to inject fake location data to flood or mislead the maintenance system.'],
                ].map(([title, body]) => (
                  <div key={title} className="info-card">
                    <div style={{ fontFamily: MONO, fontSize: 10, color: ACCENT, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6 }}>{title}</div>
                    <p style={{ margin: 0, fontSize: 13, lineHeight: 1.6 }}>{body}</p>
                  </div>
                ))}
              </div>

              <h3 className="cs-h3">Validation mechanisms</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[
                  { flag: 'isIndoor', desc: 'Flags reports where device signals suggest an indoor environment — preserved as metadata rather than rejected.' },
                  { flag: 'Location verification log', desc: 'Stores reported coordinates, expected asset coordinates, computed distance, and GPS confidence alongside every report.' },
                  { flag: 'Geofence check', desc: 'ST_DWithin validates whether the submitted location is within the asset\'s configured radius.' },
                  { flag: 'Plausibility metadata', desc: 'Contextual signals (distance, confidence, indoor flag) are stored to support downstream filtering and trust scoring.' },
                  { flag: 'Audit trail', desc: 'Structured record of report context allows maintainers and analysts to review submission quality over time.' },
                ].map(({ flag, desc }) => (
                  <div key={flag} style={{ display: 'flex', gap: 14, padding: '12px 16px', background: 'rgba(242,237,216,0.02)', border: '1px solid rgba(242,237,216,0.07)', borderRadius: 6 }}>
                    <code style={{ flexShrink: 0, alignSelf: 'flex-start', marginTop: 1 }}>{flag}</code>
                    <p style={{ margin: 0, fontSize: 13, lineHeight: 1.5, color: '#B8B4A4' }}>{desc}</p>
                  </div>
                ))}
              </div>
            </Section>

            {/* LESSONS */}
            <Section id="lessons">
              <SectionLabel>08 — Lessons Learned</SectionLabel>
              <h2 className="cs-h2">What production civic software teaches you</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
                {[
                  ['Geospatial data needs specialized indexes', 'B-Tree indexes are the PostgreSQL default but useless for distance queries. GiST is not an optimization — it is a correctness requirement for spatial workloads.'],
                  ['Production civic software handles imperfect input', 'Real-world users scan QR codes in parking garages, deny location permissions, and submit from unpredictable environments. The system must tolerate all of it gracefully.'],
                  ['Dockerized environments save team time compounding', 'Local environment drift across 7 developers is slow, annoying, and hard to debug. A reproducible setup script pays for itself the first week.'],
                  ['Repository/service separation makes code scalable', 'Keeping persistence logic out of API handlers and business logic out of repositories made the codebase much easier to test, extend, and reason about.'],
                  ['Edge APIs need careful database boundary design', 'Cloudflare Workers are powerful but stateless. The handoff between edge handler and database layer must be explicit — connection pooling, timeouts, and error propagation all matter.'],
                  ['Real city deployments surface edge cases no classroom project reveals', 'GPS noise, QR code durability, public network reliability, and user behavior at scale are not theoretical concerns. They show up immediately.'],
                ].map(([title, body]) => (
                  <div key={title} style={{ padding: '14px 18px', background: `${ACCENT}06`, border: `1px solid ${ACCENT}18`, borderRadius: 8 }}>
                    <div style={{ fontFamily: MONO, fontSize: 10, color: ACCENT, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6 }}>{title}</div>
                    <p style={{ margin: 0, fontSize: 13, lineHeight: 1.65 }}>{body}</p>
                  </div>
                ))}
              </div>
              <div className="two-col-bc">
                <div style={{ padding: '16px 18px', background: `${ACCENT}0c`, border: `1px solid ${ACCENT}30`, borderRadius: 8 }}>
                  <div style={{ fontFamily: MONO, fontSize: 10, color: ACCENT, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>What broke</div>
                  <p style={{ margin: 0, fontSize: 13, lineHeight: 1.65 }}>
                    The first geofence benchmark ran on PostgreSQL&apos;s default B-Tree index and fell over — every report submission triggered a full table scan, latency growing linearly with asset count. Not viable at city scale. Moving to a GiST spatial index dropped <code>ST_DWithin</code> to sub-10 ms across 10,000+ assets.
                  </p>
                </div>
                <div style={{ padding: '16px 18px', background: 'rgba(242,237,216,0.02)', border: '1px solid rgba(242,237,216,0.09)', borderRadius: 8 }}>
                  <div style={{ fontFamily: MONO, fontSize: 10, color: '#F2EDD8', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>What I&apos;d do differently</div>
                  <p style={{ margin: 0, fontSize: 13, lineHeight: 1.65 }}>
                    Duplicate reports are stored and flagged today, not merged — several people reporting one overflowing can still land as separate rows. I&apos;d fold deduplication and clustering into the write path, so maintainers see one asset with N reports instead of N rows of noise.
                  </p>
                </div>
              </div>
            </Section>

            {/* FUTURE */}
            <Section id="future">
              <SectionLabel>09 — Future Work</SectionLabel>
              <h2 className="cs-h2">The reporting layer is the foundation</h2>
              <p>
                The current system solves the first-mile problem: getting structured, location-aware reports from residents into a reliable database. The next phase turns that data into operational intelligence for city maintainers.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
                {[
                  { phase: 'Operations', color: ACCENT, items: ['Live operations dashboard for city maintainers', 'SLA tracking for report resolution time', 'Route optimization for cleanup crews', 'Automated escalation rules for high-frequency assets'] },
                  { phase: 'Intelligence', color: '#F0B429', items: ['Report deduplication and clustering', 'Heatmaps for recurring waste hotspots', 'Anomaly detection for spam or suspicious report patterns', 'Analytics for seasonality, event impact, and foot traffic correlation'] },
                  { phase: 'Public', color: '#4B7BF5', items: ['Public transparency metrics dashboard', 'Richer QR-code asset metadata and status pages', 'Notification system for users who filed reports', 'Expanded coverage beyond downtown Toledo'] },
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
                  The hard part was not making a form. The hard part was making location-aware public reporting reliable enough for real city use.
                </p>
                <p style={{ fontFamily: SERIF, fontSize: 14, color: '#B8B4A4', margin: 0, lineHeight: 1.6 }}>
                  Cleaner cities need better feedback loops. Batting Cleanup is the first one.
                </p>
              </div>

              <div style={{ display: 'flex', gap: 10, marginTop: 32, flexWrap: 'wrap' }}>
                <Link href="/#projects" transitionTypes={['nav-back']} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '10px 20px', background: ACCENT, color: '#0B0D14', fontFamily: MONO, fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', borderRadius: 5, textTransform: 'uppercase', textDecoration: 'none' }}>← Back to Projects</Link>
                <a href="https://battingcleanup.appliedlabs.org/" target="_blank" rel="noopener" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '10px 20px', border: `1px solid ${ACCENT}40`, color: ACCENT, fontFamily: MONO, fontSize: 10, letterSpacing: '0.06em', borderRadius: 5, textTransform: 'uppercase', textDecoration: 'none' }}>Documentation ↗</a>
                <a href="https://toledofreepress.com/batting-cleanup-aims-to-improve-toledo-maintenance-with-tech/" target="_blank" rel="noopener" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '10px 20px', border: '1px solid rgba(242,237,216,0.12)', color: '#B8B4A4', fontFamily: MONO, fontSize: 10, letterSpacing: '0.06em', borderRadius: 5, textTransform: 'uppercase', textDecoration: 'none' }}>Toledo Free Press ↗</a>
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
