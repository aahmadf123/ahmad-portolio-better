'use client';

// Interactive figures for the "Battle of I-75 coin toss" field note.
// Every number here comes from the public research repo
// (github.com/aahmadf123/battle-of-I75): data/processed/series.csv,
// data/manual/coin_toss.csv and data/processed/results.json.
// Randomness only runs in event handlers, so SSR output stays deterministic.

import React, { useEffect, useMemo, useRef, useState } from 'react';

const MONO  = "var(--font-code), ui-monospace, monospace";
const SERIF = "var(--font-body), system-ui, sans-serif";

// Team colors stay hex: they get alpha-concatenated below (`${UT}22`).
const UT    = '#6b96f7'; // Toledo blue (lifted for 4.5:1 on dark panels)
const BG    = '#f0823c'; // Bowling Green orange
const GOLD  = '#f59e0b';
const GREEN = '#22c55e';
const MUTED = '#9a9a96';

type Team = 'UT' | 'BG';
const teamColor = (t: Team | null | undefined) => (t === 'UT' ? UT : t === 'BG' ? BG : MUTED);
const teamName = (t: Team) => (t === 'UT' ? 'Toledo' : 'Bowling Green');

// ── Shared chrome ───────────────────────────────────────────────────────────

function SectionLabel({ children, color = GREEN }: { children: React.ReactNode; color?: string }) {
  return (
    <div style={{
      fontFamily: MONO, fontSize: 11, letterSpacing: '0.12em',
      textTransform: 'uppercase', color,
      marginBottom: 14, display: 'flex', alignItems: 'center', gap: 10,
    }}>
      <span style={{ display: 'inline-block', width: 18, height: 1, background: color, opacity: 0.5 }} />
      {children}
    </div>
  );
}

function Panel({ children, accent }: { children: React.ReactNode; accent?: string }) {
  return (
    <div style={{
      border: `1px solid ${accent ? accent + '28' : 'rgba(244,244,242,0.09)'}`,
      borderRadius: 10,
      background: accent ? `${accent}06` : 'rgba(244,244,242,0.02)',
      padding: 'clamp(14px,3vw,20px)',
    }}>
      {children}
    </div>
  );
}

function Caption({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      marginTop: 12, fontFamily: MONO, fontSize: 11,
      color: 'var(--text3)', letterSpacing: '0.05em', textAlign: 'center', lineHeight: 1.6,
    }}>
      {children}
    </div>
  );
}

function Chip({
  active, color, onClick, children,
}: { active: boolean; color: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      style={{
        fontFamily: MONO, fontSize: 11, letterSpacing: '0.04em',
        padding: '7px 11px', borderRadius: 6, cursor: 'pointer',
        background: active ? `${color}1c` : 'rgba(244,244,242,0.03)',
        border: `1px solid ${active ? color : 'rgba(244,244,242,0.12)'}`,
        color: active ? color : 'var(--text2)',
        transition: 'all 0.15s',
      }}
    >
      {children}
    </button>
  );
}

function Stat({ label, value, sub, color }: { label: string; value: string; sub: React.ReactNode; color: string }) {
  return (
    <div style={{
      padding: '12px 14px', borderRadius: 8,
      background: `${color}0a`, border: `1px solid ${color}26`,
    }}>
      <div style={{ fontFamily: MONO, fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color, marginBottom: 6 }}>
        {label}
      </div>
      <div style={{ fontFamily: MONO, fontSize: 20, color, lineHeight: 1, marginBottom: 6, fontVariantNumeric: 'tabular-nums' }}>
        {value}
      </div>
      <div style={{ fontFamily: SERIF, fontSize: 13, color: 'var(--text3)', lineHeight: 1.5 }}>
        {sub}
      </div>
    </div>
  );
}

// ── Data ────────────────────────────────────────────────────────────────────

// [season, host (T = Toledo, B = Bowling Green), Toledo pts, BG pts, Toledo result]
type SeriesRow = [number, 'T' | 'B', number, number, 'W' | 'L' | 'T'];
const SERIES: SeriesRow[] = [
  [1919,'B',6,0,'W'],[1921,'T',7,20,'L'],[1922,'B',6,6,'T'],[1923,'T',27,0,'W'],[1924,'B',12,7,'W'],
  [1928,'B',0,14,'L'],[1929,'T',0,0,'T'],[1930,'B',0,0,'T'],[1932,'B',6,12,'L'],[1933,'T',25,7,'W'],
  [1934,'B',22,0,'W'],[1935,'T',63,0,'W'],[1948,'T',6,21,'L'],[1949,'T',20,19,'W'],[1950,'T',14,39,'L'],
  [1951,'B',12,6,'W'],[1952,'T',19,29,'L'],[1953,'B',20,19,'W'],[1954,'T',38,7,'W'],[1955,'B',0,39,'L'],
  [1956,'T',12,34,'L'],[1957,'B',0,29,'L'],[1958,'T',16,31,'L'],[1959,'B',21,51,'L'],[1960,'T',3,14,'L'],
  [1961,'B',6,17,'L'],[1962,'T',13,28,'L'],[1963,'B',20,22,'L'],[1964,'T',14,31,'L'],[1965,'B',14,21,'L'],
  [1966,'T',13,14,'L'],[1967,'B',33,0,'W'],[1968,'T',0,0,'T'],[1969,'B',27,26,'W'],[1970,'T',20,0,'W'],
  [1971,'B',24,7,'W'],[1972,'T',8,19,'L'],[1973,'B',35,49,'L'],[1974,'T',24,19,'W'],[1975,'B',17,34,'L'],
  [1976,'T',28,29,'L'],[1977,'B',13,21,'L'],[1978,'T',27,45,'L'],[1979,'B',23,17,'W'],[1980,'T',6,17,'L'],
  [1981,'B',0,38,'L'],[1982,'T',24,10,'W'],[1983,'B',6,3,'W'],[1984,'T',17,6,'W'],[1985,'B',0,21,'L'],
  [1986,'T',22,3,'W'],[1987,'B',6,20,'L'],[1988,'T',34,5,'W'],[1989,'B',23,27,'L'],[1990,'T',19,13,'W'],
  [1991,'B',21,24,'L'],[1992,'T',9,10,'L'],[1993,'B',10,17,'L'],[1994,'T',16,31,'L'],[1995,'B',35,16,'W'],
  [1996,'T',24,16,'W'],[1997,'B',35,20,'W'],[1998,'T',24,16,'W'],[1999,'B',23,34,'L'],[2000,'T',51,17,'W'],
  [2001,'B',21,56,'L'],[2002,'T',42,24,'W'],[2003,'B',23,31,'L'],[2004,'T',49,41,'W'],[2005,'B',44,41,'W'],
  [2006,'T',31,21,'W'],[2007,'B',10,37,'L'],[2008,'T',10,38,'L'],[2009,'B',24,38,'L'],[2010,'T',33,14,'W'],
  [2011,'B',28,21,'W'],[2012,'T',27,15,'W'],[2013,'B',28,25,'W'],[2014,'T',27,20,'W'],[2015,'B',44,28,'W'],
  [2016,'T',42,35,'W'],[2017,'B',66,37,'W'],[2018,'T',52,36,'W'],[2019,'B',7,20,'L'],[2020,'T',38,3,'W'],
  [2021,'B',49,17,'W'],[2022,'T',35,42,'L'],[2023,'B',32,31,'W'],[2024,'T',26,41,'L'],[2025,'B',23,28,'L'],
];

interface GameState {
  year: number; host: 'T' | 'B'; ut: number; bg: number; res: 'W' | 'L' | 'T';
  lead: number; w: number; l: number; t: number;
}

const GAMES: GameState[] = (() => {
  let w = 0, l = 0, t = 0;
  return SERIES.map(([year, host, ut, bg, res]) => {
    if (res === 'W') w++; else if (res === 'L') l++; else t++;
    return { year, host, ut, bg, res, lead: w - l, w, l, t };
  });
})();

// ── 0. Answers up front + question headers ──────────────────────────────────

const ANSWERS = [
  { id: 'streaks', big: '43-43-4', q: 'Is this rivalry streakier than chance?',
    a: 'Mostly no. Bowling Green’s 12 straight wins from 1955 to 1966 are the one streak chance can’t explain.' },
  { id: 'toss', big: '13-13', q: 'Does winning the coin toss help?',
    a: 'Toss winners are 13-13 since 1998, even though they defer 22 of 26 times.' },
  { id: 'opening', big: '5 of 10', q: 'Does the team that gets the ball first play it safe?',
    a: 'No. BG scores on 5 of 10 opening drives after Toledo defers. Toledo scores on 5 of 12 after BG defers.' },
  { id: 'sample', big: '44%', q: 'Doesn’t 16-11 for the 2nd-half receiver mean something?',
    a: 'A fair coin produces a record that lopsided 44% of the time.' },
  { id: 'middle-eight', big: '+0.93', q: 'So does deferring help at all?',
    a: 'It wins the 8 minutes around halftime by about a point. It doesn’t win games.' },
];

