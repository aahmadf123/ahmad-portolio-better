import { site } from '@/lib/data/site';

export function SiteFooter() {
  return (
    <footer style={{ position: 'relative', zIndex: 20, borderTop: '1px solid var(--bd)', padding: '28px 52px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
      <span style={{ fontFamily: 'var(--font-code), monospace', fontSize: 10, color: 'var(--text3)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>© 2026 {site.name}. All rights reserved.</span>
      <span style={{ fontFamily: 'var(--font-code), monospace', fontSize: 10, color: 'var(--text3)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Next.js · TypeScript · Framer Motion</span>
    </footer>
  );
}
