'use client';

import React, { useEffect, useState } from 'react';
import { SmartBackLink } from '@/components/ui/smart-back-link';
import { Lightbox } from '@/components/ui/image-lightbox';
import { Pic } from '@/components/ui/pic';
import { resolveSkillColor } from '@/lib/skill-colors';

const SERIF  = "var(--font-chakra), 'Chakra Petch', sans-serif";
const MONO   = "var(--font-chakra), 'Chakra Petch', monospace";
const ACCENT = 'var(--gold)';

const PALETTE = ['var(--gold)','var(--blue)','var(--primary)','var(--orange)','var(--purple)','var(--pink)','var(--sky)','#22C55E','var(--red)'];
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

function LayerRow({ n, title, items, color = ACCENT }: { n: string; title: string; items: string[]; color?: string }) {
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

const SECTION_IDS    = ['overview', 'problem', 'solution', 'ai-approach', 'architecture', 'stack', 'lessons', 'future'];
const SECTION_LABELS = ['Overview', 'Problem', 'Solution', 'AI Approach', 'Architecture', 'Stack', 'Lessons', 'Future'];

export default function DeepTruthCaseStudy() {
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
        .metrics-grid-dt { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; margin-bottom: 36px; }
        @media (max-width: 640px) { .metrics-grid-dt { grid-template-columns: repeat(2, 1fr); } }
        .two-col-dt { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        @media (max-width: 700px) { .two-col-dt { grid-template-columns: 1fr; } }
        .three-col-dt { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; }
        @media (max-width: 700px) { .three-col-dt { grid-template-columns: 1fr 1fr; } }
        @media (max-width: 480px) { .three-col-dt { grid-template-columns: 1fr; } }
        .info-card { padding: 16px 18px; background: rgba(242,237,216,0.02); border: 1px solid rgba(244,244,242,0.07); border-radius: 8px; transition: all 0.2s ease; }
        .info-card:hover { border-color: ${ACCENT}40; background: ${ACCENT}0a; }
        .accent-card { padding: 16px 18px; background: ${ACCENT}04; border: 1px solid ${ACCENT}18; border-radius: 8px; transition: all 0.2s ease; }
        .accent-card:hover { border-color: ${ACCENT}50; background: ${ACCENT}0c; }
        .model-card { flex: 1; padding: 20px 22px; background: ${ACCENT}06; border: 1px solid ${ACCENT}22; border-radius: 10px; }
        .roadmap-row { display: flex; gap: 14px; padding: 16px 18px; background: rgba(242,237,216,0.02); border: 1px solid rgba(244,244,242,0.06); border-radius: 8px; align-items: flex-start; transition: all 0.2s ease; }
        .roadmap-row:hover { border-color: ${ACCENT}40; background: ${ACCENT}06; }
        .nav-link { font-family: ${MONO}; font-size: 10px; letter-spacing: 0.08em; text-transform: uppercase; text-decoration: none; transition: color 0.2s; padding: 4px 0; cursor: pointer; background: none; border: none; }
        .weight-bar { display: flex; border-radius: 6px; overflow: hidden; height: 32px; margin-bottom: 12px; }
        .weight-bar .gemini { display: flex; align-items: center; justify-content: center; width: 70%; background: ${ACCENT}22; border: 1px solid ${ACCENT}40; font-family: ${MONO}; font-size: 10px; color: ${ACCENT}; letter-spacing: 0.06em; }
        .weight-bar .distil { display: flex; align-items: center; justify-content: center; width: 30%; background: color-mix(in srgb, var(--blue) 15%, transparent); border: 1px solid color-mix(in srgb, var(--blue) 30%, transparent); border-left: none; font-family: ${MONO}; font-size: 10px; color: var(--blue); letter-spacing: 0.06em; }
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
        <span style={{ fontFamily: MONO, fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: ACCENT }}>DeepTruth</span>
        <div style={{ width: 80 }} />
      </header>

      {/* ── Hero ── */}
      <div style={{ padding: 'clamp(48px,8vh,96px) clamp(20px,5vw,80px) 0' }}>
        <div style={{ maxWidth: 860, margin: '0 auto' }}>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 20 }}>
            <Tag>Hackathon</Tag>
            <Tag>AI / NLP</Tag>
            <Tag>Fact-Checking</Tag>
            <Tag>RocketHacks 2025</Tag>
            <Tag>Best Use of MongoDB Atlas</Tag>
          </div>
          <h1 style={{ fontFamily: SERIF, fontSize: 'var(--text-3xl)', fontWeight: 400, margin: '0 0 16px', lineHeight: 1.1, paddingBottom: '0.04em', background: `linear-gradient(135deg, var(--foreground) 70%, ${ACCENT} 100%)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', display: 'inline-block' }}>
            DeepTruth
          </h1>
          <p style={{ fontFamily: SERIF, fontSize: 16, color: 'var(--text2)', maxWidth: 620, lineHeight: 1.6, margin: '0 0 12px' }}>
            AI-powered fact-checking for a noisy internet.
          </p>
          <p style={{ fontFamily: SERIF, fontSize: 15, color: 'var(--text3)', maxWidth: 620, lineHeight: 1.6, margin: '0 0 40px' }}>
            A Rocket Hacks project combining Gemini AI, DistilBERT, Django REST, React, MongoDB, and a Chrome extension to help users evaluate online claims before they spread.
          </p>

          <div className="metrics-grid-dt">
            <Metric value="#1" label="Best Use of MongoDB Atlas" />
            <Metric value="24h" label="Build sprint" />
            <Metric value="70/30" label="Gemini / DistilBERT weighting" />
            <Metric value="2" label="Interfaces: web app + extension" />
            <Metric value="9.5K" label="Training data points" />
            <Metric value="Dual" label="AI model fusion pipeline" />
          </div>

          {/* Hero image */}
          <div style={{ width: '100%', borderRadius: 10, overflow: 'hidden', border: `1px solid ${ACCENT}18`, background: 'var(--background)', marginBottom: 64 }}>
            <Pic src="/Images/DeepTruth_Group.png" alt="DeepTruth team and demo" onClick={() => setLb('/Images/DeepTruth_Group.png')} style={{ width: '100%', display: 'block', objectFit: 'cover', cursor: 'zoom-in' }} priority />
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
              <h2 className="cs-h2">Because in a world full of noise, clarity is power</h2>
              <p>
                DeepTruth is an AI-powered fact-checking platform built for RocketHacks 2025. The project was designed to help users evaluate online claims, article titles, and suspicious headlines before misinformation has a chance to spread further.
              </p>
              <p>
                The platform combines a web app, Chrome extension, AI reasoning, NLP classification, and source verification into one workflow. Users can enter an article title or analyze content while browsing, then receive a credibility score, veracity assessment, reasoning, confidence signal, and independent sources for cross-checking.
              </p>
              <p>
                The goal was never to replace human judgment. The goal was to give users a faster first-pass credibility tool - one that helps them think critically before trusting or sharing information. DeepTruth won Best Use of MongoDB Atlas at RocketHacks 2025.
              </p>
            </Section>

            {/* PROBLEM */}
            <Section id="problem">
              <SectionLabel>02 - Problem</SectionLabel>
              <h2 className="cs-h2">Misinformation spreads because verification is slow</h2>
              <p>
                The internet makes information easy to access but difficult to trust. Misleading headlines, AI-generated content, and low-quality sources spread quickly because users often see claims without context, source comparison, or evidence-based verification. Most people do not have time to manually investigate every article they encounter.
              </p>
              <div className="two-col-dt" style={{ marginBottom: 24 }}>
                {[
                  ['Misleading titles', 'Headlines are designed to drive clicks, not accuracy. Framing alone can bias how a claim is understood.'],
                  ['No quick tools', 'Fact-checking sites exist but require manual navigation - creating friction that most users skip.'],
                  ['AI-generated content', 'Synthetic text can look credible and pass casual inspection, but carries no ground-truth accountability.'],
                  ['Source opacity', 'Users rarely know who is behind a claim or whether the source has a history of corrections.'],
                  ['Sharing before checking', 'Social media rewards speed - content spreads before it is verified, and retractions rarely catch up.'],
                  ['Single-source trust', 'Readers often rely on one outlet rather than cross-referencing multiple independent sources.'],
                ].map(([title, body]) => (
                  <div key={title} className="info-card">
                    <div style={{ fontFamily: MONO, fontSize: 10, color: ACCENT, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6 }}>{title}</div>
                    <p style={{ margin: 0, fontSize: 13, lineHeight: 1.6 }}>{body}</p>
                  </div>
                ))}
              </div>
              <p>
                DeepTruth addresses this by turning fact-checking into a faster, AI-assisted workflow - reducing the friction between encountering a claim and getting credibility context for it.
              </p>
            </Section>

            {/* SOLUTION */}
            <Section id="solution">
              <SectionLabel>03 - Solution</SectionLabel>
              <h2 className="cs-h2">Two interfaces, one credibility pipeline</h2>
              <p>
                DeepTruth provides two primary user interfaces that feed into the same backend analysis pipeline.
              </p>
              <div className="two-col-dt" style={{ marginBottom: 24 }}>
                <div className="accent-card">
                  <div style={{ fontFamily: MONO, fontSize: 11, color: ACCENT, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 10 }}>Web App</div>
                  <ul style={{ margin: 0, padding: '0 0 0 16px' }}>
                    <li style={{ fontSize: 13, marginBottom: 5 }}>Users input article titles or claims directly</li>
                    <li style={{ fontSize: 13, marginBottom: 5 }}>Returns credibility score, veracity assessment, reasoning, and independent source links</li>
                    <li style={{ fontSize: 13, marginBottom: 5 }}>Designed for direct claim verification before sharing</li>
                  </ul>
                </div>
                <div className="accent-card">
                  <div style={{ fontFamily: MONO, fontSize: 11, color: ACCENT, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 10 }}>Chrome Extension</div>
                  <ul style={{ margin: 0, padding: '0 0 0 16px' }}>
                    <li style={{ fontSize: 13, marginBottom: 5 }}>Brings credibility analysis directly into the browsing workflow</li>
                    <li style={{ fontSize: 13, marginBottom: 5 }}>No need to leave the article page to begin verification</li>
                    <li style={{ fontSize: 13, marginBottom: 5 }}>Meets users where misinformation actually appears</li>
                  </ul>
                </div>
              </div>
              <p>
                Both interfaces connect to the same Django REST API, which orchestrates Gemini AI reasoning, DistilBERT classification, and source verification before returning a structured result to the user.
              </p>

              <h3 className="cs-h3">API endpoints</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 8 }}>
                {[
                  { method: 'POST', path: '/api/verify-claim/', desc: 'Analyze an article title or claim - returns credibility, veracity, reasoning, and source links.' },
                  { method: 'GET',  path: '/api/false-news/',   desc: 'Retrieve previously analyzed or flagged claims stored in MongoDB.' },
                ].map(({ method, path, desc }) => (
                  <div key={path} style={{ padding: '12px 16px', background: 'rgba(242,237,216,0.02)', border: '1px solid rgba(244,244,242,0.08)', borderRadius: 6, display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                    <span style={{ fontFamily: MONO, fontSize: 10, color: method === 'POST' ? ACCENT : 'var(--blue)', background: method === 'POST' ? `${ACCENT}14` : 'color-mix(in srgb, var(--blue) 12%, transparent)', padding: '2px 8px', borderRadius: 4, flexShrink: 0, marginTop: 1 }}>{method}</span>
                    <div>
                      <code style={{ fontFamily: MONO, fontSize: 12, color: 'var(--foreground)' }}>{path}</code>
                      <p style={{ margin: '4px 0 0', fontSize: 12, color: 'var(--text3)', lineHeight: 1.5 }}>{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Section>

            {/* AI APPROACH */}
            <Section id="ai-approach">
              <SectionLabel>04 - AI Approach</SectionLabel>
              <h2 className="cs-h2">Model fusion over single-signal trust</h2>
              <p>
                The core technical decision behind DeepTruth is model fusion: combining two complementary AI systems rather than relying on one signal. A single model is both overconfident and undercalibrated for the complexity of credibility assessment.
              </p>

              <h3 className="cs-h3">Weighted fusion: 70% Gemini / 30% DistilBERT</h3>
              <div className="weight-bar" style={{ marginBottom: 16 }}>
                <div className="gemini">70% - Gemini AI</div>
                <div className="distil">30% - DistilBERT</div>
              </div>
              <p>
                More weight goes to Gemini because reasoning and explanation quality are primary user-facing values. DistilBERT adds a specialized classification signal without dominating the output.
              </p>

              <div className="two-col-dt" style={{ marginBottom: 24 }}>
                <div className="model-card">
                  <div style={{ fontFamily: MONO, fontSize: 11, color: ACCENT, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 10 }}>Gemini AI - 70%</div>
                  <p style={{ margin: 0, fontSize: 13, lineHeight: 1.65, color: 'var(--text2)' }}>
                    Google Gemini Pro handles high-level reasoning, claim interpretation, and explanation generation. It produces human-readable analysis of why a claim may be credible or suspicious - not just a score, but the reasoning behind it.
                  </p>
                </div>
                <div style={{ flex: 1, padding: '20px 22px', background: 'color-mix(in srgb, var(--blue) 6%, transparent)', border: '1px solid color-mix(in srgb, var(--blue) 18%, transparent)', borderRadius: 10 }}>
                  <div style={{ fontFamily: MONO, fontSize: 11, color: 'var(--blue)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 10 }}>DistilBERT - 30%</div>
                  <p style={{ margin: 0, fontSize: 13, lineHeight: 1.65, color: 'var(--text2)' }}>
                    A fine-tuned DistilBERT model provides NLP-based veracity classification. Trained on approximately 9,500 data points, it adds a language-model signal specialized for misinformation patterns that complements Gemini&apos;s broader reasoning.
                  </p>
                </div>
              </div>

              <div style={{ padding: '18px 22px', background: `${ACCENT}08`, border: `1px solid ${ACCENT}22`, borderRadius: 10, marginBottom: 8 }}>
                <div style={{ fontFamily: MONO, fontSize: 10, color: ACCENT, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>Why fusion matters</div>
                <p style={{ margin: 0, fontSize: 14, lineHeight: 1.65, color: 'var(--text2)' }}>
                  A single model produces overconfident outputs. By combining Gemini&apos;s reasoning with DistilBERT&apos;s classification, DeepTruth surfaces more calibrated credibility signals - and makes the system more honest about what it knows and does not know.
                </p>
              </div>
            </Section>

            {/* ARCHITECTURE */}
            <Section id="architecture">
              <SectionLabel>05 - Architecture</SectionLabel>
              <h2 className="cs-h2">Full-stack from browser to model inference</h2>
              <p>
                The system flows from user input through two interface layers, a REST API backend, AI inference, MongoDB storage, and back to a structured result.
              </p>
              <div style={{ fontFamily: MONO, fontSize: 11, color: 'var(--text3)', letterSpacing: '0.06em', textAlign: 'center', padding: '12px 0', marginBottom: 16 }}>
                User input → React app or Chrome extension → Django REST API → Gemini + DistilBERT → MongoDB → credibility result + reasoning + sources
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
                <LayerRow n="01" title="Frontend - Web App" items={['React', 'Vite', 'HTML / CSS / JS', 'Claim input form', 'Credibility score display', 'Result explanation UI']} />
                <LayerRow n="02" title="Frontend - Chrome Extension" items={['HTML', 'CSS', 'JavaScript', 'Chrome Extension API', 'Browser-integrated analysis']} />
                <LayerRow n="03" title="Backend" items={['Django', 'Django REST Framework', 'Claim verification endpoint', 'Model orchestration', 'Source verification workflow']} />
                <LayerRow n="04" title="AI / NLP" items={['Google Gemini Pro', 'Fine-tuned DistilBERT', '70/30 weighted fusion', 'Veracity classification', 'Credibility scoring']} />
                <LayerRow n="05" title="Database" items={['MongoDB', 'Analyzed claim storage', 'False-news history retrieval', 'Flexible document schema']} />
              </div>
            </Section>

            {/* STACK */}
            <Section id="stack">
              <SectionLabel>06 - Technical Stack</SectionLabel>
              <h2 className="cs-h2">What DeepTruth runs on</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
                <LayerRow n="FE"  title="Frontend" items={['React', 'Vite', 'HTML', 'CSS', 'JavaScript']} />
                <LayerRow n="BE"  title="Backend" items={['Django', 'Django REST Framework', 'Python']} />
                <LayerRow n="AI"  title="AI / ML" items={['Google Gemini Pro', 'DistilBERT', 'Hugging Face', 'NLP classification', 'Weighted model fusion']} />
                <LayerRow n="DB"  title="Database" items={['MongoDB Atlas']} />
                <LayerRow n="EXT" title="Browser" items={['Chrome Extension API']} />
                <LayerRow n="OPS" title="Tooling" items={['GitHub', 'Node.js', 'Python virtual environment', 'Environment variables', 'MongoDB connection config']} />
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {['React', 'Vite', 'Django', 'Django REST Framework', 'Python', 'Google Gemini Pro', 'DistilBERT', 'Hugging Face', 'MongoDB', 'Chrome Extension', 'NLP', 'Hackathon'].map(t => (
                  <Tag key={t}>{t}</Tag>
                ))}
              </div>
            </Section>

            {/* LESSONS */}
            <Section id="lessons">
              <SectionLabel>07 - Lessons Learned</SectionLabel>
              <h2 className="cs-h2">What a 24-hour build teaches you</h2>
              <p>
                Building DeepTruth under hackathon constraints produced sharper design decisions than a longer timeline might have allowed. A few lessons that stuck:
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
                {[
                  ['Credibility systems need explanations', 'A score without reasoning is just noise. Users need to understand why the model flagged something before they can decide what to do with that signal.'],
                  ['Multi-model architectures are more honest', 'Trusting a single model produces overconfident outputs. Fusing two systems forces the architecture to be explicit about uncertainty and weighting choices.'],
                  ['Browser extensions are the right surface', 'Misinformation appears during browsing. A standalone fact-checker that requires a separate tab creates friction - an extension removes it.'],
                  ['Backend integration is harder than the demo', 'Connecting DistilBERT inference, Gemini API calls, MongoDB writes, and Chrome extension communication simultaneously under time pressure revealed integration debt quickly.'],
                  ['Hackathon projects need a sharp product story', 'Working code is necessary but not sufficient. The ability to communicate the problem, the audience, and the design tradeoffs clearly was as important as the implementation.'],
                  ['AI should assist, not replace, judgment', 'Framing matters. A tool that claims to decide truth is both overreaching and less credible than one that claims to help users think more carefully.'],
                ].map(([title, body]) => (
                  <div key={title} style={{ padding: '14px 18px', background: `${ACCENT}06`, border: `1px solid ${ACCENT}18`, borderRadius: 8 }}>
                    <div style={{ fontFamily: MONO, fontSize: 10, color: ACCENT, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6 }}>{title}</div>
                    <p style={{ margin: 0, fontSize: 13, lineHeight: 1.65 }}>{body}</p>
                  </div>
                ))}
              </div>
              <div className="two-col-dt" style={{ marginBottom: 24 }}>
                <div style={{ padding: '16px 18px', background: `${ACCENT}0c`, border: `1px solid ${ACCENT}30`, borderRadius: 8 }}>
                  <div style={{ fontFamily: MONO, fontSize: 10, color: ACCENT, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>What broke</div>
                  <p style={{ margin: 0, fontSize: 13, lineHeight: 1.65 }}>
                    The demo was the easy part. Getting DistilBERT inference, Gemini API calls, MongoDB writes, and the Chrome extension to talk to one another - all at once, on a 24-hour clock - is where the integration debt piled up fastest.
                  </p>
                </div>
                <div style={{ padding: '16px 18px', background: 'rgba(242,237,216,0.02)', border: '1px solid rgba(244,244,242,0.09)', borderRadius: 8 }}>
                  <div style={{ fontFamily: MONO, fontSize: 10, color: 'var(--foreground)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>What I&apos;d do differently</div>
                  <p style={{ margin: 0, fontSize: 13, lineHeight: 1.65 }}>
                    The 70/30 fusion reasons from what the two models already know - neither one actually retrieves evidence. I&apos;d add a RAG step before the explanation so a verdict cites fetched sources instead of leaning on model priors.
                  </p>
                </div>
              </div>

              {/* Responsible framing callout */}
              <div style={{ padding: '20px 24px', background: 'rgba(242,237,216,0.03)', border: '1px solid rgba(244,244,242,0.1)', borderRadius: 10 }}>
                <div style={{ fontFamily: MONO, fontSize: 10, color: 'var(--text3)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 10 }}>Responsible framing</div>
                <p style={{ margin: '0 0 8px', fontSize: 14, color: 'var(--text2)', lineHeight: 1.6 }}>
                  DeepTruth should be read as an AI-assisted credibility platform, not an absolute truth detector.
                </p>
                <p style={{ margin: 0, fontSize: 14, color: ACCENT, fontFamily: MONO, letterSpacing: '0.03em', lineHeight: 1.6 }}>
                  &ldquo;DeepTruth provides credibility signals, reasoning, and independent sources to support critical thinking.&rdquo;
                </p>
              </div>
            </Section>

            {/* FUTURE */}
            <Section id="future">
              <SectionLabel>08 - Future Work</SectionLabel>
              <h2 className="cs-h2">Where DeepTruth goes next</h2>
              <p>
                The hackathon prototype establishes a working pipeline. Future versions could transform it into a much more powerful misinformation-detection platform.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
                {[
                  { phase: 'Near-Term', color: ACCENT, items: ['RAG pipeline for evidence retrieval from trusted sources before generating explanation', 'Source credibility database with reliability history, bias indicators, and correction patterns', 'Explainability dashboard showing which tokens influenced the verdict'] },
                  { phase: 'Mid-Term', color: 'var(--blue)', items: ['Deepfake detection for images, video, and audio', 'Reinforcement learning feedback loop using user ratings to improve scoring', 'Claim clustering to detect repeated misinformation narratives across articles'] },
                  { phase: 'Long-Term', color: 'var(--purple)', items: ['Browser-level non-intrusive warnings for highly suspicious headlines', 'Multi-language support for international misinformation detection', 'Model improvement pipeline using MongoDB-stored claim history as training feedback'] },
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
                  The goal is not to replace human judgment. The goal is to give people faster credibility signals, clearer reasoning, and independent sources so they can think critically.
                </p>
                <p style={{ fontFamily: SERIF, fontSize: 14, color: 'var(--text2)', margin: 0, lineHeight: 1.6 }}>
                  In a world full of noise, DeepTruth helps users slow down before they believe or share.
                </p>
              </div>

              <div style={{ display: 'flex', gap: 10, marginTop: 32, flexWrap: 'wrap' }}>
                <SmartBackLink fallbackHref="/#projects" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '10px 20px', background: ACCENT, color: '#0B0D14', fontFamily: MONO, fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', borderRadius: 5, textTransform: 'uppercase', textDecoration: 'none' }}>← Back to Projects</SmartBackLink>
                <a href="https://github.com/TheChozenWon/DeepTruth.git" target="_blank" rel="noopener" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '10px 20px', border: `1px solid ${ACCENT}40`, color: ACCENT, fontFamily: MONO, fontSize: 10, letterSpacing: '0.06em', borderRadius: 5, textTransform: 'uppercase', textDecoration: 'none' }}>GitHub ↗</a>
                <a href="https://youtu.be/whTYKriT5JU?si=M-0yUWXURhPrvy--" target="_blank" rel="noopener" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '10px 20px', border: '1px solid rgba(244,244,242,0.12)', color: 'var(--text2)', fontFamily: MONO, fontSize: 10, letterSpacing: '0.06em', borderRadius: 5, textTransform: 'uppercase', textDecoration: 'none' }}>Watch Demo ↗</a>
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



