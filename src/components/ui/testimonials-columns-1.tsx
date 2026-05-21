"use client";
import React from "react";
import { motion, useReducedMotion } from "motion/react";

const T_PALETTE = ['#F0B429','#4B7BF5','#2DD4C8','#F07832','#A78BFA','#F472B6','#0EA5E9','#22C55E','#EF4444'];
function pickAccent(text: string) {
  let h = 0;
  for (let i = 0; i < text.length; i++) h = (h * 31 + text.charCodeAt(i)) >>> 0;
  return T_PALETTE[h % T_PALETTE.length];
}
function hexToRgb(hex: string) {
  const m = hex.replace('#', '');
  return [parseInt(m.slice(0, 2), 16), parseInt(m.slice(2, 4), 16), parseInt(m.slice(4, 6), 16)];
}

const COLUMN_STYLES = `
  .tc-card {
    padding: 22px 24px;
    max-width: 304px;
    box-sizing: border-box;
  }
  .tc-card-text {
    font-size: 14px;
    line-height: 1.7;
    overflow-wrap: break-word;
    word-break: break-word;
    display: -webkit-box;
    -webkit-line-clamp: 8;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  .tc-card-meta {
    min-width: 0;
    overflow: hidden;
  }
  .tc-card-name {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .tc-card-role {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  @media (max-width: 768px) {
    .tc-card {
      max-width: 100%;
      padding: 18px 20px;
    }
  }
  @media (max-width: 480px) {
    .tc-card {
      padding: 16px 18px;
    }
    .tc-card-text {
      font-size: 15px;
      line-height: 1.65;
    }
  }
`;

export type Testimonial = {
  text: string;
  image: string;
  name: string;
  role: string;
};

export const TestimonialsColumn = (props: {
  className?: string;
  testimonials: Testimonial[];
  duration?: number;
}) => {
  const prefersReduced = useReducedMotion();
  const repeatedTestimonials = React.useMemo(
    () => Array.from({ length: 2 }, (_, index) => (
      <React.Fragment key={index}>
        {props.testimonials.map((testimonial, i) => (
          <MemoizedTestimonialCard
            key={`${index}-${i}`}
            text={testimonial.text}
            image={testimonial.image}
            name={testimonial.name}
            role={testimonial.role}
          />
        ))}
      </React.Fragment>
    )),
    [props.testimonials],
  );

  if (!props.testimonials || props.testimonials.length === 0) return null;

  return (
    <div className={props.className} style={{ position: "relative", width: "100%" }}>
      <style>{COLUMN_STYLES}</style>
      <motion.div
        animate={prefersReduced ? undefined : { translateY: "-50%" }}
        transition={{
          duration: props.duration || 10,
          repeat: Infinity,
          ease: "linear",
          repeatType: "loop",
        }}
        className="flex flex-col gap-4 pb-4"
        style={{ background: "transparent", willChange: "transform", contain: "paint" }}
      >
        {repeatedTestimonials}
      </motion.div>
    </div>
  );
};

const MemoizedTestimonialCard = React.memo(function TestimonialCard({ text, image, name, role }: Testimonial) {
  const prefersReduced = useReducedMotion();
  const [imgError, setImgError] = React.useState(false);
  const accent = pickAccent(name);
  const [r, g, b] = hexToRgb(accent);
  const surfaceTint = `rgba(${r},${g},${b},0.07)`;
  const borderTint = `rgba(${r},${g},${b},0.22)`;
  const initials = name.trim().split(/\s+/).slice(0, 2).map(w => w[0] ?? '').join('').toUpperCase() || '?';

  return (
    <motion.div
      className="tc-card"
      whileHover={
        prefersReduced
          ? { borderColor: borderTint, backgroundColor: surfaceTint }
          : {
              y: -2,
              borderColor: borderTint,
              backgroundColor: surfaceTint,
              transition: { duration: 0.18, ease: [0.16, 1, 0.3, 1] },
            }
      }
      role="article"
      aria-label={`Testimonial from ${name}`}
      style={{
        borderRadius: 8,
        borderWidth: 1,
        borderStyle: "solid",
        borderColor: "rgba(242,237,216,0.08)",
        borderTopColor: accent,
        backgroundColor: "rgba(19,21,32,0.96)",
        width: "100%",
        position: "relative",
        cursor: "default",
      }}
    >
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 2,
          background: accent,
          opacity: 0.7,
        }}
      />

      <span
        aria-hidden="true"
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          minWidth: 24,
          height: 24,
          padding: "0 8px",
          borderRadius: 999,
          backgroundColor: `rgba(${r},${g},${b},0.09)`,
          color: accent,
          fontFamily: "var(--font-chakra), 'Chakra Petch', monospace",
          fontSize: 10,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          lineHeight: 1,
          marginBottom: 16,
          userSelect: "none",
          pointerEvents: "none",
        }}
      >
        note
      </span>

      <p className="tc-card-text" style={{ color: "var(--text2)", margin: 0, maxWidth: "65ch" }}>{text}</p>

      <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 18 }}>
        {imgError || !image ? (
          <div
            aria-hidden="true"
            style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              flexShrink: 0,
              border: `1px solid rgba(${r},${g},${b},0.3)`,
              backgroundColor: `rgba(${r},${g},${b},0.12)`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: "var(--font-chakra), 'Chakra Petch', monospace",
              fontSize: 10,
              letterSpacing: "0.06em",
              color: accent,
              userSelect: "none",
            }}
          >
            {initials}
          </div>
        ) : (
          <img
            width={36}
            height={36}
            src={image}
            alt={name}
            loading="lazy"
            decoding="async"
            onError={() => setImgError(true)}
            style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              objectFit: "cover",
              flexShrink: 0,
              border: "1px solid rgba(242,237,216,0.12)",
              backgroundColor: "rgba(242,237,216,0.03)",
            }}
          />
        )}
        <div className="tc-card-meta">
          <div className="tc-card-name" style={{ fontSize: 13, fontWeight: 400, color: "var(--foreground)", lineHeight: 1.3 }}>{name || '\u2014'}</div>
          <div
            className="tc-card-role"
            title={role}
            style={{
              fontFamily: "var(--font-chakra), 'Chakra Petch', monospace",
              fontSize: 10,
              color: "var(--text3)",
              textTransform: "uppercase",
              letterSpacing: "0.12em",
              marginTop: 4,
            }}
          >
            {role}
          </div>
        </div>
      </div>
    </motion.div>
  );
});
