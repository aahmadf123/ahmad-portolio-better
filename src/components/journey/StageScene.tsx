import React from 'react';
import type { StageSceneId } from '@/lib/data/worlds';

/**
 * The code-drawn scene art from the old Story section, one per world: stroke-based SVG,
 * accent-tinted, with slow dash drift. It fills the side of a world's stage opposite
 * the words, behind Ahmad's own photos (StageArt). Animation classes live in
 * globals.css and stop under reduced motion.
 */
export function StageScene({ scene, accent }: { scene: StageSceneId; accent: string }) {
  const common = {
    width: '100%',
    height: '100%',
    style: { display: 'block' } as React.CSSProperties,
    viewBox: '0 0 600 600',
    fill: 'none',
    'aria-hidden': true,
  };

  switch (scene) {
    case 'map':
      return (
        <svg {...common}>
          <defs>
            <radialGradient id="sc-map-glow" cx="0.5" cy="0.42" r="0.6">
              <stop offset="0" stopColor={accent} stopOpacity="0.14" />
              <stop offset="1" stopColor={accent} stopOpacity="0" />
            </radialGradient>
          </defs>
          <rect width="600" height="600" fill="url(#sc-map-glow)" />
          {/* street grid */}
          {[80, 160, 240, 320, 400, 480].map((x) => (
            <line key={`v${x}`} x1={x} y1="60" x2={x - 30} y2="540" stroke={accent} strokeOpacity="0.14" strokeWidth="1" />
          ))}
          {[120, 200, 280, 360, 440].map((y) => (
            <line key={`h${y}`} x1="50" y1={y} x2="550" y2={y + 24} stroke={accent} strokeOpacity="0.12" strokeWidth="1" />
          ))}
          {/* Maumee river */}
          <path d="M 60 470 C 180 430, 240 480, 330 420 S 500 330, 560 300" stroke="#38bdf8" strokeOpacity="0.5" strokeWidth="10" strokeLinecap="round" />
          <path d="M 60 470 C 180 430, 240 480, 330 420 S 500 330, 560 300" stroke="#38bdf8" strokeOpacity="0.25" strokeWidth="22" strokeLinecap="round" />
          {/* blocks */}
          {[[130, 150, 46, 30], [210, 240, 60, 40], [330, 180, 40, 54], [410, 260, 56, 34], [160, 330, 50, 44], [300, 320, 64, 30]].map(([x, y, w, h], i) => (
            <rect key={i} x={x} y={y} width={w} height={h} stroke={accent} strokeOpacity="0.3" strokeWidth="1.2" transform={`skewX(-4)`} />
          ))}
          {/* pin drop */}
          <g className="scene-drift">
            <circle cx="300" cy="292" r="56" stroke={accent} strokeOpacity="0.35" strokeWidth="1.4" strokeDasharray="4 7" />
            <circle cx="300" cy="292" r="26" stroke={accent} strokeOpacity="0.6" strokeWidth="1.4" />
          </g>
          <path d="M 300 236 c -24 0 -40 18 -40 38 c 0 28 40 62 40 62 s 40 -34 40 -62 c 0 -20 -16 -38 -40 -38 z" fill={accent} fillOpacity="0.9" />
          <circle cx="300" cy="274" r="12" fill="#0d0e12" />
          <text x="300" y="560" textAnchor="middle" fill={accent} fillOpacity="0.65" fontSize="15" letterSpacing="6" fontFamily="var(--font-code), monospace">41.6528° N · 83.5379° W</text>
        </svg>
      );

    case 'systems':
      return (
        <svg {...common}>
          <defs>
            <radialGradient id="sc-sys-glow" cx="0.5" cy="0.5" r="0.65">
              <stop offset="0" stopColor={accent} stopOpacity="0.12" />
              <stop offset="1" stopColor={accent} stopOpacity="0" />
            </radialGradient>
          </defs>
          <rect width="600" height="600" fill="url(#sc-sys-glow)" />
          {/* three source feeds */}
          {[[90, 120, 'AD'], [90, 250, 'AMP'], [90, 380, 'DEF']].map(([x, y, label], i) => (
            <g key={i}>
              <rect x={Number(x)} y={Number(y)} width="110" height="64" rx="8" stroke={accent} strokeOpacity="0.55" strokeWidth="1.4" />
              <text x={Number(x) + 55} y={Number(y) + 38} textAnchor="middle" fill={accent} fillOpacity="0.8" fontSize="16" letterSpacing="3" fontFamily="var(--font-code), monospace">{label}</text>
              <path className="scene-flow" d={`M ${Number(x) + 110} ${Number(y) + 32} C 300 ${Number(y) + 32}, 300 300, 380 300`} stroke={accent} strokeOpacity="0.5" strokeWidth="1.6" strokeDasharray="5 9" />
            </g>
          ))}
          {/* central database cylinder */}
          <g>
            <ellipse cx="440" cy="222" rx="70" ry="22" stroke="#2dd4bf" strokeWidth="1.6" strokeOpacity="0.9" />
            <path d="M 370 222 v 156 a 70 22 0 0 0 140 0 v -156" stroke="#2dd4bf" strokeWidth="1.6" strokeOpacity="0.9" />
            <ellipse cx="440" cy="300" rx="70" ry="22" stroke="#2dd4bf" strokeOpacity="0.35" strokeWidth="1.2" />
            <text x="440" y="430" textAnchor="middle" fill="#2dd4bf" fillOpacity="0.7" fontSize="13" letterSpacing="4" fontFamily="var(--font-code), monospace">POSTGRES · 0 LOSS</text>
          </g>
          {/* shield check */}
          <path d="M 440 258 l 0 0 c 0 0 -26 8 -26 8 v 26 c 0 22 26 34 26 34 s 26 -12 26 -34 v -26 z" stroke="#f4f4f2" strokeOpacity="0.7" strokeWidth="1.6" />
          <path d="M 428 296 l 9 9 l 16 -18" stroke="#f4f4f2" strokeOpacity="0.9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          {/* validation gate: bad entries caught at ingestion */}
          <g stroke={accent} strokeOpacity="0.45" strokeWidth="1.2">
            <path className="scene-flow" d="M 80 510 h 170" strokeDasharray="4 8" />
            <path d="M 250 488 l 22 22 l -22 22" />
            <path className="scene-flow" d="M 276 510 h 244" strokeDasharray="4 8" stroke="#2dd4bf" strokeOpacity="0.6" />
            <path d="M 262 532 v 26" strokeDasharray="2 5" />
          </g>
          <text x="300" y="582" textAnchor="middle" fill={accent} fillOpacity="0.6" fontSize="13" letterSpacing="5" fontFamily="var(--font-code), monospace">3 FEEDS → 1 STORE · 95% CAUGHT</text>
        </svg>
      );

    case 'neural': {
      // deterministic bloom graph
      const nodes: [number, number, number][] = [
        [300, 300, 10], [210, 220, 6], [390, 210, 7], [180, 350, 5], [420, 360, 6],
        [280, 160, 5], [140, 260, 4], [460, 260, 5], [250, 430, 5], [370, 450, 4],
        [110, 420, 3.4], [500, 420, 3.4], [90, 160, 3.4], [510, 150, 3.4], [300, 520, 3.4],
      ];
      const edges: [number, number][] = [
        [0, 1], [0, 2], [0, 3], [0, 4], [1, 5], [1, 6], [2, 7], [2, 5], [3, 8], [4, 9],
        [3, 10], [4, 11], [6, 12], [7, 13], [8, 14], [9, 14], [1, 3], [2, 4],
      ];
      return (
        <svg {...common}>
          <defs>
            <radialGradient id="sc-neu-glow" cx="0.5" cy="0.5" r="0.6">
              <stop offset="0" stopColor={accent} stopOpacity="0.16" />
              <stop offset="1" stopColor={accent} stopOpacity="0" />
            </radialGradient>
          </defs>
          <rect width="600" height="600" fill="url(#sc-neu-glow)" />
          {edges.map(([a, b], i) => (
            <line key={i} className={i % 3 === 0 ? 'scene-flow' : undefined} x1={nodes[a][0]} y1={nodes[a][1]} x2={nodes[b][0]} y2={nodes[b][1]} stroke={accent} strokeOpacity="0.35" strokeWidth="1.1" strokeDasharray={i % 3 === 0 ? '4 7' : undefined} />
          ))}
          {nodes.map(([x, y, r], i) => (
            <g key={i}>
              <circle cx={x} cy={y} r={r} fill={i === 0 ? '#f59e0b' : accent} fillOpacity={i === 0 ? 0.95 : 0.8} />
              <circle cx={x} cy={y} r={r + 6} stroke={i === 0 ? '#f59e0b' : accent} strokeOpacity="0.25" strokeWidth="1" />
            </g>
          ))}
          {/* quadcopter silhouette */}
          <g transform="translate(390 120)" stroke="#f4f4f2" strokeOpacity="0.8" strokeWidth="1.6">
            <line x1="-28" y1="-18" x2="28" y2="18" />
            <line x1="-28" y1="18" x2="28" y2="-18" />
            <circle cx="-28" cy="-18" r="12" strokeOpacity="0.55" />
            <circle cx="28" cy="-18" r="12" strokeOpacity="0.55" />
            <circle cx="-28" cy="18" r="12" strokeOpacity="0.55" />
            <circle cx="28" cy="18" r="12" strokeOpacity="0.55" />
            <rect x="-8" y="-6" width="16" height="12" rx="3" fill="#0d0e12" />
          </g>
          <text x="300" y="566" textAnchor="middle" fill={accent} fillOpacity="0.6" fontSize="13" letterSpacing="5" fontFamily="var(--font-code), monospace">GRAPH → POLICY → ACTION</text>
        </svg>
      );
    }

    case 'solar':
      return (
        <svg {...common}>
          <defs>
            <linearGradient id="sc-sol-sky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor={accent} stopOpacity="0.16" />
              <stop offset="1" stopColor={accent} stopOpacity="0" />
            </linearGradient>
          </defs>
          <rect width="600" height="360" fill="url(#sc-sol-sky)" />
          {/* sun arc */}
          <circle cx="300" cy="180" r="64" stroke={accent} strokeWidth="1.6" strokeOpacity="0.85" />
          <circle cx="300" cy="180" r="90" stroke={accent} strokeOpacity="0.25" strokeWidth="1" strokeDasharray="3 9" className="scene-drift" />
          {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
            <line key={deg} x1={300 + 78 * Math.cos((deg * Math.PI) / 180)} y1={180 + 78 * Math.sin((deg * Math.PI) / 180)} x2={300 + 96 * Math.cos((deg * Math.PI) / 180)} y2={180 + 96 * Math.sin((deg * Math.PI) / 180)} stroke={accent} strokeOpacity="0.5" strokeWidth="1.4" />
          ))}
          {/* panel field in perspective */}
          {[0, 1, 2].map((row) => {
            const y = 380 + row * 62;
            const inset = 40 - row * 26;
            return (
              <g key={row} stroke={accent} strokeOpacity={0.7 - row * 0.16} strokeWidth="1.3">
                {[0, 1, 2, 3].map((col) => {
                  const w = (520 - inset * 2) / 4;
                  const x = 40 + inset + col * w;
                  return <path key={col} d={`M ${x + 6} ${y} L ${x + w - 6} ${y} L ${x + w - 18} ${y + 40} L ${x - 6} ${y + 40} Z`} />;
                })}
              </g>
            );
          })}
          {/* energy line to enterprise blocks */}
          <path className="scene-flow" d="M 300 244 v 90" stroke={accent} strokeWidth="1.6" strokeDasharray="4 8" strokeOpacity="0.7" />
          <g stroke="#2dd4bf" strokeOpacity="0.6" strokeWidth="1.3">
            <rect x="466" y="120" width="70" height="44" rx="6" />
            <rect x="486" y="184" width="50" height="32" rx="6" />
            <path className="scene-flow" d="M 366 176 C 420 168, 430 148, 466 142" strokeDasharray="4 8" />
          </g>
          <text x="300" y="576" textAnchor="middle" fill={accent} fillOpacity="0.6" fontSize="13" letterSpacing="5" fontFamily="var(--font-code), monospace">VBCS · OIC · BIP — ENTERPRISE SCALE</text>
        </svg>
      );

    case 'field':
      return (
        <svg {...common}>
          <defs>
            <radialGradient id="sc-fld-light" cx="0.5" cy="0.16" r="0.75">
              <stop offset="0" stopColor="#f4f4f2" stopOpacity="0.10" />
              <stop offset="1" stopColor="#f4f4f2" stopOpacity="0" />
            </radialGradient>
          </defs>
          <rect width="600" height="600" fill="url(#sc-fld-light)" />
          {/* field */}
          <rect x="80" y="80" width="440" height="440" stroke="#2dd4bf" strokeOpacity="0.45" strokeWidth="1.6" />
          {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <line key={i} x1="80" y1={124 + i * 44} x2="520" y2={124 + i * 44} stroke="#2dd4bf" strokeOpacity={i % 2 ? 0.16 : 0.3} strokeWidth="1" />
          ))}
          {/* hash marks */}
          {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <g key={`h${i}`} stroke="#2dd4bf" strokeOpacity="0.3" strokeWidth="1">
              <line x1="230" y1={118 + i * 44} x2="230" y2={130 + i * 44} />
              <line x1="370" y1={118 + i * 44} x2="370" y2={130 + i * 44} />
            </g>
          ))}
          {/* routes */}
          <path className="scene-flow" d="M 190 470 v -120 l 90 -80" stroke={accent} strokeWidth="2.2" strokeDasharray="7 8" />
          <path className="scene-flow" d="M 410 470 v -90 l -60 -60 l 90 -90" stroke="#f59e0b" strokeWidth="2.2" strokeDasharray="7 8" />
          <path d="M 280 270 l 14 -4 l -4 14 z" fill={accent} />
          <path d="M 440 230 l 14 -4 l -4 14 z" fill="#f59e0b" />
          {/* players + tracking boxes */}
          {[[190, 470, accent], [410, 470, '#f59e0b'], [300, 420, '#f4f4f2'], [260, 470, '#f4f4f2'], [340, 470, '#f4f4f2']].map(([x, y, c], i) => (
            <g key={i}>
              <circle cx={Number(x)} cy={Number(y)} r="9" fill={String(c)} fillOpacity={0.9} />
              {i < 2 && <rect className="scene-drift" x={Number(x) - 17} y={Number(y) - 17} width="34" height="34" stroke={String(c)} strokeOpacity="0.6" strokeWidth="1.2" strokeDasharray="4 4" />}
            </g>
          ))}
          {/* confidence readouts */}
          <text x="150" y="330" fill={accent} fillOpacity="0.8" fontSize="12" fontFamily="var(--font-code), monospace">WR·0.94</text>
          <text x="440" y="500" fill="#f59e0b" fillOpacity="0.8" fontSize="12" fontFamily="var(--font-code), monospace">RB·0.91</text>
          <text x="300" y="566" textAnchor="middle" fill={accent} fillOpacity="0.65" fontSize="13" letterSpacing="5" fontFamily="var(--font-code), monospace">EVERY METRIC → A CLIP A COACH CAN CHECK</text>
        </svg>
      );
    case 'chem':
      // Chem-E Car: the Arduino control system reading pressure and cutting the solenoid to stop the car on the line.
      return (
        <svg {...common}>
          <defs>
            <radialGradient id="sc-chem-glow" cx="0.5" cy="0.45" r="0.6">
              <stop offset="0" stopColor={accent} stopOpacity="0.14" />
              <stop offset="1" stopColor={accent} stopOpacity="0" />
            </radialGradient>
          </defs>
          <rect width="600" height="600" fill="url(#sc-chem-glow)" />
          {/* reaction flask with rising bubbles */}
          <path d="M 120 110 h 44 M 128 110 v 70 l -44 96 a 14 14 0 0 0 13 20 h 106 a 14 14 0 0 0 13 -20 l -44 -96 v -70" stroke={accent} strokeOpacity="0.8" strokeWidth="1.6" />
          <path d="M 98 262 h 120 l 8 18 a 10 10 0 0 1 -9 14 h -118 a 10 10 0 0 1 -9 -14 z" fill={accent} fillOpacity="0.22" />
          {[[130, 270, 5], [160, 256, 4], [184, 276, 3.4], [146, 240, 3]].map(([x, y, r], i) => (
            <circle key={i} className="scene-rise" style={{ animationDelay: `${i * 0.9}s` }} cx={x} cy={y} r={r} stroke={accent} strokeOpacity="0.8" strokeWidth="1.2" />
          ))}
          {/* Arduino board */}
          <g stroke="#2dd4bf" strokeOpacity="0.75" strokeWidth="1.4">
            <rect x="330" y="110" width="170" height="112" rx="8" />
            <rect x="372" y="146" width="60" height="40" rx="3" strokeOpacity="0.5" />
            {Array.from({ length: 10 }, (_, i) => <line key={i} x1={342 + i * 15} y1="118" x2={342 + i * 15} y2="128" strokeOpacity="0.5" />)}
            <circle cx="470" cy="196" r="6" fill="#2dd4bf" fillOpacity="0.8" className="scene-blink" />
          </g>
          <text x="415" y="244" textAnchor="middle" fill="#2dd4bf" fillOpacity="0.7" fontSize="12" letterSpacing="4" fontFamily="var(--font-code), monospace">ARDUINO · PRESSURE</text>
          {/* sensor wire from flask to board */}
          <path className="scene-flow" d="M 226 200 C 270 200, 280 166, 330 166" stroke={accent} strokeOpacity="0.6" strokeWidth="1.6" strokeDasharray="5 8" />
          {/* track, finish line and the car */}
          <line x1="70" y1="452" x2="530" y2="452" stroke={accent} strokeOpacity="0.35" strokeWidth="1.2" />
          <g stroke="#f4f4f2" strokeOpacity="0.7" strokeWidth="1.4">
            {Array.from({ length: 6 }, (_, i) => <rect key={i} x="452" y={372 + i * 14} width="14" height="14" fill={i % 2 ? '#f4f4f2' : 'none'} fillOpacity="0.25" />)}
          </g>
          <g className="scene-drive">
            <rect x="100" y="404" width="120" height="34" rx="9" stroke={accent} strokeWidth="1.8" fill={accent} fillOpacity="0.12" />
            <rect x="122" y="386" width="64" height="22" rx="6" stroke={accent} strokeOpacity="0.7" strokeWidth="1.4" />
            <circle cx="130" cy="442" r="12" stroke="#f4f4f2" strokeOpacity="0.85" strokeWidth="1.8" fill="#0d0e12" />
            <circle cx="192" cy="442" r="12" stroke="#f4f4f2" strokeOpacity="0.85" strokeWidth="1.8" fill="#0d0e12" />
          </g>
          <text x="300" y="560" textAnchor="middle" fill={accent} fillOpacity="0.65" fontSize="13" letterSpacing="5" fontFamily="var(--font-code), monospace">~5 PSI SETPOINT · SOLENOID CUT</text>
        </svg>
      );

    case 'horizon':
      return (
        <svg {...common}>
          <defs>
            <linearGradient id="sc-hor-sky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor={accent} stopOpacity="0" />
              <stop offset="1" stopColor={accent} stopOpacity="0.16" />
            </linearGradient>
          </defs>
          <rect y="120" width="600" height="300" fill="url(#sc-hor-sky)" />
          <line x1="40" y1="420" x2="560" y2="420" stroke={accent} strokeOpacity="0.6" strokeWidth="1.4" />
          {[70, 100, 130].map((r, i) => (
            <path key={r} d={`M ${300 - r} 420 a ${r} ${r} 0 0 1 ${r * 2} 0`} stroke={accent} strokeOpacity={0.75 - i * 0.2} strokeWidth="1.4" className={i === 2 ? 'scene-drift' : undefined} strokeDasharray={i === 2 ? '3 9' : undefined} />
          ))}
          {[0, 1, 2].map((i) => (
            <circle key={i} className="scene-rise" style={{ animationDelay: `${i * 1.2}s` }} cx="300" cy={470 + i * 30} r="6" fill={accent} fillOpacity="0.85" />
          ))}
          {[-60, -30, 0, 30, 60].map((d) => (
            <line key={d} x1="300" y1="420" x2={300 + 260 * Math.sin((d * Math.PI) / 180)} y2={420 - 260 * Math.cos((d * Math.PI) / 180)} stroke={accent} strokeOpacity="0.12" strokeWidth="1" />
          ))}
          <text x="300" y="566" textAnchor="middle" fill={accent} fillOpacity="0.65" fontSize="13" letterSpacing="5" fontFamily="var(--font-code), monospace">LEARNING · BUILDING · PURSUING</text>
        </svg>
      );
  }
}
