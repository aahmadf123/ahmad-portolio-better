'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const MONO  = "var(--font-chakra), 'Chakra Petch', monospace";
const SERIF = "var(--font-chakra), 'Chakra Petch', sans-serif";
const ACCENT = '#2DD4C8';

const DOCS = [
  {
    id: 'resume',
    label: 'Resume',
    description: 'One-page engineering summary — built for a 30-second skim, survives deep reading.',
    file: '/docs/Ahmad_Resume_Developer_I_FirstSolar.pdf',
    available: true,
  },
  {
    id: 'industry-cv',
    label: 'Industry CV',
    description: 'Full credentials: work history, technical stack, projects, and impact metrics.',
    file: '/docs/Ahmad_CV_Developer_I_FirstSolar.pdf',
    available: true,
  },
  {
    id: 'diploma',
    label: 'Degree',
    description: 'Official digital degree certificate. Certificate appears on page 1; verification metadata on page 2.',
    file: '/docs/CeD.26D8-NDTX-AGEW.pdf',
    available: true,
  },
  {
    id: 'academic-cv',
    label: 'Academic CV',
    description: 'Research history, publications, conference contributions, and affiliations.',
    file: null,
    available: false,
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
        <a
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
        </a>

        {/* Section header */}
        <div style={{ marginBottom: 40, position: 'relative' }}>
          <div
            aria-hidden
            style={{
              position: 'absolute',
              top: -20,
              left: -4,
              fontFamily: SERIF,
              fontSize: 'clamp(72px, 11vw, 120px)',
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
              fontSize: 'clamp(28px, 4vw, 42px)',
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
                onClick={() => doc.available && setSelected(doc as DocItem)}
                disabled={!doc.available}
                style={{
                  fontFamily: MONO,
                  fontSize: 10,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  padding: '9px 20px',
                  border: `1px solid ${isActive ? 'rgba(45,212,200,0.5)' : 'rgba(242,237,216,0.1)'}`,
                  borderRadius: 4,
                  background: isActive ? 'rgba(45,212,200,0.08)' : 'rgba(242,237,216,0.02)',
                  color: !doc.available
                    ? 'rgba(184,180,164,0.3)'
                    : isActive
                    ? ACCENT
                    : 'var(--text2)',
                  cursor: doc.available ? 'pointer' : 'not-allowed',
                  transition: 'all 0.2s ease',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                {doc.label}
                {!doc.available && (
                  <span
                    style={{
                      fontSize: 8,
                      padding: '2px 5px',
                      background: 'rgba(184,180,164,0.06)',
                      border: '1px solid rgba(184,180,164,0.12)',
                      borderRadius: 2,
                      color: 'rgba(184,180,164,0.35)',
                      letterSpacing: '0.08em',
                    }}
                  >
                    Soon
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Selected doc description */}
        <AnimatePresence mode="wait">
          <motion.p
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
          </motion.p>
        </AnimatePresence>

        {/* PDF viewer container */}
        <div
          style={{
            border: '1px solid rgba(242,237,216,0.08)',
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
              borderBottom: '1px solid rgba(242,237,216,0.06)',
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
              {selected.file ? selected.file.split('/').pop() : '—'}
            </span>

            <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
              {selected.available && selected.file && (
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
                      border: '1px solid rgba(242,237,216,0.12)',
                      borderRadius: 3,
                      background: 'transparent',
                      textDecoration: 'none',
                      transition: 'all 0.2s ease',
                      whiteSpace: 'nowrap',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.background = 'rgba(242,237,216,0.06)';
                      e.currentTarget.style.color = '#F2EDD8';
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
                      color: '#F2EDD8',
                      padding: '5px 14px',
                      border: '1px solid rgba(45,212,200,0.4)',
                      borderRadius: 3,
                      background: 'rgba(45,212,200,0.08)',
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
                      e.currentTarget.style.background = 'rgba(45,212,200,0.08)';
                      e.currentTarget.style.borderColor = 'rgba(45,212,200,0.4)';
                      e.currentTarget.style.color = '#F2EDD8';
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
            {selected.available && selected.file ? (
              <motion.div
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
                    background: '#1a1b1e',
                  }}
                  title={`${selected.label} — Ahmad Firas Azfar`}
                />
                {/* Mobile fallback — iframe PDFs don't render on iOS Safari */}
                <div
                  style={{
                    display: 'none',
                    padding: '24px 20px',
                    borderTop: '1px solid rgba(242,237,216,0.06)',
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
                      border: `1px solid rgba(45,212,200,0.35)`,
                      borderRadius: 4,
                      padding: '8px 16px',
                    }}
                  >
                    Open PDF ↗
                  </a>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="coming-soon"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.22 }}
                style={{
                  height: 'clamp(280px, 40vh, 440px)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 18,
                }}
              >
                <div
                  style={{
                    width: 44,
                    height: 44,
                    border: '1px solid rgba(45,212,200,0.15)',
                    borderRadius: 8,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'rgba(45,212,200,0.04)',
                  }}
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="rgba(45,212,200,0.35)"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="12" y1="18" x2="12" y2="12" />
                    <line x1="9" y1="15" x2="15" y2="15" />
                  </svg>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <p
                    style={{
                      fontFamily: MONO,
                      fontSize: 10,
                      letterSpacing: '0.15em',
                      textTransform: 'uppercase',
                      color: 'rgba(184,180,164,0.45)',
                      marginBottom: 8,
                    }}
                  >
                    Coming Soon
                  </p>
                  <p
                    style={{
                      fontFamily: MONO,
                      fontSize: 12,
                      color: 'rgba(184,180,164,0.3)',
                      letterSpacing: '0.03em',
                      lineHeight: 1.6,
                    }}
                  >
                    Academic CV is being prepared
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
