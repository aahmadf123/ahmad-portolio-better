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

// ── 1. Twin Anatomy ─────────────────────────────────────────────────────────
// Expandable layers: what an opponent digital twin is actually made of, from
// the load-bearing spine down to the layer almost everyone skips.

const ANATOMY = [
  {
    n: '01', title: 'The play-calling policy',
    color: GREEN,
    summary: 'A probability distribution over what they run, conditioned on situation.',
    detail: 'The spine of any opponent twin: given down, distance, field position, score, and personnel, what does this coordinator call - and how often? Built from charted play-by-play, it is the one layer you can construct from public data today. It is also just a conditional distribution, which means everything downstream inherits its sample-size problems.',
  },
  {
    n: '02', title: 'Personnel & formation grammar',
    color: BLUE,
    summary: 'Who is on the field constrains what can happen next.',
    detail: 'Coordinators do not choose plays from the full playbook on every snap - they choose from what the personnel package allows. Modeling the grammar (which formations flow from which personnel, which plays flow from which formations) shrinks the prediction space dramatically. This is where film charting beats box scores: the same "11 personnel" label hides very different bodies.',
  },
  {
    n: '03', title: 'Matchup priors',
    color: GOLD,
    summary: 'Player-vs-player ratings that decide whether the called play works.',
    detail: 'Predicting the call is only half a simulation. The other half is resolving it: their left tackle against your edge rusher, their slot receiver against your nickel. In the pros this layer runs on tracking data. In college it runs on graded film, recruiting composites, and honest priors - which is to say, it is wide-interval and should be treated that way.',
  },
  {
    n: '04', title: 'Situational overrides',
    color: PURPLE,
    summary: 'Red zone, third-and-long, two-minute: the coordinator becomes a different person.',
    detail: 'Aggregate tendencies lie, because coordinators are not one policy - they are a bundle of situational policies with different authors. One scripts the openers. Another owns a red-zone package installed by a different assistant. The twin needs these seams modeled explicitly, and each seam has a far smaller sample than the aggregate.',
  },
  {
    n: '05', title: 'The adaptation model',
    color: RED,
    summary: 'The hardest layer: how they change when you hurt them.',
    detail: 'A real opponent watches film of themselves, finds their own tells, and breaks them - especially after you exploit one. Almost every twin skips this layer, which is why twins are most accurate in the first quarter and quietly wrong by the fourth. Modeling adaptation honestly usually means widening your intervals, not sharpening your predictions.',
  },
];

