"use client";
import React from "react";
import { motion } from "motion/react";

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
  return (
    <div className={props.className}>
      <motion.div
        animate={{ translateY: "-50%" }}
        transition={{
          duration: props.duration || 10,
          repeat: Infinity,
          ease: "linear",
          repeatType: "loop",
        }}
        className="flex flex-col gap-4 pb-4"
        style={{ background: 'transparent' }}
      >
        {[...new Array(2).fill(0).map((_, index) => (
          <React.Fragment key={index}>
            {props.testimonials.map(({ text, image, name, role }, i) => (
              <div
                key={i}
                style={{
                  padding: '20px 24px',
                  borderRadius: 16,
                  border: '1px solid rgba(242,237,216,0.07)',
                  background: '#131520',
                  maxWidth: 280,
                  width: '100%',
                }}
              >
                <p style={{ fontSize: 13, lineHeight: 1.75, color: '#B8B4A4' }}>{text}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 16 }}>
                  <img width={36} height={36} src={image} alt={name} style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover', border: '1px solid rgba(242,237,216,0.08)' }} />
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#F2EDD8', lineHeight: 1.3 }}>{name}</div>
                    <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: '#6E6B60', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: 2 }}>{role}</div>
                  </div>
                </div>
              </div>
            ))}
          </React.Fragment>
        ))]}
      </motion.div>
    </div>
  );
};