export function AnswersUpFront() {
  return (
    <nav aria-label="The short version" style={{
      margin: '2rem 0 2.5rem', borderRadius: 10, overflow: 'hidden',
      border: '1px solid rgba(244,244,242,0.1)', background: 'rgba(244,244,242,0.02)',
    }}>
      <div style={{
        padding: '12px 16px', fontFamily: MONO, fontSize: 11, letterSpacing: '0.12em',
        textTransform: 'uppercase', color: GOLD, borderBottom: '1px solid rgba(244,244,242,0.08)',
      }}>
        The short version · 5 questions
      </div>
      {ANSWERS.map((x, i) => (
        <a key={x.id} href={`#${x.id}`} style={{
          display: 'grid', gridTemplateColumns: 'minmax(68px, 92px) 1fr', gap: 14, alignItems: 'baseline',
          padding: '14px 16px', textDecoration: 'none', color: 'inherit', borderBottom: 'none',
          borderTop: i ? '1px solid rgba(244,244,242,0.07)' : 'none',
        }}>
          <span style={{ fontFamily: MONO, fontSize: 20, color: 'var(--foreground)', fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' }}>
            {x.big}
          </span>
          <span>
            <span style={{ display: 'block', fontFamily: MONO, fontSize: 11, color: GOLD, letterSpacing: '0.04em', marginBottom: 4 }}>
              {String(i + 1).padStart(2, '0')} · {x.q} ↓
            </span>
            <span style={{ display: 'block', fontFamily: SERIF, fontSize: 15, lineHeight: 1.55, color: 'var(--text2)' }}>
              {x.a}
            </span>
          </span>
        </a>
      ))}
    </nav>
  );
}

export function Question({ n, id, q, a }: { n: number; id: string; q: string; a: string }) {
  return (
    <div id={id} style={{ scrollMarginTop: 120, marginTop: '4rem', paddingTop: '1.75rem', borderTop: '1px solid rgba(244,244,242,0.1)' }}>
      <div style={{ fontFamily: MONO, fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: GOLD, marginBottom: 10 }}>
        Question {n} of 5
      </div>
      <h2 style={{
        fontFamily: SERIF, fontWeight: 400, fontSize: 'var(--fs-article-h2)', lineHeight: 1.2,
        letterSpacing: '-0.015em', color: 'var(--foreground)', margin: '0 0 16px',
      }}>
        {q}
      </h2>
      <div style={{
        margin: '0 0 1.75rem', padding: '12px 16px', borderRadius: 6,
        border: `1px solid ${GOLD}40`, background: `${GOLD}0d`,
        fontFamily: SERIF, fontSize: 17, lineHeight: 1.55, color: 'var(--foreground)',
      }}>
        <span style={{ fontFamily: MONO, fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: GOLD, marginRight: 10 }}>
          Answer
        </span>
        {a}
      </div>
    </div>
  );
}

// ── 1. Series explorer ──────────────────────────────────────────────────────
// The SVG is drawn at its real pixel width (ResizeObserver), so labels stay
// readable on phones instead of shrinking with a fixed viewBox.

function geom(width: number) {
  const W = Math.max(300, Math.round(width));
  const H = W < 520 ? 230 : 290;
  const l = 30, r = 10, t = 16, b = 26;
  const y0 = 1917.5, y1 = 2026.5, lMax = 5, lMin = -12;
  return {
    W, H, l, r, t, b, y0, y1,
    x: (year: number) => l + ((year - y0) / (y1 - y0)) * (W - l - r),
    y: (lead: number) => t + ((lMax - lead) / (lMax - lMin)) * (H - t - b),
  };
}

const MOMENTS = [
  { id: 'bg12',  label: 'BG wins 12 straight', from: 1955, to: 1966, color: BG,
    text: 'Bowling Green wins every game from 1955 to 1966. Random orderings of this series produce a run that long only 0.8% of the time. It covers Doyt Perry’s entire tenure as BG head coach.' },
  { id: 'low',   label: 'Rock bottom, 1994', from: 1994, to: 1994, color: BG,
    text: 'After 1994, Bowling Green leads the series by 11 games. It takes Toledo 31 years to climb all the way back.' },
  { id: 'ut9',   label: 'Toledo wins 9 straight', from: 2010, to: 2018, color: UT,
    text: 'Toledo wins every meeting from 2010 to 2018. It feels historic, but about 1 in 10 random orderings has a run at least this long.' },
  { id: 'now',   label: 'Dead even', from: 2025, to: 2025, color: GOLD,
    text: 'Bowling Green wins in 2025 and the series is level at 43-43-4. Total points: Toledo 1,930, Bowling Green 1,907.' },
] as const;

const ERAS = [
  { label: 'No trophy', from: 1919, to: 1979, rec: '16-24-4' },
  { label: 'Peace Pipe', from: 1980, to: 2010, rec: '16-15' },
  { label: 'I-75 trophy', from: 2011, to: 2025, rec: '11-4' },
];

function leadText(lead: number) {
  if (lead === 0) return 'Series even';
  return lead > 0 ? `Toledo leads by ${lead}` : `Bowling Green leads by ${-lead}`;
}

export function SeriesExplorer() {
  const [idx, setIdx] = useState(GAMES.length - 1);
  const [moment, setMoment] = useState<string | null>('now');
  const [width, setWidth] = useState(760);
  const boxRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const el = boxRef.current;
    if (!el || typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(entries => setWidth(entries[0].contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const G = useMemo(() => geom(width), [width]);
  const narrow = G.W < 520;

  const linePath = useMemo(() => {
    let d = `M${G.x(1918.5).toFixed(1)},${G.y(0).toFixed(1)}`;
    let prev = 0;
    for (const g of GAMES) {
      d += ` H${G.x(g.year).toFixed(1)}`;
      if (g.lead !== prev) d += ` V${G.y(g.lead).toFixed(1)}`;
      prev = g.lead;
    }
    return d + ` H${G.x(2026).toFixed(1)}`;
  }, [G]);
  const areaPath = `${linePath} V${G.y(0).toFixed(1)} H${G.x(1918.5).toFixed(1)} Z`;

  const g = GAMES[idx];
  const m = MOMENTS.find(mm => mm.id === moment) ?? null;

  function pick(clientX: number) {
    const svg = svgRef.current;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const sx = ((clientX - rect.left) / rect.width) * G.W;
    const year = G.y0 + ((sx - G.l) / (G.W - G.l - G.r)) * (G.y1 - G.y0);
    let best = 0, bestD = Infinity;
    GAMES.forEach((gg, i) => {
      const d = Math.abs(gg.year - year);
      if (d < bestD) { bestD = d; best = i; }
    });
    setIdx(best);
    setMoment(null);
  }

  function chooseMoment(id: string) {
    const mm = MOMENTS.find(x => x.id === id)!;
    setMoment(id);
    setIdx(GAMES.findIndex(x => x.year === mm.to));
  }

  const utWon = g.res === 'W', tie = g.res === 'T';
  const resultColor = tie ? MUTED : utWon ? UT : BG;
  const LABEL = { fontSize: 11, fill: 'var(--text3)', fontFamily: MONO } as const;

  return (
    <div style={{ margin: '2.5rem 0' }}>
      <SectionLabel color={GOLD}>Interactive · Scrub 107 years</SectionLabel>
      <Panel>
        {/* Readout */}
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', gap: '6px 16px', marginBottom: 12, minHeight: 48 }}>
          <div style={{ fontFamily: MONO, fontSize: 30, color: 'var(--foreground)', lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>
            {g.year}
          </div>
          <div style={{ fontFamily: MONO, fontSize: 13, color: 'var(--text2)' }}>
            <span style={{ color: UT }}>Toledo {g.ut}</span>
            <span style={{ color: 'var(--text3)' }}>{'  ·  '}</span>
            <span style={{ color: BG }}>Bowling Green {g.bg}</span>
            <span style={{ color: 'var(--text3)' }}>{`  ·  at ${g.host === 'T' ? 'Toledo' : 'Bowling Green'}`}</span>
          </div>
          <div style={{ fontFamily: MONO, fontSize: 12, color: resultColor, marginLeft: narrow ? 0 : 'auto' }}>
            {tie ? 'Tie' : `${utWon ? 'Toledo' : 'BG'} wins`} → {leadText(g.lead)} ({g.w}-{g.l}-{g.t})
          </div>
        </div>

        {/* Chart */}
        <div ref={boxRef}>
          <svg
            ref={svgRef}
            width="100%"
            height={G.H}
            viewBox={`0 0 ${G.W} ${G.H}`}
            role="img"
            aria-label="Toledo wins minus Bowling Green wins after each game, 1919 to 2025. Toledo led early, Bowling Green led by as many as 11 games after 1994, and the series is now even."
            style={{ display: 'block', touchAction: 'pan-y', cursor: 'crosshair' }}
            onPointerMove={e => pick(e.clientX)}
            onPointerDown={e => pick(e.clientX)}
          >
            <defs>
              <clipPath id="i75-above"><rect x="0" y="0" width={G.W} height={G.y(0)} /></clipPath>
              <clipPath id="i75-below"><rect x="0" y={G.y(0)} width={G.W} height={G.H} /></clipPath>
            </defs>

            {[4, 0, -4, -8, -12].map(v => (
              <g key={v}>
                <line x1={G.l} x2={G.W - G.r} y1={G.y(v)} y2={G.y(v)}
                  stroke="rgba(244,244,242,0.08)" strokeDasharray={v === 0 ? undefined : '2 4'} />
                <text x={G.l - 6} y={G.y(v) + 4} textAnchor="end" {...LABEL}>{v > 0 ? `+${v}` : v}</text>
              </g>
            ))}
            {(narrow ? [1920, 1960, 2000] : [1920, 1940, 1960, 1980, 2000, 2020]).map(y => (
              <text key={y} x={G.x(y)} y={G.H - 6} textAnchor="middle" {...LABEL}>{y}</text>
            ))}

            {/* WWII-era gap */}
            <rect x={G.x(1935.5)} y={G.t} width={G.x(1947.5) - G.x(1935.5)} height={G.H - G.t - G.b} fill="rgba(244,244,242,0.04)" />
            {!narrow && (
              <text x={(G.x(1935.5) + G.x(1947.5)) / 2} y={G.t + 14} textAnchor="middle" {...LABEL}>no games</text>
            )}

            {m && (
              <rect x={G.x(m.from - 0.5)} y={G.t} width={G.x(m.to + 0.5) - G.x(m.from - 0.5)}
                height={G.H - G.t - G.b} fill={`${m.color}18`} stroke={`${m.color}55`} />
            )}

            <path d={areaPath} fill={`${UT}38`} clipPath="url(#i75-above)" />
            <path d={areaPath} fill={`${BG}30`} clipPath="url(#i75-below)" />
            <path d={linePath} fill="none" stroke="var(--foreground)" strokeOpacity={0.85} strokeWidth={1.5} />

            <text x={G.W - G.r - 2} y={G.y(3.5)} textAnchor="end" fontSize={11} fill={UT} fontFamily={MONO}>TOLEDO AHEAD ↑</text>
            <text x={G.W - G.r - 2} y={G.y(-11.2)} textAnchor="end" fontSize={11} fill={BG} fontFamily={MONO}>BG AHEAD ↓</text>

            <line x1={G.x(g.year)} x2={G.x(g.year)} y1={G.t} y2={G.H - G.b} stroke={resultColor} strokeOpacity={0.6} />
            <circle cx={G.x(g.year)} cy={G.y(g.lead)} r={5.5} fill={resultColor} stroke="var(--background)" strokeWidth={2} />
          </svg>
        </div>

        <input
          type="range" min={0} max={GAMES.length - 1} value={idx}
          onChange={e => { setIdx(Number(e.target.value)); setMoment(null); }}
          aria-label="Scrub through all 90 games"
          aria-valuetext={`${g.year}: ${leadText(g.lead)}`}
          style={{ width: '100%', accentColor: GOLD, cursor: 'pointer', margin: '8px 0 14px' }}
        />

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 12 }}>
          {MOMENTS.map(mm => (
            <Chip key={mm.id} active={moment === mm.id} color={mm.color} onClick={() => chooseMoment(mm.id)}>
              {mm.label}
            </Chip>
          ))}
        </div>
        <div style={{
          minHeight: 48, fontFamily: SERIF, fontSize: 15, lineHeight: 1.6, color: 'var(--text2)',
          padding: '12px 14px', borderRadius: 8,
          background: m ? `${m.color}0a` : 'rgba(244,244,242,0.02)',
          border: `1px solid ${m ? m.color + '28' : 'rgba(244,244,242,0.07)'}`,
        }}>
          {m ? m.text : 'Drag across the chart, or use the slider, to step through every game. Pick a moment above for the story behind it.'}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 6, marginTop: 12 }}>
          {ERAS.map(e => (
            <div key={e.label} style={{ padding: '10px 12px', borderRadius: 8, border: '1px solid rgba(244,244,242,0.07)' }}>
              <div style={{ fontFamily: MONO, fontSize: 11, color: 'var(--text3)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                {e.label} · {e.from}–{e.to}
              </div>
              <div style={{ fontFamily: MONO, fontSize: 15, color: 'var(--foreground)', marginTop: 4 }}>
                Toledo {e.rec}
              </div>
            </div>
          ))}
        </div>
      </Panel>
      <Caption>
        Toledo wins minus Bowling Green wins after each game. Results reconciled across both schools’ athletics sites and CollegeFootballData.com.
      </Caption>
    </div>
  );
}

// ── 2. Streak shuffle (permutation test) ────────────────────────────────────

const DECIDED: boolean[] = SERIES.filter(s => s[4] !== 'T').map(s => s[4] === 'W'); // true = Toledo win

function runStats(seq: boolean[]) {
  let runs = 0, cur = 0, maxUT = 0, maxBG = 0;
  for (let i = 0; i < seq.length; i++) {
    if (i === 0 || seq[i] !== seq[i - 1]) { runs++; cur = 1; } else cur++;
    if (seq[i]) maxUT = Math.max(maxUT, cur); else maxBG = Math.max(maxBG, cur);
  }
  return { runs, maxUT, maxBG, longest: Math.max(maxUT, maxBG) };
}

function shuffled(seq: boolean[]) {
  const a = seq.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const REAL = runStats(DECIDED);

function Strip({ seq, label }: { seq: boolean[] | null; label: string }) {
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ fontFamily: MONO, fontSize: 11, color: 'var(--text3)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 5 }}>
        {label}
      </div>
      <div style={{ display: 'flex', gap: 1, height: 22 }} aria-hidden>
        {seq
          ? seq.map((ut, i) => (
              <div key={i} style={{ flex: 1, minWidth: 1, background: ut ? UT : BG, opacity: 0.85, borderRadius: 1 }} />
            ))
          : <div style={{ flex: 1, border: '1px dashed rgba(244,244,242,0.15)', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: MONO, fontSize: 11, color: 'var(--text3)' }}>
              press shuffle
            </div>}
      </div>
    </div>
  );
}

export function StreakShuffle() {
  const [last, setLast] = useState<boolean[] | null>(null);
  const [tally, setTally] = useState({ n: 0, streaky: 0, run12: 0, run9: 0 });

  function run(times: number) {
    let streaky = 0, run12 = 0, run9 = 0, seq: boolean[] = DECIDED;
    for (let k = 0; k < times; k++) {
      seq = shuffled(DECIDED);
      const s = runStats(seq);
      if (s.runs <= REAL.runs) streaky++;
      if (s.longest >= 12) run12++;
      if (s.longest >= 9) run9++;
    }
    setLast(seq);
    setTally(t => ({ n: t.n + times, streaky: t.streaky + streaky, run12: t.run12 + run12, run9: t.run9 + run9 }));
  }

  const lastStats = last ? runStats(last) : null;
  const pct = (x: number) => (tally.n ? `${((x / tally.n) * 100).toFixed(tally.n >= 1000 ? 1 : 0)}%` : '-');

  return (
    <div style={{ margin: '2.5rem 0' }}>
      <SectionLabel color={GOLD}>Interactive · Shuffle the rivalry</SectionLabel>
      <Panel>
        <div style={{ fontFamily: SERIF, fontSize: 14, color: 'var(--text3)', lineHeight: 1.6, marginBottom: 14 }}>
          Same 86 decided games, same 43 wins each. Shuffle the order and see how often pure chance
          produces streaks like the real ones. <span style={{ color: UT }}>Blue</span> is a Toledo win,{' '}
          <span style={{ color: BG }}>orange</span> is Bowling Green.
        </div>

        <Strip seq={DECIDED} label={`Real order · ${REAL.runs} runs · longest: BG ${REAL.maxBG}, Toledo ${REAL.maxUT}`} />
        <Strip seq={last} label={lastStats
          ? `Your last shuffle · ${lastStats.runs} runs · longest: BG ${lastStats.maxBG}, Toledo ${lastStats.maxUT}`
          : 'Shuffled order'} />

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, margin: '14px 0' }}>
          <Chip active={false} color={GOLD} onClick={() => run(1)}>↻ Shuffle once</Chip>
          <Chip active={false} color={GOLD} onClick={() => run(1000)}>↻ Shuffle 1,000×</Chip>
          {tally.n > 0 && (
            <Chip active={false} color={MUTED} onClick={() => { setTally({ n: 0, streaky: 0, run12: 0, run9: 0 }); setLast(null); }}>Reset</Chip>
          )}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 8 }}>
          <Stat label="As streaky as real" value={pct(tally.streaky)} color={GREEN}
            sub={<>of your {tally.n.toLocaleString()} shuffles had {REAL.runs} runs or fewer. My 20,000: <b>23%</b>. Not unusual.</>} />
          <Stat label="A 9-game run" value={pct(tally.run9)} color={UT}
            sub={<>had a run of 9+, like Toledo’s 2010–18. My 20,000: <b>9.8%</b>.</>} />
          <Stat label="A 12-game run" value={pct(tally.run12)} color={BG}
            sub={<>had a run of 12+, like BG’s 1955–66. My 20,000: <b>0.8%</b>. That one’s real.</>} />
        </div>
      </Panel>
      <Caption>
        A permutation test: ties dropped, order randomized, everything else held fixed. Your numbers will wobble; mine used 20,000 shuffles.
      </Caption>
    </div>
  );
}

// ── 3. Coin toss ledger ─────────────────────────────────────────────────────

interface Toss {
  y: number; host: Team; tw: Team | null; dec: 'defer' | 'receive' | null; r2: Team | null;
  ut: number; bg: number; w: Team; wind: string; line: string | null; src: string; note?: string;
}

const TOSSES: Toss[] = [
  { y: 1998, host: 'UT', tw: null, dec: null, r2: 'UT', ut: 24, bg: 16, w: 'UT', wind: 's 12', line: 'BG wins toss and defers; Miami will receive and defend north goal', src: 'https://bgsufalcons.com/sports/football/stats/1998/toledo/boxscore/9470',
    note: 'Template error. The line names Miami and says BG deferred, but Toledo kicked off to open the game and BG kicked off the 2nd half. The toss can’t be coded. The kickoffs show Toledo received the 2nd half.' },
  { y: 1999, host: 'BG', tw: 'UT', dec: 'defer', r2: 'UT', ut: 23, bg: 34, w: 'BG', wind: 'nw 15-25', line: 'UT wins toss and defers; BG will receive and defend the south goal', src: 'https://bgsufalcons.com/sports/football/stats/1999/toledo/boxscore/904' },
  { y: 2000, host: 'UT', tw: null, dec: null, r2: null, ut: 51, bg: 17, w: 'UT', wind: 'North 9m', line: null, src: 'https://bgsufalcons.com/sports/football/stats/2000/toledo/boxscore/915',
    note: 'The box score has no play-by-play. This toss isn’t in the public record.' },
  { y: 2001, host: 'BG', tw: 'BG', dec: 'defer', r2: 'BG', ut: 21, bg: 56, w: 'BG', wind: 'Light', line: 'BGSU wins coin toss. BGSU defers. UT will receive kickoff.', src: 'https://bgsufalcons.com/sports/football/stats/2001/toledo/boxscore/926' },
  { y: 2002, host: 'UT', tw: 'BG', dec: 'defer', r2: 'BG', ut: 42, bg: 24, w: 'UT', wind: 'NW 13-20', line: 'BGSU won the toss; deferred to the 2nd half. Toledo will def S. Goal', src: 'https://bgsufalcons.com/sports/football/stats/2002/toledo/boxscore/939' },
  { y: 2003, host: 'BG', tw: 'BG', dec: 'defer', r2: 'BG', ut: 23, bg: 31, w: 'BG', wind: '21 WNW', line: 'BGSU wins coin toss and defers; UT will receive & defend north goal', src: 'https://bgsufalcons.com/sports/football/stats/2003/toledo/boxscore/951' },
  { y: 2004, host: 'UT', tw: 'BG', dec: 'receive', r2: 'UT', ut: 49, bg: 41, w: 'UT', wind: 'Calm', line: 'Bowling Green wins the toss and will receive; UT will def. North goal', src: 'https://bgsufalcons.com/sports/football/stats/2004/toledo/boxscore/964' },
  { y: 2005, host: 'BG', tw: 'UT', dec: 'defer', r2: 'UT', ut: 44, bg: 41, w: 'UT', wind: 'NW 11', line: 'UT wins coin toss & defers; BGSU will receive & defend south goal', src: 'https://bgsufalcons.com/sports/football/stats/2005/toledo/boxscore/976',
    note: 'Went to double overtime. The overtime toss isn’t counted here.' },
  { y: 2006, host: 'UT', tw: 'BG', dec: 'defer', r2: 'BG', ut: 31, bg: 21, w: 'UT', wind: 'Calm', line: 'BGSU wins toss and defers; Toledo receives and defends North goal', src: 'https://bgsufalcons.com/sports/football/stats/2006/toledo/boxscore/989' },
  { y: 2007, host: 'BG', tw: 'BG', dec: 'receive', r2: 'UT', ut: 10, bg: 37, w: 'BG', wind: 'NW 4 mph', line: 'BGSU wins coin toss & elects to receive; UT will defend north goal', src: 'https://bgsufalcons.com/sports/football/stats/2007/toledo/boxscore/1002',
    note: 'CollegeFootballData.com lists Toledo’s drive first, but the box score kickoff shows BG received. The box score wins.' },
  { y: 2008, host: 'UT', tw: 'UT', dec: 'defer', r2: 'UT', ut: 10, bg: 38, w: 'BG', wind: 'W 19 mph', line: 'UT won the toss & def. to 2nd half. BG will rec. & def North', src: 'http://stats.utrockets.com//stats/football/2008/utbg1128.htm' },
  { y: 2009, host: 'BG', tw: 'UT', dec: 'receive', r2: 'BG', ut: 24, bg: 38, w: 'BG', wind: '18 mph', line: 'Toledo wins the toss and receives; BG will defend the North goal', src: 'http://stats.utrockets.com//stats/football/2009/utbg1127.htm' },
  { y: 2010, host: 'UT', tw: 'BG', dec: 'defer', r2: 'BG', ut: 33, bg: 14, w: 'UT', wind: 'SSW 5mph', line: 'BG won the toss and deferred; UT will recieve & defend North Goal.', src: 'http://stats.utrockets.com//stats/football/2010/utbg1117.htm' },
  { y: 2011, host: 'BG', tw: 'BG', dec: 'defer', r2: 'BG', ut: 28, bg: 21, w: 'UT', wind: '35 mph', line: 'Bowling Green wins toss and defers; Toledo will receive', src: 'http://stats.utrockets.com//stats/football/2011/utbg1015.htm' },
  { y: 2012, host: 'UT', tw: 'UT', dec: 'defer', r2: 'UT', ut: 27, bg: 15, w: 'UT', wind: 'S 5 mph', line: 'UT wins the toss and defers. BG will receive at the South goal.', src: 'http://stats.utrockets.com//stats/football/2012/utbg0915.htm' },
  { y: 2013, host: 'BG', tw: 'UT', dec: 'defer', r2: 'UT', ut: 28, bg: 25, w: 'UT', wind: 'WSW 22', line: 'UT wins toss and defers; BG will receive and defend North goal', src: 'http://stats.utrockets.com//stats/football/2013/utbg1026.htm' },
  { y: 2014, host: 'UT', tw: 'BG', dec: 'defer', r2: 'BG', ut: 27, bg: 20, w: 'UT', wind: 'WSW 19', line: 'BG won the toss, defers. UT will defend the North Goal.', src: 'http://stats.utrockets.com//stats/football/2014/utbg1119.htm',
    note: 'The line only mentions Toledo’s goal. The kickoffs and CollegeFootballData.com confirm Toledo received first.' },
  { y: 2015, host: 'BG', tw: 'BG', dec: 'receive', r2: 'UT', ut: 44, bg: 28, w: 'UT', wind: 'SE 12MPH', line: 'BGSU wins the toss and will receive. Toledo will defend south goal.', src: 'http://stats.utrockets.com//stats/football/2015/utbg1117.htm' },
  { y: 2016, host: 'UT', tw: 'UT', dec: 'defer', r2: 'UT', ut: 42, bg: 35, w: 'UT', wind: 'SW 11mph', line: 'Toledo wins toss and defers; BGSU to receive & defend North end zone.', src: 'https://utrockets.com/sports/football/stats/2016/bowling-green/boxscore/15895' },
  { y: 2017, host: 'BG', tw: 'UT', dec: 'defer', r2: 'UT', ut: 66, bg: 37, w: 'UT', wind: 'WSW 16', line: 'Toledo wins the toss, defers. BGSU will receive.', src: 'https://utrockets.com/sports/football/stats/2017/bowling-green/boxscore/16392' },
  { y: 2018, host: 'UT', tw: 'BG', dec: 'defer', r2: 'BG', ut: 52, bg: 36, w: 'UT', wind: 'SW 9 mph', line: 'Bowling Green wins toss and defers; UT to receive & defend North goal.', src: 'https://bgsufalcons.com/sports/football/stats/2018/toledo/boxscore/8864' },
  { y: 2019, host: 'BG', tw: 'UT', dec: 'defer', r2: 'UT', ut: 7, bg: 20, w: 'BG', wind: 'SW 15mph', line: 'UT wins coin toss & defers; BGSU will receive & defend north goal', src: 'https://utrockets.com/sports/football/stats/2019/bowling-green/boxscore/17467' },
  { y: 2020, host: 'UT', tw: 'UT', dec: 'defer', r2: 'UT', ut: 38, bg: 3, w: 'UT', wind: 'SW 11mph', line: 'Toledo wins toss and defers; BG will receive and defend North goal.', src: 'https://utrockets.com/sports/football/stats/2020/bowling-green/boxscore/18951' },
  { y: 2021, host: 'BG', tw: 'UT', dec: 'defer', r2: 'UT', ut: 49, bg: 17, w: 'UT', wind: 'NE 5mph', line: 'Toledo wins toss and defers; BGS will receive; TOL will defend North end-zone.', src: 'https://bgsufalcons.com/sports/football/stats/2021/toledo/boxscore/11167' },
  { y: 2022, host: 'UT', tw: 'BG', dec: 'defer', r2: 'BG', ut: 35, bg: 42, w: 'BG', wind: 'W 3mph', line: 'Bowling Green wins toss and defers; TOL will receive; BGS will defend South end-zone.', src: 'https://utrockets.com/sports/football/stats/2022/bowling-green/boxscore/21566' },
  { y: 2023, host: 'BG', tw: 'BG', dec: 'defer', r2: 'BG', ut: 32, bg: 31, w: 'UT', wind: 'S 6mph', line: 'Bowling Green wins toss and defers; UT will receive; BG will defend South end-zone.', src: 'https://utrockets.com/sports/football/stats/2023/bowling-green/boxscore/22590' },
  { y: 2024, host: 'UT', tw: 'BG', dec: 'defer', r2: 'BG', ut: 26, bg: 41, w: 'BG', wind: 'NW 9mph', line: 'Bowling Green wins toss and defers; TOL will receive; BGS will defend North end-zone.', src: 'https://utrockets.com/sports/football/stats/2024/bowling-green/boxscore/23239' },
  { y: 2025, host: 'BG', tw: 'BG', dec: 'defer', r2: 'BG', ut: 23, bg: 28, w: 'BG', wind: 'N 7mph', line: 'Bowling Green wins toss and defers; UT will receive; BG will defend South end-zone.', src: 'https://utrockets.com/sports/football/stats/2025/bowling-green/boxscore/23738' },
];

const maxWind = (s: string) => Math.max(0, ...(s.match(/\d+/g) ?? []).map(Number));

type Lens = 'all' | 'tossWon' | 'r2Won' | 'tookBall' | 'windy';
const LENSES: { id: Lens; label: string; color: string; eligible: (t: Toss) => boolean; hit: (t: Toss) => boolean; blurb: string }[] = [
  { id: 'all', label: 'All games', color: GOLD, eligible: () => true, hit: () => true,
    blurb: 'Tap any game to read the official toss line, word for word, with its source.' },
  { id: 'tossWon', label: 'Toss winner won', color: GREEN, eligible: t => !!t.tw, hit: t => !!t.tw && t.tw === t.w,
    blurb: 'A perfect coin flip. Winning the toss tells you nothing about who wins the game.' },
  { id: 'r2Won', label: '2nd-half receiver won', color: UT, eligible: t => !!t.r2, hit: t => !!t.r2 && t.r2 === t.w,
    blurb: 'This is the number that looks like an edge. Section 3 is about why it isn’t one, yet.' },
  { id: 'tookBall', label: 'Took the ball', color: BG, eligible: t => !!t.tw, hit: t => t.dec === 'receive',
    blurb: 'Only four toss winners skipped the defer. The last one was Bowling Green in 2015.' },
  { id: 'windy', label: 'Wind 15+ mph', color: '#38bdf8', eligible: () => true, hit: t => maxWind(t.wind) >= 15,
    blurb: 'Northwest Ohio in November. The box scores log wind up to 35 mph, and that is when picking an end becomes a real decision.' },
];

export function CoinTossLedger() {
  const [lens, setLens] = useState<Lens>('all');
  const [sel, setSel] = useState(2025);
  const L = LENSES.find(l => l.id === lens)!;
  const eligible = TOSSES.filter(L.eligible);
  const hits = eligible.filter(L.hit).length;
  const t = TOSSES.find(x => x.y === sel)!;

  return (
    <div style={{ margin: '2.5rem 0' }}>
      <SectionLabel color={GOLD}>Interactive · Every toss on the record, 1998–2025</SectionLabel>
      <Panel>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 12 }}>
          {LENSES.map(l => (
            <Chip key={l.id} active={lens === l.id} color={l.color} onClick={() => setLens(l.id)}>{l.label}</Chip>
          ))}
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', gap: '4px 14px', marginBottom: 14 }}>
          {lens !== 'all' && (
            <div style={{ fontFamily: MONO, fontSize: 26, color: L.color, lineHeight: 1 }}>
              {hits}<span style={{ fontSize: 14, color: 'var(--text3)' }}> of {eligible.length}</span>
            </div>
          )}
          <div style={{ fontFamily: SERIF, fontSize: 14, color: 'var(--text2)', lineHeight: 1.55, flex: '1 1 260px' }}>{L.blurb}</div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(92px, 1fr))', gap: 6 }}>
          {TOSSES.map(x => {
            const isEligible = L.eligible(x);
            const isHit = isEligible && L.hit(x);
            const dim = lens !== 'all' && !isHit;
            const active = x.y === sel;
            return (
              <button
                key={x.y}
                type="button"
                onClick={() => setSel(x.y)}
                aria-pressed={active}
                aria-label={`${x.y}: ${x.tw ? `${teamName(x.tw)} won the toss and ${x.dec === 'defer' ? 'deferred' : 'took the ball'}` : 'toss not codable'}. ${teamName(x.w)} won ${Math.max(x.ut, x.bg)}-${Math.min(x.ut, x.bg)}.`}
                style={{
                  textAlign: 'left', cursor: 'pointer', padding: '8px 9px', borderRadius: 7,
                  background: active ? `${L.color}14` : 'rgba(244,244,242,0.02)',
                  border: `1px solid ${active ? L.color : isHit && lens !== 'all' ? L.color + '66' : 'rgba(244,244,242,0.09)'}`,
                  opacity: dim ? 0.28 : 1, transition: 'opacity 0.2s, border-color 0.2s',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontFamily: MONO, fontSize: 12, color: 'var(--foreground)' }}>{x.y}</span>
                  {x.tw
                    ? <span title={x.dec === 'defer' ? 'deferred' : 'took the ball'} style={{
                        width: 10, height: 10, borderRadius: '50%',
                        background: x.dec === 'defer' ? teamColor(x.tw) : 'transparent',
                        border: `2px solid ${teamColor(x.tw)}`, boxSizing: 'border-box',
                      }} />
                    : <span style={{ fontFamily: MONO, fontSize: 11, color: MUTED }}>?</span>}
                </div>
                <div style={{ fontFamily: MONO, fontSize: 11, color: 'var(--text2)', lineHeight: 1.6 }}>
                  2H: <span style={{ color: teamColor(x.r2) }}>{x.r2 ?? '?'}</span>
                </div>
                <div style={{ fontFamily: MONO, fontSize: 11, color: teamColor(x.w), lineHeight: 1.6 }}>
                  {x.w} {Math.max(x.ut, x.bg)}-{Math.min(x.ut, x.bg)}
                </div>
              </button>
            );
          })}
        </div>

        {/* Legend */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 16px', marginTop: 10, fontFamily: MONO, fontSize: 11, color: 'var(--text3)' }}>
          <span><span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', background: UT, marginRight: 5 }} />Toledo won toss, deferred</span>
          <span><span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', background: BG, marginRight: 5 }} />BG won toss, deferred</span>
          <span><span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', border: `2px solid ${MUTED}`, boxSizing: 'border-box', marginRight: 5 }} />took the ball</span>
          <span>2H = received 2nd-half kickoff</span>
        </div>

        {/* Detail */}
        <div style={{
          marginTop: 14, padding: '12px 14px', borderRadius: 8,
          border: '1px solid rgba(244,244,242,0.09)', background: 'rgba(244,244,242,0.025)',
        }}>
          <div style={{ fontFamily: MONO, fontSize: 11, color: 'var(--text3)', letterSpacing: '0.06em', marginBottom: 8 }}>
            {t.y} · AT {t.host === 'UT' ? 'TOLEDO' : 'BOWLING GREEN'} · WIND {t.wind.toUpperCase()} ·{' '}
            <span style={{ color: UT }}>UT {t.ut}</span>, <span style={{ color: BG }}>BG {t.bg}</span>
          </div>
          {t.line
            ? <div style={{ fontFamily: SERIF, fontSize: 15, fontStyle: 'italic', color: 'var(--foreground)', lineHeight: 1.6 }}>
                “{t.line}”
              </div>
            : <div style={{ fontFamily: SERIF, fontSize: 14, color: 'var(--text3)' }}>No toss line in the box score.</div>}
          {t.note && (
            <div style={{ fontFamily: SERIF, fontSize: 14, color: GOLD, lineHeight: 1.6, marginTop: 8 }}>
              {t.note}
            </div>
          )}
          <a href={t.src} target="_blank" rel="noopener noreferrer" style={{
            display: 'inline-block', marginTop: 10, fontFamily: MONO, fontSize: 11, letterSpacing: '0.06em',
            color: 'var(--text2)', textDecoration: 'underline', textUnderlineOffset: 3,
            textDecorationColor: 'rgba(244,244,242,0.3)', padding: 0,
          }}>
            Official box score ↗
          </a>
        </div>
      </Panel>
      <Caption>
        Toss lines copied word for word from utrockets.com and bgsufalcons.com box scores, typos included.
      </Caption>
    </div>
  );
}

