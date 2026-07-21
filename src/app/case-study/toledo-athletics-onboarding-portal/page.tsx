'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Lightbox } from '@/components/ui/image-lightbox';
import { Pic } from '@/components/ui/pic';
import { resolveSkillColor } from '@/lib/skill-colors';

const SERIF  = "var(--font-chakra), 'Chakra Petch', sans-serif";
const MONO   = "var(--font-chakra), 'Chakra Petch', monospace";
const ACCENT = '#22C55E';

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

function DbLayer({ n, title, items, color = ACCENT }: { n: string; title: string; items: string[]; color?: string }) {
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

const SECTION_IDS    = ['overview', 'problem', 'solution', 'architecture', 'database', 'ai-chat', 'lessons', 'future'];
const SECTION_LABELS = ['Overview', 'Problem', 'Solution', 'Architecture', 'Database', 'AI Chat', 'Lessons', 'Future'];

export default function ToledoAthleticsOnboardingCaseStudy() {
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
        .metrics-grid-taop { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; margin-bottom: 36px; }
        @media (max-width: 640px) { .metrics-grid-taop { grid-template-columns: repeat(2, 1fr); } }
        .two-col-taop { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
        @media (max-width: 700px) { .two-col-taop { grid-template-columns: 1fr; } }
        .three-col-taop { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; }
        @media (max-width: 700px) { .three-col-taop { grid-template-columns: 1fr 1fr; } }
        @media (max-width: 480px) { .three-col-taop { grid-template-columns: 1fr; } }
        .entity-card { padding: 16px 18px; background: ${ACCENT}04; border: 1px solid ${ACCENT}18; border-left: 2px solid ${ACCENT}90; border-radius: 8px; transition: all 0.2s ease; }
        .entity-card:hover { border-color: ${ACCENT}50; background: ${ACCENT}0c; }
        .entity-field { font-family: ${MONO}; font-size: 10px; color: var(--text3); padding: 2px 0; letter-spacing: 0.03em; }
        .entity-key { color: ${ACCENT}; }
        .principle-card { padding: 16px 18px; background: rgba(242,237,216,0.02); border: 1px solid rgba(242,237,216,0.07); border-left: 2px solid ${ACCENT}50; border-radius: 8px; transition: all 0.2s ease; }
        .principle-card:hover { border-color: ${ACCENT}40; background: ${ACCENT}0a; }
        .roadmap-row { display: flex; gap: 14px; padding: 16px 18px; background: rgba(242,237,216,0.02); border: 1px solid rgba(242,237,216,0.06); border-left: 2px solid ${ACCENT}30; border-radius: 8px; align-items: flex-start; transition: all 0.2s ease; }
        .roadmap-row:hover { border-color: ${ACCENT}40; background: ${ACCENT}06; }
        .nav-link { font-family: ${MONO}; font-size: 10px; letter-spacing: 0.08em; text-transform: uppercase; text-decoration: none; transition: color 0.2s; padding: 4px 0; cursor: pointer; background: none; border: none; }
        .flow-step { display: flex; gap: 14px; align-items: flex-start; padding: 14px 18px; background: ${ACCENT}06; border: 1px solid ${ACCENT}18; border-radius: 8px; }
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
        <span style={{ fontFamily: MONO, fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: ACCENT }}>Toledo Athletics Onboarding Portal</span>
        <div style={{ width: 80 }} />
      </header>

      {/* ── Hero ── */}
      <div style={{ padding: 'clamp(48px,8vh,96px) clamp(20px,5vw,80px) 0' }}>
        <div style={{ maxWidth: 860, margin: '0 auto' }}>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 20 }}>
            <Tag>Internal Platform</Tag>
            <Tag>Knowledge Management</Tag>
            <Tag>Serverless</Tag>
            <Tag>University of Toledo Athletics</Tag>
          </div>
          <h1 style={{ fontFamily: SERIF, fontSize: 'clamp(32px,5vw,56px)', fontWeight: 400, margin: '0 0 16px', lineHeight: 1.1, paddingBottom: '0.04em', background: `linear-gradient(135deg, #F2EDD8 70%, ${ACCENT} 100%)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', display: 'inline-block' }}>
            Toledo Athletics Onboarding Portal
          </h1>
          <p style={{ fontFamily: SERIF, fontSize: 'clamp(15px,2vw,18px)', color: '#B8B4A4', maxWidth: 620, lineHeight: 1.6, margin: '0 0 40px' }}>
            A serverless internal platform that centralizes onboarding knowledge, policies, contacts, org chart data, systems directories, and moderated staff tips for University of Toledo Athletics staff.
          </p>

          <div className="metrics-grid-taop">
            <Metric value="14" label="Database schema tables" />
            <Metric value="5" label="Core services" />
            <Metric value="10+" label="Onboarding content areas" />
            <Metric value="Serverless" label="Edge deployment" />
            <Metric value="Workers AI" label="Chat assistant" />
            <Metric value="Moderated" label="Tips workflow" />
          </div>

          {/* Hero image */}
          <div style={{ width: '100%', borderRadius: 12, overflow: 'hidden', border: `1px solid ${ACCENT}18`, background: '#06080E', marginBottom: 64 }}>
            <Pic
              src="/Images/Toledo_Athletics_Onboarding.png"
              alt="Toledo Athletics Onboarding Portal"
              onClick={() => setLb('/Images/Toledo_Athletics_Onboarding.png')}
              style={{ width: '100%', display: 'block', objectFit: 'cover', cursor: 'zoom-in' }}
              priority
            />
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
              <h2 className="cs-h2">Onboarding is a knowledge-management problem</h2>
              <p>
                The Toledo Athletics Onboarding Portal is an internal web platform built for the University of Toledo Athletics Department. Its purpose is to help new employees quickly understand the department&apos;s structure, policies, tools, compliance expectations, and day-to-day operating environment — without relying on scattered documents, email chains, and informal conversations.
              </p>
              <p>
                A Division I athletics department is not a normal workplace. New staff must navigate university HR, NCAA compliance, Title IX, NIL rules, student-athlete support systems, brand standards, facilities, ticketing, development, communications, IT systems, campus logistics, and athletics-specific workflows simultaneously.
              </p>
              <p>
                The portal turns that fragmented institutional knowledge into a centralized, searchable, structured internal resource. It combines official published articles with moderated employee-submitted tips so the department can capture practical knowledge without allowing unverified information to become official guidance.
              </p>
            </Section>

            {/* PROBLEM */}
            <Section id="problem">
              <SectionLabel>02 — Problem</SectionLabel>
              <h2 className="cs-h2">New staff face a steep learning curve in a high-compliance environment</h2>
              <p>
                Incoming athletics staff need answers to questions that span a dozen different functional areas — often before anyone has had time to explain them. Without a centralized system, onboarding becomes inconsistent: new employees waste time searching for answers, supervisors repeat the same explanations, and outdated information can create operational or compliance risk.
              </p>
              <div className="two-col-taop" style={{ marginBottom: 24 }}>
                {[
                  ['Compliance exposure', 'NCAA, Title IX, NIL, FERPA, and HR rules require timely understanding. Incorrect or missing guidance creates institutional risk.'],
                  ['Scattered knowledge', 'Critical information lives across web pages, PDFs, emails, internal documents, and informal conversations with no single entry point.'],
                  ['Supervisor repetition', 'Without a reference system, supervisors repeat the same explanations for every new hire — an operational tax that compounds across a large department.'],
                  ['Inconsistent onboarding', 'Different hiring managers provide different information, producing uneven readiness across staff in the same role.'],
                  ['Outdated guidance', 'Static documents go stale as policies update, staff move roles, systems change, and leadership changes — but there is no mechanism to surface or fix them.'],
                  ['No staff knowledge capture', 'Practical wisdom from experienced staff — the kind learned only by doing the job — has no home. When staff leave, it leaves with them.'],
                ].map(([title, body]) => (
                  <div key={title} className="principle-card">
                    <div style={{ fontFamily: MONO, fontSize: 10, color: ACCENT, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6 }}>{title}</div>
                    <p style={{ margin: 0, fontSize: 13, lineHeight: 1.6 }}>{body}</p>
                  </div>
                ))}
              </div>
              <p>
                The onboarding portal addresses all of these by creating a single maintained source of truth — with a moderated workflow that allows staff knowledge to flow in without bypassing compliance-safe content control.
              </p>
            </Section>

            {/* SOLUTION */}
            <Section id="solution">
              <SectionLabel>03 — Solution</SectionLabel>
              <h2 className="cs-h2">A moderated knowledge platform, not an open wiki</h2>
              <p>
                The portal is built around three distinct layers of content. The first is official centralized knowledge: long-form onboarding articles, policy resources, HR timelines, compliance references, university systems, and athletics-specific guidance. The second is structured operational reference data: org chart, key contacts, quick links, systems directory, branding tokens, and policy resources. The third is moderated employee knowledge captured through a controlled tips workflow.
              </p>

              <h3 className="cs-h3">Moderated tips workflow</h3>
              <p>
                This design decision matters most. An open internal wiki where anyone can publish unverified guidance is dangerous in a compliance-heavy environment. The portal instead implements a controlled knowledge pipeline:
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
                {[
                  ['01', 'Staff member submits a tip, advice item, or suggested content update through the portal.'],
                  ['02', 'Submission is stored as pending and is not visible in the live portal.'],
                  ['03', 'A moderator or administrator reviews the content for accuracy and relevance.'],
                  ['04', 'The reviewer approves, rejects, or requests revisions. Only approved content becomes visible.'],
                  ['05', 'Published content can receive feedback if it becomes outdated — routing it back into the review queue.'],
                ].map(([step, body]) => (
                  <div key={step} className="flow-step">
                    <div style={{ fontFamily: MONO, fontSize: 10, color: ACCENT, opacity: 0.7, flexShrink: 0, minWidth: 22, marginTop: 1 }}>{step}</div>
                    <p style={{ margin: 0, fontSize: 13, lineHeight: 1.6 }}>{body}</p>
                  </div>
                ))}
              </div>

              <h3 className="cs-h3">Content areas</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 16 }}>
                {['Department overview','Executive leadership','Rise Together strategic plan','Athletics facilities','Staff hierarchy','HR onboarding timeline','Benefits & retirement deadlines','IT setup & UTAD access','Rocket Card / mobile ID','Parking & campus logistics','NCAA compliance','Title IX','NIL rules','Booster relations','Sports wagering prohibitions','FERPA & data privacy','Social media & brand rules','Student-Athlete Support Services','Mental health referral pathways','Athletics systems & software','Key contacts','Quick links','Policies & institutional resources'].map(t => <Tag key={t}>{t}</Tag>)}
              </div>
            </Section>

            {/* ARCHITECTURE */}
            <Section id="architecture">
              <SectionLabel>04 — Architecture</SectionLabel>
              <h2 className="cs-h2">Serverless full-stack — lightweight but real</h2>
              <p>
                A purely static site would not have been sufficient. The platform needed form submissions, moderation states, user roles, relational data, content updates, AI chat, database-backed directories, and future approval workflows. Cloudflare Workers and D1 provide the backend and database layer required for a real internal platform while staying lightweight and cost-effective.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
                <DbLayer n="FE" title="React Frontend" items={['Onboarding dashboard','Article browsing','Search & category nav','Staff tips interface','Org chart & contact views','Systems & policy directories','AI chat widget']} />
                <DbLayer n="API" title="Cloudflare Workers + Hono" items={['TypeScript','Serverless edge execution','Articles API','Submissions API','Tips API','Contacts API','Links API','Systems API']} />
                <DbLayer n="DB" title="Cloudflare D1 (SQLite)" items={['14 relational tables','Users','Categories','Articles','Submissions','Tips','TipFeedback','OrgChart','SiteContentIndex','AppConfig','BrandingTokens','QuickLinks','KeyContacts','SystemsDirectory','PolicyResources']} />
                <DbLayer n="AI" title="Cloudflare Workers AI" items={['Site-wide onboarding Q&A','Content discovery','Navigation assistance','Native AI binding — no external API key']} />
                <DbLayer n="OPS" title="Deployment & Maintenance" items={['Wrangler deployment workflow','D1 schema execution','Seed files for content hydration','Staff / links / policies maintenance guide']} />
              </div>

              <h3 className="cs-h3">System flow</h3>
              <div style={{ padding: '16px 20px', background: 'rgba(34,197,94,0.04)', border: '1px solid rgba(34,197,94,0.15)', borderRadius: 8, fontFamily: MONO, fontSize: 12, color: '#B8B4A4', letterSpacing: '0.03em', lineHeight: 2 }}>
                React SPA → Cloudflare Worker API → Hono routes → Cloudflare D1 → AI / content response → user dashboard
              </div>
            </Section>

            {/* DATABASE */}
            <Section id="database">
              <SectionLabel>05 — Database Design</SectionLabel>
              <h2 className="cs-h2">14 tables separating official content from unverified submissions</h2>
              <p>
                The schema is designed to enforce a clear boundary between official content and staff-submitted knowledge. Content can evolve without rewriting the application — staff, policies, links, systems, and articles can all be updated through seed files.
              </p>
              <div className="three-col-taop" style={{ marginBottom: 24 }}>
                {[
                  { name: 'Users', fields: ['user_id', 'name', 'email', 'role', 'department', 'active'] },
                  { name: 'Categories', fields: ['category_id', 'name', 'slug', 'description', 'sort_order'] },
                  { name: 'Articles', fields: ['article_id', 'category_id', 'title', 'slug', 'content', 'published_at'] },
                  { name: 'Submissions', fields: ['submission_id', 'user_id', 'category_id', 'content', 'status', 'created_at'] },
                  { name: 'Tips', fields: ['tip_id', 'category_id', 'body', 'author_id', 'status', 'approved_at'] },
                  { name: 'TipFeedback', fields: ['feedback_id', 'tip_id', 'user_id', 'reason', 'created_at'] },
                  { name: 'OrgChart', fields: ['person_id', 'name', 'title', 'department', 'email', 'phone', 'active'] },
                  { name: 'SiteContentIndex', fields: ['index_id', 'source_type', 'source_id', 'title', 'body_excerpt', 'updated_at'] },
                  { name: 'AppConfig', fields: ['key', 'value', 'description', 'updated_at'] },
                  { name: 'BrandingTokens', fields: ['token_id', 'name', 'value', 'category', 'description'] },
                  { name: 'QuickLinks', fields: ['link_id', 'title', 'url', 'category', 'audience', 'active'] },
                  { name: 'KeyContacts', fields: ['contact_id', 'name', 'role', 'department', 'email', 'phone', 'notes'] },
                  { name: 'SystemsDirectory', fields: ['system_id', 'name', 'description', 'access_notes', 'support_contact', 'url'] },
                  { name: 'PolicyResources', fields: ['policy_id', 'code', 'title', 'category', 'url', 'summary', 'applicability'] },
                ].map(({ name, fields }) => (
                  <div key={name} className="entity-card">
                    <div style={{ fontFamily: MONO, fontSize: 11, color: ACCENT, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 10 }}>{name}</div>
                    {fields.map(f => (
                      <div key={f} className="entity-field" style={{ paddingBottom: 3 }}>
                        <span className="entity-key">— </span>{f}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
              <p>
                The <code style={{ fontFamily: MONO, fontSize: 12, color: ACCENT, background: `${ACCENT}10`, padding: '1px 5px', borderRadius: 3 }}>SiteContentIndex</code> table powers AI and search retrieval across published content. The <code style={{ fontFamily: MONO, fontSize: 12, color: ACCENT, background: `${ACCENT}10`, padding: '1px 5px', borderRadius: 3 }}>Submissions</code> and <code style={{ fontFamily: MONO, fontSize: 12, color: ACCENT, background: `${ACCENT}10`, padding: '1px 5px', borderRadius: 3 }}>Tips</code> tables enforce the moderation boundary — unapproved content never surfaces in the live portal.
              </p>
            </Section>

            {/* AI CHAT */}
            <Section id="ai-chat">
              <SectionLabel>06 — AI Chat Assistant</SectionLabel>
              <h2 className="cs-h2">Navigation aid, not a policy authority</h2>
              <p>
                The portal includes an AI chat assistant powered by Cloudflare Workers AI. It is designed to improve discoverability — helping users find information faster without replacing the need to verify compliance-sensitive decisions against official sources.
              </p>
              <h3 className="cs-h3">Designed to answer questions like</h3>
              <div className="two-col-taop" style={{ marginBottom: 24 }}>
                {[
                  'Where do I find the NCAA compliance manual?',
                  'Who do I contact for IT access?',
                  'What should I complete in my first 30 days?',
                  'Where do I find parking information?',
                  'Which system handles compliance workflows?',
                  'Where can I find HR benefits information?',
                ].map(q => (
                  <div key={q} style={{ padding: '12px 16px', background: 'rgba(34,197,94,0.04)', border: '1px solid rgba(34,197,94,0.14)', borderRadius: 6, fontFamily: SERIF, fontSize: 13, color: '#B8B4A4', lineHeight: 1.5 }}>
                    &ldquo;{q}&rdquo;
                  </div>
                ))}
              </div>
              <p>
                Using a native Workers AI binding requires no external API key — the AI runs in the same Cloudflare edge environment as the rest of the stack, keeping the platform simple to deploy and operate. The <code style={{ fontFamily: MONO, fontSize: 12, color: ACCENT, background: `${ACCENT}10`, padding: '1px 5px', borderRadius: 3 }}>SiteContentIndex</code> table provides the retrieval layer that grounds the assistant in actual portal content rather than general model knowledge.
              </p>

              <h3 className="cs-h3">Technical stack</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 16 }}>
                {['Cloudflare Workers','Hono','TypeScript','React','Cloudflare D1','SQLite','Workers AI','Wrangler','Serverless'].map(t => <Tag key={t}>{t}</Tag>)}
              </div>
            </Section>

            {/* LESSONS */}
            <Section id="lessons">
              <SectionLabel>07 — Lessons Learned</SectionLabel>
              <h2 className="cs-h2">Internal tools require product thinking, not just code</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
                {[
                  ['Onboarding is a knowledge-management problem', 'The challenge was not writing a website. It was deciding what information belongs in the portal, how it should be structured, what can be staff-contributed versus what must be official, and how to keep it maintained when the department changes.'],
                  ['Moderation is not optional when compliance is involved', 'Athletics onboarding covers NCAA rules, Title IX, FERPA, NIL, and HR policy — areas where incorrect guidance creates institutional risk. A moderation layer is not bureaucracy; it is a safety control.'],
                  ['Serverless is appropriate for lightweight internal platforms', 'Cloudflare Workers and D1 provide the dynamic capabilities a real internal tool needs — form submissions, database queries, moderation states, AI chat — without the overhead of a managed server or a heavy framework.'],
                  ['Relational databases make content maintainable', 'Hardcoding onboarding content into pages would make the site fragile. A relational schema means content — staff, policies, links, systems, articles — can be updated through seed files without changing application logic.'],
                  ['Maintenance workflows matter as much as the initial build', 'Onboarding content changes frequently. A portal that cannot be maintained becomes outdated and untrustworthy. The maintenance guide designed alongside the platform is as important as the code.'],
                  ['AI chat is most useful when grounded in structured content', 'An AI assistant that answers from general model knowledge is unreliable for policy and compliance questions. Connecting the assistant to the SiteContentIndex — a structured index of published portal content — makes answers more trustworthy and correctable.'],
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
              <SectionLabel>08 — Future Work</SectionLabel>
              <h2 className="cs-h2">A foundation for a full department operating system</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
                {[
                  { phase: 'Near-Term', color: ACCENT, items: ['Authenticated UToledo SSO login', 'Role-based admin dashboard for content approval', 'Onboarding progress tracking for each new employee', 'Manager checklists for 30/60/90-day reviews'] },
                  { phase: 'Mid-Term', color: '#F0B429', items: ['Semantic search across articles and policies', 'Analytics for most-viewed and unanswered questions', 'Automatic stale-content reminders', 'CSV import/export for staff and contacts', 'AI-generated summaries for long policy documents'] },
                  { phase: 'Long-Term', color: '#A78BFA', items: ['Department-specific onboarding paths (coaches, operations, communications, compliance, ticketing, development)', 'Audit logs for all content updates', 'Mobile-first quick-start mode for first-day onboarding', 'Cross-role knowledge transfer workflows when staff change positions'] },
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
                  Great onboarding is infrastructure for institutional memory.
                </p>
                <p style={{ fontFamily: SERIF, fontSize: 14, color: '#B8B4A4', margin: 0, lineHeight: 1.6 }}>
                  The Toledo Athletics Onboarding Portal demonstrates that internal software engineering — serverless architecture, relational schema design, moderated knowledge workflows, and AI integration — can directly reduce operational risk and help people do their jobs better from day one.
                </p>
              </div>

              <div style={{ display: 'flex', gap: 10, marginTop: 32, flexWrap: 'wrap' }}>
                <Link href="/#projects" transitionTypes={['nav-back']} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '10px 20px', background: ACCENT, color: '#0B0D14', fontFamily: MONO, fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', borderRadius: 5, textTransform: 'uppercase', textDecoration: 'none' }}>← Back to Projects</Link>
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
