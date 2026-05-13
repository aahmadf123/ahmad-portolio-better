"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";

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
  const id = React.useId();

  React.useEffect(() => { setMounted(true); }, []);

  React.useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setActive(false);
    };
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (cardRef.current && !cardRef.current.contains(event.target as Node)) setActive(false);
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

  const descClass = "text-[#6E6B60] text-xs uppercase tracking-wider";
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
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)', width: '100%', height: '100%', zIndex: 9998 }}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {active && (
          <div style={{ position: 'fixed', inset: 0, display: 'grid', placeItems: 'center', zIndex: 9999, padding: '1rem', overflowY: 'auto' }}>
            <motion.div
              layoutId={`card-${title}-${id}`}
              ref={cardRef}
              className={cn(
                "w-full max-w-[850px] my-auto max-h-[min(900px,calc(100vh-6rem))] flex flex-col overflow-hidden rounded-2xl bg-[#131520] border border-white/[0.07] shadow-2xl relative",
                classNameExpanded,
              )}
              {...props}
            >
              <motion.div layoutId={`image-${title}-${id}`} className="shrink-0">
                <img src={src} alt={title} className="w-full h-64 sm:h-72 object-cover object-center" />
              </motion.div>
              <div className="flex justify-between items-start p-6 sm:p-8 pb-4 shrink-0 gap-4">
                <div className="min-w-0">
                  <motion.p layoutId={`description-${description}-${id}`} className={descClass}>{description}</motion.p>
                  <motion.h3
                    layoutId={`title-${title}-${id}`}
                    className="text-[#F2EDD8] text-2xl sm:text-3xl mt-2 leading-tight"
                    style={{ ...titleStyle, paddingBottom: '0.08em' }}
                  >{title}</motion.h3>
                </div>
                <motion.button
                  aria-label="Close card"
                  layoutId={`button-${title}-${id}`}
                  className="h-10 w-10 shrink-0 flex items-center justify-center rounded-full bg-[#1A1D2C] text-[#B8B4A4] hover:text-[#F2EDD8] border border-white/10 hover:border-white/20 transition-colors duration-300 focus:outline-none"
                  onClick={() => setActive(false)}
                >
                  <motion.div animate={{ rotate: active ? 45 : 0 }} transition={{ duration: 0.4 }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14" /><path d="M12 5v14" />
                    </svg>
                  </motion.div>
                </motion.button>
              </div>
              <div className="px-6 sm:px-8 pb-8 overflow-y-auto flex-1 [scrollbar-width:thin]">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ delay: 0.1 }} className="text-[#B8B4A4] text-sm flex flex-col items-start gap-4">
                  {children}
                </motion.div>
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
        aria-label={`${title} — click to expand`}
        layoutId={`card-${title}-${id}`}
        onClick={() => setActive(true)}
        style={{
          background: 'rgba(242,237,216,0.025)',
          borderTop: `2px solid ${accentColor}`,
          borderRight: `1px solid rgba(242,237,216,0.08)`,
          borderBottom: `1px solid rgba(242,237,216,0.08)`,
          borderLeft: `1px solid rgba(242,237,216,0.08)`,
          borderRadius: 10,
          overflow: 'hidden',
          cursor: 'pointer',
          transition: 'border-color 0.25s, background 0.25s',
          width: '100%',
        }}
        onMouseEnter={e => {
          const el = e.currentTarget as HTMLElement;
          el.style.background = `${accentColor}12`;
          el.style.borderRight = `1px solid ${accentColor}44`;
          el.style.borderBottom = `1px solid ${accentColor}44`;
          el.style.borderLeft = `1px solid ${accentColor}44`;
        }}
        onMouseLeave={e => {
          const el = e.currentTarget as HTMLElement;
          el.style.background = 'rgba(242,237,216,0.025)';
          el.style.borderRight = '1px solid rgba(242,237,216,0.08)';
          el.style.borderBottom = '1px solid rgba(242,237,216,0.08)';
          el.style.borderLeft = '1px solid rgba(242,237,216,0.08)';
        }}
        className={cn(className)}
      >
        {/* Image */}
        <motion.div layoutId={`image-${title}-${id}`}>
          {thumbnailAspect ? (
            <img src={src} alt={title} style={{ width: '100%', aspectRatio: thumbnailAspect, objectFit: 'cover', objectPosition: 'center', display: 'block' }} />
          ) : (
            <img src={src} alt={title} className="w-64 h-48 object-cover object-center" />
          )}
        </motion.div>

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
              layoutId={`button-${title}-${id}`}
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
              {thumbnailTags.map(tag => (
                <span key={tag} style={{
                  fontFamily: "var(--font-mono), 'JetBrains Mono', monospace",
                  fontSize: 10,
                  padding: '3px 7px',
                  background: `${accentColor}12`,
                  border: `1px solid ${accentColor}30`,
                  borderRadius: 3,
                  color: accentColor,
                  letterSpacing: '0.02em',
                }}>{tag}</span>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </>
  );
}
