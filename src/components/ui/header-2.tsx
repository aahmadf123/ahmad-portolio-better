'use client';
import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { MenuToggleIcon } from '@/components/ui/menu-toggle-icon';
import { useScroll } from '@/components/ui/use-scroll';

export interface HeaderLink { label: string; href: string; }

const MONO = "var(--font-chakra), 'Chakra Petch', monospace";
const SERIF = "var(--font-chakra), 'Chakra Petch', sans-serif";

export function Header({ links }: { links?: HeaderLink[] }) {
  const [open, setOpen] = React.useState(false);
  const [active, setActive] = React.useState('');
  const [mobileVisible, setMobileVisible] = React.useState(false);
  const scrolled = useScroll(10);

  const defaultLinks: HeaderLink[] = links || [
    { label: 'About',        href: '#about' },
    { label: 'Experience',   href: '#experience' },
    { label: 'Work',         href: '#projects' },
    { label: 'Research',     href: '#research' },
    { label: 'Skills',       href: '#skills' },
    { label: 'Press',        href: '#featured-in' },
    { label: 'Now',          href: '#now' },
    { label: 'Field Notes',  href: '#field-notes' },
    { label: 'Contact',      href: '#contact' },
  ];

  // Lock body scroll when mobile menu open
  React.useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  // Animate mobile menu in
  React.useEffect(() => {
    if (open) {
      requestAnimationFrame(() => setMobileVisible(true));
    } else {
      setMobileVisible(false);
    }
  }, [open]);

  // Track active section via IntersectionObserver
  React.useEffect(() => {
    const ids = defaultLinks.map(l => l.href.replace('#', ''));
    const observers: IntersectionObserver[] = [];
    ids.forEach(id => {
      const el = document.getElementById(id);
      if (!el) return;
      const io = new IntersectionObserver(
        ([e]) => { if (e.isIntersecting) setActive(`#${id}`); },
        { threshold: 0.1, rootMargin: '-20% 0px -60% 0px' }
      );
      io.observe(el);
      observers.push(io);
    });
    return () => observers.forEach(o => o.disconnect());
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <style>{`
        .nav-link {
          position: relative;
          font-family: ${MONO};
          font-size: 10px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #B8B4A4;
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
          background: #F0B429;
          transition: width 0.25s cubic-bezier(0.4,0,0.2,1), left 0.25s cubic-bezier(0.4,0,0.2,1);
        }
        .nav-link:hover {
          color: #F2EDD8;
        }
        .nav-link:hover::after {
          width: calc(100% - 28px);
          left: 14px;
        }
        .nav-link.active {
          color: #F0B429;
        }
        .nav-link.active::after {
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: #F0B429;
          bottom: 2px;
          left: 50%;
          transform: translateX(-50%);
        }
        .resume-btn {
          font-family: ${MONO};
          font-size: 10px;
          letter-spacing: 0.09em;
          text-transform: uppercase;
          color: #F2EDD8;
          padding: 7px 16px;
          border: 1px solid rgba(240,180,41,0.35);
          border-radius: 4px;
          background: rgba(240,180,41,0.05);
          text-decoration: none;
          transition: background 0.2s, border-color 0.2s, color 0.2s;
          white-space: nowrap;
        }
        .resume-btn:hover {
          background: rgba(240,180,41,0.12);
          border-color: rgba(240,180,41,0.65);
          color: #F0B429;
        }
        .mobile-link {
          font-family: ${MONO};
          font-size: 11px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #B8B4A4;
          padding: 18px 0;
          border-bottom: 1px solid rgba(242,237,216,0.05);
          text-decoration: none;
          display: flex;
          align-items: center;
          justify-content: space-between;
          transition: color 0.2s;
          opacity: 0;
          transform: translateY(8px);
          transition: opacity 0.3s ease, transform 0.3s ease, color 0.2s ease;
        }
        .mobile-menu-visible .mobile-link {
          opacity: 1;
          transform: translateY(0);
        }
        .mobile-link.active {
          color: #F0B429;
        }
        .mobile-link:hover {
          color: #F2EDD8;
        }
        .mobile-link .arrow {
          font-size: 12px;
          opacity: 0.4;
        }
      `}</style>

      <header
        className={cn(
          'sticky top-0 z-50 w-full transition-all ease-out duration-300',
          scrolled && !open
            ? 'border-b border-white/[0.06] shadow-[0_1px_32px_rgba(0,0,0,0.5)]'
            : 'border-b border-transparent',
        )}
        style={{
          background: scrolled || open
            ? 'rgba(11,13,20,0.94)'
            : 'transparent',
          backdropFilter: scrolled || open ? 'blur(24px) saturate(1.4)' : 'none',
          WebkitBackdropFilter: scrolled || open ? 'blur(24px) saturate(1.4)' : 'none',
        }}
      >
        {/* ── Main bar: 3-column grid for true centering ── */}
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
          <a
            href="#"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 9,
              textDecoration: 'none',
              justifySelf: 'start',
            }}
          >
            <span
              style={{
                display: 'inline-block',
                width: 7,
                height: 7,
                borderRadius: 2,
                background: '#F0B429',
                flexShrink: 0,
                boxShadow: '0 0 10px rgba(240,180,41,0.6)',
              }}
            />
            <span
              style={{
                fontFamily: SERIF,
                fontSize: 18,
                fontWeight: 400,
                letterSpacing: '-0.01em',
                color: '#F2EDD8',
              }}
            >
              Ahmad.dev
            </span>
          </a>

          {/* CENTER — Desktop nav links */}
          <div
            className="hidden md:flex"
            style={{
              alignItems: 'center',
              gap: 0,
              background: 'rgba(242,237,216,0.025)',
              border: '1px solid rgba(242,237,216,0.06)',
              borderRadius: 8,
              padding: '0 4px',
            }}
          >
            {defaultLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className={cn('nav-link', active === link.href && 'active')}
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* RIGHT — Resume CTA + mobile toggle */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              justifySelf: 'end',
            }}
          >
            <a
              href="/docs/Ahmad_Resume_Developer_I_FirstSolar.pdf"
              target="_blank"
              rel="noopener"
              className="resume-btn hidden md:inline-flex"
            >
              Resume ↓
            </a>

            {/* Hamburger — mobile only */}
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setOpen(!open)}
              className="md:hidden"
              style={{
                color: '#B8B4A4',
                border: '1px solid rgba(242,237,216,0.1)',
                borderRadius: 6,
                width: 38,
                height: 38,
              }}
            >
              <MenuToggleIcon open={open} className="size-5" duration={300} />
            </Button>
          </div>
        </nav>

        {/* ── Mobile menu ── */}
        <div
          className={open ? 'mobile-menu-visible' : ''}
          style={{
            display: open ? 'block' : 'none',
            borderTop: '1px solid rgba(242,237,216,0.06)',
            background: 'rgba(11,13,20,0.98)',
            padding: '8px clamp(16px, 3vw, 40px) 32px',
          }}
        >
          <div style={{ maxWidth: 1280, margin: '0 auto' }}>
            {defaultLinks.map((link, i) => (
              <a
                key={link.label}
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
              href="/docs/Ahmad_Resume_Developer_I_FirstSolar.pdf"
              target="_blank"
              rel="noopener"
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
                color: '#F2EDD8',
                padding: '13px 0',
                border: '1px solid rgba(240,180,41,0.35)',
                borderRadius: 6,
                background: 'rgba(240,180,41,0.06)',
                textDecoration: 'none',
                opacity: mobileVisible ? 1 : 0,
                transform: mobileVisible ? 'translateY(0)' : 'translateY(8px)',
                transition: `opacity 0.3s ease ${defaultLinks.length * 45 + 40}ms, transform 0.3s ease ${defaultLinks.length * 45 + 40}ms`,
              }}
            >
              Resume ↓
            </a>
          </div>
        </div>
      </header>
    </>
  );
}