export function TwinAnatomy() {
  const [open, setOpen] = useState<string | null>('01');

  return (
    <div style={{ margin: '2.5rem 0' }}>
      <SectionLabel color={BLUE}>Interactive · Anatomy of an Opponent Twin</SectionLabel>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {ANATOMY.map(item => {
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
        Each layer down needs richer data than the one above it - and the last one
        needs data that mostly doesn&apos;t exist yet: evidence about how they respond to you.
      </Caption>
    </div>
  );
}

// ── 2. Film Budget ──────────────────────────────────────────────────────────
// How well N games of film pin down an opponent's situational tendencies.
// Common situations converge fast; the situations that decide games never do.

const SITUATIONS = [
  { key: '1st-10',   label: '1st & 10',          perGame: 30,  trueRun: 0.52, color: BLUE },
  { key: 'rz',       label: 'Red-zone snaps',    perGame: 8,   trueRun: 0.56, color: PURPLE },
  { key: '3rd-long', label: '3rd & 7+',          perGame: 5,   trueRun: 0.16, color: ORANGE },
  { key: '3rd-short',label: '3rd & 1–2',         perGame: 3.5, trueRun: 0.71, color: GOLD },
  { key: '4th',      label: '4th-down attempts', perGame: 1.5, trueRun: 0.62, color: RED },
];

export function FilmBudget() {
  const [games, setGames] = useState(4);

  const rows = useMemo(() => SITUATIONS.map(s => {
    const n = Math.max(1, Math.round(s.perGame * games));
    const half = 1.96 * Math.sqrt(s.trueRun * (1 - s.trueRun) / n);
    return {
      ...s, n,
      lo: Math.max(0, s.trueRun - half),
      hi: Math.min(1, s.trueRun + half),
      halfPts: half * 100,
    };
  }), [games]);

  return (
    <div style={{ margin: '2.5rem 0' }}>
      <SectionLabel color={BLUE}>Interactive · The Film Budget</SectionLabel>

      <div style={{
        border: `1px solid ${BLUE}25`, borderRadius: 10,
        background: `${BLUE}05`, padding: '16px 18px',
      }}>
        <div style={{
          fontFamily: MONO, fontSize: 9, letterSpacing: '0.1em', textTransform: 'uppercase',
          color: 'var(--text3)', marginBottom: 6, display: 'flex', justifyContent: 'space-between',
        }}>
          <span>Games of opponent film charted</span>
          <span style={{ color: GOLD }}>{games} game{games === 1 ? '' : 's'}</span>
        </div>
        <input
          type="range" min={1} max={13} step={1} value={games}
          onChange={e => setGames(Number(e.target.value))}
          aria-label="Games of opponent film charted"
          style={{ width: '100%', accentColor: GOLD, cursor: 'pointer', marginBottom: 16 }}
        />

        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {rows.map(r => {
            const known = r.halfPts <= 10;
            return (
              <div key={r.key} style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '9px 12px', borderRadius: 8,
                border: '1px solid rgba(244,244,242,0.07)',
              }}>
                <div style={{ width: 128, flexShrink: 0 }}>
                  <div style={{ fontFamily: MONO, fontSize: 10, color: r.color, letterSpacing: '0.04em' }}>
                    {r.label}
                  </div>
                  <div style={{ fontFamily: MONO, fontSize: 8, color: 'var(--text3)', marginTop: 2 }}>
                    n = {r.n} snaps
                  </div>
                </div>

                {/* Interval track: estimated run rate */}
                <div style={{ flex: 1, position: 'relative', height: 18 }}>
                  <div style={{
                    position: 'absolute', left: 0, right: 0, top: '50%',
                    height: 1, background: 'rgba(244,244,242,0.08)',
                  }} />
                  <div style={{
                    position: 'absolute', left: `${r.trueRun * 100}%`, top: 1, bottom: 1,
                    width: 1, background: GOLD, opacity: 0.7,
                  }} />
                  <div style={{
                    position: 'absolute', left: `${r.lo * 100}%`, width: `${(r.hi - r.lo) * 100}%`,
                    top: 4, bottom: 4, borderRadius: 4,
                    background: `${r.color}40`,
                    border: `1px solid ${r.color}70`,
                    transition: 'all 0.25s ease',
                  }} />
                </div>

                <div style={{
                  width: 92, flexShrink: 0, textAlign: 'right',
                  fontFamily: MONO, fontSize: 10,
                  color: known ? GREEN : RED,
                }}>
                  ±{r.halfPts.toFixed(0)} pts {known ? '✓' : '✗'}
                </div>
              </div>
            );
          })}
        </div>

        <div style={{
          marginTop: 14, padding: '10px 14px', borderRadius: 8,
          background: `${GOLD}08`, border: `1px solid ${GOLD}25`,
          fontFamily: SERIF, fontSize: 13, color: 'var(--text2)', lineHeight: 1.65,
        }}>
          The band is the 95% range for their <em>measured</em> run rate around a fixed true tendency
          (gold tick). First-and-ten firms up in a month. Fourth down - the situation your game may
          actually hinge on - stays a rumor all season.
        </div>
      </div>

      <Caption>
        Binomial intervals at typical per-game snap counts for one FBS offense.
        ✓ marks a tendency pinned within ±10 points - a bar real coordinators would call generous.
      </Caption>
    </div>
  );
}

// ── 3. Game-Plan Simulator ──────────────────────────────────────────────────
// Monte Carlo: what a twin-informed game plan is worth as a function of twin
// fidelity. Preparing precisely for the wrong opponent costs more than the
// right preparation gains - so the value curve crosses zero above 50%.

const N_GAMES = 2000;
const LEVERAGE_CALLS = 12;   // twin-informed decisions per game
const PTS_RIGHT = 0.5;       // points gained per correct anticipation
const PTS_WRONG = -0.75;     // points lost preparing for the wrong look
const MARGIN_SD = 13.5;      // college scoring-margin noise between even teams
const BREAK_EVEN = Math.round(100 * -PTS_WRONG / (PTS_RIGHT - PTS_WRONG)); // 60

interface SimOut {
  bins: number[];       // margin histogram, 14 bins of 5 pts: [-35,35)
  winPct: number;
  avgMargin: number;
}

function gauss(): number {
  // Box–Muller
  let u = 0, v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

function simulateSeason(fidelity: number): SimOut {
  const bins = new Array(14).fill(0);
  let wins = 0, marginSum = 0;
  for (let g = 0; g < N_GAMES; g++) {
    let edge = 0;
    for (let c = 0; c < LEVERAGE_CALLS; c++) {
      edge += Math.random() < fidelity ? PTS_RIGHT : PTS_WRONG;
    }
    const margin = gauss() * MARGIN_SD + edge;
    if (margin > 0) wins++;
    marginSum += margin;
    const bin = Math.min(13, Math.max(0, Math.floor((margin + 35) / 5)));
    bins[bin]++;
  }
  return { bins, winPct: (wins / N_GAMES) * 100, avgMargin: marginSum / N_GAMES };
}

export function GamePlanSimulator() {
  const [fidelity, setFidelity] = useState(75); // percent
  const [result, setResult] = useState<SimOut | null>(null);
  const [runKey, setRunKey] = useState(0);

  // Client-only, post-mount - keeps SSR output deterministic.
  useEffect(() => {
    setResult(simulateSeason(fidelity / 100));
  }, [fidelity, runKey]);

  const maxCount = result ? Math.max(...result.bins, 1) : 1;
  const verdictColor = fidelity < BREAK_EVEN ? RED : fidelity < 75 ? ORANGE : GREEN;
  const verdict = fidelity < BREAK_EVEN
    ? 'Below break-even. This twin is actively worse than generic preparation - you are rehearsing against a rival that doesn’t exist.'
    : fidelity < 75
      ? 'Marginally useful. The twin earns points on net, but a bad week of charting could flip its sign.'
      : 'Genuinely valuable - and this is roughly the fidelity ceiling honest college data supports in common situations only.';

  return (
    <div style={{ margin: '2.5rem 0' }}>
      <SectionLabel color={BLUE}>Interactive · What a Twin Is Worth</SectionLabel>

      <div style={{
        border: `1px solid ${GOLD}25`, borderRadius: 10,
        background: `${GOLD}04`, padding: '18px 18px 16px',
      }}>
        <div style={{ fontFamily: SERIF, fontSize: 13, color: 'var(--text3)', lineHeight: 1.6, marginBottom: 14 }}>
          Two even teams. Your staff makes {LEVERAGE_CALLS} twin-informed calls per game - each worth{' '}
          +{PTS_RIGHT} points when the twin read the opponent right, {PTS_WRONG} when it read them wrong,
          because preparing precisely for the wrong look costs more than it gains.
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 18, alignItems: 'flex-end', marginBottom: 16 }}>
          <div style={{ flex: '1 1 220px', minWidth: 200 }}>
            <div style={{
              fontFamily: MONO, fontSize: 9, letterSpacing: '0.1em', textTransform: 'uppercase',
              color: 'var(--text3)', marginBottom: 6, display: 'flex', justifyContent: 'space-between',
            }}>
              <span>Twin fidelity</span>
              <span style={{ color: GOLD }}>{fidelity}% of reads correct</span>
            </div>
            <input
              type="range" min={50} max={95} step={1} value={fidelity}
              onChange={e => setFidelity(Number(e.target.value))}
              aria-label="Twin fidelity percentage"
              style={{ width: '100%', accentColor: GOLD, cursor: 'pointer' }}
            />
          </div>

          <button
            onClick={() => setRunKey(k => k + 1)}
            style={{
              fontFamily: MONO, fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase',
              padding: '9px 14px', borderRadius: 6, cursor: 'pointer',
              background: `${GOLD}12`, border: `1px solid ${GOLD}45`, color: GOLD,
            }}
          >
            ↻ Re-run {N_GAMES.toLocaleString()} games
          </button>
        </div>

        {/* Margin histogram */}
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 2, height: 110, marginBottom: 6 }}>
          {result
            ? result.bins.map((count, i) => {
                const h = (count / maxCount) * 100;
                const losing = i < 7; // bins below zero margin
                return (
                  <div
                    key={i}
                    title={`Margin ${i * 5 - 35} to ${i * 5 - 30}: ${count} of ${N_GAMES} games`}
                    style={{
                      flex: 1, height: `${Math.max(h, count > 0 ? 2 : 0)}%`,
                      background: losing ? RED : GREEN,
                      opacity: 0.55,
                      borderRadius: '4px 4px 0 0',
                    }}
                  />
                );
              })
            : <div style={{
                fontFamily: MONO, fontSize: 10, color: 'var(--text3)',
                alignSelf: 'center', width: '100%', textAlign: 'center',
              }}>
                Simulating games…
              </div>}
        </div>
        <div style={{
          display: 'flex', justifyContent: 'space-between',
          fontFamily: MONO, fontSize: 8, color: 'var(--text3)',
          letterSpacing: '0.08em', marginBottom: 14,
        }}>
          <span>−35</span><span>lose</span><span>0</span><span>win</span><span>+35 margin</span>
        </div>

        {result && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 8, marginBottom: 12 }}>
            {[
              {
                label: 'Win probability',
                value: `${result.winPct.toFixed(1)}%`,
                sub: 'vs 50.0% with no twin at all',
                color: result.winPct >= 50 ? GREEN : RED,
              },
              {
                label: 'Expected margin',
                value: `${result.avgMargin >= 0 ? '+' : ''}${result.avgMargin.toFixed(1)} pts`,
                sub: 'per game, from twin-informed calls',
                color: result.avgMargin >= 0 ? GOLD : RED,
              },
              {
                label: 'Break-even fidelity',
                value: `${BREAK_EVEN}%`,
                sub: 'below this, the twin costs you points',
                color: BLUE,
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
        {N_GAMES.toLocaleString()} simulated games between otherwise even teams (margin noise SD {MARGIN_SD}).
        The asymmetry is the whole lesson: wrong-but-confident preparation is a negative-value asset.
      </Caption>
    </div>
  );
}

// ── 4. Adaptation Decay ─────────────────────────────────────────────────────
// Tendencies are perishable. Once you exploit one, the opponent self-scouts
// and breaks it - and how hard you hammer it decides how fast it dies.

const WEEKS = 6;
const EDGE_0 = 2.5; // points/game the tell is worth at full exploitation, week 1

const STRATEGIES = [
  {
    key: 'selective',
    label: 'Save it for leverage downs',
    color: GREEN,
    usage: 0.35,  // fraction of the tell's value cashed per week
    decay: 0.18,  // weekly probability-weighted erosion once film circulates
  },
  {
    key: 'hammer',
    label: 'Hammer it every drive',
    color: RED,
    usage: 1.0,
    decay: 0.55,
  },
];

export function AdaptationDecay() {
  const [strategyKey, setStrategyKey] = useState('selective');
  const strategy = STRATEGIES.find(s => s.key === strategyKey)!;

  const series = useMemo(() => STRATEGIES.map(s => {
    let remaining = EDGE_0;
    const weekly: number[] = [];
    let total = 0;
    for (let w = 0; w < WEEKS; w++) {
      const cashed = remaining * s.usage;
      weekly.push(cashed);
      total += cashed;
      remaining *= (1 - s.decay);
    }
    return { ...s, weekly, total };
  }), []);

  const sel = series.find(s => s.key === strategyKey)!;
  const maxWeekly = Math.max(...series.flatMap(s => s.weekly));

  return (
    <div style={{ margin: '2.5rem 0' }}>
      <SectionLabel color={BLUE}>Interactive · The Tell Has a Half-Life</SectionLabel>

      <div style={{
        border: '1px solid rgba(244,244,242,0.09)', borderRadius: 10,
        background: 'rgba(242,237,216,0.02)', padding: '16px 18px',
      }}>
        <div style={{ fontFamily: SERIF, fontSize: 13, color: 'var(--text3)', lineHeight: 1.6, marginBottom: 14 }}>
          Your twin finds a real tell worth {EDGE_0} points a game. But every snap you spend
          exploiting it goes on film - and their self-scout is watching too. Choose how to spend it.
        </div>

        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 16 }}>
          {STRATEGIES.map(s => {
            const active = s.key === strategyKey;
            return (
              <button
                key={s.key}
                onClick={() => setStrategyKey(s.key)}
                style={{
                  fontFamily: MONO, fontSize: 10, letterSpacing: '0.05em',
                  padding: '7px 12px', borderRadius: 6, cursor: 'pointer',
                  background: active ? `${s.color}18` : 'rgba(242,237,216,0.03)',
                  border: `1px solid ${active ? s.color : 'rgba(244,244,242,0.12)'}`,
                  color: active ? s.color : 'var(--text2)',
                  transition: 'all 0.15s',
                }}
              >
                {s.label}
              </button>
            );
          })}
        </div>

        {/* Weekly bars */}
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10, height: 120, marginBottom: 6, padding: '0 4px' }}>
          {sel.weekly.map((v, w) => {
            const h = (v / maxWeekly) * 100;
            return (
              <div key={w} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, height: '100%', justifyContent: 'flex-end' }}>
                <div style={{ fontFamily: MONO, fontSize: 9, color: sel.color }}>
                  {v.toFixed(1)}
                </div>
                <div style={{
                  width: '100%', height: `${Math.max(h, 2)}%`,
                  background: sel.color, opacity: 0.55,
                  borderRadius: '4px 4px 0 0',
                }} />
              </div>
            );
          })}
        </div>
        <div style={{
          display: 'flex', gap: 10, padding: '0 4px',
          fontFamily: MONO, fontSize: 8, color: 'var(--text3)',
          letterSpacing: '0.08em', marginBottom: 16,
        }}>
          {Array.from({ length: WEEKS }, (_, w) => (
            <div key={w} style={{ flex: 1, textAlign: 'center' }}>WK {w + 1}</div>
          ))}
        </div>

        {/* Totals comparison */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: 8, marginBottom: 12 }}>
          {series.map(s => (
            <div key={s.key} style={{
              padding: '10px 12px', borderRadius: 8,
              background: `${s.color}08`, border: `1px solid ${s.color}${s.key === strategyKey ? '45' : '22'}`,
            }}>
              <div style={{ fontFamily: MONO, fontSize: 8, letterSpacing: '0.1em', textTransform: 'uppercase', color: s.color, opacity: 0.75, marginBottom: 4 }}>
                {s.label}
              </div>
              <div style={{ fontFamily: MONO, fontSize: 20, color: s.color, lineHeight: 1, marginBottom: 4 }}>
                {s.total.toFixed(1)} pts
              </div>
              <div style={{ fontFamily: SERIF, fontSize: 11, color: 'var(--text3)', lineHeight: 1.45 }}>
                total value over {WEEKS} weeks · wk 1: {s.weekly[0].toFixed(1)}, wk {WEEKS}: {s.weekly[WEEKS - 1].toFixed(1)}
              </div>
            </div>
          ))}
        </div>

        <div style={{
          padding: '11px 14px', borderRadius: 8,
          background: `${BLUE}09`, border: `1px solid ${BLUE}30`,
          fontFamily: SERIF, fontSize: 13, color: 'var(--text2)', lineHeight: 1.65,
        }}>
          <span style={{ fontFamily: MONO, fontSize: 9, letterSpacing: '0.1em', textTransform: 'uppercase', color: BLUE, marginRight: 10 }}>
            The exception
          </span>
          If only one game matters - a rivalry, a conference title - hammering the tell is correct:
          you cash {series.find(s => s.key === 'hammer')!.weekly[0].toFixed(1)} points in week one and
          don&apos;t care what survives. Over a season, restraint wins. The twin can find the tell;
          only the staff can decide what it&apos;s for.
        </div>
      </div>

      <Caption>
        Illustrative model: value cashed weekly = remaining edge × usage; the edge erodes faster the more
        film of the exploit exists. Exact numbers are inputs, not measurements - the shape is the point.
      </Caption>
    </div>
  );
}


