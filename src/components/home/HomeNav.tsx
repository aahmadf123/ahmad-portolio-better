'use client';

import React from 'react';
import { Brand } from '@/components/layout/Brand';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { useScrollSpy } from '@/components/ui/use-scroll-spy';
import { site } from '@/lib/data/site';

/** Homepage sections the bar links to, in page order. */
const LINKS = [
  { id: 'work', label: 'Work', color: '#fb7185' },
  { id: 'experience', label: 'Story', color: '#5b8af5' },
  { id: 'field-notes', label: 'Notes', color: '#2dd4bf' },
  { id: 'about', label: 'About', color: '#38bdf8' },
  { id: 'skills', label: 'Skills', color: '#f472b6' },
  { id: 'timeline', label: 'Timeline', color: '#a78bfa' },
  { id: 'contact', label: 'Contact', color: '#22c55e' },
] as const;
/** Everything the spy watches: sections without a link light the one before them. */
const SPY_IDS = ['hero', 'intro', 'toledo-football-iq', 'work', 'experience', 'field-notes', 'about', 'skills', 'timeline', 'credentials', 'signals', 'now', 'contact'];
const LINK_FOR: Record<string, string> = { intro: '', 'toledo-football-iq': 'work', credentials: 'timeline', signals: 'timeline', now: 'timeline' };

/**
 * The homepage's own nav bar: hidden over the hero (which has its own header), it slides
 * in once the hero has scrolled away, lights the section you're reading, and shows how
 * far down the page you are.
 */
export function HomeNav() {
  const [shown, setShown] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const { active } = useScrollSpy(SPY_IDS);
  const current = active in LINK_FOR ? LINK_FOR[active] : active;
  const menuId = React.useId();

  React.useEffect(() => {
    const hero = document.getElementById('hero');
    if (!hero) return;
    const io = new IntersectionObserver(([e]) => setShown(!e.isIntersecting), { rootMargin: '-80px 0px 0px 0px' });
    io.observe(hero);
    return () => io.disconnect();
  }, []);

  return (
    <header className={`home-nav${shown ? ' is-shown' : ''}`} inert={!shown}>
      <div className="home-nav-row">
        <Brand />
        <nav aria-label="Sections" className="home-nav-links">
          {LINKS.map((l) => (
            <a key={l.id} href={`#${l.id}`} className="home-nav-link" style={{ '--area': l.color } as React.CSSProperties} aria-current={current === l.id ? 'location' : undefined}>{l.label}</a>
          ))}
        </nav>
        <div className="home-nav-end">
          <a href={site.resumeUrl} target="_blank" rel="noopener" className="home-nav-link home-nav-resume">Resume ↓</a>
          <ThemeToggle />
          <button type="button" className="home-nav-menu" aria-expanded={open} aria-controls={menuId} onClick={() => setOpen((o) => !o)}>
            {open ? 'Close' : 'Menu'}
          </button>
        </div>
      </div>
      <nav id={menuId} aria-label="Sections" className="home-nav-sheet" hidden={!(open && shown)}>
        {LINKS.map((l) => (
          <a key={l.id} href={`#${l.id}`} onClick={() => setOpen(false)} aria-current={current === l.id ? 'location' : undefined}>{l.label}</a>
        ))}
        <a href={site.resumeUrl} target="_blank" rel="noopener">Resume ↓</a>
      </nav>
      <span aria-hidden className="home-nav-progress" />
      <style>{`
        .home-nav { position: fixed; top: 0; left: 0; right: 0; z-index: 200; background: var(--background); border-bottom: 1px solid var(--bd); transform: translateY(-100%); transition: transform .35s cubic-bezier(.2,.7,.2,1); }
        .home-nav.is-shown { transform: none; }
        .home-nav-row { max-width: 1440px; margin: 0 auto; height: 58px; padding: 0 clamp(16px, 4vw, 56px); display: flex; align-items: center; justify-content: space-between; gap: 20px; }
        .home-nav-links { display: flex; align-items: center; gap: clamp(12px, 1.8vw, 28px); }
        .home-nav-end { display: flex; align-items: center; gap: clamp(12px, 1.8vw, 24px); }
        .home-nav-link { position: relative; font-size: 15px; color: var(--text2); display: inline-flex; align-items: center; min-height: 44px; transition: color .2s; }
        .home-nav-link:hover { color: var(--foreground); }
        .home-nav-link[aria-current] { color: var(--foreground); }
        .home-nav-link::after { content: ''; position: absolute; left: 50%; bottom: 6px; width: 5px; height: 5px; margin-left: -2.5px; border-radius: 50%; background: var(--area, var(--primary-fill)); transform: scale(0); transition: transform .3s cubic-bezier(.2,.7,.2,1); }
        .home-nav-link[aria-current]::after { transform: scale(1); }
        .home-nav-resume { color: var(--foreground); }
        .home-nav-menu { display: none; background: none; border: 0; font: inherit; font-size: 15px; color: var(--foreground); cursor: pointer; }
        .home-nav-sheet { display: flex; flex-direction: column; padding: 4px clamp(16px, 4vw, 56px) 16px; }
        .home-nav-sheet[hidden] { display: none; }
        .home-nav-sheet a { font-size: 20px; padding: 10px 0; color: var(--text2); }
        .home-nav-sheet a[aria-current] { color: var(--foreground); }
        .home-nav-progress { position: absolute; left: 0; right: 0; bottom: -1px; height: 1px; background: var(--foreground); transform-origin: left; transform: scaleX(0); }
        @supports (animation-timeline: scroll()) {
          .home-nav-progress { animation: home-nav-progress linear both; animation-timeline: scroll(root block); }
        }
        @keyframes home-nav-progress { to { transform: scaleX(1); } }
        @media (max-width: 960px) {
          .home-nav-links, .home-nav-resume { display: none; }
          .home-nav-menu { display: inline-flex; align-items: center; }
        }
        @media (min-width: 961px) { .home-nav-sheet { display: none !important; } }
        /* Jumps land below the bar. */
        main section[id], main article[id], main [id^="path-"] { scroll-margin-top: 72px; }
      `}</style>
    </header>
  );
}
