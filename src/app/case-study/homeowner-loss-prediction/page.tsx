'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Lightbox } from '@/components/ui/image-lightbox';
import { Pic } from '@/components/ui/pic';
import { resolveSkillColor } from '@/lib/skill-colors';

const SERIF = "var(--font-chakra), 'Chakra Petch', sans-serif";
const MONO  = "var(--font-chakra), 'Chakra Petch', monospace";
const SANS  = "var(--font-chakra), 'Chakra Petch', sans-serif";
const ACCENT = '#A78BFA';

const PALETTE = ['#F0B429','#4B7BF5','#2DD4C8','#F07832','#A78BFA','#F472B6','#0EA5E9','#22C55E','#EF4444'];
function pickColor(text: string) {
  let h = 0;
  for (let i = 0; i < text.length; i++) h = (h * 31 + text.charCodeAt(i)) >>> 0;
  return PALETTE[h % PALETTE.length];
}

function Tag({ color, children }: { color?: string; children: React.ReactNode }) {
  const c = color ?? (typeof children === 'string' ? (resolveSkillColor(children) ?? ACCENT) : ACCENT);
  return (
    <span style={{ fontFamily: MONO, fontSize: 11, padding: '4px 9px', background: `${c}14`, border: `1px solid ${c}33`, borderRadius: 4, color: c, letterSpacing: '0.03em' }}>
      {children}
    </span>
  );
}

function SectionLabel({ label }: { label: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
      <span style={{ display: 'inline-block', width: 18, height: 1.5, background: ACCENT, opacity: 0.5, flexShrink: 0 }} />
      <span style={{ fontFamily: MONO, fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: ACCENT }}>{label}</span>
    </div>
  );
}

function Metric({ value, label, color = ACCENT }: { value: string; label: string; color?: string }) {
  return (
    <div style={{ padding: '18px 20px', background: `linear-gradient(180deg, ${color}0d, ${color}04)`, border: `1px solid ${color}35`, boxShadow: `0 4px 20px ${color}05`, borderRadius: 8 }}>
      <div style={{ fontFamily: SERIF, fontSize: 32, fontWeight: 400, color: '#F2EDD8', lineHeight: 1, paddingBottom: '0.05em' }}>{value}</div>
      <div style={{ fontFamily: MONO, fontSize: 10, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: 8 }}>{label}</div>
    </div>
  );
}

function PipelineStep({ n, title, sub, color = ACCENT, isLast = false }: { n: string; title: string; sub: string; color?: string; isLast?: boolean }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 0 }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0, width: 40 }}>
        <div style={{ width: 32, height: 32, borderRadius: '50%', background: `${color}18`, border: `1.5px solid ${color}55`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <span style={{ fontFamily: MONO, fontSize: 10, color, fontWeight: 700 }}>{n}</span>
        </div>
        {!isLast && <div style={{ width: 1, flex: 1, minHeight: 24, background: `linear-gradient(to bottom, ${color}44, transparent)`, marginTop: 4 }} />}
      </div>
      <div style={{ paddingLeft: 14, paddingBottom: isLast ? 0 : 20, paddingTop: 6 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: '#F2EDD8', lineHeight: 1.3, marginBottom: 4 }}>{title}</div>
        <div style={{ fontSize: 13, color: 'var(--text3)', lineHeight: 1.55 }}>{sub}</div>
      </div>
    </div>
  );
}

function Section({ id, children, alt = false }: { id: string; children: React.ReactNode; alt?: boolean }) {
  return (
    <section id={id} style={{ padding: 'clamp(48px,6vw,80px) clamp(20px,4vw,52px)', background: alt ? 'rgba(15,17,25,0.92)' : 'rgba(11,13,20,0.9)', position: 'relative', overflowX: 'clip' }}>
      <div style={{ maxWidth: 860, margin: '0 auto' }}>
        {children}
      </div>
    </section>
  );
}

function useActiveSection(ids: string[]) {
  const [active, setActive] = useState(ids[0]);
  useEffect(() => {
    const observers = ids.map(id => {
      const el = document.getElementById(id);
      if (!el) return null;
      const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) setActive(id); }, { rootMargin: '-40% 0px -50% 0px' });
      io.observe(el);
      return io;
    });
    return () => observers.forEach(io => io?.disconnect());
  }, [ids]);
  return active;
}

const NAV_SECTIONS = [
  { id: 'cs-overview',     label: 'Overview' },
  { id: 'cs-problem',      label: 'Problem' },
  { id: 'cs-architecture', label: 'Architecture' },
  { id: 'cs-stack',        label: 'Stack' },
  { id: 'cs-model',        label: 'Model' },
  { id: 'cs-results',      label: 'Results' },
  { id: 'cs-insights',     label: 'Insights' },
  { id: 'cs-lessons',      label: 'Lessons' },
  { id: 'cs-future',       label: 'Future' },
];

