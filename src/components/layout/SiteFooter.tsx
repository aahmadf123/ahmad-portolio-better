import { site } from '@/lib/data/site';

const MONO = 'var(--font-code), monospace';
const HAND = 'var(--font-hand), cursive';

/**
 * Closing credits: gradient keyline, a handwritten sign-off, and the link
 * columns.
 */
export function SiteFooter() {
  const year = 2026;
  return (
    <footer style={{ position: 'relative', zIndex: 20, background: 'var(--background)', borderTop: '1px solid var(--bd)', overflow: 'hidden' }}>
      {/* keyline */}
      <div aria-hidden style={{ height: 2, background: 'linear-gradient(90deg, var(--primary), var(--gold))', opacity: 0.7 }} />

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: 'clamp(28px, 4vw, 56px) clamp(20px, 4vw, 52px)' }}>
        <div className="footer-grid" style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr', gap: 'clamp(28px, 5vw, 72px)', alignItems: 'start' }}>
          <div>
            <div style={{ fontFamily: HAND, fontSize: 'clamp(28px, 3vw, 40px)', color: 'var(--primary)', lineHeight: 1.2 }}>
              Let&apos;s build something real.
            </div>
            <div style={{ fontFamily: MONO, fontSize: 10, color: 'var(--text3)', letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: 14 }}>
              {site.location} · Open to remote · Available for select projects
            </div>
          </div>

          <nav aria-label="Footer - explore" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <span style={{ fontFamily: MONO, fontSize: 10, color: 'var(--text3)', letterSpacing: '0.14em', textTransform: 'uppercase' }}>Explore</span>
            {[
              { label: 'The Story', href: '/#story' },
              { label: 'Bodies of Work', href: '/#projects' },
              { label: 'Field Notes', href: '/field-notes' },
              { label: 'Docs & Résumé', href: '/docs' },
            ].map((l) => (
              <a key={l.href} href={l.href} style={{ fontFamily: MONO, fontSize: 12, color: 'var(--text2)', letterSpacing: '0.04em' }}>{l.label}</a>
            ))}
          </nav>

          <nav aria-label="Footer - connect" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <span style={{ fontFamily: MONO, fontSize: 10, color: 'var(--text3)', letterSpacing: '0.14em', textTransform: 'uppercase' }}>Connect</span>
            <a href={site.socials.github} target="_blank" rel="noopener" style={{ fontFamily: MONO, fontSize: 12, color: 'var(--text2)' }}>GitHub ↗</a>
            <a href={site.socials.linkedin} target="_blank" rel="noopener" style={{ fontFamily: MONO, fontSize: 12, color: 'var(--text2)' }}>LinkedIn ↗</a>
            <a href={`mailto:${site.email}`} style={{ fontFamily: MONO, fontSize: 12, color: 'var(--primary)' }}>{site.email}</a>
          </nav>
        </div>

        <div style={{ marginTop: 'clamp(28px, 4vw, 48px)', paddingTop: 22, borderTop: '1px solid var(--bd)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
          <span style={{ fontFamily: MONO, fontSize: 10, color: 'var(--text3)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>© {year} {site.name}. All rights reserved.</span>
          <span style={{ fontFamily: MONO, fontSize: 10, color: 'var(--text3)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Next.js · TypeScript · GSAP · three.js</span>
        </div>
      </div>

      <style>{`
        @media (max-width: 760px) { .footer-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </footer>
  );
}
