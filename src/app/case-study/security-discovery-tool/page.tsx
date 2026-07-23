'use client';

import React, { useEffect, useState } from 'react';
import { SmartBackLink } from '@/components/ui/smart-back-link';
import { Lightbox } from '@/components/ui/image-lightbox';
import { Pic } from '@/components/ui/pic';
import { resolveSkillColor } from '@/lib/skill-colors';

const SERIF  = "var(--font-chakra), 'Chakra Petch', sans-serif";
const MONO   = "var(--font-chakra), 'Chakra Petch', monospace";
const ACCENT = '#2dd4bf';

const PALETTE = ['#f59e0b','#5b8af5','#2dd4bf','#f0823c','#a78bfa','#f472b6','#38bdf8','#22C55E','#ef4444'];
function pickColor(text: string) {
  let h = 0;
  for (let i = 0; i < text.length; i++) h = (h * 31 + text.charCodeAt(i)) >>> 0;
  return PALETTE[h % PALETTE.length];
}

function Tag({ children, color }: { children: React.ReactNode; color?: string }) {
  const c = color ?? (typeof children === 'string' ? (resolveSkillColor(children) ?? pickColor(children)) : ACCENT);
  return (
    <span style={{ fontFamily: MONO, fontSize: 10, padding: '3px 8px', background: `${c}14`, border: `1px solid ${c}30`, borderRadius: 4, color: c, letterSpacing: '0.03em' }}>
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

function DbLayer({ n, title, items, color = ACCENT }: { n: string; title: string; items: string[]; color?: string }) {
  return (
    <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start', padding: '14px 18px', background: `${color}06`, border: `1px solid ${color}18`, borderRadius: 8 }}>
      <div style={{ fontFamily: MONO, fontSize: 10, color, opacity: 0.6, flexShrink: 0, minWidth: 22, marginTop: 1 }}>{n}</div>
      <div style={{ flex: 1 }}>
        <div style={{ fontFamily: MONO, fontSize: 11, color, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6 }}>{title}</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
          {items.map(item => { const ic = resolveSkillColor(item) ?? pickColor(item); return (
            <span key={item} style={{ fontFamily: MONO, fontSize: 10, color: ic, padding: '2px 7px', background: `${ic}12`, border: `1px solid ${ic}30`, borderRadius: 4 }}>{item}</span>
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

const SECTION_IDS    = ['overview', 'problem', 'solution', 'architecture', 'stack', 'results', 'lessons', 'future'];
const SECTION_LABELS = ['Overview', 'Problem', 'Solution', 'Architecture', 'Stack', 'Results', 'Lessons', 'Future'];

export default function SecurityDiscoveryToolCaseStudy() {
  const active = useActiveSection(SECTION_IDS);
  const [scrolled, setScrolled] = useState(false);
  const [lb, setLb] = useState<string | null>(null);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div style={{ background: 'var(--background)', minHeight: '100vh', color: 'var(--text2)' }}>
      <style>{`
        body { background: var(--background); }
        .cs-body { font-family: ${SERIF}; font-size: 15px; line-height: 1.75; color: var(--text2); }
        .cs-body p { margin: 0 0 14px; }
        .cs-body ul { margin: 0 0 14px; padding-left: 20px; }
        .cs-body li { margin-bottom: 6px; }
        .cs-body li::marker { color: ${ACCENT}; }
        .cs-h2 { font-family: ${SERIF}; font-size: 20px; color: var(--foreground); font-weight: 400; margin: 0 0 18px; line-height: 1.2; padding-bottom: 0.04em; }
        .cs-h3 { font-family: ${MONO}; font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase; color: ${ACCENT}; margin: 24px 0 10px; }
        .metrics-grid-sdt { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; margin-bottom: 36px; }
        @media (max-width: 640px) { .metrics-grid-sdt { grid-template-columns: repeat(2, 1fr); } }
        .two-col-sdt { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
        @media (max-width: 700px) { .two-col-sdt { grid-template-columns: 1fr; } }
        .three-col-sdt { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; }
        @media (max-width: 700px) { .three-col-sdt { grid-template-columns: 1fr 1fr; } }
        @media (max-width: 480px) { .three-col-sdt { grid-template-columns: 1fr; } }
        .entity-card { padding: 16px 18px; background: ${ACCENT}04; border: 1px solid ${ACCENT}18; border-radius: 8px; transition: all 0.2s ease; }
        .entity-card:hover { border-color: ${ACCENT}50; background: ${ACCENT}0c; }
        .entity-field { font-family: ${MONO}; font-size: 10px; color: var(--text3); padding: '2px 0'; letter-spacing: 0.03em; }
        .entity-key { color: ${ACCENT}; }
        .principle-card { padding: 16px 18px; background: rgba(242,237,216,0.02); border: 1px solid rgba(244,244,242,0.07); border-radius: 8px; transition: all 0.2s ease; }
        .principle-card:hover { border-color: ${ACCENT}40; background: ${ACCENT}0a; }
        .roadmap-row { display: flex; gap: 14px; padding: 16px 18px; background: rgba(242,237,216,0.02); border: 1px solid rgba(244,244,242,0.06); border-radius: 8px; align-items: flex-start; transition: all 0.2s ease; }
        .roadmap-row:hover { border-color: ${ACCENT}40; background: ${ACCENT}06; }
        .nav-link { font-family: ${MONO}; font-size: 10px; letter-spacing: 0.08em; text-transform: uppercase; text-decoration: none; transition: color 0.2s; padding: 4px 0; cursor: pointer; background: none; border: none; }
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
        <span style={{ fontFamily: MONO, fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: ACCENT }}>Security Discovery Tool</span>
        <div style={{ width: 80 }} />
      </header>

      {/* ── Hero ── */}
      <div style={{ padding: 'clamp(48px,8vh,96px) clamp(20px,5vw,80px) 0' }}>
        <div style={{ maxWidth: 860, margin: '0 auto' }}>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 20 }}>
            <Tag>Database Engineering</Tag>
            <Tag>Cybersecurity</Tag>
            <Tag>AIIS Summer 2023</Tag>
            <Tag>Park Place Technologies</Tag>
          </div>
          <h1 style={{ fontFamily: SERIF, fontSize: 'var(--text-3xl)', fontWeight: 400, margin: '0 0 16px', lineHeight: 1.1, paddingBottom: '0.04em', background: `linear-gradient(135deg, var(--foreground) 70%, ${ACCENT} 100%)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', display: 'inline-block' }}>
            Security Discovery Tool
          </h1>
          <p style={{ fontFamily: SERIF, fontSize: 16, color: 'var(--text2)', maxWidth: 620, lineHeight: 1.6, margin: '0 0 40px' }}>
            A database-centered cybersecurity project that centralized security discovery data across enterprise sources to improve visibility, data integrity, reporting quality, and incident-response readiness.
          </p>

          <div className="metrics-grid-sdt">
            <Metric value="15%" label="Faster incident response" />
            <Metric value="95%" label="Data integrity improvement" />
            <Metric value="Zero" label="Data loss in DR tests" />
            <Metric value="3" label="Consolidated security sources" />
            <Metric value="AIIS" label="Summer 2023 industry cohort" />
            <Metric value="100%" label="On-time project delivery" />
          </div>

          {/* Hero image */}
          <div style={{ width: '100%', borderRadius: 10, overflow: 'hidden', border: `1px solid ${ACCENT}18`, background: 'var(--background)', marginBottom: 64 }}>
            <Pic src="/Images/sdt_tool.png" alt="Security Discovery Tool" onClick={() => setLb('/Images/sdt_tool.png')} style={{ width: '100%', display: 'block', objectFit: 'cover', cursor: 'zoom-in' }} priority />
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
              <h2 className="cs-h2">Centralizing security data is a database problem</h2>
              <p>
                Security Discovery Tool was completed as part of the Academic Industry Immersion Seminar (AIIS) during Summer 2023, connected to a Park Place Technologies industry case study. Working as part of the Database I team, the project focused on a database-first solution to a persistent operations problem: security data scattered across multiple disconnected systems.
              </p>
              <p>
                The goal was to design a centralized PostgreSQL security database that could consolidate discovery data from enterprise sources - Active Directory, Cisco AMP, and Microsoft Defender - and make that data trustworthy enough to drive faster reporting, cleaner validation, and more confident incident response.
              </p>
              <p>
                Instead of treating the database as just a storage layer, the work framed it as a security capability: clean schemas, referential integrity, validation rules, source tracking, and recovery planning can directly improve how quickly and confidently a security team responds to threats.
              </p>
            </Section>

            {/* PROBLEM */}
            <Section id="problem">
              <SectionLabel>02 - Problem</SectionLabel>
              <h2 className="cs-h2">Fragmented security data slows everything down</h2>
              <p>
                Security teams need accurate and timely data to understand their environment. But in practice, that data is rarely in one place. Identity records live in Active Directory. Endpoint protection logs sit in Cisco AMP. Threat detections come from Microsoft Defender. Device inventories are maintained in spreadsheets. Compliance documentation is in separate folders.
              </p>
              <p>When these sources are disconnected, several problems compound:</p>
              <div className="two-col-sdt" style={{ marginBottom: 24 }}>
                {[
                  ['Slow lookup', 'Analysts spend time searching across tools instead of responding to threats.'],
                  ['Inconsistent records', 'The same asset may have different names, statuses, or owners across systems.'],
                  ['Delayed response', 'Incident triage slows when data has to be manually cross-referenced.'],
                  ['Weak auditability', 'Without a central record, compliance reporting becomes labor-intensive.'],
                  ['Stale data', 'Duplicate or outdated entries can mislead risk assessments.'],
                  ['Hard recovery', 'Scattered data makes disaster-recovery planning and verification difficult.'],
                ].map(([title, body]) => (
                  <div key={title} className="principle-card">
                    <div style={{ fontFamily: MONO, fontSize: 10, color: ACCENT, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6 }}>{title}</div>
                    <p style={{ margin: 0, fontSize: 13, lineHeight: 1.6 }}>{body}</p>
                  </div>
                ))}
              </div>
              <p>
                The project addressed this problem from the database side: improve the structure, validation, and governance of the security data layer so that analysts and systems above it can operate more reliably.
              </p>
            </Section>

            {/* SOLUTION */}
            <Section id="solution">
              <SectionLabel>03 - Solution</SectionLabel>
              <h2 className="cs-h2">A validated, centralized security database</h2>
              <p>
                The proposed solution was a centralized security discovery database. Instead of leaving security information scattered across tools, the system would collect and normalize records into a consistent relational schema - acting as a trusted layer for reporting, validation, analysis, and response workflows.
              </p>
              <h3 className="cs-h3">Five-stage data pipeline</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
                <DbLayer n="01" title="Source Systems" items={['Active Directory', 'Cisco AMP', 'Microsoft Defender', 'Endpoint inventory exports', 'Manual security reports']} />
                <DbLayer n="02" title="Ingestion & Normalization" items={['Import records from source systems', 'Standardize naming conventions', 'Normalize device / user / event fields', 'Remove duplicates', 'Resolve inconsistent entries']} />
                <DbLayer n="03" title="Central PostgreSQL Database" items={['Security asset tables', 'User & identity tables', 'Endpoint protection tables', 'Vulnerability / alert tables', 'Audit & update history']} />
                <DbLayer n="04" title="Validation & Governance" items={['Required-field checks', 'Referential integrity', 'Duplicate detection', 'Status validation', 'Timestamp & source tracking', 'Compliance documentation']} />
                <DbLayer n="05" title="Reporting & Response" items={['Analyst query views', 'Incident-response lookup', 'Compliance exports', 'Future dashboard integration']} />
              </div>

              <h3 className="cs-h3">Design principles</h3>
              <div className="two-col-sdt" style={{ marginBottom: 8 }}>
                {[
                  ['Centralization', 'One reliable place to query asset and security posture data reduces manual lookup time and makes reporting repeatable.'],
                  ['Data integrity', 'Security decisions are only as good as the data behind them. Validation rules, required fields, and referential integrity enforce that quality.'],
                  ['Traceability', 'Every record should preserve source, timestamp, and change history to support audits and compliance workflows.'],
                  ['Maintainability', 'Documentation, naming conventions, and schema clarity ensure future engineers can extend the system without breaking it.'],
                  ['Recovery readiness', 'Disaster-recovery procedures and backup validation ensure the database can recover without data loss.'],
                  ['Operational fit', 'Validation rules must balance strictness with flexibility - a rule that blocks useful data fails its purpose.'],
                ].map(([title, body]) => (
                  <div key={title} className="principle-card">
                    <div style={{ fontFamily: MONO, fontSize: 10, color: ACCENT, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6 }}>{title}</div>
                    <p style={{ margin: 0, fontSize: 13, lineHeight: 1.6 }}>{body}</p>
                  </div>
                ))}
              </div>
            </Section>

            {/* ARCHITECTURE */}
            <Section id="architecture">
              <SectionLabel>04 - Architecture</SectionLabel>
              <h2 className="cs-h2">Schema built for security operations</h2>
              <p>
                The database schema was designed around the key entities a security team needs to query: assets, users, endpoint protection records, security findings, and audit logs. Every table was designed with source tracking and change history in mind.
              </p>
              <div className="three-col-sdt" style={{ marginBottom: 24 }}>
                {[
                  { name: 'Assets', fields: ['asset_id', 'hostname', 'device_type', 'owner', 'department', 'operating_system', 'last_seen', 'security_status'] },
                  { name: 'Users', fields: ['user_id', 'username', 'email', 'department', 'role', 'account_status', 'last_login'] },
                  { name: 'Security Tools', fields: ['tool_id', 'tool_name', 'source_type', 'integration_status'] },
                  { name: 'Endpoint Protection', fields: ['endpoint_id', 'asset_id', 'protection_status', 'agent_version', 'last_scan_time', 'threat_count'] },
                  { name: 'Alerts / Findings', fields: ['finding_id', 'asset_id', 'severity', 'category', 'status', 'assigned_owner', 'created_at', 'resolved_at'] },
                  { name: 'Audit Logs', fields: ['audit_id', 'table_name', 'record_id', 'action', 'source', 'changed_by', 'changed_at'] },
                ].map(({ name, fields }) => (
                  <div key={name} className="entity-card">
                    <div style={{ fontFamily: MONO, fontSize: 11, color: ACCENT, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 10 }}>{name}</div>
                    {fields.map(f => (
                      <div key={f} className="entity-field" style={{ paddingBottom: 3 }}>
                        <span className="entity-key">- </span>{f}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
              <p>
                This relational structure supports stronger reporting than disconnected spreadsheets because records can be joined, validated, audited, and queried consistently. The <code style={{ fontFamily: MONO, fontSize: 12, color: ACCENT, background: `${ACCENT}10`, padding: '1px 5px', borderRadius: 4 }}>audit_logs</code> table in particular ensures every data change is traceable - who changed it, when, and from which source system.
              </p>
            </Section>

            {/* STACK */}
            <Section id="stack">
              <SectionLabel>05 - Technical Stack</SectionLabel>
              <h2 className="cs-h2">Database tools and security context</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
                <DbLayer n="DB" title="Database & Query" items={['PostgreSQL', 'MySQL', 'SQLite', 'pgAdmin 4', 'SQL', 'DBMS concepts']} />
                <DbLayer n="SEC" title="Security Data Sources" items={['Active Directory', 'Cisco AMP', 'Microsoft Defender', 'Endpoint inventory', 'Security event feeds']} />
                <DbLayer n="GOV" title="Data Governance" items={['Validation rules', 'Referential integrity', 'Disaster recovery planning', 'Quarterly DR simulations', 'Compliance documentation']} />
                <DbLayer n="DOC" title="Documentation & Collaboration" items={['Technical documentation', 'Executive summary', 'Industry case study format', 'Team-based project execution']} />
              </div>

              <h3 className="cs-h3">Stack tags</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {['PostgreSQL', 'MySQL', 'SQLite', 'pgAdmin 4', 'SQL', 'Active Directory', 'Cisco AMP', 'Microsoft Defender', 'Data Governance', 'Disaster Recovery', 'Incident Response', 'Compliance Documentation'].map(t => (
                  <Tag key={t}>{t}</Tag>
                ))}
              </div>
            </Section>

            {/* RESULTS */}
            <Section id="results">
              <SectionLabel>06 - Results & Impact</SectionLabel>
              <h2 className="cs-h2">Database engineering as a security capability</h2>
              <p>
                The project demonstrated that a well-designed database is not just a storage layer - it can directly improve security operations. The outcomes connected classroom database concepts to real cybersecurity workflows.
              </p>
              <div className="two-col-sdt" style={{ marginBottom: 24 }}>
                {[
                  ['15% faster incident response', 'Consolidated queries replaced manual cross-tool lookup, reducing time-to-answer for analysts.'],
                  ['95% data integrity improvement', 'Validation rules and normalization eliminated duplicate, stale, and inconsistent security records across reporting workflows.'],
                  ['Zero data loss in DR tests', 'Quarterly disaster-recovery simulations confirmed backup integrity and recovery procedures under simulated failure conditions.'],
                  ['3 sources centralized', 'Active Directory, Cisco AMP, and Microsoft Defender data unified into a single queryable schema.'],
                  ['Regulatory adherence', 'Validation rules designed to support compliance-friendly record keeping and audit-ready change history.'],
                  ['On-time delivery', 'Full case study project completed on schedule within the AIIS Summer 2023 cohort timeline.'],
                ].map(([title, body]) => (
                  <div key={title} className="principle-card">
                    <div style={{ fontFamily: MONO, fontSize: 10, color: ACCENT, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6 }}>{title}</div>
                    <p style={{ margin: 0, fontSize: 13, lineHeight: 1.6 }}>{body}</p>
                  </div>
                ))}
              </div>
            </Section>

            {/* LESSONS */}
            <Section id="lessons">
              <SectionLabel>07 - Lessons Learned</SectionLabel>
              <h2 className="cs-h2">What this project actually taught</h2>
              <p>
                This was one of my first experiences applying computer science skills to a real engineering business problem. A few lessons stuck:
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
                {[
                  ['Database design is a security tool', 'A validated schema with referential integrity, source tracking, and audit logs is not just good engineering - it is a security control. Clean data enables better detection, faster response, and credible compliance.'],
                  ['Validation must balance strictness', 'Validation rules that block too much data fail their operational purpose. The right rule improves quality without stopping useful information from entering the system.'],
                  ['Documentation is part of the engineering', 'Security and compliance systems only stay useful if they are understandable. Maintainable schemas, clear naming conventions, and written procedures reduce the risk of the system becoming a black box.'],
                  ['Industry projects require more than implementation', 'AIIS-style projects demand communication, planning, stakeholder alignment, and trade-off analysis. The database schema was only one deliverable; the ability to explain its value mattered just as much.'],
                  ['Data quality problems are usually not adversarial', 'Most inconsistencies in security data come from mismatched tooling conventions meeting at a shared boundary - not from external threats. Fixing the data layer fixes the downstream problem.'],
                ].map(([title, body]) => (
                  <div key={title} style={{ padding: '14px 18px', background: `${ACCENT}06`, border: `1px solid ${ACCENT}18`, borderRadius: 8 }}>
                    <div style={{ fontFamily: MONO, fontSize: 10, color: ACCENT, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6 }}>{title}</div>
                    <p style={{ margin: 0, fontSize: 13, lineHeight: 1.65 }}>{body}</p>
                  </div>
                ))}
              </div>
              <div className="two-col-sdt">
                <div style={{ padding: '16px 18px', background: `${ACCENT}0c`, border: `1px solid ${ACCENT}30`, borderRadius: 8 }}>
                  <div style={{ fontFamily: MONO, fontSize: 10, color: ACCENT, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>What broke</div>
                  <p style={{ margin: 0, fontSize: 13, lineHeight: 1.65 }}>
                    The validation layer was the real friction, not the schema. Rules strict enough to kill duplicate and stale records also threatened to reject legitimate entries - and a rule that blocks useful data fails its purpose. Tuning that balance, run after run, was the part that actually took the time.
                  </p>
                </div>
                <div style={{ padding: '16px 18px', background: 'rgba(242,237,216,0.02)', border: '1px solid rgba(244,244,242,0.09)', borderRadius: 8 }}>
                  <div style={{ fontFamily: MONO, fontSize: 10, color: 'var(--foreground)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>What I&apos;d do differently</div>
                  <p style={{ margin: 0, fontSize: 13, lineHeight: 1.65 }}>
                    Ingestion was manual - records were imported and normalized by hand. I&apos;d build automated connectors for Active Directory, Cisco AMP, and Defender from the start, so the central database stays continuously fresh instead of depending on someone remembering to pull the next export.
                  </p>
                </div>
              </div>
            </Section>

            {/* FUTURE */}
            <Section id="future">
              <SectionLabel>08 - Future Work</SectionLabel>
              <h2 className="cs-h2">Where this goes next</h2>
              <p>
                The core database design establishes a foundation that could be extended into a full security operations platform. A phased roadmap:
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
                {[
                  { phase: 'Near-Term', color: ACCENT, items: ['Live dashboard for security posture and asset health', 'Automated ingestion connectors for Active Directory, Defender, and endpoint tools', 'Role-based access control for analysts, admins, and auditors'] },
                  { phase: 'Mid-Term', color: '#f59e0b', items: ['Alert prioritization and severity scoring engine', 'Historical trend analysis for endpoint risk', 'Data-quality scoring for missing, stale, or conflicting records', 'Automated compliance report generation'] },
                  { phase: 'Long-Term', color: '#a78bfa', items: ['Anomaly detection for unusual asset or account behavior', 'Audit-ready change history for all critical records', 'Backup verification and DR-status dashboards', 'Cross-tenant federation for multi-org environments'] },
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
                <p style={{ fontFamily: SERIF, fontSize: 15, color: 'var(--foreground)', margin: '0 0 8px', lineHeight: 1.5 }}>
                  Security teams often focus on tools, alerts, and dashboards. But behind every security workflow is data. If that data is fragmented, inconsistent, or poorly governed, even advanced tools become less effective.
                </p>
                <p style={{ fontFamily: SERIF, fontSize: 14, color: 'var(--text2)', margin: 0, lineHeight: 1.6 }}>
                  The Security Discovery Tool project shows that database design is a cybersecurity capability - one that scales across every other layer of the stack.
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



