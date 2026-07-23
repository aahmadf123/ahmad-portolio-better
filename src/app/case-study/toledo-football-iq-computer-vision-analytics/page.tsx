'use client';

import React, { useEffect, useState } from 'react';
import { SmartBackLink } from '@/components/ui/smart-back-link';
import { Lightbox } from '@/components/ui/image-lightbox';
import { Pic } from '@/components/ui/pic';
import { resolveSkillColor } from '@/lib/skill-colors';

const SERIF  = "var(--font-chakra), 'Chakra Petch', sans-serif";
const MONO   = "var(--font-chakra), 'Chakra Petch', monospace";
const ACCENT = '#ef4444';

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

const SECTION_IDS    = ['overview', 'problem', 'pipeline', 'architecture', 'database', 'features', 'roadmap', 'lessons'];
const SECTION_LABELS = ['Overview', 'Problem', 'CV Pipeline', 'Architecture', 'Database', 'Key Features', 'Roadmap', 'Lessons'];

export default function ToledoFootballIQCaseStudy() {
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
        .metrics-grid-fiq { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; margin-bottom: 36px; }
        @media (max-width: 640px) { .metrics-grid-fiq { grid-template-columns: repeat(2, 1fr); } }
        .two-col-fiq { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
        @media (max-width: 700px) { .two-col-fiq { grid-template-columns: 1fr; } }
        .three-col-fiq { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; }
        @media (max-width: 700px) { .three-col-fiq { grid-template-columns: 1fr 1fr; } }
        @media (max-width: 480px) { .three-col-fiq { grid-template-columns: 1fr; } }
        .entity-card { padding: 16px 18px; background: ${ACCENT}04; border: 1px solid ${ACCENT}18; border-radius: 8px; transition: all 0.2s ease; }
        .entity-card:hover { border-color: ${ACCENT}50; background: ${ACCENT}0c; }
        .entity-field { font-family: ${MONO}; font-size: 10px; color: var(--text3); padding: 2px 0; letter-spacing: 0.03em; }
        .entity-key { color: ${ACCENT}; }
        .principle-card { padding: 16px 18px; background: rgba(242,237,216,0.02); border: 1px solid rgba(244,244,242,0.07); border-radius: 8px; transition: all 0.2s ease; }
        .principle-card:hover { border-color: ${ACCENT}40; background: ${ACCENT}0a; }
        .roadmap-row { display: flex; gap: 14px; padding: 16px 18px; background: rgba(242,237,216,0.02); border: 1px solid rgba(244,244,242,0.06); border-radius: 8px; align-items: flex-start; transition: all 0.2s ease; }
        .roadmap-row:hover { border-color: ${ACCENT}40; background: ${ACCENT}06; }
        .nav-link { font-family: ${MONO}; font-size: 10px; letter-spacing: 0.08em; text-transform: uppercase; text-decoration: none; transition: color 0.2s; padding: 4px 0; cursor: pointer; background: none; border: none; }
        .pipeline-step { display: flex; gap: 14px; align-items: flex-start; padding: 14px 18px; background: ${ACCENT}06; border: 1px solid ${ACCENT}18; border-radius: 8px; }
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
        <span style={{ fontFamily: MONO, fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: ACCENT }}>Toledo Football IQ</span>
        <div style={{ width: 80 }} />
      </header>

      {/* ── Hero ── */}
      <div style={{ padding: 'clamp(48px,8vh,96px) clamp(20px,5vw,80px) 0' }}>
        <div style={{ maxWidth: 860, margin: '0 auto' }}>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 20 }}>
            <Tag>Computer Vision</Tag>
            <Tag>Sports Analytics</Tag>
            <Tag>Active Build</Tag>
            <Tag>University of Toledo Athletics</Tag>
          </div>
          <h1 style={{ fontFamily: SERIF, fontSize: 'var(--text-3xl)', fontWeight: 400, margin: '0 0 16px', lineHeight: 1.1, paddingBottom: '0.04em', background: `linear-gradient(135deg, var(--foreground) 70%, ${ACCENT} 100%)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', display: 'inline-block' }}>
            Toledo Football IQ
          </h1>
          <p style={{ fontFamily: SERIF, fontSize: 16, color: 'var(--text2)', maxWidth: 620, lineHeight: 1.6, margin: '0 0 40px' }}>
            A drone-based computer vision platform for Toledo Football that converts overhead practice footage into clip-linked player tracking, football labels, self-scout insights, and coach-correctable analytics.
          </p>

          <div className="metrics-grid-fiq">
            <Metric value="10" label="Stage CV pipeline" />
            <Metric value="50–100" label="Phase 0 evaluation clips" />
            <Metric value="90%+" label="Field-marking visibility target" />
            <Metric value="85%" label="Usable-clip target for metrics" />
            <Metric value="18+" label="Database schema tables" />
            <Metric value="&lt;10 min" label="Same-session feedback target" />
          </div>

          {/* Hero image */}
          <div style={{ width: '100%', borderRadius: 10, overflow: 'hidden', border: `1px solid ${ACCENT}18`, background: 'var(--background)', marginBottom: 64 }}>
            <Pic
              src="/Images/Football_IQ_Analytics.png"
              alt="Toledo Football IQ Analytics Platform"
              onClick={() => setLb('/Images/Football_IQ_Analytics.png')}
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
              <SectionLabel>01 - Overview</SectionLabel>
              <h2 className="cs-h2">Trust is the product</h2>
              <p>
                Toledo Football IQ is an active computer vision and sports analytics platform for University of Toledo Football. It is designed to convert drone-based overhead practice footage into structured, coach-verifiable football intelligence.
              </p>
              <p>
                The core principle is evidence-first analytics. Every output connects to the exact clip, overlay, confidence score, correction path, and model version. If a coach cannot verify it, correct it, and teach from it - it should not be treated as a production metric.
              </p>
              <p>
                The system is built as a coach-in-the-loop football intelligence platform. It starts with reliable practice-film infrastructure - video ingestion, play segmentation, field calibration, player tracking, clip-linked metrics, coach correction - and grows toward formation and motion analysis, route and coverage analytics, self-scout, pose-lite biomechanics, player development profiles, similar-rep search, zero-shot concept discovery, and same-session feedback.
              </p>
              <div style={{ padding: '18px 22px', background: `${ACCENT}08`, border: `1px solid ${ACCENT}22`, borderRadius: 8, marginTop: 8 }}>
                <p style={{ fontFamily: SERIF, fontSize: 15, color: 'var(--foreground)', margin: 0, lineHeight: 1.5 }}>
                  Product north star: a Toledo-owned CV platform that converts drone and practice film into verified football intelligence - faster coaching feedback, better self-scout, better opponent prep, objective player development, and health-aware workload context.
                </p>
              </div>
            </Section>

            {/* PROBLEM */}
            <Section id="problem">
              <SectionLabel>02 - Problem</SectionLabel>
              <h2 className="cs-h2">Raw film is valuable but expensive to review</h2>
              <p>
                Football programs already use film heavily. Coaches and analysts manually tag plays, identify formations, evaluate routes, track player effort, study tendencies, and create cutups. This works - but it is time-intensive, and the bottleneck gets worse as the volume of drone and practice footage grows.
              </p>
              <p>
                The challenge is not just automation. The challenge is trust. A football computer vision system must handle:
              </p>
              <div className="two-col-fiq" style={{ marginBottom: 24 }}>
                {[
                  ['Drone camera movement', 'Overhead drone footage involves dynamic homography - the camera moves, drifts, and reorients, meaning field calibration must be recomputed continuously, not once.'],
                  ['Occlusion at the line', 'Players in crowded line-of-scrimmage situations overlap heavily. Standard detection and tracking methods degrade significantly in high-occlusion football scenarios.'],
                  ['Re-identification difficulty', 'Players wear helmets and similar uniforms. Jersey numbers blur at distance or are never visible from overhead. Identity association requires multiple signal types.'],
                  ['Coach-specific terminology', 'Generic CV labels like "mesh" or "outside zone" may not match Toledo\'s internal call language. A system that speaks wrong terminology loses coach adoption immediately.'],
                  ['Overconfident outputs', 'A model that reports confident metrics on a poorly calibrated clip is worse than no model. Calibration confidence must gate downstream analytics.'],
                  ['Health and workload sensitivity', 'Effort, load, and biomechanics outputs touch athlete welfare. Role-based access, conservative labeling, and no automated medical inference are non-negotiable.'],
                ].map(([title, body]) => (
                  <div key={title} className="principle-card">
                    <div style={{ fontFamily: MONO, fontSize: 10, color: ACCENT, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6 }}>{title}</div>
                    <p style={{ margin: 0, fontSize: 13, lineHeight: 1.6 }}>{body}</p>
                  </div>
                ))}
              </div>
              <p>
                Commercial tools can provide broad AI tagging, but Toledo can create a local advantage through overhead drone footage, Toledo-specific terminology, a coach-correction flywheel, and athlete-development integration. That private, corrected, domain-specific data is the moat.
              </p>
            </Section>

            {/* CV PIPELINE */}
            <Section id="pipeline">
              <SectionLabel>03 - CV Pipeline</SectionLabel>
              <h2 className="cs-h2">10 stages from raw video to coach dashboard</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 28 }}>
                {[
                  ['01', 'Video Ingest', 'Probe FPS, resolution, codec, duration, corruption, and metadata. Store raw video and queue processing jobs.'],
                  ['02', 'Play Segmentation', 'Split continuous practice video into per-play clips with editable boundaries. Manual correction is a first-class feature, not an afterthought.'],
                  ['03', 'Field Calibration', 'Detect sidelines, yard lines, hash marks, field numbers, and boundaries. Estimate homography into standardized football field coordinates. Output calibration confidence and analytics-safe status - weak calibration suppresses downstream metrics.'],
                  ['04', 'Player Detection', 'YOLO or RF-DETR detects players, officials, and the ball. Detection confidence feeds the calibration-safe gating layer.'],
                  ['05', 'Player Tracking', 'ByteTrack for speed and throughput. BoT-SORT for identity-aware tracking. SAM + CSRT-style approaches for heavy occlusion cases at the line of scrimmage.'],
                  ['06', 'Identity Association (Re-ID)', 'Combine jersey OCR, roster priors, height/weight/position priors, equipment cues, biometric ratios, and movement signatures. Every identity assignment carries a confidence score and a correction path.'],
                  ['07', 'Event Detection', 'Detect snap, motion start/end, handoff, throw, catch, contact, tackle, and end-of-play events. Manual correction is supported early - automated event detection improves as corrections accumulate.'],
                  ['08', 'Football Labels', 'Propose offensive formation, defensive front, coverage shell, motion, shift, route family, and pressure candidates. Separate generic labels from Toledo-specific terminology.'],
                  ['09', 'Metric Computation', 'Compute cushion, separation, distance traveled, max speed, return-to-huddle speed, time to throw, dropback depth, gap width proxy, pass-set depth, pursuit effort, and downfield blocking participation.'],
                  ['10', 'Overlay Rendering & Dashboard Indexing', 'Render clips with field grids, tracks, route paths, motion arrows, coverage shells, confidence warnings, and metric callouts. Index for dashboard search and coach review.'],
                ].map(([n, title, body]) => (
                  <div key={n} className="pipeline-step">
                    <div style={{ fontFamily: MONO, fontSize: 10, color: ACCENT, opacity: 0.7, flexShrink: 0, minWidth: 22, marginTop: 1 }}>{n}</div>
                    <div>
                      <div style={{ fontFamily: MONO, fontSize: 11, color: ACCENT, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 4 }}>{title}</div>
                      <p style={{ margin: 0, fontSize: 13, lineHeight: 1.6 }}>{body}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Section>

            {/* ARCHITECTURE */}
            <Section id="architecture">
              <SectionLabel>04 - Architecture</SectionLabel>
              <h2 className="cs-h2">Evidence-first system design</h2>
              <p>
                Every layer of the stack is chosen to serve the evidence-first contract: every metric must be traceable to a clip, a model version, a confidence score, and a correction path.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 28 }}>
                <DbLayer n="FE" title="React Frontend" items={['Practice Inbox - upload status, QA flags, calibration warnings', 'Clip Review - overlays, boundary correction, identity assignment, label correction', 'Coach Dashboards - formations, effort, tempo, clip-linked charts', 'Labeling Queue - low-confidence plays, identity conflicts, regression examples']} />
                <DbLayer n="API" title="FastAPI Backend" items={['Videos API','Clips API','Metrics API','Labels API','Corrections API','Jobs API','Players API','Model versions API']} />
                <DbLayer n="DB" title="Managed Postgres + pgvector" items={['18+ relational tables','pgvector for play embeddings and similar-rep search','Alembic migrations','Full evidence lineage per output']} />
                <DbLayer n="GPU" title="GPU Processing" items={['Local NVIDIA workstation - Phase 0/1','Burst cloud GPU workers - Phase 2+','CUDA + cuDNN','FFmpeg NVDEC/NVENC','PyTorch model pipeline','Zero-copy GPU pipelines for high-res video']} />
                <DbLayer n="STORE" title="Object Storage" items={['Cloudflare R2 or S3-compatible','Raw videos','Per-play clips','Overlay renders','Model artifacts','Training dataset exports']} />
                <DbLayer n="QUEUE" title="Job Queue" items={['Cloudflare Queues / BullMQ / Celery','Video processing queue','Nightly training export queue','Same-session lightweight queue']} />
                <DbLayer n="MLR" title="Model Registry" items={['MLflow or internal registry','Every output tied to model version + dataset snapshot','Training data export from coach corrections','Version-gated metric computation']} />
              </div>
            </Section>

            {/* DATABASE */}
            <Section id="database">
              <SectionLabel>05 - Database Design</SectionLabel>
              <h2 className="cs-h2">Schema built around evidence and lineage</h2>
              <p>
                Every table answers one question for any output: where did this metric come from, what model produced it, what evidence supports it, and has a coach corrected it?
              </p>
              <div className="three-col-fiq" style={{ marginBottom: 24 }}>
                {[
                  { name: 'videos', fields: ['video_id', 'filename', 'duration', 'fps', 'resolution', 'upload_at', 'status'] },
                  { name: 'clips', fields: ['clip_id', 'video_id', 'start_frame', 'end_frame', 'play_number', 'corrected', 'analytics_safe'] },
                  { name: 'field_calibrations', fields: ['cal_id', 'clip_id', 'homography_matrix', 'confidence', 'analytics_safe', 'model_version_id'] },
                  { name: 'tracklets', fields: ['tracklet_id', 'clip_id', 'player_id', 'tracker', 'confidence', 'identity_source', 'corrected'] },
                  { name: 'trackpoints', fields: ['point_id', 'tracklet_id', 'frame', 'pixel_x', 'pixel_y', 'field_x', 'field_y'] },
                  { name: 'events', fields: ['event_id', 'clip_id', 'event_type', 'frame', 'confidence', 'corrected'] },
                  { name: 'labels', fields: ['label_id', 'clip_id', 'label_type', 'value', 'toledo_term', 'confidence', 'model_version_id'] },
                  { name: 'coach_corrections', fields: ['correction_id', 'target_type', 'target_id', 'field', 'old_value', 'new_value', 'corrected_by', 'created_at'] },
                  { name: 'metrics', fields: ['metric_id', 'clip_id', 'player_id', 'metric_type', 'value', 'confidence', 'model_version_id', 'suppressed'] },
                  { name: 'players', fields: ['player_id', 'roster_name', 'number', 'position', 'height', 'weight', 'active'] },
                  { name: 'player_profiles', fields: ['profile_id', 'player_id', 'role_summary', 'dev_goals', 'coach_notes', 'workload_visible'] },
                  { name: 'model_versions', fields: ['version_id', 'model_name', 'version_tag', 'trained_on', 'deployed_at', 'active'] },
                  { name: 'training_datasets', fields: ['dataset_id', 'created_at', 'correction_count', 'source_clips', 'exported_at'] },
                  { name: 'play_embeddings', fields: ['embedding_id', 'clip_id', 'model_version_id', 'vector', 'created_at'] },
                  { name: 'processing_jobs', fields: ['job_id', 'video_id', 'stage', 'status', 'started_at', 'finished_at', 'error'] },
                  { name: 'users', fields: ['user_id', 'name', 'role', 'department', 'active'] },
                  { name: 'quantum_experiments', fields: ['exp_id', 'name', 'hypothesis', 'status', 'result_summary', 'created_at'] },
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
                The <code style={{ fontFamily: MONO, fontSize: 12, color: ACCENT, background: `${ACCENT}10`, padding: '1px 5px', borderRadius: 4 }}>coach_corrections</code> table is the flywheel engine - every correction to any output type is recorded, timestamped, and exported to <code style={{ fontFamily: MONO, fontSize: 12, color: ACCENT, background: `${ACCENT}10`, padding: '1px 5px', borderRadius: 4 }}>training_datasets</code> for model retraining. The <code style={{ fontFamily: MONO, fontSize: 12, color: ACCENT, background: `${ACCENT}10`, padding: '1px 5px', borderRadius: 4 }}>metrics.suppressed</code> flag prevents analytics from surfacing when calibration confidence is below threshold.
              </p>
            </Section>

            {/* KEY FEATURES */}
            <Section id="features">
              <SectionLabel>06 - Key Features</SectionLabel>
              <h2 className="cs-h2">From reliable foundations to Toledo differentiators</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 28 }}>
                {[
                  ['Coach-Correction Flywheel', 'Coaches and analysts correct play boundaries, formation labels, route labels, coverage labels, player identity, and metrics. Every correction becomes structured Toledo-specific training data. This is the competitive moat: private, corrected, domain-specific data beats any off-the-shelf model at Toledo football terminology.'],
                  ['Toledo Terminology Layer', 'The platform separates generic football labels from Toledo-specific call language. A concept can have a generic label like "mesh" while also mapping to Toledo\'s internal terminology. This keeps ML portable while making the product feel native to staff.'],
                  ['Calibration Confidence Gating', 'Each clip receives an analytics-safe score based on field visibility, homography stability, player scale, motion blur, drone drift, and occlusion density. Weak calibration suppresses precise speed, separation, and distance metrics before they can mislead coaching decisions.'],
                  ['Self-Scout Exposure Index', 'Identifies what Toledo is unintentionally revealing: formation-to-play tendencies, motion-to-play tendencies, field-zone tendencies, personnel tendencies, and pre-snap tells. Shows what a prepared opponent would see.'],
                  ['Pose-Lite Biomechanics', 'Coarse, coach-useful measures from overhead footage: pad level, hip flexion, torso angle, pass-set depth, strike timing, shoulder-over-knee alignment, deceleration step count, hip sink depth, stride symmetry, QB shoulder-hip separation. These remain experimental until reviewed by the relevant position coach.'],
                  ['Individualized Player Profiles', 'Longitudinal development profiles: roster bio, role summary, development goals, coach notes, best teaching clips, best recruiting clips, corrected metrics, position benchmarks, player-facing summaries, workload visibility controls, and weekly snapshots. This turns the platform into a player-development system, not just a film tagger.'],
                  ['Similar-Rep Search', 'Coaches select a clip and find similar reps based on movement, spacing, formation, route concept, or play embeddings (pgvector). Valuable when labels are incomplete or when scouting opponent concepts.'],
                  ['Same-Session Feedback', 'A later phase targets period-break feedback: clip-ready metrics to position coaches within 5–10 minutes between periods. Full sessions processed within 60 minutes of practice ending. Lightweight models run during practice; full-quality runs run overnight.'],
                ].map(([title, body]) => (
                  <div key={title} style={{ padding: '14px 18px', background: `${ACCENT}06`, border: `1px solid ${ACCENT}18`, borderRadius: 8 }}>
                    <div style={{ fontFamily: MONO, fontSize: 10, color: ACCENT, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6 }}>{title}</div>
                    <p style={{ margin: 0, fontSize: 13, lineHeight: 1.65 }}>{body}</p>
                  </div>
                ))}
              </div>

              <h3 className="cs-h3">Technical stack</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 8 }}>
                {['YOLO','RF-DETR','ByteTrack','BoT-SORT','RTMPose','FastAPI','React','Postgres','pgvector','Cloudflare R2','MLflow','PyTorch','FFmpeg','CUDA','BullMQ'].map(t => <Tag key={t}>{t}</Tag>)}
              </div>
            </Section>

            {/* ROADMAP */}
            <Section id="roadmap">
              <SectionLabel>07 - Phased Roadmap</SectionLabel>
              <h2 className="cs-h2">Foundations before frontier analytics</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
                {[
                  {
                    phase: 'Phase 0', label: 'Capture & Validation Sprint', color: ACCENT,
                    items: ['Drone capture protocol and naming/upload process', '50–100 representative evaluation clips', 'Toledo label taxonomy definition', 'Baseline detection and calibration report', 'Coach review checkpoint and MVP scope freeze'],
                    exit: '90%+ of clips have visible field markings. Coaches approve MVP direction.',
                  },
                  {
                    phase: 'Phase 1', label: 'Foundation MVP', color: '#f59e0b',
                    items: ['Video ingestion and job tracking', 'Play segmentation with manual boundary correction', 'Field calibration and analytics-safe scoring', 'Player detection and tracking', 'Clip-linked metrics', 'Coach correction UI', 'Model and data versioning', 'Role-based access'],
                    exit: '90% of plays have acceptable boundaries. 85% of clips yield useful tracking. Metric → evidence clip in ≤2 clicks.',
                  },
                  {
                    phase: 'Phase 2', label: 'Coach-Trusted Football Layer', color: '#a78bfa',
                    items: ['Formation and motion recognition', 'Route classification', 'Coverage shell and leverage', 'Offensive-line spacing and blocking metrics', 'QB decision metrics', 'Practice tempo and effort metrics', 'Self-scout exposure dashboard', 'Correction analytics'],
                    exit: 'Weekly coaching workflow integration. Analysts running correction exports.',
                  },
                  {
                    phase: 'Phase 3', label: 'Toledo Differentiator Layer', color: '#22C55E',
                    items: ['Pose-lite biomechanics (one position group pilot)', 'Individualized player profiles', 'Similar-rep search (pgvector)', 'Zero-shot concept discovery', 'Playbook overlay', 'Assignment execution scoring', 'Workload proxy dashboard', 'Same-session feedback pipeline'],
                    exit: 'Toledo owns a private football intelligence layer no vendor can replicate.',
                  },
                  {
                    phase: 'Phase 4', label: 'Frontier R&D', color: '#a78bfa',
                    items: ['xSep, xYards, xPressure, xCompletion models', 'Defensive intent modeling', 'Counterfactual simulation', 'Opponent concept matching', 'Advanced health fusion'],
                    exit: 'Only begins after tracking, labels, corrections, and adoption are reliable.',
                  },
                ].map(({ phase, label, color, items, exit }) => (
                  <div key={phase} className="roadmap-row" style={{ flexDirection: 'column', gap: 10 }}>
                    <div style={{ display: 'flex', gap: 12, alignItems: 'baseline' }}>
                      <span style={{ fontFamily: MONO, fontSize: 10, color, letterSpacing: '0.08em', textTransform: 'uppercase', flexShrink: 0 }}>{phase}</span>
                      <span style={{ fontFamily: MONO, fontSize: 11, color: 'var(--foreground)', letterSpacing: '0.04em' }}>{label}</span>
                    </div>
                    <ul style={{ margin: 0, padding: '0 0 0 16px' }}>
                      {items.map(item => <li key={item} style={{ fontSize: 13, marginBottom: 4, lineHeight: 1.5 }}>{item}</li>)}
                    </ul>
                    <div style={{ fontFamily: MONO, fontSize: 10, color: 'var(--text3)', borderTop: '1px solid rgba(244,244,242,0.06)', paddingTop: 8 }}>
                      Exit criteria: {exit}
                    </div>
                  </div>
                ))}
              </div>
            </Section>

            {/* LESSONS */}
            <Section id="lessons">
              <SectionLabel>08 - Lessons & Design Principles</SectionLabel>
              <h2 className="cs-h2">What this project reinforces</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
                {[
                  ['Trust beats novelty', 'A coach who does not trust the system will not use it. Building trust - through evidence links, correction paths, confidence scores, and conservative suppression - is more important than adding advanced features early.'],
                  ['Correction workflows come before advanced models', 'The coach-correction flywheel must exist before pose-lite biomechanics, similar-rep search, or zero-shot discovery. Without corrections, there is no Toledo-specific training data. Without Toledo data, the models are generic.'],
                  ['Calibration confidence is a safety gate', 'A model that reports confident metrics on a poorly calibrated clip is actively harmful. Suppressing metrics when calibration is weak is a feature, not a limitation.'],
                  ['Drone footage is powerful but technically messy', 'Dynamic homography, camera drift, high-occlusion football scenarios, and helmeted players with similar uniforms make drone footage harder than broadcast footage. These constraints need to be part of the design, not discovered during development.'],
                  ['Speed matters as much as accuracy', 'A system that takes 24 hours to process a practice session cannot change practice behavior. Same-session feedback - even lightweight - is worth more than overnight perfect analysis.'],
                  ['R&D must not destabilize the MVP', 'Frontier experiments - zero-shot discovery, quantum AI sandbox, advanced health fusion - need isolation from the production coaching workflow. Experimental outputs must be clearly labeled and role-gated.'],
                  ['Health outputs require governance, not just disclaimers', 'Effort, load, and biomechanics data touch athlete welfare. Role-based access, conservative labeling, and a strict no-automated-medical-inference rule are non-negotiable from the start, not retrofitted later.'],
                ].map(([title, body]) => (
                  <div key={title} style={{ padding: '14px 18px', background: `${ACCENT}06`, border: `1px solid ${ACCENT}18`, borderRadius: 8 }}>
                    <div style={{ fontFamily: MONO, fontSize: 10, color: ACCENT, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6 }}>{title}</div>
                    <p style={{ margin: 0, fontSize: 13, lineHeight: 1.65 }}>{body}</p>
                  </div>
                ))}
              </div>
              {/* PROMPT FOR AHMAD: what actually broke on Toledo Football IQ? It is a Phase 0 build, so the numbers on this page are targets, not results - nothing has failed in production yet. Once real clips run through the pipeline (line-of-scrimmage occlusion, homography drift, re-ID misses), name the concrete failure and a "What broke" block can go here. */}
              {/* PROMPT FOR AHMAD: what would you do differently on Toledo Football IQ? It is too early for an honest retrospective - the build is pre-MVP and the design principles above already capture the intended ordering. Fill this in once Phase 0/1 surfaces a real "I should have done X sooner." */}

              <div style={{ padding: '24px 28px', background: `${ACCENT}08`, border: `1px solid ${ACCENT}22`, borderRadius: 10, marginTop: 32 }}>
                <p style={{ fontFamily: SERIF, fontSize: 15, color: 'var(--foreground)', margin: '0 0 8px', lineHeight: 1.5 }}>
                  In football analytics, trust is the product.
                </p>
                <p style={{ fontFamily: SERIF, fontSize: 14, color: 'var(--text2)', margin: 0, lineHeight: 1.6 }}>
                  Toledo Football IQ demonstrates that computer vision in sports is not a model problem - it is a product problem. The best moat is private, corrected, domain-specific data. Every coach correction is a training example. Every trusted output extends what the system can do next.
                </p>
              </div>

              <div style={{ display: 'flex', gap: 10, marginTop: 32, flexWrap: 'wrap' }}>
                <SmartBackLink fallbackHref="/#projects" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '10px 20px', background: ACCENT, color: 'var(--foreground)', fontFamily: MONO, fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', borderRadius: 5, textTransform: 'uppercase', textDecoration: 'none' }}>← Back to Projects</SmartBackLink>
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