// ── 4. Twenty-seven coins ───────────────────────────────────────────────────

const N_RIVAL = 27;
const OBS = 16;

export function TwentySevenCoins() {
  const [hist, setHist] = useState<number[]>(() => new Array(N_RIVAL + 1).fill(0));
  const [lastRun, setLastRun] = useState<boolean[] | null>(null);
  const total = hist.reduce((a, b) => a + b, 0);
  // two-sided: as lopsided as 16-11 in either direction
  const extreme = hist.reduce((a, c, k) => a + (k >= OBS || k <= N_RIVAL - OBS ? c : 0), 0);
  const maxC = Math.max(1, ...hist);

  function play(times: number) {
    const h = hist.slice();
    let run: boolean[] = [];
    for (let s = 0; s < times; s++) {
      run = Array.from({ length: N_RIVAL }, () => Math.random() < 0.5);
      h[run.filter(Boolean).length]++;
    }
    setHist(h);
    setLastRun(run);
  }

  const lastWins = lastRun ? lastRun.filter(Boolean).length : null;

  return (
    <div style={{ margin: '2.5rem 0' }}>
      <SectionLabel color={BG}>Interactive · Replay the rivalry with a fair coin</SectionLabel>
      <Panel accent={BG}>
        <div style={{ fontFamily: SERIF, fontSize: 14, color: 'var(--text3)', lineHeight: 1.6, marginBottom: 14 }}>
          Assume the 2nd-half kickoff is worth <b style={{ color: 'var(--text2)' }}>nothing</b>. Every game is a 50/50 coin.
          Play 27 of them and count how often the 2nd-half receiver wins. How often does a worthless edge look like 16-11?
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 14 }}>
          <Chip active={false} color={BG} onClick={() => play(1)}>▶ Play 27 games</Chip>
          <Chip active={false} color={BG} onClick={() => play(1000)}>▶▶ Play 1,000 rivalries</Chip>
          {total > 0 && <Chip active={false} color={MUTED} onClick={() => { setHist(new Array(N_RIVAL + 1).fill(0)); setLastRun(null); }}>Reset</Chip>}
        </div>

        {/* last run */}
        <div style={{ display: 'flex', gap: 3, flexWrap: 'wrap', minHeight: 14, marginBottom: 6 }} aria-hidden>
          {(lastRun ?? new Array(N_RIVAL).fill(null)).map((v, i) => (
            <span key={i} style={{
              width: 11, height: 11, borderRadius: '50%',
              background: v === null ? 'transparent' : v ? UT : 'rgba(244,244,242,0.18)',
              border: v === null ? '1px dashed rgba(244,244,242,0.18)' : 'none',
            }} />
          ))}
        </div>
        <div style={{ fontFamily: MONO, fontSize: 11, color: 'var(--text2)', marginBottom: 14, minHeight: 15 }}>
          {lastWins !== null
            ? <>Last rivalry: 2nd-half receiver went <span style={{ color: 'var(--foreground)' }}>{lastWins}-{N_RIVAL - lastWins}</span>{(lastWins >= OBS || lastWins <= N_RIVAL - OBS) && <span style={{ color: GOLD }}> · at least as lopsided as the real thing</span>}</>
            : 'One dot per game. Blue = 2nd-half receiver won.'}
        </div>

        {/* histogram */}
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 2, height: 120 }}>
          {hist.map((c, k) => {
            const isObs = k === OBS;
            const isExtreme = k >= OBS || k <= N_RIVAL - OBS;
            return (
              <div key={k} title={`${k}-${N_RIVAL - k}: ${c} rivalries`} style={{
                flex: 1, height: `${(c / maxC) * 100}%`, minHeight: c ? 2 : 0,
                background: isObs ? GOLD : isExtreme ? BG : 'rgba(244,244,242,0.25)',
                opacity: isObs ? 1 : 0.75, borderRadius: '4px 4px 0 0',
              }} />
            );
          })}
        </div>
        <div style={{ position: 'relative', height: 14, fontFamily: MONO, fontSize: 11, color: 'var(--text3)', marginTop: 4 }}>
          {[{ k: 0, t: '0' }, { k: 11, t: '11' }, { k: 13.5, t: 'even' }, { k: OBS, t: '16', c: GOLD }, { k: 27, t: '27 wins' }].map(({ k, t, c }) => (
            <span key={t} style={{
              position: 'absolute', left: `${((k + 0.5) / (N_RIVAL + 1)) * 100}%`,
              transform: k === 0 ? 'translateX(-30%)' : k === 27 ? 'translateX(-80%)' : 'translateX(-50%)',
              color: c ?? 'var(--text3)', whiteSpace: 'nowrap',
            }}>{t}</span>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 8, marginTop: 14 }}>
          <Stat label="Looks like 16-11 or worse" value={total ? `${((extreme / total) * 100).toFixed(0)}%` : '-'} color={BG}
            sub={<>of your {total.toLocaleString()} fair-coin rivalries. The exact answer is <b>44%</b>.</>} />
          <Stat label="What 27 games could detect" value="77%" color={GOLD}
            sub="An edge would need to push the receiver to a ~77% win rate (+27 percentage points) before 27 games could reliably see it." />
        </div>
      </Panel>
      <Caption>
        Orange bars are at least as lopsided as 16-11 in either direction. Detectable effect at 80% power, two-sided α = 0.05.
      </Caption>
    </div>
  );
}