export default function HomeownerLossCaseStudy() {
  const active = useActiveSection(NAV_SECTIONS.map(s => s.id));
  const [scrolled, setScrolled] = useState(false);
  const [lb, setLb] = useState<string | null>(null);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <div style={{ background: '#0B0D14', minHeight: '100vh', color: '#B8B4A4' }}>
      <style>{`
        li::marker { color: ${ACCENT}; }
      `}</style>

      {/* ── Sticky top bar ── */}
      <header style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        background: scrolled ? 'rgba(11,13,20,0.95)' : 'transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        borderBottom: scrolled ? `1px solid ${ACCENT}35` : '1px solid transparent',
        transition: 'all 0.3s ease',
        padding: '0 clamp(20px,4vw,52px)',
        height: 56,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16,
      }}>
        <Link href="/#projects" transitionTypes={['nav-back']} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontFamily: MONO, fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#B8B4A4', textDecoration: 'none', transition: 'color 0.2s' }}
          onMouseEnter={e => { e.currentTarget.style.color = ACCENT; }}
          onMouseLeave={e => { e.currentTarget.style.color = '#B8B4A4'; }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5"/><path d="m12 19-7-7 7-7"/></svg>
          Back to Portfolio
        </Link>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
          <a href="/docs/EECS4020_FinalReport_G3.pdf" target="_blank" rel="noopener" style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '6px 12px', border: '1px solid rgba(167,139,250,0.3)', borderRadius: 4, color: ACCENT, fontFamily: MONO, fontSize: 9, letterSpacing: '0.06em', textTransform: 'uppercase', textDecoration: 'none', transition: 'all 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.background = `${ACCENT}14`; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}>
            Report ↓
          </a>
          <a href="https://github.com/RayFrightener/ml_automation" target="_blank" rel="noopener" style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '6px 12px', border: '1px solid rgba(242,237,216,0.1)', borderRadius: 4, color: '#B8B4A4', fontFamily: MONO, fontSize: 9, letterSpacing: '0.06em', textTransform: 'uppercase', textDecoration: 'none', transition: 'all 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(242,237,216,0.25)'; e.currentTarget.style.color = '#F2EDD8'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(242,237,216,0.1)'; e.currentTarget.style.color = '#B8B4A4'; }}>
            GitHub ↗
          </a>
        </div>
      </header>

      {/* ── Hero ── */}
      <section style={{ paddingTop: 'calc(56px + clamp(48px,7vw,96px))', paddingBottom: 'clamp(48px,6vw,80px)', paddingLeft: 'clamp(20px,4vw,52px)', paddingRight: 'clamp(20px,4vw,52px)', borderBottom: '1px solid rgba(167,139,250,0.1)', background: 'linear-gradient(180deg, rgba(167,139,250,0.04) 0%, transparent 100%)' }}>
        <div style={{ maxWidth: 860, margin: '0 auto' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
            <span style={{ fontFamily: MONO, fontSize: 10, padding: '4px 10px', background: `${ACCENT}14`, border: `1px solid ${ACCENT}33`, borderRadius: 20, color: ACCENT, letterSpacing: '0.08em', textTransform: 'uppercase' }}>MLOps</span>
            <span style={{ fontFamily: MONO, fontSize: 10, padding: '4px 10px', background: 'rgba(240,180,41,0.08)', border: '1px solid rgba(240,180,41,0.25)', borderRadius: 20, color: '#F0B429', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Insurance AI</span>
            <span style={{ fontFamily: MONO, fontSize: 10, padding: '4px 10px', background: 'rgba(75,123,245,0.08)', border: '1px solid rgba(75,123,245,0.25)', borderRadius: 20, color: '#4B7BF5', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Risk Modeling</span>
            <span style={{ fontFamily: MONO, fontSize: 10, padding: '4px 10px', background: 'rgba(242,237,216,0.04)', border: '1px solid rgba(242,237,216,0.1)', borderRadius: 20, color: 'var(--text3)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Senior Design · 2024–2025</span>
          </div>

          <h1 style={{ fontFamily: SERIF, fontWeight: 400, fontSize: 'clamp(32px, 6vw, 58px)', lineHeight: 1.05, letterSpacing: '-0.025em', color: '#F2EDD8', margin: 0, paddingBottom: '0.08em', marginBottom: 16 }}>
            Homeowner Loss<br /><span style={{ color: ACCENT }}>History Prediction</span>
          </h1>
          <p style={{ fontSize: 16, lineHeight: 1.75, color: '#B8B4A4', maxWidth: 640, marginBottom: 32 }}>
            A production-style MLOps system for homeowner loss prediction that turns a manual actuarial modeling workflow into an automated, auditable, human-in-the-loop AI pipeline. Built with Grange Insurance × University of Toledo.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 10, marginBottom: 32 }}>
            <Metric value="R² 0.982" label="Model accuracy" color={ACCENT} />
            <Metric value="RMSE 7216" label="Prediction error" color="#F0B429" />
            <Metric value="26%" label="vs GLM baseline" color="#4B7BF5" />
            <Metric value="75%" label="Manual review ↓" color="#2DD4C8" />
            <Metric value="MAE $29.10" label="Avg prediction error" color={ACCENT} />
            <Metric value="100+" label="Engineered features" color="#F07832" />
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            <a href="#cs-architecture" onClick={e => { e.preventDefault(); document.getElementById('cs-architecture')?.scrollIntoView({ behavior: 'smooth' }); }} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '10px 20px', background: ACCENT, color: '#0B0D14', fontFamily: MONO, fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', borderRadius: 5, textTransform: 'uppercase', textDecoration: 'none', cursor: 'pointer' }}>
              View Architecture ↓
            </a>
            <a href="/docs/EECS4020_FinalReport_G3.pdf" target="_blank" rel="noopener" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '10px 20px', border: `1px solid ${ACCENT}44`, color: ACCENT, fontFamily: MONO, fontSize: 10, letterSpacing: '0.06em', borderRadius: 5, textTransform: 'uppercase', textDecoration: 'none' }}>
              Final Report ↓
            </a>
            <a href="https://github.com/RayFrightener/ml_automation" target="_blank" rel="noopener" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '10px 20px', border: '1px solid rgba(242,237,216,0.14)', color: '#B8B4A4', fontFamily: MONO, fontSize: 10, letterSpacing: '0.06em', borderRadius: 5, textTransform: 'uppercase', textDecoration: 'none' }}>
              GitHub ↗
            </a>
          </div>
        </div>
      </section>

      {/* ── Section nav ── */}
      <nav style={{ position: 'sticky', top: 56, zIndex: 90, background: 'rgba(11,13,20,0.97)', backdropFilter: 'blur(8px)', borderBottom: '1px solid rgba(242,237,216,0.06)', overflowX: 'auto', scrollbarWidth: 'none' }}>
        <div style={{ maxWidth: 860, margin: '0 auto', padding: '0 clamp(20px,4vw,52px)', display: 'flex', gap: 0 }}>
          {NAV_SECTIONS.map(s => (
            <button key={s.id}
              onClick={() => document.getElementById(s.id)?.scrollIntoView({ behavior: 'smooth' })}
              style={{
                padding: '14px 16px', border: 'none', cursor: 'pointer', whiteSpace: 'nowrap',
                fontFamily: MONO, fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase',
                color: active === s.id ? ACCENT : 'var(--text3)',
                borderBottom: active === s.id ? `2px solid ${ACCENT}` : '2px solid transparent',
                background: active === s.id ? `${ACCENT}0d` : 'transparent',
                transition: 'all 0.2s ease',
              }}
            >{s.label}</button>
          ))}
        </div>
      </nav>

      {/* ── 1. OVERVIEW ── */}
      <Section id="cs-overview">
        <SectionLabel label="Overview" />
        <h2 style={{ fontFamily: SERIF, fontWeight: 400, fontSize: 'clamp(22px,3vw,30px)', letterSpacing: '-0.02em', color: '#F2EDD8', lineHeight: 1.25, marginBottom: 20, paddingBottom: '0.05em' }}>
          From notebook workflow to governed, continuously operating AI platform
        </h2>
        <p style={{ fontSize: 15, lineHeight: 1.8, marginBottom: 16 }}>
          Homeowner Loss History Prediction was a senior design project developed in partnership with <strong style={{ color: '#F2EDD8' }}>Grange Insurance</strong> to modernize how homeowner risk and pure premium predictions are modeled, validated, monitored, and updated. Instead of treating machine learning as a one-time notebook workflow, the project reframed risk modeling as a continuously operating MLOps system.
        </p>
        <p style={{ fontSize: 15, lineHeight: 1.8, marginBottom: 16 }}>
          The system automates the full lifecycle: raw data ingestion, schema validation, preprocessing, feature engineering, drift detection, model training, hyperparameter tuning, model evaluation, experiment tracking, monitoring, alerting, and human-approved deployment.
        </p>
        <p style={{ fontSize: 15, lineHeight: 1.8 }}>
          The key contribution was not just improving model accuracy. The bigger engineering contribution was building a <strong style={{ color: '#F2EDD8' }}>governed ML operating system</strong> around the model: every dataset, schema, model run, drift event, metric, and manual decision can be tracked, reviewed, and reproduced.
        </p>

        <div style={{ marginTop: 28, overflow: 'hidden', borderRadius: 10, border: '1px solid rgba(167,139,250,0.15)', background: '#0B0D14' }}>
          <Pic src="/Images/SeniorDesign_Pipeline.jpeg" alt="MLOps pipeline architecture" onClick={() => setLb('/Images/SeniorDesign_Pipeline.jpeg')} style={{ width: '100%', display: 'block', objectFit: 'cover', maxHeight: 400, cursor: 'zoom-in' }} />
        </div>
      </Section>

      {/* ── 2. PROBLEM ── */}
      <Section id="cs-problem" alt>
        <SectionLabel label="The Problem" />
        <h2 style={{ fontFamily: SERIF, fontWeight: 400, fontSize: 'clamp(22px,3vw,30px)', letterSpacing: '-0.02em', color: '#F2EDD8', lineHeight: 1.25, marginBottom: 20, paddingBottom: '0.05em' }}>
          Risk patterns shift faster than manual modeling can adapt
        </h2>
        <p style={{ fontSize: 15, lineHeight: 1.8, marginBottom: 20 }}>
          Insurance companies need accurate homeowner risk models for pricing, underwriting, and financial stability. However, many modeling workflows are still too manual for modern claim volatility — claim volatility, inflation, weather events, and regional property-risk trends all create windows where stale models make pricing decisions.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 10 }}>
          {[
            { title: 'Manual rebuilds are slow', desc: 'Model updates required manual data pulls, notebook-based preprocessing, and repeated rebuilds — consuming actuarial time that should be focused on interpretation.', color: '#F07832' },
            { title: 'Silent schema failures', desc: 'Data schema changes could silently break downstream training with no validation layer catching type mismatches or missing columns before they corrupted model runs.', color: '#4B7BF5' },
            { title: 'No drift detection', desc: 'Model drift was difficult to detect early without automated monitoring. Stale models could price risk for weeks before a human noticed performance degradation.', color: ACCENT },
            { title: 'No experiment lineage', desc: 'Without tracking, experiments and model versions were hard to reproduce. There was no audit trail for when a model was promoted, what data it saw, or who approved it.', color: '#2DD4C8' },
            { title: 'Interpretability gap', desc: 'Business stakeholders and actuaries needed explainability, not just predictions. A black-box model creates regulatory and trust problems in insurance.', color: '#F0B429' },
            { title: 'No governance layer', desc: 'High-stakes insurance decisions require human oversight, auditability, and the ability to roll back. A notebook-only workflow provides none of these guarantees.', color: '#F472B6' },
          ].map(item => (
            <div key={item.title} style={{ padding: '18px 20px', background: `${item.color}06`, border: `1px solid ${item.color}22`, borderRadius: 8 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#F2EDD8', marginBottom: 8 }}>{item.title}</div>
              <p style={{ fontSize: 13, lineHeight: 1.7, margin: 0 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* ── 3. ARCHITECTURE ── */}
      <Section id="cs-architecture">
        <SectionLabel label="System Architecture" />
        <h2 style={{ fontFamily: SERIF, fontWeight: 400, fontSize: 'clamp(22px,3vw,30px)', letterSpacing: '-0.02em', color: '#F2EDD8', lineHeight: 1.25, marginBottom: 8, paddingBottom: '0.05em' }}>
          Modular MLOps pipeline — end-to-end
        </h2>
        <p style={{ fontSize: 14, lineHeight: 1.75, marginBottom: 28 }}>
          The architecture was built as a modular MLOps workflow instead of a single monolithic script. Each stage is independently testable, observable, and replaceable.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }} className="arch-grid">
          <div>
            {[
              { n: '01', title: 'Raw Dataset → AWS S3', sub: 'Raw homeowner loss data stored in S3 and pulled into the pipeline by Airflow.', color: '#4B7BF5' },
              { n: '02', title: 'Data Ingestion → Airflow', sub: 'Airflow schedules ingestion jobs, handles file staging, and coordinates downstream tasks.', color: '#2DD4C8' },
              { n: '03', title: 'Schema Validation → Pandera', sub: 'Validates required columns, data types, and constraints. Logs and schema snapshots stored for auditability.', color: '#F0B429' },
              { n: '04', title: 'Preprocessing → Pandas / sklearn', sub: 'Missing values, outliers, encoding, feature transformations, and train/test splitting.', color: ACCENT },
              { n: '05', title: 'Drift Detection', sub: 'Statistical drift checks against reference distributions. Detected drift triggers alerts and proposed remediation actions.', color: '#F07832' },
              { n: '06', title: 'Model Training → XGBoost', sub: 'XGBoost models trained on 100+ engineered loss-history features with monotonic constraints.', color: '#F472B6' },
            ].map((s, i, arr) => (
              <PipelineStep key={s.n} n={s.n} title={s.title} sub={s.sub} color={s.color} isLast={i === arr.length - 1} />
            ))}
          </div>
          <div>
            {[
              { n: '07', title: 'Hyperparameter Optimization → Hyperopt', sub: 'Bayesian optimization searches improved configurations and logs the best parameters to MLflow.', color: '#F0B429' },
              { n: '08', title: 'Model Tracking → MLflow', sub: 'Tracks experiments, metrics, artifacts, model versions, and registry transitions across every run.', color: '#4B7BF5' },
              { n: '09', title: 'Monitoring & Alerts → Prometheus + Slack', sub: 'Prometheus tracks system metrics. Slack sends alerts for drift, failures, retraining events, and approval requests.', color: '#2DD4C8' },
              { n: '10', title: 'Human-in-the-Loop Governance', sub: 'Manual approval gates allow analysts to approve retraining, reject proposed fixes, override decisions, or promote models.', color: ACCENT },
              { n: '11', title: 'Deployment → AWS EC2/S3 + CI/CD', sub: 'Containerized services deployed on AWS EC2/S3, with CI/CD support for repeatable builds and updates.', color: '#F07832' },
            ].map((s, i, arr) => (
              <PipelineStep key={s.n} n={s.n} title={s.title} sub={s.sub} color={s.color} isLast={i === arr.length - 1} />
            ))}
          </div>
        </div>
        <style>{`@media(max-width:640px){.arch-grid{grid-template-columns:1fr!important}}`}</style>
      </Section>

      {/* ── 4. STACK ── */}
      <Section id="cs-stack" alt>
        <SectionLabel label="Technical Stack" />
        <h2 style={{ fontFamily: SERIF, fontWeight: 400, fontSize: 'clamp(22px,3vw,30px)', letterSpacing: '-0.02em', color: '#F2EDD8', lineHeight: 1.25, marginBottom: 24, paddingBottom: '0.05em' }}>
          Purpose-selected tools for each layer
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 10 }}>
          {[
            { label: 'Machine Learning', color: ACCENT, items: ['XGBoost', 'Hyperopt / Bayesian Opt.', 'scikit-learn', 'SHAP explainability', 'Decile lift charts', 'RMSE · MAE · R²'] },
            { label: 'MLOps & Automation', color: '#4B7BF5', items: ['Apache Airflow', 'MLflow', 'Pandera', 'Prometheus', 'Slack API', 'GitHub Actions', 'Docker'] },
            { label: 'Cloud & Storage', color: '#2DD4C8', items: ['AWS EC2', 'AWS S3', 'IAM-style access control', 'Containerized deployment', 'CI/CD pipeline'] },
            { label: 'Data & Features', color: '#F0B429', items: ['Pandas', 'NumPy', '100+ engineered features', 'Schema snapshots', 'Drift reference distributions', 'Monotonic constraints'] },
          ].map(group => (
            <div key={group.label} style={{ background: `${group.color}06`, borderTop: `2px solid ${group.color}`, borderRight: '1px solid rgba(242,237,216,0.07)', borderBottom: '1px solid rgba(242,237,216,0.07)', borderLeft: '1px solid rgba(242,237,216,0.07)', borderRadius: 8, padding: '20px 18px' }}>
              <div style={{ fontFamily: MONO, fontSize: 10, color: group.color, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 14 }}>{group.label}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {group.items.map(item => (
                  <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 3, height: 3, borderRadius: '50%', background: group.color, flexShrink: 0, opacity: 0.6 }} />
                    <span style={{ fontSize: 13, color: '#B8B4A4', lineHeight: 1.4 }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* ── 5. MODEL DESIGN ── */}
      <Section id="cs-model">
        <SectionLabel label="Model Design" />
        <h2 style={{ fontFamily: SERIF, fontWeight: 400, fontSize: 'clamp(22px,3vw,30px)', letterSpacing: '-0.02em', color: '#F2EDD8', lineHeight: 1.25, marginBottom: 20, paddingBottom: '0.05em' }}>
          Why XGBoost — and what it took to govern it
        </h2>
        <p style={{ fontSize: 15, lineHeight: 1.8, marginBottom: 20 }}>
          XGBoost was chosen because it offered the best balance between predictive performance, explainability, speed, and insurance-industry practicality — not just the highest raw metric.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }} className="model-grid">
          <div>
            <div style={{ fontFamily: MONO, fontSize: 10, color: ACCENT, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 14 }}>Why XGBoost</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                'Strong performance on structured/tabular insurance data',
                'Supports monotonic constraints for logically consistent risk modeling',
                'Works well with SHAP for feature-level explainability',
                'More governable than deep neural networks',
                'Scales to production without infrastructure overhead',
              ].map(item => (
                <div key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 13, lineHeight: 1.65, color: '#B8B4A4' }}>
                  <span style={{ color: ACCENT, flexShrink: 0, marginTop: 1 }}>✓</span>
                  {item}
                </div>
              ))}
            </div>
          </div>
          <div>
            <div style={{ fontFamily: MONO, fontSize: 10, color: 'var(--text3)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 14 }}>Alternatives Considered</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                { name: 'GLM Pipeline', why: 'Baseline — 26% worse RMSE' },
                { name: 'Random Forest', why: 'Slower, less interpretable' },
                { name: 'LightGBM', why: 'Strong but less insurance-standard' },
                { name: 'CatBoost', why: 'Good, but SHAP integration less mature' },
                { name: 'Deep Learning / MLP', why: 'Too opaque for actuarial review' },
              ].map(item => (
                <div key={item.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 8, fontSize: 13, padding: '6px 0', borderBottom: '1px solid rgba(242,237,216,0.05)' }}>
                  <span style={{ color: 'var(--text3)' }}>{item.name}</span>
                  <span style={{ color: 'var(--text3)', fontSize: 11, textAlign: 'right' }}>{item.why}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div style={{ padding: '20px 22px', background: `${ACCENT}08`, border: `1px solid ${ACCENT}22`, borderRadius: 8 }}>
          <div style={{ fontFamily: MONO, fontSize: 10, color: ACCENT, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 10 }}>Hyperparameter Optimization</div>
          <p style={{ fontSize: 14, lineHeight: 1.75, margin: 0 }}>Hyperopt with Bayesian optimization searched across learning rate, max depth, subsample, colsample, and regularization parameters. Every tuning run was tracked in MLflow with the associated training dataset snapshot, enabling reproducible comparison across experiments and preventing the common problem of &quot;which run was the best one?&quot;</p>
        </div>
        <style>{`@media(max-width:600px){.model-grid{grid-template-columns:1fr!important}}`}</style>
      </Section>

      {/* ── 6. RESULTS ── */}
      <Section id="cs-results" alt>
        <SectionLabel label="Results & Impact" />
        <h2 style={{ fontFamily: SERIF, fontWeight: 400, fontSize: 'clamp(22px,3vw,30px)', letterSpacing: '-0.02em', color: '#F2EDD8', lineHeight: 1.25, marginBottom: 24, paddingBottom: '0.05em' }}>
          Strong predictive performance and meaningful automation gains
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 10, marginBottom: 28 }}>
          <Metric value="R² 0.982" label="Final model accuracy" color={ACCENT} />
          <Metric value="RMSE 7216" label="Root mean square error" color="#F0B429" />
          <Metric value="MAE $29.10" label="Mean absolute error" color="#4B7BF5" />
          <Metric value="26%" label="RMSE improvement vs GLM" color="#2DD4C8" />
          <Metric value="75%" label="Manual review reduction" color="#F07832" />
          <Metric value="100+" label="Engineered + validated features" color={ACCENT} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }} className="results-grid">
          <div style={{ padding: '20px 22px', background: 'rgba(167,139,250,0.04)', border: '1px solid rgba(167,139,250,0.15)', borderRadius: 8 }}>
            <div style={{ fontFamily: MONO, fontSize: 10, color: ACCENT, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 14 }}>Automation Gains</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                '75% reduction in manual iteration / review burden',
                '3× improvement in retraining responsiveness',
                'Schema snapshots and model lineage tracked for auditability',
                'Drift detection connected to self-healing retraining workflows',
                'Slack alerts added for operational visibility',
                'Manual override dashboard for human governance',
              ].map(item => (
                <div key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 13, lineHeight: 1.6, color: '#B8B4A4' }}>
                  <span style={{ color: ACCENT, flexShrink: 0, marginTop: 2 }}>—</span>
                  {item}
                </div>
              ))}
            </div>
          </div>
          <div style={{ padding: '20px 22px', background: 'rgba(45,212,200,0.04)', border: '1px solid rgba(45,212,200,0.15)', borderRadius: 8 }}>
            <div style={{ fontFamily: MONO, fontSize: 10, color: '#2DD4C8', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 14 }}>Business Impact</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                'Reduced manual validation effort for actuarial team',
                'Faster retraining response to market changes',
                'Improved reproducibility across all model runs',
                'Better model governance with full decision audit trail',
                'More transparent actuarial review process',
                'Stronger deployment readiness than notebook-only model',
              ].map(item => (
                <div key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 13, lineHeight: 1.6, color: '#B8B4A4' }}>
                  <span style={{ color: '#2DD4C8', flexShrink: 0, marginTop: 2 }}>—</span>
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
        <style>{`@media(max-width:560px){.results-grid{grid-template-columns:1fr!important}}`}</style>
      </Section>

      {/* ── 7. INSIGHTS ── */}
      <Section id="cs-insights">
        <SectionLabel label="Key Insights & Lessons" />
        <h2 style={{ fontFamily: SERIF, fontWeight: 400, fontSize: 'clamp(22px,3vw,30px)', letterSpacing: '-0.02em', color: '#F2EDD8', lineHeight: 1.25, marginBottom: 8, paddingBottom: '0.05em' }}>
          The real value: automation with governance
        </h2>
        <p style={{ fontSize: 15, lineHeight: 1.8, marginBottom: 28, maxWidth: 680 }}>
          The 75% reduction didn&apos;t happen because humans were removed from the workflow. It happened because the system moved humans to the right point in the loop — intervening only where judgment matters, not at every routine validation step.
        </p>
        <div style={{ padding: '24px 28px', background: `${ACCENT}0a`, border: `1px solid ${ACCENT}28`, borderRadius: 10, marginBottom: 20 }}>
          <div style={{ fontFamily: SERIF, fontSize: 18, color: '#F2EDD8', lineHeight: 1.5, fontStyle: 'italic', marginBottom: 10 }}>
            &ldquo;Instead of asking actuaries or analysts to manually rebuild and inspect every step, the pipeline handles routine validation, training, logging, and alerting automatically. Humans intervene only when judgment matters: drift remediation, suspicious model behavior, hyperparameter override, rollback, or production promotion.&rdquo;
          </div>
          <div style={{ fontFamily: MONO, fontSize: 10, color: ACCENT, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Core Design Principle</div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[
            { title: 'Schema validation is not optional in production ML', desc: 'It prevents silent failures from cascading into bad model training. Data schema changes can break downstream training without any visible error until the model produces wrong outputs.', color: '#F0B429' },
            { title: 'Monitoring matters as much as modeling', desc: 'Prometheus-style metrics and alerting helped expose system-level problems earlier. A model that works but can\'t be observed isn\'t production-ready.', color: '#4B7BF5' },
            { title: 'Human oversight increases trust', desc: 'Actuary involvement and manual approval gates made the automation more credible to stakeholders, not less. Governance isn\'t overhead — it\'s what makes automation trustworthy.', color: ACCENT },
            { title: 'Experiment tracking is essential', desc: 'MLflow made it easier to compare runs, preserve model lineage, and reproduce results. Without it, the question of "which configuration produced this model?" has no good answer.', color: '#2DD4C8' },
            { title: 'Drift response must be governed', desc: 'Automatic retraining is powerful, but unsafe without approval, rollback, and explanation. Self-healing workflows need human checkpoints before they touch production.', color: '#F07832' },
          ].map(item => (
            <div key={item.title} style={{ padding: '18px 22px', background: `${item.color}05`, border: `1px solid ${item.color}18`, borderRadius: 8, display: 'flex', gap: 16, alignItems: 'flex-start' }}>
              <div style={{ width: 3, height: '100%', background: item.color, borderRadius: 2, flexShrink: 0, alignSelf: 'stretch', minHeight: 40 }} />
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#F2EDD8', marginBottom: 6 }}>{item.title}</div>
                <p style={{ fontSize: 13, lineHeight: 1.7, margin: 0 }}>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* ── 8. LESSONS ── */}
      <Section id="cs-lessons" alt>
        <SectionLabel label="Lessons" />
        <h2 style={{ fontFamily: SERIF, fontWeight: 400, fontSize: 'clamp(22px,3vw,30px)', letterSpacing: '-0.02em', color: '#F2EDD8', lineHeight: 1.25, marginBottom: 20, paddingBottom: '0.05em' }}>
          What broke, and what I&apos;d do differently
        </h2>
        <p style={{ fontSize: 15, lineHeight: 1.8, marginBottom: 24, maxWidth: 680 }}>
          The governance layer wasn&apos;t academic — it existed because the failure modes were real. One of them — and one design limit I&apos;d address first — are worth naming directly.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 10 }}>
          <div style={{ padding: '20px 22px', background: `${ACCENT}0a`, border: `1px solid ${ACCENT}28`, borderRadius: 10 }}>
            <div style={{ fontFamily: MONO, fontSize: 10, color: ACCENT, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 10 }}>What broke</div>
            <p style={{ fontSize: 14, lineHeight: 1.75, margin: 0 }}>
              Schema changes broke training silently. A shifted column type or a missing field could pass straight through preprocessing and corrupt a model run with no visible error — the pipeline only looked wrong once the predictions came out wrong. That is the whole reason a Pandera validation layer and schema snapshots now sit in front of training.
            </p>
          </div>
          <div style={{ padding: '20px 22px', background: 'rgba(242,237,216,0.02)', border: '1px solid rgba(242,237,216,0.09)', borderRadius: 10 }}>
            <div style={{ fontFamily: MONO, fontSize: 10, color: '#F2EDD8', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 10 }}>What I&apos;d do differently</div>
            <p style={{ fontSize: 14, lineHeight: 1.75, margin: 0 }}>
              One XGBoost model carries every peril, and ingestion runs in batch. I&apos;d split it into separate model tracks for water, wind/hail, fire, and property loss so each can be tuned and monitored on its own drift, and move toward event-driven scoring rather than waiting for the next batch cycle.
            </p>
          </div>
        </div>
      </Section>

      {/* ── 9. FUTURE WORK ── */}
      <Section id="cs-future">
        <SectionLabel label="Future Work" />
        <h2 style={{ fontFamily: SERIF, fontWeight: 400, fontSize: 'clamp(22px,3vw,30px)', letterSpacing: '-0.02em', color: '#F2EDD8', lineHeight: 1.25, marginBottom: 20, paddingBottom: '0.05em' }}>
          Where the platform goes next
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 10 }}>
          {[
            { title: 'Real-time pipeline', desc: 'Event-driven architecture for faster scoring and streaming updates rather than batch ingestion cycles.', color: '#4B7BF5' },
            { title: 'Multi-model peril registry', desc: 'Separate model tracks for water, wind/hail, fire, and property-loss categories rather than a single monolithic model.', color: ACCENT },
            { title: 'AWS SageMaker integration', desc: 'Managed training, hosted endpoints, model monitoring, and registry workflows through SageMaker to reduce operational overhead.', color: '#F0B429' },
            { title: 'Fairness automation', desc: 'AIF360 or Fairlearn integration to continuously audit model outputs for demographic fairness and flag bias drift.', color: '#2DD4C8' },
            { title: 'AI fix-proposal sandbox', desc: 'Secure sandbox where AI agents can propose drift fixes before human approval — explanation tracing included.', color: '#F07832' },
            { title: 'Cohort-level dashboard', desc: 'Actual-vs-predicted premium overlays and cohort-level variance views to give actuaries richer inspection of model behavior by risk segment.', color: '#F472B6' },
          ].map(item => (
            <div key={item.title} style={{ padding: '18px 20px', background: `${item.color}06`, border: `1px solid ${item.color}22`, borderRadius: 8 }}>
              <div style={{ width: 24, height: 24, borderRadius: 6, background: `${item.color}14`, border: `1px solid ${item.color}33`, marginBottom: 12 }} />
              <div style={{ fontSize: 13, fontWeight: 600, color: '#F2EDD8', marginBottom: 8 }}>{item.title}</div>
              <p style={{ fontSize: 13, lineHeight: 1.65, margin: 0 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* ── Footer CTA ── */}
      <section style={{ padding: 'clamp(48px,6vw,80px) clamp(20px,4vw,52px)', borderTop: '1px solid rgba(167,139,250,0.12)', background: 'rgba(11,13,20,0.95)' }}>
        <div style={{ maxWidth: 860, margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 20 }}>
          <div style={{ fontFamily: MONO, fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: ACCENT }}>Grange Insurance × University of Toledo · 2024–2025</div>
          <h2 style={{ fontFamily: SERIF, fontWeight: 400, fontSize: 'clamp(24px,4vw,38px)', letterSpacing: '-0.02em', color: '#F2EDD8', lineHeight: 1.2, paddingBottom: '0.05em', margin: 0 }}>
            Read the full technical report
          </h2>
          <p style={{ fontSize: 15, lineHeight: 1.75, color: '#B8B4A4', maxWidth: 520, margin: 0 }}>
            The final report covers methodology, feature engineering details, model evaluation, pipeline architecture diagrams, and governance framework in full.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center' }}>
            <a href="/docs/EECS4020_FinalReport_G3.pdf" target="_blank" rel="noopener" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '12px 24px', background: ACCENT, color: '#0B0D14', fontFamily: MONO, fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', borderRadius: 5, textTransform: 'uppercase', textDecoration: 'none' }}>Download Final Report ↓</a>
            <a href="https://github.com/RayFrightener/ml_automation" target="_blank" rel="noopener" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '12px 24px', border: `1px solid ${ACCENT}44`, color: ACCENT, fontFamily: MONO, fontSize: 10, letterSpacing: '0.06em', borderRadius: 5, textTransform: 'uppercase', textDecoration: 'none' }}>View on GitHub ↗</a>
            <Link href="/#projects" transitionTypes={['nav-back']} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '12px 24px', border: '1px solid rgba(242,237,216,0.12)', color: '#B8B4A4', fontFamily: MONO, fontSize: 10, letterSpacing: '0.06em', borderRadius: 5, textTransform: 'uppercase', textDecoration: 'none' }}>← Back to Portfolio</Link>
          </div>
        </div>
      </section>
      {lb && <Lightbox src={lb} onClose={() => setLb(null)} />}
    </div>
  );
}
