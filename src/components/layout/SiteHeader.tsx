'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { MenuToggleIcon } from '@/components/ui/menu-toggle-icon';
import { useScroll } from '@/components/ui/use-scroll';
import { navSections } from '@/lib/data/sections';

const MONO = 'var(--font-code), monospace';
const SERIF = 'var(--font-display), Georgia, serif';

const NAV_LABELS: Record<string, string> = {
  story: 'Story',
  skills: 'Skills',
  timeline: 'Timeline',
  projects: 'Work',
  about: 'About',
  'field-notes': 'Notes',
  contact: 'Contact',
};

/** Registry-driven sticky header — links, order, and active colors come from sections.ts. */
export function SiteHeader() {
  const [open, setOpen] = React.useState(false);
  const [active, setActive] = React.useState('');
  const [mobileVisible, setMobileVisible] = React.useState(false);
  const scrolled = useScroll(10);

  const links = navSections.map((s) => ({ id: s.id, label: NAV_LABELS[s.id] ?? s.label, href: `#${s.id}`, color: s.color }));

  React.useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  React.useEffect(() => {
    if (open) requestAnimationFrame(() => setMobileVisible(true));
    else setMobileVisible(false);
  }, [open]);

  // Scroll-spy on registry ids
  React.useEffect(() => {
    const observers: IntersectionObserver[] = [];
    navSections.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (!el) return;
      const io = new IntersectionObserver(
        ([e]) => { if (e.isIntersecting) setActive(`#${id}`); },
        { threshold: 0.1, rootMargin: '-20% 0px -60% 0px' }
      );
      io.observe(el);
      observers.push(io);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  const activeCss = links
    .map(
      (l) => `
        .nav-link[href="${l.href}"].active { color: ${l.color}; }
        .nav-link[href="${l.href}"].active::after { background: ${l.color}; }
        .mobile-link[href="${l.href}"].active { color: ${l.color}; }`
    )
    .join('\n');

  return (
    <>
      <style>{`
        .nav-link {
          position: relative;
          font-family: ${MONO};
          font-size: 10px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--text2);
          padding: 8px 14px;
          text-decoration: none;
          transition: color 0.2s ease;
          white-space: nowrap;
        }
        .nav-link::after {
          content: '';
          position: absolute;
          bottom: 4px;
          left: 50%;
          width: 0;
          height: 1px;
          background: var(--primary);
          transition: width 0.25s cubic-bezier(0.4,0,0.2,1), left 0.25s cubic-bezier(0.4,0,0.2,1);
        }
        .nav-link:hover { color: var(--foreground); }
        .nav-link:hover::after { width: calc(100% - 28px); left: 14px; }
        .nav-link.active { color: var(--primary); }
        .nav-link.active::after {
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: var(--primary);
          bottom: 2px;
          left: 50%;
          transform: translateX(-50%);
        }
        ${activeCss}
        .resume-btn {
          font-family: ${MONO};
          font-size: 10px;
          letter-spacing: 0.09em;
          text-transform: uppercase;
          color: var(--foreground);
          padding: 7px 16px;
          border: 1px solid rgba(45,212,191,0.35);
          border-radius: 4px;
          background: rgba(45,212,191,0.05);
          text-decoration: none;
          transition: background 0.2s, border-color 0.2s, color 0.2s;
          white-space: nowrap;
        }
        .resume-btn:hover {
          background: rgba(45,212,191,0.12);
          border-color: rgba(45,212,191,0.65);
          color: var(--primary);
        }
        .mobile-link {
          font-family: ${MONO};
          font-size: 11px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--text2);
          padding: 18px 0;
          border-bottom: 1px solid var(--bd);
          text-decoration: none;
          display: flex;
          align-items: center;
          justify-content: space-between;
          opacity: 0;
          transform: translateY(8px);
          transition: opacity 0.3s ease, transform 0.3s ease, color 0.2s ease;
        }
        .mobile-menu-visible .mobile-link { opacity: 1; transform: translateY(0); }
        .mobile-link.active { color: var(--primary); }
        .mobile-link:hover { color: var(--foreground); }
        .mobile-link .arrow { font-size: 12px; opacity: 0.4; }
      `}</style>

      <header
        className={cn(
          'sticky top-0 z-50 w-full transition-all ease-out duration-300',
          scrolled && !open
            ? 'border-b border-white/[0.06] shadow-[0_1px_32px_rgba(0,0,0,0.5)]'
            : 'border-b border-transparent',
        )}
        style={{
          viewTransitionName: 'site-header',
          background: scrolled || open ? 'rgba(13,14,18,0.94)' : 'transparent',
          backdropFilter: scrolled || open ? 'blur(24px) saturate(1.4)' : 'none',
          WebkitBackdropFilter: scrolled || open ? 'blur(24px) saturate(1.4)' : 'none',
        } as React.CSSProperties}
      >
        <nav
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr auto 1fr',
            alignItems: 'center',
            height: 62,
            maxWidth: 1280,
            margin: '0 auto',
            padding: '0 clamp(16px, 3vw, 40px)',
            gap: 16,
          }}
        >
          {/* LEFT — Logo */}
          <a href="#hero" style={{ display: 'flex', alignItems: 'center', gap: 9, textDecoration: 'none', justifySelf: 'start' }}>
            <span
              style={{
                display: 'inline-block',
                width: 7,
                height: 7,
                borderRadius: 2,
                background: 'var(--primary)',
                flexShrink: 0,
                boxShadow: '0 0 10px rgba(45,212,191,0.6)',
              }}
            />
            <span style={{ fontFamily: SERIF, fontSize: 18, fontWeight: 400, letterSpacing: '-0.01em', color: 'var(--foreground)' }}>
              Ahmad.dev
            </span>
          </a>

          {/* CENTER — Desktop nav */}
          <div
            className="hidden md:flex"
            style={{
              alignItems: 'center',
              gap: 0,
              background: 'rgba(244,244,242,0.025)',
              border: '1px solid rgba(244,244,242,0.06)',
              borderRadius: 8,
              padding: '0 4px',
            }}
          >
            {links.map((link) => (
              <a key={link.id} href={link.href} className={cn('nav-link', active === link.href && 'active')}>
                {link.label}
              </a>
            ))}
          </div>

          {/* RIGHT — Docs CTA + mobile toggle */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, justifySelf: 'end' }}>
            <a href="/docs" className="resume-btn hidden md:inline-flex">
              Docs
            </a>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setOpen(!open)}
              className="md:hidden"
              style={{ color: 'var(--text2)', border: '1px solid rgba(244,244,242,0.1)', borderRadius: 6, width: 38, height: 38 }}
            >
              <MenuToggleIcon open={open} className="size-5" duration={300} />
            </Button>
          </div>
        </nav>

        {/* Mobile menu */}
        <div
          className={open ? 'mobile-menu-visible' : ''}
          style={{
            display: open ? 'block' : 'none',
            borderTop: '1px solid var(--bd)',
            background: 'rgba(13,14,18,0.98)',
            padding: '8px clamp(16px, 3vw, 40px) 32px',
          }}
        >
          <div style={{ maxWidth: 1280, margin: '0 auto' }}>
            {links.map((link, i) => (
              <a
                key={link.id}
                href={link.href}
                onClick={() => setOpen(false)}
                className={cn('mobile-link', active === link.href && 'active')}
                style={{ transitionDelay: mobileVisible ? `${i * 45}ms` : '0ms' }}
              >
                {link.label}
                <span className="arrow">→</span>
              </a>
            ))}
            <a
              href="/docs"
              onClick={() => setOpen(false)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                marginTop: 24,
                fontFamily: MONO,
                fontSize: 11,
                letterSpacing: '0.09em',
                textTransform: 'uppercase',
                color: 'var(--foreground)',
                padding: '13px 0',
                border: '1px solid rgba(45,212,191,0.35)',
                borderRadius: 6,
                background: 'rgba(45,212,191,0.06)',
                textDecoration: 'none',
                opacity: mobileVisible ? 1 : 0,
                transform: mobileVisible ? 'translateY(0)' : 'translateY(8px)',
                transition: `opacity 0.3s ease ${links.length * 45 + 40}ms, transform 0.3s ease ${links.length * 45 + 40}ms`,
              }}
            >
              Docs
            </a>
          </div>
        </div>
      </header>
    </>
  );
}