// ── 5. Middle Eight vs. the scoreboard ──────────────────────────────────────

const BY_SEASON: [number, number][] = [
  [2014, 49.1], [2015, 52.3], [2016, 49.7], [2017, 46.9], [2018, 49.5], [2019, 53.7],
  [2020, 53.1], [2021, 51.1], [2022, 47.5], [2023, 49.9], [2024, 48.8], [2025, 53.2],
];

function ForestRow({
  label, sub, est, lo, hi, color, min, max, fmt,
}: { label: string; sub: string; est: number; lo: number; hi: number; color: string; min: number; max: number; fmt: (v: number) => string }) {
  const p = (v: number) => `${((v - min) / (max - min)) * 100}%`;
  return (
    <div style={{ padding: '12px 0', borderBottom: '1px solid rgba(244,244,242,0.06)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', marginBottom: 10 }}>
        <div>
          <div style={{ fontFamily: SERIF, fontSize: 14, color: 'var(--foreground)' }}>{label}</div>
          <div style={{ fontFamily: MONO, fontSize: 11, color: 'var(--text3)', marginTop: 2 }}>{sub}</div>
        </div>
        <div style={{ fontFamily: MONO, fontSize: 14, color, textAlign: 'right' }}>
          {fmt(est)} <span style={{ color: 'var(--text3)', fontSize: 11 }}>[{fmt(lo)}, {fmt(hi)}]</span>
        </div>
      </div>
      <div style={{ position: 'relative', height: 18 }}>
        <div style={{ position: 'absolute', left: 0, right: 0, top: '50%', height: 1, background: 'rgba(244,244,242,0.08)' }} />
        <div style={{ position: 'absolute', left: p(0), top: 0, bottom: 0, width: 1, background: 'rgba(244,244,242,0.35)' }} />
        <div style={{ position: 'absolute', left: p(lo), width: `calc(${p(hi)} - ${p(lo)})`, top: 6, bottom: 6, borderRadius: 4, background: `${color}55` }} />
        <div style={{ position: 'absolute', left: p(est), top: 2, width: 14, height: 14, marginLeft: -7, borderRadius: '50%', background: color, border: '2px solid var(--background)' }} />
      </div>
    </div>
  );
}

