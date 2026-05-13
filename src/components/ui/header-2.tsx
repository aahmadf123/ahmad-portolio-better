'use client';
import React from 'react';
import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { MenuToggleIcon } from '@/components/ui/menu-toggle-icon';
import { useScroll } from '@/components/ui/use-scroll';

export interface HeaderLink { label: string; href: string; }

export function Header({ links }: { links?: HeaderLink[] }) {
  const [open, setOpen] = React.useState(false);
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

  return (
    <header
      className={cn(
        'sticky top-0 z-50 mx-auto w-full max-w-5xl border-b border-transparent md:rounded-md md:border md:transition-all md:ease-out',
        {
          'bg-background/95 supports-[backdrop-filter]:bg-background/50 border-border backdrop-blur-lg md:top-4 md:max-w-4xl md:shadow': scrolled && !open,
          'bg-background/90': open,
        },
      )}
    >
      <nav
        className={cn(
          'flex h-14 w-full items-center justify-between px-4 md:h-12 md:transition-all md:ease-out',
          { 'md:px-2': scrolled },
        )}
      >
        <a href="#" className="flex items-center gap-2 group">
          <div className="pulse w-2 h-2 rounded-sm flex-shrink-0" style={{ background: 'var(--amber)' }} />
          <span style={{ fontFamily: "'Fraunces', Georgia, serif", fontStyle: 'italic', fontSize: 17, fontWeight: 700, letterSpacing: '-0.01em', color: 'var(--foreground)' }}>Ahmad.dev</span>
        </a>
        <div className="hidden items-center gap-2 md:flex">
          {defaultLinks.map((link, i) => (
            <a key={i} className={buttonVariants({ variant: 'ghost', size: 'sm' })} href={link.href}
              style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, letterSpacing: '0.07em', textTransform: 'uppercase', color: 'var(--text3)' }}>
              {link.label}
            </a>
          ))}
          <a href="/docs/Ahmad_Resume_Developer_I_FirstSolar.pdf" target="_blank" rel="noopener">
            <Button variant="outline" size="sm" style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, letterSpacing: '0.06em' }}>Resume ↓</Button>
          </a>
        </div>
        <Button size="icon" variant="outline" onClick={() => setOpen(!open)} className="md:hidden">
          <MenuToggleIcon open={open} className="size-5" duration={300} />
        </Button>
      </nav>

      <div className={cn('bg-background/90 fixed top-14 right-0 bottom-0 left-0 z-50 flex flex-col overflow-hidden border-y md:hidden', open ? 'block' : 'hidden')}>
        <div
          data-slot={open ? 'open' : 'closed'}
          className={cn('data-[slot=open]:animate-in data-[slot=open]:zoom-in-95 data-[slot=closed]:animate-out data-[slot=closed]:zoom-out-95 ease-out', 'flex h-full w-full flex-col justify-between gap-y-2 p-4')}
        >
          <div className="grid gap-y-2">
            {defaultLinks.map((link) => (
              <a key={link.label} className={buttonVariants({ variant: 'ghost', className: 'justify-start' })} href={link.href} onClick={() => setOpen(false)}>
                {link.label}
              </a>
            ))}
          </div>
          <div className="flex flex-col gap-2">
            <a href="/docs/Ahmad_Resume_Developer_I_FirstSolar.pdf" target="_blank" rel="noopener">
              <Button variant="outline" className="w-full">Resume ↓</Button>
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
