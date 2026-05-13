'use client';
import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { MenuToggleIcon } from '@/components/ui/menu-toggle-icon';
import { useScroll } from '@/components/ui/use-scroll';

export interface HeaderLink { label: string; href: string; }

const MONO = "var(--font-mono), 'JetBrains Mono', 'SF Mono', Menlo, monospace";
const SERIF = "var(--font-serif), 'Instrument Serif', Georgia, serif";

export function Header({ links }: { links?: HeaderLink[] }) {
  const [open, setOpen] = React.useState(false);
  const [active, setActive] = React.useState('');
  const scrolled = useScroll(10);

  const defaultLinks: HeaderLink[] = links || [
    { label: 'About', href: '#about' },
    { label: 'Experience', href: '#experience' },
    { label: 'Work', href: '#projects' },
    { label: 'Research', href: '#research' },
    { label: 'Contact', href: '#contact' },
  ];

  React.useEffect(() => {
    if (open) { document.body.style.overflow = 'hidden'; }
    else { document.body.style.overflow = ''; }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  // Track active section via IntersectionObserver
  React.useEffect(() => {
    const ids = defaultLinks.map(l => l.href.replace('#', ''));
    const observers: IntersectionObserver[] = [];
    ids.forEach(id => {
      const el = document.getElementById(id);
      if (!el) return;
      const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) setActive(`#${id}`); }, { threshold: 0.3 });
      io.observe(el);
      observers.push(io);
    });
    return () => observers.forEach(o => o.disconnect());
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full transition-all ease-out duration-300',
        scrolled && !open
          ? 'border-b border-white/[0.06] shadow-[0_1px_24px_rgba(0,0,0,0.4)]'
          : 'border-b border-transparent',
      )}
      style={{
        background: scrolled || open
          ? 'rgba(11,13,20,0.92)'
          : 'transparent',
        backdropFilter: scrolled || open ? 'blur(20px)' : 'none',
        WebkitBackdropFilter: scrolled || open ? 'blur(20px)' : 'none',
      }}
    >
      <nav className="flex h-[60px] w-full max-w-[1280px] mx-auto items-center justify-between px-5 md:px-10">
        {/* Logo */}
        <a href="#" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <span style={{ display: 'inline-block', width: 7, height: 7, borderRadius: 2, background: '#F0B429', flexShrink: 0, boxShadow: '0 0 8px rgba(240,180,41,0.55)' }} />
          <span style={{ fontFamily: SERIF, fontSize: 20, fontWeight: 400, letterSpacing: '-0.01em', color: '#F2EDD8' }}>Ahmad.dev</span>
        </a>

        {/* Desktop links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 2 }} className="hidden md:flex">
          {defaultLinks.map((link) => {
            const isActive = active === link.href;
            return (
              <a
                key={link.label}
                href={link.href}
                style={{
                  fontFamily: MONO,
                  fontSize: 10,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: isActive ? '#F0B429' : '#B8B4A4',
                  padding: '8px 12px',
                  borderRadius: 5,
                  transition: 'color 0.2s, background 0.2s',
                  textDecoration: 'none',
                  position: 'relative',
                }}
                onMouseEnter={e => { if (!isActive) (e.currentTarget as HTMLAnchorElement).style.color = '#F2EDD8'; }}
                onMouseLeave={e => { if (!isActive) (e.currentTarget as HTMLAnchorElement).style.color = '#B8B4A4'; }}
              >
                {link.label}
                {isActive && (
                  <span style={{ position: 'absolute', bottom: 3, left: '50%', transform: 'translateX(-50%)', width: 3, height: 3, borderRadius: '50%', background: '#F0B429' }} />
                )}
              </a>
            );
          })}
          <a
            href="/docs/Ahmad_Resume_Developer_I_FirstSolar.pdf"
            target="_blank"
            rel="noopener"
            style={{
              marginLeft: 10,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 5,
              fontFamily: MONO,
              fontSize: 10,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: '#F2EDD8',
              padding: '7px 16px',
              border: '1px solid rgba(240,180,41,0.45)',
              borderRadius: 5,
              background: 'rgba(240,180,41,0.06)',
              transition: 'background 0.2s, border-color 0.2s',
              textDecoration: 'none',
            }}
            onMouseEnter={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.background = 'rgba(240,180,41,0.14)'; el.style.borderColor = 'rgba(240,180,41,0.7)'; }}
            onMouseLeave={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.background = 'rgba(240,180,41,0.06)'; el.style.borderColor = 'rgba(240,180,41,0.45)'; }}
          >
            Resume ↓
          </a>
        </div>

        {/* Mobile hamburger */}
        <Button size="icon" variant="ghost" onClick={() => setOpen(!open)} className="md:hidden" style={{ color: '#B8B4A4', border: '1px solid rgba(242,237,216,0.12)' }}>
          <MenuToggleIcon open={open} className="size-5" duration={300} />
        </Button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div style={{ background: 'rgba(11,13,20,0.98)', borderTop: '1px solid rgba(242,237,216,0.06)', padding: '12px 20px 28px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {defaultLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setOpen(false)}
                style={{
                  fontFamily: MONO,
                  fontSize: 11,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: active === link.href ? '#F0B429' : '#B8B4A4',
                  padding: '14px 0',
                  borderBottom: '1px solid rgba(242,237,216,0.06)',
                  textDecoration: 'none',
                  display: 'block',
                }}
              >
                {link.label}
              </a>
            ))}
          </div>
          <a
            href="/docs/Ahmad_Resume_Developer_I_FirstSolar.pdf"
            target="_blank"
            rel="noopener"
            style={{
              display: 'block',
              marginTop: 20,
              fontFamily: MONO,
              fontSize: 11,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: '#F2EDD8',
              padding: '12px 0',
              border: '1px solid rgba(240,180,41,0.4)',
              borderRadius: 5,
              background: 'rgba(240,180,41,0.06)',
              textAlign: 'center',
              textDecoration: 'none',
            }}
          >
            Resume ↓
          </a>
        </div>
      )}
    </header>
  );
}