export function MiddleEightVsGame() {
  const [view, setView] = useState<'effect' | 'season'>('effect');
  const fmtPts = (v: number) => `${v > 0 ? '+' : ''}${v.toFixed(2)}`;
  const fmtPP = (v: number) => `${v > 0 ? '+' : ''}${v.toFixed(2)} pp`;

  return (
    <div style={{ margin: '2.5rem 0' }}>
      <SectionLabel color={UT}>Interactive · Where the point goes</SectionLabel>
      <Panel>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 6 }}>
          <Chip active={view === 'effect'} color={UT} onClick={() => setView('effect')}>Middle Eight vs. final</Chip>
          <Chip active={view === 'season'} color={UT} onClick={() => setView('season')}>Season by season</Chip>
        </div>

        {view === 'effect' ? (
          <>
            <ForestRow label="Middle Eight points" sub="last 4:00 of Q2 + first 4:00 of Q3 · 5,545 games"
              est={0.93} lo={0.75} hi={1.11} color={UT} min={-1} max={1.5} fmt={fmtPts} />
            <ForestRow label="Final margin vs. closing spread" sub="points per game · 8,310 games"
              est={-0.17} lo={-0.51} hi={0.15} color={MUTED} min={-1} max={1.5} fmt={fmtPts} />
            <ForestRow label="Win probability, spread-adjusted" sub="percentage points · 8,310 games"
              est={-0.15} lo={-1.45} hi={1.16} color={MUTED} min={-2} max={2} fmt={fmtPP} />
            <div style={{ fontFamily: SERIF, fontSize: 14, color: 'var(--text2)', lineHeight: 1.65, marginTop: 12 }}>
              The blue interval sits clearly right of zero: deferring wins the eight minutes around halftime.
              The gray intervals straddle zero: by the final whistle, the edge is gone.
            </div>
          </>
        ) : (
          <>
            <div style={{ position: 'relative', height: 150, margin: '18px 0 6px' }}>
              {[46, 50, 54].map(v => (
                <div key={v} style={{ position: 'absolute', left: 30, right: 0, bottom: `${((v - 45) / 10) * 100}%`, borderTop: `1px ${v === 50 ? 'solid' : 'dashed'} rgba(244,244,242,${v === 50 ? 0.3 : 0.08})` }}>
                  <span style={{ position: 'absolute', left: -30, top: -6, fontFamily: MONO, fontSize: 10, color: 'var(--text3)' }}>{v}%</span>
                </div>
              ))}
              <div style={{ position: 'absolute', left: 30, right: 0, top: 0, bottom: 0, display: 'flex' }}>
                {BY_SEASON.map(([yr, v]) => (
                  <div key={yr} style={{ flex: 1, position: 'relative' }} title={`${yr}: ${v}%`}>
                    <div style={{
                      position: 'absolute', left: '50%', width: 2, marginLeft: -1,
                      bottom: `${(Math.min(v, 50) - 45) * 10}%`, height: `${Math.abs(v - 50) * 10}%`,
                      background: v >= 50 ? UT : BG, opacity: 0.6,
                    }} />
                    <div style={{
                      position: 'absolute', left: '50%', bottom: `${(v - 45) * 10}%`,
                      width: 9, height: 9, margin: '0 0 -4.5px -4.5px', borderRadius: '50%',
                      background: v >= 50 ? UT : BG,
                    }} />
                  </div>
                ))}
              </div>
            </div>
            <div style={{ display: 'flex', marginLeft: 30 }}>
              {BY_SEASON.map(([yr]) => (
                <div key={yr} style={{ flex: 1, textAlign: 'center', fontFamily: MONO, fontSize: 10, color: 'var(--text3)' }}>
                  {`'${String(yr).slice(2)}`}
                </div>
              ))}
            </div>
            <div style={{ fontFamily: SERIF, fontSize: 14, color: 'var(--text2)', lineHeight: 1.65, marginTop: 12 }}>
              2nd-half receiver win rate by season: 46.9% to 53.7%, bouncing around 50 with no trend.
              Drop the strange 2020 season and it’s 50.2%.
            </div>
          </>
        )}
      </Panel>
      <Caption>
        Regular-season FBS vs. FBS games, 2014–2025, CollegeFootballData.com. Bars are 95% confidence intervals.
      </Caption>
    </div>
  );
}

