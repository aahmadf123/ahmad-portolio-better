"use client";

import * as React from "react";
import { createPortal, flushSync } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { resolveSkillColor } from "@/lib/skill-colors";

interface ExpandableCardProps {
  title: string;
  src: string;
  description: string;
  children?: React.ReactNode;
  className?: string;
  classNameExpanded?: string;
  /** Aspect ratio for thumbnail image, e.g. '16/7' or '4/3'. Defaults to fixed 256×192. */
  thumbnailAspect?: string;
  /** One-sentence tagline shown below the title in the grid card. */
  thumbnailSubtitle?: string;
  /** Stack chips shown at the bottom of the grid card. */
  thumbnailTags?: string[];
  /** Accent color for border, tags, and category text. */
  accentColor?: string;
  [key: string]: unknown;
}

export function ExpandableCard({
  title,
  src,
  description,
  children,
  className,
  classNameExpanded,
  thumbnailAspect,
  thumbnailSubtitle,
  thumbnailTags,
  accentColor = '#F0B429',
  ...props
}: ExpandableCardProps) {
  const [active, setActive] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);
  const cardRef = React.useRef<HTMLDivElement>(null);
  const closeButtonRef = React.useRef<HTMLButtonElement>(null);
  const id = React.useId();
  const vtId = `vt${id.replace(/:/g, '')}`;
  const bodyId = `ecmb${id.replace(/:/g, '')}`;

  // Stable ref so click-outside effect always calls the latest version
  const closeCardFn = React.useRef(() => setActive(false));
  React.useEffect(() => {
    closeCardFn.current = () => {
      if ('startViewTransition' in document) {
        try {
          const vt = (document as Document & { startViewTransition?: (cb: () => void) => { ready?: Promise<void>; finished?: Promise<void> } }).startViewTransition?.(() => { flushSync(() => setActive(false)); });
          vt?.ready?.catch(() => {});
          vt?.finished?.catch(() => {});
        }
        catch { setActive(false); }
      } else {
        setActive(false);
      }
    };
  });

  React.useEffect(() => { setMounted(true); }, []);
  React.useEffect(() => { if (active) closeButtonRef.current?.focus(); }, [active]);

  React.useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeCardFn.current();
    };
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (cardRef.current && !cardRef.current.contains(event.target as Node)) closeCardFn.current();
    };
    window.addEventListener("keydown", onKeyDown);
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);

  const handleOpen = React.useCallback(() => {
    if ('startViewTransition' in document) {
      try {
        const vt = (document as Document & { startViewTransition?: (cb: () => void) => { ready?: Promise<void>; finished?: Promise<void> } }).startViewTransition?.(() => { flushSync(() => setActive(true)); });
        vt?.ready?.catch(() => {});
        vt?.finished?.catch(() => {});
      } catch { setActive(true); }
    } else {
      setActive(true);
    }
  }, []);

  const handleModalKeyDown = (e: React.KeyboardEvent<Element>) => {
    if (e.key !== 'Tab') return;
    const focusable = cardRef.current?.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
    if (!focusable || focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey) {
      if (document.activeElement === first) { e.preventDefault(); last.focus(); }
    } else {
      if (document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  };

  const descClass = "text-[var(--text3)] text-xs uppercase tracking-wider";
  const titleStyle: React.CSSProperties = { fontFamily: "var(--font-chakra), 'Chakra Petch', sans-serif", fontWeight: 400 };

  React.useEffect(() => {
    if (active) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => { document.body.style.overflow = prev; };
    }
  }, [active]);

  const overlayContent = (
    <>
      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', width: '100%', height: '100%', zIndex: 9998 }}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {active && (
          <div style={{ position: 'fixed', inset: 0, display: 'grid', placeItems: 'center', zIndex: 9999, padding: 'clamp(12px,2vw,24px)', overflowY: 'auto' }}>
            <motion.div
              layoutId={`card-${title}-${id}`}
              ref={cardRef}
              className={cn(
                "w-full max-w-[860px] my-auto max-h-[min(920px,calc(100vh-3rem))] flex flex-col overflow-hidden rounded-2xl shadow-2xl relative",
                classNameExpanded,
              )}
              style={{ background: '#0F111A', border: '1px solid rgba(242,237,216,0.08)' }}
              {...props}
              role="dialog"
              aria-modal="true"
              aria-labelledby={`modal-title-${id}`}
              onKeyDown={handleModalKeyDown}
            >
              {/* ── Fixed header: category label + title + close ── */}
              <div
                className="shrink-0 flex justify-between items-start gap-4"
                style={{ padding: '22px 28px 18px', borderBottom: '1px solid rgba(242,237,216,0.07)', background: '#0F111A' }}
              >
                <div className="min-w-0">
                  <motion.p
                    layoutId={`description-${description}-${id}`}
                    className={descClass}
                    style={{ color: accentColor, marginBottom: 6 }}
                  >{description}</motion.p>
                  <motion.h3
                    id={`modal-title-${id}`}
                    layoutId={`title-${title}-${id}`}
                    className="text-[#F2EDD8] leading-tight"
                    style={{ ...titleStyle, fontSize: 'clamp(20px,3vw,28px)', paddingBottom: '0.06em' }}
                  >{title}</motion.h3>
                </div>
                <motion.button
                  ref={closeButtonRef}
                  aria-label="Close card"
                  layoutId={`button-${title}-${id}`}
                  className="h-9 w-9 shrink-0 flex items-center justify-center rounded-full text-[#B8B4A4] hover:text-[#F2EDD8] transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--amber)] focus-visible:ring-offset-1 focus-visible:ring-offset-[#0F111A]"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', marginTop: 2 }}
                  onClick={() => closeCardFn.current()}
                >
                  <motion.div animate={{ rotate: active ? 45 : 0 }} transition={{ duration: 0.4 }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14" /><path d="M12 5v14" />
                    </svg>
                  </motion.div>
                </motion.button>
              </div>

              {/* ── Scrollable body: image + content ── */}
              <div className="overflow-y-auto flex-1 [scrollbar-width:thin]">
                {/* Image with padding and rounded corners */}
                <div
                  style={{ padding: '20px 28px 0', background: '#0A0C13', viewTransitionName: `card-img-${vtId}` } as React.CSSProperties}
                >
                  <div style={{ width: '100%', borderRadius: 10, overflow: 'hidden', border: `1px solid ${accentColor}18`, background: '#06080E' }}>
                    <img
                      src={src}
                      alt={title}
                      style={{ width: '100%', height: 'clamp(200px,28vh,320px)', objectFit: 'contain', display: 'block', padding: '12px 0' }}
                    />
                  </div>
                </div>

                {/* Content */}
                <div className={bodyId} style={{ padding: '24px 28px 32px' }}>
                  <style>{`.${bodyId} h4:nth-of-type(6n+1){color:${accentColor}!important}.${bodyId} h4:nth-of-type(6n+2){color:#4B7BF5!important}.${bodyId} h4:nth-of-type(6n+3){color:#2DD4C8!important}.${bodyId} h4:nth-of-type(6n+4){color:#F07832!important}.${bodyId} h4:nth-of-type(6n+5){color:#A78BFA!important}.${bodyId} h4:nth-of-type(6n+6){color:#22C55E!important}`}</style>
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ delay: 0.08, duration: 0.3 }}
                    className="text-[#B8B4A4] text-sm"
                    style={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch', gap: 0, width: '100%' }}
                  >
                    {children}
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );

  return (
    <>
      {mounted && createPortal(overlayContent, document.body)}

      <motion.div
        role="button"
        tabIndex={0}
        aria-label={`${title} — click to expand`}
        layoutId={`card-${title}-${id}`}
        onClick={handleOpen}
        onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleOpen(); } }}
        style={{
          background: `color-mix(in oklch, ${accentColor} 3%, transparent)`,
          backdropFilter: 'blur(10px) saturate(1.2)',
          WebkitBackdropFilter: 'blur(10px) saturate(1.2)',
          borderTop: `2px solid ${accentColor}`,
          borderRight: `1px solid ${accentColor}28`,
          borderBottom: `1px solid ${accentColor}28`,
          borderLeft: `1px solid ${accentColor}28`,
          borderRadius: 10,
          overflow: 'hidden',
          cursor: 'pointer',
          transition: 'border-color 0.25s, background 0.25s',
          width: '100%',
          position: 'relative',
        }}
        onMouseEnter={e => {
          const el = e.currentTarget as HTMLElement;
          el.style.background = `color-mix(in oklch, ${accentColor} 7%, transparent)`;
          el.style.borderRight = `1px solid ${accentColor}60`;
          el.style.borderBottom = `1px solid ${accentColor}60`;
          el.style.borderLeft = `1px solid ${accentColor}60`;
        }}
        onMouseLeave={e => {
          const el = e.currentTarget as HTMLElement;
          el.style.background = `color-mix(in oklch, ${accentColor} 3%, transparent)`;
          el.style.borderRight = `1px solid ${accentColor}28`;
          el.style.borderBottom = `1px solid ${accentColor}28`;
          el.style.borderLeft = `1px solid ${accentColor}28`;
        }}
        className={cn('card-project', className)}
      >
        {/* Glass specular sheen */}
        <div className="card-glass-sheen" aria-hidden="true" />
        {/* Image */}
        <div style={{ width: '100%', aspectRatio: thumbnailAspect || '4/3', background: '#0B0D14', overflow: 'hidden', flexShrink: 0, viewTransitionName: `card-img-${vtId}` } as React.CSSProperties}>
          <img src={src} alt={title} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top', display: 'block' }} />
        </div>

        {/* Info bar */}
        <div style={{ padding: '14px 16px 16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8, marginBottom: 8 }}>
            <div style={{ minWidth: 0, flex: 1 }}>
              <motion.p layoutId={`description-${description}-${id}`} className={descClass} style={{ color: accentColor, marginBottom: 4 }}>{description}</motion.p>
              <motion.h3
                layoutId={`title-${title}-${id}`}
                style={{ ...titleStyle, fontSize: 18, color: '#F2EDD8', lineHeight: 1.2, paddingBottom: '0.05em' }}
              >{title}</motion.h3>
            </div>
            <motion.button
              aria-label="Open card"
              tabIndex={-1}
              layoutId={`button-${title}-${id}`}
              data-magnetic=""
              style={{ height: 28, width: 28, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', background: '#1A1D2C', color: '#B8B4A4', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer', outline: 'none' }}
            >
              <motion.div animate={{ rotate: active ? 45 : 0 }} transition={{ duration: 0.4 }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14" /><path d="M12 5v14" />
                </svg>
              </motion.div>
            </motion.button>
          </div>

          {thumbnailSubtitle && (
            <p style={{ fontSize: 13, color: '#B8B4A4', lineHeight: 1.55, marginBottom: 10 }}>{thumbnailSubtitle}</p>
          )}

          {thumbnailTags && thumbnailTags.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 6 }}>
              {thumbnailTags.map(tag => { const tc = resolveSkillColor(tag) ?? accentColor; return (
                <span key={tag} style={{
                  fontFamily: "var(--font-mono), 'JetBrains Mono', monospace",
                  fontSize: 10,
                  padding: '3px 7px',
                  background: `${tc}14`,
                  border: `1px solid ${tc}33`,
                  borderRadius: 3,
                  color: tc,
                  letterSpacing: '0.02em',
                }}>{tag}</span>
              ); })}
            </div>
          )}
        </div>
      </motion.div>
    </>
  );
}
