'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { m, AnimatePresence } from 'framer-motion';

const MONO  = "var(--font-chakra), 'Chakra Petch', monospace";
const SERIF = "var(--font-chakra), 'Chakra Petch', sans-serif";
const ACCENT = 'var(--primary)';

const DOCS = [
  {
    id: 'resume',
    label: 'Resume',
    description: 'One-page engineering summary, built for a 30-second skim and strong enough for deep reading.',
    file: '/docs/Ahmad_Resume_Developer_I_FirstSolar.pdf',
  },
  {
    id: 'industry-cv',
    label: 'Industry CV',
    description: 'Full credentials: work history, technical stack, projects, and impact metrics.',
    file: '/docs/Ahmad_CV_Developer_I_FirstSolar.pdf',
  },
  {
    id: 'diploma',
    label: 'Degree',
    description: 'Official digital degree certificate. Certificate appears on page 1; verification metadata on page 2.',
    file: '/docs/CeD.26D8-NDTX-AGEW.pdf',
  },
  {
    id: 'oci-foundations',
    label: 'Oracle OCI Cert',
    description: 'Oracle Cloud Infrastructure Foundations Associate - official eCertificate. Verifiable via Oracle CertView.',
    file: '/docs/Oracle_Foundation_eCertificate.pdf',
  },
] as const;

type DocItem = (typeof DOCS)[number];

