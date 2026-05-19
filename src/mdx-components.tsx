import type { MDXComponents } from 'mdx/types';
import React from 'react';

const SERIF = "var(--font-chakra), 'Chakra Petch', sans-serif";
const MONO  = "var(--font-chakra), 'Chakra Petch', monospace";

export function useMDXComponents(): MDXComponents {
  return {
    h1: ({ children }) => (
      <h1 style={{
        fontFamily: SERIF, fontWeight: 400,
        fontSize: 'clamp(28px, 4vw, 44px)', lineHeight: 1.1,
        letterSpacing: '-0.025em', color: '#F2EDD8',
        marginTop: '2.5rem', marginBottom: '1rem', paddingBottom: '0.05em',
      }}>
        {children}
      </h1>
    ),

    h2: ({ children }) => (
      <h2 style={{
        fontFamily: SERIF, fontWeight: 400,
        fontSize: 'clamp(20px, 3vw, 28px)', lineHeight: 1.2,
        letterSpacing: '-0.015em', color: '#F0B429',
        marginTop: '3rem', marginBottom: '0.75rem',
        paddingTop: '0.25rem',
        borderTop: '1px solid rgba(240,180,41,0.15)',
      }}>
        {children}
      </h2>
    ),

    h3: ({ children }) => (
      <h3 style={{
        fontFamily: SERIF, fontWeight: 400,
        fontSize: 'clamp(16px, 2.5vw, 21px)', lineHeight: 1.3,
        letterSpacing: '-0.01em', color: '#F2EDD8',
        marginTop: '2rem', marginBottom: '0.5rem',
      }}>
        {children}
      </h3>
    ),

    h4: ({ children }) => (
      <h4 style={{
        fontFamily: MONO, fontWeight: 400,
        fontSize: 12, letterSpacing: '0.1em', textTransform: 'uppercase',
        color: '#F0B429', opacity: 0.8,
        marginTop: '1.5rem', marginBottom: '0.5rem',
      }}>
        {children}
      </h4>
    ),

    p: ({ children }) => (
      <p style={{
        fontFamily: SERIF, fontSize: 17, lineHeight: 1.85,
        color: '#C8C4B4', marginBottom: '1.25rem',
      }}>
        {children}
      </p>
    ),

    ul: ({ children }) => (
      <ul style={{
        margin: '0.75rem 0 1.25rem 0', paddingLeft: 0,
        listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10,
      }}>
        {children}
      </ul>
    ),

    ol: ({ children }) => (
      <ol style={{
        margin: '0.75rem 0 1.25rem 0', paddingLeft: 0,
        listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10,
        counterReset: 'list-counter',
      }}>
        {children}
      </ol>
    ),

    li: ({ children }) => (
      <li style={{
        fontFamily: SERIF, fontSize: 16, lineHeight: 1.7, color: '#C8C4B4',
        paddingLeft: 24, position: 'relative',
      }}>
        <span style={{
          position: 'absolute', left: 0, top: '0.6em',
          width: 5, height: 5, borderRadius: '50%',
          background: '#F0B429', opacity: 0.6, flexShrink: 0,
          transform: 'translateY(-50%)',
        }} />
        {children}
      </li>
    ),

    blockquote: ({ children }) => (
      <blockquote style={{
        margin: '2rem 0',
        padding: '1.25rem 1.5rem',
        borderLeft: '3px solid #F0B429',
        background: 'rgba(240,180,41,0.04)',
        borderRadius: '0 8px 8px 0',
      }}>
        <div style={{
          fontFamily: SERIF, fontSize: 18, lineHeight: 1.7,
          color: '#F2EDD8', fontStyle: 'italic',
        }}>
          {children}
        </div>
      </blockquote>
    ),

    code: ({ children }) => (
      <code style={{
        fontFamily: MONO, fontSize: 13,
        background: 'rgba(242,237,216,0.07)',
        border: '1px solid rgba(242,237,216,0.12)',
        borderRadius: 4, padding: '1px 6px',
        color: '#F0B429',
      }}>
        {children}
      </code>
    ),

    pre: ({ children }) => (
      <pre style={{
        fontFamily: MONO, fontSize: 13, lineHeight: 1.6,
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(242,237,216,0.08)',
        borderRadius: 8, padding: '1.25rem 1.5rem',
        overflowX: 'auto', margin: '1.5rem 0',
        color: '#C8C4B4',
      }}>
        {children}
      </pre>
    ),

    a: ({ href, children }) => (
      <a
        href={href}
        target={href?.startsWith('http') ? '_blank' : undefined}
        rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
        style={{
          color: '#F0B429', textDecoration: 'none',
          borderBottom: '1px solid rgba(240,180,41,0.4)',
          transition: 'border-color 0.2s, color 0.2s',
        }}
      >
        {children}
      </a>
    ),

    hr: () => (
      <hr style={{
        border: 'none',
        borderTop: '1px solid rgba(242,237,216,0.08)',
        margin: '3rem 0',
      }} />
    ),

    strong: ({ children }) => (
      <strong style={{ color: '#F2EDD8', fontWeight: 600 }}>{children}</strong>
    ),

    em: ({ children }) => (
      <em style={{ color: '#D4D0C0', fontStyle: 'italic' }}>{children}</em>
    ),

    table: ({ children }) => (
      <div style={{ overflowX: 'auto', margin: '2rem 0' }}>
        <table style={{
          width: '100%', borderCollapse: 'collapse',
          fontFamily: SERIF, fontSize: 15,
        }}>
          {children}
        </table>
      </div>
    ),

    thead: ({ children }) => (
      <thead style={{ borderBottom: '1px solid rgba(240,180,41,0.3)' }}>
        {children}
      </thead>
    ),

    th: ({ children }) => (
      <th style={{
        fontFamily: MONO, fontSize: 10, letterSpacing: '0.1em',
        textTransform: 'uppercase', color: '#F0B429',
        padding: '8px 16px 8px 0', textAlign: 'left', fontWeight: 400,
      }}>
        {children}
      </th>
    ),

    td: ({ children }) => (
      <td style={{
        padding: '10px 16px 10px 0',
        color: '#C8C4B4', lineHeight: 1.6,
        borderBottom: '1px solid rgba(242,237,216,0.06)',
        verticalAlign: 'top',
      }}>
        {children}
      </td>
    ),

    tr: ({ children }) => (
      <tr style={{ transition: 'background 0.15s' }}>{children}</tr>
    ),
  };
}
