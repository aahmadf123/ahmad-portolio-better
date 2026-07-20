'use client';

import React, { useState } from 'react';
import { Mail, MapPin, Clock } from 'lucide-react';
import { Section, GithubIcon, LinkedinIcon, MONO, SERIF, SANS, FG3 } from '@/components/shared/section-helpers';
import { site } from '@/lib/data/site';
import { sectionById } from '@/lib/data/sections';

export function ContactSection() {
  const [emailHovered, setEmailHovered] = useState(false);
  const def = sectionById('contact')!;
  const channels = [
    { label: 'Email', value: site.email, href: `mailto:${site.email}`, color: '#f59e0b', Icon: Mail },
    { label: 'LinkedIn', value: '/in/ahmadfirasazfar', href: site.socials.linkedin, color: '#5b8af5', Icon: LinkedinIcon },
    { label: 'GitHub', value: '/aahmadf123', href: site.socials.github, color: '#2dd4bf', Icon: GithubIcon },
    { label: 'Location', value: site.location, href: null, color: '#a78bfa', Icon: MapPin },
    { label: 'Response', value: 'Within 24 hours', href: null, color: '#22c55e', Icon: Clock },
  ];
  return (
    <Section id="contact" style={{ background: 'rgba(9,10,15,0.97)' }}>
      <style>{`
        @keyframes contact-blink { 0%,100%{opacity:.55}50%{opacity:0} }
        @keyframes contact-pulse { 0%,100%{box-shadow:0 0 0 0 rgba(34,197,94,0.55)}60%{box-shadow:0 0 0 5px rgba(34,197,94,0)} }
        .contact-email-wrap:hover .contact-email-text { color: #38BDF8; }
        .contact-email-wrap:hover { border-color: rgba(56,189,248,0.65); background: rgba(56,189,248,0.10); }
        .contact-channel-row:hover { background: rgba(244,244,242,0.03); }
        .contact-resume-link:hover { color: var(--text2); border-bottom-color: var(--bd2); }
        @media (max-width: 767px) {
          .contact-layout-grid { grid-template-columns: 1fr !important; gap: 32px !important; }
        }
      `}</style>

      {/* Ghost watermark */}
      <div aria-hidden style={{ position: 'absolute', top: -28, right: -4, fontFamily: SERIF, fontSize: 'clamp(110px,17vw,210px)', fontWeight: 400, color: def.color, opacity: 0.04, lineHeight: 1, userSelect: 'none', pointerEvents: 'none', letterSpacing: '-0.03em', zIndex: 0 }}>{def.n}</div>

      {/* Section header row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, marginBottom: 56, position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ display: 'inline-block', width: 22, height: 1.5, background: def.color, opacity: 0.6, flexShrink: 0 }} />
          <span style={{ fontFamily: MONO, fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: def.color }}>Contact</span>
          <span style={{ fontFamily: MONO, fontSize: 10, color: FG3, letterSpacing: '0.06em' }}>— Let&apos;s talk about building something real.</span>
        </div>
        {/* Live status badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 14px', border: '1px solid rgba(34,197,94,0.22)', borderRadius: 4, background: 'rgba(34,197,94,0.05)', flexShrink: 0 }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e', display: 'inline-block', animation: 'contact-pulse 2.4s ease-in-out infinite' }} />
          <span style={{ fontFamily: MONO, fontSize: 9, color: '#22c55e', letterSpacing: '0.12em', textTransform: 'uppercase' }}>{site.availability.label}</span>
        </div>
      </div>

      <div style={{ position: 'relative', zIndex: 1 }}>
        <div className="contact-layout-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: 52, alignItems: 'start' }}>

          {/* ── Left ── */}
          <div>
            <h2 style={{ fontFamily: SERIF, fontSize: 'clamp(28px,4vw,52px)', fontWeight: 400, color: 'var(--foreground)', lineHeight: 1.12, marginBottom: 20, maxWidth: 560, paddingBottom: '0.05em' }}>
              Open to roles in AI&nbsp;research, ML&nbsp;engineering, and data&nbsp;science.
            </h2>
            <p style={{ fontFamily: SANS, fontSize: 15, color: FG3, lineHeight: 1.8, marginBottom: 44, maxWidth: 440 }}>
              Whether it&apos;s a full-time opportunity, research collaboration, or just a conversation about autonomous systems — I&apos;m listening.
            </p>

            {/* Email as terminal send-signal element */}
            <a
              href={`mailto:${site.email}`}
              className="contact-email-wrap"
              onMouseEnter={() => setEmailHovered(true)}
              onMouseLeave={() => setEmailHovered(false)}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 18,
                padding: '18px 28px',
                background: emailHovered ? 'rgba(56,189,248,0.10)' : 'rgba(56,189,248,0.06)',
                border: `1px solid ${emailHovered ? 'rgba(56,189,248,0.65)' : 'rgba(56,189,248,0.32)'}`,
                borderRadius: 6, textDecoration: 'none',
                marginBottom: 20, position: 'relative', overflow: 'hidden',
                transition: 'background 0.18s, border-color 0.18s',
              }}
            >
              <span aria-hidden style={{ position: 'absolute', top: 0, left: 0, width: 20, height: 20, borderTop: '2px solid rgba(56,189,248,0.55)', borderLeft: '2px solid rgba(56,189,248,0.55)' }} />
              <span aria-hidden style={{ position: 'absolute', bottom: 0, right: 0, width: 20, height: 20, borderBottom: '2px solid rgba(56,189,248,0.55)', borderRight: '2px solid rgba(56,189,248,0.55)' }} />
              <span style={{ fontFamily: MONO, fontSize: 9, color: 'var(--sky)', opacity: 0.5, textTransform: 'uppercase', letterSpacing: '0.1em', flexShrink: 0 }}>SEND →</span>
              <span className="contact-email-text" style={{ fontFamily: MONO, fontSize: 'clamp(13px,1.5vw,17px)', color: 'var(--sky)', letterSpacing: '0.04em', transition: 'color 0.18s' }}>
                {site.email}
              </span>
              <span aria-hidden style={{ fontFamily: MONO, fontSize: 15, color: 'var(--sky)', opacity: 0.5, animation: 'contact-blink 1s step-end infinite' }}>▮</span>
            </a>

            <div>
              <a
                href={site.resumeUrl}
                target="_blank" rel="noopener"
                className="contact-resume-link"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: MONO, fontSize: 10, color: FG3, letterSpacing: '0.08em', textTransform: 'uppercase', textDecoration: 'none', paddingBottom: 4, borderBottom: '1px solid var(--bd)', transition: 'color 0.15s, border-color 0.15s' }}>
                Resume PDF ↓
              </a>
              <a
                href={site.degreeUrl}
                target="_blank" rel="noopener"
                className="contact-resume-link"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: MONO, fontSize: 10, color: FG3, letterSpacing: '0.08em', textTransform: 'uppercase', textDecoration: 'none', paddingBottom: 4, borderBottom: '1px solid var(--bd)', transition: 'color 0.15s, border-color 0.15s', marginLeft: 16 }}>
                Degree PDF ↓
              </a>
            </div>

            {/* Interest tags */}
            <div style={{ marginTop: 52, paddingTop: 24, borderTop: '1px solid var(--bd)', display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
              <span style={{ fontFamily: MONO, fontSize: 9, color: FG3, letterSpacing: '0.1em', textTransform: 'uppercase', marginRight: 4 }}>Open to</span>
              {site.availability.interests.map(t => (
                <span key={t} style={{ fontFamily: MONO, fontSize: 9, padding: '3px 8px', border: '1px solid var(--bd)', borderRadius: 3, color: FG3, letterSpacing: '0.04em', textTransform: 'uppercase', wordBreak: 'break-word' }}>{t}</span>
              ))}
            </div>
          </div>

          {/* ── Right: channel terminal ── */}
          <div style={{ border: '1px solid var(--bd)', borderRadius: 10, overflow: 'hidden', background: 'rgba(244,244,242,0.015)' }}>
            <div style={{ padding: '14px 22px', background: 'rgba(244,244,242,0.03)', borderBottom: '1px solid var(--bd)', display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'rgba(239,68,68,0.45)', display: 'inline-block' }} />
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'rgba(245,158,11,0.45)', display: 'inline-block' }} />
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'rgba(34,197,94,0.45)', display: 'inline-block' }} />
              <span style={{ fontFamily: MONO, fontSize: 10, color: FG3, letterSpacing: '0.12em', textTransform: 'uppercase', marginLeft: 8 }}>Channels</span>
            </div>
            {channels.map((c, i) => (
              <div
                key={c.label}
                className="contact-channel-row"
                style={{ padding: '20px 22px', borderBottom: i < 4 ? '1px solid var(--bd)' : 'none', transition: 'background 0.15s', display: 'flex', alignItems: 'center', gap: 16 }}
              >
                <div style={{ width: 38, height: 38, borderRadius: 8, background: `${c.color}10`, border: `1px solid ${c.color}28`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <c.Icon size={16} color={c.color} strokeWidth={1.5} />
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontFamily: MONO, fontSize: 9, color: FG3, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 5 }}>{c.label}</div>
                  {c.href ? (
                    <a href={c.href} target={c.href.startsWith('http') ? '_blank' : undefined} rel={c.href.startsWith('http') ? 'noopener' : undefined} style={{ fontFamily: MONO, fontSize: 13, color: c.color, textDecoration: 'none', wordBreak: 'break-all', letterSpacing: '0.02em' }}>{c.value}</a>
                  ) : (
                    <span style={{ fontFamily: MONO, fontSize: 13, color: c.color }}>{c.value}</span>
                  )}
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </Section>
  );
}