export default function DocsPage() {
  const [selected, setSelected] = useState<DocItem>(DOCS[0]);

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--background)',
        color: 'var(--foreground)',
        fontFamily: MONO,
        backgroundImage: 'radial-gradient(circle, rgba(45,212,200,0.04) 1px, transparent 1px)',
        backgroundSize: '28px 48px',
        backgroundPosition: '14px 24px',
      }}
    >
      <div
        style={{
          maxWidth: 1280,
          margin: '0 auto',
          padding: 'clamp(48px, 6vw, 80px) clamp(20px, 4vw, 52px)',
        }}
      >
        {/* Back navigation */}
        <Link
          href="/"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            fontFamily: MONO,
            fontSize: 10,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: 'var(--text2)',
            textDecoration: 'none',
            marginBottom: 56,
            transition: 'color 0.2s ease',
          }}
          onMouseEnter={e => (e.currentTarget.style.color = ACCENT)}
          onMouseLeave={e => (e.currentTarget.style.color = 'var(--text2)')}
        >
          <span style={{ fontSize: 13 }}>←</span>&nbsp;Portfolio
        </Link>

        {/* Section header */}
        <div style={{ marginBottom: 40, position: 'relative' }}>
          <div
            aria-hidden
            style={{
              position: 'absolute',
              top: -20,
              left: -4,
              fontFamily: SERIF,
              fontSize: 'clamp(72px, 11vw, 112px)',
              fontWeight: 400,
              color: 'rgba(45,212,200,0.04)',
              lineHeight: 1,
              userSelect: 'none',
              pointerEvents: 'none',
            }}
          >
            Docs
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14, position: 'relative' }}>
            <span
              style={{
                display: 'inline-block',
                width: 22,
                height: 1.5,
                background: ACCENT,
                opacity: 0.5,
                flexShrink: 0,
              }}
            />
            <span
              style={{
                fontFamily: MONO,
                fontSize: 10,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: ACCENT,
              }}
            >
              Documents
            </span>
          </div>

          <h1
            style={{
              fontFamily: SERIF,
              fontSize: 'var(--text-2xl)',
              fontWeight: 400,
              letterSpacing: '-0.01em',
              color: 'var(--foreground)',
              margin: 0,
              position: 'relative',
            }}
          >
            Ahmad&apos;s Documents
          </h1>
          <p
            style={{
              fontFamily: MONO,
              fontSize: 13,
              color: 'var(--text2)',
              marginTop: 10,
              letterSpacing: '0.02em',
              lineHeight: 1.65,
            }}
          >
            Select a document to preview or download.
          </p>
        </div>

        {/* Document type tabs */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
          {DOCS.map((doc) => {
            const isActive = selected.id === doc.id;
            return (
              <button
                key={doc.id}
                onClick={() => setSelected(doc as DocItem)}
                style={{
                  fontFamily: MONO,
                  fontSize: 10,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  padding: '9px 20px',
                  border: `1px solid ${isActive ? 'color-mix(in srgb, var(--primary) 50%, transparent)' : 'rgba(244,244,242,0.1)'}`,
                  borderRadius: 4,
                  background: isActive ? 'color-mix(in srgb, var(--primary) 8%, transparent)' : 'rgba(242,237,216,0.02)',
                  color: isActive ? ACCENT : 'var(--text2)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                {doc.label}
              </button>
            );
          })}
        </div>

        {/* Selected doc description */}
        <AnimatePresence mode="wait">
          <m.p
            key={selected.id + '-desc'}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.18 }}
            style={{
              fontFamily: MONO,
              fontSize: 12,
              color: 'var(--text2)',
              letterSpacing: '0.03em',
              marginBottom: 20,
              lineHeight: 1.6,
            }}
          >
            {selected.description}
          </m.p>
        </AnimatePresence>

        {/* PDF viewer container */}
        <div
          style={{
            border: '1px solid rgba(244,244,242,0.08)',
            borderRadius: 8,
            overflow: 'hidden',
            background: 'rgba(242,237,216,0.015)',
            boxShadow: '0 4px 48px rgba(0,0,0,0.5)',
          }}
        >
          {/* Top bar */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '10px 18px',
              borderBottom: '1px solid rgba(244,244,242,0.06)',
              background: 'rgba(242,237,216,0.025)',
              gap: 12,
              flexWrap: 'wrap',
            }}
          >
            <span
              style={{
                fontFamily: MONO,
                fontSize: 10,
                color: 'var(--text3)',
                letterSpacing: '0.05em',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                minWidth: 0,
              }}
            >
              {selected.file ? selected.file.split('/').pop() : '-'}
            </span>

            <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
              {selected.file && (
                <>
                  <a
                    href={selected.file}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      fontFamily: MONO,
                      fontSize: 9,
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      color: 'var(--text2)',
                      padding: '5px 13px',
                      border: '1px solid rgba(244,244,242,0.12)',
                      borderRadius: 4,
                      background: 'transparent',
                      textDecoration: 'none',
                      transition: 'all 0.2s ease',
                      whiteSpace: 'nowrap',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.background = 'rgba(244,244,242,0.06)';
                      e.currentTarget.style.color = 'var(--foreground)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.color = 'var(--text2)';
                    }}
                  >
                    Open ↗
                  </a>
                  <a
                    href={selected.file}
                    download
                    style={{
                      fontFamily: MONO,
                      fontSize: 9,
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      color: 'var(--foreground)',
                      padding: '5px 14px',
                      border: '1px solid color-mix(in srgb, var(--primary) 40%, transparent)',
                      borderRadius: 4,
                      background: 'color-mix(in srgb, var(--primary) 8%, transparent)',
                      textDecoration: 'none',
                      transition: 'all 0.2s ease',
                      whiteSpace: 'nowrap',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.background = 'rgba(45,212,200,0.18)';
                      e.currentTarget.style.borderColor = 'rgba(45,212,200,0.65)';
                      e.currentTarget.style.color = ACCENT;
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background = 'color-mix(in srgb, var(--primary) 8%, transparent)';
                      e.currentTarget.style.borderColor = 'color-mix(in srgb, var(--primary) 40%, transparent)';
                      e.currentTarget.style.color = 'var(--foreground)';
                    }}
                  >
                    Download ↓
                  </a>
                </>
              )}
            </div>
          </div>

          {/* Content area */}
          <AnimatePresence mode="wait">
            {selected.file && (
              <m.div
                key={selected.id + '-preview'}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.22 }}
              >
                <iframe
                  src={`${selected.file}#toolbar=0&navpanes=0&scrollbar=1`}
                  style={{
                    width: '100%',
                    height: 'clamp(520px, 82vh, 920px)',
                    border: 'none',
                    display: 'block',
                    background: 'var(--surface-2)',
                  }}
                  title={`${selected.label} - Ahmad Firas Azfar`}
                />
                {/* Mobile fallback - iframe PDFs don't render on iOS Safari */}
                <div
                  style={{
                    display: 'none',
                    padding: '24px 20px',
                    borderTop: '1px solid rgba(244,244,242,0.06)',
                    textAlign: 'center',
                  }}
                  className="pdf-mobile-fallback"
                >
                  <p
                    style={{
                      fontFamily: MONO,
                      fontSize: 11,
                      color: 'var(--text2)',
                      letterSpacing: '0.05em',
                      marginBottom: 12,
                    }}
                  >
                    Preview not available on this device
                  </p>
                  <a
                    href={selected.file}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      fontFamily: MONO,
                      fontSize: 10,
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      color: ACCENT,
                      textDecoration: 'none',
                      border: `1px solid color-mix(in srgb, var(--primary) 35%, transparent)`,
                      borderRadius: 4,
                      padding: '8px 16px',
                    }}
                  >
                    Open PDF ↗
                  </a>
                </div>
              </m.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}