// ── 6. Opening drives ───────────────────────────────────────────────────────
// First offensive drive of every rivalry game since 1998, rebuilt from the
// official box-score play-by-play (src/opening_drives.py in the research repo).

type Why = 'UT deferred' | 'BG deferred' | 'chose the ball' | 'toss not codable';
// [season, offense, why, first snap, first-snap yards, snaps, passes, yards, result, game winner, first play]
type DriveRow = [number, Team, Why, 'run' | 'pass', number, number, number, number, string, Team, string];
const DRIVES: DriveRow[] = [
  [1998, 'BG', 'toss not codable', 'run', 11, 4, 1, 19, 'Punt', 'UT', 'Billy Price rush for 11 yards to the BG46, 1ST DOWN BG.'],
  [1999, 'BG', 'UT deferred', 'run', 2, 13, 5, 70, 'FG', 'BG', 'LEWIS, Godfrey rush up middle for 2 yards to the BG22.'],
  [2001, 'UT', 'BG deferred', 'pass', -4, 3, 2, -7, 'Punt', 'BG', 'JONES, Brian sacked for loss of 4 yards to the TOLEDO17.'],
  [2002, 'UT', 'BG deferred', 'run', 2, 15, 6, 80, 'TD', 'UT', 'DAWSON, Trinity rush for 2 yards to the UT22.'],
  [2003, 'UT', 'BG deferred', 'run', 7, 14, 1, 62, 'FG miss', 'BG', 'DAWSON, Trinity rush for 7 yards to the UT26.'],
  [2004, 'BG', 'chose the ball', 'pass', 0, 6, 4, 69, 'TD', 'UT', 'JACOBS, Omar pass incomplete to MAGNER, Cole.'],
  [2005, 'BG', 'UT deferred', 'run', 7, 15, 4, 89, 'TD', 'UT', 'POPE, P.J. rush for 7 yards to the BGSU18.'],
  [2006, 'UT', 'BG deferred', 'run', 4, 3, 1, 3, 'Punt', 'UT', 'PARMELE, Jalen rush for 4 yards to the UT39.'],
  [2007, 'BG', 'chose the ball', 'run', -3, 14, 4, 61, 'Fumble', 'BG', 'TURNER, Anthony rush for loss of 3 yards to the BGSU30.'],
  [2008, 'BG', 'UT deferred', 'pass', 12, 5, 4, 50, 'TD', 'BG', 'SHEEHAN, Tyler pass complete to KELLEY, Jermiah for 12 yards to the TOLEDO38, 1ST DOWN BGSU.'],
  [2009, 'UT', 'chose the ball', 'run', 4, 3, 1, 3, 'Punt', 'BG', 'COLLINS, D. rush for 4 yards to the TOLEDO36.'],
  [2010, 'UT', 'BG deferred', 'run', 1, 8, 2, 85, 'TD', 'UT', 'THOMAS, Adonis rush for 1 yard to the TOLEDO21.'],
  [2011, 'UT', 'BG deferred', 'pass', 9, 9, 5, 35, 'FG miss', 'UT', 'DANTIN, Austin pass complete to PAGE, Eric for 9 yards to the TOLEDO31.'],
  [2012, 'BG', 'UT deferred', 'pass', 2, 3, 2, 6, 'Punt', 'UT', 'SCHILZ, Matt pass complete to GALLON, Chris for 2 yards to the BGSU41.'],
  [2013, 'BG', 'UT deferred', 'run', 1, 13, 4, 52, 'Downs', 'UT', 'GREENE, Travis rush for 1 yard to the BGSU26.'],
  [2014, 'UT', 'BG deferred', 'run', 4, 12, 6, 38, 'Downs', 'UT', 'HUNT, Kareem rush for 4 yards to the TOLEDO30.'],
  [2015, 'BG', 'chose the ball', 'pass', 0, 1, 1, 0, 'INT', 'UT', 'JOHNSON, Matt pass intercepted by NORRILS, C. at the BGSU27.'],
  [2016, 'BG', 'UT deferred', 'run', 4, 3, 1, 9, 'Punt', 'UT', 'COPPET, Fred rush for 4 yards to the BGSU33.'],
  [2017, 'BG', 'UT deferred', 'run', 4, 9, 5, 75, 'TD', 'UT', 'CLEVELAND, Josh rush for 4 yards to the BGSU30.'],
  [2018, 'UT', 'BG deferred', 'pass', 16, 8, 3, 48, 'FG', 'UT', 'PETERS, Eli pass complete to THOMPSON, Cody for 16 yards to the TOLEDO46, 1ST DOWN TOLEDO.'],
  [2019, 'BG', 'UT deferred', 'run', 56, 4, 2, 61, 'FG', 'BG', 'LOY, Grant rush for 56 yards to the TOLEDO20, 1ST DOWN BGSU, out-of-bounds.'],
  [2020, 'BG', 'UT deferred', 'pass', 0, 3, 3, 7, 'Punt', 'UT', 'MCDONALD, Matt pass incomplete to MORRIS, Quintin.'],
  [2021, 'BG', 'UT deferred', 'run', -1, 3, 1, 8, 'Punt', 'UT', 'Johnson, Jamal rush for 1 yard loss to the BGS24.'],
  [2022, 'UT', 'BG deferred', 'run', 0, 3, 2, 4, 'Punt', 'BG', 'Kelly, Micah rush right for 0 yards to the TOLEDO15.'],
  [2023, 'UT', 'BG deferred', 'run', 8, 6, 2, 75, 'TD', 'UT', 'Boone, Peny rush middle for 8 yards gain to the Toledo33.'],
  [2024, 'UT', 'BG deferred', 'pass', -8, 3, 2, -6, 'Punt', 'BG', 'Gleason, Tucker sacked for loss of 8 yards to the TOLEDO17.'],
  [2025, 'UT', 'BG deferred', 'pass', 39, 6, 3, 80, 'TD', 'BG', 'Gleason, Tucker pass complete deep middle to Vandeross III, Junior for 39 yards to the BGSU36, 1ST DOWN.'],
];

