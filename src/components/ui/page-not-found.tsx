'use client';

import Link from 'next/link';

/**
 * On-brand 404 — dark, cinematic, self-contained (no external assets).
 * A faint football-play diagram drifts behind the numeral as a nod to the
 * flagship project; reduced motion is honored by the global kill-switch.
 */
export default function NotFoundPage() {
  return (
    <main
      style={{
        minHeight: '100svh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 18,
        padding: 'clamp(24px, 6vw, 64px)',
        background: 'var(--background)',
        color: 'var(--foreground)',
        position: 'relative',
        overflow: 'hidden',
        textAlign: 'center',
      }}
    >
      {/* faint play-diagram backdrop */}
      <svg
        aria-hidden
        viewBox="0 0 800 500"
        preserveAspectRatio="xMidYMid slice"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          opacity: 0.07,
          pointerEvents: 'none',
        }}
      >
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <line key={i} x1={80 + i * 128} y1={40} x2={80 + i * 128} y2={460} stroke="var(--primary)" strokeWidth="1" />
        ))}
        <path d="M 160 380 C 240 380, 260 300, 340 300 S 480 180, 560 180" fill="none" stroke="var(--primary)" strokeWidth="2" strokeDasharray="6 8" className="nf-route" />
        <path d="M 200 120 C 300 130, 330 220, 430 240 S 600 330, 660 340" fill="none" stroke="var(--gold)" strokeWidth="2" strokeDasharray="6 8" className="nf-route nf-route-2" />
        <circle cx="160" cy="380" r="7" fill="var(--primary)" />
        <circle cx="200" cy="120" r="7" fill="var(--gold)" />
      </svg>

      <div style={{ position: 'relative', zIndex: 1 }}>
        <div
          style={{
            fontFamily: 'var(--font-code), monospace',
            fontSize: 11,
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            color: 'var(--primary)',
            marginBottom: 14,
          }}
        >
          Incomplete pass
        </div>
        <h1
          style={{
            fontFamily: 'var(--font-display), Georgia, serif',
            fontWeight: 400,
            fontSize: 'clamp(96px, 22vw, 220px)',
            lineHeight: 0.9,
            letterSpacing: '-0.03em',
            margin: 0,
          }}
        >
          4<span style={{ color: 'var(--primary)' }}>0</span>4
        </h1>
        <p
          style={{
            fontFamily: 'var(--font-body), system-ui, sans-serif',
            fontSize: 16,
            lineHeight: 1.7,
            color: 'var(--text2)',
            maxWidth: 420,
            margin: '20px auto 0',
          }}
        >
          This route was fumbled — the page you&apos;re looking for doesn&apos;t exist or has moved.
        </p>
        <div style={{ marginTop: 30, display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link
            href="/"
            data-magnetic=""
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '12px 26px',
              background: 'var(--primary)',
              color: '#06211e',
              fontFamily: 'var(--font-code), monospace',
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: '0.06em',
              borderRadius: 5,
              textTransform: 'uppercase',
            }}
          >
            Back to the huddle ↩
          </Link>
          <Link
            href="/field-notes"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '12px 26px',
              border: '1px solid var(--bd2)',
              color: 'var(--text2)',
              fontFamily: 'var(--font-code), monospace',
              fontSize: 11,
              letterSpacing: '0.06em',
              borderRadius: 5,
              textTransform: 'uppercase',
            }}
          >
            Read Field Notes
          </Link>
        </div>
      </div>

      <style>{`
        @keyframes nf-dash { to { stroke-dashoffset: -140; } }
        .nf-route { animation: nf-dash 9s linear infinite; }
        .nf-route-2 { animation-duration: 13s; }
      `}</style>
    </main>
  );
}
