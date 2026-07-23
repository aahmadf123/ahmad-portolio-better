'use client';

import React, { useEffect, useMemo, useState } from 'react';

const MONO  = "var(--font-chakra), 'Chakra Petch', monospace";
const SERIF = "var(--font-chakra), 'Chakra Petch', sans-serif";

const GREEN = 'var(--green)';
const GOLD  = 'var(--gold)';
const BLUE  = 'var(--blue)';
const RED   = 'var(--red)';
const ORANGE = 'var(--orange)';
const PURPLE = 'var(--purple)';

function SectionLabel({ children, color = GREEN }: { children: React.ReactNode; color?: string }) {
  return (
    <div style={{
      fontFamily: MONO, fontSize: 10, letterSpacing: '0.12em',
      textTransform: 'uppercase', color, opacity: 0.75,
      marginBottom: 14, display: 'flex', alignItems: 'center', gap: 10,
    }}>
      <span style={{ display: 'inline-block', width: 18, height: 1, background: color, opacity: 0.5 }} />
      {children}
    </div>
  );
}

function Caption({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      marginTop: 12, fontFamily: MONO, fontSize: 10,
      color: 'var(--text3)', letterSpacing: '0.05em', textAlign: 'center',
      lineHeight: 1.6,
    }}>
      {children}
    </div>
  );
}

// ── 1. Season Simulator ─────────────────────────────────────────────────────
// Simulates thousands of seasons for a team of fixed "true" quality and shows
// how wildly the observed record varies at different season lengths.

const SEASON_LENGTHS = [
  { games: 12,  label: 'College FB',  sub: '12 games'  },
  { games: 17,  label: 'NFL',         sub: '17 games'  },
  { games: 31,  label: 'College BB',  sub: '31 games'  },
  { games: 82,  label: 'NBA',         sub: '82 games'  },
  { games: 162, label: 'MLB',         sub: '162 games' },
];

const N_SIMS = 2000;
const BIN_WIDTH = 5; // percentage points per histogram bin

interface SimResult {
  bins: number[];        // counts per 5-pt bin, 20 bins: [0–5) ... [95–100]
  pctAtOrBelow500: number;
  pctNearTruth: number;  // within ±5 pts of true quality
  min: number;
  max: number;
}

function simulate(trueQuality: number, games: number): SimResult {
  const bins = new Array(20).fill(0);
  let below = 0, near = 0, min = 1, max = 0;
  for (let s = 0; s < N_SIMS; s++) {
    let wins = 0;
    for (let g = 0; g < games; g++) {
      if (Math.random() < trueQuality) wins++;
    }
    const rate = wins / games;
    const bin = Math.min(19, Math.floor(rate * 100 / BIN_WIDTH));
    bins[bin]++;
    if (rate <= 0.5) below++;
    if (Math.abs(rate - trueQuality) <= 0.05) near++;
    if (rate < min) min = rate;
    if (rate > max) max = rate;
  }
  return {
    bins,
    pctAtOrBelow500: (below / N_SIMS) * 100,
    pctNearTruth: (near / N_SIMS) * 100,
    min, max,
  };
}