const RED = '#ef4444';
const resultColor = (r: string) =>
  r === 'TD' ? GREEN : r === 'FG' ? GOLD : r === 'INT' || r === 'Fumble' ? RED : MUTED;
const scored = (r: string) => r === 'TD' || r === 'FG';

type DFilter = 'all' | 'utDef' | 'bgDef' | 'chose';
const DFILTERS: { id: DFilter; label: string; test: (d: DriveRow) => boolean }[] = [
  { id: 'all',   label: 'All 27 games',              test: () => true },
  { id: 'utDef', label: 'Toledo deferred → BG ball', test: d => d[2] === 'UT deferred' },
  { id: 'bgDef', label: 'BG deferred → Toledo ball', test: d => d[2] === 'BG deferred' },
  { id: 'chose', label: 'Won the toss, took the ball', test: d => d[2] === 'chose the ball' },
];

function whyText(d: DriveRow) {
  switch (d[2]) {
    case 'UT deferred': return 'Toledo won the toss and deferred';
    case 'BG deferred': return 'Bowling Green won the toss and deferred';
    case 'chose the ball': return `${teamName(d[1])} won the toss and took the ball`;
    default: return 'the toss line is a template error, but the kickoffs show who received';
  }
}

export function OpeningDrives() {
  const [filter, setFilter] = useState<DFilter>('all');
  const [sel, setSel] = useState(2019);
  const F = DFILTERS.find(x => x.id === filter)!;
  const list = DRIVES.filter(F.test);
  const nScored = list.filter(d => scored(d[8])).length;
  const nTD = list.filter(d => d[8] === 'TD').length;
  const nRun = list.filter(d => d[3] === 'run').length;

  const d = DRIVES.find(x => x[0] === sel)!;
  const t = TOSSES.find(x => x.y === sel)!;
  const MIN = -10, MAX = 90;
  const pos = (v: number) => ((Math.max(MIN, Math.min(MAX, v)) - MIN) / (MAX - MIN)) * 100;

  return (
    <div style={{ margin: '2.5rem 0' }}>
      <SectionLabel color={GOLD}>Interactive · Every opening drive, 1998–2025</SectionLabel>
      <Panel>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 14 }}>
          {DFILTERS.map(x => (
            <Chip key={x.id} active={filter === x.id} color={GOLD} onClick={() => setFilter(x.id)}>{x.label}</Chip>
          ))}
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', gap: '4px 14px', marginBottom: 16 }}>
          <div style={{ fontFamily: MONO, fontSize: 30, color: GREEN, lineHeight: 1 }}>
            {nScored}<span style={{ fontSize: 15, color: 'var(--text3)' }}> of {list.length} scored</span>
          </div>
          <div style={{ fontFamily: SERIF, fontSize: 14, color: 'var(--text2)', lineHeight: 1.55 }}>
            {nTD} touchdown{nTD === 1 ? '' : 's'} · first snap was a run {nRun} of {list.length} times
          </div>
        </div>

        {/* Column labels */}
        <div style={{
          display: 'grid', gridTemplateColumns: '44px 34px 1fr 40px 62px', gap: 8,
          fontFamily: MONO, fontSize: 10, color: 'var(--text3)', letterSpacing: '0.08em', textTransform: 'uppercase',
          padding: '0 8px 6px',
        }}>
          <span>Year</span><span>Ball</span><span>Yards gained</span><span style={{ textAlign: 'right' }}>Yds</span><span style={{ textAlign: 'right' }}>Result</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {list.map(r => {
            const active = r[0] === sel;
            const c = teamColor(r[1]);
            const left = pos(Math.min(0, r[7])), right = pos(Math.max(0, r[7]));
            return (
              <button
                key={r[0]}
                type="button"
                onClick={() => setSel(r[0])}
                aria-pressed={active}
                aria-label={`${r[0]}: ${teamName(r[1])} opening drive, ${r[5]} snaps, ${r[7]} yards, ${r[8]}`}
                style={{
                  display: 'grid', gridTemplateColumns: '44px 34px 1fr 40px 62px', gap: 8, alignItems: 'center',
                  padding: '6px 8px', borderRadius: 6, cursor: 'pointer', textAlign: 'left',
                  background: active ? 'color-mix(in srgb, var(--foreground) 7%, transparent)' : 'transparent',
                  border: `1px solid ${active ? 'rgba(244,244,242,0.22)' : 'transparent'}`,
                }}
              >
                <span style={{ fontFamily: MONO, fontSize: 12, color: 'var(--foreground)' }}>{r[0]}</span>
                <span style={{ fontFamily: MONO, fontSize: 12, color: c }}>{r[1]}</span>
                <span style={{ position: 'relative', height: 12 }}>
                  <span style={{ position: 'absolute', left: `${pos(0)}%`, top: -2, bottom: -2, width: 1, background: 'rgba(244,244,242,0.25)' }} />
                  <span style={{
                    position: 'absolute', left: `${left}%`, width: `${Math.max(right - left, 0.8)}%`, top: 1, bottom: 1,
                    borderRadius: 4, background: c, opacity: scored(r[8]) ? 0.9 : 0.4,
                  }} />
                </span>
                <span style={{ fontFamily: MONO, fontSize: 12, color: 'var(--text2)', textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{r[7]}</span>
                <span style={{ fontFamily: MONO, fontSize: 11, color: resultColor(r[8]), textAlign: 'right' }}>{r[8]}</span>
              </button>
            );
          })}
        </div>

        {/* Detail */}
        <div style={{
          marginTop: 14, padding: '14px 16px', borderRadius: 8,
          border: '1px solid rgba(244,244,242,0.09)', background: 'rgba(244,244,242,0.025)',
        }}>
          <div style={{ fontFamily: MONO, fontSize: 11, color: 'var(--text3)', letterSpacing: '0.06em', marginBottom: 8 }}>
            {d[0]} · {teamName(d[1]).toUpperCase()} BALL · FINAL{' '}
            <span style={{ color: UT }}>UT {t.ut}</span>, <span style={{ color: BG }}>BG {t.bg}</span>
          </div>
          <div style={{ fontFamily: SERIF, fontSize: 15, color: 'var(--text2)', lineHeight: 1.6, marginBottom: 8 }}>
            {teamName(d[1])} got the ball first because {whyText(d)}.
          </div>
          <div style={{ fontFamily: SERIF, fontSize: 15, fontStyle: 'italic', color: 'var(--foreground)', lineHeight: 1.6 }}>
            First snap: “{d[10]}”
          </div>
          <div style={{ fontFamily: SERIF, fontSize: 15, color: 'var(--text2)', lineHeight: 1.6, marginTop: 8 }}>
            Drive: {d[5]} snap{d[5] === 1 ? '' : 's'} ({d[6]} pass{d[6] === 1 ? '' : 'es'}), {d[7]} yards →{' '}
            <span style={{ color: resultColor(d[8]) }}>{d[8]}</span>. {teamName(d[9])} won the game.
          </div>
          <a href={t.src} target="_blank" rel="noopener noreferrer" style={{
            display: 'inline-block', marginTop: 10, fontFamily: MONO, fontSize: 11, letterSpacing: '0.06em',
            color: 'var(--text2)', textDecoration: 'underline', textUnderlineOffset: 3,
            textDecorationColor: 'rgba(244,244,242,0.3)', padding: 0,
          }}>
            Official box score ↗
          </a>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: 8, marginTop: 14 }}>
          <Stat label="Scored on the opening drive" value="won 7 of 11" color={GREEN}
            sub="A fast start lines up with winning, but 27 games can’t prove it (p = 0.06)." />
          <Stat label="Didn’t score" value="won 4 of 16" color={MUTED}
            sub="Likely says more about which team was better that night than about the toss." />
        </div>
      </Panel>
      <Caption>
        Rebuilt from official box-score play-by-play. Yards count runs and passes only, not penalties. Sacks count as passes. 2000 has no play-by-play.
      </Caption>
    </div>
  );
}