export function SeasonSimulator() {
  const [trueQuality, setTrueQuality] = useState(60); // percent
  const [games, setGames] = useState(12);
  const [result, setResult] = useState<SimResult | null>(null);
  const [runKey, setRunKey] = useState(0);

  // Run only on the client, after mount - keeps SSR output deterministic.
  useEffect(() => {
    setResult(simulate(trueQuality / 100, games));
  }, [trueQuality, games, runKey]);

  const maxCount = result ? Math.max(...result.bins, 1) : 1;
  const truthBin = Math.min(19, Math.floor(trueQuality / BIN_WIDTH));

  return (
    <div style={{ margin: '2.5rem 0' }}>
      <SectionLabel>Interactive · The Season Lottery</SectionLabel>

      <div style={{
        border: `1px solid ${GREEN}25`, borderRadius: 10,
        background: `${GREEN}05`, padding: '18px 18px 14px',
      }}>
        {/* Controls */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 18, alignItems: 'flex-end', marginBottom: 18 }}>
          {/* True quality slider */}
          <div style={{ flex: '1 1 220px', minWidth: 200 }}>
            <div style={{
              fontFamily: MONO, fontSize: 9, letterSpacing: '0.1em', textTransform: 'uppercase',
              color: 'var(--text3)', marginBottom: 6, display: 'flex', justifyContent: 'space-between',
            }}>
              <span>True team quality</span>
              <span style={{ color: GOLD }}>{trueQuality}% - wins {trueQuality}% of games, forever</span>
            </div>
            <input
              type="range" min={40} max={80} step={1} value={trueQuality}
              onChange={e => setTrueQuality(Number(e.target.value))}
              aria-label="True team quality percentage"
              style={{ width: '100%', accentColor: GOLD, cursor: 'pointer' }}
            />
          </div>

          {/* Season length buttons */}
          <div>
            <div style={{
              fontFamily: MONO, fontSize: 9, letterSpacing: '0.1em', textTransform: 'uppercase',
              color: 'var(--text3)', marginBottom: 6,
            }}>
              Season length
            </div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {SEASON_LENGTHS.map(s => {
                const active = games === s.games;
                return (
                  <button
                    key={s.games}
                    onClick={() => setGames(s.games)}
                    style={{
                      fontFamily: MONO, fontSize: 10, letterSpacing: '0.05em',
                      padding: '7px 10px', borderRadius: 6, cursor: 'pointer',
                      background: active ? `${GREEN}18` : 'rgba(242,237,216,0.03)',
                      border: `1px solid ${active ? GREEN : 'rgba(244,244,242,0.12)'}`,
                      color: active ? GREEN : 'var(--text2)',
                      transition: 'all 0.15s',
                    }}
                  >
                    <div>{s.label}</div>
                    <div style={{ fontSize: 8, opacity: 0.65, marginTop: 2 }}>{s.sub}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Re-run */}
          <button
            onClick={() => setRunKey(k => k + 1)}
            style={{
              fontFamily: MONO, fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase',
              padding: '9px 14px', borderRadius: 6, cursor: 'pointer',
              background: `${GOLD}12`, border: `1px solid ${GOLD}45`, color: GOLD,
            }}
          >
            ↻ Re-run {N_SIMS.toLocaleString()} seasons
          </button>
        </div>

        {/* Histogram */}
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 2, height: 140, marginBottom: 6 }}>
          {result
            ? result.bins.map((count, i) => {
                const h = (count / maxCount) * 100;
                const isTruth = i === truthBin;
                const below500 = (i + 1) * BIN_WIDTH <= 50;
                return (
                  <div
                    key={i}
                    title={`${i * BIN_WIDTH}–${(i + 1) * BIN_WIDTH}% win rate: ${count} of ${N_SIMS} seasons`}
                    style={{
                      flex: 1, height: `${Math.max(h, count > 0 ? 2 : 0)}%`,
                      background: isTruth ? GOLD : below500 ? RED : GREEN,
                      opacity: isTruth ? 0.95 : 0.55,
                      borderRadius: '4px 4px 0 0',
                    }}
                  />
                );
              })
            : <div style={{
                fontFamily: MONO, fontSize: 10, color: 'var(--text3)',
                alignSelf: 'center', width: '100%', textAlign: 'center',
              }}>
                Simulating seasons…
              </div>}
        </div>

        {/* Axis */}
        <div style={{
          display: 'flex', justifyContent: 'space-between',
          fontFamily: MONO, fontSize: 8, color: 'var(--text3)',
          letterSpacing: '0.08em', marginBottom: 14,
        }}>
          <span>0%</span><span>25%</span><span>50%</span><span>75%</span><span>100% observed win rate</span>
        </div>

        {/* Readouts */}
        {result && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 8 }}>
            {[
              {
                label: 'Looked mediocre',
                value: `${result.pctAtOrBelow500.toFixed(1)}%`,
                sub: `of seasons this ${trueQuality}% team finished .500 or worse`,
                color: RED,
              },
              {
                label: 'Looked like itself',
                value: `${result.pctNearTruth.toFixed(1)}%`,
                sub: `of seasons landed within ±5 pts of the truth`,
                color: GREEN,
              },
              {
                label: 'Full range observed',
                value: `${Math.round(result.min * 100)}–${Math.round(result.max * 100)}%`,
                sub: `same team, same quality, different luck`,
                color: GOLD,
              },
            ].map(stat => (
              <div key={stat.label} style={{
                padding: '10px 12px', borderRadius: 8,
                background: `${stat.color}08`, border: `1px solid ${stat.color}22`,
              }}>
                <div style={{ fontFamily: MONO, fontSize: 8, letterSpacing: '0.1em', textTransform: 'uppercase', color: stat.color, opacity: 0.75, marginBottom: 4 }}>
                  {stat.label}
                </div>
                <div style={{ fontFamily: MONO, fontSize: 20, color: stat.color, lineHeight: 1, marginBottom: 4 }}>
                  {stat.value}
                </div>
                <div style={{ fontFamily: SERIF, fontSize: 11, color: 'var(--text3)', lineHeight: 1.45 }}>
                  {stat.sub}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Caption>
        Every bar is {N_SIMS.toLocaleString()} simulated seasons of a team whose true quality never changes.
        The gold bar marks the truth. Shorten the season and watch the truth get harder to see.
      </Caption>
    </div>
  );
}

// ── 2. Evidence Per Season ──────────────────────────────────────────────────
// How precisely one season pins down a team's true strength, by league.

const EVIDENCE_ROWS = [
  { league: 'MLB',              games: 162, color: BLUE },
  { league: 'NBA',              games: 82,  color: PURPLE },
  { league: 'College Basketball', games: 31, color: ORANGE },
  { league: 'NFL',              games: 17,  color: GOLD },
  { league: 'College Football', games: 12,  color: GREEN },
];

export function EvidencePerSeason() {
  const [selected, setSelected] = useState('College Football');
  const P = 0.6;

  const rows = useMemo(() => EVIDENCE_ROWS.map(r => {
    const sd = Math.sqrt(P * (1 - P) / r.games);
    return { ...r, sd, lo: P - 1.96 * sd, hi: Math.min(1, P + 1.96 * sd) };
  }), []);

  const sel = rows.find(r => r.league === selected)!;

  return (
    <div style={{ margin: '2.5rem 0' }}>
      <SectionLabel>Interactive · What One Season Can Prove</SectionLabel>

      <div style={{
        border: '1px solid rgba(244,244,242,0.09)', borderRadius: 10,
        background: 'rgba(242,237,216,0.02)', padding: '16px 18px',
      }}>
        <div style={{ fontFamily: SERIF, fontSize: 13, color: 'var(--text3)', lineHeight: 1.6, marginBottom: 14 }}>
          Take a team whose true quality is 60%. After one full season, where could its
          <em> measured</em> win rate plausibly land? Click a league.
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {rows.map(r => {
            const active = r.league === selected;
            const left = r.lo * 100;
            const width = (r.hi - r.lo) * 100;
            return (
              <button
                key={r.league}
                onClick={() => setSelected(r.league)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '9px 12px', borderRadius: 8, cursor: 'pointer',
                  background: active ? `${r.color}0C` : 'transparent',
                  border: `1px solid ${active ? r.color + '40' : 'rgba(244,244,242,0.07)'}`,
                  textAlign: 'left', width: '100%', transition: 'all 0.15s',
                }}
              >
                <div style={{ width: 118, flexShrink: 0 }}>
                  <div style={{ fontFamily: MONO, fontSize: 10, color: active ? r.color : 'var(--text2)', letterSpacing: '0.04em' }}>
                    {r.league}
                  </div>
                  <div style={{ fontFamily: MONO, fontSize: 8, color: 'var(--text3)', marginTop: 2 }}>
                    {r.games} games
                  </div>
                </div>

                {/* Interval track */}
                <div style={{ flex: 1, position: 'relative', height: 18 }}>
                  <div style={{
                    position: 'absolute', left: 0, right: 0, top: '50%',
                    height: 1, background: 'rgba(244,244,242,0.08)',
                  }} />
                  {/* Truth tick at 60% */}
                  <div style={{
                    position: 'absolute', left: '60%', top: 1, bottom: 1,
                    width: 1, background: GOLD, opacity: 0.7,
                  }} />
                  {/* 95% interval band */}
                  <div style={{
                    position: 'absolute', left: `${left}%`, width: `${width}%`,
                    top: 4, bottom: 4, borderRadius: 4,
                    background: `${r.color}${active ? '55' : '2A'}`,
                    border: `1px solid ${r.color}${active ? '' : '50'}`,
                    transition: 'all 0.2s',
                  }} />
                </div>

                <div style={{ width: 84, flexShrink: 0, textAlign: 'right', fontFamily: MONO, fontSize: 10, color: active ? r.color : 'var(--text3)' }}>
                  {Math.round(r.lo * 100)}–{Math.round(r.hi * 100)}%
                </div>
              </button>
            );
          })}
        </div>

        <div style={{
          marginTop: 14, padding: '10px 14px', borderRadius: 8,
          background: `${sel.color}08`, border: `1px solid ${sel.color}25`,
          fontFamily: SERIF, fontSize: 13, color: 'var(--text2)', lineHeight: 1.65,
        }}>
          In <span style={{ color: sel.color }}>{sel.league}</span>, a true-60% team&apos;s single-season
          record lands anywhere from <strong style={{ color: 'var(--foreground)' }}>{Math.round(sel.lo * 100)}%</strong> to{' '}
          <strong style={{ color: 'var(--foreground)' }}>{Math.round(sel.hi * 100)}%</strong> (95% range).
          {sel.games <= 17
            ? ' That interval spans everything from "fire the coach" to "conference title contender" - from the same underlying team.'
            : ' A longer season shrinks luck. The record starts to mean something on its own.'}
        </div>
      </div>

      <Caption>
        95% interval for the observed win rate of a true-60% team, one season, binomial noise only.
        Real college data is noisier than this: schedules are unbalanced and opponents vary wildly.
      </Caption>
    </div>
  );
}

// ── 3. Roster Half-Life ─────────────────────────────────────────────────────
// The sample doesn't just stay small - it dissolves. Step through seasons and
// watch how much of Year 1's roster is still generating data.

const ROSTER_SIZE = 66; // 6 rows × 11 - illustrative scholarship core
const YEAR_RETENTION = [1.0, 0.62, 0.35, 0.15]; // illustrative share of Year-1 roster still present

export function RosterHalfLife() {
  const [year, setYear] = useState(0);

  // Deterministic "which dots survive" pattern so SSR and client agree.
  const survivors = useMemo(() => {
    const order = Array.from({ length: ROSTER_SIZE }, (_, i) => i);
    // Deterministic shuffle via a fixed multiplicative pattern
    order.sort((a, b) => ((a * 37) % ROSTER_SIZE) - ((b * 37) % ROSTER_SIZE));
    return order;
  }, []);

  const keepCount = Math.round(ROSTER_SIZE * YEAR_RETENTION[year]);
  const keepSet = useMemo(() => new Set(survivors.slice(0, keepCount)), [survivors, keepCount]);

  return (
    <div style={{ margin: '2.5rem 0' }}>
      <SectionLabel>Interactive · The Dissolving Sample</SectionLabel>

      <div style={{
        border: '1px solid rgba(244,244,242,0.09)', borderRadius: 10,
        background: 'rgba(242,237,216,0.02)', padding: '16px 18px',
      }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center', marginBottom: 16 }}>
          <div style={{ fontFamily: MONO, fontSize: 9, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text3)', marginRight: 6 }}>
            Your Year-1 roster, seen from…
          </div>
          {['Year 1', 'Year 2', 'Year 3', 'Year 4'].map((label, i) => {
            const active = year === i;
            return (
              <button
                key={label}
                onClick={() => setYear(i)}
                style={{
                  fontFamily: MONO, fontSize: 10, letterSpacing: '0.05em',
                  padding: '6px 12px', borderRadius: 6, cursor: 'pointer',
                  background: active ? `${GREEN}18` : 'rgba(242,237,216,0.03)',
                  border: `1px solid ${active ? GREEN : 'rgba(244,244,242,0.12)'}`,
                  color: active ? GREEN : 'var(--text2)',
                  transition: 'all 0.15s',
                }}
              >
                {label}
              </button>
            );
          })}
        </div>

        {/* Dot grid */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(11, 1fr)', gap: 6,
          maxWidth: 420, margin: '0 auto 14px',
        }}>
          {Array.from({ length: ROSTER_SIZE }, (_, i) => {
            const present = keepSet.has(i);
            return (
              <div
                key={i}
                style={{
                  aspectRatio: '1', borderRadius: '50%',
                  background: present ? GREEN : 'rgba(242,237,216,0.05)',
                  border: `1px solid ${present ? GREEN : 'rgba(244,244,242,0.1)'}`,
                  opacity: present ? 0.85 : 0.35,
                  transition: 'all 0.35s ease',
                }}
              />
            );
          })}
        </div>

        <div style={{
          textAlign: 'center', fontFamily: MONO, fontSize: 11, color: GREEN,
          letterSpacing: '0.05em', marginBottom: 4,
        }}>
          ~{Math.round(YEAR_RETENTION[year] * 100)}% of the original roster still producing data
        </div>
        <div style={{ textAlign: 'center', fontFamily: SERIF, fontSize: 12, color: 'var(--text3)', lineHeight: 1.6, maxWidth: 520, margin: '0 auto' }}>
          {year === 0 && 'Season one: every snap adds to a coherent dataset about this roster.'}
          {year === 1 && 'Graduation, the transfer portal, and the NFL draft have already taken a third of the sample with them.'}
          {year === 2 && 'By year three, most of your "historical data" describes players who are no longer in the building.'}
          {year === 3 && 'Four seasons of data about one program is really four small datasets about four different teams.'}
        </div>
      </div>

      <Caption>
        Illustrative retention pattern for a college roster&apos;s core contributors. Pro teams churn too -
        but only college guarantees that every single player exits within five years.
      </Caption>
    </div>
  );
}

// ── 4. Small-Data Playbook ──────────────────────────────────────────────────
// Expandable tactics: what actually works when n = 12.

const PLAYBOOK = [
  {
    n: '01', title: 'Change the unit of analysis',
    color: GREEN,
    summary: 'Stop modeling games. Model plays, possessions, and matchups.',
    detail: 'Twelve games is a hopeless sample - but those twelve games contain roughly 800 offensive snaps, each with down, distance, personnel, formation, and outcome. Dropping one level of granularity turns n=12 into n=800. Two levels (player-play interactions) turns it into thousands. Most of the "small data problem" in sports is really a unit-of-analysis problem.',
  },
  {
    n: '02', title: 'Borrow strength from elsewhere',
    color: BLUE,
    summary: 'Hierarchical models let your team learn from every team like it.',
    detail: 'A partial-pooling model estimates your team as a blend of its own data and the behavior of comparable programs - same conference, similar scheme, similar talent profile. When your sample is thin, the estimate leans on the group; as evidence accumulates, it leans on you. This is decades-old statistics, and it routinely beats a deep model trained on your data alone.',
  },
  {
    n: '03', title: 'Bring real priors to the table',
    color: GOLD,
    summary: 'Recruiting ratings, returning production, and history are data too.',
    detail: 'A model that starts every season from zero throws away the best information available: who is on the roster. Recruiting composites, returning-production percentages, and coaching continuity are all measurable before a single game is played - and in college football they carry real predictive weight precisely because the in-season sample never gets big enough to override them.',
  },
  {
    n: '04', title: 'Report uncertainty or report nothing',
    color: PURPLE,
    summary: 'A point estimate from 12 games is a guess wearing a suit.',
    detail: 'The honest output of a small-sample model is an interval, not a number. "This receiver\'s separation rate is 62% ± 15 points" changes decisions differently than "62%". Coaches handle uncertainty well - they live in it - but only if you surface it instead of burying it under false precision.',
  },
  {
    n: '05', title: 'Engineer context, not volume',
    color: ORANGE,
    summary: 'One well-built adjustment beats a thousand extra rows you can\'t get.',
    detail: 'You cannot make the season longer, but you can make each game say more: opponent adjustment, garbage-time filtering, situation weighting, scheme tagging. Context features are how a 12-game sample stops lying about who a team really played and when the plays actually mattered.',
  },
  {
    n: '06', title: 'Treat corrections as a data pipeline',
    color: RED,
    summary: 'Every expert correction is training data nobody else has.',
    detail: 'When a coach or analyst corrects a model\'s output - a mislabeled formation, a wrong route tag - that correction is domain-specific ground truth. Captured systematically, it becomes a private dataset that compounds. In small-data environments, the correction loop is often worth more than the original model.',
  },
];

export function SmallDataPlaybook() {
  const [open, setOpen] = useState<string | null>('01');

  return (
    <div style={{ margin: '2.5rem 0' }}>
      <SectionLabel>Interactive · The Small-Data Playbook</SectionLabel>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {PLAYBOOK.map(item => {
          const isOpen = open === item.n;
          return (
            <div
              key={item.n}
              style={{
                borderRadius: 8, overflow: 'hidden',
                border: `1px solid ${item.color}${isOpen ? '40' : '20'}`,
                background: `${item.color}${isOpen ? '0A' : '05'}`,
                transition: 'all 0.2s',
              }}
            >
              <button
                onClick={() => setOpen(isOpen ? null : item.n)}
                aria-expanded={isOpen}
                style={{
                  display: 'flex', alignItems: 'center', gap: 14, width: '100%',
                  padding: '13px 16px', cursor: 'pointer', textAlign: 'left',
                  background: 'transparent', border: 'none',
                }}
              >
                <span style={{ fontFamily: MONO, fontSize: 11, color: item.color, opacity: 0.6, flexShrink: 0 }}>
                  {item.n}
                </span>
                <span style={{ flex: 1 }}>
                  <span style={{ display: 'block', fontFamily: MONO, fontSize: 12, color: item.color, letterSpacing: '0.04em', marginBottom: 2 }}>
                    {item.title}
                  </span>
                  <span style={{ display: 'block', fontFamily: SERIF, fontSize: 12, color: 'var(--text3)', lineHeight: 1.5 }}>
                    {item.summary}
                  </span>
                </span>
                <span style={{
                  fontFamily: MONO, fontSize: 12, color: item.color,
                  transform: isOpen ? 'rotate(45deg)' : 'none',
                  transition: 'transform 0.2s', flexShrink: 0,
                }}>
                  +
                </span>
              </button>

              {isOpen && (
                <div style={{
                  padding: '0 16px 15px 41px',
                  fontFamily: SERIF, fontSize: 13, color: 'var(--text2)', lineHeight: 1.75,
                }}>
                  {item.detail}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <Caption>
        None of these tactics require more data to exist. They require taking the data you have seriously.
      </Caption>
    </div>
  );
}

// ── 5. Evidence Calculator ──────────────────────────────────────────────────
// How many games until you can reliably tell two teams apart?

function normCdf(x: number): number {
  // Abramowitz–Stegun erf approximation
  const t = 1 / (1 + 0.3275911 * Math.abs(x) / Math.SQRT2);
  const z = Math.abs(x) / Math.SQRT2;
  const erf = 1 - (((((1.061405429 * t - 1.453152027) * t) + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t * Math.exp(-z * z);
  return x >= 0 ? 0.5 * (1 + erf) : 0.5 * (1 - erf);
}

const Z_95 = 1.6449; // one-sided 95%
const COLLEGE_CAREER_GAMES = 60; // ~5 seasons incl. postseason

export function EvidenceCalculator() {
  const [pA, setPA] = useState(60); // better team, percent
  const [pB, setPB] = useState(50); // other team, percent

  const a = Math.max(pA, pB) / 100;
  const b = Math.min(pA, pB) / 100;
  const gap = a - b;

  const variance = a * (1 - a) + b * (1 - b);
  const identical = gap < 0.005;
  const gamesNeeded = identical ? Infinity : Math.ceil((Z_95 * Math.sqrt(variance) / gap) ** 2);
  const pAfterSeason = identical ? 0.5 : normCdf(gap * Math.sqrt(12) / Math.sqrt(variance));

  const seasons = gamesNeeded / 12;
  const careers = gamesNeeded / COLLEGE_CAREER_GAMES;

  const verdictColor = identical || gamesNeeded > COLLEGE_CAREER_GAMES ? RED : gamesNeeded > 36 ? ORANGE : GREEN;
  const verdict = identical
    ? 'No amount of games can separate identical teams.'
    : gamesNeeded > COLLEGE_CAREER_GAMES
      ? `That is ${careers.toFixed(1)} entire college careers. Wins alone will never settle it - you need richer data per game.`
      : gamesNeeded > 36
        ? 'Provable eventually - but only across multiple rosters, which means the "team" changed before the evidence arrived.'
        : 'Rare case: the gap is so large that even a short season usually reveals it.';

  const sliderRow = (label: string, value: number, setter: (n: number) => void, color: string) => (
    <div style={{ flex: '1 1 210px', minWidth: 190 }}>
      <div style={{
        fontFamily: MONO, fontSize: 9, letterSpacing: '0.1em', textTransform: 'uppercase',
        color: 'var(--text3)', marginBottom: 6, display: 'flex', justifyContent: 'space-between',
      }}>
        <span>{label}</span>
        <span style={{ color }}>{value}% true win rate</span>
      </div>
      <input
        type="range" min={40} max={80} step={1} value={value}
        onChange={e => setter(Number(e.target.value))}
        aria-label={label}
        style={{ width: '100%', accentColor: color, cursor: 'pointer' }}
      />
    </div>
  );

  return (
    <div style={{ margin: '2.5rem 0' }}>
      <SectionLabel>Interactive · The Evidence Calculator</SectionLabel>

      <div style={{
        border: `1px solid ${GOLD}25`, borderRadius: 10,
        background: `${GOLD}04`, padding: '18px 18px 16px',
      }}>
        <div style={{ fontFamily: SERIF, fontSize: 13, color: 'var(--text3)', lineHeight: 1.6, marginBottom: 16 }}>
          Two programs, fixed true quality, equal schedules. How many games until you can be 95% sure
          the better one shows it in the win column?
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 18, marginBottom: 18 }}>
          {sliderRow('Team A', pA, setPA, GOLD)}
          {sliderRow('Team B', pB, setPB, BLUE)}
        </div>

        {/* Results */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 8, marginBottom: 12 }}>
          <div style={{ padding: '12px 14px', borderRadius: 8, background: `${GOLD}08`, border: `1px solid ${GOLD}25` }}>
            <div style={{ fontFamily: MONO, fontSize: 8, letterSpacing: '0.1em', textTransform: 'uppercase', color: GOLD, opacity: 0.75, marginBottom: 4 }}>
              Games required
            </div>
            <div style={{ fontFamily: MONO, fontSize: 24, color: GOLD, lineHeight: 1 }}>
              {identical ? '∞' : gamesNeeded.toLocaleString()}
            </div>
          </div>
          <div style={{ padding: '12px 14px', borderRadius: 8, background: `${GREEN}08`, border: `1px solid ${GREEN}25` }}>
            <div style={{ fontFamily: MONO, fontSize: 8, letterSpacing: '0.1em', textTransform: 'uppercase', color: GREEN, opacity: 0.75, marginBottom: 4 }}>
              In college seasons
            </div>
            <div style={{ fontFamily: MONO, fontSize: 24, color: GREEN, lineHeight: 1 }}>
              {identical ? '-' : seasons >= 100 ? '100+' : seasons.toFixed(1)}
            </div>
          </div>
          <div style={{ padding: '12px 14px', borderRadius: 8, background: `${BLUE}08`, border: `1px solid ${BLUE}25` }}>
            <div style={{ fontFamily: MONO, fontSize: 8, letterSpacing: '0.1em', textTransform: 'uppercase', color: BLUE, opacity: 0.75, marginBottom: 4 }}>
              After 12 games
            </div>
            <div style={{ fontFamily: MONO, fontSize: 24, color: BLUE, lineHeight: 1 }}>
              {(pAfterSeason * 100).toFixed(0)}%
            </div>
            <div style={{ fontFamily: SERIF, fontSize: 10, color: 'var(--text3)', marginTop: 4, lineHeight: 1.4 }}>
              chance the better team even looks better
            </div>
          </div>
        </div>

        {/* Verdict */}
        <div style={{
          padding: '11px 14px', borderRadius: 8,
          background: `${verdictColor}09`, border: `1px solid ${verdictColor}30`,
          fontFamily: SERIF, fontSize: 13, color: 'var(--text2)', lineHeight: 1.65,
        }}>
          <span style={{ fontFamily: MONO, fontSize: 9, letterSpacing: '0.1em', textTransform: 'uppercase', color: verdictColor, marginRight: 10 }}>
            Verdict
          </span>
          {verdict}
        </div>
      </div>

      <Caption>
        One-sided 95% confidence via normal approximation; a college career is counted as ~{COLLEGE_CAREER_GAMES} games
      </Caption>
    </div>
  );
}


